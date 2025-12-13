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
  StatusBar,
  Platform,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { Colors } from '../../../constants/Colors';
import { DesignColors } from '../../../constants/Design';
import { useSafeArea } from '../../../hooks/useSafeArea';
import { verticalScale } from '../../../utils/ResponsiveUtils';
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

  // Safe Area для bottom padding (home indicator)
  const { bottom: safeAreaBottom } = useSafeArea();

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
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={DesignColors.background}
        translucent={false}
      />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(safeAreaBottom, verticalScale(20)) }
        ]}
        showsVerticalScrollIndicator={false}
      >
        {renderHeader()}
        {renderTabs()}
        <View style={styles.contentContainer}>
          {renderTabContent()}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  activeBadge: {
    backgroundColor: Colors.primary,
  },
  activeBadgeText: {
    color: Colors.textWhite,
  },
  activeTab: {
    backgroundColor: Colors.primary + '20',
  },
  activeTabText: {
    color: Colors.primary,
  },
  badge: {
    alignItems: 'center',
    backgroundColor: Colors.textLight + '30',
    borderRadius: 10,
    minWidth: 20,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  badgeText: {
    color: Colors.textLight,
    fontSize: 11,
    fontWeight: '700',
  },
  card: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    elevation: 2,
    flexDirection: 'row',
    marginBottom: 12,
    padding: 16,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  cardContent: {
    flex: 1,
  },
  cardHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  cardTitle: {
    color: Colors.text,
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
  },
  categoryBadge: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  categoryIcon: {
    color: Colors.textWhite,
    fontSize: 12,
  },
  categoryText: {
    color: Colors.textLight,
    fontSize: 12,
    fontStyle: 'italic',
  },
  container: {
    backgroundColor: DesignColors.background,
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  contentContainer: {
    flex: 1,
    paddingTop: 10,
  },
  dateText: {
    color: Colors.textLight,
    fontSize: 11,
    marginTop: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    minHeight: 300,
    padding: 40,
  },
  emptyText: {
    color: Colors.textLight,
    fontSize: 16,
    textAlign: 'center',
  },
  emptyTitle: {
    color: Colors.text,
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 16,
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  headerSubtitle: {
    color: Colors.textLight,
    fontSize: 16,
  },
  headerTitle: {
    color: Colors.text,
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  listContent: {
    padding: 20,
  },
  loadingContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    minHeight: 300,
  },
  loadingText: {
    color: Colors.textLight,
    fontSize: 16,
  },
  placeholderContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    minHeight: 300,
    padding: 40,
  },
  placeholderText: {
    color: Colors.textLight,
    fontSize: 16,
    textAlign: 'center',
  },
  placeholderTitle: {
    color: Colors.text,
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 20,
    textAlign: 'center',
  },
  removeButton: {
    justifyContent: 'center',
    padding: 8,
  },
  scrollContent: {
    flexGrow: 1,
  },
  scrollView: {
    flex: 1,
  },
  tab: {
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    flex: 1,
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingVertical: 12,
  },
  tabText: {
    color: Colors.textLight,
    fontSize: 13,
    fontWeight: '600',
  },
  tabsContainer: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  transcription: {
    color: Colors.primary,
    fontSize: 14,
    fontStyle: 'italic',
    marginBottom: 4,
  },
  translationTypeBadge: {
    alignItems: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 12,
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  translationTypeText: {
    color: Colors.textWhite,
    fontSize: 11,
    fontWeight: '600',
  },
  turkmenText: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
});
