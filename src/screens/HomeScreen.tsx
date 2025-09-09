// src/screens/HomeScreen.tsx - ИСПРАВЛЕНО для корректной работы с useHistory

import React, { useMemo, useCallback, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Modal,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

// Импорты
import { Category, HomeStackParamList, Phrase } from '../types';
import { Colors } from '../constants/Colors';
import { TextStyles } from '../constants/Typography';
import { useHistory } from '../hooks/useHistory';
import { useAppLanguage } from '../contexts/LanguageContext';
import { useAnimations } from '../hooks/useAnimations';
import { useOfflineData } from '../contexts/OfflineDataContext';
import { phrases } from '../data/phrases'; // Импортируем фразы
import CategoryCard from '../components/CategoryCard';
import ErrorBoundary from '../components/ErrorBoundary';

const { width } = Dimensions.get('window');
const cardWidth = (width - 60) / 3;
const cardHeight = 120;

type HomeScreenNavigationProp = StackNavigationProp<HomeStackParamList, 'CategoryScreen'>;

// ✅ ИСПРАВЛЕНО: Отдельный компонент RecentCategoryCard внутри файла
const RecentCategoryCard = React.memo<{
  recentPhrases: Phrase[];
  stats: any;
  onPress: () => void;
  onStatsPress: () => void;
}>(({ recentPhrases, stats, onPress, onStatsPress }) => {
  const { hapticFeedback } = useAnimations();
  const { getTexts, config } = useAppLanguage();
  const texts = getTexts();

  const handlePress = useCallback(() => {
    hapticFeedback('medium');
    onPress();
  }, [onPress, hapticFeedback]);

  const handleLongPress = useCallback(() => {
    hapticFeedback('heavy');
    onStatsPress();
  }, [onStatsPress, hapticFeedback]);

  return (
    <View style={styles.cardContainer}>
      <TouchableOpacity
        style={[styles.categoryCard, styles.recentCard]}
        onPress={handlePress}
        onLongPress={handleLongPress}
        activeOpacity={0.7}
      >
        <View style={styles.recentCardContent}>
          {/* Иконка */}
          <View style={styles.recentIconContainer}>
            <Ionicons name="time" size={32} color={Colors.primary} />
          </View>

          {/* Заголовок */}
          <Text style={styles.recentTitle} numberOfLines={2}>
{texts.recentlyStudied}
          </Text>

          {/* Статистика */}
          <View style={styles.recentStatsContainer}>
            <Text style={styles.recentStatsText}>
              {recentPhrases.length} {config.mode === 'tk' ? 'sözlem' : 
                                     config.mode === 'zh' ? '短语' : 'фраз'}
            </Text>
            {stats.todaysPhrases > 0 && (
              <Text style={styles.recentTodayText}>
                {config.mode === 'tk' ? `Şu gün: ${stats.todaysPhrases}` :
                 config.mode === 'zh' ? `今天: ${stats.todaysPhrases}` :
                 `Сегодня: ${stats.todaysPhrases}`}
              </Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
});

// Модальное окно статистики
const StatsModal = React.memo<{
  visible: boolean;
  onClose: () => void;
  recentPhrases: Phrase[];
  stats: any;
}>(({ visible, onClose, recentPhrases, stats }) => {
  const { getTexts, config } = useAppLanguage();
  const texts = getTexts();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>
            {config.mode === 'tk' ? 'Statistika' : 
             config.mode === 'zh' ? '统计' : 'Статистика'}
          </Text>
          
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.uniquePhrases}</Text>
              <Text style={styles.statLabel}>
                {config.mode === 'tk' ? 'Sözlem' : 
                 config.mode === 'zh' ? '短语' : 'Фраз изучено'}
              </Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.streakDays}</Text>
              <Text style={styles.statLabel}>
                {config.mode === 'tk' ? 'Gün' : 
                 config.mode === 'zh' ? '天' : 'Дней подряд'}
              </Text>
            </View>
          </View>

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>
              {config.mode === 'tk' ? 'Ýap' : 
               config.mode === 'zh' ? '关闭' : 'Закрыть'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
});

// ✅ ГЛАВНЫЙ КОМПОНЕНТ HomeScreen
function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { getTexts, config } = useAppLanguage();
  const { hapticFeedback } = useAnimations();
  
  // ✅ ИСПРАВЛЕНО: Используем правильные методы из useHistory
  const { getRecentPhrases, stats } = useHistory();
  const { categories } = useOfflineData();
  const [showQuickStats, setShowQuickStats] = useState(false);

  const texts = getTexts();

  // ✅ ИСПРАВЛЕНО: Получаем недавние фразы через метод getRecentPhrases
  const recentPhrases = useMemo(() => {
    return getRecentPhrases(phrases, 10); // Получаем последние 10 фраз
  }, [getRecentPhrases]);

  const handleCategoryPress = useCallback((category: Category) => {
    hapticFeedback('light');
    navigation.navigate('CategoryScreen', { category });
  }, [navigation, hapticFeedback]);

  const handleRecentPress = useCallback(() => {
    if (recentPhrases.length > 0) {
      hapticFeedback('light');
      const firstRecentPhrase = recentPhrases[0];
      const category = categories.find(cat => cat.id === firstRecentPhrase.categoryId);
      if (category) {
        navigation.navigate('CategoryScreen', { category });
      }
    }
  }, [recentPhrases, categories, navigation, hapticFeedback]);

  const handleStatsPress = useCallback(() => {
    hapticFeedback('medium');
    setShowQuickStats(true);
  }, [hapticFeedback]);

  const closeStatsModal = useCallback(() => {
    setShowQuickStats(false);
  }, []);

  // ✅ ИСПРАВЛЕНО: Показываем только категории (без недавних)
  const gridData = useMemo(() => [
    ...categories, // Показываем ВСЕ категории
  ], [categories]);

  const renderGridItem = useCallback(({ item, index }: { item: Category | string; index: number }) => {
    if (item === 'recent') {
      return (
        <ErrorBoundary
          fallbackComponent={
            <View style={styles.categoryCard}>
              <Text style={styles.errorText}>Ошибка загрузки недавних</Text>
            </View>
          }
        >
          <RecentCategoryCard
            recentPhrases={recentPhrases}
            stats={stats}
            onPress={handleRecentPress}
            onStatsPress={handleStatsPress}
          />
        </ErrorBoundary>
      );
    }

    // ✅ ИСПРАВЛЕНО: Обычные категории используют CategoryCard
    return (
      <ErrorBoundary
        fallbackComponent={
          <View style={styles.categoryCard}>
            <Text style={styles.errorText}>Ошибка категории</Text>
          </View>
        }
      >
        <CategoryCard
          category={item as Category}
          onPress={handleCategoryPress}
          index={index}
        />
      </ErrorBoundary>
    );
  }, [recentPhrases, stats, handleRecentPress, handleStatsPress, handleCategoryPress]);

  const keyExtractor = useCallback((item: Category | string, index: number) =>
    typeof item === 'string' ? item : (item as Category).id + index.toString()
    , []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      {/* ✅ ИСПРАВЛЕНО: Правильный заголовок в зависимости от языка */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {texts.appTitle}
        </Text>
        <Text style={styles.headerSubtitle}>
          {texts.selectCategory}
        </Text>

        {/* Быстрая информация */}
        {stats.uniquePhrases > 0 && (
          <View style={styles.quickInfo}>
            <View style={styles.quickInfoItem}>
              <Ionicons name="book" size={16} color={Colors.primary} />
              <Text style={styles.quickInfoText}>
                {stats.uniquePhrases} {config.mode === 'tk' ? 'sözlem' : 
                                       config.mode === 'zh' ? '短语' : 'фраз'}
              </Text>
            </View>
            {stats.streakDays > 0 && (
              <View style={styles.quickInfoItem}>
                <Ionicons name="flame" size={16} color={Colors.error} />
                <Text style={styles.quickInfoText}>
                  {stats.streakDays} {config.mode === 'tk' ? 'gün' : 
                                     config.mode === 'zh' ? '天' : 'дней'}
                </Text>
              </View>
            )}
          </View>
        )}
      </View>

      {/* ✅ ИСПРАВЛЕНО: Сетка категорий с правильным отображением */}
      <FlatList
        data={gridData}
        renderItem={renderGridItem}
        keyExtractor={keyExtractor}
        numColumns={2}
        style={styles.gridContainer}
        contentContainerStyle={styles.gridContent}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={styles.gridRow}
      />

      {/* Модальное окно статистики */}
      <StatsModal
        visible={showQuickStats}
        onClose={closeStatsModal}
        recentPhrases={recentPhrases}
        stats={stats}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
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
    marginBottom: 12,
  },
  quickInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundLight,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  quickInfoText: {
    fontSize: 14,
    color: Colors.textLight,
    marginLeft: 6,
  },
  gridContainer: {
    flex: 1,
  },
  gridContent: {
    padding: 16,
  },
  gridRow: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  cardContainer: {
    width: (width - 48) / 2,
    marginBottom: 8,
  },
  categoryCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: 16,
    width: (width - 48) / 2,
    minHeight: cardHeight,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  recentCard: {
    backgroundColor: Colors.primary + '10',
    borderWidth: 1,
    borderColor: Colors.primary + '30',
  },
  recentCardContent: {
    alignItems: 'center',
    width: '100%',
  },
  recentIconContainer: {
    marginBottom: 8,
  },
  recentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  recentStatsContainer: {
    alignItems: 'center',
  },
  recentStatsText: {
    fontSize: 14,
    color: Colors.textLight,
    textAlign: 'center',
  },
  recentTodayText: {
    fontSize: 12,
    color: Colors.primary,
    textAlign: 'center',
    marginTop: 2,
  },
  errorText: {
    color: Colors.error,
    fontSize: 14,
    textAlign: 'center',
  },
  
  // Модальное окно
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 20,
    padding: 24,
    margin: 20,
    minWidth: 280,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  statLabel: {
    fontSize: 14,
    color: Colors.textLight,
    textAlign: 'center',
    marginTop: 4,
  },
  closeButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignSelf: 'center',
  },
  closeButtonText: {
    color: Colors.textWhite,
    fontSize: 16,
    fontWeight: '600',
  },
});

// ✅ ИСПРАВЛЕНО: Только ОДИН export default
export default HomeScreen;