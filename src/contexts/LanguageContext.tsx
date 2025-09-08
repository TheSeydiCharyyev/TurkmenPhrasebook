// src/contexts/LanguageContext.tsx - ИСПРАВЛЕННАЯ ВЕРСИЯ с правильными переводами

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

// ✅ ИСПРАВЛЕНО: Правильные переводы интерфейса
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
  selectCategory: string;
  recentlyStudied: string;
  
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

// ✅ ИСПРАВЛЕНО: Правильные переводы для обоих языков
const INTERFACE_TEXTS: Record<AppLanguageMode, InterfaceTexts> = {
  tk: {
    // Туркменский интерфейс - ЗАГЛАВНЫМИ БУКВАМИ как требуется
    home: 'Baş sahypa',
    search: 'Gözleg',
    favorites: 'Halanýanlar',
    settings: 'Sazlamalar',
    additionalFeatures: 'Goşmaça mümkinçilikler',
    statistics: 'Statistika',
    
    appTitle: 'HYTAÝ SÖZLEM KITABY', // ✅ ЗАГЛАВНЫМИ 
    selectCategory: 'Kategoriýa saýlaň',
    recentlyStudied: '📚 Soňky öwrenilen',
    
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
    // Китайский интерфейс - СРЕДНИМИ ИЕРОГЛИФАМИ как требуется
    home: '主页',
    search: '搜索',
    favorites: '收藏',
    settings: '设置',
    additionalFeatures: '额外功能',
    statistics: '统计',
    
    appTitle: '土库曼语会话手册', // ✅ СРЕДНИМИ ИЕРОГЛИФАМИ
    selectCategory: '选择类别',
    recentlyStudied: '📚 最近学习的',
    
    pronunciation: '发音',
    addToFavorites: '添加到收藏',
    inFavorites: '已收藏',
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
    
    searchPlaceholder: '输入任何语言的短语...',
    noResults: '未找到结果',
    searchHistory: '搜索历史',
    
    cancel: '取消',
    save: '保存',
    delete: '删除',
    confirm: '确认',
    loading: '加载中...',
    error: '错误',
    success: '成功',
  }
};

// Валидация конфигурации
const validateConfig = (config: any): config is AppLanguageConfig => {
  return (
    config &&
    typeof config === 'object' &&
    ['tk', 'zh'].includes(config.mode) &&
    ['tk', 'zh'].includes(config.primaryLanguage) &&
    ['tk', 'zh'].includes(config.learningLanguage) &&
    config.helperLanguage === 'ru' &&
    config.primaryLanguage !== config.learningLanguage
  );
};

// Создание корректной конфигурации
const createConfig = (mode: AppLanguageMode): AppLanguageConfig => ({
  mode,
  primaryLanguage: mode,
  learningLanguage: mode === 'tk' ? 'zh' : 'tk',
  helperLanguage: 'ru',
  version: LANGUAGE_VERSION,
});

interface LanguageContextValue {
  config: AppLanguageConfig;
  setLanguageMode: (mode: AppLanguageMode, shouldSave?: boolean) => Promise<void>;
  switchMode: () => Promise<boolean>;
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

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<AppLanguageConfig>(createConfig('tk'));
  const [isFirstLaunch, setIsFirstLaunch] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Загрузка сохраненной конфигурации
  useEffect(() => {
    loadSavedConfig();
  }, []);

  const loadSavedConfig = async () => {
    try {
      const savedData = await AsyncStorage.getItem(APP_LANGUAGE_KEY);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        if (validateConfig(parsedData)) {
          setConfig(parsedData);
          setIsFirstLaunch(false);
        } else {
          // Если конфигурация невалидна, создаем новую
          const defaultConfig = createConfig('tk');
          setConfig(defaultConfig);
          await saveConfig(defaultConfig);
        }
      } else {
        setIsFirstLaunch(true);
      }
    } catch (error) {
      console.warn('Ошибка загрузки языковой конфигурации:', error);
      setError('Не удалось загрузить настройки языка');
    }
  };

  const saveConfig = async (configToSave: AppLanguageConfig): Promise<boolean> => {
    try {
      await AsyncStorage.setItem(APP_LANGUAGE_KEY, JSON.stringify(configToSave));
      return true;
    } catch (error) {
      console.warn('Ошибка сохранения языковой конфигурации:', error);
      setError('Не удалось сохранить настройки языка');
      return false;
    }
  };

  // Установка языкового режима
  const setLanguageMode = async (mode: AppLanguageMode, shouldSave: boolean = true): Promise<void> => {
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

  // Переключение режима (для настроек)
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

  // Получить тексты интерфейса для текущего языка
  const getTexts = (): InterfaceTexts => {
    try {
      return INTERFACE_TEXTS[config.primaryLanguage as AppLanguageMode] || INTERFACE_TEXTS.tk;
    } catch (error) {
      console.warn('Ошибка получения текстов интерфейса:', error);
      return INTERFACE_TEXTS.tk; // Fallback к туркменскому
    }
  };

  // Получить название языка на родном языке
  const getLanguageName = (lang: 'tk' | 'zh' | 'ru'): string => {
    const names = {
      tk: config.primaryLanguage === 'tk' ? 'TÜRKMENÇE' : '土库曼语', // ✅ ЗАГЛАВНЫМИ/средними
      zh: config.primaryLanguage === 'tk' ? 'hytaýça' : '中文',      // ✅ маленькими/средними  
      ru: config.primaryLanguage === 'tk' ? 'rusça' : '俄语'        // ✅ маленькими/маленькими
    };
    return names[lang] || lang;
  };

  // ✅ ИСПРАВЛЕНО: Получить текст фразы в правильном порядке приоритета
  const getPhraseTexts = (phrase: { chinese: string; turkmen: string; russian: string }) => {
    try {
      if (config.mode === 'tk') {
        // Туркмен изучает китайский: 
        // 1. TÜRKMENÇE (заглавными) - что понимает
        // 2. 中文 (средними) - что изучает  
        // 3. русский (маленькими) - помощь
        return {
          primary: phrase.turkmen,     // ГЛАВНЫЙ - туркменский (что понимает)
          learning: phrase.chinese,    // ИЗУЧАЕМЫЙ - китайский
          helper: phrase.russian       // ПОМОЩЬ - русский
        };
      } else {
        // Китаец изучает туркменский:
        // 1. 中文 (средними) - что понимает
        // 2. TÜRKMENÇE (заглавными) - что изучает
        // 3. русский (маленькими) - помощь  
        return {
          primary: phrase.chinese,     // ГЛАВНЫЙ - китайский (что понимает)
          learning: phrase.turkmen,    // ИЗУЧАЕМЫЙ - туркменский
          helper: phrase.russian       // ПОМОЩЬ - русский
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
    setLanguageMode,
    switchMode,
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