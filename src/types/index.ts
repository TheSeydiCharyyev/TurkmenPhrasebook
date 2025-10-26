// src/types/index.ts
// ✅ ОБНОВЛЕНО: Добавлены поля для аудио файлов + навигационные типы + мультиязычность

// ====================================
// НОВЫЕ ТИПЫ ДЛЯ МУЛЬТИЯЗЫЧНОСТИ
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
// СТАРЫЕ ТИПЫ (сохранены для совместимости)
// ====================================

/**
 * Старый формат фразы - сохранен для обратной совместимости
 * В Phase 2 будет заменен на PhraseWithTranslation
 */
export interface Phrase {
  id: string;
  categoryId: string;
  subcategoryId?: string;
  chinese: string;
  pinyin: string;
  russian: string;
  turkmen: string;
  
  // ✅ НОВЫЕ ПОЛЯ: отдельные пути к аудио для каждого языка
  audioFileChinese?: string;  // Путь к китайскому MP3 или undefined
  audioFileTurkmen?: string;  // Путь к туркменскому MP3 или undefined
  
  // ⚠️ DEPRECATED: старое поле, оставлено для совместимости
  audioFile?: string;
}

/**
 * Полная фраза с переводом (для нового UI)
 * Используется в новых компонентах - объединяет BasePhrase + перевод на выбранный язык
 */
export interface PhraseWithTranslation extends BasePhrase {
  translation: {
    text: string;
    transcription?: string;
  };
}

export interface Category {
  id: string;
  icon: string;
  color: string;
  nameRu: string;
  nameTk: string;
  nameZh: string;
  nameEn: string;  // ✅ ДОБАВЛЕНО: английское название
  hasSubcategories?: boolean;
  subcategories?: SubCategory[];
}

export interface SubCategory {
  id: string;
  parentId: string;
  nameRu: string;
  nameTk: string;
  nameZh: string;
  nameEn: string;  // ✅ ДОБАВЛЕНО: английское название
  icon: string;
  color: string;
}

// ===== НАВИГАЦИОННЫЕ ТИПЫ =====

// Import Visual Translator types
import type { TranslationResult } from '../features/visual-translator/types/visual-translator.types';

export type RootStackParamList = {
  MainHub: undefined;  // ✅ НОВЫЙ: главный Hub после выбора языка
  Home: undefined;  // Phrasebook Stack
  Settings: undefined;
  AdditionalFeatures: undefined;
  PhraseDetail: { phrase: PhraseWithTranslation };
  LanguageSelection: undefined;
  VisualTranslator: undefined;  // ✅ Phase 2: Visual Translator home
  TranslationResult: { result: TranslationResult };  // ✅ Phase 2: Translation results
};

export type HomeStackParamList = {
  HomeScreen: undefined;
  CategoryScreen: { category: Category };
};

// ===== ОСТАЛЬНЫЕ ТИПЫ =====

export interface AppLanguageConfig {
  mode: 'ru' | 'tk' | 'zh';
  displayName: string;
}

export interface FavoritePhrase {
  phraseId: string;
  timestamp: number;
}

export interface SearchHistoryItem {
  query: string;
  timestamp: number;
}

export interface AudioPlaybackState {
  isPlaying: boolean;
  isLoading: boolean;
  currentPhraseId?: string;
  currentLanguage?: 'chinese' | 'turkmen';
}

export interface HistoryItem {
  phraseId: string;
  categoryId: string;
  subcategoryId?: string;
  viewedAt: number;
  viewCount: number;
}

export type AppLanguage = 'ru' | 'tk' | 'zh';

export interface AppSettings {
  language: AppLanguage;
  soundEnabled: boolean;
  fontSize: number;
  darkMode: boolean;
  hapticFeedback: boolean;
  autoPlay: boolean;
  speechRate: number;
}

export interface AppLanguageConfig {
  mode: 'ru' | 'tk' | 'zh';
  displayName: string;
}

export interface FavoritePhrase {
  phraseId: string;
  timestamp: number;
}

export interface SearchHistoryItem {
  query: string;
  timestamp: number;
}

export interface AudioPlaybackState {
  isPlaying: boolean;
  isLoading: boolean;
  currentPhraseId?: string;
  currentLanguage?: 'chinese' | 'turkmen';
}