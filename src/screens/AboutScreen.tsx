// src/screens/AboutScreen.tsx - О приложении

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAppLanguage } from '../contexts/LanguageContext';
import { scale, verticalScale, moderateScale } from '../utils/ResponsiveUtils';
import { useSafeArea } from '../hooks/useSafeArea';

type ModalType = 'authors' | 'series' | null;

export default function AboutScreen() {
  const navigation = useNavigation();
  const { getTexts, config } = useAppLanguage();
  const texts = getTexts();
  const { bottom: safeAreaBottom } = useSafeArea();

  const [activeModal, setActiveModal] = useState<ModalType>(null);

  // Тексты для разных языков
  const aboutTexts = {
    tk: {
      title: 'Programma barada',
      authors: 'Awtorlar barada',
      authorsDesc: 'Kim döretdi',
      series: 'Şapak programmalar toplumy',
      seriesDesc: 'Beýleki programmalar',
      version: 'Wersiýa',
      authorsContent: 'Awtorlar barada maglumat...',
      seriesContent: 'Şapak programmalar toplumy barada...',
    },
    zh: {
      title: '关于应用',
      authors: '关于作者',
      authorsDesc: '谁创建了这个应用',
      series: 'Şapak 应用系列',
      seriesDesc: '其他应用',
      version: '版本',
      authorsContent: '关于作者的信息...',
      seriesContent: '关于Şapak应用系列...',
    },
    ru: {
      title: 'О приложении',
      authors: 'Об авторах',
      authorsDesc: 'Кто создал приложение',
      series: 'Серия приложений Şapak',
      seriesDesc: 'Другие приложения',
      version: 'Версия',
      authorsContent: 'Информация об авторах...',
      seriesContent: 'О серии приложений Şapak...',
    },
    en: {
      title: 'About',
      authors: 'About Authors',
      authorsDesc: 'Who created this app',
      series: 'Şapak App Series',
      seriesDesc: 'Other apps',
      version: 'Version',
      authorsContent: 'Information about authors...',
      seriesContent: 'About Şapak app series...',
    },
  };

  const t = aboutTexts[config.mode as keyof typeof aboutTexts] || aboutTexts.en;

  const renderModal = () => {
    if (!activeModal) return null;

    const isAuthors = activeModal === 'authors';
    const modalTitle = isAuthors ? t.authors : t.series;
    const modalContent = isAuthors ? t.authorsContent : t.seriesContent;

    return (
      <Modal
        visible={!!activeModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setActiveModal(null)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              onPress={() => setActiveModal(null)}
              style={styles.modalCloseButton}
            >
              <Ionicons name="close" size={24} color="#1F2937" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>{modalTitle}</Text>
            <View style={styles.modalPlaceholder} />
          </View>

          <ScrollView
            style={styles.modalContent}
            contentContainerStyle={{ paddingBottom: safeAreaBottom + 20 }}
          >
            <Text style={styles.modalText}>{modalContent}</Text>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.headerBar}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={moderateScale(24)} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerBarTitle}>{t.title}</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: Math.max(safeAreaBottom, verticalScale(20)),
          paddingHorizontal: scale(16),
          paddingTop: verticalScale(16),
        }}
      >
        {/* Logo / App Icon */}
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoText}>Ş</Text>
          </View>
          <Text style={styles.appName}>Şapak - Ykjam Terjime</Text>
          <Text style={styles.versionText}>{t.version} 1.0.0</Text>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {/* About Authors */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => setActiveModal('authors')}
            activeOpacity={0.7}
          >
            <View style={styles.menuLeft}>
              <View style={[styles.iconContainer, { backgroundColor: '#EBF5FF' }]}>
                <Ionicons name="people" size={24} color="#3B82F6" />
              </View>
              <View style={styles.menuText}>
                <Text style={styles.menuTitle}>{t.authors}</Text>
                <Text style={styles.menuSubtitle}>{t.authorsDesc}</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          {/* About Shapak Series */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => setActiveModal('series')}
            activeOpacity={0.7}
          >
            <View style={styles.menuLeft}>
              <View style={[styles.iconContainer, { backgroundColor: '#F0FDF4' }]}>
                <Ionicons name="apps" size={24} color="#00A651" />
              </View>
              <View style={styles.menuText}>
                <Text style={styles.menuTitle}>{t.series}</Text>
                <Text style={styles.menuSubtitle}>{t.seriesDesc}</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2025 Şapak</Text>
        </View>
      </ScrollView>

      {renderModal()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(16),
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerBarTitle: {
    fontSize: moderateScale(18),
    fontWeight: '700',
    color: '#1F2937',
  },
  placeholder: {
    width: scale(40),
  },
  logoContainer: {
    alignItems: 'center',
    paddingVertical: verticalScale(32),
  },
  logoCircle: {
    width: scale(80),
    height: scale(80),
    borderRadius: scale(40),
    backgroundColor: '#00A651',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: verticalScale(16),
  },
  logoText: {
    fontSize: moderateScale(36),
    fontWeight: '700',
    color: '#FFFFFF',
  },
  appName: {
    fontSize: moderateScale(20),
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: verticalScale(4),
  },
  versionText: {
    fontSize: moderateScale(14),
    color: '#6B7280',
  },
  menuContainer: {
    gap: verticalScale(12),
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: scale(12),
    padding: scale(16),
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: scale(48),
    height: scale(48),
    borderRadius: scale(12),
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuText: {
    marginLeft: scale(16),
    flex: 1,
  },
  menuTitle: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: verticalScale(2),
  },
  menuSubtitle: {
    fontSize: moderateScale(14),
    color: '#6B7280',
  },
  footer: {
    alignItems: 'center',
    paddingTop: verticalScale(32),
  },
  footerText: {
    fontSize: moderateScale(14),
    color: '#9CA3AF',
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(16),
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalCloseButton: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: moderateScale(18),
    fontWeight: '700',
    color: '#1F2937',
  },
  modalPlaceholder: {
    width: scale(40),
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(16),
  },
  modalText: {
    fontSize: moderateScale(16),
    lineHeight: moderateScale(24),
    color: '#374151',
  },
});
