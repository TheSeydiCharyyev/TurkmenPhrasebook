// src/components/RecentCategoryCard.tsx - ИСПРАВЛЕННАЯ ВЕРСИЯ с едиными границами

import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Импорты
import { Phrase } from '../types';
import { Colors } from '../constants/Colors';
import { useAnimations } from '../hooks/useAnimations';
import { useAppLanguage } from '../contexts/LanguageContext';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2; // Такой же размер как обычные категории
const CARD_HEIGHT = 120; // Такая же высота как обычные категории
const CARD_MARGIN = 8;

interface RecentCategoryCardProps {
  recentPhrases: Phrase[];
  stats: any;
  onPress: () => void;
  onStatsPress: () => void;
}

const RecentCategoryCard = React.memo<RecentCategoryCardProps>(({ 
  recentPhrases, 
  stats, 
  onPress, 
  onStatsPress 
}) => {
  const { hapticFeedback } = useAnimations();
  const { getTexts, config } = useAppLanguage();
  const texts = getTexts();

  const handlePress = useCallback(() => {
    hapticFeedback('medium');
    onPress();
  }, [onPress, hapticFeedback]);

  const handleLongPress = useCallback(() => {
    hapticFeedback('heavy');
    onStatsPress();
  }, [onStatsPress, hapticFeedback]);

  return (
    <View style={styles.cardContainer}>
      {/* ✅ ИСПРАВЛЕНО: Такие же стили как у обычных CategoryCard */}
      <TouchableOpacity
        style={styles.card}
        onPress={handlePress}
        onLongPress={handleLongPress}
        activeOpacity={0.7}
      >
        {/* Иконка - такая же структура как в CategoryCard */}
        <View style={styles.iconContainer}>
          <Text style={styles.categoryIcon}>📚</Text>
        </View>

        {/* Контент - такая же структура как в CategoryCard */}
        <View style={styles.contentContainer}>
          {/* ✅ ИСПРАВЛЕНО: Правильное название */}
          <Text style={styles.categoryTitle} numberOfLines={2}>
            {config.mode === 'tk' ? 'Soňky öwrenilen' :
             config.mode === 'zh' ? '最近学习的' :
             'Недавние фразы'}
          </Text>

          {/* Статистика */}
          <View style={styles.statsContainer}>
            <Text style={styles.statsText}>
              {recentPhrases.length} {config.mode === 'tk' ? 'sözlem' : 
                                     config.mode === 'zh' ? '短语' : 'фраз'}
            </Text>
          </View>

          {/* Индикатор - точно такой же как в CategoryCard */}
          <View style={styles.indicatorContainer}>
            <Ionicons 
              name="chevron-forward" 
              size={16} 
              color={Colors.primary} 
            />
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
});

RecentCategoryCard.displayName = 'RecentCategoryCard';

// ✅ ИСПРАВЛЕНО: Точно такие же стили как у CategoryCard
const styles = StyleSheet.create({
  cardContainer: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT, 
    marginBottom: CARD_MARGIN,
    // Точно такая же тень как у CategoryCard
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  
  card: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.primary + '20', // Легкая граница в основном цвете
    padding: 16,
    justifyContent: 'space-between',
    backgroundColor: Colors.primary + '05', // Очень легкий оттенок
  },
  
  iconContainer: {
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  
  categoryIcon: {
    fontSize: 32,
    lineHeight: 36,
    color: Colors.primary, // Цвет иконки как акцентный цвет
  },
  
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  
  categoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 20,
    color: '#1F2937',
    letterSpacing: -0.3,
  },
  
  statsContainer: {
    marginVertical: 4,
  },
  
  statsText: {
    fontSize: 14,
    color: Colors.textLight,
  },
  
  indicatorContainer: {
    alignSelf: 'flex-end',
    marginTop: 4,
  },
});

export default RecentCategoryCard;