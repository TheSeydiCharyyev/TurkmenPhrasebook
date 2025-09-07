// src/screens/HomeScreen.tsx - Полная исправленная версия
import React, { useMemo, useCallback, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ImageBackground,
  Dimensions,
  Modal,
  ScrollView,
  Animated,
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
import CategoryCard from '../components/CategoryCard';
import ErrorBoundary from '../components/ErrorBoundary';

const { width } = Dimensions.get('window');
const cardWidth = (width - 60) / 3;
const cardHeight = 120;

type HomeScreenNavigationProp = StackNavigationProp<HomeStackParamList, 'CategoryScreen'>;

// Мемоизированный компонент карточки категории
const CategoryCard = React.memo<{
  category: Category;
  onPress: (category: Category) => void;
  index: number;
}>(({ category, onPress, index }) => {
  const { config } = useAppLanguage();
  const { hapticFeedback } = useAnimations();

  const primaryName = useMemo(() => {
    switch (config.mode) {
      case 'tk': return category.nameTk;
      case 'zh': return category.nameZh;
      default: return category.nameRu;
    }
  }, [category, config.mode]);

  const handlePress = useCallback(() => {
    hapticFeedback('medium');
    onPress(category);
  }, [category, onPress, hapticFeedback]);

  return (
    <CategoryCard category={category} onPress={onPress} index={index}
    >
      <ImageBackground
        source={{ uri: category.imageUrl }}
        style={styles.imageBackground}
        imageStyle={styles.backgroundImage}
      >
        <View style={[styles.gradient, { backgroundColor: 'rgba(0,0,0,0.6)' }]}>
          <Text style={styles.categoryIcon}>{category.icon}</Text>
          <Text style={styles.categoryName} numberOfLines={2}>
            {primaryName}
          </Text>
        </View>
      </ImageBackground>
    </AnimatedCategoryCard>
  );
});

// Исправленный компонент "Недавние фразы"
const RecentCategoryCard = React.memo<{
  recentPhrases: Phrase[];
  stats: any;
  onPress: () => void;
  onStatsPress: () => void;
}>(({ recentPhrases, stats, onPress, onStatsPress }) => {
  const { getTexts, config } = useAppLanguage();
  const { hapticFeedback } = useAnimations();
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
    <AnimatedCategoryCard
      style={[styles.categoryCard, styles.recentCard]}
      onPress={handlePress}
      onLongPress={handleLongPress}
      index={0}
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
            {recentPhrases.length} {config.mode === 'tk' ? 'sözlem' : 'фраз'}
          </Text>
          {stats.todaysPhrases > 0 && (
            <Text style={styles.recentTodayText}>
              {config.mode === 'tk' ? 'Şu gün' : 'Сегодня'}: {stats.todaysPhrases}
            </Text>
          )}
        </View>

        {/* Стрик индикатор */}
        {stats.streakDays > 0 && (
          <View style={styles.recentStreakBadge}>
            <Ionicons name="flame" size={12} color={Colors.error} />
            <Text style={styles.recentStreakText}>{stats.streakDays}</Text>
          </View>
        )}
      </View>
    </AnimatedCategoryCard>
  );
});

// Быстрая статистика (модал)
const QuickStatsModal = React.memo<{
  visible: boolean;
  onClose: () => void;
  stats: any;
  recentPhrases: Phrase[];
  config: any;
}>(({ visible, onClose, stats, recentPhrases, config }) => {
  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {config.mode === 'tk' ? '📊 Çalt statistika' :
                config.mode === 'zh' ? '📊 快速统计' :
                  '📊 Быстрая статистика'}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={Colors.textLight} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
            {/* Сегодняшний прогресс */}
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>
                {config.mode === 'tk' ? 'Şu günki öşüş:' :
                  config.mode === 'zh' ? '今日进度：' :
                    'Прогресс сегодня:'}
              </Text>
              <Text style={styles.statValue}>
                {stats.todaysPhrases}/{stats.dailyGoal.phrasesPerDay}
                {config.mode === 'tk' ? ' sözlem' : config.mode === 'zh' ? ' 短语' : ' фраз'}
              </Text>
            </View>

            {/* Общая статистика */}
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>
                {config.mode === 'tk' ? 'Jemi öwrenilen:' :
                  config.mode === 'zh' ? '总共学过：' :
                    'Всего изучено:'}
              </Text>
              <Text style={styles.statValue}>{stats.uniquePhrases} {config.mode === 'tk' ? 'sözlem' : config.mode === 'zh' ? '短语' : 'фраз'}</Text>
            </View>

            <View style={styles.statRow}>
              <Text style={styles.statLabel}>
                {config.mode === 'tk' ? 'Jemi wagt:' :
                  config.mode === 'zh' ? '总时间：' :
                    'Общее время:'}
              </Text>
              <Text style={styles.statValue}>
                {stats.totalStudyTime < 60 ?
                  `${stats.totalStudyTime}${config.mode === 'tk' ? 'min' : config.mode === 'zh' ? '分' : 'мин'}` :
                  `${Math.floor(stats.totalStudyTime / 60)}${config.mode === 'tk' ? 's' : config.mode === 'zh' ? '时' : 'ч'} ${stats.totalStudyTime % 60}${config.mode === 'tk' ? 'min' : config.mode === 'zh' ? '分' : 'м'}`
                }
              </Text>
            </View>

            <View style={styles.statRow}>
              <Text style={styles.statLabel}>
                {config.mode === 'tk' ? 'Dowamly günler:' :
                  config.mode === 'zh' ? '连续天数：' :
                    'Стрик дней:'}
              </Text>
              <Text style={styles.statValue}>
                {stats.streakDays} {config.mode === 'tk' ? 'gün' : config.mode === 'zh' ? '天' : 'дней'}
              </Text>
            </View>

            {/* Недавние фразы */}
            {recentPhrases.length > 0 && (
              <>
                <Text style={styles.recentPhrasesTitle}>
                  {config.mode === 'tk' ? 'Soňky öwrenilen:' :
                    config.mode === 'zh' ? '最近学习：' :
                      'Недавно изученные:'}
                </Text>
                {recentPhrases.slice(0, 3).map(phrase => (
                  <View key={phrase.id} style={styles.recentPhraseItem}>
                    <Text style={styles.recentPhraseChinese}>{phrase.chinese}</Text>
                    <Text style={styles.recentPhraseTranslation}>
                      {config.mode === 'tk' ? phrase.turkmen : phrase.chinese}
                    </Text>
                  </View>
                ))}
              </>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
});

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [showQuickStats, setShowQuickStats] = useState(false);

  const { getRecentPhrases, stats, startStudySession } = useHistory();
  const { getTexts, config } = useAppLanguage();
  const { mountAnimation, hapticFeedback } = useAnimations();
  const { phrases, categories, isOfflineMode, dataSource } = useOfflineData();

  const recentPhrases = useMemo(() => getRecentPhrases(phrases, 10), [getRecentPhrases, phrases]);
  const texts = getTexts();

  // Автоматически начинаем сессию при открытии приложения
  useEffect(() => {
    startStudySession();
    mountAnimation();
  }, [startStudySession, mountAnimation]);

  const handleCategoryPress = useCallback((category: Category) => {
    hapticFeedback('medium');
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

  // Создаем данные для сетки: 14 категорий + недавние фразы в конце
  const gridData = useMemo(() => [
    ...categories.slice(0, 14),
    'recent',
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

      {/* Заголовок */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{texts.appTitle}</Text>
        <Text style={styles.headerSubtitle}>{texts.selectCategory}</Text>

        {/* Быстрая информация */}
        {stats.uniquePhrases > 0 && (
          <View style={styles.quickInfo}>
            <View style={styles.quickInfoItem}>
              <Ionicons name="book" size={16} color={Colors.primary} />
              <Text style={styles.quickInfoText}>
                {stats.uniquePhrases} {config.mode === 'tk' ? 'sözlem' : config.mode === 'zh' ? '短语' : 'фраз'}
              </Text>
            </View>
            {stats.streakDays > 0 && (
              <View style={styles.quickInfoItem}>
                <Ionicons name="flame" size={16} color={Colors.error} />
                <Text style={styles.quickInfoText}>{stats.streakDays} {config.mode === 'tk' ? 'gün' : config.mode === 'zh' ? '天' : 'дней'}</Text>
              </View>
            )}
            {stats.todaysPhrases > 0 && (
              <View style={styles.quickInfoItem}>
                <Ionicons name="today" size={16} color={Colors.accent} />
                <Text style={styles.quickInfoText}>
                  {stats.todaysPhrases}/{stats.dailyGoal.phrasesPerDay}
                </Text>
              </View>
            )}
          </View>
        )}
      </View>

      {/* Галерея категорий 3x5 */}
      <FlatList
        data={gridData}
        renderItem={renderGridItem}
        numColumns={3}
        keyExtractor={keyExtractor}
        style={styles.grid}
        contentContainerStyle={styles.gridContent}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={styles.row}
        removeClippedSubviews={true}
        maxToRenderPerBatch={9}
        initialNumToRender={9}
        windowSize={5}
      />

      {/* Модал быстрой статистики */}
      <QuickStatsModal
        visible={showQuickStats}
        onClose={closeStatsModal}
        stats={stats}
        recentPhrases={recentPhrases}
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
  header: {
    padding: 20,
    paddingTop: 10,
    paddingBottom: 15,
  },
  headerTitle: {
    ...TextStyles.h1,
    marginBottom: 5,
  },
  headerSubtitle: {
    ...TextStyles.bodyLarge,
    color: Colors.textLight,
    marginBottom: 10,
  },
  quickInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginTop: 8,
  },
  quickInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  quickInfoText: {
    ...TextStyles.caption,
    fontWeight: '500',
  },
  grid: {
    flex: 1,
    paddingHorizontal: 20,
  },
  gridContent: {
    paddingBottom: 20,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  categoryCard: {
    width: cardWidth,
    height: cardHeight,
    borderRadius: 16,
    overflow: 'hidden',
  },
  imageBackground: {
    flex: 1,
  },
  backgroundImage: {
    borderRadius: 16,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  categoryIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  categoryName: {
    ...TextStyles.caption,
    color: Colors.textWhite,
    textAlign: 'center',
    fontWeight: '600',
    textShadowColor: 'rgba(0,0,0,0.7)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },

  // Стили для карточки "Недавние"
  recentCard: {
    // Ensure exact same dimensions as regular categories
    width: cardWidth, // Explicitly set to match other cards
    height: cardHeight, // Explicitly set to match other cards
    backgroundColor: Colors.cardBackground,
    borderWidth: 2,
    borderColor: Colors.primary,
    borderStyle: 'solid',
  },

  recentCardContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
  },

  recentIconContainer: {
    marginBottom: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  recentTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 13,
  },

  recentStatsContainer: {
    alignItems: 'center',
  },

  recentStatsText: {
    fontSize: 9,
    color: Colors.textLight,
    textAlign: 'center',
    fontWeight: '500',
  },

  recentTodayText: {
    fontSize: 8,
    color: Colors.primary,
    textAlign: 'center',
    marginTop: 2,
    fontWeight: '600',
  },

  recentStreakBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.error + '20',
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },

  recentStreakText: {
    fontSize: 8,
    color: Colors.error,
    fontWeight: 'bold',
    marginLeft: 2,
  },

  errorText: {
    fontSize: 10,
    color: Colors.error,
    textAlign: 'center',
    padding: 8,
  },

  // Модальное окно
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 20,
    margin: 20,
    width: '90%',
    maxWidth: 400,
    maxHeight: '70%',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
  },
  modalTitle: {
    ...TextStyles.h5,
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    padding: 20,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.backgroundLight,
  },
  statLabel: {
    ...TextStyles.bodySmall,
    color: Colors.textLight,
    flex: 1,
  },
  statValue: {
    ...TextStyles.body,
    fontWeight: '600',
    color: Colors.text,
  },
  recentPhrasesTitle: {
    ...TextStyles.body,
    fontWeight: '600',
    color: Colors.text,
    marginTop: 20,
    marginBottom: 12,
  },
  recentPhraseItem: {
    backgroundColor: Colors.backgroundLight,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  recentPhraseChinese: {
    ...TextStyles.body,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  recentPhraseTranslation: {
    ...TextStyles.bodySmall,
    color: Colors.textLight,
  },
});