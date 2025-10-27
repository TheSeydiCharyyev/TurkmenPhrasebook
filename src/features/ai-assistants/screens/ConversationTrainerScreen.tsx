/**
 * Conversation Trainer Screen
 * AI assistant for conversation practice
 */

import React from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../types/navigation';
import ChatScreen from '../components/ChatScreen';
import { AssistantType } from '../types/ai-assistant.types';

type ConversationTrainerScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'ConversationTrainer'
>;

interface Props {
  navigation: ConversationTrainerScreenNavigationProp;
}

const ConversationTrainerScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <ChatScreen
      assistantType={AssistantType.CONVERSATION_TRAINER}
      onBack={() => navigation.goBack()}
    />
  );
};

export default ConversationTrainerScreen;
