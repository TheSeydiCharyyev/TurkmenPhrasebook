// src/screens/HomeScreen.tsx - ИСПРАВЛЕННАЯ ВЕРСИЯ с правильным языком
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
import CategoryCard from '../components/CategoryCard';
import ErrorBoundary from '../components/ErrorBoundary';

const { width } = Dimensions.get('window');
const cardWidth = (width - 60) / 3;
const cardHeight = 120;

type HomeScreenNavigationProp = StackNavigationProp<HomeStackParamList, 'CategoryScreen'>;

// ✅ ИСПРАВЛЕНО: Компонент "Недавние фразы"
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
          {texts.recentlyStudied || 'Недавние'}
        </Text>

        {/* Статистика */}
        <View style={styles.recentStatsContainer}>
          <Text style={styles.recentStatsText}>
            {recentPhrases.length} {config.mode === 'tk' ? 'sözlem' : 'фраз'}
          </Text>
          {stats.todaysPhrases > 0 && (
            <Text style={styles.recentTodayText}>
              {config.mode === 'tk' ? 
                `Şu gün: ${stats.todaysPhrases}` :
                `Сегодня: ${stats.todaysPhrases}`}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
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
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {config.mode === 'tk' ? '📊 Statistika' : '📊 Статистика'}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.modalCloseButton}>
              <Ionicons name="close" size={24} color={Colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody}>
            {recentPhrases.length > 0 && (
              <>
                <Text style={styles.recentSectionTitle}>
                  {config.mode === 'tk' ? 
                    'Soňky öwrenilen:' :
                    config.mode === 'zh' ? '最近学习：' :
                      'Недавно изученные:'}
                </Text>
                {recentPhrases.slice(0, 3).map(phrase => (
                  <View key={phrase.id} style={styles.recentPhraseItem}>
                    <Text style={styles.recentPhraseChinese}>{phrase.chinese}</Text>
                    <Text style={styles.recentPhraseTranslation}>
                      {config.mode === 'tk' ? phrase.turkmen : phrase.russian}
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

  // ✅ ИСПРАВЛЕНО: Показываем ВСЕ категории + недавние
  const gridData = useMemo(() => [
    ...categories, // Показываем ВСЕ категории (все 13)
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

      {/* ✅ ИСПРАВЛЕНО: Правильный заголовок */}
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
                {stats.uniquePhrases} {config.mode === 'tk' ? 'sözlem' : config.mode === 'zh' ? '短语' : 'фраз'}
              </Text>
            </View>
            {stats.streakDays > 0 && (
              <View style={styles.quickInfoItem}>
                <Ionicons name="flame" size={16} color={Colors.error} />
                <Text style={styles.quickInfoText}>
                  {stats.streakDays} {config.mode === 'tk' ? 'gün' : config.mode === 'zh' ? '天' : 'дней'}
                </Text>
              </View>
            )}
          </View>
        )}
      </View>

      {/* Сетка категорий */}
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
    marginTop: 2,
  },
  errorText: {
    fontSize: 12,
    color: Colors.error,
    textAlign: 'center',
  },
  // Стили модального окна
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
  },
  modalCloseButton: {
    padding: 4,
  },
  modalBody: {
    padding: 20,
  },
  recentSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  recentPhraseItem: {
    backgroundColor: Colors.backgroundLight,
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  recentPhraseChinese: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 4,
  },
  recentPhraseTranslation: {
    fontSize: 14,
    color: Colors.textLight,
  },
});