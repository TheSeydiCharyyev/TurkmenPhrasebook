// src/features/favorites/screens/FavoritesHubScreen.tsx
// Главный экран избранного с тремя вкладками: Phrases, Translations, Words

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { Colors } from '../../../constants/Colors';
import { FavoritesService } from '../services/FavoritesService';
import { FavoriteTab, FavoriteTranslation } from '../types/favorites.types';
import { usePhrases } from '../../../hooks/usePhrases';
import { useAppLanguage } from '../../../contexts/LanguageContext';
import { PhraseWithTranslation } from '../../../types';
import { categories } from '../../../data/categories';
import { TextTranslationResult } from '../../text-translator/types/text-translator.types';

export default function FavoritesHubScreen() {
  const navigation = useNavigation<any>();
  const { phrases } = usePhrases();
  const { config } = useAppLanguage();

  const [activeTab, setActiveTab] = useState<FavoriteTab>('phrases');
  const [isLoading, setIsLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Данные для каждой вкладки
  const [favoritePhrases, setFavoritePhrases] = useState<PhraseWithTranslation[]>([]);
  const [favoriteTranslations, setFavoriteTranslations] = useState<FavoriteTranslation[]>([]);
  const [favoriteWords, setFavoriteWords] = useState<any[]>([]);

  // Инициализация и загрузка данных
  useEffect(() => {
    initializeFavorites();
  }, []);

  // Обновляем при фокусе экрана
  useFocusEffect(
    React.useCallback(() => {
      setRefreshTrigger(prev => prev + 1);
      loadFavoritesData();
    }, [phrases])
  );

  const initializeFavorites = async () => {
    setIsLoading(true);
    await FavoritesService.initialize();
    await loadFavoritesData();
    setIsLoading(false);
  };

  const loadFavoritesData = async () => {
    // Загружаем фразы
    const phrasesData = FavoritesService.getFavoritePhrases(phrases);
    setFavoritePhrases(phrasesData);

    // Загружаем переводы
    const translationsData = FavoritesService.getFavoriteTranslations();
    setFavoriteTranslations(translationsData);

    // Загружаем слова
    const wordsData = FavoritesService.getFavoriteWords();
    setFavoriteWords(wordsData);
  };

  // Получить текст для UI
  const getText = (tk: string, zh: string, ru: string, en: string) => {
    return config.mode === 'tk' ? tk :
           config.mode === 'zh' ? zh :
           config.mode === 'en' ? en : ru;
  };

  // Конфигурация вкладок
  const tabs: Array<{
    key: FavoriteTab;
    title: string;
    icon: string;
    count: number;
  }> = [
    {
      key: 'phrases',
      title: getText('Sözlemler', '短语', 'Фразы', 'Phrases'),
      icon: 'book',
      count: favoritePhrases.length,
    },
    {
      key: 'translations',
      title: getText('Terjimeler', '翻译', 'Переводы', 'Translations'),
      icon: 'language',
      count: favoriteTranslations.length,
    },
    {
      key: 'words',
      title: getText('Sözler', '单词', 'Слова', 'Words'),
      icon: 'text',
      count: favoriteWords.length,
    },
  ];

  // Render header
  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>
        {getText('⭐ Halanýanlar', '⭐ 收藏', '⭐ Избранное', '⭐ Favorites')}
      </Text>
      <Text style={styles.headerSubtitle}>
        {getText(
          `Jemi ${favoritePhrases.length + favoriteTranslations.length + favoriteWords.length} halanan element`,
          `共 ${favoritePhrases.length + favoriteTranslations.length + favoriteWords.length} 个收藏项`,
          `Всего ${favoritePhrases.length + favoriteTranslations.length + favoriteWords.length} избранных элементов`,
          `Total ${favoritePhrases.length + favoriteTranslations.length + favoriteWords.length} favorite items`
        )}
      </Text>
    </View>
  );

  // Render tabs
  const renderTabs = () => (
    <View style={styles.tabsContainer}>
      {tabs.map(tab => (
        <TouchableOpacity
          key={tab.key}
          style={[
            styles.tab,
            activeTab === tab.key && styles.activeTab,
          ]}
          onPress={() => setActiveTab(tab.key)}
        >
          <Ionicons
            name={tab.icon as any}
            size={20}
            color={activeTab === tab.key ? Colors.primary : Colors.textLight}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === tab.key && styles.activeTabText,
            ]}
          >
            {tab.title}
          </Text>
          {tab.count > 0 && (
            <View style={[
              styles.badge,
              activeTab === tab.key && styles.activeBadge,
            ]}>
              <Text style={[
                styles.badgeText,
                activeTab === tab.key && styles.activeBadgeText,
              ]}>
                {tab.count}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      ))}
    </View>
  );

  // Render empty state
  const renderEmpty = (message: string) => (
    <View style={styles.emptyContainer}>
      <Ionicons name="heart-outline" size={64} color={Colors.textLight} />
      <Text style={styles.emptyTitle}>
        {getText('Heniz element ýok', '暂无内容', 'Пока пусто', 'Nothing here yet')}
      </Text>
      <Text style={styles.emptyText}>{message}</Text>
    </View>
  );

  // Render phrase item
  const renderPhraseItem = ({ item }: { item: PhraseWithTranslation }) => {
    const category = categories.find(cat => cat.id === item.categoryId);
    const categoryName = category ? (
      config.mode === 'tk' ? category.nameTk :
      config.mode === 'zh' ? category.nameZh :
      category.nameRu
    ) : '';

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('PhraseDetail', { phrase: item })}
      >
        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>{item.translation.text}</Text>
            {category && (
              <View style={[styles.categoryBadge, { backgroundColor: category.color }]}>
                <Text style={styles.categoryIcon}>{category.icon}</Text>
              </View>
            )}
          </View>

          {item.translation.transcription && (
            <Text style={styles.transcription}>{item.translation.transcription}</Text>
          )}

          <Text style={styles.turkmenText}>{item.turkmen}</Text>

          {categoryName && (
            <Text style={styles.categoryText}>{categoryName}</Text>
          )}
        </View>

        <TouchableOpacity
          style={styles.removeButton}
          onPress={async () => {
            await FavoritesService.removePhrase(item.id);
            loadFavoritesData();
          }}
        >
          <Ionicons name="heart" size={24} color={Colors.error} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  // Render translation item
  const renderTranslationItem = ({ item }: { item: FavoriteTranslation }) => {
    const data = item.data as TextTranslationResult;
    const isTextTranslation = item.translationType === 'text';

    return (
      <TouchableOpacity style={styles.card}>
        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <View style={styles.translationTypeBadge}>
              <Ionicons
                name={isTextTranslation ? 'text' : 'camera'}
                size={14}
                color={Colors.textWhite}
              />
              <Text style={styles.translationTypeText}>
                {isTextTranslation ? 'Text' : 'Visual'}
              </Text>
            </View>
          </View>

          <Text style={styles.cardTitle} numberOfLines={2}>
            {data.originalText || 'N/A'}
          </Text>
          <Text style={styles.turkmenText} numberOfLines={2}>
            {data.translatedText || 'N/A'}
          </Text>

          <Text style={styles.dateText}>
            {new Date(data.timestamp).toLocaleDateString()}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.removeButton}
          onPress={async () => {
            await FavoritesService.removeTranslation(item.id);
            loadFavoritesData();
          }}
        >
          <Ionicons name="heart" size={24} color={Colors.error} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  // Render words tab (placeholder for future Dictionary)
  const renderWordsTab = () => (
    <View style={styles.placeholderContainer}>
      <Ionicons name="book-outline" size={80} color={Colors.textLight} />
      <Text style={styles.placeholderTitle}>
        {getText('Sözlük häzire taýýar däl', '词典功能即将推出', 'Словарь скоро появится', 'Dictionary Coming Soon')}
      </Text>
      <Text style={styles.placeholderText}>
        {getText(
          'Sözlük funksiýasy v2.0-da goşular',
          '词典功能将在v2.0版本中推出',
          'Функция словаря появится в версии 2.0',
          'Dictionary feature will be available in v2.0'
        )}
      </Text>
    </View>
  );

  // Render active tab content
  const renderTabContent = () => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>
            {getText('Ýüklenýär...', '加载中...', 'Загрузка...', 'Loading...')}
          </Text>
        </View>
      );
    }

    switch (activeTab) {
      case 'phrases':
        return favoritePhrases.length === 0 ? (
          renderEmpty(getText(
            'Halanýan sözlem goşuň',
            '添加收藏的短语',
            'Добавьте фразы в избранное',
            'Add favorite phrases'
          ))
        ) : (
          <FlatList
            data={favoritePhrases}
            renderItem={renderPhraseItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        );

      case 'translations':
        return favoriteTranslations.length === 0 ? (
          renderEmpty(getText(
            'Halanýan terjime goşuň',
            '添加收藏的翻译',
            'Добавьте переводы в избранное',
            'Add favorite translations'
          ))
        ) : (
          <FlatList
            data={favoriteTranslations}
            renderItem={renderTranslationItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        );

      case 'words':
        return renderWordsTab();

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {renderHeader()}
        {renderTabs()}
        <View style={styles.contentContainer}>
          {renderTabContent()}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: Colors.textLight,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: 10,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    backgroundColor: Colors.cardBackground,
    gap: 6,
  },
  activeTab: {
    backgroundColor: Colors.primary + '20',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textLight,
  },
  activeTabText: {
    color: Colors.primary,
  },
  badge: {
    backgroundColor: Colors.textLight + '30',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 20,
    alignItems: 'center',
  },
  activeBadge: {
    backgroundColor: Colors.primary,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textLight,
  },
  activeBadgeText: {
    color: Colors.textWhite,
  },
  contentContainer: {
    flex: 1,
    paddingTop: 10,
  },
  listContent: {
    padding: 20,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  cardContent: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    flex: 1,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryIcon: {
    fontSize: 12,
    color: Colors.textWhite,
  },
  transcription: {
    fontSize: 14,
    color: Colors.primary,
    fontStyle: 'italic',
    marginBottom: 4,
  },
  turkmenText: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: '600',
    marginBottom: 4,
  },
  categoryText: {
    fontSize: 12,
    color: Colors.textLight,
    fontStyle: 'italic',
  },
  translationTypeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  translationTypeText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textWhite,
  },
  dateText: {
    fontSize: 11,
    color: Colors.textLight,
    marginTop: 4,
  },
  removeButton: {
    padding: 8,
    justifyContent: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    minHeight: 300,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.textLight,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 300,
  },
  loadingText: {
    fontSize: 16,
    color: Colors.textLight,
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    minHeight: 300,
  },
  placeholderTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
    marginTop: 20,
    marginBottom: 8,
    textAlign: 'center',
  },
  placeholderText: {
    fontSize: 16,
    color: Colors.textLight,
    textAlign: 'center',
  },
});
