// src/screens/CategoryScreen.tsx - ИСПРАВЛЕННАЯ ВЕРСИЯ (совместимая с текущей навигацией)

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Animated,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

import { Colors } from '../constants/Colors';
import { phrases } from '../data/phrases';
import { getCategoryName, getSubcategoriesByParentId } from '../data/categories';
import { Phrase, HomeStackParamList, SubCategory } from '../types';
import { useFavorites } from '../hooks/useFavorites';
import { useAppLanguage } from '../contexts/LanguageContext';
import { SubCategoriesGrid } from '../components/SubCategoryCard';

type CategoryScreenRouteProp = RouteProp<HomeStackParamList, 'CategoryScreen'>;
type CategoryScreenNavigationProp = StackNavigationProp<HomeStackParamList>;

// Компонент для отображения фразы
const PhraseItem = React.memo<{
  phrase: Phrase;
  onPress: (phrase: Phrase) => void;
  config: any;
}>(({ phrase, onPress, config }) => {
  const { isFavorite, toggleFavorite } = useFavorites();

  const handleToggleFavorite = useCallback(() => {
    toggleFavorite(phrase.id);
  }, [phrase.id, toggleFavorite]);

  const handlePress = useCallback(() => {
    onPress(phrase);
  }, [phrase, onPress]);

  // Получаем текст фразы в зависимости от языка
  const getPhraseText = () => {
    switch (config.mode) {
      case 'tk': return phrase.turkmen;
      case 'zh': return phrase.chinese;
      default: return phrase.russian;
    }
  };

  return (
    <TouchableOpacity
      style={styles.phraseItem}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={styles.phraseContent}>
        {/* Основной текст */}
        <Text style={styles.phraseText} numberOfLines={2}>
          {getPhraseText()}
        </Text>
        
        {/* Дополнительная информация */}
        <View style={styles.phraseDetails}>
          <Text style={styles.chineseText} numberOfLines={1}>
            {phrase.chinese}
          </Text>
          <Text style={styles.pinyinText} numberOfLines={1}>
            {phrase.pinyin}
          </Text>
        </View>
      </View>

      {/* Кнопка избранного */}
      <TouchableOpacity
        style={styles.favoriteButton}
        onPress={handleToggleFavorite}
      >
        <Ionicons
          name={isFavorite(phrase.id) ? "heart" : "heart-outline"}
          size={20}
          color={isFavorite(phrase.id) ? Colors.error : Colors.textLight}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
});

export default function CategoryScreen() {
  const route = useRoute<CategoryScreenRouteProp>();
  const navigation = useNavigation<CategoryScreenNavigationProp>();
  const { config } = useAppLanguage();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSubcategory, setSelectedSubcategory] = useState<SubCategory | null>(null);
  
  const scrollY = useRef(new Animated.Value(0)).current;
  const { category } = route.params;

  // Получаем подкатегории для данной категории
  const subcategories = useMemo(() => {
    return getSubcategoriesByParentId(category.id);
  }, [category.id]);

  // Фильтрация фраз
  const filteredPhrases = useMemo(() => {
    let categoryPhrases = phrases.filter(phrase => phrase.categoryId === category.id);
    
    // Если выбрана подкатегория, фильтруем по ней
    if (selectedSubcategory) {
      categoryPhrases = categoryPhrases.filter(phrase => phrase.subcategoryId === selectedSubcategory.id);
    }
    
    return categoryPhrases;
  }, [category.id, selectedSubcategory]);

  // Функция для получения количества фраз в подкатегории
  const getPhrasesCountForSubcategory = useCallback((subcategoryId: string) => {
    return phrases.filter(phrase => 
      phrase.categoryId === category.id && phrase.subcategoryId === subcategoryId
    ).length;
  }, [category.id]);

  // Имитация загрузки
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // Сброс выбранной подкатегории при смене категории
  useEffect(() => {
    setSelectedSubcategory(null);
  }, [category.id]);

  // ✅ ИСПРАВЛЕНО: Используем правильный тип навигации
  const handlePhrasePress = useCallback((phrase: Phrase) => {
    navigation.navigate('PhraseDetail', { phrase });
  }, [navigation]);

  const handleSubcategoryPress = useCallback((subcategory: SubCategory) => {
    setSelectedSubcategory(subcategory);
  }, []);

  const handleBackToCategory = useCallback(() => {
    setSelectedSubcategory(null);
  }, []);

  const renderPhraseItem = useCallback(({ item }: { item: Phrase }) => (
    <PhraseItem 
      phrase={item} 
      onPress={handlePhrasePress}
      config={config}
    />
  ), [handlePhrasePress, config]);

  const keyExtractor = useCallback((item: Phrase) => item.id, []);

  // Получаем название категории на текущем языке
  const categoryName = getCategoryName(category, config.mode);
  const selectedSubcategoryName = selectedSubcategory 
    ? (config.mode === 'tk' ? selectedSubcategory.nameTk :
       config.mode === 'zh' ? selectedSubcategory.nameZh : 
       selectedSubcategory.nameRu)
    : '';

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Кастомный заголовок */}
      <View style={[styles.header, { backgroundColor: category.color }]}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.textWhite} />
        </TouchableOpacity>
        
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {selectedSubcategory ? selectedSubcategoryName : categoryName}
          </Text>
          {selectedSubcategory && (
            <Text style={styles.headerSubtitle} numberOfLines={1}>
              {categoryName}
            </Text>
          )}
        </View>

        {/* Кнопка "Назад к категории" если выбрана подкатегория */}
        {selectedSubcategory && (
          <TouchableOpacity 
            style={styles.backToCategoryButton}
            onPress={handleBackToCategory}
          >
            <Ionicons name="apps" size={20} color={Colors.textWhite} />
          </TouchableOpacity>
        )}
      </View>

      {/* Контент */}
      <View style={styles.content}>
        {/* Если есть подкатегории и не выбрана конкретная подкатегория */}
        {subcategories.length > 0 && !selectedSubcategory && (
          <View style={styles.subcategoriesSection}>
            <Text style={styles.sectionTitle}>
              {config.mode === 'tk' ? 'Bölümler' :
               config.mode === 'zh' ? '分类' : 'Разделы'}
            </Text>
            <SubCategoriesGrid
              subcategories={subcategories}
              onSubcategoryPress={handleSubcategoryPress}
              getPhrasesCount={getPhrasesCountForSubcategory}
            />
          </View>
        )}

        {/* Фразы */}
        {filteredPhrases.length > 0 && (
          <View style={styles.phrasesSection}>
            {/* Заголовок секции фраз */}
            {subcategories.length > 0 && !selectedSubcategory && (
              <Text style={styles.sectionTitle}>
                {config.mode === 'tk' ? 'Ähli sözlemler' :
                 config.mode === 'zh' ? '所有短语' : 'Все фразы'}
              </Text>
            )}
            
            <FlatList
              data={filteredPhrases}
              renderItem={renderPhraseItem}
              keyExtractor={keyExtractor}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.phrasesList}
              onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                { useNativeDriver: false }
              )}
            />
          </View>
        )}

        {/* Пустое состояние */}
        {filteredPhrases.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons 
              name="document-text-outline" 
              size={64} 
              color={Colors.textLight} 
            />
            <Text style={styles.emptyStateTitle}>
              {config.mode === 'tk' ? 'Sözlem ýok' :
               config.mode === 'zh' ? '暂无短语' : 'Нет фраз'}
            </Text>
            <Text style={styles.emptyStateText}>
              {selectedSubcategory
                ? (config.mode === 'tk' ? 'Bu bölümde sözlemler heniz goşulmady' :
                   config.mode === 'zh' ? '此分类中尚未添加短语' : 'В этом разделе пока нет фраз')
                : (config.mode === 'tk' ? 'Bu kategoriýada sözlemler heniz goşulmady' :
                   config.mode === 'zh' ? '此类别中尚未添加短语' : 'В этой категории пока нет фраз')
              }
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 16,
    elevation: 4,
    shadowColor: Colors.cardShadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textWhite,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.textWhite + 'CC',
    marginTop: 2,
  },
  backToCategoryButton: {
    padding: 8,
    marginLeft: 12,
  },
  content: {
    flex: 1,
  },
  subcategoriesSection: {
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginHorizontal: 20,
    marginBottom: 16,
  },
  phrasesSection: {
    flex: 1,
    paddingTop: 10,
  },
  phrasesList: {
    paddingBottom: 20,
  },
  phraseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    marginHorizontal: 20,
    marginBottom: 8,
    padding: 16,
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
  phraseContent: {
    flex: 1,
    marginRight: 12,
  },
  phraseText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
    lineHeight: 22,
  },
  phraseDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  chineseText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
  },
  pinyinText: {
    fontSize: 13,
    color: Colors.textLight,
    fontStyle: 'italic',
  },
  favoriteButton: {
    padding: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: Colors.textLight,
    textAlign: 'center',
    lineHeight: 22,
  },
});