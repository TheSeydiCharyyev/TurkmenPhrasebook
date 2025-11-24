# 📋 TASKS - TurkmenPhrasebook

**Last Updated:** November 24, 2025
**Status:** Phase 7 ⏳ 0% (Dictionary) → Phase 10 ⏳ 0% (Production Build)

---

## 🎯 WHAT'S LEFT TO DO

### **PHASE 7: Dictionary** (⏳ 0%)

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

**Оценка времени:** 4-6 часов

---

### **PHASE 10: Production Build** (⏳ 0%)

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
| **Phase 7: Dictionary** | Peace Corps PDF + Database + Integration | 4-6 hours | ⏳ 0% |
| **Phase 10: Production** | Configuration + Icons + Builds + Store | 15-20 hours | ⏳ 0% |
| **TOTAL REMAINING** | Phases 7, 10 | **~19-26 hours** | ⏳ |

**Optimistic:** 4-5 days (full-time work)
**Realistic:** 1-2 weeks (part-time work)

---

## 🚨 BLOCKERS & RISKS

### Known Issues:
1. ⚠️ **iOS Testing** - Requires Mac/iOS device
2. ⚠️ **Store Accounts** - Need Google Play & Apple Developer accounts ($25 + $99/year)

### Risks:
- Store approval delays (1-2 weeks typical)
- iOS build issues (certificates, provisioning)
- Large app size (306 MP3 files) - may need optimization

---

## ✅ NEXT PRIORITIES

**For v1.0 Release:**
1. 🔴 PHASE 7: Dictionary (4-6 hours)
2. 🔴 PHASE 10: Production Build (15-20 hours)

---

**Goal:** Launch v1.0 by December 2025
