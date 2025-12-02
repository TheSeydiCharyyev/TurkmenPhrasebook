// src/features/visual-translator/services/OCRService.ts
// OCR Service - только OCR.space (ML Kit и Google Vision - coming soon)

import AsyncStorage from '@react-native-async-storage/async-storage';
import { OCR_SPACE_API_KEY } from '@env';
import {
  OCRResult,
  OCREngine,
  OCREngineInfo,
} from '../types/visual-translator.types';
import OCRSpaceService from './OCRSpaceService';

const STORAGE_KEY_SELECTED_ENGINE = '@visual_translator_ocr_engine';

class OCRService {
  private selectedEngine: OCREngine = OCREngine.OCR_SPACE;

  constructor() {
    this.loadSelectedEngine();
  }

  /**
   * Распознаёт текст на изображении
   * Сейчас работает только OCR.space
   */
  async recognizeText(imagePath: string): Promise<OCRResult> {
    try {
      // Только OCR.space доступен
      return await OCRSpaceService.recognizeText(imagePath, OCR_SPACE_API_KEY);
    } catch (error) {
      console.error(`[OCRService] OCR.space failed:`, error);
      throw new Error(
        `OCR failed: ${error instanceof Error ? error.message : 'Unknown error'}`
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
    // Только OCR.space доступен сейчас
    if (engine !== OCREngine.OCR_SPACE) {
      console.warn(`[OCRService] Engine ${engine} is coming soon. Using OCR.space.`);
      engine = OCREngine.OCR_SPACE;
    }
    this.selectedEngine = engine;
    await AsyncStorage.setItem(STORAGE_KEY_SELECTED_ENGINE, engine);
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
      // Только OCR.space доступен
      this.selectedEngine = OCREngine.OCR_SPACE;
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
        id: OCREngine.OCR_SPACE,
        name: 'OCR.space',
        description: 'Free online OCR, 25K requests/month',
        icon: '🌐',
        isOnline: true,
        isPremium: false,
        isAvailable: true,
        requiresApiKey: false,
        isComingSoon: false,
      },
      {
        id: OCREngine.ML_KIT,
        name: 'ML Kit',
        description: 'Fast offline recognition',
        icon: '🔒',
        isOnline: false,
        isPremium: false,
        isAvailable: false,
        requiresApiKey: false,
        isComingSoon: true,
      },
      {
        id: OCREngine.GOOGLE_VISION,
        name: 'Google Cloud Vision',
        description: 'Premium, most accurate',
        icon: '⭐',
        isOnline: true,
        isPremium: true,
        isAvailable: false,
        requiresApiKey: true,
        isComingSoon: true,
      },
    ];

    return engines;
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
