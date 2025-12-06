// src/screens/OnboardingScreen.tsx
// HERO + GRID DESIGN - Modern 2025 UI
import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Animated,
  Platform,
  useWindowDimensions,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useConfig } from '../contexts/ConfigContext';
import { useAppLanguage } from '../contexts/LanguageContext';
import { scale, verticalScale, moderateScale } from '../utils/ResponsiveUtils';
import { useSafeArea } from '../hooks/useSafeArea';

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

  // Динамические размеры экрана (реактивные)
  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = useWindowDimensions();

  // Safe Area для корректной работы с notch/Dynamic Island
  const { bottom: safeAreaBottom, top: safeAreaTop } = useSafeArea();

  // Адаптивный размер иконки на основе высоты экрана
  const iconSize = Math.min(moderateScale(80), SCREEN_HEIGHT * 0.1);

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
      <View style={[styles.slide, { width: SCREEN_WIDTH, height: SCREEN_HEIGHT }]}>
        <LinearGradient
          colors={item.gradient as readonly [string, string, ...string[]]}
          style={styles.gradientBackground}
        >
          <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
            {/* Skip button - с учётом SafeArea сверху */}
            {currentIndex < slides.length - 1 && (
              <TouchableOpacity
                style={[styles.skipButton, { top: safeAreaTop + verticalScale(16) }]}
                onPress={handleSkip}
              >
                <Text style={styles.skipText}>{texts.onboardingSkip}</Text>
              </TouchableOpacity>
            )}

            {/* Content */}
            <View style={styles.content}>{item.component}</View>

            {/* Dots Indicator */}
            <View style={[styles.footer, { paddingBottom: Math.max(safeAreaBottom, verticalScale(24)) }]}>
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
                  <Ionicons name="arrow-forward" size={moderateScale(20)} color="#FFF" />
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
  const { height } = useWindowDimensions();
  // Адаптивный размер логотипа
  const logoSize = Math.min(moderateScale(120), height * 0.15);

  return (
    <View style={styles.slideContent}>
      <Image
        source={require('../../assets/logo.png')}
        style={[styles.logoImage, { width: logoSize, height: logoSize }]}
        resizeMode="contain"
      />
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
  const { height } = useWindowDimensions();
  const iconSize = Math.min(moderateScale(80), height * 0.1);

  const handlePlayAudio = () => {
    setAudioPlaying(true);
    setTimeout(() => setAudioPlaying(false), 1000);
  };

  return (
    <View style={styles.slideContent}>
      <Ionicons name="book" size={iconSize} color="#F5A623" style={styles.slideIcon} />
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

        {/* Features */}
        <View style={styles.featuresListContainer}>
          <View style={styles.featureRow}>
            <Ionicons name="checkmark-circle" size={22} color="#F5A623" />
            <Text style={styles.featureText}>{texts.onboardingFeatureAudio}</Text>
          </View>
          <View style={styles.featureRow}>
            <Ionicons name="checkmark-circle" size={22} color="#F5A623" />
            <Text style={styles.featureText}>{texts.onboardingFeatureOffline}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

function TranslatorSlide() {
  const { getTexts } = useAppLanguage();
  const texts = getTexts();
  const [translated, setTranslated] = useState(false);
  const { height } = useWindowDimensions();
  const iconSize = Math.min(moderateScale(80), height * 0.1);

  return (
    <View style={styles.slideContent}>
      <Ionicons name="language" size={iconSize} color="#F5A623" style={styles.slideIcon} />
      <Text style={styles.slideTitle}>{texts.onboardingTranslationTitle}</Text>
      <Text style={styles.slideSubtitle}>
        {texts.onboardingTranslationSubtitle}
      </Text>

      {/* Interactive Demo */}
      <View style={styles.demoBox}>
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

        {/* Features list */}
        <View style={styles.featuresListContainer}>
          <View style={styles.featureRow}>
            <Ionicons name="checkmark-circle" size={22} color="#F5A623" />
            <Text style={styles.featureText}>{texts.onboardingTextTranslator}</Text>
          </View>
          <View style={styles.featureRow}>
            <Ionicons name="checkmark-circle" size={22} color="#F5A623" />
            <Text style={styles.featureText}>{texts.onboardingAIAssistant}</Text>
          </View>
          <View style={styles.featureRow}>
            <Ionicons name="camera" size={22} color="#8E8E93" />
            <Text style={[styles.featureText, styles.featureTextMuted]}>{texts.onboardingVisualTranslator}</Text>
            <View style={styles.comingSoonBadge}>
              <Text style={styles.comingSoonText}>{texts.onboardingComingSoon}</Text>
            </View>
          </View>
          <View style={styles.featureRow}>
            <Ionicons name="mic" size={22} color="#8E8E93" />
            <Text style={[styles.featureText, styles.featureTextMuted]}>{texts.onboardingVoiceTranslator}</Text>
            <View style={styles.comingSoonBadge}>
              <Text style={styles.comingSoonText}>{texts.onboardingComingSoon}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}


function ReadySlide({ onGetStarted }: { onGetStarted: () => void }) {
  const { getTexts } = useAppLanguage();
  const texts = getTexts();
  const { height } = useWindowDimensions();
  const iconSize = Math.min(moderateScale(80), height * 0.1);

  // Ряды тегов для аккуратного расположения
  const featureRows = [
    // Ряд 1: 2 тега
    [
      { icon: 'book-outline' as const, label: texts.onboardingTagPhrasebook, available: true },
      { icon: 'volume-high-outline' as const, label: texts.onboardingTagAudio, available: true },
    ],
    // Ряд 2: 3 тега
    [
      { icon: 'cloud-offline-outline' as const, label: texts.onboardingTagOffline, available: true },
      { icon: 'language-outline' as const, label: texts.onboardingTagTranslator, available: true },
      { icon: 'sparkles-outline' as const, label: texts.onboardingTagAI, available: true },
    ],
    // Ряд 3: 2 тега (coming soon)
    [
      { icon: 'camera-outline' as const, label: texts.onboardingTagVisual, available: false },
      { icon: 'mic-outline' as const, label: texts.onboardingTagVoice, available: false },
    ],
  ];

  return (
    <View style={styles.slideContent}>
      <Ionicons name="checkmark-circle" size={iconSize} color="#F5A623" style={styles.slideIcon} />
      <Text style={styles.slideTitle}>{texts.onboardingReadyTitle}</Text>
      <Text style={styles.slideSubtitle}>
        {texts.onboardingReadySubtitle}
      </Text>

      <TouchableOpacity style={styles.getStartedButton} onPress={onGetStarted}>
        <Text style={styles.getStartedButtonText}>{texts.onboardingGetStarted}</Text>
        <Ionicons name="arrow-forward" size={moderateScale(20)} color="#FFFFFF" />
      </TouchableOpacity>

      <View style={styles.featuresGrid}>
        {featureRows.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.featureTagRow}>
            {row.map((feature, index) => (
              <View
                key={index}
                style={[
                  styles.featureTag,
                  !feature.available && styles.featureTagDisabled
                ]}
              >
                <Ionicons
                  name={feature.icon}
                  size={moderateScale(16)}
                  color={feature.available ? '#F5A623' : '#9CA3AF'}
                />
                <Text style={[
                  styles.featureTagText,
                  !feature.available && styles.featureTagTextDisabled
                ]}>
                  {feature.label}
                </Text>
                {!feature.available && (
                  <View style={styles.comingSoonMini}>
                    <Text style={styles.comingSoonMiniText}>{texts.onboardingComingSoon}</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}

// ========== Styles ==========

const ACCENT_COLOR = '#F5A623'; // Şapak orange (matching logo)
const TEXT_PRIMARY = '#1C1C1E'; // Apple dark text
const TEXT_SECONDARY = '#6E6E73'; // Apple gray text
const BACKGROUND = '#FFFFFF'; // White background

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND,
  },
  slide: {
    // width и height устанавливаются динамически
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
    // top устанавливается динамически с учётом safeAreaTop
    right: scale(20),
    zIndex: 10,
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(8),
  },
  skipText: {
    color: ACCENT_COLOR,
    fontSize: moderateScale(16),
    fontWeight: '500',
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
    paddingHorizontal: scale(24),
  },
  slideIcon: {
    marginBottom: verticalScale(24),
  },
  logoImage: {
    marginBottom: verticalScale(24),
  },
  slideTitle: {
    fontSize: moderateScale(28),
    fontWeight: '700',
    color: TEXT_PRIMARY,
    textAlign: 'center',
    marginBottom: verticalScale(8),
    letterSpacing: -0.5,
  },
  slideSubtitle: {
    fontSize: moderateScale(16),
    color: TEXT_SECONDARY,
    textAlign: 'center',
    marginBottom: verticalScale(24),
    lineHeight: moderateScale(22),
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
    padding: scale(16),
    width: '100%',
    marginTop: verticalScale(12),
  },
  demoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: verticalScale(12),
  },
  demoLabel: {
    fontSize: moderateScale(18),
    color: TEXT_PRIMARY,
    fontWeight: '600',
  },
  demoArrow: {
    fontSize: moderateScale(18),
    color: TEXT_SECONDARY,
    marginHorizontal: scale(12),
  },
  demoValue: {
    fontSize: moderateScale(18),
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
    backgroundColor: '#D4891A',
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
  featuresListContainer: {
    marginTop: verticalScale(16),
    gap: verticalScale(8),
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(12),
    marginVertical: verticalScale(4),
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
    paddingVertical: verticalScale(14),
    paddingHorizontal: scale(32),
    borderRadius: moderateScale(14),
    gap: scale(8),
    marginTop: verticalScale(20),
    marginBottom: verticalScale(16),
  },
  getStartedButtonText: {
    color: '#FFFFFF',
    fontSize: moderateScale(17),
    fontWeight: '600',
  },
  featuresGrid: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: verticalScale(8),
    paddingHorizontal: scale(16),
  },
  featureTagRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: scale(8),
  },
  featureTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF7ED',
    paddingVertical: verticalScale(8),
    paddingHorizontal: scale(12),
    borderRadius: moderateScale(20),
    gap: scale(6),
    borderWidth: 1,
    borderColor: '#FED7AA',
  },
  featureTagDisabled: {
    backgroundColor: '#F3F4F6',
    borderColor: '#E5E7EB',
  },
  featureTagText: {
    color: '#9A3412',
    fontSize: moderateScale(13),
    fontWeight: '500',
  },
  featureTagTextDisabled: {
    color: '#6B7280',
  },
  comingSoonMini: {
    backgroundColor: '#F59E0B',
    paddingVertical: verticalScale(2),
    paddingHorizontal: scale(6),
    borderRadius: moderateScale(6),
    marginLeft: scale(2),
  },
  comingSoonMiniText: {
    color: '#FFFFFF',
    fontSize: moderateScale(9),
    fontWeight: '600',
  },
  featureTextMuted: {
    color: TEXT_SECONDARY,
  },
  comingSoonBadge: {
    backgroundColor: '#FF9500',
    paddingVertical: verticalScale(2),
    paddingHorizontal: scale(8),
    borderRadius: moderateScale(8),
    marginLeft: scale(8),
  },
  comingSoonText: {
    color: '#FFFFFF',
    fontSize: moderateScale(11),
    fontWeight: '600',
  },
});
