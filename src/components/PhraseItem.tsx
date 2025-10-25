// src/components/PhraseItem.tsx
// Компонент для отображения фразы с переводом (Phase 3)
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PhraseWithTranslation } from '../types';
import { useConfig } from '../contexts/ConfigContext';
import { useAudioMultilingual } from '../hooks/useAudioMultilingual';

interface PhraseItemProps {
  phrase: PhraseWithTranslation;
  onPress: (phrase: PhraseWithTranslation) => void;
}

/**
 * Компонент элемента фразы
 * Показывает туркменский текст + перевод на выбранный язык
 */
export const PhraseItem: React.FC<PhraseItemProps> = ({ phrase, onPress }) => {
  const { selectedLanguage } = useConfig();
  const { playAudio, isPlaying } = useAudioMultilingual();

  const handlePlayTurkmen = (e: any) => {
    e.stopPropagation(); // Предотвращаем открытие детального экрана
    playAudio(phrase.turkmen, 'tk', phrase.audioFileTurkmen);
  };

  const handlePlayTranslation = (e: any) => {
    e.stopPropagation(); // Предотвращаем открытие детального экрана
    playAudio(phrase.translation.text, selectedLanguage);
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(phrase)}
      activeOpacity={0.7}
    >
      {/* Туркменский (всегда сверху) */}
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.audioButton}
          onPress={handlePlayTurkmen}
        >
          <Ionicons
            name={isPlaying ? "pause-circle" : "play-circle"}
            size={28}
            color="#10B981"
          />
        </TouchableOpacity>

        <View style={styles.textContainer}>
          <Text style={styles.turkmenText}>{phrase.turkmen}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      {/* Перевод на выбранный язык */}
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.audioButton}
          onPress={handlePlayTranslation}
        >
          <Ionicons
            name="volume-high"
            size={24}
            color="#6B7280"
          />
        </TouchableOpacity>

        <View style={styles.textContainer}>
          <Text style={styles.translationText}>
            {phrase.translation.text}
          </Text>
          {phrase.translation.transcription && (
            <Text style={styles.transcription}>
              {phrase.translation.transcription}
            </Text>
          )}
        </View>
      </View>

      {/* Стрелка для перехода к деталям */}
      <View style={styles.chevron}>
        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    position: 'relative',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  audioButton: {
    marginRight: 12,
    padding: 4,
  },
  textContainer: {
    flex: 1,
    paddingRight: 24, // Место для chevron
  },
  turkmenText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    lineHeight: 24,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 12,
  },
  translationText: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
  },
  transcription: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
    fontStyle: 'italic',
  },
  chevron: {
    position: 'absolute',
    right: 16,
    top: '50%',
    transform: [{ translateY: -10 }],
  },
});
