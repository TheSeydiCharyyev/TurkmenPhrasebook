// src/screens/StatsScreen.tsx
import React, { useMemo, useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { Colors } from '../constants/Colors';
import { usePhrases } from '../hooks/usePhrases';
import { categories } from '../data/categories';
import { useHistory } from '../hooks/useHistory';
import { useAppLanguage } from '../contexts/LanguageContext';
import { LoadingSpinner, EmptyState } from '../components/LoadingStates';
import { SimpleBarChart, SimpleLineChart } from '../components/SimpleCharts';
import ErrorBoundary from '../components/ErrorBoundary';
import { scale, verticalScale, moderateScale } from '../utils/ResponsiveUtils';

const { width: screenWidth } = Dimensions.get('window');
const chartWidth = screenWidth - scale(40);

// Мемоизированные компоненты для производительности
const StatCard = React.memo<{
  icon: string;
  iconColor: string;
  title: string;
  value: string;
  subtitle?: string;
  onPress?: () => void;
}>(({ icon, iconColor, title, value, subtitle, onPress }) => (
  <TouchableOpacity
    style={styles.statCard}
    onPress={onPress}
    disabled={!onPress}
    activeOpacity={onPress ? 0.7 : 1}
  >
    <View style={styles.statCardLeft}>
      <View style={[styles.statIcon, { backgroundColor: iconColor + '20' }]}>
        <Ionicons name={icon as any} size={24} color={iconColor} />
      </View>
      <View style={styles.statText}>
        <Text style={styles.statTitle}>{title}</Text>
        <Text style={styles.statValue}>{value}</Text>
        {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
      </View>
    </View>
    {onPress && (
      <Ionicons name="chevron-forward" size={20} color={Colors.textLight} />
    )}
  </TouchableOpacity>
));

const SectionTitle = React.memo<{ title: string; icon: string }>(({ title, icon }) => (
  <View style={styles.sectionHeader}>
    <Ionicons name={icon as any} size={24} color={Colors.primary} />
    <Text style={styles.sectionTitle}>{title}</Text>
  </View>
));

const ProgressBar = React.memo<{
  progress: number; // 0-1
  color: string;
  backgroundColor?: string;
  height?: number;
}>(({ progress, color, backgroundColor = Colors.backgroundLight, height = 8 }) => (
  <View style={[styles.progressBarBackground, { backgroundColor, height }]}>
    <View 
      style={[
        styles.progressBarFill, 
        { 
          backgroundColor: color, 
          width: `${Math.max(0, Math.min(100, progress * 100))}%`,
          height 
        }
      ]} 
    />
  </View>
));

interface CategoryProgressProps {
  category: any;
  totalPhrasesInCategory: number;
}

const CategoryProgressItem = React.memo<CategoryProgressProps>(({ category, totalPhrasesInCategory }) => {
  const { config } = useAppLanguage();
  
  const categoryName = useMemo(() => {
    switch (config.mode) {
      case 'tk': return category.category.nameTk;
      case 'zh': return category.category.nameZh;
      default: return category.category.nameRu;
    }
  }, [category.category, config.mode]);

  const progress = totalPhrasesInCategory > 0 ? category.phrasesStudied / totalPhrasesInCategory : 0;

  return (
    <View style={styles.categoryProgressItem}>
      <View style={styles.categoryProgressHeader}>
        <View style={styles.categoryProgressLeft}>
          <Text style={styles.categoryIcon}>{category.category.icon}</Text>
          <Text style={styles.categoryName}>{categoryName}</Text>
        </View>
        <Text style={styles.categoryProgressText}>
          {category.phrasesStudied}/{totalPhrasesInCategory}
        </Text>
      </View>
      <ProgressBar 
        progress={progress} 
        color={category.category.color || Colors.primary}
      />
      <Text style={styles.categoryStats}>
        {category.totalViews} {config.mode === 'tk' ? 'görkeziş' : config.mode === 'zh' ? '次查看' : 'просмотров'}
        {category.averageTime > 0 && (
          <Text style={styles.categoryTime}>
            {' • '}{category.averageTime}s {config.mode === 'tk' ? 'orta' : config.mode === 'zh' ? '平均' : 'в среднем'}
          </Text>
        )}
      </Text>
    </View>
  );
});

export default function StatsScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month'>('week');
  const {
    stats,
    loading,
    getCategoryStats,
    getLearningTrends,
    setDailyGoal,
    currentSession,
    clearHistory
  } = useHistory();
  const { config, getTexts } = useAppLanguage();
  const texts = getTexts();
  const { phrases } = usePhrases();

  // Мемоизированные вычисления
  const categoryStats = useMemo(() => {
    const stats = getCategoryStats(categories);
    return stats.map(stat => ({
      ...stat,
      totalPhrasesInCategory: phrases.filter(p => p.categoryId === stat.category.id).length
    }));
  }, [getCategoryStats]);

  const learningTrends = useMemo(() => getLearningTrends(), [getLearningTrends]);

  const chartData = useMemo(() => {
    return learningTrends.map((day, index) => ({
      day: index + 1,
      phrases: day.phrasesStudied,
      time: day.timeSpent,
      date: new Date(day.date).toLocaleDateString('ru-RU', { 
        weekday: 'short', 
        day: 'numeric' 
      }),
    }));
  }, [learningTrends]);

  const topCategories = useMemo(() => {
    return categoryStats
      .filter(cat => cat.phrasesStudied > 0)
      .sort((a, b) => b.totalViews - a.totalViews)
      .slice(0, 5);
  }, [categoryStats]);

  // Обработчики событий
// Обработчики событий
  const handleDailyGoalPress = useCallback(() => {
    const currentGoal = stats.dailyGoal.phrasesPerDay;
    const options = [5, 10, 15, 20, 25];
    
    Alert.alert(
      config.mode === 'tk' ? 'Gündelik maksat' : config.mode === 'zh' ? '每日目标' : 'Дневная цель',
      config.mode === 'tk' ? 'Günde näçe sözlem öwrenmek isleýärsiňiz?' : 
      config.mode === 'zh' ? '您每天想学习多少个短语？' : 
      'Сколько фраз вы хотите изучать в день?',
      [
        ...options.map(goal => ({
          text: `${goal} ${config.mode === 'tk' ? 'sözlem' : config.mode === 'zh' ? '短语' : 'фраз'}`,
          onPress: () => setDailyGoal(goal),
          style: goal === currentGoal ? 'default' as const : undefined,
        })),
        { 
          text: config.mode === 'tk' ? 'Ýatyr' : config.mode === 'zh' ? '取消' : 'Отмена',
          style: 'cancel' as const
        }
      ]
    );
  }, [stats.dailyGoal.phrasesPerDay, config.mode, setDailyGoal]);

  const handleSessionInfo = useCallback(() => {
    if (!currentSession) return;
    
    const sessionTime = Math.round((Date.now() - currentSession.startTime) / 1000 / 60);
    Alert.alert(
      config.mode === 'tk' ? 'Häzirki sessiýa' : config.mode === 'zh' ? '当前学习' : 'Текущая сессия',
      config.mode === 'tk' ? 
        `Başlanan: ${sessionTime} minut öň\nÖwrenilen: ${currentSession.phrasesCount} sözlem\nKategoriýa: ${currentSession.categoriesUsed.length}` :
      config.mode === 'zh' ?
        `开始时间：${sessionTime} 分钟前\n学习短语：${currentSession.phrasesCount} 个\n类别数：${currentSession.categoriesUsed.length}` :
        `Начато: ${sessionTime} минут назад\nИзучено: ${currentSession.phrasesCount} фраз\nКategorий: ${currentSession.categoriesUsed.length}`
    );
  }, [currentSession, config.mode]);

  const formatTime = useCallback((minutes: number) => {
    if (minutes < 60) {
      return `${minutes}${config.mode === 'tk' ? 'min' : config.mode === 'zh' ? '分' : 'мин'}`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}${config.mode === 'tk' ? 's' : config.mode === 'zh' ? '时' : 'ч'} ${mins}${config.mode === 'tk' ? 'min' : config.mode === 'zh' ? '分' : 'м'}`;
  }, [config.mode]);
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <LoadingSpinner message={
          config.mode === 'tk' ? 'Statistika ýüklenýär...' :
          config.mode === 'zh' ? '加载统计数据...' :
          'Загрузка статистики...'
        } />
      </SafeAreaView>
    );
  }

  if (stats.totalViews === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <EmptyState
          icon="📊"
          title={
            config.mode === 'tk' ? 'Heniz statistika ýok' :
            config.mode === 'zh' ? '暂无统计数据' :
            'Пока нет статистики'
          }
          message={
            config.mode === 'tk' ? 'Sözlem öwrenip başlaň,\nbu ýerde ösüş görkezijiler peýda bolar' :
            config.mode === 'zh' ? '开始学习短语，\n这里将显示您的进度' :
            'Начните изучать фразы,\nздесь появится ваш прогресс'
          }
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            {config.mode === 'tk' ? '📊 Ösüş statistikasy' :
             config.mode === 'zh' ? '📊 学习统计' :
             '📊 Статистика обучения'}
          </Text>
          <Text style={styles.headerSubtitle}>
            {config.mode === 'tk' ? 'Öwreniş ýoluňyzy yzarlaň' :
             config.mode === 'zh' ? '跟踪您的学习进度' :
             'Отслеживайте ваш прогресс'}
          </Text>
        </View>

        <ErrorBoundary>
          <View style={styles.content}>

            {/* Текущая сессия */}
            {currentSession && (
              <View style={styles.section}>
                <StatCard
                  icon="play-circle"
                  iconColor={Colors.accent}
                  title={config.mode === 'tk' ? 'Häzirki sessiýa' : config.mode === 'zh' ? '当前学习' : 'Активная сессия'}
                  value={`${currentSession.phrasesCount} ${config.mode === 'tk' ? 'sözlem' : config.mode === 'zh' ? '短语' : 'фраз'}`}
                  subtitle={`${Math.round((Date.now() - currentSession.startTime) / 1000 / 60)} ${config.mode === 'tk' ? 'minut' : config.mode === 'zh' ? '分钟' : 'минут'}`}
                  onPress={handleSessionInfo}
                />
              </View>
            )}

            {/* Основная статистика */}
            <View style={styles.section}>
              <SectionTitle 
                title={config.mode === 'tk' ? 'Umumy maglumatlar' : config.mode === 'zh' ? '总体概况' : 'Общая статистика'} 
                icon="analytics" 
              />
              
              <View style={styles.statsGrid}>
                <StatCard
                  icon="book"
                  iconColor={Colors.primary}
                  title={config.mode === 'tk' ? 'Öwrenilen sözlemler' : config.mode === 'zh' ? '学过的短语' : 'Изученные фразы'}
                  value={stats.uniquePhrases.toString()}
                  subtitle={`${phrases.length} ${config.mode === 'tk' ? 'sanydan' : config.mode === 'zh' ? '个中的' : 'из'} ${phrases.length}`}
                />

                <StatCard
                  icon="eye"
                  iconColor={Colors.accent}
                  title={config.mode === 'tk' ? 'Jemi görkezişler' : config.mode === 'zh' ? '总查看次数' : 'Всего просмотров'}
                  value={stats.totalViews.toString()}
                  subtitle={`${(stats.totalViews / Math.max(stats.uniquePhrases, 1)).toFixed(1)} ${config.mode === 'tk' ? 'orta' : config.mode === 'zh' ? '平均' : 'в среднем'}`}
                />

                <StatCard
                  icon="time"
                  iconColor={Colors.warning}
                  title={config.mode === 'tk' ? 'Öwreniş wagty' : config.mode === 'zh' ? '学习时间' : 'Время изучения'}
                  value={formatTime(stats.totalStudyTime)}
                  subtitle={`${stats.sessionsCount} ${config.mode === 'tk' ? 'sessiýa' : config.mode === 'zh' ? '次学习' : 'сессий'}`}
                />

                <StatCard
                  icon="flame"
                  iconColor={Colors.error}
                  title={config.mode === 'tk' ? 'Dowamly günler' : config.mode === 'zh' ? '连续天数' : 'Стрик дней'}
                  value={stats.streakDays.toString()}
                  subtitle={`${config.mode === 'tk' ? 'Iň gowy' : config.mode === 'zh' ? '最佳' : 'Лучший'}: ${stats.bestStreakDays}`}
                />
              </View>
            </View>

            {/* Дневная цель */}
            <View style={styles.section}>
              <SectionTitle 
                title={config.mode === 'tk' ? 'Gündelik maksat' : config.mode === 'zh' ? '每日目标' : 'Дневная цель'} 
                icon="target" 
              />
              
              <StatCard
                icon="checkmark-circle"
                iconColor={stats.dailyGoal.achieved ? Colors.success : Colors.textLight}
                title={`${stats.dailyGoal.phrasesPerDay} ${config.mode === 'tk' ? 'sözlem günde' : config.mode === 'zh' ? '短语/天' : 'фраз в день'}`}
                value={`${stats.todaysPhrases}/${stats.dailyGoal.phrasesPerDay}`}
                subtitle={
                  stats.dailyGoal.achieved 
                    ? (config.mode === 'tk' ? '✅ Şu gün üstünlikli!' : config.mode === 'zh' ? '✅ 今日已完成！' : '✅ Цель на сегодня достигнута!')
                    : (config.mode === 'tk' ? 'Henizem maksadyňyza ýetmediň' : config.mode === 'zh' ? '还需努力达成目标' : 'Еще немного до цели')
                }
                onPress={handleDailyGoalPress}
              />

              <ProgressBar 
                progress={Math.min(stats.todaysPhrases / stats.dailyGoal.phrasesPerDay, 1)}
                color={stats.dailyGoal.achieved ? Colors.success : Colors.primary}
                height={12}
              />
            </View>

            {/* График активности за неделю */}
            <View style={styles.section}>
              <SectionTitle 
                title={config.mode === 'tk' ? '7 günüň içindäki işjeňlik' : config.mode === 'zh' ? '近7天活动' : 'Активность за 7 дней'} 
                icon="bar-chart" 
              />
              
              <View style={styles.chartContainer}>
                <SimpleBarChart
                  data={chartData}
                  width={chartWidth}
                  height={200}
                />
              </View>
            </View>

            {/* Прогресс по категориям */}
            <View style={styles.section}>
              <SectionTitle 
                title={config.mode === 'tk' ? 'Kategoriýalar boýunça ösüş' : config.mode === 'zh' ? '各类别进度' : 'Прогресс по категориям'} 
                icon="grid" 
              />
              
              {topCategories.length > 0 ? (
                topCategories.map((category) => (
                  <CategoryProgressItem
                    key={category.category.id}
                    category={category}
                    totalPhrasesInCategory={phrases.filter(p => p.categoryId === category.category.id).length}
                  />
                ))
              ) : (
                <View style={styles.emptyCategories}>
                  <Text style={styles.emptyCategoriesText}>
                    {config.mode === 'tk' ? 'Heniz kategoriýa öwrenilmedi' :
                     config.mode === 'zh' ? '还没有学习任何类别' :
                     'Еще не изучено ни одной категории'}
                  </Text>
                </View>
              )}
            </View>

            {/* Недельная статистика */}
            {stats.weeklyStats.length > 0 && (
              <View style={styles.section}>
                <SectionTitle 
                  title={config.mode === 'tk' ? 'Hepdelik ösüş' : config.mode === 'zh' ? '每周进度' : 'Недельный прогресс'} 
                  icon="calendar" 
                />
                
                <View style={styles.chartContainer}>
                  <SimpleLineChart
                    data={stats.weeklyStats.map((week, index) => ({
                      week: `${config.mode === 'tk' ? 'H' : config.mode === 'zh' ? '周' : 'Н'}${index + 1}`,
                      phrases: week.phrasesStudied,
                      time: week.timeSpent,
                    }))}
                    width={chartWidth}
                    height={180}
                  />
                </View>
              </View>
            )}

            {/* Достижения */}
            <View style={styles.section}>
              <SectionTitle 
                title={config.mode === 'tk' ? 'Üstünlikler' : config.mode === 'zh' ? '成就' : 'Достижения'} 
                icon="trophy" 
              />
              
              <View style={styles.achievementsContainer}>
                {/* Стрик достижения */}
                <View style={[
                  styles.achievementCard,
                  stats.streakDays >= 7 && styles.achievementCardActive
                ]}>
                  <Ionicons 
                    name="flame" 
                    size={24} 
                    color={stats.streakDays >= 7 ? Colors.error : Colors.textLight} 
                  />
                  <Text style={styles.achievementTitle}>
                    {config.mode === 'tk' ? '7 gün yzygiderli' : config.mode === 'zh' ? '连续7天' : '7 дней подряд'}
                  </Text>
                  <Text style={styles.achievementStatus}>
                    {stats.streakDays >= 7 ? '✅' : `${stats.streakDays}/7`}
                  </Text>
                </View>

                {/* Цель по фразам */}
                <View style={[
                  styles.achievementCard,
                  stats.uniquePhrases >= 50 && styles.achievementCardActive
                ]}>
                  <Ionicons 
                    name="library" 
                    size={24} 
                    color={stats.uniquePhrases >= 50 ? Colors.primary : Colors.textLight} 
                  />
                  <Text style={styles.achievementTitle}>
                    {config.mode === 'tk' ? '50 sözlem' : config.mode === 'zh' ? '50个短语' : '50 фраз'}
                  </Text>
                  <Text style={styles.achievementStatus}>
                    {stats.uniquePhrases >= 50 ? '✅' : `${stats.uniquePhrases}/50`}
                  </Text>
                </View>

                {/* Все категории */}
                <View style={[
                  styles.achievementCard,
                  Object.keys(stats.categoriesProgress).length >= 10 && styles.achievementCardActive
                ]}>
                  <Ionicons 
                    name="apps" 
                    size={24} 
                    color={Object.keys(stats.categoriesProgress).length >= 10 ? Colors.accent : Colors.textLight} 
                  />
                  <Text style={styles.achievementTitle}>
                    {config.mode === 'tk' ? '10 kategoriýa' : config.mode === 'zh' ? '10个类别' : '10 категорий'}
                  </Text>
                  <Text style={styles.achievementStatus}>
                    {Object.keys(stats.categoriesProgress).length >= 10 ? '✅' : `${Object.keys(stats.categoriesProgress).length}/10`}
                  </Text>
                </View>
              </View>
            </View>

          </View>
        </ErrorBoundary>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
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
  content: {
    paddingHorizontal: scale(20),
    paddingBottom: verticalScale(20),
  },
  section: {
    marginBottom: verticalScale(30),
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(16),
  },
  sectionTitle: {
    fontSize: moderateScale(20),
    fontWeight: '600',
    color: Colors.text,
    marginLeft: scale(12),
  },
  statsGrid: {
    gap: verticalScale(12),
  },
  statCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: moderateScale(16),
    padding: scale(20),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 2,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statIcon: {
    width: scale(48),
    height: scale(48),
    borderRadius: scale(24),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: scale(16),
  },
  statText: {
    flex: 1,
  },
  statTitle: {
    fontSize: moderateScale(14),
    color: Colors.textLight,
    marginBottom: verticalScale(4),
  },
  statValue: {
    fontSize: moderateScale(24),
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: verticalScale(2),
  },
  statSubtitle: {
    fontSize: moderateScale(12),
    color: Colors.textLight,
  },
  progressBarBackground: {
    backgroundColor: Colors.backgroundLight,
    borderRadius: moderateScale(4),
    overflow: 'hidden',
    marginTop: verticalScale(12),
  },
  progressBarFill: {
    borderRadius: moderateScale(4),
  },
  chartContainer: {
    backgroundColor: Colors.cardBackground,
    borderRadius: moderateScale(16),
    padding: scale(20),
    alignItems: 'center',
    elevation: 2,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  categoryProgressItem: {
    backgroundColor: Colors.cardBackground,
    borderRadius: moderateScale(12),
    padding: scale(16),
    marginBottom: verticalScale(12),
    elevation: 1,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  categoryProgressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(8),
  },
  categoryProgressLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryIcon: {
    fontSize: moderateScale(20),
    marginRight: scale(12),
  },
  categoryName: {
    fontSize: moderateScale(16),
    fontWeight: '500',
    color: Colors.text,
    flex: 1,
  },
  categoryProgressText: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    color: Colors.primary,
  },
  categoryStats: {
    fontSize: moderateScale(12),
    color: Colors.textLight,
    marginTop: verticalScale(4),
  },
  categoryTime: {
    color: Colors.textLight,
  },
  emptyCategories: {
    padding: scale(40),
    alignItems: 'center',
  },
  emptyCategoriesText: {
    fontSize: moderateScale(16),
    color: Colors.textLight,
    textAlign: 'center',
  },
  achievementsContainer: {
    gap: verticalScale(12),
  },
  achievementCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: moderateScale(12),
    padding: scale(16),
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  achievementCardActive: {
    borderColor: Colors.success,
    backgroundColor: Colors.success + '10',
  },
  achievementTitle: {
    flex: 1,
    fontSize: moderateScale(14),
    fontWeight: '500',
    color: Colors.text,
    marginLeft: scale(12),
  },
  achievementStatus: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    color: Colors.primary,
  },
});