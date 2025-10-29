// src/screens/AdvancedSearchScreen.tsx - ПОЛНАЯ ИСПРАВЛЕННАЯ ВЕРСИЯ

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
  Modal,
  Animated,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

import { Colors } from '../constants/Colors';
import { PhraseWithTranslation, RootStackParamList } from '../types';
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
          <Text key={index} style={[style, { backgroundColor: Colors.accent + '40', fontWeight: 'bold' }]}>
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
      <Text style={styles.filtersTitle}>Фильтры активны</Text>
      <TouchableOpacity onPress={onClearFilters} style={styles.clearFiltersButton}>
        <Text style={styles.clearFiltersText}>Очистить</Text>
      </TouchableOpacity>
    </View>
  );
};

// Простой компонент подсказок
const SearchSuggestions: React.FC<{
  suggestions: string[];
  onSuggestionPress: (suggestion: string) => void;
  currentQuery: string;
  isVisible: boolean;
}> = ({ suggestions, onSuggestionPress, currentQuery, isVisible }) => {
  if (!isVisible || suggestions.length === 0) return null;

  return (
    <View style={styles.suggestionsContainer}>
      {suggestions.map((suggestion, index) => (
        <TouchableOpacity
          key={index}
          style={styles.suggestionItem}
          onPress={() => onSuggestionPress(suggestion)}
        >
          <Ionicons name="search" size={16} color={Colors.textLight} />
          <HighlightedText
            text={suggestion}
            highlight={currentQuery}
            style={styles.suggestionText}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};

// Кнопка голосового поиска
const VoiceSearchButton: React.FC<{ onPress: () => void; isListening: boolean }> = ({ 
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
  const [personalizedRecommendations, setPersonalizedRecommendations] = useState<PhraseWithTranslation[]>([]);
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
    const texts: Record<'tk' | 'zh' | 'ru' | 'en' | 'tr' | 'de' | 'fr' | 'es' | 'it' | 'pt' | 'nl' | 'pl' | 'uk', Record<TextKey, string>> = {
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
      },
      en: {
        searchPlaceholder: 'Search...',
        searchResults: 'Search Results',
        noResults: 'No results found',
        suggestions: 'Suggestions',
        filters: 'Filters',
        clearFilters: 'Clear',
        voiceSearch: 'Voice Search',
      },
      tr: {
        searchPlaceholder: 'Ara...',
        searchResults: 'Arama Sonuçları',
        noResults: 'Sonuç bulunamadı',
        suggestions: 'Öneriler',
        filters: 'Filtreler',
        clearFilters: 'Temizle',
        voiceSearch: 'Sesli Arama',
      },
      de: {
        searchPlaceholder: 'Suchen...',
        searchResults: 'Suchergebnisse',
        noResults: 'Keine Ergebnisse gefunden',
        suggestions: 'Vorschläge',
        filters: 'Filter',
        clearFilters: 'Löschen',
        voiceSearch: 'Sprachsuche',
      },
      fr: {
        searchPlaceholder: 'Rechercher...',
        searchResults: 'Résultats de recherche',
        noResults: 'Aucun résultat trouvé',
        suggestions: 'Suggestions',
        filters: 'Filtres',
        clearFilters: 'Effacer',
        voiceSearch: 'Recherche vocale',
      },
      es: {
        searchPlaceholder: 'Buscar...',
        searchResults: 'Resultados de búsqueda',
        noResults: 'No se encontraron resultados',
        suggestions: 'Sugerencias',
        filters: 'Filtros',
        clearFilters: 'Limpiar',
        voiceSearch: 'Búsqueda por voz',
      },
      it: {
        searchPlaceholder: 'Cerca...',
        searchResults: 'Risultati della ricerca',
        noResults: 'Nessun risultato trovato',
        suggestions: 'Suggerimenti',
        filters: 'Filtri',
        clearFilters: 'Cancella',
        voiceSearch: 'Ricerca vocale',
      },
      pt: {
        searchPlaceholder: 'Pesquisar...',
        searchResults: 'Resultados da pesquisa',
        noResults: 'Nenhum resultado encontrado',
        suggestions: 'Sugestões',
        filters: 'Filtros',
        clearFilters: 'Limpar',
        voiceSearch: 'Pesquisa por voz',
      },
      nl: {
        searchPlaceholder: 'Zoeken...',
        searchResults: 'Zoekresultaten',
        noResults: 'Geen resultaten gevonden',
        suggestions: 'Suggesties',
        filters: 'Filters',
        clearFilters: 'Wissen',
        voiceSearch: 'Spraakzoeken',
      },
      pl: {
        searchPlaceholder: 'Szukaj...',
        searchResults: 'Wyniki wyszukiwania',
        noResults: 'Nie znaleziono wyników',
        suggestions: 'Sugestie',
        filters: 'Filtry',
        clearFilters: 'Wyczyść',
        voiceSearch: 'Wyszukiwanie głosowe',
      },
      uk: {
        searchPlaceholder: 'Пошук...',
        searchResults: 'Результати пошуку',
        noResults: 'Результатів не знайдено',
        suggestions: 'Пропозиції',
        filters: 'Фільтри',
        clearFilters: 'Очистити',
        voiceSearch: 'Голосовий пошук',
      },
    };

    return texts[config.mode]?.[key] || texts.en[key];
  }, [config.mode]);

  /**
   * Handle search input change with debounce
   */
  const handleSearchChange = useCallback((text: string) => {
    setSearchQuery(text);
    
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    
    debounceTimeoutRef.current = setTimeout(() => {
      if (text.trim().length >= 2) {
        performSearch(text, activeFilters);
      } else if (text.trim().length === 0) {
        clearSearch();
      }
    }, 300);
  }, [activeFilters, performSearch, clearSearch, setSearchQuery]);

  /**
   * Handle clear search
   */
  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
    clearSearch();
    setActiveFilters({});
    setShowSuggestions(false);
    searchInputRef.current?.focus();
  }, [setSearchQuery, clearSearch]);

  /**
   * Handle filters change
   */
  const handleFiltersChange = useCallback((newFilters: any) => {
    setActiveFilters(newFilters);
    if (searchQuery.trim()) {
      performSearch(searchQuery, newFilters);
    }
  }, [searchQuery, performSearch]);

  /**
   * Clear all filters
   */
  const clearAllFilters = useCallback(() => {
    setActiveFilters({});
    if (searchQuery.trim()) {
      performSearch(searchQuery, {});
    }
  }, [searchQuery, performSearch]);

  /**
   * Handle suggestion press
   */
  const handleSuggestionPress = useCallback((suggestion: string) => {
    setSearchQuery(suggestion);
    performSearch(suggestion, activeFilters);
    setShowSuggestions(false);
    Keyboard.dismiss();
  }, [activeFilters, performSearch, setSearchQuery]);

  /**
   * Handle voice search
   */
  const handleVoiceSearch = useCallback(() => {
    setShowVoiceSearch(!showVoiceSearch);
  }, [showVoiceSearch]);

  /**
   * Handle phrase press
   */
  const handlePhrasePress = useCallback((phrase: PhraseWithTranslation) => {
    navigation.navigate('PhraseDetail', { phrase });
  }, [navigation]);

  /**
   * Render search result item
   */
  const renderSearchResult = useCallback(({ item }: { item: PhraseWithTranslation }) => {
    const categoryName = config.mode === 'tk' ? 
      categories.find(c => c.id === item.categoryId)?.nameTk :
      config.mode === 'zh' ?
      categories.find(c => c.id === item.categoryId)?.nameZh :
      categories.find(c => c.id === item.categoryId)?.nameRu || '';

    return (
      <TouchableOpacity
        style={styles.resultItem}
        onPress={() => handlePhrasePress(item)}
        activeOpacity={0.7}
      >
        <View style={styles.resultContent}>
          <HighlightedText
            text={item.translation.text}
            highlight={searchQuery}
            style={styles.resultChinese}
          />
          {item.translation.transcription && (
            <Text style={styles.resultPinyin}>{item.translation.transcription}</Text>
          )}
          <HighlightedText
            text={item.turkmen}
            highlight={searchQuery}
            style={styles.resultTranslation}
          />
          {categoryName && (
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryBadgeText}>{categoryName}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  }, [searchQuery, handlePhrasePress, config.mode]);

  /**
   * Render empty state - ИСПРАВЛЕННАЯ ВЕРСИЯ С МНОГОЯЗЫЧНОСТЬЮ
   */
  const renderEmptyState = useCallback(() => {
    if (isSearching) {
      return (
        <View style={styles.emptyState}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.emptyStateText}>
            {config.mode === 'tk' ? 'Gözlenýär...' :
             config.mode === 'zh' ? '搜索中...' :
             'Поиск...'}
          </Text>
        </View>
      );
    }

    if (searchQuery.trim() && searchResults.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Ionicons name="search" size={64} color={Colors.textLight} />
          <Text style={styles.emptyStateText}>{getText('noResults')}</Text>
          <Text style={styles.emptyStateSubtext}>
            {config.mode === 'tk' ? 'Gözleg sözüni üýtgediň ýa-da süzgüçleri arassalaň' :
             config.mode === 'zh' ? '尝试更改查询或清除筛选' :
             'Попробуйте изменить запрос или очистить фильтры'}
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.emptyState}>
        <Ionicons name="book" size={64} color={Colors.textLight} />
        <Text style={styles.emptyStateText}>
          {config.mode === 'tk' ? 'Gözleg sözlemini giriziň' :
           config.mode === 'zh' ? '输入搜索查询' :
           'Введите поисковый запрос'}
        </Text>
        <Text style={styles.emptyStateSubtext}>
          {config.mode === 'tk' ? 'Hytaý, rus ýa-da türkmen dilinde zerur sözlemi tapyň' :
           config.mode === 'zh' ? '按中文、俄文或土库曼文查找所需短语' :
           'Найдите нужные фразы по китайскому, русскому или туркменскому тексту'}
        </Text>
      </View>
    );
  }, [isSearching, searchQuery, searchResults.length, getText, config.mode]);

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  /**
   * Focus search input on mount
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      searchInputRef.current?.focus();
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>
              {config.mode === 'tk' ? 'Gözleg' :
               config.mode === 'zh' ? '搜索' :
               'Поиск'}
            </Text>
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
            suggestions={suggestions.map(s => typeof s === 'string' ? s : (s as any).text || String(s))}
            onSuggestionPress={handleSuggestionPress}
            currentQuery={searchQuery}
            isVisible={showSuggestions}
          />
        )}

        {/* Main Content */}
        <View style={styles.mainContent}>
          {searchResults.length > 0 ? (
            <FlatList
              data={searchResults.map(result => (result.phrase || result) as any as PhraseWithTranslation)}
              renderItem={renderSearchResult}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.resultsList}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            renderEmptyState()
          )}
        </View>
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
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  voiceButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: Colors.background,
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
    fontSize: 16,
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
    fontSize: 14,
    color: Colors.textLight,
  },
  clearFiltersButton: {
    padding: 4,
  },
  clearFiltersText: {
    fontSize: 14,
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
    fontSize: 16,
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
    marginBottom: 12,
    elevation: 2,
    shadowColor: Colors.cardShadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  resultContent: {
    gap: 4,
  },
  resultChinese: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
  },
  resultPinyin: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  resultTranslation: {
    fontSize: 16,
    color: Colors.text,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.primary + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginTop: 4,
  },
  categoryBadgeText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginTop: 16,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: Colors.textLight,
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
  },
});