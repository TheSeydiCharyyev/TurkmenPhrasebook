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
import { scale, verticalScale, moderateScale } from '../utils/ResponsiveUtils';

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

// Высота новой минималистичной шапки (для анимации скрытия)
const HEADER_HEIGHT = 180;

// Минималистичная шапка с индикатором языка
const MinimalHeader = React.memo<{
  languageMode: string;  // ✅ ОБНОВЛЕНО: поддержка всех 30 языков
  onSearchPress: () => void;
  onLanguagePress: () => void;
  selectedLanguageCode: string;
  animatedStyle?: any;  // ✅ НОВОЕ: стиль для анимации
}>(
  ({ languageMode, onSearchPress, onLanguagePress, selectedLanguageCode, animatedStyle }) => {
    const selectedLang = getLanguageByCode(selectedLanguageCode);
    const turkmenFlag = '🇹🇲';
    const englishFlag = '🇬🇧';

    // Когда выбран туркменский, показываем пару Туркменский ↔ Английский
    const isTurkmenMode = selectedLanguageCode === 'tk';
    const rightLang = isTurkmenMode ? getLanguageByCode('en') : null;

    return (
      <Animated.View style={[styles.headerContainer, animatedStyle]}>
        {/* Индикатор языка */}
        <View style={styles.languageHeader}>
          <View style={styles.languageIndicator}>
            <Text style={styles.flagLarge}>{selectedLang?.flag || '🌍'}</Text>
            <Text style={styles.languageCode}>{selectedLang?.name || 'Language'}</Text>
          </View>

          <Ionicons name="swap-horizontal" size={24} color="#6B7280" />

          <View style={styles.languageIndicator}>
            <Text style={styles.flagLarge}>{isTurkmenMode ? englishFlag : turkmenFlag}</Text>
            <Text style={styles.languageCode}>{isTurkmenMode ? (rightLang?.name || 'English') : 'Türkmen'}</Text>
          </View>

          <TouchableOpacity
            style={styles.changeLanguageButton}
            onPress={onLanguagePress}
          >
            <Ionicons name="settings-outline" size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {/* ✅ ИСПРАВЛЕНО: Универсальный заголовок для ВСЕХ 30 языков */}
        <View style={styles.titleContainer}>
          {languageMode === 'tk' ? (
            <>
              <Text style={styles.titlePrimary}>Kategoriýany saýlaň</Text>
              <Text style={styles.titleSecondary}>Select a category</Text>
            </>
          ) : (
            <>
              <Text style={styles.titlePrimary}>{getTitleByLanguage(languageMode)}</Text>
              <Text style={styles.titleSecondary}>Kategoriýany saýlaň</Text>
            </>
          )}
        </View>

        {/* Поле поиска */}
        <TouchableOpacity
          style={styles.searchBar}
          onPress={onSearchPress}
          activeOpacity={0.7}
        >
          <Ionicons name="search" size={20} color={Colors.textLight} />
          <Text style={styles.searchPlaceholder}>
            {(() => {
              const searchTexts: { [key: string]: string } = {
                'tk': 'Sözlemleri gözle...',
                'zh': '搜索短语...',
                'ru': 'Поиск фраз...',
                'en': 'Search phrases...',
                'tr': 'Cümleleri ara...',  // Турецкий
                'ar': 'البحث عن العبارات...',  // Арабский
                'de': 'Phrasen suchen...',  // Немецкий
                'fr': 'Rechercher des phrases...',  // Французский
                'es': 'Buscar frases...',  // Испанский
              };
              return searchTexts[languageMode] || searchTexts['en'];
            })()}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    );
  }
);

// Компонент пары категорий
const CategoryPairItem = React.memo<{
  item: [Category, Category | undefined];
  onPress: (category: Category) => void;
  languageMode: string;  // ✅ ОБНОВЛЕНО: поддержка всех 30 языков
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
  languageMode: string;  // ✅ ОБНОВЛЕНО: поддержка всех 30 языков
  onScroll?: (event: any) => void;  // ✅ НОВОЕ: колбэк для скролла
}

const CategoryGrid = React.memo<CategoryGridProps>(({ languageMode, onScroll }) => {
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
    <Animated.FlatList
      data={categoryPairs}
      renderItem={renderCategoryPair}
      keyExtractor={(item, index) => `pair-${index}`}
      contentContainerStyle={styles.gridContainer}
      showsVerticalScrollIndicator={false}
      removeClippedSubviews={true}
      maxToRenderPerBatch={6}
      windowSize={10}
      initialNumToRender={4}
      onScroll={onScroll}
      scrollEventThrottle={16}
    />
  );
});

// Helper функция для получения текста на выбранном языке или fallback на английский
const getTitleByLanguage = (langCode: string): string => {
  const titles: { [key: string]: string } = {
    'tk': 'Kategoriýany saýlaň',
    'zh': '选择类别',
    'ru': 'Выберите категорию',
    'en': 'Select a category',
    // Добавляем другие языки
    'tr': 'Bir kategori seçin',  // Турецкий
    'ar': 'اختر فئة',  // Арабский
    'de': 'Wähle eine Kategorie',  // Немецкий
    'fr': 'Choisir une catégorie',  // Французский
    'es': 'Selecciona una categoría',  // Испанский
  };

  // Возвращаем перевод если есть, иначе английский fallback
  return titles[langCode] || titles['en'];
};

export default function HomeScreen() {
  const { config } = useAppLanguage();
  const { selectedLanguage } = useConfig();
  const navigation = useNavigation<any>();

  // ✅ ОБНОВЛЕНО: Используем selectedLanguage напрямую (поддержка всех 30 языков)
  const languageMode: string = selectedLanguage;

  // ✅ НОВОЕ: Анимация скрытия/показа header при скролле
  const scrollY = useRef(new Animated.Value(0)).current;
  const lastScrollY = useRef(0);
  const scrollDirection = useRef<'up' | 'down'>('down');

  // Анимированный стиль для header
  const headerTranslateY = useRef(new Animated.Value(0)).current;

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    {
      useNativeDriver: true,
      listener: (event: any) => {
        const currentScrollY = event.nativeEvent.contentOffset.y;
        const diff = currentScrollY - lastScrollY.current;

        // Определяем направление скролла
        if (diff > 0 && currentScrollY > 10) {
          // Скролл вниз - скрываем header
          if (scrollDirection.current !== 'down') {
            scrollDirection.current = 'down';
            Animated.timing(headerTranslateY, {
              toValue: -HEADER_HEIGHT - 20,
              duration: 250,
              useNativeDriver: true,
            }).start();
          }
        } else if (diff < 0) {
          // Скролл вверх - показываем header
          if (scrollDirection.current !== 'up') {
            scrollDirection.current = 'up';
            Animated.timing(headerTranslateY, {
              toValue: 0,
              duration: 250,
              useNativeDriver: true,
            }).start();
          }
        }

        lastScrollY.current = currentScrollY;
      },
    }
  );

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
        {/* НОВАЯ МИНИМАЛИСТИЧНАЯ ШАПКА С ИНДИКАТОРОМ ЯЗЫКА - АНИМИРОВАННАЯ */}
        <MinimalHeader
          languageMode={languageMode}
          onSearchPress={handleSearchPress}
          onLanguagePress={handleLanguagePress}
          selectedLanguageCode={selectedLanguage}
          animatedStyle={{
            transform: [{ translateY: headerTranslateY }],
          }}
        />

        {/* КАТЕГОРИИ - С ОБРАБОТЧИКОМ СКРОЛЛА */}
        <View style={styles.contentContainer}>
          <CategoryGrid
            languageMode={languageMode}
            onScroll={handleScroll}
          />
        </View>
      </TabScreen>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  // НОВАЯ минималистичная шапка - АБСОЛЮТНОЕ ПОЗИЦИОНИРОВАНИЕ для анимации
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.background,
    paddingHorizontal: scale(20),
    paddingTop: verticalScale(16),
    paddingBottom: verticalScale(16),
    borderBottomWidth: 1,
    borderBottomColor: Colors.border || '#E5E7EB',
    zIndex: 1000,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: verticalScale(2) },
    shadowOpacity: 0.1,
    shadowRadius: scale(4),
  },

  // Индикатор языка
  languageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(16),
    backgroundColor: '#F9FAFB',
    borderRadius: scale(12),
    marginBottom: verticalScale(12),
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  languageIndicator: {
    alignItems: 'center',
    marginHorizontal: scale(12),
  },
  flagLarge: {
    fontSize: moderateScale(28),
  },
  languageCode: {
    fontSize: moderateScale(11),
    color: '#6B7280',
    marginTop: verticalScale(4),
    fontWeight: '500',
  },
  changeLanguageButton: {
    position: 'absolute',
    right: scale(12),
    padding: scale(8),
  },

  // Контейнер для заголовков
  titleContainer: {
    alignItems: 'center',
    marginBottom: verticalScale(12),
  },

  // Основной заголовок (выбранный язык)
  titlePrimary: {
    fontSize: moderateScale(20),
    fontWeight: '700',
    color: Colors.text,
    marginBottom: verticalScale(6),
  },

  // Вторичный заголовок (туркменский или второй язык пары)
  titleSecondary: {
    fontSize: moderateScale(16),
    fontWeight: '500',
    color: Colors.textSecondary || '#6B7280',
  },

  // Поле поиска
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundLight || '#F9FAFB',
    borderRadius: scale(12),
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(12),
    borderWidth: 1,
    borderColor: Colors.border || '#E5E7EB',
  },

  searchPlaceholder: {
    marginLeft: scale(10),
    fontSize: moderateScale(15),
    color: Colors.textLight,
  },

  // Контейнер категорий
  contentContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  gridContainer: {
    paddingHorizontal: scale(20),
    paddingTop: verticalScale(HEADER_HEIGHT + 24),  // ✅ Отступ сверху для header
    paddingBottom: verticalScale(40),
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: verticalScale(20),
  },

  cardWrapper: {
    width: '48%',
    height: verticalScale(260),          // ✅ СТРОГАЯ фиксированная высота
  },

  leftCard: {
    marginRight: scale(6),
  },

  rightCard: {
    marginLeft: scale(6),
  },
});