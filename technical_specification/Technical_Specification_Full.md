# 📋 ТЕХНИЧЕСКОЕ ЗАДАНИЕ: TURKMEN PHRASEBOOK
## Универсальный туркменский разговорник с 30 языками + Visual Translator

---

## 🎯 КОНТЕКСТ ПРОЕКТА

**Кто ты:**
Ты 10-летний senior React Native разработчик с глубоким опытом в:
- Архитектуре масштабируемых приложений
- Лучших практиках React Native / Expo
- Безопасности и производительности
- Мультиязычных приложениях
- Работе с аудио и медиа
- Computer Vision и AI интеграции

**Твоя задача:**
Трансформировать существующее китайско-туркменское приложение-разговорник в универсальный туркменский разговорник, поддерживающий 30 языков с возможностью постепенного добавления новых языков, а также добавить революционную функцию Visual Translator с OCR и AI для перевода текста с фотографий.

---

## 📊 ТЕКУЩЕЕ СОСТОЯНИЕ ПРОЕКТА

### **Существующее приложение:**
- **Название:** Chinese Phrasebook
- **Технологии:** React Native (Expo SDK 54), TypeScript
- **Структура:** 305 фраз, 22 категории, ~50 подкатегорий
- **Языки:** Китайский ↔ Туркменский (с русским как вспомогательным)
- **Аудио:** 286 MP3 файлов для туркменского, TTS для китайского и русского
- **Статус:** 90% готово к релизу

### **Файловая структура:**
```
ChinesePhrasebook2/
├── src/
│   ├── data/
│   │   ├── phrases.ts          // 305 фраз с переводами
│   │   ├── categories.ts       // 22 категории
│   │   ├── audioMapping.ts     // Маппинг MP3 файлов
│   │   └── subcategories/      // Подкатегории
│   ├── components/             // UI компоненты
│   ├── screens/                // Экраны приложения
│   ├── hooks/                  // useAudio, useConfig и др.
│   ├── contexts/               // ConfigContext (язык, тема)
│   ├── services/               // AudioService, StorageService
│   ├── types/                  // TypeScript типы
│   └── constants/              // Константы приложения
├── assets/
│   └── audio/                  // MP3 файлы (22 папки × turkmen)
└── scripts/                    // Утилиты (syncAudioFiles.js и др.)
```

---

## 🎯 ЦЕЛЬ ПРОЕКТА

### **Главная цель:**
Создать универсальное приложение "Turkmen Phrasebook" с поддержкой 30 языков, где туркменский язык всегда является основным, а пользователь выбирает один дополнительный язык для изучения. Также добавить инновационную функцию Visual Translator для перевода текста с фотографий с использованием OCR и AI.

### **Ключевые особенности:**
- 🌍 **30 языков** (постепенное добавление)
- 🎯 **Туркменский всегда основной** (фиксированный)
- 🔄 **Мгновенное переключение** между языками
- 📱 **OTA обновления** для добавления новых языков
- 🎵 **Гибридная аудио система** (MP3 для туркменского, TTS для остальных)
- 📸 **Visual Translator** (OCR + AI перевод с фотографий)
- 🤖 **AI-powered features** (описание объектов, контекстный перевод)
- 🎨 **Современный UI/UX** с выбором языка

### **Дедлайн первого релиза:**
12 декабря 2025 (через ~1.5 месяца) - в честь 30-летия нейтралитета Туркменистана

---

## 🌍 СПИСОК 30 ЯЗЫКОВ

```
1. Китайский (中文)
2. Японский (日本語)
3. Корейский (한국어)
4. Тайский (ไทย)
5. Вьетнамский (Tiếng Việt)
6. Индонезийский (Bahasa Indonesia)
7. Малайский (Bahasa Melayu)
8. Хинди (हिन्दी)
9. Урду (اردو)
10. Персидский (فارسی)
11. Пушту (پښتو)
12. Русский (Русский)
13. Английский (English)
14. Немецкий (Deutsch)
15. Французский (Français)
16. Испанский (Español)
17. Итальянский (Italiano)
18. Турецкий (Türkçe)
19. Польский (Polski)
20. Украинский (Українська)
21. Армянский (Հայերեն)
22. Грузинский (ქართული)
23. Арабский (العربية)
24. Узбекский (O'zbek)
25. Казахский (Қазақ)
26. Азербайджанский (Azərbaycan)
27. Киргизский (Кыргыз)
28. Таджикский (Тоҷикӣ)
29. Португальский (Português)
30. Голландский (Nederlands)
```

---

## 🏗️ АРХИТЕКТУРНЫЕ РЕШЕНИЯ

### **1. СТРУКТУРА ДАННЫХ - ПЕРЕВОДЫ ФРАЗ**

**Подход: Отдельные файлы по языкам**

```
src/data/languages/
├── base.ts                    // Базовые туркменские фразы + метаданные
├── translations/
│   ├── chinese.ts            // Переводы на китайский
│   ├── japanese.ts           // Переводы на японский
│   ├── korean.ts             // Переводы на корейский
│   ├── russian.ts            // Переводы на русский
│   ├── english.ts            // Переводы на английский
│   └── ...                   // 25 файлов для остальных языков
└── index.ts                  // Агрегация всех языков
```

**Формат base.ts:**
```typescript
// src/data/languages/base.ts
export const basePhrases: BasePhrase[] = [
  {
    id: "phrase_001",
    categoryId: "greetings",
    subcategoryId: "greetings_basic",
    turkmen: "Salam",
    audioFileTurkmen: "greetings/turkmen/1.1.mp3",
    order: 1
  },
  // ... 305 фраз
];
```

**Формат translations/chinese.ts:**
```typescript
// src/data/languages/translations/chinese.ts
import { LanguageTranslation } from '../../types';

export const chineseTranslations: LanguageTranslation[] = [
  {
    phraseId: "phrase_001",
    text: "你好",
    transcription: "nǐ hǎo"
  },
  // ... 305 переводов
];
```

**Типы:**
```typescript
// src/types/index.ts
export interface BasePhrase {
  id: string;
  categoryId: string;
  subcategoryId?: string;
  turkmen: string;
  audioFileTurkmen?: string;
  order: number;
}

export interface LanguageTranslation {
  phraseId: string;
  text: string;
  transcription?: string;
}

export interface Phrase extends BasePhrase {
  translation: {
    text: string;
    transcription?: string;
  };
}
```

**Преимущества:**
- ✅ Легко добавлять новые языки (один файл = один язык)
- ✅ Удобно для OTA обновлений (обновлять только один язык)
- ✅ Не загружаем неиспользуемые языки
- ✅ Простота редактирования и проверки переводов

---

### **2. КОНФИГУРАЦИЯ ЯЗЫКОВ**

**Файл: src/config/languages.config.ts**

```typescript
// src/config/languages.config.ts
export interface LanguageConfig {
  code: string;              // ISO 639-1 код (zh, ja, en...)
  name: string;              // Название на родном языке (中文, 日本語...)
  nameEn: string;            // Название на английском
  nameTk: string;            // Название на туркменском
  flag: string;              // Emoji флаг
  isAvailable: boolean;      // Доступен ли язык
  hasTranscription: boolean; // Есть ли транскрипция
  ttsCode: string;           // Код для TTS (zh-CN, ja-JP...)
  direction: 'ltr' | 'rtl';  // Направление письма
  ocrSupported: boolean;     // Поддержка OCR для Visual Translator
}

export const LANGUAGES: LanguageConfig[] = [
  {
    code: 'zh',
    name: '中文',
    nameEn: 'Chinese',
    nameTk: 'Hytaý dili',
    flag: '🇨🇳',
    isAvailable: true,
    hasTranscription: true,
    ttsCode: 'zh-CN',
    direction: 'ltr',
    ocrSupported: true
  },
  {
    code: 'ja',
    name: '日本語',
    nameEn: 'Japanese',
    nameTk: 'Ýapon dili',
    flag: '🇯🇵',
    isAvailable: false, // Coming soon
    hasTranscription: true,
    ttsCode: 'ja-JP',
    direction: 'ltr',
    ocrSupported: true
  },
  {
    code: 'ru',
    name: 'Русский',
    nameEn: 'Russian',
    nameTk: 'Rus dili',
    flag: '🇷🇺',
    isAvailable: true,
    hasTranscription: true,
    ttsCode: 'ru-RU',
    direction: 'ltr',
    ocrSupported: true
  },
  {
    code: 'en',
    name: 'English',
    nameEn: 'English',
    nameTk: 'Iňlis dili',
    flag: '🇬🇧',
    isAvailable: true,
    hasTranscription: false,
    ttsCode: 'en-US',
    direction: 'ltr',
    ocrSupported: true
  },
  {
    code: 'ar',
    name: 'العربية',
    nameEn: 'Arabic',
    nameTk: 'Arap dili',
    flag: '🇸🇦',
    isAvailable: false,
    hasTranscription: true,
    ttsCode: 'ar-SA',
    direction: 'rtl',
    ocrSupported: true
  },
  // ... остальные 25 языков
];

// Вспомогательные функции
export const getLanguageByCode = (code: string): LanguageConfig | undefined => {
  return LANGUAGES.find(lang => lang.code === code);
};

export const getAvailableLanguages = (): LanguageConfig[] => {
  return LANGUAGES.filter(lang => lang.isAvailable);
};

export const getComingSoonLanguages = (): LanguageConfig[] => {
  return LANGUAGES.filter(lang => !lang.isAvailable);
};

export const getOCRSupportedLanguages = (): LanguageConfig[] => {
  return LANGUAGES.filter(lang => lang.ocrSupported && lang.isAvailable);
};

export const getLanguageProgress = (): { available: number; total: number; percentage: number } => {
  const available = LANGUAGES.filter(lang => lang.isAvailable).length;
  const total = LANGUAGES.length;
  return {
    available,
    total,
    percentage: Math.round((available / total) * 100)
  };
};
```

**TTS коды для всех 30 языков:**
```typescript
const TTS_CODES = {
  zh: 'zh-CN',    // Китайский (упрощенный)
  ja: 'ja-JP',    // Японский
  ko: 'ko-KR',    // Корейский
  th: 'th-TH',    // Тайский
  vi: 'vi-VN',    // Вьетнамский
  id: 'id-ID',    // Индонезийский
  ms: 'ms-MY',    // Малайский
  hi: 'hi-IN',    // Хинди
  ur: 'ur-PK',    // Урду
  fa: 'fa-IR',    // Персидский
  ps: 'ps-AF',    // Пушту
  ru: 'ru-RU',    // Русский
  en: 'en-US',    // Английский
  de: 'de-DE',    // Немецкий
  fr: 'fr-FR',    // Французский
  es: 'es-ES',    // Испанский
  it: 'it-IT',    // Итальянский
  tr: 'tr-TR',    // Турецкий
  pl: 'pl-PL',    // Польский
  uk: 'uk-UA',    // Украинский
  hy: 'hy-AM',    // Армянский
  ka: 'ka-GE',    // Грузинский
  ar: 'ar-SA',    // Арабский
  uz: 'uz-UZ',    // Узбекский
  kk: 'kk-KZ',    // Казахский
  az: 'az-AZ',    // Азербайджанский
  ky: 'ky-KG',    // Киргизский
  tg: 'tg-TJ',    // Таджикский
  pt: 'pt-PT',    // Португальский
  nl: 'nl-NL'     // Голландский
};
```

---

### **3. КАТЕГОРИИ И ПОДКАТЕГОРИИ**

**Обновлённая структура categories.ts:**

```typescript
// src/data/categories.ts
import { LanguageConfig } from '../config/languages.config';

export interface CategoryTranslations {
  tk: string;
  [languageCode: string]: string;
}

export interface Category {
  id: string;
  icon: string;
  color: string;
  translations: CategoryTranslations;
  hasSubcategories: boolean;
  subcategories?: string[];
}

export const categories: Category[] = [
  {
    id: 'greetings',
    icon: 'hand-wave-outline',
    color: '#10B981',
    translations: {
      tk: 'Salamlaşmak',
      zh: '问候',
      ru: 'Приветствия',
      en: 'Greetings',
      ja: '挨拶',
      tr: 'Selamlaşma',
      ar: 'تحيات',
      // ... переводы добавляются по мере активации языка
    },
    hasSubcategories: true,
    subcategories: ['greetings_basic', 'greetings_formal']
  },
  // ... 21 категория
];

// Вспомогательная функция для получения названия категории
export const getCategoryName = (
  category: Category,
  languageCode: string,
  fallbackLanguage: string = 'en'
): string => {
  return category.translations[languageCode]
    || category.translations[fallbackLanguage]
    || category.translations.tk;
};
```

---

### **4. CONTEXT API - УПРАВЛЕНИЕ ЯЗЫКОМ**

**Обновлённый ConfigContext:**

```typescript
// src/contexts/ConfigContext.tsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getLanguageByCode, LANGUAGES } from '../config/languages.config';

interface ConfigContextType {
  selectedLanguage: string;      // Код выбранного языка (zh, ja, en...)
  setSelectedLanguage: (code: string) => Promise<void>;
  turkmenLanguage: string;       // Всегда 'tk' (фиксированный)
  isLoading: boolean;
  isFirstLaunch: boolean;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

const STORAGE_KEY_LANGUAGE = '@turkmen_phrasebook:selected_language';
const STORAGE_KEY_FIRST_LAUNCH = '@turkmen_phrasebook:first_launch';

export const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedLanguage, setSelectedLanguageState] = useState<string>('zh'); // Default
  const [isLoading, setIsLoading] = useState(true);
  const [isFirstLaunch, setIsFirstLaunch] = useState(true);

  // Загрузка сохранённого языка при запуске
  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const [savedLanguage, firstLaunch] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEY_LANGUAGE),
        AsyncStorage.getItem(STORAGE_KEY_FIRST_LAUNCH)
      ]);

      if (savedLanguage) {
        setSelectedLanguageState(savedLanguage);
        setIsFirstLaunch(false);
      } else {
        setIsFirstLaunch(firstLaunch === null);
      }
    } catch (error) {
      console.error('Failed to load config:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setSelectedLanguage = async (code: string) => {
    try {
      // Проверяем что язык доступен
      const language = getLanguageByCode(code);
      if (!language?.isAvailable) {
        throw new Error(`Language ${code} is not available`);
      }

      setSelectedLanguageState(code);
      await AsyncStorage.multiSet([
        [STORAGE_KEY_LANGUAGE, code],
        [STORAGE_KEY_FIRST_LAUNCH, 'false']
      ]);
      setIsFirstLaunch(false);
    } catch (error) {
      console.error('Failed to save language:', error);
      throw error;
    }
  };

  return (
    <ConfigContext.Provider
      value={{
        selectedLanguage,
        setSelectedLanguage,
        turkmenLanguage: 'tk',
        isLoading,
        isFirstLaunch
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error('useConfig must be used within ConfigProvider');
  }
  return context;
};
```

---

### **5. HOOKS - РАБОТА С ФРАЗАМИ**

**Новый хук usePhrases:**

```typescript
// src/hooks/usePhrases.ts
import { useMemo } from 'react';
import { useConfig } from '../contexts/ConfigContext';
import { basePhrases } from '../data/languages/base';
import { getTranslationsForLanguage } from '../data/languages';
import { Phrase } from '../types';

export const usePhrases = () => {
  const { selectedLanguage } = useConfig();

  const phrases = useMemo(() => {
    const translations = getTranslationsForLanguage(selectedLanguage);

    return basePhrases.map(basePhrase => {
      const translation = translations.find(t => t.phraseId === basePhrase.id);

      return {
        ...basePhrase,
        translation: translation || {
          text: basePhrase.turkmen, // Fallback to English if not available
          transcription: undefined
        }
      } as Phrase;
    });
  }, [selectedLanguage]);

  const getPhrasesByCategory = (categoryId: string): Phrase[] => {
    return phrases.filter(phrase => phrase.categoryId === categoryId);
  };

  const getPhrasesBySubcategory = (subcategoryId: string): Phrase[] => {
    return phrases.filter(phrase => phrase.subcategoryId === subcategoryId);
  };

  const getPhraseById = (id: string): Phrase | undefined => {
    return phrases.find(phrase => phrase.id === id);
  };

  return {
    phrases,
    getPhrasesByCategory,
    getPhrasesBySubcategory,
    getPhraseById
  };
};
```

**Агрегация переводов:**

```typescript
// src/data/languages/index.ts
import { chineseTranslations } from './translations/chinese';
import { russianTranslations } from './translations/russian';
import { englishTranslations } from './translations/english';
// ... импорты остальных языков

import { LanguageTranslation } from '../../types';

const translationsMap: Record<string, LanguageTranslation[]> = {
  zh: chineseTranslations,
  ru: russianTranslations,
  en: englishTranslations,
  // ... остальные языки
};

export const getTranslationsForLanguage = (languageCode: string): LanguageTranslation[] => {
  return translationsMap[languageCode] || [];
};

export const hasTranslationsForLanguage = (languageCode: string): boolean => {
  return languageCode in translationsMap;
};
```

---

### **6. АУДИО СИСТЕМА**

**Обновлённый useAudio hook:**

```typescript
// src/hooks/useAudio.ts
import { useState, useCallback, useEffect, useRef } from 'react';
import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';
import { getAudioSource } from '../data/audioMapping';
import { getLanguageByCode } from '../config/languages.config';

export function useAudio() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const soundRef = useRef<Audio.Sound | null>(null);

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

  useEffect(() => {
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync().catch(console.warn);
      }
      Speech.stop();
    };
  }, []);

  /**
   * Воспроизведение аудио
   * @param text - текст для произношения
   * @param languageCode - код языка (tk, zh, ja, en...)
   * @param audioPath - путь к MP3 (только для туркменского)
   */
  const playAudio = useCallback(async (
    text: string,
    languageCode: string,
    audioPath?: string
  ) => {
    if (isPlaying || isLoading) return;

    try {
      setIsLoading(true);

      // Останавливаем предыдущее воспроизведение
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }
      Speech.stop();

      // ТУРКМЕНСКИЙ - используем MP3
      if (languageCode === 'tk' && audioPath) {
        const audioSource = getAudioSource(audioPath);

        if (audioSource) {
          const { sound } = await Audio.Sound.createAsync(
            audioSource,
            { shouldPlay: true, volume: 1.0, rate: 1.0 }
          );

          soundRef.current = sound;

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

      // ОСТАЛЬНЫЕ ЯЗЫКИ - используем TTS
      const language = getLanguageByCode(languageCode);
      if (!language) {
        throw new Error(`Language ${languageCode} not found`);
      }

      setIsPlaying(true);
      setIsLoading(false);

      await Speech.speak(text, {
        language: language.ttsCode,
        rate: 0.85,
        pitch: 1.0,
        onDone: () => setIsPlaying(false),
        onStopped: () => setIsPlaying(false),
        onError: () => {
          setIsPlaying(false);
          console.warn(`TTS error for ${languageCode}`);
        },
      });

    } catch (error) {
      console.error('[useAudio] Playback error:', error);
      setIsPlaying(false);
      setIsLoading(false);
    }
  }, [isPlaying, isLoading]);

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

---

## 📸 VISUAL TRANSLATOR - НОВАЯ РЕВОЛЮЦИОННАЯ ФУНКЦИЯ

### **Обзор функции:**

Visual Translator - это мощная функция, позволяющая пользователям фотографировать текст или объекты и мгновенно получать переводы с использованием OCR (оптическое распознавание символов) и AI-технологий.

### **Практические сценарии использования:**

1. **Турист в Китае:**
   - Видит вывеску на китайском → фотографирует → получает перевод на английский/туркменский
   - Смотрит меню в ресторане → сканирует → понимает блюда

2. **Таможенный офицер:**
   - Получает документы на арабском → сканирует → переводит на туркменский
   - Проверяет товары с иностранными этикетками

3. **Обычный пользователь:**
   - Видит интересную надпись/знак → переводит мгновенно
   - Изучает иностранные продукты в магазине

### **Технологический стек (100% БЕСПЛАТНЫЕ API):**

#### **1. OCR (Распознавание текста):**

**Google ML Kit Text Recognition (БЕСПЛАТНО)**
- Онлайн распознавание текста
- Поддержка: Китайский, Английский, Русский, Японский, Корейский, Арабский и др.
- Высокая точность распознавания
- Бесплатный для большинства случаев использования

```typescript
// Пример интеграции
import vision from '@react-native-ml-kit/text-recognition';

async function recognizeText(imagePath: string) {
  const result = await vision.recognize(imagePath);
  return {
    text: result.text,
    blocks: result.blocks,
    language: result.recognizedLanguages
  };
}
```

#### **2. Translation API:**

**MyMemory Translation API (БЕСПЛАТНО - 10,000 слов/день)**
- RESTful API
- Поддержка 30+ языков
- Лимит: 10,000 слов в день бесплатно
- Отличное качество перевода

**LibreTranslate (100% БЕСПЛАТНО, Open Source)**
- Альтернатива или запасной вариант
- Полностью бесплатный
- Можно развернуть свой сервер

```typescript
// MyMemory API интеграция
const API_URL = 'https://api.mymemory.translated.net/get';

async function translate(text: string, from: string, to: string) {
  const response = await fetch(
    `${API_URL}?q=${encodeURIComponent(text)}&langpair=${from}|${to}`
  );
  const data = await response.json();
  return data.responseData.translatedText;
}
```

#### **3. AI Features (Hugging Face Inference API - БЕСПЛАТНО):**

**A) Умное описание объектов:**

Используется для случаев, когда на фото нет текста или текст не распознан.

**Model: BLIP (Salesforce/blip-image-captioning-base)**
- AI описывает объект на фото
- Пример: фото сумки → "black leather handbag"
- Затем описание переводится на целевой язык
- Workflow: Фото → AI описание → Перевод описания

```typescript
const HF_API = 'https://api-inference.huggingface.co/models/';

async function describeImage(imageBase64: string) {
  const response = await fetch(
    HF_API + 'Salesforce/blip-image-captioning-base',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ inputs: imageBase64 })
    }
  );
  const result = await response.json();
  return result[0].generated_text;
}
```

**B) Контекстно-зависимый перевод:**

**Model: NLLB-200 или mBART**
- Не просто дословный перевод
- AI понимает контекст и даёт лучший перевод
- Пример: "Bank" → понимает из контекста: финансовый банк или берег реки

**C) Распознавание категории:**

**Model: CLIP или ResNet**
- AI определяет категорию изображения
- Категории: "food", "clothing", "document", "sign", "product", "other"
- Помогает пользователю быстро понять, что на фото
- Может предлагать релевантную категорию из разговорника

```typescript
async function categorizeImage(imageBase64: string) {
  const response = await fetch(
    HF_API + 'openai/clip-vit-base-patch32',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        inputs: imageBase64,
        parameters: {
          candidate_labels: ["food", "clothing", "document", "sign", "product", "other"]
        }
      })
    }
  );
  const result = await response.json();
  return result;
}
```

---

### **Архитектура Visual Translator:**

```
src/
├── features/
│   └── visual-translator/
│       ├── screens/
│       │   ├── VisualTranslatorScreen.tsx    // Главный экран с камерой
│       │   └── TranslationResultScreen.tsx   // Экран результатов
│       ├── services/
│       │   ├── OCRService.ts                 // Google ML Kit обёртка
│       │   ├── TranslationService.ts         // MyMemory + LibreTranslate
│       │   └── AIService.ts                  // Hugging Face API
│       ├── hooks/
│       │   ├── useOCR.ts                     // Хук для OCR
│       │   ├── useTranslation.ts             // Хук для переводов
│       │   └── useAI.ts                      // Хук для AI функций
│       ├── components/
│       │   ├── CameraView.tsx                // Компонент камеры
│       │   ├── TextOverlay.tsx               // Наложение текста на фото
│       │   ├── ResultCard.tsx                // Карточка результата
│       │   ├── LanguageSelector.tsx          // Выбор целевого языка
│       │   └── LoadingIndicator.tsx          // Индикатор загрузки
│       └── types/
│           └── visual-translator.types.ts    // TypeScript типы
```

---

### **TypeScript типы для Visual Translator:**

```typescript
// src/features/visual-translator/types/visual-translator.types.ts

export interface OCRResult {
  text: string;
  language: string;
  confidence: number;
  boundingBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  blocks?: TextBlock[];
}

export interface TextBlock {
  text: string;
  boundingBox: BoundingBox;
  lines: TextLine[];
}

export interface TextLine {
  text: string;
  boundingBox: BoundingBox;
  elements: TextElement[];
}

export interface TextElement {
  text: string;
  boundingBox: BoundingBox;
}

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface AIDescription {
  description: string;
  category: 'food' | 'clothing' | 'document' | 'sign' | 'product' | 'other';
  confidence: number;
}

export interface TranslationResult {
  originalText: string;
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
  aiDescription?: AIDescription;
  timestamp: number;
  imageUri?: string;
}

export interface VisualTranslatorHistory {
  id: string;
  result: TranslationResult;
  savedAt: number;
}
```

---

### **Workflow Visual Translator:**

```
Пользовательское действие → Обработка → Результат

1. Пользователь открывает Visual Translator
2. Выбирает действие:
   - Сфотографировать (Camera)
   - Выбрать из галереи (Gallery)
3. Выбирает целевой язык перевода
4. Приложение обрабатывает:
   a) OCR извлекает текст с фото (Google ML Kit)
   b) Если текст не найден → AI описывает объект (BLIP)
   c) Translation API переводит текст/описание
   d) AI улучшает перевод с учётом контекста
   e) AI определяет категорию изображения
5. Показывается результат:
   - Оригинальное изображение (миниатюра)
   - Распознанный текст (если есть)
   - AI описание объекта (если применимо)
   - Перевод на целевой язык
   - Категория (badge)
   - Действия: Сохранить, Поделиться, Новое фото
```

---

### **Сервисы:**

#### **OCRService.ts**

```typescript
// src/features/visual-translator/services/OCRService.ts
import vision from '@react-native-ml-kit/text-recognition';
import { OCRResult } from '../types/visual-translator.types';

class OCRService {
  /**
   * Распознает текст на изображении
   * @param imagePath - путь к изображению
   * @returns OCRResult с распознанным текстом
   */
  async recognizeText(imagePath: string): Promise<OCRResult> {
    try {
      const result = await vision.recognize(imagePath);

      return {
        text: result.text,
        language: result.recognizedLanguages?.[0] || 'unknown',
        confidence: this.calculateConfidence(result.blocks),
        blocks: result.blocks.map(block => ({
          text: block.text,
          boundingBox: block.frame,
          lines: block.lines.map(line => ({
            text: line.text,
            boundingBox: line.frame,
            elements: line.elements.map(elem => ({
              text: elem.text,
              boundingBox: elem.frame
            }))
          }))
        }))
      };
    } catch (error) {
      console.error('[OCRService] Recognition error:', error);
      throw new Error('Failed to recognize text');
    }
  }

  /**
   * Проверяет, содержит ли изображение текст
   */
  async hasText(imagePath: string): Promise<boolean> {
    const result = await this.recognizeText(imagePath);
    return result.text.trim().length > 0;
  }

  /**
   * Рассчитывает среднюю уверенность распознавания
   */
  private calculateConfidence(blocks: any[]): number {
    if (!blocks || blocks.length === 0) return 0;

    // Google ML Kit не всегда предоставляет confidence
    // Можно использовать эвристику на основе количества распознанных блоков
    return Math.min(blocks.length * 0.15, 1.0);
  }
}

export default new OCRService();
```

#### **TranslationService.ts**

```typescript
// src/features/visual-translator/services/TranslationService.ts

const MYMEMORY_API = 'https://api.mymemory.translated.net/get';
const LIBRETRANSLATE_API = 'https://libretranslate.com/translate';

class TranslationService {
  /**
   * Переводит текст используя MyMemory API
   */
  async translateWithMyMemory(
    text: string,
    fromLang: string,
    toLang: string
  ): Promise<string> {
    try {
      const response = await fetch(
        `${MYMEMORY_API}?q=${encodeURIComponent(text)}&langpair=${fromLang}|${toLang}`
      );

      if (!response.ok) {
        throw new Error('MyMemory API error');
      }

      const data = await response.json();

      if (data.responseStatus !== 200) {
        throw new Error(data.responseDetails || 'Translation failed');
      }

      return data.responseData.translatedText;
    } catch (error) {
      console.error('[TranslationService] MyMemory error:', error);
      throw error;
    }
  }

  /**
   * Переводит текст используя LibreTranslate (запасной вариант)
   */
  async translateWithLibreTranslate(
    text: string,
    fromLang: string,
    toLang: string
  ): Promise<string> {
    try {
      const response = await fetch(LIBRETRANSLATE_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: text,
          source: fromLang,
          target: toLang,
        }),
      });

      if (!response.ok) {
        throw new Error('LibreTranslate API error');
      }

      const data = await response.json();
      return data.translatedText;
    } catch (error) {
      console.error('[TranslationService] LibreTranslate error:', error);
      throw error;
    }
  }

  /**
   * Умный перевод с автоматическим fallback
   */
  async translate(
    text: string,
    fromLang: string,
    toLang: string
  ): Promise<string> {
    try {
      // Сначала пробуем MyMemory (лучшее качество)
      return await this.translateWithMyMemory(text, fromLang, toLang);
    } catch (error) {
      console.warn('[TranslationService] Falling back to LibreTranslate');

      try {
        // Если MyMemory не работает, используем LibreTranslate
        return await this.translateWithLibreTranslate(text, fromLang, toLang);
      } catch (fallbackError) {
        console.error('[TranslationService] All translation services failed');
        throw new Error('Translation failed. Please check your internet connection.');
      }
    }
  }

  /**
   * Определяет язык текста
   */
  async detectLanguage(text: string): Promise<string> {
    try {
      const response = await fetch(
        `${MYMEMORY_API}?q=${encodeURIComponent(text.substring(0, 100))}&langpair=auto|en`
      );
      const data = await response.json();

      // MyMemory возвращает detected language в matches
      if (data.matches && data.matches.length > 0) {
        return data.matches[0].source;
      }

      return 'unknown';
    } catch (error) {
      console.error('[TranslationService] Language detection error:', error);
      return 'unknown';
    }
  }
}

export default new TranslationService();
```

#### **AIService.ts**

```typescript
// src/features/visual-translator/services/AIService.ts
import { AIDescription } from '../types/visual-translator.types';

const HF_API_BASE = 'https://api-inference.huggingface.co/models/';

// Можно добавить API токен для более высоких лимитов
// const HF_API_TOKEN = 'YOUR_HUGGING_FACE_TOKEN'; // Опционально

class AIService {
  /**
   * Описывает содержимое изображения
   */
  async describeImage(imageUri: string): Promise<string> {
    try {
      // Конвертируем изображение в base64
      const imageBase64 = await this.imageToBase64(imageUri);

      const response = await fetch(
        HF_API_BASE + 'Salesforce/blip-image-captioning-base',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `Bearer ${HF_API_TOKEN}`, // Опционально
          },
          body: JSON.stringify({ inputs: imageBase64 }),
        }
      );

      if (!response.ok) {
        throw new Error('Image description failed');
      }

      const result = await response.json();

      if (Array.isArray(result) && result.length > 0) {
        return result[0].generated_text;
      }

      throw new Error('Invalid response from AI service');
    } catch (error) {
      console.error('[AIService] Image description error:', error);
      throw error;
    }
  }

  /**
   * Определяет категорию изображения
   */
  async categorizeImage(imageUri: string): Promise<AIDescription> {
    try {
      const imageBase64 = await this.imageToBase64(imageUri);

      const categories = ['food', 'clothing', 'document', 'sign', 'product', 'other'];

      const response = await fetch(
        HF_API_BASE + 'openai/clip-vit-base-patch32',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            inputs: imageBase64,
            parameters: {
              candidate_labels: categories,
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Categorization failed');
      }

      const result = await response.json();

      // CLIP возвращает scores для каждой категории
      const topCategory = categories[result.indexOf(Math.max(...result))];
      const confidence = Math.max(...result);

      const description = await this.describeImage(imageUri);

      return {
        description,
        category: topCategory as any,
        confidence,
      };
    } catch (error) {
      console.error('[AIService] Categorization error:', error);

      // Fallback: просто описание без категоризации
      try {
        const description = await this.describeImage(imageUri);
        return {
          description,
          category: 'other',
          confidence: 0.5,
        };
      } catch (descError) {
        throw new Error('AI analysis failed');
      }
    }
  }

  /**
   * Конвертирует изображение в base64
   */
  private async imageToBase64(imageUri: string): Promise<string> {
    try {
      // Для React Native используем fetch API
      const response = await fetch(imageUri);
      const blob = await response.blob();

      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = reader.result as string;
          // Убираем data:image/...;base64, префикс
          resolve(base64.split(',')[1]);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('[AIService] Image to base64 error:', error);
      throw error;
    }
  }

  /**
   * Проверяет доступность AI сервисов
   */
  async checkAvailability(): Promise<boolean> {
    try {
      const response = await fetch(HF_API_BASE, { method: 'HEAD' });
      return response.ok;
    } catch (error) {
      return false;
    }
  }
}

export default new AIService();
```

---

### **Основные компоненты:**

#### **VisualTranslatorScreen.tsx**

```typescript
// src/features/visual-translator/screens/VisualTranslatorScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useConfig } from '../../../contexts/ConfigContext';
import OCRService from '../services/OCRService';
import TranslationService from '../services/TranslationService';
import AIService from '../services/AIService';
import { TranslationResult } from '../types/visual-translator.types';

export const VisualTranslatorScreen = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { selectedLanguage } = useConfig();
  const navigation = useNavigation();

  useEffect(() => {
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
    const { status: mediaStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    setHasPermission(cameraStatus === 'granted' && mediaStatus === 'granted');
  };

  const handleTakePhoto = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
        allowsEditing: false,
      });

      if (!result.canceled && result.assets[0]) {
        await processImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Camera error:', error);
      Alert.alert('Error', 'Failed to take photo');
    }
  };

  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
        allowsEditing: false,
      });

      if (!result.canceled && result.assets[0]) {
        await processImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Image picker error:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const processImage = async (imageUri: string) => {
    setIsProcessing(true);

    try {
      // 1. OCR - распознаём текст
      const ocrResult = await OCRService.recognizeText(imageUri);

      let translationResult: TranslationResult;

      if (ocrResult.text.trim().length > 0) {
        // Текст найден - переводим его
        const translatedText = await TranslationService.translate(
          ocrResult.text,
          ocrResult.language === 'unknown' ? 'auto' : ocrResult.language,
          selectedLanguage
        );

        translationResult = {
          originalText: ocrResult.text,
          translatedText,
          sourceLanguage: ocrResult.language,
          targetLanguage: selectedLanguage,
          timestamp: Date.now(),
          imageUri,
        };
      } else {
        // Текст не найден - используем AI для описания объекта
        const aiDescription = await AIService.categorizeImage(imageUri);

        const translatedDescription = await TranslationService.translate(
          aiDescription.description,
          'en', // AI описание на английском
          selectedLanguage
        );

        translationResult = {
          originalText: '',
          translatedText: translatedDescription,
          sourceLanguage: 'image',
          targetLanguage: selectedLanguage,
          aiDescription,
          timestamp: Date.now(),
          imageUri,
        };
      }

      // Переходим на экран результатов
      navigation.navigate('TranslationResult', { result: translationResult });

    } catch (error) {
      console.error('Processing error:', error);
      Alert.alert('Error', 'Failed to process image. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#10B981" />
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>
          Camera and photo library access is required
        </Text>
        <TouchableOpacity style={styles.button} onPress={requestPermissions}>
          <Text style={styles.buttonText}>Grant Permissions</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.title}>Visual Translator</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Instructions */}
      <View style={styles.instructions}>
        <Ionicons name="camera-outline" size={48} color="#10B981" />
        <Text style={styles.instructionsTitle}>Translate any text instantly</Text>
        <Text style={styles.instructionsText}>
          Take a photo or select from gallery to translate text or get AI description
        </Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.primaryButton]}
          onPress={handleTakePhoto}
          disabled={isProcessing}
        >
          <Ionicons name="camera" size={32} color="#FFFFFF" />
          <Text style={styles.actionButtonText}>Take Photo</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.secondaryButton]}
          onPress={handlePickImage}
          disabled={isProcessing}
        >
          <Ionicons name="images" size={32} color="#10B981" />
          <Text style={styles.actionButtonTextSecondary}>Select from Gallery</Text>
        </TouchableOpacity>
      </View>

      {/* Processing Indicator */}
      {isProcessing && (
        <View style={styles.processing}>
          <ActivityIndicator size="large" color="#10B981" />
          <Text style={styles.processingText}>Processing image...</Text>
        </View>
      )}

      {/* Features List */}
      <View style={styles.features}>
        <FeatureItem
          icon="text"
          title="OCR Text Recognition"
          description="Recognizes text in 30+ languages"
        />
        <FeatureItem
          icon="sparkles"
          title="AI Object Description"
          description="Describes objects when no text is found"
        />
        <FeatureItem
          icon="language"
          title="Smart Translation"
          description="Context-aware translation with AI"
        />
      </View>
    </SafeAreaView>
  );
};

const FeatureItem = ({ icon, title, description }) => (
  <View style={styles.featureItem}>
    <Ionicons name={icon} size={24} color="#10B981" style={styles.featureIcon} />
    <View style={styles.featureContent}>
      <Text style={styles.featureTitle}>{title}</Text>
      <Text style={styles.featureDescription}>{description}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  instructions: {
    alignItems: 'center',
    padding: 32,
  },
  instructionsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 16,
    marginBottom: 8,
  },
  instructionsText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  actions: {
    padding: 16,
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    borderRadius: 12,
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#10B981',
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#10B981',
  },
  actionButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  actionButtonTextSecondary: {
    fontSize: 18,
    fontWeight: '600',
    color: '#10B981',
  },
  processing: {
    alignItems: 'center',
    padding: 20,
  },
  processingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6B7280',
  },
  features: {
    padding: 16,
    marginTop: 'auto',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  featureIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  permissionText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#10B981',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
```

---

### **Настройки Visual Translator:**

```typescript
// src/features/visual-translator/config/settings.ts

export interface VisualTranslatorSettings {
  enableAI: boolean;              // Включить/выключить AI функции
  translationAPI: 'mymemory' | 'libretranslate';
  autoDetectLanguage: boolean;    // Авто-определение языка
  saveHistory: boolean;           // Сохранять историю переводов
  imageQuality: number;           // 0.1 - 1.0
}

export const DEFAULT_SETTINGS: VisualTranslatorSettings = {
  enableAI: true,
  translationAPI: 'mymemory',
  autoDetectLanguage: true,
  saveHistory: true,
  imageQuality: 0.8,
};
```

---

### **UI/UX Visual Translator:**

#### **1. Точка входа:**

- Новая вкладка "Visual Translator" в нижней навигации
- Иконка: Камера с символом перевода (translate icon)
- Badge "NEW" для привлечения внимания

#### **2. Экран камеры:**

- Полноэкранный режим камеры
- Кнопка "Take Photo" (большая, зелёная)
- Кнопка "Select from Gallery" (вторичная)
- Селектор целевого языка (вверху)
- Подсказки по использованию

#### **3. Экран результатов:**

**Компоненты:**
- Миниатюра оригинального изображения (верхняя часть)
- Карточка с распознанным текстом (если есть)
- AI описание объекта (если применимо)
- Badge категории ("food", "document", etc.)
- Перевод (крупным шрифтом)
- Кнопки действий:
  - Save (сохранить в историю)
  - Share (поделиться)
  - Copy (копировать перевод)
  - New Photo (новое фото)
  - Pronounce (озвучить перевод TTS)

#### **4. История переводов:**

- Список сохранённых переводов
- Фильтр по категориям
- Поиск по истории
- Возможность удаления

---

### **Ограничения и важные заметки:**

#### **Требования:**
- Интернет-соединение (все API онлайн)
- Разрешения: Camera, Photo Library

#### **Бесплатные лимиты:**
- **MyMemory:** 10,000 слов/день (достаточно для большинства пользователей)
- **Hugging Face:** Rate limited, но щедрые лимиты (можно использовать API token для повышения)
- **Google ML Kit:** Бесплатен для большинства случаев использования

#### **OCR точность зависит от:**
- Качества изображения
- Освещения
- Чёткости текста
- Языка (некоторые языки распознаются лучше)

#### **Языки с лучшей поддержкой OCR:**
1. Английский
2. Китайский (упрощённый и традиционный)
3. Японский
4. Корейский
5. Русский
6. Арабский
7. Французский, Немецкий, Испанский, Итальянский

---

### **Будущие улучшения Visual Translator:**

1. **Real-time перевод:**
   - Как в Google Translate (камера показывает перевод в реальном времени)
   - Требует оптимизации производительности

2. **Офлайн режим:**
   - Tesseract OCR для офлайн распознавания
   - Локальные модели переводов (ML Kit Translation)

3. **История переводов:**
   - Сохранение переводов в AsyncStorage
   - Экспорт истории (PDF, текст)

4. **Улучшенная категоризация:**
   - Связь с категориями разговорника
   - Предложение релевантных фраз из разговорника

5. **Голосовой ввод + визуальный перевод:**
   - Комбинация визуального и голосового перевода
   - Мультимодальный подход

---

## 🎨 UI/UX ИЗМЕНЕНИЯ

### **1. ЭКРАН ВЫБОРА ЯЗЫКА (LanguageSelectionScreen)**

**Новый экран: src/screens/LanguageSelectionScreen.tsx**

```typescript
// src/screens/LanguageSelectionScreen.tsx
import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LANGUAGES, getLanguageProgress } from '../config/languages.config';
import { useConfig } from '../contexts/ConfigContext';
import { useNavigation } from '@react-navigation/native';

export const LanguageSelectionScreen = () => {
  const { setSelectedLanguage } = useConfig();
  const navigation = useNavigation();
  const progress = getLanguageProgress();

  const handleLanguageSelect = async (code: string, isAvailable: boolean) => {
    if (!isAvailable) {
      // Показать toast: "Coming soon!"
      return;
    }

    try {
      await setSelectedLanguage(code);
      navigation.navigate('Home' as never);
    } catch (error) {
      console.error('Failed to select language:', error);
    }
  };

  const renderLanguageItem = ({ item }) => {
    const isAvailable = item.isAvailable;

    return (
      <TouchableOpacity
        style={[
          styles.languageItem,
          !isAvailable && styles.languageItemDisabled
        ]}
        onPress={() => handleLanguageSelect(item.code, isAvailable)}
        activeOpacity={isAvailable ? 0.7 : 1}
      >
        <View style={styles.languageContent}>
          <Text style={styles.flag}>{item.flag}</Text>
          <View style={styles.languageInfo}>
            <Text style={[
              styles.languageName,
              !isAvailable && styles.textDisabled
            ]}>
              {item.name}
            </Text>
            <Text style={[
              styles.languageNameEn,
              !isAvailable && styles.textDisabled
            ]}>
              {item.nameEn}
            </Text>
          </View>
        </View>

        {isAvailable ? (
          <Ionicons name="checkmark-circle" size={24} color="#10B981" />
        ) : (
          <View style={styles.comingSoon}>
            <Ionicons name="lock-closed" size={16} color="#9CA3AF" />
            <Text style={styles.comingSoonText}>Coming soon</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Select Language</Text>
        <Text style={styles.subtitle}>
          Choose a language to start learning Turkmen
        </Text>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${progress.percentage}%` }
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            {progress.available} / {progress.total} languages available
          </Text>
        </View>
      </View>

      {/* Language List */}
      <FlatList
        data={LANGUAGES}
        renderItem={renderLanguageItem}
        keyExtractor={item => item.code}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 16,
  },
  progressContainer: {
    marginTop: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
    textAlign: 'center',
  },
  listContent: {
    padding: 16,
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  languageItemDisabled: {
    opacity: 0.5,
    backgroundColor: '#F3F4F6',
  },
  languageContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  flag: {
    fontSize: 32,
    marginRight: 16,
  },
  languageInfo: {
    flex: 1,
  },
  languageName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  languageNameEn: {
    fontSize: 14,
    color: '#6B7280',
  },
  textDisabled: {
    color: '#9CA3AF',
  },
  comingSoon: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  comingSoonText: {
    fontSize: 12,
    color: '#9CA3AF',
    marginLeft: 4,
  },
});
```

---

### **2. ОБНОВЛЕНИЕ ГЛАВНОГО ЭКРАНА (HomeScreen)**

**Добавить индикатор выбранного языка в шапке:**

```typescript
// src/screens/HomeScreen.tsx (фрагмент)
import { useConfig } from '../contexts/ConfigContext';
import { getLanguageByCode } from '../config/languages.config';

export const HomeScreen = () => {
  const { selectedLanguage, turkmenLanguage } = useConfig();
  const selectedLang = getLanguageByCode(selectedLanguage);
  const turkmenLang = getLanguageByCode(turkmenLanguage);

  return (
    <SafeAreaView style={styles.container}>
      {/* Language Header */}
      <View style={styles.languageHeader}>
        <View style={styles.languageIndicator}>
          <Text style={styles.flagLarge}>{selectedLang?.flag}</Text>
          <Text style={styles.languageCode}>{selectedLang?.name}</Text>
        </View>

        <Ionicons name="swap-horizontal" size={24} color="#6B7280" />

        <View style={styles.languageIndicator}>
          <Text style={styles.flagLarge}>{turkmenLang?.flag}</Text>
          <Text style={styles.languageCode}>Türkmen</Text>
        </View>

        <TouchableOpacity
          style={styles.changeLanguageButton}
          onPress={() => navigation.navigate('LanguageSelection' as never)}
        >
          <Ionicons name="settings-outline" size={20} color="#6B7280" />
        </TouchableOpacity>
      </View>

      {/* Rest of the home screen */}
      {/* ... */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  languageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  languageIndicator: {
    alignItems: 'center',
  },
  flagLarge: {
    fontSize: 32,
  },
  languageCode: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  changeLanguageButton: {
    position: 'absolute',
    right: 16,
    padding: 8,
  },
});
```

---

### **3. ОБНОВЛЕНИЕ PhraseItem КОМПОНЕНТА**

**Показывать перевод на выбранный язык + транскрипцию:**

```typescript
// src/components/PhraseItem.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Phrase } from '../types';
import { useConfig } from '../contexts/ConfigContext';
import { useAudio } from '../hooks/useAudio';

interface PhraseItemProps {
  phrase: Phrase;
  onPress: (phrase: Phrase) => void;
}

export const PhraseItem: React.FC<PhraseItemProps> = ({ phrase, onPress }) => {
  const { selectedLanguage } = useConfig();
  const { playAudio, isPlaying } = useAudio();

  const handlePlayTurkmen = () => {
    playAudio(phrase.turkmen, 'tk', phrase.audioFileTurkmen);
  };

  const handlePlayTranslation = () => {
    playAudio(phrase.translation.text, selectedLanguage);
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(phrase)}
      activeOpacity={0.7}
    >
      {/* Туркменский (всегда сверху) */}
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.audioButton}
          onPress={handlePlayTurkmen}
        >
          <Ionicons
            name={isPlaying ? "pause-circle" : "play-circle"}
            size={28}
            color="#10B981"
          />
        </TouchableOpacity>

        <View style={styles.textContainer}>
          <Text style={styles.turkmenText}>{phrase.turkmen}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      {/* Перевод на выбранный язык */}
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.audioButton}
          onPress={handlePlayTranslation}
        >
          <Ionicons
            name="volume-high"
            size={24}
            color="#6B7280"
          />
        </TouchableOpacity>

        <View style={styles.textContainer}>
          <Text style={styles.translationText}>
            {phrase.translation.text}
          </Text>
          {phrase.translation.transcription && (
            <Text style={styles.transcription}>
              {phrase.translation.transcription}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  audioButton: {
    marginRight: 12,
    padding: 4,
  },
  textContainer: {
    flex: 1,
  },
  turkmenText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 12,
  },
  translationText: {
    fontSize: 16,
    color: '#374151',
  },
  transcription: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
    fontStyle: 'italic',
  },
});
```

---

## 🔐 БЕЗОПАСНОСТЬ И ЛУЧШИЕ ПРАКТИКИ

### **1. Валидация данных:**

```typescript
// src/utils/validation.ts
import { LanguageConfig } from '../config/languages.config';

export const validateLanguageCode = (code: string): boolean => {
  return /^[a-z]{2}$/.test(code);
};

export const validatePhrase = (phrase: any): boolean => {
  return (
    typeof phrase.id === 'string' &&
    typeof phrase.turkmen === 'string' &&
    phrase.turkmen.length > 0
  );
};

export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};
```

### **2. Error Boundaries:**

```typescript
// src/components/ErrorBoundary.tsx
import React, { Component, ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('ErrorBoundary caught:', error, errorInfo);
    // TODO: Отправить в Firebase Analytics
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Oops! Something went wrong</Text>
          <Text style={styles.message}>
            {this.state.error?.message || 'Unknown error'}
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => this.setState({ hasError: false, error: null })}
          >
            <Text style={styles.buttonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  message: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#10B981',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
```

### **3. Performance Optimization:**

```typescript
// src/utils/performance.ts
import { useCallback, useMemo } from 'react';

// Memoization для тяжёлых вычислений
export const useMemoizedPhrases = (phrases: Phrase[], categoryId: string) => {
  return useMemo(
    () => phrases.filter(p => p.categoryId === categoryId),
    [phrases, categoryId]
  );
};

// Debounce для поиска
export const useDebounce = (value: string, delay: number = 300) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};
```

### **4. TypeScript строгая типизация:**

```typescript
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true
  }
}
```

---

## 📱 OTA UPDATES (EXPO UPDATES)

### **Настройка:**

```json
// app.json
{
  "expo": {
    "updates": {
      "enabled": true,
      "checkAutomatically": "ON_LOAD",
      "fallbackToCacheTimeout": 0
    },
    "runtimeVersion": {
      "policy": "sdkVersion"
    }
  }
}
```

### **Команды для публикации обновлений:**

```bash
# Production обновление (контент: новые языки, переводы)
eas update --branch production --message "Added Japanese and Korean languages"

# Preview обновление (тестирование)
eas update --branch preview --message "Testing new translations"
```

### **Стратегия обновлений:**

1. **Через Store (требует review):**
   - Изменения в нативном коде
   - Новые фичи (UI компоненты, навигация)
   - Обновления SDK/библиотек
   - Критические баги в коде

2. **Через OTA (мгновенно):**
   - Добавление новых языков (включение isAvailable: true)
   - Исправления переводов
   - Обновления категорий
   - Мелкие багфиксы в JS коде

---

## 📊 АНАЛИТИКА (FIREBASE ANALYTICS)

### **Установка:**

```bash
npx expo install @react-native-firebase/app @react-native-firebase/analytics
```

### **Инициализация:**

```typescript
// src/services/AnalyticsService.ts
import analytics from '@react-native-firebase/analytics';

class AnalyticsService {
  // Выбор языка
  async logLanguageSelected(languageCode: string) {
    await analytics().logEvent('language_selected', {
      language_code: languageCode,
    });
  }

  // Воспроизведение фразы
  async logPhraseListened(phraseId: string, languageCode: string) {
    await analytics().logEvent('phrase_listened', {
      phrase_id: phraseId,
      language_code: languageCode,
    });
  }

  // Просмотр категории
  async logCategoryViewed(categoryId: string) {
    await analytics().logEvent('category_viewed', {
      category_id: categoryId,
    });
  }

  // Поиск
  async logSearch(query: string) {
    await analytics().logEvent('search', {
      search_term: query,
    });
  }

  // Visual Translator использование
  async logVisualTranslatorUsed(sourceLanguage: string, targetLanguage: string, hasText: boolean) {
    await analytics().logEvent('visual_translator_used', {
      source_language: sourceLanguage,
      target_language: targetLanguage,
      has_text: hasText,
    });
  }

  // OCR успех
  async logOCRSuccess(language: string, textLength: number) {
    await analytics().logEvent('ocr_success', {
      language,
      text_length: textLength,
    });
  }

  // AI описание использовано
  async logAIDescriptionUsed(category: string) {
    await analytics().logEvent('ai_description_used', {
      category,
    });
  }

  // Скрин просмотрен
  async logScreenView(screenName: string) {
    await analytics().logScreenView({
      screen_name: screenName,
    });
  }
}

export default new AnalyticsService();
```

### **Использование:**

```typescript
// В компонентах
import AnalyticsService from '../services/AnalyticsService';

const handleLanguageSelect = async (code: string) => {
  await setSelectedLanguage(code);
  await AnalyticsService.logLanguageSelected(code);
};
```

---

## 🗂️ МИГРАЦИЯ СУЩЕСТВУЮЩИХ ДАННЫХ

### **План миграции китайских данных:**

**Скрипт миграции: scripts/migrateToMultilingual.js**

```javascript
// scripts/migrateToMultilingual.js
const fs = require('fs');
const path = require('path');

console.log('🚀 Начинаем миграцию к мультиязычной структуре...\n');

// 1. Читаем старый phrases.ts
const oldPhrasesPath = path.join(__dirname, '../src/data/phrases.ts');
const oldContent = fs.readFileSync(oldPhrasesPath, 'utf8');

// 2. Парсим фразы (простой regex)
const phraseRegex = /{[\s\S]*?id: "([^"]+)"[\s\S]*?categoryId: "([^"]+)"[\s\S]*?chinese: "([^"]+)"[\s\S]*?pinyin: "([^"]+)"[\s\S]*?russian: "([^"]+)"[\s\S]*?turkmen: "([^"]+)"[\s\S]*?audioFileTurkmen: "([^"]+)"[\s\S]*?}/g;

const phrases = [];
let match;

while ((match = phraseRegex.exec(oldContent)) !== null) {
  phrases.push({
    id: match[1],
    categoryId: match[2],
    chinese: match[3],
    pinyin: match[4],
    russian: match[5],
    turkmen: match[6],
    audioFileTurkmen: match[7]
  });
}

console.log(`✅ Найдено ${phrases.length} фраз\n`);

// 3. Создаём base.ts (туркменские фразы)
const baseContent = `// src/data/languages/base.ts
// AUTO-GENERATED - Базовые туркменские фразы
import { BasePhrase } from '../../types';

export const basePhrases: BasePhrase[] = [
${phrases.map((p, index) => `  {
    id: "${p.id}",
    categoryId: "${p.categoryId}",
    turkmen: "${p.turkmen}",
    audioFileTurkmen: "${p.audioFileTurkmen}",
    order: ${index + 1}
  }`).join(',\n')}
];
`;

const baseDir = path.join(__dirname, '../src/data/languages');
if (!fs.existsSync(baseDir)) {
  fs.mkdirSync(baseDir, { recursive: true });
}
fs.writeFileSync(path.join(baseDir, 'base.ts'), baseContent);
console.log('✅ Создан base.ts\n');

// 4. Создаём chinese.ts
const chineseContent = `// src/data/languages/translations/chinese.ts
// AUTO-GENERATED - Китайские переводы
import { LanguageTranslation } from '../../../types';

export const chineseTranslations: LanguageTranslation[] = [
${phrases.map(p => `  {
    phraseId: "${p.id}",
    text: "${p.chinese}",
    transcription: "${p.pinyin}"
  }`).join(',\n')}
];
`;

const translationsDir = path.join(baseDir, 'translations');
if (!fs.existsSync(translationsDir)) {
  fs.mkdirSync(translationsDir, { recursive: true });
}
fs.writeFileSync(path.join(translationsDir, 'chinese.ts'), chineseContent);
console.log('✅ Создан chinese.ts\n');

// 5. Создаём russian.ts
const russianContent = `// src/data/languages/translations/russian.ts
// AUTO-GENERATED - Русские переводы
import { LanguageTranslation } from '../../../types';

export const russianTranslations: LanguageTranslation[] = [
${phrases.map(p => `  {
    phraseId: "${p.id}",
    text: "${p.russian}",
    transcription: undefined // Транскрипция будет добавлена позже
  }`).join(',\n')}
];
`;

fs.writeFileSync(path.join(translationsDir, 'russian.ts'), russianContent);
console.log('✅ Создан russian.ts\n');

// 6. Создаём index.ts для агрегации
const indexContent = `// src/data/languages/index.ts
// AUTO-GENERATED - Агрегация переводов
import { chineseTranslations } from './translations/chinese';
import { russianTranslations } from './translations/russian';
import { LanguageTranslation } from '../../types';

const translationsMap: Record<string, LanguageTranslation[]> = {
  zh: chineseTranslations,
  ru: russianTranslations,
};

export const getTranslationsForLanguage = (languageCode: string): LanguageTranslation[] => {
  return translationsMap[languageCode] || [];
};

export const hasTranslationsForLanguage = (languageCode: string): boolean => {
  return languageCode in translationsMap;
};
`;

fs.writeFileSync(path.join(baseDir, 'index.ts'), indexContent);
console.log('✅ Создан index.ts\n');

console.log('🎉 Миграция завершена успешно!\n');
console.log('📋 Созданные файлы:');
console.log('  - src/data/languages/base.ts');
console.log('  - src/data/languages/translations/chinese.ts');
console.log('  - src/data/languages/translations/russian.ts');
console.log('  - src/data/languages/index.ts\n');
```

**Запуск миграции:**
```bash
node scripts/migrateToMultilingual.js
```

---

## 📝 ОБНОВЛЁННАЯ ФАЙЛОВАЯ СТРУКТУРА

```
TurkmenPhrasebook/
├── src/
│   ├── data/
│   │   ├── languages/
│   │   │   ├── base.ts                      // Базовые туркменские фразы
│   │   │   ├── translations/
│   │   │   │   ├── chinese.ts
│   │   │   │   ├── russian.ts
│   │   │   │   ├── english.ts
│   │   │   │   └── ... (27 файлов)
│   │   │   └── index.ts                     // Агрегация
│   │   ├── categories.ts                    // 22 категории
│   │   ├── audioMapping.ts                  // MP3 маппинг
│   │   └── subcategories/
│   ├── features/
│   │   └── visual-translator/               // НОВОЕ: Visual Translator
│   │       ├── screens/
│   │       │   ├── VisualTranslatorScreen.tsx
│   │       │   └── TranslationResultScreen.tsx
│   │       ├── services/
│   │       │   ├── OCRService.ts
│   │       │   ├── TranslationService.ts
│   │       │   └── AIService.ts
│   │       ├── hooks/
│   │       │   ├── useOCR.ts
│   │       │   ├── useTranslation.ts
│   │       │   └── useAI.ts
│   │       ├── components/
│   │       │   ├── CameraView.tsx
│   │       │   ├── TextOverlay.tsx
│   │       │   ├── ResultCard.tsx
│   │       │   ├── LanguageSelector.tsx
│   │       │   └── LoadingIndicator.tsx
│   │       └── types/
│   │           └── visual-translator.types.ts
│   ├── components/                          // UI компоненты
│   ├── screens/                             // Экраны (Home, Categories...)
│   │   └── LanguageSelectionScreen.tsx      // НОВОЕ
│   ├── hooks/
│   │   ├── useAudio.ts                      // ОБНОВЛЕНО
│   │   ├── useConfig.ts
│   │   └── usePhrases.ts                    // НОВОЕ
│   ├── contexts/
│   │   └── ConfigContext.tsx                // ОБНОВЛЕНО
│   ├── services/
│   │   ├── AudioService.ts
│   │   ├── StorageService.ts
│   │   └── AnalyticsService.ts              // ОБНОВЛЕНО
│   ├── config/
│   │   └── languages.config.ts              // НОВОЕ
│   ├── types/
│   │   └── index.ts                         // ОБНОВЛЕНО
│   ├── constants/
│   └── utils/
│       ├── validation.ts                    // НОВОЕ
│       └── performance.ts                   // НОВОЕ
├── assets/
│   ├── audio/                               // MP3 файлы (туркменский)
│   ├── icon.png                             // НОВАЯ иконка
│   ├── splash.png                           // НОВЫЙ splash
│   └── adaptive-icon.png
├── scripts/
│   ├── migrateToMultilingual.js             // НОВОЕ
│   └── syncAudioFiles.js
├── app.json                                 // ОБНОВЛЕНО
├── package.json                             // ОБНОВЛЕНО (новые зависимости)
└── tsconfig.json                            // ОБНОВЛЕНО
```

---

## 📦 ОБНОВЛЁННЫЕ ЗАВИСИМОСТИ

```json
{
  "dependencies": {
    "expo": "~54.0.0",
    "expo-av": "~15.0.0",
    "expo-speech": "~13.0.0",
    "expo-camera": "~16.0.0",
    "expo-image-picker": "~16.0.0",
    "@react-native-ml-kit/text-recognition": "^0.5.0",
    "@react-native-async-storage/async-storage": "1.25.0",
    "@react-navigation/native": "^7.0.0",
    "@react-navigation/bottom-tabs": "^7.0.0",
    "@react-navigation/stack": "^7.0.0",
    "@react-native-firebase/app": "^21.0.0",
    "@react-native-firebase/analytics": "^21.0.0",
    "react": "18.3.1",
    "react-native": "0.76.5",
    "react-native-safe-area-context": "4.14.0",
    "react-native-screens": "4.4.0",
    "typescript": "~5.3.3"
  },
  "devDependencies": {
    "@types/react": "~18.3.12",
    "@types/react-native": "~0.76.0",
    "eslint": "^8.57.0",
    "prettier": "^3.0.0"
  }
}
```

**Установка новых зависимостей:**

```bash
# Камера и выбор изображений
npx expo install expo-camera expo-image-picker

# OCR (Google ML Kit)
npm install @react-native-ml-kit/text-recognition

# Firebase (уже может быть установлен)
npx expo install @react-native-firebase/app @react-native-firebase/analytics
```

---

## 📝 APP.JSON КОНФИГУРАЦИЯ

```json
{
  "expo": {
    "name": "Turkmen Phrasebook",
    "slug": "turkmen-phrasebook",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#10B981"
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.seydicharyyev.turkmenphrasebook",
      "buildNumber": "1.0.0",
      "infoPlist": {
        "NSCameraUsageDescription": "This app uses the camera to scan and translate text from images.",
        "NSPhotoLibraryUsageDescription": "This app needs access to your photo library to select images for translation."
      }
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#10B981"
      },
      "package": "com.seydicharyyev.turkmenphrasebook",
      "versionCode": 1,
      "permissions": [
        "INTERNET",
        "ACCESS_NETWORK_STATE",
        "CAMERA",
        "READ_EXTERNAL_STORAGE",
        "WRITE_EXTERNAL_STORAGE"
      ]
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "updates": {
      "enabled": true,
      "checkAutomatically": "ON_LOAD",
      "fallbackToCacheTimeout": 0
    },
    "runtimeVersion": {
      "policy": "sdkVersion"
    },
    "extra": {
      "eas": {
        "projectId": "YOUR_PROJECT_ID"
      }
    },
    "plugins": [
      "@react-native-firebase/app",
      "@react-native-firebase/analytics",
      [
        "expo-camera",
        {
          "cameraPermission": "Allow $(PRODUCT_NAME) to access your camera to scan text for translation."
        }
      ],
      [
        "expo-image-picker",
        {
          "photosPermission": "Allow $(PRODUCT_NAME) to access your photos to translate text from images."
        }
      ]
    ]
  }
}
```

---

## 🎨 ИКОНКА И БРЕНДИНГ

### **Требования к иконке:**

**Концепция:** Флаг Туркменистана + белый голубь (символ мира) + камера (Visual Translator)

**Размеры:**
- **icon.png:** 1024×1024 px (iOS и Android)
- **adaptive-icon.png:** 1024×1024 px (Android адаптивная иконка)
- **splash.png:** 1284×2778 px (splash screen)

**Цвета:**
- Основной: #10B981 (зелёный)
- Акцент: #FFFFFF (белый)
- Текст: #111827 (тёмный)

### **Генерация иконок (после дизайна):**

```bash
# Установка генератора
npm install -g expo-icon-generator

# Генерация из основной иконки
expo-icon-generator generate
```

---

## 📚 ДОКУМЕНТАЦИЯ

### **README.md для репозитория:**

```markdown
# 🇹🇲 Turkmen Phrasebook

Universal Turkmen phrasebook supporting 30 languages with AI-powered Visual Translator.

## 🌍 Supported Languages

- Chinese (中文) ✅
- Japanese (日本語) 🔜
- Korean (한국어) 🔜
- Russian (Русский) ✅
- English ✅
- Turkish (Türkçe) 🔜
- ... and 24 more!

## 🚀 Getting Started

\`\`\`bash
# Install dependencies
npm install

# Start development server
npx expo start

# Build preview
eas build --platform android --profile preview
\`\`\`

## 📱 Features

### Phrasebook
- 305 common phrases across 22 categories
- Audio pronunciation (MP3 + TTS)
- 30 languages support
- Offline mode

### Visual Translator (NEW!)
- OCR text recognition from photos
- AI object description
- Smart context-aware translation
- 30+ languages support
- Free APIs (MyMemory, Hugging Face, Google ML Kit)

## 🔧 Tech Stack

- React Native (Expo SDK 54)
- TypeScript
- Expo Camera & Image Picker
- Google ML Kit Text Recognition
- MyMemory Translation API
- Hugging Face AI (BLIP, CLIP)
- Expo Audio & Speech
- Firebase Analytics
- AsyncStorage

## 📄 License

MIT License
```

---

## ✅ ОБНОВЛЁННЫЙ ЧЕКЛИСТ ЗАДАЧ

### **Phase 1: Подготовка структуры (День 1-2)**
- [ ] Создать новую структуру папок для языков
- [ ] Создать languages.config.ts с 30 языками (включая ocrSupported)
- [ ] Обновить TypeScript типы
- [ ] Запустить скрипт миграции данных
- [ ] Проверить что китайские данные мигрировали корректно

### **Phase 2: Context и State Management (День 2-3)**
- [ ] Обновить ConfigContext для мультиязычности
- [ ] Создать usePhrases hook
- [ ] Обновить useAudio для работы с любым языком
- [ ] Добавить fallback на английский

### **Phase 3: Visual Translator - Backend (День 3-5)**
- [ ] Создать структуру features/visual-translator
- [ ] Реализовать OCRService (Google ML Kit)
- [ ] Реализовать TranslationService (MyMemory + LibreTranslate)
- [ ] Реализовать AIService (Hugging Face)
- [ ] Создать TypeScript типы для Visual Translator
- [ ] Создать хуки (useOCR, useTranslation, useAI)
- [ ] Протестировать все сервисы

### **Phase 4: Visual Translator - Frontend (День 5-7)**
- [ ] Создать VisualTranslatorScreen
- [ ] Создать TranslationResultScreen
- [ ] Создать компоненты (CameraView, ResultCard, etc.)
- [ ] Добавить обработку ошибок и loading states
- [ ] Интегрировать аналитику

### **Phase 5: UI компоненты Phrasebook (День 7-8)**
- [ ] Создать LanguageSelectionScreen
- [ ] Обновить HomeScreen с индикатором языка
- [ ] Обновить PhraseItem для показа переводов
- [ ] Добавить прогресс бар в выбор языка
- [ ] Обновить категории с мультиязычными названиями

### **Phase 6: Навигация (День 8)**
- [ ] Добавить Visual Translator в нижнюю навигацию
- [ ] Добавить LanguageSelectionScreen в навигацию
- [ ] Настроить первый запуск (показать выбор языка)
- [ ] Добавить возможность смены языка из настроек
- [ ] Тестировать плавное переключение без перезапуска

### **Phase 7: Аналитика и OTA (День 9)**
- [ ] Настроить Firebase Analytics
- [ ] Добавить отслеживание событий (включая Visual Translator)
- [ ] Настроить Expo Updates
- [ ] Протестировать OTA обновления

### **Phase 8: Иконка и брендинг (День 9-10)**
- [ ] Изменить app.json (название, bundle ID, permissions)
- [ ] Создать новую иконку (флаг + голубь + камера)
- [ ] Обновить splash screen
- [ ] Переименовать GitHub репозиторий

### **Phase 9: Тестирование (День 10-12)**
- [ ] Протестировать на Android
- [ ] Протестировать на iOS
- [ ] Проверить все 3 доступных языка в Phrasebook
- [ ] Проверить Visual Translator с разными языками
- [ ] Проверить OCR на китайском, английском, русском
- [ ] Проверить AI описание объектов
- [ ] Проверить что "Coming soon" языки заблокированы
- [ ] Проверить аудио (MP3 для туркменского, TTS для остальных)
- [ ] Проверить все разрешения (camera, gallery)

### **Phase 10: Production Build (День 12-14)**
- [ ] Собрать APK для Android
- [ ] Собрать IPA для iOS
- [ ] Протестировать APK на реальном устройстве
- [ ] Подготовить Store Listing (скриншоты, описание)
- [ ] Загрузить в Google Play
- [ ] Загрузить в App Store

---

## 🎓 BEST PRACTICES ДЛЯ CLAUDE CODE

### **1. Именование:**
- Файлы: PascalCase для компонентов, camelCase для утилит
- Функции: camelCase
- Константы: UPPER_SNAKE_CASE
- Типы: PascalCase

### **2. Структура файлов:**
```typescript
// Порядок в файле:
// 1. Imports
// 2. Types/Interfaces
// 3. Constants
// 4. Component/Function
// 5. Styles
// 6. Export
```

### **3. Комментарии:**
```typescript
// ✅ Хорошо
/**
 * Получает переводы для указанного языка
 * @param languageCode - ISO код языка (zh, ja, en...)
 * @returns Массив переводов или пустой массив
 */
export const getTranslationsForLanguage = (code: string) => { ... }

// ❌ Плохо
// Функция для языка
export const getTranslationsForLanguage = (code: string) => { ... }
```

### **4. Error Handling:**
```typescript
// ✅ Всегда обрабатывай ошибки
try {
  await setSelectedLanguage(code);
} catch (error) {
  console.error('Failed to select language:', error);
  // Показать toast или alert пользователю
}
```

### **5. Performance:**
```typescript
// ✅ Используй useMemo для дорогих вычислений
const filteredPhrases = useMemo(
  () => phrases.filter(p => p.categoryId === categoryId),
  [phrases, categoryId]
);

// ✅ Используй useCallback для функций
const handlePress = useCallback(() => {
  // ...
}, [dependencies]);
```

### **6. Accessibility:**
```typescript
<TouchableOpacity
  accessible={true}
  accessibilityLabel="Select Chinese language"
  accessibilityHint="Double tap to select"
>
```

---

## 🚨 КРИТИЧЕСКИЕ ЗАМЕЧАНИЯ

1. **НИКОГДА не удаляй существующий функционал** - только расширяй
2. **Всегда проверяй что китайский язык работает** после изменений
3. **Туркменское аудио священно** - не трогай MP3 файлы и audioMapping
4. **Типизация обязательна** - никаких `any` без крайней необходимости
5. **Тестируй на реальном устройстве** перед каждым коммитом
6. **Коммиты атомарные** - одна фича = один коммит
7. **Следуй существующему стилю кода** в проекте
8. **API ключи в .env** - никогда не коммить ключи в git
9. **Проверяй лимиты бесплатных API** - не превышай дневные лимиты
10. **Обрабатывай offline режим** - показывай правильные ошибки

---

## 📞 КОНТАКТЫ

**Разработчик:** Seydi Charyyev
**Email:** seydicharyev@icloud.com
**GitHub:** https://github.com/seydicharyyev

---

## 🏛️ НОВАЯ АРХИТЕКТУРА - MAIN HUB (ОБНОВЛЕНО)

### **Переход к Hub-модели:**

Приложение теперь использует **Hub-архитектуру** вместо классических вкладок. После выбора языка пользователь видит главное меню (Main Hub) с 6 модулями.

### **Структура приложения:**

```
Language Selection (первый запуск)
         ↓
┌────────────────────────────────────────┐
│   MAIN HUB (главное меню)              │
├────────────────────────────────────────┤
│  📚 Phrasebook (разговорник)           │  → 305 фраз в 22 категориях
│  📸 Visual Translator (камера + OCR)   │  → Сканирование текста с камеры
│  🌍 Text Translator (онлайн)           │  → Классический текстовый переводчик
│  📖 Dictionary (словарь v2.0)          │  → Coming soon (заглушка)
│  🤖 AI Assistants (ИИ помощники)       │  → 5 AI ассистентов
│  ⭐ My Favorites (избранное)           │  → Избранное из всех модулей
└────────────────────────────────────────┘
```

**Преимущества Hub-архитектуры:**
- ✅ Чистый и понятный интерфейс
- ✅ Легко добавлять новые модули
- ✅ Меньше когнитивной нагрузки
- ✅ Фокус на одной задаче
- ✅ Современный тренд (WeChat, Super Apps)

---

## 📱 МОДУЛИ ПРИЛОЖЕНИЯ

### **1. 📚 Phrasebook (Разговорник)**

**Статус:** ✅ Реализован

**Описание:** Основной модуль - 305 фраз в 22 категориях с поддержкой 30 языков.

**Функционал:**
- Категории и подкатегории фраз
- Аудио произношение (MP3 + TTS)
- Поиск по фразам
- Избранные фразы
- История просмотров
- Мультиязычность (3 языка активны: китайский, русский, английский)

**Файлы:**
- `src/screens/HomeScreen.tsx`
- `src/screens/CategoryScreen.tsx`
- `src/screens/PhraseDetailScreen.tsx`
- `src/data/categories.ts`
- `src/data/phrases.ts`

---

### **2. 📸 Visual Translator (Визуальный переводчик)**

**Статус:** 📝 В разработке

**Описание:** Революционная функция - сканирование текста с камеры + AI анализ.

**Технологический стек:**
- **OCR:** Google ML Kit Text Recognition (бесплатно)
- **Translation:** MyMemory API (10k слов/день) + LibreTranslate fallback
- **AI:** Hugging Face Inference API (бесплатно)
  - BLIP - описание объектов
  - CLIP - категоризация изображений
  - NLLB - контекстный перевод

**3 экрана:**

1. **VisualTranslatorHomeScreen** - точка входа
   - Кнопка "Take Photo"
   - Кнопка "Choose from Gallery"
   - Описание функций

2. **CameraScreen** - съемка
   - Полноэкранная камера
   - Селектор языков
   - Кнопка захвата

3. **TranslationResultScreen** - результат
   - Превью изображения
   - Распознанный текст (OCR)
   - AI категория (badge)
   - Перевод (крупный шрифт)
   - Действия: озвучить, копировать, сохранить

**Цветовая схема:**
- Primary: `#6366F1` (Индиго)
- Secondary: `#8B5CF6` (Фиолетовый)
- Gradient: Индиго → Фиолет

**Файлы (новые):**
```
src/features/visual-translator/
├── screens/
│   ├── VisualTranslatorHomeScreen.tsx
│   ├── CameraScreen.tsx
│   └── TranslationResultScreen.tsx
├── services/
│   ├── OCRService.ts
│   ├── TranslationService.ts
│   └── AIService.ts
├── components/
│   ├── CameraView.tsx
│   ├── ResultCard.tsx
│   └── LanguageSelector.tsx
└── types/
    └── visual-translator.types.ts
```

---

### **3. 🌍 Text Translator (Текстовый переводчик)**

**Статус:** 📝 В разработке

**Описание:** Классический онлайн переводчик - вводишь текст → получаешь перевод.

**Функционал (v1.0):**
- ✅ Ввод текста (textarea)
- ✅ Выбор исходного языка
- ✅ Выбор целевого языка
- ✅ Кнопка "Translate"
- ✅ Результат перевода
- ✅ Копирование результата
- ✅ Озвучка результата (TTS)
- ✅ История переводов

**Функционал (v2.0 - будущее):**
- 🔜 Голосовой ввод
- 🔜 Определение языка (auto-detect)
- 🔜 Избранные переводы
- 🔜 Офлайн режим

**API:**
- MyMemory Translation API (бесплатно, 10k слов/день)
- Fallback: LibreTranslate

**Цветовая схема:**
- Primary: `#3B82F6` (Синий)

**UI Дизайн:**
```
┌─────────────────────────────────────┐
│  ← Back    Text Translator          │
├─────────────────────────────────────┤
│                                     │
│  🌍 From: [English ▼]              │
│  ┌─────────────────────────────┐  │
│  │ Enter text here...          │  │  ← Input textarea
│  │                             │  │
│  └─────────────────────────────┘  │
│                                     │
│  [🔄 Translate]                    │  ← Кнопка перевода
│                                     │
│  🎯 To: [Turkmen ▼]                │
│  ┌─────────────────────────────┐  │
│  │ Translation result...       │  │  ← Output (read-only)
│  │                             │  │
│  └─────────────────────────────┘  │
│                                     │
│  [🔊 Play]  [📋 Copy]  [💾 Save]  │
└─────────────────────────────────────┘
```

**Файлы (новые):**
```
src/features/text-translator/
├── screens/
│   └── TextTranslatorScreen.tsx
├── services/
│   └── TextTranslationService.ts
├── components/
│   ├── LanguagePicker.tsx
│   ├── TextInput.tsx
│   └── TranslationOutput.tsx
└── types/
    └── text-translator.types.ts
```

---

### **4. 🤖 AI Assistants (ИИ Помощники)**

**Статус:** 📝 В разработке

**Описание:** Комплексные AI ассистенты для изучения языка.

**5 ассистентов:**

1. **💡 Contextual Tips (Контекстные подсказки)**
   - AI анализирует вашу активность
   - Предлагает релевантные фразы
   - "Вы часто смотрите фразы про еду - вот еще полезные"

2. **🎓 Conversation Trainer (Разговорный тренер)**
   - AI задает вопросы на туркменском
   - Пользователь отвечает (текст или голос)
   - AI оценивает и дает feedback
   - Примеры диалогов

3. **📚 Grammar Helper (Грамматический помощник)**
   - Объясняет грамматику туркменского языка
   - Примеры использования
   - Упражнения
   - Q&A формат

4. **🌍 Cultural Advisor (Культурный советник)**
   - Рассказывает о туркменской культуре
   - Обычаи, традиции, этикет
   - Контекст для фраз
   - Интересные факты

5. **🤖 General Assistant (Общий помощник)**
   - Отвечает на любые вопросы
   - Помогает с переводами
   - Объясняет непонятное
   - Chatbot интерфейс

**Технологии:**
- Hugging Face Inference API (бесплатные модели)
- GPT-2 или подобные (open-source)
- Возможно интеграция с Anthropic Claude (платно в v2.0)

**Цветовая схема:**
- Primary: `#8B5CF6` (Фиолетовый)
- Gradient: Фиолет → Розовый

**UI Дизайн:**
```
┌─────────────────────────────────────┐
│  ← Back    AI Assistants            │
├─────────────────────────────────────┤
│  Choose your assistant:             │
│                                     │
│  ┌───────────────────────────────┐ │
│  │ 💡 Contextual Tips            │ │
│  │ Smart phrase suggestions      │ │
│  └───────────────────────────────┘ │
│                                     │
│  ┌───────────────────────────────┐ │
│  │ 🎓 Conversation Trainer       │ │
│  │ Practice real dialogues       │ │
│  └───────────────────────────────┘ │
│                                     │
│  ┌───────────────────────────────┐ │
│  │ 📚 Grammar Helper             │ │
│  │ Learn Turkmen grammar         │ │
│  └───────────────────────────────┘ │
│                                     │
│  ┌───────────────────────────────┐ │
│  │ 🌍 Cultural Advisor           │ │
│  │ Discover Turkmen culture      │ │
│  └───────────────────────────────┘ │
│                                     │
│  ┌───────────────────────────────┐ │
│  │ 🤖 General Assistant          │ │
│  │ Ask me anything               │ │
│  └───────────────────────────────┘ │
└─────────────────────────────────────┘
```

**Файлы (новые):**
```
src/features/ai-assistants/
├── screens/
│   ├── AIAssistantsHomeScreen.tsx
│   ├── ContextualTipsScreen.tsx
│   ├── ConversationTrainerScreen.tsx
│   ├── GrammarHelperScreen.tsx
│   ├── CulturalAdvisorScreen.tsx
│   └── GeneralAssistantScreen.tsx
├── services/
│   └── AIAssistantService.ts
├── components/
│   ├── ChatBubble.tsx
│   ├── AssistantCard.tsx
│   └── FeedbackCard.tsx
└── types/
    └── ai-assistant.types.ts
```

---

### **5. 📖 Dictionary (Словарь)**

**Статус:** 🔒 Coming soon (v2.0)

**Описание:** Туркменско-английский, туркменско-русский словарь (и другие пары).

**Функционал (планируется):**
- Поиск слов
- Переводы в обе стороны
- Озвучка слов
- Примеры использования
- Избранные слова
- История поиска

**Коллекции:**
- 🇹🇲 Türkmen → 🇬🇧 English
- 🇹🇲 Türkmen → 🇷🇺 Русский
- 🇹🇲 Türkmen → 🇨🇳 中文
- И другие языковые пары

**Цветовая схема:**
- Primary: `#9CA3AF` (Серый - disabled)
- В v2.0: `#F59E0B` (Оранжевый)

**UI Дизайн (заглушка v1.0):**
```
┌─────────────────────────────────────┐
│  ← Back    Dictionary               │
├─────────────────────────────────────┤
│                                     │
│         📖                          │
│                                     │
│    Dictionary Coming Soon           │
│                                     │
│  This feature will be available     │
│  in version 2.0                     │
│                                     │
│  What to expect:                    │
│  • Turkmen ↔ English dictionary     │
│  • Turkmen ↔ Russian dictionary     │
│  • Word pronunciation               │
│  • Usage examples                   │
│                                     │
│  [📧 Notify me when ready]          │
└─────────────────────────────────────┘
```

---

### **6. ⭐ My Favorites (Избранное)**

**Статус:** 🔄 Обновление существующего

**Описание:** Централизованное избранное из всех модулей приложения.

**3 вкладки:**

1. **Phrases** - избранные фразы из Phrasebook
2. **Translations** - сохраненные переводы из Visual/Text Translator
3. **Words** - избранные слова из Dictionary (v2.0)

**Цветовая схема:**
- Primary: `#F59E0B` (Оранжевый)

**Файлы (обновить):**
- `src/screens/FavoritesScreen.tsx` → `src/features/favorites/FavoritesHubScreen.tsx`

---

## 📐 MAIN HUB SCREEN - ДЕТАЛЬНЫЙ ДИЗАЙН

### **Макет:**

```typescript
// src/screens/MainHubScreen.tsx

import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useConfig } from '../contexts/ConfigContext';

interface ModuleCard {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  gradient: string[];
  route: string;
  isLocked?: boolean;
  size: 'large' | 'medium' | 'small';
}

const MODULES: ModuleCard[] = [
  {
    id: 'phrasebook',
    title: 'Phrasebook',
    subtitle: '305 phrases in 22 categories',
    icon: '📚',
    gradient: ['#10B981', '#059669'],
    route: 'Phrasebook',
    size: 'large',
  },
  {
    id: 'visual-translator',
    title: 'Visual Translator',
    subtitle: 'Scan text with camera',
    icon: '📸',
    gradient: ['#6366F1', '#4F46E5'],
    route: 'VisualTranslator',
    size: 'large',
  },
  {
    id: 'text-translator',
    title: 'Text Translator',
    subtitle: 'Type and translate',
    icon: '🌍',
    gradient: ['#3B82F6', '#2563EB'],
    route: 'TextTranslator',
    size: 'medium',
  },
  {
    id: 'dictionary',
    title: 'Dictionary',
    subtitle: 'Coming in v2.0',
    icon: '📖',
    gradient: ['#9CA3AF', '#6B7280'],
    route: 'Dictionary',
    size: 'small',
    isLocked: true,
  },
  {
    id: 'ai-assistants',
    title: 'AI Assistants',
    subtitle: 'Smart helpers & tips',
    icon: '🤖',
    gradient: ['#8B5CF6', '#7C3AED'],
    route: 'AIAssistants',
    size: 'large',
  },
  {
    id: 'favorites',
    title: 'My Favorites',
    subtitle: 'Saved items',
    icon: '⭐',
    gradient: ['#F59E0B', '#D97706'],
    route: 'Favorites',
    size: 'medium',
  },
];

export default function MainHubScreen() {
  const navigation = useNavigation();
  const { selectedLanguage } = useConfig();

  const handleModulePress = (module: ModuleCard) => {
    if (module.isLocked) {
      Alert.alert('Coming Soon', 'This feature will be available in v2.0');
      return;
    }
    navigation.navigate(module.route as never);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('LanguageSelection')}>
          <Text style={styles.languageBadge}>🇨🇳 Chinese</Text>
        </TouchableOpacity>
        <Text style={styles.appTitle}>Turkmen Phrasebook</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
          <Ionicons name="settings-outline" size={24} color="#111827" />
        </TouchableOpacity>
      </View>

      {/* Welcome */}
      <View style={styles.welcome}>
        <Text style={styles.welcomeTitle}>Welcome back! 👋</Text>
        <Text style={styles.welcomeSubtitle}>Choose what you need</Text>
      </View>

      {/* Modules Grid */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {MODULES.map((module) => (
          <ModuleCardComponent
            key={module.id}
            module={module}
            onPress={() => handleModulePress(module)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const ModuleCardComponent = ({ module, onPress }: { module: ModuleCard; onPress: () => void }) => {
  const height = module.size === 'large' ? 120 : module.size === 'medium' ? 100 : 80;

  return (
    <TouchableOpacity
      style={[styles.moduleCard, { height }]}
      onPress={onPress}
      activeOpacity={module.isLocked ? 1 : 0.7}
      disabled={module.isLocked}
    >
      {module.isLocked ? (
        <View style={styles.lockedCard}>
          <Text style={styles.moduleIcon}>{module.icon}</Text>
          <View style={styles.moduleInfo}>
            <Text style={styles.moduleTitle}>{module.title}</Text>
            <Text style={styles.moduleSubtitle}>{module.subtitle}</Text>
          </View>
          <Ionicons name="lock-closed" size={20} color="#9CA3AF" />
        </View>
      ) : (
        <LinearGradient
          colors={module.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientCard}
        >
          <Text style={styles.moduleIconWhite}>{module.icon}</Text>
          <View style={styles.moduleInfo}>
            <Text style={styles.moduleTitleWhite}>{module.title}</Text>
            <Text style={styles.moduleSubtitleWhite}>{module.subtitle}</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="rgba(255,255,255,0.7)" />
        </LinearGradient>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  languageBadge: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366F1',
  },
  appTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  welcome: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#64748B',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  moduleCard: {
    borderRadius: 20,
    marginBottom: 16,
    overflow: 'hidden',
  },
  gradientCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 16,
  },
  lockedCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 16,
    backgroundColor: '#F3F4F6',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    opacity: 0.6,
  },
  moduleIcon: {
    fontSize: 32,
  },
  moduleIconWhite: {
    fontSize: 32,
  },
  moduleInfo: {
    flex: 1,
  },
  moduleTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  moduleTitleWhite: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  moduleSubtitle: {
    fontSize: 14,
    color: '#64748B',
  },
  moduleSubtitleWhite: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.85)',
  },
});
```

---

## ✅ ОБНОВЛЁННЫЙ ЧЕКЛИСТ РАЗРАБОТКИ

### **Phase 1: Main Hub Architecture (День 1) 🔴 CRITICAL**
- [ ] Создать `MainHubScreen.tsx` с 6 карточками модулей
- [ ] Обновить `AppNavigator.tsx` - убрать bottom tabs
- [ ] Добавить навигацию из Hub в каждый модуль
- [ ] Добавить header с выбором языка и настройками
- [ ] Протестировать навигацию

### **Phase 2: Visual Translator (День 2-3) 🟡 HIGH**
- [ ] Создать структуру `features/visual-translator/`
- [ ] Реализовать OCRService (Google ML Kit)
- [ ] Реализовать TranslationService (MyMemory + fallback)
- [ ] Реализовать AIService (Hugging Face)
- [ ] Создать VisualTranslatorHomeScreen
- [ ] Создать CameraScreen с permissions
- [ ] Создать TranslationResultScreen
- [ ] Добавить компоненты (CameraView, ResultCard)
- [ ] Протестировать на реальном устройстве

### **Phase 3: Text Translator (День 4) 🟡 HIGH**
- [ ] Создать структуру `features/text-translator/`
- [ ] Создать TextTranslatorScreen
- [ ] Реализовать TextTranslationService
- [ ] Добавить input/output компоненты
- [ ] Добавить озвучку результата
- [ ] Добавить историю переводов
- [ ] Протестировать API лимиты

### **Phase 4: AI Assistants (День 5-6) 🟢 MEDIUM**
- [ ] Создать структуру `features/ai-assistants/`
- [ ] Создать AIAssistantsHomeScreen с 5 карточками
- [ ] Реализовать ContextualTipsScreen
- [ ] Реализовать ConversationTrainerScreen
- [ ] Реализовать GrammarHelperScreen
- [ ] Реализовать CulturalAdvisorScreen
- [ ] Реализовать GeneralAssistantScreen
- [ ] Интегрировать Hugging Face API
- [ ] Добавить chat компоненты

### **Phase 5: Dictionary Placeholder (День 7) 🟢 LOW**
- [ ] Создать DictionaryScreen с заглушкой "Coming soon"
- [ ] Добавить форму "Notify me when ready"
- [ ] Сохранять email notifications в AsyncStorage

### **Phase 6: Favorites Hub (День 7) 🟡 HIGH**
- [ ] Обновить FavoritesScreen → FavoritesHubScreen
- [ ] Добавить 3 вкладки (Phrases, Translations, Words)
- [ ] Интегрировать избранное из всех модулей
- [ ] Добавить фильтры и поиск

### **Phase 7: Тестирование (День 8-9) 🔴 CRITICAL**
- [ ] Протестировать все модули на Android
- [ ] Протестировать все модули на iOS
- [ ] Проверить permissions (camera, microphone, storage)
- [ ] Проверить API лимиты и fallback
- [ ] Проверить offline режим
- [ ] Проверить переключение языков
- [ ] Проверить навигацию между модулями

### **Phase 8: Production Build (День 10) 🔴 CRITICAL**
- [ ] Обновить app.json (версия, permissions)
- [ ] Собрать APK для Android
- [ ] Собрать IPA для iOS
- [ ] Протестировать production builds
- [ ] Подготовить store listing

---

## 🎯 ЦЕЛЬ ПРОЕКТА (напоминание)

К **12 декабря 2025** выпустить универсальный туркменский разговорник в честь 30-летия нейтралитета Туркменистана с поддержкой:
- **30 языков** (постепенное добавление)
- **Visual Translator** с OCR и AI (революционная функция)

**Первый релиз:**
- Phrasebook: Китайский, Русский, Английский (3 языка активны, 27 coming soon)
- Visual Translator: Полная функциональность для всех доступных языков

**Дальнейшее развитие:**
- +2-3 языка каждый месяц через OTA обновления
- Улучшение AI моделей
- Offline режим для Visual Translator

---

**УДАЧИ В РАЗРАБОТКЕ! 🚀🇹🇲📸**
