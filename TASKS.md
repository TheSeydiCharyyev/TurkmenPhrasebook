# 📋 TASKS - TurkmenPhrasebook

**Last Updated:** November 2, 2025
**Status:** Phase 1-7 UI Improvements → Phase 8-9 Testing & Production

---

## 🎯 WHAT'S LEFT TO DO

### **PHASE 1: Исправить начальный экран выбора языка** (⏳ 0%)

**Проблемы:**

1. **Показывает "31/31 languages available"** - но в документации сказано 30 языков
   - Файл: `src/screens/LanguageSelectionScreen.tsx` (строка 203)
   - Непонятно сколько языков на самом деле: 30 или 31?

2. **Footer внизу экрана устарел**
   - Файл: `src/screens/LanguageSelectionScreen.tsx` (строка 222)
   - Текст: "New languages are added regularly via OTA updates"
   - Проблема: Все языки уже добавлены, сообщение неактуально

3. **Комментарии в коде не совпадают с реальностью**
   - Файл: `src/config/languages.config.ts` (строки 2, 6)
   - Написано: "Конфигурация всех 30 поддерживаемых языков"
   - В массиве LANGUAGES реально 31 язык

**Файлы для проверки:**
- `src/screens/LanguageSelectionScreen.tsx`
- `src/config/languages.config.ts`
- `src/data/languages/translations/` (30 файлов переводов)

**Оценка времени:** 30 минут

---

### **PHASE 2: Изменить UI MainHubScreen** (⏳ 0%)

**Задача:** Улучшить дизайн главного экрана с 6 модулями

**Файл:**
- `src/screens/MainHubScreen.tsx`

**Что нужно сделать:**
- Изменить UI/дизайн главного экрана
- Детали дизайна будут обсуждаться отдельно

**Оценка времени:** TBD (зависит от объема изменений)

---

### **PHASE 3: Улучшить дизайн разговорника** (⏳ 0%)

**Задача:** Улучшить дизайн разговорника и его категорий

**Файлы:**
- `src/screens/HomeScreen.tsx` - список категорий
- `src/screens/CategoryScreen.tsx` - список фраз в категории
- `src/screens/PhraseDetailScreen.tsx` - детальный вид фразы (опционально)

**Что нужно сделать:**
- Улучшить дизайн списка категорий разговорника
- Улучшить дизайн списка фраз в категории
- Детали дизайна будут обсуждаться отдельно

**Оценка времени:** TBD (зависит от объема изменений)

---

### **PHASE 4: Поработать с Visual Translator** (⏳ 0%)

**Задача:** Улучшить дизайн и функционал визуального переводчика

**Файлы:**
- `src/features/visual-translator/screens/VisualTranslatorHomeScreen.tsx`
- `src/features/visual-translator/screens/TranslationResultScreen.tsx`

**Что нужно сделать:**
- Улучшить дизайн Visual Translator
- Детали будут обсуждаться отдельно

**Оценка времени:** TBD

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
- [x] API key configured in .env file (`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`)
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

1. **PHASE 1: Language Selection Screen** (30 min) 🔴 HIGH PRIORITY
   - Исправить количество языков (31 vs 30)
   - Обновить комментарии в коде
   - Убрать устаревший footer текст

2. **PHASE 2: MainHubScreen UI** (TBD) 🔴 HIGH PRIORITY
   - Обсудить новый дизайн главного экрана с 6 модулями

3. **PHASE 3: Phrasebook UI** (TBD) 🔴 HIGH PRIORITY
   - Улучшить дизайн списка категорий (HomeScreen)
   - Улучшить дизайн списка фраз (CategoryScreen)

4. **PHASE 4: Visual Translator** (TBD)
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

**Status:** Phase 1-7 UI improvements needed, then testing and production 🚀
**Goal:** Launch v1.0 with all 30/31 languages by mid-November 2025

**Next Steps:**
1. PHASE 1: Fix Language Selection Screen (30 min)
2. PHASE 2-7: UI/UX improvements (TBD)
3. PHASE 8: Testing
4. PHASE 9: Production Build
