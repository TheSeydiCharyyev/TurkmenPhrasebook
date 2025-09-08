// src/components/CategoryCard.tsx - ПОЛНОСТЬЮ ИСПРАВЛЕННАЯ ВЕРСИЯ

import React, { useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Импорты
import { Category } from '../types';
import { Colors } from '../constants/Colors';
import { useAnimations } from '../hooks/useAnimations';
import { useAppLanguage } from '../contexts/LanguageContext';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2; // 48 = padding 16 * 2 + gap 16
const CARD_HEIGHT = 120;
const CARD_MARGIN = 8;

interface CategoryCardProps {
  category: Category;
  onPress: (category: Category) => void;
  index?: number;
}

const CategoryCard = React.memo<CategoryCardProps>(({ 
  category, 
  onPress, 
  index = 0 
}) => {
  const { hapticFeedback } = useAnimations();
  const { config } = useAppLanguage();

  const handlePress = useCallback(() => {
    hapticFeedback('light');
    onPress(category);
  }, [category, onPress, hapticFeedback]);

  // ✅ ИСПРАВЛЕНО: Правильное название категории в зависимости от языка
  const categoryTitle = useMemo(() => {
    switch (config.mode) {
      case 'tk': 
        return category.nameTk; // ТҮРКМЕНЧЕ (заглавными)
      case 'zh': 
        return category.nameZh; // 中文 (средними)
      default: 
        return category.nameRu; // русский (маленькими)
    }
  }, [category, config.mode]);

  // Создаем стили динамически для каждой карточки
  const cardStyle = useMemo(() => [
    styles.card,
    {
      backgroundColor: Colors.cardBackground,
      borderColor: category.color + '20', // Легкая граница в цвете категории
      // Тень в зависимости от индекса для разнообразия
      shadowColor: category.color,
      shadowOpacity: 0.15,
      elevation: 3,
    }
  ], [category.color]);

  return (
    <View style={styles.cardContainer}>
      <TouchableOpacity
        style={cardStyle}
        onPress={handlePress}
        activeOpacity={0.7}
      >
        {/* Иконка категории */}
        <View style={styles.iconContainer}>
          <Text style={[styles.categoryIcon, { color: category.color }]}>
            {category.icon}
          </Text>
        </View>

        {/* Контент */}
        <View style={styles.contentContainer}>
          {/* ✅ ИСПРАВЛЕНО: Правильное название */}
          <Text style={styles.categoryTitle} numberOfLines={2}>
            {categoryTitle}
          </Text>

          {/* Индикатор */}
          <View style={styles.indicatorContainer}>
            <Ionicons 
              name="chevron-forward" 
              size={16} 
              color={category.color} 
            />
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
});

CategoryCard.displayName = 'CategoryCard';

// ✅ ИСПРАВЛЕНО: Единообразные стили для всех карточек
const styles = StyleSheet.create({
  cardContainer: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    marginBottom: CARD_MARGIN,
    // iOS shadow - единообразная для всех карточек
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // Android shadow
    elevation: 2,
  },
  
  card: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
  },
  
  iconContainer: {
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  
  categoryIcon: {
    fontSize: 32,
    lineHeight: 36,
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
  
  indicatorContainer: {
    alignSelf: 'flex-end',
    marginTop: 4,
  },
});

export default CategoryCard;