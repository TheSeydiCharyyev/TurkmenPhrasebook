// src/components/SubCategoryCard.tsx - ИСПРАВЛЕННАЯ ВЕРСИЯ с идентичным дизайном
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SubCategory } from '../types';
import { Colors } from '../constants/Colors';
import { useAppLanguage } from '../contexts/LanguageContext';
import { getSubcategoryName } from '../data/categories';

const { width: screenWidth } = Dimensions.get('window');
const cardMargin = 20;
const cardSpacing = 12;
// ИСПРАВЛЕНО: Используем ТОЧНО такую же ширину как у основных категорий
const cardWidth = (screenWidth - (cardMargin * 2) - cardSpacing) / 2;

interface SubCategoryCardProps {
  subcategory: SubCategory;
  onPress: (subcategory: SubCategory) => void;
  phrasesCount?: number;
}

export default function SubCategoryCard({ subcategory, onPress, phrasesCount = 0 }: SubCategoryCardProps) {
  const { config } = useAppLanguage();
  const subcategoryName = getSubcategoryName(subcategory, config.mode);

  return (
    <TouchableOpacity
      // ИСПРАВЛЕНО: ТОЧНО такие же стили как у CategoryCard
      style={[
        styles.card,
        { 
          backgroundColor: subcategory.color,
          width: cardWidth,
        }
      ]}
      onPress={() => onPress(subcategory)}
      activeOpacity={0.8}
    >
      {/* ИСПРАВЛЕНО: Точно такая же структура как у CategoryCard */}
      
      {/* Иконка в том же стиле */}
      <View style={[styles.iconContainer, { backgroundColor: Colors.textWhite + '20' }]}>
        <Ionicons 
          name={subcategory.icon as any} 
          size={24} 
          color={Colors.textWhite} 
        />
      </View>

      {/* Название подкатегории */}
      <Text style={styles.title} numberOfLines={2}>
        {subcategoryName}
      </Text>

      {/* Счетчик фраз в том же стиле */}
      <View style={styles.phrasesContainer}>
        <Text style={styles.phrasesCount}>
          {phrasesCount}
        </Text>
        <Text style={styles.phrasesLabel}>
          {config.mode === 'tk' ? 'sözlem' :
           config.mode === 'zh' ? '短语' : 
           'фраз'}
        </Text>
      </View>

      {/* Стрелка в том же месте */}
      <View style={styles.arrowContainer}>
        <Ionicons 
          name="chevron-forward" 
          size={16} 
          color={Colors.textWhite + '80'} 
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  // ИСПРАВЛЕНО: ТОЧНО ТАКИЕ ЖЕ стили как у CategoryCard
  card: {
    height: 140, // Такая же высота
    borderRadius: 16, // Такие же скругления
    padding: 16, // Такие же отступы
    marginBottom: 16, // Такие же отступы снизу
    position: 'relative',
    justifyContent: 'space-between',
    // ИСПРАВЛЕНО: Такие же тени
    elevation: 4,
    shadowColor: Colors.cardShadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  iconContainer: {
    width: 44, // Такой же размер
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start', // Такое же позиционирование
  },
  title: {
    fontSize: 15, // Такой же размер
    fontWeight: '600', // Такая же жирность
    color: Colors.textWhite,
    textAlign: 'left', // Такое же выравнивание
    lineHeight: 20, // Такая же высота строки
    marginTop: 8,
    flex: 1,
  },
  phrasesContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 4, // Такой же отступ
  },
  phrasesCount: {
    fontSize: 18, // Такой же размер
    fontWeight: '700', // Такая же жирность
    color: Colors.textWhite,
    marginRight: 4,
  },
  phrasesLabel: {
    fontSize: 12, // Такой же размер
    color: Colors.textWhite + '80', // Такая же прозрачность
    fontWeight: '500',
  },
  arrowContainer: {
    position: 'absolute',
    top: 12, // Такая же позиция
    right: 12, // Такая же позиция
  },
});

// ИСПРАВЛЕНО: Компонент сетки подкатегорий с правильными отступами
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
        {subcategories.map((subcategory, index) => (
          <View
            key={subcategory.id}
            style={[
              gridStyles.cardWrapper,
              // ИСПРАВЛЕНО: Правильные отступы как у основных категорий
              index % 2 === 0 ? gridStyles.leftCard : gridStyles.rightCard
            ]}
          >
            <SubCategoryCard
              subcategory={subcategory}
              onPress={onSubcategoryPress}
              phrasesCount={getPhrasesCount ? getPhrasesCount(subcategory.id) : 0}
            />
          </View>
        ))}
      </View>
    </View>
  );
}

const gridStyles = StyleSheet.create({
  container: {
    paddingHorizontal: 20, // Такие же боковые отступы как у основных
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  cardWrapper: {
    width: cardWidth, // ИСПРАВЛЕНО: Точно такая же ширина
  },
  leftCard: {
    marginRight: cardSpacing / 2, // Половина spacing справа
  },
  rightCard: {
    marginLeft: cardSpacing / 2, // Половина spacing слева
  },
});

// Компонент для одной подкатегории в списке (если нужен альтернативный вид)
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