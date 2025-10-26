// src/services/index.ts - Service Layer for Clean Architecture

export { StorageService } from './StorageService';
export { AudioService } from './AudioService';

// Service interface for dependency injection
export interface IStorageService {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T): Promise<boolean>;
  remove(key: string): Promise<boolean>;
  clear(): Promise<boolean>;
}

// ✅ ОБНОВЛЕНО: Гибридная аудио система (китайский, русский, английский - TTS, туркменский - MP3)
export interface IAudioService {
  play(text: string, language: 'chinese' | 'turkmen' | 'russian' | 'english', audioPath?: string): Promise<void>;
  stop(): Promise<void>;
  pause(): Promise<void>;
  resume(): Promise<void>;
  setRate(rate: number): void;
  setVolume(volume: number): void;
  getStatus(): Promise<{
    isPlaying: boolean;
    isLoaded: boolean;
    position?: number;
    duration?: number;
  }>;
  destroy(): Promise<void>;
}

export interface IAnalyticsService {
  track(event: string, properties?: Record<string, any>): void;
  identify(userId: string, traits?: Record<string, any>): void;
  screen(screenName: string, properties?: Record<string, any>): void;
}

export interface INotificationService {
  scheduleLocalNotification(title: string, body: string, delay: number): Promise<string>;
  cancelNotification(id: string): Promise<void>;
  clearAllNotifications(): Promise<void>;
}