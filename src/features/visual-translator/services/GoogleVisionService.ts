// src/features/visual-translator/services/GoogleVisionService.ts
// Google Cloud Vision API Service - премиум OCR
// Лимиты: 1000 запросов/месяц бесплатно, далее платно
// Документация: https://cloud.google.com/vision/docs/ocr

import * as FileSystem from 'expo-file-system';
import { OCRResult, OCREngine, BoundingBox, TextBlock } from '../types/visual-translator.types';

const GOOGLE_VISION_API_URL = 'https://vision.googleapis.com/v1/images:annotate';

interface GoogleVisionResponse {
  responses: Array<{
    textAnnotations?: Array<{
      description: string;
      boundingPoly?: {
        vertices: Array<{ x?: number; y?: number }>;
      };
      locale?: string;
    }>;
    fullTextAnnotation?: {
      text: string;
      pages: Array<{
        blocks: Array<{
          boundingBox: {
            vertices: Array<{ x: number; y: number }>;
          };
          paragraphs: Array<{
            words: Array<{
              symbols: Array<{
                text: string;
                confidence: number;
              }>;
            }>;
          }>;
          confidence: number;
        }>;
      }>;
    };
    error?: {
      code: number;
      message: string;
      status: string;
    };
  }>;
}

class GoogleVisionService {
  /**
   * Распознать текст с изображения используя Google Cloud Vision API
   */
  async recognizeText(imageUri: string, apiKey: string): Promise<OCRResult> {
    try {
      if (!apiKey || apiKey === 'YOUR_GOOGLE_CLOUD_API_KEY') {
        throw new Error('Google Cloud Vision API key is required');
      }

      // Конвертируем изображение в base64
      const base64Image = await this.imageToBase64(imageUri);

      // Отправляем запрос к Google Cloud Vision API
      const response = await fetch(`${GOOGLE_VISION_API_URL}?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requests: [
            {
              image: {
                content: base64Image,
              },
              features: [
                {
                  type: 'TEXT_DETECTION',
                  maxResults: 1,
                },
              ],
              imageContext: {
                languageHints: ['zh', 'ru', 'en', 'tr', 'tk'],
              },
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`Google Vision API error: ${response.statusText}`);
      }

      const data: GoogleVisionResponse = await response.json();

      if (!data.responses || data.responses.length === 0) {
        throw new Error('No response from Google Vision API');
      }

      const result = data.responses[0];

      // Проверяем на ошибки
      if (result.error) {
        throw new Error(`Google Vision error: ${result.error.message}`);
      }

      // Проверяем наличие текста
      if (!result.textAnnotations || result.textAnnotations.length === 0) {
        throw new Error('No text found in image');
      }

      // Первая аннотация содержит весь распознанный текст
      const fullText = result.textAnnotations[0];
      const recognizedText = fullText.description.trim();

      if (!recognizedText) {
        throw new Error('No text found in image');
      }

      // Определяем язык
      const language = fullText.locale || this.detectLanguage(recognizedText);

      // Вычисляем confidence
      const confidence = this.calculateConfidence(result);

      // Извлекаем bounding box
      const boundingBox = this.extractBoundingBox(fullText.boundingPoly);

      // Извлекаем блоки текста
      const blocks = this.extractBlocks(result);

      return {
        text: recognizedText,
        language,
        confidence,
        boundingBox,
        blocks,
        engine: OCREngine.GOOGLE_VISION,
      };
    } catch (error) {
      console.error('[GoogleVisionService] ❌ Recognition error:', error);
      throw new Error(`Google Vision failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
      console.error('[GoogleVisionService] Failed to convert image to base64:', error);
      throw new Error('Failed to process image');
    }
  }

  /**
   * Извлекает bounding box из vertices
   */
  private extractBoundingBox(boundingPoly?: {
    vertices: Array<{ x?: number; y?: number }>;
  }): BoundingBox | undefined {
    if (!boundingPoly || !boundingPoly.vertices || boundingPoly.vertices.length < 2) {
      return undefined;
    }

    const vertices = boundingPoly.vertices;
    const xs = vertices.map(v => v.x || 0);
    const ys = vertices.map(v => v.y || 0);

    const minX = Math.min(...xs);
    const minY = Math.min(...ys);
    const maxX = Math.max(...xs);
    const maxY = Math.max(...ys);

    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY,
    };
  }

  /**
   * Извлекает блоки текста из ответа
   */
  private extractBlocks(result: GoogleVisionResponse['responses'][0]): TextBlock[] | undefined {
    if (!result.fullTextAnnotation?.pages) {
      return undefined;
    }

    const blocks: TextBlock[] = [];

    for (const page of result.fullTextAnnotation.pages) {
      for (const block of page.blocks) {
        const text = this.extractBlockText(block);
        const boundingBox = this.extractBoundingBox({ vertices: block.boundingBox.vertices });

        if (text && boundingBox) {
          blocks.push({
            text,
            boundingBox,
            lines: [], // Упрощаем структуру
            confidence: block.confidence,
          });
        }
      }
    }

    return blocks.length > 0 ? blocks : undefined;
  }

  /**
   * Извлекает текст из блока
   */
  private extractBlockText(block: any): string {
    let text = '';
    if (block.paragraphs) {
      for (const paragraph of block.paragraphs) {
        if (paragraph.words) {
          for (const word of paragraph.words) {
            if (word.symbols) {
              for (const symbol of word.symbols) {
                text += symbol.text;
              }
              text += ' ';
            }
          }
        }
      }
    }
    return text.trim();
  }

  /**
   * Вычисляет средний confidence
   */
  private calculateConfidence(result: GoogleVisionResponse['responses'][0]): number {
    if (result.fullTextAnnotation?.pages) {
      let totalConfidence = 0;
      let count = 0;

      for (const page of result.fullTextAnnotation.pages) {
        for (const block of page.blocks) {
          if (block.confidence !== undefined) {
            totalConfidence += block.confidence;
            count++;
          }
        }
      }

      return count > 0 ? totalConfidence / count : 0.9; // High default for Google
    }

    return 0.9; // High default для Google Vision
  }

  /**
   * Простое определение языка по символам (fallback)
   */
  private detectLanguage(text: string): string {
    if (/[\u4e00-\u9fff]/.test(text)) return 'zh';
    if (/[а-яА-ЯёЁ]/.test(text)) return 'ru';
    if (/[ğĞıİöÖşŞüÜçÇ]/.test(text)) return 'tr';
    return 'en';
  }

  /**
   * Проверка доступности сервиса
   */
  async isAvailable(apiKey: string): Promise<boolean> {
    if (!apiKey || apiKey === 'YOUR_GOOGLE_CLOUD_API_KEY') {
      return false;
    }
    try {
      // Простая проверка валидности API ключа
      const response = await fetch(`${GOOGLE_VISION_API_URL}?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requests: [] }),
      });
      return response.status !== 403; // 403 = invalid API key
    } catch {
      return false;
    }
  }
}

export default new GoogleVisionService();
