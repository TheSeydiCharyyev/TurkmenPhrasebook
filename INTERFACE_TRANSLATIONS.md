# 🌍 Interface Translations Checklist

This document tracks the progress of translating the entire app interface into all supported languages.

**Goal:** Translate the interface to **31 languages** (30 languages + Turkmen)

**Current Progress:** 4/31 languages (13%)

---

## ✅ Completed Languages (4)

| # | Code | Language | Native Name | Status | Completed Date |
|---|------|----------|-------------|--------|----------------|
| 1 | `tk` | Turkmen | Türkmençe | ✅ Ready | 2025-01-27 |
| 2 | `zh` | Chinese | 中文 | ✅ Ready | 2025-01-27 |
| 3 | `ru` | Russian | Русский | ✅ Ready | 2025-01-27 |
| 4 | `en` | English | English | ✅ Ready | 2025-01-27 |

---

## 🔄 In Progress (0)

_No languages currently in progress_

---

## 📋 Pending Languages (27)

### Asian Languages (9)

| # | Code | Language | Native Name | Status | Priority | Notes |
|---|------|----------|-------------|--------|----------|-------|
| 5 | `ja` | Japanese | 日本語 | ⏳ Pending | High | Has transcription |
| 6 | `ko` | Korean | 한국어 | ⏳ Pending | High | Has transcription |
| 7 | `th` | Thai | ไทย | ⏳ Pending | Medium | Has transcription |
| 8 | `vi` | Vietnamese | Tiếng Việt | ⏳ Pending | Medium | - |
| 9 | `id` | Indonesian | Bahasa Indonesia | ⏳ Pending | Medium | - |
| 10 | `ms` | Malay | Bahasa Melayu | ⏳ Pending | Low | - |
| 11 | `hi` | Hindi | हिन्दी | ⏳ Pending | Medium | Has transcription |
| 12 | `ur` | Urdu | اردو | ⏳ Pending | Low | RTL, has transcription |
| 13 | `ar` | Arabic | العربية | ⏳ Pending | Medium | RTL, has transcription |

### Middle Eastern Languages (2)

| # | Code | Language | Native Name | Status | Priority | Notes |
|---|------|----------|-------------|--------|----------|-------|
| 14 | `fa` | Persian | فارسی | ⏳ Pending | Medium | RTL, has transcription |
| 15 | `ps` | Pashto | پښتو | ⏳ Pending | Low | RTL, has transcription |

### European Languages (8)

| # | Code | Language | Native Name | Status | Priority | Notes |
|---|------|----------|-------------|--------|----------|-------|
| 16 | `de` | German | Deutsch | ⏳ Pending | High | - |
| 17 | `fr` | French | Français | ⏳ Pending | High | - |
| 18 | `es` | Spanish | Español | ⏳ Pending | High | - |
| 19 | `it` | Italian | Italiano | ⏳ Pending | Medium | - |
| 20 | `tr` | Turkish | Türkçe | ⏳ Pending | High | Similar to Turkmen |
| 21 | `pl` | Polish | Polski | ⏳ Pending | Low | - |
| 22 | `pt` | Portuguese | Português | ⏳ Pending | Medium | - |
| 23 | `nl` | Dutch | Nederlands | ⏳ Pending | Low | - |

### Caucasus & Eastern Europe (3)

| # | Code | Language | Native Name | Status | Priority | Notes |
|---|------|----------|-------------|--------|----------|-------|
| 24 | `uk` | Ukrainian | Українська | ⏳ Pending | Medium | Has transcription |
| 25 | `hy` | Armenian | Հայերեն | ⏳ Pending | Low | Has transcription |
| 26 | `ka` | Georgian | ქართული | ⏳ Pending | Low | Has transcription |

### Central Asian Languages (5)

| # | Code | Language | Native Name | Status | Priority | Notes |
|---|------|----------|-------------|--------|----------|-------|
| 27 | `uz` | Uzbek | O'zbek | ⏳ Pending | High | Close to Turkmen |
| 28 | `kk` | Kazakh | Қазақ | ⏳ Pending | High | Has transcription |
| 29 | `az` | Azerbaijani | Azərbaycan | ⏳ Pending | High | Close to Turkmen |
| 30 | `ky` | Kyrgyz | Кыргыз | ⏳ Pending | Medium | Has transcription |
| 31 | `tg` | Tajik | Тоҷикӣ | ⏳ Pending | Medium | Has transcription |

---

## 📝 Translation Requirements

Each interface language must include translations for:

### 1. Main Hub (MainHubScreen)
- [ ] Module titles (6 modules)
- [ ] Module subtitles
- [ ] Welcome texts
- [ ] Navigation elements

### 2. Core Navigation
- [ ] Tab bar labels
- [ ] Screen headers
- [ ] Back buttons
- [ ] Common actions (Save, Cancel, Delete, Share, Edit)

### 3. Phrasebook Module
- [ ] Category names (22 categories)
- [ ] Search placeholders
- [ ] Filter options
- [ ] Empty states

### 4. Visual Translator Module
- [ ] Camera screen texts
- [ ] Result screen labels
- [ ] Error messages
- [ ] Instructions

### 5. Text Translator Module
- [ ] Input placeholders
- [ ] Translation button
- [ ] Language selector
- [ ] History labels

### 6. AI Assistants Module
- [ ] Assistant names (5 assistants)
- [ ] Assistant descriptions
- [ ] Chat interface texts
- [ ] Tips and suggestions

### 7. Settings Screen
- [ ] Section headers
- [ ] Option labels
- [ ] Toggle descriptions
- [ ] About information

### 8. Common Elements
- [ ] Loading states
- [ ] Error messages
- [ ] Success messages
- [ ] Confirmation dialogs
- [ ] Toast notifications

---

## 🔧 How to Add a New Interface Language

See `ADD_NEW_LANGUAGE.md` for detailed instructions.

**Quick Steps:**
1. Add language to `LanguageContext.tsx` → `AppLanguageMode` type
2. Add to `languages.config.ts` with `isAvailable: true`
3. Add all translations to `INTERFACE_TEXTS` object
4. Update helper functions (VoiceSearch, AdvancedSearch, TTSChecker)
5. Update type annotations in components
6. Run TypeScript check: `npx tsc --noEmit`
7. Test in the app

---

## 📊 Progress Tracking

### By Region
- **Asia:** 0/9 (0%)
- **Middle East:** 0/2 (0%)
- **Europe:** 0/8 (0%)
- **Caucasus/Eastern Europe:** 0/3 (0%)
- **Central Asia:** 0/5 (0%)

### By Priority
- **High Priority:** 0/10 languages
- **Medium Priority:** 0/11 languages
- **Low Priority:** 0/6 languages

### Total Progress
**Completed:** 4/31 (13%)
**In Progress:** 0/31 (0%)
**Pending:** 27/31 (87%)

---

## 🎯 Recommended Translation Order

### Phase 1: High Priority Asian Languages (High impact, large user base)
1. Japanese (ja) - 日本語
2. Korean (ko) - 한국어

### Phase 2: High Priority European Languages (High impact, wide reach)
3. German (de) - Deutsch
4. French (fr) - Français
5. Spanish (es) - Español

### Phase 3: Central Asian Languages (Regional importance, similar to Turkmen)
6. Turkish (tr) - Türkçe
7. Uzbek (uz) - O'zbek
8. Azerbaijani (az) - Azərbaycan
9. Kazakh (kk) - Қазақ

### Phase 4: Medium Priority Languages
10. Thai (th) - ไทย
11. Vietnamese (vi) - Tiếng Việt
12. Indonesian (id) - Bahasa Indonesia
13. Hindi (hi) - हिन्दी
14. Arabic (ar) - العربية
15. Persian (fa) - فارسی
16. Italian (it) - Italiano
17. Ukrainian (uk) - Українська
18. Portuguese (pt) - Português
19. Kyrgyz (ky) - Кыргыз
20. Tajik (tg) - Тоҷикӣ

### Phase 5: Low Priority Languages
21. Malay (ms) - Bahasa Melayu
22. Urdu (ur) - اردو
23. Pashto (ps) - پښتو
24. Polish (pl) - Polski
25. Dutch (nl) - Nederlands
26. Armenian (hy) - Հայերեն
27. Georgian (ka) - ქართული

---

## 📌 Notes

- **RTL Languages:** Arabic, Urdu, Persian, Pashto require special UI handling
- **Transcription:** Some languages (Chinese, Japanese, Korean, etc.) need transcription support
- **Voice Search:** Each language needs corresponding TTS (Text-to-Speech) code
- **Testing:** Each translation must be tested in the app before marking as complete

---

**Last Updated:** 2025-01-27
**Next Review:** After completing Phase 1 (Japanese & Korean)
