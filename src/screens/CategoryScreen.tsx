// src/screens/CategoryScreen.tsx - ОБНОВЛЕННАЯ ВЕРСИЯ с аудио кнопками как на фото

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
import { useAudio } from '../hooks/useAudio';
import { SubCategoriesGrid } from '../components/SubCategoryCard';

type CategoryScreenRouteProp = RouteProp<HomeStackParamList, 'CategoryScreen'>;
type CategoryScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const { width, height } = Dimensions.get('window');

// Компонент для отображения фразы с аудио кнопками
const PhraseItem = React.memo<{
  phrase: Phrase;
  onPress: (phrase: Phrase) => void;
  config: any;
}>(({ phrase, onPress, config }) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { playText, isPlaying } = useAudio();

  const handleToggleFavorite = useCallback(() => {
    toggleFavorite(phrase.id);
  }, [phrase.id, toggleFavorite]);

  const handlePress = useCallback(() => {
    onPress(phrase);
  }, [phrase, onPress]);

  const handlePlayChinese = useCallback(() => {
    playText(phrase.chinese, 'chinese');
  }, [phrase.chinese, playText]);

  const handlePlayTurkmen = useCallback(() => {
    playText(phrase.turkmen, 'turkmen');
  }, [phrase.turkmen, playText]);

  return (
    <TouchableOpacity
      style={styles.phraseItem}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={styles.phraseContent}>
        {/* Левая часть - основной текст */}
        <View style={styles.phraseTextContainer}>
          {/* Китайский текст */}
          <Text style={styles.chineseText} numberOfLines={1}>
            {phrase.chinese}
          </Text>
          
          {/* Пиньинь */}
          <Text style={styles.pinyinText} numberOfLines={1}>
            {phrase.pinyin}
          </Text>
          
          {/* Перевод в зависимости от языка интерфейса */}
          <Text style={styles.translationText} numberOfLines={1}>
            {config.mode === 'tk' ? phrase.turkmen : 
             config.mode === 'zh' ? phrase.chinese :
             phrase.russian}
          </Text>
          
          {/* Русский перевод (всегда показываем) */}
          {config.mode !== 'ru' && (
            <Text style={styles.russianText} numberOfLines={1}>
              {phrase.russian}
            </Text>
          )}
        </View>

        {/* Правая часть - кнопки аудио и избранное */}
        <View style={styles.actionsContainer}>
          {/* Кнопка китайского аудио */}
          <TouchableOpacity
            style={[styles.audioButton, styles.chineseButton]}
            onPress={handlePlayChinese}
            disabled={isPlaying}
          >
            <Text style={styles.audioButtonText}>中文</Text>
            {isPlaying && (
              <ActivityIndicator size="small" color="#fff" style={styles.loadingIndicator} />
            )}
          </TouchableOpacity>

          {/* Кнопка туркменского аудио */}
          <TouchableOpacity
            style={[styles.audioButton, styles.turkmenButton]}
            onPress={handlePlayTurkmen}
            disabled={isPlaying}
          >
            <Text style={styles.audioButtonText}>TM</Text>
          </TouchableOpacity>

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
        </View>
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
    : null;

  // Анимация для заголовка
  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, -50],
    extrapolate: 'clamp',
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

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
      {/* Заголовок */}
      <Animated.View style={[
        styles.headerContainer, 
        { 
          transform: [{ translateY: headerTranslateY }],
          opacity: headerOpacity 
        }
      ]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={28} color="#fff" />
        </TouchableOpacity>
        
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>
            {selectedSubcategoryName || categoryName}
          </Text>
          <Text style={styles.headerSubtitle}>
            {selectedSubcategory 
              ? `${filteredPhrases.length} ${config.mode === 'tk' ? 'sözlem' :
                  config.mode === 'zh' ? '个短语' : 'фраз'}`
              : `${filteredPhrases.length} ${config.mode === 'tk' ? 'sözlem' :
                  config.mode === 'zh' ? '个短语' : 'фраз'}`
            }
          </Text>
        </View>
        
        {selectedSubcategory && (
          <TouchableOpacity
            style={styles.backToCategoryButton}
            onPress={handleBackToCategory}
          >
            <Ionicons name="grid-outline" size={24} color="#fff" />
          </TouchableOpacity>
        )}
      </Animated.View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
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
                   config.mode === 'zh' ? '此分类中暂无短语' : 'В этой категории пока нет фраз')
              }
            </Text>
          </View>
        )}

        <View style={styles.bottomSpacing} />
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
    backgroundColor: Colors.background,
  },

  headerContainer: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 1000,
  },

  backButton: {
    marginRight: 12,
    padding: 4,
  },

  headerContent: {
    flex: 1,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 2,
  },

  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },

  backToCategoryButton: {
    marginLeft: 12,
    padding: 4,
  },

  content: {
    flex: 1,
  },

  subcategoriesSection: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },

  phrasesSection: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
  },

  phrasesList: {
    gap: 8,
  },

  phraseItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },

  phraseContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },

  phraseTextContainer: {
    flex: 1,
    marginRight: 12,
  },

  chineseText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },

  pinyinText: {
    fontSize: 14,
    color: Colors.textLight,
    fontStyle: 'italic',
    marginBottom: 4,
  },

  translationText: {
    fontSize: 16,
    color: Colors.text,
    marginBottom: 2,
  },

  russianText: {
    fontSize: 14,
    color: Colors.textLight,
  },

  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  audioButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    minWidth: 40,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },

  chineseButton: {
    backgroundColor: Colors.primary,
  },

  turkmenButton: {
    backgroundColor: Colors.success,
  },

  audioButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },

  loadingIndicator: {
    position: 'absolute',
    right: 2,
    top: 2,
  },

  favoriteButton: {
    padding: 4,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textLight,
    marginTop: 16,
    marginBottom: 8,
  },

  emptyText: {
    fontSize: 14,
    color: Colors.textLight,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 32,
  },

  bottomSpacing: {
    height: 20,
  },
});