// src/hooks/useAudioV2.ts
// Новый хук для аудио с поддержкой TTS роутера

import { useState, useCallback, useEffect } from 'react';
import { TTSRouter, TTSPlayResult, TTSProviderType } from '../services/tts';

interface UseAudioV2Return {
  /** Воспроизводится ли сейчас */
  isPlaying: boolean;

  /** Загружается ли аудио */
  isLoading: boolean;

  /** Текущий провайдер */
  currentProvider: TTSProviderType | null;

  /** Использовался ли fallback */
  usedFallback: boolean;

  /** Fallback язык если использовался */
  fallbackLanguage: string | null;

  /** Воспроизвести текст */
  play: (text: string, language: string, audioPath?: string) => Promise<TTSPlayResult>;

  /** Остановить воспроизведение */
  stop: () => Promise<void>;

  /** Получить информацию о языке */
  getLanguageInfo: (language: string) => Promise<{
    provider: TTSProviderType;
    isAvailable: boolean;
    needsFallback: boolean;
  }>;
}

/**
 * Хук для воспроизведения аудио через TTS роутер
 * Поддерживает все языковые группы с автоматическим роутингом
 */
export function useAudioV2(): UseAudioV2Return {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentProvider, setCurrentProvider] = useState<TTSProviderType | null>(null);
  const [usedFallback, setUsedFallback] = useState(false);
  const [fallbackLanguage, setFallbackLanguage] = useState<string | null>(null);

  // Очистка при размонтировании
  useEffect(() => {
    return () => {
      TTSRouter.stop().catch(console.warn);
    };
  }, []);

  /**
   * Воспроизвести текст
   */
  const play = useCallback(async (
    text: string,
    language: string,
    audioPath?: string
  ): Promise<TTSPlayResult> => {
    if (isPlaying || isLoading) {
      return {
        success: false,
        provider: 'expo_speech',
        language,
        usedFallback: false,
        error: 'Already playing',
      };
    }

    try {
      setIsLoading(true);
      setUsedFallback(false);
      setFallbackLanguage(null);

      const result = await TTSRouter.play({
        text,
        language,
        audioPath,
      });

      setCurrentProvider(result.provider);
      setUsedFallback(result.usedFallback);
      setFallbackLanguage(result.fallbackLanguage || null);

      if (result.success) {
        setIsPlaying(true);
      }

      return result;
    } catch (error) {
      console.error('[useAudioV2] Play error:', error);
      return {
        success: false,
        provider: 'expo_speech',
        language,
        usedFallback: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    } finally {
      setIsLoading(false);
      // Для системного TTS нет callback о завершении, так что сбрасываем через таймаут
      // TODO: улучшить когда добавим внешние API с точным временем воспроизведения
      setTimeout(() => {
        setIsPlaying(false);
      }, 5000);
    }
  }, [isPlaying, isLoading]);

  /**
   * Остановить воспроизведение
   */
  const stop = useCallback(async (): Promise<void> => {
    try {
      await TTSRouter.stop();
      setIsPlaying(false);
      setIsLoading(false);
      setCurrentProvider(null);
    } catch (error) {
      console.warn('[useAudioV2] Stop error:', error);
    }
  }, []);

  /**
   * Получить информацию о языке
   */
  const getLanguageInfo = useCallback(async (language: string) => {
    const info = await TTSRouter.getLanguageInfo(language);
    return {
      provider: info.provider,
      isAvailable: info.isAvailable,
      needsFallback: info.needsFallback,
    };
  }, []);

  return {
    isPlaying,
    isLoading,
    currentProvider,
    usedFallback,
    fallbackLanguage,
    play,
    stop,
    getLanguageInfo,
  };
}

export default useAudioV2;
