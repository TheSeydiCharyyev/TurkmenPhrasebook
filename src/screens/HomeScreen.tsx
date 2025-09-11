// src/screens/HomeScreen.tsx - ИСПРАВЛЕННЫЙ с убранным "Soňky öwrenilen"

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
import { useAppLanguage } from '../contexts/LanguageContext';
import { useAnimations } from '../hooks/useAnimations';
import { useHistory } from '../hooks/useHistory';
import { useOfflineData } from '../hooks/useOfflineDataManager';
import { phrases } from '../data/phrases';
import { categories, getCategoryName } from '../data/categories';
import CategoryCard from '../components/CategoryCard';
import ErrorBoundary from '../components/ErrorBoundary';

const { width } = Dimensions.get('window');
const cardWidth = (width - 60) / 2;
const cardHeight = 140;

type HomeScreenNavigationProp = StackNavigationProp<HomeStackParamList, 'CategoryScreen'>;

// ✅ ИСПРАВЛЕНО: Заголовок без "Soňky öwrenilen"
const AppHeader = React.memo(() => {
  const { getTexts, config } = useAppLanguage();
  const texts = getTexts();

  return (
    <View style={styles.headerContainer}>
      {/* Главный заголовок */}
      <Text style={styles.appTitle}>
        {texts.appTitle}
      </Text>
      
      {/* Подзаголовок с переводом на другой язык */}
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

// ✅ ИСПРАВЛЕНО: Карточка категории с правильным отображением языков
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
        {/* Основной язык (крупно) */}
        <Text style={styles.categoryMainText} numberOfLines={1}>
          {categoryNames.primary}
        </Text>
        
        {/* Изучаемый язык (средне) */}
        <Text style={styles.categorySecondaryText} numberOfLines={1}>
          {categoryNames.learning}
        </Text>
        
        {/* Вспомогательный язык (мелко) */}
        <Text style={styles.categoryHelperText} numberOfLines={1}>
          {categoryNames.helper}
        </Text>
      </View>

      {/* Кнопка перехода */}
      <View style={styles.categoryArrow}>
        <Ionicons name="chevron-forward" size={16} color={category.color} />
      </View>
    </TouchableOpacity>
  );
});

// ✅ Главный компонент HomeScreen
export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { getHistory } = useHistory();
  const { isOffline } = useOfflineData();
  
  // ✅ УБРАНО: Вся логика с недавними фразами
  
  const handleCategoryPress = useCallback((category: Category) => {
    navigation.navigate('CategoryScreen', { category });
  }, [navigation]);

  const renderCategoryItem = useCallback(({ item }: { item: Category }) => (
    <EnhancedCategoryCard
      category={item}
      onPress={() => handleCategoryPress(item)}
    />
  ), [handleCategoryPress]);

  const renderCategoryRow = useCallback(({ item }: { item: Category[] }) => (
    <View style={styles.row}>
      {item.map((category) => (
        <EnhancedCategoryCard
          key={category.id}
          category={category}
          onPress={() => handleCategoryPress(category)}
        />
      ))}
    </View>
  ), [handleCategoryPress]);

  // Группируем категории по 2 в ряд
  const categoriesInRows = useMemo(() => {
    const rows: Category[][] = [];
    for (let i = 0; i < categories.length; i += 2) {
      rows.push(categories.slice(i, i + 2));
    }
    return rows;
  }, []);

  return (
    <ErrorBoundary>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
        
        <FlatList
          data={categoriesInRows}
          renderItem={renderCategoryRow}
          keyExtractor={(item, index) => `row-${index}`}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={<AppHeader />}
          contentContainerStyle={styles.scrollContent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
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

  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 100,
  },

  // ✅ ИСПРАВЛЕНО: Стили заголовка
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

  // ✅ Стили для карточек категорий
  row: {
    flexDirection: 'row',
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

  categoryMainText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },

  categorySecondaryText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textMedium,
    marginBottom: 2,
  },

  categoryHelperText: {
    fontSize: 11,
    fontWeight: '500',
    color: Colors.textLight,
  },

  categoryArrow: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});