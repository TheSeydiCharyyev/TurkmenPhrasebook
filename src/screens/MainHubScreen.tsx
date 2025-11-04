// src/screens/MainHubScreen.tsx
// HERO + GRID DESIGN - Modern 2025 UI

import React from 'react';
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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { useAppLanguage } from '../contexts/LanguageContext';
import { getLanguageByCode } from '../config/languages.config';
import type { RootStackParamList } from '../types';
import { DesignColors, Spacing, Typography, BorderRadius, Shadows } from '../constants/Design';

const { width } = Dimensions.get('window');

interface ModuleCard {
  id: string;
  title: string;
  subtitle: string;
  iconName: keyof typeof Ionicons.glyphMap;
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
    iconName: 'book-outline',
    gradientColors: ['#667eea', '#764ba2'],
    route: 'Phrasebook',
    isHero: true,  // Hero card - большая на всю ширину
  },
  {
    id: 'visual-translator',
    title: texts.visualTranslatorTitle,
    subtitle: texts.visualTranslatorSubtitle,
    iconName: 'camera-outline',
    gradientColors: ['#f093fb', '#f5576c'],
    route: 'VisualTranslator',
  },
  {
    id: 'text-translator',
    title: texts.textTranslatorTitle,
    subtitle: texts.textTranslatorSubtitle,
    iconName: 'text-outline',
    gradientColors: ['#4facfe', '#00f2fe'],
    route: 'TextTranslator',
  },
  {
    id: 'voice-translator',
    title: texts.voiceTranslatorTitle,
    subtitle: texts.voiceTranslatorSubtitle,
    iconName: 'mic-outline',
    gradientColors: ['#a8edea', '#fed6e3'],
    route: 'VoiceTranslator',
    isLocked: true,  // 🔒 Заблокировано для v2.0
  },
  {
    id: 'dictionary',
    title: texts.dictionaryTitle,
    subtitle: texts.dictionarySubtitle,
    iconName: 'book-outline',
    gradientColors: ['#43e97b', '#38f9d7'],
    route: 'Dictionary',
    isLocked: true,  // 🔒 Заблокировано для v2.0
  },
  {
    id: 'ai-assistants',
    title: texts.aiAssistantsTitle,
    subtitle: texts.aiAssistantsSubtitle,
    iconName: 'sparkles-outline',
    gradientColors: ['#fa709a', '#fee140'],
    route: 'AIAssistantsHome',
  },
  {
    id: 'favorites',
    title: texts.myFavoritesTitle,
    subtitle: texts.myFavoritesSubtitle,
    iconName: 'heart-outline',
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

      {/* Header */}
      <View style={styles.header}>
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
      </View>

      {/* Welcome Section */}
      <View style={styles.welcome}>
        <Text style={styles.welcomeTitle}>{texts.appTitle}</Text>
        <Text style={styles.welcomeSubtitle}>{texts.selectCategory}</Text>
      </View>

      {/* Modules - Hero + Grid */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
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
      </ScrollView>
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
        {/* Icon */}
        <View style={isHero ? styles.heroIconContainer : styles.iconContainer}>
          <Ionicons
            name={module.iconName}
            size={isHero ? 56 : 40}
            color="#fff"
          />
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

  // Clean Header
  header: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },

  headerLeft: {
    flex: 1,
  },

  languageBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f3f5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: BorderRadius.xl,
    gap: 8,
    alignSelf: 'flex-start',
  },

  languageFlag: {
    fontSize: 20,
  },

  languageName: {
    fontSize: 15,
    fontWeight: Typography.bold,
    color: DesignColors.text,
    fontFamily: Typography.fontFamily,
  },

  settingsButton: {
    padding: 8,
  },

  // Welcome Section
  welcome: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.md,
    backgroundColor: '#ffffff',
  },

  welcomeTitle: {
    fontSize: 28,
    fontWeight: Typography.bold,
    color: DesignColors.text,
    marginBottom: 4,
    fontFamily: Typography.fontFamily,
  },

  welcomeSubtitle: {
    fontSize: 15,
    color: DesignColors.textSecondary,
    fontFamily: Typography.fontFamily,
  },

  // Scroll Content
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xl,
  },

  // Grid Layout (2 columns)
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  // Hero Card - Большая карточка
  heroCard: {
    width: '100%',
    height: 200,
    marginBottom: Spacing.lg,
    borderRadius: 24,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
      },
      android: {
        elevation: 12,
      },
    }),
  },

  heroGradient: {
    flex: 1,
    padding: Spacing.xl,
    justifyContent: 'space-between',
  },

  heroIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  heroTitle: {
    fontSize: 28,
    fontWeight: Typography.bold,
    color: '#fff',
    fontFamily: Typography.fontFamily,
    marginBottom: 6,
  },

  heroSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.95)',
    fontFamily: Typography.fontFamily,
    lineHeight: 22,
  },

  // Regular Module Card - Grid карточки
  moduleCard: {
    width: (width - Spacing.lg * 3) / 2,
    marginBottom: Spacing.lg,
    borderRadius: 20,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
    }),
  },

  moduleGradient: {
    width: '100%',
    aspectRatio: 1,
    padding: Spacing.lg,
    justifyContent: 'space-between',
  },

  moduleCardLocked: {
    opacity: 0.6,
  },

  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  moduleTextContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },

  moduleTitle: {
    fontSize: 17,
    fontWeight: Typography.bold,
    color: '#fff',
    fontFamily: Typography.fontFamily,
    marginBottom: 4,
  },

  moduleSubtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
    fontFamily: Typography.fontFamily,
    lineHeight: 18,
  },

  lockBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: 6,
    borderRadius: BorderRadius.md,
  },
});
