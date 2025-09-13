export const Colors = {
  // Primary colors
  primary: '#E53935',
  primaryLight: '#EF5350',
  primaryDark: '#C62828',
  
  // Background colors
  background: '#FAFAFA',
  backgroundLight: '#F9FAFB',
  backgroundDark: '#F3F4F6',
  
  // Card colors
  cardBackground: '#FFFFFF',
  cardBorder: '#E5E7EB',
  cardShadow: '#000000',
  
  // Text colors
  textPrimary: '#1F2937',
  textSecondary: '#6B7280',
  textLight: '#9CA3AF',
  textWhite: '#FFFFFF',
  
  // Accent colors
  accent: '#10B981',
  accentLight: '#34D399',
  accentDark: '#047857',
  
  // Status colors
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  
  // UI elements
  shadowColor: '#000000',
  borderColor: '#E5E7EB',
  divider: '#F3F4F6',
  
  // Tab navigation
  tabActive: '#E53935',
  tabInactive: '#9CA3AF',
} as const;

export type ColorKey = keyof typeof Colors;