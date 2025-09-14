// src/screens/HomeScreen.tsx - Сворачиваемый заголовок при скролле

import React, { useCallback, useRef, useState } from 'react';
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
import { categories } from '../data/categories'; // Все 25 категорий
import CategoryCard from '../components/CategoryCard';
import ErrorBoundary from '../components/ErrorBoundary';

type HomeScreenNavigationProp = StackNavigationProp<HomeStackParamList, 'CategoryScreen'>;

// Высота заголовка для анимации
const HEADER_HEIGHT = 140;

const AppHeader = React.memo<{ animatedValue: Animated.Value }>(({ animatedValue }) => {
  const { getTexts } = useAppLanguage();
  const texts = getTexts();

  // Анимация высоты заголовка
  const headerHeight = animatedValue.interpolate({
    inputRange: [0, 100],
    outputRange: [HEADER_HEIGHT, 60], // Сворачиваем с 140px до 60px
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

  return (
    <Animated.View style={[styles.headerContainer, { height: headerHeight }]}>
      {/* Полный заголовок - исчезает при скролле */}
      <Animated.View style={[styles.fullHeader, { opacity: headerOpacity }]}>
        <Text style={styles.turkmenTitle}>
          TÜRKMEN-HYTAÝ GEPLEŞIK KITABY
        </Text>
        
        <Text style={styles.chineseTitle}>
          土库曼-中文会话手册
        </Text>
        
        <Text style={styles.russianTitle}>
          Туркменско-китайский разговорник
        </Text>
        
        <Text style={styles.selectCategoryText}>
          {texts.selectCategory}
        </Text>
      </Animated.View>

      {/* Компактный заголовок - появляется при скролле */}
      <Animated.View style={[styles.compactHeader, { opacity: compactOpacity }]}>
        <Text style={styles.compactTitle}>
          {texts.selectCategory}
        </Text>
      </Animated.View>
    </Animated.View>
  );
});

const CategoryGrid = React.memo<{ onScroll: (event: any) => void }>(({ onScroll }) => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  
  const handleCategoryPress = useCallback((category: Category) => {
    navigation.navigate('CategoryScreen', { category });
  }, [navigation]);

  const renderCategory = useCallback(({ item, index }: { item: Category; index: number }) => (
    <View style={[
      styles.cardWrapper,
      index % 2 === 0 ? styles.leftCard : styles.rightCard
    ]}>
      <CategoryCard 
        category={item} 
        onPress={() => handleCategoryPress(item)}
      />
    </View>
  ), [handleCategoryPress]);

  return (
    <FlatList
      data={categories}
      renderItem={renderCategory}
      keyExtractor={(item) => item.id}
      numColumns={2}
      contentContainerStyle={styles.gridContainer}
      columnWrapperStyle={styles.row}
      showsVerticalScrollIndicator={false}
      onScroll={onScroll}
      scrollEventThrottle={16} // Плавная анимация
      removeClippedSubviews={true}
      maxToRenderPerBatch={8}
      windowSize={10}
      initialNumToRender={8}
    />
  );
});

export default function HomeScreen() {
  const scrollY = useRef(new Animated.Value(0)).current;

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: false } // Используем height анимацию
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
  
  headerContainer: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    justifyContent: 'center',
    overflow: 'hidden',
  },

  // Полный заголовок
  fullHeader: {
    position: 'absolute',
    width: '100%',
    alignItems: 'center',
    top: '50%',
    transform: [{ translateY: -60 }],
  },
  
  turkmenTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textWhite,
    textAlign: 'center',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  
  chineseTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textWhite,
    textAlign: 'center',
    marginBottom: 4,
    opacity: 0.9,
  },
  
  russianTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textWhite,
    textAlign: 'center',
    marginBottom: 16,
    opacity: 0.8,
  },
  
  selectCategoryText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textWhite,
    textAlign: 'center',
    opacity: 0.9,
  },

  // Компактный заголовок
  compactHeader: {
    position: 'absolute',
    width: '100%',
    alignItems: 'center',
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
    justifyContent: 'space-between',
    marginBottom: 0,
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