// src/components/VoiceSearch.tsx - Voice Search Component for Day 18 - ИСПРАВЛЕНО

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Voice, { 
  SpeechRecognizedEvent, 
  SpeechResultsEvent, 
  SpeechErrorEvent 
} from '@react-native-voice/voice';
import { Colors } from '../constants/Colors';
import { TextStyles } from '../constants/Typography';
import { useAppLanguage } from '../contexts/LanguageContext';
import { useAnimations } from '../hooks/useAnimations';

interface VoiceSearchProps {
  onVoiceResult: (text: string) => void;
  onVoiceStart?: () => void;
  onVoiceEnd?: () => void;
  disabled?: boolean;
  style?: any;
}

export default function VoiceSearch({
  onVoiceResult,
  onVoiceStart,
  onVoiceEnd,
  disabled = false,
  style
}: VoiceSearchProps) {
  const [isListening, setIsListening] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  
  const { config } = useAppLanguage();
  const { scaleAnim, pressAnimation, pulseAnimation } = useAnimations();
  
  // Animation refs for voice recording
  const pulseAnimationRef = useRef(new Animated.Value(1)).current;
  const rippleAnimation = useRef(new Animated.Value(0)).current;

  /**
   * Get localized texts for voice search
   * Senior Developer Teaching: Always provide multilingual support
   */
  const getText = useCallback((key: string) => {
    const texts = {
      tk: {
        tapToSpeak: 'Gürlemek üçin basyň',
        listening: 'Diňleýärin...',
        processing: 'Gaýtadan işleýärin...',
        speak: 'Gürlä',
        stop: 'Duruzyň',
        permission: 'Ses rugsady berilmedik',
        error: 'Ses tanamak sähweligi',
        noSpeech: 'Ses tapylmady',
        tryAgain: 'Täzeden synanyň',
      },
      zh: {
        tapToSpeak: '点击说话',
        listening: '正在听...',
        processing: '处理中...',
        speak: '说话',
        stop: '停止',
        permission: '未授予语音权限',
        error: '语音识别错误',
        noSpeech: '未检测到语音',
        tryAgain: '重试',
      },
      ru: {
        tapToSpeak: 'Нажмите, чтобы говорить',
        listening: 'Слушаю...',
        processing: 'Обрабатываю...',
        speak: 'Говорить',
        stop: 'Остановить',
        permission: 'Нет разрешения на микрофон',
        error: 'Ошибка распознавания речи',
        noSpeech: 'Речь не обнаружена',
        tryAgain: 'Повторить',
      },
      en: {
        tapToSpeak: 'Tap to speak',
        listening: 'Listening...',
        processing: 'Processing...',
        speak: 'Speak',
        stop: 'Stop',
        permission: 'Microphone permission denied',
        error: 'Speech recognition error',
        noSpeech: 'No speech detected',
        tryAgain: 'Try again',
      },
      tr: {
        tapToSpeak: 'Konuşmak için dokunun',
        listening: 'Dinliyorum...',
        processing: 'İşleniyor...',
        speak: 'Konuş',
        stop: 'Dur',
        permission: 'Mikrofon izni reddedildi',
        error: 'Ses tanıma hatası',
        noSpeech: 'Konuşma algılanmadı',
        tryAgain: 'Tekrar dene',
      },
      de: {
        tapToSpeak: 'Tippen Sie zum Sprechen',
        listening: 'Höre zu...',
        processing: 'Verarbeite...',
        speak: 'Sprechen',
        stop: 'Stopp',
        permission: 'Mikrofon-Berechtigung verweigert',
        error: 'Spracherkennungsfehler',
        noSpeech: 'Keine Sprache erkannt',
        tryAgain: 'Erneut versuchen',
      },
      fr: {
        tapToSpeak: 'Appuyez pour parler',
        listening: 'Écoute...',
        processing: 'Traitement...',
        speak: 'Parler',
        stop: 'Arrêter',
        permission: 'Permission du microphone refusée',
        error: 'Erreur de reconnaissance vocale',
        noSpeech: 'Aucune parole détectée',
        tryAgain: 'Réessayer',
      },
      es: {
        tapToSpeak: 'Toca para hablar',
        listening: 'Escuchando...',
        processing: 'Procesando...',
        speak: 'Hablar',
        stop: 'Detener',
        permission: 'Permiso de micrófono denegado',
        error: 'Error de reconocimiento de voz',
        noSpeech: 'No se detectó habla',
        tryAgain: 'Intentar de nuevo',
      },
      it: {
        tapToSpeak: 'Tocca per parlare',
        listening: 'Ascoltando...',
        processing: 'Elaborazione...',
        speak: 'Parla',
        stop: 'Ferma',
        permission: 'Permesso del microfono negato',
        error: 'Errore di riconoscimento vocale',
        noSpeech: 'Nessun parlato rilevato',
        tryAgain: 'Riprova',
      },
      pt: {
        tapToSpeak: 'Toque para falar',
        listening: 'Ouvindo...',
        processing: 'Processando...',
        speak: 'Falar',
        stop: 'Parar',
        permission: 'Permissão do microfone negada',
        error: 'Erro de reconhecimento de voz',
        noSpeech: 'Nenhuma fala detectada',
        tryAgain: 'Tentar novamente',
      },
      nl: {
        tapToSpeak: 'Tik om te spreken',
        listening: 'Luisteren...',
        processing: 'Verwerken...',
        speak: 'Spreken',
        stop: 'Stop',
        permission: 'Microfoon toestemming geweigerd',
        error: 'Spraakherkenningsfout',
        noSpeech: 'Geen spraak gedetecteerd',
        tryAgain: 'Opnieuw proberen',
      },
      pl: {
        tapToSpeak: 'Dotknij, aby mówić',
        listening: 'Słucham...',
        processing: 'Przetwarzanie...',
        speak: 'Mów',
        stop: 'Zatrzymaj',
        permission: 'Odmowa dostępu do mikrofonu',
        error: 'Błąd rozpoznawania mowy',
        noSpeech: 'Nie wykryto mowy',
        tryAgain: 'Spróbuj ponownie',
      },
      uk: {
        tapToSpeak: 'Натисніть, щоб говорити',
        listening: 'Слухаю...',
        processing: 'Обробка...',
        speak: 'Говорити',
        stop: 'Зупинити',
        permission: 'Доступ до мікрофона заборонено',
        error: 'Помилка розпізнавання мови',
        noSpeech: 'Мову не виявлено',
        tryAgain: 'Спробувати знову',
      },
    };

    const lang = config.mode;
    return texts[lang]?.[key as keyof typeof texts['en']] || key;
  }, [config.mode]);

  /**
   * Get language code for speech recognition
   */
  const getLanguageCode = useCallback(() => {
    const codes = {
      tk: 'tr-TR', // Turkmen uses Turkish as closest match
      zh: 'zh-CN',
      ru: 'ru-RU',
      en: 'en-US',
      tr: 'tr-TR',
      de: 'de-DE',
      fr: 'fr-FR',
      es: 'es-ES',
      it: 'it-IT',
      pt: 'pt-PT',
      nl: 'nl-NL',
      pl: 'pl-PL',
      uk: 'uk-UA',
    };
    return codes[config.mode] || 'en-US';
  }, [config.mode]);

  /**
   * Initialize voice recognition
   */
  useEffect(() => {
    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechRecognized = onSpeechRecognized;
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechError = onSpeechError;
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechPartialResults = onSpeechPartialResults;

    // Check initial permissions
    checkPermissions();

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  /**
   * Check microphone permissions
   */
  const checkPermissions = async () => {
    try {
      const isAvailable = await Voice.isAvailable();
      setHasPermission(Boolean(isAvailable)); // Преобразуем 0|1 в boolean
    } catch (error) {
      console.warn('Voice recognition not available:', error);
      setHasPermission(false);
    }
  };

  /**
   * Voice recognition event handlers
   */
  const onSpeechStart = useCallback((e: any) => {
    console.log('Voice recognition started');
    setIsListening(true);
    onVoiceStart?.();
    startPulseAnimation();
  }, [onVoiceStart]);

  const onSpeechRecognized = useCallback((e: SpeechRecognizedEvent) => {
    console.log('Speech recognized:', e);
  }, []);

  const onSpeechEnd = useCallback((e: any) => {
    console.log('Voice recognition ended');
    setIsListening(false);
    onVoiceEnd?.();
    stopPulseAnimation();
  }, [onVoiceEnd]);

  const onSpeechError = useCallback((e: SpeechErrorEvent) => {
    console.log('Voice recognition error:', e);
    setIsListening(false);
    stopPulseAnimation();
    
    // Handle specific error cases
    if (e.error?.message?.includes('permission')) {
      Alert.alert(
        getText('error'),
        getText('permission'),
        [{ text: 'OK' }]
      );
    } else {
      Alert.alert(
        getText('error'),
        getText('tryAgain'),
        [{ text: 'OK' }]
      );
    }
  }, [getText]);

  const onSpeechResults = useCallback((e: SpeechResultsEvent) => {
    console.log('Speech results:', e);
    const bestResult = e.value?.[0];
    if (bestResult) {
      setRecognizedText(bestResult);
      onVoiceResult(bestResult);
    }
  }, [onVoiceResult]);

  const onSpeechPartialResults = useCallback((e: SpeechResultsEvent) => {
    console.log('Partial results:', e);
    const partialResult = e.value?.[0];
    if (partialResult) {
      setRecognizedText(partialResult);
    }
  }, []);

  /**
   * Start voice recognition
   */
  const startListening = async () => {
    if (disabled || !hasPermission) return;

    try {
      setRecognizedText('');
      const languageCode = getLanguageCode();
      
      await Voice.start(languageCode, {
        EXTRA_LANGUAGE_MODEL: 'LANGUAGE_MODEL_FREE_FORM',
        EXTRA_MAX_RESULTS: 5,
        EXTRA_PARTIAL_RESULTS: true,
      });
    } catch (error) {
      console.error('Failed to start voice recognition:', error);
      Alert.alert(
        getText('error'),
        getText('tryAgain'),
        [{ text: 'OK' }]
      );
    }
  };

  /**
   * Stop voice recognition
   */
  const stopListening = async () => {
    try {
      await Voice.stop();
    } catch (error) {
      console.error('Failed to stop voice recognition:', error);
    }
  };

  /**
   * Animation controls
   */
  const startPulseAnimation = () => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnimationRef, {
          toValue: 1.3,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnimationRef, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );

    const ripple = Animated.loop(
      Animated.timing(rippleAnimation, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    );

    pulse.start();
    ripple.start();
  };

  const stopPulseAnimation = () => {
    pulseAnimationRef.stopAnimation();
    rippleAnimation.stopAnimation();
    
    Animated.parallel([
      Animated.timing(pulseAnimationRef, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(rippleAnimation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  /**
   * Handle microphone button press
   */
  const handleMicPress = useCallback(async () => {
    if (!hasPermission) {
      Alert.alert(
        getText('error'),
        getText('permission'),
        [{ text: 'OK' }]
      );
      return;
    }

    if (isListening) {
      await stopListening();
    } else {
      await startListening();
    }
  }, [hasPermission, isListening, startListening, stopListening, getText]);

  // Don't render if no permission or platform doesn't support voice
  if (hasPermission === false) {
    return null;
  }

  return (
    <View style={[styles.container, style]}>
      {/* Ripple effect background */}
      {isListening && (
        <Animated.View
          style={[
            styles.rippleBackground,
            {
              opacity: rippleAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.3],
              }),
              transform: [
                {
                  scale: rippleAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 3],
                  }),
                },
              ],
            },
          ]}
        />
      )}

      {/* Main microphone button */}
      <Animated.View
        style={[
          styles.microphoneContainer,
          {
            transform: [{ scale: pulseAnimationRef }],
          },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.microphoneButton,
            isListening && styles.microphoneButtonActive,
            disabled && styles.microphoneButtonDisabled,
          ]}
          onPress={handleMicPress}
          disabled={disabled}
          activeOpacity={0.8}
        >
          <Ionicons
            name={isListening ? 'mic' : 'mic-outline'}
            size={24}
            color={isListening ? Colors.background : Colors.primary}
          />
        </TouchableOpacity>
      </Animated.View>

      {/* Status text */}
      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>
          {isListening 
            ? getText('listening')
            : recognizedText 
            ? getText('processing')
            : getText('tapToSpeak')
          }
        </Text>

        {/* Show recognized text while listening */}
        {recognizedText && (
          <Text style={styles.recognizedText} numberOfLines={2}>
            "{recognizedText}"
          </Text>
        )}
      </View>

      {/* Language indicator */}
      <View style={styles.languageIndicator}>
        <Ionicons name="language" size={12} color={Colors.textLight} />
        <Text style={styles.languageText}>
          {config.mode.toUpperCase()}
        </Text>
      </View>
    </View>
  );
}

/**
 * Compact Voice Search Button Component
 * For use in navigation bars or tight spaces
 */
export function VoiceSearchButton({
  onVoiceResult,
  disabled = false,
  size = 'medium',
  style
}: {
  onVoiceResult: (text: string) => void;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
  style?: any;
}) {
  const [isListening, setIsListening] = useState(false);
  const { scaleAnim, pressAnimation } = useAnimations();

  const sizeConfig = {
    small: { buttonSize: 32, iconSize: 16 },
    medium: { buttonSize: 40, iconSize: 20 },
    large: { buttonSize: 48, iconSize: 24 },
  };

  const { buttonSize, iconSize } = sizeConfig[size];

  const handlePress = useCallback(async () => {
    if (disabled) return;

    pressAnimation();
    
    try {
      if (isListening) {
        await Voice.stop();
      } else {
        setIsListening(true);
        await Voice.start('en-US'); // Default to English for compact version
      }
    } catch (error) {
      console.error('Voice search error:', error);
      setIsListening(false);
    }
  }, [disabled, isListening, pressAnimation]);

  useEffect(() => {
    Voice.onSpeechStart = () => setIsListening(true);
    Voice.onSpeechEnd = () => setIsListening(false);
    Voice.onSpeechResults = (e: SpeechResultsEvent) => {
      const result = e.value?.[0];
      if (result) {
        onVoiceResult(result);
        setIsListening(false);
      }
    };

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, [onVoiceResult]);

  return (
    <Animated.View style={[{ transform: [{ scale: scaleAnim }] }, style]}>
      <TouchableOpacity
        style={[
          styles.compactButton,
          { width: buttonSize, height: buttonSize },
          isListening && styles.compactButtonActive,
          disabled && styles.compactButtonDisabled,
        ]}
        onPress={handlePress}
        disabled={disabled}
        activeOpacity={0.7}
      >
        <Ionicons
          name={isListening ? 'mic' : 'mic-outline'}
          size={iconSize}
          color={isListening ? Colors.background : Colors.primary}
        />
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  rippleBackground: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.primary,
  },
  microphoneContainer: {
    marginBottom: 12,
  },
  microphoneButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.background,
    borderWidth: 2,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  microphoneButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
    elevation: 6,
    shadowOpacity: 0.3,
  },
  microphoneButtonDisabled: {
    backgroundColor: Colors.backgroundLight,
    borderColor: Colors.textLight,
    opacity: 0.5,
  },
  statusContainer: {
    alignItems: 'center',
    minHeight: 40,
  },
  statusText: {
    fontSize: TextStyles.body.fontSize,
    color: Colors.textLight,
    textAlign: 'center',
    marginBottom: 4,
  },
  recognizedText: {
    fontSize: TextStyles.bodySmall.fontSize,
    color: Colors.primary,
    textAlign: 'center',
    fontStyle: 'italic',
    maxWidth: 200,
  },
  languageIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: Colors.backgroundLight,
    borderRadius: 12,
  },
  languageText: {
    fontSize: TextStyles.bodySmall.fontSize,
    color: Colors.textLight,
    marginLeft: 4,
    fontWeight: 'bold',
  },
  
  // Compact button styles
  compactButton: {
    borderRadius: 20,
    backgroundColor: Colors.background,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
  },
  compactButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
    elevation: 4,
    shadowOpacity: 0.25,
  },
  compactButtonDisabled: {
    backgroundColor: Colors.backgroundLight,
    borderColor: Colors.textLight,
    opacity: 0.5,
  },
});