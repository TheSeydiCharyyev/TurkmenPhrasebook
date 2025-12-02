// src/features/visual-translator/components/OCREngineSelector.tsx
// Компонент для выбора OCR движка

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { OCREngine, OCREngineInfo } from '../types/visual-translator.types';
import OCRService from '../services/OCRService';
import { useAppLanguage } from '../../../contexts/LanguageContext';

interface Props {
  visible: boolean;
  onClose: () => void;
  onEngineSelect: (engine: OCREngine) => void;
}

const OCREngineSelector: React.FC<Props> = ({ visible, onClose, onEngineSelect }) => {
  const { getTexts } = useAppLanguage();
  const texts = getTexts();
  const [engines, setEngines] = useState<OCREngineInfo[]>([]);
  const [selectedEngine, setSelectedEngine] = useState<OCREngine>(OCREngine.OCR_SPACE);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (visible) {
      loadEngines();
    }
  }, [visible]);

  const loadEngines = async () => {
    setLoading(true);
    try {
      const availableEngines = await OCRService.getAvailableEngines();
      const current = OCRService.getSelectedEngine();
      setEngines(availableEngines);
      setSelectedEngine(current);
    } catch (error) {
      console.error('[OCREngineSelector] Failed to load engines:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = async (engine: OCREngineInfo) => {
    // Нельзя выбрать движки с coming soon
    if (engine.isComingSoon || !engine.isAvailable) {
      return;
    }
    setSelectedEngine(engine.id);
    await OCRService.setSelectedEngine(engine.id);
    onEngineSelect(engine.id);
    onClose();
  };

  const getStatusBadge = (engine: OCREngineInfo) => {
    if (engine.isComingSoon) {
      return { text: texts.vtComingSoon || 'Coming soon', color: '#9CA3AF' };
    }
    if (!engine.isAvailable) {
      return { text: 'Unavailable', color: '#EF4444' };
    }
    if (engine.isPremium) {
      return { text: 'Premium', color: '#F59E0B' };
    }
    if (engine.isOnline) {
      return { text: 'Online', color: '#3B82F6' };
    }
    return { text: 'Offline', color: '#10B981' };
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>{texts.vtOcrEngine || 'Select OCR Engine'}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Description */}
          <Text style={styles.description}>
            {texts.vtOcrEngineDesc || 'Choose how to recognize text from images.'}
          </Text>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#00A651" />
              <Text style={styles.loadingText}>{texts.loading || 'Loading...'}</Text>
            </View>
          ) : (
            <ScrollView style={styles.engineList}>
              {engines.map((engine) => {
                const isSelected = engine.id === selectedEngine;
                const isDisabled = engine.isComingSoon || !engine.isAvailable;
                const status = getStatusBadge(engine);

                return (
                  <TouchableOpacity
                    key={engine.id}
                    style={[
                      styles.engineCard,
                      isSelected && !isDisabled && styles.engineCardSelected,
                      isDisabled && styles.engineCardDisabled,
                    ]}
                    onPress={() => handleSelect(engine)}
                    disabled={isDisabled}
                  >
                    <View style={styles.engineCardHeader}>
                      <View style={styles.engineCardTitle}>
                        <Text style={styles.engineIcon}>{engine.icon}</Text>
                        <View style={styles.engineInfo}>
                          <View style={styles.engineNameRow}>
                            <Text style={[
                              styles.engineName,
                              isDisabled && styles.engineNameDisabled
                            ]}>
                              {engine.name}
                            </Text>
                            {engine.isComingSoon && (
                              <Text style={styles.comingSoonText}>
                                ({texts.vtComingSoon || 'Coming soon'})
                              </Text>
                            )}
                          </View>
                          <View style={styles.engineBadges}>
                            <View style={[styles.statusBadge, { backgroundColor: status.color }]}>
                              <Text style={styles.statusBadgeText}>{status.text}</Text>
                            </View>
                          </View>
                        </View>
                      </View>
                      {isSelected && !isDisabled && (
                        <View style={styles.checkmark}>
                          <Text style={styles.checkmarkText}>✓</Text>
                        </View>
                      )}
                      {isDisabled && (
                        <Text style={styles.lockIcon}>🔒</Text>
                      )}
                    </View>

                    <Text style={[
                      styles.engineDescription,
                      isDisabled && styles.engineDescriptionDisabled
                    ]}>
                      {engine.description}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          )}

          {/* Footer Note */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              💡 OCR.space - {texts.vtOcrSpaceNote || 'Free, 25K requests/month'}
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 20,
    color: '#6B7280',
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    paddingHorizontal: 20,
    paddingVertical: 12,
    lineHeight: 20,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6B7280',
  },
  engineList: {
    paddingHorizontal: 20,
  },
  engineCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  engineCardSelected: {
    backgroundColor: '#ECFDF5',
    borderColor: '#00A651',
  },
  engineCardDisabled: {
    opacity: 0.6,
    backgroundColor: '#F3F4F6',
  },
  engineCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  engineCardTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  engineIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  engineInfo: {
    flex: 1,
  },
  engineNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 6,
  },
  engineName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  engineNameDisabled: {
    color: '#9CA3AF',
  },
  comingSoonText: {
    fontSize: 14,
    color: '#9CA3AF',
    marginLeft: 6,
    fontStyle: 'italic',
  },
  engineBadges: {
    flexDirection: 'row',
    gap: 6,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#00A651',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  lockIcon: {
    fontSize: 20,
  },
  engineDescription: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
  },
  engineDescriptionDisabled: {
    color: '#9CA3AF',
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    marginTop: 8,
  },
  footerText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default OCREngineSelector;
