/**
 * AI Assistant Service
 * Hugging Face API Integration for AI Assistants
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { HUGGINGFACE_API_KEY } from '@env';
import {
  AssistantType,
  ChatMessage,
  ChatHistory,
  ConversationContext,
  AIRequest,
  AIResponse,
  AssistantConfig,
  IAIAssistantService,
  MessageRole,
  STORAGE_KEYS,
} from '../types/ai-assistant.types';

// Hugging Face API Configuration
// Updated to new Inference Providers API (November 2025)
const HUGGINGFACE_API_URL = 'https://router.huggingface.co/hf-inference/models';

// Model Selection (you can use different models for different assistants)
const MODELS = {
  DEFAULT: 'microsoft/DialoGPT-medium', // Good for conversations
  GRAMMAR: 'google/flan-t5-base', // Good for grammar explanations
  TRANSLATION: 'facebook/mbart-large-50-many-to-many-mmt', // For translation context
};

class AIAssistantService implements IAIAssistantService {
  // Assistant Configurations
  private assistantConfigs: Record<AssistantType, AssistantConfig> = {
    [AssistantType.CONTEXTUAL_TIPS]: {
      type: AssistantType.CONTEXTUAL_TIPS,
      name: 'Contextual Tips',
      description: 'Get smart tips based on your current learning context',
      icon: '💡',
      iconName: 'flash-outline',
      color: '#FFA500', // Orange
      systemPrompt: `You are a helpful language learning assistant specializing in Turkmen language.
Provide contextual tips, suggestions, and insights to help users learn more effectively.
Keep responses concise (2-3 sentences) and actionable.`,
      maxHistoryLength: 10,
    },
    [AssistantType.CONVERSATION_TRAINER]: {
      type: AssistantType.CONVERSATION_TRAINER,
      name: 'Conversation Trainer',
      description: 'Practice real conversations and improve your speaking skills',
      icon: '💬',
      iconName: 'chatbubbles-outline',
      color: '#00CED1', // Turquoise
      systemPrompt: `You are a conversation partner helping users practice Turkmen language.
Engage in natural dialogues, correct mistakes gently, and provide encouraging feedback.
Adapt to the user's level and keep the conversation flowing naturally.`,
      maxHistoryLength: 20,
    },
    [AssistantType.GRAMMAR_HELPER]: {
      type: AssistantType.GRAMMAR_HELPER,
      name: 'Grammar Helper',
      description: 'Get instant help with Turkmen grammar rules and structures',
      icon: '📖',
      iconName: 'document-text-outline',
      color: '#9370DB', // Purple
      systemPrompt: `You are a Turkmen grammar expert. Explain grammar rules clearly with examples.
Break down complex concepts into simple explanations.
Provide examples in Turkmen with translations.`,
      maxHistoryLength: 15,
    },
    [AssistantType.CULTURAL_ADVISOR]: {
      type: AssistantType.CULTURAL_ADVISOR,
      name: 'Cultural Advisor',
      description: 'Learn about Turkmen culture, customs, and etiquette',
      icon: '🏛️',
      iconName: 'globe-outline',
      color: '#FF6B6B', // Red
      systemPrompt: `You are a cultural advisor for Turkmen culture.
Share insights about customs, traditions, etiquette, and cultural nuances.
Help users understand the cultural context behind language use.`,
      maxHistoryLength: 15,
    },
    [AssistantType.GENERAL_ASSISTANT]: {
      type: AssistantType.GENERAL_ASSISTANT,
      name: 'General Assistant',
      description: 'Ask anything about learning Turkmen language',
      icon: '🤖',
      iconName: 'robot-outline',
      iconLib: 'MaterialCommunityIcons',
      color: '#4A90E2', // Blue
      systemPrompt: `You are a friendly AI assistant helping users learn Turkmen language.
Answer questions, provide explanations, and offer support.
Be encouraging and helpful with any language-related queries.`,
      maxHistoryLength: 20,
    },
  };

  /**
   * Send a message to the AI assistant
   */
  async sendMessage(
    assistantType: AssistantType,
    message: string,
    context: ConversationContext,
    history?: ChatMessage[]
  ): Promise<AIResponse> {
    try {
      const config = this.getAssistantConfig(assistantType);

      // Build the prompt with context
      const prompt = this.buildPrompt(config, message, context, history);

      // Select model based on assistant type
      const model = this.selectModel(assistantType);

      // Call Hugging Face API
      const response = await this.callHuggingFaceAPI(model, prompt);

      return {
        content: response,
        success: true,
        metadata: {
          model,
          processingTime: Date.now(),
        },
      };
    } catch (error) {
      console.error('AI Assistant Error:', error);

      // Fallback response
      return {
        content: this.getFallbackResponse(assistantType),
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Get chat history for a specific assistant
   */
  async getHistory(assistantType: AssistantType): Promise<ChatHistory[]> {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.CHAT_HISTORY);
      if (!stored) return [];

      const allHistory: ChatHistory[] = JSON.parse(stored);

      // Filter by assistant type
      return allHistory.filter((h) => h.assistantType === assistantType);
    } catch (error) {
      console.error('Error getting history:', error);
      return [];
    }
  }

  /**
   * Save chat history
   */
  async saveHistory(history: ChatHistory): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.CHAT_HISTORY);
      const allHistory: ChatHistory[] = stored ? JSON.parse(stored) : [];

      // Add or update history
      const existingIndex = allHistory.findIndex((h) => h.id === history.id);
      if (existingIndex !== -1) {
        allHistory[existingIndex] = history;
      } else {
        allHistory.push(history);
      }

      // Keep only last 50 conversations per assistant
      const filteredHistory = this.trimHistory(allHistory);

      await AsyncStorage.setItem(
        STORAGE_KEYS.CHAT_HISTORY,
        JSON.stringify(filteredHistory)
      );
    } catch (error) {
      console.error('Error saving history:', error);
    }
  }

  /**
   * Clear history for a specific assistant
   */
  async clearHistory(assistantType: AssistantType): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.CHAT_HISTORY);
      if (!stored) return;

      const allHistory: ChatHistory[] = JSON.parse(stored);

      // Remove history for this assistant
      const filteredHistory = allHistory.filter(
        (h) => h.assistantType !== assistantType
      );

      await AsyncStorage.setItem(
        STORAGE_KEYS.CHAT_HISTORY,
        JSON.stringify(filteredHistory)
      );
    } catch (error) {
      console.error('Error clearing history:', error);
    }
  }

  /**
   * Get assistant configuration
   */
  getAssistantConfig(assistantType: AssistantType): AssistantConfig {
    return this.assistantConfigs[assistantType];
  }

  /**
   * Get all assistant configurations
   */
  getAllAssistantConfigs(): AssistantConfig[] {
    return Object.values(this.assistantConfigs);
  }

  // ===== PRIVATE METHODS =====

  /**
   * Build prompt with context and history
   */
  private buildPrompt(
    config: AssistantConfig,
    message: string,
    context: ConversationContext,
    history?: ChatMessage[]
  ): string {
    let prompt = `${config.systemPrompt}\n\n`;

    // Add context
    prompt += `Context: Learning ${context.language} language`;
    if (context.userLevel) {
      prompt += `, User level: ${context.userLevel}`;
    }
    if (context.topic) {
      prompt += `, Topic: ${context.topic}`;
    }
    prompt += '\n\n';

    // Add conversation history (last 3 messages)
    if (history && history.length > 0) {
      const recentHistory = history.slice(-3);
      prompt += 'Previous conversation:\n';
      recentHistory.forEach((msg) => {
        const role = msg.role === MessageRole.USER ? 'User' : 'Assistant';
        prompt += `${role}: ${msg.content}\n`;
      });
      prompt += '\n';
    }

    // Add current message
    prompt += `User: ${message}\nAssistant:`;

    return prompt;
  }

  /**
   * Select model based on assistant type
   */
  private selectModel(assistantType: AssistantType): string {
    switch (assistantType) {
      case AssistantType.GRAMMAR_HELPER:
        return MODELS.GRAMMAR;
      default:
        return MODELS.DEFAULT;
    }
  }

  /**
   * Call Hugging Face API
   */
  private async callHuggingFaceAPI(
    model: string,
    prompt: string
  ): Promise<string> {
    const url = `${HUGGINGFACE_API_URL}/${model}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${HUGGINGFACE_API_KEY}`,
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_new_tokens: 150,
          temperature: 0.7,
          top_p: 0.9,
          do_sample: true,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Hugging Face API error: ${response.statusText}`);
    }

    const data = await response.json();

    // Extract generated text
    if (Array.isArray(data) && data[0]?.generated_text) {
      // Remove the prompt from response
      const generatedText = data[0].generated_text;
      const responseText = generatedText.replace(prompt, '').trim();
      return responseText || 'I apologize, I could not generate a response.';
    }

    return 'I apologize, I could not generate a response.';
  }

  /**
   * Get fallback response when API fails
   */
  private getFallbackResponse(assistantType: AssistantType): string {
    const fallbacks: Record<AssistantType, string> = {
      [AssistantType.CONTEXTUAL_TIPS]:
        "I'm having trouble connecting right now. Try practicing regularly and reviewing phrases multiple times to improve retention!",
      [AssistantType.CONVERSATION_TRAINER]:
        "I can't connect at the moment, but here's a tip: practice speaking out loud, even when alone. It helps build confidence!",
      [AssistantType.GRAMMAR_HELPER]:
        "I'm offline right now. Remember: Turkmen grammar follows subject-object-verb order. Practice with simple sentences first!",
      [AssistantType.CULTURAL_ADVISOR]:
        "I'm having connection issues. Fun fact: Turkmen people are known for their hospitality. Always greet elders with respect!",
      [AssistantType.GENERAL_ASSISTANT]:
        "I'm having trouble connecting right now. Please try again in a moment. In the meantime, keep practicing!",
    };

    return fallbacks[assistantType];
  }

  /**
   * Trim history to keep storage manageable
   */
  private trimHistory(history: ChatHistory[]): ChatHistory[] {
    const maxPerAssistant = 10;
    const grouped: Record<string, ChatHistory[]> = {};

    // Group by assistant type
    history.forEach((h) => {
      if (!grouped[h.assistantType]) {
        grouped[h.assistantType] = [];
      }
      grouped[h.assistantType].push(h);
    });

    // Keep only latest N per assistant
    const trimmed: ChatHistory[] = [];
    Object.values(grouped).forEach((group) => {
      const sorted = group.sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
      trimmed.push(...sorted.slice(0, maxPerAssistant));
    });

    return trimmed;
  }
}

// Export singleton instance
export default new AIAssistantService();
