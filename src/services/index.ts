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

export interface IAudioService {
  play(audioFile: string): Promise<void>;
  stop(): Promise<void>;
  setRate(rate: number): void;
  setVolume(volume: number): void;
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