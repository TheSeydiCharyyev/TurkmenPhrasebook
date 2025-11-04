// src/screens/LanguageSelectionScreen.tsx
// HERO + GRID DESIGN - Modern 2025 UI
import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
  TextInput,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { LANGUAGES, getLanguageProgress } from '../config/languages.config';
import { useConfig } from '../contexts/ConfigContext';
import { useAppLanguage, AppLanguageMode } from '../contexts/LanguageContext';
import { scale, verticalScale, moderateScale } from '../utils/ResponsiveUtils';

interface LanguageSelectionScreenProps {
  navigation?: any;
  onLanguageSelect?: (language: AppLanguageMode, shouldSave: boolean) => void;
}

export default function LanguageSelectionScreen({ navigation, onLanguageSelect }: LanguageSelectionScreenProps) {
  const { setSelectedLanguage, selectedLanguage, onboardingCompleted } = useConfig();
  const { setLanguageMode, config } = useAppLanguage();
  const [isChanging, setIsChanging] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter languages based on search query
  const filteredLanguages = LANGUAGES.filter(lang =>
    lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lang.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lang.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLanguageSelect = async (code: string, isAvailable: boolean) => {
    // Если язык недоступен - показать toast
    if (!isAvailable) {
      Alert.alert(
        '🔒 Coming Soon',
        'This language will be available soon! Stay tuned for updates.',
        [{ text: 'OK' }]
      );
      return;
    }

    // Если уже выбран этот язык
    if (code === selectedLanguage) {
      if (navigation) {
        navigation.goBack();
      }
      return;
    }

    try {
      setIsChanging(true);

      // Для обратной совместимости: используем onLanguageSelect если передан
      if (onLanguageSelect) {
        // Конвертируем код в AppLanguageMode (все языки поддерживаются)
        const validLanguages: AppLanguageMode[] = ['tk', 'zh', 'ru', 'en', 'tr', 'de', 'fr', 'es', 'it', 'pt', 'nl', 'pl', 'uk', 'ja', 'ko', 'th', 'vi', 'id', 'ms', 'hi', 'ur', 'fa', 'ps', 'uz', 'kk', 'az', 'ky', 'tg', 'hy', 'ka', 'ar'];
        if (validLanguages.includes(code as AppLanguageMode)) {
          onLanguageSelect(code as AppLanguageMode, true);
        }
        return;
      }

      // НОВАЯ ЛОГИКА: Scenario A
      // 1. Устанавливаем язык интерфейса
      await setLanguageMode(code as any, true);

      // 2. Если НЕ туркменский - устанавливаем тот же язык для разговорника
      if (code !== 'tk') {
        await setSelectedLanguage(code);
      }
      // Если туркменский - разговорник выберут позже в LanguagePairSelectionScreen

      // 3. Навигация - переходим на Onboarding или MainHub
      if (navigation) {
        // Проверяем, нужен ли onboarding
        const nextScreen = onboardingCompleted ? 'MainHub' : 'Onboarding';
        navigation.replace(nextScreen);
      }
    } catch (error) {
      console.error('Failed to select language:', error);
      Alert.alert(
        '❌ Error',
        'Failed to change language. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsChanging(false);
    }
  };

  const renderLanguageItem = ({ item }: { item: typeof LANGUAGES[0] }) => {
    const isAvailable = item.isAvailable;
    // Check against interface language (config.mode), not phrasebook language
    const isSelected = item.code === config.mode;

    return (
      <TouchableOpacity
        style={[
          styles.languageItem,
          !isAvailable && styles.languageItemDisabled,
          isSelected && styles.languageItemSelected,
        ]}
        onPress={() => handleLanguageSelect(item.code, isAvailable)}
        activeOpacity={isAvailable ? 0.7 : 1}
        disabled={isChanging}
      >
        <View style={styles.languageContent}>
          <Text style={styles.flag}>{item.flag}</Text>
          <View style={styles.languageInfo}>
            <Text style={[
              styles.languageName,
              !isAvailable && styles.textDisabled,
              isSelected && styles.textSelected,
            ]}>
              {item.name}
            </Text>
            <Text style={[
              styles.languageNameEn,
              !isAvailable && styles.textDisabled,
            ]}>
              {item.nameEn}
            </Text>
          </View>
        </View>

        {isSelected ? (
          <View style={styles.selectedBadge}>
            <Ionicons name="checkmark-circle" size={24} color="#10B981" />
            <Text style={styles.selectedText}>Current</Text>
          </View>
        ) : isAvailable ? (
          <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
        ) : (
          <View style={styles.comingSoon}>
            <Ionicons name="lock-closed" size={16} color="#9CA3AF" />
            <Text style={styles.comingSoonText}>Soon</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />

      {/* Gradient Header */}
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <SafeAreaView edges={['top']} style={styles.safeArea}>
          {navigation && (
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={28} color="#fff" />
            </TouchableOpacity>
          )}

          <Text style={styles.title}>Choose Your Language</Text>
          <Text style={styles.subtitle}>
            Select interface language for the app
          </Text>

          {/* Search Input */}
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#667eea" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search languages..."
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoCapitalize="none"
              autoCorrect={false}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
                <Ionicons name="close-circle" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            )}
          </View>
        </SafeAreaView>
      </LinearGradient>

      {/* Language List */}
      <FlatList
        data={filteredLanguages}
        renderItem={renderLanguageItem}
        keyExtractor={item => item.code}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        style={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },

  // Gradient Header
  headerGradient: {
    paddingBottom: verticalScale(24),
  },

  safeArea: {
    paddingHorizontal: scale(20),
  },

  backButton: {
    alignSelf: 'flex-start',
    padding: scale(8),
    marginLeft: scale(-8),
    marginBottom: verticalScale(16),
  },

  title: {
    fontSize: moderateScale(32),
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: verticalScale(8),
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },

  subtitle: {
    fontSize: moderateScale(16),
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: verticalScale(20),
    textShadowColor: 'rgba(0, 0, 0, 0.15)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: scale(16),
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(12),
    marginTop: verticalScale(12),
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchIcon: {
    marginRight: scale(8),
  },

  searchInput: {
    flex: 1,
    fontSize: moderateScale(16),
    color: '#111827',
    padding: 0,
  },

  clearButton: {
    padding: scale(4),
    marginLeft: scale(8),
  },

  list: {
    flex: 1,
  },

  listContent: {
    padding: scale(20),
    paddingTop: verticalScale(24),
  },

  // Modern Language Card
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: scale(20),
    backgroundColor: '#FFFFFF',
    borderRadius: scale(20),
    marginBottom: verticalScale(16),
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
    }),
  },

  languageItemDisabled: {
    opacity: 0.5,
    backgroundColor: '#F9FAFB',
  },

  languageItemSelected: {
    backgroundColor: '#fff',
    borderWidth: 3,
    borderColor: '#667eea',
    ...Platform.select({
      ios: {
        shadowColor: '#667eea',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
    }),
  },

  languageContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  flag: {
    fontSize: moderateScale(48),
    marginRight: scale(16),
  },

  languageInfo: {
    flex: 1,
  },

  languageName: {
    fontSize: moderateScale(19),
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: verticalScale(4),
  },

  languageNameEn: {
    fontSize: moderateScale(15),
    color: '#6B7280',
  },

  textDisabled: {
    color: '#9CA3AF',
  },

  textSelected: {
    color: '#667eea',
    fontWeight: 'bold',
  },

  selectedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(6),
  },

  selectedText: {
    fontSize: moderateScale(13),
    color: '#667eea',
    fontWeight: 'bold',
  },

  comingSoon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(6),
  },

  comingSoonText: {
    fontSize: moderateScale(13),
    color: '#9CA3AF',
    fontWeight: '500',
  },
});
