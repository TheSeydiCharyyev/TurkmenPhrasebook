// src/screens/LanguageSelectionScreen.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Alert,
} from 'react-native';
import { AppLanguageMode } from '../hooks/useAppLanguage';
import { Colors } from '../constants/Colors';

const { width, height } = Dimensions.get('window');

interface Props {
  onLanguageSelect: (language: AppLanguageMode, shouldSave: boolean) => void;
}

export default function LanguageSelectionScreen({ onLanguageSelect }: Props) {
  
  const handleLanguageSelect = (language: AppLanguageMode) => {
    // Сначала устанавливаем язык без сохранения
    onLanguageSelect(language, false);
    
    // Затем спрашиваем о сохранении
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
        { text: language === 'tk' ? 'Düşündim' : '知道了' }
      ]);
    }, 300);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      
      <View style={styles.content}>
        
        {/* Заголовок */}
        <View style={styles.header}>
          <Text style={styles.welcomeText}>欢迎 • Hoş geldiňiz</Text>
          <Text style={styles.titleText}>选择您的语言 • Diliňizi saýlaň</Text>
          <Text style={styles.subtitleText}>Choose your interface language</Text>
        </View>

        {/* Кнопки выбора языка */}
        <View style={styles.languageButtons}>
          
          {/* Туркменский */}
          <TouchableOpacity
            style={[styles.languageButton, styles.turkmenButton]}
            onPress={() => handleLanguageSelect('tk')}
            activeOpacity={0.8}
          >
            <View style={styles.languageContent}>
              <Text style={styles.flagEmoji}>🇹🇲</Text>
              <View style={styles.languageText}>
                <Text style={styles.primaryLanguage}>Türkmençe</Text>
                <Text style={styles.secondaryLanguage}>Туркменский</Text>
                <Text style={styles.descriptionText}>
                  Hytaý dilini öwren{'\n'}学习中文
                </Text>
              </View>
            </View>
            <View style={styles.arrowContainer}>
              <Text style={styles.arrow}>→</Text>
            </View>
          </TouchableOpacity>

          {/* Разделитель */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>或 • ýa-da</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Китайский */}
          <TouchableOpacity
            style={[styles.languageButton, styles.chineseButton]}
            onPress={() => handleLanguageSelect('zh')}
            activeOpacity={0.8}
          >
            <View style={styles.languageContent}>
              <Text style={styles.flagEmoji}>🇨🇳</Text>
              <View style={styles.languageText}>
                <Text style={styles.primaryLanguage}>中文</Text>
                <Text style={styles.secondaryLanguage}>Китайский</Text>
                <Text style={styles.descriptionText}>
                  学习土库曼语{'\n'}Türkmençe öwren
                </Text>
              </View>
            </View>
            <View style={styles.arrowContainer}>
              <Text style={styles.arrow}>→</Text>
            </View>
          </TouchableOpacity>
          
        </View>

        {/* Нижняя информация */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            🔄 您可以稍后在设置中更改{'\n'}
            Sazlamalarda üýtgedip bilersiňiz{'\n'}
            You can change this later in settings
          </Text>
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 60,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.textWhite,
    marginBottom: 10,
    textAlign: 'center',
  },
  titleText: {
    fontSize: 20,
    color: Colors.textWhite,
    opacity: 0.9,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitleText: {
    fontSize: 16,
    color: Colors.textWhite,
    opacity: 0.7,
    textAlign: 'center',
  },
  languageButtons: {
    marginBottom: 40,
  },
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  turkmenButton: {
    borderLeftWidth: 6,
    borderLeftColor: '#00A651', // Зеленый из флага Туркменистана
  },
  chineseButton: {
    borderLeftWidth: 6,
    borderLeftColor: '#FFD700', // Желтый из флага Китая
  },
  languageContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  flagEmoji: {
    fontSize: 48,
    marginRight: 20,
  },
  languageText: {
    flex: 1,
  },
  primaryLanguage: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  secondaryLanguage: {
    fontSize: 16,
    color: Colors.textLight,
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: Colors.textLight,
    opacity: 0.8,
    lineHeight: 18,
  },
  arrowContainer: {
    width: 40,
    alignItems: 'center',
  },
  arrow: {
    fontSize: 24,
    color: Colors.primary,
    fontWeight: 'bold',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.textWhite,
    opacity: 0.3,
  },
  dividerText: {
    marginHorizontal: 20,
    fontSize: 16,
    color: Colors.textWhite,
    opacity: 0.7,
  },
  footer: {
    alignItems: 'center',
    paddingTop: 20,
  },
  footerText: {
    fontSize: 14,
    color: Colors.textWhite,
    opacity: 0.6,
    textAlign: 'center',
    lineHeight: 20,
  },
});