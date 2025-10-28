// src/constants/Design.ts
// НОВАЯ МИНИМАЛИСТИЧНАЯ ДИЗАЙН-СИСТЕМА

import { TextStyle, ViewStyle, Platform } from 'react-native';

/**
 * 🎨 ЦВЕТОВАЯ ПАЛИТРА - Простая и минималистичная
 */
export const DesignColors = {
  // Основные цвета
  primary: '#00843D',          // Туркменский зеленый (главный цвет)
  primaryLight: '#4CAF50',     // Светлый зеленый
  primaryDark: '#006B2D',      // Темный зеленый

  // Фоновые цвета
  background: '#FFFFFF',       // Белый
  backgroundGray: '#F5F5F5',   // Светло-серый фон
  backgroundDark: '#FAFAFA',   // Чуть темнее белого

  // Текстовые цвета
  text: '#1F2937',             // Основной текст (темно-серый)
  textSecondary: '#6B7280',    // Вторичный текст (серый)
  textLight: '#9CA3AF',        // Светлый текст
  textWhite: '#FFFFFF',        // Белый текст

  // Границы и разделители
  border: '#E5E7EB',           // Светлая граница
  divider: '#F3F4F6',          // Разделитель

  // Карточки
  card: '#FFFFFF',             // Фон карточки
  cardBorder: '#E5E7EB',       // Граница карточки

  // Статус-цвета
  success: '#10B981',          // Зеленый
  error: '#EF4444',            // Красный
  warning: '#F59E0B',          // Оранжевый
  info: '#3B82F6',             // Синий

  // Акцентные цвета для модулей (без градиентов)
  modulePhrasebook: '#00843D',     // Зеленый
  moduleVisual: '#6366F1',         // Индиго
  moduleText: '#3B82F6',           // Синий
  moduleDictionary: '#9CA3AF',     // Серый
  moduleAI: '#8B5CF6',             // Фиолетовый
  moduleFavorites: '#F59E0B',      // Оранжевый
} as const;

/**
 * 📏 ОТСТУПЫ - Единая система 4px grid
 */
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,

  // Специфичные отступы
  screenPadding: 16,
  cardPadding: 16,
  sectionGap: 24,
  itemGap: 12,
} as const;

/**
 * 🔤 ТИПОГРАФИКА - Простая и читаемая
 */
export const Typography = {
  // Размеры
  h1: 28,
  h2: 24,
  h3: 20,
  h4: 18,
  body: 16,
  bodySmall: 14,
  caption: 12,

  // Веса
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,

  // Семейства шрифтов
  fontFamily: Platform.select({
    ios: 'System',
    android: 'Roboto',
    default: 'System',
  }),
} as const;

/**
 * 🎨 ТЕНИ - Минимальные и деликатные
 */
export const Shadows = {
  none: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },

  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },

  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },

  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
} as const;

/**
 * 📐 РАДИУСЫ СКРУГЛЕНИЯ
 */
export const BorderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 24,
  round: 9999,
} as const;

/**
 * 📦 ГОТОВЫЕ КОМПОНЕНТЫ-СТИЛИ
 */
export const Components = {
  // Header для всех экранов - ЕДИНЫЙ СТИЛЬ
  header: {
    height: 56,
    backgroundColor: DesignColors.background,
    borderBottomWidth: 1,
    borderBottomColor: DesignColors.border,
    paddingHorizontal: Spacing.md,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
  },

  headerTitle: {
    fontSize: Typography.h3,
    fontWeight: Typography.semibold,
    color: DesignColors.text,
    fontFamily: Typography.fontFamily,
  },

  // Карточка модуля - простая без градиента
  moduleCard: {
    backgroundColor: DesignColors.card,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: DesignColors.cardBorder,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.small,
  },

  moduleTitle: {
    fontSize: Typography.h4,
    fontWeight: Typography.semibold,
    color: DesignColors.text,
    marginBottom: Spacing.xs,
    fontFamily: Typography.fontFamily,
  },

  moduleSubtitle: {
    fontSize: Typography.bodySmall,
    fontWeight: Typography.regular,
    color: DesignColors.textSecondary,
    fontFamily: Typography.fontFamily,
  },

  // Кнопка - простая и минималистичная
  button: {
    backgroundColor: DesignColors.primary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    ...Shadows.small,
  },

  buttonText: {
    fontSize: Typography.body,
    fontWeight: Typography.semibold,
    color: DesignColors.textWhite,
    fontFamily: Typography.fontFamily,
  },

  buttonSecondary: {
    backgroundColor: DesignColors.background,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: DesignColors.border,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },

  buttonSecondaryText: {
    fontSize: Typography.body,
    fontWeight: Typography.semibold,
    color: DesignColors.text,
    fontFamily: Typography.fontFamily,
  },

  // Контейнер экрана - без SafeAreaView проблем
  screenContainer: {
    flex: 1,
    backgroundColor: DesignColors.background,
  },

  // Контент с padding
  screenContent: {
    flex: 1,
    paddingHorizontal: Spacing.screenPadding,
  },

  // Секция
  section: {
    marginBottom: Spacing.sectionGap,
  },

  sectionTitle: {
    fontSize: Typography.h3,
    fontWeight: Typography.semibold,
    color: DesignColors.text,
    marginBottom: Spacing.md,
    fontFamily: Typography.fontFamily,
  },

  // Разделитель
  divider: {
    height: 1,
    backgroundColor: DesignColors.divider,
    marginVertical: Spacing.md,
  },
} as const;

/**
 * 📱 КОНСТАНТЫ РАЗМЕРОВ
 */
export const Sizes = {
  headerHeight: 56,
  tabBarHeight: 60,
  buttonHeight: 48,
  inputHeight: 48,
  iconSmall: 20,
  iconMedium: 24,
  iconLarge: 32,
} as const;

export default {
  Colors: DesignColors,
  Spacing,
  Typography,
  Shadows,
  BorderRadius,
  Components,
  Sizes,
};
