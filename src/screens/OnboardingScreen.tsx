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
import { useAppLanguage } from '../contexts/LanguageContext';
import { scale, verticalScale, moderateScale } from '../utils/ResponsiveUtils';
import { useSafeArea } from '../hooks/useSafeArea';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface OnboardingSlide {
  id: string;
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  gradient: [string, string, ...string[]];
  component: React.ReactNode;
}

interface OnboardingScreenProps {
  navigation: any;
  onComplete: () => void;
}

export default function OnboardingScreen({ navigation, onComplete }: OnboardingScreenProps) {
  const { setOnboardingCompleted } = useConfig();
  const { getTexts } = useAppLanguage();
  const texts = getTexts();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  // Safe Area для bottom padding (home indicator)
  const { bottom: safeAreaBottom } = useSafeArea();

  const slides: OnboardingSlide[] = [
    {
      id: '1',
      title: texts.onboardingWelcomeTitle,
      subtitle: texts.onboardingWelcomeSubtitle,
      icon: 'airplane',
      gradient: ['#FFFFFF', '#FFFFFF'],
      component: <WelcomeSlide />,
    },
    {
      id: '2',
      title: texts.onboardingPhrasebookTitle,
      subtitle: texts.onboardingPhrasebookSubtitle,
      icon: 'book',
      gradient: ['#FFFFFF', '#FFFFFF'],
      component: <PhrasebookSlide />,
    },
    {
      id: '3',
      title: texts.onboardingTranslationTitle,
      subtitle: texts.onboardingTranslationSubtitle,
      icon: 'language',
      gradient: ['#FFFFFF', '#FFFFFF'],
      component: <TranslatorSlide />,
    },
    {
      id: '4',
      title: texts.onboardingDictionaryTitle,
      subtitle: texts.onboardingDictionarySubtitle,
      icon: 'library',
      gradient: ['#FFFFFF', '#FFFFFF'],
      component: <DictionaryAISlide />,
    },
    {
      id: '5',
      title: texts.onboardingReadyTitle,
      subtitle: texts.onboardingReadySubtitle,
      icon: 'checkmark-circle',
      gradient: ['#FFFFFF', '#FFFFFF'],
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
                <Text style={styles.skipText}>{texts.onboardingSkip}</Text>
              </TouchableOpacity>
            )}

            {/* Content */}
            <View style={styles.content}>{item.component}</View>

            {/* Dots Indicator */}
            <View style={[styles.footer, { paddingBottom: Math.max(safeAreaBottom, verticalScale(40)) }]}>
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
                  <Text style={styles.nextButtonText}>{texts.onboardingNext}</Text>
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
  const { getTexts } = useAppLanguage();
  const texts = getTexts();

  return (
    <View style={styles.slideContent}>
      <Ionicons name="airplane" size={100} color="#00A651" style={styles.slideIcon} />
      <Text style={styles.slideTitle}>{texts.onboardingWelcomeTitle}</Text>
      <Text style={styles.slideSubtitle}>
        {texts.onboardingWelcomeSubtitle}
      </Text>
    </View>
  );
}

function PhrasebookSlide() {
  const { getTexts } = useAppLanguage();
  const texts = getTexts();
  const [audioPlaying, setAudioPlaying] = useState(false);

  const handlePlayAudio = () => {
    setAudioPlaying(true);
    setTimeout(() => setAudioPlaying(false), 1000);
  };

  return (
    <View style={styles.slideContent}>
      <Ionicons name="book" size={100} color="#00A651" style={styles.slideIcon} />
      <Text style={styles.slideTitle}>{texts.onboardingPhrasebookTitle}</Text>
      <Text style={styles.slideSubtitle}>
        {texts.onboardingPhrasebookSubtitle}
      </Text>

      {/* Interactive Demo */}
      <View style={styles.demoBox}>
        <View style={styles.demoRow}>
          <Text style={styles.demoLabel}>{texts.onboardingPhrasebookDemo}</Text>
          <Text style={styles.demoArrow}>→</Text>
          <Text style={styles.demoValue}>Salam</Text>
        </View>
        <TouchableOpacity
          style={[styles.playButton, audioPlaying && styles.playButtonActive]}
          onPress={handlePlayAudio}
        >
          <Ionicons
            name={audioPlaying ? "volume-high" : "play"}
            size={20}
            color="#FFFFFF"
          />
          <Text style={styles.playButtonText}>
            {audioPlaying ? texts.onboardingPlaying : texts.onboardingPlayAudio}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function TranslatorSlide() {
  const { getTexts } = useAppLanguage();
  const texts = getTexts();
  const [translated, setTranslated] = useState(false);

  return (
    <View style={styles.slideContent}>
      <Ionicons name="language" size={100} color="#00A651" style={styles.slideIcon} />
      <Text style={styles.slideTitle}>{texts.onboardingTranslationTitle}</Text>
      <Text style={styles.slideSubtitle}>
        {texts.onboardingTranslationSubtitle}
      </Text>

      {/* Interactive Demo */}
      <View style={styles.demoBox}>
        <Text style={styles.demoSectionTitle}>{texts.onboardingTextTranslator}</Text>
        <View style={styles.translatorBox}>
          <Text style={styles.translatorInput}>How are you?</Text>
          {translated && (
            <>
              <Ionicons name="arrow-down" size={24} color="#6E6E73" />
              <Text style={styles.translatorOutput}>Nähili?</Text>
            </>
          )}
        </View>
        <TouchableOpacity
          style={styles.translateButton}
          onPress={() => setTranslated(!translated)}
        >
          <Text style={styles.translateButtonText}>
            {translated ? texts.onboardingTryAgain : texts.onboardingTranslate}
          </Text>
        </TouchableOpacity>

        <View style={styles.featureRow}>
          <Ionicons name="camera" size={22} color="#00A651" />
          <Text style={styles.featureText}>{texts.onboardingVisualTranslator}</Text>
        </View>
        <View style={styles.featureRow}>
          <Ionicons name="sparkles" size={22} color="#00A651" />
          <Text style={styles.featureText}>{texts.onboardingAIPowered}</Text>
        </View>
      </View>
    </View>
  );
}

function DictionaryAISlide() {
  const { getTexts } = useAppLanguage();
  const texts = getTexts();

  return (
    <View style={styles.slideContent}>
      <Ionicons name="library" size={100} color="#00A651" style={styles.slideIcon} />
      <Text style={styles.slideTitle}>{texts.onboardingDictionaryTitle}</Text>
      <Text style={styles.slideSubtitle}>
        {texts.onboardingDictionarySubtitle}
      </Text>

      {/* Features List */}
      <View style={styles.featuresContainer}>
        <View style={styles.featureItem}>
          <Ionicons name="book-outline" size={32} color="#00A651" />
          <Text style={styles.featureTitle}>{texts.onboardingSmartDictionary}</Text>
          <Text style={styles.featureDescription}>
            {texts.onboardingSmartDictionaryDesc}
          </Text>
        </View>

        <View style={styles.featureItem}>
          <Ionicons name="chatbubbles" size={32} color="#00A651" />
          <Text style={styles.featureTitle}>{texts.onboardingAIAssistants}</Text>
          <Text style={styles.featureDescription}>
            {texts.onboardingAIAssistantsDesc}
          </Text>
        </View>
      </View>
    </View>
  );
}

function ReadySlide({ onGetStarted }: { onGetStarted: () => void }) {
  const { getTexts } = useAppLanguage();
  const texts = getTexts();

  return (
    <View style={styles.slideContent}>
      <Ionicons name="checkmark-circle" size={100} color="#00A651" style={styles.slideIcon} />
      <Text style={styles.slideTitle}>{texts.onboardingReadyTitle}</Text>
      <Text style={styles.slideSubtitle}>
        {texts.onboardingReadySubtitle}
      </Text>

      <TouchableOpacity style={styles.getStartedButton} onPress={onGetStarted}>
        <Text style={styles.getStartedButtonText}>{texts.onboardingGetStarted}</Text>
        <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
      </TouchableOpacity>

      <View style={styles.featuresGrid}>
        <Text style={styles.readyFeature}>{texts.onboardingFeaturePhrasebook}</Text>
        <Text style={styles.readyFeature}>{texts.onboardingFeatureAITranslation}</Text>
        <Text style={styles.readyFeature}>{texts.onboardingFeatureVisualTranslator}</Text>
        <Text style={styles.readyFeature}>{texts.onboardingFeatureDictionary}</Text>
        <Text style={styles.readyFeature}>{texts.onboardingFeatureAIAssistants}</Text>
        <Text style={styles.readyFeature}>{texts.onboardingFeatureOffline}</Text>
      </View>
    </View>
  );
}

// ========== Styles ==========

const ACCENT_COLOR = '#00A651'; // Turkmenistan green
const TEXT_PRIMARY = '#1C1C1E'; // Apple dark text
const TEXT_SECONDARY = '#6E6E73'; // Apple gray text
const BACKGROUND = '#FFFFFF'; // White background

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND,
  },
  slide: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  gradientBackground: {
    flex: 1,
    backgroundColor: BACKGROUND,
  },
  safeArea: {
    flex: 1,
  },
  skipButton: {
    position: 'absolute',
    top: verticalScale(60),
    right: scale(20),
    zIndex: 10,
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(8),
  },
  skipText: {
    color: ACCENT_COLOR,
    fontSize: moderateScale(17),
    fontWeight: '400',
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
    paddingHorizontal: scale(32),
  },
  slideIcon: {
    marginBottom: verticalScale(40),
  },
  slideTitle: {
    fontSize: moderateScale(34),
    fontWeight: '700',
    color: TEXT_PRIMARY,
    textAlign: 'center',
    marginBottom: verticalScale(12),
    letterSpacing: -0.5,
  },
  slideSubtitle: {
    fontSize: moderateScale(17),
    color: TEXT_SECONDARY,
    textAlign: 'center',
    marginBottom: verticalScale(40),
    lineHeight: moderateScale(24),
    fontWeight: '400',
  },
  footer: {
    // paddingBottom теперь динамический через safeAreaBottom
    paddingHorizontal: scale(20),
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: verticalScale(24),
    height: verticalScale(30),
  },
  dot: {
    height: verticalScale(8),
    borderRadius: moderateScale(4),
    backgroundColor: ACCENT_COLOR,
    marginHorizontal: scale(4),
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: ACCENT_COLOR,
    paddingVertical: verticalScale(16),
    paddingHorizontal: scale(32),
    borderRadius: moderateScale(14),
    gap: scale(8),
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: moderateScale(17),
    fontWeight: '600',
  },
  // Demo Components
  demoBox: {
    backgroundColor: '#F5F5F7',
    borderRadius: moderateScale(16),
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
    fontSize: moderateScale(22),
    color: TEXT_PRIMARY,
    fontWeight: '600',
  },
  demoArrow: {
    fontSize: moderateScale(22),
    color: TEXT_SECONDARY,
    marginHorizontal: scale(16),
  },
  demoValue: {
    fontSize: moderateScale(22),
    color: ACCENT_COLOR,
    fontWeight: '700',
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: ACCENT_COLOR,
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(20),
    borderRadius: moderateScale(12),
    gap: scale(8),
  },
  playButtonActive: {
    backgroundColor: '#008A43',
  },
  playButtonText: {
    color: '#FFFFFF',
    fontSize: moderateScale(15),
    fontWeight: '600',
  },
  demoSectionTitle: {
    fontSize: moderateScale(17),
    color: TEXT_PRIMARY,
    fontWeight: '600',
    marginBottom: verticalScale(12),
    textAlign: 'center',
  },
  translatorBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: moderateScale(12),
    padding: scale(16),
    marginBottom: verticalScale(16),
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  translatorInput: {
    fontSize: moderateScale(19),
    color: TEXT_PRIMARY,
    marginBottom: verticalScale(8),
  },
  translatorOutput: {
    fontSize: moderateScale(19),
    color: ACCENT_COLOR,
    fontWeight: '600',
    marginTop: verticalScale(8),
  },
  translateButton: {
    backgroundColor: ACCENT_COLOR,
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(24),
    borderRadius: moderateScale(12),
    marginBottom: verticalScale(16),
  },
  translateButtonText: {
    color: '#FFFFFF',
    fontSize: moderateScale(15),
    fontWeight: '600',
    textAlign: 'center',
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(12),
    marginVertical: verticalScale(6),
  },
  featureText: {
    color: TEXT_PRIMARY,
    fontSize: moderateScale(15),
    fontWeight: '500',
  },
  featuresContainer: {
    width: '100%',
    gap: verticalScale(16),
    marginTop: verticalScale(20),
  },
  featureItem: {
    backgroundColor: '#F5F5F7',
    borderRadius: moderateScale(16),
    padding: scale(20),
    alignItems: 'center',
  },
  featureTitle: {
    fontSize: moderateScale(19),
    fontWeight: '600',
    color: TEXT_PRIMARY,
    marginTop: verticalScale(12),
    marginBottom: verticalScale(6),
  },
  featureDescription: {
    fontSize: moderateScale(15),
    color: TEXT_SECONDARY,
    textAlign: 'center',
    lineHeight: moderateScale(21),
  },
  getStartedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: ACCENT_COLOR,
    paddingVertical: verticalScale(16),
    paddingHorizontal: scale(40),
    borderRadius: moderateScale(14),
    gap: scale(8),
    marginTop: verticalScale(32),
    marginBottom: verticalScale(24),
  },
  getStartedButtonText: {
    color: '#FFFFFF',
    fontSize: moderateScale(17),
    fontWeight: '600',
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: scale(8),
    paddingHorizontal: scale(20),
  },
  readyFeature: {
    backgroundColor: '#F5F5F7',
    paddingVertical: verticalScale(8),
    paddingHorizontal: scale(14),
    borderRadius: moderateScale(12),
    color: TEXT_PRIMARY,
    fontSize: moderateScale(14),
    fontWeight: '500',
  },
});
