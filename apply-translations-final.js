// apply-translations-final.js
// More reliable approach: load phrases as JS objects, update, and write back

const fs = require('fs');
const path = require('path');

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

// Load phrases.ts as JSON (by evaluating it)
function loadPhrases() {
  const phrasesPath = path.join(__dirname, 'src', 'data', 'phrases.ts');
  const content = fs.readFileSync(phrasesPath, 'utf8');

  // Extract the array part
  const arrayMatch = content.match(/export const phrases[^=]*=\s*(\[[\s\S]*\]);/);

  if (!arrayMatch) {
    throw new Error('Could not extract phrases array');
  }

  // Evaluate the array (safe since it's our own code)
  const phrasesArray = eval(arrayMatch[1]);

  return phrasesArray;
}

// Load translations mapped by turkmen text (used as key)
function loadTranslationsByTurkmen(langCode) {
  const verificationPath = path.join(__dirname, 'reviews', `${langCode}_verification.json`);
  const correctedPath = path.join(__dirname, 'reviews', `${langCode}_corrected.json`);

  const translations = {};

  if (!fs.existsSync(verificationPath)) {
    return translations;
  }

  const verification = JSON.parse(fs.readFileSync(verificationPath, 'utf8'));

  // Map by phraseId (which seems to be turkmen or indonesian text)
  // We'll create a map by english text which is more reliable
  for (const result of verification.results) {
    if (result.english) {
      if (result.status === 'verified') {
        translations[result.english] = result.current;
      } else if (result.myMemory) {
        translations[result.english] = result.myMemory;
      }
    }
  }

  // Apply corrections
  if (fs.existsSync(correctedPath)) {
    const corrected = JSON.parse(fs.readFileSync(correctedPath, 'utf8'));
    for (const correction of corrected.corrections) {
      translations[correction.english] = correction.new;
    }
  }

  return translations;
}

// Create English to Phrase mapping
function createEnglishMapping(phrases) {
  // We need to map english text to phrases
  // But phrases.ts doesn't have english field!
  // Let's use russian field as reference and create english mapping from verification

  const mapping = {};

  // Load english from verification file (any language)
  const verificationPath = path.join(__dirname, 'reviews', 'ja_verification.json');
  if (!fs.existsSync(verificationPath)) {
    return mapping;
  }

  const verification = JSON.parse(fs.readFileSync(verificationPath, 'utf8'));

  // Create mapping: russian -> english (or chinese -> english)
  const russianToEnglish = {};
  for (const result of verification.results) {
    // We need to find what field the phraseId corresponds to
    // Let's check if phraseId matches any phrase field
  }

  // Alternative: map by index
  // Assuming verification results are in the same order as phrases array
  for (let i = 0; i < Math.min(phrases.length, verification.results.length); i++) {
    mapping[i] = verification.results[i].english;
  }

  return mapping;
}

function applyTranslations() {
  console.log('🚀 Applying translations using object approach...\n');

  // Load phrases
  console.log('📖 Loading phrases...');
  const phrases = loadPhrases();
  console.log(`   Loaded ${phrases.length} phrases\n`);

  // Load all translations
  console.log('📖 Loading translations...');
  const allTranslations = {};
  for (const lang of LANGUAGES) {
    allTranslations[lang.code] = loadTranslationsByTurkmen(lang.jsonCode);
    console.log(`   ${lang.code}: ${Object.keys(allTranslations[lang.code]).length} translations`);
  }

  // Create english mapping
  console.log('\n📖 Creating phrase mapping...');
  const englishMapping = createEnglishMapping(phrases);
  console.log(`   Mapped ${Object.keys(englishMapping).length} phrases to English\n`);

  // Apply translations
  console.log('🔧 Applying translations...\n');
  let totalUpdated = 0;

  for (const lang of LANGUAGES) {
    console.log(`   Processing ${lang.code}...`);
    let langUpdated = 0;

    const translations = allTranslations[lang.code];

    for (let i = 0; i < phrases.length; i++) {
      const english = englishMapping[i];

      if (english && translations[english]) {
        phrases[i][lang.code] = translations[english];
        langUpdated++;
      }
    }

    console.log(`      Updated ${langUpdated} phrases`);
    totalUpdated += langUpdated;
  }

  console.log(`\n✅ Total updates: ${totalUpdated}\n`);

  // Write back to file
  console.log('💾 Writing phrases back to file...');
  writePhrasesToFile(phrases);
  console.log('✅ Done!\n');
}

function writePhrasesToFile(phrases) {
  const phrasesPath = path.join(__dirname, 'src', 'data', 'phrases.ts');

  // Generate TypeScript content
  let content = `// src/data/phrases.ts
import { Phrase } from "../types";

export const phrases: Phrase[] = [\n`;

  for (let i = 0; i < phrases.length; i++) {
    const phrase = phrases[i];

    content += `  {\n`;

    // Write all fields
    for (const [key, value] of Object.entries(phrase)) {
      if (value === undefined || value === null) continue;

      const escapedValue = String(value)
        .replace(/\\/g, '\\\\')
        .replace(/"/g, '\\"')
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r')
        .replace(/\t/g, '\\t');
      content += `    ${key}: "${escapedValue}",\n`;
    }

    content += `  }${i < phrases.length - 1 ? ',' : ''}\n`;
  }

  content += `];\n`;

  fs.writeFileSync(phrasesPath, content, 'utf8');
}

applyTranslations();
