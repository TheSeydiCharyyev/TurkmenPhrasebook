// src/screens/HomeScreen.tsx - МИНИМАЛИСТИЧНАЯ ШАПКА

import React, { useCallback, useRef, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Animated,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

import { Category, HomeStackParamList } from '../types';
import { Colors } from '../constants/Colors';
import { useAppLanguage } from '../contexts/LanguageContext';
import { categories } from '../data/categories';
import CategoryCard from '../components/CategoryCard';
import ErrorBoundary from '../components/ErrorBoundary';
import { TabScreen } from '../components/Screen';

type HomeScreenNavigationProp = StackNavigationProp<HomeStackParamList, 'CategoryScreen'>;

// Высота новой минималистичной шапки
const HEADER_HEIGHT = 120;

// Минималистичная шапка БЕЗ красного фона
const MinimalHeader = React.memo<{ languageMode: 'ru' | 'tk' | 'zh'; onSearchPress: () => void }>(
  ({ languageMode, onSearchPress }) => {
    // Текст "Выберите категорию" на трех языках
    const getHeaderText = () => {
      if (languageMode === 'zh') {
        return '选择类别'; // Китайский
      } else if (languageMode === 'tk') {
        return 'Kategoriýany saýlaň'; // Туркменский
      } else {
        return 'Выберите категорию'; // Русский
      }
    };

    return (
      <View style={styles.headerContainer}>
        {/* Заголовок на трех языках */}
        <View style={styles.titleContainer}>
          <Text style={styles.titleTurkmen}>Kategoriýany saýlaň</Text>
          <Text style={styles.titleChinese}>选择类别</Text>
          <Text style={styles.titleRussian}>Выберите категорию</Text>
        </View>

        {/* Поле поиска */}
        <TouchableOpacity 
          style={styles.searchBar} 
          onPress={onSearchPress}
          activeOpacity={0.7}
        >
          <Ionicons name="search" size={20} color={Colors.textLight} />
          <Text style={styles.searchPlaceholder}>
            {languageMode === 'zh' ? '搜索短语...' :
             languageMode === 'tk' ? 'Sözlemleri gözle...' :
             'Поиск фраз...'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
);

// Компонент пары категорий
const CategoryPairItem = React.memo<{
  item: [Category, Category | undefined];
  onPress: (category: Category) => void;
  languageMode: 'ru' | 'tk' | 'zh';
}>(({ item, onPress, languageMode }) => (
  <View style={styles.row}>
    <View style={[styles.cardWrapper, styles.leftCard]}>
      <CategoryCard
        category={item[0]}
        onPress={onPress}
        languageMode={languageMode}
      />
    </View>
    {item[1] && (
      <View style={[styles.cardWrapper, styles.rightCard]}>
        <CategoryCard
          category={item[1]}
          onPress={onPress}
          languageMode={languageMode}
        />
      </View>
    )}
  </View>
));

// Сетка категорий
interface CategoryGridProps {
  languageMode: 'ru' | 'tk' | 'zh';
}

const CategoryGrid = React.memo<CategoryGridProps>(({ languageMode }) => {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  const handleCategoryPress = useCallback((category: Category) => {
    navigation.navigate('CategoryScreen', { category });
  }, [navigation]);

  const renderCategoryPair = useCallback(
    ({ item }: { item: [Category, Category | undefined] }) => (
      <CategoryPairItem
        item={item}
        onPress={handleCategoryPress}
        languageMode={languageMode}
      />
    ),
    [handleCategoryPress, languageMode]
  );

  const categoryPairs = useMemo(() => {
    const pairs: [Category, Category | undefined][] = [];
    for (let i = 0; i < categories.length; i += 2) {
      pairs.push([categories[i], categories[i + 1]]);
    }
    return pairs;
  }, []);

  return (
    <FlatList
      data={categoryPairs}
      renderItem={renderCategoryPair}
      keyExtractor={(item, index) => `pair-${index}`}
      contentContainerStyle={styles.gridContainer}
      showsVerticalScrollIndicator={false}
      removeClippedSubviews={true}
      maxToRenderPerBatch={6}
      windowSize={10}
      initialNumToRender={4}
    />
  );
});

export default function HomeScreen() {
  const { config } = useAppLanguage();
  const navigation = useNavigation<any>();

  const handleSearchPress = useCallback(() => {
    // Переход на экран поиска
    navigation.navigate('AdditionalFeatures', {
      screen: 'Search'
    });
  }, [navigation]);

  return (
    <ErrorBoundary>
      <TabScreen backgroundColor={Colors.background}>
        {/* НОВАЯ МИНИМАЛИСТИЧНАЯ ШАПКА */}
        <MinimalHeader
          languageMode={config.mode}
          onSearchPress={handleSearchPress}
        />

        {/* КАТЕГОРИИ - БЕЗ ИЗМЕНЕНИЙ */}
        <View style={styles.contentContainer}>
          <CategoryGrid languageMode={config.mode} />
        </View>
      </TabScreen>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  // НОВАЯ минималистичная шапка
  headerContainer: {
    backgroundColor: Colors.background,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border || '#E5E7EB',
  },

  // Контейнер для заголовков
  titleContainer: {
    alignItems: 'center',
    marginBottom: 12,
  },

  // Туркменский заголовок
  titleTurkmen: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },

  // Китайский заголовок
  titleChinese: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.textSecondary || '#6B7280',
    marginBottom: 4,
  },

  // Русский заголовок
  titleRussian: {
    fontSize: 14,
    fontWeight: '400',
    color: Colors.textLight,
  },

  // Поле поиска
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundLight || '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: Colors.border || '#E5E7EB',
  },

  searchPlaceholder: {
    marginLeft: 10,
    fontSize: 15,
    color: Colors.textLight,
  },

  // Контейнер категорий
  contentContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  gridContainer: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    paddingBottom: 40,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },

  cardWrapper: {
    width: '48%',
  },

  leftCard: {
    marginRight: 8,
  },

  rightCard: {
    marginLeft: 8,
  },
});