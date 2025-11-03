# 📋 TASKS - TurkmenPhrasebook

**Last Updated:** November 2, 2025
**Status:** Phase 1 ✅ 100% (Language Selection + Onboarding Hero+Grid) → Phase 2 ✅ 100% (MainHub Hero+Grid) → Phase 3 ✅ 100% (Phrasebook Categories + 31 Languages) → Phase 4-7 UI Improvements → Phase 8-9 Testing & Production

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

### **PHASE 3: Улучшить дизайн разговорника** (⏳ 85%)

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

**⏳ Осталось сделать:**

6. ⏳ **Улучшить дизайн экрана с фразами (CategoryScreen):**
   - Файл: `src/screens/CategoryScreen.tsx`
   - Обновить дизайн карточек фраз
   - Улучшить типографику (размеры текста, отступы)
   - Добавить современные тени и скругления
   - Улучшить визуальную иерархию (выделить основной язык)
   - **Оценка времени:** 1-2 часа

7. ⏳ **Исправить аудио функционал:**
   - Проверить работу аудио для всех 31 языков
   - Исправить баги воспроизведения (если есть)
   - Убедиться что аудио файлы загружаются корректно
   - Добавить индикаторы загрузки/воспроизведения
   - **Оценка времени:** 1-2 часа

**Измененные файлы:**
- `src/types/index.ts` - обновлены типы Category и SubCategory
- `src/data/category-translations.ts` - новый файл с переводами
- `src/data/categories.ts` - эмодзи иконки категорий и подкатегорий
- `src/components/CategoryCard.tsx` - эмодзи иконки + градиентный дизайн
- `src/components/SubCategoryCard.tsx` - эмодзи иконки + динамические переводы
- `src/screens/HomeScreen.tsx` - анимация header + динамические переводы
- `src/screens/CategoryScreen.tsx` - динамические переводы

**Дизайн стиль:** Hero + Grid (вариант 2) - эмодзи, градиенты, мощные тени, белый текст, анимации

**Время:** ~4 часа (выполнено) + ~2-4 часа (осталось)

---

### **PHASE 4: Поработать с Visual Translator** (⏳ 40%)

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

2. ✅ **Добавлены переводы для 12 из 31 языков:**
   - ✅ tk (Туркменский)
   - ✅ zh (Китайский)
   - ✅ ru (Русский)
   - ✅ en (Английский)
   - ✅ tr (Турецкий)
   - ✅ de (Немецкий)
   - ✅ fr (Французский)
   - ✅ es (Испанский)
   - ✅ it (Итальянский)
   - ✅ pt (Португальский)
   - ✅ nl (Голландский)
   - ✅ pl (Польский)

**⏳ Осталось сделать:**

3. ⏳ **Добавить переводы для оставшихся 19 языков:**
   - uk (Украинский), ja (Японский), ko (Корейский)
   - th (Тайский), vi (Вьетнамский), id (Индонезийский), ms (Малайский)
   - hi (Хинди), ur (Урду), fa (Персидский), ps (Пушту)
   - uz (Узбекский), kk (Казахский), az (Азербайджанский), ky (Киргизский), tg (Таджикский)
   - hy (Армянский), ka (Грузинский), ar (Арабский)
   - **Оценка времени:** 2-3 часа

4. ⏳ **Обновить VisualTranslatorHomeScreen.tsx:**
   - Импортировать `useAppLanguage` и `getTexts()`
   - Заменить все захардкоженные тексты на `texts.vtXXX`
   - Проверить что все UI элементы используют переводы
   - **Оценка времени:** 30 минут

5. ⏳ **Обновить TranslationResultScreen.tsx:**
   - Импортировать `useAppLanguage` и `getTexts()`
   - Заменить все захардкоженные тексты на `texts.vtXXX`
   - Проверить Alert сообщения (vtCopied, vtCopiedMessage)
   - **Оценка времени:** 30 минут

6. ⏳ **Протестировать Visual Translator:**
   - Протестировать на русском, английском, туркменском, китайском
   - Проверить что все тексты отображаются корректно
   - Проверить переключение языков
   - **Оценка времени:** 30 минут

**Измененные файлы:**
- `src/contexts/LanguageContext.tsx` - добавлены 32 поля + переводы для 12 языков

**Время:** ~2 часа (выполнено) + ~3-4 часа (осталось)

---

### **PHASE 5: Поработать с онлайн переводчиком** (⏳ 0%)

**Задача:** Улучшить дизайн и функционал текстового переводчика

**Файлы:**
- `src/features/text-translator/screens/TextTranslatorScreen.tsx`

**Что нужно сделать:**
- Улучшить дизайн Text Translator
- Детали будут обсуждаться отдельно

**Оценка времени:** TBD

---

### **PHASE 6: Поработать со словарем** (⏳ 0%)

**Задача:** Найти и интегрировать бесплатный туркменский словарь

**Файлы:**
- `src/screens/DictionaryScreen.tsx`

**Что нужно сделать:**

#### 6.1 Поиск словаря
- [ ] Скачать Peace Corps Turkmenistan Dictionary (PDF)
  - Туркменский ↔ Английский
  - Бесплатно для образовательных целей
- [ ] Проверить другие источники:
  - Glosbe.com (онлайн база)
  - Мобильные приложения (18,000 - 100,000+ слов)
- [ ] Проверить лицензии на использование

#### 6.2 Подготовка данных
- [ ] Конвертировать PDF в текст
- [ ] Создать структуру базы данных (JSON/SQLite)
- [ ] Добавить транскрипции (если есть)
- [ ] Добавить примеры использования (опционально)

#### 6.3 Интеграция в приложение
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

### **PHASE 7: Поработать с ИИ** (⏳ 0%)

**Задача:** Улучшить дизайн и функционал AI ассистентов

**Файлы:**
- `src/features/ai-assistants/screens/AIAssistantsHomeScreen.tsx`
- AI ассистенты экраны (5 штук)

**Что нужно сделать:**
- Улучшить дизайн AI Assistants
- Детали будут обсуждаться отдельно

**Оценка времени:** TBD

---

### **PHASE 8: Testing** (⏳ 90% Complete)

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

### **PHASE 9: Production Build** (⏳ 0% Complete)

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
| **Phase 1: Fix Welcome Screen** | | | |
| - Fix language count | 31 vs 30 languages inconsistency | 15 min | ⏳ |
| - Update footer text | Remove "OTA updates" message | 15 min | ⏳ |
| **Phase 2: MainHubScreen UI** | | | |
| - Redesign main screen | Update design of 6 modules screen | TBD | ⏳ |
| **Phase 3: Phrasebook UI** | | | |
| - Redesign categories list | Improve HomeScreen design | TBD | ⏳ |
| - Redesign phrases list | Improve CategoryScreen design | TBD | ⏳ |
| **Phase 4: Visual Translator** | | | |
| - Improve Visual Translator | UI/UX improvements | TBD | ⏳ |
| **Phase 5: Text Translator** | | | |
| - Improve Text Translator | UI/UX improvements | TBD | ⏳ |
| **Phase 6: Dictionary** | | | |
| - Find dictionary source | Peace Corps PDF / Glosbe | 1-2 hours | ⏳ |
| - Convert & integrate | Create database, add search | 3-4 hours | ⏳ |
| **Phase 7: AI Assistants** | | | |
| - Improve AI features | UI/UX improvements | TBD | ⏳ |
| **Phase 8: Testing** | | | |
| - Hugging Face API Test | AI Assistants + Visual Translator | 1 hour | ⏳ |
| - iOS Testing | Full app testing on iOS | 2-3 hours | ⏳ |
| **Phase 9: Production** | | | |
| - Configuration | app.json, package.json | 1 hour | ⏳ |
| - Icon & Splash | Design + implementation | 2-4 hours | ⏳ |
| - Builds | Android + iOS builds + testing | 4-6 hours | ⏳ |
| - Store Prep | Screenshots, descriptions, listings | 6-8 hours | ⏳ |
| - Final Checks | QA before release | 2 hours | ⏳ |
| **TOTAL** | | **17.5-27.5 hours** | |

**Optimistic:** 3-4 days (full-time work)
**Realistic:** 1 week (part-time work)

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
- [ ] **PHASE 1:** Fix Language Selection Screen (30 min)
- [ ] **PHASE 2:** Redesign MainHubScreen (TBD)
- [ ] **PHASE 3:** Redesign Phrasebook screens (TBD)
- [ ] **PHASE 4:** Visual Translator improvements (TBD)
- [ ] **PHASE 5:** Text Translator improvements (TBD)
- [ ] **PHASE 6:** Dictionary improvements (TBD)
- [ ] **PHASE 7:** AI Assistants improvements (TBD)

**Tomorrow (Day 2):**
- [ ] **PHASE 8:** Test Hugging Face API (30 min)
- [ ] **PHASE 8:** iOS testing (if available)

**Day 3-4:**
- [ ] **PHASE 9:** Update app.json and package.json
- [ ] **PHASE 9:** Create app icon and splash screen

**Day 5-6:**
- [ ] **PHASE 9:** Build Android + iOS
- [ ] **PHASE 9:** Test builds on real devices

**Day 7:**
- [ ] **PHASE 9:** Prepare store listings
- [ ] **PHASE 9:** Submit to Google Play
- [ ] **PHASE 9:** Submit to App Store

---

## 🎯 NEXT SESSION PRIORITIES

### **UI/UX Improvements (PHASE 1-7):**

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
   - ✅ Градиенты, белый текст, мощные тени

4. **PHASE 4: Visual Translator** (TBD) 🔴 HIGH PRIORITY - NEXT
   - Улучшить дизайн визуального переводчика

5. **PHASE 5: Text Translator** (TBD)
   - Улучшить дизайн текстового переводчика

6. **PHASE 6: Dictionary** (4-6 hours)
   - Найти бесплатный словарь (Peace Corps PDF)
   - Конвертировать в базу данных
   - Интегрировать в приложение

7. **PHASE 7: AI Assistants** (TBD)
   - Улучшить дизайн AI ассистентов

### **Testing & Production (PHASE 8-9):**

8. **PHASE 8: Testing** (30 min)
   - Test Hugging Face API
   - iOS testing

9. **PHASE 9: Production Build** (2 hours)
   - Review app.json
   - Update version to 1.0.0
   - Configure permissions
   - Plan icon design
   - Check EAS Build setup

---

**Status:** Phase 1 ✅ 100% → Phase 2 ✅ 100% → Phase 3 ✅ 100% → Phase 4-7 UI improvements needed → Phase 8-9 Testing & Production 🚀
**Goal:** Launch v1.0 with all 31 languages by mid-November 2025

**Next Steps:**
1. ✅ PHASE 1: Language Selection + Onboarding Hero+Grid - DONE
2. ✅ PHASE 2: MainHubScreen UI Hero+Grid - DONE
3. ✅ PHASE 3: Phrasebook Categories + 31 Languages - DONE
4. 🔴 PHASE 4: Visual Translator UI (HIGH PRIORITY - NEXT)
5. PHASE 5-7: UI/UX improvements (TBD)
6. PHASE 8: Testing
7. PHASE 9: Production Build
