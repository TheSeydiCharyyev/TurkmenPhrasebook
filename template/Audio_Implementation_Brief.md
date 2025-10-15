# 🇨🇳🇹🇲 Chinese Phrasebook - Audio Implementation Brief

**Дата:** 15 октября 2025  
**Задача:** Реализация аудио системы с динамической загрузкой  
**Статус:** Готов к реализации

---

## 📱 О ПРОЕКТЕ (кратко)

**Название:** Chinese Phrasebook (Китайский разговорник)  
**Цель:** Помочь туркменским туристам в Китае  
**Платформы:** React Native + Expo  
**Языки интерфейса:** Русский, Туркменский, Китайский  
**Фразы:** 447 фраз в 22 категориях  
**Статус проекта:** 95% готов, финальная полировка

---

## 🎵 ТЕКУЩАЯ СИТУАЦИЯ С АУДИО

### **Что есть сейчас:**
- ✅ **Туркменские аудио:** ВСЕ 447 файлов готовы (но с НЕПРАВИЛЬНЫМИ именами!)
- ✅ **Китайские аудио:** 3 категории готовы (1. Greetings, 2. Emergency, 3. Food)
- ⏳ **Остальные китайские:** будут добавляться постепенно по 10-20 в день (ограничение TTS - 50 файлов/день)

### **Структура папок уже создана:**
```
assets/audio/
├── 1. Greetings/          ✅ Готово (китайский + туркменский)
│   ├── chinese/
│   │   └── phrase_XXX.mp3
│   └── turkmen/
│       └── phrase_XXX.mp3
├── 2. Emergency/          ✅ Готово (китайский + туркменский)
├── 3. Food/               ✅ Готово (китайский + туркменский)
├── 4. Transport/          ⏳ Будет добавлено позже
├── 5. Shopping/           ⏳ Будет добавлено позже
└── ... (всего 22 категории)
```

### **Проблема с именами файлов:**
- Туркменские файлы названы неправильно (например: `salam.mp3`, `hoş.mp3`)
- Должны быть: `phrase_001.mp3`, `phrase_002.mp3`, `phrase_003.mp3` и т.д.
- Имена должны **ТОЧНО совпадать** с путями в `src/data/phrases.ts`

### **Стратегия пользователя:**
1. ✅ Скопирует ОДНО китайское аудио (например "你好") во ВСЕ категории с правильными именами
2. ✅ Постепенно будет ЗАМЕНЯТЬ временные файлы на настоящие TTS (10-20 в день)
3. ✅ Переименует туркменские файлы в правильный формат
4. ✅ Все файлы будут физически существовать → код будет работать всегда

---

## 🎯 ЗАДАЧА ДЛЯ CLAUDE

### ⚠️ ВАЖНО! ЧИТАЙ ВНИМАТЕЛЬНО!

**Пользователь НЕ ХОЧЕТ:**
- ❌ Долгих объяснений "а почему так, а не эдак"
- ❌ Вопросов типа "может лучше по-другому?"
- ❌ Предложений альтернативных решений

**Пользователь ХОЧЕТ:**
- ✅ Чтобы ты ПРОСТО СДЕЛАЛ то, что написано ниже
- ✅ Быстро, четко, без лишних слов
- ✅ Работающий код

---

## 📝 ЧТО НУЖНО СДЕЛАТЬ (ПОШАГОВО)

### **ШАГ 1: Создать файл `src/data/audioMapping.ts`** ⭐⭐⭐

Этот файл делает маппинг аудио через **switch/case** для 22 категорий (вместо 894 строк ручного маппинга).

**СОЗДАЙ НОВЫЙ ФАЙЛ:** `src/data/audioMapping.ts`

```typescript
// src/data/audioMapping.ts
// 🤖 Динамический маппинг аудио файлов через switch/case
// Вместо 894 строк ручного маппинга - всего 22 case!

/**
 * Получить require() для аудио файла по пути
 * @param path - путь типа "1. Greetings/chinese/phrase_001.mp3"
 * @returns - require() модуль или null если файл не найден
 */
export function getAudioSource(path: string): any {
  // Парсим путь: "1. Greetings/chinese/phrase_001.mp3"
  const match = path.match(/^(.+?)\/(chinese|turkmen)\/phrase_(\d+)\.mp3$/);
  
  if (!match) {
    console.warn('[AudioMapping] Invalid audio path format:', path);
    return null;
  }

  const [, category, lang, phraseId] = match;

  // Switch для всех 22 категорий
  try {
    switch(category) {
      case '1. Greetings':
        return require(`../../assets/audio/1. Greetings/${lang}/phrase_${phraseId}.mp3`);
      
      case '2. Emergency':
        return require(`../../assets/audio/2. Emergency/${lang}/phrase_${phraseId}.mp3`);
      
      case '3. Hotel':
        return require(`../../assets/audio/3. Hotel/${lang}/phrase_${phraseId}.mp3`);
      
      case '4. Food':
        return require(`../../assets/audio/4. Food/${lang}/phrase_${phraseId}.mp3`);
      
      case '5. Shopping':
        return require(`../../assets/audio/5. Shopping/${lang}/phrase_${phraseId}.mp3`);
      
      case '6. Transport':
        return require(`../../assets/audio/6. Transport/${lang}/phrase_${phraseId}.mp3`);
      
      case '7. Directions':
        return require(`../../assets/audio/7. Directions/${lang}/phrase_${phraseId}.mp3`);
      
      case '8. Health':
        return require(`../../assets/audio/8. Health/${lang}/phrase_${phraseId}.mp3`);
      
      case '9. Money':
        return require(`../../assets/audio/9. Money/${lang}/phrase_${phraseId}.mp3`);
      
      case '10. Communication':
        return require(`../../assets/audio/10. Communication/${lang}/phrase_${phraseId}.mp3`);
      
      case '11. Entertainment':
        return require(`../../assets/audio/11. Entertainment/${lang}/phrase_${phraseId}.mp3`);
      
      case '12. Time':
        return require(`../../assets/audio/12. Time/${lang}/phrase_${phraseId}.mp3`);
      
      case '13. Numbers':
        return require(`../../assets/audio/13. Numbers/${lang}/phrase_${phraseId}.mp3`);
      
      case '14. Weather':
        return require(`../../assets/audio/14. Weather/${lang}/phrase_${phraseId}.mp3`);
      
      case '15. Personal_info':
        return require(`../../assets/audio/15. Personal_info/${lang}/phrase_${phraseId}.mp3`);
      
      case '16. Business':
        return require(`../../assets/audio/16. Business/${lang}/phrase_${phraseId}.mp3`);
      
      case '17. Measurements':
        return require(`../../assets/audio/17. Measurements/${lang}/phrase_${phraseId}.mp3`);
      
      case '18. Colors':
        return require(`../../assets/audio/18. Colors/${lang}/phrase_${phraseId}.mp3`);
      
      case '19. Body':
        return require(`../../assets/audio/19. Body/${lang}/phrase_${phraseId}.mp3`);
      
      case '20. Home':
        return require(`../../assets/audio/20. Home/${lang}/phrase_${phraseId}.mp3`);
      
      case '21. Customs':
        return require(`../../assets/audio/21. Customs/${lang}/phrase_${phraseId}.mp3`);
      
      case '22. Sport':
        return require(`../../assets/audio/22. Sport/${lang}/phrase_${phraseId}.mp3`);
      
      default:
        console.warn('[AudioMapping] Unknown category:', category);
        return null;
    }
  } catch (error) {
    // Файл не найден - это нормально, пользователь добавит позже
    console.log(`[AudioMapping] Audio file not found: ${path}`);
    return null;
  }
}

/**
 * Проверить существование аудио файла
 */
export function hasAudioFile(path: string): boolean {
  return getAudioSource(path) !== null;
}
```

---

### **ШАГ 2: Переписать `src/hooks/useAudio.ts`** ⭐⭐

**УДАЛИ:** Весь старый код с ручным `AUDIO_FILES` маппингом

**ЗАМЕНИ НА:**

```typescript
// src/hooks/useAudio.ts
// ✅ ОБНОВЛЕНО: Используем динамический audioMapping

import { useState, useCallback, useEffect, useRef } from 'react';
import { Audio } from 'expo-av';
import { getAudioSource } from '../data/audioMapping';

export function useAudio() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const soundRef = useRef<Audio.Sound | null>(null);

  // Инициализация аудио режима
  useEffect(() => {
    const initAudio = async () => {
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          playsInSilentModeIOS: true,
          staysActiveInBackground: false,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false,
        });
      } catch (error) {
        console.warn('Audio initialization failed:', error);
      }
    };
    initAudio();
  }, []);

  // Очистка при размонтировании
  useEffect(() => {
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync().catch(console.warn);
      }
    };
  }, []);

  /**
   * Воспроизведение MP3 файла
   * @param audioPath - путь к аудио файлу, например: '1. Greetings/chinese/phrase_001.mp3'
   */
  const playAudio = useCallback(async (audioPath: string) => {
    if (isPlaying || isLoading) return;

    try {
      setIsLoading(true);

      // Останавливаем предыдущее аудио
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }

      // ✅ Используем новый audioMapping
      const audioSource = getAudioSource(audioPath);
      
      if (!audioSource) {
        // Файл не найден - это нормально, пользователь добавит позже
        setIsLoading(false);
        return;
      }

      // Создаём Sound и воспроизводим
      const { sound } = await Audio.Sound.createAsync(
        audioSource,
        { shouldPlay: true, volume: 1.0, rate: 1.0 }
      );

      soundRef.current = sound;

      // Callback на завершение
      sound.setOnPlaybackStatusUpdate((status: any) => {
        if (status.isLoaded && status.didJustFinish) {
          setIsPlaying(false);
          setIsLoading(false);
        }
      });

      setIsPlaying(true);
      setIsLoading(false);

    } catch (error) {
      console.error('[useAudio] Playback error:', error);
      setIsPlaying(false);
      setIsLoading(false);
    }
  }, [isPlaying, isLoading]);

  /**
   * Остановка воспроизведения
   */
  const stopAudio = useCallback(async () => {
    try {
      if (soundRef.current) {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }
      setIsPlaying(false);
      setIsLoading(false);
    } catch (error) {
      console.warn('[useAudio] Stop error:', error);
    }
  }, []);

  return {
    isPlaying,
    isLoading,
    playAudio,
    stopAudio,
  };
}
```

---

### **ШАГ 3: Упростить `src/components/AudioPlayer.tsx`** ⭐

**НАЙДИ и УДАЛИ:** Все проверки типа `if (!hasAudio) return <View>Аудио нет</View>`

**ПРИНЦИП:** Кнопки аудио ВСЕГДА видны и кликабельны. Если файла нет - просто ничего не происходит.

**ОСНОВНЫЕ ИЗМЕНЕНИЯ:**

```typescript
// src/components/AudioPlayer.tsx

// ❌ УДАЛИ эту проверку:
if (!audioFile) {
  return <View>Аудио недоступно</View>;
}

// ✅ ЗАМЕНИ НА:
const handlePress = async () => {
  if (!audioFile) return; // Просто выходим, кнопка остаётся видимой
  await playAudio(audioFile);
};

// Кнопка ВСЕГДА отображается
return (
  <TouchableOpacity onPress={handlePress} style={styles.button}>
    <Ionicons name="play" size={24} color={Colors.primary} />
  </TouchableOpacity>
);
```

---

### **ШАГ 4: Упростить `src/screens/CategoryScreen.tsx`** ⭐

**НАЙДИ компонент `PhraseItem`**

**ИЗМЕНИ обработчики аудио:**

```typescript
// ✅ ИСПРАВЛЕННЫЙ код для CategoryScreen.tsx

const handlePlayChinese = useCallback(() => {
  if (phrase.audioFileChinese) {
    playAudio(phrase.audioFileChinese);
  }
}, [phrase.audioFileChinese, playAudio]);

const handlePlayTurkmen = useCallback(() => {
  if (phrase.audioFileTurkmen) {
    playAudio(phrase.audioFileTurkmen);
  }
}, [phrase.audioFileTurkmen, playAudio]);

// Кнопки ВСЕГДА видны (не проверяем существование файла)
```

---

### **ШАГ 5: Упростить `src/screens/PhraseDetailScreen.tsx`** ⭐

Аналогично CategoryScreen - убрать все проверки `hasAudio`, кнопки всегда видны.

---

### **ШАГ 6: Обновить `src/services/AudioService.ts`** (если используется)

Если этот файл используется в проекте - обнови его аналогично `useAudio.ts`:

```typescript
import { getAudioSource } from '../data/audioMapping';

async play(audioPath: string): Promise<void> {
  const audioSource = getAudioSource(audioPath);
  if (!audioSource) return; // Файл не найден - выходим
  
  const { sound } = await Audio.Sound.createAsync(audioSource);
  await sound.playAsync();
}
```

---

## 🔧 СКРИПТ ДЛЯ ПЕРЕИМЕНОВАНИЯ (Бонус)

Пользователь будет переименовывать файлы ВРУЧНУЮ, но если хочешь помочь - можешь предложить простой скрипт:

**СОЗДАЙ:** `scripts/renameAudioFiles.js`

```javascript
// scripts/renameAudioFiles.js
// Скрипт для переименования аудио файлов в формат phrase_XXX.mp3

const fs = require('fs');
const path = require('path');

const AUDIO_DIR = path.join(__dirname, '../assets/audio');

// Импортируем phrases чтобы узнать правильные имена
const { phrases } = require('../src/data/phrases');

function renameAudioFiles() {
  console.log('🔄 Starting audio files renaming...\n');
  
  phrases.forEach((phrase, index) => {
    const categoryPath = phrase.audioFileChinese?.split('/')[0];
    
    if (categoryPath) {
      const chinesePath = path.join(AUDIO_DIR, categoryPath, 'chinese');
      const turkmenPath = path.join(AUDIO_DIR, categoryPath, 'turkmen');
      
      // Проверяем существование папок
      if (fs.existsSync(chinesePath)) {
        const files = fs.readdirSync(chinesePath);
        if (files.length > index) {
          const oldPath = path.join(chinesePath, files[index]);
          const newName = `phrase_${String(phrase.id.split('_')[1]).padStart(3, '0')}.mp3`;
          const newPath = path.join(chinesePath, newName);
          
          if (fs.existsSync(oldPath) && !fs.existsSync(newPath)) {
            fs.renameSync(oldPath, newPath);
            console.log(`✅ Renamed: ${files[index]} → ${newName}`);
          }
        }
      }
      
      // Аналогично для туркменского
      if (fs.existsSync(turkmenPath)) {
        // ... тот же код для turkmen
      }
    }
  });
  
  console.log('\n✅ Renaming completed!');
}

renameAudioFiles();
```

**Команда в package.json:**
```json
{
  "scripts": {
    "rename-audio": "node scripts/renameAudioFiles.js"
  }
}
```

**НО!** Пользователь сказал что сделает вручную, так что этот скрипт - опционально!

---

## ✅ ЧЕКЛИСТ ДЛЯ CLAUDE

Перед отправкой кода убедись:

- [ ] ✅ Создан файл `src/data/audioMapping.ts` с 22 case
- [ ] ✅ Переписан `src/hooks/useAudio.ts` - убран ручной маппинг
- [ ] ✅ Упрощён `src/components/AudioPlayer.tsx` - кнопки всегда видны
- [ ] ✅ Упрощён `src/screens/CategoryScreen.tsx` - убраны проверки hasAudio
- [ ] ✅ Упрощён `src/screens/PhraseDetailScreen.tsx` - убраны проверки hasAudio
- [ ] ✅ Обновлён `src/services/AudioService.ts` (если используется)
- [ ] ✅ Код работает если файл НЕ найден (просто ничего не играет)
- [ ] ✅ Код работает если файл найден (нормально воспроизводит)
- [ ] ✅ Никаких алертов, ошибок, сообщений "файл не найден"

---

## 💬 ЧТО СКАЗАТЬ ПОЛЬЗОВАТЕЛЮ ПОСЛЕ ВЫПОЛНЕНИЯ

```
✅ Готово! Реализовал аудио систему:

1. ✅ Создан audioMapping.ts с switch для 22 категорий
2. ✅ Переписан useAudio.ts - теперь использует динамический маппинг
3. ✅ Упрощены все компоненты - кнопки всегда видны
4. ✅ Если файл не найден - просто ничего не играет (без ошибок)

**Что тебе делать дальше:**
1. Скопируй одно китайское аудио во все категории (с правильными именами)
2. Переименуй туркменские файлы в phrase_001.mp3, phrase_002.mp3, etc.
3. Запусти приложение - все кнопки должны работать
4. Постепенно заменяй временные китайские файлы на настоящие TTS

Готово к тестированию! 🚀
```

---

## 📋 ДОПОЛНИТЕЛЬНАЯ ИНФОРМАЦИЯ

### **О проекте (краткая справка):**
- **Дизайн:** Цвета флагов (красный Китая #DE2910, зеленый Туркменистана #00843D)
- **НЕ МЕНЯТЬ:** Цвета, треугольные кнопки, порядок языков
- **Архитектура:** React Native + Expo, TypeScript, React Navigation
- **Данные:** src/data/phrases.ts (447 фраз), src/data/categories.ts (22 категории)

### **Ключевые файлы проекта:**
```
src/
├── data/
│   ├── phrases.ts          # 447 фраз с путями к аудио
│   ├── categories.ts       # 22 категории
│   └── audioMapping.ts     # ← СОЗДАШЬ ЭТОТ ФАЙЛ!
├── hooks/
│   └── useAudio.ts         # ← ПЕРЕПИШЕШЬ ЭТОТ ФАЙЛ!
├── components/
│   └── AudioPlayer.tsx     # ← УПРОСТИШЬ ЭТОТ ФАЙЛ!
└── screens/
    ├── CategoryScreen.tsx  # ← УПРОСТИШЬ ЭТОТ ФАЙЛ!
    └── PhraseDetailScreen.tsx
```

---

**Всё! Действуй! Никаких вопросов - просто делай! 🚀**