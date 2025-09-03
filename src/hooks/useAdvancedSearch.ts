// src/hooks/useAdvancedSearch.ts - Advanced Search Hook for Day 18

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { SearchEngine, SearchResult, SearchOptions, SearchDifficulty, getPhraseDifficulty } from '../utils/SearchEngine';
import { phrases } from '../data/phrases';
import { categories } from '../data/categories';
import { Phrase } from '../types';
import { useSearchHistory } from './useSearchHistory';
import { useHistory } from './useHistory';

export interface AdvancedSearchOptions extends SearchOptions {
  difficultyFilter?: SearchDifficulty;
  sortBy?: 'relevance' | 'difficulty' | 'frequency' | 'recent';
  includeRelated?: boolean;
}

export interface SearchSuggestion {
  text: string;
  type: 'completion' | 'correction' | 'related';
  score: number;
}

export interface SearchAnalytics {
  totalSearches: number;
  averageResultsPerSearch: number;
  popularQueries: Array<{ query: string; count: number }>;
  searchSuccessRate: number;
  performanceMetrics: {
    averageSearchTime: number;
    indexSize: number;
  };
}

export function useAdvancedSearch() {
  // Core search engine instance (memoized for performance)
  const searchEngine = useMemo(() => new SearchEngine(phrases, categories), []);
  
  // Search state
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [searchOptions, setSearchOptions] = useState<AdvancedSearchOptions>({});
  
  // Performance tracking
  const searchTimeRef = useRef<number>(0);
  const [searchAnalytics, setSearchAnalytics] = useState<SearchAnalytics>({
    totalSearches: 0,
    averageResultsPerSearch: 0,
    popularQueries: [],
    searchSuccessRate: 0,
    performanceMetrics: { averageSearchTime: 0, indexSize: 0 }
  });

  // Hooks integration
  const { addToSearchHistory, getPopularSearches } = useSearchHistory();
  const { addToHistory, getHistory } = useHistory();

  /**
   * Get user history data for personalization
   */
  const getUserHistoryData = useCallback(async () => {
    try {
      const history = await getHistory();
      return history || [];
    } catch (error) {
      console.error('Failed to get user history:', error);
      return [];
    }
  }, [getHistory]);

  /**
   * Perform advanced search with all options
   * Senior Developer Teaching: Debouncing prevents excessive API calls
   */
  const performSearch = useCallback(async (
    query: string, 
    options: AdvancedSearchOptions = {}
  ): Promise<SearchResult[]> => {
    if (!query.trim()) {
      setSearchResults([]);
      return [];
    }

    setIsSearching(true);
    const startTime = Date.now();

    try {
      // Enhanced search with new Day 18 features
      const searchOptions = {
        fuzzyThreshold: options.fuzzyThreshold || 0.7,
        categoryFilter: options.categoryFilter,
        languageBoost: options.languageBoost,
        includePhonetic: options.includePhonetic ?? true,
        maxResults: options.maxResults || 50,
        semanticBoost: true, // Enable semantic matching
        personalizedBoost: options.personalizedBoost ?? true,
        contextualSearch: true, // Enable contextual search
      };
      
      // Get user history for personalization
      const userHistory = await getUserHistoryData();
      
      let results = searchEngine.search(query, searchOptions, userHistory);

      // Apply difficulty filter
      if (options.difficultyFilter) {
        results = results.filter(result => 
          getPhraseDifficulty(result.phrase, categories) === options.difficultyFilter
        );
      }

      // Apply sorting
      if (options.sortBy && options.sortBy !== 'relevance') {
        results = await applySorting(results, options.sortBy);
      }

      // Add related phrases if requested
      if (options.includeRelated && results.length > 0) {
        const mainResult = results[0];
        const related = searchEngine.getRelatedPhrases(mainResult.phrase, 3);
        // Add related as lower-scored results
        related.forEach(phrase => {
          if (!results.find(r => r.phrase.id === phrase.id)) {
            results.push({
              phrase,
              relevanceScore: 10, // Low score so they appear at bottom
              matchedFields: ['related'],
              matchedText: 'Related phrase'
            });
          }
        });
      }

      const searchTime = Date.now() - startTime;
      
      // Update analytics
      updateSearchAnalytics(query, results.length, searchTime);
      
      // Add to search history if we have results
      if (results.length > 0) {
        addToSearchHistory(query, results.length);
      }

      setSearchResults(results);
      return results;

    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
      return [];
    } finally {
      setIsSearching(false);
    }
  }, [searchEngine, addToSearchHistory]);

  /**
   * Apply different sorting strategies
   */
  const applySorting = async (results: SearchResult[], sortBy: string): Promise<SearchResult[]> => {
    switch (sortBy) {
      case 'difficulty':
        return results.sort((a, b) => {
          const diffA = getPhraseDifficulty(a.phrase, categories);
          const diffB = getPhraseDifficulty(b.phrase, categories);
          const order = { beginner: 1, intermediate: 2, advanced: 3 };
          return order[diffA] - order[diffB];
        });
      
      case 'frequency':
        // Sort by usage frequency from history
        return results.sort((a, b) => {
          // This would use real usage data in production
          return b.relevanceScore - a.relevanceScore; // Fallback to relevance
        });
      
      case 'recent':
        // Sort by recently viewed (would integrate with history in production)
        return results.sort((a, b) => b.relevanceScore - a.relevanceScore);
      
      default:
        return results;
    }
  };

  /**
   * Update search analytics
   */
  const updateSearchAnalytics = (query: string, resultCount: number, searchTime: number) => {
    setSearchAnalytics(prev => ({
      totalSearches: prev.totalSearches + 1,
      averageResultsPerSearch: ((prev.averageResultsPerSearch * prev.totalSearches) + resultCount) / (prev.totalSearches + 1),
      popularQueries: getPopularSearches(5).map(item => ({ query: item.query, count: item.count })),
      searchSuccessRate: resultCount > 0 ? 
        ((prev.searchSuccessRate * prev.totalSearches) + 1) / (prev.totalSearches + 1) :
        (prev.searchSuccessRate * prev.totalSearches) / (prev.totalSearches + 1),
      performanceMetrics: {
        averageSearchTime: ((prev.performanceMetrics.averageSearchTime * prev.totalSearches) + searchTime) / (prev.totalSearches + 1),
        indexSize: Object.values(searchEngine.getSearchAnalytics().indexSize).reduce((a, b) => a + b, 0)
      }
    }));
  };

  /**
   * Generate intelligent search suggestions
   * Senior Developer Teaching: Good UX anticipates user needs
   */
  const generateSuggestions = useCallback((partialQuery: string): SearchSuggestion[] => {
    if (partialQuery.length < 2) return [];

    const suggestions: SearchSuggestion[] = [];

    // 1. Auto-completion suggestions
    const completions = searchEngine.getSuggestions(partialQuery, 3);
    completions.forEach(completion => {
      suggestions.push({
        text: completion,
        type: 'completion',
        score: 100
      });
    });

    // 2. Fuzzy correction suggestions
    const fuzzyMatches = searchEngine.search(partialQuery, { 
      fuzzyThreshold: 0.6, 
      maxResults: 2 
    });
    fuzzyMatches.forEach(match => {
      // Extract the best matching word from the phrase
      const bestMatch = extractBestMatch(partialQuery, match.phrase);
      if (bestMatch && bestMatch !== partialQuery) {
        suggestions.push({
          text: bestMatch,
          type: 'correction',
          score: match.relevanceScore
        });
      }
    });

    // 3. Related query suggestions from history
    const popularQueries = getPopularSearches(5);
    popularQueries.forEach(item => {
      if (item.query.toLowerCase().includes(partialQuery.toLowerCase()) && 
          item.query !== partialQuery) {
        suggestions.push({
          text: item.query,
          type: 'related',
          score: item.count * 10
        });
      }
    });

    // Remove duplicates and sort by score
    const uniqueSuggestions = suggestions.reduce((acc, current) => {
      const existing = acc.find(s => s.text === current.text);
      if (!existing) {
        acc.push(current);
      }
      return acc;
    }, [] as SearchSuggestion[]);

    return uniqueSuggestions
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
  }, [searchEngine, getPopularSearches]);

  /**
   * Extract the best matching word from a phrase for suggestions
   */
  const extractBestMatch = (query: string, phrase: Phrase): string | null => {
    const allText = [phrase.chinese, phrase.pinyin, phrase.russian, phrase.turkmen].join(' ');
    const words = allText.toLowerCase().split(/\s+/);
    
    let bestMatch = '';
    let bestScore = 0;

    words.forEach(word => {
      const similarity = calculateWordSimilarity(query.toLowerCase(), word);
      if (similarity > bestScore && similarity > 0.6) {
        bestScore = similarity;
        bestMatch = word;
      }
    });

    return bestMatch || null;
  };

  /**
   * Simple word similarity calculation
   */
  const calculateWordSimilarity = (word1: string, word2: string): number => {
    const maxLength = Math.max(word1.length, word2.length);
    let matches = 0;
    
    for (let i = 0; i < Math.min(word1.length, word2.length); i++) {
      if (word1[i] === word2[i]) matches++;
    }
    
    return matches / maxLength;
  };

  /**
   * Get personalized search recommendations based on user behavior
   */
  const getPersonalizedRecommendations = useCallback((maxResults: number = 5): Phrase[] => {
    // In a real app, this would use ML algorithms
    // For now, we'll use simple heuristics based on user history
    
    const popularSearches = getPopularSearches(10);
    const recommendedPhrases: Phrase[] = [];

    // Find phrases related to popular searches
    popularSearches.forEach(item => {
      const results = searchEngine.search(item.query, { maxResults: 2 });
      results.forEach(result => {
        if (!recommendedPhrases.find(p => p.id === result.phrase.id)) {
          recommendedPhrases.push(result.phrase);
        }
      });
    });

    return recommendedPhrases.slice(0, maxResults);
  }, [searchEngine, getPopularSearches]);

  /**
   * Clear all search state
   */
  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setSearchResults([]);
    setSuggestions([]);
  }, []);

  /**
   * Update search options
   */
  const updateSearchOptions = useCallback((newOptions: Partial<AdvancedSearchOptions>) => {
    setSearchOptions(prev => ({ ...prev, ...newOptions }));
  }, []);

  // Effect to generate suggestions when query changes
  useEffect(() => {
    if (searchQuery.length >= 2) {
      const newSuggestions = generateSuggestions(searchQuery);
      setSuggestions(newSuggestions);
    } else {
      setSuggestions([]);
    }
  }, [searchQuery, generateSuggestions]);

  return {
    // Search state
    searchQuery,
    setSearchQuery,
    searchResults,
    suggestions,
    isSearching,
    searchOptions,
    
    // Search functions
    performSearch,
    clearSearch,
    updateSearchOptions,
    
    // Advanced features
    getPersonalizedRecommendations,
    searchEngine, // Expose for direct access if needed
    
    // Analytics
    searchAnalytics,
  };
}

/**
 * Hook for search filters management
 * Senior Developer Teaching: Split complex hooks into focused ones
 */
export function useSearchFilters() {
  const [activeFilters, setActiveFilters] = useState<{
    difficulty?: SearchDifficulty;
    category?: string;
    sortBy?: 'relevance' | 'difficulty' | 'frequency' | 'recent';
  }>({});

  const applyFilter = useCallback((filterType: string, value: any) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  }, []);

  const removeFilter = useCallback((filterType: string) => {
    setActiveFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[filterType as keyof typeof newFilters];
      return newFilters;
    });
  }, []);

  const clearAllFilters = useCallback(() => {
    setActiveFilters({});
  }, []);

  const hasActiveFilters = useMemo(() => {
    return Object.keys(activeFilters).length > 0;
  }, [activeFilters]);

  return {
    activeFilters,
    applyFilter,
    removeFilter,
    clearAllFilters,
    hasActiveFilters,
  };
}
