// src/features/visual-translator/services/AIService.ts
// Сервис для AI анализа изображений (Hugging Face Inference API)

import * as FileSystem from 'expo-file-system';
import {
  AIDescription,
  ImageCategory,
  HuggingFaceBLIPResponse,
  HuggingFaceCLIPResponse,
} from '../types/visual-translator.types';

const HF_API_BASE = 'https://api-inference.huggingface.co/models/';

// Можно добавить API токен для более высоких лимитов
// Получить токен: https://huggingface.co/settings/tokens
const HF_API_TOKEN = ''; // Оставляем пустым - используем бесплатный tier

// Модели
const BLIP_MODEL = 'Salesforce/blip-image-captioning-base'; // Описание изображений
const CLIP_MODEL = 'openai/clip-vit-base-patch32'; // Категоризация изображений

class AIService {
  /**
   * Описывает содержимое изображения (что на фото)
   * Используется когда OCR не нашел текста
   */
  async describeImage(imageUri: string): Promise<string> {
    try {
      console.log('[AIService] Describing image with BLIP model');

      // Конвертируем изображение в base64
      const imageBase64 = await this.imageToBase64(imageUri);

      // Отправляем запрос к Hugging Face
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (HF_API_TOKEN) {
        headers['Authorization'] = `Bearer ${HF_API_TOKEN}`;
      }

      const response = await fetch(HF_API_BASE + BLIP_MODEL, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          inputs: imageBase64,
        }),
      });

      if (!response.ok) {
        // Проверка на rate limit или ошибку загрузки модели
        const errorText = await response.text();
        console.error('[AIService] BLIP API error:', response.status, errorText);

        if (response.status === 503) {
          throw new Error('AI model is loading, please try again in a few seconds');
        }

        throw new Error(`Image description failed: ${response.status}`);
      }

      const result: HuggingFaceBLIPResponse[] = await response.json();

      if (Array.isArray(result) && result.length > 0 && result[0].generated_text) {
        const description = result[0].generated_text;
        console.log('[AIService] Image described:', description);
        return description;
      }

      throw new Error('Invalid response from AI service');
    } catch (error) {
      console.error('[AIService] Image description error:', error);

      // Если Hugging Face недоступен, возвращаем fallback описание
      if (error instanceof Error && error.message.includes('loading')) {
        throw error; // Пробрасываем ошибку "модель загружается"
      }

      throw new Error('Failed to describe image. AI service may be temporarily unavailable.');
    }
  }

  /**
   * Определяет категорию изображения
   * Полезно для группировки результатов и предложения релевантных фраз
   */
  async categorizeImage(imageUri: string): Promise<AIDescription> {
    try {
      console.log('[AIService] Categorizing image with CLIP model');

      const imageBase64 = await this.imageToBase64(imageUri);

      const categories: ImageCategory[] = [
        'food',
        'clothing',
        'document',
        'sign',
        'product',
        'nature',
        'building',
        'person',
        'other',
      ];

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (HF_API_TOKEN) {
        headers['Authorization'] = `Bearer ${HF_API_TOKEN}`;
      }

      const response = await fetch(HF_API_BASE + CLIP_MODEL, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          inputs: imageBase64,
          parameters: {
            candidate_labels: categories,
          },
        }),
      });

      if (!response.ok) {
        console.error('[AIService] CLIP API error:', response.status);

        // Если CLIP не работает, используем fallback - просто описание
        const description = await this.describeImage(imageUri);
        return {
          description,
          category: 'other',
          confidence: 0.5,
        };
      }

      const result: HuggingFaceCLIPResponse[] = await response.json();

      // CLIP возвращает массив с scores для каждой категории
      if (Array.isArray(result) && result.length > 0) {
        const topResult = result[0];
        const description = await this.describeImage(imageUri);

        return {
          description,
          category: topResult.label as ImageCategory,
          confidence: topResult.score,
        };
      }

      // Fallback
      const description = await this.describeImage(imageUri);
      return {
        description,
        category: 'other',
        confidence: 0.5,
      };
    } catch (error) {
      console.error('[AIService] Categorization error:', error);

      // Fallback: просто описание без категоризации
      try {
        const description = await this.describeImage(imageUri);
        return {
          description,
          category: 'other',
          confidence: 0.5,
        };
      } catch (descError) {
        throw new Error('AI analysis failed. Please try again.');
      }
    }
  }

  /**
   * Конвертирует изображение в base64
   * Необходимо для отправки в Hugging Face API
   */
  private async imageToBase64(imageUri: string): Promise<string> {
    try {
      // Используем expo-file-system для конвертации в base64
      const base64 = await FileSystem.readAsStringAsync(imageUri, {
        encoding: 'base64' as any, // TypeScript workaround
      });

      return base64;
    } catch (error) {
      console.error('[AIService] Image to base64 error:', error);
      throw new Error('Failed to process image');
    }
  }

  /**
   * Проверяет доступность AI сервисов
   */
  async checkAvailability(): Promise<{
    blip: boolean;
    clip: boolean;
  }> {
    const results = {
      blip: false,
      clip: false,
    };

    // Проверка BLIP (описание изображений)
    try {
      const response = await fetch(HF_API_BASE + BLIP_MODEL, {
        method: 'HEAD',
      });
      results.blip = response.ok || response.status === 503; // 503 = модель загружается (норм)
    } catch (error) {
      console.error('[AIService] BLIP unavailable:', error);
    }

    // Проверка CLIP (категоризация)
    try {
      const response = await fetch(HF_API_BASE + CLIP_MODEL, {
        method: 'HEAD',
      });
      results.clip = response.ok || response.status === 503;
    } catch (error) {
      console.error('[AIService] CLIP unavailable:', error);
    }

    return results;
  }

  /**
   * Получить информацию о сервисе
   */
  getServiceInfo(): {
    models: { blip: string; clip: string };
    hasToken: boolean;
    version: string;
  } {
    return {
      models: {
        blip: BLIP_MODEL,
        clip: CLIP_MODEL,
      },
      hasToken: HF_API_TOKEN.length > 0,
      version: '1.0.0',
    };
  }

  /**
   * Получить поддерживаемые категории
   */
  getSupportedCategories(): ImageCategory[] {
    return [
      'food',
      'clothing',
      'document',
      'sign',
      'product',
      'nature',
      'building',
      'person',
      'other',
    ];
  }
}

// Экспортируем singleton
export default new AIService();
