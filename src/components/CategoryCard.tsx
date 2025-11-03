// src/components/CategoryCard.tsx - MODERN HERO + GRID DESIGN with Emoji Icons

import React, { useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Category } from '../types';
import { Colors } from '../constants/Colors';
import { useAnimations } from '../hooks/useAnimations';

interface CategoryCardProps {
  category: Category;
  onPress: (category: Category) => void;
  languageMode: string;  // ✅ ОБНОВЛЕНО: поддержка всех 30 языков
}

// Функция для создания градиента на основе базового цвета
const getGradientColors = (baseColor: string): string[] => {
  // Создаем более темный оттенок для градиента
  // Это простой подход - можно улучшить
  const gradientMap: { [key: string]: string[] } = {
    '#FF6B6B': ['#FF6B6B', '#EE5A6F'], // greetings - red
    '#FF4444': ['#FF4444', '#CC0000'], // emergency - bright red
    '#4ECDC4': ['#4ECDC4', '#44A8A0'], // hotel - teal
    '#FFB84D': ['#FFB84D', '#FF9500'], // food - orange
    '#A78BFA': ['#A78BFA', '#8B5CF6'], // shopping - purple
    '#60A5FA': ['#60A5FA', '#3B82F6'], // transport - blue
    '#34D399': ['#34D399', '#10B981'], // directions - green
    '#F87171': ['#F87171', '#EF4444'], // health - red
    '#FBBF24': ['#FBBF24', '#F59E0B'], // money - yellow
    '#818CF8': ['#818CF8', '#6366F1'], // communication - indigo
    '#FB923C': ['#FB923C', '#F97316'], // entertainment - orange
    '#06B6D4': ['#06B6D4', '#0891B2'], // time - cyan
    '#8B5CF6': ['#8B5CF6', '#7C3AED'], // numbers - purple
    '#3B82F6': ['#3B82F6', '#2563EB'], // weather - blue
    '#EC4899': ['#EC4899', '#DB2777'], // colors - pink
    '#F59E0B': ['#F59E0B', '#D97706'], // body - amber
    '#10B981': ['#10B981', '#059669'], // home - emerald
    '#6366F1': ['#6366F1', '#4F46E5'], // customs - indigo
    '#14B8A6': ['#14B8A6', '#0D9488'], // sports - teal
    '#F97316': ['#F97316', '#EA580C'], // measurements - orange
    '#64748B': ['#64748B', '#475569'], // business - slate
    '#6B7280': ['#6B7280', '#4B5563'], // personal_info - gray
  };

  return gradientMap[baseColor] || [baseColor, baseColor];
};

export default function CategoryCard({ category, onPress, languageMode }: CategoryCardProps) {
  const { hapticFeedback } = useAnimations();

  const handlePress = useCallback(() => {
    hapticFeedback('light');
    onPress(category);
  }, [category, onPress, hapticFeedback]);

  // ✅ УНИВЕРСАЛЬНАЯ функция для ВСЕХ 31 языков
  const getCategoryName = (langCode: string): string => {
    // Динамический доступ к полю с названием по коду языка
    const fieldName = `name${langCode.charAt(0).toUpperCase() + langCode.slice(1)}` as keyof Category;
    const name = category[fieldName];

    // Если есть перевод, возвращаем его, иначе fallback на английский
    return (typeof name === 'string' ? name : category.nameEn);
  };

  const getCategoryNames = () => {
    if (languageMode === 'tk') {
      // Туркменский режим: Туркменский + Английский
      return {
        primary: category.nameTk,
        secondary: category.nameEn,
      };
    } else {
      // Любой другой язык: Выбранный язык + Туркменский
      return {
        primary: getCategoryName(languageMode),
        secondary: category.nameTk,
      };
    }
  };

  const names = getCategoryNames();

  // Получаем градиентные цвета
  const gradientColors = getGradientColors(category.color);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={handlePress}
      activeOpacity={0.85}
    >
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientContainer}
      >
        {/* Эмодзи иконка категории */}
        <View style={styles.iconContainer}>
          <Text style={styles.emojiIcon}>{category.icon}</Text>
        </View>

        {/* Названия категории - только 2 (языковая пара) */}
        <View style={styles.textContainer}>
          <Text style={styles.primaryName} numberOfLines={2}>
            {names.primary}
          </Text>
          <Text style={styles.secondaryName} numberOfLines={2}>
            {names.secondary}
          </Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    height: 180,
    width: '100%',
    // Мощные тени для современного вида
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 10,
    overflow: 'hidden',
  },

  gradientContainer: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    // Небольшая тень для иконки
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },

  emojiIcon: {
    fontSize: 52,
    textAlign: 'center',
  },

  textContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: 8,
  },

  primaryName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 22,
    // Тень для текста
    textShadowColor: 'rgba(0, 0, 0, 0.35)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },

  secondaryName: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.95)',
    textAlign: 'center',
    lineHeight: 19,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});