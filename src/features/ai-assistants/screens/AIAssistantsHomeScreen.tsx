/**
 * AI Assistants Home Screen
 * Main screen for selecting an AI assistant
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../types/navigation';
import AIAssistantService from '../services/AIAssistantService';
import AssistantCard from '../components/AssistantCard';
import { AssistantType } from '../types/ai-assistant.types';

type AIAssistantsHomeScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'AIAssistantsHome'
>;

interface Props {
  navigation: AIAssistantsHomeScreenNavigationProp;
}

const AIAssistantsHomeScreen: React.FC<Props> = ({ navigation }) => {
  const assistants = AIAssistantService.getAllAssistantConfigs();

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
          <Text style={styles.title}>AI Assistants</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Subtitle */}
        <Text style={styles.subtitle}>
          Choose an AI assistant to help you learn Turkmen language
        </Text>

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
          <Text style={styles.infoIcon}>ℹ️</Text>
          <Text style={styles.infoText}>
            AI assistants use advanced language models to provide personalized
            help. Responses may take a few seconds.
          </Text>
        </View>

        {/* Bottom Padding */}
        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  container: {
    flex: 1,
  },
  content: {
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
    fontSize: 24,
    color: '#000',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
  },
  placeholder: {
    width: 40,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginHorizontal: 32,
    marginBottom: 24,
    lineHeight: 22,
  },
  cardsContainer: {
    marginTop: 8,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 24,
    borderWidth: 1,
    borderColor: '#2196F3',
  },
  infoIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#1565C0',
    lineHeight: 20,
  },
  bottomPadding: {
    height: 32,
  },
});

export default AIAssistantsHomeScreen;
