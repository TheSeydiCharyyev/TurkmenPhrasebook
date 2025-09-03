// src/components/SearchSuggestions.tsx - Intelligent Search Suggestions for Day 18

import React, { useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ListRenderItem,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import { SearchSuggestion } from '../hooks/useAdvancedSearch';
import { useAppLanguage } from '../contexts/LanguageContext';

interface SearchSuggestionsProps {
  suggestions: SearchSuggestion[];
  onSuggestionPress: (suggestion: string) => void;
  currentQuery: string;
  isVisible: boolean;
}

export default function SearchSuggestions({
  suggestions,
  onSuggestionPress,
  currentQuery,
  isVisible
}: SearchSuggestionsProps) {
  const { config } = useAppLanguage();

  // Don't render if not visible or no suggestions
  if (!isVisible || suggestions.length === 0) {
    return null;
  }

  // Get icon and color for suggestion type
  const getSuggestionConfig = useCallback((type: SearchSuggestion['type']) => {
    const configs = {
      completion: {
        icon: 'arrow-forward',
        color: Colors.primary,
        bgColor: Colors.primary + '15',
      },
      correction: {
        icon: 'create',
        color: Colors.warning,
        bgColor: Colors.warning + '15',
      },
      related: {
        icon: 'link',
        color: Colors.accent,
        bgColor: Colors.accent + '15',
      },
    };
    return configs[type];
  }, []);

  // Get localized suggestion type label
  const getSuggestionTypeLabel = useCallback((type: SearchSuggestion['type']) => {
    const labels = {
      tk: {
        completion: 'Doldurmak',
        correction: 'Düzediş',
        related: 'Meňzeş',
      },
      zh: {
        completion: '补全',
        correction: '纠正',
        related: '相关',
      },
      ru: {
        completion: 'Дополнение',
        correction: 'Исправление',
        related: 'Похожие',
      },
    };

    const lang = config.mode === 'tk' ? 'tk' : config.mode === 'zh' ? 'zh' : 'ru';
    return labels[lang][type];
  }, [config.mode]);

  // Render suggestion item
  const renderSuggestion: ListRenderItem<SearchSuggestion> = useCallback(({ item }) => {
    const suggestionConfig = getSuggestionConfig(item.type);
    const typeLabel = getSuggestionTypeLabel(item.type);

    return (
      <TouchableOpacity
        style={styles.suggestionItem}
        onPress={() => onSuggestionPress(item.text)}
        activeOpacity={0.7}
      >
        <View style={styles.suggestionContent}>
          {/* Suggestion icon */}
          <View style={[styles.suggestionIcon, { backgroundColor: suggestionConfig.bgColor }]}>
            <Ionicons 
              name={suggestionConfig.icon as any} 
              size={14} 
              color={suggestionConfig.color} 
            />
          </View>

          {/* Suggestion text */}
          <View style={styles.suggestionTextContainer}>
            <Text style={styles.suggestionText}>
              {highlightDifference(currentQuery, item.text)}
            </Text>
            <Text style={styles.suggestionType}>{typeLabel}</Text>
          </View>

          {/* Relevance score indicator */}
          <View style={styles.scoreContainer}>
            <View style={[
              styles.scoreBar,
              { width: `${Math.min(item.score / 100 * 100, 100)}%` }
            ]} />
          </View>
        </View>

        {/* Arrow icon */}
        <Ionicons name="arrow-up-outline" size={16} color={Colors.textLight} />
      </TouchableOpacity>
    );
  }, [currentQuery, onSuggestionPress, getSuggestionConfig, getSuggestionTypeLabel]);

  // Highlight the difference between current query and suggestion
  const highlightDifference = (query: string, suggestion: string) => {
    // For now, just return the suggestion
    // In a real implementation, we'd highlight the different parts
    return suggestion;
  };

  const keyExtractor = useCallback((item: SearchSuggestion, index: number) => 
    `${item.text}-${item.type}-${index}`, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={suggestions}
        renderItem={renderSuggestion}
        keyExtractor={keyExtractor}
        style={styles.suggestionsList}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        // Performance optimizations
        removeClippedSubviews={true}
        maxToRenderPerBatch={5}
        initialNumToRender={3}
        windowSize={5}
      />
    </View>
  );
}

/**
 * Search Suggestions with Highlighted Text Component
 * Senior Developer Teaching: Composition over inheritance
 */
export function HighlightedSuggestion({ 
  query, 
  suggestion, 
  style 
}: { 
  query: string; 
  suggestion: string; 
  style?: any; 
}) {
  // Highlight matching parts of the suggestion
  const highlightedText = useMemo(() => {
    if (!query.trim()) return [{ text: suggestion, isHighlighted: false }];

    const parts: Array<{ text: string; isHighlighted: boolean }> = [];
    const lowerQuery = query.toLowerCase();
    const lowerSuggestion = suggestion.toLowerCase();
    
    let lastIndex = 0;
    let index = lowerSuggestion.indexOf(lowerQuery, lastIndex);
    
    while (index !== -1) {
      // Add text before match
      if (index > lastIndex) {
        parts.push({
          text: suggestion.substring(lastIndex, index),
          isHighlighted: false
        });
      }
      
      // Add matched text
      parts.push({
        text: suggestion.substring(index, index + query.length),
        isHighlighted: true
      });
      
      lastIndex = index + query.length;
      index = lowerSuggestion.indexOf(lowerQuery, lastIndex);
    }
    
    // Add remaining text
    if (lastIndex < suggestion.length) {
      parts.push({
        text: suggestion.substring(lastIndex),
        isHighlighted: false
      });
    }
    
    return parts;
  }, [query, suggestion]);

  return (
    <Text style={style}>
      {highlightedText.map((part, index) => (
        <Text
          key={index}
          style={[
            part.isHighlighted && styles.highlightedText
          ]}
        >
          {part.text}
        </Text>
      ))}
    </Text>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 8,
    elevation: 3,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  suggestionsList: {
    maxHeight: 200,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
  },
  suggestionContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  suggestionIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  suggestionTextContainer: {
    flex: 1,
  },
  suggestionText: {
    fontSize: 15,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 2,
  },
  suggestionType: {
    fontSize: 11,
    color: Colors.textLight,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  scoreContainer: {
    width: 30,
    height: 3,
    backgroundColor: Colors.backgroundLight,
    borderRadius: 1.5,
    marginLeft: 8,
    overflow: 'hidden',
  },
  scoreBar: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 1.5,
  },
  highlightedText: {
    backgroundColor: Colors.primary + '30',
    color: Colors.primary,
    fontWeight: '600',
  },
});

/**
 * Quick Action Suggestions Component
 * Shows common actions user might want to take
 */
export function QuickActionSuggestions({
  onVoiceSearch,
  onRandomPhrase,
  onRecentlyViewed,
}: {
  onVoiceSearch: () => void;
  onRandomPhrase: () => void;
  onRecentlyViewed: () => void;
}) {
  const { config } = useAppLanguage();

  const getText = useCallback((key: string) => {
    const texts = {
      tk: {
        voiceSearch: 'Ses bilen gözleg',
        randomPhrase: 'Tötänleýin sözlem',
        recentlyViewed: 'Soňky görülen',
      },
      zh: {
        voiceSearch: '语音搜索',
        randomPhrase: '随机短语',
        recentlyViewed: '最近查看',
      },
      ru: {
        voiceSearch: 'Голосовой поиск',
        randomPhrase: 'Случайная фраза',
        recentlyViewed: 'Недавно просмотренные',
      },
    };

    const lang = config.mode === 'tk' ? 'tk' : config.mode === 'zh' ? 'zh' : 'ru';
    return texts[lang][key] || key;
  }, [config.mode]);

  const quickActions = [
    {
      id: 'voice',
      label: getText('voiceSearch'),
      icon: 'mic',
      color: Colors.primary,
      onPress: onVoiceSearch,
    },
    {
      id: 'random',
      label: getText('randomPhrase'),
      icon: 'shuffle',
      color: Colors.accent,
      onPress: onRandomPhrase,
    },
    {
      id: 'recent',
      label: getText('recentlyViewed'),
      icon: 'time',
      color: Colors.warning,
      onPress: onRecentlyViewed,
    },
  ];

  return (
    <View style={quickActionStyles.container}>
      {quickActions.map(action => (
        <TouchableOpacity
          key={action.id}
          style={[quickActionStyles.actionButton, { borderColor: action.color }]}
          onPress={action.onPress}
          activeOpacity={0.7}
        >
          <Ionicons name={action.icon as any} size={20} color={action.color} />
          <Text style={[quickActionStyles.actionText, { color: action.color }]}>
            {action.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const quickActionStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.backgroundLight,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderWidth: 1,
    gap: 6,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '500',
  },
});
