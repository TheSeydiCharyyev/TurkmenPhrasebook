// src/screens/OfflineSettingsScreen.tsx - ИСПРАВЛЕННАЯ ВЕРСИЯ
import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors, ColorUtils } from '../constants/Colors';
import { TextStyles } from '../constants/Typography';
import { useOfflineDataManager } from '../hooks/useOfflineDataManager';
import { useOfflineData } from '../contexts/OfflineDataContext';
import { useAnimations } from '../hooks/useAnimations';
import { useAppLanguage } from '../contexts/LanguageContext';
import AnimatedButton from '../components/AnimatedButton';
import { LoadingSpinner } from '../components/LoadingStates';

const { width } = Dimensions.get('window');

interface SettingItem {
  key: string;
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  type: 'switch' | 'action' | 'info' | 'select';
  value?: any;
  options?: Array<{ label: string; value: any }>;
  action?: () => void;
}

export default function OfflineSettingsScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>(['sync']);

  const {
    preferences,
    updatePreferences,
    getDetailedStats,
    forcSync,
    clearCache,
    isOnline,
    networkQuality,
    dataFreshness,
    queueSize,
    lastSync,
    cacheStats,
  } = useOfflineDataManager();

  const { refreshData, dataSource, lastUpdate } = useOfflineData();
  const { hapticFeedback } = useAnimations(); // ИСПРАВЛЕНО: убран pulseAnimation
  const { config } = useAppLanguage();

  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const detailedStats = await getDetailedStats();
      setStats(detailedStats);
    } catch (error) {
      console.warn('Failed to load stats:', error);
    }
  };

  const toggleSection = useCallback((section: string) => {
    hapticFeedback('light');
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  }, [hapticFeedback]);

  const handlePreferenceChange = useCallback(async (key: keyof typeof preferences, value: any) => {
    hapticFeedback('light');
    await updatePreferences({ [key]: value });
  }, [updatePreferences, hapticFeedback]);

  const handleForceSync = useCallback(async () => {
    if (!isOnline) {
      Alert.alert(
        'Нет подключения',
        'Для синхронизации требуется подключение к интернету'
      );
      return;
    }

    hapticFeedback('medium');
    setIsLoading(true);

    try {
      const success = await forcSync();
      if (success) {
        await loadStats();
        Alert.alert('✅', 'Синхронизация завершена успешно');
      } else {
        Alert.alert('❌', 'Не удалось выполнить синхронизацию');
      }
    } catch (error) {
      Alert.alert('❌', 'Произошла ошибка при синхронизации');
    } finally {
      setIsLoading(false);
    }
  }, [isOnline, forcSync, hapticFeedback, loadStats]);

  const handleRefreshData = useCallback(async () => {
    hapticFeedback('medium');
    setIsLoading(true);

    try {
      const success = await refreshData();
      if (success) {
        await loadStats();
        Alert.alert('✅', 'Данные обновлены успешно');
      } else {
        Alert.alert('❌', 'Не удалось обновить данные');
      }
    } catch (error) {
      Alert.alert('❌', 'Произошла ошибка при обновлении');
    } finally {
      setIsLoading(false);
    }
  }, [refreshData, hapticFeedback, loadStats]);

  const handleClearCache = useCallback(() => {
    Alert.alert(
      '🗑️ Очистить кэш',
      'Это удалит все офлайн данные. Вы уверены?',
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Очистить',
          style: 'destructive',
          onPress: async () => {
            hapticFeedback('heavy');
            setIsLoading(true);
            
            try {
              const success = await clearCache();
              if (success) {
                await loadStats();
                Alert.alert('✅', 'Кэш успешно очищен');
              } else {
                Alert.alert('❌', 'Не удалось очистить кэш');
              }
            } catch (error) {
              Alert.alert('❌', 'Произошла ошибка при очистке');
            } finally {
              setIsLoading(false);
            }
          }
        }
      ]
    );
  }, [clearCache, hapticFeedback, loadStats]);

  const handleExportStats = useCallback(() => {
    if (!stats) return;

    const statsText = `
Статистика офлайн режима:
• Статус сети: ${isOnline ? 'Онлайн' : 'Офлайн'}
• Качество сети: ${networkQuality}
• Источник данных: ${dataSource}
• Свежесть данных: ${dataFreshness}
• Размер кэша: ${Math.round(cacheStats.totalSize / 1024)} KB
• Элементов в кэше: ${cacheStats.itemCount}
• Очередь синхронизации: ${queueSize}
• Последняя синхронизация: ${lastSync ? new Date(lastSync).toLocaleString() : 'Никогда'}
• Hit Rate: ${Math.round(cacheStats.hitRate * 100)}%
• Среднее качество сети: ${Math.round(stats.avgNetworkQuality * 100) / 100}
    `;

    Alert.alert('📊 Статистика', statsText.trim(), [
      { text: 'Закрыть', style: 'cancel' }
    ]);
  }, [stats, isOnline, networkQuality, dataSource, dataFreshness, cacheStats, queueSize, lastSync]);

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatRelativeTime = (timestamp: number): string => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'только что';
    if (minutes < 60) return `${minutes}м назад`;
    if (hours < 24) return `${hours}ч назад`;
    return `${days}д назад`;
  };

  const getStatusColor = () => {
    if (!isOnline) return Colors.error;
    if (queueSize > 0) return Colors.warning;
    if (dataFreshness === 'expired') return Colors.error;
    if (dataFreshness === 'stale') return Colors.warning;
    return Colors.success;
  };

  const getStatusIcon = (): keyof typeof Ionicons.glyphMap => {
    if (!isOnline) return 'cloud-offline';
    if (queueSize > 0) return 'cloud-upload';
    if (dataFreshness === 'expired') return 'alert-circle';
    return 'checkmark-circle';
  };

  const getStatusText = () => {
    if (!isOnline) return 'Офлайн режим';
    if (queueSize > 0) return `Ожидает синхронизации (${queueSize})`;
    if (dataFreshness === 'expired') return 'Данные устарели';
    if (dataFreshness === 'stale') return 'Данные не свежие';
    return 'Все актуально';
  };

  const NetworkQualityIndicator = () => (
    <View style={styles.qualityIndicator}>
      <Text style={styles.qualityLabel}>Качество сети:</Text>
      <View style={[styles.qualityDot, { 
        backgroundColor: isOnline ? 
          networkQuality === 'excellent' ? Colors.success :
          networkQuality === 'good' ? Colors.accent :
          networkQuality === 'fair' ? Colors.warning :
          Colors.error : Colors.textLight
      }]} />
      <Text style={styles.qualityText}>
        {isOnline ? networkQuality : 'недоступна'}
      </Text>
    </View>
  );

  if (isLoading) {
    return <LoadingSpinner message="Обработка..." />; // ИСПРАВЛЕНО: использован LoadingSpinner
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Статус соединения */}
        <View style={styles.section}>
          <View style={styles.statusHeader}>
            <View style={[styles.statusIndicator, { backgroundColor: getStatusColor() }]}>
              <Ionicons name={getStatusIcon()} size={20} color={Colors.textWhite} />
            </View>
            <View style={styles.statusInfo}>
              <Text style={styles.statusTitle}>{getStatusText()}</Text>
              <Text style={styles.statusSubtitle}>
                Источник данных: {dataSource === 'cache' ? 'кэш' : 'локальные данные'}
              </Text>
            </View>
          </View>
          <NetworkQualityIndicator />
        </View>

        {/* Статистика */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() => toggleSection('stats')}
            activeOpacity={0.7}
          >
            <View style={styles.sectionHeaderLeft}>
              <Ionicons name="stats-chart" size={20} color={Colors.primary} />
              <Text style={styles.sectionTitle}>Статистика</Text>
            </View>
            <Ionicons
              name={expandedSections.includes('stats') ? 'chevron-up' : 'chevron-down'}
              size={16}
              color={Colors.textLight}
            />
          </TouchableOpacity>

          {expandedSections.includes('stats') && (
            <View style={styles.sectionContent}>
              <View style={styles.statsGrid}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{formatBytes(cacheStats.totalSize)}</Text>
                  <Text style={styles.statLabel}>Размер кэша</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{cacheStats.itemCount}</Text>
                  <Text style={styles.statLabel}>Элементов</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{Math.round(cacheStats.hitRate * 100)}%</Text>
                  <Text style={styles.statLabel}>Hit Rate</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{queueSize}</Text>
                  <Text style={styles.statLabel}>В очереди</Text>
                </View>
              </View>

              {lastSync && (
                <View style={styles.lastSyncInfo}>
                  <Ionicons name="time" size={16} color={Colors.textLight} />
                  <Text style={styles.lastSyncText}>
                    Последняя синхронизация: {formatRelativeTime(lastSync)}
                  </Text>
                </View>
              )}

              <View style={styles.actionButtonContainer}>
                <AnimatedButton
                  title="Экспорт статистики"
                  variant="outline"
                  size="small"
                  onPress={handleExportStats}
                />
              </View>
            </View>
          )}
        </View>

        {/* Настройки синхронизации */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() => toggleSection('sync')}
            activeOpacity={0.7}
          >
            <View style={styles.sectionHeaderLeft}>
              <Ionicons name="sync" size={20} color={Colors.primary} />
              <Text style={styles.sectionTitle}>Синхронизация</Text>
            </View>
            <Ionicons
              name={expandedSections.includes('sync') ? 'chevron-up' : 'chevron-down'}
              size={16}
              color={Colors.textLight}
            />
          </TouchableOpacity>

          {expandedSections.includes('sync') && (
            <View style={styles.sectionContent}>
              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>Автоматическая синхронизация</Text>
                  <Text style={styles.settingSubtitle}>
                    Синхронизировать изменения автоматически
                  </Text>
                </View>
                <Switch
                  value={preferences.autoSync}
                  onValueChange={(value) => handlePreferenceChange('autoSync', value)}
                  trackColor={{ false: Colors.cardBorder, true: ColorUtils.withOpacity(Colors.primary, 0.5) }}
                  thumbColor={preferences.autoSync ? Colors.primary : Colors.textLight}
                />
              </View>

              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>Только по Wi-Fi</Text>
                  <Text style={styles.settingSubtitle}>
                    Синхронизировать только при подключении к Wi-Fi
                  </Text>
                </View>
                <Switch
                  value={preferences.syncOnlyOnWifi}
                  onValueChange={(value) => handlePreferenceChange('syncOnlyOnWifi', value)}
                  trackColor={{ false: Colors.cardBorder, true: ColorUtils.withOpacity(Colors.primary, 0.5) }}
                  thumbColor={preferences.syncOnlyOnWifi ? Colors.primary : Colors.textLight}
                />
              </View>

              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>Фоновая синхронизация</Text>
                  <Text style={styles.settingSubtitle}>
                    Синхронизировать при возврате в приложение
                  </Text>
                </View>
                <Switch
                  value={preferences.enableBackgroundSync}
                  onValueChange={(value) => handlePreferenceChange('enableBackgroundSync', value)}
                  trackColor={{ false: Colors.cardBorder, true: ColorUtils.withOpacity(Colors.primary, 0.5) }}
                  thumbColor={preferences.enableBackgroundSync ? Colors.primary : Colors.textLight}
                />
              </View>

              <View style={styles.actionButtonContainer}>
                <AnimatedButton
                  title="Принудительная синхронизация"
                  variant="primary"
                  size="medium"
                  onPress={handleForceSync}
                  disabled={!isOnline}
                />
              </View>
            </View>
          )}
        </View>

        {/* Управление данными */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() => toggleSection('data')}
            activeOpacity={0.7}
          >
            <View style={styles.sectionHeaderLeft}>
              <Ionicons name="server" size={20} color={Colors.primary} />
              <Text style={styles.sectionTitle}>Управление данными</Text>
            </View>
            <Ionicons
              name={expandedSections.includes('data') ? 'chevron-up' : 'chevron-down'}
              size={16}
              color={Colors.textLight}
            />
          </TouchableOpacity>

          {expandedSections.includes('data') && (
            <View style={styles.sectionContent}>
              <View style={styles.actionButtons}>
                <View style={styles.actionButtonWrapper}>
                  <AnimatedButton
                    title="Обновить данные"
                    variant="secondary"
                    size="medium"
                    onPress={handleRefreshData}
                    disabled={!isOnline}
                  />
                </View>
                <View style={styles.actionButtonWrapper}>
                  <AnimatedButton
                    title="Очистить кэш"
                    variant="outline"
                    size="medium"
                    onPress={handleClearCache}
                  />
                </View>
              </View>
            </View>
          )}
        </View>

        {/* Продвинутые настройки */}
        <View style={[styles.section, { marginBottom: 100 }]}>
          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() => toggleSection('advanced')}
            activeOpacity={0.7}
          >
            <View style={styles.sectionHeaderLeft}>
              <Ionicons name="settings" size={20} color={Colors.primary} />
              <Text style={styles.sectionTitle}>Продвинутые настройки</Text>
            </View>
            <Ionicons
              name={expandedSections.includes('advanced') ? 'chevron-up' : 'chevron-down'}
              size={16}
              color={Colors.textLight}
            />
          </TouchableOpacity>

          {expandedSections.includes('advanced') && (
            <View style={styles.sectionContent}>
              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>Максимальный размер кэша</Text>
                  <Text style={styles.settingSubtitle}>
                    {preferences.maxCacheSize} MB
                  </Text>
                </View>
              </View>

              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>Хранить историю</Text>
                  <Text style={styles.settingSubtitle}>
                    {preferences.keepHistoryDays} дней
                  </Text>
                </View>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginHorizontal: 16,
    marginVertical: 8,
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: 'rgba(0,0,0,0.1)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
  },
  statusIndicator: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  statusInfo: {
    flex: 1,
  },
  statusTitle: {
    ...TextStyles.body,
    fontWeight: '600',
    color: Colors.text,
  },
  statusSubtitle: {
    ...TextStyles.caption,
    color: Colors.textLight,
    marginTop: 2,
  },
  qualityIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  qualityLabel: {
    ...TextStyles.caption,
    color: Colors.textLight,
    marginRight: 8,
  },
  qualityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  qualityText: {
    ...TextStyles.caption,
    color: Colors.text,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    ...TextStyles.body,
    fontWeight: '600',
    color: Colors.text,
    marginLeft: 12,
  },
  sectionContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
    minWidth: (width - 80) / 2,
    backgroundColor: Colors.background,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  statValue: {
    ...TextStyles.h3,
    color: Colors.primary,
    fontWeight: 'bold',
  },
  statLabel: {
    ...TextStyles.caption,
    color: Colors.textLight,
    marginTop: 4,
    textAlign: 'center',
  },
  lastSyncInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  lastSyncText: {
    ...TextStyles.caption,
    color: Colors.textLight,
    marginLeft: 8,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    ...TextStyles.body,
    color: Colors.text,
    fontWeight: '500',
  },
  settingSubtitle: {
    ...TextStyles.caption,
    color: Colors.textLight,
    marginTop: 2,
  },
  actionButtons: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 8,
  },
  actionButtonWrapper: {
    flex: 1,
  },
  actionButtonContainer: {
    marginTop: 12,
  },
});