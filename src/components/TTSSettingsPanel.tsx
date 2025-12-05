// src/components/TTSSettingsPanel.tsx
// Панель настроек TTS (скорость, голос, кэш)

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';
import { useTTSSettings, VoiceGender } from '../hooks/useTTSSettings';
import { AudioCache } from '../services/tts';

interface TTSSettingsPanelProps {
  /** Callback при изменении настроек */
  onSettingsChange?: () => void;
}

/**
 * Панель настроек TTS
 */
export function TTSSettingsPanel({ onSettingsChange }: TTSSettingsPanelProps) {
  const {
    settings,
    isLoading,
    setRate,
    setPitch,
    setVoiceGender,
    setCacheEnabled,
    resetSettings,
  } = useTTSSettings();

  const [cacheStats, setCacheStats] = useState<{
    totalFiles: number;
    totalSizeMB: number;
  } | null>(null);

  // Загрузка статистики кэша
  useEffect(() => {
    loadCacheStats();
  }, []);

  const loadCacheStats = async () => {
    try {
      const stats = await AudioCache.getStats();
      setCacheStats({
        totalFiles: stats.totalFiles,
        totalSizeMB: stats.totalSizeMB,
      });
    } catch (error) {
      console.warn('Failed to load cache stats:', error);
    }
  };

  const handleClearCache = () => {
    Alert.alert(
      'Очистить кэш аудио?',
      `Будет удалено ${cacheStats?.totalFiles || 0} файлов (${cacheStats?.totalSizeMB || 0} MB)`,
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Очистить',
          style: 'destructive',
          onPress: async () => {
            await AudioCache.clear();
            await loadCacheStats();
            onSettingsChange?.();
          },
        },
      ]
    );
  };

  const handleResetSettings = () => {
    Alert.alert(
      'Сбросить настройки?',
      'Все настройки TTS будут сброшены на значения по умолчанию',
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Сбросить',
          onPress: async () => {
            await resetSettings();
            onSettingsChange?.();
          },
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Загрузка настроек...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Заголовок */}
      <View style={styles.header}>
        <Ionicons name="settings" size={24} color="#374151" />
        <Text style={styles.title}>Настройки аудио</Text>
      </View>

      {/* Скорость речи */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="speedometer" size={20} color="#6B7280" />
          <Text style={styles.sectionTitle}>Скорость речи</Text>
          <Text style={styles.sectionValue}>{settings.rate.toFixed(1)}x</Text>
        </View>
        <Slider
          style={styles.slider}
          minimumValue={0.5}
          maximumValue={2.0}
          step={0.1}
          value={settings.rate}
          onValueChange={setRate}
          minimumTrackTintColor="#3B82F6"
          maximumTrackTintColor="#D1D5DB"
          thumbTintColor="#3B82F6"
        />
        <View style={styles.sliderLabels}>
          <Text style={styles.sliderLabel}>0.5x</Text>
          <Text style={styles.sliderLabel}>1.0x</Text>
          <Text style={styles.sliderLabel}>2.0x</Text>
        </View>
      </View>

      {/* Высота голоса */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="musical-note" size={20} color="#6B7280" />
          <Text style={styles.sectionTitle}>Высота голоса</Text>
          <Text style={styles.sectionValue}>{settings.pitch.toFixed(1)}</Text>
        </View>
        <Slider
          style={styles.slider}
          minimumValue={0.5}
          maximumValue={2.0}
          step={0.1}
          value={settings.pitch}
          onValueChange={setPitch}
          minimumTrackTintColor="#8B5CF6"
          maximumTrackTintColor="#D1D5DB"
          thumbTintColor="#8B5CF6"
        />
        <View style={styles.sliderLabels}>
          <Text style={styles.sliderLabel}>Низкий</Text>
          <Text style={styles.sliderLabel}>Норма</Text>
          <Text style={styles.sliderLabel}>Высокий</Text>
        </View>
      </View>

      {/* Выбор голоса */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="person" size={20} color="#6B7280" />
          <Text style={styles.sectionTitle}>Голос</Text>
        </View>
        <View style={styles.genderButtons}>
          <TouchableOpacity
            style={[
              styles.genderButton,
              settings.voiceGender === 'female' && styles.genderButtonActive,
            ]}
            onPress={() => setVoiceGender('female')}
          >
            <Ionicons
              name="woman"
              size={20}
              color={settings.voiceGender === 'female' ? '#FFFFFF' : '#6B7280'}
            />
            <Text
              style={[
                styles.genderButtonText,
                settings.voiceGender === 'female' && styles.genderButtonTextActive,
              ]}
            >
              Женский
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.genderButton,
              settings.voiceGender === 'male' && styles.genderButtonActive,
            ]}
            onPress={() => setVoiceGender('male')}
          >
            <Ionicons
              name="man"
              size={20}
              color={settings.voiceGender === 'male' ? '#FFFFFF' : '#6B7280'}
            />
            <Text
              style={[
                styles.genderButtonText,
                settings.voiceGender === 'male' && styles.genderButtonTextActive,
              ]}
            >
              Мужской
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Кэширование */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="download" size={20} color="#6B7280" />
          <Text style={styles.sectionTitle}>Кэширование</Text>
          <Switch
            value={settings.cacheEnabled}
            onValueChange={setCacheEnabled}
            trackColor={{ false: '#D1D5DB', true: '#86EFAC' }}
            thumbColor={settings.cacheEnabled ? '#22C55E' : '#9CA3AF'}
          />
        </View>
        <Text style={styles.sectionDescription}>
          Сохранять аудио для быстрого повторного воспроизведения
        </Text>

        {cacheStats && (
          <View style={styles.cacheInfo}>
            <Text style={styles.cacheInfoText}>
              Кэш: {cacheStats.totalFiles} файлов ({cacheStats.totalSizeMB} MB)
            </Text>
            <TouchableOpacity
              style={styles.clearCacheButton}
              onPress={handleClearCache}
            >
              <Ionicons name="trash" size={16} color="#DC2626" />
              <Text style={styles.clearCacheText}>Очистить</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Сброс настроек */}
      <TouchableOpacity
        style={styles.resetButton}
        onPress={handleResetSettings}
      >
        <Ionicons name="refresh" size={18} color="#6B7280" />
        <Text style={styles.resetButtonText}>Сбросить настройки</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    gap: 20,
  },
  loadingText: {
    color: '#6B7280',
    textAlign: 'center',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
  },
  section: {
    gap: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#374151',
    flex: 1,
  },
  sectionValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#3B82F6',
  },
  sectionDescription: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: -4,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -8,
  },
  sliderLabel: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  genderButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  genderButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  genderButtonActive: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  genderButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  genderButtonTextActive: {
    color: '#FFFFFF',
  },
  cacheInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 8,
  },
  cacheInfoText: {
    fontSize: 13,
    color: '#6B7280',
  },
  clearCacheButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#FEE2E2',
  },
  clearCacheText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#DC2626',
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    marginTop: 8,
  },
  resetButtonText: {
    fontSize: 14,
    color: '#6B7280',
  },
});

export default TTSSettingsPanel;
