// src/components/CategoryCard.tsx - MODERN HERO + GRID DESIGN with Emoji Icons

import React, { useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Category } from '../types';
import { Colors } from '../constants/Colors';
import { useAnimations } from '../hooks/useAnimations';

interface CategoryCardProps {
  category: Category;
  onPress: (category: Category) => void;
  languageMode: string;  // ✅ ОБНОВЛЕНО: поддержка всех 30 языков
}

export default function CategoryCard({ category, onPress, languageMode }: CategoryCardProps) {
  const { hapticFeedback } = useAnimations();

  const handlePress = useCallback(() => {
    hapticFeedback('light');
    onPress(category);
  }, [category, onPress, hapticFeedback]);

  // ✅ УНИВЕРСАЛЬНАЯ функция для ВСЕХ 31 языков
  const getCategoryName = (langCode: string): string => {
    // Динамический доступ к полю с названием по коду языка
    const fieldName = `name${langCode.charAt(0).toUpperCase() + langCode.slice(1)}` as keyof Category;
    const name = category[fieldName];

    // Если есть перевод, возвращаем его, иначе fallback на английский
    return (typeof name === 'string' ? name : category.nameEn);
  };

  // ✅ Проверка RTL языков (справа налево)
  const isRTL = (langCode: string): boolean => {
    return ['ar', 'fa', 'ur', 'ps'].includes(langCode);
  };

  const getCategoryNames = () => {
    if (languageMode === 'tk') {
      // Туркменский режим: Туркменский + Английский
      return {
        primary: category.nameTk,
        secondary: category.nameEn,
        isRTLLanguage: false,
      };
    } else {
      // Любой другой язык: Выбранный язык + Туркменский
      return {
        primary: getCategoryName(languageMode),
        secondary: category.nameTk,
        isRTLLanguage: isRTL(languageMode),
      };
    }
  };

  const names = getCategoryNames();

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={handlePress}
      activeOpacity={0.85}
    >
      {/* ✅ БЕЛАЯ КАРТОЧКА - минимализм Apple/Notion style */}
      <View style={styles.whiteContainer}>
        {/* ✅ ЧИСТЫЙ эмодзи БЕЗ фона "тарелки" */}
        <Text style={styles.emojiIcon}>{category.icon}</Text>

        {/* Названия категории - с поддержкой RTL и numberOfLines */}
        <View style={styles.textContainer}>
          <Text
            style={[
              styles.primaryName,
              names.isRTLLanguage && styles.rtlText
            ]}
            numberOfLines={3}
          >
            {names.primary}
          </Text>
          <Text
            style={[
              styles.secondaryName,
              names.isRTLLanguage && styles.rtlText
            ]}
            numberOfLines={2}
          >
            {names.secondary}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  // ✅ БЕЛАЯ КАРТОЧКА - Apple/Notion минимализм
  card: {
    borderRadius: 20,
    height: 260,               // ✅ ЕДИНСТВЕННАЯ ФИКСИРОВАННАЯ высота здесь!
    width: '100%',
    // ✅ Мощные тени для глубины на белом фоне
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 8,
    overflow: 'hidden',        // ✅ Обрезает содержимое
  },

  // ✅ БЕЛЫЙ контейнер - заполняет родителя ПОЛНОСТЬЮ
  whiteContainer: {
    flex: 1,                   // ✅ НЕ height! flex: 1 заполняет card полностью
    backgroundColor: '#FFFFFF',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 20,
  },

  // ✅ ЭМОДЗИ - фиксированная высота
  emojiIcon: {
    fontSize: 52,               // ✅ Чуть меньше
    textAlign: 'center',
    height: 60,                 // ✅ Уменьшил с 70 до 60
    lineHeight: 60,
    marginBottom: 6,            // ✅ Уменьшил с 8 до 6
  },

  // ✅ TEXT CONTAINER - ФИКСИРОВАННАЯ высота
  textContainer: {
    height: 152,                // ✅ Увеличил с 142 до 152 (218 - 60 - 6 = 152)
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: 16,
  },

  // ✅ PRIMARY (выбранный язык) - КРУПНЕЕ и жирнее
  primaryName: {
    fontSize: 19,              // ✅ УВЕЛИЧИЛ до 19
    fontWeight: '800',         // ✅ Более жирный
    color: '#111827',          // ✅ Более темный для акцента
    textAlign: 'center',
    marginBottom: 6,           // ✅ Меньше отступ
    lineHeight: 24,
  },

  // ✅ SECONDARY (туркменский) - МЕНЬШЕ
  secondaryName: {
    fontSize: 13,              // ✅ УМЕНЬШИЛ до 13
    fontWeight: '500',         // ✅ Менее жирный
    color: '#9CA3AF',          // ✅ Светлее для меньшего акцента
    textAlign: 'center',
    lineHeight: 17,
  },

  // ✅ ПОДДЕРЖКА RTL для арабского/персидского/урду/пушту
  rtlText: {
    writingDirection: 'rtl',
    textAlign: 'right',        // ✅ Выравнивание справа для RTL
  },
});