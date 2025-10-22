// 🚀 СУПЕР-СКРИПТ ДЛЯ ИСПРАВЛЕНИЯ АУДИО ПУТЕЙ
// Исправляет все пути в phrases.ts чтобы совпадали с audioMapping.ts

const fs = require('fs');
const path = require('path');

console.log('╔════════════════════════════════════════════════════╗');
console.log('║  🎯 ИСПРАВЛЕНИЕ ПУТЕЙ К АУДИО В PHRASES.TS       ║');
console.log('╚════════════════════════════════════════════════════╝\n');

// Маппинг категорий: старый путь → новый путь
const CATEGORY_PATH_MAPPING = {
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

function fixAudioPaths() {
  const phrasesPath = path.join(__dirname, 'src/data/phrases.ts');
  
  // Проверяем существование файла
  if (!fs.existsSync(phrasesPath)) {
    console.error('❌ ОШИБКА: Файл не найден:', phrasesPath);
    console.log('\n💡 Убедитесь что скрипт запущен из корня проекта!');
    process.exit(1);
  }

  console.log('📂 Читаем файл phrases.ts...');
  let content = fs.readFileSync(phrasesPath, 'utf8');
  console.log(`✅ Файл прочитан (${content.length} символов)\n`);

  // Создаём бэкап
  const backupPath = phrasesPath + '.backup';
  fs.writeFileSync(backupPath, content, 'utf8');
  console.log('💾 Создан бэкап:', backupPath);
  console.log('   (На случай если что-то пойдёт не так)\n');

  // Статистика
  let totalReplacements = 0;
  const replacementsByCategory = {};

  console.log('🔄 Начинаем замену путей...\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  // Заменяем пути для каждой категории
  Object.entries(CATEGORY_PATH_MAPPING).forEach(([oldPath, newPath]) => {
    // Экранируем точки в старом пути для регулярного выражения
    const escapedOldPath = oldPath.replace(/\./g, '\\.');
    
    // Ищем все вхождения старого пути в audioFileTurkmen
    const regex = new RegExp(`audioFileTurkmen: "${escapedOldPath}/`, 'g');
    
    // Подсчитываем количество вхождений
    const matches = content.match(regex);
    const count = matches ? matches.length : 0;
    
    if (count > 0) {
      // Выполняем замену
      content = content.replace(regex, `audioFileTurkmen: "${newPath}/`);
      
      totalReplacements += count;
      replacementsByCategory[oldPath] = count;
      
      console.log(`✅ ${oldPath.padEnd(25)} → ${newPath.padEnd(20)} (${count} замен)`);
    }
  });

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // Сохраняем изменённый файл
  fs.writeFileSync(phrasesPath, content, 'utf8');
  
  console.log('📊 ИТОГИ:');
  console.log(`   ✅ Всего выполнено замен: ${totalReplacements}`);
  console.log(`   ✅ Обработано категорий: ${Object.keys(replacementsByCategory).length}`);
  console.log(`   ✅ Файл сохранён: phrases.ts\n`);

  // Проверяем что все пути исправлены
  const remainingOldPaths = content.match(/audioFileTurkmen: "\d+\. /g);
  
  if (remainingOldPaths && remainingOldPaths.length > 0) {
    console.log('⚠️  ВНИМАНИЕ: Остались неисправленные пути!');
    console.log(`   Найдено: ${remainingOldPaths.length} старых путей`);
    console.log('   Проверьте файл вручную.\n');
  } else {
    console.log('✅ ВСЕ ПУТИ УСПЕШНО ИСПРАВЛЕНЫ!\n');
  }

  console.log('╔════════════════════════════════════════════════════╗');
  console.log('║  🎉 ГОТОВО!                                       ║');
  console.log('╚════════════════════════════════════════════════════╝\n');

  console.log('📋 СЛЕДУЮЩИЕ ШАГИ:');
  console.log('   1. Проверьте src/data/phrases.ts');
  console.log('   2. Запустите: npx expo start');
  console.log('   3. Проверьте что аудио работает');
  console.log('   4. Если всё ОК, пересоберите APK:');
  console.log('      eas build --platform android --profile preview\n');
  
  console.log('💡 СОВЕТ:');
  console.log('   Если что-то пошло не так, восстановите из бэкапа:');
  console.log(`   cp ${backupPath} ${phrasesPath}\n`);
}

// Запускаем скрипт
try {
  fixAudioPaths();
} catch (error) {
  console.error('❌ КРИТИЧЕСКАЯ ОШИБКА:', error.message);
  console.error(error.stack);
  process.exit(1);
}