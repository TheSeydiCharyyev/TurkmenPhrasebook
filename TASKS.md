# 📋 TASKS - TurkmenPhrasebook

**Last Updated:** November 4, 2025
**Status:** Phase 1-4 ✅ 100% → Phase 5 ⏳ 74% (Text Translator) → Phase 6 🆕 Voice Translator (NEW!) → Phase 7-8 UI Improvements → Phase 9-10 Testing & Production

---

## 🎯 WHAT'S LEFT TO DO

### **PHASE 1: Исправить начальный экран выбора языка + Onboarding** (✅ 100%)

**✅ Выполнено:**

1. ✅ **Убран прогресс бар** "31/31 languages available"
   - 31 язык = язык интерфейса (правильно)
   - 30 языков = пары разговорника Turkmen-X (правильно)

2. ✅ **Убран устаревший footer** "New languages are added regularly via OTA updates"

3. ✅ **Hero + Grid дизайн для Language Selection Screen:**
   - Градиентный header (Purple gradient)
   - Современный search с белым фоном и тенями
   - Увеличены флаги (48px)
   - Белые карточки с мощными тенями (elevation 4)
   - Скругления 20px
   - Selected карточка: border 3px purple + elevation 8
   - Добавлен поиск языков

4. ✅ **Onboarding Screen с Hero + Grid дизайном:**
   - 5 интерактивных слайдов с градиентами
   - Демо всех функций (Phrasebook, Translator, Dictionary, AI)
   - Обновленный дизайн кнопок:
     - Skip button с border и прозрачным фоном
     - Next button с тенями и border
     - Get Started button с белым фоном и purple текстом
   - AsyncStorage для отслеживания первого запуска

5. ✅ **Исправлена навигация:**
   - Единая навигационная структура в AppNavigator
   - Правильный порядок: LanguageSelection → Onboarding → MainHub
   - Убраны Alert диалоги, прямой переход через navigation.replace()
   - Добавлен setOnboardingCompleted в ConfigContext

**Дизайн стиль:** Hero + Grid (современный 2025) - градиенты, тени, яркие цвета

**Измененные файлы:**
- `src/screens/LanguageSelectionScreen.tsx` (Hero + Grid дизайн)
- `src/screens/OnboardingScreen.tsx` (Hero + Grid дизайн)
- `src/contexts/ConfigContext.tsx` (добавлен setOnboardingCompleted)
- `src/navigation/AppNavigator.tsx` (исправлена логика навигации)
- `babel.config.js` (добавлен reanimated plugin)

**Время:** ~2 часа

---

### **PHASE 2: Изменить UI MainHubScreen** (✅ 100%)

**Задача:** Улучшить дизайн главного экрана с 6 модулями

**Файл:**
- `src/screens/MainHubScreen.tsx`

**✅ Выполнено:**
- ✅ Реализован **Hero + Grid** дизайн
- ✅ Hero Card (Phrasebook) - большая карточка 200px на всю ширину
- ✅ Остальные 5 модулей в Grid 2 колонки
- ✅ Яркие градиенты для каждого модуля
- ✅ Ionicons иконки (56px hero, 40px regular)
- ✅ Белый текст с тенями
- ✅ Мощные тени (elevation 12 hero, elevation 8 regular)
- ✅ Современные скругления (24px hero, 20px regular)

**Дизайн стиль:** Hero + Grid (App Store/Spotify-like) - визуально интересный с акцентом на главную функцию

**Время:** ~30 минут

---

### **PHASE 3: Улучшить дизайн разговорника** (✅ 100%)

**Задача:** Улучшить дизайн разговорника и его категорий

**✅ Выполнено:**

1. ✅ **Современный градиентный дизайн категорий (Hero + Grid вариант 2):**
   - Градиенты вместо однотонных цветов
   - Белый текст с тенями для контраста
   - Увеличенные иконки (80x80) эмодзи
   - Мощные тени (elevation 10, shadow radius 12)
   - Современные скругления (20px)
   - Полупрозрачный фон для иконок

2. ✅ **Добавлены переводы категорий на ВСЕ 31 язык:**
   - Создан файл `category-translations.ts` с 682 переводами (22 категории × 31 язык)
   - Обновлен тип `Category` с полями для всех языков
   - Создана helper функция `createCategory()` для автоматического добавления переводов
   - Обновлены все helper функции для динамического доступа к переводам

3. ✅ **Исправлена проблема с языковыми парами:**
   - Теперь отображаются только 2 названия (языковая пара)
   - Для языков без перевода используется английский fallback
   - Работает корректно для всех 31 языков (tk, zh, ru, en, ja, ko, th, vi, id, ms, hi, ur, fa, ps, de, fr, es, it, tr, pl, uk, hy, ka, ar, uz, kk, az, ky, tg, pt, nl)

4. ✅ **Эмодзи иконки для категорий и подкатегорий:**
   - Заменены PNG иконки на эмодзи для 22 основных категорий (👋 🚨 🏨 🍽️ 🛍️ 🚗 💊 💰 и т.д.)
   - Заменены Ionicons на эмодзи для 50+ подкатегорий (📝 🍴 🍜 ✈️ 🚂 📸 🎭 и т.д.)
   - Единый современный стиль
   - Меньше размер приложения

5. ✅ **Анимация скрытия/показа header при скролле:**
   - Header плавно скрывается при скролле вниз (HomeScreen)
   - Header плавно появляется при скролле вверх
   - Плавная анимация 250ms с useNativeDriver
   - Порог срабатывания: 10px

6. ✅ **Улучшен дизайн экрана с фразами (CategoryScreen):**
   - Применен Hero + Grid дизайн
   - Градиентный header вместо однотонного
   - Modern Vibrant цветовая схема (Blue #2563EB для перевода, Green #16A34A для туркменского)
   - Увеличенная типографика (fontSize 26 для primary, 20 для secondary)
   - Мощные тени для карточек (elevation 8, shadowRadius 12)
   - Современные скругления (borderRadius 20px)
   - Флаги эмодзи на аудио кнопках (🇨🇳, 🇷🇺, 🇹🇲 и т.д.)
   - Улучшенная визуальная иерархия (основной язык крупнее)

7. ✅ **Улучшен дизайн детального экрана фразы (PhraseDetailScreen):**
   - Применен Hero + Grid дизайн
   - Исправлен показ текущего выбранного языка (вместо хардкода китайского)
   - Упрощен до показа только языковой пары (выбранный язык + туркменский)
   - Крупная типографика (fontSize 54 для primary, 32 для secondary)
   - Modern Vibrant цвета (синий/зеленый)
   - Увеличено расстояние между аудио кнопками (gap: 16)
   - Мощные тени для карточек

8. ✅ **Редизайн CategoryCard (карточки категорий):**
   - Убраны 22 разных градиента → единый белый минималистичный дизайн (Apple/Notion style)
   - Убран icon "plate" (белый круг вокруг эмодзи)
   - Исправлена проблема с разной высотой карточек при смене языка
   - Строгая фиксированная высота 260px для всех карточек
   - Добавлена поддержка RTL для арабских языков (ar, fa, ur, ps)
   - Визуальная иерархия: primary (fontSize 19, fontWeight 800), secondary (fontSize 13, fontWeight 500)
   - numberOfLines для обрезки длинных названий (primary: 3, secondary: 2)

9. ✅ **Исправлен аудио функционал:**
   - Расширена поддержка с 3 языков на все 31 язык
   - Добавлены TTS коды для всех языков (zh-CN, ru-RU, ja-JP, ko-KR, th-TH и т.д.)
   - Гибридная система: MP3 для туркменского, TTS для остальных 30 языков
   - Добавлены индикаторы загрузки/воспроизведения (ActivityIndicator + pause иконка)
   - Modern Vibrant цвета для кнопок (Blue #3B82F6, Green #22C55E)

10. ✅ **Добавлена система установки TTS для Samsung и других телефонов:**
    - Определение отсутствующих TTS голосов для языков
    - Alert с инструкциями по установке (Android/iOS специфичные)
    - Кнопка прямого перехода в настройки TTS устройства
    - Человекочитаемые названия языков для всех 31 языков

**Измененные файлы:**
- `src/types/index.ts` - обновлены типы Category и SubCategory
- `src/data/category-translations.ts` - новый файл с переводами
- `src/data/categories.ts` - эмодзи иконки категорий и подкатегорий
- `src/components/CategoryCard.tsx` - белый минимализм + фиксированная высота + RTL
- `src/components/SubCategoryCard.tsx` - эмодзи иконки + динамические переводы
- `src/components/AudioPlayer.tsx` - Modern Vibrant цвета + индикаторы
- `src/screens/HomeScreen.tsx` - анимация header + динамические переводы + фиксированная высота cardWrapper
- `src/screens/CategoryScreen.tsx` - Hero + Grid дизайн + флаги + индикаторы
- `src/screens/PhraseDetailScreen.tsx` - Hero + Grid дизайн + исправлен язык + Modern Vibrant
- `src/hooks/useAudio.ts` - 31 язык + TTS коды + система установки TTS

**Дизайн стиль:**
- Hero + Grid (современный 2025) - градиенты, мощные тени, анимации
- Modern Vibrant - Blue (#3B82F6) и Green (#22C55E) для универсального дизайна
- White Minimalism (Apple/Notion) - для категорий

**Время:** ~8 часов (полностью выполнено)

---

### **PHASE 4: Поработать с Visual Translator** (✅ 100%)

**Задача:** Добавить мультиязычность для Visual Translator (все UI тексты должны быть на выбранном языке)

**Файлы:**
- `src/contexts/LanguageContext.tsx` - добавление переводов
- `src/features/visual-translator/screens/VisualTranslatorHomeScreen.tsx` - использование getTexts()
- `src/features/visual-translator/screens/TranslationResultScreen.tsx` - использование getTexts()

**✅ Выполнено:**

1. ✅ **Добавлены поля для Visual Translator в InterfaceTexts:**
   - 32 новых поля для всех UI текстов Visual Translator
   - vtTranslateWithAI, vtCameraSubtitle, vtTakePhoto, vtChooseGallery
   - vtProcessing, vtOcrEngine, vtFeatures, vtResult, vtTranslation и др.

2. ✅ **Добавлены переводы для ВСЕХ 31 языков:**
   - ✅ tk, zh, ru, en, tr, de, fr, es, it, pt, nl, pl (первые 12)
   - ✅ uk, ja, ko, th, vi, id, ms, hi, ur, fa, ps (следующие 11)
   - ✅ uz, kk, az, ky, tg, hy, ka, ar (последние 8)

3. ✅ **Обновлен VisualTranslatorHomeScreen.tsx:**
   - Добавлен импорт `useAppLanguage` и `getTexts()`
   - Все захардкоженные тексты заменены на `texts.vtXXX`
   - Header, Hero section, кнопки, Features, Permissions - все используют переводы

4. ✅ **Обновлен TranslationResultScreen.tsx:**
   - Добавлен импорт `useAppLanguage` и `getTexts()`
   - Все UI тексты заменены на `texts.vtXXX`
   - Alert сообщения (vtCopied, vtCopiedMessage) используют переводы
   - Кнопки Play/Stop, Copy, Translate Another - все переведены

**Измененные файлы:**
- `src/contexts/LanguageContext.tsx` - добавлены 32 поля + переводы для всех 31 языков
- `src/features/visual-translator/screens/VisualTranslatorHomeScreen.tsx` - использует getTexts()
- `src/features/visual-translator/screens/TranslationResultScreen.tsx` - использует getTexts()

**Время:** ~5-6 часов (полностью выполнено)

---

### **PHASE 5: Поработать с онлайн переводчиком** (⏳ 74%)

**Задача:** Улучшить дизайн и функционал текстового переводчика

**Файлы:**
- `src/features/text-translator/screens/TextTranslatorScreen.tsx`
- `src/contexts/LanguageContext.tsx`

**✅ Выполнено:**

1. ✅ **Полный редизайн в стиле Hero + Grid (как Visual Translator):**
   - Градиентный header (Blue #4facfe → #00f2fe)
   - Hero секция с эмодзи 🌍 и описанием "Instant Translation"
   - Все Ionicons заменены на эмодзи (⬅️, ▼, ✖️, 🔄, 🌐, 🔊, ⏹️, 📋, 📄)
   - Градиентная кнопка Translate
   - Мощные тени для карточек (elevation 6-8, shadowRadius 12)
   - Увеличенные скругления (borderRadius 20px)
   - Современная blue цветовая схема (#4facfe)
   - Увеличенная swap кнопка (56x56px)
   - Output card с цветными тенями
   - Улучшенная типографика (fontSize 26 для hero title)

2. ✅ **Добавлена мультиязычность для 23 из 31 языков:**
   - ✅ Добавлены 21 поле для Text Translator в InterfaceTexts
   - ✅ ttHeaderTitle, ttHeroTitle, ttHeroSubtitle, ttPlaceholder, ttTranslate и др.
   - ✅ Переводы добавлены для 23 языков:
     - ✅ tk, zh, ru, en (первые 4)
     - ✅ uk, ja, ko, th, vi, id, ms, hi, ur, fa, ps (еще 11)
     - ✅ uz, kk, az, ky, tg, hy, ka, ar (еще 8)
   - ✅ Обновлен TextTranslatorScreen.tsx:
     - Добавлен импорт `useAppLanguage` и `getTexts()`
     - Все захардкоженные тексты заменены на `texts.ttXXX`
     - Alert сообщения (errors, copy, info) используют переводы
     - UI тексты (header, hero, buttons, placeholders) переведены

**⏳ Осталось сделать:**

3. ⏳ **Добавить переводы для оставшихся 8 европейских языков:**
   - tr (Турецкий), de (Немецкий), fr (Французский), es (Испанский)
   - it (Итальянский), pt (Португальский), nl (Голландский), pl (Польский)
   - **Оценка времени:** 1 час

**Измененные файлы:**
- `src/features/text-translator/screens/TextTranslatorScreen.tsx` - полный редизайн + мультиязычность
- `src/contexts/LanguageContext.tsx` - добавлены 21 поле + переводы для 23 языков

**Время:** ~5 часов (выполнено) + ~1 час (осталось на 8 европейских языков)

---

### **PHASE 6: Интеграция онлайн голосового переводчика** (⏳ 0%)

**Задача:** Добавить новый модуль - Voice Translator (голосовой переводчик)

**Файлы:**
- `src/features/voice-translator/screens/VoiceTranslatorScreen.tsx` (новый)
- `src/navigation/AppNavigator.tsx` (добавить роут)
- `src/screens/MainHubScreen.tsx` (обновить, если нужно)

**Что нужно сделать:**

#### 6.1 Создание UI
- [ ] Создать VoiceTranslatorScreen с Hero + Grid дизайном
- [ ] Градиентный header (например, Orange/Red gradient)
- [ ] Hero секция с эмодзи 🎤 и описанием "Speak & Translate"
- [ ] Кнопка для записи голоса (большая круглая кнопка)
- [ ] Карточка для отображения распознанного текста
- [ ] Карточка для отображения переведенного текста
- [ ] Кнопки воспроизведения аудио (для обоих языков)
- [ ] Селекторы языков (откуда → куда)
- [ ] Кнопка копирования текста

#### 6.2 Функционал
- [ ] Интеграция expo-speech для распознавания речи (Speech-to-Text)
- [ ] Использование существующего API для перевода текста
- [ ] Интеграция expo-speech для озвучивания перевода (Text-to-Speech)
- [ ] Поддержка всех 31 языков
- [ ] Индикаторы состояния (запись, обработка, воспроизведение)
- [ ] Обработка ошибок (нет микрофона, нет интернета и т.д.)

#### 6.3 Мультиязычность
- [ ] Добавить поля для Voice Translator в InterfaceTexts (LanguageContext.tsx)
- [ ] Добавить переводы UI для всех 31 языков:
  - vt_header_title, vt_hero_title, vt_hero_subtitle
  - vt_tap_to_speak, vt_listening, vt_processing
  - vt_recognized_text, vt_translated_text
  - vt_play_original, vt_play_translation
  - vt_copy_translation, vt_clear
  - vt_error_no_mic, vt_error_no_internet, vt_error_recognition_failed
  - и другие необходимые тексты

#### 6.4 Дизайн стиль
- [ ] Hero + Grid дизайн (как Visual Translator и Text Translator)
- [ ] Градиенты, мощные тени, современные скругления
- [ ] Эмодзи иконки вместо Ionicons
- [ ] Анимация при записи голоса (пульсация кнопки)
- [ ] Визуальный индикатор громкости при записи

**API/Библиотеки:**
- expo-av или expo-speech (Speech-to-Text)
- Существующий translation API (для перевода текста)
- expo-speech (Text-to-Speech) - уже используется в приложении

**Оценка времени:** 6-8 часов (UI + функционал + мультиязычность)

---

### **PHASE 7: Поработать со словарем** (⏳ 0%)

**Задача:** Найти и интегрировать бесплатный туркменский словарь

**Файлы:**
- `src/screens/DictionaryScreen.tsx`

**Что нужно сделать:**

#### 7.1 Поиск словаря
- [ ] Скачать Peace Corps Turkmenistan Dictionary (PDF)
  - Туркменский ↔ Английский
  - Бесплатно для образовательных целей
- [ ] Проверить другие источники:
  - Glosbe.com (онлайн база)
  - Мобильные приложения (18,000 - 100,000+ слов)
- [ ] Проверить лицензии на использование

#### 7.2 Подготовка данных
- [ ] Конвертировать PDF в текст
- [ ] Создать структуру базы данных (JSON/SQLite)
- [ ] Добавить транскрипции (если есть)
- [ ] Добавить примеры использования (опционально)

#### 7.3 Интеграция в приложение
- [ ] Создать базу данных словаря
- [ ] Реализовать поиск по словарю
- [ ] Добавить фильтры (Turkmen→English, English→Turkmen)
- [ ] Добавить избранное для слов
- [ ] Обновить дизайн DictionaryScreen

**Источники:**
- Peace Corps Turkmenistan Dictionary (PDF) - приоритет
- Glosbe: https://glosbe.com/en/tk
- Другие мобильные приложения (для сравнения)

**Оценка времени:** 4-6 часов (поиск + интеграция)

---

### **PHASE 8: Поработать с ИИ** (⏳ 0%)

**Задача:** Улучшить дизайн и добавить мультиязычность для AI ассистентов

**Файлы:**
- `src/features/ai-assistants/screens/AIAssistantsHomeScreen.tsx`
- `src/features/ai-assistants/components/ChatScreen.tsx`
- `src/features/ai-assistants/components/AssistantCard.tsx`
- `src/features/ai-assistants/services/AIAssistantService.ts`
- `src/contexts/LanguageContext.tsx`
- AI ассистенты экраны (5 штук: ContextualTips, ConversationTrainer, GrammarHelper, CulturalAdvisor, GeneralAssistant)

**Текущие проблемы:**

1. ❌ **Дизайн устаревший:**
   - AIAssistantsHomeScreen не использует Hero + Grid дизайн
   - ChatScreen использует LinearGradient, но дизайн простой
   - Нет современных теней, скруглений как в других модулях

2. ❌ **Мультиязычность отсутствует:**
   - Все тексты захардкожены на английском
   - AIAssistantsHomeScreen: "AI Assistants", "Choose an AI assistant..."
   - ChatScreen: "Type your message...", "Thinking...", "Sorry, I encountered an error..."
   - Welcome messages для всех 5 ассистентов (на английском)
   - config.name и config.description для всех 5 ассистентов (на английском)
   - Нет переводов на 31 язык

**Что нужно сделать:**

#### 8.1 Редизайн AIAssistantsHomeScreen (Hero + Grid)
- [ ] Градиентный header (например, Purple/Blue gradient)
- [ ] Hero секция с эмодзи 🤖 и описанием "AI Language Assistants"
- [ ] Обновить AssistantCard дизайн (более современные тени, скругления)
- [ ] Мощные тени для карточек (elevation 8, shadowRadius 12)
- [ ] Увеличенные скругления (borderRadius 20px)
- [ ] Обновить Info Card дизайн

#### 8.2 Редизайн ChatScreen (Hero + Grid стиль)
- [ ] Улучшить gradient header
- [ ] Современные стили для message bubbles
- [ ] Обновить input container (белый фон, тени, скругления)
- [ ] Улучшить loading indicator
- [ ] Добавить больше визуальной иерархии

#### 8.3 Добавить мультиязычность (31 язык)

**8.3.1 Добавить поля в InterfaceTexts (LanguageContext.tsx):**

```typescript
// AI Assistants Home Screen
aiHomeTitle: string;
aiHomeSubtitle: string;
aiInfoText: string;

// AI Assistant Names (5 штук)
aiContextualTipsName: string;
aiConversationTrainerName: string;
aiGrammarHelperName: string;
aiCulturalAdvisorName: string;
aiGeneralAssistantName: string;

// AI Assistant Descriptions (5 штук)
aiContextualTipsDesc: string;
aiConversationTrainerDesc: string;
aiGrammarHelperDesc: string;
aiCulturalAdvisorDesc: string;
aiGeneralAssistantDesc: string;

// Welcome Messages (5 штук)
aiContextualTipsWelcome: string;
aiConversationTrainerWelcome: string;
aiGrammarHelperWelcome: string;
aiCulturalAdvisorWelcome: string;
aiGeneralAssistantWelcome: string;

// ChatScreen UI
aiInputPlaceholder: string;
aiThinking: string;
aiErrorMessage: string;
aiClearHistory: string;
```

**Итого:** ~25-30 полей для AI Assistants

- [ ] Добавить переводы для всех 31 языков:
  - tk, zh, ru, en (первые 4)
  - tr, de, fr, es, it, pt, nl, pl (европейские 8)
  - uk, ja, ko, th, vi, id, ms (азиатские 7)
  - hi, ur, fa, ps, ar (южноазиатские/арабские 5)
  - uz, kk, az, ky, tg, hy, ka (центральноазиатские/кавказские 7)

#### 8.4 Интеграция переводов в код
- [ ] Обновить AIAssistantsHomeScreen.tsx (использовать getTexts())
- [ ] Обновить ChatScreen.tsx (использовать getTexts() для UI текстов)
- [ ] Обновить AIAssistantService.ts (получать name/description из переводов)
- [ ] Обновить welcome messages (динамические на основе языка)

**Измененные файлы:**
- `src/contexts/LanguageContext.tsx` - добавлены ~25-30 полей + переводы для 31 языков
- `src/features/ai-assistants/screens/AIAssistantsHomeScreen.tsx` - Hero + Grid дизайн + мультиязычность
- `src/features/ai-assistants/components/ChatScreen.tsx` - улучшенный дизайн + мультиязычность
- `src/features/ai-assistants/components/AssistantCard.tsx` - обновленный дизайн
- `src/features/ai-assistants/services/AIAssistantService.ts` - использование переводов для config

**Дизайн стиль:**
- Hero + Grid (современный 2025) - градиенты, мощные тени, яркие цвета
- Соответствие дизайну Visual Translator и Text Translator

**Оценка времени:** 6-8 часов (дизайн ~2-3 часа + мультиязычность ~4-5 часов)

---

### **PHASE 9: Testing** (⏳ 90% Complete)

#### 1. ✅ Hugging Face API Testing
- [x] API key configured in .env file (stored securely)
- [ ] **Test AI Assistants (5 assistants)**
  - [ ] Contextual Tips - send test message
  - [ ] Conversation Trainer - send test message
  - [ ] Grammar Helper - send test message
  - [ ] Cultural Advisor - send test message
  - [ ] General Assistant - send test message
- [ ] **Test Visual Translator AI features**
  - [ ] Take photo without text → should get AI description
  - [ ] Verify BLIP model works for image captioning
  - [ ] Verify CLIP model works for object detection

**How to Test:**
```bash
# Run the app
npm start
# or
npx expo start

# Navigate to AI Assistants
# Send a message like: "How do I say hello in Turkmen?"
# Should receive AI response (not fallback message)
```

---

#### 2. ⏳ iOS Testing
- [ ] Install on iOS device/simulator
- [ ] Test all 6 modules
- [ ] Test camera permissions (Visual Translator)
- [ ] Test gallery permissions
- [ ] Test TTS (Text-to-Speech)
- [ ] Test OCR (Text Recognition)
- [ ] Test navigation (back button)
- [ ] Test switching languages

**Estimated Time:** 2-3 hours

---

### **PHASE 10: Production Build** (⏳ 0% Complete)

#### 1. ⏳ Update Configuration Files

**app.json:**
- [ ] Update version to `1.0.0`
- [ ] Update app name (verify translations)
- [ ] Set bundle identifier (Android: `com.turkmen.phrasebook`, iOS: `com.turkmen.phrasebook`)
- [ ] Configure permissions:
  - [ ] Camera permission
  - [ ] Photo library permission
  - [ ] Microphone permission (future use)
- [ ] Configure orientation (portrait only?)
- [ ] Configure status bar style

**package.json:**
- [ ] Verify version is `1.0.0`
- [ ] Remove unused dependencies (if any)
- [ ] Verify all dependencies are production-ready

---

#### 2. ⏳ App Icon & Splash Screen

**Design Requirements:**
- Icon: 1024x1024 PNG (iOS), adaptive icon (Android)
- Splash screen: 1242x2436 PNG
- Design elements: Turkmen flag colors + dove + camera/book

**Tasks:**
- [ ] Design app icon
- [ ] Generate all icon sizes with `npx expo-icon`
- [ ] Design splash screen
- [ ] Configure splash screen in app.json
- [ ] Test on Android
- [ ] Test on iOS

**Estimated Time:** 2-4 hours (design + implementation)

---

#### 3. ⏳ Build & Test

**Android Build:**
```bash
# Preview build (for testing)
eas build --platform android --profile preview

# Production build
eas build --platform android --profile production
```

**Tasks:**
- [ ] Configure EAS Build (eas.json)
- [ ] Run Android preview build
- [ ] Test APK on real device
- [ ] Fix any build errors
- [ ] Run production build
- [ ] Test production APK

**iOS Build:**
```bash
# Preview build
eas build --platform ios --profile preview

# Production build
eas build --platform ios --profile production
```

**Tasks:**
- [ ] Configure iOS certificates
- [ ] Run iOS preview build
- [ ] Test on real iOS device
- [ ] Fix any build errors
- [ ] Run production build
- [ ] Test production IPA

**Estimated Time:** 4-6 hours (including troubleshooting)

---

#### 4. ⏳ Store Preparation

**Google Play Store:**
- [ ] Create developer account (if not exists)
- [ ] Prepare screenshots (6 screens minimum):
  - Main Hub
  - Phrasebook (category view)
  - Phrase Detail (with audio)
  - Visual Translator (camera + result)
  - Text Translator
  - AI Assistants
- [ ] Write app description (English + other languages)
- [ ] Prepare feature graphic (1024x500)
- [ ] Write privacy policy
- [ ] Fill out store listing
- [ ] Set pricing (free)
- [ ] Configure in-app purchases (if any)

**App Store (iOS):**
- [ ] Create Apple Developer account (if not exists)
- [ ] Prepare screenshots (6.5" and 5.5" displays)
- [ ] Write app description
- [ ] Prepare app preview video (optional)
- [ ] Write privacy policy
- [ ] Fill out App Store Connect listing
- [ ] Set pricing (free)
- [ ] Configure in-app purchases (if any)

**Estimated Time:** 6-8 hours

---

#### 5. ⏳ Final Checks Before Release

- [ ] All 30 languages work correctly
- [ ] No TypeScript errors (`npx tsc --noEmit`)
- [ ] No console warnings
- [ ] All API keys configured
- [ ] Privacy policy uploaded
- [ ] Terms of service (if needed)
- [ ] Support email configured
- [ ] Analytics working (Firebase)
- [ ] Crash reporting configured
- [ ] Version number correct everywhere

---

## 📊 ESTIMATED TIMELINE

| Phase | Tasks | Time | Status |
|-------|-------|------|--------|
| **Phase 1: Language Selection + Onboarding** | Hero + Grid дизайн | 2 hours | ✅ DONE |
| **Phase 2: MainHub UI** | Hero + Grid дизайн | 30 min | ✅ DONE |
| **Phase 3: Phrasebook UI** | Categories + Audio + TTS + 31 Languages | 8 hours | ✅ DONE |
| **Phase 4: Visual Translator** | Мультиязычность (31 язык) | 5-6 hours | ✅ DONE |
| **Phase 5: Text Translator** | Мультиязычность (23/31 языков) | 5 hours + 1 hour | ⏳ 74% |
| **Phase 6: Voice Translator** | NEW MODULE - Speech-to-Text + Translation + TTS | 6-8 hours | ⏳ 0% |
| **Phase 7: Dictionary** | Peace Corps PDF + Database + Integration | 4-6 hours | ⏳ 0% |
| **Phase 8: AI Assistants** | Hero + Grid дизайн + Мультиязычность (31 язык) | 6-8 hours | ⏳ 0% |
| **Phase 9: Testing** | Hugging Face API + iOS Testing | 2-3 hours | ⏳ 90% |
| **Phase 10: Production** | Configuration + Icons + Builds + Store | 15-20 hours | ⏳ 0% |
| **COMPLETED** | Phases 1-4 | **~15.5 hours** | ✅ |
| **REMAINING** | Phases 5-10 | **~34-46 hours** | ⏳ |
| **TOTAL** | | **~49.5-61.5 hours** | |

**Optimistic:** 6-8 days (full-time work)
**Realistic:** 2-3 weeks (part-time work)

---

## 🚨 BLOCKERS & RISKS

### Known Issues:
1. ⚠️ **Hugging Face API** - Configured but needs testing
2. ⚠️ **iOS Testing** - Requires Mac/iOS device
3. ⚠️ **Store Accounts** - Need Google Play & Apple Developer accounts ($25 + $99/year)

### Risks:
- Store approval delays (1-2 weeks typical)
- iOS build issues (certificates, provisioning)
- Large app size (306 MP3 files) - may need optimization

---

## ✅ QUICK START CHECKLIST

**Today (Day 1):**
- [x] **PHASE 1:** Fix Language Selection Screen (30 min) - DONE
- [x] **PHASE 2:** Redesign MainHubScreen - DONE
- [x] **PHASE 3:** Redesign Phrasebook screens - DONE
- [x] **PHASE 4:** Visual Translator improvements - DONE
- [ ] **PHASE 5:** Text Translator improvements (осталось 8 языков, ~1 час)
- [ ] **PHASE 6:** Voice Translator integration (NEW, 6-8 hours)
- [ ] **PHASE 7:** Dictionary improvements (4-6 hours)
- [ ] **PHASE 8:** AI Assistants improvements (TBD)

**Tomorrow (Day 2):**
- [ ] **PHASE 9:** Test Hugging Face API (30 min)
- [ ] **PHASE 9:** iOS testing (if available)

**Day 3-4:**
- [ ] **PHASE 10:** Update app.json and package.json
- [ ] **PHASE 10:** Create app icon and splash screen

**Day 5-6:**
- [ ] **PHASE 10:** Build Android + iOS
- [ ] **PHASE 10:** Test builds on real devices

**Day 7:**
- [ ] **PHASE 10:** Prepare store listings
- [ ] **PHASE 10:** Submit to Google Play
- [ ] **PHASE 10:** Submit to App Store

---

## 🎯 NEXT SESSION PRIORITIES

### **UI/UX Improvements (PHASE 1-8):**

1. **PHASE 1: Language Selection Screen + Onboarding** ✅ 100% DONE 🟢
   - ✅ Убран устаревший footer текст
   - ✅ Убран прогресс бар (31 язык правильно)
   - ✅ Hero + Grid дизайн для Language Selection Screen
   - ✅ Hero + Grid дизайн для Onboarding Screen
   - ✅ Исправлена навигация (LanguageSelection → Onboarding → MainHub)
   - ✅ Градиентный header, современные карточки, тени
   - ✅ Обновленные кнопки (Skip, Next, Get Started)

2. **PHASE 2: MainHubScreen UI** ✅ 100% DONE 🟢
   - ✅ Реализован Hero + Grid дизайн
   - ✅ Hero Card (Phrasebook) - большая карточка на всю ширину
   - ✅ Grid 2x3 для остальных 5 модулей
   - ✅ Яркие градиенты, Ionicons иконки, современные тени

3. **PHASE 3: Phrasebook UI** ✅ 100% DONE 🟢
   - ✅ Реализован градиентный дизайн категорий (Hero + Grid вариант 2)
   - ✅ Добавлены переводы на все 31 язык (682 перевода)
   - ✅ Исправлена проблема с языковыми парами
   - ✅ CategoryScreen Hero + Grid дизайн с флагами и индикаторами
   - ✅ PhraseDetailScreen Hero + Grid дизайн + исправлен язык
   - ✅ CategoryCard белый минимализм + фиксированная высота + RTL
   - ✅ Audio система для всех 31 языков с TTS кодами
   - ✅ Audio индикаторы (ActivityIndicator + pause)
   - ✅ TTS установка система для Samsung и других телефонов
   - ✅ Modern Vibrant цвета (Blue/Green) для универсального дизайна

4. **PHASE 4: Visual Translator** ✅ 100% DONE 🟢
   - ✅ Добавлена мультиязычность для всех 31 языков
   - ✅ Все UI тексты переведены

5. **PHASE 5: Text Translator** ⏳ 74% 🟡
   - ✅ Редизайн в стиле Hero + Grid
   - ✅ Добавлена мультиязычность для 23 языков
   - ⏳ Осталось добавить 8 европейских языков (~1 час)

6. **PHASE 6: Voice Translator** ⏳ 0% 🔴 NEW!
   - Создать новый модуль - Voice Translator
   - Hero + Grid дизайн с 🎤 эмодзи
   - Speech-to-Text + Translation + Text-to-Speech
   - Поддержка всех 31 языков
   - Оценка: 6-8 часов

7. **PHASE 7: Dictionary** ⏳ 0% 🔴
   - Найти бесплатный словарь (Peace Corps PDF)
   - Конвертировать в базу данных
   - Интегрировать в приложение
   - Оценка: 4-6 часов

8. **PHASE 8: AI Assistants** ⏳ 0% 🔴
   - Hero + Grid дизайн для AIAssistantsHomeScreen и ChatScreen
   - Добавить мультиязычность для всех 31 языков (~25-30 полей)
   - Переводы для названий, описаний, welcome messages всех 5 ассистентов
   - Обновить AssistantCard дизайн
   - Оценка: 6-8 часов

### **Testing & Production (PHASE 9-10):**

9. **PHASE 9: Testing** ⏳ 90% 🟡
   - Test Hugging Face API
   - iOS testing
   - Оценка: 30 минут

10. **PHASE 10: Production Build** ⏳ 0% 🔴
    - Review app.json
    - Update version to 1.0.0
    - Configure permissions
    - Plan icon design
    - Check EAS Build setup
    - Оценка: 2 часа

---

**Status:** Phase 1-4 ✅ 100% → Phase 5 ⏳ 74% (Text Translator: 8 языков осталось) → Phase 6 🆕 Voice Translator → Phase 7-8 UI improvements → Phase 9-10 Testing & Production 🚀
**Goal:** Launch v1.0 with all 31 languages by mid-November 2025

**Next Steps:**
1. ✅ PHASE 1: Language Selection + Onboarding Hero+Grid - DONE
2. ✅ PHASE 2: MainHubScreen UI Hero+Grid - DONE
3. ✅ PHASE 3: Phrasebook Complete (Categories + CategoryScreen + PhraseDetail + Audio + TTS + 31 Languages) - DONE
4. ✅ PHASE 4: Visual Translator Multilingual (All 31 Languages) - DONE
5. ⏳ PHASE 5: Text Translator - осталось 8 европейских языков (~1 час)
6. 🔴 PHASE 6: Voice Translator (NEW MODULE - 6-8 hours) - HIGH PRIORITY
7. PHASE 7: Dictionary (4-6 hours)
8. PHASE 8: AI Assistants (Hero + Grid дизайн + 31 язык, 6-8 hours)
9. PHASE 9: Testing (Hugging Face API, iOS)
10. PHASE 10: Production Build (Icons, Builds, Store Submission)
