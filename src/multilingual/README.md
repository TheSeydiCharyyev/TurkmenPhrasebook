# 🌍 Multilingual System - Phase 2

Мультиязычная система для Turkmen Phrasebook, поддерживающая 30 языков.

## 📦 Установка

```typescript
import { ConfigProvider, useConfig, usePhrases, useAudioMultilingual } from '@/multilingual';
```

## 🎯 Основные компоненты

### 1. ConfigProvider

Context provider для управления выбранным языком.

```typescript
// App.tsx
import { ConfigProvider } from '@/multilingual';

export default function App() {
  return (
    <ConfigProvider>
      <YourApp />
    </ConfigProvider>
  );
}
```

### 2. useConfig Hook

Hook для работы с конфигурацией языка.

```typescript
import { useConfig } from '@/multilingual';

function LanguageSelector() {
  const { selectedLanguage, setSelectedLanguage, isLoading } = useConfig();

  const handleSelect = async (code: string) => {
    try {
      await setSelectedLanguage(code);
      console.log(`Language changed to: ${code}`);
    } catch (error) {
      console.error('Failed to change language:', error);
    }
  };

  return (
    <View>
      <Text>Current: {selectedLanguage}</Text>
      <Button onPress={() => handleSelect('zh')}>Chinese</Button>
      <Button onPress={() => handleSelect('ru')}>Russian</Button>
      <Button onPress={() => handleSelect('en')}>English</Button>
    </View>
  );
}
```

### 3. usePhrases Hook

Hook для получения фраз с переводами.

```typescript
import { usePhrases } from '@/multilingual';

function PhrasesList() {
  const { phrases, getPhrasesByCategory, searchPhrases, getStatistics } = usePhrases();

  // Все фразы
  console.log('Total phrases:', phrases.length);

  // Фразы по категории
  const greetings = getPhrasesByCategory('greetings');

  // Поиск
  const results = searchPhrases('hello');

  // Статистика
  const stats = getStatistics();

  return (
    <FlatList
      data={greetings}
      renderItem={({ item }) => (
        <View>
          <Text>{item.turkmen}</Text>
          <Text>{item.translation.text}</Text>
          {item.translation.transcription && (
            <Text>{item.translation.transcription}</Text>
          )}
        </View>
      )}
    />
  );
}
```

### 4. useAudioMultilingual Hook

Hook для воспроизведения аудио на любом языке.

```typescript
import { useAudioMultilingual } from '@/multilingual';

function AudioPlayer({ phrase }) {
  const { playAudio, isPlaying, stopAudio } = useAudioMultilingual();

  const handlePlayTurkmen = () => {
    // MP3 для туркменского
    playAudio(phrase.turkmen, 'tk', phrase.audioFileTurkmen);
  };

  const handlePlayTranslation = () => {
    // TTS для перевода
    playAudio(phrase.translation.text, selectedLanguage);
  };

  return (
    <View>
      <Button
        onPress={handlePlayTurkmen}
        disabled={isPlaying}
      >
        🔊 Turkmen
      </Button>
      <Button
        onPress={handlePlayTranslation}
        disabled={isPlaying}
      >
        🔊 Translation
      </Button>
    </View>
  );
}
```

## 🌍 Поддерживаемые языки

### Активные (3):
- 🇨🇳 Chinese (zh) - 中文
- 🇷🇺 Russian (ru) - Русский
- 🇬🇧 English (en) - English

### Coming Soon (27):
- 🇯🇵 Japanese (ja) - 日本語
- 🇰🇷 Korean (ko) - 한국어
- 🇹🇷 Turkish (tr) - Türkçe
- ... и еще 24 языка

## 📊 Структура данных

```
src/
├── data/languages/
│   ├── base.ts                 # 305 туркменских фраз
│   ├── translations/
│   │   ├── chinese.ts         # 305 китайских переводов
│   │   ├── russian.ts         # 305 русских переводов
│   │   └── english.ts         # Английские (TODO)
│   └── index.ts               # Агрегация
├── config/
│   └── languages.config.ts    # Конфигурация 30 языков
├── contexts/
│   └── ConfigContext.tsx      # Context API
├── hooks/
│   ├── usePhrases.ts          # Hook для фраз
│   └── useAudioMultilingual.ts # Hook для аудио
└── multilingual/
    ├── index.ts               # Экспорты
    └── README.md              # Эта документация
```

## 🔧 API Reference

### ConfigProvider Props
```typescript
interface ConfigContextType {
  selectedLanguage: string;      // Код языка (zh, ru, en...)
  setSelectedLanguage: (code: string) => Promise<void>;
  turkmenLanguage: string;       // Всегда 'tk'
  isLoading: boolean;
  isFirstLaunch: boolean;
}
```

### usePhrases Return
```typescript
{
  phrases: PhraseWithTranslation[];
  getPhrasesByCategory: (categoryId: string) => PhraseWithTranslation[];
  getPhrasesBySubcategory: (subcategoryId: string) => PhraseWithTranslation[];
  getPhraseById: (id: string) => PhraseWithTranslation | undefined;
  searchPhrases: (query: string) => PhraseWithTranslation[];
  getStatistics: () => Statistics;
}
```

### useAudioMultilingual Return
```typescript
{
  isPlaying: boolean;
  isLoading: boolean;
  playAudio: (text: string, languageCode: string, audioPath?: string) => Promise<void>;
  stopAudio: () => Promise<void>;
}
```

## 🎨 Типы

```typescript
interface PhraseWithTranslation {
  id: string;
  categoryId: string;
  subcategoryId?: string;
  turkmen: string;
  audioFileTurkmen?: string;
  order: number;
  translation: {
    text: string;
    transcription?: string;
  };
}

interface LanguageConfig {
  code: string;              // ISO 639-1
  name: string;              // Название на родном языке
  nameEn: string;            // Название на английском
  nameTk: string;            // Название на туркменском
  flag: string;              // Emoji флаг
  isAvailable: boolean;      // Доступен ли язык
  hasTranscription: boolean; // Есть ли транскрипция
  ttsCode: string;           // Код для TTS
  direction: 'ltr' | 'rtl';  // Направление письма
}
```

## ✅ Примеры использования

### Полный пример экрана

```typescript
import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useConfig, usePhrases, useAudioMultilingual } from '@/multilingual';

export const PhrasesScreen = () => {
  const { selectedLanguage } = useConfig();
  const { getPhrasesByCategory } = usePhrases();
  const { playAudio, isPlaying } = useAudioMultilingual();

  const phrases = getPhrasesByCategory('greetings');

  const handlePlay = (phrase, lang) => {
    if (lang === 'tk') {
      playAudio(phrase.turkmen, 'tk', phrase.audioFileTurkmen);
    } else {
      playAudio(phrase.translation.text, selectedLanguage);
    }
  };

  return (
    <FlatList
      data={phrases}
      renderItem={({ item }) => (
        <View>
          <TouchableOpacity onPress={() => handlePlay(item, 'tk')}>
            <Text>🔊 {item.turkmen}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handlePlay(item, selectedLanguage)}>
            <Text>🔊 {item.translation.text}</Text>
            {item.translation.transcription && (
              <Text>({item.translation.transcription})</Text>
            )}
          </TouchableOpacity>
        </View>
      )}
    />
  );
};
```

## 🚀 Roadmap

- [x] Phase 1: Структура данных
- [x] Phase 2: State Management
- [ ] Phase 3: UI компоненты
- [ ] Phase 4: Навигация
- [ ] Phase 5: Аналитика и OTA
- [ ] Phase 6: Брендинг
- [ ] Phase 7: Тестирование
- [ ] Phase 8: Production Build

## 📞 Support

Email: seydicharyev@icloud.com
GitHub: @seydicharyyev
