import React, { useMemo, useCallback, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ListRenderItem,
  ActivityIndicator, // Добавляем недостающий импорт
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

const ITEM_HEIGHT = 140;
const SEPARATOR_HEIGHT = 12;
const TOTAL_ITEM_HEIGHT = ITEM_HEIGHT + SEPARATOR_HEIGHT;

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
      <View style={styles.phraseContent}>
        <View style={styles.phraseTextContainer}>
          <Text style={styles.chineseText}>{phrase.chinese}</Text>
          <Text style={styles.pinyinText}>{phrase.pinyin}</Text>
          
          <Text style={phraseTexts.mainStyle}>
            {phraseTexts.main}
          </Text>
          <Text style={styles.secondaryText}>
            {phraseTexts.secondary}
          </Text>
        </View>
        
        <View style={styles.phraseActions}>
          <TouchableOpacity
            style={styles.playButton}
            onPress={handlePlayChinese}
            disabled={isPlaying || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size={24} color={Colors.primary} />
            ) : (
              <Ionicons
                name={isPlaying ? "pause-circle" : "play-circle"}
                size={28}
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
              <ActivityIndicator size={24} color={Colors.accent} />
            ) : (
              <Ionicons
                name={isPlaying ? "pause-circle" : "play-circle"}
                size={28}
                color={isPlaying ? Colors.accent : Colors.accent}
              />
            )}
            <Text style={styles.playLabel}>TM</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.favoriteButton}
            onPress={handleToggleFavorite}
          >
            <Ionicons 
              name={favoriteStatus ? "heart" : "heart-outline"} 
              size={24} 
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
      default: return count === 1 ? '1 фраза' : `${count} фраз`;
    }
  }, [categoryPhrases.length, config.mode]);

  // Loading state
  if (isInitialLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={category.color} />
        
        <View style={[styles.header, { backgroundColor: category.color }]}>
          <Text style={styles.categoryIcon}>{category.icon}</Text>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>{categoryTitle}</Text>
            <Text style={styles.phrasesCount}>Загрузка...</Text>
          </View>
        </View>

        <View style={styles.phrasesList}>
          <View style={styles.phrasesListContent}>
            {Array.from({ length: 3 }).map((_, index) => (
              <PhraseCardSkeleton key={index} />
            ))}
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={category.color} />

      <View style={[styles.header, { backgroundColor: category.color }]}>
        <Text style={styles.categoryIcon}>{category.icon}</Text>
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>{categoryTitle}</Text>
          <Text style={styles.phrasesCount}>{phrasesCountText}</Text>
        </View>
      </View>

      {categoryPhrases.length > 0 ? (
        <FlatList
          data={categoryPhrases}
          renderItem={renderPhrase}
          keyExtractor={keyExtractor}
          getItemLayout={getItemLayout}
          style={styles.phrasesList}
          contentContainerStyle={styles.phrasesListContent}
          showsVerticalScrollIndicator={false}
          removeClippedSubviews={true}
          maxToRenderPerBatch={8}
          updateCellsBatchingPeriod={50}
          initialNumToRender={6}
          windowSize={10}
          maintainVisibleContentPosition={{
            minIndexForVisible: 0,
            autoscrollToTopThreshold: 100,
          }}
        />
      ) : (
        <EmptyState
          icon="📚"
          title={
            config.mode === 'tk' ? 'Heniz sözlem ýok' :
            config.mode === 'zh' ? '暂无短语' :
            'Пока нет фраз'
          }
          message={
            config.mode === 'tk' ? 'Bu kategoriýada heniz sözlem ýok. Tiz wagtda goşarys!' :
            config.mode === 'zh' ? '此类别中暂无短语。即将添加！' :
            'В этой категории пока нет фраз. Скоро добавим!'
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundLight,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 10,
  },
  categoryIcon: {
    fontSize: 48,
    marginRight: 16,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.textWhite,
    marginBottom: 4,
  },
  phrasesCount: {
    fontSize: 14,
    color: Colors.textWhite,
    opacity: 0.8,
  },
  phrasesList: {
    flex: 1,
  },
  phrasesListContent: {
    padding: 16,
  },
  phraseCard: {
    height: ITEM_HEIGHT,
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: SEPARATOR_HEIGHT,
    elevation: 2,
    shadowColor: Colors.cardShadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  phraseContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  phraseTextContainer: {
    flex: 1,
  },
  chineseText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  pinyinText: {
    fontSize: 16,
    color: Colors.primary,
    marginBottom: 8,
    fontStyle: 'italic',
  },
  primaryText: {
    fontSize: 17,
    color: Colors.text,
    fontWeight: '600',
    marginBottom: 4,
  },
  turkmenMainText: {
    fontSize: 19,
    color: Colors.text,
    fontWeight: '700',
    marginBottom: 6,
  },
  secondaryText: {
    fontSize: 13,
    color: Colors.textLight,
    opacity: 0.8,
  },
  phraseActions: {
    alignItems: 'center',
    marginLeft: 12,
    gap: 8,
  },
  playButton: {
    alignItems: 'center',
  },
  playLabel: {
    fontSize: 10,
    color: Colors.textLight,
    marginTop: 2,
  },
  favoriteButton: {
    padding: 4,
    marginTop: 4,
  },
  errorText: {
    fontSize: 14,
    color: Colors.error,
    textAlign: 'center',
    padding: 20,
  },
});