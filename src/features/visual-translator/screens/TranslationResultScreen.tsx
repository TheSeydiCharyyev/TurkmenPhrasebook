// src/features/visual-translator/screens/TranslationResultScreen.tsx
// Экран результатов перевода Visual Translator

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  Share,
  Clipboard,
  StatusBar,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DesignColors } from '../../../constants/Design';
import { scale, verticalScale, moderateScale } from '../../../utils/ResponsiveUtils';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RouteProp } from '@react-navigation/native';
import { useAppLanguage } from '../../../contexts/LanguageContext';
import * as Speech from 'expo-speech';
import type { TranslationResult } from '../types/visual-translator.types';
import type { RootStackParamList } from '../../../types';

type TranslationResultNavigationProp = StackNavigationProp<RootStackParamList, 'TranslationResult'>;
type TranslationResultRouteProp = RouteProp<RootStackParamList, 'TranslationResult'>;

export default function TranslationResultScreen() {
  const navigation = useNavigation<TranslationResultNavigationProp>();
  const route = useRoute<TranslationResultRouteProp>();
  const { getTexts } = useAppLanguage();
  const texts = getTexts();
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Получаем результат из параметров навигации
  const result = route.params?.result;

  if (!result) {
    // Если результат не передан, возвращаемся назад
    navigation.goBack();
    return null;
  }

  const handleSpeak = async () => {
    try {
      if (isSpeaking) {
        await Speech.stop();
        setIsSpeaking(false);
        return;
      }

      setIsSpeaking(true);

      // Озвучиваем переведенный текст
      // Оптимизированные параметры для более естественного звучания
      const isRussian = result.targetLanguage === 'ru-RU' || result.targetLanguage === 'ru';
      const options = {
        language: result.targetLanguage,
        pitch: isRussian ? 0.95 : 1.0,  // Русский чуть ниже
        rate: isRussian ? 0.92 : 0.9,    // Русский немного быстрее
        onDone: () => setIsSpeaking(false),
        onError: () => setIsSpeaking(false),
      };

      await Speech.speak(result.translatedText, options);
    } catch (error) {
      console.error('Speech error:', error);
      setIsSpeaking(false);
      Alert.alert(texts.error, 'Failed to speak text');
    }
  };

  const handleCopy = () => {
    Clipboard.setString(result.translatedText);
    Alert.alert(texts.vtCopied, texts.vtCopiedMessage);
  };

  const handleShare = async () => {
    try {
      let shareText = `📸 Visual Translator\n\n`;

      if (result.method === 'ocr' && result.originalText) {
        shareText += `Original: ${result.originalText}\n\n`;
      }

      if (result.aiDescription) {
        shareText += `AI Description: ${result.aiDescription.description}\n\n`;
      }

      shareText += `Translation: ${result.translatedText}\n\n`;
      shareText += `Translated with Turkmen Phrasebook`;

      await Share.share({
        message: shareText,
      });
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  const handleNewPhoto = () => {
    navigation.goBack();
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      food: '🍔',
      clothing: '👕',
      document: '📄',
      sign: '🪧',
      product: '📦',
      nature: '🌿',
      building: '🏢',
      person: '👤',
      other: '📷',
    };

    return icons[category] || '📷';
  };

  const getCategoryColor = (category: string): string => {
    const colors: Record<string, string> = {
      food: '#F59E0B',
      clothing: '#EC4899',
      document: '#3B82F6',
      sign: '#8B5CF6',
      product: '#10B981',
      nature: '#22C55E',
      building: '#64748B',
      person: '#6366F1',
      other: '#9CA3AF',
    };

    return colors[category] || '#9CA3AF';
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={DesignColors.background}
        translucent={false}
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Text style={styles.headerEmoji}>⬅️</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{texts.vtResult}</Text>
        <TouchableOpacity
          style={styles.shareButton}
          onPress={handleShare}
          activeOpacity={0.7}
        >
          <Text style={styles.headerEmoji}>📤</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Image Thumbnail */}
        {result.imageUri && (
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: result.imageUri }}
              style={styles.image}
              resizeMode="cover"
            />
          </View>
        )}

        {/* AI Category Badge (если есть) */}
        {result.aiDescription && (
          <View
            style={[
              styles.categoryBadge,
              { backgroundColor: getCategoryColor(result.aiDescription.category) + '20' },
            ]}
          >
            <Text style={styles.categoryIcon}>
              {getCategoryIcon(result.aiDescription.category)}
            </Text>
            <Text
              style={[
                styles.categoryText,
                { color: getCategoryColor(result.aiDescription.category) },
              ]}
            >
              {result.aiDescription.category.charAt(0).toUpperCase() +
                result.aiDescription.category.slice(1)}
            </Text>
            <Text style={styles.confidenceText}>
              {Math.round(result.aiDescription.confidence * 100)}%
            </Text>
          </View>
        )}

        {/* Original Text (если был распознан OCR) */}
        {result.method === 'ocr' && result.originalText && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardEmoji}>📝</Text>
              <Text style={styles.cardTitle}>{texts.vtRecognizedText}</Text>
            </View>
            <Text style={styles.originalText}>{result.originalText}</Text>
            <Text style={styles.languageLabel}>
              {texts.vtLanguageLabel}{result.sourceLanguage.toUpperCase()}
            </Text>
          </View>
        )}

        {/* AI Description (если текста не было) */}
        {result.aiDescription && !result.originalText && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardEmoji}>✨</Text>
              <Text style={styles.cardTitle}>{texts.vtAiAnalysis}</Text>
            </View>
            <Text style={styles.aiDescription}>{result.aiDescription.description}</Text>
          </View>
        )}

        {/* Translation */}
        <View style={[styles.card, styles.translationCard]}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardEmoji}>🌍</Text>
            <Text style={styles.cardTitle}>{texts.vtTranslation}</Text>
          </View>
          <Text style={styles.translatedText}>{result.translatedText}</Text>
          <Text style={styles.languageLabel}>
            {texts.vtTargetLabel}{result.targetLanguage.toUpperCase()}
          </Text>
        </View>

        {/* Actions */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[styles.actionButton, styles.primaryAction]}
            onPress={handleSpeak}
            activeOpacity={0.7}
          >
            <Text style={styles.actionEmoji}>
              {isSpeaking ? '⏹️' : '🔊'}
            </Text>
            <Text style={styles.actionButtonText}>
              {isSpeaking ? texts.vtStop : texts.vtPlay}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.secondaryAction]}
            onPress={handleCopy}
            activeOpacity={0.7}
          >
            <Text style={styles.actionEmojiSecondary}>📋</Text>
            <Text style={styles.actionButtonTextSecondary}>{texts.vtCopy}</Text>
          </TouchableOpacity>

          {/* Save будет в Phase 6 (Favorites Hub) */}
        </View>

        {/* New Photo Button */}
        <TouchableOpacity
          style={styles.newPhotoButton}
          onPress={handleNewPhoto}
          activeOpacity={0.8}
        >
          <Text style={styles.newPhotoEmoji}>📷</Text>
          <Text style={styles.newPhotoButtonText}>{texts.vtTranslateAnother}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DesignColors.background,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(12),
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: scale(4),
  },
  headerTitle: {
    fontSize: moderateScale(18),
    fontWeight: '700',
    color: '#111827',
  },
  shareButton: {
    padding: scale(4),
  },
  headerEmoji: {
    fontSize: moderateScale(24),
  },
  scrollContent: {
    paddingBottom: verticalScale(40),
  },
  imageContainer: {
    margin: scale(20),
    borderRadius: scale(16),
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: verticalScale(2) },
    shadowOpacity: 0.1,
    shadowRadius: scale(8),
    elevation: 3,
  },
  image: {
    width: '100%',
    height: verticalScale(200),
    backgroundColor: '#F3F4F6',
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(8),
    borderRadius: scale(20),
    marginBottom: verticalScale(16),
    gap: scale(8),
  },
  categoryIcon: {
    fontSize: moderateScale(16),
  },
  categoryText: {
    fontSize: moderateScale(14),
    fontWeight: '600',
  },
  confidenceText: {
    fontSize: moderateScale(12),
    color: '#64748B',
    marginLeft: scale(4),
  },
  card: {
    marginHorizontal: scale(20),
    marginBottom: verticalScale(16),
    padding: scale(20),
    backgroundColor: '#F9FAFB',
    borderRadius: scale(16),
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  translationCard: {
    backgroundColor: '#ECFDF5',
    borderColor: '#10B981',
    borderWidth: 2,
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
    color: '#64748B',
    textTransform: 'uppercase',
  },
  cardEmoji: {
    fontSize: moderateScale(20),
  },
  originalText: {
    fontSize: moderateScale(16),
    lineHeight: moderateScale(24),
    color: '#111827',
    marginBottom: verticalScale(8),
  },
  aiDescription: {
    fontSize: moderateScale(16),
    lineHeight: moderateScale(24),
    color: '#111827',
  },
  translatedText: {
    fontSize: moderateScale(20),
    fontWeight: '600',
    lineHeight: moderateScale(32),
    color: '#111827',
    marginBottom: verticalScale(8),
  },
  languageLabel: {
    fontSize: moderateScale(12),
    color: '#64748B',
    fontWeight: '500',
  },
  actionsContainer: {
    flexDirection: 'row',
    paddingHorizontal: scale(20),
    marginTop: verticalScale(8),
    gap: scale(12),
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(14),
    borderRadius: scale(12),
    gap: scale(8),
  },
  primaryAction: {
    backgroundColor: '#6366F1',
  },
  secondaryAction: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#6366F1',
  },
  actionButtonText: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    color: '#FFFFFF',
  },
  actionButtonTextSecondary: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    color: '#6366F1',
  },
  actionEmoji: {
    fontSize: moderateScale(20),
  },
  actionEmojiSecondary: {
    fontSize: moderateScale(20),
  },
  newPhotoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: scale(20),
    marginTop: verticalScale(24),
    paddingVertical: verticalScale(16),
    backgroundColor: '#F0F4FF',
    borderRadius: scale(16),
    borderWidth: 2,
    borderColor: '#6366F1',
    borderStyle: 'dashed',
    gap: scale(12),
  },
  newPhotoButtonText: {
    fontSize: moderateScale(18),
    fontWeight: '600',
    color: '#6366F1',
  },
  newPhotoEmoji: {
    fontSize: moderateScale(24),
  },
});
