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
import { useOfflineDataManager } from '../hooks/useOfflineDataManager';
import { phrases } from '../data/phrases';
import { categories, getCategoryName } from '../data/categories';
import CategoryCard from '../components/CategoryCard';
import ErrorBoundary from '../components/ErrorBoundary';

const { width } = Dimensions.get('window');
const cardWidth = (width - 60) / 2;
const cardHeight = 140;

type HomeScreenNavigationProp = StackNavigationProp<HomeStackParamList, 'CategoryScreen'>;

const AppHeader = React.memo(() => {
  const { getTexts, config } = useAppLanguage();
  const texts = getTexts();

  return (
    <View style={styles.headerContainer}>
      {/* Turkmen Title */}
      <Text style={styles.turkmenTitle}>
        TÜRKMEN-HYTAÝ GEPLEŞIK KITABY
      </Text>
      
      {/* Chinese Title */}
      <Text style={styles.chineseTitle}>
        土库曼-中文会话手册
      </Text>
      
      {/* Russian Title */}
      <Text style={styles.russianTitle}>
        Туркменско-китайский разговорник
      </Text>
      
      {/* Select Category Text */}
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
    <CategoryCard 
      category={item} 
      onPress={() => handleCategoryPress(item)}
    />
  ), [handleCategoryPress]);

  return (
    <FlatList
      data={categories}
      renderItem={renderCategory}
      keyExtractor={(item) => item.id}
      numColumns={2}
      contentContainerStyle={styles.gridContainer}
      showsVerticalScrollIndicator={false}
      getItemLayout={(_, index) => ({
        length: cardHeight + 12,
        offset: (cardHeight + 12) * Math.floor(index / 2),
        index,
      })}
    />
  );
});

export default function HomeScreen() {
  return (
    <ErrorBoundary>
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor={Colors.primary} barStyle="light-content" />
        <AppHeader />
        <CategoryGrid />
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
    paddingHorizontal: 20,
    paddingVertical: 24,
    backgroundColor: Colors.primary,
    alignItems: 'center',
  },

  turkmenTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textWhite,
    textAlign: 'center',
    marginBottom: 6,
    letterSpacing: 0.5,
  },

  chineseTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textWhite + 'DD',
    textAlign: 'center',
    marginBottom: 6,
  },

  russianTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textWhite + 'CC',
    textAlign: 'center',
    marginBottom: 16,
  },

  selectCategoryText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textWhite,
    textAlign: 'center',
  },

  gridContainer: {
    padding: 16,
    paddingBottom: 100,
    backgroundColor: Colors.background,
  },
});