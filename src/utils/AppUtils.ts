// src/utils/AppUtils.ts - Common Utility Functions

import { Platform } from 'react-native';
import { APP_CONFIG, VALIDATION } from '../constants/AppConstants';

/**
 * ✅ TIME UTILITIES
 */
export const TimeUtils = {
  /**
   * Format timestamp to human-readable date
   */
  formatDate: (timestamp: number, locale: string = 'ru'): string => {
    const date = new Date(timestamp);
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return date.toLocaleDateString(locale, options);
  },

  /**
   * Format time duration in seconds to readable format
   */
  formatDuration: (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}ч ${minutes}м`;
    } else if (minutes > 0) {
      return `${minutes}м ${secs}с`;
    } else {
      return `${secs}с`;
    }
  },

  /**
   * Get relative time (e.g., "2 days ago")
   */
  getRelativeTime: (timestamp: number, locale: string = 'ru'): string => {
    const now = Date.now();
    const diff = now - timestamp;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} дн. назад`;
    if (hours > 0) return `${hours} ч. назад`;
    if (minutes > 0) return `${minutes} мин. назад`;
    return 'только что';
  },

  /**
   * Check if date is today
   */
  isToday: (timestamp: number): boolean => {
    const today = new Date();
    const date = new Date(timestamp);
    return today.toDateString() === date.toDateString();
  },

  /**
   * Get start of day timestamp
   */
  getStartOfDay: (timestamp: number = Date.now()): number => {
    const date = new Date(timestamp);
    date.setHours(0, 0, 0, 0);
    return date.getTime();
  },

  /**
   * Get start of week timestamp
   */
  getStartOfWeek: (timestamp: number = Date.now()): number => {
    const date = new Date(timestamp);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Start week on Monday
    const startOfWeek = new Date(date.setDate(diff));
    startOfWeek.setHours(0, 0, 0, 0);
    return startOfWeek.getTime();
  },
};

/**
 * ✅ STRING UTILITIES
 */
export const StringUtils = {
  /**
   * Capitalize first letter
   */
  capitalize: (str: string): string => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  },

  /**
   * Truncate string with ellipsis
   */
  truncate: (str: string, maxLength: number): string => {
    if (!str || str.length <= maxLength) return str;
    return str.substring(0, maxLength - 3) + '...';
  },

  /**
   * Remove extra whitespace and normalize
   */
  normalize: (str: string): string => {
    return str.trim().replace(/\s+/g, ' ');
  },

  /**
   * Check if string contains Chinese characters
   */
  containsChinese: (str: string): boolean => {
    const chineseRegex = /[\u4e00-\u9fff]/;
    return chineseRegex.test(str);
  },

  /**
   * Extract Pinyin from Chinese text
   */
  extractPinyin: (text: string): string => {
    // Simple regex for basic pinyin extraction
    const pinyinRegex = /[a-zA-Zāáǎàēéěèīíǐìōóǒòūúǔùüǖǘǚǜ]+/g;
    const matches = text.match(pinyinRegex);
    return matches ? matches.join(' ') : '';
  },

  /**
   * Highlight search terms in text
   */
  highlightSearchTerms: (text: string, searchTerm: string): string => {
    if (!searchTerm) return text;
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  },
};

/**
 * ✅ VALIDATION UTILITIES
 */
export const ValidationUtils = {
  /**
   * Validate search query
   */
  validateSearchQuery: (query: string): { isValid: boolean; error?: string } => {
    if (!query || query.trim().length === 0) {
      return { isValid: false, error: 'Поисковый запрос не может быть пустым' };
    }
    
    const normalizedQuery = StringUtils.normalize(query);
    
    if (normalizedQuery.length < VALIDATION.MIN_SEARCH_LENGTH) {
      return { isValid: false, error: `Минимальная длина запроса: ${VALIDATION.MIN_SEARCH_LENGTH} символа` };
    }
    
    if (normalizedQuery.length > VALIDATION.MAX_SEARCH_LENGTH) {
      return { isValid: false, error: `Максимальная длина запроса: ${VALIDATION.MAX_SEARCH_LENGTH} символов` };
    }
    
    return { isValid: true };
  },

  /**
   * Validate phrase content
   */
  validatePhrase: (phrase: string): { isValid: boolean; error?: string } => {
    if (!phrase || phrase.trim().length === 0) {
      return { isValid: false, error: 'Фраза не может быть пустой' };
    }
    
    const normalizedPhrase = StringUtils.normalize(phrase);
    
    if (normalizedPhrase.length < VALIDATION.MIN_PHRASE_LENGTH) {
      return { isValid: false, error: 'Фраза слишком короткая' };
    }
    
    if (normalizedPhrase.length > VALIDATION.MAX_PHRASE_LENGTH) {
      return { isValid: false, error: 'Фраза слишком длинная' };
    }
    
    return { isValid: true };
  },

  /**
   * Validate email format
   */
  validateEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },
};

/**
 * ✅ ARRAY UTILITIES
 */
export const ArrayUtils = {
  /**
   * Shuffle array randomly
   */
  shuffle: <T>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  },

  /**
   * Remove duplicates from array
   */
  unique: <T>(array: T[], keySelector?: (item: T) => any): T[] => {
    if (!keySelector) {
      return [...new Set(array)];
    }
    
    const seen = new Set();
    return array.filter(item => {
      const key = keySelector(item);
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  },

  /**
   * Group array by key
   */
  groupBy: <T, K extends string | number>(
    array: T[],
    keySelector: (item: T) => K
  ): Record<K, T[]> => {
    return array.reduce((groups, item) => {
      const key = keySelector(item);
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(item);
      return groups;
    }, {} as Record<K, T[]>);
  },

  /**
   * Sort array by multiple criteria
   */
  sortByMultiple: <T>(
    array: T[],
    sorters: Array<{
      key: keyof T;
      direction: 'asc' | 'desc';
    }>
  ): T[] => {
    return [...array].sort((a, b) => {
      for (const sorter of sorters) {
        const aValue = a[sorter.key];
        const bValue = b[sorter.key];
        
        if (aValue < bValue) {
          return sorter.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sorter.direction === 'asc' ? 1 : -1;
        }
      }
      return 0;
    });
  },
};

/**
 * ✅ PLATFORM UTILITIES
 */
export const PlatformUtils = {
  /**
   * Check if running on iOS
   */
  isIOS: (): boolean => Platform.OS === 'ios',

  /**
   * Check if running on Android
   */
  isAndroid: (): boolean => Platform.OS === 'android',

  /**
   * Check if running on web
   */
  isWeb: (): boolean => Platform.OS === 'web',

  /**
   * Get platform-specific value
   */
  select: <T>(options: { ios?: T; android?: T; web?: T; default: T }): T => {
    return Platform.select({
      ios: options.ios,
      android: options.android,
      web: options.web,
      default: options.default,
    }) as T;
  },

  /**
   * Get safe area padding for different platforms
   */
  getSafeAreaPadding: () => ({
    top: PlatformUtils.isIOS() ? 44 : 24,
    bottom: PlatformUtils.isIOS() ? 34 : 0,
  }),
};

/**
 * ✅ DEBOUNCE UTILITY
 */
export const DebounceUtils = {
  /**
   * Create a debounced function
   */
  debounce: <T extends (...args: any[]) => any>(
    func: T,
    delay: number
  ): ((...args: Parameters<T>) => void) => {
    let timeoutId: NodeJS.Timeout;
    
    return (...args: Parameters<T>) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  },

  /**
   * Create a throttled function
   */
  throttle: <T extends (...args: any[]) => any>(
    func: T,
    delay: number
  ): ((...args: Parameters<T>) => void) => {
    let lastCall = 0;
    
    return (...args: Parameters<T>) => {
      const now = Date.now();
      if (now - lastCall >= delay) {
        lastCall = now;
        func(...args);
      }
    };
  },
};

/**
 * ✅ HAPTIC FEEDBACK UTILITY
 */
export const HapticUtils = {
  /**
   * Light haptic feedback
   */
  light: () => {
    // Implementation would depend on your haptic library
    console.log('Light haptic feedback');
  },

  /**
   * Medium haptic feedback
   */
  medium: () => {
    console.log('Medium haptic feedback');
  },

  /**
   * Heavy haptic feedback
   */
  heavy: () => {
    console.log('Heavy haptic feedback');
  },

  /**
   * Success haptic feedback
   */
  success: () => {
    console.log('Success haptic feedback');
  },

  /**
   * Error haptic feedback
   */
  error: () => {
    console.log('Error haptic feedback');
  },
};

/**
 * ✅ EXPORT ALL UTILITIES
 */
export const AppUtils = {
  Time: TimeUtils,
  String: StringUtils,
  Validation: ValidationUtils,
  Array: ArrayUtils,
  Platform: PlatformUtils,
  Debounce: DebounceUtils,
  Haptic: HapticUtils,
};

export default AppUtils;