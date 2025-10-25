// scripts/generateEnglishTranslations.js
// Скрипт для создания английских переводов на основе русских
const fs = require('fs');
const path = require('path');

console.log('🚀 Генерация английских переводов...\n');

// Читаем phrases.ts
const phrasesPath = path.join(__dirname, '../src/data/phrases.ts');
const phrasesContent = fs.readFileSync(phrasesPath, 'utf8');

// Простой словарь для базовых переводов (расширяемый)
const translationMap = {
  'Привет': 'Hello',
  'Спасибо': 'Thank you',
  'До свидания': 'Goodbye',
  'Извините': 'Excuse me',
  'Доброе утро': 'Good morning',
  'Спокойной ночи': 'Good night',
  'Да': 'Yes',
  'Нет': 'No',
  'Пожалуйста': 'Please',
  'Помогите': 'Help',
  'Я не понимаю': 'I don\'t understand',
  'Сколько стоит?': 'How much does it cost?',
  'Где находится...?': 'Where is...?',
  'Как дела?': 'How are you?',
  'Хорошо': 'Good',
  'Плохо': 'Bad',
  'Очень хорошо': 'Very good',
};

// Regex для извлечения русского текста
const russianRegex = /russian:\s*["']([^"']+)["']/g;

const russianPhrases = [];
let match;

while ((match = russianRegex.exec(phrasesContent)) !== null) {
  russianPhrases.push(match[1]);
}

console.log(`✅ Найдено ${russianPhrases.length} русских фраз\n`);

// Генерируем английские переводы
const englishTranslations = russianPhrases.map((russian, index) => {
  // Используем словарь если есть, иначе помечаем как TODO
  const english = translationMap[russian] || `[TODO: ${russian}]`;

  return {
    phraseId: `phrase_${String(index + 1).padStart(3, '0')}`,
    text: english,
    transcription: undefined
  };
});

// Создаем содержимое файла
const fileContent = `// AUTO-GENERATED: Английские переводы
// Generated: ${new Date().toISOString()}
// Total translations: ${englishTranslations.length}
// NOTE: Переводы помеченные [TODO:...] требуют ручного перевода
import { LanguageTranslation } from '../../../types';

export const englishTranslations: LanguageTranslation[] = [
${englishTranslations.map(t => `  {
    phraseId: "${t.phraseId}",
    text: "${t.text}",
    transcription: undefined
  }`).join(',\n')}
];
`;

// Сохраняем файл
const outputPath = path.join(__dirname, '../src/data/languages/translations/english.ts');
fs.writeFileSync(outputPath, fileContent, 'utf8');

console.log(`✅ Создан файл: ${outputPath}`);
console.log(`📊 Всего переводов: ${englishTranslations.length}`);

// Статистика
const todoCount = englishTranslations.filter(t => t.text.startsWith('[TODO:')).length;
const readyCount = englishTranslations.length - todoCount;

console.log(`\n📈 Статистика:`);
console.log(`  ✅ Готовых переводов: ${readyCount}`);
console.log(`  ⏳ Требуют перевода: ${todoCount}`);
console.log(`\n💡 Переводы помеченные [TODO:...] нужно заменить на английские вручную`);
console.log(`   или использовать AI для автоматического перевода.\n`);
