// src/contexts/LanguageContext.tsx - SENIOR PRODUCTION VERSION
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ===============================================
// TYPES & CONSTANTS
// ===============================================

export type AppLanguageMode = 'tk' | 'zh';

interface AppLanguageConfig {
  mode: AppLanguageMode;
  primaryLanguage: AppLanguageMode;
  learningLanguage: AppLanguageMode;
  helperLanguage: 'ru';
  version: string;
  lastUpdated: number;
  isFirstTime: boolean;
}

interface InterfaceTexts {
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

interface LanguageContextType {
  // State
  isLoading: boolean;
  isFirstLaunch: boolean;
  config: AppLanguageConfig;
  error: string | null;
  
  // Actions
  setLanguageMode: (mode: AppLanguageMode, shouldSave?: boolean) => Promise<void>;
  switchMode: () => Promise<boolean>;
  resetLanguageSettings: () => Promise<boolean>;
  
  // Getters
  getTexts: () => InterfaceTexts;
  getLanguageName: (lang: 'tk' | 'zh' | 'ru') => string;
  getPhraseTexts: (phrase: { chinese: string; turkmen: string; russian: string }) => {
    primary: string;
    learning: string;
    helper: string;
  };
  
  // Dev Tools (только в development)
  __DEV_TOOLS?: {
    getState: () => any;
    forceLanguage: (mode: AppLanguageMode) => void;
    validateConfig: () => boolean;
    exportConfig: () => string;
    importConfig: (config: string) => Promise<boolean>;
  };
}

// ===============================================
// CONSTANTS
// ===============================================

const APP_LANGUAGE_KEY = 'app_language_config_v3'; // Bumped version for clean migration
const LANGUAGE_VERSION = '3.0.0';
const __DEV__: boolean = typeof process !== 'undefined' && process.env.NODE_ENV === 'development';

// ===============================================
// INTERFACE TEXTS
// ===============================================

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
    switchLanguage: 'Dili üýtget',
    audio: 'Audio',
    soundEffects: 'Ses effektleri',
    data: 'Maglumatlar',
    clearHistory: 'Taryhy arassala',
    offlineMode: 'Offline regime',
    about: 'Programma hakda',
    feedback: 'Teswir',
    searchPlaceholder: 'Islendik dilde gözläň...',
    noResults: 'Netije tapylmady',
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

// ===============================================
// VALIDATION & UTILITIES
// ===============================================

const validateConfig = (config: any): config is AppLanguageConfig => {
  return (
    config &&
    typeof config === 'object' &&
    ['tk', 'zh'].includes(config.mode) &&
    ['tk', 'zh'].includes(config.primaryLanguage) &&
    ['tk', 'zh'].includes(config.learningLanguage) &&
    config.helperLanguage === 'ru' &&
    config.primaryLanguage !== config.learningLanguage &&
    typeof config.version === 'string' &&
    typeof config.lastUpdated === 'number' &&
    typeof config.isFirstTime === 'boolean'
  );
};

const createConfig = (mode: AppLanguageMode): AppLanguageConfig => ({
  mode,
  primaryLanguage: mode,
  learningLanguage: mode === 'tk' ? 'zh' : 'tk',
  helperLanguage: 'ru',
  version: LANGUAGE_VERSION,
  lastUpdated: Date.now(),
  isFirstTime: true,
});

// ===============================================
// CONTEXT
// ===============================================

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
  initialConfig?: AppLanguageConfig;
}

export function LanguageProvider({ children, initialConfig }: LanguageProviderProps) {
  const [isLoading, setIsLoading] = useState(!initialConfig);
  const [isFirstLaunch, setIsFirstLaunch] = useState(false);
  const [config, setConfig] = useState<AppLanguageConfig>(
    initialConfig || createConfig('tk') // Always default to Turkmen for CNG users
  );
  const [error, setError] = useState<string | null>(null);

  // ===============================================
  // CORE LIFECYCLE
  // ===============================================

  useEffect(() => {
    if (!initialConfig) {
      loadLanguageConfig();
    }
  }, [initialConfig]);

  const loadLanguageConfig = async () => {
    try {
      setError(null);
      
      // Try to load saved config
      const savedConfig = await AsyncStorage.getItem(APP_LANGUAGE_KEY);
      
      if (savedConfig) {
        const parsedConfig = JSON.parse(savedConfig);
        
        if (validateConfig(parsedConfig)) {
          // Handle version migration
          if (parsedConfig.version !== LANGUAGE_VERSION) {
            console.log(`[LanguageContext] Migrating from ${parsedConfig.version} to ${LANGUAGE_VERSION}`);
            const migratedConfig = {
              ...createConfig(parsedConfig.mode || 'tk'),
              isFirstTime: false, // Preserve that this isn't first time
            };
            await saveConfig(migratedConfig);
            setConfig(migratedConfig);
          } else {
            setConfig(parsedConfig);
          }
          setIsFirstLaunch(parsedConfig.isFirstTime);
        } else {
          throw new Error('Invalid saved configuration');
        }
      } else {
        // First launch - but start with Turkmen for CNG audience
        console.log('[LanguageContext] First launch detected, defaulting to Turkmen');
        setIsFirstLaunch(true);
        setConfig(createConfig('tk'));
      }
    } catch (error) {
      console.warn('[LanguageContext] Error loading config:', error);
      setError('Failed to load language settings');
      setIsFirstLaunch(true);
      setConfig(createConfig('tk')); // Always fallback to Turkmen
    } finally {
      setIsLoading(false);
    }
  };

  // ===============================================
  // CORE ACTIONS
  // ===============================================

  const saveConfig = async (newConfig: AppLanguageConfig): Promise<boolean> => {
    try {
      if (!validateConfig(newConfig)) {
        throw new Error('Invalid configuration');
      }
      
      await AsyncStorage.setItem(APP_LANGUAGE_KEY, JSON.stringify(newConfig));
      console.log('[LanguageContext] Config saved:', newConfig.mode);
      return true;
    } catch (error) {
      console.warn('[LanguageContext] Error saving config:', error);
      setError('Failed to save language settings');
      return false;
    }
  };

  const setLanguageMode = async (mode: AppLanguageMode, shouldSave: boolean = true) => {
    try {
      if (!['tk', 'zh'].includes(mode)) {
        throw new Error(`Invalid language mode: ${mode}`);
      }

      const newConfig: AppLanguageConfig = {
        ...createConfig(mode),
        isFirstTime: false, // Mark as not first time anymore
      };
      
      if (shouldSave) {
        const saved = await saveConfig(newConfig);
        if (saved) {
          setIsFirstLaunch(false);
          setError(null);
        }
      }

      setConfig(newConfig);
      console.log('[LanguageContext] Language mode set to:', mode);
    } catch (error) {
      console.warn('[LanguageContext] Error setting language mode:', error);
      setError('Failed to change language');
    }
  };

  const switchMode = useCallback(async (): Promise<boolean> => {
    try {
      const newMode: AppLanguageMode = config.mode === 'tk' ? 'zh' : 'tk';
      await setLanguageMode(newMode, true);
      return true;
    } catch (error) {
      console.warn('[LanguageContext] Error switching mode:', error);
      return false;
    }
  }, [config.mode]);

  const resetLanguageSettings = useCallback(async (): Promise<boolean> => {
    try {
      await AsyncStorage.removeItem(APP_LANGUAGE_KEY);
      setIsFirstLaunch(true);
      setError(null);
      setConfig(createConfig('tk')); // Reset to Turkmen
      console.log('[LanguageContext] Language settings reset');
      return true;
    } catch (error) {
      console.warn('[LanguageContext] Error resetting language settings:', error);
      setError('Failed to reset settings');
      return false;
    }
  }, []);

  // ===============================================
  // GETTERS
  // ===============================================

  const getTexts = useCallback((): InterfaceTexts => {
    try {
      return INTERFACE_TEXTS[config.primaryLanguage] || INTERFACE_TEXTS.tk;
    } catch (error) {
      console.warn('[LanguageContext] Error getting texts:', error);
      return INTERFACE_TEXTS.tk; // Fallback to Turkmen
    }
  }, [config.primaryLanguage]);

  const getLanguageName = useCallback((lang: 'tk' | 'zh' | 'ru'): string => {
    const names = {
      tk: config.primaryLanguage === 'tk' ? 'Türkmençe' : '土库曼语',
      zh: config.primaryLanguage === 'tk' ? 'Hytaýça' : '中文',
      ru: config.primaryLanguage === 'tk' ? 'Rusça' : '俄语'
    };
    return names[lang] || lang;
  }, [config.primaryLanguage]);

  const getPhraseTexts = useCallback((phrase: { chinese: string; turkmen: string; russian: string }) => {
    try {
      if (config.mode === 'tk') {
        // Turkmen user: learning Chinese
        return {
          primary: phrase.chinese,     // What to say (learning target)
          learning: phrase.turkmen,    // What they understand (native)
          helper: phrase.russian       // Additional help
        };
      } else {
        // Chinese user: learning Turkmen
        return {
          primary: phrase.turkmen,     // What to say (learning target)
          learning: phrase.chinese,    // What they understand (native)
          helper: phrase.russian       // Additional help
        };
      }
    } catch (error) {
      console.warn('[LanguageContext] Error getting phrase texts:', error);
      return {
        primary: phrase.chinese,
        learning: phrase.turkmen,
        helper: phrase.russian
      };
    }
  }, [config.mode]);

  // ===============================================
  // DEV TOOLS (Development only)
  // ===============================================

  const devTools = __DEV__ ? {
    getState: () => ({
      isLoading,
      isFirstLaunch,
      config,
      error,
      version: LANGUAGE_VERSION,
      storageKey: APP_LANGUAGE_KEY,
    }),
    
    forceLanguage: (mode: AppLanguageMode) => {
      console.log('[DEV] Force setting language to:', mode);
      setLanguageMode(mode, true);
    },
    
    validateConfig: () => validateConfig(config),
    
    exportConfig: () => JSON.stringify(config, null, 2),
    
    importConfig: async (configString: string): Promise<boolean> => {
      try {
        const importedConfig = JSON.parse(configString);
        if (validateConfig(importedConfig)) {
          setConfig(importedConfig);
          await saveConfig(importedConfig);
          console.log('[DEV] Config imported successfully');
          return true;
        } else {
          console.error('[DEV] Invalid config format');
          return false;
        }
      } catch (error) {
        console.error('[DEV] Error importing config:', error);
        return false;
      }
    }
  } : undefined;

  // ===============================================
  // CONTEXT VALUE
  // ===============================================

  const value: LanguageContextType = {
    // State
    isLoading,
    isFirstLaunch,
    config,
    error,
    
    // Actions
    setLanguageMode,
    switchMode,
    resetLanguageSettings,
    
    // Getters
    getTexts,
    getLanguageName,
    getPhraseTexts,
    
    // Dev Tools
    __DEV_TOOLS: devTools,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

// ===============================================
// HOOK
// ===============================================

export function useAppLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useAppLanguage must be used within a LanguageProvider');
  }
  return context;
}

// ===============================================
// DEV UTILITIES (Global access in development)
// ===============================================

if (__DEV__) {
  // Make dev tools globally accessible in development
  (global as any).__LANGUAGE_DEV_TOOLS = {
    reset: async () => {
      await AsyncStorage.removeItem(APP_LANGUAGE_KEY);
      console.log('[DEV] Language settings reset. Restart app.');
    },
    
    setToTurkmen: async () => {
      const config = createConfig('tk');
      await AsyncStorage.setItem(APP_LANGUAGE_KEY, JSON.stringify(config));
      console.log('[DEV] Language set to Turkmen. Restart app.');
    },
    
    setToChinese: async () => {
      const config = createConfig('zh');
      await AsyncStorage.setItem(APP_LANGUAGE_KEY, JSON.stringify(config));
      console.log('[DEV] Language set to Chinese. Restart app.');
    },
    
    getStoredConfig: async () => {
      const stored = await AsyncStorage.getItem(APP_LANGUAGE_KEY);
      console.log('[DEV] Stored config:', stored ? JSON.parse(stored) : 'None');
      return stored;
    }
  };
  
  console.log('[DEV] Language dev tools available at: global.__LANGUAGE_DEV_TOOLS');
}