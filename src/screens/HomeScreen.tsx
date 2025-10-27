// src/screens/HomeScreen.tsx - ОБНОВЛЕНО для мультиязычности (Phase 3)

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
import { useConfig } from '../contexts/ConfigContext';
import { getLanguageByCode } from '../config/languages.config';
import { categories } from '../data/categories';
import CategoryCard from '../components/CategoryCard';
import ErrorBoundary from '../components/ErrorBoundary';
import { TabScreen } from '../components/Screen';

type HomeScreenNavigationProp = StackNavigationProp<HomeStackParamList, 'CategoryScreen'>;

// Высота новой минималистичной шапки
const HEADER_HEIGHT = 120;

// Минималистичная шапка с индикатором языка
const MinimalHeader = React.memo<{
  languageMode: 'ru' | 'tk' | 'zh' | 'en';  // ✅ ДОБАВЛЕНО: поддержка английского
  onSearchPress: () => void;
  onLanguagePress: () => void;
  selectedLanguageCode: string;
}>(
  ({ languageMode, onSearchPress, onLanguagePress, selectedLanguageCode }) => {
    const selectedLang = getLanguageByCode(selectedLanguageCode);
    const turkmenFlag = '🇹🇲';

    return (
      <View style={styles.headerContainer}>
        {/* Индикатор языка */}
        <View style={styles.languageHeader}>
          <View style={styles.languageIndicator}>
            <Text style={styles.flagLarge}>{selectedLang?.flag || '🌍'}</Text>
            <Text style={styles.languageCode}>{selectedLang?.name || 'Language'}</Text>
          </View>

          <Ionicons name="swap-horizontal" size={24} color="#6B7280" />

          <View style={styles.languageIndicator}>
            <Text style={styles.flagLarge}>{turkmenFlag}</Text>
            <Text style={styles.languageCode}>Türkmen</Text>
          </View>

          <TouchableOpacity
            style={styles.changeLanguageButton}
            onPress={onLanguagePress}
          >
            <Ionicons name="settings-outline" size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {/* ✅ ОБНОВЛЕНО: Заголовок динамически меняется в зависимости от языка */}
        <View style={styles.titleContainer}>
          <Text style={styles.titleTurkmen}>Kategoriýany saýlaň</Text>
          {languageMode === 'en' ? (
            // Английский выбран: показываем английский вместо китайского
            <Text style={styles.titleChinese}>Select a category</Text>
          ) : (
            // Китайский или русский: показываем китайский
            <Text style={styles.titleChinese}>选择类别</Text>
          )}
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
             languageMode === 'en' ? 'Search phrases...' :  // ✅ ДОБАВЛЕНО: английский
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
  languageMode: 'ru' | 'tk' | 'zh' | 'en';  // ✅ ДОБАВЛЕНО: поддержка английского
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
  languageMode: 'ru' | 'tk' | 'zh' | 'en';  // ✅ ДОБАВЛЕНО: поддержка английского
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
  const { selectedLanguage } = useConfig();
  const navigation = useNavigation<any>();

  // ✅ ДОБАВЛЕНО: Маппинг selectedLanguage для languageMode
  const languageMode: 'ru' | 'tk' | 'zh' | 'en' =
    selectedLanguage === 'zh' ? 'zh' :
    selectedLanguage === 'ru' ? 'ru' :
    selectedLanguage === 'en' ? 'en' :
    'tk';  // по умолчанию туркменский

  const handleSearchPress = useCallback(() => {
    // Переход на экран поиска
    navigation.navigate('AdditionalFeatures', {
      screen: 'Search'
    });
  }, [navigation]);

  const handleLanguagePress = useCallback(() => {
    // Переход к экрану выбора языковой пары разговорника
    navigation.navigate('LanguagePairSelection');
  }, [navigation]);

  return (
    <ErrorBoundary>
      <TabScreen backgroundColor={Colors.background}>
        {/* НОВАЯ МИНИМАЛИСТИЧНАЯ ШАПКА С ИНДИКАТОРОМ ЯЗЫКА */}
        <MinimalHeader
          languageMode={languageMode}  // ✅ ОБНОВЛЕНО: используем languageMode
          onSearchPress={handleSearchPress}
          onLanguagePress={handleLanguagePress}
          selectedLanguageCode={selectedLanguage}
        />

        {/* КАТЕГОРИИ - БЕЗ ИЗМЕНЕНИЙ */}
        <View style={styles.contentContainer}>
          <CategoryGrid languageMode={languageMode} />  {/* ✅ ОБНОВЛЕНО: используем languageMode */}
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

  // Индикатор языка
  languageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  languageIndicator: {
    alignItems: 'center',
    marginHorizontal: 12,
  },
  flagLarge: {
    fontSize: 28,
  },
  languageCode: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 4,
    fontWeight: '500',
  },
  changeLanguageButton: {
    position: 'absolute',
    right: 12,
    padding: 8,
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