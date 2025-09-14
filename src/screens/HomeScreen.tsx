// src/screens/HomeScreen.tsx - Все 14 категорий в крупном размере

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
import { categories } from '../data/categories'; // Все 14 категорий
import CategoryCard from '../components/CategoryCard';
import ErrorBoundary from '../components/ErrorBoundary';

type HomeScreenNavigationProp = StackNavigationProp<HomeStackParamList, 'CategoryScreen'>;

const AppHeader = React.memo(() => {
  const { getTexts, config } = useAppLanguage();
  const texts = getTexts();

  return (
    <View style={styles.headerContainer}>
      {/* Компактный заголовок */}
      <Text style={styles.mainTitle}>
        {config.mode === 'tk' ? 'HYTAÝ DILI' :
         config.mode === 'zh' ? '中文学习' : 
         'КИТАЙСКИЙ ЯЗЫК'}
      </Text>
      
      <Text style={styles.subtitle}>
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

  const renderCategory = useCallback(({ item }: { item: Category }) => (
    <View style={styles.cardWrapper}>
      <CategoryCard 
        category={item} 
        onPress={() => handleCategoryPress(item)}
      />
    </View>
  ), [handleCategoryPress]);

  return (
    <FlatList
      data={categories} // Показываем ВСЕ 14 категорий
      renderItem={renderCategory}
      keyExtractor={(item) => item.id}
      numColumns={2}
      contentContainerStyle={styles.gridContainer}
      columnWrapperStyle={styles.row}
      showsVerticalScrollIndicator={false}
      // Убираем scrollEnabled={false} - теперь можно скроллить
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
    paddingVertical: 20,
    paddingBottom: 28,
    alignItems: 'center',
  },
  
  mainTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.textWhite,
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 1,
  },
  
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.textWhite,
    textAlign: 'center',
    opacity: 0.9,
  },
  
  contentContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  
  gridContainer: {
    padding: 24,
    paddingBottom: 40, // Больше отступ снизу для последних карточек
  },
  
  row: {
    justifyContent: 'space-between',
  },
  
  cardWrapper: {
    flex: 0.48, // Чуть меньше половины для промежутка между карточками
  },
});