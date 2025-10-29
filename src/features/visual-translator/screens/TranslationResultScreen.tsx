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
import { useNavigation, useRoute } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RouteProp } from '@react-navigation/native';
import * as Speech from 'expo-speech';
import type { TranslationResult } from '../types/visual-translator.types';
import type { RootStackParamList } from '../../../types';

type TranslationResultNavigationProp = StackNavigationProp<RootStackParamList, 'TranslationResult'>;
type TranslationResultRouteProp = RouteProp<RootStackParamList, 'TranslationResult'>;

export default function TranslationResultScreen() {
  const navigation = useNavigation<TranslationResultNavigationProp>();
  const route = useRoute<TranslationResultRouteProp>();
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
      Alert.alert('Error', 'Failed to speak text');
    }
  };

  const handleCopy = () => {
    Clipboard.setString(result.translatedText);
    Alert.alert('✅ Copied', 'Translation copied to clipboard');
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
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Result</Text>
        <TouchableOpacity
          style={styles.shareButton}
          onPress={handleShare}
          activeOpacity={0.7}
        >
          <Ionicons name="share-outline" size={24} color="#111827" />
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
              <Ionicons name="text" size={20} color="#6366F1" />
              <Text style={styles.cardTitle}>Recognized Text</Text>
            </View>
            <Text style={styles.originalText}>{result.originalText}</Text>
            <Text style={styles.languageLabel}>
              Language: {result.sourceLanguage.toUpperCase()}
            </Text>
          </View>
        )}

        {/* AI Description (если текста не было) */}
        {result.aiDescription && !result.originalText && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="sparkles" size={20} color="#8B5CF6" />
              <Text style={styles.cardTitle}>AI Analysis</Text>
            </View>
            <Text style={styles.aiDescription}>{result.aiDescription.description}</Text>
          </View>
        )}

        {/* Translation */}
        <View style={[styles.card, styles.translationCard]}>
          <View style={styles.cardHeader}>
            <Ionicons name="language" size={20} color="#10B981" />
            <Text style={styles.cardTitle}>Translation</Text>
          </View>
          <Text style={styles.translatedText}>{result.translatedText}</Text>
          <Text style={styles.languageLabel}>
            Target: {result.targetLanguage.toUpperCase()}
          </Text>
        </View>

        {/* Actions */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[styles.actionButton, styles.primaryAction]}
            onPress={handleSpeak}
            activeOpacity={0.7}
          >
            <Ionicons
              name={isSpeaking ? 'stop-circle' : 'volume-high'}
              size={20}
              color="#FFFFFF"
            />
            <Text style={styles.actionButtonText}>
              {isSpeaking ? 'Stop' : 'Play'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.secondaryAction]}
            onPress={handleCopy}
            activeOpacity={0.7}
          >
            <Ionicons name="copy-outline" size={20} color="#6366F1" />
            <Text style={styles.actionButtonTextSecondary}>Copy</Text>
          </TouchableOpacity>

          {/* Save будет в Phase 6 (Favorites Hub) */}
        </View>

        {/* New Photo Button */}
        <TouchableOpacity
          style={styles.newPhotoButton}
          onPress={handleNewPhoto}
          activeOpacity={0.8}
        >
          <Ionicons name="camera" size={24} color="#6366F1" />
          <Text style={styles.newPhotoButtonText}>Translate Another</Text>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  shareButton: {
    padding: 4,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  imageContainer: {
    margin: 20,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 200,
    backgroundColor: '#F3F4F6',
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 16,
    gap: 8,
  },
  categoryIcon: {
    fontSize: 16,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
  },
  confidenceText: {
    fontSize: 12,
    color: '#64748B',
    marginLeft: 4,
  },
  card: {
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 20,
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
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
    gap: 8,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
    textTransform: 'uppercase',
  },
  originalText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#111827',
    marginBottom: 8,
  },
  aiDescription: {
    fontSize: 16,
    lineHeight: 24,
    color: '#111827',
  },
  translatedText: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 32,
    color: '#111827',
    marginBottom: 8,
  },
  languageLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  actionsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 8,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
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
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  actionButtonTextSecondary: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6366F1',
  },
  newPhotoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    marginTop: 24,
    paddingVertical: 16,
    backgroundColor: '#F0F4FF',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#6366F1',
    borderStyle: 'dashed',
    gap: 12,
  },
  newPhotoButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6366F1',
  },
});
