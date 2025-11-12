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
  card: { borderRadius: 20, flex: 1, width: '100%', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 16, elevation: 8, overflow: 'hidden' },
  whiteContainer: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', paddingVertical: 16, paddingHorizontal: 20, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 20 },
  emojiContainer: { width: 70, height: 70, alignItems: 'center', justifyContent: 'center', marginRight: 20 },
  emojiIcon: { fontSize: 50 },
  textContainer: { flex: 1, justifyContent: 'center', alignItems: 'flex-start' },
  primaryName: { fontSize: 24, fontWeight: '900', color: '#111827', textAlign: 'left', marginBottom: 4, lineHeight: 30 },
  secondaryName: { fontSize: 14, fontWeight: '600', color: '#9CA3AF', textAlign: 'left', lineHeight: 18 },
  rtlText: { writingDirection: 'rtl', textAlign: 'right' }
});
