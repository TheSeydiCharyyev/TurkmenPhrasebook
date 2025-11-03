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
import { LinearGradient } from 'expo-linear-gradient';
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
        barStyle="light-content"
        backgroundColor="#4facfe"
        translucent={false}
      />

      {/* Gradient Header */}
      <LinearGradient
        colors={['#4facfe', '#00f2fe']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Text style={styles.backEmoji}>⬅️</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{texts.ttHeaderTitle}</Text>
        <View style={styles.placeholder} />
      </LinearGradient>

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
          {/* Hero Section */}
          <LinearGradient
            colors={['#4facfe', '#00f2fe']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroSection}
          >
            <View style={styles.heroIconContainer}>
              <Text style={styles.heroIcon}>🌍</Text>
            </View>
            <Text style={styles.heroTitle}>{texts.ttHeroTitle}</Text>
            <Text style={styles.heroSubtitle}>
              {texts.ttHeroSubtitle}
            </Text>
          </LinearGradient>

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
          >
            <LinearGradient
              colors={!inputText.trim() || isTranslating ? ['#D1D5DB', '#9CA3AF'] : ['#4facfe', '#00f2fe']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.translateButton}
            >
              {isTranslating ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.translateEmoji}>🌐</Text>
              )}
              <Text style={styles.translateButtonText}>
                {isTranslating ? texts.ttTranslating : texts.ttTranslate}
              </Text>
            </LinearGradient>
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
    backgroundColor: DesignColors.backgroundGray,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  backButton: {
    padding: 4,
  },
  backEmoji: {
    fontSize: 24,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  placeholder: {
    width: 32,
  },
  // Hero Section
  heroSection: {
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  heroIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  heroIcon: {
    fontSize: 48,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  heroSubtitle: {
    fontSize: 15,
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 22,
    opacity: 0.95,
    paddingHorizontal: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.15)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
    marginBottom: 16,
  },
  outputCard: {
    backgroundColor: '#F0F9FF',
    borderWidth: 2,
    borderColor: '#4facfe',
    shadowColor: '#4facfe',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    marginBottom: 12,
    gap: 8,
  },
  languageFlag: {
    fontSize: 24,
  },
  languageName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  chevronEmoji: {
    fontSize: 14,
    opacity: 0.6,
  },
  input: {
    minHeight: 120,
    fontSize: 16,
    color: '#111827',
    textAlignVertical: 'top',
    lineHeight: 24,
  },
  inputActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  charCount: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  clearEmoji: {
    fontSize: 16,
  },
  clearText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  swapContainer: {
    alignItems: 'center',
    marginVertical: 12,
  },
  swapButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4facfe',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  swapButtonDisabled: {
    opacity: 0.4,
    shadowOpacity: 0,
    elevation: 0,
  },
  swapEmoji: {
    fontSize: 28,
  },
  translateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 20,
    marginVertical: 16,
    gap: 12,
    shadowColor: '#4facfe',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  translateEmoji: {
    fontSize: 24,
  },
  translateButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  outputContainer: {
    minHeight: 120,
  },
  outputText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    lineHeight: 28,
    marginBottom: 16,
  },
  outputActions: {
    flexDirection: 'row',
    gap: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#DBEAFE',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    gap: 6,
    borderWidth: 2,
    borderColor: '#4facfe',
    shadowColor: '#4facfe',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  actionEmoji: {
    fontSize: 20,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4facfe',
  },
  emptyOutput: {
    minHeight: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyIcon: {
    fontSize: 48,
    opacity: 0.3,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 14,
    color: '#9CA3AF',
  },
});
