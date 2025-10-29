// src/services/AudioService.ts
// ✅ ОБНОВЛЕНО: Гибридная система MP3 + TTS

import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';
import { getAudioSource } from '../data/audioMapping';
import { IAudioService } from './index';
import { AUDIO_CONFIG, ERROR_MESSAGES } from '../constants/AppConstants';

/**
 * ✅ AUDIO SERVICE - Hybrid MP3 + TTS
 * MP3 для туркменского, TTS для китайского и русского
 */
class AudioServiceImpl implements IAudioService {
  private currentSound: Audio.Sound | null = null;
  private currentRate: number = AUDIO_CONFIG.DEFAULT_RATE;
  private currentVolume: number = AUDIO_CONFIG.DEFAULT_VOLUME;
  private isInitialized: boolean = false;

  constructor() {
    this.initialize();
  }

  /**
   * Initialize audio service
   */
  private async initialize(): Promise<void> {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: false,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });
      this.isInitialized = true;
    } catch (error) {
      console.warn('AudioService initialization failed:', error);
    }
  }

  /**
   * Ensure audio service is initialized
   */
  private async ensureInitialized(): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize();
    }
  }

  /**
   * Play audio (hybrid MP3 + TTS)
   * @param text - текст для произношения
   * @param language - 'chinese' | 'turkmen' | 'russian' | 'english'
   * @param audioPath - путь к MP3 (только для туркменского)
   */
  async play(text: string, language: 'chinese' | 'turkmen' | 'russian' | 'english', audioPath?: string): Promise<void> {
    try {
      await this.ensureInitialized();
      await this.stop(); // Stop any currently playing audio

      // ✅ ТУРКМЕНСКИЙ - MP3
      if (language === 'turkmen' && audioPath) {
        const audioSource = getAudioSource(audioPath);
        
        if (audioSource) {
          const { sound } = await Audio.Sound.createAsync(
            audioSource,
            {
              shouldPlay: true,
              volume: this.currentVolume,
              rate: this.currentRate,
            }
          );

          this.currentSound = sound;
          
          // Set up completion callback
          sound.setOnPlaybackStatusUpdate((status) => {
            if (status.isLoaded && status.didJustFinish) {
              this.cleanup();
            }
          });
          
          return;
        }
      }

      // ✅ КИТАЙСКИЙ, РУССКИЙ и АНГЛИЙСКИЙ - TTS
      let languageCode = 'en-US'; // По умолчанию английский
      if (language === 'chinese') {
        languageCode = 'zh-CN';
      } else if (language === 'russian') {
        languageCode = 'ru-RU';
      }

      // Оптимизированные параметры для более естественного звучания
      const ttsRate = language === 'russian' ? 0.92 : 0.85;  // Русский быстрее
      const ttsPitch = language === 'russian' ? 0.95 : 1.0;  // Русский чуть ниже

      await Speech.speak(text, {
        language: languageCode,
        rate: ttsRate,
        pitch: ttsPitch,
      });

    } catch (error) {
      console.warn('AudioService.play failed:', error);
      throw new Error(ERROR_MESSAGES.AUDIO_ERROR);
    }
  }

  /**
   * Stop audio playback
   */
  async stop(): Promise<void> {
    try {
      if (this.currentSound) {
        await this.currentSound.unloadAsync();
        this.currentSound = null;
      }
      Speech.stop();
    } catch (error) {
      console.warn('AudioService.stop failed:', error);
    }
  }

  /**
   * Pause audio playback
   */
  async pause(): Promise<void> {
    try {
      if (this.currentSound) {
        await this.currentSound.pauseAsync();
      }
      // TTS не поддерживает паузу
    } catch (error) {
      console.warn('AudioService.pause failed:', error);
    }
  }

  /**
   * Resume audio playback
   */
  async resume(): Promise<void> {
    try {
      if (this.currentSound) {
        await this.currentSound.playAsync();
      }
      // TTS не поддерживает resume
    } catch (error) {
      console.warn('AudioService.resume failed:', error);
    }
  }

  /**
   * Set playback rate
   */
  setRate(rate: number): void {
    this.currentRate = Math.max(
      AUDIO_CONFIG.MIN_RATE,
      Math.min(AUDIO_CONFIG.MAX_RATE, rate)
    );
  }

  /**
   * Set volume (0.0 to 1.0)
   */
  setVolume(volume: number): void {
    this.currentVolume = Math.max(0, Math.min(1, volume));
  }

  /**
   * Get current playback status
   */
  async getStatus(): Promise<{
    isPlaying: boolean;
    isLoaded: boolean;
    position?: number;
    duration?: number;
  }> {
    if (!this.currentSound) {
      return {
        isPlaying: false,
        isLoaded: false,
      };
    }

    try {
      const status = await this.currentSound.getStatusAsync();
      
      if (status.isLoaded) {
        return {
          isPlaying: status.isPlaying,
          isLoaded: true,
          position: status.positionMillis,
          duration: status.durationMillis || undefined,
        };
      }
      
      return {
        isPlaying: false,
        isLoaded: false,
      };
    } catch (error) {
      console.warn('AudioService.getStatus failed:', error);
      return {
        isPlaying: false,
        isLoaded: false,
      };
    }
  }

  /**
   * Cleanup audio resources
   */
  private cleanup(): void {
    if (this.currentSound) {
      this.currentSound.unloadAsync().catch(console.warn);
      this.currentSound = null;
    }
  }

  /**
   * Cleanup when service is destroyed
   */
  async destroy(): Promise<void> {
    await this.stop();
    this.cleanup();
  }
}

// Export singleton instance
export const AudioService = new AudioServiceImpl();
export default AudioService;