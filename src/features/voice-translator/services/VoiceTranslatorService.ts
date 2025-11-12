// src/features/voice-translator/services/VoiceTranslatorService.ts

import Voice from '@react-native-voice/voice';
import * as Speech from 'expo-speech';
import { Audio } from 'expo-av';

export interface VoiceRecognitionResult {
  text: string;
  confidence?: number;
}

export interface VoiceTranslatorError {
  code: 'NO_PERMISSION' | 'NO_INTERNET' | 'RECOGNITION_FAILED' | 'TRANSLATION_FAILED' | 'UNKNOWN';
  message: string;
}

export class VoiceTranslatorService {
  private static isListening = false;
  private static isSpeaking = false;

  /**
   * Initialize the voice recognition service
   */
  static async initialize(): Promise<void> {
    try {
      await Voice.destroy(); // Clean up any existing instances
      Voice.removeAllListeners();
    } catch (error) {
      console.warn('Voice initialization warning:', error);
    }
  }

  /**
   * Check if voice recognition is available and permissions are granted
   */
  static async checkPermissions(): Promise<boolean> {
    try {
      // Request microphone permissions using expo-av
      const { status, canAskAgain, granted } = await Audio.getPermissionsAsync();

      if (granted) {
        // Permission already granted
        return true;
      }

      if (canAskAgain) {
        // Ask for permission
        const { granted: newGranted } = await Audio.requestPermissionsAsync();
        return newGranted;
      }

      // Permission denied and can't ask again - need to go to settings
      return false;
    } catch (error) {
      console.error('Permission check error:', error);
      return false;
    }
  }

  /**
   * Start recording voice
   * @param languageCode - Language code (e.g., 'ru-RU', 'en-US', 'zh-CN')
   */
  static async startRecording(languageCode: string): Promise<void> {
    try {
      if (this.isListening) {
        await this.stopRecording();
      }

      await Voice.start(languageCode);
      this.isListening = true;
    } catch (error) {
      console.error('Start recording error:', error);
      this.isListening = false;
      throw {
        code: 'RECOGNITION_FAILED',
        message: 'Failed to start recording',
      } as VoiceTranslatorError;
    }
  }

  /**
   * Stop recording voice
   */
  static async stopRecording(): Promise<void> {
    try {
      if (this.isListening) {
        await Voice.stop();
        this.isListening = false;
      }
    } catch (error) {
      console.error('Stop recording error:', error);
      this.isListening = false;
      throw {
        code: 'RECOGNITION_FAILED',
        message: 'Failed to stop recording',
      } as VoiceTranslatorError;
    }
  }

  /**
   * Cancel recording
   */
  static async cancelRecording(): Promise<void> {
    try {
      if (this.isListening) {
        await Voice.cancel();
        this.isListening = false;
      }
    } catch (error) {
      console.error('Cancel recording error:', error);
      this.isListening = false;
    }
  }

  /**
   * Play text using Text-to-Speech
   * @param text - Text to speak
   * @param languageCode - Language code (e.g., 'ru-RU', 'en-US', 'zh-CN')
   */
  static async playText(text: string, languageCode: string): Promise<void> {
    try {
      if (this.isSpeaking) {
        await this.stopSpeaking();
      }

      await Speech.speak(text, {
        language: languageCode,
        rate: 0.75,
        pitch: 1.0,
        onDone: () => {
          this.isSpeaking = false;
        },
        onError: (error) => {
          console.error('TTS error:', error);
          this.isSpeaking = false;
        },
      });

      this.isSpeaking = true;
    } catch (error) {
      console.error('TTS error:', error);
      this.isSpeaking = false;
      throw {
        code: 'UNKNOWN',
        message: 'Failed to play text',
      } as VoiceTranslatorError;
    }
  }

  /**
   * Stop speaking
   */
  static async stopSpeaking(): Promise<void> {
    try {
      if (this.isSpeaking) {
        await Speech.stop();
        this.isSpeaking = false;
      }
    } catch (error) {
      console.error('Stop TTS error:', error);
      this.isSpeaking = false;
    }
  }

  /**
   * Check if currently listening
   */
  static isCurrentlyListening(): boolean {
    return this.isListening;
  }

  /**
   * Check if currently speaking
   */
  static isCurrentlySpeaking(): boolean {
    return this.isSpeaking;
  }

  /**
   * Cleanup resources
   */
  static async cleanup(): Promise<void> {
    try {
      await this.stopRecording();
      await this.stopSpeaking();
      await Voice.destroy();
      Voice.removeAllListeners();
      this.isListening = false;
      this.isSpeaking = false;
    } catch (error) {
      console.error('Cleanup error:', error);
    }
  }

  /**
   * Get language code for voice recognition
   * Maps app language codes to voice recognition language codes
   */
  static getVoiceLanguageCode(languageCode: string): string {
    const languageMap: { [key: string]: string } = {
      // Main languages
      tk: 'tr-TR', // Use Turkish for Turkmen (closest match)
      zh: 'zh-CN', // Chinese (Simplified)
      ru: 'ru-RU', // Russian
      en: 'en-US', // English (US)
      tr: 'tr-TR', // Turkish

      // European languages
      de: 'de-DE', // German
      fr: 'fr-FR', // French
      es: 'es-ES', // Spanish
      it: 'it-IT', // Italian
      pt: 'pt-PT', // Portuguese
      nl: 'nl-NL', // Dutch
      pl: 'pl-PL', // Polish
      uk: 'uk-UA', // Ukrainian

      // Asian languages
      ja: 'ja-JP', // Japanese
      ko: 'ko-KR', // Korean
      th: 'th-TH', // Thai
      vi: 'vi-VN', // Vietnamese
      id: 'id-ID', // Indonesian
      ms: 'ms-MY', // Malay
      hi: 'hi-IN', // Hindi

      // Middle Eastern languages
      ur: 'ur-PK', // Urdu
      fa: 'fa-IR', // Persian
      ps: 'fa-IR', // Pashto (use Persian as fallback)
      ar: 'ar-SA', // Arabic

      // Central Asian languages
      uz: 'tr-TR', // Uzbek (use Turkish as fallback)
      kk: 'kk-KZ', // Kazakh
      az: 'az-AZ', // Azerbaijani
      ky: 'ky-KG', // Kyrgyz
      tg: 'tg-TJ', // Tajik

      // Caucasian languages
      hy: 'hy-AM', // Armenian
      ka: 'ka-GE', // Georgian
    };

    return languageMap[languageCode] || 'en-US';
  }
}
