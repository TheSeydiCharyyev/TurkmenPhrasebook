// scripts/fixPhrasesPaths.js - Исправление путей в phrases.ts
const fs = require('fs');
const path = require('path');

const PHRASES_PATH = path.join(__dirname, '../src/data/phrases.ts');

console.log('🔧 Исправляем пути к аудио в phrases.ts...\n');

// Читаем файл
let content = fs.readFileSync(PHRASES_PATH, 'utf8');

// Маппинг старых путей на новые
const pathMapping = {
  '1. Greetings': 'greetings',
  '2. Emergency': 'emergency',
  '3. Hotel': 'hotel',
  '4. Food': 'food',
  '5. Shopping': 'shopping',
  '6. Transport': 'transport',
  '7. Directions': 'directions',
  '8. Health': 'health',
  '9. Money': 'money',
  '10. Communication': 'communication',
  '11. Entertainment': 'entertainment',
  '12. Time': 'time',
  '13. Numbers': 'numbers',
  '14. Weather': 'weather',
  '15. Personal_info': 'personal_info',
  '16. Business': 'business',
  '17. Measurements': 'measurements',
  '18. Colors': 'colors',
  '19. Body': 'body',
  '20. Home': 'home',
  '21. Customs': 'customs',
  '22. Sport': 'sport'
};

let replacements = 0;

// Заменяем все старые пути на новые
Object.entries(pathMapping).forEach(([oldPath, newPath]) => {
  const regex = new RegExp(`'${oldPath.replace('.', '\\.')}/turkmen/`, 'g');
  const count = (content.match(regex) || []).length;
  
  if (count > 0) {
    content = content.replace(regex, `'${newPath}/turkmen/`);
    console.log(`✅ ${oldPath} → ${newPath}: ${count} замен`);
    replacements += count;
  }
});

// Сохраняем обновлённый файл
fs.writeFileSync(PHRASES_PATH, content, 'utf8');

console.log(`\n📊 Всего выполнено замен: ${replacements}`);
console.log('✅ phrases.ts обновлён!\n');
console.log('Следующие шаги:');
console.log('1. Проверьте src/data/phrases.ts');
console.log('2. Пересоберите APK: eas build --platform android --profile preview');