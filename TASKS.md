# 📋 TASKS - TurkmenPhrasebook

**Last Updated:** December 7, 2025
**Status:** Phase 10 ⏳ 80% (Production Build - Final Step: Build)

---

## 🎯 WHAT'S LEFT TO DO

### **PHASE 10: Production Build** (⏳ 80% - Only Build Remaining)

#### 1. ✅ Update Configuration Files

**app.json:**
- [x] Update version to `1.0.0`
- [x] Update app name (verify translations)
- [x] Set bundle identifier (Android: `com.turkmen.phrasebook`, iOS: `com.turkmen.phrasebook`)
- [x] Configure permissions:
  - [x] Camera permission
  - [x] Photo library permission
  - [x] Microphone permission (future use)
- [x] Configure orientation (portrait only?)
- [x] Configure status bar style

**package.json:**
- [x] Verify version is `1.0.0`
- [x] Remove unused dependencies (if any)
- [x] Verify all dependencies are production-ready

---

#### 2. ✅ App Icon & Splash Screen

**Design Requirements:**
- Icon: 1024x1024 PNG (iOS), adaptive icon (Android)
- Splash screen: 1242x2436 PNG
- Design elements: Turkmen flag colors + dove + camera/book

**Tasks:**
- [x] Design app icon
- [x] Generate all icon sizes with `npx expo-icon`
- [x] Design splash screen
- [x] Configure splash screen in app.json
- [x] Test on Android
- [x] Test on iOS

**Completed:** ✅

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

#### 4. ✅ Store Preparation

**Google Play Store:**
- [x] Create developer account (if not exists)
- [x] Prepare screenshots (6 screens minimum):
  - Main Hub
  - Phrasebook (category view)
  - Phrase Detail (with audio)
  - Visual Translator (camera + result)
  - Text Translator
  - AI Assistants
- [x] Write app description (English + other languages)
- [x] Prepare feature graphic (1024x500)
- [x] Write privacy policy
- [x] Fill out store listing
- [x] Set pricing (free)
- [x] Configure in-app purchases (if any)

**App Store (iOS):**
- [x] Create Apple Developer account (if not exists)
- [x] Prepare screenshots (6.5" and 5.5" displays)
- [x] Write app description
- [x] Prepare app preview video (optional)
- [x] Write privacy policy
- [x] Fill out App Store Connect listing
- [x] Set pricing (free)
- [x] Configure in-app purchases (if any)

**Completed:** ✅

---

#### 5. ✅ Final Checks Before Release

- [x] All 30 languages work correctly
- [x] No TypeScript errors (`npx tsc --noEmit`)
- [x] No console warnings
- [x] All API keys configured
- [x] Privacy policy uploaded
- [x] Terms of service (if needed)
- [x] Support email configured
- [x] Analytics working (Firebase)
- [x] Crash reporting configured
- [x] Version number correct everywhere

**Completed:** ✅

---

## 📊 ESTIMATED TIMELINE

| Phase | Tasks | Time | Status |
|-------|-------|------|--------|
| **Phase 10: Production** | Configuration + Icons + Builds + Store | 15-20 hours | ✅ 80% |
| **TOTAL REMAINING** | Build & Test only | **~4-6 hours** | ⏳ |

**Current Status:** Ready for build
**Next Step:** Execute build commands for Android and iOS

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
1. 🔴 **CURRENT TASK:** Build & Test (4-6 hours)
   - Configure EAS Build
   - Run Android build (preview & production)
   - Run iOS build (preview & production)
   - Test on real devices

---

**Goal:** Launch v1.0 by December 2025
**Progress:** 🟩🟩🟩🟩⬜ 80% Complete - Final stretch!
