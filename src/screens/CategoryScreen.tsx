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

// ФИНАЛЬНЫЙ компонент фразы с треугольными кнопками
// ✅ ИСПРАВЛЕННЫЙ компонент PhraseItem для CategoryScreen.tsx
// Замени ТОЛЬКО этот компонент в файле src/screens/CategoryScreen.tsx

const PhraseItem = React.memo<{
  phrase: Phrase;
  onPress: (phrase: Phrase) => void;
  config: any;
}>(({ phrase, onPress, config }) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { playAudio, isPlaying } = useAudio(); // ✅ ИСПРАВЛЕНО: используем playAudio

  const handleToggleFavorite = useCallback(() => {
    toggleFavorite(phrase.id);
  }, [phrase.id, toggleFavorite]);

  const handlePress = useCallback(() => {
    onPress(phrase);
  }, [phrase, onPress]);

 
  // ✅ ИСПРАВЛЕНО: Новый формат playAudio
const handlePlayChinese = useCallback(() => {
  playAudio(phrase.chinese, 'chinese'); // TTS
}, [phrase.chinese, playAudio]);

const handlePlayTurkmen = useCallback(() => {
  playAudio(phrase.turkmen, 'turkmen', phrase.audioFileTurkmen); // MP3 + путь
}, [phrase.turkmen, phrase.audioFileTurkmen, playAudio]);

  // Правильная логика отображения языков
  const getSecondaryText = () => {
    if (config.mode === 'tk') {
      return phrase.turkmen;
    } else if (config.mode === 'zh') {
      return phrase.turkmen;
    } else {
      return phrase.russian;
    }
  };

  const getTertiaryText = () => {
    if (config.mode === 'tk') {
      return phrase.russian;
    } else if (config.mode === 'zh') {
      return phrase.russian;
    } else {
      return phrase.turkmen;
    }
  };

  return (
    <TouchableOpacity
      style={styles.phraseItem}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={styles.phraseContent}>
        {/* Левая часть - основной текст */}
        <View style={styles.phraseTextContainer}>
          {/* 1. Китайский текст */}
          <Text style={styles.chineseText} numberOfLines={1}>
            {phrase.chinese}
          </Text>
          
          {/* 2. Пиньинь */}
          <Text style={styles.pinyinText} numberOfLines={1}>
            {phrase.pinyin}
          </Text>
          
          {/* 3. Второй язык */}
          <Text style={styles.secondaryText} numberOfLines={1}>
            {getSecondaryText()}
          </Text>
          
          {/* 4. Третий язык */}
          <Text style={styles.tertiaryText} numberOfLines={1}>
            {getTertiaryText()}
          </Text>
        </View>

        {/* Правая часть - кнопки */}
        <View style={styles.phraseActions}>
          {/* ✅ ТРЕУГОЛЬНЫЕ аудио кнопки */}
          <View style={styles.audioButtons}>
            {/* Китайская кнопка */}
            <TouchableOpacity
              style={[styles.audioButton, styles.chineseAudioButton]}
              onPress={handlePlayChinese}
              activeOpacity={0.7}
            >
              <Text style={styles.audioTriangle}>▶</Text>
              <Text style={styles.chineseAudioButtonText}>中文</Text>
            </TouchableOpacity>
            
            {/* Туркменская кнопка */}
            <TouchableOpacity
              style={[styles.audioButton, styles.turkmenAudioButton]}
              onPress={handlePlayTurkmen}
              activeOpacity={0.7}
            >
              <Text style={styles.audioTriangle}>▶</Text>
              <Text style={styles.turkmenAudioButtonText}>TM</Text>
            </TouchableOpacity>
          </View>

          {/* Кнопка избранного */}
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={handleToggleFavorite}
            activeOpacity={0.7}
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
  
  // Анимация скролла для заголовка
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

  // Анимация заголовка при скролле
  const categoryTitleOpacity = scrollY.interpolate({
    inputRange: [0, 150],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const categoryTitleTranslateY = scrollY.interpolate({
    inputRange: [0, 150],
    outputRange: [0, -50],
    extrapolate: 'clamp',
  });

  // Получаем название категории на текущем языке
  const categoryName = getCategoryName(category, config.mode);
  const selectedSubcategoryName = selectedSubcategory 
    ? (config.mode === 'tk' ? selectedSubcategory.nameTk :
       config.mode === 'zh' ? selectedSubcategory.nameZh : selectedSubcategory.nameRu)
    : null;

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>
          {config.mode === 'tk' ? 'Ýüklenýär...' :
           config.mode === 'zh' ? '加载中...' : 'Загрузка...'}
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Заголовок - ФИКСИРОВАННЫЙ */}
      <View style={[styles.headerContainer, { backgroundColor: category.color }]}>
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
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {/* ✅ ИСПРАВЛЕННЫЙ заголовок на трех языках */}
        <Animated.View style={[
          styles.categoryTitleContainer,
          { 
            opacity: categoryTitleOpacity,
            transform: [{ translateY: categoryTitleTranslateY }]
          }
        ]}>
          {/* Китайский (всегда показываем) */}
          <Text style={styles.chineseCategoryTitle}>
            {category.nameZh}
          </Text>
          
          {/* ✅ ИСПРАВЛЕНО: Туркменский (средний) */}
          <Text style={styles.mainCategoryTitle}>
            {category.nameTk}
          </Text>
          
          {/* ✅ ИСПРАВЛЕНО: Русский (маленький) + количество фраз */}
          <Text style={styles.phrasesCountTitle}>
            {category.nameRu} • {filteredPhrases.length} {
              config.mode === 'tk' ? 'sözlem' :
              config.mode === 'zh' ? '短语' : 'фраз'
            }
          </Text>
        </Animated.View>

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

  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.textLight,
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

  // ✅ ИСПРАВЛЕННЫЙ заголовок на трех языках
  categoryTitleContainer: {
    backgroundColor: '#fff',
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },

  chineseCategoryTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },

  mainCategoryTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.textLight,
    marginBottom: 4,
  },

  phrasesCountTitle: {
    fontSize: 14,
    color: Colors.textLight,
  },

  subcategoriesSection: {
    padding: 16,
    backgroundColor: '#fff',
  },

  phrasesSection: {
    backgroundColor: '#fff',
    paddingTop: 16,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 16,
    paddingHorizontal: 16,
  },

  phrasesList: {
    paddingHorizontal: 16,
  },

  // ✅ ОБНОВЛЕННЫЕ стили для фразы
  // Новые стили для PhraseItem - заменить в CategoryScreen.tsx:

// ✅ НОВЫЕ стили с флаговыми цветами
phraseItem: {
  backgroundColor: Colors.cardBackground,
  marginBottom: 16, // ✅ Больше spacing
  borderRadius: 16, // ✅ Более округлый
  padding: 20,      // ✅ Больше padding
  shadowColor: Colors.shadowColor,
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.15, // ✅ Более заметная тень
  shadowRadius: 12,
  elevation: 4,
  borderWidth: 1,
  borderColor: Colors.border,
},

phraseContent: {
  flexDirection: 'row',
  alignItems: 'flex-start',
},

phraseTextContainer: {
  flex: 1,
  marginRight: 16, // ✅ Больше отступ
},

// ✅ Новый контейнер для китайского с флагом
chineseContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 8, // ✅ Больше отступ
},

chineseText: {
  fontSize: 24,           // ✅ Крупнее!
  fontWeight: 'bold',
  color: Colors.chineseRed, // ✅ Красный флага Китая
  marginRight: 8,
  flex: 1,
},

flagEmoji: {
  fontSize: 16,
  marginLeft: 4,
},

pinyinText: {
  fontSize: 16,           // ✅ Крупнее для читаемости
  color: Colors.textLight,
  fontStyle: 'italic',
  marginBottom: 12,       // ✅ Больше отступ
  letterSpacing: 1,       // ✅ Больше spacing
  fontFamily: 'Courier New', // ✅ Моноширинный шрифт
},

// ✅ Новый контейнер для переводов с флагами
translationContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 6,
},

secondaryText: {
  fontSize: 18,           // ✅ Крупнее
  color: Colors.turkmenGreen, // ✅ Зеленый туркменского флага
  fontWeight: 'bold',     // ✅ Сделал bold для туркменского!
  marginLeft: 8,
  flex: 1,
},

tertiaryText: {
  fontSize: 15,           // ✅ Средний размер
  color: Colors.russianText, // ✅ Синий для русского
  fontWeight: '500',
  marginLeft: 8,
  flex: 1,
},

phraseActions: {
  alignItems: 'flex-end',
  justifyContent: 'space-between',
  minHeight: 100,         // ✅ Больше места
},

audioButtons: {
  flexDirection: 'column',
  marginBottom: 12,       // ✅ Больше отступ
  gap: 8,                 // ✅ Больше gap
},

audioButton: {
  flexDirection: 'row',
  alignItems: 'center',
  paddingHorizontal: 14,  // ✅ Больше padding
  paddingVertical: 10,
  borderRadius: 25,       // ✅ Более округлый
  minWidth: 70,           // ✅ Шире кнопки
  justifyContent: 'center',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.3,
  shadowRadius: 6,
  elevation: 4,
},

audioTriangle: {
  fontSize: 14,           // ✅ Крупнее треугольник
  color: '#fff',
  marginRight: 6,         // ✅ Больше отступ
  fontWeight: 'bold',
},

chineseAudioButton: {
  backgroundColor: Colors.chineseRed,      // ✅ Точный красный флага
  shadowColor: Colors.chineseRedDark,
},

turkmenAudioButton: {
  backgroundColor: Colors.turkmenGreen,    // ✅ Точный зеленый флага
  shadowColor: Colors.turkmenGreenDark,
},

chineseAudioButtonText: {
  color: '#fff',
  fontSize: 15,           // ✅ Крупнее текст
  fontWeight: 'bold',
  letterSpacing: 0.5,
},

turkmenAudioButtonText: {
  color: '#fff',  
  fontSize: 15,           // ✅ Крупнее текст
  fontWeight: 'bold',
  letterSpacing: 0.5,
},

favoriteButton: {
  padding: 8,             // ✅ Больше область нажатия
  marginTop: 8,
},

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.textLight,
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },

  emptyText: {
    fontSize: 16,
    color: Colors.textLight,
    textAlign: 'center',
    lineHeight: 24,
  },

  bottomSpacing: {
    height: 20,
  },
});