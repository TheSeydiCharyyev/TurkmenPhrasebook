// App.tsx - ОБНОВЛЕНО для мультиязычности (Phase 4)
import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import AppNavigator from './src/navigation/AppNavigator';
import { LanguageProvider } from './src/contexts/LanguageContext';
import { ConfigProvider } from './src/contexts/ConfigContext';
import { OfflineDataProvider } from './src/contexts/OfflineDataContext';
import ErrorBoundary from './src/components/ErrorBoundary';

// Предотвращаем автоматическое скрытие splash screen
SplashScreen.preventAutoHideAsync();

function AppContent() {
  return (
    <>
      <AppNavigator />
      <StatusBar style="auto" />
    </>
  );
}

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    // Таймер на 2.5 секунды для показа splash screen
    const timer = setTimeout(async () => {
      await SplashScreen.hideAsync();
      setAppIsReady(true);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  if (!appIsReady) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        {/* ConfigProvider для новой мультиязычной системы */}
        <ConfigProvider>
          <LanguageProvider>
            <OfflineDataProvider>
              <AppContent />
            </OfflineDataProvider>
          </LanguageProvider>
        </ConfigProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}