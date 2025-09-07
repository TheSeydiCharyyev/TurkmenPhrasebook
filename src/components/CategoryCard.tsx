// src/components/CategoryCard.tsx - Simplified Version (No Reanimated)
import React, { memo, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import { Category } from '../types';

const { width } = Dimensions.get('window');
const CARD_MARGIN = 12;
const CARDS_PER_ROW = 2;
const CARD_WIDTH = (width - (CARD_MARGIN * 3)) / CARDS_PER_ROW;
const CARD_HEIGHT = 120;

interface CategoryCardProps {
  category: Category;
  onPress: (category: Category) => void;
  index: number;
  accessibilityLabel?: string;
}

/**
 * Senior Implementation - Simplified Version
 * No external dependencies, pure React Native
 */

const CategoryCard = memo<CategoryCardProps>(({ 
  category, 
  onPress, 
  index,
  accessibilityLabel 
}) => {
  
  // Optimized press handler
  const handlePress = useCallback(() => {
    onPress(category);
  }, [category, onPress]);

  // Dynamic color scheme based on category
  const cardBackgroundColor = `${category.color}15`; // 15% opacity
  const iconColor = category.color;
  const borderColor = `${category.color}30`; // 30% opacity

  return (
    <View style={styles.cardContainer}>
      <TouchableOpacity
        style={[
          styles.card,
          {
            backgroundColor: cardBackgroundColor,
            borderColor: borderColor,
          }
        ]}
        onPress={handlePress}
        activeOpacity={0.7}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel || `Open ${category.nameRu} category`}
        accessibilityHint="Double tap to view phrases in this category"
      >
        
        {/* Icon Container */}
        <View style={styles.iconContainer}>
          <Text 
            style={[styles.categoryIcon, { color: iconColor }]}
            accessible={false}
          >
            {category.icon}
          </Text>
        </View>

        {/* Content Container */}
        <View style={styles.contentContainer}>
          <Text 
            style={styles.categoryTitle}
            numberOfLines={2}
            adjustsFontSizeToFit={true}
            minimumFontScale={0.8}
            accessible={true}
            accessibilityRole="text"
          >
            {category.nameRu}
          </Text>
          
          {/* Indicator */}
          <View style={styles.indicatorContainer}>
            <Ionicons 
              name="chevron-forward" 
              size={16} 
              color={iconColor}
              style={{ opacity: 0.7 }}
            />
          </View>
        </View>

      </TouchableOpacity>
    </View>
  );
});

CategoryCard.displayName = 'CategoryCard';

const styles = StyleSheet.create({
  cardContainer: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    marginBottom: CARD_MARGIN,
    // iOS shadow
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