// src/components/RecentCategoryCard.tsx - Современный дизайн без границ

import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Импорты
import { Phrase } from '../types';
import { Colors } from '../constants/Colors';
import { useAnimations } from '../hooks/useAnimations';
import { useAppLanguage } from '../contexts/LanguageContext';

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2; // Такой же как CategoryCard
const cardHeight = 120;

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
  const [scaleValue] = useState(new Animated.Value(1));

  const handlePress = useCallback(() => {
    hapticFeedback('medium');
    onPress();
  }, [onPress, hapticFeedback]);

  const handleLongPress = useCallback(() => {
    hapticFeedback('heavy');
    onStatsPress();
  }, [onStatsPress, hapticFeedback]);

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
      style={styles.cardContainer}
      onPress={handlePress}
      onLongPress={handleLongPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={1}
    >
      <Animated.View
        style={[
          styles.card,
          { transform: [{ scale: scaleValue }] }
        ]}
      >
        {/* Иконка с цветным фоном */}
        <View style={styles.iconContainer}>
          <Text style={styles.categoryIcon}>📚</Text>
        </View>

        {/* Текстовый контент */}
        <View style={styles.textContainer}>
          <Text style={styles.primaryText} numberOfLines={2}>
            {config.mode === 'tk' ? 'Soňky öwrenilen' :
             config.mode === 'zh' ? '最近学习的' :
             'Недавние фразы'}
          </Text>

          <Text style={styles.chineseText} numberOfLines={1}>
            最近学习
          </Text>

          <Text style={styles.secondaryText} numberOfLines={1}>
            {recentPhrases.length} {config.mode === 'tk' ? 'sözlem' : 
                                   config.mode === 'zh' ? '短语' : 'фраз'}
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
});

RecentCategoryCard.displayName = 'RecentCategoryCard';

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
    
    // Современная лёгкая тень - точно такая же как у CategoryCard
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
    backgroundColor: Colors.primary + '15', // Легкий оттенок основного цвета
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  
  categoryIcon: {
    fontSize: 20,
    fontWeight: '500',
    color: Colors.primary,
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

export default RecentCategoryCard;