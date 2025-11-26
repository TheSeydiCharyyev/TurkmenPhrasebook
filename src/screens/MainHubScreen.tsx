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
import type { ComponentProps } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { useAppLanguage, InterfaceTexts } from '../contexts/LanguageContext';
import { getLanguageByCode } from '../config/languages.config';
import type { RootStackParamList } from '../types';
import { DesignColors, Spacing, Typography, BorderRadius, Shadows } from '../constants/Design';
import { scale, verticalScale, moderateScale, DeviceInfo, wp } from '../utils/ResponsiveUtils';

interface ModuleCard {
  id: string;
  title: string;
  subtitle: string;
  icon: string; // Emoji (legacy)
  iconName: ComponentProps<typeof Ionicons>['name']; // ✅ FIXED: Properly typed Ionicons name
  gradientColors: string[];
  iconColor?: string; // Цвет иконки (для белых карточек)
  route: string;
  isLocked?: boolean;
}

// Helper function to get modules with translations - All Hero Cards (1 column)
const getModules = (texts: InterfaceTexts): ModuleCard[] => [
  {
    id: 'phrasebook',
    title: texts.phrasebookTitle,
    subtitle: texts.phrasebookSubtitle,
    icon: '📖',
    iconName: 'book-outline',
    gradientColors: ['#FFFFFF', '#FFFFFF'], // Белая карточка
    iconColor: '#FF8008', // Оранжевая иконка
    route: 'Phrasebook',
  },
  {
    id: 'voice-translator',
    title: texts.voiceTranslatorTitle,
    subtitle: texts.voiceTranslatorSubtitle,
    icon: '🎤',
    iconName: 'mic-outline',
    gradientColors: ['#FFFFFF', '#FFFFFF'], // Белая карточка
    iconColor: '#FF6B35', // Коралловая иконка
    route: 'VoiceTranslator',
  },
  {
    id: 'text-translator',
    title: texts.textTranslatorTitle,
    subtitle: texts.textTranslatorSubtitle,
    icon: '📝',
    iconName: 'text-outline',
    gradientColors: ['#FFFFFF', '#FFFFFF'], // Белая карточка
    iconColor: '#F7931E', // Золотистая иконка
    route: 'TextTranslator',
  },
  {
    id: 'visual-translator',
    title: texts.visualTranslatorTitle,
    subtitle: texts.visualTranslatorSubtitle,
    icon: '📷',
    iconName: 'camera-outline',
    gradientColors: ['#FFFFFF', '#FFFFFF'], // Белая карточка
    iconColor: '#FF7A00', // Янтарная иконка
    route: 'VisualTranslator',
  },
  {
    id: 'ai-assistants',
    title: texts.aiAssistantsTitle,
    subtitle: texts.aiAssistantsSubtitle,
    icon: '🤖',
    iconName: 'sparkles',
    gradientColors: ['#FFFFFF', '#FFFFFF'], // Белая карточка
    iconColor: '#FF5722', // Оранжево-красная иконка
    route: 'UniversalAIChat',
  },
  {
    id: 'dictionary',
    title: texts.dictionaryTitle,
    subtitle: texts.dictionarySubtitle,
    icon: '📚',
    iconName: 'library-outline',
    gradientColors: ['#FFFFFF', '#FFFFFF'], // Белая карточка
    iconColor: '#FF9500', // Темно-янтарная иконка
    route: 'Dictionary',
    isLocked: true,  // 🔒 Заблокировано для v2.0
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
    } else if (module.id === 'voice-translator') {
      navigation.navigate('VoiceTranslator');
    } else if (module.id === 'ai-assistants') {
      navigation.navigate('UniversalAIChat');
    } else if (module.id === 'dictionary') {
      navigation.navigate('Dictionary');
    } else if (module.id === 'favorites') {
      navigation.navigate('AdditionalFeatures');
    } else {
      // ✅ FIXED: Removed unsafe type casting - all routes are now properly typed
      console.warn(`[MainHubScreen] Unknown module route: ${module.id}`);
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
          <Ionicons name="settings-outline" size={moderateScale(26)} color={DesignColors.text} />
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
          <Text style={styles.welcomeTitle} numberOfLines={1} adjustsFontSizeToFit>{texts.appTitle}</Text>
          <Text style={styles.welcomeSubtitle}>{texts.selectCategory}</Text>
        </View>

        {/* All modules as Hero Cards (1 column) */}
        {modules.map((module) => (
          <ModuleCardComponent
            key={module.id}
            module={module}
            onPress={() => handleModulePress(module)}
          />
        ))}
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

  return avgLuminance > 0.85; // Threshold for "light" gradient
};

// All Hero Cards Module Component (1 column layout)
interface ModuleCardProps {
  module: ModuleCard;
  onPress: () => void;
}

const ModuleCardComponent: React.FC<ModuleCardProps> = ({ module, onPress }) => {
  // Для белых карточек используем темный текст и цветные иконки
  const isWhiteCard = module.gradientColors[0] === '#FFFFFF';
  const textColor = isWhiteCard ? '#1e293b' : (isLightGradient(module.gradientColors) ? '#1e293b' : '#FFFFFF');
  const iconBgColor = isWhiteCard ? module.iconColor : (textColor === '#1e293b' ? 'rgba(255, 255, 255, 0.4)' : 'rgba(255, 255, 255, 0.3)');
  const iconFgColor = isWhiteCard ? '#FFFFFF' : textColor;

  return (
    <TouchableOpacity
      style={[
        styles.heroCard,
        module.isLocked && styles.moduleCardLocked
      ]}
      onPress={onPress}
      activeOpacity={0.85}
      disabled={module.isLocked}
    >
      <LinearGradient
        colors={module.gradientColors as readonly [string, string, ...string[]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.heroGradient}
      >
        {/* Icon - Ionicons */}
        <View style={[
          styles.heroIconContainer,
          {
            backgroundColor: iconBgColor
          }
        ]}>
          <Ionicons
            name={module.iconName}
            size={moderateScale(44)}
            color={iconFgColor}
          />
        </View>

        {/* Module info */}
        <View style={styles.moduleTextContainer}>
          {/* Title at top */}
          <Text
            style={[styles.heroTitle, { color: textColor }]}
            numberOfLines={2}
            adjustsFontSizeToFit
            minimumFontScale={0.8}
          >
            {module.title}
          </Text>
          {/* Subtitle/Stats at bottom */}
          <Text
            style={[
              styles.heroStats,
              { color: textColor }
            ]}
            numberOfLines={2}
          >
            {module.subtitle}
          </Text>
        </View>

        {/* Lock icon if locked */}
        {module.isLocked && (
          <View style={styles.lockBadge}>
            <Ionicons name="lock-closed" size={moderateScale(16)} color="#fff" />
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
    paddingHorizontal: scale(20),
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
    marginTop: scale(8),
    marginBottom: scale(16),
    backgroundColor: '#FFFFFF',
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(16),
    borderRadius: scale(16),
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: scale(4) },
        shadowOpacity: 0.1,
        shadowRadius: scale(8),
      },
      android: {
        elevation: 4,
      },
    }),
  },

  welcomeTitle: {
    fontSize: moderateScale(20),
    fontWeight: '900', // Extra bold для акцента
    color: '#ff8008', // Оранжевый как у логотипа
    marginBottom: verticalScale(4),
    fontFamily: Typography.fontFamily,
    letterSpacing: 0.3,
    textAlign: 'center',
  },

  welcomeSubtitle: {
    fontSize: moderateScale(14),
    color: '#6B7280', // Серый для контраста
    fontFamily: Typography.fontFamily,
    fontWeight: '600', // Semi-bold
    letterSpacing: 0.3,
    textAlign: 'center',
  },

  // Scroll Content - RESPONSIVE
  scrollContent: {
    paddingHorizontal: scale(20),
    // paddingTop устанавливается динамически в inline styles
    paddingBottom: verticalScale(32),
  },

  // Hero Card - RESPONSIVE (all modules use this style)
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
    fontSize: moderateScale(24), // Уменьшили с 28 до 24
    fontWeight: Typography.bold,
    fontFamily: Typography.fontFamily,
    lineHeight: moderateScale(28), // Пропорционально уменьшили
    marginBottom: verticalScale(8),
    paddingRight: scale(90), // Уменьшили с 100 до 90
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

  moduleCardLocked: {
    opacity: 0.6,
  },

  moduleTextContainer: {
    flex: 1,
    justifyContent: 'flex-start',
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
