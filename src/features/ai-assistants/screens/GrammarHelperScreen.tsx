/**
 * Grammar Helper Screen
 * AI assistant for grammar help
 */

import React from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../types/navigation';
import ChatScreen from '../components/ChatScreen';
import { AssistantType } from '../types/ai-assistant.types';

type GrammarHelperScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'GrammarHelper'
>;

interface Props {
  navigation: GrammarHelperScreenNavigationProp;
}

const GrammarHelperScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <ChatScreen
      assistantType={AssistantType.GRAMMAR_HELPER}
      onBack={() => navigation.goBack()}
    />
  );
};

export default GrammarHelperScreen;
