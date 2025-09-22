// src/types/index.ts - ИСПРАВЛЕННЫЕ типы навигации (совместимые с текущим кодом)

// ===== ОСНОВНЫЕ ТИПЫ (БЕЗ ИЗМЕНЕНИЙ) =====

export interface Category {
  id: string;
  nameRu: string;
  nameTk: string;
  nameZh: string;
  icon: string;
  color: string;
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
  phrasesCount?: number;
  bookSection?: string;
}

export interface Phrase {
  id: string;
  categoryId: string;
  subcategoryId?: string; // ✨ НОВОЕ поле
  chinese: string;
  pinyin: string;
  russian: string;
  turkmen: string;
  audioFile: string;
  isUsefulWord?: boolean;
}

// ===== ТИПЫ ДЛЯ НАВИГАЦИИ (ИСПРАВЛЕННЫЕ - БЕЗ НОВЫХ ЭКРАНОВ) =====

// ✅ ОСТАВЛЯЕМ КАК ЕСТЬ - БЕЗ SubCategoryScreen
export type RootStackParamList = {
  MainTabs: undefined;
  PhraseDetail: { phrase: Phrase };
};

export type MainTabParamList = {
  Home: undefined;
  AdditionalFeatures: undefined;
  Settings: undefined;
};

// ✅ ОСТАВЛЯЕМ КАК ЕСТЬ - БЕЗ SubCategoryScreen
export type HomeStackParamList = {
  HomeScreen: undefined;
  CategoryScreen: { category: Category };
};

// ===== ОСТАЛЬНЫЕ ТИПЫ (БЕЗ ИЗМЕНЕНИЙ) =====

export interface HistoryItem {
  phraseId: string;
  categoryId: string;
  subcategoryId?: string;
  viewedAt: number;
  viewCount: number;
  sessionId: string;
  studyTime: number;
}

export interface StudySession {
  id: string;
  startTime: number;
  endTime?: number;
  phrasesCount: number;
  categoriesUsed: string[];
  subcategoriesUsed?: string[];
  totalTime: number;
}

export interface StudyStats {
  totalViews: number;
  uniquePhrases: number;
  totalStudyTime: number;
  sessionsCount: number;
  averageSessionTime: number;
  streakDays: number;
  lastStudyDate: number;
  bestStreakDays: number;
  categoriesProgress: Record<string, CategoryProgress>;
  subcategoriesProgress?: Record<string, SubCategoryProgress>;
  weeklyStats: WeeklyStats[];
  dailyGoal: DailyGoal;
  todaysPhrases?: number;
  thisWeekPhrases?: number;
}

export interface CategoryProgress {
  phrasesStudied: number;
  totalViews: number;
  lastStudied: number;
  averageTime: number;
  subcategoriesProgress?: Record<string, SubCategoryProgress>;
}

export interface SubCategoryProgress {
  phrasesStudied: number;
  totalViews: number;
  lastStudied: number;
  averageTime: number;
  completionPercentage: number;
}

export interface WeeklyStats {
  weekStart: number;
  phrasesStudied: number;
  timeSpent: number;
  sessionsCount: number;
  categoriesUsed: string[];
  subcategoriesUsed?: string[];
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
  timeSpent: number;
  categoriesUsed: string[];
  subcategoriesUsed?: string[];
}

export interface CategoryStatsItem {
  category: Category;
  phrasesStudied: number;
  totalViews: number;
  lastStudied: number;
  averageTime: number;
  recentActivity: HistoryItem[];
  progressPercentage: number;
  totalPhrasesInCategory: number;
  subcategoriesStats?: SubCategoryStatsItem[];
}

export interface SubCategoryStatsItem {
  subcategory: SubCategory;
  phrasesStudied: number;
  totalViews: number;
  lastStudied: number;
  averageTime: number;
  progressPercentage: number;
  totalPhrasesInSubcategory: number;
}

export type AppLanguage = "ru" | "tk" | "zh";

export interface AppSettings {
  language: AppLanguage;
  soundEnabled: boolean;
  fontSize: number;
  darkMode: boolean;
  hapticFeedback: boolean;
  autoPlay: boolean;
  speechRate: number;
  showSubcategories: boolean;
}

export interface SearchHistoryItem {
  query: string;
  timestamp: number;
  resultsCount: number;
  categoriesFound: string[];
  subcategoriesFound?: string[];
}

export interface SearchResult {
  phrase: Phrase;
  category: Category;
  subcategory?: SubCategory;
  relevanceScore: number;
  matchType: 'exact' | 'partial' | 'fuzzy';
}

export interface OfflineData {
  phrases: Phrase[];
  categories: Category[];
  subcategories: SubCategory[];
  version: string;
  cachedAt: number;
}

export interface CacheInfo {
  version: string;
  cachedAt: Date;
  phrasesCount: number;
  categoriesCount: number;
  subcategoriesCount: number;
}

export interface ErrorState {
  hasError: boolean;
  error: string | null;
  isRetrying: boolean;
}

export interface StorageResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// ===== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ =====

export const hasSubcategories = (category: Category): category is Category & { hasSubcategories: true; subcategories: SubCategory[] } => {
  return Boolean(category.hasSubcategories && category.subcategories && category.subcategories.length > 0);
};

export type PhraseFilter = {
  categoryId?: string;
  subcategoryId?: string;
  isUsefulWord?: boolean;
  searchQuery?: string;
};