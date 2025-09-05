// src/screens/AdvancedSearchScreen.tsx - ИСПРАВЛЕННАЯ ВЕРСИЯ

import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  FlatList,
  TouchableOpacity,
  ScrollView,
  ListRenderItem,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Modal,
  Animated,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

import { Colors } from '../constants/Colors';
import { TextStyles } from '../constants/Typography'; // ИСПРАВЛЕНО
import { SearchResult } from '../utils/SearchEngine';
import { Phrase, RootStackParamList } from '../types';
import { useAppLanguage } from '../contexts/LanguageContext';
import { useAdvancedSearch } from '../hooks/useAdvancedSearch';
import { useAnimations } from '../hooks/useAnimations';
import { categories } from '../data/categories';

// Простые компоненты для замены отсутствующих
const HighlightedText: React.FC<{ text: string; highlight: string; style?: any }> = ({ 
  text, 
  highlight, 
  style 
}) => {
  if (!highlight.trim()) {
    return <Text style={style}>{text}</Text>;
  }

  const regex = new RegExp(`(${highlight})`, 'gi');
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

// Простой компонент фильтров
const SearchFilters: React.FC<{
  filters: any;
  onFiltersChange: (filters: any) => void;
  onClearFilters: () => void;
  resultCount?: number;
}> = ({ filters, onFiltersChange, onClearFilters, resultCount }) => {
  return (
    <View style={styles.filtersContainer}>
      <Text style={styles.filtersTitle}>Фильтры ({resultCount || 0} результатов)</Text>
      <TouchableOpacity onPress={onClearFilters} style={styles.clearFiltersButton}>
        <Text style={styles.clearFiltersText}>Очистить</Text>
      </TouchableOpacity>
    </View>
  );
};

// Простой компонент предложений
const SearchSuggestions: React.FC<{
  suggestions: any[];
  onSuggestionPress: (suggestion: string) => void;
  currentQuery: string;
  isVisible: boolean;
}> = ({ suggestions, onSuggestionPress, currentQuery, isVisible }) => {
  if (!isVisible || suggestions.length === 0) return null;

  return (
    <View style={styles.suggestionsContainer}>
      {suggestions.slice(0, 3).map((suggestion, index) => (
        <TouchableOpacity
          key={index}
          style={styles.suggestionItem}
          onPress={() => onSuggestionPress(suggestion.text || suggestion)}
        >
          <Ionicons name="search" size={16} color={Colors.textLight} />
          <Text style={styles.suggestionText}>{suggestion.text || suggestion}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

// Простой компонент голосового поиска
const VoiceSearchButton: React.FC<{ onPress: () => void; isListening?: boolean }> = ({ 
  onPress, 
  isListening 
}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.voiceButton}>
      <Ionicons 
        name={isListening ? "mic" : "mic-outline"} 
        size={24} 
        color={isListening ? Colors.accent : Colors.textLight} 
      />
    </TouchableOpacity>
  );
};

type SearchScreenNavigationProp = StackNavigationProp<RootStackParamList, 'PhraseDetail'>;

export default function AdvancedSearchScreen() {
  const navigation = useNavigation<SearchScreenNavigationProp>();
  const { config, getPhraseTexts } = useAppLanguage();
  
  // Advanced search integration - ИСПРАВЛЕНО: используем только существующие методы
  const {
    searchQuery,
    setSearchQuery,
    searchResults,
    suggestions,
    isSearching,
    performSearch,
    clearSearch,
  } = useAdvancedSearch();
  
  // UI state
  const [showVoiceSearch, setShowVoiceSearch] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [personalizedRecommendations, setPersonalizedRecommendations] = useState<Phrase[]>([]);
  const [activeFilters, setActiveFilters] = useState<any>({});
  
  const searchInputRef = useRef<TextInput>(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { fadeAnim } = useAnimations();

  /**
   * Get localized text
   */
  type TextKey =
    | 'searchPlaceholder'
    | 'searchResults'
    | 'noResults'
    | 'suggestions'
    | 'filters'
    | 'clearFilters'
    | 'voiceSearch';

  const getText = useCallback((key: TextKey) => {
    const texts: Record<'tk' | 'zh' | 'ru', Record<TextKey, string>> = {
      tk: {
        searchPlaceholder: 'Gözleg...',
        searchResults: 'Netijeler',
        noResults: 'Netije tapylmady',
        suggestions: 'Teklipler',
        filters: 'Süzgüçler',
        clearFilters: 'Arassala',
        voiceSearch: 'Ses arkaly gözleg',
      },
      zh: {
        searchPlaceholder: '搜索...',
        searchResults: '搜索结果',
        noResults: '未找到结果',
        suggestions: '建议',
        filters: '筛选',
        clearFilters: '清除',
        voiceSearch: '语音搜索',
      },
      ru: {
        searchPlaceholder: 'Поиск...',
        searchResults: 'Результаты поиска',
        noResults: 'Результатов не найдено',
        suggestions: 'Предложения',
        filters: 'Фильтры',
        clearFilters: 'Очистить',
        voiceSearch: 'Голосовой поиск',
      }
    };

    return texts[config.mode]?.[key] || texts.ru[key] || key;
  }, [config.mode]);

  /**
   * Handle search input changes with debouncing
   */
  const handleSearchChange = useCallback((text: string) => {
    setSearchQuery(text);
    
    // Clear previous timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    
    // Set new timeout for search
    debounceTimeoutRef.current = setTimeout(() => {
      if (text.trim().length >= 2) {
        performSearch(text, activeFilters);
        setShowSuggestions(true);
      } else {
        clearSearch();
        setShowSuggestions(false);
      }
    }, 300);
  }, [setSearchQuery, performSearch, clearSearch, activeFilters]);

  /**
   * Handle suggestion selection
   */
  const handleSuggestionPress = useCallback((suggestionText: string) => {
    setSearchQuery(suggestionText);
    performSearch(suggestionText, activeFilters);
    setShowSuggestions(false);
    searchInputRef.current?.blur();
  }, [setSearchQuery, performSearch, activeFilters]);

  /**
   * Handle voice search
   */
  const handleVoiceSearch = useCallback(() => {
    setShowVoiceSearch(true);
    // В реальном приложении здесь была бы интеграция с голосовым поиском
    setTimeout(() => {
      setShowVoiceSearch(false);
      // Имитируем результат голосового поиска
      const mockVoiceResult = "你好";
      setSearchQuery(mockVoiceResult);
      performSearch(mockVoiceResult, activeFilters);
    }, 2000);
  }, [setSearchQuery, performSearch, activeFilters]);

  /**
   * Handle filters change
   */
  const handleFiltersChange = useCallback((newFilters: any) => {
    setActiveFilters(newFilters);
    
    // Re-search with new filters if we have a query
    if (searchQuery.trim().length >= 2) {
      performSearch(searchQuery, newFilters);
    }
  }, [searchQuery, performSearch]);

  /**
   * Handle phrase selection
   */
  const handlePhrasePress = useCallback((phrase: Phrase) => {
    navigation.navigate('PhraseDetail', { phrase });
  }, [navigation]);

  /**
   * Clear all search state
   */
  const handleClearSearch = useCallback(() => {
    clearSearch();
    setActiveFilters({});
    setShowSuggestions(false);
    setShowVoiceSearch(false);
  }, [clearSearch]);

  /**
   * Clear all filters
   */
  const clearAllFilters = useCallback(() => {
    setActiveFilters({});
    if (searchQuery.trim().length >= 2) {
      performSearch(searchQuery, {});
    }
  }, [searchQuery, performSearch]);

  /**
   * Keyboard visibility handling - ИСПРАВЛЕНО: завершен код
   */
  useEffect(() => {
    const keyboardDidShow = () => setIsKeyboardVisible(true);
    const keyboardDidHide = () => setIsKeyboardVisible(false);

    const showListener = Keyboard.addListener('keyboardDidShow', keyboardDidShow);
    const hideListener = Keyboard.addListener('keyboardDidHide', keyboardDidHide);

    return () => {
      showListener.remove();
      hideListener.remove(); // ИСПРАВЛЕНО: завершен вызов
    };
  }, []);

  /**
   * Cleanup debounce timeout
   */
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  /**
   * Render search result item
   */
  const renderSearchResult: ListRenderItem<SearchResult> = useCallback(({ item }) => {
    const phrase = item.phrase;
    const phraseTexts = getPhraseTexts(phrase);
    const category = categories.find(cat => cat.id === phrase.categoryId);

    return (
      <TouchableOpacity
        style={styles.resultItem}
        onPress={() => handlePhrasePress(phrase)}
      >
        <View style={styles.resultContent}>
          <View style={styles.resultHeader}>
            <HighlightedText
              text={phraseTexts.primary}
              highlight={searchQuery}
              style={styles.resultPrimary}
            />
            {/* Remove or replace with correct property if available */}
            {/* <Text style={styles.resultScore}>{Math.round(item.matchScore * 100)}%</Text> */}
          </View>
          
          <HighlightedText
            text={phraseTexts.learning}
            highlight={searchQuery}
            style={styles.resultLearning}
          />
          
          <Text style={styles.resultHelper}>{phraseTexts.helper}</Text>
          
          {category && (
            <View style={styles.resultCategory}>
              <Text style={styles.categoryName}>
                {config.mode === 'tk' ? category.nameTk :
                 config.mode === 'zh' ? category.nameZh :
                 category.nameRu}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  }, [getPhraseTexts, searchQuery, handlePhrasePress, config.mode]);

  /**
   * Render empty state
   */
  const renderEmptyState = useCallback(() => {
    if (isSearching) {
      return (
        <View style={styles.emptyState}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.emptyStateText}>Поиск...</Text>
        </View>
      );
    }

    if (searchQuery.trim() && searchResults.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Ionicons name="search" size={64} color={Colors.textLight} />
          <Text style={styles.emptyStateText}>{getText('noResults')}</Text>
          <Text style={styles.emptyStateSubtext}>
            Попробуйте изменить запрос или очистить фильтры
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.emptyState}>
        <Ionicons name="book" size={64} color={Colors.textLight} />
        <Text style={styles.emptyStateText}>Введите поисковый запрос</Text>
        <Text style={styles.emptyStateSubtext}>
          Найдите нужные фразы по китайскому, русскому или туркменскому тексту
        </Text>
      </View>
    );
  }, [isSearching, searchQuery, searchResults.length, getText]);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Поиск</Text>
            <View style={styles.headerActions}>
              <VoiceSearchButton 
                onPress={handleVoiceSearch}
                isListening={showVoiceSearch}
              />
              <TouchableOpacity 
                onPress={() => setShowFilters(!showFilters)}
                style={[
                  styles.filterButton,
                  Object.keys(activeFilters).length > 0 && styles.filterButtonActive
                ]}
              >
                <Ionicons 
                  name="filter" 
                  size={24} 
                  color={Object.keys(activeFilters).length > 0 ? Colors.textWhite : Colors.primary} 
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Search Input */}
        <View style={styles.searchInputSection}>
          <View style={styles.searchInputContainer}>
            <Ionicons name="search" size={20} color={Colors.textLight} style={styles.searchIcon} />
            <TextInput
              ref={searchInputRef}
              style={styles.searchInput}
              placeholder={getText('searchPlaceholder')}
              placeholderTextColor={Colors.textLight}
              value={searchQuery}
              onChangeText={handleSearchChange}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
              autoCorrect={false}
              autoCapitalize="none"
              returnKeyType="search"
              onSubmitEditing={() => searchQuery && performSearch(searchQuery, activeFilters)}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={handleClearSearch} style={styles.clearButton}>
                <Ionicons name="close-circle" size={20} color={Colors.textLight} />
              </TouchableOpacity>
            )}
          </View>

          {/* Loading indicator */}
          {isSearching && (
            <View style={styles.loadingContainer}>
              <Animated.View style={[styles.loadingBar, { opacity: fadeAnim }]} />
            </View>
          )}
        </View>

        {/* Advanced Filters */}
        {showFilters && (
          <SearchFilters
            filters={activeFilters}
            onFiltersChange={handleFiltersChange}
            onClearFilters={clearAllFilters}
            resultCount={searchResults.length}
          />
        )}

        {/* Search Suggestions */}
        {showSuggestions && suggestions.length > 0 && (
          <SearchSuggestions
            suggestions={suggestions}
            onSuggestionPress={handleSuggestionPress}
            currentQuery={searchQuery}
            isVisible={showSuggestions}
          />
        )}

        {/* Main Content */}
        <View style={styles.mainContent}>
          {searchResults.length > 0 ? (
            <FlatList
              data={searchResults}
              renderItem={renderSearchResult}
              keyExtractor={(item) => item.phrase.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.resultsList}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          ) : (
            renderEmptyState()
          )}
        </View>

        {/* Voice Search Modal */}
        <Modal
          visible={showVoiceSearch}
          transparent
          animationType="fade"
        >
          <View style={styles.voiceModalOverlay}>
            <View style={styles.voiceModalContent}>
              <Animated.View style={[styles.micContainer, { opacity: fadeAnim }]}>
                <Ionicons name="mic" size={64} color={Colors.primary} />
              </Animated.View>
              <Text style={styles.voiceModalText}>Говорите...</Text>
              <TouchableOpacity
                onPress={() => setShowVoiceSearch(false)}
                style={styles.voiceModalClose}
              >
                <Text style={styles.voiceModalCloseText}>Отмена</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    backgroundColor: Colors.textWhite,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    ...TextStyles.h1,
    color: Colors.text,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  voiceButton: {
    padding: 8,
  },
  filterButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: Colors.background,
  },
  filterButtonActive: {
    backgroundColor: Colors.primary,
  },
  searchInputSection: {
    backgroundColor: Colors.textWhite,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    ...TextStyles.body,
    color: Colors.text,
    paddingVertical: 4,
  },
  clearButton: {
    padding: 4,
  },
  loadingContainer: {
    height: 2,
    backgroundColor: Colors.cardBorder,
    marginTop: 8,
    borderRadius: 1,
    overflow: 'hidden',
  },
  loadingBar: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 1,
  },
  filtersContainer: {
    backgroundColor: Colors.textWhite,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  filtersTitle: {
    ...TextStyles.caption,
    color: Colors.textLight,
  },
  clearFiltersButton: {
    padding: 4,
  },
  clearFiltersText: {
    ...TextStyles.caption,
    color: Colors.primary,
  },
  suggestionsContainer: {
    backgroundColor: Colors.textWhite,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  suggestionText: {
    ...TextStyles.body,
    color: Colors.text,
  },
  mainContent: {
    flex: 1,
  },
  resultsList: {
    padding: 16,
  },
  resultItem: {
    backgroundColor: Colors.textWhite,
    borderRadius: 12,
    padding: 16,
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  resultContent: {
    gap: 8,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  resultPrimary: {
    ...TextStyles.body,
    color: Colors.text,
    flex: 1,
  },
  resultScore: {
    ...TextStyles.caption,
    color: Colors.textLight,
    marginLeft: 8,
  },
  resultLearning: {
    ...TextStyles.body,
    color: Colors.primary,
  },
  resultHelper: {
    ...TextStyles.caption,
    color: Colors.textLight,
  },
  resultCategory: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.background,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  categoryName: {
    ...TextStyles.caption,
    color: Colors.textLight,
  },
  separator: {
    height: 12,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyStateText: {
    ...TextStyles.body,
    color: Colors.textLight,
    marginTop: 16,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    ...TextStyles.body,
    color: Colors.textLight,
    marginTop: 8,
    textAlign: 'center',
  },
  voiceModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  voiceModalContent: {
    backgroundColor: Colors.textWhite,
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    minWidth: 200,
  },
  micContainer: {
    padding: 16,
  },
  voiceModalText: {
    ...TextStyles.body,
    color: Colors.text,
    marginTop: 16,
  },
  voiceModalClose: {
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  voiceModalCloseText: {
    ...TextStyles.body,
    color: Colors.primary,
  },
});