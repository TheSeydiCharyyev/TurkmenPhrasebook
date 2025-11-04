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

interface ChatScreenProps {
  assistantType: AssistantType;
  onBack: () => void;
}

const ChatScreen: React.FC<ChatScreenProps> = ({ assistantType, onBack }) => {
  const { config: languageConfig } = useAppLanguage();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const assistantConfig = AIAssistantService.getAssistantConfig(assistantType);

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
      [AssistantType.CONTEXTUAL_TIPS]:
        "Hello! I'm here to provide you with helpful tips and insights for learning Turkmen. Ask me anything!",
      [AssistantType.CONVERSATION_TRAINER]:
        "Hi there! Let's practice some conversations in Turkmen. I'll help you improve your speaking skills!",
      [AssistantType.GRAMMAR_HELPER]:
        "Welcome! I'm your grammar assistant. Ask me about any Turkmen grammar rules or structures.",
      [AssistantType.CULTURAL_ADVISOR]:
        "Salam! Let me help you understand Turkmen culture, customs, and traditions.",
      [AssistantType.GENERAL_ASSISTANT]:
        "Hello! I'm your general learning assistant. Feel free to ask me anything about learning Turkmen!",
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

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: MessageRole.USER,
      content: inputText.trim(),
      timestamp: new Date(),
      assistantType,
    };

    // Add user message
    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
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
      addSystemMessage('Sorry, I encountered an error. Please try again.');
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
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        {/* Header */}
        <LinearGradient
          colors={[assistantConfig.color, adjustColor(assistantConfig.color, -20)]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.header}
        >
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>

          <View style={styles.headerContent}>
            <Text style={styles.headerIcon}>{assistantConfig.icon}</Text>
            <Text style={styles.headerTitle}>{assistantConfig.name}</Text>
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
              <Text style={styles.loadingText}>Thinking...</Text>
            </View>
          )}
        </ScrollView>

        {/* Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type your message..."
            placeholderTextColor="#999"
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
            editable={!isLoading}
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
  // Header with improved gradient and shadows
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 24,
    color: '#FFF',
  },
  headerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerIcon: {
    fontSize: 28,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#FFF',
    letterSpacing: 0.3,
  },
  clearButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearButtonText: {
    fontSize: 22,
  },
  messagesContainer: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  messagesContent: {
    paddingVertical: 20,
    paddingHorizontal: 4,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  loadingText: {
    marginLeft: 12,
    fontSize: 15,
    color: '#6B7280',
    fontStyle: 'italic',
    fontWeight: '500',
  },
  // Modern input container with shadows
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 120,
    backgroundColor: '#F3F4F6',
    borderRadius: 22,
    paddingHorizontal: 18,
    paddingVertical: 12,
    fontSize: 16,
    marginRight: 12,
    color: '#1F2937',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonText: {
    fontSize: 22,
    color: '#FFF',
  },
});

export default ChatScreen;
