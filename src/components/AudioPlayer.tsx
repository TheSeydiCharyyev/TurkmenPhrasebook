// src/components/AudioPlayer.tsx
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
// В каждом файле, где используется useAppLanguage
import { useAppLanguage } from '../contexts/LanguageContext';

interface AudioPlayerProps {
  text: string;
  language: 'chinese' | 'turkmen';
  label: string;
  style: 'primary' | 'secondary';
  size?: 'small' | 'large';
  disabled?: boolean;
}

export default function AudioPlayer({ 
  text, 
  language, 
  label, 
  style,
  size = 'large',
  disabled = false 
}: AudioPlayerProps) {
  const { isPlaying, playText, stopAudio } = useAudio();
  const { config } = useAppLanguage();

  const handlePress = () => {
    if (isPlaying) {
      stopAudio();
    } else {
      playText(text, language);
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
      style={[getButtonStyle(), disabled && styles.disabled]}
      onPress={handlePress}
      disabled={disabled || isPlaying}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        {isPlaying ? (
          <ActivityIndicator size={size === 'small' ? 'small' : 'large'} color={Colors.textWhite} />
        ) : (
          <Ionicons
            name="play-circle"
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
      
      {size === 'small' && (
        <Text style={[getTextStyle(), styles.smallLabel]}>
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  buttonLarge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 12,
  },
  buttonSmall: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 4,
  },
  primaryButton: {
    backgroundColor: Colors.primary,
  },
  secondaryButton: {
    backgroundColor: Colors.accent,
  },
  disabled: {
    opacity: 0.6,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
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
    fontSize: 10,
    marginTop: 2,
  },
  smallLabel: {
    color: Colors.textLight,
    textAlign: 'center',
  },
});