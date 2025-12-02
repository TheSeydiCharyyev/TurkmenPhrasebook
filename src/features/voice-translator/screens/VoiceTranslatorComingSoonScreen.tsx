// src/features/voice-translator/screens/VoiceTranslatorComingSoonScreen.tsx
// Beautiful Coming Soon screen for Voice Translator feature

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  StatusBar,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppLanguage } from '../../../contexts/LanguageContext';
import { scale, verticalScale, moderateScale } from '../../../utils/ResponsiveUtils';

const { width } = Dimensions.get('window');

export default function VoiceTranslatorComingSoonScreen() {
  const navigation = useNavigation();
  const { getTexts } = useAppLanguage();
  const texts = getTexts();

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

    // Pulse animation for mic icon
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

  const features = [
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

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
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
        <Text style={styles.headerTitle}>{texts.voiceTranslatorTitle || 'Voice Translator'}</Text>
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
        {/* Animated Microphone Icon */}
        <View style={styles.iconContainer}>
          {/* Sound waves background */}
          <View style={styles.wavesContainer}>
            <Animated.View style={[styles.wave, styles.wave1, { opacity: waveAnim1 }]} />
            <Animated.View style={[styles.wave, styles.wave2, { opacity: waveAnim2 }]} />
            <Animated.View style={[styles.wave, styles.wave3, { opacity: waveAnim3 }]} />
          </View>

          <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            <LinearGradient
              colors={['#8B5CF6', '#A78BFA']}
              style={styles.iconCircle}
            >
              <Ionicons name="mic" size={moderateScale(56)} color="#FFFFFF" />
            </LinearGradient>
          </Animated.View>
        </View>

        {/* Coming Soon Badge */}
        <View style={styles.badgeContainer}>
          <LinearGradient
            colors={['#8B5CF6', '#7C3AED']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.badge}
          >
            <MaterialCommunityIcons name="clock-outline" size={moderateScale(16)} color="#FFFFFF" />
            <Text style={styles.badgeText}>{texts.vtComingSoon || 'Coming Soon'}</Text>
          </LinearGradient>
        </View>

        {/* Title & Description */}
        <Text style={styles.title}>
          {texts.voiceComingSoonTitle || 'Voice Translator is Coming!'}
        </Text>
        <Text style={styles.description}>
          {texts.voiceComingSoonDesc || 'We are working hard to bring you an amazing voice translation experience. Stay tuned!'}
        </Text>

        {/* Features List */}
        <View style={styles.featuresContainer}>
          {features.map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <View style={styles.featureIconCircle}>
                <Ionicons name={feature.icon} size={moderateScale(20)} color="#8B5CF6" />
              </View>
              <Text style={styles.featureText}>{feature.text}</Text>
            </View>
          ))}
        </View>

        {/* Back Button */}
        <TouchableOpacity
          style={styles.mainButton}
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
    paddingTop: verticalScale(40),
    alignItems: 'center',
  },
  iconContainer: {
    width: scale(160),
    height: scale(160),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: verticalScale(24),
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
    borderColor: '#8B5CF6',
  },
  wave1: {
    width: scale(120),
    height: scale(120),
  },
  wave2: {
    width: scale(140),
    height: scale(140),
  },
  wave3: {
    width: scale(160),
    height: scale(160),
  },
  iconCircle: {
    width: scale(100),
    height: scale(100),
    borderRadius: scale(50),
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: verticalScale(8) },
    shadowOpacity: 0.3,
    shadowRadius: scale(16),
    elevation: 10,
  },
  badgeContainer: {
    marginBottom: verticalScale(20),
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
    fontSize: moderateScale(26),
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: verticalScale(12),
    lineHeight: moderateScale(34),
  },
  description: {
    fontSize: moderateScale(16),
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: moderateScale(24),
    marginBottom: verticalScale(32),
    paddingHorizontal: scale(8),
  },
  featuresContainer: {
    width: '100%',
    marginBottom: verticalScale(40),
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
    backgroundColor: '#EDE9FE',
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
    backgroundColor: '#8B5CF6',
    paddingVertical: verticalScale(16),
    borderRadius: scale(12),
    alignItems: 'center',
    shadowColor: '#8B5CF6',
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
