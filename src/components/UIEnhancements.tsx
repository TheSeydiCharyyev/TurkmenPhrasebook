// src/components/UIEnhancements.tsx - Микро-анимации для финального релиза
import React, { useEffect, useRef } from 'react';
import { Animated, Easing, ViewStyle } from 'react-native';

interface AnimatedElementProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  style?: ViewStyle;
  animationType?: 'fadeIn' | 'slideUp' | 'slideDown' | 'scale' | 'pulse';
}

// Компонент для анимированного появления элементов
export function AnimatedElement({ 
  children, 
  delay = 0, 
  duration = 300,
  style,
  animationType = 'fadeIn' 
}: AnimatedElementProps) {
  const animation = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;
  const scale = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      switch (animationType) {
        case 'fadeIn':
          Animated.timing(animation, {
            toValue: 1,
            duration,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }).start();
          break;

        case 'slideUp':
          Animated.parallel([
            Animated.timing(animation, {
              toValue: 1,
              duration,
              easing: Easing.out(Easing.cubic),
              useNativeDriver: true,
            }),
            Animated.timing(translateY, {
              toValue: 0,
              duration,
              easing: Easing.out(Easing.cubic),
              useNativeDriver: true,
            }),
          ]).start();
          break;

        case 'slideDown':
          translateY.setValue(-20);
          Animated.parallel([
            Animated.timing(animation, {
              toValue: 1,
              duration,
              easing: Easing.out(Easing.cubic),
              useNativeDriver: true,
            }),
            Animated.timing(translateY, {
              toValue: 0,
              duration,
              easing: Easing.out(Easing.cubic),
              useNativeDriver: true,
            }),
          ]).start();
          break;

        case 'scale':
          Animated.parallel([
            Animated.timing(animation, {
              toValue: 1,
              duration,
              easing: Easing.out(Easing.back(1.2)),
              useNativeDriver: true,
            }),
            Animated.timing(scale, {
              toValue: 1,
              duration,
              easing: Easing.out(Easing.back(1.2)),
              useNativeDriver: true,
            }),
          ]).start();
          break;

        case 'pulse':
          const pulseAnimation = () => {
            Animated.sequence([
              Animated.timing(scale, {
                toValue: 1.05,
                duration: duration / 2,
                easing: Easing.inOut(Easing.sine),
                useNativeDriver: true,
              }),
              Animated.timing(scale, {
                toValue: 1,
                duration: duration / 2,
                easing: Easing.inOut(Easing.sine),
                useNativeDriver: true,
              }),
            ]).start();
          };

          animation.setValue(1);
          pulseAnimation();
          break;
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [animation, translateY, scale, delay, duration, animationType]);

  const animatedStyle = {
    opacity: animation,
    transform: [
      { translateY: animationType === 'slideUp' || animationType === 'slideDown' ? translateY : 0 },
      { scale: animationType === 'scale' || animationType === 'pulse' ? scale : 1 },
    ],
  };

  return (
    <Animated.View style={[style, animatedStyle]}>
      {children}
    </Animated.View>
  );
}

// Компонент для улучшенного индикатора загрузки
interface LoadingDotsProps {
  size?: number;
  color?: string;
  style?: ViewStyle;
}

export function LoadingDots({ size = 8, color = '#DC2626', style }: LoadingDotsProps) {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animateDots = () => {
      const createDotAnimation = (dot: Animated.Value, delay: number) => {
        return Animated.loop(
          Animated.sequence([
            Animated.delay(delay),
            Animated.timing(dot, {
              toValue: 1,
              duration: 400,
              easing: Easing.inOut(Easing.sine),
              useNativeDriver: true,
            }),
            Animated.timing(dot, {
              toValue: 0,
              duration: 400,
              easing: Easing.inOut(Easing.sine),
              useNativeDriver: true,
            }),
            Animated.delay(200),
          ])
        );
      };

      Animated.parallel([
        createDotAnimation(dot1, 0),
        createDotAnimation(dot2, 150),
        createDotAnimation(dot3, 300),
      ]).start();
    };

    animateDots();
  }, [dot1, dot2, dot3]);

  const dotStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
    backgroundColor: color,
    marginHorizontal: size / 4,
  };

  return (
    <Animated.View style={[{ flexDirection: 'row', alignItems: 'center' }, style]}>
      <Animated.View style={[dotStyle, { opacity: dot1 }]} />
      <Animated.View style={[dotStyle, { opacity: dot2 }]} />
      <Animated.View style={[dotStyle, { opacity: dot3 }]} />
    </Animated.View>
  );
}

// Компонент для анимированного счетчика
interface AnimatedCounterProps {
  value: number;
  duration?: number;
  style?: ViewStyle;
  textStyle?: any;
}

export function AnimatedCounter({ value, duration = 1000, style, textStyle }: AnimatedCounterProps) {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const [displayValue, setDisplayValue] = React.useState(0);

  useEffect(() => {
    const listener = animatedValue.addListener(({ value }) => {
      setDisplayValue(Math.round(value));
    });

    Animated.timing(animatedValue, {
      toValue: value,
      duration,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();

    return () => {
      animatedValue.removeListener(listener);
    };
  }, [animatedValue, value, duration]);

  return (
    <Animated.View style={style}>
      <Animated.Text style={textStyle}>
        {displayValue}
      </Animated.Text>
    </Animated.View>
  );
}

// Компонент для плавного перехода цветов
interface ColorTransitionProps {
  children: React.ReactNode;
  fromColor: string;
  toColor: string;
  duration?: number;
  style?: ViewStyle;
}

export function ColorTransition({ 
  children, 
  fromColor, 
  toColor, 
  duration = 300, 
  style 
}: ColorTransitionProps) {
  const colorAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(colorAnimation, {
      toValue: 1,
      duration,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false,
    }).start();
  }, [colorAnimation, duration]);

  const backgroundColor = colorAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [fromColor, toColor],
  });

  return (
    <Animated.View style={[style, { backgroundColor }]}>
      {children}
    </Animated.View>
  );
}

// Хук для создания shake анимации
export function useShakeAnimation() {
  const shakeAnimation = useRef(new Animated.Value(0)).current;

  const shake = () => {
    shakeAnimation.setValue(0);
    Animated.sequence([
      Animated.timing(shakeAnimation, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  };

  const shakeStyle = {
    transform: [{ translateX: shakeAnimation }],
  };

  return { shake, shakeStyle };
}

// Компонент для красивых карточек с тенью
interface EnhancedCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  shadowColor?: string;
  elevation?: number;
}

export function EnhancedCard({ 
  children, 
  style, 
  shadowColor = '#000', 
  elevation = 4 
}: EnhancedCardProps) {
  const cardStyle = {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor,
    shadowOffset: {
      width: 0,
      height: elevation / 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: elevation,
    elevation,
    ...style,
  };

  return (
    <AnimatedElement animationType="fadeIn" duration={200}>
      <Animated.View style={cardStyle}>
        {children}
      </Animated.View>
    </AnimatedElement>
  );
}