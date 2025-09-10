// src/constants/Colors.ts - ИСПРАВЛЕНО без TypeScript ошибок

/**
 * ✅ ПРОФЕССИОНАЛЬНАЯ ЦВЕТОВАЯ СХЕМА
 */
export const Colors = {
  // ОСНОВНЫЕ ЦВЕТА
  primary: '#DC2626',
  primaryLight: '#EF4444',
  primaryDark: '#B91C1C',
  
  secondary: '#059669',
  secondaryLight: '#10B981',
  secondaryDark: '#047857',
  
  accent: '#F59E0B',
  accentLight: '#FBBF24',
  accentDark: '#D97706',
  
  // ФОНЫ
  background: '#FAFAFA',
  backgroundSecondary: '#F5F5F5',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  
  // ТЕКСТ
  text: '#111827',
  textSecondary: '#374151',
  textLight: '#6B7280',
  textMuted: '#9CA3AF',
  textOnPrimary: '#FFFFFF',
  
  // ГРАНИЦЫ
  border: '#E5E7EB',
  borderLight: '#F3F4F6',
  borderFocus: '#DC2626',
  divider: '#E5E7EB',
  
  // СОСТОЯНИЯ
  success: '#059669',
  successLight: '#D1FAE5',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  error: '#DC2626',
  errorLight: '#FEE2E2',
  info: '#2563EB',
  infoLight: '#DBEAFE',
  
  // ИНТЕРАКТИВНЫЕ ЭЛЕМЕНТЫ
  buttonPrimary: '#DC2626',
  buttonSecondary: '#F3F4F6',
  buttonText: '#FFFFFF',
  buttonTextSecondary: '#374151',
  
  // НАВИГАЦИЯ
  tabBarActive: '#DC2626',
  tabBarInactive: '#9CA3AF',
  tabBarBackground: '#FFFFFF',
  
  // ФОРМЫ
  inputBackground: '#F9FAFB',
  inputBorder: '#D1D5DB',
  inputFocus: '#DC2626',
  inputText: '#111827',
  inputPlaceholder: '#9CA3AF',
  
  // ТЕНИ
  shadow: 'rgba(0, 0, 0, 0.1)',
  shadowDark: 'rgba(0, 0, 0, 0.2)',
  overlay: 'rgba(0, 0, 0, 0.5)',
};

/**
 * ✅ ЦВЕТА КАТЕГОРИЙ
 */
export const CategoryColors = {
  greetings: '#EF4444',
  emergency: '#DC2626',
  hotel: '#3B82F6',
  food: '#10B981',
  shopping: '#F59E0B',
  transport: '#8B5CF6',
  directions: '#F97316',
  health: '#EC4899',
  money: '#EAB308',
  communication: '#06B6D4',
  entertainment: '#A855F7',
  time: '#6366F1',
  numbers: '#1E40AF',
  weather: '#0EA5E9',
};

/**
 * ✅ УТИЛИТЫ
 */
export const ColorUtils = {
  /**
   * Добавить прозрачность к цвету
   */
  withOpacity: (color: string, opacity: number): string => {
    const alpha = Math.round(opacity * 255).toString(16).padStart(2, '0');
    return color + alpha;
  },
  
  /**
   * Получить цвет категории
   */
  getCategoryColor: (categoryId: string): string => {
    return CategoryColors[categoryId as keyof typeof CategoryColors] || Colors.primary;
  },
  
  /**
   * Получить градиент для категории
   */
  getCategoryGradient: (categoryId: string): [string, string] => {
    const baseColor = ColorUtils.getCategoryColor(categoryId);
    // Создаем более темный оттенок
    const match = baseColor.match(/^#([0-9a-f]{6})$/i);
    if (!match) return [baseColor, baseColor];
    
    const hex = match[1];
    const r = Math.max(0, parseInt(hex.substr(0, 2), 16) - 30);
    const g = Math.max(0, parseInt(hex.substr(2, 2), 16) - 30);
    const b = Math.max(0, parseInt(hex.substr(4, 2), 16) - 30);
    
    const darkerColor = '#' + [r, g, b]
      .map(c => c.toString(16).padStart(2, '0'))
      .join('');
    
    return [baseColor, darkerColor];
  },
};

export default Colors;