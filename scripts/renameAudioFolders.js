// scripts/renameAudioFolders.js
const fs = require('fs');
const path = require('path');

const AUDIO_DIR = path.join(__dirname, '../assets/audio');

console.log('🔄 Переименование аудио папок...\n');

// Функция для безопасного имени (убираем пробелы и точки)
function sanitizeName(name) {
  return name
    .replace(/^\d+\.\s+/, '') // Убираем "1. " в начале
    .replace(/\s+/g, '_')     // Пробелы в подчеркивания
    .toLowerCase();           // В нижний регистр
}

// Читаем папки в audio/
const folders = fs.readdirSync(AUDIO_DIR).filter(item => {
  return fs.statSync(path.join(AUDIO_DIR, item)).isDirectory();
});

console.log(`📁 Найдено папок: ${folders.length}\n`);

let renamed = 0;

folders.forEach(folder => {
  const oldPath = path.join(AUDIO_DIR, folder);
  const newName = sanitizeName(folder);
  const newPath = path.join(AUDIO_DIR, newName);
  
  if (folder !== newName) {
    try {
      fs.renameSync(oldPath, newPath);
      console.log(`✅ ${folder} → ${newName}`);
      renamed++;
    } catch (error) {
      console.error(`❌ Ошибка при переименовании ${folder}:`, error.message);
    }
  } else {
    console.log(`⏭️  ${folder} - уже правильное имя`);
  }
});

console.log(`\n✨ Готово! Переименовано: ${renamed} папок\n`);
console.log('🔄 Теперь запусти: node scripts/syncAudioFiles.js');