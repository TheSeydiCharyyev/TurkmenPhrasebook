// src/screens/CategoryScreen.tsx - ИСПРАВЛЕННАЯ ВЕРСИЯ без ошибок

import React, { useMemo, useCallback, useState, useEffect, useRef } from 'react';
import { ResponsiveUtils } from '../utils/ResponsiveUtils';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
  ListRenderItem,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { RouteProp, useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

import { HomeStackParamList, RootStackParamList, Phrase } from '../types';
import { phrases } from '../data/phrases';
import { Colors } from '../constants/Colors';
import { useAudio } from '../hooks/useAudio';
import { useFavorites } from '../hooks/useFavorites';
import { useAppLanguage } from '../contexts/LanguageContext';
import { useHistory } from '../hooks/useHistory';
import { PhraseCardSkeleton, LoadingSpinner, EmptyState } from '../components/LoadingStates';
import ErrorBoundary from '../components/ErrorBoundary';

type CategoryScreenRouteProp = RouteProp<HomeStackParamList, 'CategoryScreen'>;
type CategoryScreenNavigationProp = StackNavigationProp<RootStackParamList, 'PhraseDetail'>;

const ITEM_HEIGHT = ResponsiveUtils.dimensions.phraseCardHeight;
const SEPARATOR_HEIGHT = 12;
const TOTAL_ITEM_HEIGHT = ITEM_HEIGHT + SEPARATOR_HEIGHT;

// ИСПРАВЛЕННЫЙ компонент PhraseItem с правильным layout
const PhraseItem = React.memo<{
  phrase: Phrase;
  onPress: (phrase: Phrase) => void;
  config: { mode: 'tk' | 'zh' };
}>(({ phrase, onPress, config }) => {
  const { isPlaying, isLoading, playText } = useAudio();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { addToHistory } = useHistory();

  const handlePress = useCallback(() => {
    addToHistory(phrase.id);
    onPress(phrase);
  }, [phrase, onPress, addToHistory]);

  const handlePlayChinese = useCallback(() => {
    if (!isPlaying && !isLoading) {
      playText(phrase.chinese, 'chinese');
    }
  }, [phrase.chinese, playText, isPlaying, isLoading]);

  const handlePlayTurkmen = useCallback(() => {
    if (!isPlaying && !isLoading) {
      playText(phrase.turkmen, 'turkmen');
    }
  }, [phrase.turkmen, playText, isPlaying, isLoading]);

  const handleToggleFavorite = useCallback(() => {
    toggleFavorite(phrase.id);
  }, [phrase.id, toggleFavorite]);

  const phraseTexts = useMemo(() => {
    if (config.mode === 'tk') {
      return {
        main: phrase.turkmen,
        secondary: phrase.russian,
        mainStyle: styles.turkmenMainText,
        secondaryStyle: styles.russianSecondaryText,
      };
    } else {
      return {
        main: phrase.chinese,
        secondary: phrase.russian,
        mainStyle: styles.chineseMainText,
        secondaryStyle: styles.russianSecondaryText,
      };
    }
  }, [config.mode, phrase]);

  return (
    <TouchableOpacity 
      style={styles.phraseCard} 
      onPress={handlePress}
      activeOpacity={0.7}
    >
      {/* Основной контент фразы */}
      <View style={styles.phraseContent}>
        {/* Китайские иероглифы - всегда сверху */}
        <Text style={styles.chineseText}>{phrase.chinese}</Text>
        
        {/* Пиньинь - серым цветом */}
        <Text style={styles.pinyinText}>{phrase.pinyin}</Text>
        
        {/* Туркменский перевод - жирным черным */}
        <Text style={styles.turkmenText}>{phrase.turkmen}</Text>
        
        {/* Русский перевод - серым */}
        <Text style={styles.russianText}>{phrase.russian}</Text>
      </View>

      {/* Кнопки действий */}
      <View style={styles.actionButtons}>
        {/* Кнопка воспроизведения китайского */}
        <TouchableOpacity
          style={[styles.actionButton, styles.playChineseButton]}
          onPress={handlePlayChinese}
          disabled={isPlaying || isLoading}
        >
          {isPlaying ? (
            <ActivityIndicator size="small" color={Colors.primary} />
          ) : (
            <Ionicons name="play" size={16} color={Colors.primary} />
          )}
          <Text style={styles.playButtonLabel}>中文</Text>
        </TouchableOpacity>

        {/* Кнопка воспроизведения туркменского */}
        <TouchableOpacity
          style={[styles.actionButton, styles.playTurkmenButton]}
          onPress={handlePlayTurkmen}
          disabled={isPlaying || isLoading}
        >
          {isPlaying ? (
            <ActivityIndicator size="small" color={Colors.accent} />
          ) : (
            <Ionicons name="play" size={16} color={Colors.accent} />
          )}
          <Text style={styles.playButtonLabel}>TM</Text>
        </TouchableOpacity>

        {/* Кнопка избранного */}
        <TouchableOpacity
          style={[styles.actionButton, styles.favoriteButton]}
          onPress={handleToggleFavorite}
        >
          <Ionicons
            name={isFavorite(phrase.id) ? "heart" : "heart-outline"}
            size={20}
            color={isFavorite(phrase.id) ? Colors.error : Colors.textLight}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
});

export default function CategoryScreen() {
  const route = useRoute<CategoryScreenRouteProp>();
  const navigation = useNavigation<CategoryScreenNavigationProp>();
  const { config } = useAppLanguage();
  const [isLoading, setIsLoading] = useState(true);
  
  // Анимация для header
  const scrollY = useRef(new Animated.Value(0)).current;

  const { category } = route.params;

  // Фильтрация фраз по категории
  const categoryPhrases = useMemo(() => {
    return phrases.filter(phrase => phrase.categoryId === category.id);
  }, [category.id]);

  // Имитация загрузки
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const handlePhrasePress = useCallback((phrase: Phrase) => {
    navigation.navigate('PhraseDetail', { phrase });
  }, [navigation]);

  const renderPhraseItem: ListRenderItem<Phrase> = useCallback(({ item }) => (
    <PhraseItem 
      phrase={item} 
      onPress={handlePhrasePress}
      config={config}
    />
  ), [handlePhrasePress, config]);

  const getItemLayout = useCallback((data: any, index: number) => ({
    length: TOTAL_ITEM_HEIGHT,
    offset: TOTAL_ITEM_HEIGHT * index,
    index,
  }), []);

  const ItemSeparator = useCallback(() => <View style={styles.separator} />, []);

  const keyExtractor = useCallback((item: Phrase) => item.id, []);

  // Получаем иконку категории
  const getCategoryIcon = () => {
    // Возвращаем иконку в зависимости от ID категории
    const iconMap: Record<string, string> = {
      'greetings': 'hand-left',
      'emergency': 'warning',
      'hotel': 'bed',
      'food': 'restaurant',
      'shopping': 'bag',
      'transport': 'bus',
      'directions': 'compass',
      'health': 'medical',
      'money': 'cash',
      'communication': 'call',
      'entertainment': 'game-controller',
      'time': 'time',
      'numbers': 'calculator',
      'weather': 'partly-sunny',
    };
    return iconMap[category.id] || 'apps';
  };

  // Анимация для расширенного header
  const headerHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [140, 64], // От полного header до компактного
    extrapolate: 'clamp',
  });

  const categoryInfoOpacity = scrollY.interpolate({
    inputRange: [0, 80],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const categoryInfoHeight = scrollY.interpolate({
    inputRange: [0, 80],
    outputRange: [76, 0], // Высота блока с информацией
    extrapolate: 'clamp',
  });

  // Обработчик скролла
  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: false }
  );

  if (isLoading) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
        
        {/* РАСШИРЯЕМАЯ ШАПКА */}
        <Animated.View style={[styles.expandedHeader, { height: headerHeight }]}>
          {/* Верхняя часть - всегда видна */}
          <View style={styles.mainHeader}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="chevron-back" size={24} color={Colors.textWhite} />
            </TouchableOpacity>
            
            <Text style={styles.headerTitle}>{category.nameTk}</Text>
            
            <View style={styles.categoryIconContainer}>
              <Ionicons name={getCategoryIcon() as any} size={24} color={Colors.textWhite} />
            </View>
          </View>

          {/* Нижняя часть - исчезает при скролле */}
          <Animated.View style={[
            styles.headerSubtitle,
            {
              opacity: categoryInfoOpacity,
              height: categoryInfoHeight,
              overflow: 'hidden'
            }
          ]}>
            <Text style={styles.headerChineseText}>{category.nameZh}</Text>
            <Text style={styles.headerRussianText}>{category.nameRu}</Text>
            <Text style={styles.headerPhraseCount}>{categoryPhrases.length} sözlem</Text>
          </Animated.View>
        </Animated.View>

        <View style={styles.loadingContainer}>
          <LoadingSpinner message="Загружаем фразы..." />
        </View>
      </View>
    );
  }

  return (
    <ErrorBoundary>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
        
        {/* РАСШИРЯЕМАЯ ШАПКА */}
        <Animated.View style={[styles.expandedHeader, { height: headerHeight }]}>
          {/* Верхняя часть - всегда видна */}
          <View style={styles.mainHeader}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="chevron-back" size={24} color={Colors.textWhite} />
            </TouchableOpacity>
            
            <Text style={styles.headerTitle}>{category.nameTk}</Text>
            
            <View style={styles.categoryIconContainer}>
              <Ionicons name={getCategoryIcon() as any} size={24} color={Colors.textWhite} />
            </View>
          </View>

          {/* Нижняя часть - исчезает при скролле */}
          <Animated.View style={[
            styles.headerSubtitle,
            {
              opacity: categoryInfoOpacity,
              height: categoryInfoHeight,
              overflow: 'hidden'
            }
          ]}>
            <Text style={styles.headerChineseText}>{category.nameZh}</Text>
            <Text style={styles.headerRussianText}>{category.nameRu}</Text>
            <Text style={styles.headerPhraseCount}>{categoryPhrases.length} sözlem</Text>
          </Animated.View>
        </Animated.View>

        {/* Список фраз */}
        <Animated.FlatList
          data={categoryPhrases}
          renderItem={renderPhraseItem}
          keyExtractor={keyExtractor}
          getItemLayout={getItemLayout}
          ItemSeparatorComponent={ItemSeparator}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          windowSize={10}
          initialNumToRender={5}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        />
      </View>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  
  // РАСШИРЕННЫЙ HEADER
  expandedHeader: {
    backgroundColor: Colors.primary,
    elevation: 4,
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },

  // ОСНОВНАЯ ЧАСТЬ HEADER (красная шапка)
  mainHeader: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },

  // ПОДЗАГОЛОВОК HEADER - исчезает при скролле
  headerSubtitle: {
    backgroundColor: Colors.primary, // Тот же красный цвет
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.primaryLight, // Тонкая линия-разделитель
  },

  // КНОПКИ И ЭЛЕМЕНТЫ HEADER
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: '600',
    color: Colors.textWhite,
    textAlign: 'center',
    marginRight: 40, // Компенсируем иконку справа
  },
  
  categoryIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ТЕКСТ В HEADER
  headerChineseText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.textWhite,
    textAlign: 'center',
    marginBottom: 4,
  },
  
  headerRussianText: {
    fontSize: 14,
    color: Colors.textWhite,
    opacity: 0.9,
    textAlign: 'center',
    marginBottom: 4,
  },
  
  headerPhraseCount: {
    fontSize: 12,
    color: Colors.textWhite,
    opacity: 0.8,
    textAlign: 'center',
  },

  // ИНФОРМАЦИЯ О КАТЕГОРИИ
  categoryInfo: {
    backgroundColor: Colors.cardBackground,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderColor,
  },
  
  categoryNameChinese: {
    fontSize: 18,
    fontWeight: '500',
    color: Colors.textSecondary, // Серый цвет
    textAlign: 'center',
    marginBottom: 4,
  },
  
  categoryNameRussian: {
    fontSize: 16,
    fontWeight: '400',
    color: Colors.textSecondary, // Серый цвет
    textAlign: 'center',
    marginBottom: 8,
  },
  
  phraseCount: {
    fontSize: 14,
    color: Colors.textLight,
    textAlign: 'center',
  },

  // Остальные стили карточек
  listContainer: {
    padding: 16,
  },
  
  phraseCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    elevation: 2,
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  
  phraseContent: {
    flex: 1,
    marginRight: 12,
  },
  
  chineseText: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.textSecondary, // Серый цвет для китайского
    marginBottom: 4,
  },
  
  pinyinText: {
    fontSize: 16,
    color: Colors.textLight,
    marginBottom: 8,
    fontStyle: 'italic',
  },
  
  turkmenText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text, // Черный цвет для туркменского
    marginBottom: 4,
  },
  
  russianText: {
    fontSize: 16,
    color: Colors.textSecondary, // Серый цвет для русского
  },
  
  actionButtons: {
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 60,
  },
  
  actionButton: {
    width: 48,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  
  playChineseButton: {
    backgroundColor: Colors.primary + '15',
    flexDirection: 'row',
  },
  
  playTurkmenButton: {
    backgroundColor: Colors.accent + '15',
    flexDirection: 'row',
  },
  
  favoriteButton: {
    backgroundColor: 'transparent',
  },
  
  playButtonLabel: {
    fontSize: 10,
    fontWeight: '600',
    marginLeft: 2,
    color: Colors.textSecondary,
  },
  
  separator: {
    height: SEPARATOR_HEIGHT,
  },
  
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Старые стили для совместимости
  chineseMainText: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  
  turkmenMainText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  
  russianSecondaryText: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
});