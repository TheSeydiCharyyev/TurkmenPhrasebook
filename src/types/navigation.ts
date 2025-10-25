// src/types/navigation.ts - Обновленные типы навигации с подкатегориями

import { Category, SubCategory, Phrase } from './index';

// Основной стек навигации
export type RootStackParamList = {
  MainTabs: undefined;
  PhraseDetail: { phrase: Phrase };
  SubCategoryScreen: {
    subcategory: SubCategory;
    parentCategory: Category;
  };
  LanguageSelection: undefined; // Экран выбора языка (Phase 4)
};

// Главные вкладки
export type MainTabParamList = {
  Home: undefined;
  AdditionalFeatures: undefined;
  Settings: undefined;
};

// Стек главной вкладки
export type HomeStackParamList = {
  HomeScreen: undefined;
  CategoryScreen: { category: Category };
  SubCategoryScreen: { 
    subcategory: SubCategory; 
    parentCategory: Category;
  };
};

// Стек дополнительных возможностей
export type AdditionalFeaturesStackParamList = {
  AdditionalFeaturesMain: undefined;
  Search: undefined;
  Favorites: undefined;
  Stats: undefined;
  Recent: undefined;
  InterestingFacts: undefined;
  RandomPhrases: undefined;
};

// Типы для хуков навигации
export type NavigationProp<T extends keyof RootStackParamList> = {
  navigate: (screen: T, params?: RootStackParamList[T]) => void;
  goBack: () => void;
  push: (screen: T, params?: RootStackParamList[T]) => void;
  replace: (screen: T, params?: RootStackParamList[T]) => void;
};

// Типы для route параметров
export type RouteProp<T extends keyof RootStackParamList> = {
  params: RootStackParamList[T];
  key: string;
  name: T;
};

// Экспорт для обратной совместимости
export type { 
  RootStackParamList as LegacyRootStackParamList,
  MainTabParamList as LegacyMainTabParamList,
  HomeStackParamList as LegacyHomeStackParamList
};