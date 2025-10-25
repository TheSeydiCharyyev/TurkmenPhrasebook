// src/hooks/useAudioMultilingual.ts
// Обновлённая версия useAudio для мультиязычной системы (Phase 2)
// Поддерживает MP3 для туркменского + TTS для всех 30 языков

import { useState, useCallback, useEffect, useRef } from 'react';
import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';
import { getAudioSource } from '../data/audioMapping';
import { getLanguageByCode } from '../config/languages.config';

/**
 * Hook для воспроизведения аудио
 * - Туркменский (tk): MP3 файлы
 * - Все остальные языки: TTS (Text-to-Speech)
 */
export function useAudioMultilingual() {
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
        console.warn('[useAudioMultilingual] Audio initialization failed:', error);
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
   * Воспроизведение аудио
   * @param text - текст для произношения
   * @param languageCode - код языка (tk, zh, ru, en, ja, ko...)
   * @param audioPath - путь к MP3 (только для туркменского)
   */
  const playAudio = useCallback(async (
    text: string,
    languageCode: string,
    audioPath?: string
  ) => {
    // Защита от повторного воспроизведения
    if (isPlaying || isLoading) {
      console.log('[useAudioMultilingual] Already playing or loading, skipping');
      return;
    }

    try {
      setIsLoading(true);

      // Останавливаем предыдущее воспроизведение
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }
      Speech.stop();

      // ========================================
      // ТУРКМЕНСКИЙ - используем MP3
      // ========================================
      if (languageCode === 'tk' && audioPath) {
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
          console.log(`[useAudioMultilingual] Playing MP3 for Turkmen: ${audioPath}`);
          return;
        } else {
          console.warn(`[useAudioMultilingual] Audio source not found for: ${audioPath}`);
        }
      }

      // ========================================
      // ОСТАЛЬНЫЕ ЯЗЫКИ - используем TTS
      // ========================================
      const language = getLanguageByCode(languageCode);
      if (!language) {
        throw new Error(`Language ${languageCode} not found in configuration`);
      }

      setIsPlaying(true);
      setIsLoading(false);

      console.log(`[useAudioMultilingual] Playing TTS for ${language.name} (${language.ttsCode}): "${text.substring(0, 30)}..."`);

      await Speech.speak(text, {
        language: language.ttsCode,
        rate: 0.85,        // Скорость речи
        pitch: 1.0,        // Высота голоса
        onDone: () => {
          setIsPlaying(false);
          console.log('[useAudioMultilingual] TTS playback finished');
        },
        onStopped: () => {
          setIsPlaying(false);
          console.log('[useAudioMultilingual] TTS playback stopped');
        },
        onError: (error) => {
          setIsPlaying(false);
          console.warn(`[useAudioMultilingual] TTS error for ${languageCode}:`, error);
        },
      });

    } catch (error) {
      console.error('[useAudioMultilingual] Playback error:', error);
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
      console.log('[useAudioMultilingual] Audio stopped');
    } catch (error) {
      console.warn('[useAudioMultilingual] Stop error:', error);
    }
  }, []);

  return {
    isPlaying,    // Идёт воспроизведение
    isLoading,    // Загрузка аудио
    playAudio,    // Функция воспроизведения
    stopAudio,    // Функция остановки
  };
}
