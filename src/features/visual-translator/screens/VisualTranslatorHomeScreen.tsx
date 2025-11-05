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
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { DesignColors } from '../../../constants/Design';
import { scale, verticalScale, moderateScale } from '../../../utils/ResponsiveUtils';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { useConfig } from '../../../contexts/ConfigContext';
import { useAppLanguage } from '../../../contexts/LanguageContext';
import OCRService from '../services/OCRService';
import TranslationService from '../services/TranslationService';
import AIService from '../services/AIService';
import OCREngineSelector from '../components/OCREngineSelector';
import type { TranslationResult, OCREngine } from '../types/visual-translator.types';
import type { RootStackParamList } from '../../../types';

type VisualTranslatorNavigationProp = StackNavigationProp<RootStackParamList, 'VisualTranslator'>;

export default function VisualTranslatorHomeScreen() {
  const navigation = useNavigation<VisualTranslatorNavigationProp>();
  const { selectedLanguage } = useConfig();
  const { getTexts } = useAppLanguage();
  const texts = getTexts();
  const [hasPermissions, setHasPermissions] = useState<boolean | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showEngineSelector, setShowEngineSelector] = useState(false);
  const [selectedEngine, setSelectedEngine] = useState<OCREngine>(OCRService.getSelectedEngine());

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
        <Text style={styles.loadingText}>{texts.vtRequestingPermissions}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#6366F1"
        translucent={false}
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{texts.visualTranslatorTitle}</Text>
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
          <Text style={styles.heroTitle}>{texts.vtTranslateWithAI}</Text>
          <Text style={styles.heroSubtitle}>
            {texts.vtCameraSubtitle}
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
            <Text style={styles.buttonEmoji}>📷</Text>
            <Text style={styles.actionButtonText}>{texts.vtTakePhoto}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.secondaryButton]}
            onPress={handlePickImage}
            disabled={isProcessing || !hasPermissions}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonEmojiSecondary}>🖼️</Text>
            <Text style={styles.actionButtonTextSecondary}>{texts.vtChooseGallery}</Text>
          </TouchableOpacity>
        </View>

        {/* Processing Indicator */}
        {isProcessing && (
          <View style={styles.processingContainer}>
            <ActivityIndicator size="large" color="#6366F1" />
            <Text style={styles.processingText}>{texts.vtProcessing}</Text>
            <Text style={styles.processingSubtext}>
              {texts.vtProcessingSubtext}
            </Text>
          </View>
        )}

        {/* OCR Engine Selector */}
        <View style={styles.ocrEngineSection}>
          <Text style={styles.ocrEngineTitle}>⚙️ {texts.vtOcrEngine}</Text>
          <TouchableOpacity
            style={styles.ocrEngineCard}
            onPress={() => setShowEngineSelector(true)}
            activeOpacity={0.7}
          >
            <View style={styles.ocrEngineInfo}>
              <Text style={styles.ocrEngineName}>
                {getEngineName(selectedEngine)}
              </Text>
              <Text style={styles.ocrEngineSubtext}>
                {getEngineDescription(selectedEngine)}
              </Text>
            </View>
            <Text style={styles.chevronEmoji}>➡️</Text>
          </TouchableOpacity>
          <Text style={styles.ocrEngineHint}>
            💡 {texts.vtAutoFallback}
          </Text>
        </View>

        {/* Features List */}
        <View style={styles.featuresSection}>
          <Text style={styles.featuresTitle}>✨ {texts.vtFeatures}</Text>

          <FeatureItemEmoji
            emoji="📝"
            title={texts.vtFeatureOcrTitle}
            description={texts.vtFeatureOcrDesc}
            color="#6366F1"
          />
          <FeatureItemEmoji
            emoji="✨"
            title={texts.vtFeatureAiTitle}
            description={texts.vtFeatureAiDesc}
            color="#8B5CF6"
          />
          <FeatureItemEmoji
            emoji="🌍"
            title={texts.vtFeatureSmartTitle}
            description={texts.vtFeatureSmartDesc}
            color="#10B981"
          />
          <FeatureItemEmoji
            emoji="⭐"
            title={texts.vtFeatureSaveTitle}
            description={texts.vtFeatureSaveDesc}
            color="#F59E0B"
          />
        </View>

        {/* Permissions Notice */}
        {!hasPermissions && (
          <View style={styles.permissionsNotice}>
            <Text style={styles.permissionsIcon}>⚠️</Text>
            <Text style={styles.permissionsText}>
              {texts.vtPermissionsText}
            </Text>
            <TouchableOpacity
              style={styles.grantButton}
              onPress={requestPermissions}
            >
              <Text style={styles.grantButtonText}>{texts.vtGrantPermissions}</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* OCR Engine Selector Modal */}
      <OCREngineSelector
        visible={showEngineSelector}
        onClose={() => setShowEngineSelector(false)}
        onEngineSelect={(engine) => setSelectedEngine(engine)}
      />
    </View>
  );
}

// Helper functions for OCR Engine display
function getEngineName(engine: OCREngine): string {
  switch (engine) {
    case 'ml_kit':
      return 'ML Kit (Recommended) 🔒';
    case 'ocr_space':
      return 'OCR.space 🌐';
    case 'google_vision':
      return 'Google Cloud Vision ⭐';
    default:
      return 'ML Kit';
  }
}

function getEngineDescription(engine: OCREngine): string {
  switch (engine) {
    case 'ml_kit':
      return 'Fast, offline, works without internet';
    case 'ocr_space':
      return 'Free online OCR, 25K requests/month';
    case 'google_vision':
      return 'Premium, most accurate, requires API key';
    default:
      return 'Offline text recognition';
  }
}

// Feature Item Component with Emoji
interface FeatureItemEmojiProps {
  emoji: string;
  title: string;
  description: string;
  color: string;
}

const FeatureItemEmoji: React.FC<FeatureItemEmojiProps> = ({ emoji, title, description, color }) => (
  <View style={styles.featureItem}>
    <View style={[styles.featureIconContainer, { backgroundColor: color + '15' }]}>
      <Text style={styles.featureEmoji}>{emoji}</Text>
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
    backgroundColor: DesignColors.background,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  loadingText: {
    marginTop: verticalScale(16),
    fontSize: moderateScale(16),
    color: '#64748B',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(12),
    backgroundColor: '#6366F1',
  },
  backButton: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(20),
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: {
    fontSize: moderateScale(18),
    fontWeight: '700',
    color: '#FFFFFF',
  },
  placeholder: {
    width: scale(32),
  },
  scrollContent: {
    paddingBottom: verticalScale(40),
  },
  heroSection: {
    paddingVertical: verticalScale(48),
    paddingHorizontal: scale(24),
    alignItems: 'center',
  },
  iconContainer: {
    width: scale(80),
    height: verticalScale(80),
    borderRadius: scale(24),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: verticalScale(24),
  },
  heroIcon: {
    fontSize: moderateScale(40),
  },
  heroTitle: {
    fontSize: moderateScale(28),
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: verticalScale(12),
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: moderateScale(16),
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: moderateScale(24),
  },
  actionsContainer: {
    paddingHorizontal: scale(20),
    paddingTop: verticalScale(24),
    gap: scale(12),
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(18),
    borderRadius: scale(16),
    gap: scale(12),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: verticalScale(2) },
    shadowOpacity: 0.1,
    shadowRadius: scale(8),
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
  buttonEmoji: {
    fontSize: moderateScale(28),
  },
  buttonEmojiSecondary: {
    fontSize: moderateScale(28),
  },
  actionButtonText: {
    fontSize: moderateScale(18),
    fontWeight: '600',
    color: '#FFFFFF',
  },
  actionButtonTextSecondary: {
    fontSize: moderateScale(18),
    fontWeight: '600',
    color: '#6366F1',
  },
  processingContainer: {
    alignItems: 'center',
    paddingVertical: verticalScale(32),
  },
  processingText: {
    marginTop: verticalScale(16),
    fontSize: moderateScale(16),
    fontWeight: '600',
    color: '#111827',
  },
  processingSubtext: {
    marginTop: verticalScale(4),
    fontSize: moderateScale(14),
    color: '#64748B',
  },
  featuresSection: {
    paddingHorizontal: scale(20),
    paddingTop: verticalScale(32),
  },
  featuresTitle: {
    fontSize: moderateScale(20),
    fontWeight: '700',
    color: '#111827',
    marginBottom: verticalScale(20),
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: verticalScale(20),
  },
  featureIconContainer: {
    width: scale(48),
    height: verticalScale(48),
    borderRadius: scale(12),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: scale(16),
  },
  featureEmoji: {
    fontSize: moderateScale(24),
    textAlign: 'center',
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    color: '#111827',
    marginBottom: verticalScale(4),
  },
  featureDescription: {
    fontSize: moderateScale(14),
    color: '#64748B',
    lineHeight: moderateScale(20),
  },
  permissionsNotice: {
    marginHorizontal: scale(20),
    marginTop: verticalScale(24),
    padding: scale(20),
    backgroundColor: '#FEF3C7',
    borderRadius: scale(16),
    borderWidth: 1,
    borderColor: '#FCD34D',
    alignItems: 'center',
  },
  permissionsIcon: {
    fontSize: moderateScale(32),
  },
  permissionsText: {
    marginTop: verticalScale(12),
    fontSize: moderateScale(14),
    color: '#92400E',
    textAlign: 'center',
    lineHeight: moderateScale(20),
  },
  grantButton: {
    marginTop: verticalScale(16),
    paddingHorizontal: scale(24),
    paddingVertical: verticalScale(12),
    backgroundColor: '#F59E0B',
    borderRadius: scale(12),
  },
  grantButtonText: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    color: '#FFFFFF',
  },
  // OCR Engine Selector styles
  ocrEngineSection: {
    marginHorizontal: scale(20),
    marginTop: verticalScale(24),
    marginBottom: verticalScale(8),
  },
  ocrEngineTitle: {
    fontSize: moderateScale(16),
    fontWeight: '700',
    color: '#111827',
    marginBottom: verticalScale(12),
  },
  ocrEngineCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: scale(12),
    padding: scale(16),
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: verticalScale(1) },
    shadowOpacity: 0.05,
    shadowRadius: scale(3),
    elevation: 2,
  },
  ocrEngineInfo: {
    flex: 1,
  },
  ocrEngineName: {
    fontSize: moderateScale(15),
    fontWeight: '600',
    color: '#111827',
    marginBottom: verticalScale(4),
  },
  ocrEngineSubtext: {
    fontSize: moderateScale(13),
    color: '#6B7280',
    lineHeight: moderateScale(18),
  },
  ocrEngineHint: {
    marginTop: verticalScale(8),
    fontSize: moderateScale(12),
    color: '#9CA3AF',
    textAlign: 'center',
  },
  chevronEmoji: {
    fontSize: moderateScale(18),
  },
});
