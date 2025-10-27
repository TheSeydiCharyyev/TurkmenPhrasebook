/**
 * Cultural Advisor Screen
 * AI assistant for cultural insights
 */

import React from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../types/navigation';
import ChatScreen from '../components/ChatScreen';
import { AssistantType } from '../types/ai-assistant.types';

type CulturalAdvisorScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'CulturalAdvisor'
>;

interface Props {
  navigation: CulturalAdvisorScreenNavigationProp;
}

const CulturalAdvisorScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <ChatScreen
      assistantType={AssistantType.CULTURAL_ADVISOR}
      onBack={() => navigation.goBack()}
    />
  );
};

export default CulturalAdvisorScreen;
