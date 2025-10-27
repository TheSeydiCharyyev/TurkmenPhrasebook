/**
 * General Assistant Screen
 * General AI assistant for language learning
 */

import React from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../types/navigation';
import ChatScreen from '../components/ChatScreen';
import { AssistantType } from '../types/ai-assistant.types';

type GeneralAssistantScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'GeneralAssistant'
>;

interface Props {
  navigation: GeneralAssistantScreenNavigationProp;
}

const GeneralAssistantScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <ChatScreen
      assistantType={AssistantType.GENERAL_ASSISTANT}
      onBack={() => navigation.goBack()}
    />
  );
};

export default GeneralAssistantScreen;
