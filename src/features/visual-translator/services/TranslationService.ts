// src/features/visual-translator/services/TranslationService.ts
// Сервис для перевода текста (MyMemory API + LibreTranslate fallback)

import {
  TranslationAPIParams,
  MyMemoryResponse,
  LibreTranslateResponse,
} from '../types/visual-translator.types';

const MYMEMORY_API = 'https://api.mymemory.translated.net/get';
const LIBRETRANSLATE_API = 'https://libretranslate.com/translate';

// Лимит MyMemory: 10,000 слов/день (бесплатно)
// Лимит LibreTranslate: неограниченный (бесплатно, но может быть медленным)

class TranslationService {
  private requestCount = 0;
  private lastResetDate = new Date().toDateString();

  /**
   * Переводит текст используя MyMemory API
   */
  async translateWithMyMemory(
    text: string,
    fromLang: string,
    toLang: string
  ): Promise<string> {
    try {
      // Проверяем длину текста (MyMemory имеет лимит)
      if (text.length > 500) {
        console.warn('[TranslationService] Text too long for MyMemory, truncating');
        text = text.substring(0, 500);
      }

      const url = `${MYMEMORY_API}?q=${encodeURIComponent(text)}&langpair=${fromLang}|${toLang}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`MyMemory API error: ${response.status}`);
      }

      const data: MyMemoryResponse = await response.json();

      if (data.responseStatus !== 200) {
        throw new Error(data.responseDetails || 'Translation failed');
      }

      this.incrementRequestCount();

      return data.responseData.translatedText;
    } catch (error) {
      console.error('[TranslationService] MyMemory error:', error);
      throw error;
    }
  }

  /**
   * Переводит текст используя LibreTranslate (запасной вариант)
   */
  async translateWithLibreTranslate(
    text: string,
    fromLang: string,
    toLang: string
  ): Promise<string> {
    try {
      const response = await fetch(LIBRETRANSLATE_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: text,
          source: fromLang,
          target: toLang,
          format: 'text',
        }),
      });

      if (!response.ok) {
        throw new Error(`LibreTranslate API error: ${response.status}`);
      }

      const data: LibreTranslateResponse = await response.json();

      return data.translatedText;
    } catch (error) {
      console.error('[TranslationService] LibreTranslate error:', error);
      throw error;
    }
  }

  /**
   * Умный перевод с автоматическим fallback
   * Сначала пробует MyMemory, при ошибке - LibreTranslate
   */
  async translate(
    text: string,
    fromLang: string,
    toLang: string
  ): Promise<string> {
    // Проверка входных данных
    if (!text || text.trim().length === 0) {
      throw new Error('Empty text provided');
    }

    // Нормализация языковых кодов
    const normalizedFrom = this.normalizeLanguageCode(fromLang);
    const normalizedTo = this.normalizeLanguageCode(toLang);

    try {
      // Пробуем MyMemory (лучшее качество)
      return await this.translateWithMyMemory(text, normalizedFrom, normalizedTo);
    } catch (myMemoryError) {
      console.warn('[TranslationService] MyMemory failed, falling back to LibreTranslate');

      try {
        // Fallback на LibreTranslate
        return await this.translateWithLibreTranslate(text, normalizedFrom, normalizedTo);
      } catch (libreError) {
        console.error('[TranslationService] All translation services failed');
        throw new Error(
          'Translation failed. Please check your internet connection and try again.'
        );
      }
    }
  }

  /**
   * Определяет язык текста (используя MyMemory)
   */
  async detectLanguage(text: string): Promise<string> {
    try {
      // MyMemory может автоматически определять язык
      const url = `${MYMEMORY_API}?q=${encodeURIComponent(text.substring(0, 100))}&langpair=auto|en`;

      const response = await fetch(url);
      const data: MyMemoryResponse = await response.json();

      // MyMemory возвращает detected language в matches
      if (data.matches && data.matches.length > 0) {
        const detectedLang = data.matches[0].source;
        return detectedLang || 'unknown';
      }

      return 'unknown';
    } catch (error) {
      console.error('[TranslationService] Language detection error:', error);
      return 'unknown';
    }
  }

  /**
   * Нормализация языковых кодов для разных API
   * MyMemory использует 2-буквенные коды: en, zh, ru, tk
   */
  private normalizeLanguageCode(code: string): string {
    // Преобразуем в lowercase
    const lowerCode = code.toLowerCase();

    // Маппинг кодов
    const codeMap: Record<string, string> = {
      'en-us': 'en',
      'en-gb': 'en',
      'zh-cn': 'zh',
      'zh-tw': 'zh',
      'ru-ru': 'ru',
      'tk-tm': 'tk',
      'auto': 'auto',
      'unknown': 'en', // Fallback на английский
    };

    // Если код уже короткий (2 символа), возвращаем как есть
    if (lowerCode.length === 2) {
      return lowerCode;
    }

    // Иначе проверяем маппинг
    return codeMap[lowerCode] || lowerCode.substring(0, 2);
  }

  /**
   * Получить поддерживаемые языки
   */
  getSupportedLanguages(): string[] {
    return [
      'en', // English
      'zh', // Chinese
      'ru', // Russian
      'tk', // Turkmen
      'ja', // Japanese
      'ko', // Korean
      'ar', // Arabic
      'fr', // French
      'de', // German
      'es', // Spanish
      'it', // Italian
      'pt', // Portuguese
      'tr', // Turkish
      'fa', // Persian
      'hi', // Hindi
      'th', // Thai
      'vi', // Vietnamese
    ];
  }

  /**
   * Проверить доступность API
   */
  async checkAvailability(): Promise<{
    myMemory: boolean;
    libreTranslate: boolean;
  }> {
    const results = {
      myMemory: false,
      libreTranslate: false,
    };

    // Проверка MyMemory
    try {
      const response = await fetch(MYMEMORY_API + '?q=test&langpair=en|ru', {
        method: 'GET',
      });
      results.myMemory = response.ok;
    } catch (error) {
      console.error('[TranslationService] MyMemory unavailable:', error);
    }

    // Проверка LibreTranslate
    try {
      const response = await fetch(LIBRETRANSLATE_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ q: 'test', source: 'en', target: 'ru' }),
      });
      results.libreTranslate = response.ok;
    } catch (error) {
      console.error('[TranslationService] LibreTranslate unavailable:', error);
    }

    return results;
  }

  /**
   * Счетчик запросов (для отслеживания лимитов)
   */
  private incrementRequestCount() {
    const today = new Date().toDateString();

    if (this.lastResetDate !== today) {
      // Новый день - сбросить счетчик
      this.requestCount = 0;
      this.lastResetDate = today;
    }

    this.requestCount++;

    // Предупреждение если приближаемся к лимиту MyMemory (10,000 слов/день)
    if (this.requestCount > 9000) {
      console.warn(
        `[TranslationService] Approaching MyMemory daily limit: ${this.requestCount} requests today`
      );
    }
  }

  /**
   * Получить статистику использования
   */
  getUsageStats(): { requestsToday: number; lastReset: string } {
    return {
      requestsToday: this.requestCount,
      lastReset: this.lastResetDate,
    };
  }
}


// Создаем singleton instance
const translationServiceInstance = new TranslationService();

// Экспортируем singleton как default
export default translationServiceInstance;

// Экспорт удобной функции-обертки для совместимости
export async function translateText(
  text: string,
  fromLang: string,
  toLang: string
): Promise<string> {
  return translationServiceInstance.translate(text, fromLang, toLang);
}