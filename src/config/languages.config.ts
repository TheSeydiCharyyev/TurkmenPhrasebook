// src/config/languages.config.ts
// Конфигурация всех 30 поддерживаемых языков
import { LanguageConfig } from '../types';

/**
 * Конфигурация всех 30 поддерживаемых языков
 * isAvailable: true - язык активен и доступен для выбора
 * isAvailable: false - "Coming soon"
 */
export const LANGUAGES: LanguageConfig[] = [
  // ====================================
  // АКТИВНЫЕ ЯЗЫКИ (isAvailable: true)
  // ====================================
  {
    code: 'zh',
    name: '中文',
    nameEn: 'Chinese',
    nameTk: 'Hytaý dili',
    flag: '🇨🇳',
    isAvailable: true,
    hasTranscription: true,
    ttsCode: 'zh-CN',
    direction: 'ltr'
  },
  {
    code: 'ru',
    name: 'Русский',
    nameEn: 'Russian',
    nameTk: 'Rus dili',
    flag: '🇷🇺',
    isAvailable: true,
    hasTranscription: true,
    ttsCode: 'ru-RU',
    direction: 'ltr'
  },
  {
    code: 'en',
    name: 'English',
    nameEn: 'English',
    nameTk: 'Iňlis dili',
    flag: '🇬🇧',
    isAvailable: true,
    hasTranscription: false,
    ttsCode: 'en-US',
    direction: 'ltr'
  },

  // ====================================
  // COMING SOON (isAvailable: false)
  // ====================================
  {
    code: 'ja',
    name: '日本語',
    nameEn: 'Japanese',
    nameTk: 'Ýapon dili',
    flag: '🇯🇵',
    isAvailable: false,
    hasTranscription: true,
    ttsCode: 'ja-JP',
    direction: 'ltr'
  },
  {
    code: 'ko',
    name: '한국어',
    nameEn: 'Korean',
    nameTk: 'Koreý dili',
    flag: '🇰🇷',
    isAvailable: false,
    hasTranscription: true,
    ttsCode: 'ko-KR',
    direction: 'ltr'
  },
  {
    code: 'th',
    name: 'ไทย',
    nameEn: 'Thai',
    nameTk: 'Taý dili',
    flag: '🇹🇭',
    isAvailable: false,
    hasTranscription: true,
    ttsCode: 'th-TH',
    direction: 'ltr'
  },
  {
    code: 'vi',
    name: 'Tiếng Việt',
    nameEn: 'Vietnamese',
    nameTk: 'Wýetnam dili',
    flag: '🇻🇳',
    isAvailable: false,
    hasTranscription: false,
    ttsCode: 'vi-VN',
    direction: 'ltr'
  },
  {
    code: 'id',
    name: 'Bahasa Indonesia',
    nameEn: 'Indonesian',
    nameTk: 'Indoneziýa dili',
    flag: '🇮🇩',
    isAvailable: false,
    hasTranscription: false,
    ttsCode: 'id-ID',
    direction: 'ltr'
  },
  {
    code: 'ms',
    name: 'Bahasa Melayu',
    nameEn: 'Malay',
    nameTk: 'Malaý dili',
    flag: '🇲🇾',
    isAvailable: false,
    hasTranscription: false,
    ttsCode: 'ms-MY',
    direction: 'ltr'
  },
  {
    code: 'hi',
    name: 'हिन्दी',
    nameEn: 'Hindi',
    nameTk: 'Hindi dili',
    flag: '🇮🇳',
    isAvailable: false,
    hasTranscription: true,
    ttsCode: 'hi-IN',
    direction: 'ltr'
  },
  {
    code: 'ur',
    name: 'اردو',
    nameEn: 'Urdu',
    nameTk: 'Urdu dili',
    flag: '🇵🇰',
    isAvailable: false,
    hasTranscription: true,
    ttsCode: 'ur-PK',
    direction: 'rtl'
  },
  {
    code: 'fa',
    name: 'فارسی',
    nameEn: 'Persian',
    nameTk: 'Pars dili',
    flag: '🇮🇷',
    isAvailable: false,
    hasTranscription: true,
    ttsCode: 'fa-IR',
    direction: 'rtl'
  },
  {
    code: 'ps',
    name: 'پښتو',
    nameEn: 'Pashto',
    nameTk: 'Peştu dili',
    flag: '🇦🇫',
    isAvailable: false,
    hasTranscription: true,
    ttsCode: 'ps-AF',
    direction: 'rtl'
  },
  {
    code: 'de',
    name: 'Deutsch',
    nameEn: 'German',
    nameTk: 'Nemes dili',
    flag: '🇩🇪',
    isAvailable: false,
    hasTranscription: false,
    ttsCode: 'de-DE',
    direction: 'ltr'
  },
  {
    code: 'fr',
    name: 'Français',
    nameEn: 'French',
    nameTk: 'Fransuz dili',
    flag: '🇫🇷',
    isAvailable: false,
    hasTranscription: false,
    ttsCode: 'fr-FR',
    direction: 'ltr'
  },
  {
    code: 'es',
    name: 'Español',
    nameEn: 'Spanish',
    nameTk: 'Ispan dili',
    flag: '🇪🇸',
    isAvailable: false,
    hasTranscription: false,
    ttsCode: 'es-ES',
    direction: 'ltr'
  },
  {
    code: 'it',
    name: 'Italiano',
    nameEn: 'Italian',
    nameTk: 'Italýan dili',
    flag: '🇮🇹',
    isAvailable: false,
    hasTranscription: false,
    ttsCode: 'it-IT',
    direction: 'ltr'
  },
  {
    code: 'tr',
    name: 'Türkçe',
    nameEn: 'Turkish',
    nameTk: 'Türk dili',
    flag: '🇹🇷',
    isAvailable: false,
    hasTranscription: false,
    ttsCode: 'tr-TR',
    direction: 'ltr'
  },
  {
    code: 'pl',
    name: 'Polski',
    nameEn: 'Polish',
    nameTk: 'Polýak dili',
    flag: '🇵🇱',
    isAvailable: false,
    hasTranscription: false,
    ttsCode: 'pl-PL',
    direction: 'ltr'
  },
  {
    code: 'uk',
    name: 'Українська',
    nameEn: 'Ukrainian',
    nameTk: 'Ukrain dili',
    flag: '🇺🇦',
    isAvailable: false,
    hasTranscription: true,
    ttsCode: 'uk-UA',
    direction: 'ltr'
  },
  {
    code: 'hy',
    name: 'Հայերեն',
    nameEn: 'Armenian',
    nameTk: 'Ermeni dili',
    flag: '🇦🇲',
    isAvailable: false,
    hasTranscription: true,
    ttsCode: 'hy-AM',
    direction: 'ltr'
  },
  {
    code: 'ka',
    name: 'ქართული',
    nameEn: 'Georgian',
    nameTk: 'Gruzin dili',
    flag: '🇬🇪',
    isAvailable: false,
    hasTranscription: true,
    ttsCode: 'ka-GE',
    direction: 'ltr'
  },
  {
    code: 'ar',
    name: 'العربية',
    nameEn: 'Arabic',
    nameTk: 'Arap dili',
    flag: '🇸🇦',
    isAvailable: false,
    hasTranscription: true,
    ttsCode: 'ar-SA',
    direction: 'rtl'
  },
  {
    code: 'uz',
    name: 'O\'zbek',
    nameEn: 'Uzbek',
    nameTk: 'Özbek dili',
    flag: '🇺🇿',
    isAvailable: false,
    hasTranscription: false,
    ttsCode: 'uz-UZ',
    direction: 'ltr'
  },
  {
    code: 'kk',
    name: 'Қазақ',
    nameEn: 'Kazakh',
    nameTk: 'Gazak dili',
    flag: '🇰🇿',
    isAvailable: false,
    hasTranscription: true,
    ttsCode: 'kk-KZ',
    direction: 'ltr'
  },
  {
    code: 'az',
    name: 'Azərbaycan',
    nameEn: 'Azerbaijani',
    nameTk: 'Azerbaýjan dili',
    flag: '🇦🇿',
    isAvailable: false,
    hasTranscription: false,
    ttsCode: 'az-AZ',
    direction: 'ltr'
  },
  {
    code: 'ky',
    name: 'Кыргыз',
    nameEn: 'Kyrgyz',
    nameTk: 'Gyrg dili',
    flag: '🇰🇬',
    isAvailable: false,
    hasTranscription: true,
    ttsCode: 'ky-KG',
    direction: 'ltr'
  },
  {
    code: 'tg',
    name: 'Тоҷикӣ',
    nameEn: 'Tajik',
    nameTk: 'Täjik dili',
    flag: '🇹🇯',
    isAvailable: false,
    hasTranscription: true,
    ttsCode: 'tg-TJ',
    direction: 'ltr'
  },
  {
    code: 'pt',
    name: 'Português',
    nameEn: 'Portuguese',
    nameTk: 'Portugal dili',
    flag: '🇵🇹',
    isAvailable: false,
    hasTranscription: false,
    ttsCode: 'pt-PT',
    direction: 'ltr'
  },
  {
    code: 'nl',
    name: 'Nederlands',
    nameEn: 'Dutch',
    nameTk: 'Golland dili',
    flag: '🇳🇱',
    isAvailable: false,
    hasTranscription: false,
    ttsCode: 'nl-NL',
    direction: 'ltr'
  },
];

// ====================================
// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// ====================================

/**
 * Получить конфигурацию языка по коду
 */
export const getLanguageByCode = (code: string): LanguageConfig | undefined => {
  return LANGUAGES.find(lang => lang.code === code);
};

/**
 * Получить список доступных языков
 */
export const getAvailableLanguages = (): LanguageConfig[] => {
  return LANGUAGES.filter(lang => lang.isAvailable);
};

/**
 * Получить список языков "coming soon"
 */
export const getComingSoonLanguages = (): LanguageConfig[] => {
  return LANGUAGES.filter(lang => !lang.isAvailable);
};

/**
 * Получить прогресс добавления языков
 */
export const getLanguageProgress = (): {
  available: number;
  total: number;
  percentage: number
} => {
  const available = LANGUAGES.filter(lang => lang.isAvailable).length;
  const total = LANGUAGES.length;
  return {
    available,
    total,
    percentage: Math.round((available / total) * 100)
  };
};
