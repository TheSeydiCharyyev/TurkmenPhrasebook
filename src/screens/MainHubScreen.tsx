// src/screens/MainHubScreen.tsx
// НОВЫЙ экран - Hub-архитектура для всех модулей приложения

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { useConfig } from '../contexts/ConfigContext';
import { getLanguageByCode } from '../config/languages.config';
import type { RootStackParamList } from '../types';

interface ModuleCard {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  gradient: readonly [string, string];
  route: string;
  isLocked?: boolean;
  size: 'large' | 'medium' | 'small';
}

const MODULES: ModuleCard[] = [
  {
    id: 'phrasebook',
    title: 'Phrasebook',
    subtitle: '305 phrases in 22 categories',
    icon: '📚',
    gradient: ['#10B981', '#059669'],
    route: 'Phrasebook',
    size: 'large',
  },
  {
    id: 'visual-translator',
    title: 'Visual Translator',
    subtitle: 'Scan text with camera',
    icon: '📸',
    gradient: ['#6366F1', '#4F46E5'],
    route: 'VisualTranslator',
    size: 'large',
  },
  {
    id: 'text-translator',
    title: 'Text Translator',
    subtitle: 'Type and translate',
    icon: '🌍',
    gradient: ['#3B82F6', '#2563EB'],
    route: 'TextTranslator',
    size: 'medium',
    isLocked: true, // Временно заблокирован - будет реализован в Phase 3
  },
  {
    id: 'dictionary',
    title: 'Dictionary',
    subtitle: 'Coming in v2.0',
    icon: '📖',
    gradient: ['#9CA3AF', '#6B7280'],
    route: 'Dictionary',
    size: 'small',
    isLocked: true,
  },
  {
    id: 'ai-assistants',
    title: 'AI Assistants',
    subtitle: 'Smart helpers & tips',
    icon: '🤖',
    gradient: ['#8B5CF6', '#7C3AED'],
    route: 'AIAssistants',
    size: 'large',
    isLocked: true, // Временно заблокирован - будет реализован в Phase 4
  },
  {
    id: 'favorites',
    title: 'My Favorites',
    subtitle: 'Saved items',
    icon: '⭐',
    gradient: ['#F59E0B', '#D97706'],
    route: 'Favorites',
    size: 'medium',
  },
];

type MainHubScreenNavigationProp = StackNavigationProp<RootStackParamList>;

export default function MainHubScreen() {
  const navigation = useNavigation<MainHubScreenNavigationProp>();
  const { selectedLanguage } = useConfig();
  const currentLanguage = getLanguageByCode(selectedLanguage);

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
    } else if (module.id === 'favorites') {
      navigation.navigate('AdditionalFeatures');
    } else {
      // Для будущих модулей - игнорируем TypeScript для неизвестных роутов
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
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.languageBadge}
          onPress={handleLanguagePress}
          activeOpacity={0.7}
        >
          <Text style={styles.languageFlag}>{currentLanguage?.flag || '🌍'}</Text>
          <Text style={styles.languageName}>{currentLanguage?.name || 'Language'}</Text>
        </TouchableOpacity>

        <Text style={styles.appTitle}>Turkmen Phrasebook</Text>

        <TouchableOpacity
          style={styles.settingsButton}
          onPress={handleSettingsPress}
          activeOpacity={0.7}
        >
          <Ionicons name="settings-outline" size={24} color="#111827" />
        </TouchableOpacity>
      </View>

      {/* Welcome Section */}
      <View style={styles.welcome}>
        <Text style={styles.welcomeTitle}>Welcome back! 👋</Text>
        <Text style={styles.welcomeSubtitle}>Choose what you need</Text>
      </View>

      {/* Modules Grid */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {MODULES.map((module) => (
          <ModuleCardComponent
            key={module.id}
            module={module}
            onPress={() => handleModulePress(module)}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

// Компонент карточки модуля
interface ModuleCardProps {
  module: ModuleCard;
  onPress: () => void;
}

const ModuleCardComponent: React.FC<ModuleCardProps> = ({ module, onPress }) => {
  const height = module.size === 'large' ? 120 : module.size === 'medium' ? 100 : 80;

  return (
    <TouchableOpacity
      style={[styles.moduleCard, { height }]}
      onPress={onPress}
      activeOpacity={module.isLocked ? 1 : 0.7}
      disabled={module.isLocked}
    >
      {module.isLocked ? (
        // Locked (disabled) card
        <View style={styles.lockedCard}>
          <Text style={styles.moduleIcon}>{module.icon}</Text>
          <View style={styles.moduleInfo}>
            <Text style={styles.moduleTitle}>{module.title}</Text>
            <Text style={styles.moduleSubtitle}>{module.subtitle}</Text>
          </View>
          <Ionicons name="lock-closed" size={20} color="#9CA3AF" />
        </View>
      ) : (
        // Active card with gradient
        <LinearGradient
          colors={module.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientCard}
        >
          <Text style={styles.moduleIconWhite}>{module.icon}</Text>
          <View style={styles.moduleInfo}>
            <Text style={styles.moduleTitleWhite}>{module.title}</Text>
            <Text style={styles.moduleSubtitleWhite}>{module.subtitle}</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="rgba(255,255,255,0.7)" />
        </LinearGradient>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  languageBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F4FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  languageFlag: {
    fontSize: 16,
  },
  languageName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6366F1',
  },
  appTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    flex: 1,
    textAlign: 'center',
  },
  settingsButton: {
    padding: 4,
  },
  welcome: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 16,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#64748B',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  moduleCard: {
    borderRadius: 20,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  gradientCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 16,
  },
  lockedCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 16,
    backgroundColor: '#F9FAFB',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    opacity: 0.7,
  },
  moduleIcon: {
    fontSize: 32,
  },
  moduleIconWhite: {
    fontSize: 32,
  },
  moduleInfo: {
    flex: 1,
  },
  moduleTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  moduleTitleWhite: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  moduleSubtitle: {
    fontSize: 14,
    color: '#64748B',
  },
  moduleSubtitleWhite: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.85)',
  },
});
