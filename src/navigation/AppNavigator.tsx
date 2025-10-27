// src/navigation/AppNavigator.tsx - ОБНОВЛЕНО для Hub-архитектуры (Phase 1)

import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

// Импортируем компоненты
import OfflineIndicator from '../components/OfflineIndicator';
import LanguageSelectionScreen from '../screens/LanguageSelectionScreen';
import MainHubScreen from '../screens/MainHubScreen';

// Импортируем экраны
import HomeScreen from '../screens/HomeScreen';
import CategoryScreen from '../screens/CategoryScreen';
import AdvancedSearchScreen from '../screens/AdvancedSearchScreen';
import FavoritesHubScreen from '../features/favorites/screens/FavoritesHubScreen';
import SettingsScreen from '../screens/SettingsScreen';
import StatsScreen from '../screens/StatsScreen';
import AdditionalFeaturesScreen from '../screens/AdditionalFeaturesScreen';
import PhraseDetailScreen from '../screens/PhraseDetailScreen';

// Visual Translator screens (Phase 2)
import VisualTranslatorHomeScreen from '../features/visual-translator/screens/VisualTranslatorHomeScreen';
import TranslationResultScreen from '../features/visual-translator/screens/TranslationResultScreen';

// Text Translator screens (Phase 3)
import TextTranslatorScreen from '../features/text-translator/screens/TextTranslatorScreen';

// AI Assistants screens (Phase 4)
import AIAssistantsHomeScreen from '../features/ai-assistants/screens/AIAssistantsHomeScreen';
import ContextualTipsScreen from '../features/ai-assistants/screens/ContextualTipsScreen';
import ConversationTrainerScreen from '../features/ai-assistants/screens/ConversationTrainerScreen';
import GrammarHelperScreen from '../features/ai-assistants/screens/GrammarHelperScreen';
import CulturalAdvisorScreen from '../features/ai-assistants/screens/CulturalAdvisorScreen';
import GeneralAssistantScreen from '../features/ai-assistants/screens/GeneralAssistantScreen';

// Dictionary screen (Phase 5)
import DictionaryScreen from '../screens/DictionaryScreen';

// Language Pair Selection screen
import LanguagePairSelectionScreen from '../screens/LanguagePairSelectionScreen';

// Импортируем типы
import { RootStackParamList, HomeStackParamList } from '../types';
import { Colors } from '../constants/Colors';
import { useAppLanguage, AppLanguageMode } from '../contexts/LanguageContext';
import { useConfig } from '../contexts/ConfigContext';

const RootStack = createStackNavigator<RootStackParamList>();
const HomeStack = createStackNavigator<HomeStackParamList>();
const AdditionalFeaturesStack = createStackNavigator();

// Стек для Phrasebook (категории фраз)
function HomeStackNavigator() {
  const { selectedLanguage, isLoading } = useConfig();

  // Show loading while checking config
  if (isLoading) {
    return null;
  }

  // Check if user has selected a language pair
  // Default is 'zh', so if it's anything valid, they've made a choice
  const hasLanguagePair = selectedLanguage && ['zh', 'ru', 'en'].includes(selectedLanguage);

  return (
    <HomeStack.Navigator initialRouteName={hasLanguagePair ? 'HomeScreen' : 'LanguagePairSelection'}>
      <HomeStack.Screen
        name="LanguagePairSelection"
        component={LanguagePairSelectionScreen}
        options={{ headerShown: false }}
      />
      <HomeStack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <HomeStack.Screen
        name="CategoryScreen"
        component={CategoryScreen}
        options={{ headerShown: false }}
      />
    </HomeStack.Navigator>
  );
}

// Стек для дополнительных возможностей (Search, Favorites, Stats)
function AdditionalFeaturesStackNavigator() {
  const { config } = useAppLanguage();

  return (
    <AdditionalFeaturesStack.Navigator>
      <AdditionalFeaturesStack.Screen
        name="AdditionalFeaturesMain"
        component={AdditionalFeaturesScreen}
        options={{ headerShown: false }}
      />
      <AdditionalFeaturesStack.Screen
        name="Search"
        component={AdvancedSearchScreen}
        options={{
          title: config.mode === 'tk' ? 'Gözleg' :
                 config.mode === 'zh' ? '搜索' : 'Поиск',
          headerStyle: {
            backgroundColor: Colors.primary,
          },
          headerTintColor: Colors.textWhite,
        }}
      />
      <AdditionalFeaturesStack.Screen
        name="Favorites"
        component={FavoritesHubScreen}
        options={{
          headerShown: false,
        }}
      />
      <AdditionalFeaturesStack.Screen
        name="Stats"
        component={StatsScreen}
        options={{
          title: config.mode === 'tk' ? 'Statistika' :
                 config.mode === 'zh' ? '统计' : 'Статистика',
          headerStyle: {
            backgroundColor: Colors.primary,
          },
          headerTintColor: Colors.textWhite,
        }}
      />
    </AdditionalFeaturesStack.Navigator>
  );
}

// Главный навигатор
export default function AppNavigator() {
  const { config } = useAppLanguage();
  const { isLoading: configLoading, isFirstLaunch } = useConfig();

  // Показываем лоадер пока загружаются настройки
  if (configLoading) {
    return (
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.primary
      }}>
        <ActivityIndicator size="large" color={Colors.textWhite} />
      </View>
    );
  }

  // Показываем экран выбора языка при первом запуске
  if (isFirstLaunch) {
    return (
      <NavigationContainer>
        <LanguageSelectionScreen />
      </NavigationContainer>
    );
  }

  // Обычная навигация с Hub-архитектурой
  return (
    <NavigationContainer>
      <OfflineIndicator />
      <RootStack.Navigator>
        {/* Main Hub - главный экран после выбора языка */}
        <RootStack.Screen
          name="MainHub"
          component={MainHubScreen}
          options={{ headerShown: false }}
        />

        {/* Phrasebook Stack */}
        <RootStack.Screen
          name="Home"
          component={HomeStackNavigator}
          options={{ headerShown: false }}
        />

        {/* Visual Translator (Phase 2) */}
        <RootStack.Screen
          name="VisualTranslator"
          component={VisualTranslatorHomeScreen}
          options={{ headerShown: false }}
        />
        <RootStack.Screen
          name="TranslationResult"
          component={TranslationResultScreen}
          options={{ headerShown: false }}
        />

        {/* Text Translator (Phase 3) */}
        <RootStack.Screen
          name="TextTranslator"
          component={TextTranslatorScreen}
          options={{ headerShown: false }}
        />

        {/* AI Assistants (Phase 4) */}
        <RootStack.Screen
          name="AIAssistantsHome"
          component={AIAssistantsHomeScreen}
          options={{ headerShown: false }}
        />
        <RootStack.Screen
          name="ContextualTips"
          component={ContextualTipsScreen}
          options={{ headerShown: false }}
        />
        <RootStack.Screen
          name="ConversationTrainer"
          component={ConversationTrainerScreen}
          options={{ headerShown: false }}
        />
        <RootStack.Screen
          name="GrammarHelper"
          component={GrammarHelperScreen}
          options={{ headerShown: false }}
        />
        <RootStack.Screen
          name="CulturalAdvisor"
          component={CulturalAdvisorScreen}
          options={{ headerShown: false }}
        />
        <RootStack.Screen
          name="GeneralAssistant"
          component={GeneralAssistantScreen}
          options={{ headerShown: false }}
        />

        {/* Dictionary (Phase 5 - Coming Soon) */}
        <RootStack.Screen
          name="Dictionary"
          component={DictionaryScreen}
          options={{ headerShown: false }}
        />

        {/* Settings */}
        <RootStack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            title: config.mode === 'tk' ? 'Sazlamalar' :
                   config.mode === 'zh' ? '设置' : 'Настройки',
            headerStyle: {
              backgroundColor: Colors.primary,
            },
            headerTintColor: Colors.textWhite,
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />

        {/* Additional Features (Search, Favorites, Stats) */}
        <RootStack.Screen
          name="AdditionalFeatures"
          component={AdditionalFeaturesStackNavigator}
          options={{ headerShown: false }}
        />

        {/* Phrase Detail */}
        <RootStack.Screen
          name="PhraseDetail"
          component={PhraseDetailScreen}
          options={{
            title: config.mode === 'tk' ? 'Sözlem jikme-jiklikleri' :
                   config.mode === 'zh' ? '短语详情' :
                   'Детали фразы',
            headerStyle: {
              backgroundColor: Colors.primary,
            },
            headerTintColor: Colors.textWhite,
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />

        {/* Language Selection (доступен из Hub) */}
        <RootStack.Screen
          name="LanguageSelection"
          component={LanguageSelectionScreen}
          options={{
            title: 'Select Language',
            headerStyle: {
              backgroundColor: Colors.primary,
            },
            headerTintColor: Colors.textWhite,
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}