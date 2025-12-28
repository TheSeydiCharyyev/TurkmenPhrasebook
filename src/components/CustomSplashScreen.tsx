import React, { useEffect, useRef } from 'react';
import { View, Image, Animated, StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

interface CustomSplashScreenProps {
  onFinish: () => void;
  onImageLoaded?: () => void;
}

export default function CustomSplashScreen({ onFinish, onImageLoaded }: CustomSplashScreenProps) {
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const timerStarted = useRef(false);

  const startFadeOut = () => {
    if (timerStarted.current) return;
    timerStarted.current = true;

    // Показываем splash 2 секунды, потом fade out
    setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        onFinish();
      });
    }, 2000);
  };

  const handleImageLoad = () => {
    onImageLoaded?.();
    startFadeOut();
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <Image
        source={require('../../assets/splash.png')}
        style={styles.image}
        resizeMode="cover"
        onLoad={handleImageLoad}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#5BA3D9',
    zIndex: 9999,
  },
  image: {
    width: width,
    height: height,
  },
});
