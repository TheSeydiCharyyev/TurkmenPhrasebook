# 📋 TASKS - TurkmenPhrasebook

**Last Updated:** November 2, 2025
**Status:** 95% Complete - Ready for Final Testing & Production Build

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

### **PHASE 7: Testing** (⏳ 90% Complete)

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

### **PHASE 8: Production Build** (⏳ 0% Complete)

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
| **Phase 7: Testing** | | | |
| - Hugging Face API Test | AI Assistants + Visual Translator | 1 hour | ⏳ |
| - iOS Testing | Full app testing on iOS | 2-3 hours | ⏳ |
| **Phase 8: Production** | | | |
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
- [ ] Test Hugging Face API (AI Assistants) (30 min)

**Tomorrow (Day 2):**
- [ ] iOS testing (if available)
- [ ] Update app.json and package.json
- [ ] Create app icon and splash screen

**Day 3-5:**
- [ ] Build Android + iOS
- [ ] Test builds on real devices

**Day 6-7:**
- [ ] Prepare store listings
- [ ] Submit to Google Play
- [ ] Submit to App Store

---

## 🎯 NEXT SESSION PRIORITIES

1. **FIX PHASE 1: Language Selection Screen** (30 min) 🔴 HIGH PRIORITY
   - Count exact number of languages in LANGUAGES array
   - Update comments to match actual count
   - Fix footer text (remove "OTA updates" message)
   - Verify all languages have translation files

2. **Test Hugging Face API** (30 min)
   - Open AI Assistants
   - Send test messages to all 5 assistants
   - Verify responses are from AI (not fallback)
   - Test Visual Translator AI description (photo without text)

3. **Start Production Prep** (2 hours)
   - Review app.json
   - Update version to 1.0.0
   - Configure permissions
   - Plan icon design
   - Check EAS Build setup

3. **iOS Testing** (if Mac available)
   - Test all modules
   - Verify permissions work

---

**Status:** Phase 1 fixes needed, then ready for final testing and production build 🚀
**Goal:** Launch v1.0 with all 30/31 languages by mid-November 2025
**Next Step:** Fix Language Selection Screen (30 min)
