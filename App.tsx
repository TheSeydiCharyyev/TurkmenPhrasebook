// App.tsx - ОБНОВЛЕНО для мультиязычности (Phase 4)
import React, { useEffect, useCallback, useState } from 'react';
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