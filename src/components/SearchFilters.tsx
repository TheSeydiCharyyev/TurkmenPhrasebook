// src/components/SearchFilters.tsx - Advanced Search Filters for Day 18

import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Pressable,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import { Typography } from '../constants/Typography';
import { SearchDifficulty } from '../utils/SearchEngine';
import { useAppLanguage } from '../contexts/LanguageContext';
import { useAnimations } from '../hooks/useAnimations';

export interface FilterOptions {
  difficulty?: SearchDifficulty;
  sortBy?: 'relevance' | 'difficulty' | 'frequency' | 'recent';
  includeRelated?: boolean;
  fuzzyThreshold?: number;
  languageBoost?: 'chinese' | 'russian' | 'turkmen';
}

interface SearchFiltersProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  onClearFilters: () => void;
  resultCount?: number;
}

export default function SearchFilters({
  filters,
  onFiltersChange,
  onClearFilters,
  resultCount = 0
}: SearchFiltersProps) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { config } = useAppLanguage();
  const { scaleAnimation, fadeAnimation, createScaleAnimation, createFadeAnimation } = useAnimations();

  // Memoized filter counts
  const activeFilterCount = useMemo(() => {
    return Object.values(filters).filter(value => value !== undefined && value !== 'relevance').length;
  }, [filters]);

  const hasActiveFilters = activeFilterCount > 0;

  // Localized text
  const getText = useCallback((key: string) => {
    const texts = {
      tk: {
        filters: 'Süzgüçler',
        difficulty: 'Kynlyk',
        sortBy: 'Tertipleş',
        settings: 'Sazlamalar',
        clear: 'Arassala',
        apply: 'Ulan',
        cancel: 'Ýatyr',
        beginner: 'Başlaýjy',
        intermediate: 'Orta',
        advanced: 'Ösen',
        relevance: 'Ähmiýet',
        frequency: 'Ýygylyk',
        recent: 'Soňky',
        languageBoost: 'Dil öňe sürmek',
        includeRelated: 'Meňzeş goş',
        fuzzySearch: 'Ýumşak gözleg',
        results: 'netije',
      },
      zh: {
        filters: '筛选器',
        difficulty: '难度',
        sortBy: '排序',
        settings: '设置',
        clear: '清除',
        apply: '应用',
        cancel: '取消',
        beginner: '初级',
        intermediate: '中级',
        advanced: '高级',
        relevance: '相关性',
        frequency: '频率',
        recent: '最近',
        languageBoost: '语言优先',
        includeRelated: '包含相关',
        fuzzySearch: '模糊搜索',
        results: '结果',
      },
      ru: {
        filters: 'Фильтры',
        difficulty: 'Сложность',
        sortBy: 'Сортировка',
        settings: 'Настройки',
        clear: 'Очистить',
        apply: 'Применить',
        cancel: 'Отмена',
        beginner: 'Начальный',
        intermediate: 'Средний',
        advanced: 'Продвинутый',
        relevance: 'По релевантности',
        frequency: 'По частоте',
        recent: 'По времени',
        languageBoost: 'Приоритет языка',
        includeRelated: 'Включить похожие',
        fuzzySearch: 'Нечёткий поиск',
        results: 'результат',
      }
    };

    return texts[config.mode === 'tk' ? 'tk' : config.mode === 'zh' ? 'zh' : 'ru'][key] || key;
  }, [config.mode]);

  // Filter button press handlers
  const handleDifficultyPress = useCallback((difficulty: SearchDifficulty) => {
    const newDifficulty = filters.difficulty === difficulty ? undefined : difficulty;
    onFiltersChange({ ...filters, difficulty: newDifficulty });
  }, [filters, onFiltersChange]);

  const handleSortPress = useCallback((sortBy: FilterOptions['sortBy']) => {
    onFiltersChange({ ...filters, sortBy });
  }, [filters, onFiltersChange]);

  const handleLanguageBoostPress = useCallback((language: FilterOptions['languageBoost']) => {
    const newBoost = filters.languageBoost === language ? undefined : language;
    onFiltersChange({ ...filters, languageBoost: newBoost });
  }, [filters, onFiltersChange]);

  const handleToggleRelated = useCallback(() => {
    onFiltersChange({ ...filters, includeRelated: !filters.includeRelated });
  }, [filters, onFiltersChange]);

  // Modal handlers
  const openModal = useCallback(() => {
    setIsModalVisible(true);
    createScaleAnimation(1, 300);
  }, [createScaleAnimation]);

  const closeModal = useCallback(() => {
    createFadeAnimation(0, 200);
    setTimeout(() => setIsModalVisible(false), 200);
  }, [createFadeAnimation]);

  // Render filter chip
  const renderFilterChip = useCallback((
    label: string,
    isActive: boolean,
    onPress: () => void,
    icon?: string,
    color?: string
  ) => (
    <TouchableOpacity
      style={[
        styles.filterChip,
        isActive && [styles.filterChipActive, color && { backgroundColor: color }]
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {icon && (
        <Ionicons 
          name={icon as any} 
          size={14} 
          color={isActive ? Colors.textWhite : Colors.textLight}
          style={styles.filterChipIcon}
        />
      )}
      <Text style={[
        styles.filterChipText,
        isActive && styles.filterChipTextActive
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  ), []);

  return (
    <View style={styles.container}>
      {/* Quick Filter Bar */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.quickFilters}
        contentContainerStyle={styles.quickFiltersContent}
      >
        {/* Difficulty filters */}
        {renderFilterChip(
          getText('beginner'),
          filters.difficulty === SearchDifficulty.BEGINNER,
          () => handleDifficultyPress(SearchDifficulty.BEGINNER),
          'school',
          Colors.success
        )}
        
        {renderFilterChip(
          getText('intermediate'),
          filters.difficulty === SearchDifficulty.INTERMEDIATE,
          () => handleDifficultyPress(SearchDifficulty.INTERMEDIATE),
          'trending-up',
          Colors.warning
        )}
        
        {renderFilterChip(
          getText('advanced'),
          filters.difficulty === SearchDifficulty.ADVANCED,
          () => handleDifficultyPress(SearchDifficulty.ADVANCED),
          'star',
          Colors.danger
        )}

        {/* Sort options */}
        {renderFilterChip(
          getText('frequency'),
          filters.sortBy === 'frequency',
          () => handleSortPress('frequency'),
          'analytics'
        )}

        {renderFilterChip(
          getText('recent'),
          filters.sortBy === 'recent',
          () => handleSortPress('recent'),
          'time'
        )}

        {/* Advanced settings button */}
        <TouchableOpacity
          style={[styles.filterChip, styles.advancedButton]}
          onPress={openModal}
          activeOpacity={0.7}
        >
          <Ionicons name="options" size={14} color={Colors.primary} />
          <Text style={[styles.filterChipText, { color: Colors.primary }]}>
            {getText('settings')}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Results summary and clear button */}
      {(hasActiveFilters || resultCount > 0) && (
        <View style={styles.resultsSummary}>
          <Text style={styles.resultsText}>
            {resultCount} {getText('results')}
            {hasActiveFilters && (
              <Text style={styles.filteredText}> • {activeFilterCount} фильтр</Text>
            )}
          </Text>
          
          {hasActiveFilters && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={onClearFilters}
              activeOpacity={0.7}
            >
              <Ionicons name="close-circle" size={16} color={Colors.primary} />
              <Text style={styles.clearButtonText}>{getText('clear')}</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Advanced Settings Modal */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="none"
        onRequestClose={closeModal}
      >
        <Pressable style={styles.modalOverlay} onPress={closeModal}>
          <Animated.View 
            style={[
              styles.modalContent,
              { 
                transform: [{ scale: scaleAnimation }],
                opacity: fadeAnimation 
              }
            ]}
          >
            <Pressable onPress={e => e.stopPropagation()}>
              {/* Modal Header */}
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{getText('settings')}</Text>
                <TouchableOpacity onPress={closeModal}>
                  <Ionicons name="close" size={24} color={Colors.textLight} />
                </TouchableOpacity>
              </View>

              {/* Language Priority Section */}
              <View style={styles.modalSection}>
                <Text style={styles.sectionTitle}>{getText('languageBoost')}</Text>
                <View style={styles.optionGroup}>
                  {(['chinese', 'russian', 'turkmen'] as const).map(language => (
                    <TouchableOpacity
                      key={language}
                      style={[
                        styles.optionButton,
                        filters.languageBoost === language && styles.optionButtonActive
                      ]}
                      onPress={() => handleLanguageBoostPress(language)}
                    >
                      <Text style={[
                        styles.optionButtonText,
                        filters.languageBoost === language && styles.optionButtonTextActive
                      ]}>
                        {language === 'chinese' ? '中文' : 
                         language === 'russian' ? 'Русский' : 'Türkmençe'}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Advanced Options */}
              <View style={styles.modalSection}>
                <Text style={styles.sectionTitle}>Дополнительно</Text>
                
                <TouchableOpacity
                  style={styles.toggleOption}
                  onPress={handleToggleRelated}
                >
                  <Text style={styles.toggleText}>{getText('includeRelated')}</Text>
                  <View style={[
                    styles.toggle,
                    filters.includeRelated && styles.toggleActive
                  ]}>
                    <View style={[
                      styles.toggleIndicator,
                      filters.includeRelated && styles.toggleIndicatorActive
                    ]} />
                  </View>
                </TouchableOpacity>

                {/* Fuzzy Search Threshold */}
                <View style={styles.sliderContainer}>
                  <Text style={styles.sliderLabel}>
                    {getText('fuzzySearch')}: {Math.round((filters.fuzzyThreshold || 0.7) * 100)}%
                  </Text>
                  <View style={styles.sliderTrack}>
                    <View 
                      style={[
                        styles.sliderFill,
                        { width: `${(filters.fuzzyThreshold || 0.7) * 100}%` }
                      ]} 
                    />
                    <TouchableOpacity
                      style={[
                        styles.sliderThumb,
                        { left: `${(filters.fuzzyThreshold || 0.7) * 100 - 2}%` }
                      ]}
                    />
                  </View>
                </View>
              </View>

              {/* Apply Button */}
              <TouchableOpacity
                style={styles.applyButton}
                onPress={closeModal}
                activeOpacity={0.8}
              >
                <Text style={styles.applyButtonText}>{getText('apply')}</Text>
              </TouchableOpacity>
            </Pressable>
          </Animated.View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
  },
  quickFilters: {
    paddingVertical: 8,
  },
  quickFiltersContent: {
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
    marginRight: 4,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.text,
  },
  filterChipTextActive: {
    color: Colors.textWhite,
  },
  advancedButton: {
    borderColor: Colors.primary,
    borderWidth: 1,
  },
  resultsSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: Colors.backgroundLight,
    borderTopWidth: 1,
    borderTopColor: Colors.cardBorder,
  },
  resultsText: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '500',
  },
  filteredText: {
    color: Colors.primary,
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
  },
  clearButtonText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '500',
    marginLeft: 4,
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: 20,
    width: '85%',
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
  },
  modalSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  optionGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionButton: {
    backgroundColor: Colors.backgroundLight,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  optionButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  optionButtonText: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '500',
  },
  optionButtonTextActive: {
    color: Colors.textWhite,
  },
  toggleOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  toggleText: {
    fontSize: 14,
    color: Colors.text,
  },
  toggle: {
    width: 44,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.backgroundLight,
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleActive: {
    backgroundColor: Colors.primary,
  },
  toggleIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.textWhite,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleIndicatorActive: {
    alignSelf: 'flex-end',
  },
  sliderContainer: {
    marginTop: 16,
  },
  sliderLabel: {
    fontSize: 14,
    color: Colors.text,
    marginBottom: 8,
  },
  sliderTrack: {
    height: 4,
    backgroundColor: Colors.backgroundLight,
    borderRadius: 2,
    position: 'relative',
  },
  sliderFill: {
    height: 4,
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
  sliderThumb: {
    position: 'absolute',
    top: -6,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.primary,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  applyButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textWhite,
  },
});

/**
 * Difficulty Badge Component
 * Senior Developer Teaching: Small, reusable components are easier to maintain
 */
export function DifficultyBadge({ 
  difficulty, 
  style 
}: { 
  difficulty: SearchDifficulty; 
  style?: any; 
}) {
  const { config } = useAppLanguage();
  
  const getDifficultyConfig = (diff: SearchDifficulty) => {
    const configs = {
      [SearchDifficulty.BEGINNER]: {
        color: Colors.success,
        icon: 'school',
        textTk: 'Başlaýjy',
        textZh: '初级',
        textRu: 'Начальный',
      },
      [SearchDifficulty.INTERMEDIATE]: {
        color: Colors.warning,
        icon: 'trending-up',
        textTk: 'Orta',
        textZh: '中级', 
        textRu: 'Средний',
      },
      [SearchDifficulty.ADVANCED]: {
        color: Colors.danger,
        icon: 'star',
        textTk: 'Ösen',
        textZh: '高级',
        textRu: 'Продвинутый',
      },
    };
    return configs[diff];
  };

  const diffConfig = getDifficultyConfig(difficulty);
  const text = config.mode === 'tk' ? diffConfig.textTk :
               config.mode === 'zh' ? diffConfig.textZh :
               diffConfig.textRu;

  return (
    <View style={[styles.difficultyBadge, { backgroundColor: diffConfig.color }, style]}>
      <Ionicons name={diffConfig.icon as any} size={10} color={Colors.textWhite} />
      <Text style={styles.difficultyBadgeText}>{text}</Text>
    </View>
  );
}

const difficultyBadgeStyles = StyleSheet.create({
  difficultyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    gap: 2,
  },
  difficultyBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.textWhite,
  },
});

// Merge styles
Object.assign(styles, difficultyBadgeStyles);
