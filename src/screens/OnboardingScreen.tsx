// src/screens/OnboardingScreen.tsx
// HERO + GRID DESIGN - Modern 2025 UI
import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Animated,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useConfig } from '../contexts/ConfigContext';
import { scale, verticalScale, moderateScale } from '../utils/ResponsiveUtils';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface OnboardingSlide {
  id: string;
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  gradient: string[];
  component: React.ReactNode;
}

interface OnboardingScreenProps {
  navigation: any;
  onComplete: () => void;
}

export default function OnboardingScreen({ navigation, onComplete }: OnboardingScreenProps) {
  const { setOnboardingCompleted } = useConfig();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const slides: OnboardingSlide[] = [
    {
      id: '1',
      title: 'Welcome to Şapak',
      subtitle: 'Your AI-powered guide to Turkmen language',
      icon: 'airplane',
      gradient: ['#4F46E5', '#7C3AED'],
      component: <WelcomeSlide />,
    },
    {
      id: '2',
      title: '30 Language Pairs',
      subtitle: 'Offline phrasebook with audio pronunciations',
      icon: 'book',
      gradient: ['#059669', '#10B981'],
      component: <PhrasebookSlide />,
    },
    {
      id: '3',
      title: 'Smart Translation',
      subtitle: 'AI-powered text & visual translation',
      icon: 'language',
      gradient: ['#DC2626', '#F59E0B'],
      component: <TranslatorSlide />,
    },
    {
      id: '4',
      title: 'Dictionary & AI',
      subtitle: 'Smart dictionary and AI assistants',
      icon: 'library',
      gradient: ['#0891B2', '#06B6D4'],
      component: <DictionaryAISlide />,
    },
    {
      id: '5',
      title: "You're All Set!",
      subtitle: 'Start your Turkmen learning journey',
      icon: 'checkmark-circle',
      gradient: ['#7C3AED', '#EC4899'],
      component: <ReadySlide onGetStarted={handleComplete} />,
    },
  ];

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false }
  );

  const handleViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index || 0);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      handleComplete();
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  async function handleComplete() {
    try {
      await setOnboardingCompleted(true);
      if (navigation) {
        // После завершения onboarding переходим на MainHub
        navigation.replace('MainHub');
      } else if (onComplete) {
        onComplete();
      }
    } catch (error) {
      console.error('Failed to save onboarding completion:', error);
    }
  }

  const renderSlide = ({ item }: { item: OnboardingSlide }) => {
    return (
      <View style={styles.slide}>
        <LinearGradient
          colors={item.gradient as readonly [string, string, ...string[]]}
          style={styles.gradientBackground}
        >
          <SafeAreaView style={styles.safeArea}>
            {/* Skip button */}
            {currentIndex < slides.length - 1 && (
              <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
                <Text style={styles.skipText}>Skip</Text>
              </TouchableOpacity>
            )}

            {/* Content */}
            <View style={styles.content}>{item.component}</View>

            {/* Dots Indicator */}
            <View style={styles.footer}>
              <View style={styles.dotsContainer}>
                {slides.map((_, index) => {
                  const inputRange = [
                    (index - 1) * SCREEN_WIDTH,
                    index * SCREEN_WIDTH,
                    (index + 1) * SCREEN_WIDTH,
                  ];

                  const dotWidth = scrollX.interpolate({
                    inputRange,
                    outputRange: [8, 24, 8],
                    extrapolate: 'clamp',
                  });

                  const opacity = scrollX.interpolate({
                    inputRange,
                    outputRange: [0.3, 1, 0.3],
                    extrapolate: 'clamp',
                  });

                  return (
                    <Animated.View
                      key={index}
                      style={[
                        styles.dot,
                        {
                          width: dotWidth,
                          opacity,
                        },
                      ]}
                    />
                  );
                })}
              </View>

              {/* Next Button */}
              {currentIndex < slides.length - 1 && (
                <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                  <Text style={styles.nextButtonText}>Next</Text>
                  <Ionicons name="arrow-forward" size={20} color="#FFF" />
                </TouchableOpacity>
              )}
            </View>
          </SafeAreaView>
        </LinearGradient>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderSlide}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        onViewableItemsChanged={handleViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        scrollEventThrottle={16}
      />
    </View>
  );
}

// ========== Slide Components ==========

function WelcomeSlide() {
  return (
    <View style={styles.slideContent}>
      <Ionicons name="airplane" size={120} color="#FFF" style={styles.slideIcon} />
      <Text style={styles.slideTitle}>Welcome to{'\n'}Şapak</Text>
      <Text style={styles.slideSubtitle}>
        Your AI-powered guide to Turkmen language
      </Text>
    </View>
  );
}

function PhrasebookSlide() {
  const [audioPlaying, setAudioPlaying] = useState(false);

  const handlePlayAudio = () => {
    setAudioPlaying(true);
    setTimeout(() => setAudioPlaying(false), 1000);
  };

  return (
    <View style={styles.slideContent}>
      <Ionicons name="book" size={100} color="#FFF" style={styles.slideIcon} />
      <Text style={styles.slideTitle}>30 Language Pairs</Text>
      <Text style={styles.slideSubtitle}>
        Offline phrasebook with audio pronunciations
      </Text>

      {/* Interactive Demo */}
      <View style={styles.demoBox}>
        <View style={styles.demoRow}>
          <Text style={styles.demoLabel}>Hello</Text>
          <Text style={styles.demoArrow}>→</Text>
          <Text style={styles.demoValue}>Salam</Text>
        </View>
        <TouchableOpacity
          style={[styles.playButton, audioPlaying && styles.playButtonActive]}
          onPress={handlePlayAudio}
        >
          <Ionicons
            name={audioPlaying ? "volume-high" : "play"}
            size={24}
            color="#FFF"
          />
          <Text style={styles.playButtonText}>
            {audioPlaying ? "Playing..." : "Play Audio"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function TranslatorSlide() {
  const [translated, setTranslated] = useState(false);

  return (
    <View style={styles.slideContent}>
      <Ionicons name="language" size={100} color="#FFF" style={styles.slideIcon} />
      <Text style={styles.slideTitle}>Smart Translation</Text>
      <Text style={styles.slideSubtitle}>
        AI-powered text & visual translation
      </Text>

      {/* Interactive Demo */}
      <View style={styles.demoBox}>
        <Text style={styles.demoSectionTitle}>Text Translator</Text>
        <View style={styles.translatorBox}>
          <Text style={styles.translatorInput}>How are you?</Text>
          {translated && (
            <>
              <Ionicons name="arrow-down" size={24} color="rgba(255,255,255,0.5)" />
              <Text style={styles.translatorOutput}>Nähili?</Text>
            </>
          )}
        </View>
        <TouchableOpacity
          style={styles.translateButton}
          onPress={() => setTranslated(!translated)}
        >
          <Text style={styles.translateButtonText}>
            {translated ? "Try Again" : "Translate"}
          </Text>
        </TouchableOpacity>

        <View style={styles.featureRow}>
          <Ionicons name="camera" size={24} color="#FFF" />
          <Text style={styles.featureText}>Visual Translator</Text>
        </View>
        <View style={styles.featureRow}>
          <Ionicons name="sparkles" size={24} color="#FFF" />
          <Text style={styles.featureText}>AI-powered</Text>
        </View>
      </View>
    </View>
  );
}

function DictionaryAISlide() {
  return (
    <View style={styles.slideContent}>
      <Ionicons name="library" size={100} color="#FFF" style={styles.slideIcon} />
      <Text style={styles.slideTitle}>Dictionary & AI</Text>
      <Text style={styles.slideSubtitle}>
        Smart dictionary and AI assistants
      </Text>

      {/* Features List */}
      <View style={styles.featuresContainer}>
        <View style={styles.featureItem}>
          <Ionicons name="book-outline" size={32} color="#FFF" />
          <Text style={styles.featureTitle}>Smart Dictionary</Text>
          <Text style={styles.featureDescription}>
            Thousands of words at your fingertips
          </Text>
        </View>

        <View style={styles.featureItem}>
          <Ionicons name="chatbubbles" size={32} color="#FFF" />
          <Text style={styles.featureTitle}>AI Assistants</Text>
          <Text style={styles.featureDescription}>
            5 specialized AI helpers for learning
          </Text>
        </View>
      </View>
    </View>
  );
}

function ReadySlide({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <View style={styles.slideContent}>
      <Ionicons name="checkmark-circle" size={120} color="#FFF" style={styles.slideIcon} />
      <Text style={styles.slideTitle}>You're All Set!</Text>
      <Text style={styles.slideSubtitle}>
        Start your Turkmen learning journey now
      </Text>

      <TouchableOpacity style={styles.getStartedButton} onPress={onGetStarted}>
        <Text style={styles.getStartedButtonText}>Get Started</Text>
        <Ionicons name="rocket" size={26} color="#7C3AED" />
      </TouchableOpacity>

      <View style={styles.featuresGrid}>
        <Text style={styles.readyFeature}>📖 Phrasebook</Text>
        <Text style={styles.readyFeature}>🤖 AI Translation</Text>
        <Text style={styles.readyFeature}>📷 Visual Translator</Text>
        <Text style={styles.readyFeature}>📚 Dictionary</Text>
        <Text style={styles.readyFeature}>💬 AI Assistants</Text>
        <Text style={styles.readyFeature}>✈️ Works Offline</Text>
      </View>
    </View>
  );
}

// ========== Styles ==========

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  slide: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  gradientBackground: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  skipButton: {
    position: 'absolute',
    top: verticalScale(60),
    right: scale(20),
    zIndex: 10,
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(10),
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: moderateScale(24),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  skipText: {
    color: '#FFF',
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: scale(20),
  },
  slideContent: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  slideIcon: {
    marginBottom: verticalScale(32),
  },
  slideTitle: {
    fontSize: moderateScale(32),
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
    marginBottom: verticalScale(16),
  },
  slideSubtitle: {
    fontSize: moderateScale(18),
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: verticalScale(32),
  },
  footer: {
    paddingBottom: verticalScale(40),
    paddingHorizontal: scale(20),
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: verticalScale(20),
    height: verticalScale(30),
  },
  dot: {
    height: verticalScale(8),
    borderRadius: moderateScale(4),
    backgroundColor: '#FFF',
    marginHorizontal: scale(4),
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingVertical: verticalScale(18),
    paddingHorizontal: scale(40),
    borderRadius: moderateScale(32),
    gap: scale(10),
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  nextButtonText: {
    color: '#FFF',
    fontSize: moderateScale(19),
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  // Demo Components
  demoBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: moderateScale(20),
    padding: scale(24),
    width: '100%',
    marginTop: verticalScale(20),
  },
  demoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: verticalScale(20),
  },
  demoLabel: {
    fontSize: moderateScale(24),
    color: '#FFF',
    fontWeight: '600',
  },
  demoArrow: {
    fontSize: moderateScale(24),
    color: 'rgba(255, 255, 255, 0.7)',
    marginHorizontal: scale(16),
  },
  demoValue: {
    fontSize: moderateScale(24),
    color: '#FFF',
    fontWeight: '600',
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(24),
    borderRadius: moderateScale(25),
    gap: scale(8),
  },
  playButtonActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  playButtonText: {
    color: '#FFF',
    fontSize: moderateScale(16),
    fontWeight: '600',
  },
  demoSectionTitle: {
    fontSize: moderateScale(18),
    color: '#FFF',
    fontWeight: '600',
    marginBottom: verticalScale(12),
    textAlign: 'center',
  },
  translatorBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: moderateScale(12),
    padding: scale(16),
    marginBottom: verticalScale(16),
    alignItems: 'center',
  },
  translatorInput: {
    fontSize: moderateScale(20),
    color: '#FFF',
    marginBottom: verticalScale(8),
  },
  translatorOutput: {
    fontSize: moderateScale(20),
    color: '#FFF',
    fontWeight: '600',
    marginTop: verticalScale(8),
  },
  translateButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(24),
    borderRadius: moderateScale(20),
    marginBottom: verticalScale(20),
  },
  translateButtonText: {
    color: '#FFF',
    fontSize: moderateScale(16),
    fontWeight: '600',
    textAlign: 'center',
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(12),
    marginVertical: verticalScale(8),
  },
  featureText: {
    color: '#FFF',
    fontSize: moderateScale(16),
  },
  featuresContainer: {
    width: '100%',
    gap: verticalScale(24),
    marginTop: verticalScale(20),
  },
  featureItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: moderateScale(16),
    padding: scale(20),
    alignItems: 'center',
  },
  featureTitle: {
    fontSize: moderateScale(20),
    fontWeight: '600',
    color: '#FFF',
    marginTop: verticalScale(12),
    marginBottom: verticalScale(8),
  },
  featureDescription: {
    fontSize: moderateScale(14),
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  getStartedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    paddingVertical: verticalScale(20),
    paddingHorizontal: scale(48),
    borderRadius: moderateScale(32),
    gap: scale(12),
    marginTop: verticalScale(32),
    marginBottom: verticalScale(32),
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 16,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  getStartedButtonText: {
    color: '#7C3AED',
    fontSize: moderateScale(22),
    fontWeight: 'bold',
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: scale(12),
    paddingHorizontal: scale(20),
  },
  readyFeature: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: verticalScale(8),
    paddingHorizontal: scale(16),
    borderRadius: moderateScale(20),
    color: '#FFF',
    fontSize: moderateScale(14),
    fontWeight: '500',
  },
});
