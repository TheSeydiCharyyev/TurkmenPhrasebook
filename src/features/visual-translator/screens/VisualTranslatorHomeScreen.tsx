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
import { Ionicons } from '@expo/vector-icons';
import { scale, verticalScale, moderateScale } from '../../../utils/ResponsiveUtils';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
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

  // ✅ SECURITY FIX: Validate image before processing
  const validateImage = async (imageUri: string): Promise<{ valid: boolean; error?: string }> => {
    try {
      // Check file exists and get info
      const fileInfo = await FileSystem.getInfoAsync(imageUri);

      if (!fileInfo.exists) {
        return { valid: false, error: 'File does not exist' };
      }

      // Validate file size (max 5MB)
      const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
      if (fileInfo.size && fileInfo.size > MAX_FILE_SIZE) {
        return {
          valid: false,
          error: `Image too large (${(fileInfo.size / 1024 / 1024).toFixed(1)}MB). Maximum size is 5MB.`
        };
      }

      // Validate file extension
      const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
      const extension = imageUri.toLowerCase().substring(imageUri.lastIndexOf('.'));
      if (!validExtensions.includes(extension)) {
        return { valid: false, error: 'Invalid image format. Supported: JPG, PNG, GIF, BMP, WebP' };
      }

      return { valid: true };
    } catch (error) {
      console.error('Image validation error:', error);
      return { valid: false, error: 'Failed to validate image' };
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
        // ✅ SECURITY FIX: Validate image before processing
        const validation = await validateImage(result.assets[0].uri);
        if (!validation.valid) {
          Alert.alert('Invalid Image', validation.error || 'Please select a valid image');
          return;
        }
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
        // ✅ SECURITY FIX: Validate image before processing
        const validation = await validateImage(result.assets[0].uri);
        if (!validation.valid) {
          Alert.alert('Invalid Image', validation.error || 'Please select a valid image');
          return;
        }
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
      const ocrResult = await OCRService.recognizeText(imageUri);

      let translationResult: TranslationResult;

      if (ocrResult.text.trim().length > 0) {
        // Текст найден - переводим его

        // Проверяем, нужен ли перевод (если язык источника совпадает с целевым)
        const sourceLanguage = ocrResult.language === 'unknown' ? 'auto' : ocrResult.language;
        const needsTranslation = sourceLanguage === 'auto' || sourceLanguage !== selectedLanguage;

        let translatedText: string;
        if (needsTranslation) {
          translatedText = await TranslationService.translate(
            ocrResult.text,
            sourceLanguage,
            selectedLanguage
          );
        } else {
          // Если языки совпадают, просто используем оригинальный текст
          translatedText = ocrResult.text;
        }

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
        <ActivityIndicator size="large" color="#10B981" />
        <Text style={styles.loadingText}>{texts.vtRequestingPermissions}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#FFFFFF"
        translucent={false}
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={moderateScale(24)} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{texts.visualTranslatorTitle}</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.iconContainer}>
            <Ionicons name="camera-outline" size={48} color="#10B981" />
          </View>
          <Text style={styles.heroTitle}>{texts.vtTranslateWithAI}</Text>
          <Text style={styles.heroSubtitle}>
            {texts.vtCameraSubtitle}
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[styles.actionButton, styles.primaryButton]}
            onPress={handleTakePhoto}
            disabled={isProcessing || !hasPermissions}
            activeOpacity={0.8}
          >
            <Ionicons name="camera" size={24} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>{texts.vtTakePhoto}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.secondaryButton]}
            onPress={handlePickImage}
            disabled={isProcessing || !hasPermissions}
            activeOpacity={0.8}
          >
            <Ionicons name="images-outline" size={24} color="#10B981" />
            <Text style={styles.actionButtonTextSecondary}>{texts.vtChooseGallery}</Text>
          </TouchableOpacity>
        </View>

        {/* Processing Indicator */}
        {isProcessing && (
          <View style={styles.processingContainer}>
            <ActivityIndicator size="large" color="#10B981" />
            <Text style={styles.processingText}>{texts.vtProcessing}</Text>
            <Text style={styles.processingSubtext}>
              {texts.vtProcessingSubtext}
            </Text>
          </View>
        )}

        {/* OCR Engine Selector */}
        <View style={styles.ocrEngineSection}>
          <View style={styles.ocrEngineTitleContainer}>
            <Ionicons name="settings-outline" size={20} color="#6B7280" />
            <Text style={styles.ocrEngineTitle}>{texts.vtOcrEngine}</Text>
          </View>
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
            <Ionicons name="chevron-forward" size={20} color="#10B981" />
          </TouchableOpacity>
          <View style={styles.ocrEngineHintContainer}>
            <Ionicons name="information-circle-outline" size={16} color="#9CA3AF" />
            <Text style={styles.ocrEngineHint}>
              {texts.vtAutoFallback}
            </Text>
          </View>
        </View>

        {/* Features List */}
        <View style={styles.featuresSection}>
          <View style={styles.featuresTitleContainer}>
            <Ionicons name="sparkles-outline" size={22} color="#10B981" />
            <Text style={styles.featuresTitle}>{texts.vtFeatures}</Text>
          </View>

          <FeatureItem
            iconName="document-text-outline"
            title={texts.vtFeatureOcrTitle}
            description={texts.vtFeatureOcrDesc}
            color="#10B981"
          />
          <FeatureItem
            iconName="sparkles"
            title={texts.vtFeatureAiTitle}
            description={texts.vtFeatureAiDesc}
            color="#10B981"
          />
          <FeatureItem
            iconName="language-outline"
            title={texts.vtFeatureSmartTitle}
            description={texts.vtFeatureSmartDesc}
            color="#10B981"
          />
          <FeatureItem
            iconName="star-outline"
            title={texts.vtFeatureSaveTitle}
            description={texts.vtFeatureSaveDesc}
            color="#10B981"
          />
        </View>

        {/* Permissions Notice */}
        {!hasPermissions && (
          <View style={styles.permissionsNotice}>
            <Ionicons name="warning-outline" size={32} color="#F59E0B" />
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

// Feature Item Component with Ionicons
interface FeatureItemProps {
  iconName: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  color: string;
}

const FeatureItem: React.FC<FeatureItemProps> = ({ iconName, title, description, color }) => (
  <View style={styles.featureItem}>
    <View style={[styles.featureIconContainer, { backgroundColor: color + '15' }]}>
      <Ionicons name={iconName} size={24} color={color} />
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
    backgroundColor: '#F8F9FA',
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
  scrollContent: {
    paddingBottom: verticalScale(40),
  },
  heroSection: {
    paddingVertical: verticalScale(40),
    paddingHorizontal: scale(24),
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginBottom: verticalScale(8),
  },
  iconContainer: {
    width: scale(80),
    height: verticalScale(80),
    borderRadius: scale(40),
    backgroundColor: '#10B98115',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: verticalScale(20),
  },
  heroTitle: {
    fontSize: moderateScale(24),
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: verticalScale(8),
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: moderateScale(15),
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: moderateScale(22),
  },
  actionsContainer: {
    paddingHorizontal: scale(20),
    paddingTop: verticalScale(16),
    gap: scale(12),
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(16),
    borderRadius: scale(12),
    gap: scale(10),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: verticalScale(2) },
    shadowOpacity: 0.1,
    shadowRadius: scale(4),
    elevation: 2,
  },
  primaryButton: {
    backgroundColor: '#10B981',
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  actionButtonText: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    color: '#FFFFFF',
  },
  actionButtonTextSecondary: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    color: '#10B981',
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
    paddingTop: verticalScale(24),
    backgroundColor: '#FFFFFF',
    marginTop: verticalScale(8),
    paddingBottom: verticalScale(24),
  },
  featuresTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(20),
    gap: scale(8),
  },
  featuresTitle: {
    fontSize: moderateScale(18),
    fontWeight: '700',
    color: '#1F2937',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: verticalScale(16),
  },
  featureIconContainer: {
    width: scale(48),
    height: verticalScale(48),
    borderRadius: scale(12),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: scale(16),
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: moderateScale(15),
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: verticalScale(4),
  },
  featureDescription: {
    fontSize: moderateScale(14),
    color: '#6B7280',
    lineHeight: moderateScale(20),
  },
  permissionsNotice: {
    marginHorizontal: scale(20),
    marginTop: verticalScale(16),
    padding: scale(20),
    backgroundColor: '#FEF3C7',
    borderRadius: scale(12),
    borderWidth: 1,
    borderColor: '#FCD34D',
    alignItems: 'center',
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
    borderRadius: scale(10),
  },
  grantButtonText: {
    fontSize: moderateScale(15),
    fontWeight: '600',
    color: '#FFFFFF',
  },
  // OCR Engine Selector styles
  ocrEngineSection: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(20),
    marginTop: verticalScale(8),
  },
  ocrEngineTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(12),
    gap: scale(8),
  },
  ocrEngineTitle: {
    fontSize: moderateScale(16),
    fontWeight: '700',
    color: '#1F2937',
  },
  ocrEngineCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F9FAFB',
    borderRadius: scale(10),
    padding: scale(16),
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  ocrEngineInfo: {
    flex: 1,
  },
  ocrEngineName: {
    fontSize: moderateScale(15),
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: verticalScale(4),
  },
  ocrEngineSubtext: {
    fontSize: moderateScale(13),
    color: '#6B7280',
    lineHeight: moderateScale(18),
  },
  ocrEngineHintContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: verticalScale(8),
    gap: scale(4),
  },
  ocrEngineHint: {
    fontSize: moderateScale(12),
    color: '#9CA3AF',
  },
});
