// src/components/AnimatedButton.tsx - Исправленная версия

import React, { useState, useCallback } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
  ViewStyle,
  TextStyle,
  GestureResponderEvent,
} from 'react-native';
import { Colors } from '../constants/Colors';

interface AnimatedButtonProps {
  title: string;
  onPress: (event: GestureResponderEvent) => void;
  onLongPress?: (event: GestureResponderEvent) => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  hapticFeedback?: boolean;
  pressAnimation?: boolean;
  testID?: string;
  accessibilityLabel?: string;
  accessibilityRole?: string;
  accessibilityState?: any;
}

export default function AnimatedButton({
  title,
  onPress,
  onLongPress,
  style,
  textStyle,
  disabled = false,
  loading = false,
  variant = 'primary',
  size = 'medium',
  hapticFeedback = true,
  pressAnimation = true,
  testID,
  accessibilityLabel,
  accessibilityRole = 'button',
  accessibilityState,
}: AnimatedButtonProps) {
  const [scaleValue] = useState(new Animated.Value(1));

  const handlePressIn = useCallback(() => {
    if (!pressAnimation || disabled || loading) return;
    
    Animated.spring(scaleValue, {
      toValue: 0.96,
      useNativeDriver: true,
      tension: 300,
      friction: 10,
    }).start();
  }, [pressAnimation, disabled, loading, scaleValue]);

  const handlePressOut = useCallback(() => {
    if (!pressAnimation) return;
    
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
      tension: 300,
      friction: 10,
    }).start();
  }, [pressAnimation, scaleValue]);

  const handlePress = useCallback((event: GestureResponderEvent) => {
    if (disabled || loading) return;
    
    if (hapticFeedback) {
      // Простая реализация haptic feedback
      console.log('Haptic feedback');
    }
    
    onPress(event);
  }, [disabled, loading, hapticFeedback, onPress]);

  const handleLongPress = useCallback((event: GestureResponderEvent) => {
    if (disabled || loading) return;
    
    if (hapticFeedback) {
      console.log('Long press haptic feedback');
    }
    
    onLongPress?.(event);
  }, [disabled, loading, hapticFeedback, onLongPress]);

  // Получаем стили для варианта кнопки
  const getButtonStyles = (): ViewStyle => {
    const baseStyles: ViewStyle = {
      ...styles.button,
      ...styles[`${size}Button`],
    };

    switch (variant) {
      case 'primary':
        return {
          ...baseStyles,
          backgroundColor: Colors.primary,
        };
      case 'secondary':
        return {
          ...baseStyles,
          backgroundColor: Colors.accent,
        };
      case 'outline':
        return {
          ...baseStyles,
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: Colors.primary,
        };
      case 'ghost':
        return {
          ...baseStyles,
          backgroundColor: 'transparent',
        };
      default:
        return baseStyles;
    }
  };

  const getTextStyles = (): TextStyle => {
    const baseStyles: TextStyle = {
      ...styles.buttonText,
      ...styles[`${size}Text`],
    };

    switch (variant) {
      case 'primary':
      case 'secondary':
        return {
          ...baseStyles,
          color: Colors.buttonText,
        };
      case 'outline':
      case 'ghost':
        return {
          ...baseStyles,
          color: Colors.primary,
        };
      default:
        return baseStyles;
    }
  };

  const buttonStyles = [
    getButtonStyles(),
    style,
    disabled && styles.disabledButton,
    loading && styles.loadingButton,
  ];

  const finalTextStyle = [
    getTextStyles(),
    textStyle,
    disabled && styles.disabledText,
  ];

  return (
    <TouchableOpacity
      style={[
        { transform: [{ scale: scaleValue }] },
        buttonStyles,
      ]}
      onPress={handlePress}
      onLongPress={handleLongPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
      activeOpacity={pressAnimation ? 0.9 : 1}
      testID={testID}
      accessibilityLabel={accessibilityLabel || title}
      accessibilityRole={accessibilityRole as any}
      accessibilityState={{
        disabled: disabled || loading,
        ...accessibilityState,
      }}
    >
      <Text style={finalTextStyle}>
        {loading ? 'Загрузка...' : title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.shadowColor,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },

  // Размеры кнопок
  smallButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    minHeight: 36,
  },

  mediumButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 44,
  },

  largeButton: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    minHeight: 52,
  },

  // Стили текста
  buttonText: {
    fontWeight: '600',
    textAlign: 'center',
  },

  smallText: {
    fontSize: 14,
  },

  mediumText: {
    fontSize: 16,
  },

  largeText: {
    fontSize: 18,
  },

  // Состояния
  disabledButton: {
    opacity: 0.6,
  },

  loadingButton: {
    opacity: 0.8,
  },

  disabledText: {
    opacity: 0.7,
  },
});