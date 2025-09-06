// src/screens/CategoryScreen.tsx - ИСПРАВЛЕННАЯ ВЕРСИЯ с правильным позиционированием кнопки избранного

import React, { useMemo, useCallback, useState, useEffect } from 'react';
import { ResponsiveUtils } from '../utils/ResponsiveUtils';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ListRenderItem,
  ActivityIndicator,
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
      };
    } else {
      return {
        main: phrase.turkmen,
        secondary: phrase.russian,
        mainStyle: styles.primaryText,
      };
    }
  }, [phrase.turkmen, phrase.russian, config.mode]);

  const favoriteStatus = isFavorite(phrase.id);

  return (
    <TouchableOpacity
      style={styles.phraseCard}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      {/* ИСПРАВЛЕНО: Используем правильную структуру с flex */}
      <View style={styles.phraseContainer}>
        {/* Основной контент фразы */}
        <View style={styles.phraseContent}>
          <Text style={styles.chineseText}>{phrase.chinese}</Text>
          <Text style={styles.pinyinText}>{phrase.pinyin}</Text>
          
          <Text style={phraseTexts.mainStyle}>
            {phraseTexts.main}
          </Text>
          <Text style={styles.secondaryText}>
            {phraseTexts.secondary}
          </Text>
        </View>
        
        {/* ИСПРАВЛЕНО: Правильное позиционирование кнопок */}
        <View style={styles.actionsContainer}>
          {/* Кнопки воспроизведения */}
          <View style={styles.playButtons}>
            <TouchableOpacity
              style={styles.playButton}
              onPress={handlePlayChinese}
              disabled={isPlaying || isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size={20} color={Colors.primary} />
              ) : (
                <Ionicons
                  name={isPlaying ? "pause-circle" : "play-circle"}
                  size={24}
                  color={isPlaying ? Colors.primary : Colors.primary}
                />
              )}
              <Text style={styles.playLabel}>中文</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.playButton}
              onPress={handlePlayTurkmen}
              disabled={isPlaying || isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size={20} color={Colors.accent} />
              ) : (
                <Ionicons
                  name={isPlaying ? "pause-circle" : "play-circle"}
                  size={24}
                  color={isPlaying ? Colors.accent : Colors.accent}
                />
              )}
              <Text style={styles.playLabel}>TM</Text>
            </TouchableOpacity>
          </View>
          
          {/* ИСПРАВЛЕНО: Кнопка избранного с правильным позиционированием */}
          <TouchableOpacity 
            style={styles.favoriteButton}
            onPress={handleToggleFavorite}
          >
            <Ionicons 
              name={favoriteStatus ? "heart" : "heart-outline"} 
              size={20} 
              color={favoriteStatus ? Colors.error : Colors.textLight} 
            />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
});

export default function CategoryScreen() {
  const route = useRoute<CategoryScreenRouteProp>();
  const navigation = useNavigation<CategoryScreenNavigationProp>();
  const { config } = useAppLanguage();
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const { category } = route.params;

  const categoryPhrases = useMemo(() => {
    return phrases.filter(phrase => phrase.categoryId === category.id);
  }, [category.id]);

  // Имитация загрузки для демонстрации
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handlePhrasePress = useCallback((phrase: Phrase) => {
    navigation.navigate('PhraseDetail', { phrase });
  }, [navigation]);

  const renderPhrase: ListRenderItem<Phrase> = useCallback(({ item }) => (
    <ErrorBoundary fallbackComponent={
      <View style={styles.phraseCard}>
        <Text style={styles.errorText}>Ошибка загрузки фразы</Text>
      </View>
    }>
      <PhraseItem 
        phrase={item} 
        onPress={handlePhrasePress}
        config={config}
      />
    </ErrorBoundary>
  ), [handlePhrasePress, config]);

  const getItemLayout = useCallback((data: any, index: number) => ({
    length: TOTAL_ITEM_HEIGHT,
    offset: TOTAL_ITEM_HEIGHT * index,
    index,
  }), []);

  const keyExtractor = useCallback((item: Phrase) => item.id, []);

  const categoryTitle = useMemo(() => {
    switch (config.mode) {
      case 'tk': return category.nameTk;
      case 'zh': return category.nameZh;
      default: return category.nameRu;
    }
  }, [category, config.mode]);

  const phrasesCountText = useMemo(() => {
    const count = categoryPhrases.length;
    switch (config.mode) {
      case 'tk': return `${count} sözlem`;
      case 'zh': return `${count}个短语`;
      default: return count === 1 ? `${count} фраза` : `${count} фраз`;
    }
  }, [categoryPhrases.length, config.mode]);

  if (isInitialLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={category.color} />
        <LoadingSpinner message="Загрузка фраз..." />
      </SafeAreaView>
    );
  }

  if (categoryPhrases.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={category.color} />
        <EmptyState
          title="Нет фраз"
          message="В этой категории пока нет фраз"
          icon="chatbubbles-outline"
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={category.color} />
      
      {/* Заголовок с информацией о категории */}
      <View style={[styles.header, { backgroundColor: category.color }]}>
        <Text style={styles.headerTitle}>{categoryTitle}</Text>
        <Text style={styles.headerSubtitle}>{phrasesCountText}</Text>
      </View>

      {/* Список фраз */}
      <FlatList
        data={categoryPhrases}
        renderItem={renderPhrase}
        keyExtractor={keyExtractor}
        getItemLayout={getItemLayout}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        maxToRenderPerBatch={8}
        windowSize={10}
        initialNumToRender={6}
        ItemSeparatorComponent={() => <View style={{ height: SEPARATOR_HEIGHT }} />}
      />
    </SafeAreaView>
  );
}

// ИСПРАВЛЕННЫЕ СТИЛИ с правильным layout
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.textWhite,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 16,
  },
  phraseCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    height: ITEM_HEIGHT,
    elevation: 2,
    shadowColor: Colors.cardShadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  // ИСПРАВЛЕНО: Новая структура layout
  phraseContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  phraseContent: {
    flex: 1,
    marginRight: 12, // Отступ от кнопок
  },
  actionsContainer: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: '100%',
    minWidth: 80, // Фиксированная ширина для кнопок
  },
  playButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  playButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
  },
  playLabel: {
    fontSize: 10,
    color: Colors.textLight,
    marginTop: 2,
  },
  // ИСПРАВЛЕНО: Правильные стили для кнопки избранного
  favoriteButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.background,
    elevation: 1,
    shadowColor: Colors.cardShadow,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  chineseText: {
    fontSize: ResponsiveUtils.fontSize.chineseText,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 2,
  },
  pinyinText: {
    fontSize: ResponsiveUtils.fontSize.pinyinText,
    color: Colors.primary,
    fontStyle: 'italic',
    marginBottom: 8,
  },
  primaryText: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: '600',
    marginBottom: 4,
  },
  turkmenMainText: {
    fontSize: 18,
    color: Colors.text,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  secondaryText: {
    fontSize: 14,
    color: Colors.textLight,
  },
  errorText: {
    fontSize: 16,
    color: Colors.error,
    textAlign: 'center',
  },
});