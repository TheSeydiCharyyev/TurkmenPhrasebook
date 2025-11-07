/**
 * Language Pair Selection Screen
 * Shown when user enters Phrasebook for the first time
 * Allows selection of language pair (e.g., Chinese-Turkmen, Russian-Turkmen, etc.)
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { useAppLanguage } from '../contexts/LanguageContext';
import { useConfig } from '../contexts/ConfigContext';
import { getLanguageByCode } from '../config/languages.config';
import type { HomeStackParamList } from '../types';
import { scale, verticalScale, moderateScale } from '../utils/ResponsiveUtils';

interface LanguagePair {
  id: string;
  code: string; // Language code (zh, ru, en)
  name: string; // Native name
  nameEn: string; // English name
  flag: string;
  gradient: [string, string];
}

type LanguagePairNavigationProp = StackNavigationProp<HomeStackParamList, 'LanguagePairSelection'>;

const LanguagePairSelectionScreen: React.FC = () => {
  const navigation = useNavigation<LanguagePairNavigationProp>();
  const { getTexts, config } = useAppLanguage();
  const { setSelectedLanguage } = useConfig();
  const texts = getTexts();
  const [selectedPair, setSelectedPair] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Available language pairs (30 languages paired with Turkmen)
  const availablePairs: LanguagePair[] = [
    {
      id: 'zh-tk',
      code: 'zh',
      name: '中文',
      nameEn: 'Chinese',
      flag: '🇨🇳',
      gradient: ['#EF4444', '#DC2626'],
    },
    {
      id: 'ru-tk',
      code: 'ru',
      name: 'Русский',
      nameEn: 'Russian',
      flag: '🇷🇺',
      gradient: ['#3B82F6', '#2563EB'],
    },
    {
      id: 'en-tk',
      code: 'en',
      name: 'English',
      nameEn: 'English',
      flag: '🇬🇧',
      gradient: ['#8B5CF6', '#7C3AED'],
    },
    {
      id: 'tr-tk',
      code: 'tr',
      name: 'Türkçe',
      nameEn: 'Turkish',
      flag: '🇹🇷',
      gradient: ['#EF4444', '#DC2626'],
    },
    {
      id: 'uz-tk',
      code: 'uz',
      name: 'O\'zbek',
      nameEn: 'Uzbek',
      flag: '🇺🇿',
      gradient: ['#06B6D4', '#0891B2'],
    },
    {
      id: 'de-tk',
      code: 'de',
      name: 'Deutsch',
      nameEn: 'German',
      flag: '🇩🇪',
      gradient: ['#000000', '#DD0000'],
    },
    {
      id: 'fr-tk',
      code: 'fr',
      name: 'Français',
      nameEn: 'French',
      flag: '🇫🇷',
      gradient: ['#0055A4', '#EF4135'],
    },
    {
      id: 'es-tk',
      code: 'es',
      name: 'Español',
      nameEn: 'Spanish',
      flag: '🇪🇸',
      gradient: ['#AA151B', '#F1BF00'],
    },
    {
      id: 'it-tk',
      code: 'it',
      name: 'Italiano',
      nameEn: 'Italian',
      flag: '🇮🇹',
      gradient: ['#009246', '#CE2B37'],
    },
    {
      id: 'ja-tk',
      code: 'ja',
      name: '日本語',
      nameEn: 'Japanese',
      flag: '🇯🇵',
      gradient: ['#BC002D', '#FFFFFF'],
    },
    {
      id: 'ko-tk',
      code: 'ko',
      name: '한국어',
      nameEn: 'Korean',
      flag: '🇰🇷',
      gradient: ['#003478', '#CD2E3A'],
    },
    {
      id: 'pl-tk',
      code: 'pl',
      name: 'Polski',
      nameEn: 'Polish',
      flag: '🇵🇱',
      gradient: ['#FFFFFF', '#DC143C'],
    },
    {
      id: 'pt-tk',
      code: 'pt',
      name: 'Português',
      nameEn: 'Portuguese',
      flag: '🇵🇹',
      gradient: ['#006600', '#FF0000'],
    },
    {
      id: 'nl-tk',
      code: 'nl',
      name: 'Nederlands',
      nameEn: 'Dutch',
      flag: '🇳🇱',
      gradient: ['#21468B', '#AE1C28'],
    },
    {
      id: 'az-tk',
      code: 'az',
      name: 'Azərbaycan',
      nameEn: 'Azerbaijani',
      flag: '🇦🇿',
      gradient: ['#0098C3', '#EF3340'],
    },
    {
      id: 'kk-tk',
      code: 'kk',
      name: 'Қазақ',
      nameEn: 'Kazakh',
      flag: '🇰🇿',
      gradient: ['#00AFCA', '#FEC50C'],
    },
    {
      id: 'ky-tk',
      code: 'ky',
      name: 'Кыргыз',
      nameEn: 'Kyrgyz',
      flag: '🇰🇬',
      gradient: ['#E8112D', '#FFEF00'],
    },
    {
      id: 'tg-tk',
      code: 'tg',
      name: 'Тоҷикӣ',
      nameEn: 'Tajik',
      flag: '🇹🇯',
      gradient: ['#006600', '#FFFFFF'],
    },
    {
      id: 'uk-tk',
      code: 'uk',
      name: 'Українська',
      nameEn: 'Ukrainian',
      flag: '🇺🇦',
      gradient: ['#0057B7', '#FFD700'],
    },
    {
      id: 'th-tk',
      code: 'th',
      name: 'ไทย',
      nameEn: 'Thai',
      flag: '🇹🇭',
      gradient: ['#ED1C24', '#FFFFFF'],
    },
    {
      id: 'vi-tk',
      code: 'vi',
      name: 'Tiếng Việt',
      nameEn: 'Vietnamese',
      flag: '🇻🇳',
      gradient: ['#DA251D', '#FFCD00'],
    },
    {
      id: 'id-tk',
      code: 'id',
      name: 'Bahasa Indonesia',
      nameEn: 'Indonesian',
      flag: '🇮🇩',
      gradient: ['#FF0000', '#FFFFFF'],
    },
    {
      id: 'hi-tk',
      code: 'hi',
      name: 'हिन्दी',
      nameEn: 'Hindi',
      flag: '🇮🇳',
      gradient: ['#FF9933', '#138808'],
    },
    {
      id: 'ar-tk',
      code: 'ar',
      name: 'العربية',
      nameEn: 'Arabic',
      flag: '🇸🇦',
      gradient: ['#006C35', '#FFFFFF'],
    },
    {
      id: 'fa-tk',
      code: 'fa',
      name: 'فارسی',
      nameEn: 'Persian',
      flag: '🇮🇷',
      gradient: ['#239F40', '#DA0000'],
    },
    {
      id: 'ms-tk',
      code: 'ms',
      name: 'Bahasa Melayu',
      nameEn: 'Malay',
      flag: '🇲🇾',
      gradient: ['#010066', '#CC0001'],
    },
    {
      id: 'ur-tk',
      code: 'ur',
      name: 'اردو',
      nameEn: 'Urdu',
      flag: '🇵🇰',
      gradient: ['#01411C', '#115740'],
    },
    {
      id: 'ps-tk',
      code: 'ps',
      name: 'پښتو',
      nameEn: 'Pashto',
      flag: '🇦🇫',
      gradient: ['#000000', '#D32011'],
    },
    {
      id: 'hy-tk',
      code: 'hy',
      name: 'Հայերեն',
      nameEn: 'Armenian',
      flag: '🇦🇲',
      gradient: ['#D90012', '#0033A0'],
    },
    {
      id: 'ka-tk',
      code: 'ka',
      name: 'ქართული',
      nameEn: 'Georgian',
      flag: '🇬🇪',
      gradient: ['#FFFFFF', '#FF0000'],
    },
  ];

  const handleSelect = async (pair: LanguagePair) => {
    if (isLoading) return;

    setSelectedPair(pair.code);
    setIsLoading(true);

    try {
      // Save selection using ConfigContext
      await setSelectedLanguage(pair.code);

      // Navigate to HomeScreen after selection
      setTimeout(() => {
        navigation.navigate('HomeScreen');
      }, 300);
    } catch (error) {
      console.error('Failed to save language pair:', error);
      setIsLoading(false);
    }
  };

  // Get titles based on interface language
  const getTitle = () => {
    switch (config.mode) {
      case 'tk':
        return 'Gepleşik kitaby dilini saýlaň';
      case 'zh':
        return '选择会话手册语言';
      case 'ru':
        return 'Выберите язык разговорника';
      case 'en':
        return 'Choose Phrasebook Language';
      default:
        return 'Choose Phrasebook Language';
    }
  };

  const getSubtitle = () => {
    switch (config.mode) {
      case 'tk':
        return 'Siz haýsy dili öwrenmek isleýärsiňiz?';
      case 'zh':
        return '您想学习哪种语言？';
      case 'ru':
        return 'Какой язык вы хотите изучать?';
      case 'en':
        return 'Which language do you want to learn?';
      default:
        return 'Which language do you want to learn?';
    }
  };

  const getPairDescription = (pairCode: string) => {
    const descriptions: Record<string, Record<string, string>> = {
      zh: {
        tk: 'Hytaý - Türkmen',
        zh: '中文 - 土库曼语',
        ru: 'Китайский - Туркменский',
        en: 'Chinese - Turkmen',
      },
      ru: {
        tk: 'Rus - Türkmen',
        zh: '俄语 - 土库曼语',
        ru: 'Русский - Туркменский',
        en: 'Russian - Turkmen',
      },
      en: {
        tk: 'Iňlis - Türkmen',
        zh: '英语 - 土库曼语',
        ru: 'Английский - Туркменский',
        en: 'English - Turkmen',
      },
      tr: {
        tk: 'Türk - Türkmen',
        zh: '土耳其语 - 土库曼语',
        ru: 'Турецкий - Туркменский',
        en: 'Turkish - Turkmen',
      },
      uz: {
        tk: 'Özbek - Türkmen',
        zh: '乌兹别克语 - 土库曼语',
        ru: 'Узбекский - Туркменский',
        en: 'Uzbek - Turkmen',
      },
      de: {
        tk: 'Nemes - Türkmen',
        zh: '德语 - 土库曼语',
        ru: 'Немецкий - Туркменский',
        en: 'German - Turkmen',
      },
      fr: {
        tk: 'Fransuz - Türkmen',
        zh: '法语 - 土库曼语',
        ru: 'Французский - Туркменский',
        en: 'French - Turkmen',
      },
      es: {
        tk: 'Ispan - Türkmen',
        zh: '西班牙语 - 土库曼语',
        ru: 'Испанский - Туркменский',
        en: 'Spanish - Turkmen',
      },
      it: {
        tk: 'Italýan - Türkmen',
        zh: '意大利语 - 土库曼语',
        ru: 'Итальянский - Туркменский',
        en: 'Italian - Turkmen',
      },
      ja: {
        tk: 'Ýapon - Türkmen',
        zh: '日语 - 土库曼语',
        ru: 'Японский - Туркменский',
        en: 'Japanese - Turkmen',
      },
      ko: {
        tk: 'Koreý - Türkmen',
        zh: '韩语 - 土库曼语',
        ru: 'Корейский - Туркменский',
        en: 'Korean - Turkmen',
      },
      id: {
        tk: 'Indoneziýa - Türkmen',
        zh: '印尼语 - 土库曼语',
        ru: 'Индонезийский - Туркменский',
        en: 'Indonesian - Turkmen',
      },
      hi: {
        tk: 'Hindi - Türkmen',
        zh: '印地语 - 土库曼语',
        ru: 'Хинди - Туркменский',
        en: 'Hindi - Turkmen',
      },
      ar: {
        tk: 'Arap - Türkmen',
        zh: '阿拉伯语 - 土库曼语',
        ru: 'Арабский - Туркменский',
        en: 'Arabic - Turkmen',
      },
      fa: {
        tk: 'Pars - Türkmen',
        zh: '波斯语 - 土库曼语',
        ru: 'Персидский - Туркменский',
        en: 'Persian - Turkmen',
      },
      ms: {
        tk: 'Malaý - Türkmen',
        zh: '马来语 - 土库曼语',
        ru: 'Малайский - Туркменский',
        en: 'Malay - Turkmen',
      },
      ur: {
        tk: 'Urdu - Türkmen',
        zh: '乌尔都语 - 土库曼语',
        ru: 'Урду - Туркменский',
        en: 'Urdu - Turkmen',
      },
      ps: {
        tk: 'Pашto - Türkmen',
        zh: '普什图语 - 土库曼语',
        ru: 'Пушту - Туркменский',
        en: 'Pashto - Turkmen',
      },
      hy: {
        tk: 'Ermeni - Türkmen',
        zh: '亚美尼亚语 - 土库曼语',
        ru: 'Армянский - Туркменский',
        en: 'Armenian - Turkmen',
      },
      ka: {
        tk: 'Gruzin - Türkmen',
        zh: '格鲁吉亚语 - 土库曼语',
        ru: 'Грузинский - Туркменский',
        en: 'Georgian - Turkmen',
      },
    };

    return descriptions[pairCode]?.[config.mode] || `${pairCode.toUpperCase()} - Turkmen`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.icon}>📚</Text>
          <Text style={styles.title}>{getTitle()}</Text>
          <Text style={styles.subtitle}>{getSubtitle()}</Text>
        </View>

        {/* Language Pairs */}
        <View style={styles.pairsContainer}>
          {availablePairs.map((pair) => (
            <TouchableOpacity
              key={pair.id}
              onPress={() => handleSelect(pair)}
              activeOpacity={0.8}
              style={styles.pairButton}
            >
              <LinearGradient
                colors={pair.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[
                  styles.pairGradient,
                  selectedPair === pair.code && styles.pairSelected,
                ]}
              >
                {/* Flag */}
                <Text style={styles.pairFlag}>{pair.flag}</Text>

                {/* Names */}
                <View style={styles.pairInfo}>
                  <Text style={styles.pairName}>{pair.name}</Text>
                  <Text style={styles.pairDescription}>
                    {getPairDescription(pair.code)}
                  </Text>
                </View>

                {/* Arrow or Checkmark */}
                <Text style={styles.pairArrow}>
                  {selectedPair === pair.code ? '✓' : '→'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>

        {/* Info */}
        <View style={styles.infoCard}>
          <Text style={styles.infoIcon}>ℹ️</Text>
          <Text style={styles.infoText}>
            {config.mode === 'tk' && 'Siz islendik wagt sazlamalarda üýtgedip bilersiňiz'}
            {config.mode === 'zh' && '您可以随时在设置中更改'}
            {config.mode === 'ru' && 'Вы можете изменить это в любое время в настройках'}
            {config.mode === 'en' && 'You can change this anytime in settings'}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  content: {
    padding: scale(24),
    paddingTop: verticalScale(60),
  },
  header: {
    alignItems: 'center',
    marginBottom: verticalScale(40),
  },
  icon: {
    fontSize: moderateScale(64),
    marginBottom: verticalScale(16),
  },
  title: {
    fontSize: moderateScale(28),
    fontWeight: '700',
    color: '#000',
    textAlign: 'center',
    marginBottom: verticalScale(8),
  },
  subtitle: {
    fontSize: moderateScale(16),
    color: '#666',
    textAlign: 'center',
  },
  pairsContainer: {
    marginBottom: verticalScale(32),
  },
  pairButton: {
    marginBottom: verticalScale(16),
    borderRadius: scale(16),
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  pairGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: scale(20),
    minHeight: verticalScale(100),
  },
  pairSelected: {
    borderWidth: 3,
    borderColor: '#FFF',
  },
  pairFlag: {
    fontSize: moderateScale(40),
    marginRight: scale(16),
  },
  pairInfo: {
    flex: 1,
  },
  pairName: {
    fontSize: moderateScale(22),
    fontWeight: '700',
    color: '#FFF',
    marginBottom: verticalScale(4),
  },
  pairDescription: {
    fontSize: moderateScale(14),
    color: 'rgba(255, 255, 255, 0.9)',
  },
  pairArrow: {
    fontSize: moderateScale(24),
    color: '#FFF',
    fontWeight: '700',
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#E3F2FD',
    borderRadius: scale(12),
    padding: scale(16),
    borderWidth: 1,
    borderColor: '#2196F3',
  },
  infoIcon: {
    fontSize: moderateScale(20),
    marginRight: scale(12),
  },
  infoText: {
    flex: 1,
    fontSize: moderateScale(14),
    color: '#1565C0',
    lineHeight: moderateScale(20),
  },
});

export default LanguagePairSelectionScreen;
