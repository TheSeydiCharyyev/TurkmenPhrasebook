// src/screens/HomeScreen.tsx - ОБНОВЛЕНО для мультиязычности (Phase 3)

import React, { useCallback, useRef, useMemo, useState, useEffect } from 'react';
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
import { useSafeArea } from '../hooks/useSafeArea';

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
const HEADER_HEIGHT = verticalScale(104); // Увеличена для кнопки назад

// Минималистичная шапка с индикатором языка
const MinimalHeader = React.memo<{
  languageMode: string;
  onLanguagePress: () => void;
  onBackPress: () => void;
  selectedLanguageCode: string;
  animatedStyle?: any;
}>(
  ({ languageMode, onLanguagePress, onBackPress, selectedLanguageCode, animatedStyle }) => {
    const selectedLang = getLanguageByCode(selectedLanguageCode);
    const isTurkmenMode = selectedLanguageCode === 'tk';
    const secondLang = isTurkmenMode ? getLanguageByCode('en') : getLanguageByCode('tk');

    return (
      <Animated.View style={[styles.headerContainer, animatedStyle]}>
        <TouchableOpacity style={styles.backButton} onPress={onBackPress} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={moderateScale(24)} color={Colors.text} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.languageInfo} onPress={onLanguagePress} activeOpacity={0.7}>
          <Text style={styles.flagIcon}>{selectedLang?.flag || '🌍'}</Text>
          <Ionicons name="swap-horizontal" size={moderateScale(20)} color="#9CA3AF" style={{ marginHorizontal: scale(6) }} />
          <Text style={styles.flagIcon}>{secondLang?.flag || '🇹🇲'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingsButton} onPress={onLanguagePress} activeOpacity={0.7}>
          <Ionicons name="settings-outline" size={moderateScale(24)} color={Colors.text} />
        </TouchableOpacity>
      </Animated.View>
    );
  }
);

// Компонент одиночной категории (1 колонка - вертикальный список)
const CategoryItem = React.memo<{
  item: Category;
  onPress: (category: Category) => void;
  languageMode: string;
}>(({ item, onPress, languageMode }) => (
  <View style={styles.categoryItemWrapper}>
    <CategoryCard
      category={item}
      onPress={onPress}
      languageMode={languageMode}
    />
  </View>
));

// Сетка категорий
interface CategoryGridProps {
  languageMode: string;  // ✅ ОБНОВЛЕНО: поддержка всех 30 языков
  onScroll?: (event: any) => void;  // ✅ НОВОЕ: колбэк для скролла
  safeAreaBottom?: number; // ✅ НОВОЕ: Safe Area для bottom padding
}

const CategoryGrid = React.memo<CategoryGridProps>(({ languageMode, onScroll, safeAreaBottom = 0 }) => {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  const handleCategoryPress = useCallback((category: Category) => {
    navigation.navigate('CategoryScreen', { category });
  }, [navigation]);

  const renderCategory = useCallback(
    ({ item }: { item: Category }) => (
      <CategoryItem
        item={item}
        onPress={handleCategoryPress}
        languageMode={languageMode}
      />
    ),
    [handleCategoryPress, languageMode]
  );

  return (
    <Animated.FlatList
      data={categories}
      renderItem={renderCategory}
      keyExtractor={(item) => item.id}
      contentContainerStyle={[
        styles.gridContainer,
        { paddingBottom: Math.max(safeAreaBottom, verticalScale(40)) }
      ]}
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

  // Safe Area для bottom padding (home indicator)
  const { bottom: safeAreaBottom } = useSafeArea();

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
              toValue: -HEADER_HEIGHT - verticalScale(20),
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

  const handleLanguagePress = useCallback(() => {
    // Переход к экрану выбора языковой пары разговорника
    navigation.navigate('LanguagePairSelection');
  }, [navigation]);

  const handleBackPress = useCallback(() => {
    // Возврат на главный экран приложения (из вложенного стека в корневой)
    const parentNavigation = navigation.getParent();
    if (parentNavigation) {
      parentNavigation.navigate('MainHub');
    }
  }, [navigation]);

  // ✅ FIXED: Cleanup Animated.Value on unmount (CRITICAL memory leak fix)
  useEffect(() => {
    return () => {
      scrollY.stopAnimation();
      headerTranslateY.stopAnimation();
    };
  }, [scrollY, headerTranslateY]);

  return (
    <ErrorBoundary>
      <TabScreen backgroundColor={Colors.background}>
        {/* НОВАЯ МИНИМАЛИСТИЧНАЯ ШАПКА С ИНДИКАТОРОМ ЯЗЫКА - АНИМИРОВАННАЯ */}
        <MinimalHeader
          languageMode={languageMode}
          onLanguagePress={handleLanguagePress}
          onBackPress={handleBackPress}
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
            safeAreaBottom={safeAreaBottom}
          />
        </View>
      </TabScreen>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  // НОВАЯ минималистичная шапка - АБСОЛЮТНОЕ ПОЗИЦИОНИРОВАНИЕ для анимации
  headerContainer: {
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderBottomColor: Colors.border || '#E5E7EB',
    borderBottomWidth: 1,
    elevation: 4,
    flexDirection: 'row',
    height: verticalScale(104),
    justifyContent: 'space-between',
    left: 0,
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(44),
    position: 'absolute',
    right: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: verticalScale(2) },
    shadowOpacity: 0.1,
    shadowRadius: scale(4),
    top: 0,
    zIndex: 1000,
  },

  backButton: {
    alignItems: 'center',
    borderRadius: scale(20),
    height: verticalScale(40),
    justifyContent: 'center',
    width: scale(40),
  },

  languageInfo: {
    alignItems: 'center',
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: scale(12),
  },

  flagIcon: {
    fontSize: moderateScale(28),
    marginRight: scale(8),
  },

  languageName: {
    color: Colors.text,
    fontSize: moderateScale(16),
    fontWeight: '700',
  },

  settingsButton: {
    alignItems: 'center',
    borderRadius: scale(20),
    height: verticalScale(40),
    justifyContent: 'center',
    width: scale(40),
  },

  // Поле поиска

  // Контейнер категорий
  contentContainer: {
    backgroundColor: Colors.background,
    flex: 1,
  },

  gridContainer: {
    paddingHorizontal: scale(20),
    paddingTop: verticalScale(HEADER_HEIGHT + 24),  // ✅ Отступ сверху для header
    // paddingBottom теперь динамический через safeAreaBottom
  },

  // 1 колонка - вертикальный список (минимализм)
  categoryItemWrapper: {
    width: '100%',
    height: verticalScale(140),  // Средняя высота для минимализма
    marginBottom: verticalScale(16),  // Отступ между карточками
  },
});