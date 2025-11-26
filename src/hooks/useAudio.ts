// src/hooks/useAudio.ts
// ✅ ГИБРИДНАЯ СИСТЕМА: MP3 (туркменский) + TTS (китайский, русский)

import { useState, useCallback, useEffect, useRef } from 'react';
import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';
import { Alert, Linking, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAudioSource } from '../data/audioMapping';

export function useAudio() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<string | null>(null); // Текущий используемый язык (для badge)
  const soundRef = useRef<Audio.Sound | null>(null);

  /**
   * Проверка доступности голоса для языка
   */
  const checkVoiceAvailability = useCallback(async (languageCode: string): Promise<boolean> => {
    try {
      const voices = await Speech.getAvailableVoicesAsync();
      const languagePrefix = languageCode.split('-')[0]; // 'tr-TR' -> 'tr'

      // Проверяем есть ли голос для этого языка
      const hasVoice = voices.some(voice =>
        voice.language.toLowerCase().startsWith(languagePrefix.toLowerCase())
      );

      return hasVoice;
    } catch (error) {
      console.warn('[useAudio] Voice check error:', error);
      return false; // В случае ошибки считаем что голоса нет
    }
  }, []);

  /**
   * Получить fallback язык если основной недоступен
   */
  const getFallbackLanguage = useCallback((languageCode: string): string => {
    // Все языки используют английский как fallback
    // В будущем можно добавить "умные" fallback'и для тюркских языков
    return 'en-US';
  }, []);

  /**
   * Открыть настройки TTS для установки языка
   */
  const openTTSSettings = useCallback(() => {
    if (Platform.OS === 'android') {
      // Android: Открываем настройки TTS
      Linking.openSettings();
    } else if (Platform.OS === 'ios') {
      // iOS: Открываем настройки Accessibility > Spoken Content
      Linking.openURL('app-settings:');
    }
  }, []);

  /**
   * Открыть Google Play для установки Google TTS
   */
  const openGoogleTTS = useCallback(() => {
    if (Platform.OS === 'android') {
      // Открываем Google TTS в Play Store
      Linking.openURL('market://details?id=com.google.android.tts')
        .catch(() => {
          // Fallback на веб версию Play Store
          Linking.openURL('https://play.google.com/store/apps/details?id=com.google.android.tts');
        });
    }
  }, []);

  /**
   * Показать Alert об отсутствии TTS для языка
   */
  const showTTSMissingAlert = useCallback((languageName: string, fallbackLanguage: string) => {
    const title = `⚠️ ${languageName} голос не найден`;

    const message = Platform.OS === 'android'
      ? `Для качественного произношения установите Google Text-to-Speech с поддержкой языка "${languageName}".\n\nСейчас используется: ${fallbackLanguage} (fallback)`
      : `Голос для языка "${languageName}" не найден на вашем устройстве.\n\nСейчас используется: ${fallbackLanguage} (fallback)\n\nУстановите голос в настройках iOS.`;

    const buttons = Platform.OS === 'android'
      ? [
          { text: 'ОК', style: 'cancel' as const },
          {
            text: '⚙️ Настройки',
            onPress: openTTSSettings
          },
          {
            text: '📥 Установить TTS',
            onPress: openGoogleTTS
          }
        ]
      : [
          { text: 'ОК', style: 'cancel' as const },
          {
            text: '⚙️ Открыть настройки',
            onPress: openTTSSettings
          }
        ];

    Alert.alert(title, message, buttons);
  }, [openTTSSettings, openGoogleTTS]);

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
   * Получить человекочитаемое название языка для TTS ошибок
   */
  const getLanguageName = (language: string): string => {
    const languageNames: { [key: string]: string } = {
      'turkmen': 'Туркменский',
      'chinese': 'Китайский',
      'russian': 'Русский',
      'english': 'Английский',
      'japanese': 'Японский',
      'korean': 'Корейский',
      'thai': 'Тайский',
      'vietnamese': 'Вьетнамский',
      'indonesian': 'Индонезийский',
      'malay': 'Малайский',
      'hindi': 'Хинди',
      'urdu': 'Урду',
      'persian': 'Персидский',
      'pashto': 'Пушту',
      'german': 'Немецкий',
      'french': 'Французский',
      'spanish': 'Испанский',
      'italian': 'Итальянский',
      'turkish': 'Турецкий',
      'polish': 'Польский',
      'ukrainian': 'Украинский',
      'portuguese': 'Португальский',
      'dutch': 'Голландский',
      'uzbek': 'Узбекский',
      'kazakh': 'Казахский',
      'azerbaijani': 'Азербайджанский',
      'kyrgyz': 'Киргизский',
      'tajik': 'Таджикский',
      'armenian': 'Армянский',
      'georgian': 'Грузинский',
      'arabic': 'Арабский',
    };

    return languageNames[language] || language;
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

      // ✅ ВСЕ ОСТАЛЬНЫЕ ЯЗЫКИ - используем TTS
      const requestedLanguageCode = getLanguageCode(language);
      let actualLanguageCode = requestedLanguageCode;

      // 🔍 ПРОВЕРКА ДОСТУПНОСТИ ГОЛОСА
      const isVoiceAvailable = await checkVoiceAvailability(requestedLanguageCode);

      if (!isVoiceAvailable) {
        // Голос недоступен → используем fallback
        actualLanguageCode = getFallbackLanguage(requestedLanguageCode);

        // Показать Alert только первый раз для этого языка
        const alertKey = `tts_alert_shown_${language}`;
        const alertShown = await AsyncStorage.getItem(alertKey);

        if (!alertShown) {
          const languageName = getLanguageName(language);
          const fallbackName = 'Английский'; // getFallbackLanguage всегда возвращает en-US
          showTTSMissingAlert(languageName, fallbackName);

          // Кэшируем что Alert был показан
          await AsyncStorage.setItem(alertKey, 'true');
        }
      }

      setIsPlaying(true);
      setIsLoading(false);
      setCurrentLanguage(actualLanguageCode);

      await Speech.speak(text, {
        language: actualLanguageCode,
        rate: 0.85,        // Скорость речи
        pitch: 1.0,        // Высота голоса
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

      return actualLanguageCode;

    } catch (error) {
      console.error('[useAudio] Playback error:', error);
      setIsPlaying(false);
      setIsLoading(false);
      return language;
    }
  }, [isPlaying, isLoading, checkVoiceAvailability, getFallbackLanguage, showTTSMissingAlert]);

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