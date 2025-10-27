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
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
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

type TextTranslatorNavigationProp = StackNavigationProp<RootStackParamList, 'TextTranslator'>;

export default function TextTranslatorScreen() {
  const navigation = useNavigation<TextTranslatorNavigationProp>();

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
      Alert.alert('Error', 'Please enter text to translate');
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

      let errorMessage = 'Translation failed. Please try again.';
      if (error instanceof Error) {
        if (error.message.includes('internet') || error.message.includes('connection')) {
          errorMessage = 'No internet connection. Please check your connection and try again.';
        } else if (error.message.includes('too long')) {
          errorMessage = 'Text is too long. Maximum 5000 characters.';
        }
      }

      Alert.alert('Error', errorMessage);
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

      const options = {
        language: targetLanguage,
        pitch: 1.0,
        rate: 0.9,
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
    Alert.alert('✅ Copied', 'Translation copied to clipboard');
  };

  // Поменять языки местами
  const handleSwapLanguages = () => {
    if (sourceLanguage === 'auto') {
      Alert.alert('Info', 'Cannot swap when Auto Detect is selected');
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
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Text Translator</Text>
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
              <Text style={styles.languageName}>{sourceLang?.name || 'Select'}</Text>
              <Ionicons name="chevron-down" size={20} color="#6B7280" />
            </TouchableOpacity>

            <TextInput
              style={styles.input}
              placeholder="Enter text to translate..."
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
                  <Ionicons name="close-circle" size={20} color="#6B7280" />
                  <Text style={styles.clearText}>Clear</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Swap Button */}
          <View style={styles.swapContainer}>
            <TouchableOpacity
              style={styles.swapButton}
              onPress={handleSwapLanguages}
              disabled={sourceLanguage === 'auto' || !outputText}
              activeOpacity={0.7}
            >
              <Ionicons
                name="swap-vertical"
                size={24}
                color={sourceLanguage === 'auto' || !outputText ? '#D1D5DB' : '#3B82F6'}
              />
            </TouchableOpacity>
          </View>

          {/* Translate Button */}
          <TouchableOpacity
            style={[
              styles.translateButton,
              (!inputText.trim() || isTranslating) && styles.translateButtonDisabled,
            ]}
            onPress={handleTranslate}
            disabled={!inputText.trim() || isTranslating}
            activeOpacity={0.8}
          >
            {isTranslating ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Ionicons name="language" size={24} color="#FFFFFF" />
            )}
            <Text style={styles.translateButtonText}>
              {isTranslating ? 'Translating...' : 'Translate'}
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
              <Text style={styles.languageName}>{targetLang?.name || 'Select'}</Text>
              <Ionicons name="chevron-down" size={20} color="#6B7280" />
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
                    <Ionicons
                      name={isSpeaking ? 'stop-circle' : 'volume-high'}
                      size={20}
                      color="#3B82F6"
                    />
                    <Text style={styles.actionText}>
                      {isSpeaking ? 'Stop' : 'Play'}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={handleCopy}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="copy-outline" size={20} color="#3B82F6" />
                    <Text style={styles.actionText}>Copy</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={styles.emptyOutput}>
                <Ionicons name="document-text-outline" size={48} color="#D1D5DB" />
                <Text style={styles.emptyText}>Translation will appear here</Text>
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
        title="Source Language"
      />

      <LanguagePicker
        visible={showTargetPicker}
        languages={getTargetLanguages()}
        selectedLanguage={targetLanguage}
        onSelect={setTargetLanguage}
        onClose={() => setShowTargetPicker(false)}
        title="Target Language"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#3B82F6',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  placeholder: {
    width: 32,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  outputCard: {
    backgroundColor: '#EFF6FF',
    borderWidth: 2,
    borderColor: '#3B82F6',
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
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  translateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B82F6',
    paddingVertical: 16,
    borderRadius: 16,
    marginVertical: 12,
    gap: 12,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  translateButtonDisabled: {
    backgroundColor: '#9CA3AF',
    shadowOpacity: 0,
    elevation: 0,
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
    borderRadius: 12,
    gap: 6,
    borderWidth: 1,
    borderColor: '#3B82F6',
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3B82F6',
  },
  emptyOutput: {
    minHeight: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    marginTop: 12,
    fontSize: 14,
    color: '#9CA3AF',
  },
});
