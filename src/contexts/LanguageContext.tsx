// src/contexts/LanguageContext.tsx - ИСПРАВЛЕНО с правильными заголовками

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const APP_LANGUAGE_KEY = 'chinese_phrasebook_app_language';
const LANGUAGE_VERSION = '1.0';

export type AppLanguageMode = 'tk' | 'zh' | 'ru' | 'en';

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

  // Main Hub Modules
  phrasebookTitle: string;
  phrasebookSubtitle: string;
  visualTranslatorTitle: string;
  visualTranslatorSubtitle: string;
  textTranslatorTitle: string;
  textTranslatorSubtitle: string;
  dictionaryTitle: string;
  dictionarySubtitle: string;
  aiAssistantsTitle: string;
  aiAssistantsSubtitle: string;
  myFavoritesTitle: string;
  myFavoritesSubtitle: string;
  
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
    appTitle: 'TÜRKMEN SÖHBETDEŞLIK PROGRAMMASY',
    appSubtitle: 'Dil öwrenmek üçin ähli gurallary',
    selectCategory: 'Kategoriýa saýlaň',
    recentlyStudied: 'Soňky öwrenilen',
    study: 'Okuw',

    // Main Hub Modules
    phrasebookTitle: 'Gepleşik kitaby',
    phrasebookSubtitle: '22 kategoriýada 305 söz düzümi',
    visualTranslatorTitle: 'Wizual terjimeçi',
    visualTranslatorSubtitle: 'Kamera bilen teksti skanirleme',
    textTranslatorTitle: 'Tekst terjimeçi',
    textTranslatorSubtitle: 'Teksti ýazmak we terjime etmek',
    dictionaryTitle: 'Sözlük',
    dictionarySubtitle: 'v2.0-de çykar',
    aiAssistantsTitle: 'AI kömekçiler',
    aiAssistantsSubtitle: 'Akylly maslahatlar we goldaw',
    myFavoritesTitle: 'Halanýanlarym',
    myFavoritesSubtitle: 'Saklan maglumatlar',
    
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
    appTitle: '土库曼语学习应用',
    appSubtitle: '语言学习的所有工具',
    selectCategory: '选择类别',
    recentlyStudied: '最近学习',
    study: '学习',

    // Main Hub Modules
    phrasebookTitle: '常用语手册',
    phrasebookSubtitle: '22个类别中的305个短语',
    visualTranslatorTitle: '图像翻译',
    visualTranslatorSubtitle: '用相机扫描文本',
    textTranslatorTitle: '文本翻译',
    textTranslatorSubtitle: '输入并翻译文本',
    dictionaryTitle: '词典',
    dictionarySubtitle: 'v2.0推出',
    aiAssistantsTitle: 'AI助手',
    aiAssistantsSubtitle: '智能提示和支持',
    myFavoritesTitle: '我的收藏',
    myFavoritesSubtitle: '保存的内容',
    
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

  ru: {
    // Русский режим: русский изучает туркменский
    home: 'Главная',
    search: 'Поиск',
    favorites: 'Избранное',
    settings: 'Настройки',
    additionalFeatures: 'Дополнительно',
    statistics: 'Статистика',

    appTitle: 'ТУРКМЕНСКОЕ ЯЗЫКОВОЕ ПРИЛОЖЕНИЕ',
    appSubtitle: 'Все инструменты для изучения языка',
    selectCategory: 'Выберите категорию',
    recentlyStudied: 'Недавно изученное',
    study: 'Изучать',

    // Main Hub Modules
    phrasebookTitle: 'Разговорник',
    phrasebookSubtitle: '305 фраз в 22 категориях',
    visualTranslatorTitle: 'Визуальный переводчик',
    visualTranslatorSubtitle: 'Сканирование текста камерой',
    textTranslatorTitle: 'Текстовый переводчик',
    textTranslatorSubtitle: 'Ввод и перевод текста',
    dictionaryTitle: 'Словарь',
    dictionarySubtitle: 'Выйдет в v2.0',
    aiAssistantsTitle: 'AI помощники',
    aiAssistantsSubtitle: 'Умные подсказки и поддержка',
    myFavoritesTitle: 'Моё избранное',
    myFavoritesSubtitle: 'Сохранённое',

    pronunciation: 'Произношение',
    addToFavorites: 'Добавить в избранное',
    inFavorites: 'В избранном',
    share: 'Поделиться',

    settingsTitle: '⚙️ Настройки',
    languageInterface: 'Язык интерфейса',
    switchLanguage: 'Сменить язык',
    audio: 'Аудио',
    soundEffects: 'Звуковые эффекты',
    data: 'Данные',
    clearHistory: 'Очистить историю',
    offlineMode: 'Офлайн режим',
    about: 'О приложении',
    feedback: 'Обратная связь',

    searchPlaceholder: 'Введите фразу на любом языке...',
    noResults: 'Ничего не найдено',
    searchHistory: 'История поиска',

    cancel: 'Отмена',
    save: 'Сохранить',
    delete: 'Удалить',
    confirm: 'Подтвердить',
    loading: 'Загрузка...',
    error: 'Ошибка',
    success: 'Успешно',
  },

  en: {
    // English mode: English speaker learning Turkmen
    home: 'Home',
    search: 'Search',
    favorites: 'Favorites',
    settings: 'Settings',
    additionalFeatures: 'More Features',
    statistics: 'Statistics',

    appTitle: 'TURKMEN LANGUAGE APP',
    appSubtitle: 'All tools for language learning',
    selectCategory: 'Select a category',
    recentlyStudied: 'Recently studied',
    study: 'Study',

    // Main Hub Modules
    phrasebookTitle: 'Phrasebook',
    phrasebookSubtitle: '305 phrases in 22 categories',
    visualTranslatorTitle: 'Visual Translator',
    visualTranslatorSubtitle: 'Scan text with camera',
    textTranslatorTitle: 'Text Translator',
    textTranslatorSubtitle: 'Type and translate text',
    dictionaryTitle: 'Dictionary',
    dictionarySubtitle: 'Coming in v2.0',
    aiAssistantsTitle: 'AI Assistants',
    aiAssistantsSubtitle: 'Smart tips and support',
    myFavoritesTitle: 'My Favorites',
    myFavoritesSubtitle: 'Saved items',

    pronunciation: 'Pronunciation',
    addToFavorites: 'Add to favorites',
    inFavorites: 'In favorites',
    share: 'Share',

    settingsTitle: '⚙️ Settings',
    languageInterface: 'Interface language',
    switchLanguage: 'Switch language',
    audio: 'Audio',
    soundEffects: 'Sound effects',
    data: 'Data',
    clearHistory: 'Clear history',
    offlineMode: 'Offline mode',
    about: 'About app',
    feedback: 'Feedback',

    searchPlaceholder: 'Enter phrase in any language...',
    noResults: 'No results found',
    searchHistory: 'Search history',

    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    confirm: 'Confirm',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
  },
};

const validateConfig = (config: any): config is AppLanguageConfig => {
  return (
    config &&
    typeof config === 'object' &&
    ['tk', 'zh', 'ru', 'en'].includes(config.mode) &&
    ['tk', 'zh'].includes(config.primaryLanguage) &&
    ['tk', 'zh'].includes(config.learningLanguage) &&
    config.helperLanguage === 'ru' &&
    typeof config.version === 'string'
  );
};

const createConfig = (mode: AppLanguageMode): AppLanguageConfig => {
  // Для ru и en интерфейса - используем tk-zh пару по умолчанию
  let primaryLanguage: 'tk' | 'zh' = 'tk';
  let learningLanguage: 'tk' | 'zh' = 'zh';

  if (mode === 'tk') {
    primaryLanguage = 'tk';
    learningLanguage = 'zh';
  } else if (mode === 'zh') {
    primaryLanguage = 'zh';
    learningLanguage = 'tk';
  }
  // Для 'ru' и 'en' используем значения по умолчанию (tk-zh)

  return {
    mode,
    primaryLanguage,
    learningLanguage,
    helperLanguage: 'ru',
    version: LANGUAGE_VERSION,
  };
};

interface LanguageContextValue {
  config: AppLanguageConfig;
  isLoading: boolean;
  setLanguageMode: (mode: AppLanguageMode, shouldSave?: boolean) => Promise<void>;
  switchMode: () => Promise<boolean>;
  resetLanguageSettings: () => Promise<void>;
  getTexts: () => InterfaceTexts;
  getLanguageName: (lang: 'tk' | 'zh' | 'ru') => string;
  getPhraseTexts: (phrase: { translation: { text: string; transcription?: string }; turkmen: string }) => {
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
      if (!['tk', 'zh', 'ru', 'en'].includes(mode)) {
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
      return INTERFACE_TEXTS[config.mode] || INTERFACE_TEXTS.tk;
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

  const getPhraseTexts = (phrase: { translation: { text: string; transcription?: string }; turkmen: string }) => {
    try {
      if (config.mode === 'tk') {
        // Туркмен изучает выбранный язык (китайский/русский/английский)
        return {
          primary: phrase.translation.text,  // Выбранный язык - основной для изучения
          learning: phrase.turkmen,          // Туркменский - родной язык
          helper: phrase.translation.transcription || ''  // Транскрипция если есть
        };
      } else {
        // Носитель другого языка изучает туркменский
        return {
          primary: phrase.turkmen,           // Туркменский - основной для изучения
          learning: phrase.translation.text, // Выбранный язык - родной язык
          helper: phrase.translation.transcription || ''  // Транскрипция если есть
        };
      }
    } catch (error) {
      console.warn('Ошибка получения текстов фразы:', error);
      return {
        primary: phrase.translation.text,
        learning: phrase.turkmen,
        helper: ''
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