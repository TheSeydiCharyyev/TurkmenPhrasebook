// src/types/index.ts
// ✅ ОБНОВЛЕНО: Добавлены поля для аудио файлов + навигационные типы

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

export interface Category {
  id: string;
  icon: string;
  color: string;
  nameRu: string;
  nameTk: string;
  nameZh: string;
  hasSubcategories?: boolean;
  subcategories?: SubCategory[];
}

export interface SubCategory {
  id: string;
  parentId: string;
  nameRu: string;
  nameTk: string;
  nameZh: string;
  icon: string;
  color: string;
}

// ===== НАВИГАЦИОННЫЕ ТИПЫ =====

export type RootStackParamList = {
  MainTabs: undefined;
  PhraseDetail: { phrase: Phrase };
};

export type MainTabParamList = {
  Home: undefined;
  AdditionalFeatures: undefined;
  Settings: undefined;
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