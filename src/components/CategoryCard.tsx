// src/components/CategoryCard.tsx - Крупные современные карточки для 25 категорий

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Category } from '../types';
import { Colors } from '../constants/Colors';
import { useAppLanguage } from '../contexts/LanguageContext';

const { width } = Dimensions.get('window');
// Крупные карточки для удобства чтения 3 языков
const cardWidth = (width - 48) / 2; // 24px отступы по краям
const cardHeight = 200; // Увеличенная высота для 3 языков

interface CategoryCardProps {
  category: Category;
  onPress: () => void;
}

export default function CategoryCard({ category, onPress }: CategoryCardProps) {
  const { config } = useAppLanguage();
  const [scaleValue] = useState(new Animated.Value(1));

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.96,
      useNativeDriver: true,
      tension: 250,
      friction: 10,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
      tension: 250,
      friction: 10,
    }).start();
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={1}
      style={styles.cardContainer}
    >
      <Animated.View
        style={[
          styles.card,
          { transform: [{ scale: scaleValue }] }
        ]}
      >
        {/* Modern flat иконка */}
        <View style={[styles.iconContainer, { backgroundColor: category.color + '12' }]}>
          <Ionicons
            name={category.icon as any}
            size={28}
            color={category.color}
          />
        </View>
        
        {/* Текстовый контент с правильной иерархией */}
        <View style={styles.textContainer}>
          {/* ТУРКМЕНСКИЙ - основной (черный, жирный) */}
          <Text style={styles.turkmenText} numberOfLines={2}>
            {category.nameTk}
          </Text>
          
          {/* КИТАЙСКИЙ - серый, тоньше */}
          <Text style={styles.chineseText} numberOfLines={1}>
            {category.nameZh}
          </Text>
          
          {/* РУССКИЙ - серый, тоньше */}
          <Text style={styles.russianText} numberOfLines={1}>
            {category.nameRu}
          </Text>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    width: cardWidth,
    height: cardHeight,
    marginBottom: 16, // Равномерные отступы
  },
  
  card: {
    flex: 1,
    backgroundColor: Colors.cardBackground, // Белый фон
    borderRadius: 16, // Скруглённые углы
    padding: 20,
    justifyContent: 'space-between',
    
    // Лёгкая тень
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
    
    borderWidth: 0, // Без границ
  },

  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginBottom: 16,
  },

  textContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },

  // ТУРКМЕНСКИЙ - основной текст (черный, жирный)
  turkmenText: {
    fontSize: 17,
    fontWeight: '700', // Жирный
    color: Colors.textPrimary, // Черный
    lineHeight: 22,
    marginBottom: 8,
    textAlign: 'left',
  },

  // КИТАЙСКИЙ - вторичный (серый, тоньше)
  chineseText: {
    fontSize: 15,
    fontWeight: '500', // Средний
    color: Colors.textSecondary, // Серый
    lineHeight: 20,
    marginBottom: 6,
    opacity: 0.8,
  },

  // РУССКИЙ - вторичный (серый, тоньше)
  russianText: {
    fontSize: 14,
    fontWeight: '400', // Обычный
    color: Colors.textLight, // Светло-серый
    lineHeight: 18,
    opacity: 0.7,
  },
});