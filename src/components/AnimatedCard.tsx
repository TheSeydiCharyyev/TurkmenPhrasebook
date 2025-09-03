// src/components/AnimatedCard.tsx - Исправленная версия без _value
import React, { useEffect, useRef } from 'react';
import { 
  TouchableOpacity, 
  Animated, 
  View, 
  StyleSheet, 
  ViewStyle,
  GestureResponderEvent,
  Platform 
} from 'react-native';
import { useAnimations } from '../hooks/useAnimations';

interface AnimatedCardProps {
  children: React.ReactNode;
  onPress?: (event: GestureResponderEvent) => void;
  onLongPress?: (event: GestureResponderEvent) => void;
  style?: ViewStyle | ViewStyle[];
  animationDelay?: number;
  disabled?: boolean;
  hapticFeedback?: boolean;
  pressAnimation?: boolean;
  entranceAnimation?: 'fade' | 'slide' | 'scale' | 'none';
}

export default function AnimatedCard({
  children,
  onPress,
  onLongPress,
  style,
  animationDelay = 0,
  disabled = false,
  hapticFeedback = true,
  pressAnimation = true,
  entranceAnimation = 'fade'
}: AnimatedCardProps) {
  const { 
    fadeAnim, 
    slideAnim, 
    scaleAnim,
    pressAnimation: animatePress,
    hapticFeedback: triggerHaptic,
    mountAnimation 
  } = useAnimations();
  
  const isPressed = useRef(false);
  const fadeValue = useRef(new Animated.Value(0)).current;
  const slideValue = useRef(new Animated.Value(20)).current;
  const scaleValue = useRef(new Animated.Value(0.9)).current;
  const pressScaleValue = useRef(new Animated.Value(1)).current; // Отдельный Value для press анимации

  // Анимация появления при монтировании
  useEffect(() => {
    if (entranceAnimation === 'none') {
      fadeValue.setValue(1);
      slideValue.setValue(0);
      scaleValue.setValue(1);
      return;
    }

    const animations: Animated.CompositeAnimation[] = [];

    if (entranceAnimation === 'fade' || entranceAnimation === 'slide') {
      animations.push(
        Animated.timing(fadeValue, {
          toValue: 1,
          duration: 400,
          delay: animationDelay,
          useNativeDriver: true,
        })
      );
    }

    if (entranceAnimation === 'slide') {
      animations.push(
        Animated.timing(slideValue, {
          toValue: 0,
          duration: 400,
          delay: animationDelay,
          useNativeDriver: true,
        })
      );
    }

    if (entranceAnimation === 'scale') {
      animations.push(
        Animated.spring(scaleValue, {
          toValue: 1,
          delay: animationDelay,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        })
      );
    }

    if (animations.length > 0) {
      Animated.parallel(animations).start();
    }
  }, [entranceAnimation, animationDelay, fadeValue, slideValue, scaleValue]);

  const handlePressIn = () => {
    if (disabled || !pressAnimation) return;
    
    isPressed.current = true;
    
    if (hapticFeedback) {
      triggerHaptic('light');
    }

    // Анимация нажатия - используем отдельный pressScaleValue
    Animated.timing(pressScaleValue, {
      toValue: 0.95,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    if (disabled || !pressAnimation) return;
    
    isPressed.current = false;
    
    // Возврат к исходному размеру
    Animated.spring(pressScaleValue, {
      toValue: 1,
      tension: 150,
      friction: 8,
      useNativeDriver: true,
    }).start();
  };

  const handlePress = (event: GestureResponderEvent) => {
    if (disabled) return;
    
    if (hapticFeedback) {
      triggerHaptic('medium');
    }
    
    onPress?.(event);
  };

  const handleLongPress = (event: GestureResponderEvent) => {
    if (disabled) return;
    
    if (hapticFeedback) {
      triggerHaptic('heavy');
    }
    
    onLongPress?.(event);
  };

  // Определяем стиль трансформации в зависимости от типа анимации
  const getAnimatedStyle = () => {
    const transforms: any[] = [];
    
    if (entranceAnimation === 'slide') {
      transforms.push({ translateY: slideValue });
    }
    
    // Комбинируем entrance scale и press scale
    if (entranceAnimation === 'scale') {
      // Для scale entrance анимации комбинируем оба значения
      const combinedScale = Animated.multiply(scaleValue, pressScaleValue);
      transforms.push({ scale: combinedScale });
    } else {
      // Для остальных случаев используем только press scale
      transforms.push({ scale: pressScaleValue });
    }
    
    return {
      opacity: entranceAnimation === 'fade' || entranceAnimation === 'slide' ? fadeValue : 1,
      transform: transforms,
    };
  };

  const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);
  
  // Правильно обрабатываем стили
  const flattenedStyle = StyleSheet.flatten(style);
  const combinedStyles = [
    styles.container,
    getAnimatedStyle(),
    flattenedStyle,
    disabled && styles.disabled,
  ];

  return (
    <AnimatedTouchable
      style={combinedStyles}
      onPress={handlePress}
      onLongPress={handleLongPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={pressAnimation ? 0.9 : 1}
      disabled={disabled}
    >
      {children}
    </AnimatedTouchable>
  );
}

// Специализированный компонент для карточек категорий
export function AnimatedCategoryCard({
  children,
  onPress,
  onLongPress,
  style,
  index = 0,
  disabled = false,
}: Omit<AnimatedCardProps, 'animationDelay' | 'entranceAnimation'> & { index?: number }) {
  const combinedStyles: ViewStyle[] = [styles.categoryCard];
  
  if (Array.isArray(style)) {
    combinedStyles.push(...style.filter((s): s is ViewStyle => s !== undefined));
  } else if (style) {
    combinedStyles.push(style);
  }

  return (
    <AnimatedCard
      onPress={onPress}
      onLongPress={onLongPress}
      style={combinedStyles}
      animationDelay={index * 100}
      entranceAnimation="slide"
      disabled={disabled}
      hapticFeedback={true}
      pressAnimation={true}
    >
      {children}
    </AnimatedCard>
  );
}

// Компонент для анимированных элементов списка фраз
export function AnimatedPhraseCard({
  children,
  onPress,
  style,
  index = 0,
  disabled = false,
}: Omit<AnimatedCardProps, 'animationDelay' | 'entranceAnimation'> & { index?: number }) {
  const combinedStyles: ViewStyle[] = [styles.phraseCard];
  
  if (Array.isArray(style)) {
    combinedStyles.push(...style.filter((s): s is ViewStyle => s !== undefined));
  } else if (style) {
    combinedStyles.push(style);
  }

  return (
    <AnimatedCard
      onPress={onPress}
      style={combinedStyles}
      animationDelay={index * 50}
      entranceAnimation="fade"
      disabled={disabled}
      hapticFeedback={true}
      pressAnimation={true}
    >
      {children}
    </AnimatedCard>
  );
}

const styles = StyleSheet.create({
  container: {
    // Базовые стили контейнера
  },
  disabled: {
    opacity: 0.6,
  },
  categoryCard: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    // Дополнительные стили для карточек категорий будут применяться извне
  },
  phraseCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    // Дополнительные стили для карточек фраз будут применяться извне
  },
});