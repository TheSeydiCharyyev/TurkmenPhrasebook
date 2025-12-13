// src/components/CategoryCard.tsx - ВАРИАНТ 2: Крупный текст + Material Design

import React, { useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Category } from '../types';
import { Colors } from '../constants/Colors';
import { useAnimations } from '../hooks/useAnimations';

interface CategoryCardProps {
  category: Category;
  onPress: (category: Category) => void;
  languageMode: string;
}

export default function CategoryCard({ category, onPress, languageMode }: CategoryCardProps) {
  const { hapticFeedback } = useAnimations();
  const handlePress = useCallback(() => { hapticFeedback('light'); onPress(category); }, [category, onPress, hapticFeedback]);
  const getCategoryName = (langCode: string): string => {
    const fieldName = ('name' + langCode.charAt(0).toUpperCase() + langCode.slice(1)) as keyof Category;
    const name = category[fieldName];
    return (typeof name === 'string' ? name : category.nameEn);
  };
  const isRTL = (langCode: string): boolean => { return ['ar', 'fa', 'ur', 'ps'].includes(langCode); };
  const getCategoryNames = () => {
    if (languageMode === 'tk') {
      return { primary: category.nameTk, secondary: category.nameEn, isRTLLanguage: false };
    } else {
      return { primary: getCategoryName(languageMode), secondary: category.nameTk, isRTLLanguage: isRTL(languageMode) };
    }
  };
  const names = getCategoryNames();
  return (
    <TouchableOpacity style={styles.card} onPress={handlePress} activeOpacity={0.85}>
      <View style={styles.whiteContainer}>
        <View style={styles.emojiContainer}>
          <Text style={styles.emojiIcon}>{category.icon}</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.primaryName, names.isRTLLanguage && styles.rtlText]} numberOfLines={2}>{names.primary}</Text>
          <Text style={[styles.secondaryName, names.isRTLLanguage && styles.rtlText]} numberOfLines={1}>{names.secondary}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 20, elevation: 8, flex: 1, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 16, width: '100%' },
  emojiContainer: { alignItems: 'center', height: 70, justifyContent: 'center', marginRight: 20, width: 70 },
  emojiIcon: { fontSize: 50 },
  primaryName: { color: '#111827', fontSize: 24, fontWeight: '900', lineHeight: 30, marginBottom: 4, textAlign: 'left' },
  rtlText: { textAlign: 'right', writingDirection: 'rtl' },
  secondaryName: { color: '#9CA3AF', fontSize: 14, fontWeight: '600', lineHeight: 18, textAlign: 'left' },
  textContainer: { alignItems: 'flex-start', flex: 1, justifyContent: 'center' },
  whiteContainer: { alignItems: 'center', backgroundColor: '#FFFFFF', borderColor: '#E5E7EB', borderRadius: 20, borderWidth: 1, flex: 1, flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 16 }
});
