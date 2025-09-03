// src/constants/Colors.ts - Расширенная цветовая система дня 16
export const Colors = {
  // Основные цвета
  primary: '#DC2626',      // Красный (символ Китая)
  primaryLight: '#F87171', // Светлый красный
  primaryDark: '#991B1B',  // Темный красный
  
  secondary: '#F3F4F6',    // Светло-серый
  secondaryLight: '#F9FAFB', // Очень светло-серый
  secondaryDark: '#E5E7EB', // Темнее серый
  
  accent: '#10B981',       // Зеленый для кнопок
  accentLight: '#34D399',  // Светло-зеленый
  accentDark: '#059669',   // Темно-зеленый
  
  // Текст с расширенной палитрой
  text: '#1F2937',         // Темно-серый основной
  textLight: '#6B7280',    // Светло-серый текст
  textLighter: '#9CA3AF',  // Еще светлее
  textWhite: '#FFFFFF',    // Белый текст
  textMuted: '#D1D5DB',    // Приглушенный текст
  
  // Фон с градациями
  background: '#FFFFFF',   // Белый фон
  backgroundLight: '#F9FAFB', // Очень светло-серый
  backgroundDark: '#F3F4F6',  // Темнее фон
  backgroundCard: '#FFFFFF',  // Фон карточек
  
  // Состояния с градациями
  success: '#10B981',      // Зеленый успех
  successLight: '#D1FAE5', // Светлый фон успеха
  successDark: '#065F46',  // Темный успех
  
  warning: '#F59E0B',      // Желтый предупреждение
  warningLight: '#FEF3C7', // Светлый фон предупреждения
  warningDark: '#92400E',  // Темный предупреждения
  
  error: '#EF4444',        // Красный ошибка
  errorLight: '#FEE2E2',   // Светлый фон ошибки
  errorDark: '#991B1B',    // Темный ошибки
  
  info: '#3B82F6',         // Синий информация
  infoLight: '#DBEAFE',    // Светлый фон информации
  infoDark: '#1E40AF',     // Темный информации
  
  // Навигация
  tabActive: '#DC2626',    // Активная вкладка
  tabInactive: '#9CA3AF', // Неактивная вкладка
  tabBackground: '#FFFFFF', // Фон вкладок
  
  // Карточки и границы
  cardBackground: '#FFFFFF',
  cardBorder: '#E5E7EB',
  cardShadow: '#00000010',
  cardShadowDark: '#00000020',
  
  // Дополнительные цвета для анимаций и эффектов
  overlay: '#00000080',    // Полупрозрачный черный
  overlayLight: '#00000040', // Легкий оверлей
  overlayDark: '#000000B3',  // Темный оверлей
  
  // Gradient цвета
  gradientStart: '#DC2626',
  gradientEnd: '#10B981',
  gradientStartLight: '#F87171',
  gradientEndLight: '#34D399',
  
  // Специальные цвета для языков
  chinese: '#DC2626',      // Красный для китайского
  turkmen: '#10B981',      // Зеленый для туркменского
  russian: '#F59E0B',      // Желтый для русского
  
  // Цвета для статистики и прогресса
  progress: '#3B82F6',     // Синий прогресс
  progressBackground: '#E5E7EB', // Фон прогресс-бара
  achievement: '#F59E0B',  // Цвет достижений
  streak: '#EF4444',       // Цвет стрика
  
  // Интерактивные элементы
  ripple: '#DC262620',     // Цвет ripple эффекта
  highlight: '#FEF3C7',    // Цвет выделения
  focus: '#3B82F6',        // Цвет фокуса
  
  // Семантические цвета для различных состояний
  online: '#10B981',       // Онлайн статус
  offline: '#6B7280',      // Офлайн статус
  loading: '#3B82F6',      // Загрузка
  disabled: '#9CA3AF',     // Отключенный элемент
};

// Функции для работы с цветами
export const ColorUtils = {
  // Добавление прозрачности к цвету
  withOpacity: (color: string, opacity: number): string => {
    if (color.startsWith('#')) {
      const alpha = Math.round(255 * opacity).toString(16).padStart(2, '0');
      return color + alpha;
    }
    return color;
  },

  // Получение контрастного цвета
  getContrastColor: (backgroundColor: string): string => {
    // Простая проверка светлости цвета
    const lightColors = [
      Colors.background,
      Colors.backgroundLight,
      Colors.cardBackground,
      Colors.successLight,
      Colors.warningLight,
      Colors.errorLight,
      Colors.infoLight,
    ];
    
    return lightColors.includes(backgroundColor) ? Colors.text : Colors.textWhite;
  },

  // Получение цвета тени в зависимости от фона
  getShadowColor: (backgroundColor: string): string => {
    return backgroundColor === Colors.background ? Colors.cardShadow : Colors.cardShadowDark;
  },

  // Градиент для кнопок
  getButtonGradient: (type: 'primary' | 'secondary' | 'accent' = 'primary'): [string, string] => {
    switch (type) {
      case 'primary':
        return [Colors.primary, Colors.primaryDark];
      case 'accent':
        return [Colors.accent, Colors.accentDark];
      case 'secondary':
      default:
        return [Colors.secondary, Colors.secondaryDark];
    }
  },

  // Цвет состояния для интерактивных элементов
  getStateColor: (state: 'default' | 'hover' | 'active' | 'disabled', baseColor: string): string => {
    switch (state) {
      case 'hover':
        return ColorUtils.withOpacity(baseColor, 0.8);
      case 'active':
        return ColorUtils.withOpacity(baseColor, 0.9);
      case 'disabled':
        return Colors.disabled;
      default:
        return baseColor;
    }
  },
};

// Темная тема (для будущего использования)
export const DarkColors = {
  ...Colors,
  // Переопределяем основные цвета для темной темы
  text: '#F9FAFB',
  textLight: '#D1D5DB',
  textLighter: '#9CA3AF',
  
  background: '#111827',
  backgroundLight: '#1F2937',
  backgroundDark: '#0F172A',
  backgroundCard: '#1F2937',
  
  cardBackground: '#1F2937',
  cardBorder: '#374151',
  cardShadow: '#00000040',
  
  tabBackground: '#1F2937',
  
  overlay: '#FFFFFF20',
  overlayLight: '#FFFFFF10',
  overlayDark: '#FFFFFF40',
};

// Системные цвета для конкретных компонентов
export const ComponentColors = {
  // Карточки категорий
  categoryCard: {
    background: Colors.cardBackground,
    border: Colors.cardBorder,
    shadow: Colors.cardShadow,
    overlay: Colors.overlayLight,
  },

  // Карточки фраз
  phraseCard: {
    background: Colors.cardBackground,
    border: Colors.cardBorder,
    shadow: Colors.cardShadow,
    highlight: Colors.highlight,
  },

  // Кнопки
  button: {
    primary: Colors.primary,
    primaryHover: Colors.primaryDark,
    secondary: Colors.secondary,
    secondaryHover: Colors.secondaryDark,
    accent: Colors.accent,
    accentHover: Colors.accentDark,
    disabled: Colors.disabled,
  },

  // Поля ввода
  input: {
    background: Colors.backgroundLight,
    border: Colors.cardBorder,
    borderFocus: Colors.focus,
    text: Colors.text,
    placeholder: Colors.textLight,
  },

  // Модальные окна
  modal: {
    background: Colors.cardBackground,
    overlay: Colors.overlay,
    border: Colors.cardBorder,
    shadow: Colors.cardShadowDark,
  },

  // Прогресс бары
  progress: {
    background: Colors.progressBackground,
    fill: Colors.progress,
    success: Colors.success,
    warning: Colors.warning,
    error: Colors.error,
  },
};