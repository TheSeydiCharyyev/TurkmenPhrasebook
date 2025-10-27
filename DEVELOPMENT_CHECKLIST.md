# 📋 DEVELOPMENT CHECKLIST - Turkmen Phrasebook

**Дата создания:** 26 октября 2024
**Версия:** 1.0 (Hub Architecture)

---

## ✅ ЧТО СДЕЛАНО (Completed)

### **1. Core Functionality (Phrasebook)**
- ✅ Базовая структура приложения
- ✅ 305 фраз в 22 категориях
- ✅ Категории и подкатегории
- ✅ Аудио файлы для туркменского (MP3)
- ✅ TTS для других языков
- ✅ Мультиязычность (китайский, русский, английский активны)
- ✅ 30 языков в конфиге (27 coming soon)
- ✅ Система переводов (BasePhrase + LanguageTranslation)
- ✅ Контексты (ConfigContext, LanguageContext)

### **2. Navigation & UI**
- ✅ React Navigation настроен
- ✅ Bottom Tabs навигация (старая - будет заменена на Hub)
- ✅ Экран выбора языка (LanguageSelectionScreen)
- ✅ Главный экран с категориями (HomeScreen)
- ✅ Экран категории (CategoryScreen)
- ✅ Экран детали фразы (PhraseDetailScreen)
- ✅ Минималистичный дизайн

### **3. Features**
- ✅ Поиск фраз (AdvancedSearchScreen)
- ✅ Избранное (FavoritesScreen)
- ✅ Статистика (StatsScreen)
- ✅ История просмотров
- ✅ Настройки (SettingsScreen)
- ✅ Offline индикатор

### **4. Data & Services**
- ✅ Структура данных для мультиязычности
- ✅ AudioService с MP3 и TTS
- ✅ StorageService (AsyncStorage)
- ✅ AnalyticsService (Firebase)
- ✅ Маппинг аудио файлов

### **5. Documentation**
- ✅ Technical_Specification_Full.md (обновлена с Hub-архитектурой)
- ✅ ADD_NEW_LANGUAGE.md (инструкция добавления языков)
- ✅ Удалены устаревшие спецификации

---

## 📝 ЧТО ОСТАЛОСЬ СДЕЛАТЬ (To Do)

### **Phase 1: Main Hub Architecture (🔴 CRITICAL - День 1)**

**Приоритет:** ВЫСОКИЙ
**Описание:** Переход от bottom tabs к Hub-архитектуре

#### Задачи:
- [ ] Создать `src/screens/MainHubScreen.tsx`
  - [ ] Header с выбором языка и настройками
  - [ ] Welcome секция
  - [ ] 6 карточек модулей с градиентами
  - [ ] Обработка locked состояния (Dictionary)

- [ ] Обновить `src/navigation/AppNavigator.tsx`
  - [ ] Убрать BottomTabNavigator
  - [ ] Добавить MainHubScreen как первый экран после Language Selection
  - [ ] Настроить навигацию в каждый модуль

- [ ] Обновить типы навигации `src/types/navigation.ts`
  - [ ] Добавить MainHub в RootStackParamList
  - [ ] Добавить маршруты для новых модулей

- [ ] Протестировать навигацию
  - [ ] Language Selection → Main Hub
  - [ ] Main Hub → Phrasebook → Category → Detail → Back
  - [ ] Main Hub → Settings
  - [ ] Переключение языка

**Файлы для создания:**
- `src/screens/MainHubScreen.tsx`

**Файлы для обновления:**
- `src/navigation/AppNavigator.tsx`
- `src/types/navigation.ts`

---

### **Phase 2: Visual Translator (🟡 HIGH - День 2-3)**

**Приоритет:** ВЫСОКИЙ
**Описание:** Камера + OCR + AI перевод

#### Задачи:
- [ ] Создать структуру папок `src/features/visual-translator/`

- [ ] **Services (Backend)**
  - [ ] `OCRService.ts` - Google ML Kit Text Recognition
    - [ ] recognizeText(imagePath) → OCRResult
    - [ ] hasText(imagePath) → boolean
    - [ ] calculateConfidence()
  - [ ] `TranslationService.ts` - MyMemory + LibreTranslate
    - [ ] translate() с auto-fallback
    - [ ] detectLanguage()
    - [ ] MyMemory API integration
    - [ ] LibreTranslate fallback
  - [ ] `AIService.ts` - Hugging Face
    - [ ] describeImage() - BLIP model
    - [ ] categorizeImage() - CLIP model
    - [ ] imageToBase64()

- [ ] **Screens (Frontend)**
  - [ ] `VisualTranslatorHomeScreen.tsx`
    - [ ] Градиентный hero блок (Индиго → Фиолет)
    - [ ] Кнопка "Take Photo"
    - [ ] Кнопка "Choose from Gallery"
    - [ ] Секция "How it works" (3 шага)
    - [ ] Секция "Features" (4 фичи)
  - [ ] `CameraScreen.tsx`
    - [ ] Expo Camera integration
    - [ ] Permissions запрос (camera, gallery)
    - [ ] Селектор целевого языка
    - [ ] Захват фото
    - [ ] Выбор из галереи
  - [ ] `TranslationResultScreen.tsx`
    - [ ] Thumbnail изображения
    - [ ] Карточка OCR текста
    - [ ] AI badge категории
    - [ ] Карточка перевода (крупный шрифт)
    - [ ] Действия: озвучить, копировать, сохранить, новое фото

- [ ] **Components**
  - [ ] `CameraView.tsx` - wrapper для expo-camera
  - [ ] `ResultCard.tsx` - карточка результата
  - [ ] `LanguageSelector.tsx` - селектор языков

- [ ] **Types**
  - [ ] `visual-translator.types.ts` - все интерфейсы

- [ ] **Dependencies**
  - [ ] Установить `expo-camera`
  - [ ] Установить `expo-image-picker`
  - [ ] Установить `@react-native-ml-kit/text-recognition`

- [ ] **Тестирование**
  - [ ] Проверить OCR на китайском тексте
  - [ ] Проверить OCR на английском тексте
  - [ ] Проверить OCR на русском тексте
  - [ ] Проверить AI описание объектов (без текста)
  - [ ] Проверить fallback LibreTranslate
  - [ ] Проверить permissions на реальном устройстве

**Файлы для создания:**
```
src/features/visual-translator/
├── screens/
│   ├── VisualTranslatorHomeScreen.tsx
│   ├── CameraScreen.tsx
│   └── TranslationResultScreen.tsx
├── services/
│   ├── OCRService.ts
│   ├── TranslationService.ts
│   └── AIService.ts
├── components/
│   ├── CameraView.tsx
│   ├── ResultCard.tsx
│   └── LanguageSelector.tsx
└── types/
    └── visual-translator.types.ts
```

---

### **Phase 3: Text Translator (🟡 HIGH - День 4)**

**Приоритет:** СРЕДНИЙ
**Описание:** Классический текстовый переводчик

#### Задачи:
- [ ] Создать структуру папок `src/features/text-translator/`

- [ ] **Services**
  - [ ] `TextTranslationService.ts`
    - [ ] Использовать существующий TranslationService из Visual Translator
    - [ ] Добавить историю переводов (AsyncStorage)

- [ ] **Screens**
  - [ ] `TextTranslatorScreen.tsx`
    - [ ] Header с back button
    - [ ] From language picker
    - [ ] Input textarea (multiline)
    - [ ] Кнопка "Translate" (центр)
    - [ ] To language picker
    - [ ] Output textarea (read-only)
    - [ ] Действия: озвучить, копировать, сохранить

- [ ] **Components**
  - [ ] `LanguagePicker.tsx` - picker для выбора языка
  - [ ] `TextInput.tsx` - textarea с clear button
  - [ ] `TranslationOutput.tsx` - output с actions

- [ ] **Features**
  - [ ] История переводов (last 50)
  - [ ] TTS для результата
  - [ ] Копирование в буфер
  - [ ] Clear input button

- [ ] **Тестирование**
  - [ ] Перевод English → Turkmen
  - [ ] Перевод Chinese → Turkmen
  - [ ] Перевод Russian → Turkmen
  - [ ] История сохраняется
  - [ ] TTS работает

**Файлы для создания:**
```
src/features/text-translator/
├── screens/
│   └── TextTranslatorScreen.tsx
├── services/
│   └── TextTranslationService.ts (wrapper)
├── components/
│   ├── LanguagePicker.tsx
│   ├── TextInput.tsx
│   └── TranslationOutput.tsx
└── types/
    └── text-translator.types.ts
```

---

### **Phase 4: AI Assistants (🟢 MEDIUM - День 5-6)**

**Приоритет:** СРЕДНИЙ
**Описание:** 5 AI ассистентов для изучения языка

#### Задачи:
- [ ] Создать структуру папок `src/features/ai-assistants/`

- [ ] **Services**
  - [ ] `AIAssistantService.ts` - Hugging Face API wrapper
    - [ ] Chat completion (GPT-2 или аналог)
    - [ ] Context management
    - [ ] История диалогов

- [ ] **Screens**
  - [ ] `AIAssistantsHomeScreen.tsx` - выбор ассистента (5 карточек)
  - [ ] `ContextualTipsScreen.tsx` - контекстные подсказки
  - [ ] `ConversationTrainerScreen.tsx` - разговорный тренер
  - [ ] `GrammarHelperScreen.tsx` - грамматический помощник
  - [ ] `CulturalAdvisorScreen.tsx` - культурный советник
  - [ ] `GeneralAssistantScreen.tsx` - общий помощник (chatbot)

- [ ] **Components**
  - [ ] `ChatBubble.tsx` - сообщение в чате
  - [ ] `AssistantCard.tsx` - карточка ассистента
  - [ ] `FeedbackCard.tsx` - feedback от AI

- [ ] **Features**
  - [ ] История диалогов (AsyncStorage)
  - [ ] Typing indicator
  - [ ] Error handling

- [ ] **Тестирование**
  - [ ] Все 5 ассистентов работают
  - [ ] История сохраняется
  - [ ] API лимиты не превышены

**Файлы для создания:**
```
src/features/ai-assistants/
├── screens/
│   ├── AIAssistantsHomeScreen.tsx
│   ├── ContextualTipsScreen.tsx
│   ├── ConversationTrainerScreen.tsx
│   ├── GrammarHelperScreen.tsx
│   ├── CulturalAdvisorScreen.tsx
│   └── GeneralAssistantScreen.tsx
├── services/
│   └── AIAssistantService.ts
├── components/
│   ├── ChatBubble.tsx
│   ├── AssistantCard.tsx
│   └── FeedbackCard.tsx
└── types/
    └── ai-assistant.types.ts
```

---

### **Phase 5: Dictionary Placeholder (🟢 LOW - День 7)**

**Приоритет:** НИЗКИЙ
**Описание:** Заглушка для словаря v2.0

#### Задачи:
- [ ] Создать `DictionaryScreen.tsx`
  - [ ] Иконка 📖
  - [ ] Текст "Coming Soon"
  - [ ] Описание функционала
  - [ ] Кнопка "Notify me when ready"
  - [ ] Форма email (опционально)

- [ ] Сохранение email уведомлений
  - [ ] AsyncStorage для email

- [ ] Навигация из Main Hub

**Файлы для создания:**
- `src/screens/DictionaryScreen.tsx`

---

### **Phase 6: Favorites Hub (🟡 HIGH - День 7)**

**Приоритет:** ВЫСОКИЙ
**Описание:** Обновить избранное для всех модулей

#### Задачи:
- [ ] Переименовать `FavoritesScreen.tsx` → `FavoritesHubScreen.tsx`
- [ ] Переместить в `src/features/favorites/`
- [ ] Добавить 3 вкладки (Tabs):
  - [ ] **Phrases** - избранные фразы из Phrasebook
  - [ ] **Translations** - переводы из Visual/Text Translator
  - [ ] **Words** - слова из Dictionary (пока пусто)
- [ ] Фильтры и поиск
- [ ] Обновить FavoritesService для всех типов

**Файлы для обновления:**
- `src/screens/FavoritesScreen.tsx` → `src/features/favorites/FavoritesHubScreen.tsx`
- `src/services/FavoritesService.ts`

---

### **Phase 7: Testing (🔴 CRITICAL - День 8-9)**

**Приоритет:** КРИТИЧЕСКИЙ

#### Задачи:
- [ ] **Функциональное тестирование**
  - [ ] Все 6 модулей работают
  - [ ] Навигация между модулями
  - [ ] Переключение языков
  - [ ] Back button работает везде

- [ ] **Android тестирование**
  - [ ] Camera permissions
  - [ ] Gallery permissions
  - [ ] TTS работает
  - [ ] OCR работает
  - [ ] Все экраны корректно отображаются

- [ ] **iOS тестирование**
  - [ ] Те же проверки что и для Android

- [ ] **API тестирование**
  - [ ] MyMemory API лимиты
  - [ ] LibreTranslate fallback
  - [ ] Hugging Face API
  - [ ] Google ML Kit OCR

- [ ] **Offline режим**
  - [ ] Показывается offline индикатор
  - [ ] Graceful degradation
  - [ ] Error messages

- [ ] **Performance**
  - [ ] Нет утечек памяти
  - [ ] Плавные анимации
  - [ ] Быстрая загрузка

---

### **Phase 8: Production Build (🔴 CRITICAL - День 10)**

**Приоритет:** КРИТИЧЕСКИЙ

#### Задачи:
- [ ] **Обновить app.json**
  - [ ] Версия → 1.0.0
  - [ ] Permissions (camera, microphone, storage)
  - [ ] Bundle ID
  - [ ] Название приложения

- [ ] **Иконка и splash screen**
  - [ ] Дизайн иконки (флаг + голубь + камера)
  - [ ] Генерация всех размеров
  - [ ] Splash screen

- [ ] **Зависимости**
  - [ ] Проверить package.json
  - [ ] Удалить неиспользуемые пакеты

- [ ] **Build**
  - [ ] `eas build --platform android --profile preview`
  - [ ] `eas build --platform ios --profile preview`
  - [ ] Протестировать APK/IPA

- [ ] **Store Listing**
  - [ ] Скриншоты (6 экранов)
  - [ ] Описание приложения
  - [ ] Ключевые слова
  - [ ] Privacy policy

- [ ] **Публикация**
  - [ ] Google Play
  - [ ] App Store

---

## 📊 ПРОГРЕСС

### **Общий прогресс:**
- ✅ Завершено: ~85% (Phrasebook + Main Hub + Visual Translator + Text Translator + Favorites Hub готовы)
- 📝 Осталось: ~15% (AI Assistants + Dictionary Placeholder + Testing + Production Build)

### **По модулям:**
| Модуль | Статус | Прогресс |
|--------|--------|----------|
| 📚 Phrasebook | ✅ Готов | 100% |
| 📸 Visual Translator | ✅ Готов | 100% |
| 🌍 Text Translator | ✅ Готов | 100% |
| 🤖 AI Assistants | 📝 В разработке | 0% |
| 📖 Dictionary | 🔒 Заглушка | 0% |
| ⭐ Favorites Hub | ✅ Готов | 100% |
| 🏛️ Main Hub | ✅ Готов | 100% |

---

## 🎯 ПРИОРИТЕТЫ

1. **Критично (🔴):** Main Hub → Testing → Production Build
2. **Высокий (🟡):** Visual Translator → Text Translator → Favorites Hub
3. **Средний (🟢):** AI Assistants
4. **Низкий (⚪):** Dictionary Placeholder

---

## 🚀 СЛЕДУЮЩИЕ ШАГИ

**Сегодня (26 октября):**
1. Создать MainHubScreen
2. Обновить навигацию
3. Протестировать Hub → Phrasebook flow

**Завтра (27 октября):**
1. Начать Visual Translator
2. Реализовать OCRService
3. Реализовать TranslationService

**План на неделю:**
- День 1-2: Main Hub + Visual Translator
- День 3-4: Text Translator
- День 5-6: AI Assistants
- День 7: Favorites Hub + Dictionary
- День 8-9: Тестирование
- День 10: Production Build

---

## 💡 ВАЖНЫЕ ЗАМЕТКИ

1. **API Лимиты:**
   - MyMemory: 10,000 слов/день (бесплатно)
   - Hugging Face: Rate limited (использовать token для увеличения)
   - Google ML Kit: Бесплатно для большинства случаев

2. **Permissions:**
   - Camera: iOS + Android
   - Photo Library: iOS + Android
   - Microphone: для будущего голосового ввода

3. **Offline режим:**
   - Phrasebook работает offline (фразы + MP3)
   - Visual/Text Translator требуют интернет
   - AI Assistants требуют интернет

4. **Цель релиза:** 12 декабря 2025

---

**Последнее обновление:** 27 октября 2024, 18:00
**Обновил:** Claude (AI Assistant)
**Текущая фаза:** Phase 6 завершена, переход к Phase 4 (AI Assistants)

---

## ✅ PHASE 2 ЗАВЕРШЕН (27 октября 2024, 12:00)

**Visual Translator полностью реализован:**
- ✅ OCRService с реальным ML Kit
- ✅ TranslationService с MyMemory API + LibreTranslate fallback
- ✅ AIService с Hugging Face (BLIP + CLIP)
- ✅ VisualTranslatorHomeScreen (камера + галерея)
- ✅ TranslationResultScreen (результаты + действия)
- ✅ Все зависимости установлены
- ✅ TypeScript проверка пройдена
- ✅ Готов к тестированию на устройстве

---

## ✅ PHASE 3 ЗАВЕРШЕН (27 октября 2024, 14:00)

**Text Translator полностью реализован:**
- ✅ TextTranslationService с историей переводов (last 50)
- ✅ Использует TranslationService из Phase 2 (переиспользование кода)
- ✅ TextTranslatorScreen с полным функционалом:
  - Input/Output текстовые поля
  - Выбор языков (Source + Target) через модальные окна
  - Кнопка Swap Languages
  - TTS озвучивание результата
  - Копирование в буфер
  - Clear input кнопка
  - Счетчик символов (5000 max)
- ✅ LanguagePicker компонент с 20 языками + Auto Detect
- ✅ История сохраняется в AsyncStorage
- ✅ Все типы определены
- ✅ Навигация интегрирована (MainHub → TextTranslator)
- ✅ TypeScript проверка пройдена
- ✅ Готов к тестированию

---

## ✅ PHASE 6 ЗАВЕРШЕН (27 октября 2024)

**Favorites Hub полностью реализован:**
- ✅ Создана структура папок `src/features/favorites/`
- ✅ FavoritesService - централизованный сервис для всех типов избранного:
  - Фразы из Phrasebook
  - Переводы из Text/Visual Translator
  - Слова из Dictionary (заготовка для v2.0)
- ✅ Типы для favorites (favorites.types.ts) с полной типизацией
- ✅ FavoritesHubScreen с 3 вкладками:
  - **Phrases** - избранные фразы из Phrasebook
  - **Translations** - переводы из Text/Visual Translator
  - **Words** - заглушка для Dictionary (Coming Soon)
- ✅ Навигация обновлена в AppNavigator
- ✅ TypeScript проверка пройдена
- ✅ Мультиязычность (TK/ZH/RU/EN)
- ✅ Готов к тестированию
