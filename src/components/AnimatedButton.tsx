// src/components/AnimatedButton.tsx - Улучшенная кнопка с анимациями дня 16
import React, { useRef } from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  Animated,
  StyleSheet,
  ViewStyle,
  TextStyle,
  GestureResponderEvent,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAnimations } from '../hooks/useAnimations';
import { Colors, ColorUtils } from '../constants/Colors';
import { TextStyles, TypographyUtils } from '../constants/Typography';

interface AnimatedButtonProps {
  title: string;
  onPress: (event: GestureResponderEvent) => void;
  
  // Стилизация
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'gradient';
  size?: 'small' | 'medium' | 'large';
  
  // Состояния
  disabled?: boolean;
  loading?: boolean;
  
  // Иконки
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  iconSize?: number;
  
  // Анимации
  hapticFeedback?: boolean;
  pressAnimation?: boolean;
  bounceOnMount?: boolean;
  
  // Кастомные стили
  style?: ViewStyle;
  textStyle?: TextStyle;
  
  // Дополнительные props
  testID?: string;
  accessibilityLabel?: string;
}

export default function AnimatedButton({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  leftIcon,
  rightIcon,
  iconSize,
  hapticFeedback = true,
  pressAnimation = true,
  bounceOnMount = false,
  style,
  textStyle,
  testID,
  accessibilityLabel,
}: AnimatedButtonProps) {
  const { 
    pressAnimation: animatePress, 
    hapticFeedback: triggerHaptic,
    springScale
  } = useAnimations();
  
  const scaleAnim = useRef(new Animated.Value(bounceOnMount ? 0.8 : 1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  // Анимация при монтировании
  React.useEffect(() => {
    if (bounceOnMount) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 150,
        friction: 8,
        useNativeDriver: true,
      }).start();
    }
  }, [bounceOnMount, scaleAnim]);

  // Анимация загрузки
  React.useEffect(() => {
    if (loading) {
      const rotation = Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        })
      );
      rotation.start();
      return () => rotation.stop();
    } else {
      rotateAnim.setValue(0);
    }
  }, [loading, rotateAnim]);

  // Получение стилей в зависимости от варианта и размера
  const getButtonStyles = () => {
    const baseStyle: ViewStyle = {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: size === 'small' ? 8 : size === 'large' ? 16 : 12,
    };

    const sizeStyles: Record<string, ViewStyle> = {
      small: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        minHeight: 36,
      },
      medium: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        minHeight: 44,
      },
      large: {
        paddingVertical: 16,
        paddingHorizontal: 24,
        minHeight: 52,
      },
    };

    const variantStyles: Record<string, ViewStyle> = {
      primary: {
        backgroundColor: Colors.primary,
        elevation: 2,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      secondary: {
        backgroundColor: Colors.backgroundDark,
        borderWidth: 1,
        borderColor: Colors.cardBorder,
      },
      outline: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: Colors.primary,
      },
      ghost: {
        backgroundColor: 'transparent',
      },
      gradient: {
        elevation: 2,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
    };

    return StyleSheet.flatten([baseStyle, sizeStyles[size], variantStyles[variant]]);
  };

  const getTextStyles = () => {
    const baseTextStyle = TypographyUtils.getButtonTextStyle(variant);
    
    const variantTextColors: Record<string, string> = {
      primary: Colors.textWhite,
      secondary: Colors.text,
      outline: Colors.primary,
      ghost: Colors.primary,
      gradient: Colors.textWhite,
    };

    return StyleSheet.flatten([
      baseTextStyle,
      { color: variantTextColors[variant] },
      textStyle,
    ]);
  };

  const getIconColor = () => {
    const variantColors: Record<string, string> = {
      primary: Colors.textWhite,
      secondary: Colors.text,
      outline: Colors.primary,
      ghost: Colors.primary,
      gradient: Colors.textWhite,
    };
    
    return variantColors[variant];
  };

  const getIconSize = () => {
    if (iconSize) return iconSize;
    
    const sizeMap: Record<string, number> = {
      small: 16,
      medium: 20,
      large: 24,
    };
    
    return sizeMap[size];
  };

  const handlePressIn = () => {
    if (disabled || loading) return;

    if (hapticFeedback) {
      triggerHaptic('light');
    }

    if (pressAnimation) {
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 0.95,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0.8,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  const handlePressOut = () => {
    if (disabled || loading) return;

    if (pressAnimation) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 150,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  const handlePress = (event: GestureResponderEvent) => {
    if (disabled || loading) return;

    if (hapticFeedback) {
      triggerHaptic('medium');
    }

    onPress(event);
  };

  const animatedStyle = {
    transform: [{ scale: scaleAnim }],
    opacity: opacityAnim,
  };

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const buttonContent = (
    <View style={styles.contentContainer}>
      {/* Левая иконка */}
      {leftIcon && !loading && (
        <Ionicons
          name={leftIcon}
          size={getIconSize()}
          color={getIconColor()}
          style={[styles.leftIcon, rightIcon || title ? styles.iconMargin : undefined]}
        />
      )}

      {/* Индикатор загрузки */}
      {loading && (
        <Animated.View
          style={[
            styles.loadingIcon,
            { transform: [{ rotate: rotateInterpolate }] },
            title ? styles.iconMargin : undefined,
          ]}
        >
          <Ionicons
            name="refresh"
            size={getIconSize()}
            color={getIconColor()}
          />
        </Animated.View>
      )}

      {/* Текст */}
      {title && (
        <Text
          style={[getTextStyles(), loading && styles.loadingText]}
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          {title}
        </Text>
      )}

      {/* Правая иконка */}
      {rightIcon && !loading && (
        <Ionicons
          name={rightIcon}
          size={getIconSize()}
          color={getIconColor()}
          style={[styles.rightIcon, leftIcon || title ? styles.iconMargin : undefined]}
        />
      )}
    </View>
  );

  const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);
  const buttonStyles = [getButtonStyles(), animatedStyle, style, disabled && styles.disabled];

  // Рендер с градиентом или обычной кнопкой
  if (variant === 'gradient') {
    return (
      <AnimatedTouchable
        style={[buttonStyles, { overflow: 'hidden' }]}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        activeOpacity={pressAnimation ? 1 : 0.7}
        testID={testID}
        accessibilityLabel={accessibilityLabel || title}
        accessibilityRole="button"
        accessibilityState={{ disabled: disabled || loading }}
      >
        <LinearGradient
          colors={[Colors.gradientStart, Colors.gradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradientBackground}
        >
          {buttonContent}
        </LinearGradient>
      </AnimatedTouchable>
    );
  }

  return (
    <AnimatedTouchable
      style={buttonStyles}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
      activeOpacity={pressAnimation ? 1 : 0.7}
      testID={testID}
      accessibilityLabel={accessibilityLabel || title}
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading }}
    >
      {buttonContent}
    </AnimatedTouchable>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftIcon: {
    // Отступ применяется условно
  },
  rightIcon: {
    // Отступ применяется условно
  },
  loadingIcon: {
    // Отступ применяется условно
  },
  iconMargin: {
    marginHorizontal: 4,
  },
  loadingText: {
    opacity: 0.7,
  },
  disabled: {
    opacity: 0.6,
  },
  gradientBackground: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
});

// Экспортируем также специализированные варианты кнопок
export const PrimaryButton = (props: Omit<AnimatedButtonProps, 'variant'>) => (
  <AnimatedButton {...props} variant="primary" />
);

export const SecondaryButton = (props: Omit<AnimatedButtonProps, 'variant'>) => (
  <AnimatedButton {...props} variant="secondary" />
);

export const OutlineButton = (props: Omit<AnimatedButtonProps, 'variant'>) => (
  <AnimatedButton {...props} variant="outline" />
);

export const GradientButton = (props: Omit<AnimatedButtonProps, 'variant'>) => (
  <AnimatedButton {...props} variant="gradient" />
);

export const IconButton = (props: Omit<AnimatedButtonProps, 'title'> & { icon: keyof typeof Ionicons.glyphMap }) => (
  <AnimatedButton {...props} title="" leftIcon={props.icon} />
);