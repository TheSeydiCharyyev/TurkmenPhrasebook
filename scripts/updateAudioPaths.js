// scripts/updateAudioPaths.js
const fs = require('fs');
const path = require('path');

const CATEGORY_FOLDERS = {
  'greetings': { folder: '1. Greetings', num: 1 },
  'emergency': { folder: '2. Emergency', num: 2 },
  'hotel': { folder: '3. Hotel', num: 3 },
  'food': { folder: '4. Food', num: 4 },
  'shopping': { folder: '5. Shopping', num: 5 },
  'transport': { folder: '6. Transport', num: 6 },
  'directions': { folder: '7. Directions', num: 7 },
  'health': { folder: '8. Health', num: 8 },
  'money': { folder: '9. Money', num: 9 },
  'communication': { folder: '10. Communication', num: 10 },
  'entertainment': { folder: '11. Entertainment', num: 11 },
  'time': { folder: '12. Time', num: 12 },
  'numbers': { folder: '13. Numbers', num: 13 },
  'weather': { folder: '14. Weather', num: 14 },
  'personal_info': { folder: '15. Personal_info', num: 15 },
  'business': { folder: '16. Business', num: 16 },
  'measurements': { folder: '17. Measurements', num: 17 },
  'colors': { folder: '18. Colors', num: 18 },
  'body': { folder: '19. Body', num: 19 },
  'home': { folder: '20. Home', num: 20 },
  'customs': { folder: '21. Customs', num: 21 },
  'sport': { folder: '22. Sport', num: 22 },
};

function updateAudioPaths() {
  const phrasesPath = path.join(__dirname, '../src/data/phrases.ts');
  
  console.log('Path to file:', phrasesPath);
  
  if (!fs.existsSync(phrasesPath)) {
    console.error('ERROR: File not found!');
    return;
  }
  
  let content = fs.readFileSync(phrasesPath, 'utf8');
  console.log('File read, size:', content.length, 'characters\n');

  const categoryCounters = {};
  let updatedCount = 0;

  // Заменяем audioFileTurkmen на новый формат с 1.1, 1.2 и т.д.
  content = content.replace(
    /(\s+id: "phrase_\d+",\s+categoryId: "(\w+)",[\s\S]*?)audioFileTurkmen: ".*?",?/g,
    (match, prefix, categoryId) => {
      const categoryInfo = CATEGORY_FOLDERS[categoryId];
      
      if (!categoryInfo) {
        console.warn(`WARNING: Unknown category: ${categoryId}`);
        return match;
      }

      // Увеличиваем счётчик для категории
      if (!categoryCounters[categoryId]) {
        categoryCounters[categoryId] = 0;
      }
      categoryCounters[categoryId]++;

      const phraseNum = categoryCounters[categoryId];
      const audioPath = `${categoryInfo.folder}/turkmen/${categoryInfo.num}.${phraseNum}.mp3`;
      
      updatedCount++;
      
      return `${prefix}audioFileTurkmen: "${audioPath}",`;
    }
  );

  // Удаляем audioFileChinese если есть
  content = content.replace(/\s+audioFileChinese: ".*?",?\n/g, '');

  // Сохраняем
  fs.writeFileSync(phrasesPath, content, 'utf8');

  console.log(`Done! Updated ${updatedCount} phrases`);
  console.log(`File saved: ${phrasesPath}\n`);
  
  console.log('Statistics by category:');
  Object.entries(categoryCounters).forEach(([categoryId, count]) => {
    console.log(`   ${categoryId}: ${count} phrases`);
  });
}

try {
  updateAudioPaths();
} catch (error) {
  console.error('ERROR:', error.message);
  console.error(error.stack);
  process.exit(1);
}