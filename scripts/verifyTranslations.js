// scripts/verifyTranslations.js
// FREE Translation Verification Script
// Uses: MyMemory API (free, 1000 requests/day) and Google Translate (scraping)

const fs = require('fs');
const path = require('path');

// =====================================
// CONFIGURATION
// =====================================

const DELAY_MS = 500; // Delay between requests to avoid rate limits
const MAX_RETRIES = 3;

// Languages to verify (27 languages, excluding zh, ru, en which are already verified)
const LANGUAGES_TO_VERIFY = [
  { code: 'ja', name: 'Japanese', priority: 'HIGH' },
  { code: 'ko', name: 'Korean', priority: 'HIGH' },
  { code: 'tr', name: 'Turkish', priority: 'HIGH' },
  { code: 'de', name: 'German', priority: 'HIGH' },
  { code: 'fr', name: 'French', priority: 'HIGH' },
  { code: 'es', name: 'Spanish', priority: 'HIGH' },
  { code: 'it', name: 'Italian', priority: 'HIGH' },
  { code: 'ar', name: 'Arabic', priority: 'HIGH' },
  { code: 'th', name: 'Thai', priority: 'MEDIUM' },
  { code: 'vi', name: 'Vietnamese', priority: 'MEDIUM' },
  { code: 'id', name: 'Indonesian', priority: 'MEDIUM' },
  { code: 'ms', name: 'Malay', priority: 'MEDIUM' },
  { code: 'hi', name: 'Hindi', priority: 'MEDIUM' },
  { code: 'ur', name: 'Urdu', priority: 'MEDIUM' },
  { code: 'fa', name: 'Persian', priority: 'MEDIUM' },
  { code: 'pt', name: 'Portuguese', priority: 'MEDIUM' },
  { code: 'pl', name: 'Polish', priority: 'MEDIUM' },
  { code: 'nl', name: 'Dutch', priority: 'MEDIUM' },
  { code: 'uk', name: 'Ukrainian', priority: 'MEDIUM' },
  { code: 'uz', name: 'Uzbek', priority: 'LOW' },
  { code: 'kk', name: 'Kazakh', priority: 'LOW' },
  { code: 'az', name: 'Azerbaijani', priority: 'LOW' },
  { code: 'ky', name: 'Kyrgyz', priority: 'LOW' },
  { code: 'tg', name: 'Tajik', priority: 'LOW' },
  { code: 'hy', name: 'Armenian', priority: 'LOW' },
  { code: 'ka', name: 'Georgian', priority: 'LOW' },
  { code: 'ps', name: 'Pashto', priority: 'LOW' },
];

// =====================================
// FREE TRANSLATION API - MyMemory
// =====================================

async function translateWithMyMemory(text, targetLang) {
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${targetLang}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.responseStatus === 200 && data.responseData) {
      return {
        translation: data.responseData.translatedText,
        service: 'MyMemory',
        confidence: data.match || 0
      };
    }

    return null;
  } catch (error) {
    console.error(`MyMemory API error for ${targetLang}:`, error.message);
    return null;
  }
}

// =====================================
// HELPER FUNCTIONS
// =====================================

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function loadPhrases() {
  try {
    // Try to load from compiled phrases
    const phrasesPath = path.join(__dirname, '../src/data/phrases.ts');
    console.log('Loading phrases from:', phrasesPath);

    // For now, return a sample structure
    // TODO: Parse phrases.ts file or convert to JSON
    console.log('⚠️  Please create src/data/phrases.json for easier processing');
    console.log('   Or we can parse phrases.ts manually');

    return [];
  } catch (error) {
    console.error('Error loading phrases:', error);
    return [];
  }
}

// =====================================
// VERIFICATION FUNCTIONS
// =====================================

async function verifyLanguage(languageCode, languageName, phrases) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`🔍 Verifying ${languageName} (${languageCode})`);
  console.log(`${'='.repeat(60)}\n`);

  const results = [];
  let verified = 0;
  let needsReview = 0;
  let errors = 0;

  for (let i = 0; i < phrases.length; i++) {
    const phrase = phrases[i];
    const englishText = phrase.english || phrase.en;
    const currentTranslation = phrase[languageCode];

    if (!englishText || !currentTranslation) {
      console.log(`⚠️  Skipping phrase ${i + 1}: Missing data`);
      errors++;
      continue;
    }

    // Translate using MyMemory
    console.log(`[${i + 1}/${phrases.length}] Translating: "${englishText.substring(0, 50)}..."`);

    const myMemoryResult = await translateWithMyMemory(englishText, languageCode);

    if (myMemoryResult) {
      const match = currentTranslation.toLowerCase().trim() ===
                    myMemoryResult.translation.toLowerCase().trim();

      const status = match ? '✅ MATCH' : '⚠️  DIFFERENT';

      results.push({
        phraseId: phrase.id || i + 1,
        category: phrase.categoryId || 'unknown',
        english: englishText,
        current: currentTranslation,
        myMemory: myMemoryResult.translation,
        match: match,
        status: match ? 'verified' : 'needs_review',
        confidence: myMemoryResult.confidence
      });

      if (match) {
        verified++;
      } else {
        needsReview++;
      }

      console.log(`   ${status}`);
      if (!match) {
        console.log(`   Current:  ${currentTranslation}`);
        console.log(`   MyMemory: ${myMemoryResult.translation}`);
      }
    } else {
      errors++;
      results.push({
        phraseId: phrase.id || i + 1,
        category: phrase.categoryId || 'unknown',
        english: englishText,
        current: currentTranslation,
        myMemory: 'ERROR',
        match: false,
        status: 'error',
        confidence: 0
      });
    }

    // Delay to respect rate limits
    await sleep(DELAY_MS);
  }

  // Generate report
  const report = {
    language: languageName,
    languageCode: languageCode,
    timestamp: new Date().toISOString(),
    summary: {
      total: phrases.length,
      verified: verified,
      needsReview: needsReview,
      errors: errors,
      verificationRate: ((verified / phrases.length) * 100).toFixed(1) + '%'
    },
    results: results
  };

  // Save report
  const reportPath = path.join(__dirname, '../reviews', `${languageCode}_verification.json`);
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

  console.log(`\n${'='.repeat(60)}`);
  console.log(`📊 SUMMARY for ${languageName}:`);
  console.log(`   ✅ Verified: ${verified}/${phrases.length} (${report.summary.verificationRate})`);
  console.log(`   ⚠️  Needs Review: ${needsReview}`);
  console.log(`   ❌ Errors: ${errors}`);
  console.log(`   📄 Report saved: ${reportPath}`);
  console.log(`${'='.repeat(60)}\n`);

  return report;
}

// =====================================
// MAIN FUNCTION
// =====================================

async function main() {
  console.log('🚀 Translation Verification Script');
  console.log('📋 Budget: $0 (FREE)');
  console.log('🔧 Using: MyMemory API (1000 requests/day limit)\n');

  // Check if we have phrases
  const phrases = loadPhrases();

  if (phrases.length === 0) {
    console.log('❌ No phrases loaded!');
    console.log('\n📝 Next steps:');
    console.log('   1. Create src/data/phrases.json with your phrases');
    console.log('   2. Or update this script to parse phrases.ts');
    console.log('   3. Run: node scripts/verifyTranslations.js [language_code]');
    console.log('\nExample phrases.json structure:');
    console.log(JSON.stringify([
      {
        id: 1,
        categoryId: 'greetings',
        english: 'Hello',
        tk: 'Salam',
        zh: '你好',
        ru: 'Привет',
        ja: 'こんにちは',
        // ... other languages
      }
    ], null, 2));
    return;
  }

  // Get target language from command line argument
  const targetLang = process.argv[2];

  if (!targetLang) {
    console.log('❌ Please specify a language code!');
    console.log('\nUsage: node scripts/verifyTranslations.js [language_code]');
    console.log('\nAvailable languages:');
    LANGUAGES_TO_VERIFY.forEach(lang => {
      console.log(`   ${lang.code.padEnd(5)} - ${lang.name.padEnd(20)} (${lang.priority})`);
    });
    return;
  }

  const language = LANGUAGES_TO_VERIFY.find(l => l.code === targetLang);

  if (!language) {
    console.log(`❌ Language '${targetLang}' not found in verification list!`);
    return;
  }

  // Start verification
  await verifyLanguage(language.code, language.name, phrases);

  console.log('✅ Verification complete!');
  console.log('\n📝 Next steps:');
  console.log('   1. Review the report in reviews/[language]_verification.json');
  console.log('   2. Manually check phrases marked as "needs_review"');
  console.log('   3. Update phrases if necessary');
  console.log('   4. Run verification for next language');
}

// Run the script
main().catch(console.error);
