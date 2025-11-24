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
  Linking,
  Platform,
  Modal,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Voice from '@react-native-voice/voice';
import { useAppLanguage } from '../../../contexts/LanguageContext';
import { VoiceTranslatorService } from '../services/VoiceTranslatorService';
import { translateText } from '../../visual-translator/services/TranslationService';
import { Colors } from '../../../constants/Colors';
import { scale, verticalScale, moderateScale } from '../../../utils/ResponsiveUtils';
import { getLanguageByCode, getAvailableLanguages } from '../../../config/languages.config';
import { LanguageConfig } from '../../../types';

type TranslatorState = 'idle' | 'listening' | 'processing' | 'completed' | 'error';

export default function VoiceTranslatorScreen() {
  const navigation = useNavigation();
  const { getTexts, config } = useAppLanguage();
  const texts = getTexts();

  // State
  const [state, setState] = useState<TranslatorState>('idle');
  const [sourceLang, setSourceLang] = useState(config.mode === 'tk' ? 'tk' : config.mode);
  const [targetLang, setTargetLang] = useState('en');
  const [recognizedText, setRecognizedText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isPlayingOriginal, setIsPlayingOriginal] = useState(false);
  const [isPlayingTranslation, setIsPlayingTranslation] = useState(false);
  const [showSourceModal, setShowSourceModal] = useState(false);
  const [showTargetModal, setShowTargetModal] = useState(false);

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
                Linking.openURL('app-settings:');
              } else {
                Linking.openSettings();
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
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" translucent={false} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={moderateScale(24)} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{texts.vtHeroTitle}</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >

        {/* Language Selector Bar */}
        <View style={styles.languageBar}>
          <TouchableOpacity
            style={styles.languageButton}
            onPress={() => setShowSourceModal(true)}
          >
            <Text style={styles.languageText}>
              {getLanguageByCode(sourceLang)?.flag} {getLanguageByCode(sourceLang)?.nameEn}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.swapButton}
            onPress={handleSwapLanguages}
          >
            <Ionicons name="swap-horizontal" size={24} color="#8B5CF6" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.languageButton}
            onPress={() => setShowTargetModal(true)}
          >
            <Text style={styles.languageText}>
              {getLanguageByCode(targetLang)?.flag} {getLanguageByCode(targetLang)?.nameEn}
            </Text>
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
              style={[
                styles.micButton,
                state === 'listening' && styles.micButtonListening,
                state === 'processing' && styles.micButtonProcessing,
              ]}
              onPress={handleMicPress}
              activeOpacity={0.8}
            >
              {state === 'processing' ? (
                <ActivityIndicator size="large" color="white" />
              ) : (
                <Ionicons
                  name={state === 'listening' ? 'stop-circle' : 'mic'}
                  size={48}
                  color="#FFFFFF"
                />
              )}
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* Recognized Text Card */}
        {recognizedText && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="chatbubble-outline" size={20} color="#6B7280" />
              <Text style={styles.cardTitle}>
                {texts.vtRecognized} ({getLanguageByCode(sourceLang)?.nameEn})
              </Text>
            </View>
            <Text style={styles.cardText}>{recognizedText}</Text>
            <TouchableOpacity
              style={styles.playButton}
              onPress={handlePlayOriginal}
              disabled={isPlayingOriginal}
            >
              <Ionicons
                name={isPlayingOriginal ? 'pause' : 'volume-high'}
                size={20}
                color="#FFFFFF"
              />
              <Text style={styles.playButtonText}>{texts.vtPlayOriginal}</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Translation Card */}
        {translatedText && (
          <View style={styles.translationCard}>
            <View style={styles.cardHeader}>
              <Ionicons name="language-outline" size={20} color="#8B5CF6" />
              <Text style={styles.cardTitle}>
                {texts.vtTranslation} ({getLanguageByCode(targetLang)?.nameEn})
              </Text>
            </View>
            <Text style={styles.cardText}>{translatedText}</Text>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={handlePlayTranslation}
                disabled={isPlayingTranslation}
              >
                <Ionicons
                  name={isPlayingTranslation ? 'pause' : 'volume-high'}
                  size={20}
                  color="#8B5CF6"
                />
                <Text style={styles.actionButtonText}>{texts.vtPlayTranslation}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton} onPress={handleCopy}>
                <Ionicons name="copy-outline" size={20} color="#8B5CF6" />
                <Text style={styles.actionButtonText}>{texts.vtCopyTranslation}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Error Message */}
        {state === 'error' && errorMessage && (
          <View style={styles.errorCard}>
            <Ionicons name="warning-outline" size={24} color="#EF4444" />
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        )}

        {/* Action Buttons */}
        {(recognizedText || translatedText) && (
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
              <Ionicons name="trash-outline" size={20} color="#6B7280" />
              <Text style={styles.clearButtonText}>{texts.vtClear}</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Source Language Modal */}
      <LanguageModal
        visible={showSourceModal}
        onClose={() => setShowSourceModal(false)}
        onSelect={(code) => {
          setSourceLang(code);
          setShowSourceModal(false);
          setRecognizedText('');
          setTranslatedText('');
          setState('idle');
        }}
        selectedLanguage={sourceLang}
        title={texts.vtSelectSourceLanguage}
      />

      {/* Target Language Modal */}
      <LanguageModal
        visible={showTargetModal}
        onClose={() => setShowTargetModal(false)}
        onSelect={(code) => {
          setTargetLang(code);
          setShowTargetModal(false);
          setTranslatedText('');
        }}
        selectedLanguage={targetLang}
        title={texts.vtSelectTargetLanguage}
      />
    </SafeAreaView>
  );
}

// Language Modal Component
interface LanguageModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (code: string) => void;
  selectedLanguage: string;
  title: string;
}

function LanguageModal({ visible, onClose, onSelect, selectedLanguage, title }: LanguageModalProps) {
  const availableLanguages = getAvailableLanguages();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={modalStyles.overlay}>
        <View style={modalStyles.container}>
          {/* Header */}
          <View style={modalStyles.header}>
            <Text style={modalStyles.title}>{title}</Text>
            <TouchableOpacity onPress={onClose} style={modalStyles.closeButton}>
              <Ionicons name="close" size={28} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {/* Languages List */}
          <ScrollView showsVerticalScrollIndicator={false}>
            {availableLanguages.map((lang) => (
              <TouchableOpacity
                key={lang.code}
                style={[
                  modalStyles.languageItem,
                  selectedLanguage === lang.code && modalStyles.languageItemSelected,
                ]}
                onPress={() => onSelect(lang.code)}
              >
                <Text style={modalStyles.languageFlag}>{lang.flag}</Text>
                <View style={modalStyles.languageInfo}>
                  <Text style={modalStyles.languageName}>{lang.nameEn}</Text>
                  <Text style={modalStyles.languageNameNative}>{lang.name}</Text>
                </View>
                {selectedLanguage === lang.code && (
                  <Ionicons name="checkmark-circle" size={24} color="#22C55E" />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollContent: {
    paddingBottom: verticalScale(30),
  },
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(16),
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: moderateScale(18),
    fontWeight: '700',
    color: '#1F2937',
  },
  placeholder: {
    width: scale(40),
  },
  // Language Bar
  languageBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    marginHorizontal: scale(16),
    marginTop: verticalScale(16),
    paddingVertical: verticalScale(16),
    paddingHorizontal: scale(16),
    borderRadius: scale(12),
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: verticalScale(2) },
    shadowOpacity: 0.05,
    shadowRadius: scale(3),
    elevation: 2,
  },
  languageButton: {
    flex: 1,
  },
  languageText: {
    fontSize: moderateScale(15),
    fontWeight: '600',
    color: '#1F2937',
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
  // Status
  statusText: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    color: '#6B7280',
    textAlign: 'center',
    marginTop: verticalScale(24),
    marginBottom: verticalScale(8),
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
    backgroundColor: '#8B5CF6',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: verticalScale(4) },
    shadowOpacity: 0.3,
    shadowRadius: scale(12),
    elevation: 8,
  },
  micButtonListening: {
    backgroundColor: '#EF4444',
    shadowColor: '#EF4444',
  },
  micButtonProcessing: {
    backgroundColor: '#F59E0B',
    shadowColor: '#F59E0B',
  },
  // Cards
  card: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: scale(16),
    marginTop: verticalScale(16),
    padding: scale(20),
    borderRadius: scale(12),
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: verticalScale(2) },
    shadowOpacity: 0.05,
    shadowRadius: scale(3),
    elevation: 2,
  },
  translationCard: {
    backgroundColor: '#F5F3FF',
    marginHorizontal: scale(16),
    marginTop: verticalScale(16),
    padding: scale(20),
    borderRadius: scale(12),
    borderWidth: 2,
    borderColor: '#8B5CF6',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
    marginBottom: verticalScale(12),
  },
  cardTitle: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  cardText: {
    fontSize: moderateScale(20),
    fontWeight: '600',
    color: '#1F2937',
    lineHeight: moderateScale(28),
    marginBottom: verticalScale(16),
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
    backgroundColor: '#8B5CF6',
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(20),
    borderRadius: scale(10),
    alignSelf: 'flex-start',
  },
  playButtonText: {
    fontSize: moderateScale(15),
    fontWeight: '600',
    color: '#FFFFFF',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: scale(10),
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: scale(8),
    backgroundColor: '#FFFFFF',
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(16),
    borderRadius: scale(10),
    flex: 1,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  actionButtonText: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    color: '#8B5CF6',
  },
  // Error
  errorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: scale(12),
    backgroundColor: '#FEE2E2',
    marginHorizontal: scale(16),
    marginTop: verticalScale(16),
    padding: scale(20),
    borderRadius: scale(12),
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  errorText: {
    fontSize: moderateScale(15),
    fontWeight: '500',
    color: '#991B1B',
  },
  // Action Buttons
  actionButtons: {
    marginHorizontal: scale(16),
    marginTop: verticalScale(16),
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: scale(8),
    backgroundColor: '#FFFFFF',
    paddingVertical: verticalScale(14),
    paddingHorizontal: scale(20),
    borderRadius: scale(10),
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  clearButtonText: {
    fontSize: moderateScale(15),
    fontWeight: '600',
    color: '#6B7280',
  },
});

// Modal Styles
const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: scale(24),
    borderTopRightRadius: scale(24),
    maxHeight: '80%',
    paddingBottom: verticalScale(30),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(20),
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  title: {
    fontSize: moderateScale(20),
    fontWeight: 'bold',
    color: Colors.text || '#1F2937',
  },
  closeButton: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(20),
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(15),
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  languageItemSelected: {
    backgroundColor: '#F0FDF4',
  },
  languageFlag: {
    fontSize: moderateScale(32),
    marginRight: scale(15),
  },
  languageInfo: {
    flex: 1,
  },
  languageName: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    color: Colors.text || '#1F2937',
    marginBottom: verticalScale(4),
  },
  languageNameNative: {
    fontSize: moderateScale(14),
    color: '#6B7280',
  },
});
