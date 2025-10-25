// scripts/importTranslations.js
// Импортирует переведенные фразы из JSON в english.ts
const fs = require('fs');
const path = require('path');

console.log('📥 Импорт английских переводов...\n');

// Читаем JSON с переводами
const jsonPath = path.join(__dirname, 'translations_russian_to_english.json');

if (!fs.existsSync(jsonPath)) {
  console.error('❌ Файл translations_russian_to_english.json не найден!');
  console.log('   Сначала запустите: node scripts/exportForTranslation.js\n');
  process.exit(1);
}

const translationData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

// Проверяем что переводы заполнены
const emptyCount = translationData.phrases.filter(p => !p.english || p.english === '').length;

if (emptyCount > 0) {
  console.warn(`⚠️  Внимание: ${emptyCount} фраз не переведены (пустое поле 'english')`);
  console.log(`   Продолжаем импорт, но эти фразы будут помечены как [NOT TRANSLATED]\n`);
}

// Создаем массив переводов
const englishTranslations = translationData.phrases.map(phrase => ({
  phraseId: phrase.id,
  text: phrase.english || `[NOT TRANSLATED: ${phrase.russian}]`,
  transcription: undefined
}));

// Генерируем содержимое файла
const fileContent = `// AUTO-GENERATED: Английские переводы
// Generated: ${new Date().toISOString()}
// Total translations: ${englishTranslations.length}
import { LanguageTranslation } from '../../../types';

export const englishTranslations: LanguageTranslation[] = [
${englishTranslations.map(t => `  {
    phraseId: "${t.phraseId}",
    text: "${t.text.replace(/"/g, '\\"')}",
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
const translatedCount = englishTranslations.filter(t => !t.text.startsWith('[NOT TRANSLATED')).length;
const notTranslatedCount = englishTranslations.length - translatedCount;

console.log(`\n📈 Статистика:`);
console.log(`  ✅ Переведено: ${translatedCount}`);
console.log(`  ❌ Не переведено: ${notTranslatedCount}\n`);

if (translatedCount === englishTranslations.length) {
  console.log(`🎉 Все фразы успешно переведены!\n`);
}
