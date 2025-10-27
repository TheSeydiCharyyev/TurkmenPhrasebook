// src/screens/SearchScreen.tsx - ИСПРАВЛЕННАЯ ВЕРСИЯ

import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  ScrollView,
  ListRenderItem,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

import { Colors } from '../constants/Colors';
import { TextStyles } from '../constants/Typography'; // ИСПРАВЛЕНО: заменен Typography на TextStyles
import { PhraseWithTranslation, RootStackParamList, Category } from '../types';
import { useAppLanguage } from '../contexts/LanguageContext';
import { usePhrases } from '../hooks/usePhrases';
import { categories } from '../data/categories'; // ИСПРАВЛЕНО: добавлен импорт categories

type SearchScreenNavigationProp = StackNavigationProp<RootStackParamList, 'PhraseDetail'>;

// Константы для производительности
const SEARCH_ITEM_HEIGHT = 120;
const SEARCH_SEPARATOR_HEIGHT = 12;
const TOTAL_SEARCH_ITEM_HEIGHT = SEARCH_ITEM_HEIGHT + SEARCH_SEPARATOR_HEIGHT;
const SEARCH_DEBOUNCE_MS = 300;

// Простой компонент для подсветки текста
const HighlightedText: React.FC<{
  text: string;
  searchQuery: string;
  style?: any;
  language?: string;
}> = ({ text, searchQuery, style, language }) => {
  if (!searchQuery.trim()) {
    return <Text style={style}>{text}</Text>;
  }

  const regex = new RegExp(`(${searchQuery})`, 'gi');
  const parts = text.split(regex);

  return (
    <Text style={style}>
      {parts.map((part, index) => 
        regex.test(part) ? (
          <Text key={index} style={[style, { backgroundColor: Colors.accent, fontWeight: 'bold' }]}>
            {part}
          </Text>
        ) : (
          <Text key={index}>{part}</Text>
        )
      )}
    </Text>
  );
};

// Мемоизированный компонент результата поиска
const SearchResultItem = React.memo<{
  phrase: PhraseWithTranslation;
  searchQuery: string;
  onPress: (phrase: PhraseWithTranslation) => void;
  config: { mode: 'tk' | 'zh' | 'ru' | 'en' };
  getPhraseTexts: (phrase: PhraseWithTranslation) => { primary: string; learning: string; helper: string };
}>(({ phrase, searchQuery, onPress, config, getPhraseTexts }) => {
  const category = categories.find(cat => cat.id === phrase.categoryId);
  const phraseTexts = getPhraseTexts(phrase);

  const handlePress = useCallback(() => {
    onPress(phrase);
  }, [phrase, onPress]);

  // Мемоизация определения совпадений для индикаторов
  const matchIndicators = useMemo(() => {
    const lowerQuery = searchQuery.toLowerCase();
    const matches = {
      translation: phrase.translation.text.toLowerCase().includes(lowerQuery),
      turkmen: phrase.turkmen.toLowerCase().includes(lowerQuery),
      transcription: phrase.translation.transcription?.toLowerCase().includes(lowerQuery) || false,
    };
    return matches;
  }, [phrase, searchQuery]);

  const categoryName = useMemo(() => {
    if (!category) return '';
    return config.mode === 'tk' ? category.nameTk :
           config.mode === 'zh' ? category.nameZh :
           category.nameRu;
  }, [category, config.mode]);

  return (
    <TouchableOpacity
      style={styles.resultCard}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={styles.resultContent}>
        <View style={styles.resultHeader}>
          <HighlightedText
            text={phrase.chinese}
            searchQuery={searchQuery}
            style={styles.chineseText}
            language="chinese"
          />
          {category && (
            <View style={[styles.categoryBadge, { backgroundColor: category.color }]}>
              <Text style={styles.categoryBadgeIcon}>{category.icon}</Text>
            </View>
          )}
        </View>

        <HighlightedText
          text={phrase.pinyin}
          searchQuery={searchQuery}
          style={styles.pinyinText}
          language="chinese"
        />
        
        <HighlightedText
          text={phraseTexts.primary}
          searchQuery={searchQuery}
          style={[
            styles.primaryText,
            config.mode === 'tk' && styles.turkmenMainText
          ]}
          language={config.mode === 'tk' ? 'turkmen' : 'chinese'}
        />
        
        <HighlightedText
          text={phraseTexts.helper}
          searchQuery={searchQuery}
          style={styles.secondaryText}
          language="russian"
        />

        {category && (
          <Text style={styles.categoryName}>{categoryName}</Text>
        )}
      </View>

      <View style={styles.resultActions}>
        {(matchIndicators.translation || matchIndicators.turkmen || matchIndicators.transcription) && (
          <View style={styles.matchIndicators}>
            {matchIndicators.translation && <View style={[styles.matchDot, { backgroundColor: Colors.primary }]} />}
            {matchIndicators.turkmen && <View style={[styles.matchDot, { backgroundColor: Colors.accent }]} />}
            {matchIndicators.transcription && <View style={[styles.matchDot, { backgroundColor: Colors.warning }]} />}
          </View>
        )}
        <Ionicons name="chevron-forward" size={20} color={Colors.textLight} />
      </View>
    </TouchableOpacity>
  );
});

// Мемоизированный фильтр категорий
const CategoryFilter = React.memo<{
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string | null) => void;
  config: { mode: 'tk' | 'zh' };
}>(({ categories, selectedCategory, onSelectCategory, config }) => {
  const allText = useMemo(() => {
    return config.mode === 'tk' ? 'Hemmesi' : 
           config.mode === 'zh' ? '全部' : 'Все';
  }, [config.mode]);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.categoryFilter}
      contentContainerStyle={styles.categoryFilterContent}
    >
      <TouchableOpacity
        style={[
          styles.filterChip,
          selectedCategory === null && styles.filterChipActive
        ]}
        onPress={() => onSelectCategory(null)}
      >
        <Text style={[
          styles.filterChipText,
          selectedCategory === null && styles.filterChipTextActive
        ]}>
          {allText}
        </Text>
      </TouchableOpacity>
      
      {categories.slice(0, 8).map((category) => {
        const isSelected = selectedCategory === category.id;
        const categoryName = config.mode === 'tk' ? category.nameTk :
                           config.mode === 'zh' ? category.nameZh :
                           category.nameRu;
        
        return (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.filterChip,
              isSelected && styles.filterChipActive,
              { borderColor: category.color }
            ]}
            onPress={() => onSelectCategory(isSelected ? null : category.id)}
          >
            <Text style={styles.filterChipIcon}>{category.icon}</Text>
            <Text style={[
              styles.filterChipText,
              isSelected && styles.filterChipTextActive
            ]}>
              {categoryName.length > 12 ? categoryName.substring(0, 12) + '...' : categoryName}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
});

export default function SearchScreen() {
  const navigation = useNavigation<SearchScreenNavigationProp>();
  const { getTexts, config, getPhraseTexts } = useAppLanguage();
  const { searchPhrases } = usePhrases();

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // UI state
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  const searchInputRef = useRef<TextInput>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Search results using usePhrases
  const searchResults = useMemo(() => {
    if (!debouncedQuery.trim()) return [];
    const results = searchPhrases(debouncedQuery);

    // Filter by category if selected
    if (selectedCategory) {
      return results.filter(phrase => phrase.categoryId === selectedCategory);
    }
    return results;
  }, [debouncedQuery, selectedCategory, searchPhrases]);
  
  const texts = getTexts();

  // Простые заглушки для истории поиска
  const [searchHistory, setSearchHistory] = useState<Array<{query: string; resultsCount: number}>>([]);

  const addToSearchHistory = useCallback((query: string, resultsCount: number) => {
    setSearchHistory(prev => {
      const filtered = prev.filter(item => item.query !== query);
      return [{ query, resultsCount }, ...filtered].slice(0, 5);
    });
  }, []);

  const removeFromSearchHistory = useCallback((query: string) => {
    setSearchHistory(prev => prev.filter(item => item.query !== query));
  }, []);

  const getRecentSearches = useCallback((limit: number) => {
    return searchHistory.slice(0, limit);
  }, [searchHistory]);

  const getPopularSearches = useCallback((limit: number) => {
    return searchHistory
      .sort((a, b) => b.resultsCount - a.resultsCount)
      .slice(0, limit);
  }, [searchHistory]);

  // Дебаунсированный поиск
  const handleSearchChange = useCallback((text: string) => {
    setSearchQuery(text);
    setIsSearching(true);

    // Очищаем предыдущий таймер
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Устанавливаем новый таймер для дебаунса
    searchTimeoutRef.current = setTimeout(() => {
      setDebouncedQuery(text);
      setIsSearching(false);

      // Добавляем в историю только если есть результаты
      if (text.trim().length >= 2 && searchResults.length > 0) {
        addToSearchHistory(text, searchResults.length);
      }
    }, SEARCH_DEBOUNCE_MS);
  }, [searchResults.length, addToSearchHistory]);

  // Мемоизированные обработчики
  const handlePhrasePress = useCallback((phrase: PhraseWithTranslation) => {
    navigation.navigate('PhraseDetail', { phrase });
  }, [navigation]);

  const clearSearchLocal = useCallback(() => {
    setSearchQuery('');
    setDebouncedQuery('');
    setSelectedCategory(null);
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
  }, []);

  const handleHistoryItemPress = useCallback((query: string) => {
    setSearchQuery(query);
    setDebouncedQuery(query);
  }, []);

  const handleRemoveHistoryItem = useCallback((query: string) => {
    removeFromSearchHistory(query);
  }, [removeFromSearchHistory]);

  // Оптимизированная функция рендера результатов
  const renderSearchResult: ListRenderItem<Phrase> = useCallback(({ item }) => (
    <SearchResultItem
      phrase={item}
      searchQuery={debouncedQuery}
      onPress={handlePhrasePress}
      config={config}
      getPhraseTexts={getPhraseTexts}
    />
  ), [debouncedQuery, handlePhrasePress, config, getPhraseTexts]);

  // Оптимизированные функции для FlatList
  const getItemLayout = useCallback((data: any, index: number) => ({
    length: TOTAL_SEARCH_ITEM_HEIGHT,
    offset: TOTAL_SEARCH_ITEM_HEIGHT * index,
    index,
  }), []);

  const keyExtractor = useCallback((item: Phrase) => item.id, []);

  // Мемоизированные данные истории
  const recentSearches = useMemo(() => getRecentSearches(5), [getRecentSearches]);
  const popularSearches = useMemo(() => getPopularSearches(3), [getPopularSearches]);

  // Очистка при размонтировании
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* Заголовок поиска */}
      <View style={styles.searchHeader}>
        <Text style={styles.headerTitle}>
          {config.mode === 'tk' ? '🔍 Sözlem gözle' :
           config.mode === 'zh' ? '🔍 搜索短语' :
           '🔍 Поиск фраз'}
        </Text>
        <Text style={styles.headerSubtitle}>
          {config.mode === 'tk' ? 'Zerur sözlemi islendik dilde tapyň' :
           config.mode === 'zh' ? '用任何语言找到您需要的短语' :
           'Найдите нужную фразу на любом языке'}
        </Text>
      </View>

      {/* Строка поиска */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color={Colors.textLight} style={styles.searchIcon} />
          <TextInput
            ref={searchInputRef}
            style={styles.searchInput}
            placeholder={
              config.mode === 'tk' ? 'Islendik dilde sözlem giriziň...' :
              config.mode === 'zh' ? '输入任何语言的短语...' :
              'Введите фразу на любом языке...'
            }
            placeholderTextColor={Colors.textLight}
            value={searchQuery}
            onChangeText={handleSearchChange}
            autoCorrect={false}
            autoCapitalize="none"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearchLocal} style={styles.clearButton}>
              <Ionicons name="close-circle" size={20} color={Colors.textLight} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Фильтр по категориям */}
      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        config={config}
      />

      {/* Результаты поиска */}
      <View style={styles.resultsContainer}>
        {debouncedQuery.length === 0 ? (
          // История поиска
          <View style={styles.historyContainer}>
            {recentSearches.length > 0 && (
              <>
                <Text style={styles.historyTitle}>
                  {config.mode === 'tk' ? 'Soňky gözlegler' :
                   config.mode === 'zh' ? '最近搜索' :
                   'Недавние поиски'}
                </Text>
                {recentSearches.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.historyItem}
                    onPress={() => handleHistoryItemPress(item.query)}
                  >
                    <Ionicons name="time" size={16} color={Colors.textLight} />
                    <Text style={styles.historyItemText}>{item.query}</Text>
                    <Text style={styles.historyItemCount}>({item.resultsCount})</Text>
                    <TouchableOpacity
                      onPress={() => handleRemoveHistoryItem(item.query)}
                      style={styles.historyItemRemove}
                    >
                      <Ionicons name="close" size={14} color={Colors.textLight} />
                    </TouchableOpacity>
                  </TouchableOpacity>
                ))}
              </>
            )}

            {popularSearches.length > 0 && (
              <>
                <Text style={styles.historyTitle}>
                  {config.mode === 'tk' ? 'Meşhur gözlegler' :
                   config.mode === 'zh' ? '热门搜索' :
                   'Популярные поиски'}
                </Text>
                <View style={styles.popularContainer}>
                  {popularSearches.map((item, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.popularTag}
                      onPress={() => handleHistoryItemPress(item.query)}
                    >
                      <Text style={styles.popularTagText}>{item.query}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            )}

            {recentSearches.length === 0 && popularSearches.length === 0 && (
              <View style={styles.emptyContainer}>
                <Ionicons name="search-outline" size={64} color={Colors.textLight} />
                <Text style={styles.emptyTitle}>
                  {config.mode === 'tk' ? 'Gözleg başlaň' :
                   config.mode === 'zh' ? '开始搜索' :
                   'Начните поиск'}
                </Text>
                <Text style={styles.emptyText}>
                  {config.mode === 'tk' ? 'Söz ýa-da sözlem giriziň\nhytaý, türkmen ýa-da rus dilinde' :
                   config.mode === 'zh' ? '输入单词或短语\n支持中文、土库曼语或俄语' :
                   'Введите слово или фразу\nна китайском, туркменском или русском языке'}
                </Text>
              </View>
            )}
          </View>
        ) : searchResults.length === 0 ? (
          // Нет результатов
          <View style={styles.emptyContainer}>
            <Ionicons name="sad-outline" size={64} color={Colors.textLight} />
            <Text style={styles.emptyTitle}>
              {config.mode === 'tk' ? 'Hiç zat tapylmady' :
               config.mode === 'zh' ? '未找到结果' :
               'Ничего не найдено'}
            </Text>
            <Text style={styles.emptyText}>
              {config.mode === 'tk' ? 'Gözleg sözüni üýtgediň\nýa-da başga söz ulanyň' :
               config.mode === 'zh' ? '尝试更改搜索查询\n或使用其他词语' :
               'Попробуйте изменить поисковый запрос\nили использовать другие слова'}
            </Text>
          </View>
        ) : (
          // Результаты найдены
          <>
            <View style={styles.resultsHeader}>
              <Text style={styles.resultsCount}>
                {config.mode === 'tk' ? 'Tapylan:' :
                 config.mode === 'zh' ? '找到:' :
                 'Найдено:'} {searchResults.length} {
                config.mode === 'tk' ? 'sözlem' :
                config.mode === 'zh' ? '个短语' :
                searchResults.length === 1 ? 'фраза' : 'фраз'
                }
                {selectedCategory && (
                  <Text style={styles.filterInfo}>
                    {' • '}{config.mode === 'tk' ? 'süzgüçli' : config.mode === 'zh' ? '已筛选' : 'отфильтровано'}
                  </Text>
                )}
              </Text>
            </View>

            <FlatList
              data={searchResults}
              renderItem={renderSearchResult}
              keyExtractor={keyExtractor}
              getItemLayout={getItemLayout}
              style={styles.resultsList}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.resultsListContent}
              // Оптимизации производительности
              removeClippedSubviews={true}
              maxToRenderPerBatch={6}
              updateCellsBatchingPeriod={50}
              initialNumToRender={4}
              windowSize={8}
            />
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  searchHeader: {
    padding: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: Colors.textLight,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundLight,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
  },
  clearButton: {
    marginLeft: 8,
  },
  categoryFilter: {
    marginBottom: 16,
  },
  categoryFilterContent: {
    paddingHorizontal: 20,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundLight,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterChipIcon: {
    fontSize: 12,
    marginRight: 6,
  },
  filterChipText: {
    fontSize: 12,
    color: Colors.text,
    fontWeight: '500',
  },
  filterChipTextActive: {
    color: Colors.textWhite,
  },
  resultsContainer: {
    flex: 1,
  },
  resultsHeader: {
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  resultsCount: {
    fontSize: 14,
    color: Colors.textLight,
    fontWeight: '500',
  },
  filterInfo: {
    color: Colors.primary,
  },
  resultsList: {
    flex: 1,
  },
  resultsListContent: {
    paddingHorizontal: 20,
  },
  resultCard: {
    height: SEARCH_ITEM_HEIGHT, // Фиксированная высота для getItemLayout
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: SEARCH_SEPARATOR_HEIGHT,
    flexDirection: 'row',
    alignItems: 'flex-start',
    elevation: 2,
    shadowColor: Colors.cardShadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  resultContent: {
    flex: 1,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  chineseText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    flex: 1,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  categoryBadgeIcon: {
    fontSize: 12,
    color: Colors.textWhite,
  },
  pinyinText: {
    fontSize: 14,
    color: Colors.primary,
    fontStyle: 'italic',
    marginBottom: 4,
  },
  primaryText: {
    fontSize: 17,
    color: Colors.text,
    fontWeight: '600',
    marginBottom: 4,
  },
  turkmenMainText: {
    fontSize: 19,
    fontWeight: '700',
    marginBottom: 6,
  },
  secondaryText: {
    fontSize: 13,
    color: Colors.textLight,
    opacity: 0.8,
    marginBottom: 4,
  },
  categoryName: {
    fontSize: 11,
    color: Colors.textLight,
    fontStyle: 'italic',
  },
  resultActions: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  matchIndicators: {
    flexDirection: 'row',
    marginBottom: 8,
    gap: 4,
  },
  matchDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  historyContainer: {
    flex: 1,
    padding: 20,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
    marginTop: 20,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  historyItemText: {
    flex: 1,
    fontSize: 14,
    color: Colors.text,
    marginLeft: 8,
  },
  historyItemCount: {
    fontSize: 12,
    color: Colors.textLight,
    marginRight: 8,
  },
  historyItemRemove: {
    padding: 4,
  },
  popularContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  popularTag: {
    backgroundColor: Colors.primary + '20',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  popularTagText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.textLight,
    textAlign: 'center',
    lineHeight: 22,
  },
});