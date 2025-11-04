/**
 * Dictionary Screen - Coming Soon Placeholder
 * Phase 5: Dictionary Placeholder
 * Will be implemented in v2.0
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { scale, verticalScale, moderateScale } from '../utils/ResponsiveUtils';

const STORAGE_KEY = '@dictionary:notification_email';

const DictionaryScreen: React.FC = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleNotifyMe = async () => {
    if (!email.trim()) {
      Alert.alert('Email Required', 'Please enter your email address to get notified.');
      return;
    }

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    try {
      // Save email to AsyncStorage
      await AsyncStorage.setItem(STORAGE_KEY, email);
      setIsSubmitted(true);

      Alert.alert(
        '✅ Success!',
        'Thank you! We\'ll notify you when the Dictionary feature is ready.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Error saving email:', error);
      Alert.alert('Error', 'Failed to save your email. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Dictionary</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Main Content */}
        <View style={styles.mainContent}>
          {/* Icon */}
          <LinearGradient
            colors={['#9CA3AF', '#6B7280']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.iconContainer}
          >
            <Text style={styles.icon}>📖</Text>
          </LinearGradient>

          {/* Coming Soon Badge */}
          <View style={styles.badge}>
            <Text style={styles.badgeText}>COMING SOON</Text>
          </View>

          {/* Title */}
          <Text style={styles.title}>Turkmen-Multilingual Dictionary</Text>

          {/* Description */}
          <Text style={styles.description}>
            We're working hard to bring you a comprehensive dictionary feature with:
          </Text>

          {/* Features List */}
          <View style={styles.featuresList}>
            <FeatureItem icon="✨" text="10,000+ words and definitions" />
            <FeatureItem icon="🔊" text="Audio pronunciations" />
            <FeatureItem icon="📝" text="Example sentences" />
            <FeatureItem icon="🔍" text="Advanced search & filters" />
            <FeatureItem icon="⭐" text="Save favorite words" />
            <FeatureItem icon="📚" text="Word of the day" />
          </View>

          {/* Version Badge */}
          <View style={styles.versionBadge}>
            <Text style={styles.versionText}>Planned for Version 2.0</Text>
          </View>

          {/* Notification Section */}
          {!isSubmitted ? (
            <View style={styles.notificationSection}>
              <Text style={styles.notificationTitle}>Get notified when it's ready!</Text>
              <Text style={styles.notificationSubtitle}>
                Enter your email and we'll let you know when the Dictionary is available.
              </Text>

              <TextInput
                style={styles.emailInput}
                placeholder="your.email@example.com"
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />

              <TouchableOpacity
                style={styles.notifyButton}
                onPress={handleNotifyMe}
              >
                <LinearGradient
                  colors={['#6366F1', '#4F46E5']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.notifyButtonGradient}
                >
                  <Text style={styles.notifyButtonText}>Notify Me 🔔</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.successSection}>
              <Text style={styles.successIcon}>✅</Text>
              <Text style={styles.successText}>You're on the list!</Text>
              <Text style={styles.successSubtext}>
                We'll notify you at {email}
              </Text>
            </View>
          )}

          {/* Back to Home */}
          <TouchableOpacity
            style={styles.backToHomeButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backToHomeText}>← Back to Main Hub</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Feature Item Component
interface FeatureItemProps {
  icon: string;
  text: string;
}

const FeatureItem: React.FC<FeatureItemProps> = ({ icon, text }) => (
  <View style={styles.featureItem}>
    <Text style={styles.featureIcon}>{icon}</Text>
    <Text style={styles.featureText}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  container: {
    flex: 1,
  },
  content: {
    paddingBottom: verticalScale(32),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(16),
  },
  backButton: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(20),
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  backButtonText: {
    fontSize: moderateScale(24),
    color: '#000',
  },
  headerTitle: {
    fontSize: moderateScale(24),
    fontWeight: '700',
    color: '#000',
  },
  placeholder: {
    width: scale(40),
  },
  mainContent: {
    alignItems: 'center',
    paddingHorizontal: scale(24),
    paddingTop: verticalScale(20),
  },
  iconContainer: {
    width: scale(120),
    height: scale(120),
    borderRadius: scale(60),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: verticalScale(24),
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  icon: {
    fontSize: moderateScale(64),
  },
  badge: {
    backgroundColor: '#FEF3C7',
    borderRadius: moderateScale(20),
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(8),
    marginBottom: verticalScale(16),
    borderWidth: 1,
    borderColor: '#FCD34D',
  },
  badgeText: {
    fontSize: moderateScale(12),
    fontWeight: '700',
    color: '#92400E',
    letterSpacing: 1,
  },
  title: {
    fontSize: moderateScale(26),
    fontWeight: '700',
    color: '#000',
    textAlign: 'center',
    marginBottom: verticalScale(12),
  },
  description: {
    fontSize: moderateScale(16),
    color: '#666',
    textAlign: 'center',
    marginBottom: verticalScale(24),
    lineHeight: moderateScale(24),
  },
  featuresList: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: moderateScale(16),
    padding: scale(20),
    marginBottom: verticalScale(24),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(16),
  },
  featureIcon: {
    fontSize: moderateScale(24),
    marginRight: scale(12),
  },
  featureText: {
    fontSize: moderateScale(16),
    color: '#333',
    flex: 1,
  },
  versionBadge: {
    backgroundColor: '#E0E7FF',
    borderRadius: moderateScale(12),
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(10),
    marginBottom: verticalScale(32),
  },
  versionText: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    color: '#4F46E5',
  },
  notificationSection: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: moderateScale(16),
    padding: scale(24),
    marginBottom: verticalScale(24),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  notificationTitle: {
    fontSize: moderateScale(18),
    fontWeight: '700',
    color: '#000',
    textAlign: 'center',
    marginBottom: verticalScale(8),
  },
  notificationSubtitle: {
    fontSize: moderateScale(14),
    color: '#666',
    textAlign: 'center',
    marginBottom: verticalScale(20),
    lineHeight: moderateScale(20),
  },
  emailInput: {
    backgroundColor: '#F5F5F5',
    borderRadius: moderateScale(12),
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(14),
    fontSize: moderateScale(16),
    marginBottom: verticalScale(16),
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  notifyButton: {
    borderRadius: moderateScale(12),
    overflow: 'hidden',
  },
  notifyButtonGradient: {
    paddingVertical: verticalScale(16),
    alignItems: 'center',
  },
  notifyButtonText: {
    fontSize: moderateScale(16),
    fontWeight: '700',
    color: '#FFFFFF',
  },
  successSection: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: moderateScale(16),
    padding: scale(32),
    marginBottom: verticalScale(24),
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  successIcon: {
    fontSize: moderateScale(48),
    marginBottom: verticalScale(12),
  },
  successText: {
    fontSize: moderateScale(20),
    fontWeight: '700',
    color: '#10B981',
    marginBottom: verticalScale(8),
  },
  successSubtext: {
    fontSize: moderateScale(14),
    color: '#666',
    textAlign: 'center',
  },
  backToHomeButton: {
    paddingVertical: verticalScale(12),
  },
  backToHomeText: {
    fontSize: moderateScale(16),
    color: '#6366F1',
    fontWeight: '600',
  },
});

export default DictionaryScreen;
