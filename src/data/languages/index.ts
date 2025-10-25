// AUTO-GENERATED: Агрегация переводов
// Generated: 2025-10-25T02:36:38.470Z
import { chineseTranslations } from './translations/chinese';
import { russianTranslations } from './translations/russian';
import { englishTranslations } from './translations/english';
import { LanguageTranslation } from '../../types';

const translationsMap: Record<string, LanguageTranslation[]> = {
  zh: chineseTranslations,
  ru: russianTranslations,
  en: englishTranslations,
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
