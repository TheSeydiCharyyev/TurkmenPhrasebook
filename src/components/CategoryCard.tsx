// src/components/CategoryCard.tsx - ИСПРАВЛЕННАЯ ВЕРСИЯ с правильными языками

import React, { useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Category } from '../types';
import { Colors } from '../constants/Colors';
import { useAnimations } from '../hooks/useAnimations';

interface CategoryCardProps {
  category: Category;
  onPress: (category: Category) => void;
  languageMode: 'tk' | 'zh';
}

export default function CategoryCard({ category, onPress, languageMode }: CategoryCardProps) {
  const { hapticFeedback } = useAnimations();

  const handlePress = useCallback(() => {
    hapticFeedback('light');
    onPress(category);
  }, [category, onPress, hapticFeedback]);

  // ИСПРАВЛЕНО: Правильный порядок названий в зависимости от выбранного языка
  const getCategoryNames = () => {
    if (languageMode === 'zh') {
      // Когда выбран китайский - китайский сначала
      return {
        primary: category.nameZh,
        secondary: category.nameTk,
        tertiary: category.nameRu
      };
    } else {
      // Когда выбран туркменский - туркменский сначала
      return {
        primary: category.nameTk,
        secondary: category.nameZh,
        tertiary: category.nameRu
      };
    }
  };

  const names = getCategoryNames();

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: category.color + '15' }]}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      {/* Иконка категории */}
      <View style={[styles.iconContainer, { backgroundColor: category.color + '25' }]}>
        <Ionicons 
          name={category.icon as any} 
          size={32} 
          color={category.color} 
        />
      </View>

      {/* Названия категории */}
      <View style={styles.textContainer}>
        {/* Главное название */}
        <Text style={styles.primaryName} numberOfLines={2}>
          {names.primary}
        </Text>

        {/* Вторичное название */}
        <Text style={styles.secondaryName} numberOfLines={1}>
          {names.secondary}
        </Text>

        {/* Третье название (русский) */}
        <Text style={styles.tertiaryName} numberOfLines={1}>
          {names.tertiary}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    height: 160, // Фиксированная высота для всех карточек
    width: '100%', // Фиксированная ширина
    backgroundColor: Colors.cardBackground,
  },

  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16, // Увеличили отступ
  },

  textContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: 8, // Добавили внутренние отступы
  },

  // Стили для трех строк текста с одинаковыми размерами
  primaryName: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 6,
    lineHeight: 18,
    minHeight: 18, // Минимальная высота для строки
  },

  secondaryName: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 4,
    lineHeight: 16,
    minHeight: 16,
  },

  tertiaryName: {
    fontSize: 11,
    fontWeight: '400',
    color: Colors.textLight,
    textAlign: 'center',
    lineHeight: 14,
    minHeight: 14,
  },
});