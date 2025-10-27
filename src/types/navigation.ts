// src/types/navigation.ts - Обновленные типы навигации (Hub Architecture)
// ✅ Phase 1 & Phase 2 - Полностью обновлено

import type { Category, SubCategory, Phrase, PhraseWithTranslation } from './index';
import type { TranslationResult } from '../features/visual-translator/types/visual-translator.types';

/**
 * ГЛАВНЫЙ СТЕК НАВИГАЦИИ (Hub Architecture)
 * После выбора языка пользователь попадает на MainHub,
 * откуда может перейти в любой из модулей
 */
export type RootStackParamList = {
  // Main Hub - центральный экран со всеми модулями
  MainHub: undefined;

  // Language Selection - выбор языка интерфейса
  LanguageSelection: undefined;

  // Phrasebook Module (Phase 1 - Ready)
  Home: undefined;  // Phrasebook Home Stack
  PhraseDetail: { phrase: Phrase | PhraseWithTranslation };

  // Visual Translator Module (Phase 2 - Ready)
  VisualTranslator: undefined;
  TranslationResult: { result: TranslationResult };

  // Text Translator Module (Phase 3 - Ready)
  TextTranslator: undefined;

  // AI Assistants Module (Phase 4 - Ready)
  AIAssistantsHome: undefined;
  ContextualTips: undefined;
  ConversationTrainer: undefined;
  GrammarHelper: undefined;
  CulturalAdvisor: undefined;
  GeneralAssistant: undefined;

  // Dictionary Module (v2.0 - Coming Soon Placeholder)
  Dictionary: undefined;

  // Additional Features (Search, Favorites, Stats)
  AdditionalFeatures: undefined;

  // Settings
  Settings: undefined;
};

/**
 * PHRASEBOOK HOME STACK
 * Навигация внутри модуля Phrasebook
 */
export type HomeStackParamList = {
  LanguagePairSelection: undefined; // Выбор языковой пары при первом запуске
  HomeScreen: undefined;
  CategoryScreen: { category: Category };
  SubCategoryScreen?: {
    subcategory: SubCategory;
    parentCategory: Category;
  };
};

/**
 * ADDITIONAL FEATURES STACK
 * Search, Favorites, Stats, Recent
 */
export type AdditionalFeaturesStackParamList = {
  AdditionalFeaturesMain: undefined;
  Search: undefined;
  Favorites: undefined;
  Stats: undefined;
  Recent?: undefined;
};

/**
 * VISUAL TRANSLATOR STACK (Phase 2)
 */
export type VisualTranslatorStackParamList = {
  VisualTranslatorHome: undefined;
  Camera?: { targetLanguage: string };
  TranslationResult: { result: TranslationResult };
};

// ===== DEPRECATED (Старые типы - оставлены для обратной совместимости) =====

/**
 * @deprecated Используйте RootStackParamList
 * Старые bottom tabs были заменены на Hub-архитектуру
 */
export type MainTabParamList = {
  Home: undefined;
  AdditionalFeatures: undefined;
  Settings: undefined;
};

// ===== ВСПОМОГАТЕЛЬНЫЕ ТИПЫ =====

/**
 * Типы для хуков навигации
 */
export type NavigationProp<T extends keyof RootStackParamList> = {
  navigate: (screen: T, params?: RootStackParamList[T]) => void;
  goBack: () => void;
  push: (screen: T, params?: RootStackParamList[T]) => void;
  replace: (screen: T, params?: RootStackParamList[T]) => void;
  reset: (state: any) => void;
};

/**
 * Типы для route параметров
 */
export type RouteProp<T extends keyof RootStackParamList> = {
  params: RootStackParamList[T];
  key: string;
  name: T;
};

// ===== ЭКСПОРТ =====

export type {
  Category,
  SubCategory,
  Phrase,
  PhraseWithTranslation,
  TranslationResult,
};
