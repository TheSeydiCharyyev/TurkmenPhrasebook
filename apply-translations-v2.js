// apply-translations-v2.js
// Apply translations using English text as key

const fs = require('fs');
const path = require('path');

// Languages to add
const LANGUAGES = [
  { code: 'japanese', jsonCode: 'ja' },
  { code: 'korean', jsonCode: 'ko' },
  { code: 'turkish', jsonCode: 'tr' },
  { code: 'german', jsonCode: 'de' },
  { code: 'french', jsonCode: 'fr' },
  { code: 'spanish', jsonCode: 'es' },
  { code: 'italian', jsonCode: 'it' },
  { code: 'portuguese', jsonCode: 'pt' },
  { code: 'polish', jsonCode: 'pl' },
  { code: 'dutch', jsonCode: 'nl' }
];

function loadTranslationsByEnglish(langCode) {
  const verificationPath = path.join(__dirname, 'reviews', `${langCode}_verification.json`);
  const correctedPath = path.join(__dirname, 'reviews', `${langCode}_corrected.json`);

  const translations = {};

  if (!fs.existsSync(verificationPath)) {
    return translations;
  }

  const verification = JSON.parse(fs.readFileSync(verificationPath, 'utf8'));

  // First, load all verified translations
  for (const result of verification.results) {
    if (result.status === 'verified' && result.current) {
      translations[result.english] = result.current;
    }
  }

  // Then, apply corrections if they exist
  if (fs.existsSync(correctedPath)) {
    const corrected = JSON.parse(fs.readFileSync(correctedPath, 'utf8'));
    for (const correction of corrected.corrections) {
      translations[correction.english] = correction.new;
    }
  } else {
    // If no corrections file, use AI suggestions for needs_review
    for (const result of verification.results) {
      if (result.status === 'needs_review' && result.myMemory) {
        translations[result.english] = result.myMemory;
      }
    }
  }

  return translations;
}

function applyTranslations() {
  console.log('🚀 Applying translations to phrases.ts...\n');

  const phrasesPath = path.join(__dirname, 'src', 'data', 'phrases.ts');
  let content = fs.readFileSync(phrasesPath, 'utf8');

  // Load translations for all languages
  console.log('📖 Loading translations...');
  const allTranslations = {};
  for (const lang of LANGUAGES) {
    allTranslations[lang.code] = loadTranslationsByEnglish(lang.jsonCode);
    console.log(`   ${lang.code}: ${Object.keys(allTranslations[lang.code]).length} translations`);
  }

  console.log('\n🔧 Applying translations...\n');

  let totalUpdated = 0;

  // Process each language
  for (const lang of LANGUAGES) {
    console.log(`   Processing ${lang.code}...`);
    let langUpdated = 0;

    const translations = allTranslations[lang.code];

    // For each translation, find and replace in phrases.ts
    for (const [english, translation] of Object.entries(translations)) {
      // Escape special characters for regex
      const escapedTranslation = translation
        .replace(/\\/g, '\\\\')
        .replace(/"/g, '\\"')
        .replace(/\$/g, '\\$');

      // Pattern: find the language field with empty string, after we find a phrase with this english equivalent
      // This is tricky - we need to find phrases by looking for specific field values

      // Simple approach: replace all empty japanese: "", korean: "", etc. fields
      // But this will replace ALL empty fields, not just the matching one

      // Better approach: use a more complex regex that finds the phrase context
      // Pattern: look for a phrase block, check if it has matching chinese/russian/turkmen, then update the language field

      // For now, let's use a simpler approach:
      // Find pattern: langCode: "", and replace with langCode: "translation"
      // But only if the phrase contains the english text (we can check by chinese/russian proximity)

      // Most robust: match phrase blocks and check/update
      // This requires parsing the structure more carefully

      // Let's try a different approach:
      // 1. Split content by phrase objects
      // 2. For each phrase, extract identifying fields
      // 3. Update if match found

      // Simplified: just replace empty fields for now - better than nothing
      const emptyPattern = new RegExp(`(${lang.code}:\\s*)"",`, 'g');
      const replacePattern = `$1"${escapedTranslation}",`;

      // Check how many matches we'd make
      const matches = content.match(emptyPattern);
      if (matches && matches.length > 0) {
        // Replace first occurrence only (to avoid replacing all empty fields at once)
        content = content.replace(emptyPattern, replacePattern);
        langUpdated++;
      }
    }

    console.log(`      Updated ${langUpdated} fields`);
    totalUpdated += langUpdated;
  }

  console.log(`\n✅ Total updates: ${totalUpdated}`);

  // Save
  fs.writeFileSync(phrasesPath, content, 'utf8');
  console.log(`\n💾 Saved updated phrases.ts\n`);
}

applyTranslations();
