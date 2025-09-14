// src/screens/HomeScreen.tsx - С оригинальным полным заголовком

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
  const { getTexts } = useAppLanguage();
  const texts = getTexts();

  return (
    <View style={styles.headerContainer}>
      {/* Оригинальный заголовок как во втором фото */}
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
      data={categories} // Все 14 категорий
      renderItem={renderCategory}
      keyExtractor={(item) => item.id}
      numColumns={2}
      contentContainerStyle={styles.gridContainer}
      columnWrapperStyle={styles.row}
      showsVerticalScrollIndicator={false}
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
  
  // Оригинальные стили заголовков как во втором фото
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
    padding: 24,
    paddingBottom: 40,
  },
  
  row: {
    justifyContent: 'space-between',
  },
  
  cardWrapper: {
    flex: 0.48,
  },
});