// src/components/SubCategoryCard.tsx - ОБНОВЛЕННЫЙ дизайн как основные категории

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
const cardWidth = (width - 48) / 2; // 2 колонки с отступами как в основных категориях

interface SubCategoryCardProps {
  subcategory: SubCategory;
  onPress: (subcategory: SubCategory) => void;
  phrasesCount?: number;
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

  // Получаем названия для всех языков (как в основных категориях)
  const primaryName = config.mode === 'tk' ? subcategory.nameTk :
                     config.mode === 'zh' ? subcategory.nameZh :
                     subcategory.nameRu;

  const secondaryName = config.mode === 'tk' ? subcategory.nameZh :
                       config.mode === 'zh' ? subcategory.nameTk :
                       subcategory.nameTk;

  const tertiaryName = config.mode === 'tk' ? subcategory.nameRu :
                      config.mode === 'zh' ? subcategory.nameRu :
                      subcategory.nameZh;

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: Colors.cardBackground }, style]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      {/* Иконка - точно как в основных категориях */}
      <View style={[styles.iconContainer, { backgroundColor: subcategory.color + '20' }]}>
        <Ionicons 
          name={subcategory.icon as any} 
          size={28} 
          color={subcategory.color} 
        />
      </View>

      {/* Текстовый контейнер - точно как в основных категориях */}
      <View style={styles.textContainer}>
        {/* Основное название */}
        <Text style={styles.primaryName} numberOfLines={2}>
          {primaryName}
        </Text>
        
        {/* Вторичное название */}
        <Text style={styles.secondaryName} numberOfLines={1}>
          {secondaryName}
        </Text>
        
        {/* Третичное название */}
        <Text style={styles.tertiaryName} numberOfLines={1}>
          {tertiaryName}
        </Text>
      </View>

      {/* Индикатор количества фраз (вместо стрелки) */}
      {phrasesCount > 0 && (
        <View style={styles.phrasesContainer}>
          <Text style={[styles.phrasesCount, { color: subcategory.color }]}>
            {phrasesCount}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: cardWidth,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    height: 160, // Фиксированная высота как в основных категориях
    backgroundColor: Colors.cardBackground,
    marginBottom: 16,
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
    width: 60, // Точно как в основных категориях
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16, // Увеличили отступ как в основных
  },

  textContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: 8, // Добавили внутренние отступы
  },

  // Стили для трех строк текста с одинаковыми размерами - ТОЧНО КАК В ОСНОВНЫХ
  primaryName: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 6,
    lineHeight: 18,
    minHeight: 18, // Минимальная высота для строки
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

  // Индикатор количества фраз в правом верхнем углу
  phrasesContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: 'center',
  },

  phrasesCount: {
    fontSize: 12,
    fontWeight: '700',
  },
});

// Компонент для отображения подкатегорий в виде сетки 2x2 как основные категории
export function SubCategoriesGrid({ 
  subcategories, 
  onSubcategoryPress,
  getPhrasesCount,
}: {
  subcategories: SubCategory[];
  onSubcategoryPress: (subcategory: SubCategory) => void;
  getPhrasesCount?: (subcategoryId: string) => number;
}) {
  // Группируем подкатегории по парам для 2-колоночной сетки (как основные категории)
  const subcategoryPairs = [];
  for (let i = 0; i < subcategories.length; i += 2) {
    subcategoryPairs.push([
      subcategories[i],
      subcategories[i + 1] || null
    ]);
  }

  return (
    <View style={gridStyles.container}>
      {subcategoryPairs.map((pair, index) => (
        <View key={index} style={gridStyles.row}>
          <View style={[gridStyles.cardWrapper, gridStyles.leftCard]}>
            <SubCategoryCard
              subcategory={pair[0]}
              onPress={onSubcategoryPress}
              phrasesCount={getPhrasesCount ? getPhrasesCount(pair[0].id) : 0}
            />
          </View>
          
          {pair[1] && (
            <View style={[gridStyles.cardWrapper, gridStyles.rightCard]}>
              <SubCategoryCard
                subcategory={pair[1]}
                onPress={onSubcategoryPress}
                phrasesCount={getPhrasesCount ? getPhrasesCount(pair[1].id) : 0}
              />
            </View>
          )}
        </View>
      ))}
    </View>
  );
}

const gridStyles = StyleSheet.create({
  container: {
    paddingHorizontal: 16, // Как в основных категориях
  },
  
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 0, // Убираем дополнительный отступ, карточки сами имеют marginBottom
  },
  
  cardWrapper: {
    width: cardWidth,
  },
  
  leftCard: {
    marginRight: 8,
  },
  
  rightCard: {
    marginLeft: 8,
  },
});

// Компонент для отображения одной подкатегории в списке (альтернативный вид)
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