// src/screens/LanguageStatsScreen.tsx
// Экран статистики языков (Phase 5) - Доступ из Settings
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LanguageAnalyticsService } from '../services/LanguageAnalytics';
import { TranslationVersioningService } from '../services/TranslationVersioning';
import { getLanguageByCode } from '../config/languages.config';
import { Colors } from '../constants/Colors';
import { scale, verticalScale, moderateScale } from '../utils/ResponsiveUtils';

export default function LanguageStatsScreen({ navigation }: any) {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [versioning, setVersioning] = useState<any>(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setIsLoading(true);
      const [analyticsStats, versioningStats] = await Promise.all([
        LanguageAnalyticsService.getStats(),
        TranslationVersioningService.getLanguagesStats(),
      ]);

      setStats(analyticsStats);
      setVersioning(versioningStats);
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDuration = (ms: number): string => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Language Statistics</Text>
          <TouchableOpacity onPress={loadStats}>
            <Ionicons name="refresh" size={24} color={Colors.text} />
          </TouchableOpacity>
        </View>

        {/* Overall Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📊 Overall Statistics</Text>

          <View style={styles.card}>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Languages Used:</Text>
              <Text style={styles.statValue}>{stats?.totalLanguagesUsed || 0} / 30</Text>
            </View>

            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Total Switches:</Text>
              <Text style={styles.statValue}>{stats?.totalSwitches || 0}</Text>
            </View>

            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Avg Session Duration:</Text>
              <Text style={styles.statValue}>
                {formatDuration(stats?.averageSessionDuration || 0)}
              </Text>
            </View>

            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Most Used Language:</Text>
              <Text style={styles.statValue}>
                {stats?.mostUsedLanguage
                  ? getLanguageByCode(stats.mostUsedLanguage)?.name || stats.mostUsedLanguage
                  : 'N/A'}
              </Text>
            </View>
          </View>
        </View>

        {/* Downloaded Languages */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💾 Downloaded Languages</Text>

          <View style={styles.card}>
            <Text style={styles.downloadedText}>
              {versioning?.downloaded || 0} / {versioning?.total || 30} languages downloaded
            </Text>

            {versioning?.languages?.map((lang: any) => {
              const language = getLanguageByCode(lang.languageCode);
              return (
                <View key={lang.languageCode} style={styles.languageItem}>
                  <Text style={styles.languageFlag}>{language?.flag || '🌍'}</Text>
                  <View style={styles.languageInfo}>
                    <Text style={styles.languageName}>{language?.name || lang.languageCode}</Text>
                    <Text style={styles.languageVersion}>
                      v{lang.version} • {lang.phrasesCount} phrases
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Usage by Language */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📈 Usage by Language</Text>

          {Object.values(stats?.usageByLanguage || {}).map((usage: any) => {
            const language = getLanguageByCode(usage.languageCode);
            return (
              <View key={usage.languageCode} style={styles.card}>
                <View style={styles.usageHeader}>
                  <Text style={styles.languageFlag}>{language?.flag || '🌍'}</Text>
                  <Text style={styles.languageName}>{language?.name || usage.languageCode}</Text>
                </View>

                <View style={styles.usageStats}>
                  <View style={styles.usageStat}>
                    <Text style={styles.usageLabel}>Sessions</Text>
                    <Text style={styles.usageValue}>{usage.totalSessions}</Text>
                  </View>

                  <View style={styles.usageStat}>
                    <Text style={styles.usageLabel}>Duration</Text>
                    <Text style={styles.usageValue}>{formatDuration(usage.totalDuration)}</Text>
                  </View>

                  <View style={styles.usageStat}>
                    <Text style={styles.usageLabel}>Phrases</Text>
                    <Text style={styles.usageValue}>{usage.phrasesViewed}</Text>
                  </View>

                  <View style={styles.usageStat}>
                    <Text style={styles.usageLabel}>Audio</Text>
                    <Text style={styles.usageValue}>{usage.audioPlayed}</Text>
                  </View>
                </View>
              </View>
            );
          })}
        </View>

        {/* Debug Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🛠️ Debug Actions</Text>

          <TouchableOpacity
            style={[styles.button, styles.buttonDanger]}
            onPress={async () => {
              await LanguageAnalyticsService.clearAll();
              await TranslationVersioningService.clearAll();
              loadStats();
            }}
          >
            <Text style={styles.buttonText}>Clear All Data</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: scale(16),
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: moderateScale(20),
    fontWeight: 'bold',
    color: Colors.text,
  },
  section: {
    padding: scale(16),
  },
  sectionTitle: {
    fontSize: moderateScale(18),
    fontWeight: '600',
    color: Colors.text,
    marginBottom: verticalScale(12),
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: moderateScale(12),
    padding: scale(16),
    marginBottom: verticalScale(12),
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: verticalScale(8),
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  statLabel: {
    fontSize: moderateScale(14),
    color: '#6B7280',
  },
  statValue: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    color: Colors.text,
  },
  downloadedText: {
    fontSize: moderateScale(14),
    color: '#6B7280',
    marginBottom: verticalScale(12),
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: verticalScale(8),
  },
  languageFlag: {
    fontSize: moderateScale(24),
    marginRight: scale(12),
  },
  languageInfo: {
    flex: 1,
  },
  languageName: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    color: Colors.text,
  },
  languageVersion: {
    fontSize: moderateScale(12),
    color: '#6B7280',
    marginTop: verticalScale(2),
  },
  usageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(12),
  },
  usageStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  usageStat: {
    alignItems: 'center',
  },
  usageLabel: {
    fontSize: moderateScale(12),
    color: '#6B7280',
    marginBottom: verticalScale(4),
  },
  usageValue: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    color: Colors.text,
  },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: moderateScale(12),
    padding: scale(16),
    alignItems: 'center',
  },
  buttonDanger: {
    backgroundColor: '#EF4444',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: moderateScale(16),
    fontWeight: '600',
  },
});
