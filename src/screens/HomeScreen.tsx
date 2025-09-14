// src/screens/HomeScreen.tsx - 25 категорий с вертикальной прокруткой

import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  StatusBar,
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

const AppHeader = React.memo(() => {
  const { getTexts } = useAppLanguage();
  const texts = getTexts();

  return (
    <View style={styles.headerContainer}>
      {/* Оригинальный заголовок */}
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
    </View>
  );
});

const CategoryGrid = React.memo(() => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  
  const handleCategoryPress = useCallback((category: Category) => {
    navigation.navigate('CategoryScreen', { category });
  }, [navigation]);

  const renderCategory = useCallback(({ item, index }: { item: Category; index: number }) => (
    <View style={[
      styles.cardWrapper,
      // Добавляем отступ только к левой карточке в паре
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
      data={categories} // Все 25 категорий
      renderItem={renderCategory}
      keyExtractor={(item) => item.id}
      numColumns={2}
      contentContainerStyle={styles.gridContainer}
      columnWrapperStyle={styles.row}
      showsVerticalScrollIndicator={false}
      // Оптимизация для больших списков
      removeClippedSubviews={true}
      maxToRenderPerBatch={8}
      windowSize={10}
      initialNumToRender={8}
    />
  );
});

export default function HomeScreen() {
  return (
    <ErrorBoundary>
      <SafeAreaView style={styles.container}>
        <StatusBar 
          barStyle="light-content" 
          backgroundColor={Colors.primary} 
          translucent={false}
        />
        
        <AppHeader />
        
        <View style={styles.contentContainer}>
          <CategoryGrid />
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
    paddingVertical: 24,
    paddingBottom: 32,
  },
  
  // Заголовки
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
  
  contentContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  
  gridContainer: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    paddingBottom: 40, // Дополнительный отступ снизу
  },
  
  row: {
    justifyContent: 'space-between',
    marginBottom: 0, // Убираем отступ, используем marginBottom в карточках
  },
  
  cardWrapper: {
    width: '48%', // Точно половина минус промежуток
  },
  
  leftCard: {
    marginRight: 8, // Отступ только у левой карточки
  },
  
  rightCard: {
    marginLeft: 8, // Отступ только у правой карточки
  },
});