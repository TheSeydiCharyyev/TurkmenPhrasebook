// src/screens/FavoritesScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

// Импорты
import { Colors } from '../constants/Colors';
import { usePhrases } from '../hooks/usePhrases';
import { categories } from '../data/categories';
import { PhraseWithTranslation, RootStackParamList } from '../types';
import { useFavorites } from '../hooks/useFavorites';
// В каждом файле, где используется useAppLanguage
import { useAppLanguage } from '../contexts/LanguageContext';
import { scale, verticalScale, moderateScale } from '../utils/ResponsiveUtils';

type FavoritesScreenNavigationProp = StackNavigationProp<RootStackParamList, 'PhraseDetail'>;

interface FavoritePhraseItemProps {
  phrase: PhraseWithTranslation;
  onPress: (phrase: PhraseWithTranslation) => void;
  onRemove: (phraseId: string) => void;
}

// Компонент элемента избранной фразы
function FavoritePhraseItem({ phrase, onPress, onRemove }: FavoritePhraseItemProps) {
  const category = categories.find(cat => cat.id === phrase.categoryId);
  const { config } = useAppLanguage();

  // Название категории в зависимости от режима
  const categoryName = category ? (
    config.mode === 'tk' ? category.nameTk :
    config.mode === 'zh' ? category.nameZh :
    category.nameRu
  ) : '';

  return (
    <TouchableOpacity
      style={styles.phraseCard}
      onPress={() => onPress(phrase)}
    >
      <View style={styles.phraseContent}>
        <View style={styles.phraseHeader}>
          <Text style={styles.chineseText}>{phrase.translation.text}</Text>
          {category && (
            <View style={[styles.categoryBadge, { backgroundColor: category.color }]}>
              <Text style={styles.categoryIcon}>{category.icon}</Text>
            </View>
          )}
        </View>

        {phrase.translation.transcription && (
          <Text style={styles.pinyinText}>{phrase.translation.transcription}</Text>
        )}

        {/* Показываем туркменский всегда */}
        <Text style={[
          styles.primaryText,
          config.mode === 'tk' && styles.turkmenMainText
        ]}>
          {phrase.turkmen}
        </Text>
        
        {category && (
          <Text style={styles.categoryText}>{categoryName}</Text>
        )}
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => onRemove(phrase.id)}
        >
          <Ionicons name="heart" size={24} color={Colors.error} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

export default function FavoritesScreen() {
  const navigation = useNavigation<FavoritesScreenNavigationProp>();
  const { getFavoritesPhrases, toggleFavorite, loading } = useFavorites();
  const { getTexts, config } = useAppLanguage();
  const texts = getTexts();
  const { phrases } = usePhrases();

  // Локальное состояние для принудительного обновления
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const favoritePhrases = getFavoritesPhrases(phrases);

  // Обновляем экран каждый раз когда он получает фокус
  useFocusEffect(
    React.useCallback(() => {
      // Принудительно обновляем компонент
      setRefreshTrigger(prev => prev + 1);
    }, [])
  );

  const handlePhrasePress = (phrase: PhraseWithTranslation) => {
    navigation.navigate('PhraseDetail', { phrase });
  };

  const handleRemoveFromFavorites = (phraseId: string) => {
    toggleFavorite(phraseId);
  };

  const renderFavoritePhrase = ({ item }: { item: PhraseWithTranslation }) => (
    <FavoritePhraseItem
      phrase={item}
      onPress={handlePhrasePress}
      onRemove={handleRemoveFromFavorites}
    />
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>
            {config.mode === 'tk' ? 'Halanýanlar ýüklenýär...' :
             config.mode === 'zh' ? '正在加载收藏...' :
             'Загружаем избранное...'}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Шапка */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {config.mode === 'tk' ? '❤️ Halanýan sözlemler' :
           config.mode === 'zh' ? '❤️ 收藏的短语' :
           '❤️ Избранные фразы'}
        </Text>
        <Text style={styles.headerSubtitle}>
          {favoritePhrases.length > 0 ? (
            config.mode === 'tk' ? `${favoritePhrases.length} sany halanýan sözlemiňiz bar` :
            config.mode === 'zh' ? `您有 ${favoritePhrases.length} 个收藏的短语` :
            `У вас ${favoritePhrases.length} избранных фраз`
          ) : (
            config.mode === 'tk' ? 'Çalt giriş üçin sözlemleri halanýanlara goşuň' :
            config.mode === 'zh' ? '添加短语到收藏夹以便快速访问' :
            'Добавьте фразы в избранное для быстрого доступа'
          )}
        </Text>
      </View>

      {/* Список избранных фраз */}
      {favoritePhrases.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="heart-outline" size={64} color={Colors.textLight} />
          <Text style={styles.emptyTitle}>
            {config.mode === 'tk' ? 'Heniz halanýan sözlem ýok' :
             config.mode === 'zh' ? '暂无收藏的短语' :
             'Пока нет избранных фраз'}
          </Text>
          <Text style={styles.emptyText}>
            {config.mode === 'tk' ? 'Islendik sözlemiň gapynda ýürek belgisine basyň,\nhalanýanlara goşmak üçin' :
             config.mode === 'zh' ? '点击任何短语旁边的心形图标\n将其添加到收藏夹' :
             'Нажмите на сердечко рядом с любой фразой,\nчтобы добавить её в избранное'}
          </Text>

          <TouchableOpacity
            style={styles.exploreButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="search" size={20} color={Colors.textWhite} />
            <Text style={styles.exploreButtonText}>
              {config.mode === 'tk' ? 'Sözlem tap' :
               config.mode === 'zh' ? '查找短语' :
               'Найти фразы'}
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={favoritePhrases}
          renderItem={renderFavoritePhrase}
          keyExtractor={(item) => item.id}
          style={styles.phrasesList}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.phrasesListContent}
        />
      )}
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
  loadingText: {
    fontSize: moderateScale(16),
    color: Colors.textLight,
  },
  header: {
    padding: scale(20),
    paddingBottom: verticalScale(10),
  },
  headerTitle: {
    fontSize: moderateScale(28),
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: verticalScale(5),
  },
  headerSubtitle: {
    fontSize: moderateScale(16),
    color: Colors.textLight,
  },
  phrasesList: {
    flex: 1,
  },
  phrasesListContent: {
    padding: scale(20),
  },
  phraseCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: scale(12),
    padding: scale(16),
    marginBottom: verticalScale(12),
    flexDirection: 'row',
    alignItems: 'flex-start',
    elevation: 2,
    shadowColor: Colors.cardShadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  phraseContent: {
    flex: 1,
  },
  phraseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(8),
  },
  chineseText: {
    fontSize: moderateScale(20),
    fontWeight: 'bold',
    color: Colors.text,
    flex: 1,
  },
  categoryBadge: {
    paddingHorizontal: scale(8),
    paddingVertical: verticalScale(4),
    borderRadius: scale(12),
    marginLeft: scale(8),
  },
  categoryIcon: {
    fontSize: moderateScale(12),
    color: Colors.textWhite,
  },
  pinyinText: {
    fontSize: moderateScale(14),
    color: Colors.primary,
    fontStyle: 'italic',
    marginBottom: verticalScale(4),
  },
  primaryText: {
    fontSize: moderateScale(17),
    color: Colors.text,
    fontWeight: '600',
    marginBottom: verticalScale(4),
  },
  turkmenMainText: {
    fontSize: moderateScale(19),
    fontWeight: '700',
    marginBottom: verticalScale(6),
  },
  secondaryText: {
    fontSize: moderateScale(13),
    color: Colors.textLight,
    opacity: 0.8,
    marginBottom: verticalScale(4),
  },
  categoryText: {
    fontSize: moderateScale(12),
    color: Colors.textLight,
    fontStyle: 'italic',
  },
  actions: {
    justifyContent: 'center',
    marginLeft: scale(12),
  },
  removeButton: {
    padding: scale(8),
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: scale(40),
  },
  emptyTitle: {
    fontSize: moderateScale(20),
    fontWeight: '600',
    color: Colors.text,
    marginTop: verticalScale(16),
    marginBottom: verticalScale(8),
  },
  emptyText: {
    fontSize: moderateScale(16),
    color: Colors.textLight,
    textAlign: 'center',
    lineHeight: moderateScale(22),
    marginBottom: verticalScale(24),
  },
  exploreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(12),
    borderRadius: scale(25),
    gap: scale(8),
  },
  exploreButtonText: {
    color: Colors.textWhite,
    fontSize: moderateScale(16),
    fontWeight: '600',
  },
});