# 📋 ТЕХНИЧЕСКОЕ ЗАДАНИЕ ПО ЭТАПАМ
## Turkmen Phrasebook - Пошаговая реализация

---

## 🎯 ОБЗОР

Этот документ разбивает полное ТЗ на **8 последовательных этапов (phases)**.

**Каждый этап:**
- ✅ Автономный (можно выполнить и протестировать отдельно)
- ✅ Имеет четкие критерии завершения
- ✅ Содержит чеклист задач
- ✅ Включает примеры кода
- ✅ Указывает приоритет (🔴 Критический / 🟡 Важный / 🟢 Опциональный)

**Общее время:** 7-8 дней

---

## 📊 ФАЗЫ РАЗРАБОТКИ

```
Phase 1: Структура данных          [День 1-2]  🔴 КРИТИЧЕСКИЙ
Phase 2: State Management          [День 2-3]  🔴 КРИТИЧЕСКИЙ  
Phase 3: UI компоненты             [День 3-4]  🔴 КРИТИЧЕСКИЙ
Phase 4: Навигация                 [День 4]    🟡 ВАЖНЫЙ
Phase 5: Аналитика и OTA           [День 5]    🟡 ВАЖНЫЙ
Phase 6: Брендинг                  [День 5-6]  🟢 ОПЦИОНАЛЬНЫЙ
Phase 7: Тестирование              [День 6-7]  🔴 КРИТИЧЕСКИЙ
Phase 8: Production Build          [День 7]    🔴 КРИТИЧЕСКИЙ
```

---

# 🔴 PHASE 1: СТРУКТУРА ДАННЫХ
## День 1-2 | Приоритет: КРИТИЧЕСКИЙ

### 🎯 ЦЕЛЬ:
Создать новую файловую структуру для поддержки 30 языков и мигрировать существующие китайские данные.

---

### 📋 ЗАДАЧИ:

#### ✅ 1.1 Создать структуру папок

**Создать папки:**
```
src/data/languages/
├── base.ts
├── translations/
│   ├── chinese.ts
│   ├── russian.ts
│   └── english.ts
└── index.ts

src/config/
└── languages.config.ts
```

**Команды:**
```bash
mkdir -p src/data/languages/translations
mkdir -p src/config
```

---

#### ✅ 1.2 Обновить TypeScript типы

**Файл: src/types/index.ts**

Добавить новые интерфейсы:

```typescript
// src/types/index.ts

// ====================================
// НОВЫЕ ТИПЫ (добавить в начало файла)
// ====================================

/**
 * Базовая фраза (туркменская версия)
 */
export interface BasePhrase {
  id: string;                    // phrase_001, phrase_002...
  categoryId: string;            // greetings, food, hotel...
  subcategoryId?: string;        // greetings_basic, food_drinks...
  turkmen: string;               // Туркменский текст
  audioFileTurkmen?: string;     // Путь к MP3
  order: number;                 // Порядковый номер
}

/**
 * Перевод фразы на конкретный язык
 */
export interface LanguageTranslation {
  phraseId: string;              // Ссылка на BasePhrase.id
  text: string;                  // Переведенный текст
  transcription?: string;        // Транскрипция (pinyin, romaji, etc.)
}

/**
 * Полная фраза с переводом (для UI)
 */
export interface Phrase extends BasePhrase {
  translation: {
    text: string;
    transcription?: string;
  };
}

/**
 * Конфигурация языка
 */
export interface LanguageConfig {
  code: string;                  // ISO 639-1 (zh, ja, en...)
  name: string;                  // Название на родном языке
  nameEn: string;                // Название на английском
  nameTk: string;                // Название на туркменском
  flag: string;                  // Emoji флаг
  isAvailable: boolean;          // Доступен ли язык
  hasTranscription: boolean;     // Есть ли транскрипция
  ttsCode: string;               // Код для TTS
  direction: 'ltr' | 'rtl';      // Направление письма
}

// ====================================
// ОБНОВИТЬ СУЩЕСТВУЮЩИЙ ТИП Phrase
// ====================================

// СТАРЫЙ (удалить):
// export interface Phrase {
//   id: string;
//   categoryId: string;
//   chinese: string;
//   pinyin: string;
//   russian: string;
//   turkmen: string;
//   audioFileTurkmen?: string;
// }

// НОВЫЙ (заменить на типы выше)
```

**Критерий завершения:** TypeScript не показывает ошибки компиляции

---

#### ✅ 1.3 Создать конфигурацию языков

**Файл: src/config/languages.config.ts**

```typescript
// src/config/languages.config.ts
import { LanguageConfig } from '../types';

/**
 * Конфигурация всех 30 поддерживаемых языков
 */
export const LANGUAGES: LanguageConfig[] = [
  // ====================================
  // АКТИВНЫЕ ЯЗЫКИ (isAvailable: true)
  // ====================================
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
  
  // ====================================
  // COMING SOON (isAvailable: false)
  // ====================================
  {
    code: 'ja',
    name: '日本語',
    nameEn: 'Japanese',
    nameTk: 'Ýapon dili',
    flag: '🇯🇵',
    isAvailable: false,
    hasTranscription: true,
    ttsCode: 'ja-JP',
    direction: 'ltr'
  },
  {
    code: 'ko',
    name: '한국어',
    nameEn: 'Korean',
    nameTk: 'Koreý dili',
    flag: '🇰🇷',
    isAvailable: false,
    hasTranscription: true,
    ttsCode: 'ko-KR',
    direction: 'ltr'
  },
  {
    code: 'th',
    name: 'ไทย',
    nameEn: 'Thai',
    nameTk: 'Taý dili',
    flag: '🇹🇭',
    isAvailable: false,
    hasTranscription: true,
    ttsCode: 'th-TH',
    direction: 'ltr'
  },
  {
    code: 'vi',
    name: 'Tiếng Việt',
    nameEn: 'Vietnamese',
    nameTk: 'Wýetnam dili',
    flag: '🇻🇳',
    isAvailable: false,
    hasTranscription: false,
    ttsCode: 'vi-VN',
    direction: 'ltr'
  },
  {
    code: 'id',
    name: 'Bahasa Indonesia',
    nameEn: 'Indonesian',
    nameTk: 'Indoneziýa dili',
    flag: '🇮🇩',
    isAvailable: false,
    hasTranscription: false,
    ttsCode: 'id-ID',
    direction: 'ltr'
  },
  {
    code: 'ms',
    name: 'Bahasa Melayu',
    nameEn: 'Malay',
    nameTk: 'Malaý dili',
    flag: '🇲🇾',
    isAvailable: false,
    hasTranscription: false,
    ttsCode: 'ms-MY',
    direction: 'ltr'
  },
  {
    code: 'hi',
    name: 'हिन्दी',
    nameEn: 'Hindi',
    nameTk: 'Hindi dili',
    flag: '🇮🇳',
    isAvailable: false,
    hasTranscription: true,
    ttsCode: 'hi-IN',
    direction: 'ltr'
  },
  {
    code: 'ur',
    name: 'اردو',
    nameEn: 'Urdu',
    nameTk: 'Urdu dili',
    flag: '🇵🇰',
    isAvailable: false,
    hasTranscription: true,
    ttsCode: 'ur-PK',
    direction: 'rtl'
  },
  {
    code: 'fa',
    name: 'فارسی',
    nameEn: 'Persian',
    nameTk: 'Pars dili',
    flag: '🇮🇷',
    isAvailable: false,
    hasTranscription: true,
    ttsCode: 'fa-IR',
    direction: 'rtl'
  },
  {
    code: 'ps',
    name: 'پښتو',
    nameEn: 'Pashto',
    nameTk: 'Peştu dili',
    flag: '🇦🇫',
    isAvailable: false,
    hasTranscription: true,
    ttsCode: 'ps-AF',
    direction: 'rtl'
  },
  {
    code: 'de',
    name: 'Deutsch',
    nameEn: 'German',
    nameTk: 'Nemes dili',
    flag: '🇩🇪',
    isAvailable: false,
    hasTranscription: false,
    ttsCode: 'de-DE',
    direction: 'ltr'
  },
  {
    code: 'fr',
    name: 'Français',
    nameEn: 'French',
    nameTk: 'Fransuz dili',
    flag: '🇫🇷',
    isAvailable: false,
    hasTranscription: false,
    ttsCode: 'fr-FR',
    direction: 'ltr'
  },
  {
    code: 'es',
    name: 'Español',
    nameEn: 'Spanish',
    nameTk: 'Ispan dili',
    flag: '🇪🇸',
    isAvailable: false,
    hasTranscription: false,
    ttsCode: 'es-ES',
    direction: 'ltr'
  },
  {
    code: 'it',
    name: 'Italiano',
    nameEn: 'Italian',
    nameTk: 'Italýan dili',
    flag: '🇮🇹',
    isAvailable: false,
    hasTranscription: false,
    ttsCode: 'it-IT',
    direction: 'ltr'
  },
  {
    code: 'tr',
    name: 'Türkçe',
    nameEn: 'Turkish',
    nameTk: 'Türk dili',
    flag: '🇹🇷',
    isAvailable: false,
    hasTranscription: false,
    ttsCode: 'tr-TR',
    direction: 'ltr'
  },
  {
    code: 'pl',
    name: 'Polski',
    nameEn: 'Polish',
    nameTk: 'Polýak dili',
    flag: '🇵🇱',
    isAvailable: false,
    hasTranscription: false,
    ttsCode: 'pl-PL',
    direction: 'ltr'
  },
  {
    code: 'uk',
    name: 'Українська',
    nameEn: 'Ukrainian',
    nameTk: 'Ukrain dili',
    flag: '🇺🇦',
    isAvailable: false,
    hasTranscription: true,
    ttsCode: 'uk-UA',
    direction: 'ltr'
  },
  {
    code: 'hy',
    name: 'Հայերեն',
    nameEn: 'Armenian',
    nameTk: 'Ermeni dili',
    flag: '🇦🇲',
    isAvailable: false,
    hasTranscription: true,
    ttsCode: 'hy-AM',
    direction: 'ltr'
  },
  {
    code: 'ka',
    name: 'ქართული',
    nameEn: 'Georgian',
    nameTk: 'Gruzin dili',
    flag: '🇬🇪',
    isAvailable: false,
    hasTranscription: true,
    ttsCode: 'ka-GE',
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
  {
    code: 'uz',
    name: 'O\'zbek',
    nameEn: 'Uzbek',
    nameTk: 'Özbek dili',
    flag: '🇺🇿',
    isAvailable: false,
    hasTranscription: false,
    ttsCode: 'uz-UZ',
    direction: 'ltr'
  },
  {
    code: 'kk',
    name: 'Қазақ',
    nameEn: 'Kazakh',
    nameTk: 'Gazak dili',
    flag: '🇰🇿',
    isAvailable: false,
    hasTranscription: true,
    ttsCode: 'kk-KZ',
    direction: 'ltr'
  },
  {
    code: 'az',
    name: 'Azərbaycan',
    nameEn: 'Azerbaijani',
    nameTk: 'Azerbaýjan dili',
    flag: '🇦🇿',
    isAvailable: false,
    hasTranscription: false,
    ttsCode: 'az-AZ',
    direction: 'ltr'
  },
  {
    code: 'ky',
    name: 'Кыргыз',
    nameEn: 'Kyrgyz',
    nameTk: 'Gyrg dili',
    flag: '🇰🇬',
    isAvailable: false,
    hasTranscription: true,
    ttsCode: 'ky-KG',
    direction: 'ltr'
  },
  {
    code: 'tg',
    name: 'Тоҷикӣ',
    nameEn: 'Tajik',
    nameTk: 'Täjik dili',
    flag: '🇹🇯',
    isAvailable: false,
    hasTranscription: true,
    ttsCode: 'tg-TJ',
    direction: 'ltr'
  },
  {
    code: 'pt',
    name: 'Português',
    nameEn: 'Portuguese',
    nameTk: 'Portugal dili',
    flag: '🇵🇹',
    isAvailable: false,
    hasTranscription: false,
    ttsCode: 'pt-PT',
    direction: 'ltr'
  },
  {
    code: 'nl',
    name: 'Nederlands',
    nameEn: 'Dutch',
    nameTk: 'Golland dili',
    flag: '🇳🇱',
    isAvailable: false,
    hasTranscription: false,
    ttsCode: 'nl-NL',
    direction: 'ltr'
  },
];

// ====================================
// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// ====================================

export const getLanguageByCode = (code: string): LanguageConfig | undefined => {
  return LANGUAGES.find(lang => lang.code === code);
};

export const getAvailableLanguages = (): LanguageConfig[] => {
  return LANGUAGES.filter(lang => lang.isAvailable);
};

export const getComingSoonLanguages = (): LanguageConfig[] => {
  return LANGUAGES.filter(lang => !lang.isAvailable);
};

export const getLanguageProgress = (): { 
  available: number; 
  total: number; 
  percentage: number 
} => {
  const available = LANGUAGES.filter(lang => lang.isAvailable).length;
  const total = LANGUAGES.length;
  return {
    available,
    total,
    percentage: Math.round((available / total) * 100)
  };
};
```

**Критерий завершения:** Файл создан, 30 языков настроены

---

#### ✅ 1.4 Создать скрипт миграции

**Файл: scripts/migrateToMultilingual.js**

```javascript
// scripts/migrateToMultilingual.js
const fs = require('fs');
const path = require('path');

console.log('🚀 Миграция к мультиязычной структуре...\n');

// Читаем старый phrases.ts
const oldPhrasesPath = path.join(__dirname, '../src/data/phrases.ts');
const oldContent = fs.readFileSync(oldPhrasesPath, 'utf8');

// Regex для парсинга фраз
const phraseRegex = /{[\s\S]*?id:\s*["']([^"']+)["'][\s\S]*?categoryId:\s*["']([^"']+)["'][\s\S]*?(?:subcategoryId:\s*["']([^"']+)["'][,\s]*)?chinese:\s*["']([^"']+)["'][\s\S]*?pinyin:\s*["']([^"']+)["'][\s\S]*?russian:\s*["']([^"']+)["'][\s\S]*?turkmen:\s*["']([^"']+)["'][\s\S]*?audioFileTurkmen:\s*["']([^"']+)["'][\s\S]*?}/g;

const phrases = [];
let match;
let order = 1;

while ((match = phraseRegex.exec(oldContent)) !== null) {
  phrases.push({
    id: match[1],
    categoryId: match[2],
    subcategoryId: match[3] || undefined,
    chinese: match[4],
    pinyin: match[5],
    russian: match[6],
    turkmen: match[7],
    audioFileTurkmen: match[8],
    order: order++
  });
}

console.log(`✅ Найдено ${phrases.length} фраз\n`);

// Создаём директории
const baseDir = path.join(__dirname, '../src/data/languages');
const translationsDir = path.join(baseDir, 'translations');

[baseDir, translationsDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// 1. Создаём base.ts
const baseContent = `// AUTO-GENERATED: Базовые туркменские фразы
// Generated: ${new Date().toISOString()}
import { BasePhrase } from '../../types';

export const basePhrases: BasePhrase[] = [
${phrases.map(p => `  {
    id: "${p.id}",
    categoryId: "${p.categoryId}",${p.subcategoryId ? `\n    subcategoryId: "${p.subcategoryId}",` : ''}
    turkmen: "${p.turkmen}",
    audioFileTurkmen: "${p.audioFileTurkmen}",
    order: ${p.order}
  }`).join(',\n')}
];
`;

fs.writeFileSync(path.join(baseDir, 'base.ts'), baseContent);
console.log('✅ Создан base.ts');

// 2. Создаём chinese.ts
const chineseContent = `// AUTO-GENERATED: Китайские переводы
// Generated: ${new Date().toISOString()}
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
console.log('✅ Создан chinese.ts');

// 3. Создаём russian.ts
const russianContent = `// AUTO-GENERATED: Русские переводы
// Generated: ${new Date().toISOString()}
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
console.log('✅ Создан russian.ts');

// 4. Создаём english.ts (пустой, но с структурой)
const englishContent = `// Английские переводы (добавить позже)
import { LanguageTranslation } from '../../../types';

export const englishTranslations: LanguageTranslation[] = [
  // TODO: Добавить переводы
];
`;

fs.writeFileSync(path.join(translationsDir, 'english.ts'), englishContent);
console.log('✅ Создан english.ts (пустой)');

// 5. Создаём index.ts
const indexContent = `// AUTO-GENERATED: Агрегация переводов
import { chineseTranslations } from './translations/chinese';
import { russianTranslations } from './translations/russian';
import { englishTranslations } from './translations/english';
import { LanguageTranslation } from '../../types';

const translationsMap: Record<string, LanguageTranslation[]> = {
  zh: chineseTranslations,
  ru: russianTranslations,
  en: englishTranslations,
};

export const getTranslationsForLanguage = (
  languageCode: string
): LanguageTranslation[] => {
  return translationsMap[languageCode] || [];
};

export const hasTranslationsForLanguage = (
  languageCode: string
): boolean => {
  return languageCode in translationsMap;
};
`;

fs.writeFileSync(path.join(baseDir, 'index.ts'), indexContent);
console.log('✅ Создан index.ts');

console.log('\n🎉 Миграция завершена!\n');
console.log('📁 Созданные файлы:');
console.log('  src/data/languages/base.ts');
console.log('  src/data/languages/translations/chinese.ts');
console.log('  src/data/languages/translations/russian.ts');
console.log('  src/data/languages/translations/english.ts');
console.log('  src/data/languages/index.ts\n');
```

**Запустить:**
```bash
node scripts/migrateToMultilingual.js
```

**Критерий завершения:** Все 5 файлов созданы, 305 фраз мигрированы

---

### ✅ ЧЕКЛИСТ PHASE 1:

- [ ] Созданы папки `src/data/languages` и `src/config`
- [ ] Обновлён `src/types/index.ts` (новые интерфейсы)
- [ ] Создан `src/config/languages.config.ts` (30 языков)
- [ ] Создан скрипт `scripts/migrateToMultilingual.js`
- [ ] Запущен скрипт миграции
- [ ] Проверено: 305 фраз в `base.ts`
- [ ] Проверено: 305 переводов в `chinese.ts`
- [ ] Проверено: 305 переводов в `russian.ts`
- [ ] TypeScript компилируется без ошибок

**Тест:** Импортировать `basePhrases` и `chineseTranslations` - должны работать

---

# 🔴 PHASE 2: STATE MANAGEMENT
## День 2-3 | Приоритет: КРИТИЧЕСКИЙ

### 🎯 ЦЕЛЬ:
Обновить Context API для управления языками и создать хуки для работы с фразами.

---

### 📋 ЗАДАЧИ:

#### ✅ 2.1 Обновить ConfigContext

**Файл: src/contexts/ConfigContext.tsx**

```typescript
// src/contexts/ConfigContext.tsx
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getLanguageByCode } from '../config/languages.config';

interface ConfigContextType {
  selectedLanguage: string;      // Код выбранного языка
  setSelectedLanguage: (code: string) => Promise<void>;
  turkmenLanguage: string;       // Всегда 'tk'
  isLoading: boolean;
  isFirstLaunch: boolean;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

const STORAGE_KEY_LANGUAGE = '@turkmen_phrasebook:selected_language';
const STORAGE_KEY_FIRST_LAUNCH = '@turkmen_phrasebook:first_launch';

export const ConfigProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedLanguage, setSelectedLanguageState] = useState<string>('zh');
  const [isLoading, setIsLoading] = useState(true);
  const [isFirstLaunch, setIsFirstLaunch] = useState(true);

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

**Критерий завершения:** Context компилируется без ошибок

---

#### ✅ 2.2 Создать usePhrases hook

**Файл: src/hooks/usePhrases.ts**

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
          text: basePhrase.turkmen, // Fallback to turkmen
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

  const searchPhrases = (query: string): Phrase[] => {
    const lowerQuery = query.toLowerCase();
    return phrases.filter(phrase => 
      phrase.turkmen.toLowerCase().includes(lowerQuery) ||
      phrase.translation.text.toLowerCase().includes(lowerQuery)
    );
  };

  return {
    phrases,
    getPhrasesByCategory,
    getPhrasesBySubcategory,
    getPhraseById,
    searchPhrases
  };
};
```

**Критерий завершения:** Hook работает, возвращает фразы с переводами

---

#### ✅ 2.3 Обновить useAudio hook

**Файл: src/hooks/useAudio.ts**

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

  const playAudio = useCallback(async (
    text: string, 
    languageCode: string, 
    audioPath?: string
  ) => {
    if (isPlaying || isLoading) return;

    try {
      setIsLoading(true);

      // Останавливаем предыдущее
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }
      Speech.stop();

      // ТУРКМЕНСКИЙ - MP3
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

      // ОСТАЛЬНЫЕ - TTS
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

**Критерий завершения:** Аудио работает для туркменского и других языков

---

### ✅ ЧЕКЛИСТ PHASE 2:

- [ ] Обновлён `ConfigContext` (мультиязычность)
- [ ] Создан `usePhrases` hook
- [ ] Обновлён `useAudio` hook
- [ ] Протестирован выбор языка (zh, ru, en)
- [ ] Протестировано аудио (MP3 для tk, TTS для остальных)
- [ ] Нет ошибок в консоли

**Тест:** Сменить язык с китайского на русский - фразы обновляются мгновенно

---

---

# 🔴 PHASE 3: UI КОМПОНЕНТЫ
## День 3-4 | Приоритет: КРИТИЧЕСКИЙ

### 🎯 ЦЕЛЬ:
Создать экран выбора языка и обновить существующие компоненты для мультиязычности.

---

### 📋 ЗАДАЧИ:

#### ✅ 3.1 Создать LanguageSelectionScreen

**Файл: src/screens/LanguageSelectionScreen.tsx**

```typescript
// src/screens/LanguageSelectionScreen.tsx
import React from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet,
  SafeAreaView,
  StatusBar 
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
      // TODO: Показать toast "Coming soon!"
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
      <StatusBar barStyle="dark-content" />
      
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

**Критерий завершения:** Экран отображается со списком языков

---

#### ✅ 3.2 Обновить HomeScreen

**Добавить в src/screens/HomeScreen.tsx:**

```typescript
// Добавить в импорты
import { useConfig } from '../contexts/ConfigContext';
import { getLanguageByCode } from '../config/languages.config';

// Добавить внутри компонента HomeScreen
export const HomeScreen = () => {
  const navigation = useNavigation();
  const { selectedLanguage, turkmenLanguage } = useConfig();
  
  const selectedLang = getLanguageByCode(selectedLanguage);
  const turkmenLang = { flag: '🇹🇲', name: 'Türkmen' };

  return (
    <SafeAreaView style={styles.container}>
      {/* Language Header - ДОБАВИТЬ ЭТО */}
      <View style={styles.languageHeader}>
        <View style={styles.languageIndicator}>
          <Text style={styles.flagLarge}>{selectedLang?.flag}</Text>
          <Text style={styles.languageCode}>{selectedLang?.name}</Text>
        </View>
        
        <Ionicons name="swap-horizontal" size={24} color="#6B7280" />
        
        <View style={styles.languageIndicator}>
          <Text style={styles.flagLarge}>{turkmenLang.flag}</Text>
          <Text style={styles.languageCode}>{turkmenLang.name}</Text>
        </View>
        
        <TouchableOpacity 
          style={styles.changeLanguageButton}
          onPress={() => navigation.navigate('LanguageSelection' as never)}
        >
          <Ionicons name="settings-outline" size={20} color="#6B7280" />
        </TouchableOpacity>
      </View>

      {/* Остальной контент HomeScreen */}
      {/* ... существующий код ... */}
    </SafeAreaView>
  );
};

// Добавить в styles
const newStyles = StyleSheet.create({
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
    marginHorizontal: 16,
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

// Объединить с существующими styles
const styles = StyleSheet.create({
  ...existingStyles,
  ...newStyles
});
```

**Критерий завершения:** HomeScreen показывает выбранный язык в шапке

---

#### ✅ 3.3 Обновить PhraseItem компонент

**Файл: src/components/PhraseItem.tsx**

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
      {/* Туркменский */}
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

      {/* Перевод */}
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

**Критерий завершения:** PhraseItem показывает перевод и транскрипцию

---

### ✅ ЧЕКЛИСТ PHASE 3:

- [ ] Создан `LanguageSelectionScreen`
- [ ] Обновлён `HomeScreen` (индикатор языка)
- [ ] Обновлён `PhraseItem` (перевод + транскрипция)
- [ ] Все компоненты рендерятся без ошибок
- [ ] UI соответствует дизайну

**Тест:** Открыть LanguageSelectionScreen - видеть 30 языков, 3 активных

---

# 🟡 PHASE 4: НАВИГАЦИЯ
## День 4 | Приоритет: ВАЖНЫЙ

### 🎯 ЦЕЛЬ:
Добавить LanguageSelectionScreen в навигацию и настроить первый запуск.

---

### 📋 ЗАДАЧИ:

#### ✅ 4.1 Обновить навигацию

**Файл: src/navigation/AppNavigator.tsx (или аналогичный)**

```typescript
// Добавить импорт
import { LanguageSelectionScreen } from '../screens/LanguageSelectionScreen';
import { useConfig } from '../contexts/ConfigContext';

// Добавить экран в Stack Navigator
<Stack.Screen 
  name="LanguageSelection" 
  component={LanguageSelectionScreen}
  options={{
    title: 'Select Language',
    headerShown: true
  }}
/>
```

#### ✅ 4.2 Настроить первый запуск

**Файл: App.tsx (или RootNavigator)**

```typescript
// App.tsx
import { useConfig } from './src/contexts/ConfigContext';
import { LanguageSelectionScreen } from './src/screens/LanguageSelectionScreen';

export default function App() {
  const { isLoading, isFirstLaunch } = useConfig();

  if (isLoading) {
    return <SplashScreen />; // Показать splash
  }

  // Первый запуск - показать выбор языка
  if (isFirstLaunch) {
    return <LanguageSelectionScreen />;
  }

  // Обычная навигация
  return <AppNavigator />;
}
```

#### ✅ 4.3 Добавить кнопку смены языка в настройки

**Файл: src/screens/SettingsScreen.tsx**

```typescript
// Добавить пункт меню
<TouchableOpacity 
  style={styles.menuItem}
  onPress={() => navigation.navigate('LanguageSelection' as never)}
>
  <Ionicons name="language" size={24} color="#6B7280" />
  <Text style={styles.menuText}>Change Language</Text>
  <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
</TouchableOpacity>
```

---

### ✅ ЧЕКЛИСТ PHASE 4:

- [ ] `LanguageSelectionScreen` добавлен в навигацию
- [ ] Первый запуск показывает выбор языка
- [ ] Можно вернуться к выбору языка из настроек
- [ ] Переключение языка работает мгновенно
- [ ] При выборе "coming soon" ничего не происходит

**Тест:** 
1. Удалить приложение
2. Установить снова
3. При запуске видеть экран выбора языка
4. Выбрать язык → попасть на главный экран

---

# 🟡 PHASE 5: АНАЛИТИКА И OTA
## День 5 | Приоритет: ВАЖНЫЙ

### 🎯 ЦЕЛЬ:
Настроить Firebase Analytics и Expo Updates для OTA.

---

### 📋 ЗАДАЧИ:

#### ✅ 5.1 Установить Firebase

```bash
npx expo install @react-native-firebase/app @react-native-firebase/analytics
```

#### ✅ 5.2 Создать AnalyticsService

**Файл: src/services/AnalyticsService.ts**

```typescript
// src/services/AnalyticsService.ts
import analytics from '@react-native-firebase/analytics';

class AnalyticsService {
  async logLanguageSelected(languageCode: string) {
    await analytics().logEvent('language_selected', {
      language_code: languageCode,
    });
  }

  async logPhraseListened(phraseId: string, languageCode: string) {
    await analytics().logEvent('phrase_listened', {
      phrase_id: phraseId,
      language_code: languageCode,
    });
  }

  async logCategoryViewed(categoryId: string) {
    await analytics().logEvent('category_viewed', {
      category_id: categoryId,
    });
  }

  async logScreenView(screenName: string) {
    await analytics().logScreenView({
      screen_name: screenName,
    });
  }
}

export default new AnalyticsService();
```

#### ✅ 5.3 Добавить отслеживание событий

```typescript
// В LanguageSelectionScreen
import AnalyticsService from '../services/AnalyticsService';

const handleLanguageSelect = async (code: string) => {
  await setSelectedLanguage(code);
  await AnalyticsService.logLanguageSelected(code);
  navigation.navigate('Home');
};

// В PhraseItem
const handlePlayTurkmen = async () => {
  await playAudio(phrase.turkmen, 'tk', phrase.audioFileTurkmen);
  await AnalyticsService.logPhraseListened(phrase.id, 'tk');
};
```

#### ✅ 5.4 Настроить Expo Updates

**Файл: app.json**

```json
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

#### ✅ 5.5 Создать команды для OTA

**Добавить в package.json:**

```json
{
  "scripts": {
    "update:production": "eas update --branch production --message",
    "update:preview": "eas update --branch preview --message"
  }
}
```

---

### ✅ ЧЕКЛИСТ PHASE 5:

- [ ] Firebase Analytics установлен
- [ ] `AnalyticsService` создан
- [ ] События логируются (выбор языка, воспроизведение)
- [ ] Expo Updates настроен в `app.json`
- [ ] Команды для OTA готовы

**Тест:** Проверить в Firebase Console что события приходят

---

# 🟢 PHASE 6: БРЕНДИНГ
## День 5-6 | Приоритет: ОПЦИОНАЛЬНЫЙ

### 🎯 ЦЕЛЬ:
Обновить название, bundle ID, иконку и брендинг.

---

### 📋 ЗАДАЧИ:

#### ✅ 6.1 Обновить app.json

```json
{
  "expo": {
    "name": "Turkmen Phrasebook",
    "slug": "turkmen-phrasebook",
    "version": "1.0.0",
    "ios": {
      "bundleIdentifier": "com.seydicharyyev.turkmenphrasebook"
    },
    "android": {
      "package": "com.seydicharyyev.turkmenphrasebook"
    }
  }
}
```

#### ✅ 6.2 Создать новую иконку

**Требования:**
- Размер: 1024×1024 px
- Формат: PNG
- Концепция: Флаг Туркменистана + белый голубь
- Цвета: #10B981 (зелёный), белый

**Файлы:**
- `assets/icon.png` (1024×1024)
- `assets/adaptive-icon.png` (1024×1024)
- `assets/splash.png` (1284×2778)

#### ✅ 6.3 Переименовать GitHub репозиторий

```bash
# На GitHub: Settings → Repository name → TurkmenPhrasebook

# Локально обновить remote
git remote set-url origin https://github.com/seydicharyyev/TurkmenPhrasebook.git
```

---

### ✅ ЧЕКЛИСТ PHASE 6:

- [ ] `app.json` обновлён (название, bundle ID)
- [ ] Иконка создана и заменена
- [ ] Splash screen обновлён
- [ ] GitHub репозиторий переименован
- [ ] Git remote обновлён

**Тест:** Собрать APK и проверить что название "Turkmen Phrasebook"

---

# 🔴 PHASE 7: ТЕСТИРОВАНИЕ
## День 6-7 | Приоритет: КРИТИЧЕСКИЙ

### 🎯 ЦЕЛЬ:
Протестировать все функции на реальных устройствах.

---

### 📋 ЧЕКЛИСТ ТЕСТИРОВАНИЯ:

#### ✅ 7.1 Функциональное тестирование

**Первый запуск:**
- [ ] При первом запуске показывается LanguageSelectionScreen
- [ ] Видны 30 языков (3 активных, 27 coming soon)
- [ ] Прогресс бар показывает "3/30"
- [ ] Клик на "coming soon" ничего не делает
- [ ] Клик на активный язык → переход на HomeScreen

**Выбор языка:**
- [ ] Китайский: фразы на китайском + pinyin
- [ ] Русский: фразы на русском (без транскрипции)
- [ ] Английский: фразы на английском (без транскрипции)
- [ ] Переключение между языками мгновенное

**Аудио:**
- [ ] Туркменское аудио (MP3): работает для всех фраз
- [ ] Китайское TTS: работает
- [ ] Русское TTS: работает
- [ ] Английское TTS: работает

**Категории:**
- [ ] Все 22 категории отображаются
- [ ] Фразы фильтруются по категориям
- [ ] Подкатегории работают

**Навигация:**
- [ ] HomeScreen показывает выбранный язык
- [ ] Кнопка settings открывает выбор языка
- [ ] Можно вернуться назад

#### ✅ 7.2 Тестирование на устройствах

**Android:**
- [ ] Протестировано на Android 10+
- [ ] Аудио работает
- [ ] Навигация плавная
- [ ] Нет крашей

**iOS (опционально):**
- [ ] Протестировано на iOS 13+
- [ ] TTS работает
- [ ] Навигация плавная

#### ✅ 7.3 Performance тестирование

- [ ] Переключение языка < 100ms
- [ ] Открытие категории < 200ms
- [ ] Воспроизведение аудио < 500ms
- [ ] Нет утечек памяти

---

# 🔴 PHASE 8: PRODUCTION BUILD
## День 7 | Приоритет: КРИТИЧЕСКИЙ

### 🎯 ЦЕЛЬ:
Собрать production APK и подготовить к релизу.

---

### 📋 ЗАДАЧИ:

#### ✅ 8.1 Проверить конфигурацию

**app.json:**
```json
{
  "expo": {
    "name": "Turkmen Phrasebook",
    "version": "1.0.0",
    "android": {
      "versionCode": 1,
      "package": "com.seydicharyyev.turkmenphrasebook",
      "permissions": [
        "INTERNET",
        "ACCESS_NETWORK_STATE"
      ]
    }
  }
}
```

#### ✅ 8.2 Собрать APK

```bash
# Preview build (для тестирования)
eas build --platform android --profile preview

# Production build (для Google Play)
eas build --platform android --profile production
```

#### ✅ 8.3 Протестировать APK

- [ ] Установить APK на устройство
- [ ] Пройти весь чеклист Phase 7
- [ ] Проверить что все 3 языка работают
- [ ] Проверить аналитику

#### ✅ 8.4 Подготовить Store Listing

**Google Play Console:**

**Название приложения:**
- Английский: Turkmen Phrasebook
- Русский: Туркменский разговорник

**Краткое описание (80 символов):**
```
Learn Turkmen with 30 languages. Audio phrases for travelers.
```

**Полное описание:**
```
🇹🇲 Turkmen Phrasebook - Universal Language Learning App

Learn Turkmen language with support for 30 languages! Perfect for travelers, students, and anyone interested in Turkmen culture.

✨ Features:
• 305 essential phrases across 22 categories
• Audio pronunciation for every Turkmen phrase
• Text-to-speech for translations
• Offline support
• Clean, modern interface
• Regular updates with new languages

🌍 Currently Available Languages:
• Chinese (中文)
• Russian (Русский)  
• English

🔜 Coming Soon:
27 more languages including Japanese, Korean, Turkish, Arabic, and more!

📱 Perfect For:
• Tourists visiting Turkmenistan
• Language learners
• Business travelers
• Students

🎧 Audio Features:
• Professional Turkmen audio recordings
• High-quality text-to-speech
• Practice pronunciation

Download now and start learning Turkmen today!
```

**Категория:** Education
**Теги:** language learning, turkmen, phrasebook, travel

---

### ✅ ФИНАЛЬНЫЙ ЧЕКЛИСТ:

**Код:**
- [ ] Все Phase 1-7 завершены
- [ ] Нет ошибок TypeScript
- [ ] Нет warning в консоли
- [ ] Код отформатирован

**Тестирование:**
- [ ] Все тесты пройдены
- [ ] APK протестирован на реальном устройстве
- [ ] 3 языка работают корректно
- [ ] Аудио работает

**Документация:**
- [ ] README.md обновлён
- [ ] CHANGELOG.md создан
- [ ] Комментарии в коде актуальны

**Релиз:**
- [ ] Production APK собран
- [ ] Store Listing готов
- [ ] Скриншоты подготовлены (4-8 штук)
- [ ] Иконка финальная

---

## 🎉 ПОЗДРАВЛЯЕМ!

После завершения всех 8 фаз у вас будет:
✅ Универсальный туркменский разговорник
✅ Поддержка 30 языков (3 активных, 27 coming soon)
✅ Готовое приложение для Google Play
✅ Архитектура для быстрого добавления новых языков

---

## 📞 ПОДДЕРЖКА

**Вопросы по ТЗ:**
- Email: seydicharyev@icloud.com
- GitHub: @seydicharyyev

**Следующие шаги после релиза:**
1. Собрать отзывы пользователей
2. Исправить баги (если есть)
3. Добавить новые языки (по 2-3 в месяц)
4. Маркетинг и продвижение

---

**УДАЧИ В РАЗРАБОТКЕ! 🚀🇹🇲**
