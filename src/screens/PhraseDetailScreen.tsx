// src/screens/PhraseDetailScreen.tsx
// Updated for multilingual system with PhraseWithTranslation

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

// Import types and data
import { RootStackParamList } from '../types';
import { Colors } from '../constants/Colors';
import { categories } from '../data/categories';
import { useHistory } from '../hooks/useHistory';
import { useFavorites } from '../hooks/useFavorites';
import { useAppLanguage } from '../contexts/LanguageContext';
import { useConfig } from '../contexts/ConfigContext';
import { getTranslationsForLanguage } from '../data/languages';
import AudioPlayer from '../components/AudioPlayer';

type PhraseDetailScreenRouteProp = RouteProp<RootStackParamList, 'PhraseDetail'>;

export default function PhraseDetailScreen() {
  const route = useRoute<PhraseDetailScreenRouteProp>();
  const { phrase } = route.params;

  // Hooks
  const { addToHistory } = useHistory();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { getTexts, config: appConfig, getPhraseTexts } = useAppLanguage();
  const { selectedLanguage } = useConfig();

  const texts = getTexts();

  // Add phrase to history when screen opens
  useEffect(() => {
    addToHistory(phrase.id);
  }, [phrase.id, addToHistory]);

  // Get all language translations
  const russianTrans = getTranslationsForLanguage('ru').find(t => t.phraseId === phrase.id);
  const chineseTrans = getTranslationsForLanguage('zh').find(t => t.phraseId === phrase.id);
  const englishTrans = getTranslationsForLanguage('en').find(t => t.phraseId === phrase.id);

  // Find category
  const category = categories.find(cat => cat.id === phrase.categoryId);

  const handleToggleFavorite = () => {
    const wasInFavorites = isFavorite(phrase.id);
    toggleFavorite(phrase.id);

    const message = wasInFavorites
      ? (appConfig.mode === 'tk' ? 'Halanýanlardan aýryldy' : appConfig.mode === 'zh' ? '已从收藏中移除' : 'Удалено из избранного')
      : (appConfig.mode === 'tk' ? 'Halanýanlara goşuldy' : appConfig.mode === 'zh' ? '已添加到收藏' : 'Добавлено в избранное');

    const icon = wasInFavorites ? '💔' : '❤️';

    Alert.alert(icon + ' ' + texts.favorites, message);
  };

  const handleShare = () => {
    Alert.alert(
      '📤 ' + texts.share,
      appConfig.mode === 'tk' ? 'Bu funksiýa öňe gidişlikde!' :
        appConfig.mode === 'zh' ? '此功能正在开发中！' : 'Функция в разработке!'
    );
  };

  // Determine main text and transcription based on selected language
  let mainText = '';
  let transcription = '';
  let audioLanguage: 'english' | 'chinese' | 'russian' | 'turkmen' = 'turkmen';

  if (selectedLanguage === 'en') {
    mainText = phrase.translation.text; // English translation
    transcription = phrase.translation.transcription || '';
    audioLanguage = 'english';
  } else if (selectedLanguage === 'zh') {
    mainText = phrase.translation.text; // Chinese translation
    transcription = phrase.translation.transcription || ''; // Pinyin
    audioLanguage = 'chinese';
  } else if (selectedLanguage === 'ru') {
    mainText = phrase.translation.text; // Russian translation
    transcription = phrase.translation.transcription || '';
    audioLanguage = 'russian';
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>

        {/* Phrase card */}
        <View style={styles.phraseCard}>
          {/* Category */}
          {category && (
            <View style={[styles.categoryBadge, { backgroundColor: category.color }]}>
              <Text style={styles.categoryIcon}>{category.icon}</Text>
              <Text style={styles.categoryName}>
                {appConfig.mode === 'tk' ? category.nameTk :
                  appConfig.mode === 'zh' ? category.nameZh :
                    category.nameRu}
              </Text>
            </View>
          )}

          {/* Main text - selected language */}
          <View style={styles.mainContent}>
            <Text style={styles.mainText}>{mainText}</Text>
            {transcription ? (
              <Text style={styles.transcriptionText}>{transcription}</Text>
            ) : null}
          </View>

          {/* Translations in proper order based on selected language */}
          <View style={styles.translationsContainer}>
            {selectedLanguage === 'en' && (
              <>
                {/* English → Turkmen → Russian */}
                <View style={styles.translationRow}>
                  <Text style={styles.languageLabel}>
                    {appConfig.mode === 'tk' ? '🇬🇧 Iňlis dili:' :
                      appConfig.mode === 'zh' ? '🇬🇧 英语:' : '🇬🇧 Английский:'}
                  </Text>
                  <Text style={[styles.translationText, styles.translationTextMain]}>
                    {englishTrans?.text || phrase.translation.text}
                  </Text>
                </View>

                <View style={styles.translationRow}>
                  <Text style={styles.languageLabel}>
                    {appConfig.mode === 'tk' ? '🇹🇲 Türkmençe:' :
                      appConfig.mode === 'zh' ? '🇹🇲 土库曼语:' : '🇹🇲 Туркменский:'}
                  </Text>
                  <Text style={styles.translationText}>
                    {phrase.turkmen}
                  </Text>
                </View>

                <View style={styles.translationRow}>
                  <Text style={styles.languageLabel}>
                    {appConfig.mode === 'tk' ? '🇷🇺 Rusça:' :
                      appConfig.mode === 'zh' ? '🇷🇺 俄语:' : '🇷🇺 Русский:'}
                  </Text>
                  <Text style={styles.translationText}>
                    {russianTrans?.text || ''}
                  </Text>
                </View>
              </>
            )}

            {selectedLanguage === 'zh' && (
              <>
                {/* Chinese → Turkmen → Russian */}
                <View style={styles.translationRow}>
                  <Text style={styles.languageLabel}>
                    {appConfig.mode === 'tk' ? '🇨🇳 Hytaýça:' :
                      appConfig.mode === 'zh' ? '🇨🇳 中文:' : '🇨🇳 Китайский:'}
                  </Text>
                  <Text style={[styles.translationText, styles.translationTextMain]}>
                    {chineseTrans?.text || phrase.translation.text}
                  </Text>
                </View>

                <View style={styles.translationRow}>
                  <Text style={styles.languageLabel}>
                    {appConfig.mode === 'tk' ? '🇹🇲 Türkmençe:' :
                      appConfig.mode === 'zh' ? '🇹🇲 土库曼语:' : '🇹🇲 Туркменский:'}
                  </Text>
                  <Text style={styles.translationText}>
                    {phrase.turkmen}
                  </Text>
                </View>

                <View style={styles.translationRow}>
                  <Text style={styles.languageLabel}>
                    {appConfig.mode === 'tk' ? '🇷🇺 Rusça:' :
                      appConfig.mode === 'zh' ? '🇷🇺 俄语:' : '🇷🇺 Русский:'}
                  </Text>
                  <Text style={styles.translationText}>
                    {russianTrans?.text || ''}
                  </Text>
                </View>
              </>
            )}

            {selectedLanguage === 'ru' && (
              <>
                {/* Russian → Turkmen → Chinese */}
                <View style={styles.translationRow}>
                  <Text style={styles.languageLabel}>
                    {appConfig.mode === 'tk' ? '🇷🇺 Rusça:' :
                      appConfig.mode === 'zh' ? '🇷🇺 俄语:' : '🇷🇺 Русский:'}
                  </Text>
                  <Text style={[styles.translationText, styles.translationTextMain]}>
                    {russianTrans?.text || phrase.translation.text}
                  </Text>
                </View>

                <View style={styles.translationRow}>
                  <Text style={styles.languageLabel}>
                    {appConfig.mode === 'tk' ? '🇹🇲 Türkmençe:' :
                      appConfig.mode === 'zh' ? '🇹🇲 土库曼语:' : '🇹🇲 Туркменский:'}
                  </Text>
                  <Text style={styles.translationText}>
                    {phrase.turkmen}
                  </Text>
                </View>

                <View style={styles.translationRow}>
                  <Text style={styles.languageLabel}>
                    {appConfig.mode === 'tk' ? '🇨🇳 Hytaýça:' :
                      appConfig.mode === 'zh' ? '🇨🇳 中文:' : '🇨🇳 Китайский:'}
                  </Text>
                  <Text style={styles.translationText}>
                    {chineseTrans?.text || ''}
                  </Text>
                </View>
              </>
            )}
          </View>
        </View>

        {/* Audio button for selected language (TTS) */}
        {selectedLanguage !== 'tk' && (
          <AudioPlayer
            text={mainText}
            language={audioLanguage}
            label={
              selectedLanguage === 'en' ?
                (appConfig.mode === 'tk' ? 'Iňlis sesi' :
                  appConfig.mode === 'zh' ? '英语发音' : 'Английское произношение')
                : selectedLanguage === 'zh' ?
                  (appConfig.mode === 'tk' ? 'Hytaý sesi' :
                    appConfig.mode === 'zh' ? '中文发音' : 'Китайское произношение')
                  : (appConfig.mode === 'tk' ? 'Rus sesi' :
                    appConfig.mode === 'zh' ? '俄语发音' : 'Русское произношение')
            }
            style="primary"
            size="large"
          />
        )}

        {/* Turkmen audio button (MP3) */}
        <AudioPlayer
          text={phrase.turkmen}
          language="turkmen"
          audioPath={phrase.audioFileTurkmen}
          label={
            appConfig.mode === 'tk' ? 'Türkmen sesi' :
              appConfig.mode === 'zh' ? '土库曼发音' :
                'Туркменское произношение'
          }
          style="secondary"
          size="large"
        />

        {/* Action buttons */}
        <View style={styles.actionsContainer}>
          {/* Favorite button */}
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

          {/* Share button */}
          <TouchableOpacity
            style={[styles.actionButton, styles.shareButton]}
            onPress={handleShare}
          >
            <Ionicons name="share-outline" size={24} color={Colors.textLight} />
            <Text style={styles.actionButtonText}>{texts.share}</Text>
          </TouchableOpacity>
        </View>

        {/* Additional information */}
        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>
            {appConfig.mode === 'tk' ? '💡 Aýdylyş maslahat' :
              appConfig.mode === 'zh' ? '💡 发音建议' : '💡 Совет по произношению'}
          </Text>
          <Text style={styles.infoText}>
            {appConfig.mode === 'tk' ?
              'Sesli faýly birnäçe gezek diňläň we gaýtalaň. Hytaý dili ton dilidir, şonuň üçin intonasiýa möhümdir.' :
              appConfig.mode === 'zh' ?
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
  mainText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  transcriptionText: {
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
