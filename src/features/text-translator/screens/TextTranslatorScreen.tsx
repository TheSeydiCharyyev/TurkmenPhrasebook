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
          <Ionicons name="arrow-back" size={moderateScale(24)} color="#1F2937" />
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

          {/* Translate Button - Minimalist Design */}
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
              <ActivityIndicator size="small" color="#4facfe" />
            ) : (
              <Text style={styles.translateButtonText}>
                {texts.ttTranslate}
              </Text>
            )}
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
    backgroundColor: '#F8F9FA',
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderBottomColor: '#E5E7EB',
    borderBottomWidth: 1,
    elevation: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(14),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: scale(2) },
    shadowOpacity: 0.1,
    shadowRadius: scale(4),
  },
  backButton: {
    alignItems: 'center',
    borderRadius: scale(20),
    height: scale(40),
    justifyContent: 'center',
    width: scale(40),
  },
  headerTitle: {
    color: '#1F2937',
    fontSize: moderateScale(17),
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  placeholder: {
    width: scale(40),
  },
  // Hero Section
  heroSection: {
    alignItems: 'center',
    borderRadius: scale(20),
    elevation: 8,
    marginBottom: verticalScale(20),
    padding: scale(24),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: scale(4) },
    shadowOpacity: 0.15,
    shadowRadius: scale(12),
  },
  heroIconContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: scale(40),
    height: verticalScale(80),
    justifyContent: 'center',
    marginBottom: verticalScale(16),
    width: scale(80),
  },
  heroIcon: {
    fontSize: moderateScale(48),
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: moderateScale(26),
    fontWeight: '800',
    marginBottom: verticalScale(8),
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: scale(1) },
    textShadowRadius: scale(3),
  },
  heroSubtitle: {
    color: '#FFFFFF',
    fontSize: moderateScale(15),
    lineHeight: moderateScale(22),
    opacity: 0.95,
    paddingHorizontal: scale(20),
    textAlign: 'center',
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
    elevation: 6,
    marginBottom: verticalScale(16),
    padding: scale(18),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: scale(4) },
    shadowOpacity: 0.12,
    shadowRadius: scale(12),
  },
  outputCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
    borderWidth: 1,
  },
  languageButton: {
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: scale(12),
    flexDirection: 'row',
    gap: scale(8),
    marginBottom: verticalScale(12),
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(8),
  },
  languageFlag: {
    fontSize: moderateScale(24),
  },
  languageName: {
    color: '#111827',
    flex: 1,
    fontSize: moderateScale(16),
    fontWeight: '600',
  },
  chevronEmoji: {
    fontSize: moderateScale(14),
    opacity: 0.6,
  },
  input: {
    color: '#111827',
    fontSize: moderateScale(16),
    lineHeight: moderateScale(24),
    minHeight: verticalScale(120),
    textAlignVertical: 'top',
  },
  inputActions: {
    alignItems: 'center',
    borderTopColor: '#E5E7EB',
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: verticalScale(8),
    paddingTop: verticalScale(8),
  },
  charCount: {
    color: '#9CA3AF',
    fontSize: moderateScale(12),
  },
  clearButton: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: scale(4),
  },
  clearEmoji: {
    fontSize: moderateScale(16),
  },
  clearText: {
    color: '#6B7280',
    fontSize: moderateScale(14),
    fontWeight: '500',
  },
  translateButton: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#4facfe',
    borderRadius: scale(12),
    borderWidth: 1,
    elevation: 2,
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: verticalScale(16),
    paddingVertical: verticalScale(14),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: scale(2) },
    shadowOpacity: 0.08,
    shadowRadius: scale(4),
  },
  translateButtonDisabled: {
    backgroundColor: '#F9FAFB',
    borderColor: '#D1D5DB',
    elevation: 0,
    shadowOpacity: 0,
  },
  translateButtonText: {
    color: '#4facfe',
    fontSize: moderateScale(16),
    fontWeight: '600',
  },
  outputContainer: {
    minHeight: verticalScale(120),
  },
  outputText: {
    color: '#111827',
    fontSize: moderateScale(18),
    fontWeight: '600',
    lineHeight: moderateScale(28),
    marginBottom: verticalScale(16),
  },
  outputActions: {
    borderTopColor: '#E5E7EB',
    borderTopWidth: 1,
    flexDirection: 'row',
    gap: scale(12),
    paddingTop: verticalScale(12),
  },
  actionButton: {
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderColor: '#4facfe',
    borderRadius: scale(14),
    borderWidth: 1,
    flex: 1,
    flexDirection: 'row',
    gap: scale(6),
    justifyContent: 'center',
    paddingVertical: verticalScale(12),
  },
  actionEmoji: {
    fontSize: moderateScale(20),
  },
  actionText: {
    color: '#4facfe',
    fontSize: moderateScale(14),
    fontWeight: '600',
  },
  emptyOutput: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: verticalScale(120),
  },
  emptyIcon: {
    fontSize: moderateScale(48),
    opacity: 0.3,
  },
  emptyText: {
    color: '#9CA3AF',
    fontSize: moderateScale(14),
    marginTop: verticalScale(12),
  },
});
