// src/screens/LanguageSelectionScreen.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
  Image,
  ScrollView,
} from 'react-native';
import { AppLanguageMode } from '../hooks/useAppLanguage';
import { Colors } from '../constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../components/Screen';

const { width, height } = Dimensions.get('window');

interface Props {
  onLanguageSelect: (language: AppLanguageMode, shouldSave: boolean) => void;
}

export default function LanguageSelectionScreen({ onLanguageSelect }: Props) {
  
  const handleLanguageSelect = (language: AppLanguageMode) => {
    onLanguageSelect(language, false);
    
    const languageName = language === 'tk' ? 'Türkmençe' : '中文';
    const question = language === 'tk' 
      ? `Bu dili esasy edip saklamalymi?\n\n✅ Hawa - mundan soň bu dilde açylar\n❌ Ýok - diňe şu gezek ulanarys`
      : `将此语言保存为默认语言？\n\n✅ 是 - 以后总是使用此语言打开\n❌ 否 - 仅本次使用`;
    
    setTimeout(() => {
      Alert.alert(
        '💾 ' + languageName,
        question,
        [
          { 
            text: language === 'tk' ? '❌ Ýok' : '❌ 否', 
            style: 'cancel',
            onPress: () => showSettingsInfo(language)
          },
          {
            text: language === 'tk' ? '✅ Hawa' : '✅ 是',
            onPress: () => {
              onLanguageSelect(language, true);
              showSettingsInfo(language);
            }
          }
        ]
      );
    }, 500);
  };

  const showSettingsInfo = (language: AppLanguageMode) => {
    const message = language === 'tk'
      ? '⚙️ Dili üýtgetmek üçin Sazlamalara giriň'
      : '⚙️ 可在设置中更改语言';
    
    setTimeout(() => {
      Alert.alert('💡', message, [
        { text: language === 'tk' ? '✅ Düşündim' : '✅ 明白了' }
      ]);
    }, 800);
  };

  return (
    <Screen backgroundColor="#FFFFFF">
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
          {/* ФОТО ВВЕРХУ */}
          <View style={styles.imageContainer}>
            <Image
              source={require('../../assets/language-background.png')}
              style={styles.heroImage}
              resizeMode="contain"
            />
          </View>

          {/* ЗАГОЛОВОК */}
          <View style={styles.header}>
            <Text style={styles.title}>选择语言界面 / Dil interfeýsi saýlaň</Text>
          </View>

          {/* ДВЕ КНОПКИ ВЫБОРА ЯЗЫКА */}
          <View style={styles.buttonsContainer}>
            {/* Туркменский */}
            <TouchableOpacity
              style={styles.languageButton}
              onPress={() => handleLanguageSelect('tk')}
              activeOpacity={0.7}
            >
              <View style={styles.buttonContent}>
                <Text style={styles.flag}>🇹🇲</Text>
                <View style={styles.languageInfo}>
                  <Text style={styles.languageName}>Türkmençe</Text>
                  <Text style={styles.languageDescription}>Туркменский язык</Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color={Colors.primary} />
              </View>
            </TouchableOpacity>

            {/* Китайский */}
            <TouchableOpacity
              style={styles.languageButton}
              onPress={() => handleLanguageSelect('zh')}
              activeOpacity={0.7}
            >
              <View style={styles.buttonContent}>
                <Text style={styles.flag}>🇨🇳</Text>
                <View style={styles.languageInfo}>
                  <Text style={styles.languageName}>中文</Text>
                  <Text style={styles.languageDescription}>Китайский язык</Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color={Colors.primary} />
              </View>
            </TouchableOpacity>
          </View>

          {/* ПОДСКАЗКА ВНИЗУ - ТРИ ЯЗЫКА */}
          <View style={styles.footer}>
            <Ionicons name="information-circle-outline" size={18} color={Colors.textLight} />
            <View style={styles.footerTexts}>
              <Text style={styles.footerText}>您可以随时在设置中更改语言</Text>
              <Text style={styles.footerText}>Dili islendik wagtyň Sazlamalarda üýtgedip bilersiňiz</Text>
              <Text style={styles.footerText}>Вы можете изменить язык в любое время в настройках</Text>
            </View>
          </View>
        </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  
  // ФОТО ВВЕРХУ
  imageContainer: {
    width: width,
    height: height * 0.35, // 35% высоты экрана
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0F9FF',
    marginBottom: 20,
  },
  heroImage: {
    width: width * 0.9,
    height: '100%',
  },

  // ЗАГОЛОВОК
  header: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 50, // Увеличил отступ снизу
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: 'center',
  },

  // КНОПКИ
  buttonsContainer: {
    paddingHorizontal: 24,
    gap: 16,
    marginBottom: 24,
    marginTop: 20, // Добавил отступ сверху
  },
  languageButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  flag: {
    fontSize: 40,
    marginRight: 16,
  },
  languageInfo: {
    flex: 1,
  },
  languageName: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  languageDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
  },

  // ПОДСКАЗКА ВНИЗУ
  footer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 12,
    marginTop: 'auto',
    paddingTop: 20,
  },
  footerTexts: {
    flex: 1,
    gap: 4,
  },
  footerText: {
    fontSize: 12,
    color: Colors.textLight,
    textAlign: 'left',
    lineHeight: 18,
  },
});