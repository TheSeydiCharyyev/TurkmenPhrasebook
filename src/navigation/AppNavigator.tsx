// src/navigation/AppNavigator.tsx - ОБНОВЛЕНО для мультиязычности (Phase 4)

import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

// Импортируем компоненты
import OfflineIndicator from '../components/OfflineIndicator';
import LanguageSelectionScreen from '../screens/LanguageSelectionScreen';

// Импортируем экраны
import HomeScreen from '../screens/HomeScreen';
import CategoryScreen from '../screens/CategoryScreen';
import AdvancedSearchScreen from '../screens/AdvancedSearchScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import SettingsScreen from '../screens/SettingsScreen';
import StatsScreen from '../screens/StatsScreen';
import AdditionalFeaturesScreen from '../screens/AdditionalFeaturesScreen';
import PhraseDetailScreen from '../screens/PhraseDetailScreen';

// Импортируем типы
import { RootStackParamList, MainTabParamList, HomeStackParamList } from '../types';
import { Colors } from '../constants/Colors';
import { useAppLanguage, AppLanguageMode } from '../contexts/LanguageContext';
import { useConfig } from '../contexts/ConfigContext';

const RootStack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();
const HomeStack = createStackNavigator<HomeStackParamList>();
const AdditionalFeaturesStack = createStackNavigator();

// Стек для главной вкладки
function HomeStackNavigator() {
  const { config } = useAppLanguage();

  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      {/* ИСПРАВЛЕНО: отключена стандартная шапка для CategoryScreen */}
      <HomeStack.Screen
        name="CategoryScreen"
        component={CategoryScreen}
        options={{ headerShown: false }}
      />
    </HomeStack.Navigator>
  );
}

// Стек для дополнительных возможностей
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
        component={FavoritesScreen}
        options={{
          title: config.mode === 'tk' ? 'Halanýanlar' :
                 config.mode === 'zh' ? '收藏' : 'Избранное',
          headerStyle: {
            backgroundColor: Colors.primary,
          },
          headerTintColor: Colors.textWhite,
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

// Обновленные вкладки - 3 основные вкладки
function MainTabs() {
  const { getTexts } = useAppLanguage();
  const texts = getTexts();

  return (
    <>
      <OfflineIndicator />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: keyof typeof Ionicons.glyphMap;

            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'AdditionalFeatures') {
              iconName = focused ? 'apps' : 'apps-outline';
            } else if (route.name === 'Settings') {
              iconName = focused ? 'settings' : 'settings-outline';
            } else {
              iconName = 'home-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: Colors.tabActive,
          tabBarInactiveTintColor: Colors.tabInactive,
          tabBarStyle: {
            backgroundColor: Colors.background,
            borderTopColor: Colors.cardBorder,
          },
          headerShown: false,
        })}
        key={texts.home} // Принудительный ререндер при смене языка
      >
        <Tab.Screen 
          name="Home" 
          component={HomeStackNavigator}
          options={{ 
            title: texts.home,
            tabBarLabel: texts.home,
          }}
        />
        <Tab.Screen 
          name="AdditionalFeatures" 
          component={AdditionalFeaturesStackNavigator}
          options={{ 
            title: texts.additionalFeatures,
            tabBarLabel: texts.additionalFeatures,
          }}
        />
        <Tab.Screen 
          name="Settings" 
          component={SettingsScreen}
          options={{ 
            title: texts.settings,
            tabBarLabel: texts.settings,
          }}
        />
      </Tab.Navigator>
    </>
  );
}

// Главный навигатор
export default function AppNavigator() {
  const { getTexts, config } = useAppLanguage();
  const { isLoading: configLoading, isFirstLaunch } = useConfig();
  const texts = getTexts();

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
  // Используем старый метод setLanguageMode для обратной совместимости
  if (isFirstLaunch) {
    return (
      <NavigationContainer>
        <LanguageSelectionScreen />
      </NavigationContainer>
    );
  }

  // Обычная навигация
  return (
    <NavigationContainer>
      <RootStack.Navigator>
        <RootStack.Screen
          name="MainTabs"
          component={MainTabs}
          options={{ headerShown: false }}
        />
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
        {/* Добавляем экран выбора языка в основную навигацию */}
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