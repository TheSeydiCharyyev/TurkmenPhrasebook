/**
 * Base Chat Screen Component
 * Reusable chat interface for all AI assistants
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAppLanguage } from '../../../contexts/LanguageContext';
import AIAssistantService from '../services/AIAssistantService';
import ChatBubble from './ChatBubble';
import {
  AssistantType,
  ChatMessage,
  MessageRole,
  ConversationContext,
} from '../types/ai-assistant.types';
import { DesignColors } from '../../../constants/Design';
import { scale, verticalScale, moderateScale } from '../../../utils/ResponsiveUtils';

interface ChatScreenProps {
  assistantType: AssistantType;
  onBack: () => void;
}

// Helper function to get translated assistant name
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

const ChatScreen: React.FC<ChatScreenProps> = ({ assistantType, onBack }) => {
  const { config: languageConfig, getTexts } = useAppLanguage();
  const texts = getTexts();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const inputRef = useRef<TextInput>(null);

  const assistantConfig = AIAssistantService.getAssistantConfig(assistantType);
  const translatedName = getTranslatedAssistantName(assistantType, texts);

  // Load chat history on mount
  useEffect(() => {
    loadHistory();
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  const loadHistory = async () => {
    try {
      const history = await AIAssistantService.getHistory(assistantType);
      if (history.length > 0) {
        // Load the most recent conversation
        const latest = history[0];
        setMessages(latest.messages);
      } else {
        // Show welcome message
        addSystemMessage(getWelcomeMessage());
      }
    } catch (error) {
      console.error('Error loading history:', error);
      addSystemMessage(getWelcomeMessage());
    }
  };

  const getWelcomeMessage = (): string => {
    const welcomeMessages: Record<AssistantType, string> = {
      [AssistantType.CONTEXTUAL_TIPS]: texts.aiContextualTipsWelcome,
      [AssistantType.CONVERSATION_TRAINER]: texts.aiConversationTrainerWelcome,
      [AssistantType.GRAMMAR_HELPER]: texts.aiGrammarHelperWelcome,
      [AssistantType.CULTURAL_ADVISOR]: texts.aiCulturalAdvisorWelcome,
      [AssistantType.GENERAL_ASSISTANT]: texts.aiGeneralAssistantWelcome,
    };

    return welcomeMessages[assistantType];
  };

  const addSystemMessage = (content: string) => {
    const systemMessage: ChatMessage = {
      id: Date.now().toString(),
      role: MessageRole.SYSTEM,
      content,
      timestamp: new Date(),
      assistantType,
    };
    setMessages((prev) => [...prev, systemMessage]);
  };

  const handleSend = async () => {
    if (!inputText.trim() || isLoading) return;

    // Clear input immediately for better UX
    const messageToSend = inputText.trim();
    setInputText('');

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: MessageRole.USER,
      content: messageToSend,
      timestamp: new Date(),
      assistantType,
    };

    // Add user message
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Prepare context
      const context: ConversationContext = {
        assistantType,
        language: languageConfig.mode,
      };

      // Send to AI
      const response = await AIAssistantService.sendMessage(
        assistantType,
        userMessage.content,
        context,
        messages
      );

      // Add assistant response
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: MessageRole.ASSISTANT,
        content: response.content,
        timestamp: new Date(),
        assistantType,
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Save history
      await AIAssistantService.saveHistory({
        id: Date.now().toString(),
        assistantType,
        messages: [...messages, userMessage, assistantMessage],
        context,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error('Error sending message:', error);
      addSystemMessage(texts.aiErrorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = async () => {
    await AIAssistantService.clearHistory(assistantType);
    setMessages([]);
    addSystemMessage(getWelcomeMessage());
  };

  return (
    <View style={styles.safeArea}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={assistantConfig.color}
        translucent={false}
      />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {/* Header */}
        <LinearGradient
          colors={[assistantConfig.color, adjustColor(assistantConfig.color, -20)]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.header}
        >
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>

          <View style={styles.headerContent}>
            <Text style={styles.headerIcon}>{assistantConfig.icon}</Text>
            <Text style={styles.headerTitle}>{translatedName}</Text>
          </View>

          <TouchableOpacity
            style={styles.clearButton}
            onPress={handleClearHistory}
          >
            <Text style={styles.clearButtonText}>🗑️</Text>
          </TouchableOpacity>
        </LinearGradient>

        {/* Messages */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((message, index) => (
            <ChatBubble
              key={message.id}
              message={message}
              isLastMessage={index === messages.length - 1}
            />
          ))}

          {/* Loading indicator */}
          {isLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={assistantConfig.color} />
              <Text style={styles.loadingText}>{texts.aiThinking}</Text>
            </View>
          )}
        </ScrollView>

        {/* Input */}
        <View style={styles.inputContainer}>
          <TextInput
            ref={inputRef}
            style={styles.input}
            placeholder={texts.aiInputPlaceholder}
            placeholderTextColor="#999"
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
            editable={!isLoading}
            returnKeyType="send"
            blurOnSubmit={false}
          />

          <TouchableOpacity
            style={[
              styles.sendButton,
              { backgroundColor: assistantConfig.color },
              (!inputText.trim() || isLoading) && styles.sendButtonDisabled,
            ]}
            onPress={handleSend}
            disabled={!inputText.trim() || isLoading}
          >
            <Text style={styles.sendButtonText}>➤</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

// Helper function to adjust color brightness
function adjustColor(color: string, amount: number): string {
  const clamp = (num: number) => Math.min(255, Math.max(0, num));
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  const newR = clamp(r + amount);
  const newG = clamp(g + amount);
  const newB = clamp(b + amount);

  return `#${newR.toString(16).padStart(2, '0')}${newG
    .toString(16)
    .padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
  },
  // Header - RESPONSIVE
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(16),
    elevation: 8,
    shadowColor: '#000',
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
  headerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerIcon: {
    fontSize: moderateScale(28),
    marginRight: scale(8),
  },
  headerTitle: {
    fontSize: moderateScale(19),
    fontWeight: '800',
    color: '#FFF',
    letterSpacing: 0.3,
  },
  clearButton: {
    width: scale(44),
    height: scale(44),
    borderRadius: scale(22),
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearButtonText: {
    fontSize: moderateScale(22),
  },
  messagesContainer: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  messagesContent: {
    paddingTop: verticalScale(20),
    paddingBottom: verticalScale(80), // Extra padding to prevent last message from being hidden
    paddingHorizontal: scale(4),
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(20),
    paddingHorizontal: scale(16),
  },
  loadingText: {
    marginLeft: scale(12),
    fontSize: moderateScale(15),
    color: '#6B7280',
    fontStyle: 'italic',
    fontWeight: '500',
  },
  // Input Container - RESPONSIVE
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(16),
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: scale(-2) },
    shadowOpacity: 0.1,
    shadowRadius: scale(12),
  },
  input: {
    flex: 1,
    minHeight: verticalScale(44),
    maxHeight: verticalScale(120),
    backgroundColor: '#F3F4F6',
    borderRadius: scale(22),
    paddingHorizontal: scale(18),
    paddingVertical: verticalScale(12),
    fontSize: moderateScale(16),
    marginRight: scale(12),
    color: '#1F2937',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  sendButton: {
    width: scale(44),
    height: scale(44),
    borderRadius: scale(22),
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: scale(2) },
    shadowOpacity: 0.25,
    shadowRadius: scale(4),
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonText: {
    fontSize: moderateScale(22),
    color: '#FFF',
  },
});

export default ChatScreen;
