// fix-thai.js - Автоматическое исправление тайских переводов
const fs = require('fs');
const path = require('path');

console.log('🔧 Начинаем исправление тайских переводов...\n');

// 1. Читаем файл с ошибками
const verificationPath = path.join(__dirname, 'reviews', 'th_verification.json');
const verification = JSON.parse(fs.readFileSync(verificationPath, 'utf8'));

console.log(`📋 Загружено ${verification.results.length} записей для проверки`);
console.log(`⚠️  Требуют исправления: ${verification.summary.needsReview}\n`);

// 2. Создаем маппинг indonesian -> правильный тайский перевод
const corrections = {};
verification.results.forEach(item => {
  // Используем phraseId (индонезийский текст) как ключ
  corrections[item.phraseId] = {
    myMemory: item.myMemory,
    current: item.current,
    english: item.english
  };
});

console.log(`✅ Создан маппинг для ${Object.keys(corrections).length} фраз\n`);

// 3. Читаем phrases.ts
const phrasesPath = path.join(__dirname, 'src', 'data', 'phrases.ts');
let phrasesContent = fs.readFileSync(phrasesPath, 'utf8');

// 4. Исправляем фразы
let fixedCount = 0;
let notFoundCount = 0;
const notFoundPhrases = [];

// Разбиваем файл на строки
const lines = phrasesContent.split('\n');
const newLines = [];

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];

  // Ищем строки с thai:
  if (line.includes('thai:')) {
    // Ищем предыдущие строки чтобы найти indonesian
    let indonesianValue = null;

    // Ищем в предыдущих строках indonesian
    for (let j = i - 1; j >= Math.max(0, i - 20); j--) {
      const prevLine = lines[j];
      if (prevLine.includes('indonesian:')) {
        // Извлекаем значение indonesian
        const match = prevLine.match(/indonesian:\s*"([^"]+)"/);
        if (match) {
          indonesianValue = match[1];
          break;
        }
      }
    }

    if (indonesianValue && corrections[indonesianValue]) {
      // Нашли соответствие, исправляем
      const correction = corrections[indonesianValue];
      const newThaiValue = correction.myMemory;

      // Заменяем значение thai
      const newLine = line.replace(/thai:\s*"[^"]*"/, `thai: "${newThaiValue}"`);
      newLines.push(newLine);

      fixedCount++;
      if (fixedCount % 50 === 0) {
        console.log(`   Исправлено: ${fixedCount}/${verification.summary.needsReview}`);
      }
    } else {
      // Не нашли соответствие
      newLines.push(line);
      notFoundCount++;
      if (indonesianValue) {
        notFoundPhrases.push(indonesianValue);
      }
    }
  } else {
    newLines.push(line);
  }
}

// 5. Сохраняем исправленный файл
const updatedContent = newLines.join('\n');
fs.writeFileSync(phrasesPath, updatedContent, 'utf8');

console.log('\n✅ Исправление завершено!');
console.log(`   Исправлено фраз: ${fixedCount}`);
console.log(`   Не найдено: ${notFoundCount}`);

if (notFoundPhrases.length > 0) {
  console.log('\n⚠️  Не найдены следующие фразы:');
  notFoundPhrases.slice(0, 10).forEach(p => console.log(`   - ${p}`));
  if (notFoundPhrases.length > 10) {
    console.log(`   ... и еще ${notFoundPhrases.length - 10}`);
  }
}

// 6. Создаем отчет о проделанной работе
const report = {
  language: 'Thai',
  languageCode: 'th',
  timestamp: new Date().toISOString(),
  status: 'completed',
  summary: {
    total: verification.results.length,
    fixed: fixedCount,
    notFound: notFoundCount
  },
  corrections: verification.results.map(item => ({
    phraseId: item.phraseId,
    english: item.english,
    oldValue: item.current,
    newValue: item.myMemory,
    fixed: corrections[item.phraseId] ? true : false
  }))
};

const reportPath = path.join(__dirname, 'reviews', 'th_corrected.json');
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf8');

console.log(`\n📄 Отчет сохранен: ${reportPath}`);
console.log('\n🎉 Готово! Тайский язык исправлен!');
