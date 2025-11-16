// scripts/convertPhrasesToJSON.js
// Converts TypeScript phrases to JSON format for verification script

const fs = require('fs');
const path = require('path');

console.log('🔄 Converting phrases.ts to phrases.json...\n');

// Language codes mapping
const LANGUAGES = [
  'tk', 'zh', 'ru', 'en', 'ja', 'ko', 'th', 'vi', 'id', 'ms',
  'hi', 'ur', 'fa', 'ps', 'de', 'fr', 'es', 'it', 'tr', 'pl',
  'uk', 'hy', 'ka', 'ar', 'uz', 'kk', 'az', 'ky', 'tg', 'pt', 'nl'
];

const LANGUAGE_NAMES = {
  tk: 'turkmen',
  zh: 'chinese',
  ru: 'russian',
  en: 'english',
  ja: 'japanese',
  ko: 'korean',
  th: 'thai',
  vi: 'vietnamese',
  id: 'indonesian',
  ms: 'malay',
  hi: 'hindi',
  ur: 'urdu',
  fa: 'persian',
  ps: 'pashto',
  de: 'german',
  fr: 'french',
  es: 'spanish',
  it: 'italian',
  tr: 'turkish',
  pl: 'polish',
  uk: 'ukrainian',
  hy: 'armenian',
  ka: 'georgian',
  ar: 'arabic',
  uz: 'uzbek',
  kk: 'kazakh',
  az: 'azerbaijani',
  ky: 'kyrgyz',
  tg: 'tajik',
  pt: 'portuguese',
  nl: 'dutch'
};

// Parse a single translation file
function parseTranslationFile(filepath) {
  try {
    const content = fs.readFileSync(filepath, 'utf8');

    // Extract translation objects using regex
    // Match: { phraseId: "phrase_XXX", text: "...", transcription: ... }
    const regex = /\{\s*phraseId:\s*"([^"]+)",\s*text:\s*"([^"]*)",\s*transcription:\s*(.*?)\s*\}/gs;
    const translations = {};
    let match;

    while ((match = regex.exec(content)) !== null) {
      const phraseId = match[1];
      const text = match[2];
      const transcription = match[3];

      translations[phraseId] = {
        text: text,
        transcription: transcription && transcription !== 'undefined' ? transcription.replace(/"/g, '') : undefined
      };
    }

    return translations;
  } catch (error) {
    console.error(`  ❌ Error parsing ${filepath}:`, error.message);
    return {};
  }
}

// Parse phrases.ts base file
function parseBasePhrases() {
  try {
    const phrasesPath = path.join(__dirname, '../src/data/phrases.ts');
    const content = fs.readFileSync(phrasesPath, 'utf8');

    // Extract phrase objects
    // Match: { id: "phrase_XXX", categoryId: "...", ... }
    const phrases = [];
    const regex = /\{\s*id:\s*"(phrase_\d+)",\s*categoryId:\s*"([^"]+)",([^}]*)\}/gs;
    let match;

    while ((match = regex.exec(content)) !== null) {
      const id = match[1];
      const categoryId = match[2];
      const body = match[3];

      // Extract fields from body
      const turkmen = (body.match(/turkmen:\s*"([^"]*)"/)?.[1] || '').replace(/\\n/g, '\n');
      const chinese = (body.match(/chinese:\s*"([^"]*)"/)?.[1] || '').replace(/\\n/g, '\n');
      const pinyin = body.match(/pinyin:\s*"([^"]*)"/)?.[1] || undefined;
      const russian = (body.match(/russian:\s*"([^"]*)"/)?.[1] || '').replace(/\\n/g, '\n');

      phrases.push({
        id,
        categoryId,
        turkmen,
        chinese,
        pinyin,
        russian
      });
    }

    return phrases;
  } catch (error) {
    console.error('❌ Error parsing phrases.ts:', error.message);
    return [];
  }
}

// Main conversion
async function main() {
  console.log('📂 Loading base phrases from phrases.ts...');
  const basePhrases = parseBasePhrases();
  console.log(`   ✅ Loaded ${basePhrases.length} base phrases\n`);

  if (basePhrases.length === 0) {
    console.error('❌ No phrases found! Check phrases.ts file.');
    return;
  }

  console.log('📂 Loading translations from language files...');

  // Load all translations
  const allTranslations = {};
  for (const [code, name] of Object.entries(LANGUAGE_NAMES)) {
    if (['tk', 'zh', 'ru'].includes(code)) {
      continue; // Skip - already in base phrases
    }

    const filepath = path.join(__dirname, `../src/data/languages/translations/${name}.ts`);

    if (fs.existsSync(filepath)) {
      console.log(`   📄 Loading ${name}.ts (${code})...`);
      allTranslations[code] = parseTranslationFile(filepath);
      const count = Object.keys(allTranslations[code]).length;
      console.log(`      ✅ ${count} translations loaded`);
    } else {
      console.log(`   ⚠️  ${name}.ts not found - skipping`);
    }
  }

  console.log('\n🔄 Merging all translations...');

  // Merge everything into final phrases array
  const finalPhrases = basePhrases.map(phrase => {
    const merged = {
      id: phrase.id,
      categoryId: phrase.categoryId,
      tk: phrase.turkmen,  // Turkmen (base)
      zh: phrase.chinese,  // Chinese (from phrases.ts)
      pinyin: phrase.pinyin,
      ru: phrase.russian,  // Russian (from phrases.ts)
    };

    // Add translations from separate files
    for (const [code, translations] of Object.entries(allTranslations)) {
      if (translations[phrase.id]) {
        merged[code] = translations[phrase.id].text;

        // Add transcription if available (for languages like Japanese, Korean, etc.)
        if (translations[phrase.id].transcription) {
          merged[`${code}_transcription`] = translations[phrase.id].transcription;
        }
      }
    }

    return merged;
  });

  console.log(`   ✅ Merged ${finalPhrases.length} phrases with all translations\n`);

  // Save to JSON
  const outputPath = path.join(__dirname, '../src/data/phrases.json');
  fs.writeFileSync(outputPath, JSON.stringify(finalPhrases, null, 2));

  console.log('✅ Successfully created phrases.json!');
  console.log(`   📄 Location: ${outputPath}`);
  console.log(`   📊 Total phrases: ${finalPhrases.length}`);

  // Statistics
  const languageStats = {};
  for (const code of LANGUAGES) {
    const count = finalPhrases.filter(p => p[code]).length;
    languageStats[code] = count;
  }

  console.log('\n📊 Translation Statistics:');
  console.log('   Language | Phrases | Coverage');
  console.log('   ---------|---------|----------');

  for (const [code, count] of Object.entries(languageStats)) {
    const coverage = ((count / finalPhrases.length) * 100).toFixed(1);
    const status = count === finalPhrases.length ? '✅' : '⚠️ ';
    console.log(`   ${code.padEnd(8)} | ${String(count).padStart(7)} | ${String(coverage + '%').padStart(7)} ${status}`);
  }

  console.log('\n✅ Done! You can now run:');
  console.log('   node scripts/verifyTranslations.js [language_code]\n');
}

main().catch(console.error);
