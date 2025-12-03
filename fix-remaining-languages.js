// fix-remaining-languages.js
// Script to fix remaining 10 languages based on verification results

const fs = require('fs');
const path = require('path');

// Languages to fix
const LANGUAGES_TO_FIX = [
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'tr', name: 'Turkish' },
  { code: 'de', name: 'German' },
  { code: 'fr', name: 'French' },
  { code: 'es', name: 'Spanish' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'pl', name: 'Polish' },
  { code: 'nl', name: 'Dutch' }
];

function processLanguage(langCode, langName) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Processing ${langName} (${langCode})`);
  console.log('='.repeat(60));

  // Read verification results
  const verificationPath = path.join(__dirname, 'reviews', `${langCode}_verification.json`);

  if (!fs.existsSync(verificationPath)) {
    console.log(`❌ Verification file not found: ${verificationPath}`);
    return null;
  }

  const verification = JSON.parse(fs.readFileSync(verificationPath, 'utf8'));

  console.log(`\n📊 Summary:`);
  console.log(`   Total phrases: ${verification.summary.total}`);
  console.log(`   Verified: ${verification.summary.verified}`);
  console.log(`   Needs review: ${verification.summary.needsReview}`);
  console.log(`   Verification rate: ${verification.summary.verificationRate}`);

  // Process corrections
  const corrections = [];
  let correctedCount = 0;
  let verifiedCount = 0;

  for (const result of verification.results) {
    if (result.status === 'needs_review' && result.myMemory && result.myMemory !== result.current) {
      // Apply AI suggestion
      corrections.push({
        phraseId: result.phraseId,
        category: result.category,
        english: result.english,
        old: result.current,
        new: result.myMemory,
        reason: 'AI suggestion (MyMemory)'
      });
      correctedCount++;
    } else if (result.status === 'verified') {
      verifiedCount++;
    }
  }

  console.log(`\n✅ Results:`);
  console.log(`   Corrections to apply: ${correctedCount}`);
  console.log(`   Already verified: ${verifiedCount}`);
  console.log(`   Total fixed: ${correctedCount + verifiedCount}/${verification.summary.total}`);

  // Save corrections report
  const correctedData = {
    language: langName,
    languageCode: langCode,
    timestamp: new Date().toISOString(),
    summary: {
      total: verification.summary.total,
      corrected: correctedCount,
      verified: verifiedCount,
      fixed: correctedCount + verifiedCount,
      fixRate: `${((correctedCount + verifiedCount) / verification.summary.total * 100).toFixed(1)}%`
    },
    corrections: corrections
  };

  const correctedPath = path.join(__dirname, 'reviews', `${langCode}_corrected.json`);
  fs.writeFileSync(correctedPath, JSON.stringify(correctedData, null, 2));
  console.log(`\n💾 Saved: ${correctedPath}`);

  return correctedData;
}

function applyCorrections(langCode, corrections) {
  console.log(`\n🔧 Applying corrections to phrases.ts for ${langCode}...`);

  const phrasesPath = path.join(__dirname, 'src', 'data', 'phrases.ts');
  let phrasesContent = fs.readFileSync(phrasesPath, 'utf8');

  let appliedCount = 0;

  for (const correction of corrections.corrections) {
    // Escape special regex characters in the old translation
    const oldEscaped = correction.old.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    // Create regex to find and replace
    // Pattern: phraseId: '...', ... langCode: 'oldTranslation'
    const pattern = new RegExp(
      `(id:\\s*['"]${correction.phraseId}['"][^}]*${langCode}:\\s*['"])${oldEscaped}(['"])`,
      'g'
    );

    if (pattern.test(phrasesContent)) {
      phrasesContent = phrasesContent.replace(pattern, `$1${correction.new}$2`);
      appliedCount++;
    }
  }

  // Save updated phrases.ts
  fs.writeFileSync(phrasesPath, phrasesContent, 'utf8');
  console.log(`✅ Applied ${appliedCount}/${corrections.corrections.length} corrections to phrases.ts`);

  return appliedCount;
}

// Main execution
async function main() {
  console.log('🚀 Starting batch language correction...\n');
  console.log(`Languages to process: ${LANGUAGES_TO_FIX.length}`);
  console.log(`Expected phrases per language: ~305\n`);

  const results = {};

  for (const lang of LANGUAGES_TO_FIX) {
    const corrections = processLanguage(lang.code, lang.name);

    if (corrections) {
      results[lang.code] = corrections.summary;

      // Apply corrections to phrases.ts
      if (corrections.corrections.length > 0) {
        const applied = applyCorrections(lang.code, corrections);
        results[lang.code].appliedToFile = applied;
      }
    }

    // Small delay between languages
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  // Final summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 FINAL SUMMARY');
  console.log('='.repeat(60));

  let totalFixed = 0;
  let totalPhrases = 0;

  for (const [code, summary] of Object.entries(results)) {
    console.log(`\n${code}: ${summary.fixed}/${summary.total} (${summary.fixRate})`);
    totalFixed += summary.fixed;
    totalPhrases += summary.total;
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log(`OVERALL: ${totalFixed}/${totalPhrases} phrases fixed`);
  console.log(`Success rate: ${(totalFixed / totalPhrases * 100).toFixed(1)}%`);
  console.log('='.repeat(60));
  console.log('\n✅ All languages processed!\n');
}

main().catch(console.error);
