// src/hooks/useAudio.ts
// ✅ ГИБРИДНАЯ СИСТЕМА: MP3 (туркменский) + TTS (поддерживаемые языки)

import { useState, useCallback, useEffect, useRef } from 'react';
import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';
import { Alert } from 'react-native';
import { getAudioSource } from '../data/audioMapping';

/**
 * Языки без поддержки TTS (будут добавлены в v2.1)
 * Для этих языков показываем Alert вместо воспроизведения
 */
const UNSUPPORTED_TTS_LANGUAGES = [
  'uzbek',
  'kazakh',
  'kyrgyz',
  'tajik',
  'azerbaijani',
  'pashto',
  'armenian',
  'georgian',
  'persian',
  'urdu',
];

export function useAudio() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<string | null>(null);
  const soundRef = useRef<Audio.Sound | null>(null);

  /**
   * Проверить поддерживается ли язык TTS
   */
  const isLanguageSupported = useCallback((language: string): boolean => {
    return !UNSUPPORTED_TTS_LANGUAGES.includes(language);
  }, []);

  /**
   * Показать Alert что TTS недоступен для языка
   */
  const showUnsupportedAlert = useCallback((language: string) => {
    const languageNames: { [key: string]: string } = {
      'uzbek': 'Uzbek',
      'kazakh': 'Kazakh',
      'kyrgyz': 'Kyrgyz',
      'tajik': 'Tajik',
      'azerbaijani': 'Azerbaijani',
      'pashto': 'Pashto',
      'armenian': 'Armenian',
      'georgian': 'Georgian',
      'persian': 'Persian',
      'urdu': 'Urdu',
    };

    const langName = languageNames[language] || language;

    Alert.alert(
      '🔊 TTS Not Available',
      `Text-to-speech for ${langName} is not yet available. Coming in version 2.1!`,
      [{ text: 'OK', style: 'default' }]
    );
  }, []);

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
   * Маппинг языковых кодов на TTS коды
   */
  const getLanguageCode = (language: string): string => {
    const languageMap: { [key: string]: string } = {
      // Основные языки
      'turkmen': 'en-US',  // MP3 только, но fallback на английский
      'chinese': 'zh-CN',
      'russian': 'ru-RU',
      'english': 'en-US',

      // Азиатские языки
      'japanese': 'ja-JP',
      'korean': 'ko-KR',
      'thai': 'th-TH',
      'vietnamese': 'vi-VN',
      'indonesian': 'id-ID',
      'malay': 'ms-MY',
      'hindi': 'hi-IN',
      'urdu': 'ur-PK',
      'persian': 'fa-IR',
      'pashto': 'ps-AF',

      // Европейские языки
      'german': 'de-DE',
      'french': 'fr-FR',
      'spanish': 'es-ES',
      'italian': 'it-IT',
      'turkish': 'tr-TR',
      'polish': 'pl-PL',
      'ukrainian': 'uk-UA',
      'portuguese': 'pt-PT',
      'dutch': 'nl-NL',

      // Центральноазиатские
      'uzbek': 'uz-UZ',
      'kazakh': 'kk-KZ',
      'azerbaijani': 'az-AZ',
      'kyrgyz': 'ky-KG',
      'tajik': 'tg-TJ',

      // Кавказские
      'armenian': 'hy-AM',
      'georgian': 'ka-GE',

      // Другие
      'arabic': 'ar-SA',
    };

    return languageMap[language] || 'en-US';
  };

  /**
   * Воспроизведение аудио (гибрид MP3 + TTS)
   * @param text - текст для произношения
   * @param language - любой язык (строка)
   * @param audioPath - путь к MP3 (только для туркменского!)
   * @returns используемый код языка (для badge)
   */
  const playAudio = useCallback(async (text: string, language: string, audioPath?: string): Promise<string> => {
    if (isPlaying || isLoading) return language;

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
          setCurrentLanguage('turkmen');
          return 'turkmen';
        }
      }

      // ❌ ПРОВЕРКА: язык не поддерживается TTS
      if (!isLanguageSupported(language)) {
        setIsLoading(false);
        showUnsupportedAlert(language);
        return language;
      }

      // ✅ ПОДДЕРЖИВАЕМЫЕ ЯЗЫКИ - используем TTS
      const languageCode = getLanguageCode(language);

      setIsPlaying(true);
      setIsLoading(false);
      setCurrentLanguage(languageCode);

      await Speech.speak(text, {
        language: languageCode,
        rate: 0.85,
        pitch: 1.0,
        onDone: () => {
          setIsPlaying(false);
        },
        onStopped: () => {
          setIsPlaying(false);
        },
        onError: (error) => {
          setIsPlaying(false);
          console.warn(`TTS error for ${language}:`, error);
        },
      });

      return languageCode;

    } catch (error) {
      console.error('[useAudio] Playback error:', error);
      setIsPlaying(false);
      setIsLoading(false);
      return language;
    }
  }, [isPlaying, isLoading, isLanguageSupported, showUnsupportedAlert]);

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
    currentLanguage, // Для показа badge с используемым языком
  };
}