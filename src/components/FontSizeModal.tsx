// src/components/FontSizeModal.tsx - новый файл компонента

import React, { useState, useCallback, useMemo } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import { Colors } from '../constants/Colors';

interface FontSizeModalProps {
  visible: boolean;
  onClose: () => void;
  currentFontSize: number;
  onSave: (fontSize: number) => Promise<void>;
  config: { mode: 'tk' | 'zh' | 'ru' | 'en' | 'tr' | 'de' | 'fr' | 'es' | 'it' | 'pt' | 'nl' | 'pl' | 'uk' };
}

const FontSizeModal = React.memo(({ 
  visible, 
  onClose, 
  currentFontSize, 
  onSave, 
  config 
}: FontSizeModalProps) => {
  // Локальный state для предварительного просмотра
  const [previewFontSize, setPreviewFontSize] = useState(currentFontSize);
  
  // Сбрасываем preview при открытии модального окна
  React.useEffect(() => {
    if (visible) {
      setPreviewFontSize(currentFontSize);
    }
  }, [visible, currentFontSize]);

  // Мемоизированный текст предварительного просмотра
  const previewText = useMemo(() => {
    return config.mode === 'tk' 
      ? 'Synagly tekst - Hytaý dili öwren' 
      : '测试文本 - 学习中文';
  }, [config.mode]);

  // Мемоизированные обработчики
  const handleSliderChange = useCallback((value: number) => {
    setPreviewFontSize(value);
  }, []);

  const handleSave = useCallback(async () => {
    await onSave(previewFontSize);
    onClose();
  }, [previewFontSize, onSave, onClose]);

  const handleCancel = useCallback(() => {
    setPreviewFontSize(currentFontSize);
    onClose();
  }, [currentFontSize, onClose]);

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent={false}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>
            {config.mode === 'tk' ? 'Harpyň ululygy' : '字体大小'}
          </Text>

          <Text style={[styles.previewText, { fontSize: previewFontSize }]}>
            {previewText}
          </Text>

          <View style={styles.sliderContainer}>
            <Text style={styles.sliderLabel}>12</Text>
            <Slider
              style={styles.slider}
              minimumValue={12}
              maximumValue={24}
              step={2}
              value={previewFontSize}
              onValueChange={handleSliderChange}
              minimumTrackTintColor={Colors.primary}
              maximumTrackTintColor={Colors.textLight}
            />
            <Text style={styles.sliderLabel}>24</Text>
          </View>

          <View style={styles.modalActions}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={handleCancel}
            >
              <Text style={styles.cancelButtonText}>
                {config.mode === 'tk' ? 'Ýatyr' : '取消'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.saveButton]}
              onPress={handleSave}
            >
              <Text style={styles.saveButtonText}>
                {config.mode === 'tk' ? 'Ýatda sakla' : '保存'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
});

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 20,
    padding: 24,
    margin: 20,
    width: '90%',
    maxWidth: 400,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 20,
  },
  previewText: {
    textAlign: 'center',
    color: Colors.text,
    marginBottom: 20,
    lineHeight: 24,
    minHeight: 48, // Предотвращает скачки layout
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  slider: {
    flex: 1,
    height: 40,
    marginHorizontal: 10,
  },
  sliderLabel: {
    fontSize: 14,
    color: Colors.textLight,
    fontWeight: '500',
    minWidth: 20,
    textAlign: 'center',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: Colors.backgroundLight,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  saveButton: {
    backgroundColor: Colors.primary,
  },
  cancelButtonText: {
    color: Colors.textLight,
    fontSize: 16,
    fontWeight: '500',
  },
  saveButtonText: {
    color: Colors.textWhite,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default FontSizeModal;