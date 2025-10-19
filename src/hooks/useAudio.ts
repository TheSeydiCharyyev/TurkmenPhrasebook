// src/hooks/useAudio.ts
// ✅ ГИБРИДНАЯ СИСТЕМА: MP3 (туркменский) + TTS (китайский, русский)

import { useState, useCallback, useEffect, useRef } from 'react';
import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';
import { getAudioSource } from '../data/audioMapping';

export function useAudio() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const soundRef = useRef<Audio.Sound | null>(null);

  // Инициализация аудио режима
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
      Speech.stop();
    };
  }, []);

  /**
   * Воспроизведение аудио (гибрид MP3 + TTS)
   * @param text - текст для произношения
   * @param language - 'chinese' | 'turkmen' | 'russian'
   * @param audioPath - путь к MP3 (только для туркменского!)
   */
  const playAudio = useCallback(async (text: string, language: 'chinese' | 'turkmen' | 'russian', audioPath?: string) => {
    if (isPlaying || isLoading) return;

    try {
      setIsLoading(true);

      // Останавливаем предыдущее воспроизведение
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }
      Speech.stop();

      // ✅ ТУРКМЕНСКИЙ - используем MP3
      if (language === 'turkmen' && audioPath) {
        const audioSource = getAudioSource(audioPath);
        
        if (audioSource) {
          const { sound } = await Audio.Sound.createAsync(
            audioSource,
            { shouldPlay: true, volume: 1.0, rate: 1.0 }
          );

          soundRef.current = sound;

          // Callback на завершение
          sound.setOnPlaybackStatusUpdate((status: any) => {
            if (status.isLoaded && status.didJustFinish) {
              setIsPlaying(false);
              setIsLoading(false);
            }
          });

          setIsPlaying(true);
          setIsLoading(false);
          return;
        }
      }

      // ✅ КИТАЙСКИЙ и РУССКИЙ - используем TTS
      const languageCode = language === 'chinese' ? 'zh-CN' : 'ru-RU';
      
      setIsPlaying(true);
      setIsLoading(false);

      await Speech.speak(text, {
        language: languageCode,
        rate: 0.85,        // Скорость речи
        pitch: 1.0,        // Высота голоса
        onDone: () => {
          setIsPlaying(false);
        },
        onStopped: () => {
          setIsPlaying(false);
        },
        onError: () => {
          setIsPlaying(false);
          console.warn(`TTS error for ${language}`);
        },
      });

    } catch (error) {
      console.error('[useAudio] Playback error:', error);
      setIsPlaying(false);
      setIsLoading(false);
    }
  }, [isPlaying, isLoading]);

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
      Speech.stop();
      setIsPlaying(false);
      setIsLoading(false);
    } catch (error) {
      console.warn('[useAudio] Stop error:', error);
    }
  }, []);

  return {
    isPlaying,
    isLoading,
    playAudio,
    stopAudio,
  };
}