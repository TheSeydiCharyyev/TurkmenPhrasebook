// src/components/Screen.tsx
// Централизованный Screen компонент с правильной обработкой safe areas

import React from 'react';
import { View, StyleSheet, ViewStyle, Platform, StatusBar as RNStatusBar } from 'react-native';
import { SafeAreaView, Edge } from 'react-native-safe-area-context';
import { Colors } from '../constants/Colors';

interface ScreenProps {
  children: React.ReactNode;
  style?: ViewStyle;
  edges?: Edge[]; // Какие края защищать: 'top', 'bottom', 'left', 'right'
  backgroundColor?: string;
  withoutSafeArea?: boolean; // Для специальных случаев
}

/**
 * Универсальный Screen компонент
 *
 * Решает проблемы:
 * - Конфликт между expo-status-bar и react-native StatusBar
 * - Неправильные safe area insets при сворачивании/разворачивании
 * - Разное поведение на разных Android устройствах
 *
 * Использование:
 * <Screen edges={['top', 'bottom']}>
 *   <YourContent />
 * </Screen>
 */
export default function Screen({
  children,
  style,
  edges = ['top', 'bottom', 'left', 'right'], // По умолчанию защищаем все края
  backgroundColor = Colors.background,
  withoutSafeArea = false,
}: ScreenProps) {

  const containerStyle: ViewStyle = {
    flex: 1,
    backgroundColor,
  };

  // Для специальных экранов без safe area (например, splash screen)
  if (withoutSafeArea) {
    return (
      <View style={[containerStyle, style]}>
        {children}
      </View>
    );
  }

  // Стандартный экран с safe area
  return (
    <SafeAreaView
      style={[containerStyle, style]}
      edges={edges}
    >
      {children}
    </SafeAreaView>
  );
}

/**
 * Вариант для модальных окон
 * Обычно модалкам не нужен safe area снизу
 */
export function ModalScreen({
  children,
  style,
  backgroundColor = Colors.background,
}: Omit<ScreenProps, 'edges' | 'withoutSafeArea'>) {
  return (
    <Screen
      edges={['top']} // Только сверху
      style={style}
      backgroundColor={backgroundColor}
    >
      {children}
    </Screen>
  );
}

/**
 * Вариант для экранов с TabBar внизу
 * TabBar сам управляет нижним отступом
 */
export function TabScreen({
  children,
  style,
  backgroundColor = Colors.background,
}: Omit<ScreenProps, 'edges' | 'withoutSafeArea'>) {
  return (
    <Screen
      edges={['top', 'left', 'right']} // Без bottom, т.к. TabBar сам управляет
      style={style}
      backgroundColor={backgroundColor}
    >
      {children}
    </Screen>
  );
}

/**
 * Получить высоту StatusBar для Android
 * Полезно для кастомных расчетов
 */
export function getStatusBarHeight(): number {
  if (Platform.OS === 'android') {
    return RNStatusBar.currentHeight || 0;
  }
  return 0; // iOS управляется через SafeAreaView
}

const styles = StyleSheet.create({
  // Можно добавить общие стили если нужно
});
