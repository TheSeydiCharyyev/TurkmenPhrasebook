// src/features/voice-translator/screens/VoiceTranslatorScreen.tsx

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Animated,
  Clipboard,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Voice from '@react-native-voice/voice';
import { useAppLanguage } from '../../../contexts/LanguageContext';
import { VoiceTranslatorService } from '../services/VoiceTranslatorService';
import { translateText } from '../../visual-translator/services/TranslationService';
import { Colors } from '../../../constants/Colors';
import { scale, verticalScale, moderateScale } from '../../../utils/ResponsiveUtils';

type TranslatorState = 'idle' | 'listening' | 'processing' | 'completed' | 'error';

export default function VoiceTranslatorScreen() {
  const { getTexts, config } = useAppLanguage();
  const texts = getTexts();

  // State
  const [state, setState] = useState<TranslatorState>('idle');
  const [sourceLang, setSourceLang] = useState('ru');
  const [targetLang, setTargetLang] = useState('en');
  const [recognizedText, setRecognizedText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isPlayingOriginal, setIsPlayingOriginal] = useState(false);
  const [isPlayingTranslation, setIsPlayingTranslation] = useState(false);

  // Animations
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const waveAnim1 = useRef(new Animated.Value(0)).current;
  const waveAnim2 = useRef(new Animated.Value(0)).current;
  const waveAnim3 = useRef(new Animated.Value(0)).current;

  // Initialize Voice service
  useEffect(() => {
    VoiceTranslatorService.initialize();

    // Setup Voice callbacks
    Voice.onSpeechStart = () => {
      console.log('Speech started');
    };

    Voice.onSpeechEnd = () => {
      console.log('Speech ended');
      setState('processing');
    };

    Voice.onSpeechResults = async (e: any) => {
      console.log('Speech results:', e.value);
      if (e.value && e.value.length > 0) {
        const text = e.value[0];
        setRecognizedText(text);

        // Translate the text
        await handleTranslate(text);
      }
    };

    Voice.onSpeechError = (e: any) => {
      console.error('Speech error:', e);
      setState('error');
      setErrorMessage(texts.vtErrorRecognitionFailed);
    };

    return () => {
      VoiceTranslatorService.cleanup();
    };
  }, []);

  // Pulse animation for microphone button
  useEffect(() => {
    if (state === 'listening') {
      // Start pulsing animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Start wave animations
      [waveAnim1, waveAnim2, waveAnim3].forEach((anim, index) => {
        Animated.loop(
          Animated.sequence([
            Animated.delay(index * 400),
            Animated.timing(anim, {
              toValue: 1,
              duration: 1200,
              useNativeDriver: true,
            }),
            Animated.timing(anim, {
              toValue: 0,
              duration: 0,
              useNativeDriver: true,
            }),
          ])
        ).start();
      });
    } else {
      // Reset animations
      pulseAnim.setValue(1);
      waveAnim1.setValue(0);
      waveAnim2.setValue(0);
      waveAnim3.setValue(0);
    }
  }, [state]);

  // Handle microphone button press
  const handleMicPress = useCallback(async () => {
    if (state === 'listening') {
      // Stop listening
      await VoiceTranslatorService.stopRecording();
      setState('processing');
    } else {
      // Check permissions
      const hasPermission = await VoiceTranslatorService.checkPermissions();
      if (!hasPermission) {
        Alert.alert(texts.vtPermissionTitle, texts.vtPermissionMessage, [
          { text: texts.cancel, style: 'cancel' },
          {
            text: texts.vtGrantPermission,
            onPress: () => {
              // Open settings (platform specific)
              if (Platform.OS === 'ios') {
                Alert.alert(texts.vtPermissionTitle, texts.vtErrorNoPermission);
              } else {
                Alert.alert(texts.vtPermissionTitle, texts.vtErrorNoPermission);
              }
            },
          },
        ]);
        return;
      }

      // Clear previous results
      setRecognizedText('');
      setTranslatedText('');
      setErrorMessage('');

      // Start listening
      setState('listening');
      const voiceLangCode = VoiceTranslatorService.getVoiceLanguageCode(sourceLang);
      await VoiceTranslatorService.startRecording(voiceLangCode);
    }
  }, [state, sourceLang, texts]);

  // Translate text
  const handleTranslate = async (text: string) => {
    try {
      setState('processing');
      const translation = await translateText(text, sourceLang, targetLang);
      setTranslatedText(translation);
      setState('completed');
    } catch (error) {
      console.error('Translation error:', error);
      setState('error');
      setErrorMessage(texts.vtErrorTranslationFailed);
    }
  };

  // Play original text
  const handlePlayOriginal = async () => {
    if (!recognizedText) return;

    setIsPlayingOriginal(true);
    const voiceLangCode = VoiceTranslatorService.getVoiceLanguageCode(sourceLang);
    await VoiceTranslatorService.playText(recognizedText, voiceLangCode);
    setIsPlayingOriginal(false);
  };

  // Play translated text
  const handlePlayTranslation = async () => {
    if (!translatedText) return;

    setIsPlayingTranslation(true);
    const voiceLangCode = VoiceTranslatorService.getVoiceLanguageCode(targetLang);
    await VoiceTranslatorService.playText(translatedText, voiceLangCode);
    setIsPlayingTranslation(false);
  };

  // Copy translation to clipboard
  const handleCopy = () => {
    Clipboard.setString(translatedText);
    Alert.alert('✅', texts.vtCopyTranslation);
  };

  // Clear all
  const handleClear = () => {
    setRecognizedText('');
    setTranslatedText('');
    setErrorMessage('');
    setState('idle');
  };

  // Swap languages
  const handleSwapLanguages = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setRecognizedText('');
    setTranslatedText('');
    setState('idle');
  };

  // Get mic button color based on state
  const getMicButtonColor = () => {
    switch (state) {
      case 'listening':
        return ['#EF4444', '#DC2626']; // Red
      case 'processing':
        return ['#FF6B35', '#F7931E']; // Orange
      default:
        return ['#3B82F6', '#2563EB']; // Blue
    }
  };

  // Get status text
  const getStatusText = () => {
    switch (state) {
      case 'idle':
        return texts.vtTapToSpeak;
      case 'listening':
        return texts.vtListening;
      case 'processing':
        return texts.vtProcessing;
      case 'completed':
        return texts.vtTranslation;
      case 'error':
        return errorMessage;
      default:
        return '';
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Gradient Header */}
        <LinearGradient
          colors={['#FF6B35', '#F7931E']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <Text style={styles.headerEmoji}>🎤</Text>
          <Text style={styles.headerTitle}>{texts.vtHeroTitle}</Text>
          <Text style={styles.headerSubtitle}>{texts.vtHeroSubtitle}</Text>
        </LinearGradient>

        {/* Language Selector Bar */}
        <View style={styles.languageBar}>
          <TouchableOpacity style={styles.languageButton}>
            <Text style={styles.languageText}>🇷🇺 Russian</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.swapButton}
            onPress={handleSwapLanguages}
          >
            <Text style={styles.swapIcon}>⇄</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.languageButton}>
            <Text style={styles.languageText}>🇬🇧 English</Text>
          </TouchableOpacity>
        </View>

        {/* Status Text */}
        <Text style={styles.statusText}>{getStatusText()}</Text>

        {/* Microphone Button with Waves */}
        <View style={styles.micContainer}>
          {/* Wave animations */}
          {state === 'listening' && (
            <>
              <Animated.View
                style={[
                  styles.wave,
                  {
                    opacity: waveAnim1.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.6, 0],
                    }),
                    transform: [
                      {
                        scale: waveAnim1.interpolate({
                          inputRange: [0, 1],
                          outputRange: [1, 2],
                        }),
                      },
                    ],
                  },
                ]}
              />
              <Animated.View
                style={[
                  styles.wave,
                  {
                    opacity: waveAnim2.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.6, 0],
                    }),
                    transform: [
                      {
                        scale: waveAnim2.interpolate({
                          inputRange: [0, 1],
                          outputRange: [1, 2],
                        }),
                      },
                    ],
                  },
                ]}
              />
              <Animated.View
                style={[
                  styles.wave,
                  {
                    opacity: waveAnim3.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.6, 0],
                    }),
                    transform: [
                      {
                        scale: waveAnim3.interpolate({
                          inputRange: [0, 1],
                          outputRange: [1, 2],
                        }),
                      },
                    ],
                  },
                ]}
              />
            </>
          )}

          {/* Mic button */}
          <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            <TouchableOpacity
              style={styles.micButton}
              onPress={handleMicPress}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={getMicButtonColor()}
                style={styles.micGradient}
              >
                {state === 'processing' ? (
                  <ActivityIndicator size="large" color="white" />
                ) : (
                  <Text style={styles.micIcon}>
                    {state === 'listening' ? '⏹️' : '🎤'}
                  </Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* Recognized Text Card */}
        {recognizedText && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>
                🗣️ {texts.vtRecognized} (Russian)
              </Text>
            </View>
            <Text style={styles.cardText}>{recognizedText}</Text>
            <TouchableOpacity
              style={styles.playButton}
              onPress={handlePlayOriginal}
              disabled={isPlayingOriginal}
            >
              <Text style={styles.playButtonText}>
                {isPlayingOriginal ? '⏸️' : '🔊'} {texts.vtPlayOriginal}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Translation Card */}
        {translatedText && (
          <LinearGradient
            colors={['#22C55E', '#16A34A']}
            style={styles.translationCard}
          >
            <View style={styles.cardHeader}>
              <Text style={[styles.cardTitle, styles.whiteText]}>
                🌐 {texts.vtTranslation} (English)
              </Text>
            </View>
            <Text style={[styles.cardText, styles.whiteText]}>
              {translatedText}
            </Text>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.whiteButton}
                onPress={handlePlayTranslation}
                disabled={isPlayingTranslation}
              >
                <Text style={styles.whiteButtonText}>
                  {isPlayingTranslation ? '⏸️' : '🔊'} {texts.vtPlayTranslation}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.whiteButton} onPress={handleCopy}>
                <Text style={styles.whiteButtonText}>
                  📋 {texts.vtCopyTranslation}
                </Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        )}

        {/* Error Message */}
        {state === 'error' && errorMessage && (
          <View style={styles.errorCard}>
            <Text style={styles.errorText}>⚠️ {errorMessage}</Text>
          </View>
        )}

        {/* Action Buttons */}
        {(recognizedText || translatedText) && (
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
              <Text style={styles.clearButtonText}>
                🗑️ {texts.vtClear}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background || '#F9FAFB',
  },
  scrollContent: {
    paddingBottom: verticalScale(30),
  },
  // Header
  header: {
    paddingHorizontal: scale(20),
    paddingTop: verticalScale(30),
    paddingBottom: verticalScale(30),
    borderBottomLeftRadius: scale(30),
    borderBottomRightRadius: scale(30),
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: verticalScale(4) },
    shadowOpacity: 0.2,
    shadowRadius: scale(8),
  },
  headerEmoji: {
    fontSize: moderateScale(56),
    textAlign: 'center',
    marginBottom: verticalScale(10),
  },
  headerTitle: {
    fontSize: moderateScale(32),
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    marginBottom: verticalScale(8),
  },
  headerSubtitle: {
    fontSize: moderateScale(16),
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.9,
  },
  // Language Bar
  languageBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    marginHorizontal: scale(20),
    marginTop: verticalScale(-20),
    paddingVertical: verticalScale(15),
    paddingHorizontal: scale(20),
    borderRadius: scale(20),
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: verticalScale(2) },
    shadowOpacity: 0.1,
    shadowRadius: scale(4),
  },
  languageButton: {
    flex: 1,
  },
  languageText: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    color: Colors.text || '#1F2937',
    textAlign: 'center',
  },
  swapButton: {
    width: scale(44),
    height: scale(44),
    borderRadius: scale(22),
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: scale(10),
  },
  swapIcon: {
    fontSize: moderateScale(24),
    color: '#6B7280',
  },
  // Status
  statusText: {
    fontSize: moderateScale(18),
    fontWeight: '600',
    color: Colors.text || '#1F2937',
    textAlign: 'center',
    marginTop: verticalScale(30),
    marginBottom: verticalScale(10),
  },
  // Microphone Button
  micContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: verticalScale(180),
    marginVertical: verticalScale(20),
  },
  wave: {
    position: 'absolute',
    width: scale(120),
    height: scale(120),
    borderRadius: scale(60),
    backgroundColor: '#EF4444',
  },
  micButton: {
    width: scale(120),
    height: scale(120),
    borderRadius: scale(60),
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: verticalScale(6) },
    shadowOpacity: 0.3,
    shadowRadius: scale(8),
  },
  micGradient: {
    width: '100%',
    height: '100%',
    borderRadius: scale(60),
    justifyContent: 'center',
    alignItems: 'center',
  },
  micIcon: {
    fontSize: moderateScale(48),
  },
  // Cards
  card: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: scale(20),
    marginTop: verticalScale(20),
    padding: scale(20),
    borderRadius: scale(20),
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: verticalScale(2) },
    shadowOpacity: 0.1,
    shadowRadius: scale(8),
  },
  translationCard: {
    marginHorizontal: scale(20),
    marginTop: verticalScale(20),
    padding: scale(20),
    borderRadius: scale(20),
    elevation: 8,
    shadowColor: '#22C55E',
    shadowOffset: { width: 0, height: verticalScale(4) },
    shadowOpacity: 0.3,
    shadowRadius: scale(12),
  },
  cardHeader: {
    marginBottom: verticalScale(12),
  },
  cardTitle: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    color: Colors.text || '#1F2937',
  },
  cardText: {
    fontSize: moderateScale(24),
    color: Colors.text || '#1F2937',
    lineHeight: moderateScale(32),
    marginBottom: verticalScale(15),
  },
  whiteText: {
    color: '#FFFFFF',
  },
  playButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(20),
    borderRadius: scale(12),
    alignSelf: 'flex-start',
  },
  playButtonText: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    color: '#FFFFFF',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: scale(10),
  },
  whiteButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(20),
    borderRadius: scale(12),
    flex: 1,
  },
  whiteButtonText: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    color: '#22C55E',
    textAlign: 'center',
  },
  // Error
  errorCard: {
    backgroundColor: '#FEE2E2',
    marginHorizontal: scale(20),
    marginTop: verticalScale(20),
    padding: scale(20),
    borderRadius: scale(20),
    borderWidth: 2,
    borderColor: '#EF4444',
  },
  errorText: {
    fontSize: moderateScale(16),
    color: '#991B1B',
    textAlign: 'center',
  },
  // Action Buttons
  actionButtons: {
    marginHorizontal: scale(20),
    marginTop: verticalScale(20),
  },
  clearButton: {
    backgroundColor: '#F3F4F6',
    paddingVertical: verticalScale(15),
    paddingHorizontal: scale(20),
    borderRadius: scale(12),
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  clearButtonText: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    color: '#6B7280',
    textAlign: 'center',
  },
});
