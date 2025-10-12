// src/screens/PhraseDetailScreen.tsx
// ✅ ИСПРАВЛЕНО: Обновлен AudioPlayer для работы с MP3 файлами

import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

// Импортируем типы и данные
import { RootStackParamList } from '../types';
import { Colors } from '../constants/Colors';
import { categories } from '../data/categories';
import { useHistory } from '../hooks/useHistory';
import { useFavorites } from '../hooks/useFavorites';
import { useAppLanguage } from '../contexts/LanguageContext';
import AudioPlayer from '../components/AudioPlayer';

type PhraseDetailScreenRouteProp = RouteProp<RootStackParamList, 'PhraseDetail'>;

export default function PhraseDetailScreen() {
  const route = useRoute<PhraseDetailScreenRouteProp>();
  const { phrase } = route.params;

  // Хуки
  const { addToHistory } = useHistory();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { getTexts, config, getPhraseTexts } = useAppLanguage();
  
  const texts = getTexts();
  const phraseTexts = getPhraseTexts(phrase);
  
  // Добавляем фразу в историю при открытии экрана
  useEffect(() => {
    addToHistory(phrase.id);
  }, [phrase.id, addToHistory]);

  // Находим категорию фразы
  const category = categories.find(cat => cat.id === phrase.categoryId);

  const handleToggleFavorite = () => {
    const wasInFavorites = isFavorite(phrase.id);
    toggleFavorite(phrase.id);
    
    const message = wasInFavorites
      ? (config.mode === 'tk' ? 'Halanýanlardan aýryldy' : config.mode === 'zh' ? '已从收藏中移除' : 'Удалено из избранного')
      : (config.mode === 'tk' ? 'Halanýanlara goşuldy' : config.mode === 'zh' ? '已添加到收藏' : 'Добавлено в избранное');
    
    const icon = wasInFavorites ? '💔' : '❤️';
    
    Alert.alert(icon + ' ' + texts.favorites, message);
  };

  const handleShare = () => {
    Alert.alert(
      '📤 ' + texts.share, 
      config.mode === 'tk' ? 'Bu funksiýa öňe gidişlikde!' : 
      config.mode === 'zh' ? '此功能正在开发中！' : 'Функция в разработке!'
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>

        {/* Карточка с фразой */}
        <View style={styles.phraseCard}>
          {/* Категория */}
          {category && (
            <View style={[styles.categoryBadge, { backgroundColor: category.color }]}>
              <Text style={styles.categoryIcon}>{category.icon}</Text>
              <Text style={styles.categoryName}>
                {config.mode === 'tk' ? category.nameTk : 
                 config.mode === 'zh' ? category.nameZh : 
                 category.nameRu}
              </Text>
            </View>
          )}

          {/* Основной текст */}
          <View style={styles.mainContent}>
            <Text style={styles.chineseText}>{phrase.chinese}</Text>
            <Text style={styles.pinyinText}>{phrase.pinyin}</Text>
          </View>

          {/* Переводы в правильном порядке */}
          <View style={styles.translationsContainer}>
            <View style={styles.translationRow}>
              <Text style={styles.languageLabel}>
                {config.mode === 'tk' ? '🇹🇲 Türkmençe:' : 
                 config.mode === 'zh' ? '🇹🇲 土库曼语:' : '🇹🇲 Туркменский:'}
              </Text>
              <Text style={[
                styles.translationText,
                config.mode === 'tk' && styles.translationTextMain
              ]}>
                {phrase.turkmen}
              </Text>
            </View>

            <View style={styles.translationRow}>
              <Text style={styles.languageLabel}>
                {config.mode === 'tk' ? '🇨🇳 Hytaýça:' : 
                 config.mode === 'zh' ? '🇨🇳 中文:' : '🇨🇳 Китайский:'}
              </Text>
              <Text style={[
                styles.translationText,
                config.mode === 'zh' && styles.translationTextMain
              ]}>
                {phrase.chinese}
              </Text>
            </View>

            <View style={styles.translationRow}>
              <Text style={styles.languageLabel}>
                {config.mode === 'tk' ? '🇷🇺 Rusça:' : 
                 config.mode === 'zh' ? '🇷🇺 俄语:' : '🇷🇺 Русский:'}
              </Text>
              <Text style={styles.translationText}>{phrase.russian}</Text>
            </View>
          </View>
        </View>

        {/* ✅ ИСПРАВЛЕНО: Кнопки аудио с новыми props */}
        <View style={styles.audioContainer}>
          <AudioPlayer
            audioFileChinese={phrase.audioFileChinese}
            audioFileTurkmen={phrase.audioFileTurkmen}
            language="chinese"
            label={
              config.mode === 'tk' ? 'Hytaý sesi' : 
              config.mode === 'zh' ? '中文发音' : 
              'Китайское произношение'
            }
            style="primary"
            size="large"
          />
          
          <AudioPlayer
            audioFileChinese={phrase.audioFileChinese}
            audioFileTurkmen={phrase.audioFileTurkmen}
            language="turkmen"
            label={
              config.mode === 'tk' ? 'Türkmen sesi' : 
              config.mode === 'zh' ? '土库曼语发音' : 
              'Туркменское произношение'
            }
            style="secondary"
            size="large"
          />
        </View>

        {/* Кнопки действий */}
        <View style={styles.actionsContainer}>
          {/* Кнопка избранного */}
          <TouchableOpacity
            style={[styles.actionButton, styles.favoriteButton]}
            onPress={handleToggleFavorite}
          >
            <Ionicons
              name={isFavorite(phrase.id) ? "heart" : "heart-outline"}
              size={24}
              color={isFavorite(phrase.id) ? Colors.error : Colors.textLight}
            />
            <Text style={[
              styles.actionButtonText, 
              isFavorite(phrase.id) && styles.favoriteButtonTextActive
            ]}>
              {isFavorite(phrase.id) ? texts.inFavorites : texts.addToFavorites}
            </Text>
          </TouchableOpacity>

          {/* Кнопка поделиться */}
          <TouchableOpacity
            style={[styles.actionButton, styles.shareButton]}
            onPress={handleShare}
          >
            <Ionicons name="share-outline" size={24} color={Colors.textLight} />
            <Text style={styles.actionButtonText}>{texts.share}</Text>
          </TouchableOpacity>
        </View>

        {/* Дополнительная информация */}
        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>
            {config.mode === 'tk' ? '💡 Aýdylyş maslahat' : 
             config.mode === 'zh' ? '💡 发音建议' : '💡 Совет по произношению'}
          </Text>
          <Text style={styles.infoText}>
            {config.mode === 'tk' ? 
              'Sesli faýly birnäçe gezek diňläň we gaýtalaň. Hytaý dili ton dilidir, şonuň üçin intonasiýa möhümdir.' :
             config.mode === 'zh' ?
              '多次听音频并重复。中文是声调语言，所以语调很重要。' :
              'Слушайте аудио несколько раз и повторяйте. Китайский - тональный язык, поэтому важно обращать внимание на интонацию.'
            }
          </Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundLight,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  phraseCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
    shadowColor: Colors.cardShadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 20,
  },
  categoryIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  categoryName: {
    color: Colors.textWhite,
    fontWeight: '600',
    fontSize: 14,
  },
  mainContent: {
    alignItems: 'center',
    marginBottom: 24,
  },
  chineseText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  pinyinText: {
    fontSize: 20,
    color: Colors.primary,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  translationsContainer: {
    gap: 12,
  },
  translationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  languageLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textLight,
    width: 130,
  },
  translationText: {
    fontSize: 16,
    color: Colors.text,
    flex: 1,
    fontWeight: '500',
  },
  translationTextMain: {
    fontSize: 18,
    fontWeight: '600',
  },
  audioContainer: {
    gap: 12,
    marginBottom: 20,
  },
  actionsContainer: {
    gap: 12,
    marginBottom: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 8,
  },
  favoriteButton: {
    backgroundColor: Colors.cardBackground,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  shareButton: {
    backgroundColor: Colors.cardBackground,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  actionButtonText: {
    color: Colors.textLight,
    fontSize: 16,
    fontWeight: '500',
  },
  favoriteButtonTextActive: {
    color: Colors.error,
  },
  infoContainer: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: Colors.accent,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: Colors.textLight,
    lineHeight: 20,
  },
});