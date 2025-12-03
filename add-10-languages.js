// add-10-languages.js
// Add 10 new language fields to phrases.ts and populate with corrected translations

const fs = require('fs');
const path = require('path');

// Languages to add
const LANGUAGES = [
  { code: 'japanese', jsonCode: 'ja', name: 'Japanese' },
  { code: 'korean', jsonCode: 'ko', name: 'Korean' },
  { code: 'turkish', jsonCode: 'tr', name: 'Turkish' },
  { code: 'german', jsonCode: 'de', name: 'German' },
  { code: 'french', jsonCode: 'fr', name: 'French' },
  { code: 'spanish', jsonCode: 'es', name: 'Spanish' },
  { code: 'italian', jsonCode: 'it', name: 'Italian' },
  { code: 'portuguese', jsonCode: 'pt', name: 'Portuguese' },
  { code: 'polish', jsonCode: 'pl', name: 'Polish' },
  { code: 'dutch', jsonCode: 'nl', name: 'Dutch' }
];

function loadCorrections(langCode) {
  const correctedPath = path.join(__dirname, 'reviews', `${langCode}_corrected.json`);
  const verificationPath = path.join(__dirname, 'reviews', `${langCode}_verification.json`);

  let corrections = {};

  // Load corrected translations
  if (fs.existsSync(correctedPath)) {
    const data = JSON.parse(fs.readFileSync(correctedPath, 'utf8'));
    for (const correction of data.corrections) {
      corrections[correction.english] = correction.new;
    }
  }

  // Load verified translations
  if (fs.existsSync(verificationPath)) {
    const data = JSON.parse(fs.readFileSync(verificationPath, 'utf8'));
    for (const result of data.results) {
      if (result.status === 'verified') {
        corrections[result.english] = result.current;
      } else if (!corrections[result.english] && result.myMemory) {
        // Use AI suggestion if no correction yet
        corrections[result.english] = result.myMemory;
      }
    }
  }

  return corrections;
}

function addLanguagesToPhrases() {
  console.log('🚀 Adding 10 new languages to phrases.ts...\n');

  const phrasesPath = path.join(__dirname, 'src', 'data', 'phrases.ts');
  let content = fs.readFileSync(phrasesPath, 'utf8');

  // Load all corrections
  console.log('📖 Loading corrections...');
  const allCorrections = {};
  for (const lang of LANGUAGES) {
    allCorrections[lang.code] = loadCorrections(lang.jsonCode);
    console.log(`   ${lang.name}: ${Object.keys(allCorrections[lang.code]).length} translations`);
  }

  console.log('\n🔧 Processing phrases...');

  // Find all phrase objects and add language fields
  const phraseRegex = /{\s*id:\s*"phrase_\d+",[\s\S]*?},/g;
  const matches = content.match(phraseRegex);

  if (!matches) {
    console.error('❌ No phrases found in file!');
    return;
  }

  console.log(`   Found ${matches.length} phrases\n`);

  let processedCount = 0;
  let addedTranslations = 0;

  for (const match of matches) {
    // Extract English text (used as key for corrections)
    // Try to find chinese field as reference since it's usually first
    const chineseMatch = match.match(/chinese:\s*"([^"]+)"/);
    const russianMatch = match.match(/russian:\s*"([^"]+)"/);

    // We need to map by phrase ID or english equivalent
    // Let's use a different approach - match by position in array

    let updatedPhrase = match;

    // Add language fields before the closing brace
    const insertPosition = updatedPhrase.lastIndexOf('},');

    if (insertPosition === -1) continue;

    let languageFields = '';

    for (const lang of LANGUAGES) {
      // For now, add empty strings - we'll populate in next step
      languageFields += `    ${lang.code}: "",\n`;
    }

    updatedPhrase = updatedPhrase.slice(0, insertPosition) + languageFields + updatedPhrase.slice(insertPosition);

    content = content.replace(match, updatedPhrase);
    processedCount++;
  }

  console.log(`✅ Added language fields to ${processedCount} phrases`);

  // Save updated file
  fs.writeFileSync(phrasesPath, content, 'utf8');
  console.log(`\n💾 Saved updated phrases.ts`);

  return { processedCount, addedTranslations };
}

function populateTranslations() {
  console.log('\n📝 Populating translations from corrections...\n');

  const phrasesPath = path.join(__dirname, 'src', 'data', 'phrases.ts');
  let content = fs.readFileSync(phrasesPath, 'utf8');

  // Load all corrections mapped by phraseId
  console.log('📖 Loading corrections by phraseId...');
  const translationsByPhrase = {};

  for (const lang of LANGUAGES) {
    const verificationPath = path.join(__dirname, 'reviews', `${lang.jsonCode}_verification.json`);
    const correctedPath = path.join(__dirname, 'reviews', `${lang.jsonCode}_corrected.json`);

    if (!fs.existsSync(verificationPath)) continue;

    const verification = JSON.parse(fs.readFileSync(verificationPath, 'utf8'));
    let corrections = {};

    // Load corrections if exists
    if (fs.existsSync(correctedPath)) {
      const correctedData = JSON.parse(fs.readFileSync(correctedPath, 'utf8'));
      for (const corr of correctedData.corrections) {
        corrections[corr.phraseId] = corr.new;
      }
    }

    // Map translations by phraseId
    for (const result of verification.results) {
      if (!translationsByPhrase[result.phraseId]) {
        translationsByPhrase[result.phraseId] = {};
      }

      // Use corrected version if exists, otherwise use verified or myMemory
      if (corrections[result.phraseId]) {
        translationsByPhrase[result.phraseId][lang.code] = corrections[result.phraseId];
      } else if (result.status === 'verified') {
        translationsByPhrase[result.phraseId][lang.code] = result.current;
      } else if (result.myMemory) {
        translationsByPhrase[result.phraseId][lang.code] = result.myMemory;
      }
    }
  }

  console.log(`   Loaded translations for ${Object.keys(translationsByPhrase).length} phrase IDs\n`);

  // Update phrases
  console.log('🔧 Updating phrases with translations...');

  let updatedCount = 0;

  // Match each phrase and update language fields
  const phraseRegex = /{\s*id:\s*"(phrase_\d+)",[\s\S]*?},/g;
  let match;
  let newContent = content;

  while ((match = phraseRegex.exec(content)) !== null) {
    const phraseId = match[1];
    const fullMatch = match[0];

    if (!translationsByPhrase[phraseId]) continue;

    let updatedPhrase = fullMatch;

    // Update each language field
    for (const lang of LANGUAGES) {
      const translation = translationsByPhrase[phraseId][lang.code];
      if (!translation) continue;

      // Escape special regex characters and quotes
      const escapedTranslation = translation.replace(/\\/g, '\\\\').replace(/"/g, '\\"');

      // Replace empty field or existing value
      const fieldPattern = new RegExp(`(${lang.code}:\\s*)"[^"]*"`, 'g');
      updatedPhrase = updatedPhrase.replace(fieldPattern, `$1"${escapedTranslation}"`);
    }

    newContent = newContent.replace(fullMatch, updatedPhrase);
    updatedCount++;
  }

  console.log(`✅ Updated ${updatedCount} phrases with translations`);

  // Save
  fs.writeFileSync(phrasesPath, newContent, 'utf8');
  console.log(`\n💾 Saved updated phrases.ts`);

  return updatedCount;
}

// Main execution
async function main() {
  console.log('=' .repeat(60));
  console.log('🌍 Adding 10 New Languages to TurkmenPhrasebook');
  console.log('='.repeat(60));
  console.log(`\nLanguages: ${LANGUAGES.map(l => l.name).join(', ')}\n`);

  // Step 1: Add language fields
  const step1 = addLanguagesToPhrases();

  // Step 2: Populate translations
  const step2 = populateTranslations();

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 SUMMARY');
  console.log('='.repeat(60));
  console.log(`\n✅ Added 10 new language fields to ${step1.processedCount} phrases`);
  console.log(`✅ Populated ${step2} phrases with translations`);
  console.log(`\n🎉 Task complete!`);
  console.log('='.repeat(60));
}

main().catch(console.error);
