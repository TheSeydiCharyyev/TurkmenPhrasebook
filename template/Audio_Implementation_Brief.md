# 🇨🇳🇹🇲 Chinese Phrasebook - Audio Implementation Brief

**Дата:** 15 октября 2025  
**Задача:** Гибридная аудио система (MP3 + TTS)  
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

## 🎵 НОВАЯ СТРАТЕГИЯ АУДИО (ГИБРИД!)

### **Решение:**
- ✅ **Туркменский (основной)** → MP3 файлы офлайн (447 файлов)
- ✅ **Китайский** → Expo Speech TTS (генерация на лету!)
- ✅ **Русский** → Expo Speech TTS

### **Почему так:**
1. 💾 **Размер APK:** ~30 MB вместо 150 MB (экономия 120 MB!)
2. ⚡ **Быстро реализовать:** ~1.5 часа работы (вместо 12 часов)
3. 🎯 **Туркменский главный:** качественное аудио для основного языка
4. 🌍 **Легко добавить языки:** японский/корейский просто добавляются в TTS
5. 🚀 **Не тормозит релиз:** можно билдить сегодня-завтра

### **Что есть сейчас:**
- ✅ **Туркменские аудио:** ВСЕ 447 файлов (с неправильными именами - нужно переименовать)
- ❌ **Китайские MP3:** НЕ НУЖНЫ! Используем TTS
- ❌ **Русские MP3:** НЕ НУЖНЫ! Используем TTS

### **Структура папок (УПРОЩЁННАЯ!):**
```
assets/audio/
└── turkmen/               ← ТОЛЬКО ТУРКМЕНСКИЙ!
    ├── 1. Greetings/
    │   └── phrase_001.mp3
    ├── 2. Emergency/
    │   └── phrase_007.mp3
    ├── 3. Food/
    │   └── phrase_017.mp3
    └── ... (22 категории, 447 файлов)
```

**Китайские и русские папки НЕ НУЖНЫ!** 🎉

### **Проблема с именами файлов:**
- Туркменские файлы названы неправильно (например: `salam.mp3`, `hoş.mp3`)
- Должны быть: `phrase_001.mp3`, `phrase_002.mp3` и т.д.
- Имена должны **ТОЧНО совпадать** с полем `audioFileTurkmen` в `phrases.ts`
- Пользователь переименует вручную

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
- ✅ Работающий код за 1.5 часа

---

## 📝 ЧТО НУЖНО СДЕЛАТЬ (ПОШАГОВО)

### **ШАГ 1: Установить Expo Speech** ⭐

```bash
npx expo install expo-speech
```

Время: 2 минуты

---

### **ШАГ 2: Переписать `src/hooks/useAudio.ts`** ⭐⭐⭐

**УДАЛИ:** Весь старый код

**ЗАМЕНИ НА:**

```typescript
// src/hooks/useAudio.ts
// ✅ ГИБРИДНАЯ СИСТЕМА: MP3 (туркменский) + TTS (китайский, русский)

import { useState, useCallback, useEffect, useRef } from 'react';
import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';
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
      Speech.stop();
    };
  }, []);

  /**
   * Воспроизведение аудио (гибрид MP3 + TTS)
   * @param text - текст для произношения
   * @param language - 'chinese' | 'turkmen' | 'russian'
   * @param audioPath - путь к MP3 (только для туркменского!)
   */
  const playAudio = useCallback(async (text: string, language: 'chinese' | 'turkmen' | 'russian', audioPath?: string) => {
    if (isPlaying || isLoading) return;

    try {
      setIsLoading(true);

      // Останавливаем предыдущее воспроизведение
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }
      Speech.stop();

      // ✅ ТУРКМЕНСКИЙ - используем MP3
      if (language === 'turkmen' && audioPath) {
        const audioSource = getAudioSource(audioPath);
        
        if (audioSource) {
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
          return;
        }
      }

      // ✅ КИТАЙСКИЙ и РУССКИЙ - используем TTS
      const languageCode = language === 'chinese' ? 'zh-CN' : 'ru-RU';
      
      setIsPlaying(true);
      setIsLoading(false);

      await Speech.speak(text, {
        language: languageCode,
        rate: 0.85,        // Скорость речи
        pitch: 1.0,        // Высота голоса
        onDone: () => {
          setIsPlaying(false);
        },
        onStopped: () => {
          setIsPlaying(false);
        },
        onError: () => {
          setIsPlaying(false);
          console.warn(`TTS error for ${language}`);
        },
      });

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
      Speech.stop();
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

Время: 30 минут

---

### **ШАГ 3: Упростить `src/data/audioMapping.ts`** ⭐⭐

**УДАЛИ:** Все case для китайского

**ОСТАВЬ:** Только туркменский

```typescript
// src/data/audioMapping.ts
// ✅ УПРОЩЕНО: Маппинг только для туркменского (MP3)
// Китайский и русский используют TTS - файлы не нужны!

/**
 * Получить require() для туркменского MP3 файла
 * @param path - путь типа "turkmen/1. Greetings/phrase_001.mp3"
 * @returns - require() модуль или null если файл не найден
 */
export function getAudioSource(path: string): any {
  // Проверяем что это туркменский
  if (!path || !path.startsWith('turkmen/')) {
    console.warn('[AudioMapping] Not a turkmen path:', path);
    return null;
  }

  // Парсим путь: "turkmen/1. Greetings/phrase_001.mp3"
  const match = path.match(/^turkmen\/(.+?)\/phrase_(\d+)\.mp3$/);
  
  if (!match) {
    console.warn('[AudioMapping] Invalid path format:', path);
    return null;
  }

  const [, category, phraseId] = match;

  // Switch для всех 22 категорий (ТОЛЬКО ТУРКМЕНСКИЙ!)
  try {
    switch(category) {
      case '1. Greetings':
        return require(`../../assets/audio/turkmen/1. Greetings/phrase_${phraseId}.mp3`);
      
      case '2. Emergency':
        return require(`../../assets/audio/turkmen/2. Emergency/phrase_${phraseId}.mp3`);
      
      case '3. Hotel':
        return require(`../../assets/audio/turkmen/3. Hotel/phrase_${phraseId}.mp3`);
      
      case '4. Food':
        return require(`../../assets/audio/turkmen/4. Food/phrase_${phraseId}.mp3`);
      
      case '5. Shopping':
        return require(`../../assets/audio/turkmen/5. Shopping/phrase_${phraseId}.mp3`);
      
      case '6. Transport':
        return require(`../../assets/audio/turkmen/6. Transport/phrase_${phraseId}.mp3`);
      
      case '7. Directions':
        return require(`../../assets/audio/turkmen/7. Directions/phrase_${phraseId}.mp3`);
      
      case '8. Health':
        return require(`../../assets/audio/turkmen/8. Health/phrase_${phraseId}.mp3`);
      
      case '9. Money':
        return require(`../../assets/audio/turkmen/9. Money/phrase_${phraseId}.mp3`);
      
      case '10. Communication':
        return require(`../../assets/audio/turkmen/10. Communication/phrase_${phraseId}.mp3`);
      
      case '11. Entertainment':
        return require(`../../assets/audio/turkmen/11. Entertainment/phrase_${phraseId}.mp3`);
      
      case '12. Time':
        return require(`../../assets/audio/turkmen/12. Time/phrase_${phraseId}.mp3`);
      
      case '13. Numbers':
        return require(`../../assets/audio/turkmen/13. Numbers/phrase_${phraseId}.mp3`);
      
      case '14. Weather':
        return require(`../../assets/audio/turkmen/14. Weather/phrase_${phraseId}.mp3`);
      
      case '15. Personal_info':
        return require(`../../assets/audio/turkmen/15. Personal_info/phrase_${phraseId}.mp3`);
      
      case '16. Business':
        return require(`../../assets/audio/turkmen/16. Business/phrase_${phraseId}.mp3`);
      
      case '17. Measurements':
        return require(`../../assets/audio/turkmen/17. Measurements/phrase_${phraseId}.mp3`);
      
      case '18. Colors':
        return require(`../../assets/audio/turkmen/18. Colors/phrase_${phraseId}.mp3`);
      
      case '19. Body':
        return require(`../../assets/audio/turkmen/19. Body/phrase_${phraseId}.mp3`);
      
      case '20. Home':
        return require(`../../assets/audio/turkmen/20. Home/phrase_${phraseId}.mp3`);
      
      case '21. Customs':
        return require(`../../assets/audio/turkmen/21. Customs/phrase_${phraseId}.mp3`);
      
      case '22. Sport':
        return require(`../../assets/audio/turkmen/22. Sport/phrase_${phraseId}.mp3`);
      
      default:
        console.warn('[AudioMapping] Unknown category:', category);
        return null;
    }
  } catch (error) {
    // Файл не найден - пользователь добавит позже
    console.log(`[AudioMapping] Turkmen audio not found: ${path}`);
    return null;
  }
}

/**
 * Проверить существование туркменского аудио файла
 */
export function hasAudioFile(path: string): boolean {
  return getAudioSource(path) !== null;
}
```

Время: 20 минутки `hasAudio`, кнопки всегда видны.

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