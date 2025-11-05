/**
 * AI Assistants Home Screen
 * Main screen for selecting an AI assistant
 * Design: Hero + Grid (Modern 2025)
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../types/navigation';
import { useAppLanguage } from '../../../contexts/LanguageContext';
import AIAssistantService from '../services/AIAssistantService';
import AssistantCard from '../components/AssistantCard';
import { AssistantType } from '../types/ai-assistant.types';
import { scale, verticalScale, moderateScale } from '../../../utils/ResponsiveUtils';

type AIAssistantsHomeScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'AIAssistantsHome'
>;

interface Props {
  navigation: AIAssistantsHomeScreenNavigationProp;
}

// Helper функции для получения переводов названий и описаний ассистентов
const getTranslatedAssistantName = (type: AssistantType, texts: any): string => {
  const nameMap: Record<AssistantType, string> = {
    [AssistantType.CONTEXTUAL_TIPS]: texts.aiContextualTipsName,
    [AssistantType.CONVERSATION_TRAINER]: texts.aiConversationTrainerName,
    [AssistantType.GRAMMAR_HELPER]: texts.aiGrammarHelperName,
    [AssistantType.CULTURAL_ADVISOR]: texts.aiCulturalAdvisorName,
    [AssistantType.GENERAL_ASSISTANT]: texts.aiGeneralAssistantName,
  };
  return nameMap[type];
};

const getTranslatedAssistantDescription = (type: AssistantType, texts: any): string => {
  const descMap: Record<AssistantType, string> = {
    [AssistantType.CONTEXTUAL_TIPS]: texts.aiContextualTipsDesc,
    [AssistantType.CONVERSATION_TRAINER]: texts.aiConversationTrainerDesc,
    [AssistantType.GRAMMAR_HELPER]: texts.aiGrammarHelperDesc,
    [AssistantType.CULTURAL_ADVISOR]: texts.aiCulturalAdvisorDesc,
    [AssistantType.GENERAL_ASSISTANT]: texts.aiGeneralAssistantDesc,
  };
  return descMap[type];
};

const AIAssistantsHomeScreen: React.FC<Props> = ({ navigation }) => {
  const { getTexts } = useAppLanguage();
  const texts = getTexts();

  // Получаем базовые конфигурации и добавляем переводы
  const assistants = AIAssistantService.getAllAssistantConfigs().map((config) => {
    // Добавляем переведенные name и description на основе типа ассистента
    const translatedName = getTranslatedAssistantName(config.type, texts);
    const translatedDescription = getTranslatedAssistantDescription(config.type, texts);

    return {
      ...config,
      name: translatedName,
      description: translatedDescription,
    };
  });

  const handleAssistantPress = (assistantType: AssistantType) => {
    // Navigate to specific assistant screen
    switch (assistantType) {
      case AssistantType.CONTEXTUAL_TIPS:
        navigation.navigate('ContextualTips');
        break;
      case AssistantType.CONVERSATION_TRAINER:
        navigation.navigate('ConversationTrainer');
        break;
      case AssistantType.GRAMMAR_HELPER:
        navigation.navigate('GrammarHelper');
        break;
      case AssistantType.CULTURAL_ADVISOR:
        navigation.navigate('CulturalAdvisor');
        break;
      case AssistantType.GENERAL_ASSISTANT:
        navigation.navigate('GeneralAssistant');
        break;
    }
  };

  return (
    <View style={styles.safeArea}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#7C3AED"
        translucent={false}
      />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Gradient Header */}
        <LinearGradient
          colors={['#7C3AED', '#5B21B6']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{texts.aiHomeTitle}</Text>
          <View style={styles.placeholder} />
        </LinearGradient>

        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.heroIconContainer}>
            <Ionicons name="sparkles" size={48} color="#7C3AED" />
          </View>
          <Text style={styles.heroTitle}>{texts.aiHomeTitle}</Text>
          <Text style={styles.heroSubtitle}>
            {texts.aiHomeSubtitle}
          </Text>
        </View>

        {/* Assistant Cards */}
        <View style={styles.cardsContainer}>
          {assistants.map((assistant) => (
            <AssistantCard
              key={assistant.type}
              config={assistant}
              onPress={() => handleAssistantPress(assistant.type)}
            />
          ))}
        </View>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={24} color="#6366F1" style={styles.infoIcon} />
          <Text style={styles.infoText}>
            {texts.aiInfoText}
          </Text>
        </View>

        {/* Bottom Padding */}
        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
  },
  content: {
    paddingBottom: verticalScale(32),
  },
  // Gradient Header - RESPONSIVE
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(20),
    elevation: 8,
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: scale(4) },
    shadowOpacity: 0.3,
    shadowRadius: scale(12),
  },
  backButton: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(20),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: {
    fontSize: moderateScale(22),
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  placeholder: {
    width: scale(44),
  },
  // Hero Section - RESPONSIVE
  heroSection: {
    alignItems: 'center',
    paddingHorizontal: scale(24),
    paddingTop: verticalScale(32),
    paddingBottom: verticalScale(24),
  },
  heroIconContainer: {
    width: scale(96),
    height: scale(96),
    borderRadius: scale(48),
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: verticalScale(16),
    elevation: 8,
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: scale(4) },
    shadowOpacity: 0.2,
    shadowRadius: scale(12),
  },
  heroTitle: {
    fontSize: moderateScale(28, 0.3),
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: verticalScale(12),
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: moderateScale(16),
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: moderateScale(24),
    paddingHorizontal: scale(16),
  },
  // Cards Container - RESPONSIVE
  cardsContainer: {
    marginTop: verticalScale(8),
  },
  // Info Card - RESPONSIVE
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#EDE9FE',
    borderRadius: scale(20),
    padding: scale(20),
    marginHorizontal: scale(16),
    marginTop: verticalScale(24),
    elevation: 6,
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: scale(2) },
    shadowOpacity: 0.15,
    shadowRadius: scale(12),
  },
  infoIcon: {
    marginRight: scale(12),
  },
  infoText: {
    flex: 1,
    fontSize: moderateScale(14),
    color: '#5B21B6',
    lineHeight: moderateScale(22),
    fontWeight: '500',
  },
  bottomPadding: {
    height: verticalScale(32),
  },
});

export default AIAssistantsHomeScreen;
