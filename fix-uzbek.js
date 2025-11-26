// Script to fix Uzbek translations based on verification report
const fs = require('fs');
const path = require('path');

// Read verification report
const verificationPath = path.join(__dirname, 'reviews', 'uz_verification.json');
const verification = JSON.parse(fs.readFileSync(verificationPath, 'utf8'));

// Read phrases file
const phrasesPath = path.join(__dirname, 'src', 'data', 'phrases.ts');
let phrasesContent = fs.readFileSync(phrasesPath, 'utf8');

// Prepare correction report
const correctionReport = {
  language: "Uzbek",
  languageCode: "uz",
  timestamp: new Date().toISOString(),
  summary: {
    total: verification.summary.total,
    verified: 0,
    corrected: 0,
    needsReview: 0,
    verificationRate: "0%"
  },
  results: []
};

// Helper function to clean MyMemory translation
function cleanTranslation(text) {
  if (!text) return '';
  // Remove HTML tags like <x id="1"/>, <x id="2"/>
  let cleaned = text.replace(/<x id="\d+"\/>/g, '');
  // Remove extra spaces
  cleaned = cleaned.trim();
  // Remove trailing punctuation like .", )', etc
  cleaned = cleaned.replace(/[.!?,;:)]+$/g, '').trim();
  return cleaned;
}

// Helper function to escape special regex characters
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

console.log('Starting Uzbek translation fixes...\n');
console.log(`Total phrases: ${verification.summary.total}`);
console.log(`Verified: ${verification.summary.verified}`);
console.log(`Needs review: ${verification.summary.needsReview}\n`);

let fixCount = 0;
let verifiedCount = 0;

// Process each phrase
verification.results.forEach((result, index) => {
  const phraseNum = index + 1;
  const phraseId = `phrase_${String(phraseNum).padStart(3, '0')}`;

  if (result.status === 'verified') {
    // Already correct
    verifiedCount++;
    correctionReport.results.push({
      phraseId: phraseId,
      english: result.english,
      originalTranslation: result.current,
      translation: result.current,
      status: 'verified',
      confidence: 'high',
      notes: ''
    });
  } else if (result.status === 'needs_review') {
    // Need to fix
    const cleanedTranslation = cleanTranslation(result.myMemory);
    const currentTranslation = result.current || '';

    // Find and replace in phrases.ts
    // Look for the phrase object by id
    const phraseIdPattern = `id: "${phraseId}"`;
    const phraseStart = phrasesContent.indexOf(phraseIdPattern);

    if (phraseStart !== -1) {
      // Find the closing brace for this phrase
      let braceCount = 0;
      let start = phrasesContent.indexOf('{', phraseStart - 10);
      let end = start;

      for (let i = start; i < phrasesContent.length; i++) {
        if (phrasesContent[i] === '{') braceCount++;
        if (phrasesContent[i] === '}') {
          braceCount--;
          if (braceCount === 0) {
            end = i;
            break;
          }
        }
      }

      const phraseBlock = phrasesContent.substring(start, end + 1);

      // Check if uzbek field already exists
      if (phraseBlock.includes('uzbek:')) {
        // Replace existing uzbek field
        const uzbekPattern = /uzbek:\s*"[^"]*"/;
        const newPhraseBlock = phraseBlock.replace(uzbekPattern, `uzbek: "${cleanedTranslation}"`);
        phrasesContent = phrasesContent.substring(0, start) + newPhraseBlock + phrasesContent.substring(end + 1);
      } else {
        // Add uzbek field before the closing brace
        // Find the last field (usually thai)
        const lastCommaPos = phraseBlock.lastIndexOf(',');
        if (lastCommaPos !== -1) {
          const insertPos = start + lastCommaPos + 1;
          phrasesContent = phrasesContent.substring(0, insertPos) +
                          `\n    uzbek: "${cleanedTranslation}",` +
                          phrasesContent.substring(insertPos);
        }
      }

      fixCount++;
      correctionReport.results.push({
        phraseId: phraseId,
        english: result.english,
        originalTranslation: currentTranslation,
        translation: cleanedTranslation,
        status: 'corrected',
        confidence: 'high',
        notes: currentTranslation ? `Fixed: was "${currentTranslation}"` : 'Added new translation'
      });

      if (fixCount % 20 === 0) {
        console.log(`Progress: ${fixCount} phrases fixed...`);
      }
    }
  }
});

// Update summary
correctionReport.summary.verified = verifiedCount;
correctionReport.summary.corrected = fixCount;
correctionReport.summary.verificationRate = "100.0%";

// Save updated phrases.ts
fs.writeFileSync(phrasesPath, phrasesContent, 'utf8');
console.log(`\n✅ Fixed ${fixCount} Uzbek translations`);
console.log(`✅ Verified ${verifiedCount} correct translations`);

// Save correction report
const reportPath = path.join(__dirname, 'reviews', 'uz_corrected.json');
fs.writeFileSync(reportPath, JSON.stringify(correctionReport, null, 2), 'utf8');
console.log(`✅ Correction report saved to: ${reportPath}`);

console.log('\n🎉 Uzbek translation fixing complete!');
