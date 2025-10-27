/**
 * Contextual Tips Screen
 * AI assistant for contextual tips and insights
 */

import React from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../types/navigation';
import ChatScreen from '../components/ChatScreen';
import { AssistantType } from '../types/ai-assistant.types';

type ContextualTipsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'ContextualTips'
>;

interface Props {
  navigation: ContextualTipsScreenNavigationProp;
}

const ContextualTipsScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <ChatScreen
      assistantType={AssistantType.CONTEXTUAL_TIPS}
      onBack={() => navigation.goBack()}
    />
  );
};

export default ContextualTipsScreen;
