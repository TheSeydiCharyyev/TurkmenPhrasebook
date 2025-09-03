import React from 'react';
import { StatusBar } from 'expo-status-bar';
import AppNavigator from './src/navigation/AppNavigator';
import { LanguageProvider } from './src/contexts/LanguageContext';
import { OfflineDataProvider } from './src/contexts/OfflineDataContext';
import ErrorBoundary from './src/components/ErrorBoundary';

export default function App() {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <OfflineDataProvider>
          <AppNavigator />
          <StatusBar style="auto" />
        </OfflineDataProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
}