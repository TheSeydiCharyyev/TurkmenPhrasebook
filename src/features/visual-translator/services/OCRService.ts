// src/features/visual-translator/services/OCRService.ts
// Сервис для распознавания текста (Google ML Kit Text Recognition)

// TODO: Установить пакет:
// npm install @react-native-ml-kit/text-recognition
// или
// npx expo install @react-native-ml-kit/text-recognition

import { OCRResult, TextBlock } from '../types/visual-translator.types';

// Для разработки используем mock
const USE_MOCK = true; // Изменить на false после установки ML Kit

class OCRService {
  /**
   * Распознает текст на изображении
   * @param imagePath - путь к изображению (file:// URI)
   * @returns OCRResult с распознанным текстом
   */
  async recognizeText(imagePath: string): Promise<OCRResult> {
    try {
      if (USE_MOCK) {
        // Mock для разработки
        return this.mockRecognizeText(imagePath);
      }

      // Реальная реализация с ML Kit
      // const vision = require('@react-native-ml-kit/text-recognition');
      // const result = await vision.default.recognize(imagePath);

      // return {
      //   text: result.text,
      //   language: result.recognizedLanguages?.[0] || 'unknown',
      //   confidence: this.calculateConfidence(result.blocks),
      //   blocks: result.blocks.map(block => ({
      //     text: block.text,
      //     boundingBox: {
      //       x: block.frame.x,
      //       y: block.frame.y,
      //       width: block.frame.width,
      //       height: block.frame.height,
      //     },
      //     lines: block.lines.map(line => ({
      //       text: line.text,
      //       boundingBox: {
      //         x: line.frame.x,
      //         y: line.frame.y,
      //         width: line.frame.width,
      //         height: line.frame.height,
      //       },
      //       elements: line.elements.map(elem => ({
      //         text: elem.text,
      //         boundingBox: {
      //           x: elem.frame.x,
      //           y: elem.frame.y,
      //           width: elem.frame.width,
      //           height: elem.frame.height,
      //         },
      //       })),
      //     })),
      //   })),
      // };

      throw new Error('ML Kit not implemented yet');
    } catch (error) {
      console.error('[OCRService] Recognition error:', error);
      throw new Error('Failed to recognize text. Please try again.');
    }
  }

  /**
   * Mock версия для разработки без ML Kit
   */
  private async mockRecognizeText(imagePath: string): Promise<OCRResult> {
    // Симуляция задержки API
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Возвращаем mock данные
    const mockTexts = [
      {
        text: 'Hello, how are you?',
        language: 'en',
      },
      {
        text: '你好，你好吗？',
        language: 'zh',
      },
      {
        text: 'Привет, как дела?',
        language: 'ru',
      },
      {
        text: 'Salam, ýagdaýyňyz nähili?',
        language: 'tk',
      },
    ];

    // Случайный выбор
    const mock = mockTexts[Math.floor(Math.random() * mockTexts.length)];

    return {
      text: mock.text,
      language: mock.language,
      confidence: 0.92,
      blocks: [
        {
          text: mock.text,
          boundingBox: { x: 10, y: 10, width: 200, height: 50 },
          lines: [
            {
              text: mock.text,
              boundingBox: { x: 10, y: 10, width: 200, height: 50 },
              elements: [
                {
                  text: mock.text,
                  boundingBox: { x: 10, y: 10, width: 200, height: 50 },
                },
              ],
            },
          ],
        },
      ],
    };
  }

  /**
   * Проверяет, содержит ли изображение текст
   * @param imagePath - путь к изображению
   * @returns true если текст найден
   */
  async hasText(imagePath: string): Promise<boolean> {
    try {
      const result = await this.recognizeText(imagePath);
      return result.text.trim().length > 0;
    } catch (error) {
      console.error('[OCRService] hasText error:', error);
      return false;
    }
  }

  /**
   * Рассчитывает среднюю уверенность распознавания
   */
  private calculateConfidence(blocks: any[]): number {
    if (!blocks || blocks.length === 0) return 0;

    // Google ML Kit не всегда предоставляет confidence
    // Используем эвристику на основе количества распознанных блоков
    // Больше блоков = выше уверенность (до максимума 0.95)
    const confidence = Math.min(0.5 + blocks.length * 0.1, 0.95);

    return confidence;
  }

  /**
   * Определяет язык распознанного текста (эвристика)
   */
  detectLanguage(text: string): string {
    // Простая эвристика на основе символов
    if (/[\u4e00-\u9fa5]/.test(text)) return 'zh'; // Китайский
    if (/[\u0400-\u04FF]/.test(text)) return 'ru'; // Русский
    if (/[\u0600-\u06FF]/.test(text)) return 'ar'; // Арабский
    if (/[\u3040-\u309F\u30A0-\u30FF]/.test(text)) return 'ja'; // Японский
    if (/[\uAC00-\uD7AF]/.test(text)) return 'ko'; // Корейский
    if (/[\u0E00-\u0E7F]/.test(text)) return 'th'; // Тайский

    // По умолчанию английский или латиница
    return 'en';
  }

  /**
   * Получить поддерживаемые языки для OCR
   */
  getSupportedLanguages(): string[] {
    return [
      'en', // English
      'zh', // Chinese (Simplified & Traditional)
      'ru', // Russian
      'ja', // Japanese
      'ko', // Korean
      'ar', // Arabic
      'th', // Thai
      'vi', // Vietnamese
      'fr', // French
      'de', // German
      'es', // Spanish
      'it', // Italian
      'pt', // Portuguese
      'tr', // Turkish
      'hi', // Hindi
      'tk', // Turkmen (латиница)
    ];
  }

  /**
   * Проверить доступность сервиса
   */
  async checkAvailability(): Promise<boolean> {
    try {
      if (USE_MOCK) {
        return true;
      }

      // Проверка что ML Kit установлен
      // const vision = require('@react-native-ml-kit/text-recognition');
      // return vision !== null;

      return false;
    } catch (error) {
      return false;
    }
  }

  /**
   * Получить информацию о версии и режиме
   */
  getServiceInfo(): { version: string; mode: 'mock' | 'production' } {
    return {
      version: '1.0.0',
      mode: USE_MOCK ? 'mock' : 'production',
    };
  }
}

// Экспортируем singleton
export default new OCRService();
