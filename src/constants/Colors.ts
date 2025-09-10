// src/constants/Colors.ts - ПРОФЕССИОНАЛЬНАЯ ЦВЕТОВАЯ СХЕМА

/**
 * ✅ ОБНОВЛЕННАЯ профессиональная цветовая палитра
 * Следует современным принципам Material Design 3 и iOS Human Interface Guidelines
 */
export const Colors = {
  // ✅ ОСНОВНЫЕ ЦВЕТА - более насыщенные и профессиональные
  primary: '#DC2626',        // Красный - символ Китая (более глубокий)
  primaryLight: '#EF4444',   // Светлый красный для акцентов
  primaryDark: '#B91C1C',    // Темный красный для активных состояний
  
  secondary: '#059669',      // Изумрудно-зеленый для успешных действий
  secondaryLight: '#10B981', // Светлый зеленый
  secondaryDark: '#047857',  // Темный зеленый
  
  // ✅ АКЦЕНТНЫЕ ЦВЕТА
  accent: '#F59E0B',         // Золотистый для важных элементов
  accentLight: '#FBBF24',    // Светлый золотой
  accentDark: '#D97706',     // Темный золотой
  
  // ✅ НЕЙТРАЛЬНЫЕ ЦВЕТА - улучшенная читаемость
  background: '#FAFAFA',     // Очень светлый серый фон
  backgroundSecondary: '#F5F5F5', // Вторичный фон
  backgroundLight: '#FFFFFF', // Светлый фон
  backgroundDark: '#1F2937', // Темный фон
  surface: '#FFFFFF',        // Белый для карточек
  surfaceElevated: '#FFFFFF', // Поднятые поверхности
  cardBackground: '#FFFFFF', // Фон карточек
  cardShadow: 'rgba(0, 0, 0, 0.1)', // Тени карточек
  cardBorder: '#E5E7EB',     // Границы карточек
  
  // ✅ ТЕКСТ - оптимизированная контрастность
  text: '#111827',           // Почти черный для основного текста
  textSecondary: '#374151',  // Серый для вторичного текста
  textLight: '#6B7280',      // Светло-серый для подсказок
  textMuted: '#9CA3AF',      // Приглушенный для неактивного текста
  textOnPrimary: '#FFFFFF',  // Белый на цветном фоне
  textWhite: '#FFFFFF',      // Белый текст
  textDark: '#111827',       // Темный текст
  
  // ✅ ГРАНИЦЫ И РАЗДЕЛИТЕЛИ
  border: '#E5E7EB',         // Светлые границы
  borderLight: '#F3F4F6',    // Очень светлые границы
  borderFocus: '#DC2626',    // Красные границы для фокуса
  divider: '#E5E7EB',        // Разделители
  
  // ✅ СОСТОЯНИЯ
  success: '#059669',        // Зеленый для успеха
  successLight: '#D1FAE5',   // Светлый зеленый фон
  warning: '#F59E0B',        // Оранжевый для предупреждений  
  warningLight: '#FEF3C7',   // Светлый оранжевый фон
  error: '#DC2626',          // Красный для ошибок
  errorLight: '#FEE2E2',     // Светлый красный фон
  info: '#2563EB',           // Синий для информации
  infoLight: '#DBEAFE',      // Светлый синий фон
  
  // ✅ ИНТЕРАКТИВНЫЕ ЭЛЕМЕНТЫ
  buttonPrimary: '#DC2626',      // Основные кнопки
  buttonSecondary: '#F3F4F6',    // Вторичные кнопки
  buttonText: '#FFFFFF',         // Текст на кнопках
  buttonTextSecondary: '#374151', // Текст на вторичных кнопках
  
  // ✅ НАВИГАЦИЯ
  tabBarActive: '#DC2626',       // Активная вкладка
  tabBarInactive: '#9CA3AF',     // Неактивная вкладка
  tabBarBackground: '#FFFFFF',   // Фон панели вкладок
  tabActive: '#DC2626',          // Активная вкладка (обратная совместимость)
  tabInactive: '#9CA3AF',        // Неактивная вкладка (обратная совместимость)
  
  // ✅ ФОРМЫ
  inputBackground: '#F9FAFB',    // Фон полей ввода
  inputBorder: '#D1D5DB',        // Границы полей
  inputFocus: '#DC2626',         // Фокус полей
  inputText: '#111827',          // Текст в полях
  inputPlaceholder: '#9CA3AF',   // Placeholder текст
  
  // ✅ ТЕНИ И НАЛОЖЕНИЯ
  shadow: 'rgba(0, 0, 0, 0.1)',     // Мягкие тени
  shadowDark: 'rgba(0, 0, 0, 0.2)',  // Более темные тени
  overlay: 'rgba(0, 0, 0, 0.5)',     // Оверлеи модалок
  
  // ✅ СПЕЦИАЛЬНЫЕ ЦВЕТА ДЛЯ КАТЕГОРИЙ (обновленные)
  categoryColors: {
    greetings: '#EF4444',      // Яркий красный
    emergency: '#DC2626',      // Алертный красный
    hotel: '#3B82F6',          // Синий
    food: '#10B981',           // Зеленый
    shopping: '#F59E0B',       // Золотистый
    transport: '#8B5CF6',      // Фиолетовый
    directions: '#F97316',     // Оранжевый
    health: '#EC4899',         // Розовый
    money: '#EAB308',          // Желтый
    communication: '#06B6D4',  // Голубой
    entertainment: '#A855F7',  // Пурпурный
    time: '#6366F1',           // Индиго
    numbers: '#1E40AF',        // Темно-синий
    weather: '#0EA5E9',        // Небесный синий
  },
  
  // ✅ ГРАДИЕНТЫ ДЛЯ ПРЕМИУМ-ЭЛЕМЕНТОВ
  gradients: {
    primary: ['#DC2626', '#B91C1C'],
    secondary: ['#059669', '#047857'],
    accent: ['#F59E0B', '#D97706'],
    success: ['#10B981', '#059669'],
    warning: ['#F59E0B', '#D97706'],
    error: ['#EF4444', '#DC2626'],
    info: ['#3B82F6', '#2563EB'],
  },
  
  // ✅ ОБРАТНАЯ СОВМЕСТИМОСТЬ
  gradientStart: '#DC2626',
  gradientEnd: '#B91C1C',
  
  // ✅ ТЕМНАЯ ТЕМА (для будущего использования)
  dark: {
    background: '#111827',
    surface: '#1F2937',
    text: '#F9FAFB',
    textSecondary: '#D1D5DB',
    border: '#374151',
    primary: '#EF4444',
  },
  
  // ✅ ДОСТУПНОСТЬ
  accessibility: {
    focus: '#DC2626',          // Цвет фокуса для screen readers
    highContrast: '#000000',   // Высокий контраст
    lowContrast: '#6B7280',    // Низкий контраст
  },
};

/**
 * ✅ УТИЛИТЫ для работы с цветами
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
    return Colors.categoryColors[categoryId as keyof typeof Colors.categoryColors] || Colors.primary;
  },
  
  /**
   * Получить градиент для категории
   */
  getCategoryGradient: (categoryId: string): [string, string] => {
    const baseColor = ColorUtils.getCategoryColor(categoryId);
    // Создаем более темный оттенок для градиента
    const darkerColor = baseColor.replace(/^#/, '').match(/.{2}/g)
      ?.map(hex => Math.max(0, parseInt(hex, 16) - 30).toString(16).padStart(2, '0'))
      .join('') || baseColor.slice(1);
    
    return [baseColor, '#' + darkerColor];
  },
  
  /**
   * Проверить контрастность цвета
   */
  isLightColor: (color: string): boolean => {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128;
  },
};

/**
 * ✅ ЭКСПОРТ для обратной совместимости
 */
export default Colors;