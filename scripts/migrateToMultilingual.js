// scripts/migrateToMultilingual.js
// Скрипт миграции к мультиязычной структуре
const fs = require('fs');
const path = require('path');

console.log('🚀 Миграция к мультиязычной структуре...\n');

// Читаем старый phrases.ts
const oldPhrasesPath = path.join(__dirname, '../src/data/phrases.ts');
console.log(`📖 Чтение файла: ${oldPhrasesPath}`);
const oldContent = fs.readFileSync(oldPhrasesPath, 'utf8');

// Regex для парсинга фраз (учитывает опциональный subcategoryId)
const phraseRegex = /{\s*id:\s*["']([^"']+)["'][,\s]*categoryId:\s*["']([^"']+)["'][,\s]*(?:subcategoryId:\s*["']([^"']+)["'][,\s]*)?chinese:\s*["']([^"']+)["'][,\s]*pinyin:\s*["']([^"']+)["'][,\s]*russian:\s*["']([^"']+)["'][,\s]*turkmen:\s*["']([^"']+)["'][,\s]*audioFileTurkmen:\s*["']([^"']+)["'][,\s]*}/g;

const phrases = [];
let match;
let order = 1;

while ((match = phraseRegex.exec(oldContent)) !== null) {
  phrases.push({
    id: match[1],
    categoryId: match[2],
    subcategoryId: match[3] || undefined,
    chinese: match[4].replace(/\\/g, '\\\\'),  // Экранируем слэши
    pinyin: match[5].replace(/\\/g, '\\\\'),
    russian: match[6].replace(/\\/g, '\\\\'),
    turkmen: match[7].replace(/\\/g, '\\\\'),
    audioFileTurkmen: match[8],
    order: order++
  });
}

console.log(`✅ Найдено ${phrases.length} фраз\n`);

if (phrases.length === 0) {
  console.error('❌ ОШИБКА: Не найдено ни одной фразы! Проверьте формат phrases.ts');
  process.exit(1);
}

// Создаём директории
const baseDir = path.join(__dirname, '../src/data/languages');
const translationsDir = path.join(baseDir, 'translations');

console.log('📁 Создание директорий...');
[baseDir, translationsDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`   ✅ ${dir}`);
  } else {
    console.log(`   ⏭️  ${dir} (уже существует)`);
  }
});

// 1. Создаём base.ts
console.log('\n📝 Создание base.ts...');
const baseContent = `// AUTO-GENERATED: Базовые туркменские фразы
// Generated: ${new Date().toISOString()}
// Total phrases: ${phrases.length}
import { BasePhrase } from '../../types';

export const basePhrases: BasePhrase[] = [
${phrases.map(p => {
  const subcategoryLine = p.subcategoryId ? `\n    subcategoryId: "${p.subcategoryId}",` : '';
  return `  {
    id: "${p.id}",
    categoryId: "${p.categoryId}",${subcategoryLine}
    turkmen: "${p.turkmen}",
    audioFileTurkmen: "${p.audioFileTurkmen}",
    order: ${p.order}
  }`;
}).join(',\n')}
];
`;

fs.writeFileSync(path.join(baseDir, 'base.ts'), baseContent);
console.log('✅ base.ts создан');

// 2. Создаём chinese.ts
console.log('📝 Создание chinese.ts...');
const chineseContent = `// AUTO-GENERATED: Китайские переводы
// Generated: ${new Date().toISOString()}
// Total translations: ${phrases.length}
import { LanguageTranslation } from '../../../types';

export const chineseTranslations: LanguageTranslation[] = [
${phrases.map(p => `  {
    phraseId: "${p.id}",
    text: "${p.chinese}",
    transcription: "${p.pinyin}"
  }`).join(',\n')}
];
`;

fs.writeFileSync(path.join(translationsDir, 'chinese.ts'), chineseContent);
console.log('✅ chinese.ts создан');

// 3. Создаём russian.ts
console.log('📝 Создание russian.ts...');
const russianContent = `// AUTO-GENERATED: Русские переводы
// Generated: ${new Date().toISOString()}
// Total translations: ${phrases.length}
import { LanguageTranslation } from '../../../types';

export const russianTranslations: LanguageTranslation[] = [
${phrases.map(p => `  {
    phraseId: "${p.id}",
    text: "${p.russian}",
    transcription: undefined
  }`).join(',\n')}
];
`;

fs.writeFileSync(path.join(translationsDir, 'russian.ts'), russianContent);
console.log('✅ russian.ts создан');

// 4. Создаём english.ts (пустой шаблон)
console.log('📝 Создание english.ts...');
const englishContent = `// Английские переводы
// TODO: Добавить переводы для всех ${phrases.length} фраз
import { LanguageTranslation } from '../../../types';

export const englishTranslations: LanguageTranslation[] = [
  // TODO: Добавить переводы
  // Пример:
  // {
  //   phraseId: "phrase_001",
  //   text: "Hello",
  //   transcription: undefined
  // },
];
`;

fs.writeFileSync(path.join(translationsDir, 'english.ts'), englishContent);
console.log('✅ english.ts создан (пустой шаблон)');

// 5. Создаём index.ts
console.log('📝 Создание index.ts...');
const indexContent = `// AUTO-GENERATED: Агрегация переводов
// Generated: ${new Date().toISOString()}
import { chineseTranslations } from './translations/chinese';
import { russianTranslations } from './translations/russian';
import { englishTranslations } from './translations/english';
import { LanguageTranslation } from '../../types';

const translationsMap: Record<string, LanguageTranslation[]> = {
  zh: chineseTranslations,
  ru: russianTranslations,
  en: englishTranslations,
};

/**
 * Получить переводы для указанного языка
 * @param languageCode - Код языка (zh, ru, en...)
 * @returns Массив переводов или пустой массив
 */
export const getTranslationsForLanguage = (
  languageCode: string
): LanguageTranslation[] => {
  return translationsMap[languageCode] || [];
};

/**
 * Проверить наличие переводов для языка
 * @param languageCode - Код языка
 * @returns true если переводы есть
 */
export const hasTranslationsForLanguage = (
  languageCode: string
): boolean => {
  const translations = translationsMap[languageCode];
  return translations && translations.length > 0;
};
`;

fs.writeFileSync(path.join(baseDir, 'index.ts'), indexContent);
console.log('✅ index.ts создан');

// Финальный отчет
console.log('\n' + '='.repeat(50));
console.log('🎉 Миграция завершена успешно!\n');
console.log('📊 Статистика:');
console.log(`   Всего фраз: ${phrases.length}`);
console.log(`   Категории: ${new Set(phrases.map(p => p.categoryId)).size}`);
console.log(`   С подкатегориями: ${phrases.filter(p => p.subcategoryId).length}`);
console.log('\n📁 Созданные файлы:');
console.log('   ✅ src/data/languages/base.ts');
console.log('   ✅ src/data/languages/translations/chinese.ts');
console.log('   ✅ src/data/languages/translations/russian.ts');
console.log('   ✅ src/data/languages/translations/english.ts (шаблон)');
console.log('   ✅ src/data/languages/index.ts');
console.log('\n📝 Следующие шаги:');
console.log('   1. Добавить английские переводы в english.ts');
console.log('   2. Проверить TypeScript компиляцию: npm run type-check');
console.log('   3. Протестировать импорт: import { basePhrases } from "src/data/languages/base"');
console.log('='.repeat(50));
