// src/features/visual-translator/screens/VisualTranslatorHomeScreen.tsx
// Главный экран Visual Translator - точка входа

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { useConfig } from '../../../contexts/ConfigContext';
import OCRService from '../services/OCRService';
import TranslationService from '../services/TranslationService';
import AIService from '../services/AIService';
import type { TranslationResult } from '../types/visual-translator.types';
import type { RootStackParamList } from '../../../types';

type VisualTranslatorNavigationProp = StackNavigationProp<RootStackParamList, 'VisualTranslator'>;

export default function VisualTranslatorHomeScreen() {
  const navigation = useNavigation<VisualTranslatorNavigationProp>();
  const { selectedLanguage } = useConfig();
  const [hasPermissions, setHasPermissions] = useState<boolean | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    try {
      const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
      const { status: mediaStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      setHasPermissions(cameraStatus === 'granted' && mediaStatus === 'granted');
    } catch (error) {
      console.error('Permissions error:', error);
      setHasPermissions(false);
    }
  };

  const handleTakePhoto = async () => {
    if (!hasPermissions) {
      Alert.alert(
        'Permissions Required',
        'Camera permission is required to take photos.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Grant', onPress: requestPermissions },
        ]
      );
      return;
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
        allowsEditing: false,
      });

      if (!result.canceled && result.assets[0]) {
        await processImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Camera error:', error);
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    }
  };

  const handlePickImage = async () => {
    if (!hasPermissions) {
      Alert.alert(
        'Permissions Required',
        'Photo library permission is required.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Grant', onPress: requestPermissions },
        ]
      );
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
        allowsEditing: false,
      });

      if (!result.canceled && result.assets[0]) {
        await processImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Image picker error:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const processImage = async (imageUri: string) => {
    setIsProcessing(true);

    try {
      // 1. OCR - распознаём текст
      console.log('[VisualTranslator] Starting OCR...');
      const ocrResult = await OCRService.recognizeText(imageUri);

      let translationResult: TranslationResult;

      if (ocrResult.text.trim().length > 0) {
        // Текст найден - переводим его
        console.log('[VisualTranslator] Text found, translating...');
        const translatedText = await TranslationService.translate(
          ocrResult.text,
          ocrResult.language === 'unknown' ? 'auto' : ocrResult.language,
          selectedLanguage
        );

        translationResult = {
          originalText: ocrResult.text,
          translatedText,
          sourceLanguage: ocrResult.language,
          targetLanguage: selectedLanguage,
          timestamp: Date.now(),
          imageUri,
          method: 'ocr',
        };
      } else {
        // Текст не найден - используем AI для описания объекта
        console.log('[VisualTranslator] No text found, using AI description...');
        const aiDescription = await AIService.categorizeImage(imageUri);

        const translatedDescription = await TranslationService.translate(
          aiDescription.description,
          'en', // AI описание всегда на английском
          selectedLanguage
        );

        translationResult = {
          originalText: '',
          translatedText: translatedDescription,
          sourceLanguage: 'image',
          targetLanguage: selectedLanguage,
          aiDescription,
          timestamp: Date.now(),
          imageUri,
          method: 'ai-description',
        };
      }

      // Переход на экран результатов
      navigation.navigate('TranslationResult', { result: translationResult });
    } catch (error) {
      console.error('[VisualTranslator] Processing error:', error);

      let errorMessage = 'Failed to process image. Please try again.';
      if (error instanceof Error) {
        if (error.message.includes('loading')) {
          errorMessage = 'AI model is loading. Please wait a few seconds and try again.';
        } else if (error.message.includes('internet')) {
          errorMessage = 'No internet connection. Please check your connection and try again.';
        }
      }

      Alert.alert('Error', errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  if (hasPermissions === null) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366F1" />
        <Text style={styles.loadingText}>Requesting permissions...</Text>
      </View>
    );
  }

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
        <Text style={styles.headerTitle}>Visual Translator</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section with Gradient */}
        <LinearGradient
          colors={['#6366F1', '#8B5CF6']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroSection}
        >
          <View style={styles.iconContainer}>
            <Text style={styles.heroIcon}>📸</Text>
          </View>
          <Text style={styles.heroTitle}>Translate with AI</Text>
          <Text style={styles.heroSubtitle}>
            Point your camera at any text and get instant translation
          </Text>
        </LinearGradient>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[styles.actionButton, styles.primaryButton]}
            onPress={handleTakePhoto}
            disabled={isProcessing || !hasPermissions}
            activeOpacity={0.8}
          >
            <Ionicons name="camera" size={28} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Take Photo</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.secondaryButton]}
            onPress={handlePickImage}
            disabled={isProcessing || !hasPermissions}
            activeOpacity={0.8}
          >
            <Ionicons name="images" size={28} color="#6366F1" />
            <Text style={styles.actionButtonTextSecondary}>Choose from Gallery</Text>
          </TouchableOpacity>
        </View>

        {/* Processing Indicator */}
        {isProcessing && (
          <View style={styles.processingContainer}>
            <ActivityIndicator size="large" color="#6366F1" />
            <Text style={styles.processingText}>Processing image...</Text>
            <Text style={styles.processingSubtext}>
              Recognizing text and translating
            </Text>
          </View>
        )}

        {/* Features List */}
        <View style={styles.featuresSection}>
          <Text style={styles.featuresTitle}>✨ Features</Text>

          <FeatureItem
            icon="text"
            title="OCR Text Recognition"
            description="Recognizes text in 30+ languages with high accuracy"
          />
          <FeatureItem
            icon="sparkles"
            title="AI Object Description"
            description="Describes objects when no text is found"
          />
          <FeatureItem
            icon="language"
            title="Smart Translation"
            description="Context-aware translation powered by AI"
          />
          <FeatureItem
            icon="bookmark"
            title="Save & Share"
            description="Save translations to favorites and share with others"
          />
        </View>

        {/* Permissions Notice */}
        {!hasPermissions && (
          <View style={styles.permissionsNotice}>
            <Ionicons name="alert-circle-outline" size={24} color="#F59E0B" />
            <Text style={styles.permissionsText}>
              Camera and photo library permissions are required to use this feature.
            </Text>
            <TouchableOpacity
              style={styles.grantButton}
              onPress={requestPermissions}
            >
              <Text style={styles.grantButtonText}>Grant Permissions</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// Feature Item Component
interface FeatureItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
}

const FeatureItem: React.FC<FeatureItemProps> = ({ icon, title, description }) => (
  <View style={styles.featureItem}>
    <View style={styles.featureIconContainer}>
      <Ionicons name={icon} size={24} color="#6366F1" />
    </View>
    <View style={styles.featureContent}>
      <Text style={styles.featureTitle}>{title}</Text>
      <Text style={styles.featureDescription}>{description}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#64748B',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#6366F1',
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
  scrollContent: {
    paddingBottom: 40,
  },
  heroSection: {
    paddingVertical: 48,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  heroIcon: {
    fontSize: 40,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 24,
  },
  actionsContainer: {
    paddingHorizontal: 20,
    paddingTop: 24,
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 16,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  primaryButton: {
    backgroundColor: '#6366F1',
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#6366F1',
  },
  actionButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  actionButtonTextSecondary: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6366F1',
  },
  processingContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  processingText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  processingSubtext: {
    marginTop: 4,
    fontSize: 14,
    color: '#64748B',
  },
  featuresSection: {
    paddingHorizontal: 20,
    paddingTop: 32,
  },
  featuresTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  featureIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#F0F4FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
  },
  permissionsNotice: {
    marginHorizontal: 20,
    marginTop: 24,
    padding: 20,
    backgroundColor: '#FEF3C7',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FCD34D',
    alignItems: 'center',
  },
  permissionsText: {
    marginTop: 12,
    fontSize: 14,
    color: '#92400E',
    textAlign: 'center',
    lineHeight: 20,
  },
  grantButton: {
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#F59E0B',
    borderRadius: 12,
  },
  grantButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
