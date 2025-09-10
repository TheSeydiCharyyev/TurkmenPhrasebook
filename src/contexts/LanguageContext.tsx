// src/contexts/LanguageContext.tsx - ИСПРАВЛЕНО с правильными заголовками

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const APP_LANGUAGE_KEY = 'chinese_phrasebook_app_language';
const LANGUAGE_VERSION = '1.0';

export type AppLanguageMode = 'tk' | 'zh';

export interface AppLanguageConfig {
  mode: AppLanguageMode;
  primaryLanguage: 'tk' | 'zh';
  learningLanguage: 'zh' | 'tk';
  helperLanguage: 'ru';
  version: string;
}

export interface InterfaceTexts {
  // Общие
  home: string;
  search: string;
  favorites: string;
  settings: string;
  additionalFeatures: string;
  statistics: string;
  
  // Главный экран
  appTitle: string;
  appSubtitle: string; // ✅ ДОБАВЛЕНО: подзаголовок с языками
  selectCategory: string;
  recentlyStudied: string;
  study: string;
  
  // Детальный экран
  pronunciation: string;
  addToFavorites: string;
  inFavorites: string;
  share: string;
  
  // Настройки
  settingsTitle: string;
  languageInterface: string;
  switchLanguage: string;
  audio: string;
  soundEffects: string;
  data: string;
  clearHistory: string;
  offlineMode: string;
  about: string;
  feedback: string;
  
  // Поиск
  searchPlaceholder: string;
  noResults: string;
  searchHistory: string;
  
  // Общие действия
  cancel: string;
  save: string;
  delete: string;
  confirm: string;
  loading: string;
  error: string;
  success: string;
}

// ✅ ИСПРАВЛЕНО: Правильные заголовки согласно требованиям
const INTERFACE_TEXTS: Record<AppLanguageMode, InterfaceTexts> = {
  tk: {
    // Туркменский режим: туркмен изучает китайский
    home: 'Baş sahypa',
    search: 'Gözleg',
    favorites: 'Halanýanlar',
    settings: 'Sazlamalar',
    additionalFeatures: 'Goşmaça mümkinçilikler',
    statistics: 'Statistika',
    
    // ✅ ИСПРАВЛЕНО: Правильный заголовок для туркменского интерфейса
    appTitle: 'TÜRKMEN-HYTAÝ GEPLEŞIK KITABY',
    appSubtitle: '土库曼-中文会话手册', // Китайский перевод заголовка
    selectCategory: 'Kategoriýa saýlaň',
    recentlyStudied: 'Soňky öwrenilen',  // Оставляем для внутреннего использования
    study: 'Okuw',
    
    pronunciation: 'Aýdylyş',
    addToFavorites: 'Halanýanlara goş',
    inFavorites: 'Halanýanlarda',
    share: 'Paýlaş',
    
    settingsTitle: '⚙️ Sazlamalar',
    languageInterface: 'Interfeýs dili',
    switchLanguage: 'Dil çalyş',
    audio: 'Audio',
    soundEffects: 'Ses effektleri',
    data: 'Maglumatlar',
    clearHistory: 'Taryhy arassala',
    offlineMode: 'Oflaýn režim',
    about: 'Programma hakda',
    feedback: 'Pikir alyşmak',
    
    searchPlaceholder: 'Islendik dilde sözlem giriziň...',
    noResults: 'Hiç zat tapylmady',
    searchHistory: 'Gözleg taryhy',
    
    cancel: 'Ýatyr',
    save: 'Ýatda sakla',
    delete: 'Arassala',
    confirm: 'Tassykla',
    loading: 'Ýüklenýär...',
    error: 'Ýalňyş',
    success: 'Üstünlik',
  },
  
  zh: {
    // Китайский режим: китаец изучает туркменский
    home: '主页',
    search: '搜索',
    favorites: '收藏',
    settings: '设置',
    additionalFeatures: '其他功能',
    statistics: '统计',
    
    // ✅ ИСПРАВЛЕНО: Правильный заголовок для китайского интерфейса
    appTitle: '中文-土库曼语会话手册',
    appSubtitle: 'TÜRKMEN-HYTAÝ GEPLEŞIK KITABY • Туркменский-Китайский разговорник', // Полный перевод
    selectCategory: '选择类别',
    recentlyStudied: '最近学习',
    study: '学习',
    
    pronunciation: '发音',
    addToFavorites: '添加到收藏',
    inFavorites: '在收藏中',
    share: '分享',
    
    settingsTitle: '⚙️ 设置',
    languageInterface: '界面语言',
    switchLanguage: '切换语言',
    audio: '音频',
    soundEffects: '音效',
    data: '数据',
    clearHistory: '清除历史',
    offlineMode: '离线模式',
    about: '关于应用',
    feedback: '反馈',
    
    searchPlaceholder: '输入任何语言的短语搜索...',
    noResults: '未找到结果',
    searchHistory: '搜索历史',
    
    cancel: '取消',
    save: '保存',
    delete: '删除',
    confirm: '确认',
    loading: '加载中...',
    error: '错误',
    success: '成功',
  },
};

const validateConfig = (config: any): config is AppLanguageConfig => {
  return (
    config &&
    typeof config === 'object' &&
    ['tk', 'zh'].includes(config.mode) &&
    ['tk', 'zh'].includes(config.primaryLanguage) &&
    ['tk', 'zh'].includes(config.learningLanguage) &&
    config.helperLanguage === 'ru' &&
    typeof config.version === 'string'
  );
};

const createConfig = (mode: AppLanguageMode): AppLanguageConfig => ({
  mode,
  primaryLanguage: mode,
  learningLanguage: mode === 'tk' ? 'zh' : 'tk',
  helperLanguage: 'ru',
  version: LANGUAGE_VERSION,
});

interface LanguageContextValue {
  config: AppLanguageConfig;
  isLoading: boolean;
  setLanguageMode: (mode: AppLanguageMode, shouldSave?: boolean) => Promise<void>;
  switchMode: () => Promise<boolean>;
  resetLanguageSettings: () => Promise<void>;
  getTexts: () => InterfaceTexts;
  getLanguageName: (lang: 'tk' | 'zh' | 'ru') => string;
  getPhraseTexts: (phrase: { chinese: string; turkmen: string; russian: string }) => {
    primary: string;
    learning: string;
    helper: string;
  };
  isFirstLaunch: boolean;
  error: string | null;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [config, setConfig] = useState<AppLanguageConfig>(createConfig('tk'));
  const [isFirstLaunch, setIsFirstLaunch] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Загрузка сохраненной конфигурации при запуске
  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const saved = await AsyncStorage.getItem(APP_LANGUAGE_KEY);
      if (saved) {
        const parsedConfig = JSON.parse(saved);
        if (validateConfig(parsedConfig)) {
          setConfig(parsedConfig);
          setIsFirstLaunch(false);
        }
      }
    } catch (error) {
      console.warn('Ошибка загрузки языковой конфигурации:', error);
      setError('Не удалось загрузить настройки языка');
    } finally {
      setIsLoading(false);
    }
  };

  const saveConfig = async (config: AppLanguageConfig): Promise<boolean> => {
    try {
      await AsyncStorage.setItem(APP_LANGUAGE_KEY, JSON.stringify(config));
      return true;
    } catch (error) {
      console.warn('Ошибка сохранения языковой конфигурации:', error);
      setError('Не удалось сохранить настройки языка');
      return false;
    }
  };

  const setLanguageMode = async (mode: AppLanguageMode, shouldSave: boolean = true) => {
    try {
      if (!['tk', 'zh'].includes(mode)) {
        throw new Error(`Invalid language mode: ${mode}`);
      }

      const newConfig = createConfig(mode);
      
      if (shouldSave) {
        const saved = await saveConfig(newConfig);
        if (saved) {
          setIsFirstLaunch(false);
          setError(null);
        }
      }

      setConfig(newConfig);
    } catch (error) {
      console.warn('Ошибка установки языкового режима:', error);
      setError('Не удалось изменить язык');
    }
  };

  const switchMode = async (): Promise<boolean> => {
    try {
      const newMode: AppLanguageMode = config.mode === 'tk' ? 'zh' : 'tk';
      await setLanguageMode(newMode, true);
      return true;
    } catch (error) {
      console.warn('Ошибка переключения режима:', error);
      return false;
    }
  };

  const resetLanguageSettings = async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(APP_LANGUAGE_KEY);
      setConfig(createConfig('tk'));
      setIsFirstLaunch(true);
      setError(null);
    } catch (error) {
      console.warn('Ошибка сброса настроек языка:', error);
      setError('Не удалось сбросить настройки языка');
    }
  };

  const getTexts = (): InterfaceTexts => {
    try {
      return INTERFACE_TEXTS[config.primaryLanguage as AppLanguageMode] || INTERFACE_TEXTS.tk;
    } catch (error) {
      console.warn('Ошибка получения текстов интерфейса:', error);
      return INTERFACE_TEXTS.tk;
    }
  };

  const getLanguageName = (lang: 'tk' | 'zh' | 'ru'): string => {
    const names = {
      tk: config.primaryLanguage === 'tk' ? 'Türkmençe' : '土库曼语',
      zh: config.primaryLanguage === 'tk' ? 'Hytaýça' : '中文',
      ru: config.primaryLanguage === 'tk' ? 'Rusça' : '俄语'
    };
    return names[lang] || lang;
  };

  const getPhraseTexts = (phrase: { chinese: string; turkmen: string; russian: string }) => {
    try {
      if (config.mode === 'tk') {
        // Туркмен изучает китайский
        return {
          primary: phrase.chinese,     // Китайский - основной для изучения
          learning: phrase.turkmen,    // Туркменский - родной язык
          helper: phrase.russian       // Русский - дополнительная помощь
        };
      } else {
        // Китаец изучает туркменский
        return {
          primary: phrase.turkmen,     // Туркменский - основной для изучения
          learning: phrase.chinese,    // Китайский - родной язык
          helper: phrase.russian       // Русский - дополнительная помощь
        };
      }
    } catch (error) {
      console.warn('Ошибка получения текстов фразы:', error);
      return {
        primary: phrase.chinese,
        learning: phrase.turkmen,
        helper: phrase.russian
      };
    }
  };

  const contextValue: LanguageContextValue = {
    config,
    isLoading,
    setLanguageMode,
    switchMode,
    resetLanguageSettings,
    getTexts,
    getLanguageName,
    getPhraseTexts,
    isFirstLaunch,
    error,
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useAppLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useAppLanguage must be used within a LanguageProvider');
  }
  return context;
}