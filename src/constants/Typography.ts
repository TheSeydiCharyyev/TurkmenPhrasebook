// src/constants/Typography.ts - Система типографики дня 16
import { Platform, Dimensions } from 'react-native';
import { Colors } from './Colors';

const { width } = Dimensions.get('window');
const isSmallDevice = width < 375;
const isLargeDevice = width > 414;

// Функция для адаптивного размера шрифта
const getFontSize = (small: number, medium: number, large: number) => {
  if (isSmallDevice) return small;
  if (isLargeDevice) return large;
  return medium;
};

// Базовые размеры шрифтов
export const FontSizes = {
  // Заголовки
  h1: getFontSize(28, 32, 36),
  h2: getFontSize(24, 28, 32),
  h3: getFontSize(20, 24, 28),
  h4: getFontSize(18, 20, 24),
  h5: getFontSize(16, 18, 20),
  h6: getFontSize(14, 16, 18),

  // Основной текст
  body: getFontSize(16, 16, 18),
  bodyLarge: getFontSize(18, 20, 22),
  bodySmall: getFontSize(14, 14, 16),

  // Вспомогательный текст
  caption: getFontSize(12, 12, 14),
  label: getFontSize(14, 16, 16),
  sublabel: getFontSize(12, 14, 14),

  // Специальные размеры для китайского текста
  chineseLarge: getFontSize(24, 28, 32),
  chineseMedium: getFontSize(20, 24, 28),
  chineseSmall: getFontSize(16, 18, 20),

  // Размеры для пиньинь
  pinyin: getFontSize(14, 16, 18),
  pinyinSmall: getFontSize(12, 14, 16),

  // Кнопки
  button: getFontSize(16, 16, 18),
  buttonSmall: getFontSize(14, 14, 16),
  buttonLarge: getFontSize(18, 20, 22),
};

// Высота строк
export const LineHeights = {
  tight: 1.2,
  normal: 1.4,
  relaxed: 1.6,
  loose: 1.8,
  
  // Специальные высоты для разных типов текста
  heading: 1.2,
  body: 1.5,
  caption: 1.3,
  chinese: 1.4, // Для китайских иероглифов
};

// Веса шрифтов
export const FontWeights = {
  light: '300' as const,
  normal: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  extrabold: '800' as const,
};

// Семейства шрифтов с платформенными различиями
export const FontFamilies = {
  // Основные шрифты
  regular: Platform.select({
    ios: 'System',
    android: 'Roboto',
    default: 'System',
  }),

  // Для заголовков
  heading: Platform.select({
    ios: 'System',
    android: 'Roboto',
    default: 'System',
  }),

  // Моноширинный шрифт для кода и пиньинь
  monospace: Platform.select({
    ios: 'Menlo',
    android: 'monospace',
    default: 'monospace',
  }),

  // Специальные шрифты для китайского текста
  chinese: Platform.select({
    ios: 'PingFang SC',
    android: 'Noto Sans CJK SC',
    default: 'System',
  }),
};

// Предопределенные стили текста
export const TextStyles = {
  // Заголовки
  h1: {
    fontSize: FontSizes.h1,
    fontWeight: FontWeights.bold,
    lineHeight: FontSizes.h1 * LineHeights.heading,
    color: Colors.text,
    fontFamily: FontFamilies.heading,
  },

  h2: {
    fontSize: FontSizes.h2,
    fontWeight: FontWeights.bold,
    lineHeight: FontSizes.h2 * LineHeights.heading,
    color: Colors.text,
    fontFamily: FontFamilies.heading,
  },

  h3: {
    fontSize: FontSizes.h3,
    fontWeight: FontWeights.semibold,
    lineHeight: FontSizes.h3 * LineHeights.heading,
    color: Colors.text,
    fontFamily: FontFamilies.heading,
  },

  h4: {
    fontSize: FontSizes.h4,
    fontWeight: FontWeights.semibold,
    lineHeight: FontSizes.h4 * LineHeights.heading,
    color: Colors.text,
    fontFamily: FontFamilies.heading,
  },

  h5: {
    fontSize: FontSizes.h5,
    fontWeight: FontWeights.medium,
    lineHeight: FontSizes.h5 * LineHeights.heading,
    color: Colors.text,
    fontFamily: FontFamilies.heading,
  },

  h6: {
    fontSize: FontSizes.h6,
    fontWeight: FontWeights.medium,
    lineHeight: FontSizes.h6 * LineHeights.heading,
    color: Colors.text,
    fontFamily: FontFamilies.heading,
  },

  // Основной текст
  body: {
    fontSize: FontSizes.body,
    fontWeight: FontWeights.normal,
    lineHeight: FontSizes.body * LineHeights.body,
    color: Colors.text,
    fontFamily: FontFamilies.regular,
  },

  bodyLarge: {
    fontSize: FontSizes.bodyLarge,
    fontWeight: FontWeights.normal,
    lineHeight: FontSizes.bodyLarge * LineHeights.body,
    color: Colors.text,
    fontFamily: FontFamilies.regular,
  },

  bodySmall: {
    fontSize: FontSizes.bodySmall,
    fontWeight: FontWeights.normal,
    lineHeight: FontSizes.bodySmall * LineHeights.body,
    color: Colors.text,
    fontFamily: FontFamilies.regular,
  },

  // Вспомогательный текст
  caption: {
    fontSize: FontSizes.caption,
    fontWeight: FontWeights.normal,
    lineHeight: FontSizes.caption * LineHeights.caption,
    color: Colors.textLight,
    fontFamily: FontFamilies.regular,
  },

  label: {
    fontSize: FontSizes.label,
    fontWeight: FontWeights.medium,
    lineHeight: FontSizes.label * LineHeights.normal,
    color: Colors.text,
    fontFamily: FontFamilies.regular,
  },

  sublabel: {
    fontSize: FontSizes.sublabel,
    fontWeight: FontWeights.normal,
    lineHeight: FontSizes.sublabel * LineHeights.normal,
    color: Colors.textLight,
    fontFamily: FontFamilies.regular,
  },

  // Специальные стили для китайского текста
  chineseLarge: {
    fontSize: FontSizes.chineseLarge,
    fontWeight: FontWeights.bold,
    lineHeight: FontSizes.chineseLarge * LineHeights.chinese,
    color: Colors.text,
    fontFamily: FontFamilies.chinese,
  },

  chineseMedium: {
    fontSize: FontSizes.chineseMedium,
    fontWeight: FontWeights.semibold,
    lineHeight: FontSizes.chineseMedium * LineHeights.chinese,
    color: Colors.text,
    fontFamily: FontFamilies.chinese,
  },

  chineseSmall: {
    fontSize: FontSizes.chineseSmall,
    fontWeight: FontWeights.normal,
    lineHeight: FontSizes.chineseSmall * LineHeights.chinese,
    color: Colors.text,
    fontFamily: FontFamilies.chinese,
  },

  // Стили для пиньинь
  pinyin: {
    fontSize: FontSizes.pinyin,
    fontWeight: FontWeights.normal,
    lineHeight: FontSizes.pinyin * LineHeights.normal,
    color: Colors.primary,
    fontFamily: FontFamilies.regular,
    fontStyle: 'italic' as const,
  },

  pinyinSmall: {
    fontSize: FontSizes.pinyinSmall,
    fontWeight: FontWeights.normal,
    lineHeight: FontSizes.pinyinSmall * LineHeights.normal,
    color: Colors.primary,
    fontFamily: FontFamilies.regular,
    fontStyle: 'italic' as const,
  },

  // Стили кнопок
  button: {
    fontSize: FontSizes.button,
    fontWeight: FontWeights.semibold,
    lineHeight: FontSizes.button * LineHeights.normal,
    color: Colors.textWhite,
    fontFamily: FontFamilies.regular,
    textAlign: 'center' as const,
  },

  buttonSmall: {
    fontSize: FontSizes.buttonSmall,
    fontWeight: FontWeights.medium,
    lineHeight: FontSizes.buttonSmall * LineHeights.normal,
    color: Colors.textWhite,
    fontFamily: FontFamilies.regular,
    textAlign: 'center' as const,
  },

  buttonLarge: {
    fontSize: FontSizes.buttonLarge,
    fontWeight: FontWeights.bold,
    lineHeight: FontSizes.buttonLarge * LineHeights.normal,
    color: Colors.textWhite,
    fontFamily: FontFamilies.regular,
    textAlign: 'center' as const,
  },

  // Специальные стили для различных элементов UI
  navigationTitle: {
    fontSize: FontSizes.h5,
    fontWeight: FontWeights.semibold,
    lineHeight: FontSizes.h5 * LineHeights.heading,
    color: Colors.text,
    fontFamily: FontFamilies.heading,
  },

  tabLabel: {
    fontSize: FontSizes.caption,
    fontWeight: FontWeights.medium,
    lineHeight: FontSizes.caption * LineHeights.normal,
    color: Colors.tabInactive,
    fontFamily: FontFamilies.regular,
  },

  tabLabelActive: {
    fontSize: FontSizes.caption,
    fontWeight: FontWeights.semibold,
    lineHeight: FontSizes.caption * LineHeights.normal,
    color: Colors.tabActive,
    fontFamily: FontFamilies.regular,
  },

  cardTitle: {
    fontSize: FontSizes.h6,
    fontWeight: FontWeights.semibold,
    lineHeight: FontSizes.h6 * LineHeights.heading,
    color: Colors.text,
    fontFamily: FontFamilies.heading,
  },

  cardSubtitle: {
    fontSize: FontSizes.bodySmall,
    fontWeight: FontWeights.normal,
    lineHeight: FontSizes.bodySmall * LineHeights.body,
    color: Colors.textLight,
    fontFamily: FontFamilies.regular,
  },

  // Стили для статистики
  statValue: {
    fontSize: FontSizes.h3,
    fontWeight: FontWeights.bold,
    lineHeight: FontSizes.h3 * LineHeights.tight,
    color: Colors.text,
    fontFamily: FontFamilies.heading,
  },

  statLabel: {
    fontSize: FontSizes.caption,
    fontWeight: FontWeights.medium,
    lineHeight: FontSizes.caption * LineHeights.normal,
    color: Colors.textLight,
    fontFamily: FontFamilies.regular,
  },

  // Стили ошибок и уведомлений
  error: {
    fontSize: FontSizes.bodySmall,
    fontWeight: FontWeights.medium,
    lineHeight: FontSizes.bodySmall * LineHeights.body,
    color: Colors.error,
    fontFamily: FontFamilies.regular,
  },

  success: {
    fontSize: FontSizes.bodySmall,
    fontWeight: FontWeights.medium,
    lineHeight: FontSizes.bodySmall * LineHeights.body,
    color: Colors.success,
    fontFamily: FontFamilies.regular,
  },

  warning: {
    fontSize: FontSizes.bodySmall,
    fontWeight: FontWeights.medium,
    lineHeight: FontSizes.bodySmall * LineHeights.body,
    color: Colors.warning,
    fontFamily: FontFamilies.regular,
  },

  // Стили для поиска и подсветки
  highlighted: {
    fontSize: FontSizes.body,
    fontWeight: FontWeights.semibold,
    lineHeight: FontSizes.body * LineHeights.body,
    color: Colors.primary,
    fontFamily: FontFamilies.regular,
    backgroundColor: Colors.highlight,
  },

  searchPlaceholder: {
    fontSize: FontSizes.body,
    fontWeight: FontWeights.normal,
    lineHeight: FontSizes.body * LineHeights.body,
    color: Colors.textLighter,
    fontFamily: FontFamilies.regular,
    fontStyle: 'italic' as const,
  },
};

// Утилиты для работы с типографикой
export const TypographyUtils = {
  // Получение адаптивного размера шрифта
  getAdaptiveFontSize: (baseSize: number, scaleFactor: number = 1): number => {
    const adaptedSize = baseSize * scaleFactor;
    
    if (isSmallDevice) {
      return Math.max(adaptedSize * 0.9, 12);
    }
    
    if (isLargeDevice) {
      return adaptedSize * 1.1;
    }
    
    return adaptedSize;
  },

  // Получение высоты строки в зависимости от размера шрифта
  getLineHeight: (fontSize: number, type: 'tight' | 'normal' | 'relaxed' | 'chinese' = 'normal'): number => {
    const multipliers = {
      tight: LineHeights.tight,
      normal: LineHeights.normal,
      relaxed: LineHeights.relaxed,
      chinese: LineHeights.chinese,
    };
    
    return fontSize * multipliers[type];
  },

  // Создание стиля текста с переданными параметрами
  createTextStyle: (options: {
    size?: number;
    weight?: keyof typeof FontWeights;
    color?: string;
    family?: string;
    lineHeight?: number;
    textAlign?: 'left' | 'center' | 'right' | 'justify';
    textTransform?: 'none' | 'capitalize' | 'uppercase' | 'lowercase';
  }) => {
    return {
      fontSize: options.size || FontSizes.body,
      fontWeight: options.weight ? FontWeights[options.weight] : FontWeights.normal,
      color: options.color || Colors.text,
      fontFamily: options.family || FontFamilies.regular,
      lineHeight: options.lineHeight || (options.size || FontSizes.body) * LineHeights.normal,
      textAlign: options.textAlign || 'left',
      textTransform: options.textTransform || 'none',
    };
  },

  // Получение стиля для конкретного языка
  getLanguageStyle: (language: 'chinese' | 'turkmen' | 'russian', size: 'small' | 'medium' | 'large' = 'medium') => {
    const baseStyles = {
      chinese: {
        fontFamily: FontFamilies.chinese,
        color: Colors.chinese,
        lineHeight: LineHeights.chinese,
      },
      turkmen: {
        fontFamily: FontFamilies.regular,
        color: Colors.turkmen,
        lineHeight: LineHeights.normal,
      },
      russian: {
        fontFamily: FontFamilies.regular,
        color: Colors.russian,
        lineHeight: LineHeights.normal,
      },
    };

    const sizeMap = {
      small: FontSizes.bodySmall,
      medium: FontSizes.body,
      large: FontSizes.bodyLarge,
    };

    return {
      ...baseStyles[language],
      fontSize: sizeMap[size],
      fontWeight: language === 'chinese' ? FontWeights.semibold : FontWeights.normal,
    };
  },

  // Стили для разных типов карточек
  getCardTextStyle: (type: 'title' | 'subtitle' | 'content' | 'caption') => {
    switch (type) {
      case 'title':
        return TextStyles.cardTitle;
      case 'subtitle':
        return TextStyles.cardSubtitle;
      case 'content':
        return TextStyles.body;
      case 'caption':
        return TextStyles.caption;
      default:
        return TextStyles.body;
    }
  },

  // Получение стиля кнопки в зависимости от размера и типа
  // Получение стиля кнопки в зависимости от размера и типа
  getButtonTextStyle: (size: 'small' | 'medium' | 'large' = 'medium', variant: 'primary' | 'secondary' | 'outline' | 'ghost' | 'gradient' = 'primary') => {
    const baseSizes = {
      small: TextStyles.buttonSmall,
      medium: TextStyles.button,
      large: TextStyles.buttonLarge,
    };

    const colors = {
      primary: Colors.textWhite,
      secondary: Colors.text,
      outline: Colors.primary,
      ghost: Colors.primary,
      gradient: Colors.textWhite,
    };

    return {
      ...baseSizes[size],
      color: colors[variant],
    };
  },
};

// Константы для отступов и spacing на основе типографики
export const Spacing = {
  // Базовые отступы
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  
  // Отступы на основе размеров шрифтов
  textXs: FontSizes.caption * 0.5,
  textSm: FontSizes.bodySmall * 0.75,
  textMd: FontSizes.body * 0.75,
  textLg: FontSizes.bodyLarge * 0.75,
  textXl: FontSizes.h4 * 0.75,

  // Специальные отступы для элементов UI
  cardPadding: 16,
  cardMargin: 12,
  sectionSpacing: 24,
  itemSpacing: 8,
  
  // Отступы для кнопок
  buttonPaddingVertical: 12,
  buttonPaddingHorizontal: 20,
  buttonPaddingSmall: 8,
  buttonPaddingLarge: 16,
};

// Константы для скруглений углов
export const BorderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  round: 9999, // Полностью круглый
  
  // Специальные радиусы для элементов
  card: 12,
  button: 8,
  input: 8,
  modal: 20,
  image: 8,
};