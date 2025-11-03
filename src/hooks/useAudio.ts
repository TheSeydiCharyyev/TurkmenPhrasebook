// src/hooks/useAudio.ts
// ✅ ГИБРИДНАЯ СИСТЕМА: MP3 (туркменский) + TTS (китайский, русский)

import { useState, useCallback, useEffect, useRef } from 'react';
import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';
import { Alert, Linking, Platform } from 'react-native';
import { getAudioSource } from '../data/audioMapping';

export function useAudio() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const soundRef = useRef<Audio.Sound | null>(null);

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
   * Показать Alert об отсутствии TTS для языка
   */
  const showTTSMissingAlert = useCallback((languageName: string) => {
    const title = '🔊 Голос не найден';
    const message = Platform.OS === 'android'
      ? `Голос для языка "${languageName}" не установлен на вашем устройстве.\n\nДля установки:\n1. Откройте Настройки\n2. Найдите "Преобразование текста в речь" (TTS)\n3. Загрузите голос для ${languageName}`
      : `Голос для языка "${languageName}" не найден.\n\nДля установки:\n1. Откройте Настройки\n2. Перейдите в Универсальный доступ > Озвучивание содержимого\n3. Выберите голоса для ${languageName}`;

    Alert.alert(
      title,
      message,
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Открыть настройки',
          onPress: openTTSSettings
        }
      ]
    );
  }, [openTTSSettings]);

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
   */
  const playAudio = useCallback(async (text: string, language: string, audioPath?: string) => {
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

      // ✅ ВСЕ ОСТАЛЬНЫЕ ЯЗЫКИ - используем TTS
      const languageCode = getLanguageCode(language);

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
        onError: (error) => {
          setIsPlaying(false);
          console.warn(`TTS error for ${language}:`, error);

          // ✅ Показываем Alert для установки голоса TTS
          const languageName = getLanguageName(language);
          showTTSMissingAlert(languageName);
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