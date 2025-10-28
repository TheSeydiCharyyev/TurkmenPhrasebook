// src/components/UnifiedScreen.tsx
// Единообразный компонент экрана для всего приложения
// Исправляет проблему с отступами на Android и обеспечивает единый стиль

import React, { ReactNode } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Platform,
  ViewStyle,
  TextStyle,
} from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { DesignColors, Spacing, Typography, BorderRadius } from '../constants/Design';

interface UnifiedScreenProps {
  children: ReactNode;

  // Header props
  title?: string;
  showBackButton?: boolean;
  showCloseButton?: boolean;
  onBackPress?: () => void;
  headerRight?: ReactNode;
  headerLeft?: ReactNode;
  hideHeader?: boolean;

  // Style props
  backgroundColor?: string;
  contentPadding?: boolean;  // Добавлять ли padding к контенту
  style?: ViewStyle;
}

export default function UnifiedScreen({
  children,
  title,
  showBackButton = false,
  showCloseButton = false,
  onBackPress,
  headerRight,
  headerLeft,
  hideHeader = false,
  backgroundColor = DesignColors.background,
  contentPadding = false,
  style,
}: UnifiedScreenProps) {
  const navigation = useNavigation();

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  return (
    <View style={[styles.container, { backgroundColor }, style]}>
      {/* StatusBar - правильная настройка для Android */}
      <StatusBar
        barStyle="dark-content"
        backgroundColor={backgroundColor}
        translucent={false}
      />

      {/* Отступ для Android StatusBar */}
      {Platform.OS === 'android' && <View style={{ height: StatusBar.currentHeight || 0 }} />}

      {/* Header - единый стиль */}
      {!hideHeader && (
        <View style={styles.header}>
          {/* Left side */}
          <View style={styles.headerLeft}>
            {headerLeft ? (
              headerLeft
            ) : showBackButton ? (
              <TouchableOpacity
                style={styles.headerButton}
                onPress={handleBackPress}
                activeOpacity={0.6}
              >
                <Ionicons name="chevron-back" size={24} color={DesignColors.text} />
              </TouchableOpacity>
            ) : showCloseButton ? (
              <TouchableOpacity
                style={styles.headerButton}
                onPress={handleBackPress}
                activeOpacity={0.6}
              >
                <Ionicons name="close" size={24} color={DesignColors.text} />
              </TouchableOpacity>
            ) : (
              <View style={styles.headerButton} />
            )}
          </View>

          {/* Title */}
          {title && (
            <Text style={styles.headerTitle} numberOfLines={1}>
              {title}
            </Text>
          )}

          {/* Right side */}
          <View style={styles.headerRight}>
            {headerRight || <View style={styles.headerButton} />}
          </View>
        </View>
      )}

      {/* Content */}
      <View style={[styles.content, contentPadding && styles.contentWithPadding]}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  // Header - единый стиль для всех экранов
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.sm,
    backgroundColor: DesignColors.background,
    borderBottomWidth: 1,
    borderBottomColor: DesignColors.border,
  },

  headerLeft: {
    width: 48,
    alignItems: 'flex-start',
  },

  headerRight: {
    width: 48,
    alignItems: 'flex-end',
  },

  headerButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerTitle: {
    flex: 1,
    fontSize: Typography.h3,
    fontWeight: Typography.semibold,
    color: DesignColors.text,
    textAlign: 'center',
    fontFamily: Typography.fontFamily,
  },

  content: {
    flex: 1,
  },

  contentWithPadding: {
    paddingHorizontal: Spacing.screenPadding,
  },
});

// Дополнительный компонент для секций
interface SectionProps {
  title?: string;
  children: ReactNode;
  style?: ViewStyle;
}

export function Section({ title, children, style }: SectionProps) {
  return (
    <View style={[styles.section, style]}>
      {title && <Text style={styles.sectionTitle}>{title}</Text>}
      {children}
    </View>
  );
}

const sectionStyles = StyleSheet.create({
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
});

Object.assign(styles, sectionStyles);
