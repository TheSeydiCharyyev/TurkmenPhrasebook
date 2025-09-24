// src/screens/CategoryScreen.tsx - ПОЛНАЯ ВЕРСИЯ с кнопкой аудио
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
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
// ДОБАВЛЕНО: Импорт useAudio
import { useAudio } from '../hooks/useAudio';

type CategoryScreenRouteProp = RouteProp<HomeStackParamList, 'CategoryScreen'>;
type CategoryScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const { width, height } = Dimensions.get('window');

// Компонент для отображения фразы с ДОБАВЛЕННОЙ кнопкой аудио
const PhraseItem = React.memo<{
  phrase: Phrase;
  onPress: (phrase: Phrase) => void;
  config: any;
}>(({ phrase, onPress, config }) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  // ДОБАВЛЕНО: useAudio хук
  const { playText, isPlaying } = useAudio();

  const handleToggleFavorite = useCallback(() => {
    toggleFavorite(phrase.id);
  }, [phrase.id, toggleFavorite]);

  // ДОБАВЛЕНО: обработчик аудио
  const handlePlayAudio = useCallback((e: any) => {
    e.stopPropagation();
    playText(phrase.chinese, 'chinese');
  }, [phrase.chinese, playText]);

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

      {/* ОБНОВЛЕНО: Добавляем контейнер для двух кнопок */}
      <View style={styles.actionsContainer}>
        {/* НОВАЯ кнопка аудио */}
        <TouchableOpacity
          style={styles.audioButton}
          onPress={handlePlayAudio}
          disabled={isPlaying}
        >
          <Ionicons
            name={isPlaying ? "pause" : "play"}
            size={18}
            color={isPlaying ? Colors.textWhite : Colors.primary}
          />
        </TouchableOpacity>

        {/* Существующая кнопка избранного */}
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={handleToggleFavorite}
        >
          <Ionicons
            name={isFavorite(phrase.id) ? "heart" : "heart-outline"}
            size={18}
            color={isFavorite(phrase.id) ? Colors.error : Colors.textLight}
          />
        </TouchableOpacity>
      </View>
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

  // Навигация на PhraseDetail
  const handlePhrasePress = useCallback((phrase: Phrase) => {
    navigation.navigate('PhraseDetail', { phrase });
  }, [navigation]);

  const handleSubcategoryPress = useCallback((subcategory: SubCategory) => {
    setSelectedSubcategory(subcategory);
  }, []);

  const handleBackToCategory = useCallback(() => {
    setSelectedSubcategory(null);
  }, []);

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
                   config.mode === 'zh' ? '此类别中暂无短语' : 'В этой категории пока нет фраз')}
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
    paddingTop: 8,
    paddingBottom: 16,
    elevation: 4,
    shadowColor: Colors.cardShadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.textWhite + '20',
  },
  headerTextContainer: {
    flex: 1,
    marginHorizontal: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textWhite,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.textWhite + '80',
    textAlign: 'center',
    marginTop: 2,
  },
  backToCategoryButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.textWhite + '20',
  },
  content: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  subcategoriesSection: {
    paddingTop: 20,
  },
  phrasesSection: {
    paddingTop: 20,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  phrasesList: {
    // Стили для списка фраз
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: Colors.textLight,
    textAlign: 'center',
    lineHeight: 20,
  },
  
  // СТИЛИ ДЛЯ ФРАЗ
  phraseItem: {
    flexDirection: 'row',
    alignItems: 'center',
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
    marginTop: 4,
  },
  chineseText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
    marginBottom: 2,
  },
  pinyinText: {
    fontSize: 12,
    color: Colors.textLight,
    fontStyle: 'italic',
  },
  
  // НОВЫЕ СТИЛИ ДЛЯ КНОПОК
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  audioButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    backgroundColor: Colors.primary + '15',
    borderWidth: 1,
    borderColor: Colors.primary + '30',
  },
  favoriteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
});