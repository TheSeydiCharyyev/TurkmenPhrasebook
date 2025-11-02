// src/features/visual-translator/services/OCRService.ts
// Роутер для OCR движков: ML Kit, OCR.space, Google Cloud Vision

import TextRecognition from '@react-native-ml-kit/text-recognition';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { OCR_SPACE_API_KEY, GOOGLE_VISION_API_KEY } from '@env';
import {
  OCRResult,
  OCREngine,
  OCREngineInfo,
} from '../types/visual-translator.types';
import OCRSpaceService from './OCRSpaceService';
import GoogleVisionService from './GoogleVisionService';

const STORAGE_KEY_SELECTED_ENGINE = '@visual_translator_ocr_engine';

class OCRService {
  private selectedEngine: OCREngine = OCREngine.ML_KIT;

  constructor() {
    // Загружаем сохранённый выбор движка
    this.loadSelectedEngine();
  }

  /**
   * Распознаёт текст на изображении используя выбранный движок
   */
  async recognizeText(imagePath: string): Promise<OCRResult> {
    console.log(`[OCRService] Using engine: ${this.selectedEngine}`);

    try {
      switch (this.selectedEngine) {
        case OCREngine.ML_KIT:
          return await this.recognizeWithMLKit(imagePath);

        case OCREngine.OCR_SPACE:
          return await OCRSpaceService.recognizeText(imagePath, OCR_SPACE_API_KEY);

        case OCREngine.GOOGLE_VISION:
          return await GoogleVisionService.recognizeText(imagePath, GOOGLE_VISION_API_KEY);

        default:
          throw new Error(`Unknown OCR engine: ${this.selectedEngine}`);
      }
    } catch (error) {
      console.error(`[OCRService] ${this.selectedEngine} failed:`, error);

      // Автоматический fallback
      return await this.fallbackRecognition(imagePath, error);
    }
  }

  /**
   * Fallback: пробуем другие движки если выбранный не сработал
   */
  private async fallbackRecognition(imagePath: string, originalError: any): Promise<OCRResult> {
    console.log('[OCRService] Attempting fallback recognition...');

    // Порядок fallback: ML Kit → OCR.space → Google Vision
    const fallbackEngines = this.getFallbackOrder();

    for (const engine of fallbackEngines) {
      if (engine === this.selectedEngine) continue; // Пропускаем уже упавший движок

      try {
        console.log(`[OCRService] Trying fallback: ${engine}`);

        switch (engine) {
          case OCREngine.ML_KIT:
            return await this.recognizeWithMLKit(imagePath);

          case OCREngine.OCR_SPACE:
            return await OCRSpaceService.recognizeText(imagePath, OCR_SPACE_API_KEY);

          case OCREngine.GOOGLE_VISION:
            return await GoogleVisionService.recognizeText(imagePath, GOOGLE_VISION_API_KEY);
        }
      } catch (fallbackError) {
        console.warn(`[OCRService] Fallback ${engine} also failed:`, fallbackError);
        continue;
      }
    }

    // Все движки упали
    throw new Error(
      `All OCR engines failed. Original error: ${
        originalError instanceof Error ? originalError.message : 'Unknown error'
      }`
    );
  }

  /**
   * Порядок fallback движков
   */
  private getFallbackOrder(): OCREngine[] {
    // Приоритет: офлайн → бесплатный онлайн → премиум
    return [OCREngine.ML_KIT, OCREngine.OCR_SPACE, OCREngine.GOOGLE_VISION];
  }

  /**
   * Распознавание с Google ML Kit (офлайн)
   */
  private async recognizeWithMLKit(imagePath: string): Promise<OCRResult> {
    try {
      console.log('[OCRService/MLKit] Recognizing text...');
      const result = await TextRecognition.recognize(imagePath);

      const fullText = result.blocks.map(block => block.text).join('\n');

      if (!fullText.trim()) {
        throw new Error('No text found in image');
      }

      const detectedLanguage = this.detectLanguage(fullText);
      const confidence = this.calculateConfidence(result.blocks);

      console.log('[OCRService/MLKit] ✅ Text recognized:', fullText.substring(0, 100));

      return {
        text: fullText,
        language: detectedLanguage,
        confidence,
        engine: OCREngine.ML_KIT,
        blocks: result.blocks.map((block: any) => ({
          text: block.text,
          boundingBox: {
            x: block.frame?.x ?? 0,
            y: block.frame?.y ?? 0,
            width: block.frame?.width ?? 0,
            height: block.frame?.height ?? 0,
          },
          lines: block.lines.map((line: any) => ({
            text: line.text,
            boundingBox: {
              x: line.frame?.x ?? 0,
              y: line.frame?.y ?? 0,
              width: line.frame?.width ?? 0,
              height: line.frame?.height ?? 0,
            },
            elements: line.elements.map((elem: any) => ({
              text: elem.text,
              boundingBox: {
                x: elem.frame?.x ?? 0,
                y: elem.frame?.y ?? 0,
                width: elem.frame?.width ?? 0,
                height: elem.frame?.height ?? 0,
              },
            })),
          })),
        })),
      };
    } catch (error) {
      console.error('[OCRService/MLKit] Error:', error);
      throw new Error(
        'ML Kit unavailable. Try OCR.space or Google Vision in settings.'
      );
    }
  }

  /**
   * Определяет язык текста
   */
  private detectLanguage(text: string): string {
    if (/[\u4e00-\u9fa5]/.test(text)) return 'zh';
    if (/[\u0400-\u04FF]/.test(text)) return 'ru';
    if (/[\u0600-\u06FF]/.test(text)) return 'ar';
    if (/[\u3040-\u309F\u30A0-\u30FF]/.test(text)) return 'ja';
    if (/[\uAC00-\uD7AF]/.test(text)) return 'ko';
    if (/[\u0E00-\u0E7F]/.test(text)) return 'th';
    return 'en';
  }

  /**
   * Вычисляет confidence
   */
  private calculateConfidence(blocks: any[]): number {
    if (!blocks || blocks.length === 0) return 0;
    return Math.min(0.5 + blocks.length * 0.1, 0.95);
  }

  /**
   * Проверяет наличие текста на изображении
   */
  async hasText(imagePath: string): Promise<boolean> {
    try {
      const result = await this.recognizeText(imagePath);
      return result.text.trim().length > 0;
    } catch {
      return false;
    }
  }

  /**
   * Установить выбранный движок
   */
  async setSelectedEngine(engine: OCREngine): Promise<void> {
    this.selectedEngine = engine;
    await AsyncStorage.setItem(STORAGE_KEY_SELECTED_ENGINE, engine);
    console.log(`[OCRService] Engine set to: ${engine}`);
  }

  /**
   * Получить текущий выбранный движок
   */
  getSelectedEngine(): OCREngine {
    return this.selectedEngine;
  }

  /**
   * Загружает сохранённый выбор движка
   */
  private async loadSelectedEngine(): Promise<void> {
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEY_SELECTED_ENGINE);
      if (saved && Object.values(OCREngine).includes(saved as OCREngine)) {
        this.selectedEngine = saved as OCREngine;
        console.log(`[OCRService] Loaded saved engine: ${saved}`);
      }
    } catch (error) {
      console.warn('[OCRService] Failed to load saved engine:', error);
    }
  }

  /**
   * Получить информацию о всех доступных движках
   */
  async getAvailableEngines(): Promise<OCREngineInfo[]> {
    const engines: OCREngineInfo[] = [
      {
        id: OCREngine.ML_KIT,
        name: 'ML Kit (Recommended)',
        description: 'Fast, offline, works without internet',
        icon: '🔒',
        isOnline: false,
        isPremium: false,
        isAvailable: await this.checkMLKitAvailability(),
        requiresApiKey: false,
      },
      {
        id: OCREngine.OCR_SPACE,
        name: 'OCR.space',
        description: 'Free online OCR, 25K requests/month',
        icon: '🌐',
        isOnline: true,
        isPremium: false,
        isAvailable: await OCRSpaceService.isAvailable(),
        requiresApiKey: false, // Используем публичный ключ
      },
      {
        id: OCREngine.GOOGLE_VISION,
        name: 'Google Cloud Vision',
        description: 'Premium, most accurate, requires API key',
        icon: '⭐',
        isOnline: true,
        isPremium: true,
        isAvailable: await GoogleVisionService.isAvailable(GOOGLE_VISION_API_KEY),
        requiresApiKey: true,
      },
    ];

    return engines;
  }

  /**
   * Проверяет доступность ML Kit
   */
  private async checkMLKitAvailability(): Promise<boolean> {
    try {
      return TextRecognition !== undefined && TextRecognition !== null;
    } catch {
      return false;
    }
  }

  /**
   * Получить поддерживаемые языки
   */
  getSupportedLanguages(): string[] {
    return [
      'en', 'zh', 'ru', 'ja', 'ko', 'ar', 'th', 'vi',
      'fr', 'de', 'es', 'it', 'pt', 'tr', 'hi', 'tk',
    ];
  }
}

export default new OCRService();
