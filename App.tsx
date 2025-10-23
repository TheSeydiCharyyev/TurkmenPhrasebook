import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { LanguageProvider, useAppLanguage } from './src/contexts/LanguageContext';
import { OfflineDataProvider } from './src/contexts/OfflineDataContext';
import ErrorBoundary from './src/components/ErrorBoundary';
import TTSWarningModal from './src/components/TTSWarningModal';
import TTSChecker from './src/utils/TTSChecker';

const TTS_WARNING_SHOWN_KEY = 'tts_warning_shown';

function AppContent() {
  const [showTTSWarning, setShowTTSWarning] = useState(false);
  const [ttsRecommendation, setTtsRecommendation] = useState<{
    title: string;
    message: string;
    instructions?: string[];
  } | null>(null);
  const { config } = useAppLanguage();

  useEffect(() => {
    checkTTSAvailability();
  }, [config.mode]);

  const checkTTSAvailability = async () => {
    try {
      // Проверяем, показывали ли уже предупреждение для текущего режима
      const warningShownKey = `${TTS_WARNING_SHOWN_KEY}_${config.mode}`;
      const warningShown = await AsyncStorage.getItem(warningShownKey);

      if (warningShown === 'true') {
        return; // Уже показывали, не показываем снова
      }

      // Получаем рекомендации
      const recommendation = await TTSChecker.getRecommendations(config.mode);

      if (recommendation.showWarning) {
        setTtsRecommendation(recommendation);
        setShowTTSWarning(true);
      }
    } catch (error) {
      console.warn('Ошибка проверки TTS:', error);
    }
  };

  const handleCloseTTSWarning = async () => {
    try {
      // Сохраняем, что показали предупреждение для этого режима
      const warningShownKey = `${TTS_WARNING_SHOWN_KEY}_${config.mode}`;
      await AsyncStorage.setItem(warningShownKey, 'true');
      setShowTTSWarning(false);
    } catch (error) {
      console.warn('Ошибка сохранения состояния предупреждения:', error);
      setShowTTSWarning(false);
    }
  };

  const handleTestVoice = async () => {
    try {
      const language = config.mode === 'tk' ? 'chinese' : 'turkmen';
      await TTSChecker.testVoice(language);
    } catch (error) {
      console.warn('Ошибка тестирования голоса:', error);
    }
  };

  return (
    <>
      <AppNavigator />
      <StatusBar style="auto" />

      {ttsRecommendation && (
        <TTSWarningModal
          visible={showTTSWarning}
          onClose={handleCloseTTSWarning}
          title={ttsRecommendation.title}
          message={ttsRecommendation.message}
          instructions={ttsRecommendation.instructions}
          onTestVoice={handleTestVoice}
          languageMode={config.mode}
        />
      )}
    </>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <LanguageProvider>
          <OfflineDataProvider>
            <AppContent />
          </OfflineDataProvider>
        </LanguageProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}