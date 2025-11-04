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
  icon: string; // Эмодзи вместо Ionicons
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
    gradientColors: ['#667eea', '#764ba2'],
    route: 'Phrasebook',
    isHero: true,  // Hero card - большая на всю ширину
  },
  {
    id: 'visual-translator',
    title: texts.visualTranslatorTitle,
    subtitle: texts.visualTranslatorSubtitle,
    icon: '📷',
    gradientColors: ['#f093fb', '#f5576c'],
    route: 'VisualTranslator',
  },
  {
    id: 'text-translator',
    title: texts.textTranslatorTitle,
    subtitle: texts.textTranslatorSubtitle,
    icon: '📝',
    gradientColors: ['#4facfe', '#00f2fe'],
    route: 'TextTranslator',
  },
  {
    id: 'voice-translator',
    title: texts.voiceTranslatorTitle,
    subtitle: texts.voiceTranslatorSubtitle,
    icon: '🎤',
    gradientColors: ['#a8edea', '#fed6e3'],
    route: 'VoiceTranslator',
    isLocked: true,  // 🔒 Заблокировано для v2.0
  },
  {
    id: 'dictionary',
    title: texts.dictionaryTitle,
    subtitle: texts.dictionarySubtitle,
    icon: '📚',
    gradientColors: ['#43e97b', '#38f9d7'],
    route: 'Dictionary',
    isLocked: true,  // 🔒 Заблокировано для v2.0
  },
  {
    id: 'ai-assistants',
    title: texts.aiAssistantsTitle,
    subtitle: texts.aiAssistantsSubtitle,
    icon: '✨',
    gradientColors: ['#fa709a', '#fee140'],
    route: 'AIAssistantsHome',
  },
  {
    id: 'favorites',
    title: texts.myFavoritesTitle,
    subtitle: texts.myFavoritesSubtitle,
    icon: '❤️',
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

  // Анимация header при скролле
  const scrollY = useRef(new Animated.Value(0)).current;
  const [headerVisible, setHeaderVisible] = useState(true);
  const lastScrollY = useRef(0);

  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, 64],
    outputRange: [0, -64],
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
            toValue: 64,
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

      {/* Welcome Section */}
      <View style={styles.welcome}>
        <Text style={styles.welcomeTitle}>{texts.appTitle}</Text>
        <Text style={styles.welcomeSubtitle}>{texts.selectCategory}</Text>
      </View>

      {/* Modules - Hero + Grid */}
      <Animated.ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
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

// Hero + Grid Module Card Component
interface ModuleCardProps {
  module: ModuleCard;
  onPress: () => void;
}

const ModuleCardComponent: React.FC<ModuleCardProps> = ({ module, onPress }) => {
  const isHero = module.isHero;

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
        {/* Icon - Эмодзи */}
        <View style={isHero ? styles.heroIconContainer : styles.iconContainer}>
          <Text style={isHero ? styles.heroIconEmoji : styles.iconEmoji}>
            {module.icon}
          </Text>
        </View>

        {/* Module info */}
        <View style={styles.moduleTextContainer}>
          <Text
            style={isHero ? styles.heroTitle : styles.moduleTitle}
            numberOfLines={1}
          >
            {module.title}
          </Text>
          <Text
            style={isHero ? styles.heroSubtitle : styles.moduleSubtitle}
            numberOfLines={isHero ? 3 : 2}
          >
            {module.subtitle}
          </Text>
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
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },

  // Clean Header with animation support - RESPONSIVE
  header: {
    position: 'absolute',
    top: 0,
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

  // Welcome Section (with top padding for absolute header) - RESPONSIVE
  welcome: {
    paddingHorizontal: scale(24),
    paddingTop: verticalScale(64) + scale(32),
    paddingBottom: scale(16),
    backgroundColor: '#ffffff',
  },

  welcomeTitle: {
    fontSize: moderateScale(28),
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
    paddingTop: verticalScale(24),
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
    justifyContent: 'space-between',
  },

  heroIconContainer: {
    width: scale(80),
    height: scale(80),
    borderRadius: scale(40),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  heroIconEmoji: {
    fontSize: moderateScale(48),
    textAlign: 'center',
  },

  heroTitle: {
    fontSize: moderateScale(28, 0.3),
    fontWeight: Typography.bold,
    color: '#fff',
    fontFamily: Typography.fontFamily,
    marginBottom: verticalScale(6),
  },

  heroSubtitle: {
    fontSize: moderateScale(16),
    color: 'rgba(255, 255, 255, 0.95)',
    fontFamily: Typography.fontFamily,
    lineHeight: moderateScale(22),
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
    padding: scale(24),
    justifyContent: 'space-between',
  },

  moduleCardLocked: {
    opacity: 0.6,
  },

  iconContainer: {
    width: scale(64),
    height: scale(64),
    borderRadius: scale(32),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  iconEmoji: {
    fontSize: moderateScale(36),
    textAlign: 'center',
  },

  moduleTextContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },

  moduleTitle: {
    fontSize: moderateScale(17),
    fontWeight: Typography.bold,
    color: '#fff',
    fontFamily: Typography.fontFamily,
    marginBottom: verticalScale(4),
  },

  moduleSubtitle: {
    fontSize: moderateScale(13),
    color: 'rgba(255, 255, 255, 0.9)',
    fontFamily: Typography.fontFamily,
    lineHeight: moderateScale(18),
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
