// src/screens/MainHubScreen.tsx
// HERO + GRID DESIGN - Modern 2025 UI

import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
  Platform,
  Dimensions,
  Animated,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { useAppLanguage } from '../contexts/LanguageContext';
import { getLanguageByCode } from '../config/languages.config';
import type { RootStackParamList } from '../types';
import { DesignColors, Spacing, Typography, BorderRadius, Shadows } from '../constants/Design';
import { scale, verticalScale, moderateScale, DeviceInfo, wp } from '../utils/ResponsiveUtils';

interface ModuleCard {
  id: string;
  title: string;
  subtitle: string;
  icon: string; // Emoji (legacy)
  iconName: string; // Ionicons name
  gradientColors: string[];
  route: string;
  isHero?: boolean;
  isLocked?: boolean;
}

// Helper function to get modules with translations - Hero + Grid
const getModules = (texts: any): ModuleCard[] => [
  {
    id: 'phrasebook',
    title: texts.phrasebookTitle,
    subtitle: texts.phrasebookSubtitle,
    icon: '📖',
    iconName: 'book-outline',
    gradientColors: ['#667eea', '#764ba2'],
    route: 'Phrasebook',
    isHero: true,  // Hero card - большая на всю ширину
  },
  {
    id: 'visual-translator',
    title: texts.visualTranslatorTitle,
    subtitle: texts.visualTranslatorSubtitle,
    icon: '📷',
    iconName: 'camera-outline',
    gradientColors: ['#f093fb', '#f5576c'],
    route: 'VisualTranslator',
  },
  {
    id: 'text-translator',
    title: texts.textTranslatorTitle,
    subtitle: texts.textTranslatorSubtitle,
    icon: '📝',
    iconName: 'text-outline',
    gradientColors: ['#4facfe', '#00f2fe'],
    route: 'TextTranslator',
  },
  {
    id: 'voice-translator',
    title: texts.voiceTranslatorTitle,
    subtitle: texts.voiceTranslatorSubtitle,
    icon: '🎤',
    iconName: 'mic-outline',
    gradientColors: ['#a8edea', '#fed6e3'],
    route: 'VoiceTranslator',
    isLocked: true,  // 🔒 Заблокировано для v2.0
  },
  {
    id: 'dictionary',
    title: texts.dictionaryTitle,
    subtitle: texts.dictionarySubtitle,
    icon: '📚',
    iconName: 'library-outline',
    gradientColors: ['#43e97b', '#38f9d7'],
    route: 'Dictionary',
    isLocked: true,  // 🔒 Заблокировано для v2.0
  },
  {
    id: 'ai-assistants',
    title: texts.aiAssistantsTitle,
    subtitle: texts.aiAssistantsSubtitle,
    icon: '✨',
    iconName: 'sparkles',
    gradientColors: ['#fa709a', '#fee140'],
    route: 'AIAssistantsHome',
  },
  {
    id: 'favorites',
    title: texts.myFavoritesTitle,
    subtitle: texts.myFavoritesSubtitle,
    icon: '❤️',
    iconName: 'heart',
    gradientColors: ['#ff9a56', '#ff6a88'],
    route: 'Favorites',
  },
];

type MainHubScreenNavigationProp = StackNavigationProp<RootStackParamList>;

export default function MainHubScreen() {
  const navigation = useNavigation<MainHubScreenNavigationProp>();
  const { config, getTexts } = useAppLanguage();
  // ✅ ИСПРАВЛЕНО: Используем config.mode (язык интерфейса), а не selectedLanguage (язык разговорника)
  const currentLanguage = getLanguageByCode(config.mode);
  const texts = getTexts();
  const modules = getModules(texts);

  // Анимация header при скролле - RESPONSIVE
  const statusBarHeight = Platform.OS === 'android' ? (StatusBar.currentHeight || 0) : 0;
  const headerTopPosition = statusBarHeight + verticalScale(16);
  const HEADER_HEIGHT = verticalScale(64) + headerTopPosition;
  const scrollY = useRef(new Animated.Value(0)).current;
  const [headerVisible, setHeaderVisible] = useState(true);
  const lastScrollY = useRef(0);

  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT],
    outputRange: [0, -HEADER_HEIGHT],
    extrapolate: 'clamp',
  });

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    {
      useNativeDriver: true,
      listener: (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const currentScrollY = event.nativeEvent.contentOffset.y;
        const scrollDifference = currentScrollY - lastScrollY.current;

        // Скрыть header при скролле вниз (threshold: 10px)
        if (scrollDifference > 10 && headerVisible) {
          setHeaderVisible(false);
          Animated.timing(scrollY, {
            toValue: HEADER_HEIGHT,
            duration: 250,
            useNativeDriver: true,
          }).start();
        }
        // Показать header при скролле вверх (threshold: 10px)
        else if (scrollDifference < -10 && !headerVisible) {
          setHeaderVisible(true);
          Animated.timing(scrollY, {
            toValue: 0,
            duration: 250,
            useNativeDriver: true,
          }).start();
        }

        lastScrollY.current = currentScrollY;
      },
    }
  );

  const handleModulePress = (module: ModuleCard) => {
    if (module.isLocked) {
      Alert.alert(
        '🔒 Coming in v2.0',
        `${module.title} will be available in version 2.0! Stay tuned for exciting updates.`,
        [{ text: 'OK' }]
      );
      return;
    }

    // Навигация в модуль
    if (module.id === 'phrasebook') {
      navigation.navigate('Home');
    } else if (module.id === 'visual-translator') {
      navigation.navigate('VisualTranslator');
    } else if (module.id === 'text-translator') {
      navigation.navigate('TextTranslator');
    } else if (module.id === 'ai-assistants') {
      navigation.navigate('AIAssistantsHome');
    } else if (module.id === 'dictionary') {
      navigation.navigate('Dictionary');
    } else if (module.id === 'favorites') {
      navigation.navigate('AdditionalFeatures');
    } else {
      (navigation as any).navigate(module.route);
    }
  };

  const handleLanguagePress = () => {
    navigation.navigate('LanguageSelection');
  };

  const handleSettingsPress = () => {
    navigation.navigate('Settings');
  };

  return (
    <View style={styles.container}>
      {/* StatusBar - dark для светлого фона */}
      <StatusBar
        barStyle="dark-content"
        backgroundColor={DesignColors.background}
        translucent={false}
      />

      {/* Animated Header */}
      <Animated.View
        style={[
          styles.header,
          {
            top: headerTopPosition,
            transform: [{ translateY: headerTranslateY }],
          },
        ]}
      >
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={styles.languageBadge}
            onPress={handleLanguagePress}
            activeOpacity={0.7}
          >
            <Text style={styles.languageFlag}>{currentLanguage?.flag || '🌍'}</Text>
            <Text style={styles.languageName}>{currentLanguage?.name || 'Language'}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.settingsButton}
          onPress={handleSettingsPress}
          activeOpacity={0.7}
        >
          <Ionicons name="settings-outline" size={26} color={DesignColors.text} />
        </TouchableOpacity>
      </Animated.View>

      {/* Modules - Hero + Grid */}
      <Animated.ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: HEADER_HEIGHT + verticalScale(16), // header полная высота + spacing
          },
        ]}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {/* Welcome Section - ВНУТРИ ScrollView чтобы скроллилась */}
        <View style={styles.welcome}>
          <Text style={styles.welcomeTitle}>{texts.appTitle}</Text>
          <Text style={styles.welcomeSubtitle}>{texts.selectCategory}</Text>
        </View>

        {/* Hero Card - Phrasebook */}
        {modules
          .filter((m) => m.isHero)
          .map((module) => (
            <ModuleCardComponent
              key={module.id}
              module={module}
              onPress={() => handleModulePress(module)}
            />
          ))}

        {/* Grid - Остальные модули */}
        <View style={styles.grid}>
          {modules
            .filter((m) => !m.isHero)
            .map((module) => (
              <ModuleCardComponent
                key={module.id}
                module={module}
                onPress={() => handleModulePress(module)}
              />
            ))}
        </View>
      </Animated.ScrollView>
    </View>
  );
}

// Helper function to determine if gradient is light or dark
const isLightGradient = (gradientColors: string[]): boolean => {
  // Convert hex to RGB and calculate luminance
  const hexToLuminance = (hex: string): number => {
    const rgb = parseInt(hex.replace('#', ''), 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = (rgb >> 0) & 0xff;
    // Calculate relative luminance
    return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  };

  const avgLuminance = gradientColors.reduce((acc, color) =>
    acc + hexToLuminance(color), 0) / gradientColors.length;

  return avgLuminance > 0.6; // Threshold for "light" gradient
};

// Hero + Grid Module Card Component
interface ModuleCardProps {
  module: ModuleCard;
  onPress: () => void;
}

const ModuleCardComponent: React.FC<ModuleCardProps> = ({ module, onPress }) => {
  const isHero = module.isHero;
  const iconColor = isLightGradient(module.gradientColors) ? '#1F2937' : '#FFFFFF';

  return (
    <TouchableOpacity
      style={[
        isHero ? styles.heroCard : styles.moduleCard,
        module.isLocked && styles.moduleCardLocked
      ]}
      onPress={onPress}
      activeOpacity={0.85}
      disabled={module.isLocked}
    >
      <LinearGradient
        colors={module.gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={isHero ? styles.heroGradient : styles.moduleGradient}
      >
        {/* Icon - Ionicons */}
        <View style={[
          isHero ? styles.heroIconContainer : styles.iconContainer,
          {
            backgroundColor: iconColor === '#1F2937'
              ? 'rgba(255, 255, 255, 0.25)'
              : 'rgba(255, 255, 255, 0.2)'
          }
        ]}>
          <Ionicons
            name={module.iconName as any}
            size={isHero ? 44 : 32}
            color={iconColor}
          />
        </View>

        {/* Module info */}
        <View style={styles.moduleTextContainer}>
          {isHero ? (
            <>
              {/* Hero: Заголовок вверху */}
              <Text
                style={[styles.heroTitle, { color: iconColor }]}
                numberOfLines={2}
              >
                {module.title}
              </Text>
              {/* Hero: Статистика внизу */}
              <Text
                style={[
                  styles.heroStats,
                  { color: iconColor === '#1F2937' ? 'rgba(31, 41, 55, 0.7)' : 'rgba(255, 255, 255, 0.85)' }
                ]}
              >
                22 kategoriýada 305 söz düzümi
              </Text>
            </>
          ) : (
            <>
              <Text
                style={[styles.moduleTitle, { color: iconColor }]}
                numberOfLines={2}
              >
                {module.title}
              </Text>
              <Text
                style={[
                  styles.moduleSubtitle,
                  { color: iconColor === '#1F2937' ? 'rgba(31, 41, 55, 0.8)' : 'rgba(255, 255, 255, 0.9)' }
                ]}
                numberOfLines={3}
              >
                {module.subtitle}
              </Text>
            </>
          )}
        </View>

        {/* Lock icon if locked */}
        {module.isLocked && (
          <View style={styles.lockBadge}>
            <Ionicons name="lock-closed" size={16} color="#fff" />
          </View>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    // paddingTop не нужен, так как учитывается в header position
  },

  // Clean Header with animation support - RESPONSIVE
  header: {
    position: 'absolute',
    // top устанавливается динамически в inline styles
    left: 0,
    right: 0,
    height: verticalScale(64),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(24),
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    zIndex: 100,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: scale(2) },
        shadowOpacity: 0.1,
        shadowRadius: scale(4),
      },
      android: {
        elevation: 4,
      },
    }),
  },

  headerLeft: {
    flex: 1,
  },

  languageBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f3f5',
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(8),
    borderRadius: scale(16),
    gap: scale(8),
    alignSelf: 'flex-start',
  },

  languageFlag: {
    fontSize: moderateScale(20),
  },

  languageName: {
    fontSize: moderateScale(15),
    fontWeight: Typography.bold,
    color: DesignColors.text,
    fontFamily: Typography.fontFamily,
  },

  settingsButton: {
    padding: scale(8),
  },

  // Welcome Section - RESPONSIVE (внутри ScrollView)
  welcome: {
    paddingTop: scale(8), // Небольшой отступ сверху
    paddingBottom: scale(16),
    backgroundColor: 'transparent', // Прозрачный фон
  },

  welcomeTitle: {
    fontSize: moderateScale(24), // Уменьшен для лучшей читаемости
    fontWeight: Typography.bold,
    color: DesignColors.text,
    marginBottom: verticalScale(4),
    fontFamily: Typography.fontFamily,
  },

  welcomeSubtitle: {
    fontSize: moderateScale(15),
    color: DesignColors.textSecondary,
    fontFamily: Typography.fontFamily,
  },

  // Scroll Content - RESPONSIVE
  scrollContent: {
    paddingHorizontal: scale(24),
    // paddingTop устанавливается динамически в inline styles
    paddingBottom: verticalScale(32),
  },

  // Grid Layout (2 columns)
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  // Hero Card - RESPONSIVE
  heroCard: {
    width: '100%',
    height: DeviceInfo.isTablet ? verticalScale(250) : verticalScale(200),
    marginBottom: scale(24),
    borderRadius: scale(24),
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: scale(12) },
        shadowOpacity: 0.3,
        shadowRadius: scale(20),
      },
      android: {
        elevation: 12,
      },
    }),
  },

  heroGradient: {
    flex: 1,
    padding: scale(32),
    justifyContent: 'flex-start',
  },

  heroIconContainer: {
    position: 'absolute',
    top: scale(32),
    right: scale(32),
    width: scale(80),
    height: scale(80),
    borderRadius: scale(40),
    alignItems: 'center',
    justifyContent: 'center',
  },


  heroTitle: {
    fontSize: moderateScale(28),
    fontWeight: Typography.bold,
    fontFamily: Typography.fontFamily,
    lineHeight: moderateScale(34),
    marginBottom: verticalScale(8),
    paddingRight: scale(100), // Отступ справа, чтобы не задевать иконку
  },

  heroStats: {
    position: 'absolute',
    bottom: scale(-8),
    left: scale(-4),
    right: scale(100), // Ограничиваем ширину, чтобы не задевать иконку
    fontSize: moderateScale(14),
    fontFamily: Typography.fontFamily,
    fontWeight: '600',
    lineHeight: moderateScale(20),
  },

  // Regular Module Card - RESPONSIVE with Grid
  moduleCard: {
    width: DeviceInfo.isTablet
      ? (DeviceInfo.screenWidth - scale(24) * 3) / 3  // 3 колонки на планшете
      : (DeviceInfo.screenWidth - scale(24) * 3) / 2, // 2 колонки на телефоне
    marginBottom: scale(24),
    borderRadius: scale(20),
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: scale(8) },
        shadowOpacity: 0.25,
        shadowRadius: scale(16),
      },
      android: {
        elevation: 8,
      },
    }),
  },

  moduleGradient: {
    width: '100%',
    aspectRatio: 1,
    padding: scale(16), // Уменьшен для большего пространства под текст
    justifyContent: 'space-between',
  },

  moduleCardLocked: {
    opacity: 0.6,
  },

  iconContainer: {
    width: scale(56),
    height: scale(56),
    borderRadius: scale(28),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: verticalScale(8), // Отступ между иконкой и текстом для Grid
  },


  moduleTextContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },

  moduleTitle: {
    fontSize: moderateScale(15), // Уменьшен для длинных туркменских слов
    fontWeight: Typography.bold,
    fontFamily: Typography.fontFamily,
    marginBottom: verticalScale(4),
    lineHeight: moderateScale(20), // Добавлен lineHeight
  },

  moduleSubtitle: {
    fontSize: moderateScale(12), // Уменьшен для лучшей читаемости
    fontFamily: Typography.fontFamily,
    lineHeight: moderateScale(16),
  },

  lockBadge: {
    position: 'absolute',
    top: scale(16),
    right: scale(16),
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: scale(6),
    borderRadius: scale(8),
  },
});
