// src/contexts/LanguageContext.tsx
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
  home: string;
  search: string;
  favorites: string;
  settings: string;
  appTitle: string;
  selectCategory: string;
  recentlyStudied: string;
  pronunciation: string;
  addToFavorites: string;
  inFavorites: string;
  share: string;
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
  searchPlaceholder: string;
  noResults: string;
  searchHistory: string;
  cancel: string;
  save: string;
  delete: string;
  confirm: string;
  loading: string;
  error: string;
  success: string;
}

const INTERFACE_TEXTS: Record<AppLanguageMode, InterfaceTexts> = {
  tk: {
    home: 'Baş sahypa',
    search: 'Gözleg',
    favorites: 'Halanýanlar',
    settings: 'Sazlamalar',
    appTitle: 'Hytaý sözlem kitaby',
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
    offlineMode: 'Oflaýn режim',
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
    home: '主页',
    search: '搜索',
    favorites: '收藏',
    settings: '设置',
    appTitle: '土库曼语会话手册',
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

interface LanguageContextType {
  isLoading: boolean;
  isFirstLaunch: boolean;
  config: AppLanguageConfig;
  error: string | null;
  setLanguageMode: (mode: AppLanguageMode, shouldSave?: boolean) => Promise<void>;
  switchMode: () => Promise<boolean>;
  getTexts: () => InterfaceTexts;
  getLanguageName: (lang: 'tk' | 'zh' | 'ru') => string;
  getPhraseTexts: (phrase: { chinese: string; turkmen: string; russian: string }) => {
    primary: string;
    learning: string;
    helper: string;
  };
  resetLanguageSettings: () => Promise<boolean>;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

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

export const createConfig = (mode: AppLanguageMode): AppLanguageConfig => ({
  mode,
  primaryLanguage: mode,
  learningLanguage: mode === 'tk' ? 'zh' : 'tk',
  helperLanguage: 'ru',
  version: LANGUAGE_VERSION,
});

interface LanguageProviderProps {
  children: ReactNode;
  initialConfig?: AppLanguageConfig;
}

export function LanguageProvider({ children, initialConfig }: LanguageProviderProps) {
  const [isLoading, setIsLoading] = useState(!initialConfig);
  const [isFirstLaunch, setIsFirstLaunch] = useState(false);
  const [config, setConfig] = useState<AppLanguageConfig>(initialConfig || createConfig('tk'));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!initialConfig) {
      loadLanguageConfig();
    }
  }, [initialConfig]);

  const loadLanguageConfig = async () => {
    try {
      setError(null);
      const savedConfig = await AsyncStorage.getItem(APP_LANGUAGE_KEY);
      
      if (savedConfig) {
        const parsedConfig = JSON.parse(savedConfig);
        
        if (validateConfig(parsedConfig)) {
          if (parsedConfig.version !== LANGUAGE_VERSION) {
            const migratedConfig = createConfig(parsedConfig.mode || 'tk');
            await saveConfig(migratedConfig);
            setConfig(migratedConfig);
          } else {
            setConfig(parsedConfig);
          }
          setIsFirstLaunch(false);
        } else {
          throw new Error('Invalid language configuration');
        }
      } else {
        setIsFirstLaunch(true);
      }
    } catch (error) {
      console.warn('Ошибка загрузки языковой конфигурации:', error);
      setError('Не удалось загрузить языковые настройки');
      setIsFirstLaunch(true);
      setConfig(createConfig('tk'));
    } finally {
      setIsLoading(false);
    }
  };

  const saveConfig = async (newConfig: AppLanguageConfig): Promise<boolean> => {
    try {
      if (!validateConfig(newConfig)) {
        throw new Error('Invalid configuration');
      }
      
      await AsyncStorage.setItem(APP_LANGUAGE_KEY, JSON.stringify(newConfig));
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
        // Туркмен: понимает туркменский, изучает китайский
        return {
          primary: phrase.chinese,     // Китайский - то что должен сказать
          learning: phrase.turkmen,    // Туркменский - то что понимает
          helper: phrase.russian       // Русский - дополнительная помощь
        };
      } else {
        // Китаец: понимает китайский, изучает туркменский
        return {
          primary: phrase.turkmen,     // Туркменский - то что должен сказать
          learning: phrase.chinese,    // Китайский - то что понимает
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

  const resetLanguageSettings = async (): Promise<boolean> => {
    try {
      await AsyncStorage.removeItem(APP_LANGUAGE_KEY);
      setIsFirstLaunch(true);
      setError(null);
      setConfig(createConfig('tk'));
      return true;
    } catch (error) {
      console.warn('Ошибка сброса языковых настроек:', error);
      setError('Не удалось сбросить настройки');
      return false;
    }
  };

  const value: LanguageContextType = {
    isLoading,
    isFirstLaunch,
    config,
    error,
    setLanguageMode,
    switchMode,
    getTexts,
    getLanguageName,
    getPhraseTexts,
    resetLanguageSettings,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useAppLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useAppLanguage must be used within a LanguageProvider');
  }
  return context;
}