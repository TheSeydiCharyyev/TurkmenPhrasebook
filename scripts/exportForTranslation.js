// scripts/exportForTranslation.js
// Экспортирует русские фразы в JSON для перевода через AI
const fs = require('fs');
const path = require('path');

console.log('📤 Экспорт фраз для перевода...\n');

// Читаем phrases.ts
const phrasesPath = path.join(__dirname, '../src/data/phrases.ts');
const phrasesContent = fs.readFileSync(phrasesPath, 'utf8');

// Извлекаем русские фразы
const russianRegex = /russian:\s*["']([^"']+)["']/g;
const russianPhrases = [];
let match;

while ((match = russianRegex.exec(phrasesContent)) !== null) {
  russianPhrases.push(match[1]);
}

// Создаем JSON для перевода
const translationData = {
  sourceLanguage: "Russian",
  targetLanguage: "English",
  phrases: russianPhrases.map((text, index) => ({
    id: `phrase_${String(index + 1).padStart(3, '0')}`,
    russian: text,
    english: "" // Заполнить через AI
  }))
};

// Сохраняем JSON
const jsonPath = path.join(__dirname, 'translations_russian_to_english.json');
fs.writeFileSync(jsonPath, JSON.stringify(translationData, null, 2), 'utf8');

console.log(`✅ Создан файл: ${jsonPath}`);
console.log(`📊 Всего фраз для перевода: ${russianPhrases.length}\n`);
console.log(`📝 Инструкции:`);
console.log(`1. Откройте файл translations_russian_to_english.json`);
console.log(`2. Скопируйте содержимое`);
console.log(`3. Используйте ChatGPT/Claude с промптом:`);
console.log(`   "Переведи все значения 'russian' на английский и заполни поля 'english'"`);
console.log(`4. Сохраните результат обратно в тот же файл`);
console.log(`5. Запустите: node scripts/importTranslations.js\n`);
