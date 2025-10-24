# 📋 ТЕХНИЧЕСКОЕ ЗАДАНИЕ: TURKMEN PHRASEBOOK
## Универсальный туркменский разговорник с 30 языками

---

## 🎯 КОНТЕКСТ ПРОЕКТА

**Кто ты:**
Ты 10-летний senior React Native разработчик с глубоким опытом в:
- Архитектуре масштабируемых приложений
- Лучших практиках React Native / Expo
- Безопасности и производительности
- Мультиязычных приложениях
- Работе с аудио и медиа

**Твоя задача:**
Трансформировать существующее китайско-туркменское приложение-разговорник в универсальный туркменский разговорник, поддерживающий 30 языков с возможностью постепенного добавления новых языков.

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
Создать универсальное приложение "Turkmen Phrasebook" с поддержкой 30 языков, где туркменский язык всегда является основным, а пользователь выбирает один дополнительный язык для изучения.

### **Ключевые особенности:**
- 🌍 **30 языков** (постепенное добавление)
- 🎯 **Туркменский всегда основной** (фиксированный)
- 🔄 **Мгновенное переключение** между языками
- 📱 **OTA обновления** для добавления новых языков
- 🎵 **Гибридная аудио система** (MP3 для туркменского, TTS для остальных)
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
    direction: 'ltr'
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
    direction: 'ltr'
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
    direction: 'ltr'
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
    direction: 'ltr'
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
    direction: 'rtl'
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
      "buildNumber": "1.0.0"
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
        "ACCESS_NETWORK_STATE"
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
      "@react-native-firebase/analytics"
    ]
  }
}
```

---

## 🎨 ИКОНКА И БРЕНДИНГ

### **Требования к иконке:**

**Концепция:** Флаг Туркменистана + белый голубь (символ мира)

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

Universal Turkmen phrasebook supporting 30 languages.

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

- 305 common phrases across 22 categories
- Audio pronunciation (MP3 + TTS)
- Offline support
- Regular OTA updates with new languages
- Modern, intuitive UI

## 🔧 Tech Stack

- React Native (Expo SDK 54)
- TypeScript
- Expo Audio
- Expo Speech
- Firebase Analytics
- AsyncStorage

## 📄 License

MIT License
```

---

## ✅ ЧЕКЛИСТ ЗАДАЧ

### **Phase 1: Подготовка структуры (День 1-2)**
- [ ] Создать новую структуру папок для языков
- [ ] Создать languages.config.ts с 30 языками
- [ ] Обновить TypeScript типы
- [ ] Запустить скрипт миграции данных
- [ ] Проверить что китайские данные мигрировали корректно

### **Phase 2: Context и State Management (День 2-3)**
- [ ] Обновить ConfigContext для мультиязычности
- [ ] Создать usePhrases hook
- [ ] Обновить useAudio для работы с любым языком
- [ ] Добавить fallback на английский

### **Phase 3: UI компоненты (День 3-4)**
- [ ] Создать LanguageSelectionScreen
- [ ] Обновить HomeScreen с индикатором языка
- [ ] Обновить PhraseItem для показа переводов
- [ ] Добавить прогресс бар в выбор языка
- [ ] Обновить категории с мультиязычными названиями

### **Phase 4: Навигация (День 4)**
- [ ] Добавить LanguageSelectionScreen в навигацию
- [ ] Настроить первый запуск (показать выбор языка)
- [ ] Добавить возможность смены языка из настроек
- [ ] Тестировать плавное переключение без перезапуска

### **Phase 5: Аналитика и OTA (День 5)**
- [ ] Настроить Firebase Analytics
- [ ] Добавить отслеживание событий
- [ ] Настроить Expo Updates
- [ ] Протестировать OTA обновления

### **Phase 6: Иконка и брендинг (День 5-6)**
- [ ] Изменить app.json (название, bundle ID)
- [ ] Создать новую иконку (флаг + голубь)
- [ ] Обновить splash screen
- [ ] Переименовать GitHub репозиторий

### **Phase 7: Тестирование (День 6-7)**
- [ ] Протестировать на Android
- [ ] Протестировать на iOS
- [ ] Проверить все 3 доступных языка
- [ ] Проверить что "Coming soon" языки заблокированы
- [ ] Проверить аудио (MP3 для туркменского, TTS для остальных)

### **Phase 8: Production Build (День 7)**
- [ ] Собрать APK для Android
- [ ] Протестировать APK на реальном устройстве
- [ ] Подготовить Store Listing
- [ ] Загрузить в Google Play

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

---

## 📞 КОНТАКТЫ

**Разработчик:** Seydi Charyyev
**Email:** seydicharyev@icloud.com
**GitHub:** https://github.com/seydicharyyev

---

## 🎯 ЦЕЛЬ ПРОЕКТА (напоминание)

К **12 декабря 2025** выпустить универсальный туркменский разговорник в честь 30-летия нейтралитета Туркменистана с поддержкой 30 языков (постепенное добавление).

**Первый релиз:** Китайский, Русский, Английский (3 языка активны, 27 coming soon)

**Дальнейшее развитие:** +2-3 языка каждый месяц через OTA обновления

---

**УДАЧИ В РАЗРАБОТКЕ! 🚀🇹🇲**
