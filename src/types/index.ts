// src/types/index.ts - Обновленные типы с поддержкой статистики
export interface Category {
  id: string;
  nameRu: string;
  nameTk: string;
  nameZh: string;
  icon: string;
  color: string;
}

export interface Phrase {
  id: string;
  categoryId: string;
  chinese: string;
  pinyin: string;
  russian: string;
  turkmen: string;
  audioFile: string;
}

// Типы для навигации - обновленные с новой вкладкой Stats
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

// Типы для истории и статистики
export interface HistoryItem {
  phraseId: string;
  categoryId: string;
  viewedAt: number;
  viewCount: number;
  sessionId: string;
  studyTime: number; // в секундах
}

export interface StudySession {
  id: string;
  startTime: number;
  endTime?: number;
  phrasesCount: number;
  categoriesUsed: string[];
  totalTime: number; // в секундах
}

export interface StudyStats {
  totalViews: number;
  uniquePhrases: number;
  totalStudyTime: number; // в минутах
  sessionsCount: number;
  averageSessionTime: number;
  streakDays: number;
  lastStudyDate: number;
  bestStreakDays: number;
  categoriesProgress: Record<string, CategoryProgress>;
  weeklyStats: WeeklyStats[];
  dailyGoal: DailyGoal;
  // Добавляем для быстрого доступа
  todaysPhrases?: number;
  thisWeekPhrases?: number;
}

export interface CategoryProgress {
  phrasesStudied: number;
  totalViews: number;
  lastStudied: number;
  averageTime: number; // в секундах
}

export interface WeeklyStats {
  weekStart: number;
  phrasesStudied: number;
  timeSpent: number; // в минутах
  sessionsCount: number;
}

export interface DailyGoal {
  phrasesPerDay: number;
  currentStreak: number;
  achieved: boolean;
  lastAchieved: number;
}

export interface DayProgress {
  date: number;
  phrasesStudied: number;
  uniquePhrases: number;
  timeSpent: number; // в минутах
}

// Типы для компонентов статистики
export interface CategoryStatsItem {
  category: Category;
  phrasesStudied: number;
  totalViews: number;
  lastStudied: number;
  averageTime: number;
  recentActivity: HistoryItem[];
  progressPercentage: number;
  totalPhrasesInCategory: number;
}

// Тип для языка интерфейса
export type AppLanguage = "ru" | "tk" | "zh";

// Расширенные настройки приложения
export interface AppSettings {
  language: AppLanguage;
  soundEnabled: boolean;
  fontSize: number;
  darkMode: boolean;
  hapticFeedback: boolean;
  autoPlay: boolean;
  speechRate: number;
}

// Типы для поиска
export interface SearchHistoryItem {
  query: string;
  timestamp: number;
  resultsCount: number;
}

// Типы для офлайн функционала
export interface OfflineData {
  phrases: Phrase[];
  categories: Category[];
  version: string;
  cachedAt: number;
}

export interface CacheInfo {
  version: string;
  cachedAt: Date;
  phrasesCount: number;
  categoriesCount: number;
}

// Типы для обработки ошибок
export interface ErrorState {
  hasError: boolean;
  error: string | null;
  isRetrying: boolean;
}

// Типы для результатов SafeStorage
export interface StorageResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}
