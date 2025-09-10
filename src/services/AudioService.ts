// src/services/AudioService.ts - Enhanced Audio Service

import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';
import { IAudioService } from './index';
import { AUDIO_CONFIG, ERROR_MESSAGES } from '../constants/AppConstants';

/**
 * ✅ ENHANCED AUDIO SERVICE
 * Handles audio playback and text-to-speech functionality
 */
class AudioServiceImpl implements IAudioService {
  private currentSound: Audio.Sound | null = null;
  private currentRate: number = AUDIO_CONFIG.DEFAULT_RATE;
  private currentVolume: number = AUDIO_CONFIG.DEFAULT_VOLUME;
  private currentPitch: number = AUDIO_CONFIG.DEFAULT_PITCH;
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
   * Play audio file
   */
  async play(audioFile: string): Promise<void> {
    try {
      await this.ensureInitialized();
      await this.stop(); // Stop any currently playing audio

      const { sound } = await Audio.Sound.createAsync(
        { uri: audioFile },
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

    } catch (error) {
      console.warn('AudioService.play failed:', error);
      throw new Error(ERROR_MESSAGES.AUDIO_ERROR);
    }
  }

  /**
   * Play text using text-to-speech
   */
  async speak(text: string, language: string = 'zh-CN'): Promise<void> {
    try {
      await this.stopSpeaking();

      const options: Speech.SpeechOptions = {
        language,
        pitch: this.currentPitch,
        rate: this.currentRate,
        volume: this.currentVolume,
      };

      await Speech.speak(text, options);
    } catch (error) {
      console.warn('AudioService.speak failed:', error);
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
    } catch (error) {
      console.warn('AudioService.stop failed:', error);
    }
  }

  /**
   * Stop text-to-speech
   */
  async stopSpeaking(): Promise<void> {
    try {
      await Speech.stop();
    } catch (error) {
      console.warn('AudioService.stopSpeaking failed:', error);
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
   * Set volume
   */
  setVolume(volume: number): void {
    this.currentVolume = Math.max(0, Math.min(1, volume));
  }

  /**
   * Set pitch for text-to-speech
   */
  setPitch(pitch: number): void {
    this.currentPitch = Math.max(0.5, Math.min(2, pitch));
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
    try {
      if (!this.currentSound) {
        return { isPlaying: false, isLoaded: false };
      }

      const status = await this.currentSound.getStatusAsync();
      
      if (status.isLoaded) {
        return {
          isPlaying: status.isPlaying,
          isLoaded: true,
          position: status.positionMillis,
          duration: status.durationMillis || undefined,
        };
      }

      return { isPlaying: false, isLoaded: false };
    } catch (error) {
      console.warn('AudioService.getStatus failed:', error);
      return { isPlaying: false, isLoaded: false };
    }
  }

  /**
   * Check if text-to-speech is speaking
   */
  async isSpeaking(): Promise<boolean> {
    try {
      return await Speech.isSpeakingAsync();
    } catch {
      return false;
    }
  }

  /**
   * Get available voices for text-to-speech
   */
  async getAvailableVoices(): Promise<Speech.Voice[]> {
    try {
      return await Speech.getAvailableVoicesAsync();
    } catch (error) {
      console.warn('AudioService.getAvailableVoices failed:', error);
      return [];
    }
  }

  /**
   * Check if speech synthesis is available
   */
  async isSpeechAvailable(): Promise<boolean> {
    try {
      return await Speech.isSpeakingAsync() !== undefined;
    } catch {
      return false;
    }
  }

  /**
   * Cleanup resources
   */
  private cleanup(): void {
    if (this.currentSound) {
      this.currentSound.unloadAsync().catch(console.warn);
      this.currentSound = null;
    }
  }

  /**
   * Ensure service is initialized
   */
  private async ensureInitialized(): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize();
    }
  }

  /**
   * Destroy service and cleanup
   */
  async destroy(): Promise<void> {
    await this.stop();
    await this.stopSpeaking();
    this.isInitialized = false;
  }
}

// Export singleton instance
export const AudioService = new AudioServiceImpl();

// Export class for testing or custom instances
export { AudioServiceImpl };