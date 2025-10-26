// src/components/CategoryCard.tsx - С PNG ИКОНКАМИ

import React, { useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { Category } from '../types';
import { Colors } from '../constants/Colors';
import { useAnimations } from '../hooks/useAnimations';

interface CategoryCardProps {
  category: Category;
  onPress: (category: Category) => void;
  languageMode: 'ru' | 'tk' | 'zh' | 'en';  // ✅ ДОБАВЛЕНО: поддержка английского
}

// Маппинг categoryId к PNG файлам
const CATEGORY_ICONS: { [key: string]: any } = {
  greetings: require('../../assets/icons/greetings.png'),
  emergency: require('../../assets/icons/emergency.png'),
  hotel: require('../../assets/icons/hotel.png'),
  food: require('../../assets/icons/food.png'),
  shopping: require('../../assets/icons/shopping.png'),
  transport: require('../../assets/icons/transport.png'),
  directions: require('../../assets/icons/directions.png'),
  health: require('../../assets/icons/health.png'),
  money: require('../../assets/icons/bank.png'), // используем bank.png для money
  communication: require('../../assets/icons/communication.png'),
  entertainment: require('../../assets/icons/entertainment.png'),
  time: require('../../assets/icons/time.png'),
  numbers: require('../../assets/icons/numbers.png'),
  weather: require('../../assets/icons/weather.png'),
  colors: require('../../assets/icons/colors.png'),
  body: require('../../assets/icons/body.png'),
  home: require('../../assets/icons/home.png'),
  customs: require('../../assets/icons/customs.png'),
  sports: require('../../assets/icons/sport.png'), // ИСПРАВЛЕНО: sports -> sport.png
  measurements: require('../../assets/icons/scales.png'), // ИСПРАВЛЕНО: measurements -> scales.png
  business: require('../../assets/icons/business.png'),
  personal_info: require('../../assets/icons/aboutme.png'), // ИСПРАВЛЕНО: personal_info -> aboutme.png
};

export default function CategoryCard({ category, onPress, languageMode }: CategoryCardProps) {
  const { hapticFeedback } = useAnimations();

  const handlePress = useCallback(() => {
    hapticFeedback('light');
    onPress(category);
  }, [category, onPress, hapticFeedback]);

  const getCategoryNames = () => {
    if (languageMode === 'zh') {
      return {
        primary: category.nameZh,
        secondary: category.nameTk,
        tertiary: category.nameRu
      };
    } else if (languageMode === 'ru') {
      return {
        primary: category.nameRu,
        secondary: category.nameZh,
        tertiary: category.nameTk
      };
    } else if (languageMode === 'en') {
      // ✅ АНГЛИЙСКИЙ: Английский → Туркменский → Русский
      return {
        primary: category.nameEn,
        secondary: category.nameTk,
        tertiary: category.nameRu
      };
    } else {
      // Туркменский по умолчанию
      return {
        primary: category.nameTk,
        secondary: category.nameZh,
        tertiary: category.nameRu
      };
    }
  };

  const names = getCategoryNames();
  
  // Получаем PNG иконку для категории
  const iconSource = CATEGORY_ICONS[category.id];

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: category.color + '15' }]}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      {/* PNG Иконка категории */}
      <View style={[styles.iconContainer, { backgroundColor: category.color + '25' }]}>
        {iconSource ? (
          <Image 
            source={iconSource}
            style={styles.iconImage}
            resizeMode="contain"
          />
        ) : (
          // Fallback если иконка не найдена
          <Text style={{ color: category.color, fontSize: 24 }}>?</Text>
        )}
      </View>

      {/* Названия категории */}
      <View style={styles.textContainer}>
        <Text style={styles.primaryName} numberOfLines={2}>
          {names.primary}
        </Text>
        <Text style={styles.secondaryName} numberOfLines={1}>
          {names.secondary}
        </Text>
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
    height: 160,
    width: '100%',
    backgroundColor: Colors.cardBackground,
  },

  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },

  iconImage: {
    width: 36,
    height: 36,
  },

  textContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: 8,
  },

  primaryName: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 6,
    lineHeight: 18,
    minHeight: 18,
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