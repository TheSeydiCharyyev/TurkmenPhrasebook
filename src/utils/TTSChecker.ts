// src/utils/TTSChecker.ts
// Утилита для проверки доступности TTS голосов

import * as Speech from 'expo-speech';
import { Platform } from 'react-native';

export interface VoiceInfo {
  identifier: string;
  name: string;
  quality: string;
  language: string;
}

export interface TTSCheckResult {
  hasChineseVoice: boolean;
  hasTurkmenVoice: boolean;
  hasRussianVoice: boolean;
  chineseVoices: VoiceInfo[];
  allVoices: VoiceInfo[];
  needsInternet: boolean;
  platform: string;
}

/**
 * Проверяет доступность TTS голосов для разных языков
 */
export class TTSChecker {
  private static cachedResult: TTSCheckResult | null = null;
  private static lastCheckTime: number = 0;
  private static CACHE_DURATION = 60000; // 1 минута

  /**
   * Проверить доступность китайских голосов
   */
  static async checkChineseVoiceAvailability(): Promise<TTSCheckResult> {
    // Используем кэш, если доступен и не истек
    const now = Date.now();
    if (
      this.cachedResult &&
      now - this.lastCheckTime < this.CACHE_DURATION
    ) {
      return this.cachedResult;
    }

    try {
      const voices = await Speech.getAvailableVoicesAsync();

      // Фильтруем голоса по языкам
      const chineseVoices = voices.filter(voice =>
        voice.language.toLowerCase().startsWith('zh')
      );

      const turkmenVoices = voices.filter(voice =>
        voice.language.toLowerCase().startsWith('tk') ||
        voice.language.toLowerCase().startsWith('tr') // Турецкий как альтернатива
      );

      const russianVoices = voices.filter(voice =>
        voice.language.toLowerCase().startsWith('ru')
      );

      const result: TTSCheckResult = {
        hasChineseVoice: chineseVoices.length > 0,
        hasTurkmenVoice: turkmenVoices.length > 0,
        hasRussianVoice: russianVoices.length > 0,
        chineseVoices,
        allVoices: voices,
        needsInternet: chineseVoices.length === 0, // Если голосов нет, нужен интернет
        platform: Platform.OS,
      };

      // Кэшируем результат
      this.cachedResult = result;
      this.lastCheckTime = now;

      return result;
    } catch (error) {
      console.warn('TTSChecker: Ошибка при проверке голосов:', error);

      // Возвращаем безопасный результат по умолчанию
      return {
        hasChineseVoice: false,
        hasTurkmenVoice: false,
        hasRussianVoice: false,
        chineseVoices: [],
        allVoices: [],
        needsInternet: true,
        platform: Platform.OS,
      };
    }
  }

  /**
   * Получить рекомендации для пользователя
   */
  static async getRecommendations(languageMode: 'tk' | 'zh'): Promise<{
    title: string;
    message: string;
    showWarning: boolean;
    instructions?: string[];
  }> {
    const result = await this.checkChineseVoiceAvailability();

    if (languageMode === 'tk') {
      // Туркмен изучает китайский - нужны китайские голоса
      if (!result.hasChineseVoice) {
        return {
          title: '⚠️ Hytaýça ses ýok',
          message: 'Hytaýça sözlemleriň sesi üçin internet gerek',
          showWarning: true,
          instructions: Platform.OS === 'android' ? [
            '1. Sazlamalary açyň',
            '2. "Ulgam" → "Dil we girişim"',
            '3. "TTS çykyş" → "Dili saýlaň"',
            '4. Hytaý dilini göçürip alyň',
          ] : [
            '1. Sazlamalary açyň',
            '2. "Ýeňil elýeterlilik"',
            '3. "Söz mazmun"',
            '4. Hytaý dilini goşuň',
          ]
        };
      }

      return {
        title: '✅ Ähli sesler elýeterli',
        message: `Hytaýça ses tapyldy: ${result.chineseVoices.length} sany`,
        showWarning: false,
      };
    } else {
      // Китаец изучает туркменский - проверяем туркменские/турецкие голоса
      if (!result.hasTurkmenVoice) {
        return {
          title: '⚠️ 没有土库曼语音',
          message: '土库曼语短语需要互联网连接才能播放',
          showWarning: true,
          instructions: Platform.OS === 'android' ? [
            '1. 打开设置',
            '2. "系统" → "语言和输入法"',
            '3. "文字转语音输出" → "选择语言"',
            '4. 下载土耳其语（作为替代）',
          ] : [
            '1. 打开设置',
            '2. "辅助功能"',
            '3. "语音内容"',
            '4. 添加土耳其语',
          ]
        };
      }

      return {
        title: '✅ 所有语音可用',
        message: `找到语音: ${result.chineseVoices.length} 种`,
        showWarning: false,
      };
    }
  }

  /**
   * Очистить кэш
   */
  static clearCache(): void {
    this.cachedResult = null;
    this.lastCheckTime = 0;
  }

  /**
   * Тестовое произношение
   */
  static async testVoice(language: 'chinese' | 'turkmen' | 'russian'): Promise<boolean> {
    try {
      const testTexts = {
        chinese: '你好',
        turkmen: 'Salam',
        russian: 'Привет',
      };

      const languageCodes = {
        chinese: 'zh-CN',
        turkmen: 'tr-TR', // Используем турецкий
        russian: 'ru-RU',
      };

      await Speech.speak(testTexts[language], {
        language: languageCodes[language],
        rate: 0.85,
        pitch: 1.0,
      });

      return true;
    } catch (error) {
      console.warn(`TTSChecker: Ошибка тестирования голоса ${language}:`, error);
      return false;
    }
  }
}

export default TTSChecker;
