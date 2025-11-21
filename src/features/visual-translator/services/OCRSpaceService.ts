// src/features/visual-translator/services/OCRSpaceService.ts
// OCR.space API Service - бесплатный онлайн OCR
// Лимиты: 25,000 запросов/месяц бесплатно
// Документация: https://ocr.space/ocrapi

import * as FileSystem from 'expo-file-system/legacy';
import { OCRResult, OCREngine } from '../types/visual-translator.types';

const OCR_SPACE_API_URL = 'https://api.ocr.space/parse/image';

// Бесплатный API ключ (можно получить свой на https://ocr.space/ocrapi)
// Или использовать из .env файла
const DEFAULT_API_KEY = 'helloworld'; // Публичный тестовый ключ

interface OCRSpaceResponse {
  ParsedResults?: Array<{
    TextOverlay?: {
      Lines?: Array<{
        LineText: string;
        Words?: Array<{
          WordText: string;
          Left: number;
          Top: number;
          Height: number;
          Width: number;
        }>;
      }>;
    };
    ParsedText: string;
    FileParseExitCode: number;
    ErrorMessage?: string;
    ErrorDetails?: string;
  }>;
  OCRExitCode: number;
  IsErroredOnProcessing: boolean;
  ErrorMessage?: string | string[];
  ProcessingTimeInMilliseconds: string;
}

class OCRSpaceService {
  /**
   * Распознать текст с изображения используя OCR.space API
   */
  async recognizeText(imageUri: string, apiKey?: string): Promise<OCRResult> {
    try {
      console.log('[OCRSpaceService] Starting OCR with OCR.space API...');
      console.log('[OCRSpaceService] Image URI:', imageUri);

      // Конвертируем изображение в base64
      const base64Image = await this.imageToBase64(imageUri);

      // Отправляем запрос к OCR.space API
      const response = await fetch(OCR_SPACE_API_URL, {
        method: 'POST',
        headers: {
          'apikey': apiKey || DEFAULT_API_KEY,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          base64Image: `data:image/jpeg;base64,${base64Image}`,
          language: 'eng', // Английский язык (универсальный)
          isOverlayRequired: 'false',
          detectOrientation: 'true',
          scale: 'true',
          OCREngine: '2', // Engine 2 (более точный)
        }).toString(),
      });

      if (!response.ok) {
        throw new Error(`OCR.space API error: ${response.statusText}`);
      }

      const data: OCRSpaceResponse = await response.json();
      console.log('[OCRSpaceService] API Response:', JSON.stringify(data, null, 2));

      // Проверяем на ошибки
      if (data.IsErroredOnProcessing) {
        const errorMsg = Array.isArray(data.ErrorMessage)
          ? data.ErrorMessage.join(', ')
          : data.ErrorMessage || 'Unknown OCR error';
        throw new Error(errorMsg);
      }

      if (!data.ParsedResults || data.ParsedResults.length === 0) {
        throw new Error('No text found in image');
      }

      const result = data.ParsedResults[0];

      // Проверяем код выхода
      if (result.FileParseExitCode !== 1) {
        throw new Error(result.ErrorMessage || 'Failed to parse image');
      }

      const recognizedText = result.ParsedText?.trim() || '';

      if (!recognizedText) {
        throw new Error('No text found in image');
      }

      console.log('[OCRSpaceService] ✅ Text recognized:', recognizedText.substring(0, 100));

      // Определяем язык (упрощённо, по символам)
      const language = this.detectLanguage(recognizedText);

      // Вычисляем confidence (OCR.space не возвращает confidence, используем эвристику)
      const confidence = this.calculateConfidence(recognizedText);

      return {
        text: recognizedText,
        language,
        confidence,
        engine: OCREngine.OCR_SPACE,
        blocks: undefined, // OCR.space не предоставляет подробную структуру
      };
    } catch (error) {
      console.error('[OCRSpaceService] ❌ Recognition error:', error);
      throw new Error(`OCR.space failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Конвертирует изображение в base64
   */
  private async imageToBase64(imageUri: string): Promise<string> {
    try {
      const base64 = await FileSystem.readAsStringAsync(imageUri, {
        encoding: 'base64',
      });
      return base64;
    } catch (error) {
      console.error('[OCRSpaceService] Failed to convert image to base64:', error);
      throw new Error('Failed to process image');
    }
  }

  /**
   * Простое определение языка по символам
   */
  private detectLanguage(text: string): string {
    // Проверяем на китайские иероглифы
    if (/[\u4e00-\u9fff]/.test(text)) {
      return 'zh';
    }
    // Проверяем на кириллицу
    if (/[а-яА-ЯёЁ]/.test(text)) {
      return 'ru';
    }
    // Проверяем на турецкие специфичные символы
    if (/[ğĞıİöÖşŞüÜçÇ]/.test(text)) {
      return 'tr';
    }
    // По умолчанию английский
    return 'en';
  }

  /**
   * Вычисляет confidence на основе эвристики
   */
  private calculateConfidence(text: string): number {
    // Базовая эвристика:
    // - Длинный текст = выше confidence
    // - Много букв vs цифр/символов = выше confidence

    const length = text.length;
    const letterCount = (text.match(/[a-zA-Zа-яА-ЯёЁ\u4e00-\u9fff]/g) || []).length;
    const letterRatio = letterCount / Math.max(length, 1);

    let confidence = 0.5; // Базовое значение

    // Бонус за длину
    if (length > 50) confidence += 0.2;
    else if (length > 20) confidence += 0.1;

    // Бонус за высокий процент букв
    if (letterRatio > 0.8) confidence += 0.2;
    else if (letterRatio > 0.5) confidence += 0.1;

    return Math.min(confidence, 1.0);
  }

  /**
   * Проверка доступности сервиса
   */
  async isAvailable(): Promise<boolean> {
    try {
      // Простая проверка доступности API
      const response = await fetch(OCR_SPACE_API_URL, {
        method: 'HEAD',
      });
      return response.ok || response.status === 405; // 405 = Method Not Allowed (но API доступен)
    } catch {
      return false;
    }
  }
}

export default new OCRSpaceService();
