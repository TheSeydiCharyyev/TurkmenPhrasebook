// src/components/CategoryCard.tsx - Крупные современные карточки

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Category } from '../types';
import { Colors } from '../constants/Colors';
import { useAppLanguage } from '../contexts/LanguageContext';

const { width } = Dimensions.get('window');
// Крупные карточки: 3 строки по 2 карточки
const cardWidth = (width - 48) / 2; // 24px margin on each side
const cardHeight = 160; // Увеличенная высота для большего удобства

interface CategoryCardProps {
  category: Category;
  onPress: () => void;
}

export default function CategoryCard({ category, onPress }: CategoryCardProps) {
  const { config } = useAppLanguage();
  const [scaleValue] = useState(new Animated.Value(1));

  const getCategoryName = () => {
    switch (config.mode) {
      case 'tk': return category.nameTk;
      case 'zh': return category.nameZh;
      default: return category.nameRu;
    }
  };

  const getSecondaryName = () => {
    switch (config.mode) {
      case 'tk': return category.nameRu;
      case 'zh': return category.nameRu;
      default: return category.nameTk;
    }
  };

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
        {/* Профессиональная иконка Ionicons */}
        <View style={[styles.iconContainer, { backgroundColor: category.color + '15' }]}>
          <Ionicons
            name={category.icon as any}
            size={32}
            color={category.color}
          />
        </View>
        
        {/* Текстовый контент */}
        <View style={styles.textContainer}>
          <Text style={styles.primaryText} numberOfLines={2}>
            {getCategoryName()}
          </Text>
          
          <Text style={styles.chineseText} numberOfLines={1}>
            {category.nameZh}
          </Text>
          
          <Text style={styles.secondaryText} numberOfLines={1}>
            {getSecondaryName()}
          </Text>
        </View>
        
        {/* Тонкая цветная полоска снизу */}
        <View style={[styles.colorAccent, { backgroundColor: category.color }]} />
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    width: cardWidth,
    height: cardHeight,
    marginBottom: 20, // Увеличенный отступ между рядами
  },
  
  card: {
    flex: 1,
    backgroundColor: Colors.cardBackground,
    borderRadius: 20, // Более скруглённые углы
    padding: 20, // Больше внутренних отступов
    justifyContent: 'space-between',
    position: 'relative',
    
    // Профессиональная тень
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    
    borderWidth: 0,
  },

  iconContainer: {
    width: 56, // Крупнее иконка
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginBottom: 12,
  },

  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },

  primaryText: {
    fontSize: 17, // Крупнее текст
    fontWeight: '700', // Жирнее
    color: Colors.textPrimary,
    lineHeight: 22,
    marginBottom: 6,
    textAlign: 'left',
  },

  chineseText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
    lineHeight: 18,
    marginBottom: 4,
  },

  secondaryText: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.textLight,
    lineHeight: 16,
  },

  // Тонкая цветная полоска внизу карточки
  colorAccent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
});