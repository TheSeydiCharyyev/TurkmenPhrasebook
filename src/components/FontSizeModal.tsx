// src/components/FontSizeModal.tsx

import React, { useState, useCallback } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import { scale, verticalScale, moderateScale } from '../utils/ResponsiveUtils';

interface FontSizeModalProps {
  visible: boolean;
  onClose: () => void;
  currentFontSize: number;
  onSave: (fontSize: number) => Promise<void>;
  texts: {
    title?: string;
    preview?: string;
    cancel?: string;
    save?: string;
  };
}

const FontSizeModal = React.memo(({
  visible,
  onClose,
  currentFontSize,
  onSave,
  texts,
}: FontSizeModalProps) => {
  const [previewFontSize, setPreviewFontSize] = useState(currentFontSize);
  const insets = useSafeAreaInsets();

  // Сбрасываем preview при открытии модального окна
  React.useEffect(() => {
    if (visible) {
      setPreviewFontSize(currentFontSize);
    }
  }, [visible, currentFontSize]);

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
      <View style={styles.overlay}>
        <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, scale(20)) }]}>
          <View style={styles.header}>
            <Text style={styles.title}>{texts.title ?? 'Font Size'}</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <Text style={[styles.previewText, { fontSize: previewFontSize }]}>
              {texts.preview ?? 'Sample text - Preview'}
            </Text>

            <Text style={styles.sizeValue}>{previewFontSize}px</Text>

            <View style={styles.sliderContainer}>
              <Text style={styles.sliderLabel}>12</Text>
              <Slider
                style={styles.slider}
                minimumValue={12}
                maximumValue={24}
                step={2}
                value={previewFontSize}
                onValueChange={handleSliderChange}
                minimumTrackTintColor="#00A651"
                maximumTrackTintColor="#E5E7EB"
                thumbTintColor="#00A651"
              />
              <Text style={styles.sliderLabel}>24</Text>
            </View>
          </View>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
              <Text style={styles.cancelText}>{texts.cancel ?? 'Cancel'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveText}>{texts.save ?? 'Save'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
});

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: moderateScale(20),
    borderTopRightRadius: moderateScale(20),
    padding: scale(20),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(20),
  },
  title: {
    fontSize: moderateScale(20),
    fontWeight: '700',
    color: '#1F2937',
  },
  content: {
    alignItems: 'center',
    paddingVertical: verticalScale(10),
  },
  previewText: {
    textAlign: 'center',
    color: '#1F2937',
    marginBottom: verticalScale(16),
    lineHeight: 28,
    minHeight: verticalScale(60),
  },
  sizeValue: {
    fontSize: moderateScale(32),
    fontWeight: '700',
    color: '#00A651',
    marginBottom: verticalScale(16),
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: scale(4),
  },
  slider: {
    flex: 1,
    height: verticalScale(40),
    marginHorizontal: scale(10),
  },
  sliderLabel: {
    fontSize: moderateScale(14),
    color: '#6B7280',
    fontWeight: '500',
    minWidth: scale(24),
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    gap: scale(12),
    marginTop: verticalScale(20),
  },
  cancelButton: {
    flex: 1,
    paddingVertical: verticalScale(14),
    borderRadius: moderateScale(10),
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  cancelText: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    color: '#6B7280',
  },
  saveButton: {
    flex: 1,
    paddingVertical: verticalScale(14),
    borderRadius: moderateScale(10),
    backgroundColor: '#00A651',
    alignItems: 'center',
  },
  saveText: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default FontSizeModal;
