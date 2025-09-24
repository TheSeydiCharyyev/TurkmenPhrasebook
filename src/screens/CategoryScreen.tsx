// src/screens/CategoryScreen.tsx - ФИНАЛЬНАЯ ВЕРСИЯ с правильной логикой подкатегорий

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
  ScrollView,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

import { Colors } from '../constants/Colors';
import { phrases } from '../data/phrases';
import { getCategoryName, getSubcategoriesByParentId } from '../data/categories';
import { 
  Phrase, 
  HomeStackParamList, 
  RootStackParamList, 
  SubCategory 
} from '../types';
import { useFavorites } from '../hooks/useFavorites';
import { useAppLanguage } from '../contexts/LanguageContext';
import { SubCategoriesGrid } from '../components/SubCategoryCard';

// ✅ ИСПРАВЛЕННЫЕ типы для навигации
type CategoryScreenRouteProp = RouteProp<HomeStackParamList, 'CategoryScreen'>;
type CategoryScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const { width, height } = Dimensions.get('window');

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

  // ✅ Навигация на PhraseDetail
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
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        {/* 
        ✅ ЛОГИКА ОТОБРАЖЕНИЯ:
        1. Если есть подкатегории И не выбрана конкретная подкатегория → показываем сетку подкатегорий
        2. После подкатегорий показываем все фразы категории (если не выбрана конкретная подкатегория)
        3. Если выбрана подкатегория → показываем только фразы этой подкатегории
        4. Если подкатегорий нет → показываем сразу фразы категории
        */}
        
        {/* ПОДКАТЕГОРИИ - показываем ПЕРВЫМИ если есть и не выбрана конкретная */}
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

        {/* ФРАЗЫ - показываем всегда когда есть */}
        {filteredPhrases.length > 0 && (
          <View style={styles.phrasesSection}>
            {/* Заголовок для фраз (только если есть подкатегории и не выбрана конкретная) */}
            {subcategories.length > 0 && !selectedSubcategory && (
              <Text style={styles.sectionTitle}>
                {config.mode === 'tk' ? 'Ähli sözlemler' :
                 config.mode === 'zh' ? '所有短语' : 'Все фразы'}
              </Text>
            )}

            {/* Список фраз */}
            <View style={styles.phrasesList}>
              {filteredPhrases.map((phrase) => (
                <PhraseItem 
                  key={phrase.id}
                  phrase={phrase} 
                  onPress={handlePhrasePress}
                  config={config}
                />
              ))}
            </View>
          </View>
        )}

        {/* Сообщение о пустом списке */}
        {filteredPhrases.length === 0 && (
          <View style={styles.emptyContainer}>
            <Ionicons name="chatbubbles-outline" size={64} color={Colors.textLight} />
            <Text style={styles.emptyTitle}>
              {config.mode === 'tk' ? 'Sözlem tapylmady' :
               config.mode === 'zh' ? '未找到短语' : 'Фразы не найдены'}
            </Text>
            <Text style={styles.emptyText}>
              {selectedSubcategory 
                ? (config.mode === 'tk' ? 'Bu bölümde heniz sözlem ýok' :
                   config.mode === 'zh' ? '此分类中暂无短语' : 'В этой подкатегории пока нет фраз')
                : (config.mode === 'tk' ? 'Bu kategoriýada heniz sözlem ýok' :
                   config.mode === 'zh' ? '此类别中暂无短语' : 'В этой категории пока нет фраз')
              }
            </Text>
          </View>
        )}
      </ScrollView>
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
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: 20,
  },
  backButton: {
    marginRight: 16,
    padding: 4,
  },
  headerTextContainer: {
    flex: 1,
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.textWhite,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.textWhite + '80',
    marginTop: 2,
  },
  backToCategoryButton: {
    padding: 4,
  },
  content: {
    flex: 1,
  },
  subcategoriesSection: {
    paddingTop: 20,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginHorizontal: 20,
    marginBottom: 16,
  },
  phrasesSection: {
    paddingTop: 16,
    paddingBottom: 20,
  },
  phrasesList: {
    paddingHorizontal: 20,
  },
  phraseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
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
    marginBottom: 6,
  },
  phraseDetails: {
    flexDirection: 'column',
  },
  chineseText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  pinyinText: {
    fontSize: 12,
    color: Colors.textLight,
    fontStyle: 'italic',
  },
  favoriteButton: {
    padding: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
});