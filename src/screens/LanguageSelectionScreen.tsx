// src/screens/LanguageSelectionScreen.tsx
// ОБНОВЛЕНО для мультиязычной системы (Phase 3)
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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LANGUAGES, getLanguageProgress } from '../config/languages.config';
import { useConfig } from '../contexts/ConfigContext';
import { useAppLanguage, AppLanguageMode } from '../contexts/LanguageContext';

interface LanguageSelectionScreenProps {
  navigation?: any;
  onLanguageSelect?: (language: AppLanguageMode, shouldSave: boolean) => void;
}

export default function LanguageSelectionScreen({ navigation, onLanguageSelect }: LanguageSelectionScreenProps) {
  const { setSelectedLanguage, selectedLanguage } = useConfig();
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

      // 3. Навигация
      const lang = LANGUAGES.find(l => l.code === code);

      if (code === 'tk') {
        // Туркменский интерфейс - направляем в Phrasebook где покажется выбор пары
        Alert.alert(
          '✅ ' + (lang?.name || 'Language Selected'),
          'Now select your phrasebook language pair',
          [{
            text: 'OK',
            onPress: () => {
              if (navigation) {
                // Navigate to Home stack, which will show LanguagePairSelectionScreen
                navigation.replace('MainHub');
              }
            }
          }]
        );
      } else {
        // Другие языки - интерфейс и разговорник установлены
        Alert.alert(
          '✅ Language Changed',
          `Interface: ${lang?.name}\nPhrasebook: ${lang?.nameEn}-Turkmen`,
          [{
            text: 'OK',
            onPress: () => {
              if (navigation) {
                navigation.replace('MainHub');
              }
            }
          }]
        );
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
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          {navigation && (
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color="#111827" />
            </TouchableOpacity>
          )}
          <Text style={styles.title}>Select Language</Text>
          <View style={styles.placeholder} />
        </View>

        <Text style={styles.subtitle}>
          Choose a language to start learning Turkmen
        </Text>

        {/* Search Input */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#9CA3AF" style={styles.searchIcon} />
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
      </View>

      {/* Language List */}
      <FlatList
        data={filteredLanguages}
        renderItem={renderLanguageItem}
        keyExtractor={item => item.code}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      />

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  placeholder: {
    width: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    flex: 1,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    padding: 0,
  },
  clearButton: {
    padding: 4,
    marginLeft: 8,
  },
  listContent: {
    padding: 16,
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 18,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  languageItemDisabled: {
    opacity: 0.5,
    backgroundColor: '#F3F4F6',
  },
  languageItemSelected: {
    backgroundColor: '#ECFDF5',
    borderColor: '#10B981',
    borderWidth: 2,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  languageContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  flag: {
    fontSize: 44,
    marginRight: 16,
  },
  languageInfo: {
    flex: 1,
  },
  languageName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  languageNameEn: {
    fontSize: 14,
    color: '#6B7280',
  },
  textDisabled: {
    color: '#9CA3AF',
  },
  textSelected: {
    color: '#059669',
  },
  selectedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  selectedText: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '600',
  },
  comingSoon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  comingSoonText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
});
