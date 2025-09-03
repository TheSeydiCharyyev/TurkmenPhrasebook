// src/navigation/AppNavigator.tsx - Обновленная версия с StatsScreen
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
import StatsScreen from '../screens/StatsScreen'; // Новый экран
import PhraseDetailScreen from '../screens/PhraseDetailScreen';

// Импортируем типы
import { RootStackParamList, MainTabParamList, HomeStackParamList } from '../types';
import { Colors } from '../constants/Colors';
import { useAppLanguage, AppLanguageMode } from '../contexts/LanguageContext';

const RootStack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();
const HomeStack = createStackNavigator<HomeStackParamList>();

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
      <HomeStack.Screen
        name="CategoryScreen"
        component={CategoryScreen}
        options={({ route }) => {
          const category = route.params.category;
          const categoryName = config.mode === 'tk' ? category.nameTk :
                              config.mode === 'zh' ? category.nameZh :
                              category.nameRu;
          
          return {
            title: categoryName,
            headerStyle: {
              backgroundColor: category.color,
            },
            headerTintColor: Colors.textWhite,
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          };
        }}
      />
    </HomeStack.Navigator>
  );
}

// Обновленные вкладки с добавлением статистики
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
            } else if (route.name === 'Search') {
              iconName = focused ? 'search' : 'search-outline';
            } else if (route.name === 'Favorites') {
              iconName = focused ? 'heart' : 'heart-outline';
            } else if (route.name === 'Stats') {
              iconName = focused ? 'analytics' : 'analytics-outline';
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
          name="Search" 
          component={AdvancedSearchScreen}
          options={{ 
            title: texts.search,
            tabBarLabel: texts.search,
          }}
        />
        <Tab.Screen 
          name="Favorites" 
          component={FavoritesScreen}
          options={{ 
            title: texts.favorites,
            tabBarLabel: texts.favorites,
          }}
        />
        <Tab.Screen 
          name="Stats" 
          component={StatsScreen}
          options={{ 
            title: 'Статистика',
            tabBarLabel: 'Статистика',
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
  const { isLoading, isFirstLaunch, setLanguageMode, getTexts, config } = useAppLanguage();
  const texts = getTexts();

  // Показываем лоадер пока загружаются настройки
  if (isLoading) {
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
    const handleLanguageSelect = (language: AppLanguageMode, shouldSave: boolean) => {
      setLanguageMode(language, shouldSave);
    };

    return (
      <NavigationContainer>
        <LanguageSelectionScreen onLanguageSelect={handleLanguageSelect} />
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
      </RootStack.Navigator>
    </NavigationContainer>
  );
}