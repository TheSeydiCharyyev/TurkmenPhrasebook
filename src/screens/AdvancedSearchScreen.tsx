// src/screens/AdvancedSearchScreen.tsx - Day 18 Complete Advanced Search Implementation

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
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

import { Colors } from '../constants/Colors';
import { Typography } from '../constants/Typography';
import { SearchResult } from '../utils/SearchEngine';
import { Phrase, RootStackParamList } from '../types';
import { useAppLanguage } from '../contexts/LanguageContext';
import { useAdvancedSearch, SearchSuggestion } from '../hooks/useAdvancedSearch';
import { useSearchFilters } from '../hooks/useAdvancedSearch';
import { useAnimations } from '../hooks/useAnimations';
import { categories } from '../data/categories';
import HighlightedText from '../components/HighlightedText';
import VoiceSearch, { VoiceSearchButton } from '../components/VoiceSearch';
import SearchFilters, { FilterOptions } from '../components/SearchFilters';
import SearchSuggestions from '../components/SearchSuggestions';

type SearchScreenNavigationProp = StackNavigationProp<RootStackParamList, 'PhraseDetail'>;

export default function AdvancedSearchScreen() {
  const navigation = useNavigation<SearchScreenNavigationProp>();
  const { config, getPhraseTexts } = useAppLanguage();
  
  // Advanced search integration
  const {
    searchQuery,
    setSearchQuery,
    searchResults,
    suggestions,
    isSearching,
    performSearch,
    clearSearch,
    updateSearchOptions,
    getPersonalizedRecommendations,
  } = useAdvancedSearch();
  
  // Filter management
  const {
    activeFilters,
    applyFilter,
    clearAllFilters,
    hasActiveFilters,
  } = useSearchFilters();
  
  // UI state
  const [showVoiceSearch, setShowVoiceSearch] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [personalizedRecommendations, setPersonalizedRecommendations] = useState<Phrase[]>([]);
  
  const searchInputRef = useRef<TextInput>(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { fadeAnimation, createFadeAnimation } = useAnimations();

  /**
   * Get localized text
   */
  const getText = useCallback((key: string) => {
    const texts = {
      tk: {
        searchPlaceholder: 'Islendik dilde sözlem giriziň...',
        voiceSearch: 'Ses bilen gözlemek',
        filters: 'Süzgüçler',
        suggestions: 'Tekliplar',
        found: 'Tapylan',
        phrases: 'sözlem',
        noResults: 'Hiç zat tapylmady',
        tryAgain: 'Başga söz ulanyň',
        recommendations: 'Siziň üçin tekliplar',
        recentSearches: 'Soňky gözlegler',
        clearFilters: 'Süzgüçleri arassala',
        searchByVoice: 'Ses bilen gözle',
      },
      zh: {
        searchPlaceholder: '输入任何语言的短语...',
        voiceSearch: '语音搜索',
        filters: '筛选器',
        suggestions: '建议',
        found: '找到',
        phrases: '个短语',
        noResults: '未找到结果',
        tryAgain: '尝试其他词语',
        recommendations: '为您推荐',
        recentSearches: '最近搜索',
        clearFilters: '清除筛选',
        searchByVoice: '语音搜索',
      },
      ru: {
        searchPlaceholder: 'Введите фразу на любом языке...',
        voiceSearch: 'Голосовой поиск',
        filters: 'Фильтры',
        suggestions: 'Предложения',
        found: 'Найдено',
        phrases: 'фраз',
        noResults: 'Ничего не найдено',
        tryAgain: 'Попробуйте другие слова',
        recommendations: 'Рекомендации для вас',
        recentSearches: 'Недавние поиски',
        clearFilters: 'Очистить фильтры',
        searchByVoice: 'Голосовой поиск',
      }
    };
    
    const lang = config.mode === 'tk' ? 'tk' : config.mode === 'zh' ? 'zh' : 'ru';
    return texts[lang][key] || key;
  }, [config.mode]);

  /**
   * Handle search input changes with debouncing
   */
  const handleSearchChange = useCallback((text: string) => {
    setSearchQuery(text);
    setShowSuggestions(text.length >= 2);

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(async () => {
      if (text.trim().length >= 2) {
        const searchOptions: any = {
          categoryFilter: activeFilters.category,
          difficultyFilter: activeFilters.difficulty,
          sortBy: activeFilters.sortBy,
          semanticBoost: true,
          personalizedBoost: true,
          contextualSearch: true,
        };
        
        await performSearch(text, searchOptions);
      }
    }, SEARCH_DEBOUNCE_MS);
  }, [performSearch, activeFilters]);

  /**
   * Handle voice search result
   */
  const handleVoiceResult = useCallback((voiceText: string) => {
    setSearchQuery(voiceText);
    setShowVoiceSearch(false);
    handleSearchChange(voiceText);
  }, [handleSearchChange]);

  /**
   * Handle suggestion selection
   */
  const handleSuggestionPress = useCallback((suggestionText: string) => {
    setSearchQuery(suggestionText);
    setShowSuggestions(false);
    handleSearchChange(suggestionText);
    searchInputRef.current?.blur();
  }, [handleSearchChange]);

  /**
   * Handle filter changes
   */
  const handleFiltersChange = useCallback((newFilters: FilterOptions) => {
    updateSearchOptions({
      categoryFilter: newFilters.category,
      languageBoost: newFilters.languageBoost,
      fuzzyThreshold: newFilters.fuzzyThreshold || 0.7,
    });
    
    // Re-search with new filters if we have a query
    if (searchQuery.trim().length >= 2) {
      const searchOptions: any = {
        ...newFilters,
        semanticBoost: true,
        personalizedBoost: true,
        contextualSearch: true,
      };
      performSearch(searchQuery, searchOptions);
    }
  }, [searchQuery, performSearch, updateSearchOptions]);

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
    clearAllFilters();
    setShowSuggestions(false);
    setShowVoiceSearch(false);
  }, [clearSearch, clearAllFilters]);

  /**
   * Load personalized recommendations
   */
  useEffect(() => {
    const loadRecommendations = async () => {
      const recommendations = getPersonalizedRecommendations(5);
      setPersonalizedRecommendations(recommendations);
    };
    loadRecommendations();
  }, [getPersonalizedRecommendations]);

  /**
   * Keyboard visibility handling
   */
  useEffect(() => {
    const keyboardDidShow = () => setIsKeyboardVisible(true);
    const keyboardDidHide = () => setIsKeyboardVisible(false);

    const showListener = Keyboard.addListener('keyboardDidShow', keyboardDidShow);
    const hideListener = Keyboard.addListener('keyboardDidHide', keyboardDidHide);

    return () => {
      showListener.remove();
      hideListener.remove();
    };
  }, []);

  /**
   * Render search result item
   */
  const renderSearchResult: ListRenderItem<SearchResult> = useCallback(({ item }) => {
    const { phrase, relevanceScore, matchedFields } = item;
    const category = categories.find(cat => cat.id === phrase.categoryId);
    const phraseTexts = getPhraseTexts(phrase);

    return (
      <TouchableOpacity
        style={styles.resultCard}
        onPress={() => handlePhrasePress(phrase)}
        activeOpacity={0.7}
      >
        <View style={styles.resultContent}>
          {/* Header with Chinese text and category */}
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

          {/* Pinyin */}
          <HighlightedText
            text={phrase.pinyin}
            searchQuery={searchQuery}
            style={styles.pinyinText}
            language="chinese"
          />

          {/* Primary language text */}
          <HighlightedText
            text={phraseTexts.primary}
            searchQuery={searchQuery}
            style={[
              styles.primaryText,
              config.mode === 'tk' && styles.turkmenMainText
            ]}
            language={config.mode === 'tk' ? 'turkmen' : 'russian'}
          />

          {/* Helper text */}
          <HighlightedText
            text={phraseTexts.helper}
            searchQuery={searchQuery}
            style={styles.secondaryText}
            language="russian"
          />

          {/* Match indicators */}
          <View style={styles.resultFooter}>
            <View style={styles.matchTypes}>
              {matchedFields.map((field, index) => (
                <View key={index} style={[styles.matchTag, getMatchTagStyle(field)]}>
                  <Text style={styles.matchTagText}>
                    {getMatchFieldLabel(field)}
                  </Text>
                </View>
              ))}
            </View>
            
            <Text style={styles.relevanceScore}>
              {Math.round(relevanceScore)}%
            </Text>
          </View>
        </View>

        <Ionicons name="chevron-forward" size={20} color={Colors.textLight} />
      </TouchableOpacity>
    );
  }, [searchQuery, handlePhrasePress, config, getPhraseTexts]);

  /**
   * Get match tag styling
   */
  const getMatchTagStyle = (field: string) => {
    const styles = {
      chinese: { backgroundColor: Colors.primary + '20' },
      pinyin: { backgroundColor: Colors.primary + '20' },
      russian: { backgroundColor: Colors.warning + '20' },
      turkmen: { backgroundColor: Colors.accent + '20' },
      semantic: { backgroundColor: Colors.success + '20' },
      contextual: { backgroundColor: Colors.error + '20' },
      personal: { backgroundColor: Colors.secondary + '20' },
    };
    return styles[field] || { backgroundColor: Colors.textLight + '20' };
  };

  /**
   * Get localized match field label
   */
  const getMatchFieldLabel = (field: string) => {
    const labels = {
      tk: {
        chinese: '中文', russian: 'Rus', turkmen: 'Türkmen', pinyin: 'Pinyin',
        semantic: 'Semantik', contextual: 'Kontext', personal: 'Şahsy'
      },
      zh: {
        chinese: '中文', russian: '俄语', turkmen: '土库曼语', pinyin: '拼音',
        semantic: '语义', contextual: '上下文', personal: '个人'
      },
      ru: {
        chinese: 'Китайский', russian: 'Русский', turkmen: 'Туркменский', pinyin: 'Пиньинь',
        semantic: 'Семантика', contextual: 'Контекст', personal: 'Личное'
      }
    };
    
    const lang = config.mode === 'tk' ? 'tk' : config.mode === 'zh' ? 'zh' : 'ru';
    return labels[lang][field] || field;
  };

  /**
   * Render personalized recommendation
   */
  const renderRecommendation: ListRenderItem<Phrase> = useCallback(({ item }) => {
    const category = categories.find(cat => cat.id === item.categoryId);
    const phraseTexts = getPhraseTexts(item);

    return (
      <TouchableOpacity
        style={styles.recommendationCard}
        onPress={() => handlePhrasePress(item)}
        activeOpacity={0.7}
      >
        <View style={styles.recommendationHeader}>
          <Text style={styles.recommendationChinese}>{item.chinese}</Text>
          {category && (
            <Text style={styles.recommendationIcon}>{category.icon}</Text>
          )}
        </View>
        <Text style={styles.recommendationPrimary}>{phraseTexts.primary}</Text>
      </TouchableOpacity>
    );
  }, [handlePhrasePress, config, getPhraseTexts]);

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.searchHeader}>
          <View style={styles.headerRow}>
            <View style={styles.headerText}>
              <Text style={styles.headerTitle}>
                {config.mode === 'tk' ? '🔍 Akylly gözleg' :
                 config.mode === 'zh' ? '🔍 智能搜索' :
                 '🔍 Умный поиск'}
              </Text>
              <Text style={styles.headerSubtitle}>
                {config.mode === 'tk' ? 'Ses, süzgüç we akylly tekliplerle' :
                 config.mode === 'zh' ? '语音、筛选和智能建议' :
                 'Голос, фильтры и умные предложения'}
              </Text>
            </View>
            
            {/* Advanced controls */}
            <View style={styles.headerControls}>
              <VoiceSearchButton
                onVoiceResult={handleVoiceResult}
                size="medium"
                style={styles.voiceButton}
              />
              <TouchableOpacity
                style={[styles.filterToggle, hasActiveFilters && styles.filterToggleActive]}
                onPress={() => setShowFilters(!showFilters)}
              >
                <Ionicons 
                  name="options" 
                  size={20} 
                  color={hasActiveFilters ? Colors.textWhite : Colors.primary} 
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
              <Animated.View style={[styles.loadingBar, { opacity: fadeAnimation }]} />
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
          {!searchQuery.trim() ? (
            /* Welcome Screen */
            <ScrollView style={styles.welcomeContainer}>
              {/* Voice Search Showcase */}
              <TouchableOpacity
                style={styles.voiceShowcase}
                onPress={() => setShowVoiceSearch(true)}
                activeOpacity={0.8}
              >
                <VoiceSearch
                  onVoiceResult={handleVoiceResult}
                  style={styles.voiceSearchComponent}
                />
              </TouchableOpacity>

              {/* Personalized Recommendations */}
              {personalizedRecommendations.length > 0 && (
                <View style={styles.recommendationsSection}>
                  <Text style={styles.sectionTitle}>
                    {getText('recommendations')}
                  </Text>
                  <FlatList
                    data={personalizedRecommendations}
                    renderItem={renderRecommendation}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.recommendationsList}
                    keyExtractor={(item) => item.id}
                  />
                </View>
              )}

              {/* Quick Search Tips */}
              <View style={styles.tipsSection}>
                <Text style={styles.sectionTitle}>
                  {config.mode === 'tk' ? '💡 Gözleg maslahatlary' :
                   config.mode === 'zh' ? '💡 搜索技巧' :
                   '💡 Советы по поиску'}
                </Text>
                
                <View style={styles.tipsList}>
                  <View style={styles.tipItem}>
                    <Ionicons name="mic" size={20} color={Colors.primary} />
                    <Text style={styles.tipText}>
                      {config.mode === 'tk' ? 'Ses bilen gözleň - mikrofon düwmesine basyň' :
                       config.mode === 'zh' ? '语音搜索 - 点击麦克风按钮' :
                       'Голосовой поиск - нажмите кнопку микрофона'}
                    </Text>
                  </View>
                  
                  <View style={styles.tipItem}>
                    <Ionicons name="language" size={20} color={Colors.accent} />
                    <Text style={styles.tipText}>
                      {config.mode === 'tk' ? 'Islendik dilde ýazup bilersiňiz - ýapylmany awtomatiki tanar' :
                       config.mode === 'zh' ? '支持任何语言输入 - 自动识别语言' :
                       'Можно искать на любом языке - автоопределение языка'}
                    </Text>
                  </View>

                  <View style={styles.tipItem}>
                    <Ionicons name="options" size={20} color={Colors.warning} />
                    <Text style={styles.tipText}>
                      {config.mode === 'tk' ? 'Süzgüçleri ulanyp, kynlyk we kategoriýa boýunça süzüň' :
                       config.mode === 'zh' ? '使用筛选器按难度和类别过滤' :
                       'Используйте фильтры для поиска по сложности и категориям'}
                    </Text>
                  </View>
                </View>
              </View>
            </ScrollView>
          ) : searchResults.length === 0 ? (
            /* No Results */
            <View style={styles.emptyContainer}>
              <Ionicons name="search-outline" size={64} color={Colors.textLight} />
              <Text style={styles.emptyTitle}>
                {getText('noResults')}
              </Text>
              <Text style={styles.emptyText}>
                {getText('tryAgain')}
              </Text>
              
              {/* Suggest voice search */}
              <TouchableOpacity
                style={styles.voiceSuggestion}
                onPress={() => setShowVoiceSearch(true)}
              >
                <Ionicons name="mic-outline" size={20} color={Colors.primary} />
                <Text style={styles.voiceSuggestionText}>
                  {getText('searchByVoice')}
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            /* Search Results */
            <>
              <View style={styles.resultsHeader}>
                <Text style={styles.resultsCount}>
                  {getText('found')} {searchResults.length} {getText('phrases')}
                </Text>
                
                {hasActiveFilters && (
                  <TouchableOpacity
                    style={styles.clearFiltersButton}
                    onPress={clearAllFilters}
                  >
                    <Text style={styles.clearFiltersText}>
                      {getText('clearFilters')}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              <FlatList
                data={searchResults}
                renderItem={renderSearchResult}
                keyExtractor={(item) => item.phrase.id}
                style={styles.resultsList}
                contentContainerStyle={styles.resultsListContent}
                showsVerticalScrollIndicator={false}
                // Performance optimizations
                removeClippedSubviews={true}
                maxToRenderPerBatch={6}
                initialNumToRender={4}
                windowSize={8}
              />
            </>
          )}
        </View>

        {/* Voice Search Modal */}
        <Modal
          visible={showVoiceSearch}
          animationType="slide"
          transparent
          onRequestClose={() => setShowVoiceSearch(false)}
        >
          <View style={styles.voiceModalContainer}>
            <View style={styles.voiceModal}>
              <TouchableOpacity
                style={styles.voiceModalClose}
                onPress={() => setShowVoiceSearch(false)}
              >
                <Ionicons name="close" size={24} color={Colors.textLight} />
              </TouchableOpacity>

              <VoiceSearch
                onVoiceResult={handleVoiceResult}
                onVoiceStart={() => createFadeAnimation(1, 300)}
                onVoiceEnd={() => createFadeAnimation(0.5, 300)}
                style={styles.voiceSearchModal}
              />
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const SEARCH_DEBOUNCE_MS = 300;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  searchHeader: {
    padding: 20,
    paddingBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    ...Typography.h1,
    color: Colors.text,
    marginBottom: 4,
  },
  headerSubtitle: {
    ...Typography.body,
    color: Colors.textLight,
  },
  headerControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  voiceButton: {
    marginRight: 4,
  },
  filterToggle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.background,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterToggleActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  searchInputSection: {
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    elevation: 2,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    ...Typography.body,
    color: Colors.text,
  },
  clearButton: {
    marginLeft: 8,
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
  mainContent: {
    flex: 1,
  },
  welcomeContainer: {
    flex: 1,
  },
  voiceShowcase: {
    margin: 20,
    marginBottom: 32,
    alignItems: 'center',
  },
  voiceSearchComponent: {
    width: '100%',
  },
  recommendationsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    ...Typography.h3,
    color: Colors.text,
    marginHorizontal: 20,
    marginBottom: 12,
  },
  recommendationsList: {
    paddingHorizontal: 20,
  },
  recommendationCard: {
    width: 160,
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    elevation: 2,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  recommendationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  recommendationChinese: {
    ...Typography.h4,
    color: Colors.text,
    flex: 1,
  },
  recommendationIcon: {
    fontSize: 16,
  },
  recommendationPrimary: {
    ...Typography.small,
    color: Colors.textLight,
    lineHeight: 18,
  },
  tipsSection: {
    margin: 20,
  },
  tipsList: {
    gap: 12,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.cardBackground,
    borderRadius: 8,
    padding: 16,
  },
  tipText: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginLeft: 12,
    flex: 1,
    lineHeight: 20,
  },
  resultsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: Colors.backgroundLight,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
  },
  resultsCount: {
    ...Typography.body,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  clearFiltersButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: Colors.primary + '20',
    borderRadius: 16,
  },
  clearFiltersText: {
    ...Typography.small,
    color: Colors.primary,
    fontWeight: '600',
  },
  resultsList: {
    flex: 1,
  },
  resultsListContent: {
    padding: 20,
  },
  resultCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  resultContent: {
    flex: 1,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  chineseText: {
    ...Typography.h3,
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
    ...Typography.body,
    color: Colors.primary,
    fontStyle: 'italic',
    marginBottom: 4,
  },
  primaryText: {
    ...Typography.body,
    color: Colors.text,
    fontWeight: '600',
    marginBottom: 4,
  },
  turkmenMainText: {
    fontSize: 18,
    fontWeight: '700',
  },
  secondaryText: {
    ...Typography.small,
    color: Colors.textLight,
    marginBottom: 8,
  },
  resultFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  matchTypes: {
    flexDirection: 'row',
    gap: 6,
  },
  matchTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  matchTagText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.text,
  },
  relevanceScore: {
    ...Typography.small,
    color: Colors.textLight,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    ...Typography.h2,
    color: Colors.text,
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    ...Typography.body,
    color: Colors.textLight,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  voiceSuggestion: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary + '20',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 24,
  },
  voiceSuggestionText: {
    ...Typography.body,
    color: Colors.primary,
    marginLeft: 8,
    fontWeight: '600',
  },
  
  // Voice Search Modal
  voiceModalContainer: {
    flex: 1,
    backgroundColor: Colors.background + 'CC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  voiceModal: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 20,
    padding: 24,
    margin: 20,
    width: '80%',
    maxWidth: 300,
    elevation: 10,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  voiceModalClose: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 1,
    padding: 8,
  },
  voiceSearchModal: {
    marginTop: 20,
  },
});
