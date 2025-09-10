// src/screens/HomeScreen.tsx - ИСПРАВЛЕННЫЙ с правильными заголовками и UI

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

import { Category, HomeStackParamList, Phrase } from '../types';
import { Colors } from '../constants/Colors';
import { TextStyles } from '../constants/Typography';
import { useHistory } from '../hooks/useHistory';
import { useAppLanguage } from '../contexts/LanguageContext';
import { useAnimations } from '../hooks/useAnimations';
import { useOfflineData } from '../contexts/OfflineDataContext';
import { phrases } from '../data/phrases';
import { categories, getCategoryName } from '../data/categories';
import CategoryCard from '../components/CategoryCard';
import ErrorBoundary from '../components/ErrorBoundary';

const { width } = Dimensions.get('window');
const cardWidth = (width - 60) / 2;
const cardHeight = 140; // Увеличили высоту для лучшего отображения

type HomeScreenNavigationProp = StackNavigationProp<HomeStackParamList, 'CategoryScreen'>;

// ✅ ИСПРАВЛЕНО: Профессиональный заголовок с правильной иерархией языков
const AppHeader = React.memo(() => {
  const { getTexts, config } = useAppLanguage();
  const texts = getTexts();

  return (
    <View style={styles.headerContainer}>
      {/* Главный заголовок */}
      <Text style={styles.appTitle}>
        {texts.appTitle}
      </Text>
      
      {/* Подзаголовок с дополнительными языками */}
      <Text style={styles.appSubtitle}>
        {texts.appSubtitle}
      </Text>
      
      {/* Селектор категории */}
      <Text style={styles.selectCategoryText}>
        {texts.selectCategory}
      </Text>
    </View>
  );
});

// ✅ ИСПРАВЛЕНО: Профессиональная карточка категории с правильным отображением языков
const EnhancedCategoryCard = React.memo<{
  category: Category;
  onPress: () => void;
}>(({ category, onPress }) => {
  const { config } = useAppLanguage();
  const { pressAnimation, hapticFeedback } = useAnimations();
  const categoryNames = getCategoryName(category, config.mode);

  const handlePress = useCallback(() => {
    hapticFeedback('medium');
    pressAnimation();
    onPress();
  }, [onPress, hapticFeedback, pressAnimation]);

  return (
    <TouchableOpacity
      style={[styles.categoryCard, { backgroundColor: category.color + '15' }]}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      {/* Иконка */}
      <View style={[styles.categoryIconContainer, { backgroundColor: category.color + '25' }]}>
        <Text style={styles.categoryIcon}>{category.icon}</Text>
      </View>

      {/* Названия в правильном порядке */}
      <View style={styles.categoryTextContainer}>
        {/* Главное название (родной язык) */}
        <Text style={[styles.categoryNamePrimary, { color: category.color }]} numberOfLines={2}>
          {categoryNames.primary}
        </Text>
        
        {/* Изучаемый язык */}
        <Text style={styles.categoryNameLearning} numberOfLines={1}>
          {categoryNames.learning}
        </Text>
        
        {/* Язык-помощник */}
        <Text style={styles.categoryNameHelper} numberOfLines={1}>
          {categoryNames.helper}
        </Text>
      </View>

      {/* Профессиональная стрелка */}
      <View style={[styles.arrowContainer, { backgroundColor: category.color }]}>
        <Ionicons 
          name="chevron-forward" 
          size={16} 
          color="white" 
        />
      </View>
    </TouchableOpacity>
  );
});

// ✅ ДОБАВЛЕНО: Статистика недавних фраз
const RecentPhrasesCard = React.memo(() => {
  const { getTexts, config } = useAppLanguage();
  const { getRecentPhrases } = useHistory();
  const texts = getTexts();
  
  const recentPhrases = getRecentPhrases(phrases, 5);

  if (recentPhrases.length === 0) return null;

  return (
    <View style={styles.recentCard}>
      <View style={styles.recentHeader}>
        <Ionicons name="time" size={24} color={Colors.primary} />
        <Text style={styles.recentTitle}>{texts.recentlyStudied}</Text>
      </View>
      
      <Text style={styles.recentCount}>
        {recentPhrases.length} {config.mode === 'tk' ? 'sözlem' : '个短语'}
      </Text>
    </View>
  );
});

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { getTexts } = useAppLanguage();
  const texts = getTexts();

  const handleCategoryPress = useCallback((category: Category) => {
    navigation.navigate('CategoryScreen', { category });
  }, [navigation]);

  const renderCategoryItem = useCallback(({ item }: { item: Category }) => (
    <EnhancedCategoryCard
      category={item}
      onPress={() => handleCategoryPress(item)}
    />
  ), [handleCategoryPress]);

  return (
    <ErrorBoundary>
      <SafeAreaView style={styles.container}>
        <StatusBar 
          barStyle="dark-content" 
          backgroundColor={Colors.background}
        />
        
        <FlatList
          data={categories}
          renderItem={renderCategoryItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <>
              <AppHeader />
              <RecentPhrasesCard />
            </>
          }
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          columnWrapperStyle={styles.row}
        />
      </SafeAreaView>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  
  contentContainer: {
    padding: 20,
    paddingBottom: 100,
  },

  // ✅ ИСПРАВЛЕНО: Профессиональный стиль заголовка
  headerContainer: {
    marginBottom: 30,
    alignItems: 'center',
  },

  appTitle: {
    ...TextStyles.title,
    fontSize: 24,
    fontWeight: '800',
    color: Colors.primary,
    textAlign: 'center',
    letterSpacing: 0.5,
    marginBottom: 8,
  },

  appSubtitle: {
    ...TextStyles.subtitle,
    fontSize: 14,
    color: Colors.textLight,
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '500',
  },

  selectCategoryText: {
    ...TextStyles.body,
    fontSize: 16,
    color: Colors.text,
    fontWeight: '600',
    textAlign: 'center',
  },

  // ✅ ИСПРАВЛЕНО: Профессиональный стиль карточек категорий
  row: {
    justifyContent: 'space-between',
  },

  separator: {
    height: 16,
  },

  categoryCard: {
    width: cardWidth,
    height: cardHeight,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: Colors.border,
    position: 'relative',
  },

  categoryIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },

  categoryIcon: {
    fontSize: 24,
  },

  categoryTextContainer: {
    flex: 1,
    justifyContent: 'space-between',
    marginBottom: 8,
  },

  categoryNamePrimary: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 20,
    marginBottom: 4,
  },

  categoryNameLearning: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.textSecondary,
    lineHeight: 16,
    marginBottom: 2,
  },

  categoryNameHelper: {
    fontSize: 11,
    fontWeight: '400',
    color: Colors.textLight,
    lineHeight: 14,
  },

  // ✅ ИСПРАВЛЕНО: Профессиональная стрелка выровненная по центру
  arrowContainer: {
    position: 'absolute',
    right: 12,
    top: '50%',
    marginTop: -16,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },

  // Стили для карточки недавних фраз
  recentCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: Colors.border,
  },

  recentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },

  recentTitle: {
    ...TextStyles.subtitle,
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginLeft: 12,
  },

  recentCount: {
    ...TextStyles.caption,
    fontSize: 14,
    color: Colors.textLight,
    fontWeight: '500',
  },
});