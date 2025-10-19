// scripts/syncAudioFiles.js
// Скрипт для синхронизации аудио файлов с phrases.ts

const fs = require('fs');
const path = require('path');

// Маппинг categoryId -> папка и номер
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
  'home': { folder: '20. Home', num: 20 }
};

// Шаг 1: Сканируем все реальные MP3 файлы
function scanAudioFiles() {
  console.log('📂 Сканируем аудио файлы...\n');
  
  const audioDir = path.join(__dirname, '../assets/audio');
  const result = {};
  let totalFiles = 0;

  Object.entries(CATEGORY_FOLDERS).forEach(([categoryId, { folder, num }]) => {
    const turkmenPath = path.join(audioDir, folder, 'turkmen');
    
    if (fs.existsSync(turkmenPath)) {
      const files = fs.readdirSync(turkmenPath)
        .filter(f => f.endsWith('.mp3'))
        .sort((a, b) => {
          // Сортировка по номеру: 1.1.mp3, 1.2.mp3, ..., 1.10.mp3
          const numA = parseFloat(a.replace('.mp3', '').replace(`${num}.`, ''));
          const numB = parseFloat(b.replace('.mp3', '').replace(`${num}.`, ''));
          return numA - numB;
        });
      
      result[categoryId] = files.map(f => `${folder}/turkmen/${f}`);
      totalFiles += files.length;
      
      console.log(`✅ ${folder}: ${files.length} файлов`);
    } else {
      console.log(`⚠️  ${folder}: папка не найдена`);
      result[categoryId] = [];
    }
  });

  console.log(`\n📊 Всего найдено: ${totalFiles} MP3 файлов\n`);
  return result;
}

// Шаг 2: Генерируем audioMapping.ts
function generateAudioMapping(audioFiles) {
  console.log('📝 Генерируем audioMapping.ts...\n');
  
  const lines = [];
  let count = 0;

  Object.entries(audioFiles).forEach(([categoryId, files]) => {
    if (files.length > 0) {
      const { folder } = CATEGORY_FOLDERS[categoryId];
      lines.push(`  // ${folder} (${files.length} files)`);
      
      files.forEach(filePath => {
        lines.push(`  '${filePath}': require('../../assets/audio/${filePath}'),`);
        count++;
      });
      
      lines.push('');
    }
  });

  const code = `// АВТОГЕНЕРИРОВАНО скриптом syncAudioFiles.js
// Дата: ${new Date().toLocaleString('ru-RU')}
// Всего файлов: ${count}

const TURKMEN_AUDIO: Record<string, any> = {
${lines.join('\n')}
};

export function getAudioSource(path: string | undefined): any {
  if (!path) return null;
  return TURKMEN_AUDIO[path] || null;
}

export function hasAudioFile(path: string | undefined): boolean {
  if (!path) return false;
  return path in TURKMEN_AUDIO;
}

export default TURKMEN_AUDIO;
`;

  const outputPath = path.join(__dirname, '../src/data/audioMapping.ts');
  fs.writeFileSync(outputPath, code, 'utf8');
  
  console.log(`✅ Создан audioMapping.ts с ${count} файлами\n`);
}

// Шаг 3: Обновляем phrases.ts
function updatePhrases(audioFiles) {
  console.log('🔄 Обновляем phrases.ts...\n');
  
  const phrasesPath = path.join(__dirname, '../src/data/phrases.ts');
  let phrasesContent = fs.readFileSync(phrasesPath, 'utf8');
  
  let updatedCount = 0;
  let missingCount = 0;
  
  // Для каждой категории создаём свой счётчик
  Object.entries(CATEGORY_FOLDERS).forEach(([categoryId, { folder, num }]) => {
    const categoryFiles = audioFiles[categoryId] || [];
    
    if (categoryFiles.length === 0) {
      console.log(`⚠️  ${folder}: нет файлов, пропускаем`);
      return;
    }
    
    // Находим все фразы этой категории в файле
    const categoryRegex = new RegExp(
      `categoryId:\\s*["']${categoryId}["'][\\s\\S]*?audioFileTurkmen:\\s*([^,\\n]+)`,
      'g'
    );
    
    let counter = 1;
    let match;
    
    // Создаём временную копию для поиска
    let tempContent = phrasesContent;
    let lastIndex = 0;
    
    while ((match = categoryRegex.exec(tempContent)) !== null) {
      const oldAudioPath = match[1].trim();
      
      // Проверяем есть ли файл для этой фразы
      if (counter <= categoryFiles.length) {
        const newAudioPath = `"${folder}/turkmen/${num}.${counter}.mp3"`;
        
        // Заменяем только если путь отличается
        if (oldAudioPath !== newAudioPath) {
          // Находим точное место в оригинальном контенте
          const beforeMatch = tempContent.substring(lastIndex, match.index);
          const searchPattern = `categoryId: "${categoryId}"`;
          const categoryStart = phrasesContent.indexOf(searchPattern, lastIndex);
          
          if (categoryStart !== -1) {
            const audioPattern = /audioFileTurkmen:\s*[^,\n]+/;
            const audioMatch = phrasesContent.substring(categoryStart).match(audioPattern);
            
            if (audioMatch) {
              const audioStart = categoryStart + audioMatch.index;
              const audioEnd = audioStart + audioMatch[0].length;
              
              phrasesContent = 
                phrasesContent.substring(0, audioStart) +
                `audioFileTurkmen: ${newAudioPath}` +
                phrasesContent.substring(audioEnd);
              
              updatedCount++;
            }
          }
        }
        counter++;
      } else {
        // Файла нет - ставим undefined
        if (oldAudioPath !== 'undefined') {
          const searchPattern = `categoryId: "${categoryId}"`;
          const categoryStart = phrasesContent.indexOf(searchPattern, lastIndex);
          
          if (categoryStart !== -1) {
            const audioPattern = /audioFileTurkmen:\s*[^,\n]+/;
            const audioMatch = phrasesContent.substring(categoryStart).match(audioPattern);
            
            if (audioMatch) {
              const audioStart = categoryStart + audioMatch.index;
              const audioEnd = audioStart + audioMatch[0].length;
              
              phrasesContent = 
                phrasesContent.substring(0, audioStart) +
                `audioFileTurkmen: undefined` +
                phrasesContent.substring(audioEnd);
              
              missingCount++;
            }
          }
        }
        counter++;
      }
      
      lastIndex = match.index + match[0].length;
    }
    
    console.log(`✅ ${folder}: обработано ${counter - 1} фраз, файлов: ${categoryFiles.length}`);
  });
  
  // Сохраняем обновлённый файл
  fs.writeFileSync(phrasesPath, phrasesContent, 'utf8');
  
  console.log(`\n✅ phrases.ts обновлён:`);
  console.log(`   - Обновлено путей: ${updatedCount}`);
  console.log(`   - Установлено undefined: ${missingCount}\n`);
}

// ЗАПУСК
console.log('🚀 Начинаем синхронизацию аудио файлов...\n');
console.log('=' . repeat(50) + '\n');

try {
  const audioFiles = scanAudioFiles();
  generateAudioMapping(audioFiles);
  updatePhrases(audioFiles);
  
  console.log('=' . repeat(50));
  console.log('\n✅ СИНХРОНИЗАЦИЯ ЗАВЕРШЕНА УСПЕШНО!\n');
  console.log('Следующие шаги:');
  console.log('1. Проверьте src/data/audioMapping.ts');
  console.log('2. Проверьте src/data/phrases.ts');
  console.log('3. Запустите: npx expo start');
  console.log('4. Протестируйте воспроизведение аудио\n');
  
} catch (error) {
  console.error('\n❌ ОШИБКА:', error.message);
  console.error(error.stack);
  process.exit(1);
}