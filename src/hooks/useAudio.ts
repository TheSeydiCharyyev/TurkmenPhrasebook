import { useState, useCallback, useEffect } from 'react';
import * as Speech from 'expo-speech';
import { useErrorHandler } from './useErrorHandler';

export function useAudio() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { handleError, showErrorAlert } = useErrorHandler();

  const playText = useCallback(async (text: string, language: 'chinese' | 'turkmen') => {
    if (isPlaying || isLoading) return;

    try {
      setIsLoading(true);
      
      // Проверяем доступность TTS
      const voices = await Speech.getAvailableVoicesAsync();
      if (voices.length === 0) {
        throw new Error('TTS не поддерживается на этом устройстве');
      }

      // Останавливаем предыдущее воспроизведение
      await Speech.stop();
      
      setIsPlaying(true);
      
      const speechLanguage = language === 'chinese' ? 'zh-CN' : 'tr-TR';
      
      const options = {
        language: speechLanguage,
        pitch: 1.0,
        rate: 0.75,
        quality: Speech.VoiceQuality.Enhanced,
        onDone: () => {
          setIsPlaying(false);
          setIsLoading(false);
        },
        onStopped: () => {
          setIsPlaying(false);
          setIsLoading(false);
        },
        onError: (error: any) => {
          setIsPlaying(false);
          setIsLoading(false);
          handleError(error, 'TTS playback');
          showErrorAlert('Ошибка воспроизведения', 'Не удалось воспроизвести аудио');
        }
      };

      await Speech.speak(text, options);
      
    } catch (error) {
      setIsPlaying(false);
      setIsLoading(false);
      handleError(error, 'TTS initialization');
      
      // Показываем пользователю понятное сообщение об ошибке
      if (error instanceof Error) {
        if (error.message.includes('не поддерживается')) {
          showErrorAlert('TTS недоступен', 'Функция озвучивания недоступна на вашем устройстве');
        } else {
          showErrorAlert('Ошибка озвучивания', 'Не удалось воспроизвести текст. Попробуйте позже.');
        }
      }
    }
  }, [isPlaying, isLoading, handleError, showErrorAlert]);

  const stopAudio = useCallback(async () => {
    try {
      await Speech.stop();
      setIsPlaying(false);
      setIsLoading(false);
    } catch (error) {
      handleError(error, 'TTS stop');
      // Не показываем alert для ошибок остановки - это некритично
      setIsPlaying(false);
      setIsLoading(false);
    }
  }, [handleError]);

  useEffect(() => {
    return () => {
      Speech.stop();
    };
  }, []);

  const getAvailableVoices = useCallback(async () => {
    try {
      setIsLoading(true);
      const voices = await Speech.getAvailableVoicesAsync();
      return voices;
    } catch (error) {
      handleError(error, 'TTS voices');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  const isTTSAvailable = useCallback(async () => {
    try {
      const voices = await Speech.getAvailableVoicesAsync();
      return voices.length > 0;
    } catch (error) {
      handleError(error, 'TTS availability check');
      return false;
    }
  }, [handleError]);

  return {
    isPlaying,
    isLoading,
    playText,
    stopAudio,
    getAvailableVoices,
    isTTSAvailable,
  };
}