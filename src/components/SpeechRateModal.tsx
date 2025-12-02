import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import { scale, verticalScale, moderateScale } from '../utils/ResponsiveUtils';

interface Props {
  visible: boolean;
  onClose: () => void;
  currentRate: number;
  onSave: (rate: number) => void;
  texts?: {
    title?: string;
    test?: string;
    cancel?: string;
    save?: string;
  };
}

export default function SpeechRateModal({ visible, onClose, currentRate, onSave, texts }: Props) {
  const [rate, setRate] = useState(currentRate);

  // Reset rate when modal opens
  useEffect(() => {
    if (visible) {
      setRate(currentRate);
    }
  }, [visible, currentRate]);

  const testSpeed = () => {
    Speech.speak('Hello, this is a test of the speech rate.', { rate, language: 'en-US' });
  };

  const handleSave = () => {
    onSave(rate);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>{texts?.title ?? 'Speech Rate'}</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <Text style={styles.rateText}>{rate.toFixed(2)}x</Text>

            <Slider
              style={styles.slider}
              minimumValue={0.5}
              maximumValue={2.0}
              step={0.05}
              value={rate}
              onValueChange={setRate}
              minimumTrackTintColor="#00A651"
              maximumTrackTintColor="#E5E7EB"
              thumbTintColor="#00A651"
            />

            <View style={styles.labels}>
              <Text style={styles.label}>0.5x</Text>
              <Text style={styles.label}>1.0x</Text>
              <Text style={styles.label}>2.0x</Text>
            </View>

            <TouchableOpacity style={styles.testButton} onPress={testSpeed}>
              <Ionicons name="play" size={20} color="#FFFFFF" />
              <Text style={styles.testButtonText}>{texts?.test ?? 'Test Speed'}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelText}>{texts?.cancel ?? 'Cancel'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveText}>{texts?.save ?? 'Save'}</Text>
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
    paddingVertical: verticalScale(20),
  },
  rateText: {
    fontSize: moderateScale(48),
    fontWeight: '700',
    color: '#00A651',
    marginBottom: verticalScale(20),
  },
  slider: {
    width: '100%',
    height: verticalScale(40),
  },
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: scale(10),
    marginTop: verticalScale(5),
  },
  label: {
    fontSize: moderateScale(12),
    color: '#6B7280',
  },
  testButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00A651',
    paddingHorizontal: scale(24),
    paddingVertical: verticalScale(12),
    borderRadius: moderateScale(10),
    marginTop: verticalScale(20),
    gap: scale(8),
  },
  testButtonText: {
    color: '#FFFFFF',
    fontSize: moderateScale(16),
    fontWeight: '600',
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
