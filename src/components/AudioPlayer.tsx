// src/components/AudioPlayer.tsx
// ✅ УПРОЩЕНО: Кнопки всегда видны, работают с гибридной системой

import React, { useState } from 'react';
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
  const { isPlaying, isLoading, playAudio, stopAudio, currentLanguage } = useAudio();
  const { config } = useAppLanguage();
  const [usedLanguageCode, setUsedLanguageCode] = useState<string | null>(null);

  const handlePress = async () => {
    if (isPlaying) {
      await stopAudio();
      setUsedLanguageCode(null);
    } else {
      const actualLang = await playAudio(text, language, audioPath);
      setUsedLanguageCode(actualLang);
    }
  };

  // Проверяем используется ли fallback (TTS языки)
  const isFallback = usedLanguageCode &&
                     language !== 'turkmen' &&
                     usedLanguageCode.startsWith('en');

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
    return size === 'small' ? 20 : 24; // ✅ МИНИМАЛИЗМ - меньше иконка
  };

  const getPlayingText = () => {
    if (config.mode === 'tk') return 'Çalýar...';
    if (config.mode === 'zh') return '播放中...';
    return 'Воспроизводится...';
  };

  return (
    <View>
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
              color="#374151"
            />
          ) : (
            <Ionicons
              name={isPlaying ? "pause-circle" : "play-circle"}
              size={getIconSize()}
              color="#374151"
            />
          )}
          {size === 'large' && (
            <Text style={[getTextStyle(), styles.buttonText]}>
              {isPlaying ? getPlayingText() : label}
            </Text>
          )}
        </View>
      </TouchableOpacity>

      {/* Badge для fallback языка */}
      {isFallback && size === 'large' && (
        <View style={styles.fallbackBadge}>
          <Text style={styles.fallbackText}>🔊 Fallback: EN</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  buttonLarge: {
    paddingVertical: 14,       // ✅ МИНИМАЛИЗМ - меньше padding
    paddingHorizontal: 20,     // ✅ Компактнее
    borderRadius: 12,          // ✅ Меньше скругление
    minWidth: 160,             // ✅ Компактнее кнопка
    elevation: 1,              // ✅ Минимальная тень
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,       // ✅ Очень subtle тень
    shadowRadius: 2,
    backgroundColor: '#FFFFFF', // ✅ Белый фон
    borderWidth: 1.5,          // ✅ Border для outline
    borderColor: '#D1D5DB',    // ✅ Серый border
  },
  buttonSmall: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    minWidth: 90,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
  },
  // ✅ МИНИМАЛИЗМ - убраны яркие цвета
  primaryButton: {
    // Стиль наследуется от buttonLarge/Small (белый фон + серый border)
  },
  // ✅ МИНИМАЛИЗМ - убраны яркие цвета
  secondaryButton: {
    // Стиль наследуется от buttonLarge/Small (белый фон + серый border)
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,                    // ✅ МИНИМАЛИЗМ - меньше gap
  },
  buttonText: {
    color: '#374151',          // ✅ МИНИМАЛИЗМ - темно-серый
    fontWeight: '600',         // ✅ Меньше жирность
  },
  labelLarge: {
    fontSize: 15,              // ✅ МИНИМАЛИЗМ - меньше текст
  },
  labelSmall: {
    fontSize: 13,              // ✅ Меньше
  },
  disabled: {
    opacity: 0.5,
  },
  fallbackBadge: {
    marginTop: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: '#F3F4F6',  // Светло-серый фон
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginLeft: 4,
  },
  fallbackText: {
    fontSize: 11,
    color: '#6B7280',            // Серый текст
    fontWeight: '500',
  },
});