// src/components/TTSWarningModal.tsx
// Модальное окно с предупреждением о недоступности TTS голосов

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';

interface TTSWarningModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  message: string;
  instructions?: string[];
  onTestVoice?: () => void;
  languageMode: 'tk' | 'zh';
}

export default function TTSWarningModal({
  visible,
  onClose,
  title,
  message,
  instructions,
  onTestVoice,
  languageMode,
}: TTSWarningModalProps) {
  const texts = {
    understand: languageMode === 'tk' ? 'Düşündim' : '我知道了',
    testVoice: languageMode === 'tk' ? 'Sesi synag' : '测试语音',
    howToFix: languageMode === 'tk' ? 'Nädip düzetmeli:' : '如何解决：',
    note: languageMode === 'tk' ? 'Bellik:' : '注意：',
    noteText: languageMode === 'tk'
      ? 'Türkmen sözlemler MP3 faýl görnüşinde saklanýar we hemişe elýeterli'
      : '土库曼语短语以MP3文件格式存储，始终可用',
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Заголовок */}
          <View style={styles.header}>
            <Ionicons
              name="warning"
              size={40}
              color={Colors.warning}
              style={styles.icon}
            />
            <Text style={styles.title}>{title}</Text>
          </View>

          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
          >
            {/* Основное сообщение */}
            <Text style={styles.message}>{message}</Text>

            {/* Инструкции */}
            {instructions && instructions.length > 0 && (
              <View style={styles.instructionsContainer}>
                <Text style={styles.instructionsTitle}>
                  {texts.howToFix}
                </Text>
                {instructions.map((instruction, index) => (
                  <View key={index} style={styles.instructionItem}>
                    <Text style={styles.instructionText}>
                      {instruction}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {/* Примечание о туркменских MP3 */}
            <View style={styles.noteContainer}>
              <Ionicons
                name="information-circle"
                size={20}
                color={Colors.primary}
                style={styles.noteIcon}
              />
              <View style={styles.noteTextContainer}>
                <Text style={styles.noteTitle}>{texts.note}</Text>
                <Text style={styles.noteText}>{texts.noteText}</Text>
              </View>
            </View>
          </ScrollView>

          {/* Кнопки действий */}
          <View style={styles.buttonContainer}>
            {onTestVoice && (
              <TouchableOpacity
                style={[styles.button, styles.secondaryButton]}
                onPress={onTestVoice}
              >
                <Ionicons name="play-circle" size={20} color={Colors.primary} />
                <Text style={[styles.buttonText, styles.secondaryButtonText]}>
                  {texts.testVoice}
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[styles.button, styles.primaryButton]}
              onPress={onClose}
            >
              <Text style={[styles.buttonText, styles.primaryButtonText]}>
                {texts.understand}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
    ...Platform.select({
      ios: {
        shadowColor: Colors.cardShadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  header: {
    alignItems: 'center',
    paddingTop: 24,
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  icon: {
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    textAlign: 'center',
  },
  content: {
    padding: 20,
  },
  message: {
    fontSize: 16,
    color: Colors.text,
    lineHeight: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  instructionsContainer: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  instructionText: {
    fontSize: 14,
    color: Colors.textLight,
    lineHeight: 20,
    flex: 1,
  },
  noteContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.primary + '15',
    borderRadius: 12,
    padding: 12,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
  },
  noteIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  noteTextContainer: {
    flex: 1,
  },
  noteTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
    marginBottom: 4,
  },
  noteText: {
    fontSize: 13,
    color: Colors.text,
    lineHeight: 18,
  },
  buttonContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 8,
  },
  primaryButton: {
    backgroundColor: Colors.primary,
  },
  secondaryButton: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  primaryButtonText: {
    color: Colors.textWhite,
  },
  secondaryButtonText: {
    color: Colors.primary,
  },
});
