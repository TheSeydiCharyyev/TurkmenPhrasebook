// src/multilingual/index.ts
// Централизованный экспорт всех модулей мультиязычной системы
// Для удобного импорта: import { useConfig, usePhrases } from '@/multilingual'

// ====================================
// CONTEXTS
// ====================================
export { ConfigProvider, useConfig } from '../contexts/ConfigContext';

// ====================================
// HOOKS
// ====================================
export { usePhrases } from '../hooks/usePhrases';
export { useAudioMultilingual } from '../hooks/useAudioMultilingual';

// ====================================
// CONFIG
// ====================================
export {
  LANGUAGES,
  getLanguageByCode,
  getAvailableLanguages,
  getComingSoonLanguages,
  getLanguageProgress,
} from '../config/languages.config';

// ====================================
// DATA
// ====================================
export { basePhrases } from '../data/languages/base';
export {
  getTranslationsForLanguage,
  hasTranslationsForLanguage,
} from '../data/languages';

// ====================================
// TYPES
// ====================================
export type {
  BasePhrase,
  LanguageTranslation,
  LanguageConfig,
  PhraseWithTranslation,
} from '../types';
