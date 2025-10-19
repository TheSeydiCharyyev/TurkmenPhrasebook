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
  language: 'chinese' | 'turkmen' | 'russian';
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
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    minWidth: 140,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonSmall: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    minWidth: 80,
  },
  primaryButton: {
    backgroundColor: Colors.primary,
  },
  secondaryButton: {
    backgroundColor: Colors.accent,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonText: {
    color: Colors.textWhite,
    fontWeight: '600',
  },
  labelLarge: {
    fontSize: 16,
  },
  labelSmall: {
    fontSize: 14,
  },
  disabled: {
    opacity: 0.5,
  },
});