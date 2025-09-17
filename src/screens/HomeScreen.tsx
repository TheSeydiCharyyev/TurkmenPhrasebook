// src/screens/HomeScreen.tsx - ИСПРАВЛЕННАЯ ВЕРСИЯ с правильными языками

import React, { useCallback, useRef, useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  StatusBar,
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { Category, HomeStackParamList } from '../types';
import { Colors } from '../constants/Colors';
import { useAppLanguage } from '../contexts/LanguageContext';
import { categories } from '../data/categories';
import CategoryCard from '../components/CategoryCard';
import ErrorBoundary from '../components/ErrorBoundary';

type HomeScreenNavigationProp = StackNavigationProp<HomeStackParamList, 'CategoryScreen'>;

// Высота заголовка для анимации
const HEADER_HEIGHT = 140;

const AppHeader = React.memo<{ animatedValue: Animated.Value }>(({ animatedValue }) => {
  const { config } = useAppLanguage();

  // Анимация высоты заголовка
  const headerHeight = animatedValue.interpolate({
    inputRange: [0, 100],
    outputRange: [HEADER_HEIGHT, 60],
    extrapolate: 'clamp',
  });

  // Анимация прозрачности основного текста
  const headerOpacity = animatedValue.interpolate({
    inputRange: [0, 50],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  // Анимация прозрачности компактного заголовка
  const compactOpacity = animatedValue.interpolate({
    inputRange: [30, 80],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  // ИСПРАВЛЕНО: Правильный порядок названий в зависимости от выбранного языка
  const getAppTitles = () => {
    if (config.mode === 'zh') {
      // Когда выбран китайский - китайский главный
      return {
        mainTitle: '土库曼-中文会话手册',
        secondaryTitle: 'TÜRKMEN-HYTAÝ GEPLEŞIK KITABY',
        subtitle: 'Туркменско-китайский разговорник',
        selectText: '选择类别'
      };
    } else {
      // Когда выбран туркменский - туркменский главный
      return {
        mainTitle: 'TÜRKMEN-HYTAÝ GEPLEŞIK KITABY',
        secondaryTitle: '土库曼-中文会话手册',
        subtitle: 'Туркменско-китайский разговорник',
        selectText: 'Kategoriýa saýlaň'
      };
    }
  };

  const titles = getAppTitles();

  return (
    <Animated.View style={[styles.headerContainer, { height: headerHeight }]}>
      {/* Полный заголовок - исчезает при скролле */}
      <Animated.View style={[styles.fullHeader, { opacity: headerOpacity }]}>
        <Text style={styles.mainTitle}>
          {titles.mainTitle}
        </Text>
        
        <Text style={styles.secondaryTitle}>
          {titles.secondaryTitle}
        </Text>
        
        <Text style={styles.russianTitle}>
          {titles.subtitle}
        </Text>
        
        <Text style={styles.selectCategoryText}>
          {titles.selectText}
        </Text>
      </Animated.View>

      {/* Компактный заголовок - появляется при скролле */}
      <Animated.View style={[styles.compactHeader, { opacity: compactOpacity }]}>
        <Text style={styles.compactTitle}>
          {config.mode === 'zh' ? '中文会话' : 'Hytaý Kitaby'}
        </Text>
      </Animated.View>
    </Animated.View>
  );
});

const CategoryGrid = React.memo<{ onScroll: (event: any) => void }>(({ onScroll }) => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { config } = useAppLanguage();

  const handleCategoryPress = useCallback((category: Category) => {
    navigation.navigate('CategoryScreen', { category });
  }, [navigation]);

  const renderCategoryPair: any = useCallback(({ item }: { item: [Category, Category?] }) => (
    <View style={styles.row}>
      <View style={[styles.cardWrapper, styles.leftCard]}>
        <CategoryCard
          category={item[0]}
          onPress={handleCategoryPress}
          languageMode={config.mode}
        />
      </View>
      
      {item[1] && (
        <View style={[styles.cardWrapper, styles.rightCard]}>
          <CategoryCard
            category={item[1]}
            onPress={handleCategoryPress}
            languageMode={config.mode}
          />
        </View>
      )}
    </View>
  ), [handleCategoryPress, config.mode]);

  // Группируем категории по парам для 2-колоночной сетки
  const categoryPairs = useMemo(() => {
    const pairs: Array<[Category, Category?]> = [];
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
      onScroll={onScroll}
      scrollEventThrottle={16}
      removeClippedSubviews={true}
      maxToRenderPerBatch={6}
      windowSize={10}
      initialNumToRender={4}
    />
  );
});

export default function HomeScreen() {
  const scrollY = useRef(new Animated.Value(0)).current;

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: false }
  );

  return (
    <ErrorBoundary>
      <SafeAreaView style={styles.container}>
        <StatusBar 
          barStyle="light-content" 
          backgroundColor={Colors.primary} 
          translucent={false}
        />
        
        <AppHeader animatedValue={scrollY} />
        
        <View style={styles.contentContainer}>
          <CategoryGrid onScroll={handleScroll} />
        </View>
      </SafeAreaView>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  
  // ИСПРАВЛЕНО: Лучшее центрирование header
  headerContainer: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20, // Уменьшили с 24 до 20
    justifyContent: 'center',
    alignItems: 'center', // Добавили для центрирования
    overflow: 'hidden',
  },

  // Полный заголовок
  fullHeader: {
    position: 'absolute',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center', // Добавили для лучшего центрирования
    top: '50%',
    transform: [{ translateY: -50 }], // Изменили для точного центрирования
  },
  
  // ИСПРАВЛЕНО: Главный заголовок - размер зависит от выбранного языка
  mainTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textWhite,
    textAlign: 'center',
    marginBottom: 6,
    letterSpacing: 0.5,
    paddingHorizontal: 10, // Добавили padding для предотвращения обрезки
  },
  
  // Вторичный заголовок
  secondaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textWhite,
    textAlign: 'center',
    marginBottom: 4,
    opacity: 0.9,
    paddingHorizontal: 10,
  },
  
  russianTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textWhite,
    textAlign: 'center',
    marginBottom: 12,
    opacity: 0.8,
    paddingHorizontal: 10,
  },
  
  selectCategoryText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textWhite,
    textAlign: 'center',
    opacity: 0.9,
    paddingHorizontal: 10,
  },

  // Компактный заголовок
  compactHeader: {
    position: 'absolute',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    top: '50%',
    transform: [{ translateY: -10 }],
  },

  compactTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textWhite,
    textAlign: 'center',
  },
  
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