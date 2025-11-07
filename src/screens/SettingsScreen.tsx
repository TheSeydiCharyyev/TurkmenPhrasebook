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
                texts.checkVoices,
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
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{texts.settingsTitle}</Text>
          <Text style={styles.headerSubtitle}>
            {settingsTexts.interfaceSettings}
          </Text>
        </View>

        <View style={styles.settingsContainer}>
          {/* Секция языка */}
          <View style={styles.section}>
            <SectionHeader title={texts.languageInterface} />

            {/* Interface Language */}
            <SettingsItem
              icon="language"
              iconColor={Colors.primary}
              title={texts.switchLanguage}
              subtitle={`${texts.currentLanguage}${getLanguageByCode(config.mode)?.name || config.mode}`}
              onPress={handleLanguageToggle}
              rightComponent={<Ionicons name="chevron-forward" size={20} color={Colors.textLight} />}
            />

            {/* Phrasebook Language */}
            <SettingsItem
              icon="book"
              iconColor={Colors.accent}
              title={texts.phrasebookLanguage}
              subtitle={`${texts.currentLanguage}${getLanguageByCode(selectedLanguage)?.nameEn || selectedLanguage}-Turkmen`}
              onPress={handlePhrasebookLanguageChange}
              rightComponent={<Ionicons name="chevron-forward" size={20} color={Colors.textLight} />}
            />
          </View>

          {/* Секция аудио */}
          <View style={styles.section}>
            <SectionHeader title={settingsTexts.audioSettings} />

            <SettingsItem
              icon="volume-high"
              iconColor={Colors.accent}
              title={texts.soundEffects}
              subtitle={texts.pronunciationPlayback}
              rightComponent={
                <Switch
                  value={preferences.soundEnabled}
                  onValueChange={() => handleTogglePreference('soundEnabled')}
                  trackColor={{ false: Colors.textLight, true: Colors.accent }}
                  thumbColor={Colors.textWhite}
                />
              }
            />

            <SettingsItem
              icon="play-circle"
              iconColor={Colors.success}
              title={texts.testVoice}
              subtitle={`${availableVoices.length} ${texts.voicesAvailable}`}
              onPress={testTTS}
              rightComponent={<Ionicons name="play" size={20} color={Colors.textLight} />}
            />

            <SettingsItem
              icon="checkmark-circle"
              iconColor={Colors.primary}
              title={texts.checkVoices}
              subtitle={texts.checkVoicesDesc}
              onPress={checkVoiceAvailability}
              rightComponent={<Ionicons name="search" size={20} color={Colors.textLight} />}
            />
          </View>

          {/* Секция интерфейса */}
          <View style={styles.section}>
            <SectionHeader title={settingsTexts.interfaceSettings} />

            <SettingsItem
              icon="text"
              iconColor={Colors.primary}
              title={texts.fontSize}
              subtitle={`${texts.currentFontSize}${preferences.fontSize}px`}
              onPress={() => setShowFontSizeModal(true)}
              rightComponent={<Ionicons name="chevron-forward" size={20} color={Colors.textLight} />}
            />

            <SettingsItem
              icon="phone-portrait"
              iconColor={Colors.accent}
              title={texts.hapticFeedback}
              subtitle={texts.hapticFeedbackDesc}
              rightComponent={
                <Switch
                  value={preferences.hapticFeedback}
                  onValueChange={() => handleTogglePreference('hapticFeedback')}
                  trackColor={{ false: Colors.textLight, true: Colors.accent }}
                  thumbColor={Colors.textWhite}
                />
              }
            />
          </View>

          {/* Секция данных */}
          <View style={styles.section}>
            <SectionHeader title={settingsTexts.dataSettings} />

            <SettingsItem
              icon="time"
              iconColor={Colors.warning}
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
              rightComponent={<Ionicons name="chevron-forward" size={20} color={Colors.textLight} />}
            />
          </View>

          {/* Секция приложения */}
          <View style={styles.section}>
            <SectionHeader title={settingsTexts.appInfo} />

            <SettingsItem
              icon="information-circle"
              iconColor={Colors.textLight}
              title={texts.about}
              subtitle={texts.versionAndInfo}
              onPress={handleAbout}
              rightComponent={<Ionicons name="chevron-forward" size={20} color={Colors.textLight} />}
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
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: scale(20),
    paddingBottom: verticalScale(10),
  },
  headerTitle: {
    fontSize: moderateScale(28),
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: verticalScale(5),
  },
  headerSubtitle: {
    fontSize: moderateScale(16),
    color: Colors.textLight,
  },
  settingsContainer: {
    flex: 1,
    paddingHorizontal: scale(20),
    paddingBottom: verticalScale(20),
  },
  section: {
    marginBottom: verticalScale(30),
  },
  sectionTitle: {
    fontSize: moderateScale(18),
    fontWeight: '600',
    color: Colors.text,
    marginBottom: verticalScale(15),
    paddingLeft: scale(5),
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.cardBackground,
    borderRadius: scale(12),
    padding: scale(16),
    marginBottom: verticalScale(8),
    elevation: 1,
    shadowColor: Colors.cardShadow,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
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
    fontWeight: '500',
    color: Colors.text,
    marginBottom: verticalScale(2),
  },
  settingSubtitle: {
    fontSize: moderateScale(14),
    color: Colors.textLight,
  },
});