// src/constants/Colors.ts - НОВАЯ СХЕМА вдохновленная флагами

export const Colors = {
  // 🇨🇳 Китайские цвета (красные от флага)
  chineseRed: '#DE2910',        // Точный красный с флага Китая
  chineseRedLight: '#E53935',   // Светлее для hover
  chineseRedDark: '#B71C1C',    // Темнее для shadows
  chineseGold: '#FFDE00',       // Золотой от звезд на флаге
  
  // 🇹🇲 Туркменские цвета (зеленые от флага)
  turkmenGreen: '#00843D',      // Основной зеленый с флага Туркменистана
  turkmenGreenLight: '#4CAF50', // Светлее
  turkmenGreenDark: '#2E7D32',  // Темнее
  turkmenCarpet: '#8B4513',     // Коричневый от ковровых узоров
  
  // Primary colors - туркменский зеленый (цвет флага Туркменистана)
  primary: '#00843D',
  primaryLight: '#4CAF50',
  primaryDark: '#2E7D32',

  // Accent - китайский красный (для дополнительных элементов)
  accent: '#DE2910',
  accentLight: '#E53935',
  accentDark: '#B71C1C',
  
  // Background colors - более теплые, кремовые тона
  background: '#FFFEF7',        // Кремово-белый
  backgroundLight: '#F9F8F0',   // Светло-кремовый
  backgroundDark: '#F5F4E8',    // Темно-кремовый
  
  // Card colors
  cardBackground: '#FFFFFF',
  cardBorder: '#E8E6D9',
  cardShadow: '#8B4513',        // Коричневая тень
  
  // Text colors - более контрастные
  text: '#1A1A1A',              // Почти черный
  textPrimary: '#1A1A1A',
  textSecondary: '#424242',     // Темно-серый
  textLight: '#757575',         // Средне-серый
  textMuted: '#BDBDBD',         // Светло-серый
  textWhite: '#FFFFFF',
  
  // Language-specific colors
  chineseText: '#DE2910',       // Красный для китайского
  turkmenText: '#00843D',       // Зеленый для туркменского
  russianText: '#1565C0',       // Синий для русского
  
  // Status colors
  success: '#00843D',           // Туркменский зеленый
  warning: '#FF8F00',           // Золотисто-оранжевый
  error: '#DE2910',             // Китайский красный
  info: '#1565C0',              // Синий
  
  // UI elements
  shadowColor: '#8B4513',       // Коричневые тени
  border: '#E8E6D9',            // Кремовые границы
  borderColor: '#E8E6D9',
  divider: '#F5F4E8',
  overlay: '#000000',
  
  // Tab navigation
  tabActive: '#00843D',         // Туркменский зеленый
  tabInactive: '#757575',
  
  // Button colors
  buttonText: '#FFFFFF',
  buttonTextSecondary: '#1A1A1A',
  
  // Input colors
  inputText: '#1A1A1A',
  inputPlaceholder: '#757575',
  
  // Audio button colors
  chineseAudio: '#DE2910',      // Красный флага Китая
  chineseAudioShadow: '#B71C1C',
  turkmenAudio: '#00843D',      // Зеленый флага Туркменистана
  turkmenAudioShadow: '#2E7D32',
  
  // Offline status colors
  offline: '#FF8F00',
  online: '#00843D',
  syncing: '#1565C0',
  
  // Градиенты для красивых переходов
  gradientChineseStart: '#DE2910',
  gradientChineseEnd: '#B71C1C',
  gradientTurkmenStart: '#00843D',
  gradientTurkmenEnd: '#2E7D32',
  gradientGoldStart: '#FFDE00',
  gradientGoldEnd: '#FFC107',
} as const;

export type ColorKey = keyof typeof Colors;