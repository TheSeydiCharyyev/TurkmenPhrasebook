// src/screens/MainHubScreen.tsx
// ОБНОВЛЕНО - Минималистичный дизайн

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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { useConfig } from '../contexts/ConfigContext';
import { useAppLanguage } from '../contexts/LanguageContext';
import { getLanguageByCode } from '../config/languages.config';
import type { RootStackParamList } from '../types';
import { DesignColors, Spacing, Typography, BorderRadius, Shadows } from '../constants/Design';

interface ModuleCard {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  color: string;  // Используем один цвет вместо градиента
  route: string;
  isLocked?: boolean;
}

// Helper function to get modules with translations
const getModules = (texts: any): ModuleCard[] => [
  {
    id: 'phrasebook',
    title: texts.phrasebookTitle,
    subtitle: texts.phrasebookSubtitle,
    icon: '📚',
    color: DesignColors.modulePhrasebook,
    route: 'Phrasebook',
  },
  {
    id: 'visual-translator',
    title: texts.visualTranslatorTitle,
    subtitle: texts.visualTranslatorSubtitle,
    icon: '📸',
    color: DesignColors.moduleVisual,
    route: 'VisualTranslator',
  },
  {
    id: 'text-translator',
    title: texts.textTranslatorTitle,
    subtitle: texts.textTranslatorSubtitle,
    icon: '🌍',
    color: DesignColors.moduleText,
    route: 'TextTranslator',
  },
  {
    id: 'dictionary',
    title: texts.dictionaryTitle,
    subtitle: texts.dictionarySubtitle,
    icon: '📖',
    color: DesignColors.moduleDictionary,
    route: 'Dictionary',
  },
  {
    id: 'ai-assistants',
    title: texts.aiAssistantsTitle,
    subtitle: texts.aiAssistantsSubtitle,
    icon: '🤖',
    color: DesignColors.moduleAI,
    route: 'AIAssistantsHome',
  },
  {
    id: 'favorites',
    title: texts.myFavoritesTitle,
    subtitle: texts.myFavoritesSubtitle,
    icon: '⭐',
    color: DesignColors.moduleFavorites,
    route: 'Favorites',
  },
];

type MainHubScreenNavigationProp = StackNavigationProp<RootStackParamList>;

export default function MainHubScreen() {
  const navigation = useNavigation<MainHubScreenNavigationProp>();
  const { selectedLanguage } = useConfig();
  const { getTexts } = useAppLanguage();
  const currentLanguage = getLanguageByCode(selectedLanguage);
  const texts = getTexts();
  const modules = getModules(texts);

  const handleModulePress = (module: ModuleCard) => {
    if (module.isLocked) {
      Alert.alert(
        '🔒 Coming Soon',
        `${module.title} will be available soon! We're working hard to bring you this feature.`,
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
      {/* StatusBar - правильная настройка для Android */}
      <StatusBar
        barStyle="dark-content"
        backgroundColor={DesignColors.background}
        translucent={false}
      />

      {/* Header - единый стиль */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.languageBadge}
          onPress={handleLanguagePress}
          activeOpacity={0.6}
        >
          <Text style={styles.languageFlag}>{currentLanguage?.flag || '🌍'}</Text>
          <Text style={styles.languageName}>{currentLanguage?.name || 'Language'}</Text>
        </TouchableOpacity>

        <Text style={styles.appTitle}>{texts.appTitle}</Text>

        <TouchableOpacity
          style={styles.settingsButton}
          onPress={handleSettingsPress}
          activeOpacity={0.6}
        >
          <Ionicons name="settings-outline" size={24} color={DesignColors.text} />
        </TouchableOpacity>
      </View>

      {/* Welcome Section */}
      <View style={styles.welcome}>
        <Text style={styles.welcomeTitle}>{texts.appSubtitle}</Text>
        <Text style={styles.welcomeSubtitle}>{texts.selectCategory}</Text>
      </View>

      {/* Modules List */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {modules.map((module) => (
          <ModuleCardComponent
            key={module.id}
            module={module}
            onPress={() => handleModulePress(module)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

// Компонент карточки модуля - простой и минималистичный
interface ModuleCardProps {
  module: ModuleCard;
  onPress: () => void;
}

const ModuleCardComponent: React.FC<ModuleCardProps> = ({ module, onPress }) => {
  return (
    <TouchableOpacity
      style={[
        styles.moduleCard,
        module.isLocked && styles.moduleCardLocked
      ]}
      onPress={onPress}
      activeOpacity={module.isLocked ? 1 : 0.6}
      disabled={module.isLocked}
    >
      {/* Цветная полоса слева */}
      <View style={[styles.moduleColorBar, { backgroundColor: module.color }]} />

      {/* Иконка */}
      <Text style={styles.moduleIcon}>{module.icon}</Text>

      {/* Текст */}
      <View style={styles.moduleInfo}>
        <Text style={styles.moduleTitle}>{module.title}</Text>
        <Text style={styles.moduleSubtitle}>{module.subtitle}</Text>
      </View>

      {/* Стрелка или замок */}
      {module.isLocked ? (
        <Ionicons name="lock-closed" size={20} color={DesignColors.textLight} />
      ) : (
        <Ionicons name="chevron-forward" size={20} color={DesignColors.textSecondary} />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DesignColors.background,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },

  // Header - единый стиль
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    backgroundColor: DesignColors.background,
    borderBottomWidth: 1,
    borderBottomColor: DesignColors.border,
  },

  languageBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: DesignColors.backgroundGray,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.xl,
    gap: 6,
  },

  languageFlag: {
    fontSize: 16,
  },

  languageName: {
    fontSize: 13,
    fontWeight: Typography.semibold,
    color: DesignColors.text,
    fontFamily: Typography.fontFamily,
  },

  appTitle: {
    fontSize: Typography.h4,
    fontWeight: Typography.bold,
    color: DesignColors.text,
    flex: 1,
    textAlign: 'center',
    fontFamily: Typography.fontFamily,
  },

  settingsButton: {
    padding: 4,
  },

  // Welcome Section
  welcome: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },

  welcomeTitle: {
    fontSize: Typography.h2,
    fontWeight: Typography.bold,
    color: DesignColors.text,
    marginBottom: 4,
    fontFamily: Typography.fontFamily,
  },

  welcomeSubtitle: {
    fontSize: Typography.body,
    color: DesignColors.textSecondary,
    fontFamily: Typography.fontFamily,
  },

  // Scroll Content
  scrollContent: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xl,
  },

  // Module Card - минималистичный дизайн
  moduleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: DesignColors.card,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: DesignColors.cardBorder,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    gap: Spacing.md,
    ...Shadows.small,
  },

  moduleCardLocked: {
    opacity: 0.5,
  },

  moduleColorBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    borderTopLeftRadius: BorderRadius.lg,
    borderBottomLeftRadius: BorderRadius.lg,
  },

  moduleIcon: {
    fontSize: 32,
    marginLeft: 8,
  },

  moduleInfo: {
    flex: 1,
  },

  moduleTitle: {
    fontSize: Typography.h4,
    fontWeight: Typography.semibold,
    color: DesignColors.text,
    marginBottom: 2,
    fontFamily: Typography.fontFamily,
  },

  // Все подзаголовки одного цвета
  moduleSubtitle: {
    fontSize: Typography.bodySmall,
    color: DesignColors.textSecondary,
    fontFamily: Typography.fontFamily,
  },
});
