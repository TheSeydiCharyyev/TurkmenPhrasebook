// src/screens/PhraseDetailScreen.tsx
// Updated for multilingual system with PhraseWithTranslation

import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { scale, verticalScale, moderateScale } from '../utils/ResponsiveUtils';

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
  const navigation = useNavigation();
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

  // ✅ ИСПРАВЛЕНО: Получаем перевод для ТЕКУЩЕГО выбранного языка
  const currentLanguageTranslation = phrase.translation; // Уже содержит перевод для выбранного языка

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

  // ✅ УНИВЕРСАЛЬНАЯ логика для всех 31 языков
  const mainText = currentLanguageTranslation.text;
  const transcription = currentLanguageTranslation.transcription || '';

  // Map language code to audio language name
  const getAudioLanguage = (langCode: string): string => {
    const languageMap: { [key: string]: string } = {
      'tk': 'turkmen', 'zh': 'chinese', 'ru': 'russian', 'en': 'english',
      'ja': 'japanese', 'ko': 'korean', 'th': 'thai', 'vi': 'vietnamese',
      'id': 'indonesian', 'ms': 'malay', 'hi': 'hindi', 'ur': 'urdu',
      'fa': 'persian', 'ps': 'pashto', 'de': 'german', 'fr': 'french',
      'es': 'spanish', 'it': 'italian', 'tr': 'turkish', 'pl': 'polish',
      'uk': 'ukrainian', 'pt': 'portuguese', 'nl': 'dutch', 'uz': 'uzbek',
      'kk': 'kazakh', 'az': 'azerbaijani', 'ky': 'kyrgyz', 'tg': 'tajik',
      'hy': 'armenian', 'ka': 'georgian', 'ar': 'arabic',
    };
    return languageMap[langCode] || 'english';
  };

  const audioLanguage = getAudioLanguage(selectedLanguage);

  // Get language label with flag
  const getLanguageLabel = (): string => {
    const labelMap: { [key: string]: string } = {
      'tk': '🇹🇲 Türkmençe', 'zh': '🇨🇳 中文', 'ru': '🇷🇺 Русский', 'en': '🇬🇧 English',
      'ja': '🇯🇵 日本語', 'ko': '🇰🇷 한국어', 'th': '🇹🇭 ไทย', 'vi': '🇻🇳 Tiếng Việt',
      'id': '🇮🇩 Bahasa Indonesia', 'ms': '🇲🇾 Bahasa Melayu', 'hi': '🇮🇳 हिन्दी',
      'ur': '🇵🇰 اردو', 'fa': '🇮🇷 فارسی', 'ps': '🇦🇫 پښتو', 'de': '🇩🇪 Deutsch',
      'fr': '🇫🇷 Français', 'es': '🇪🇸 Español', 'it': '🇮🇹 Italiano', 'tr': '🇹🇷 Türkçe',
      'pl': '🇵🇱 Polski', 'uk': '🇺🇦 Українська', 'pt': '🇵🇹 Português', 'nl': '🇳🇱 Nederlands',
      'uz': '🇺🇿 Oʻzbekcha', 'kk': '🇰🇿 Қазақша', 'az': '🇦🇿 Azərbaycan', 'ky': '🇰🇬 Кыргызча',
      'tg': '🇹🇯 Тоҷикӣ', 'hy': '🇦🇲 Հայերեն', 'ka': '🇬🇪 ქართული', 'ar': '🇸🇦 العربية',
    };
    return labelMap[selectedLanguage] || '🇬🇧 English';
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{texts.pronunciation}</Text>
        <View style={styles.placeholder} />
      </View>

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

          {/* ✅ ЯЗЫКОВАЯ ПАРА - только выбранный язык + туркменский */}
          <View style={styles.mainContent}>
            {/* Выбранный язык - ГЛАВНЫЙ */}
            <Text style={styles.languageLabel}>{getLanguageLabel()}</Text>
            <Text style={styles.mainText}>{mainText}</Text>
            {transcription ? (
              <Text style={styles.transcriptionText}>{transcription}</Text>
            ) : null}
          </View>

          {/* Туркменский - ВТОРИЧНЫЙ */}
          <View style={styles.secondaryContent}>
            <Text style={styles.languageLabelSecondary}>🇹🇲 Türkmençe</Text>
            <Text style={styles.secondaryText}>{phrase.turkmen}</Text>
          </View>
        </View>

        {/* ✅ Аудио кнопки с увеличенным расстоянием */}
        <View style={styles.audioButtonsContainer}>
          {/* Audio button for selected language (TTS) */}
          {selectedLanguage !== 'tk' && (
            <AudioPlayer
              text={mainText}
              language={audioLanguage}
              label={`▶ ${getLanguageLabel()}`}
              style="primary"
              size="large"
            />
          )}

          {/* Turkmen audio button (MP3) */}
          <AudioPlayer
            text={phrase.turkmen}
            language="turkmen"
            audioPath={phrase.audioFileTurkmen}
            label="▶ 🇹🇲 Türkmençe"
            style="secondary"
            size="large"
          />
        </View>

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
    padding: scale(16),
  },
  // ✅ HERO + GRID - Мощные тени
  phraseCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: scale(24),          // ✅ Больше скругление
    padding: scale(28),               // ✅ Больше padding
    marginBottom: verticalScale(24),          // ✅ Больше margin
    elevation: 10,             // ✅ Мощная тень
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: verticalScale(6),
    },
    shadowOpacity: 0.25,       // ✅ Более заметная тень
    shadowRadius: scale(16),
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(6),
    borderRadius: scale(20),
    marginBottom: verticalScale(20),
  },
  categoryIcon: {
    fontSize: moderateScale(16),
    marginRight: scale(6),
  },
  categoryName: {
    color: Colors.textWhite,
    fontWeight: '600',
    fontSize: moderateScale(14),
  },
  mainContent: {
    alignItems: 'center',
    marginBottom: verticalScale(32),          // ✅ Больше отступ
    paddingBottom: verticalScale(24),
    borderBottomWidth: 2,
    borderBottomColor: '#E5E7EB',
  },
  languageLabel: {
    fontSize: moderateScale(16),
    fontWeight: '700',
    color: '#6B7280',
    marginBottom: verticalScale(12),
    textAlign: 'center',
  },
  mainText: {
    fontSize: moderateScale(54),              // ✅ ЕЩЕ КРУПНЕЕ
    fontWeight: 'bold',
    color: '#2563EB',          // ✅ Синий - как кнопка
    marginBottom: verticalScale(12),
    textAlign: 'center',
  },
  transcriptionText: {
    fontSize: moderateScale(22),              // ✅ Крупнее
    color: '#6B7280',
    fontStyle: 'italic',
    textAlign: 'center',
    letterSpacing: 1,
  },
  // ✅ НОВЫЙ стиль для туркменского
  secondaryContent: {
    alignItems: 'center',
    marginTop: verticalScale(8),
  },
  languageLabelSecondary: {
    fontSize: moderateScale(16),
    fontWeight: '700',
    color: '#6B7280',
    marginBottom: verticalScale(12),
  },
  secondaryText: {
    fontSize: moderateScale(32),              // ✅ Крупный вторичный текст
    fontWeight: 'bold',
    color: '#16A34A',          // ✅ Зеленый - как кнопка
    textAlign: 'center',
  },
  // ✅ НОВЫЙ контейнер для аудио кнопок
  audioButtonsContainer: {
    gap: verticalScale(16),                   // ✅ Расстояние между кнопками
    marginBottom: verticalScale(24),
  },
  actionsContainer: {
    gap: verticalScale(12),
    marginBottom: verticalScale(20),
  },
  // ✅ HERO + GRID - Современные кнопки
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(16),         // ✅ Больше padding
    paddingHorizontal: scale(24),       // ✅ Больше padding
    borderRadius: scale(16),            // ✅ Больше скругление
    gap: scale(10),
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: verticalScale(3) },
    shadowOpacity: 0.15,
    shadowRadius: scale(8),
  },
  favoriteButton: {
    backgroundColor: Colors.cardBackground,
    borderWidth: 2,              // ✅ Толще border
    borderColor: '#E5E7EB',
  },
  shareButton: {
    backgroundColor: Colors.cardBackground,
    borderWidth: 2,              // ✅ Толще border
    borderColor: '#E5E7EB',
  },
  actionButtonText: {
    color: '#374151',            // ✅ Более темный текст
    fontSize: moderateScale(17),                // ✅ Крупнее
    fontWeight: '600',           // ✅ Более жирный
  },
  favoriteButtonTextActive: {
    color: Colors.error,
    fontWeight: '700',
  },
  // ✅ HERO + GRID - Современный info box
  infoContainer: {
    backgroundColor: '#EFF6FF',    // ✅ Светло-синий фон
    borderRadius: scale(16),              // ✅ Больше скругление
    padding: scale(20),                   // ✅ Больше padding
    borderLeftWidth: 5,            // ✅ Толще border
    borderLeftColor: '#3B82F6',    // ✅ Синий accent
    elevation: 2,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: verticalScale(2) },
    shadowOpacity: 0.1,
    shadowRadius: scale(4),
  },
  infoTitle: {
    fontSize: moderateScale(17),                  // ✅ Крупнее
    fontWeight: '700',             // ✅ Более жирный
    color: '#1E40AF',              // ✅ Темно-синий
    marginBottom: verticalScale(10),
  },
  infoText: {
    fontSize: moderateScale(15),                  // ✅ Крупнее
    color: '#475569',              // ✅ Темнее для читаемости
    lineHeight: moderateScale(22),                // ✅ Больше line height
  },
  // Header with back button
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(12),
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.background,
  },
  backButton: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(20),
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: {
    fontSize: moderateScale(18),
    fontWeight: '700',
    color: Colors.text,
  },
  placeholder: {
    width: scale(32),
  },
});
