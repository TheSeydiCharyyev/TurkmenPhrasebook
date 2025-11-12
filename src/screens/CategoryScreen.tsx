import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Animated,
  ActivityIndicator,
  Dimensions,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { scale, verticalScale, moderateScale } from '../utils/ResponsiveUtils';

import { Colors } from '../constants/Colors';
import { usePhrases } from '../hooks/usePhrases';
import { getCategoryName, getSubcategoriesByParentId } from '../data/categories';
import {
  PhraseWithTranslation,
  HomeStackParamList,
  RootStackParamList,
  SubCategory
} from '../types';
import { useFavorites } from '../hooks/useFavorites';
import { useAppLanguage } from '../contexts/LanguageContext';
import { useConfig } from '../contexts/ConfigContext';  // ✅ ДОБАВЛЕНО: для английского
import { useAudio } from '../hooks/useAudio';
import { SubCategoriesGrid } from '../components/SubCategoryCard';

type CategoryScreenRouteProp = RouteProp<HomeStackParamList, 'CategoryScreen'>;
type CategoryScreenNavigationProp = StackNavigationProp<HomeStackParamList, 'CategoryScreen'>;

const { width, height } = Dimensions.get('window');

// ФИНАЛЬНЫЙ компонент фразы с треугольными кнопками
// ✅ ИСПРАВЛЕННЫЙ компонент PhraseItem для CategoryScreen.tsx
// Замени ТОЛЬКО этот компонент в файле src/screens/CategoryScreen.tsx

const PhraseItem = React.memo<{
  phrase: PhraseWithTranslation;
  onPress: (phrase: PhraseWithTranslation) => void;
  config: any;
}>(({ phrase, onPress, config }) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { playAudio, isPlaying, isLoading } = useAudio(); // ✅ Добавил isLoading
  const { selectedLanguage } = useConfig();

  // ✅ Локальное состояние для отслеживания какая кнопка нажата
  const [playingButton, setPlayingButton] = React.useState<'translation' | 'turkmen' | null>(null);

  const handleToggleFavorite = useCallback(() => {
    toggleFavorite(phrase.id);
  }, [phrase.id, toggleFavorite]);

  const handlePress = useCallback(() => {
    onPress(phrase);
  }, [phrase, onPress]);

  // Map language code to audio language type (для всех 31 языков)
  const getAudioLanguage = (langCode: string): string => {
    const languageMap: { [key: string]: string } = {
      'tk': 'turkmen',
      'zh': 'chinese',
      'ru': 'russian',
      'en': 'english',
      'ja': 'japanese',
      'ko': 'korean',
      'th': 'thai',
      'vi': 'vietnamese',
      'id': 'indonesian',
      'ms': 'malay',
      'hi': 'hindi',
      'ur': 'urdu',
      'fa': 'persian',
      'ps': 'pashto',
      'de': 'german',
      'fr': 'french',
      'es': 'spanish',
      'it': 'italian',
      'tr': 'turkish',
      'pl': 'polish',
      'uk': 'ukrainian',
      'pt': 'portuguese',
      'nl': 'dutch',
      'uz': 'uzbek',
      'kk': 'kazakh',
      'az': 'azerbaijani',
      'ky': 'kyrgyz',
      'tg': 'tajik',
      'hy': 'armenian',
      'ka': 'georgian',
      'ar': 'arabic',
    };
    return languageMap[langCode] || 'english';
  };

  // Play audio for translation (для всех языков)
  const handlePlayTranslation = useCallback(() => {
    setPlayingButton('translation'); // ✅ Отмечаем какая кнопка нажата
    const audioLang = getAudioLanguage(selectedLanguage);
    playAudio(phrase.translation.text, audioLang);
  }, [phrase.translation.text, selectedLanguage, playAudio]);

  // Play audio for Turkmen
  const handlePlayTurkmen = useCallback(() => {
    setPlayingButton('turkmen'); // ✅ Отмечаем какая кнопка нажата
    playAudio(phrase.turkmen, 'turkmen', phrase.audioFileTurkmen);
  }, [phrase.turkmen, phrase.audioFileTurkmen, playAudio]);

  // ✅ Сбрасываем состояние когда аудио закончилось
  React.useEffect(() => {
    if (!isPlaying && !isLoading) {
      setPlayingButton(null);
    }
  }, [isPlaying, isLoading]);

  // Get language display label for button (Вариант 4: Флаг + Код/Название)
  const getLanguageLabel = () => {
    const labelMap: { [key: string]: string } = {
      'tk': '🇹🇲 TM',
      'zh': '🇨🇳 中文',
      'ru': '🇷🇺 РУС',
      'en': '🇬🇧 ENG',
      'ja': '🇯🇵 日本',
      'ko': '🇰🇷 한국',
      'th': '🇹🇭 TH',
      'vi': '🇻🇳 VN',
      'id': '🇮🇩 ID',
      'ms': '🇲🇾 MS',
      'hi': '🇮🇳 HI',
      'ur': '🇵🇰 UR',
      'fa': '🇮🇷 FA',
      'ps': '🇦🇫 PS',
      'de': '🇩🇪 DE',
      'fr': '🇫🇷 FR',
      'es': '🇪🇸 ES',
      'it': '🇮🇹 IT',
      'tr': '🇹🇷 TR',
      'pl': '🇵🇱 PL',
      'uk': '🇺🇦 UA',
      'pt': '🇵🇹 PT',
      'nl': '🇳🇱 NL',
      'uz': '🇺🇿 UZ',
      'kk': '🇰🇿 KZ',
      'az': '🇦🇿 AZ',
      'ky': '🇰🇬 KG',
      'tg': '🇹🇯 TJ',
      'hy': '🇦🇲 AM',
      'ka': '🇬🇪 GE',
      'ar': '🇸🇦 AR',
    };
    return labelMap[selectedLanguage] || '🇬🇧 EN';
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
          {/* 1. Translation (Chinese/Russian/English based on selectedLanguage) */}
          <Text style={styles.chineseText} numberOfLines={1}>
            {phrase.translation.text}
          </Text>

          {/* 2. Transcription (pinyin for Chinese, undefined for others) */}
          {phrase.translation.transcription && (
            <Text style={styles.pinyinText} numberOfLines={1}>
              {phrase.translation.transcription}
            </Text>
          )}

          {/* 3. Turkmen (always shown) */}
          <Text style={styles.secondaryText} numberOfLines={1}>
            {phrase.turkmen}
          </Text>
        </View>

        {/* Правая часть - кнопки */}
        <View style={styles.phraseActions}>
          {/* ✅ АУДИО КНОПКИ с индикаторами */}
          <View style={styles.audioButtons}>
            {/* Translation language button (All languages) */}
            <TouchableOpacity
              style={[styles.audioButton, styles.translationAudioButton]}
              onPress={handlePlayTranslation}
              activeOpacity={0.7}
              disabled={isLoading}
            >
              {/* ✅ ВАРИАНТ 2: ActivityIndicator при загрузке, ⏸ при воспроизведении */}
              {isLoading && playingButton === 'translation' ? (
                <ActivityIndicator size="small" color="#fff" style={styles.audioIndicator} />
              ) : isPlaying && playingButton === 'translation' ? (
                <Text style={styles.audioTriangle}>⏸</Text>
              ) : (
                <Text style={styles.audioTriangle}>▶</Text>
              )}
              <Text style={styles.translationAudioButtonText}>{getLanguageLabel()}</Text>
            </TouchableOpacity>

            {/* Туркменская кнопка */}
            <TouchableOpacity
              style={[styles.audioButton, styles.turkmenAudioButton]}
              onPress={handlePlayTurkmen}
              activeOpacity={0.7}
              disabled={isLoading}
            >
              {/* ✅ ВАРИАНТ 2: ActivityIndicator при загрузке, ⏸ при воспроизведении */}
              {isLoading && playingButton === 'turkmen' ? (
                <ActivityIndicator size="small" color="#fff" style={styles.audioIndicator} />
              ) : isPlaying && playingButton === 'turkmen' ? (
                <Text style={styles.audioTriangle}>⏸</Text>
              ) : (
                <Text style={styles.audioTriangle}>▶</Text>
              )}
              <Text style={styles.turkmenAudioButtonText}>🇹🇲 TM</Text>
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

  // Use multilingual phrases
  const { getPhrasesByCategory, getPhrasesBySubcategory } = usePhrases();

  // Анимация скролла для заголовка
  const scrollY = useRef(new Animated.Value(0)).current;
  const { category } = route.params;

  // Получаем подкатегории для данной категории
  const subcategories = useMemo(() => {
    return getSubcategoriesByParentId(category.id);
  }, [category.id]);

  // Фильтрация фраз
  const filteredPhrases = useMemo(() => {
    // Если выбрана подкатегория, фильтруем по ней
    if (selectedSubcategory) {
      return getPhrasesBySubcategory(selectedSubcategory.id);
    }

    // Иначе показываем все фразы категории
    return getPhrasesByCategory(category.id);
  }, [category.id, selectedSubcategory, getPhrasesByCategory, getPhrasesBySubcategory]);

  // Функция для получения количества фраз в подкатегории
  const getPhrasesCountForSubcategory = useCallback((subcategoryId: string) => {
    return getPhrasesBySubcategory(subcategoryId).length;
  }, [getPhrasesBySubcategory]);

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
  const handlePhrasePress = useCallback((phrase: PhraseWithTranslation) => {
    navigation.navigate('PhraseDetail', { phrase });
  }, [navigation]);

  const handleSubcategoryPress = useCallback((subcategory: SubCategory) => {
    setSelectedSubcategory(subcategory);
  }, []);

  const handleBackToCategory = useCallback(() => {
    setSelectedSubcategory(null);
  }, []);


  // ✅ ОБНОВЛЕНО: Получаем название категории на текущем языке с поддержкой всех 30 языков
  const { selectedLanguage } = useConfig();

  // ✅ УНИВЕРСАЛЬНАЯ функция для ВСЕХ 31 языков - Category
  const getCategoryNameByLanguage = (langCode: string): string => {
    const fieldName = `name${langCode.charAt(0).toUpperCase() + langCode.slice(1)}` as keyof typeof category;
    const name = category[fieldName];
    return (typeof name === 'string' ? name : category.nameEn);
  };

  // ✅ УНИВЕРСАЛЬНАЯ функция для ВСЕХ 31 языков - SubCategory
  const getSubcategoryNameByLanguage = (subcategory: SubCategory, langCode: string): string => {
    const fieldName = `name${langCode.charAt(0).toUpperCase() + langCode.slice(1)}` as keyof SubCategory;
    const name = subcategory[fieldName];
    return (typeof name === 'string' ? name : subcategory.nameEn);
  };

  const selectedSubcategoryName = selectedSubcategory
    ? getSubcategoryNameByLanguage(selectedSubcategory, selectedLanguage)
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

  // Get gradient colors based on category color
  const getGradientColors = (): [string, string] => {
    const colorMap: { [key: string]: [string, string] } = {
      '#FF6B6B': ['#FF6B6B', '#EE5A52'],
      '#4ECDC4': ['#4ECDC4', '#44B8A8'],
      '#45B7D1': ['#45B7D1', '#3A9FC2'],
      '#FFA07A': ['#FFA07A', '#FF8C69'],
      '#98D8C8': ['#98D8C8', '#7DC7B5'],
      '#F7DC6F': ['#F7DC6F', '#F4D03F'],
      '#BB8FCE': ['#BB8FCE', '#A569BD'],
      '#85C1E2': ['#85C1E2', '#6FB8DC'],
    };
    return colorMap[category.color] || [category.color, category.color];
  };

  const [gradientStart, gradientEnd] = getGradientColors();

  return (
    <SafeAreaView style={styles.container}>
      {/* ✅ ВАРИАНТ 2: Белый header + цветная линия-акцент */}
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            if (navigation.canGoBack()) {
              navigation.goBack();
            }
          }}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>

        <View style={styles.headerContent}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ fontSize: 28, marginRight: 8 }}>{category.icon}</Text>
            <Text style={styles.headerTitle}>
              {selectedSubcategoryName || getCategoryNameByLanguage(selectedLanguage)}
            </Text>
          </View>
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
            <Text style={styles.gridEmoji}>📑</Text>
          </TouchableOpacity>
        )}

        {/* Цветная линия-акцент */}
        <View style={[styles.accentLine, { backgroundColor: gradientStart }]} />
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
            <Text style={styles.emptyEmoji}>💬</Text>
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
    marginTop: verticalScale(16),
    fontSize: moderateScale(16),
    color: Colors.textLight,
  },

  headerContainer: {
    backgroundColor: '#FFFFFF',
    paddingTop: 44,
    paddingBottom: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 1000,
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  accentLine: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 4,
  },

  gridEmoji: {
    fontSize: moderateScale(24),
  },

  headerContent: {
    flex: 1,
  },

  headerTitle: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },

  
  emoji: {
    fontSize: 28,
    marginRight: 8,
  },

  categoryTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },

  headerRightPlaceholder: {
    width: 40,
  },

  headerSubtitle: {
    fontSize: moderateScale(15),
    color: '#6B7280',
    fontWeight: '500',
  },

  backToCategoryButton: {
    marginLeft: scale(12),
    padding: scale(4),
  },

  content: {
    flex: 1,
  },

  // ✅ ИСПРАВЛЕННЫЙ заголовок - только языковая пара

  subcategoriesSection: {
    padding: scale(16),
    backgroundColor: '#fff',
  },

  phrasesSection: {
    backgroundColor: '#fff',
    paddingTop: verticalScale(16),
  },

  sectionTitle: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: verticalScale(16),
    paddingHorizontal: scale(16),
  },

  phrasesList: {
    paddingHorizontal: scale(16),
  },

  // ✅ ОБНОВЛЕННЫЕ стили для фразы
  // Новые стили для PhraseItem - заменить в CategoryScreen.tsx:

// ✅ HERO + GRID стили с мощными тенями
phraseItem: {
  backgroundColor: Colors.cardBackground,
  marginBottom: verticalScale(20), // ✅ Еще больше spacing
  borderRadius: scale(20), // ✅ Максимально округлый
  padding: scale(24),      // ✅ Еще больше padding
  shadowColor: Colors.shadowColor,
  shadowOffset: { width: 0, height: verticalScale(6) },
  shadowOpacity: 0.2, // ✅ Мощная тень
  shadowRadius: scale(16),
  elevation: 8, // ✅ Увеличил elevation до 8
  borderWidth: 1,
  borderColor: Colors.border,
},

phraseContent: {
  flexDirection: 'row',
  alignItems: 'flex-start',
},

phraseTextContainer: {
  flex: 1,
  marginRight: scale(16), // ✅ Больше отступ
},

// ✅ Новый контейнер для китайского с флагом
chineseContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: verticalScale(8), // ✅ Больше отступ
},

chineseText: {
  fontSize: moderateScale(26),           // ✅ ЕЩЕ КРУПНЕЕ!
  fontWeight: 'bold',
  color: '#2563EB',       // ✅ Синий - совпадает с кнопкой
  marginRight: scale(8),
  marginBottom: verticalScale(8),
  flex: 1,
},

flagEmoji: {
  fontSize: moderateScale(18),
  marginLeft: scale(4),
},

pinyinText: {
  fontSize: moderateScale(18),           // ✅ Увеличил для лучшей читаемости
  color: Colors.textLight,
  fontStyle: 'italic',
  marginBottom: verticalScale(14),       // ✅ Еще больше отступ
  letterSpacing: 1.2,     // ✅ Больше spacing
  fontFamily: 'Courier New',
},

// ✅ Новый контейнер для переводов с флагами
translationContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: verticalScale(8),
},

secondaryText: {
  fontSize: moderateScale(20),           // ✅ УВЕЛИЧИЛ до 20
  color: '#16A34A',       // ✅ Зеленый - совпадает с кнопкой
  fontWeight: 'bold',
  marginLeft: scale(8),
  flex: 1,
},

tertiaryText: {
  fontSize: moderateScale(17),           // ✅ Увеличил до 17
  color: Colors.russianText,
  fontWeight: '500',
  marginLeft: scale(8),
  flex: 1,
},

phraseActions: {
  alignItems: 'flex-end',
  justifyContent: 'space-between',
  minHeight: verticalScale(100),         // ✅ Больше места
},

audioButtons: {
  flexDirection: 'column',
  marginBottom: verticalScale(16),       // ✅ Еще больше отступ
  gap: verticalScale(10),                // ✅ Еще больше gap
},

audioButton: {
  flexDirection: 'row',
  alignItems: 'center',
  paddingHorizontal: scale(16),  // ✅ Еще больше padding
  paddingVertical: verticalScale(12),
  borderRadius: scale(28),       // ✅ Максимально округлый
  minWidth: scale(80),           // ✅ Еще шире кнопки
  justifyContent: 'center',
  shadowOffset: { width: 0, height: verticalScale(3) },
  shadowOpacity: 0.35,
  shadowRadius: scale(8),
  elevation: 6,           // ✅ Увеличил elevation
},

audioTriangle: {
  fontSize: moderateScale(16),           // ✅ Еще крупнее треугольник
  color: '#111827',
  marginRight: scale(7),         // ✅ Больше отступ
  fontWeight: 'bold',
},

// ✅ ИНДИКАТОР загрузки
audioIndicator: {
  marginRight: scale(7),         // ✅ Тот же отступ как у треугольника
},

// ✅ MODERN VIBRANT - Синий для всех языков перевода
translationAudioButton: {
  backgroundColor: '#3B82F6',    // Яркий синий (Telegram/Discord style)
  shadowColor: '#2563EB',        // Темнее синий для тени
},

// ✅ MODERN VIBRANT - Зеленый для туркменского
turkmenAudioButton: {
  backgroundColor: '#22C55E',    // Яркий зеленый
  shadowColor: '#16A34A',        // Темнее зеленый для тени
},

translationAudioButtonText: {
  color: '#111827',
  fontSize: moderateScale(16),
  fontWeight: 'bold',
  letterSpacing: 0.5,
},

turkmenAudioButtonText: {
  color: '#111827',
  fontSize: moderateScale(16),
  fontWeight: 'bold',
  letterSpacing: 0.5,
},

favoriteButton: {
  padding: scale(10),            // ✅ Еще больше область нажатия
  marginTop: verticalScale(8),
},

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: verticalScale(60),
    paddingHorizontal: scale(32),
  },

  emptyEmoji: {
    fontSize: moderateScale(64),
    opacity: 0.5,
  },

  emptyTitle: {
    fontSize: moderateScale(22),
    fontWeight: 'bold',
    color: Colors.textLight,
    marginTop: verticalScale(16),
    marginBottom: verticalScale(8),
    textAlign: 'center',
  },

  emptyText: {
    fontSize: moderateScale(16),
    color: Colors.textLight,
    textAlign: 'center',
    lineHeight: moderateScale(24),
  },

  bottomSpacing: {
    height: verticalScale(20),
  },
});