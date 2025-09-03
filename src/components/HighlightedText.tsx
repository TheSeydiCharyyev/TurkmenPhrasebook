// src/components/HighlightedText.tsx
import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/Colors';

interface HighlightedTextProps {
  text: string;
  searchQuery: string;
  style?: any;
  highlightStyle?: any;
  language?: 'chinese' | 'turkmen' | 'russian';
}

export default function HighlightedText({ 
  text, 
  searchQuery, 
  style, 
  highlightStyle,
  language = 'chinese'
}: HighlightedTextProps) {
  
  if (!searchQuery.trim()) {
    return <Text style={style}>{text}</Text>;
  }

  // Создаем регулярное выражение для поиска совпадений (игнорируем регистр)
  const regex = new RegExp(`(${searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  
  // Разбиваем текст на части
  const parts = text.split(regex);
  
  // Получаем цвет подсветки в зависимости от языка
  const getHighlightColor = () => {
    switch (language) {
      case 'chinese':
        return Colors.primary;
      case 'turkmen':
        return Colors.accent;
      case 'russian':
        return Colors.warning;
      default:
        return Colors.primary;
    }
  };

  const defaultHighlightStyle = [
    styles.highlight,
    { backgroundColor: getHighlightColor() + '30', color: getHighlightColor() },
    highlightStyle
  ];

  return (
    <Text style={style}>
      {parts.map((part, index) => {
        // Проверяем, является ли эта часть совпадением
        const isMatch = regex.test(part) && part.trim().length > 0;
        
        return (
          <Text
            key={index}
            style={isMatch ? defaultHighlightStyle : undefined}
          >
            {part}
          </Text>
        );
      })}
    </Text>
  );
}

const styles = StyleSheet.create({
  highlight: {
    fontWeight: '700',
    paddingHorizontal: 2,
    paddingVertical: 1,
    borderRadius: 3,
  },
});