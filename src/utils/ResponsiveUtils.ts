import { Dimensions, Platform, PixelRatio } from 'react-native';

// Базовые размеры для расчета (iPhone 11/12/13 стандарт)
const BASE_WIDTH = 375;
const BASE_HEIGHT = 812;

// Получаем размеры экрана
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Вычисляем соотношения
const widthRatio = SCREEN_WIDTH / BASE_WIDTH;
const heightRatio = SCREEN_HEIGHT / BASE_HEIGHT;

/**
 * 📐 Масштабирование размеров для адаптивности
 */

/**
 * Горизонтальное масштабирование (для ширины, padding, margin)
 * @param size - размер в пикселях для базового экрана (375px)
 */
export const scale = (size: number): number => {
  const newSize = size * widthRatio;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

/**
 * Вертикальное масштабирование (для высоты, padding-vertical)
 * @param size - размер в пикселях для базового экрана (812px)
 */
export const verticalScale = (size: number): number => {
  const newSize = size * heightRatio;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

/**
 * Умеренное масштабирование (для шрифтов, иконок)
 * @param size - размер в пикселях
 * @param factor - коэффициент масштабирования (0-1, default: 0.5)
 */
export const moderateScale = (size: number, factor: number = 0.5): number => {
  const newSize = size + (scale(size) - size) * factor;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

/**
 * 📱 Информация об устройстве
 */
export const DeviceInfo = {
  screenWidth: SCREEN_WIDTH,
  screenHeight: SCREEN_HEIGHT,

  // Breakpoints для разных устройств
  isSmallDevice: SCREEN_WIDTH < 360, // Маленькие телефоны (iPhone SE)
  isMediumDevice: SCREEN_WIDTH >= 360 && SCREEN_WIDTH < 414, // Средние телефоны
  isLargeDevice: SCREEN_WIDTH >= 414 && SCREEN_WIDTH < 768, // Большие телефоны (iPhone Pro Max)
  isTablet: SCREEN_WIDTH >= 768, // Планшеты

  // Старые breakpoints (для обратной совместимости)
  isSmallScreen: SCREEN_WIDTH < 375,
  isMediumScreen: SCREEN_WIDTH >= 375 && SCREEN_WIDTH < 414,
  isLargeScreen: SCREEN_WIDTH >= 414,

  // Соотношение сторон
  aspectRatio: SCREEN_HEIGHT / SCREEN_WIDTH,

  // Платформа
  isIOS: Platform.OS === 'ios',
  isAndroid: Platform.OS === 'android',
};

/**
 * 🎯 Responsive утилиты
 */
export const ResponsiveUtils = {
  /**
   * Получить значение в зависимости от размера экрана
   */
  getValue: (small: number, medium: number, large: number, tablet?: number) => {
    if (DeviceInfo.isTablet && tablet !== undefined) return tablet;
    if (DeviceInfo.isSmallDevice) return small;
    if (DeviceInfo.isMediumDevice) return medium;
    return large;
  },

  /**
   * Responsive шрифты
   */
  fontSize: {
    // Заголовки
    h1: moderateScale(28),
    h2: moderateScale(24),
    h3: moderateScale(20),
    h4: moderateScale(18),

    // Тело
    body: moderateScale(16),
    bodySmall: moderateScale(14),
    caption: moderateScale(12),

    // Специфичные (для обратной совместимости)
    chineseText: DeviceInfo.isSmallDevice ? moderateScale(18) : moderateScale(20),
    pinyinText: DeviceInfo.isSmallDevice ? moderateScale(12) : moderateScale(14),
  },

  /**
   * Responsive размеры
   */
  dimensions: {
    // Карточки
    categoryCardHeight: DeviceInfo.isSmallDevice ? verticalScale(100) : verticalScale(120),
    phraseCardHeight: DeviceInfo.isSmallDevice ? verticalScale(120) : verticalScale(140),
    moduleCardWidth: DeviceInfo.isTablet ? scale(200) : (SCREEN_WIDTH - scale(48)) / 2,

    // Иконки
    iconSmall: moderateScale(20),
    iconMedium: moderateScale(24),
    iconLarge: moderateScale(32),
    iconXLarge: moderateScale(48),

    // Header
    headerHeight: verticalScale(56),

    // Inputs
    inputHeight: verticalScale(48),
    inputPadding: scale(16),

    // Buttons
    buttonHeight: verticalScale(48),
    buttonPadding: scale(16),
  },

  /**
   * Responsive отступы
   */
  spacing: {
    xs: scale(4),
    sm: scale(8),
    md: scale(16),
    lg: scale(24),
    xl: scale(32),
    xxl: scale(48),
  },

  /**
   * Responsive border radius
   */
  borderRadius: {
    sm: scale(4),
    md: scale(8),
    lg: scale(12),
    xl: scale(16),
    xxl: scale(24),
    round: 9999,
  },
};

/**
 * 📏 Экспорт для удобства
 */
export const wp = (percentage: number): number => {
  return (SCREEN_WIDTH * percentage) / 100;
};

export const hp = (percentage: number): number => {
  return (SCREEN_HEIGHT * percentage) / 100;
};

/**
 * Лимиты для размеров (для очень больших экранов)
 */
export const maxWidth = (width: number, max: number = 600): number => {
  return Math.min(width, max);
};

export default {
  scale,
  verticalScale,
  moderateScale,
  DeviceInfo,
  ResponsiveUtils,
  wp,
  hp,
  maxWidth,
};