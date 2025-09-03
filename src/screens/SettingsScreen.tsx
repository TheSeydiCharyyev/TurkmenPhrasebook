// Критичные исправления для SettingsScreen.tsx

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Switch,
  Alert,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../constants/Colors';
import { useOffline } from '../hooks/useOffline';
import { useHistory } from '../hooks/useHistory';
import { useAppLanguage } from '../contexts/LanguageContext';
import { useSearchHistory } from '../hooks/useSearchHistory';

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
  const [preferences, setPreferences] = useState<AppPreferences>(DEFAULT_PREFERENCES);
  const [availableVoices, setAvailableVoices] = useState<any[]>([]);
  const [showFontSizeModal, setShowFontSizeModal] = useState(false);
  const [showSpeechRateModal, setShowSpeechRateModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { isOnline, isDataCached, refreshCache, getCacheInfo } = useOffline();
  const { clearHistory, getStats } = useHistory();
  const { clearSearchHistory } = useSearchHistory();
  const { getTexts, config, switchMode, getLanguageName, resetLanguageSettings } = useAppLanguage();

  const stats = getStats();
  const texts = getTexts();

  // Мемоизация тяжелых вычислений
  const settingsTexts = useMemo(() => ({
    audioSettings: config.mode === 'tk' ? 'Audio sazlamalar' : '音频设置',
    interfaceSettings: config.mode === 'tk' ? 'Interfeýs sazlamalary' : '界面设置',
    dataSettings: config.mode === 'tk' ? 'Maglumat sazlamalary' : '数据设置',
    appInfo: config.mode === 'tk' ? 'Programma maglumatlar' : '应用信息',
  }), [config.mode]);

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
    const newModeName = config.mode === 'tk' ? getLanguageName('zh') : getLanguageName('tk');
    const currentModeName = getLanguageName(config.primaryLanguage);

    Alert.alert(
      '🌐 ' + texts.languageInterface,
      `${texts.switchLanguage}?\n\n${currentModeName} → ${newModeName}`,
      [
        { text: config.mode === 'tk' ? 'Ýatyr' : '取消', style: 'cancel' },
        {
          text: config.mode === 'tk' ? 'Üýtget' : '切换',
          onPress: async () => {
            await switchMode();
            Alert.alert(
              '✅ ' + (config.mode === 'tk' ? 'Üýtgedildi' : '已切换'),
              config.mode === 'tk' ? 'Interfeýs hytaýça üýtgedildi' : '界面已切换为土库曼语'
            );
          }
        }
      ]
    );
  }, [config, texts, getLanguageName, switchMode]);

  const handleTogglePreference = useCallback(async (key: keyof AppPreferences) => {
    const newValue = !preferences[key];
    await savePreference(key, newValue);

    // Показываем уведомление только для важных изменений
    if (key === 'soundEnabled' || key === 'hapticFeedback') {
      const message = newValue
        ? (config.mode === 'tk' ? 'Açyldy' : '已开启')
        : (config.mode === 'tk' ? 'Ýapyldy' : '已关闭');

      Alert.alert('⚙️', message);
    }
  }, [preferences, savePreference, config.mode]);

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

  const handleAbout = useCallback(async () => {
    const cacheInfo = await getCacheInfo();
    const cacheText = cacheInfo
      ? `\nКэш: ${cacheInfo.phrasesCount} фраз, ${cacheInfo.categoriesCount} категорий`
      : '';

    Alert.alert(
      texts.about,
      config.mode === 'tk'
        ? `Hytaý sözlem kitaby v1.0\n\nTürkmenistanyň we Hytaýyň syýahatçylary üçin döredildi\n\n© 2025${cacheText}`
        : `土库曼语会话手册 v1.0\n\n为中国和土库曼斯坦游客开发\n\n© 2025${cacheText}`
    );
  }, [texts.about, config.mode, getCacheInfo]);

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

            <SettingsItem
              icon="language"
              iconColor={Colors.primary}
              title={texts.switchLanguage}
              subtitle={`${config.mode === 'tk' ? 'Häzirki: ' : '当前: '}${getLanguageName(config.primaryLanguage)}`}
              onPress={handleLanguageToggle}
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
              subtitle={config.mode === 'tk' ? 'Aýdylyş çalgysy' : '发音播放'}
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
              title={config.mode === 'tk' ? 'Ses synag' : '语音测试'}
              subtitle={`${availableVoices.length} ${config.mode === 'tk' ? 'ses elýeterli' : '种声音可用'}`}
              onPress={testTTS}
              rightComponent={<Ionicons name="play" size={20} color={Colors.textLight} />}
            />
          </View>

          {/* Секция интерфейса */}
          <View style={styles.section}>
            <SectionHeader title={settingsTexts.interfaceSettings} />

            <SettingsItem
              icon="text"
              iconColor={Colors.primary}
              title={config.mode === 'tk' ? 'Harpyň ululygy' : '字体大小'}
              subtitle={`${config.mode === 'tk' ? 'Häzirki: ' : '当前: '}${preferences.fontSize}px`}
              onPress={() => setShowFontSizeModal(true)}
              rightComponent={<Ionicons name="chevron-forward" size={20} color={Colors.textLight} />}
            />

            <SettingsItem
              icon="phone-portrait"
              iconColor={Colors.accent}
              title={config.mode === 'tk' ? 'Yrgyldy' : '触觉反馈'}
              subtitle={config.mode === 'tk' ? 'Düwme basylanda yrgyldy' : '按钮按下时振动'}
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
              subtitle={`${stats.uniquePhrases} ${config.mode === 'tk' ? 'sözlem' : '短语'} • ${stats.totalViews} ${config.mode === 'tk' ? 'görkeziş' : '次查看'}`}
              onPress={() => {
                Alert.alert(
                  texts.clearHistory,
                  config.mode === 'tk' ? 'Taryhy arassalaňyzmy?' : '清除历史记录？',
                  [
                    { text: config.mode === 'tk' ? 'Ýatyr' : '取消', style: 'cancel' },
                    {
                      text: config.mode === 'tk' ? 'Arassala' : '清除',
                      style: 'destructive',
                      onPress: () => {
                        clearHistory();
                        Alert.alert('✅', config.mode === 'tk' ? 'Taryh arassalandy' : '历史已清除');
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
              subtitle={config.mode === 'tk' ? 'Wersiýa we maglumat' : '版本和信息'}
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
    padding: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: Colors.textLight,
  },
  settingsContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 15,
    paddingLeft: 5,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
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
    marginLeft: 16,
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    color: Colors.textLight,
  },
});