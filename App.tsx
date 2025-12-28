// App.tsx - ОБНОВЛЕНО для мультиязычности (Phase 4)
import React, { useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import AppNavigator from './src/navigation/AppNavigator';
import { LanguageProvider } from './src/contexts/LanguageContext';
import { ConfigProvider } from './src/contexts/ConfigContext';
import { OfflineDataProvider } from './src/contexts/OfflineDataContext';
import ErrorBoundary from './src/components/ErrorBoundary';
import CustomSplashScreen from './src/components/CustomSplashScreen';

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
  const [showSplash, setShowSplash] = useState(true);

  const handleImageLoaded = useCallback(async () => {
    // Скрываем нативный splash только когда картинка кастомного загрузилась
    await SplashScreen.hideAsync();
  }, []);

  const handleSplashFinish = useCallback(() => {
    setShowSplash(false);
  }, []);

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <ConfigProvider>
          <LanguageProvider>
            <OfflineDataProvider>
              <View style={styles.container}>
                <AppContent />
                {showSplash && (
                  <CustomSplashScreen
                    onFinish={handleSplashFinish}
                    onImageLoaded={handleImageLoaded}
                  />
                )}
              </View>
            </OfflineDataProvider>
          </LanguageProvider>
        </ConfigProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#5BA3D9',
  },
});
