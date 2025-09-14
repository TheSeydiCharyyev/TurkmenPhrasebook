// src/components/CategoryCard.tsx - Современный дизайн без цветных границ

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Category } from '../types';
import { Colors } from '../constants/Colors';
import { useAppLanguage } from '../contexts/LanguageContext';

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2; // 24px margin on each side = 48px total
const cardHeight = 120;

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
      toValue: 0.95,
      useNativeDriver: true,
      tension: 300,
      friction: 10,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
      tension: 300,
      friction: 10,
    }).start();
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={1} // Отключаем встроенную анимацию, используем свою
      style={styles.cardContainer}
    >
      <Animated.View
        style={[
          styles.card,
          { transform: [{ scale: scaleValue }] }
        ]}
      >
        {/* Иконка с цветным фоном */}
        <View style={[styles.iconContainer, { backgroundColor: category.color + '15' }]}>
          <Text style={[styles.icon, { color: category.color }]}>
            {category.icon}
          </Text>
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
        
        {/* Стрелка перехода */}
        <View style={styles.arrowContainer}>
          <Ionicons 
            name="chevron-forward" 
            size={16} 
            color={Colors.textLight}
          />
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    width: cardWidth,
    height: cardHeight,
    marginBottom: 16,
  },
  
  card: {
    flex: 1,
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: 16,
    justifyContent: 'space-between',
    
    // Современная лёгкая тень
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    
    // Убираем любые границы
    borderWidth: 0,
  },

  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginBottom: 8,
  },

  icon: {
    fontSize: 20,
    fontWeight: '500',
  },

  textContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },

  primaryText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
    lineHeight: 18,
    marginBottom: 4,
  },

  chineseText: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.textSecondary,
    lineHeight: 16,
    marginBottom: 2,
  },

  secondaryText: {
    fontSize: 12,
    fontWeight: '400',
    color: Colors.textLight,
    lineHeight: 14,
  },

  arrowContainer: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
});