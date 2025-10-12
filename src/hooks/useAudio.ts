// src/hooks/useAudio.ts
// ✅ ОБНОВЛЕНО: Offline audio playback через expo-av (БЕЗ Expo Speech)

import { useState, useCallback, useEffect, useRef } from 'react';
import { Audio } from 'expo-av';
import { useErrorHandler } from './useErrorHandler';

// ✅ ИСПРАВЛЕНО: Статический маппинг аудио файлов
const AUDIO_FILES: Record<string, any> = {
  // Категория Greetings - Китайский
  '1. Greetings/chinese/phrase_001.mp3': require('../../assets/audio/1. Greetings/chinese/phrase_001.mp3'),
  '1. Greetings/chinese/phrase_002.mp3': require('../../assets/audio/1. Greetings/chinese/phrase_002.mp3'),
  '1. Greetings/chinese/phrase_003.mp3': require('../../assets/audio/1. Greetings/chinese/phrase_003.mp3'),
  '1. Greetings/chinese/phrase_004.mp3': require('../../assets/audio/1. Greetings/chinese/phrase_004.mp3'),
  '1. Greetings/chinese/phrase_005.mp3': require('../../assets/audio/1. Greetings/chinese/phrase_005.mp3'),
  
  // Категория Greetings - Туркменский
  '1. Greetings/turkmen/phrase_001.mp3': require('../../assets/audio/1. Greetings/turkmen/phrase_001.mp3'),
  '1. Greetings/turkmen/phrase_002.mp3': require('../../assets/audio/1. Greetings/turkmen/phrase_002.mp3'),
  '1. Greetings/turkmen/phrase_003.mp3': require('../../assets/audio/1. Greetings/turkmen/phrase_003.mp3'),
  '1. Greetings/turkmen/phrase_004.mp3': require('../../assets/audio/1. Greetings/turkmen/phrase_004.mp3'),
  '1. Greetings/turkmen/phrase_005.mp3': require('../../assets/audio/1. Greetings/turkmen/phrase_005.mp3'),
  '1. Greetings/turkmen/phrase_006.mp3': require('../../assets/audio/1. Greetings/turkmen/phrase_006.mp3'),
  
  // ℹ️ ДОБАВЛЯЙ СЮДА НОВЫЕ АУДИО ФАЙЛЫ ПО МЕРЕ ДОБАВЛЕНИЯ
};

/**
 * Получить источник аудио по пути
 */
function getAudioSource(audioPath: string): any {
  return AUDIO_FILES[audioPath] || null;
}

export function useAudio() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const soundRef = useRef<Audio.Sound | null>(null);
  const { handleError, showErrorAlert } = useErrorHandler();

  // Инициализация аудио режима при монтировании
  useEffect(() => {
    const initAudio = async () => {
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          playsInSilentModeIOS: true,
          staysActiveInBackground: false,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false,
        });
      } catch (error) {
        console.warn('Audio initialization failed:', error);
      }
    };

    initAudio();
  }, []);

  // Очистка при размонтировании
  useEffect(() => {
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync().catch(console.warn);
      }
    };
  }, []);

  /**
   * Воспроизведение MP3 файла
   * @param audioPath - путь к аудио файлу, например: '1. Greetings/chinese/phrase_001.mp3'
   * @param language - язык для отображения (опционально, для совместимости)
   */
  const playAudio = useCallback(async (audioPath: string, language?: 'chinese' | 'turkmen') => {
    if (isPlaying || isLoading) return;

    try {
      setIsLoading(true);

      // Останавливаем и выгружаем предыдущее аудио
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }

      // ✅ ИСПРАВЛЕНО: Используем маппинг аудио файлов
      const audioSource = getAudioSource(audioPath);
      
      if (!audioSource) {
        throw new Error(`Audio file not found: ${audioPath}`);
      }

      // Создаём новый Sound объект
      const { sound } = await Audio.Sound.createAsync(
        audioSource,
        {
          shouldPlay: true,
          volume: 1.0,
          rate: 1.0,
        },
        onPlaybackStatusUpdate
      );

      soundRef.current = sound;
      setIsPlaying(true);
      setIsLoading(false);

    } catch (error) {
      setIsPlaying(false);
      setIsLoading(false);
      handleError(error, 'Audio playback');
      
      console.error('Audio playback error:', error);
      showErrorAlert(
        'Ошибка воспроизведения',
        'Не удалось воспроизвести аудио файл. Убедитесь, что файл существует.'
      );
    }
  }, [isPlaying, isLoading, handleError, showErrorAlert]);

  /**
   * Callback для обновления статуса воспроизведения
   */
  const onPlaybackStatusUpdate = useCallback((status: any) => {
    if (status.isLoaded) {
      if (status.didJustFinish) {
        setIsPlaying(false);
        setIsLoading(false);
      }
      if (status.error) {
        console.error('Playback error:', status.error);
        setIsPlaying(false);
        setIsLoading(false);
      }
    }
  }, []);

  /**
   * Остановка воспроизведения
   */
  const stopAudio = useCallback(async () => {
    try {
      if (soundRef.current) {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }
      setIsPlaying(false);
      setIsLoading(false);
    } catch (error) {
      handleError(error, 'Audio stop');
      setIsPlaying(false);
      setIsLoading(false);
    }
  }, [handleError]);

  /**
   * LEGACY: Поддержка старого API для совместимости
   * Будет удалено после полного перехода на новую систему
   */
  const playText = useCallback(async (text: string, language: 'chinese' | 'turkmen') => {
    console.warn('playText is deprecated. Use playAudio instead.');
    // Временная заглушка - ничего не делаем
  }, []);

  return {
    isPlaying,
    isLoading,
    playAudio,      // ✅ Новый метод для MP3
    stopAudio,
    playText,       // ⚠️ Legacy (deprecated)
  };
}