// src/components/CategoryCard.tsx - ПРОФЕССИОНАЛЬНАЯ ВЕРСИЯ

import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { Category } from '../types';
import { Colors } from '../constants/Colors';
import { TextStyles } from '../constants/Typography';
import { useAppLanguage } from '../contexts/LanguageContext';
import { useAnimations } from '../hooks/useAnimations';
import { getCategoryName } from '../data/categories';

const { width } = Dimensions.get('window');
const cardWidth = (width - 60) / 2;

interface CategoryCardProps {
  category: Category;
  onPress: () => void;
  style?: any;
}

// ✅ ПРОФЕССИОНАЛЬНЫЕ ИКОНКИ вместо эмодзи
const getCategoryIcon = (categoryId: string): string => {
  const iconMap: Record<string, string> = {
    greetings: 'hand-left-outline',
    emergency: 'warning-outline',
    hotel: 'bed-outline',
    food: 'restaurant-outline',
    shopping: 'bag-handle-outline',
    transport: 'car-outline',
    directions: 'map-outline',
    health: 'medical-outline',
    money: 'card-outline',
    communication: 'call-outline',
    entertainment: 'musical-notes-outline',
    time: 'time-outline',
    numbers: 'calculator-outline',
    weather: 'partly-sunny-outline',
  };
  
  return iconMap[categoryId] || 'help-circle-outline';
};

// ✅ ЦВЕТОВЫЕ ГРАДИЕНТЫ для более профессионального вида
const getCategoryGradient = (color: string): [string, string] => {
  const gradients: Record<string, [string, string]> = {
    '#FF6B6B': ['#FF6B6B', '#FF8E8E'],
    '#FF4757': ['#FF4757', '#FF6B7A'],
    '#3742FA': ['#3742FA', '#5A6FFF'],
    '#2ED573': ['#2ED573', '#54E895'],
    '#FFA502': ['#FFA502', '#FFB733'],
    '#5352ED': ['#5352ED', '#7371FC'],
    '#FF3838': ['#FF3838', '#FF5B5B'],
    '#FF6348': ['#FF6348', '#FF7F69'],
    '#F1C40F': ['#F1C40F', '#F4D03F'],
    '#00D2D3': ['#00D2D3', '#26E0E1'],
    '#E056FD': ['#E056FD', '#E674FE'],
    '#686DE0': ['#686DE0', '#8B90E8'],
    '#30336B': ['#30336B', '#4A4F8A'],
    '#74C0FC': ['#74C0FC', '#92CCFD'],
  };
  
  return gradients[color] || [color, color];
};

export default function CategoryCard({ category, onPress, style }: CategoryCardProps) {
  const { config } = useAppLanguage();
  const { scaleAnim, pressAnimation, hapticFeedback } = useAnimations();
  
  const categoryNames = getCategoryName(category, config.mode);
  const iconName = getCategoryIcon(category.id);
  const gradient = getCategoryGradient(category.color);

  const handlePress = useCallback(() => {
    hapticFeedback('medium');
    pressAnimation();
    onPress();
  }, [onPress, hapticFeedback, pressAnimation]);

  const handlePressIn = useCallback(() => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
      tension: 100,
      friction: 6,
    }).start();
  }, [scaleAnim]);

  const handlePressOut = useCallback(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 100,
      friction: 6,
    }).start();
  }, [scaleAnim]);

  return (
    <Animated.View style={[
      styles.container,
      style,
      { transform: [{ scale: scaleAnim }] }
    ]}>
      <TouchableOpacity
        style={styles.card}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
      >
        {/* ✅ ГРАДИЕНТНЫЙ ФОН для премиум-вида */}
        <LinearGradient
          colors={[gradient[0] + '15', gradient[1] + '08']}
          style={styles.gradientBackground}
        />
        
        {/* ✅ ПРОФЕССИОНАЛЬНАЯ ИКОНКА */}
        <View style={[styles.iconContainer, { backgroundColor: gradient[0] + '20' }]}>
          <LinearGradient
            colors={gradient}
            style={styles.iconGradient}
          >
            <Ionicons 
              name={iconName as any} 
              size={28} 
              color="white" 
            />
          </LinearGradient>
        </View>

        {/* ✅ КОНТЕНТ С ПРАВИЛЬНОЙ ИЕРАРХИЕЙ */}
        <View style={styles.content}>
          {/* Основное название (родной язык) */}
          <Text 
            style={[styles.primaryName, { color: gradient[0] }]} 
            numberOfLines={2}
            adjustsFontSizeToFit
          >
            {categoryNames.primary}
          </Text>
          
          {/* Изучаемый язык */}
          <Text style={styles.learningName} numberOfLines={1}>
            {categoryNames.learning}
          </Text>
          
          {/* Язык-помощник */}
          <Text style={styles.helperName} numberOfLines={1}>
            {categoryNames.helper}
          </Text>
        </View>

        {/* ✅ СТИЛЬНАЯ СТРЕЛКА с градиентом */}
        <View style={styles.arrowWrapper}>
          <LinearGradient
            colors={gradient}
            style={styles.arrowContainer}
          >
            <Ionicons 
              name="chevron-forward" 
              size={18} 
              color="white" 
            />
          </LinearGradient>
        </View>

        {/* ✅ ДЕКОРАТИВНЫЕ ЭЛЕМЕНТЫ */}
        <View style={[styles.decorativeCircle1, { backgroundColor: gradient[0] + '10' }]} />
        <View style={[styles.decorativeCircle2, { backgroundColor: gradient[1] + '15' }]} />
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: cardWidth,
    marginBottom: 16,
  },

  card: {
    height: 160,
    borderRadius: 20,
    backgroundColor: 'white',
    padding: 20,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: Colors.border + '40',
  },

  gradientBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  // ✅ ПРОФЕССИОНАЛЬНАЯ ИКОНКА с градиентом
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
  },

  iconGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // ✅ ПРАВИЛЬНАЯ ТИПОГРАФИКА
  content: {
    flex: 1,
    justifyContent: 'flex-start',
  },

  primaryName: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 20,
    marginBottom: 6,
    letterSpacing: 0.2,
  },

  learningName: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.textSecondary,
    lineHeight: 16,
    marginBottom: 4,
    letterSpacing: 0.1,
  },

  helperName: {
    fontSize: 11,
    fontWeight: '400',
    color: Colors.textLight,
    lineHeight: 14,
    letterSpacing: 0.1,
  },

  // ✅ ИДЕАЛЬНО ВЫРОВНЕННАЯ СТРЕЛКА
  arrowWrapper: {
    position: 'absolute',
    right: 16,
    top: '50%',
    marginTop: -18,
  },

  arrowContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },

  // ✅ ДЕКОРАТИВНЫЕ ЭЛЕМЕНТЫ для премиум-вида
  decorativeCircle1: {
    position: 'absolute',
    top: -20,
    right: -20,
    width: 60,
    height: 60,
    borderRadius: 30,
    opacity: 0.6,
  },

  decorativeCircle2: {
    position: 'absolute',
    bottom: -15,
    left: -15,
    width: 40,
    height: 40,
    borderRadius: 20,
    opacity: 0.4,
  },
});