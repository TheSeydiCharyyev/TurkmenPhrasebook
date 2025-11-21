// src/features/text-translator/screens/TextTranslatorScreen.tsx
// Главный экран Text Translator

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Clipboard,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DesignColors } from '../../../constants/Design';
import * as Speech from 'expo-speech';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../../../types';
import TextTranslationService from '../services/TextTranslationService';
import LanguagePicker from '../components/LanguagePicker';
import {
  getSourceLanguages,
  getTargetLanguages,
  getLanguageByCode,
  type TextTranslationResult,
} from '../types/text-translator.types';
import { useAppLanguage } from '../../../contexts/LanguageContext';
import { scale, verticalScale, moderateScale } from '../../../utils/ResponsiveUtils';

type TextTranslatorNavigationProp = StackNavigationProp<RootStackParamList, 'TextTranslator'>;

export default function TextTranslatorScreen() {
  const navigation = useNavigation<TextTranslatorNavigationProp>();
  const { getTexts } = useAppLanguage();
  const texts = getTexts();

  // State
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [sourceLanguage, setSourceLanguage] = useState('auto');
  const [targetLanguage, setTargetLanguage] = useState('en');
  const [isTranslating, setIsTranslating] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showSourcePicker, setShowSourcePicker] = useState(false);
  const [showTargetPicker, setShowTargetPicker] = useState(false);
  const [currentResult, setCurrentResult] = useState<TextTranslationResult | null>(null);

  // Инициализация сервиса
  useEffect(() => {
    TextTranslationService.initialize();
  }, []);

  // Обработчик перевода
  const handleTranslate = async () => {
    if (!inputText.trim()) {
      Alert.alert(texts.ttErrorTitle, texts.ttErrorEmptyText);
      return;
    }

    setIsTranslating(true);
    setOutputText('');
    setCurrentResult(null);

    try {
      const result = await TextTranslationService.translate(
        inputText,
        sourceLanguage,
        targetLanguage
      );

      setOutputText(result.translatedText);
      setCurrentResult(result);
    } catch (error) {
      console.error('Translation error:', error);

      let errorMessage = texts.ttErrorTranslationFailed;
      if (error instanceof Error) {
        if (error.message.includes('internet') || error.message.includes('connection')) {
          errorMessage = texts.ttErrorNoInternet;
        } else if (error.message.includes('too long')) {
          errorMessage = texts.ttErrorTextTooLong;
        }
      }

      Alert.alert(texts.ttErrorTitle, errorMessage);
    } finally {
      setIsTranslating(false);
    }
  };

  // Очистить ввод
  const handleClear = () => {
    setInputText('');
    setOutputText('');
    setCurrentResult(null);
  };

  // Озвучить перевод
  const handleSpeak = async () => {
    if (!outputText) return;

    try {
      if (isSpeaking) {
        await Speech.stop();
        setIsSpeaking(false);
        return;
      }

      setIsSpeaking(true);

      // Оптимизированные параметры для более естественного звучания
      const isRussian = targetLanguage === 'ru-RU' || targetLanguage === 'ru';
      const options = {
        language: targetLanguage,
        pitch: isRussian ? 0.95 : 1.0,  // Русский чуть ниже
        rate: isRussian ? 0.92 : 0.9,    // Русский немного быстрее
        onDone: () => setIsSpeaking(false),
        onError: () => setIsSpeaking(false),
      };

      await Speech.speak(outputText, options);
    } catch (error) {
      console.error('Speech error:', error);
      setIsSpeaking(false);
    }
  };

  // Копировать результат
  const handleCopy = () => {
    if (!outputText) return;

    Clipboard.setString(outputText);
    Alert.alert(texts.ttCopiedTitle, texts.ttCopiedMessage);
  };

  // Поменять языки местами
  const handleSwapLanguages = () => {
    if (sourceLanguage === 'auto') {
      Alert.alert(texts.ttInfoTitle, texts.ttInfoCannotSwap);
      return;
    }

    // Меняем языки
    const tempLang = sourceLanguage;
    setSourceLanguage(targetLanguage);
    setTargetLanguage(tempLang);

    // Меняем тексты
    const tempText = inputText;
    setInputText(outputText);
    setOutputText(tempText);
  };

  const sourceLang = getLanguageByCode(sourceLanguage);
  const targetLang = getLanguageByCode(targetLanguage);

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#FFFFFF"
        translucent={false}
      />

      {/* Clean White Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{texts.ttHeaderTitle}</Text>
        <View style={styles.placeholder} />
      </View>

      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Source Language Card */}
          <View style={styles.card}>
            <TouchableOpacity
              style={styles.languageButton}
              onPress={() => setShowSourcePicker(true)}
              activeOpacity={0.7}
            >
              <Text style={styles.languageFlag}>{sourceLang?.flag || '🌐'}</Text>
              <Text style={styles.languageName}>{sourceLang?.name || texts.ttSelectLanguage}</Text>
              <Text style={styles.chevronEmoji}>▼</Text>
            </TouchableOpacity>

            <TextInput
              style={styles.input}
              placeholder={texts.ttPlaceholder}
              placeholderTextColor="#9CA3AF"
              value={inputText}
              onChangeText={setInputText}
              multiline
              textAlignVertical="top"
              maxLength={5000}
            />

            <View style={styles.inputActions}>
              <Text style={styles.charCount}>
                {inputText.length}/5000
              </Text>
              {inputText.length > 0 && (
                <TouchableOpacity
                  onPress={handleClear}
                  style={styles.clearButton}
                  activeOpacity={0.7}
                >
                  <Text style={styles.clearEmoji}>✖️</Text>
                  <Text style={styles.clearText}>{texts.ttClear}</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Swap Button */}
          <View style={styles.swapContainer}>
            <TouchableOpacity
              style={[
                styles.swapButton,
                (sourceLanguage === 'auto' || !outputText) && styles.swapButtonDisabled
              ]}
              onPress={handleSwapLanguages}
              disabled={sourceLanguage === 'auto' || !outputText}
              activeOpacity={0.7}
            >
              <Text style={styles.swapEmoji}>🔄</Text>
            </TouchableOpacity>
          </View>

          {/* Translate Button */}
          <TouchableOpacity
            onPress={handleTranslate}
            disabled={!inputText.trim() || isTranslating}
            activeOpacity={0.8}
            style={[
              styles.translateButton,
              (!inputText.trim() || isTranslating) && styles.translateButtonDisabled
            ]}
          >
            {isTranslating ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Ionicons name="language-outline" size={24} color="#FFFFFF" />
            )}
            <Text style={styles.translateButtonText}>
              {isTranslating ? texts.ttTranslating : texts.ttTranslate}
            </Text>
          </TouchableOpacity>

          {/* Target Language Card */}
          <View style={[styles.card, styles.outputCard]}>
            <TouchableOpacity
              style={styles.languageButton}
              onPress={() => setShowTargetPicker(true)}
              activeOpacity={0.7}
            >
              <Text style={styles.languageFlag}>{targetLang?.flag || '🌍'}</Text>
              <Text style={styles.languageName}>{targetLang?.name || texts.ttSelectLanguage}</Text>
              <Text style={styles.chevronEmoji}>▼</Text>
            </TouchableOpacity>

            {outputText ? (
              <View style={styles.outputContainer}>
                <Text style={styles.outputText}>{outputText}</Text>

                {/* Output Actions */}
                <View style={styles.outputActions}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={handleSpeak}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.actionEmoji}>
                      {isSpeaking ? '⏹️' : '🔊'}
                    </Text>
                    <Text style={styles.actionText}>
                      {isSpeaking ? texts.ttStop : texts.ttPlay}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={handleCopy}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.actionEmoji}>📋</Text>
                    <Text style={styles.actionText}>{texts.ttCopy}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={styles.emptyOutput}>
                <Text style={styles.emptyIcon}>📄</Text>
                <Text style={styles.emptyText}>{texts.ttEmptyOutput}</Text>
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Language Pickers */}
      <LanguagePicker
        visible={showSourcePicker}
        languages={getSourceLanguages()}
        selectedLanguage={sourceLanguage}
        onSelect={setSourceLanguage}
        onClose={() => setShowSourcePicker(false)}
        title={texts.ttSourceLanguage}
      />

      <LanguagePicker
        visible={showTargetPicker}
        languages={getTargetLanguages()}
        selectedLanguage={targetLanguage}
        onSelect={setTargetLanguage}
        onClose={() => setShowTargetPicker(false)}
        title={texts.ttTargetLanguage}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(14),
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: scale(2) },
    shadowOpacity: 0.1,
    shadowRadius: scale(4),
    elevation: 4,
  },
  backButton: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: moderateScale(17),
    fontWeight: '600',
    color: '#1F2937',
    letterSpacing: -0.2,
  },
  placeholder: {
    width: scale(40),
  },
  // Hero Section
  heroSection: {
    borderRadius: scale(20),
    padding: scale(24),
    alignItems: 'center',
    marginBottom: verticalScale(20),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: scale(4) },
    shadowOpacity: 0.15,
    shadowRadius: scale(12),
    elevation: 8,
  },
  heroIconContainer: {
    width: scale(80),
    height: verticalScale(80),
    borderRadius: scale(40),
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: verticalScale(16),
  },
  heroIcon: {
    fontSize: moderateScale(48),
  },
  heroTitle: {
    fontSize: moderateScale(26),
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: verticalScale(8),
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: scale(1) },
    textShadowRadius: scale(3),
  },
  heroSubtitle: {
    fontSize: moderateScale(15),
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: moderateScale(22),
    opacity: 0.95,
    paddingHorizontal: scale(20),
    textShadowColor: 'rgba(0, 0, 0, 0.15)',
    textShadowOffset: { width: 0, height: scale(1) },
    textShadowRadius: scale(2),
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: scale(20),
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: scale(20),
    padding: scale(18),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: scale(4) },
    shadowOpacity: 0.12,
    shadowRadius: scale(12),
    elevation: 6,
    marginBottom: verticalScale(16),
  },
  outputCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: verticalScale(8),
    paddingHorizontal: scale(12),
    backgroundColor: '#F3F4F6',
    borderRadius: scale(12),
    marginBottom: verticalScale(12),
    gap: scale(8),
  },
  languageFlag: {
    fontSize: moderateScale(24),
  },
  languageName: {
    flex: 1,
    fontSize: moderateScale(16),
    fontWeight: '600',
    color: '#111827',
  },
  chevronEmoji: {
    fontSize: moderateScale(14),
    opacity: 0.6,
  },
  input: {
    minHeight: verticalScale(120),
    fontSize: moderateScale(16),
    color: '#111827',
    textAlignVertical: 'top',
    lineHeight: moderateScale(24),
  },
  inputActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: verticalScale(8),
    paddingTop: verticalScale(8),
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  charCount: {
    fontSize: moderateScale(12),
    color: '#9CA3AF',
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(4),
  },
  clearEmoji: {
    fontSize: moderateScale(16),
  },
  clearText: {
    fontSize: moderateScale(14),
    color: '#6B7280',
    fontWeight: '500',
  },
  swapContainer: {
    alignItems: 'center',
    marginVertical: verticalScale(12),
  },
  swapButton: {
    width: scale(56),
    height: verticalScale(56),
    borderRadius: scale(28),
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4facfe',
    shadowOffset: { width: 0, height: scale(3) },
    shadowOpacity: 0.2,
    shadowRadius: scale(6),
    elevation: 4,
  },
  swapButtonDisabled: {
    opacity: 0.4,
    shadowOpacity: 0,
    elevation: 0,
  },
  swapEmoji: {
    fontSize: moderateScale(28),
  },
  translateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(18),
    borderRadius: scale(20),
    marginVertical: verticalScale(16),
    gap: scale(12),
    backgroundColor: '#4facfe',
    shadowColor: '#4facfe',
    shadowOffset: { width: 0, height: scale(4) },
    shadowOpacity: 0.3,
    shadowRadius: scale(10),
    elevation: 6,
  },
  translateButtonDisabled: {
    backgroundColor: '#D1D5DB',
    shadowOpacity: 0,
    elevation: 0,
  },
  translateButtonText: {
    fontSize: moderateScale(18),
    fontWeight: '700',
    color: '#FFFFFF',
  },
  outputContainer: {
    minHeight: verticalScale(120),
  },
  outputText: {
    fontSize: moderateScale(18),
    fontWeight: '600',
    color: '#111827',
    lineHeight: moderateScale(28),
    marginBottom: verticalScale(16),
  },
  outputActions: {
    flexDirection: 'row',
    gap: scale(12),
    paddingTop: verticalScale(12),
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(12),
    backgroundColor: '#F3F4F6',
    borderRadius: scale(14),
    gap: scale(6),
    borderWidth: 1,
    borderColor: '#4facfe',
  },
  actionEmoji: {
    fontSize: moderateScale(20),
  },
  actionText: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    color: '#4facfe',
  },
  emptyOutput: {
    minHeight: verticalScale(120),
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyIcon: {
    fontSize: moderateScale(48),
    opacity: 0.3,
  },
  emptyText: {
    marginTop: verticalScale(12),
    fontSize: moderateScale(14),
    color: '#9CA3AF',
  },
});
