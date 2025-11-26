// src/screens/SettingsScreen.tsx - ОБНОВЛЕНО для мультиязычности (Phase 4)

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Alert,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Colors } from '../constants/Colors';
import { useOffline } from '../hooks/useOffline';
import { useHistory } from '../hooks/useHistory';
import { useAppLanguage } from '../contexts/LanguageContext';
import { useConfig } from '../contexts/ConfigContext';
import { getLanguageByCode } from '../config/languages.config';
import { useSearchHistory } from '../hooks/useSearchHistory';
import { RootStackParamList } from '../types';
import TTSChecker from '../utils/TTSChecker';
import { scale, verticalScale, moderateScale } from '../utils/ResponsiveUtils';

type SettingsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'LanguageSelection'>;

// Импортируем оптимизированный модальный компонент
import FontSizeModal from '../components/FontSizeModal'; // Создадим отдельным файлом

const SETTINGS_KEYS = {
  SOUND_ENABLED: 'settings_sound_enabled',
  SPEECH_RATE: 'settings_speech_rate',
  FONT_SIZE: 'settings_font_size',
  DARK_MODE: 'settings_dark_mode',
  HAPTIC_FEEDBACK: 'settings_haptic_feedback',
  AUTO_PLAY: 'settings_auto_play',
} as const;

interface AppPreferences {
  soundEnabled: boolean;
  speechRate: number;
  fontSize: number;
  darkMode: boolean;
  hapticFeedback: boolean;
  autoPlay: boolean;
}

const DEFAULT_PREFERENCES: AppPreferences = {
  soundEnabled: true,
  speechRate: 0.75,
  fontSize: 16,
  darkMode: false,
  hapticFeedback: true,
  autoPlay: false,
};

// Мемоизированные компоненты для производительности
const SettingsItem = React.memo(({
  icon,
  iconColor,
  title,
  subtitle,
  onPress,
  rightComponent
}: {
  icon: string;
  iconColor: string;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  rightComponent?: React.ReactNode;
}) => (
  <TouchableOpacity
    style={styles.settingItem}
    onPress={onPress}
    disabled={!onPress}
  >
    <View style={styles.settingLeft}>
      <Ionicons name={icon as any} size={24} color={iconColor} />
      <View style={styles.settingText}>
        <Text style={styles.settingTitle}>{title}</Text>
        {subtitle && (
          <Text style={styles.settingSubtitle}>{subtitle}</Text>
        )}
      </View>
    </View>
    {rightComponent}
  </TouchableOpacity>
));

const SectionHeader = React.memo(({ title }: { title: string }) => (
  <Text style={styles.sectionTitle}>{title}</Text>
));

export default function SettingsScreen() {
  const navigation = useNavigation<SettingsScreenNavigationProp>();
  const [preferences, setPreferences] = useState<AppPreferences>(DEFAULT_PREFERENCES);
  const [availableVoices, setAvailableVoices] = useState<any[]>([]);
  const [showFontSizeModal, setShowFontSizeModal] = useState(false);
  const [showSpeechRateModal, setShowSpeechRateModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Скрываем стандартный header навигации
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const { isOnline, isDataCached, refreshCache, getCacheInfo } = useOffline();
  const { clearHistory, getStats } = useHistory();
  const { selectedLanguage } = useConfig();
  const { clearSearchHistory } = useSearchHistory();
  const { getTexts, config, switchMode, getLanguageName, resetLanguageSettings } = useAppLanguage();

  const stats = getStats();
  const texts = getTexts();

  // Мемоизация тяжелых вычислений - используем texts из контекста
  const settingsTexts = useMemo(() => ({
    audioSettings: texts.audioSettings,
    interfaceSettings: texts.interfaceSettings,
    dataSettings: texts.dataSettings,
    appInfo: texts.appInfo,
  }), [texts]);

  // Оптимизированная загрузка настроек
  const loadPreferences = useCallback(async () => {
    try {
      setIsLoading(true);
      const promises = Object.entries(SETTINGS_KEYS).map(async ([key, storageKey]) => {
        const value = await AsyncStorage.getItem(storageKey);
        return [key.toLowerCase().replace('_', ''), value ? JSON.parse(value) : null];
      });

      const results = await Promise.all(promises);
      const savedPrefs = results.reduce((acc, [key, value]) => {
        if (value !== null) acc[key as keyof AppPreferences] = value;
        return acc;
      }, {} as Partial<AppPreferences>);

      setPreferences({ ...DEFAULT_PREFERENCES, ...savedPrefs });
    } catch (error) {
      console.warn('Ошибка загрузки настроек:', error);
      Alert.alert('Ошибка', 'Не удалось загрузить настройки');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadAvailableVoices = useCallback(async () => {
    try {
      const voices = await Speech.getAvailableVoicesAsync();
      setAvailableVoices(voices);
    } catch (error) {
      console.warn('Ошибка загрузки голосов:', error);
    }
  }, []);

  useEffect(() => {
    Promise.all([loadPreferences(), loadAvailableVoices()]);
  }, [loadPreferences, loadAvailableVoices]);

  // Оптимизированное сохранение настроек
  const savePreference = useCallback(async (key: keyof AppPreferences, value: any) => {
    try {
      const storageKey = SETTINGS_KEYS[key.toUpperCase().replace(/([A-Z])/g, '_$1') as keyof typeof SETTINGS_KEYS];
      await AsyncStorage.setItem(storageKey, JSON.stringify(value));
      setPreferences(prev => ({ ...prev, [key]: value }));
    } catch (error) {
      console.warn(`Ошибка сохранения настройки ${key}:`, error);
    }
  }, []);

  // Мемоизированные обработчики событий
  const handleLanguageToggle = useCallback(() => {
    // ОБНОВЛЕНО: Открываем экран выбора языка (Phase 4)
    navigation.navigate('LanguageSelection');
  }, [navigation]);

  const handlePhrasebookLanguageChange = useCallback(() => {
    // Navigate to phrasebook and show language pair selection
    navigation.navigate('Home', { screen: 'LanguagePairSelection' } as any);
  }, [navigation]);

  const handleTogglePreference = useCallback(async (key: keyof AppPreferences) => {
    const newValue = !preferences[key];
    await savePreference(key, newValue);

    // Показываем уведомление только для важных изменений
    if (key === 'soundEnabled' || key === 'hapticFeedback') {
      const message = newValue ? texts.success : texts.success;
      Alert.alert('⚙️', message);
    }
  }, [preferences, savePreference, texts]);

  const testTTS = useCallback(async () => {
    const testText = config.mode === 'tk' ? 'Salam, nähili?' : '你好，怎么样？';
    const language = config.mode === 'tk' ? 'tr-TR' : 'zh-CN';

    try {
      await Speech.speak(testText, {
        language,
        rate: preferences.speechRate,
        pitch: 1.0
      });
    } catch (error) {
      Alert.alert('TTS Ошибка', 'Не удалось воспроизвести тестовый звук');
    }
  }, [config.mode, preferences.speechRate]);

  const checkVoiceAvailability = useCallback(async () => {
    try {
      const result = await TTSChecker.checkChineseVoiceAvailability();
      const recommendation = await TTSChecker.getRecommendations(config.mode);

      const statusEmoji = recommendation.showWarning ? '⚠️' : '✅';
      const voiceInfo = `${texts.checkVoices}: ${result.chineseVoices.length}\n${texts.voicesAvailable}: ${result.allVoices.length}`;

      Alert.alert(
        `${statusEmoji} ${recommendation.title}`,
        `${recommendation.message}\n\n${voiceInfo}`,
        [
          { text: texts.cancel, style: 'cancel' },
          ...(recommendation.showWarning && recommendation.instructions ? [{
            text: texts.checkVoices,
            onPress: () => {
              Alert.alert(
                texts.checkVoices ?? 'Check Voices',
                recommendation.instructions?.join('\n\n') || ''
              );
            }
          }] : [])
        ]
      );
    } catch (error) {
      console.warn('Ошибка проверки голосов:', error);
      Alert.alert(
        texts.error,
        texts.checkVoicesDesc
      );
    }
  }, [config.mode, texts]);

  /**
   * Новая улучшенная проверка всех установленных голосов
   * Показывает группировку по языкам и доступность для всех 31 языков приложения
   */
  const checkInstalledVoices = useCallback(async () => {
    try {
      const voices = await Speech.getAvailableVoicesAsync();

      // Группировка голосов по языкам
      const languageGroups: { [key: string]: number } = {};
      voices.forEach(voice => {
        const lang = voice.language.split('-')[0].toUpperCase(); // 'zh-CN' -> 'ZH'
        languageGroups[lang] = (languageGroups[lang] || 0) + 1;
      });

      // Формируем список доступных языков
      const sortedLanguages = Object.entries(languageGroups)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([lang, count]) => `  • ${lang}: ${count} голос(ов)`)
        .join('\n');

      const totalLanguages = Object.keys(languageGroups).length;
      const totalVoices = voices.length;

      // Проверка наличия ключевых языков приложения
      const appLanguages = ['ZH', 'RU', 'EN', 'TR', 'JA', 'KO', 'AR', 'FA', 'HI', 'DE', 'FR', 'ES'];
      const missingLanguages = appLanguages.filter(lang => !languageGroups[lang]);

      const warningText = missingLanguages.length > 0
        ? `\n\n⚠️ Отсутствуют голоса для:\n${missingLanguages.map(l => `  • ${l}`).join('\n')}`
        : '\n\n✅ Все основные языки установлены!';

      Alert.alert(
        '🔊 Установленные голоса',
        `Найдено языков: ${totalLanguages}\nВсего голосов: ${totalVoices}\n\n📋 Доступные языки:\n${sortedLanguages}${warningText}`,
        [
          { text: 'OK', style: 'cancel' }
        ]
      );
    } catch (error) {
      console.warn('Ошибка проверки установленных голосов:', error);
      Alert.alert(
        'Ошибка',
        'Не удалось получить список установленных голосов'
      );
    }
  }, []);

  const handleAbout = useCallback(async () => {
    const cacheInfo = await getCacheInfo();
    const cacheText = cacheInfo
      ? `\nCache: ${cacheInfo.phrasesCount} ${texts.phrases}, ${cacheInfo.categoriesCount} categories`
      : '';

    const aboutTexts: Record<string, string> = {
      'tk': `Şapak Ykjam Terjime v1.0\n\nTürkmenistanyň we beýleki ýurtlaryň syýahatçylary üçin döredildi\n\n© 2025${cacheText}`,
      'zh': `Shapak Quick Translate v1.0\n\n为土库曼斯坦和其他国家的游客开发\n\n© 2025${cacheText}`,
      'ru': `Shapak Quick Translate v1.0\n\nРазработано для туристов из Туркменистана и других стран\n\n© 2025${cacheText}`,
      'en': `Shapak Quick Translate v1.0\n\nDeveloped for tourists from Turkmenistan and other countries\n\n© 2025${cacheText}`,
    };

    Alert.alert(
      texts.about,
      aboutTexts[config.mode] || aboutTexts['en']
    );
  }, [texts, config.mode, getCacheInfo]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text>Загрузка настроек...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header with Back Button */}
      <View style={styles.headerBar}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={moderateScale(24)} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerBarTitle}>{texts.settingsTitle}</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>

        <View style={styles.settingsContainer}>
          {/* Секция языка */}
          <View style={styles.section}>
            <SectionHeader title={texts.languageInterface} />

            {/* Interface Language */}
            <SettingsItem
              icon="language"
              iconColor="#FF8008"
              title={texts.switchLanguage}
              subtitle={`${texts.currentLanguage}${getLanguageByCode(config.mode)?.name || config.mode}`}
              onPress={handleLanguageToggle}
              rightComponent={<Ionicons name="chevron-forward" size={20} color="#9CA3AF" />}
            />

            {/* Phrasebook Language */}
            <SettingsItem
              icon="book"
              iconColor="#FF8008"
              title={texts.phrasebookLanguage ?? 'Phrasebook Language'}
              subtitle={`${texts.currentLanguage ?? 'Current: '}${getLanguageByCode(selectedLanguage)?.nameEn || selectedLanguage}-Turkmen`}
              onPress={handlePhrasebookLanguageChange}
              rightComponent={<Ionicons name="chevron-forward" size={20} color="#9CA3AF" />}
            />
          </View>

          {/* Секция аудио */}
          <View style={styles.section}>
            <SectionHeader title={settingsTexts.audioSettings ?? 'Audio Settings'} />

            <SettingsItem
              icon="volume-high"
              iconColor="#FF8008"
              title={texts.soundEffects}
              subtitle={texts.pronunciationPlayback}
              rightComponent={
                <Switch
                  value={preferences.soundEnabled}
                  onValueChange={() => handleTogglePreference('soundEnabled')}
                  trackColor={{ false: '#D1D5DB', true: '#FF8008' }}
                  thumbColor="#FFFFFF"
                />
              }
            />

            <SettingsItem
              icon="play-circle"
              iconColor="#10B981"
              title={texts.testVoice ?? 'Test Voice'}
              subtitle={`${availableVoices.length} ${texts.voicesAvailable ?? 'voices available'}`}
              onPress={testTTS}
              rightComponent={<Ionicons name="play" size={20} color="#9CA3AF" />}
            />

            <SettingsItem
              icon="checkmark-circle"
              iconColor="#3B82F6"
              title={texts.checkVoices ?? 'Check Voices'}
              subtitle={texts.checkVoicesDesc ?? 'Check voice availability'}
              onPress={checkVoiceAvailability}
              rightComponent={<Ionicons name="search" size={20} color="#9CA3AF" />}
            />

            <SettingsItem
              icon="list"
              iconColor="#8B5CF6"
              title="Установленные голоса"
              subtitle="Просмотр всех доступных TTS голосов"
              onPress={checkInstalledVoices}
              rightComponent={<Ionicons name="arrow-forward" size={20} color="#9CA3AF" />}
            />
          </View>

          {/* Секция интерфейса */}
          <View style={styles.section}>
            <SectionHeader title={settingsTexts.interfaceSettings ?? 'Interface Settings'} />

            <SettingsItem
              icon="text"
              iconColor="#FF8008"
              title={texts.fontSize ?? 'Font Size'}
              subtitle={`${texts.currentFontSize ?? 'Current: '}${preferences.fontSize}px`}
              onPress={() => setShowFontSizeModal(true)}
              rightComponent={<Ionicons name="chevron-forward" size={20} color="#9CA3AF" />}
            />

            <SettingsItem
              icon="phone-portrait"
              iconColor="#FF8008"
              title={texts.hapticFeedback ?? 'Haptic Feedback'}
              subtitle={texts.hapticFeedbackDesc ?? 'Vibration on interactions'}
              rightComponent={
                <Switch
                  value={preferences.hapticFeedback}
                  onValueChange={() => handleTogglePreference('hapticFeedback')}
                  trackColor={{ false: '#D1D5DB', true: '#FF8008' }}
                  thumbColor="#FFFFFF"
                />
              }
            />
          </View>

          {/* Секция данных */}
          <View style={styles.section}>
            <SectionHeader title={settingsTexts.dataSettings ?? 'Data Settings'} />

            <SettingsItem
              icon="time"
              iconColor="#EF4444"
              title={texts.clearHistory}
              subtitle={`${stats.uniquePhrases} ${texts.phrases} • ${stats.totalViews} ${texts.views}`}
              onPress={() => {
                Alert.alert(
                  texts.clearHistory,
                  texts.clearHistoryConfirm,
                  [
                    { text: texts.cancel, style: 'cancel' },
                    {
                      text: texts.delete,
                      style: 'destructive',
                      onPress: () => {
                        clearHistory();
                        Alert.alert('✅', texts.historyCleared);
                      }
                    }
                  ]
                );
              }}
              rightComponent={<Ionicons name="chevron-forward" size={20} color="#9CA3AF" />}
            />
          </View>

          {/* Секция приложения */}
          <View style={styles.section}>
            <SectionHeader title={settingsTexts.appInfo ?? 'App Info'} />

            <SettingsItem
              icon="information-circle"
              iconColor="#6B7280"
              title={texts.about}
              subtitle={texts.versionAndInfo}
              onPress={handleAbout}
              rightComponent={<Ionicons name="chevron-forward" size={20} color="#9CA3AF" />}
            />
          </View>
        </View>
      </ScrollView>

      {/* Оптимизированное модальное окно */}
      <FontSizeModal
        visible={showFontSizeModal}
        onClose={() => setShowFontSizeModal(false)}
        currentFontSize={preferences.fontSize}
        onSave={(fontSize) => savePreference('fontSize', fontSize)}
        config={config}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(16),
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerBarTitle: {
    fontSize: moderateScale(18),
    fontWeight: '700',
    color: '#1F2937',
  },
  placeholder: {
    width: scale(40),
  },
  settingsContainer: {
    flex: 1,
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(16),
    paddingBottom: verticalScale(20),
  },
  section: {
    marginBottom: verticalScale(24),
  },
  sectionTitle: {
    fontSize: moderateScale(13),
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: verticalScale(12),
    paddingLeft: scale(4),
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: scale(12),
    padding: scale(16),
    marginBottom: verticalScale(8),
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: scale(16),
    flex: 1,
  },
  settingTitle: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: verticalScale(2),
  },
  settingSubtitle: {
    fontSize: moderateScale(14),
    color: '#6B7280',
  },
});