// src/components/AudioPlayer.tsx
// ✅ УПРОЩЕНО: Кнопки всегда видны, работают с гибридной системой

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import { useAudio } from '../hooks/useAudio';
import { useAppLanguage } from '../contexts/LanguageContext';

interface AudioPlayerProps {
  text: string;                    // Текст для произношения (TTS)
  language: string;                // Любой язык (для всех 31 языков)
  audioPath?: string;              // Путь к MP3 (только для туркменского)
  label: string;
  style: 'primary' | 'secondary';
  size?: 'small' | 'large';
  disabled?: boolean;
}

export default function AudioPlayer({ 
  text,
  language,
  audioPath,
  label, 
  style,
  size = 'large',
  disabled = false 
}: AudioPlayerProps) {
  const { isPlaying, isLoading, playAudio, stopAudio } = useAudio();
  const { config } = useAppLanguage();

  const handlePress = async () => {
    if (isPlaying) {
      await stopAudio();
    } else {
      await playAudio(text, language, audioPath);
    }
  };

  const getButtonStyle = () => {
    const baseStyle = size === 'small' ? styles.buttonSmall : styles.buttonLarge;
    
    if (style === 'primary') {
      return [baseStyle, styles.primaryButton];
    } else {
      return [baseStyle, styles.secondaryButton];
    }
  };

  const getTextStyle = () => {
    return size === 'small' ? styles.labelSmall : styles.labelLarge;
  };

  const getIconSize = () => {
    return size === 'small' ? 20 : 28;
  };

  const getPlayingText = () => {
    if (config.mode === 'tk') return 'Çalýar...';
    if (config.mode === 'zh') return '播放中...';
    return 'Воспроизводится...';
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), (disabled || isLoading) && styles.disabled]}
      onPress={handlePress}
      disabled={disabled || isLoading}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        {isLoading ? (
          <ActivityIndicator 
            size={size === 'small' ? 'small' : 'large'} 
            color={Colors.textWhite} 
          />
        ) : (
          <Ionicons
            name={isPlaying ? "pause-circle" : "play-circle"}
            size={getIconSize()}
            color={Colors.textWhite}
          />
        )}
        {size === 'large' && (
          <Text style={[getTextStyle(), styles.buttonText]}>
            {isPlaying ? getPlayingText() : label}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  buttonLarge: {
    paddingVertical: 18,       // ✅ Больше padding
    paddingHorizontal: 28,     // ✅ Больше padding
    borderRadius: 16,          // ✅ Больше скругление
    minWidth: 180,             // ✅ Шире кнопка
    elevation: 6,              // ✅ Мощнее тень
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  buttonSmall: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    minWidth: 100,
  },
  // ✅ MODERN VIBRANT - Синий для языков перевода
  primaryButton: {
    backgroundColor: '#3B82F6',    // Яркий синий
    shadowColor: '#2563EB',
  },
  // ✅ MODERN VIBRANT - Зеленый для туркменского
  secondaryButton: {
    backgroundColor: '#22C55E',    // Яркий зеленый
    shadowColor: '#16A34A',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonText: {
    color: Colors.textWhite,
    fontWeight: '700',         // ✅ Более жирный шрифт
  },
  labelLarge: {
    fontSize: 18,              // ✅ Крупнее текст
  },
  labelSmall: {
    fontSize: 15,
  },
  disabled: {
    opacity: 0.5,
  },
});