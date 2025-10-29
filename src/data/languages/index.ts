// AUTO-GENERATED: Агрегация переводов
// Updated: 2025-10-29 - Phase 1 Complete: Added 8 languages (tr, uz, de, fr, es, it, ja, ko)
import { chineseTranslations } from './translations/chinese';
import { russianTranslations } from './translations/russian';
import { englishTranslations } from './translations/english';
import { turkishTranslations } from './translations/turkish';
import { uzbekTranslations } from './translations/uzbek';
import { germanTranslations } from './translations/german';
import { frenchTranslations } from './translations/french';
import { spanishTranslations } from './translations/spanish';
import { italianTranslations } from './translations/italian';
import { japaneseTranslations } from './translations/japanese';
import { koreanTranslations } from './translations/korean';
import { LanguageTranslation } from '../../types';

const translationsMap: Record<string, LanguageTranslation[]> = {
  zh: chineseTranslations,
  ru: russianTranslations,
  en: englishTranslations,
  tr: turkishTranslations,
  uz: uzbekTranslations,
  de: germanTranslations,
  fr: frenchTranslations,
  es: spanishTranslations,
  it: italianTranslations,
  ja: japaneseTranslations,
  ko: koreanTranslations,
};

/**
 * Получить переводы для указанного языка
 * @param languageCode - Код языка (zh, ru, en...)
 * @returns Массив переводов или пустой массив
 */
export const getTranslationsForLanguage = (
  languageCode: string
): LanguageTranslation[] => {
  return translationsMap[languageCode] || [];
};

/**
 * Проверить наличие переводов для языка
 * @param languageCode - Код языка
 * @returns true если переводы есть
 */
export const hasTranslationsForLanguage = (
  languageCode: string
): boolean => {
  const translations = translationsMap[languageCode];
  return translations && translations.length > 0;
};
