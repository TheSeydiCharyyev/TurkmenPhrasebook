// src/components/SubCategoryCard.tsx - Карточка подкатегории

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SubCategory } from '../types';
import { Colors } from '../constants/Colors';
import { getSubcategoryName } from '../data/categories';
import { useAppLanguage } from '../contexts/LanguageContext';

const { width } = Dimensions.get('window');
const cardWidth = (width - 60) / 2; // 2 колонки с отступами

interface SubCategoryCardProps {
  subcategory: SubCategory;
  onPress: (subcategory: SubCategory) => void;
  phrasesCount?: number; // Количество фраз в подкатегории
  style?: any;
}

export default function SubCategoryCard({ 
  subcategory, 
  onPress, 
  phrasesCount = 0,
  style 
}: SubCategoryCardProps) {
  const { config } = useAppLanguage();

  const handlePress = () => {
    onPress(subcategory);
  };

  // Получаем название на текущем языке
  const subcategoryName = getSubcategoryName(subcategory, config.mode);

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: subcategory.color + '15' }, style]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      {/* Иконка */}
      <View style={[styles.iconContainer, { backgroundColor: subcategory.color + '25' }]}>
        <Ionicons 
          name={subcategory.icon as any} 
          size={28} 
          color={subcategory.color} 
        />
      </View>

      {/* Название подкатегории */}
      <Text style={styles.title} numberOfLines={2}>
        {subcategoryName}
      </Text>

      {/* Количество фраз */}
      <View style={styles.phrasesContainer}>
        <Text style={[styles.phrasesCount, { color: subcategory.color }]}>
          {phrasesCount}
        </Text>
        <Text style={styles.phrasesLabel}>
          {config.mode === 'tk' ? 'sözlem' :
           config.mode === 'zh' ? '短语' : 
           'фраз'}
        </Text>
      </View>

      {/* Стрелка для перехода */}
      <View style={styles.arrowContainer}>
        <Ionicons 
          name="chevron-forward" 
          size={16} 
          color={Colors.textLight} 
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: cardWidth,
    height: 140,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    position: 'relative',
    justifyContent: 'space-between',
    elevation: 2,
    shadowColor: Colors.cardShadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'left',
    lineHeight: 18,
    marginTop: 8,
    flex: 1,
  },
  phrasesContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 4,
  },
  phrasesCount: {
    fontSize: 16,
    fontWeight: '700',
    marginRight: 4,
  },
  phrasesLabel: {
    fontSize: 12,
    color: Colors.textLight,
    fontWeight: '500',
  },
  arrowContainer: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
});

// Компонент для отображения подкатегорий в виде сетки
export function SubCategoriesGrid({ 
  subcategories, 
  onSubcategoryPress,
  getPhrasesCount,
}: {
  subcategories: SubCategory[];
  onSubcategoryPress: (subcategory: SubCategory) => void;
  getPhrasesCount?: (subcategoryId: string) => number;
}) {
  return (
    <View style={gridStyles.container}>
      <View style={gridStyles.grid}>
        {subcategories.map((subcategory) => (
          <SubCategoryCard
            key={subcategory.id}
            subcategory={subcategory}
            onPress={onSubcategoryPress}
            phrasesCount={getPhrasesCount ? getPhrasesCount(subcategory.id) : 0}
          />
        ))}
      </View>
    </View>
  );
}

const gridStyles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});

// Компонент для одной подкатегории в списке (альтернативный вид)
export function SubCategoryListItem({ 
  subcategory, 
  onPress, 
  phrasesCount = 0 
}: SubCategoryCardProps) {
  const { config } = useAppLanguage();
  const subcategoryName = getSubcategoryName(subcategory, config.mode);

  return (
    <TouchableOpacity
      style={listStyles.item}
      onPress={() => onPress(subcategory)}
      activeOpacity={0.7}
    >
      {/* Левая часть */}
      <View style={listStyles.leftContent}>
        <View style={[listStyles.iconContainer, { backgroundColor: subcategory.color + '20' }]}>
          <Ionicons 
            name={subcategory.icon as any} 
            size={24} 
            color={subcategory.color} 
          />
        </View>
        
        <View style={listStyles.textContainer}>
          <Text style={listStyles.title}>{subcategoryName}</Text>
          <Text style={listStyles.subtitle}>
            {phrasesCount} {config.mode === 'tk' ? 'sözlem' :
                          config.mode === 'zh' ? '短语' : 'фраз'}
          </Text>
        </View>
      </View>

      {/* Стрелка */}
      <Ionicons 
        name="chevron-forward" 
        size={20} 
        color={Colors.textLight} 
      />
    </TouchableOpacity>
  );
}

const listStyles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: Colors.cardBackground,
    marginHorizontal: 20,
    marginBottom: 8,
    borderRadius: 12,
    elevation: 1,
    shadowColor: Colors.cardShadow,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textLight,
    fontWeight: '500',
  },
});