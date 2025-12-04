// src/screens/ComingSoonScreen.tsx
// Universal Coming Soon screen for unreleased features (Visual Translator v1.5, Voice Translator v2.0)

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppLanguage } from '../contexts/LanguageContext';
import { scale, verticalScale, moderateScale } from '../utils/ResponsiveUtils';
import type { RootStackParamList } from '../types';

type ComingSoonRouteProp = RouteProp<RootStackParamList, 'ComingSoon'>;

// Feature configurations
const FEATURE_CONFIG = {
  voice: {
    version: '2.0',
    icon: 'mic' as const,
    gradientColors: ['#8B5CF6', '#A78BFA'] as [string, string],
    accentColor: '#8B5CF6',
    lightAccent: '#EDE9FE',
  },
  visual: {
    version: '1.5',
    icon: 'camera' as const,
    gradientColors: ['#10B981', '#34D399'] as [string, string],
    accentColor: '#10B981',
    lightAccent: '#D1FAE5',
  },
};

export default function ComingSoonScreen() {
  const navigation = useNavigation();
  const route = useRoute<ComingSoonRouteProp>();
  const { getTexts } = useAppLanguage();
  const texts = getTexts();

  const feature = route.params?.feature || 'voice';
  const config = FEATURE_CONFIG[feature];

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const waveAnim1 = useRef(new Animated.Value(0.3)).current;
  const waveAnim2 = useRef(new Animated.Value(0.3)).current;
  const waveAnim3 = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    // Fade in animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // Pulse animation for icon
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Wave animations
    const animateWave = (anim: Animated.Value, delay: number) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, {
            toValue: 0.8,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0.3,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    animateWave(waveAnim1, 0);
    animateWave(waveAnim2, 200);
    animateWave(waveAnim3, 400);
  }, []);

  // Get localized content based on feature
  const getTitle = () => {
    if (feature === 'voice') {
      return texts.voiceTranslatorTitle || 'Voice Translator';
    }
    return texts.visualTranslatorTitle || 'Visual Translator';
  };

  const getComingSoonTitle = () => {
    if (feature === 'voice') {
      return texts.voiceComingSoonTitle || 'Voice Translator is Coming!';
    }
    return texts.visualComingSoonTitle || 'Visual Translator is Coming!';
  };

  const getDescription = () => {
    if (feature === 'voice') {
      return texts.voiceComingSoonDesc || 'We are working hard to bring you an amazing voice translation experience. Stay tuned!';
    }
    return texts.visualComingSoonDesc || 'Translate text from images instantly with AI-powered recognition. Coming soon!';
  };

  const getFeatures = () => {
    if (feature === 'voice') {
      return [
        {
          icon: 'mic-outline' as const,
          text: texts.voiceComingSoonFeature1 || 'Real-time voice recognition',
        },
        {
          icon: 'language-outline' as const,
          text: texts.voiceComingSoonFeature2 || 'Instant translation',
        },
        {
          icon: 'volume-high-outline' as const,
          text: texts.voiceComingSoonFeature3 || 'Text-to-speech playback',
        },
      ];
    }
    return [
      {
        icon: 'camera-outline' as const,
        text: texts.visualComingSoonFeature1 || 'OCR text recognition',
      },
      {
        icon: 'sparkles' as const,
        text: texts.visualComingSoonFeature2 || 'AI-powered translation',
      },
      {
        icon: 'images-outline' as const,
        text: texts.visualComingSoonFeature3 || 'Gallery & camera support',
      },
    ];
  };

  const features = getFeatures();

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={moderateScale(24)} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{getTitle()}</Text>
        <View style={styles.placeholder} />
      </View>

      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        {/* Top Content */}
        <View style={styles.topContent}>
          {/* Animated Icon */}
          <View style={styles.iconContainer}>
            {/* Sound waves background */}
            <View style={styles.wavesContainer}>
              <Animated.View style={[styles.wave, styles.wave1, { opacity: waveAnim1, borderColor: config.accentColor }]} />
              <Animated.View style={[styles.wave, styles.wave2, { opacity: waveAnim2, borderColor: config.accentColor }]} />
              <Animated.View style={[styles.wave, styles.wave3, { opacity: waveAnim3, borderColor: config.accentColor }]} />
            </View>

            <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
              <LinearGradient
                colors={config.gradientColors}
                style={styles.iconCircle}
              >
                <Ionicons name={config.icon} size={moderateScale(48)} color="#FFFFFF" />
              </LinearGradient>
            </Animated.View>
          </View>

          {/* Coming Soon Badge with Version */}
          <View style={styles.badgeContainer}>
            <LinearGradient
              colors={config.gradientColors}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.badge}
            >
              <MaterialCommunityIcons name="clock-outline" size={moderateScale(16)} color="#FFFFFF" />
              <Text style={styles.badgeText}>
                {texts.comingSoonInVersion?.replace('{version}', config.version) || `Coming in v${config.version}`}
              </Text>
            </LinearGradient>
          </View>

          {/* Title & Description */}
          <Text style={styles.title}>{getComingSoonTitle()}</Text>
          <Text style={styles.description}>{getDescription()}</Text>

          {/* Features List */}
          <View style={styles.featuresContainer}>
            {features.map((item, index) => (
              <View key={index} style={styles.featureItem}>
                <View style={[styles.featureIconCircle, { backgroundColor: config.lightAccent }]}>
                  <Ionicons name={item.icon} size={moderateScale(20)} color={config.accentColor} />
                </View>
                <Text style={styles.featureText}>{item.text}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Back Button - всегда внизу */}
        <TouchableOpacity
          style={[styles.mainButton, { backgroundColor: config.accentColor, shadowColor: config.accentColor }]}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <Text style={styles.mainButtonText}>
            {texts.voiceComingSoonButton || 'Back to Home'}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(16),
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
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
  content: {
    flex: 1,
    paddingHorizontal: scale(24),
    paddingTop: verticalScale(16),
    paddingBottom: verticalScale(16),
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  topContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: scale(140),
    height: scale(140),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: verticalScale(16),
  },
  wavesContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  wave: {
    position: 'absolute',
    borderRadius: 1000,
    borderWidth: 2,
  },
  wave1: {
    width: scale(100),
    height: scale(100),
  },
  wave2: {
    width: scale(120),
    height: scale(120),
  },
  wave3: {
    width: scale(140),
    height: scale(140),
  },
  iconCircle: {
    width: scale(80),
    height: scale(80),
    borderRadius: scale(40),
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: verticalScale(8) },
    shadowOpacity: 0.3,
    shadowRadius: scale(16),
    elevation: 10,
  },
  badgeContainer: {
    marginBottom: verticalScale(12),
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(8),
    borderRadius: scale(20),
    gap: scale(6),
  },
  badgeText: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    color: '#FFFFFF',
  },
  title: {
    fontSize: moderateScale(24),
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: verticalScale(8),
    lineHeight: moderateScale(30),
  },
  description: {
    fontSize: moderateScale(15),
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: moderateScale(22),
    marginBottom: verticalScale(20),
    paddingHorizontal: scale(8),
  },
  featuresContainer: {
    width: '100%',
    marginBottom: verticalScale(16),
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    paddingVertical: verticalScale(16),
    paddingHorizontal: scale(20),
    borderRadius: scale(12),
    marginBottom: verticalScale(12),
  },
  featureIconCircle: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(20),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: scale(16),
  },
  featureText: {
    flex: 1,
    fontSize: moderateScale(15),
    fontWeight: '500',
    color: '#374151',
  },
  mainButton: {
    width: '100%',
    paddingVertical: verticalScale(16),
    borderRadius: scale(12),
    alignItems: 'center',
    marginBottom: verticalScale(16), // Добавлен отступ снизу
    shadowOffset: { width: 0, height: verticalScale(4) },
    shadowOpacity: 0.2,
    shadowRadius: scale(8),
    elevation: 4,
  },
  mainButtonText: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
