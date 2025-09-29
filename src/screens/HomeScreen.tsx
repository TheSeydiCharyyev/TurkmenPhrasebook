// src/screens/HomeScreen.tsx - ПОЛНАЯ ВЕРСИЯ с исчезающей шапкой

import React, { useCallback, useRef, useMemo } from 'react';
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

// Высота заголовка
const HEADER_MAX_HEIGHT = 140;
const HEADER_MIN_HEIGHT = 0; // Полностью скрывается

const AppHeader = React.memo<{ animatedValue: Animated.Value }>(({ animatedValue }) => {
  const { config } = useAppLanguage();

  // Анимация высоты заголовка - ИСЧЕЗАЕТ ПОЛНОСТЬЮ
  const headerHeight = animatedValue.interpolate({
    inputRange: [0, 100],
    outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
    extrapolate: 'clamp',
  });

  // Анимация прозрачности - ИСЧЕЗАЕТ
  const headerOpacity = animatedValue.interpolate({
    inputRange: [0, 50],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  // Заголовки в зависимости от языка
  const getAppTitles = () => {
    if (config.mode === 'zh') {
      return {
        mainTitle: '中文会话手册',
        secondaryTitle: 'Hytaý Kitaby',
        subtitle: 'Китайский разговорник',
        selectText: '选择类别'
      };
    } else if (config.mode === 'tk') {
      return {
        mainTitle: 'HYTAÝ KITABY',
        secondaryTitle: '中文会话',
        subtitle: 'Китайский разговорник',
        selectText: 'Kategoriýany saýlaň'
      };
    } else {
      return {
        mainTitle: 'Китайский разговорник',
        secondaryTitle: '中文会话手册',
        subtitle: 'Hytaý Kitaby',
        selectText: 'Выберите категорию'
      };
    }
  };

  const titles = getAppTitles();

  return (
    <Animated.View 
      style={[
        styles.headerContainer, 
        { 
          height: headerHeight,
          opacity: headerOpacity,
        }
      ]}
    >
      <Animated.View style={styles.fullHeader}>
        <Text style={styles.mainTitle}>{titles.mainTitle}</Text>
        <Text style={styles.secondaryTitle}>{titles.secondaryTitle}</Text>
        <Text style={styles.russianTitle}>{titles.subtitle}</Text>
        <Text style={styles.selectCategoryText}>{titles.selectText}</Text>
      </Animated.View>
    </Animated.View>
  );
});

interface CategoryPairItemProps {
  item: [Category, Category | undefined];
  onPress: (category: Category) => void;
  languageMode: 'ru' | 'tk' | 'zh';
}

const CategoryPairItem = React.memo<CategoryPairItemProps>(({ item, onPress, languageMode }) => {
  const [leftCategory, rightCategory] = item;

  return (
    <View style={styles.row}>
      <View style={[styles.cardWrapper, styles.leftCard]}>
        <CategoryCard 
          category={leftCategory} 
          onPress={() => onPress(leftCategory)}
          languageMode={languageMode}
        />
      </View>
      {rightCategory && (
        <View style={[styles.cardWrapper, styles.rightCard]}>
          <CategoryCard 
            category={rightCategory} 
            onPress={() => onPress(rightCategory)}
            languageMode={languageMode}
          />
        </View>
      )}
    </View>
  );
});

interface CategoryGridProps {
  onScroll: (event: any) => void;
  languageMode: 'ru' | 'tk' | 'zh';
}

const CategoryGrid = React.memo<CategoryGridProps>(({ onScroll, languageMode }) => {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  const handleCategoryPress = useCallback((category: Category) => {
    navigation.navigate('CategoryScreen', { category });
  }, [navigation]);

  const renderCategoryPair = useCallback(({ item }: { item: [Category, Category | undefined] }) => (
    <CategoryPairItem 
      item={item} 
      onPress={handleCategoryPress}
      languageMode={languageMode}
    />
  ), [handleCategoryPress, languageMode]);

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
  const { config } = useAppLanguage();

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
        
        {/* ШАПКА КОТОРАЯ ИСЧЕЗАЕТ ПРИ СКРОЛЛЕ */}
        <AppHeader animatedValue={scrollY} />
        
        <View style={styles.contentContainer}>
          <CategoryGrid 
            onScroll={handleScroll}
            languageMode={config.mode}
          />
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
  
  // Контейнер заголовка - БУДЕТ ИСЧЕЗАТЬ
  headerContainer: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },

  // Полный заголовок
  fullHeader: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Главный заголовок
  mainTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textWhite,
    textAlign: 'center',
    marginBottom: 6,
    letterSpacing: 0.5,
    paddingHorizontal: 10,
  },
  
  // Вторичный заголовок
  secondaryTitle: {
    fontSize: 18,
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