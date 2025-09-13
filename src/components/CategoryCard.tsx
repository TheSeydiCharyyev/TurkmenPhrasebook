import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Category } from '../types';
import { Colors } from '../constants/Colors';
import { useAppLanguage } from '../contexts/LanguageContext';

interface CategoryCardProps {
  category: Category;
  onPress: () => void;
}

export default function CategoryCard({ category, onPress }: CategoryCardProps) {
  const { config } = useAppLanguage();

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

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: category.color + '15' }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>{category.icon}</Text>
      </View>
      
      <View style={styles.textContainer}>
        <Text style={styles.primaryText} numberOfLines={2}>
          {getCategoryName()}
        </Text>
        <Text style={styles.chineseText} numberOfLines={1}>
          {category.nameZh}
        </Text>
        <Text style={styles.secondaryText} numberOfLines={2}>
          {getSecondaryName()}
        </Text>
      </View>
      
      <View style={[styles.accent, { backgroundColor: category.color }]} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    height: 140,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 8,
    marginVertical: 6,
    backgroundColor: Colors.cardBackground,
    
    // Улучшенные тени и границы
    borderWidth: 1,
    borderColor: Colors.cardBorder + '40',
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
    
    position: 'relative',
  },

  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },

  icon: {
    fontSize: 20,
  },

  textContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },

  primaryText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    lineHeight: 20,
    marginBottom: 2,
  },

  chineseText: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.textSecondary,
    lineHeight: 16,
    marginBottom: 4,
  },

  secondaryText: {
    fontSize: 12,
    fontWeight: '400',
    color: Colors.textLight,
    lineHeight: 14,
    // Улучшенная читаемость для русского текста
    backgroundColor: Colors.background + '80',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },

  accent: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 4,
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
  },
});