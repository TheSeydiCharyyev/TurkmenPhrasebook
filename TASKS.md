# 📋 TASKS - TurkmenPhrasebook

**Last Updated:** November 24, 2025
**Status:** Phase 7 ⏳ 0% (Dictionary) → Phase 8 ⏳ 20% (AI - UI improvements) → Phase 10 ⏳ 0% (Production Build) → Phase 11 ✅ 100% (Responsive - COMPLETE!)

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

### **PHASE 8: AI Assistants - UI Improvements** (⏳ 20% осталось)

**Задача:** Улучшить UX для AI ассистентов

**Файлы:**
- `src/features/ai-assistants/screens/AIAssistantsHomeScreen.tsx`
- `src/features/ai-assistants/components/ChatScreen.tsx`
- `src/contexts/LanguageContext.tsx` (если нужны новые переводы)

---

## 🎯 AI ASSISTANTS - ВЫБОР КОНЦЕПЦИИ

### **ПРОБЛЕМА:**
Сейчас у нас 5 отдельных разделов AI ассистентов:
1. Contextual Tips (💡)
2. Conversation Trainer (💬)
3. Grammar Helper (📖)
4. Cultural Advisor (🏛️)
5. General Assistant (🤖)

**Минусы текущего подхода:**
- ❌ Сложно для пользователя - нужно выбирать раздел
- ❌ Дублирование функционала - все ассистенты по сути делают одно
- ❌ Много кода для поддержки
- ❌ Ограничивает гибкость

---

### **РЕШЕНИЕ: Комбинированный подход**

#### **Вариант 1: Универсальный AI Assistant** (отдельный экран) ⭐

**Концепция:**
- Убрать 5 разделов → **один умный чат**
- На главном экране: кнопка/карточка "🤖 AI Assistant"
- Открывается → сразу чат
- AI сам понимает намерение пользователя

**Как работает:**
```
Пользователь: "Как сказать спасибо?"
AI: "В туркменском языке 'спасибо' это 'Sagbol'. Произносится..."

Пользователь: "Объясни грамматику падежей"
AI: "В туркменском языке 6 падежей..."

Пользователь: "Давай попрактикуемся в диалоге"
AI: "Отлично! Начнем диалог в магазине..."
```

**Преимущества:**
- ✅ Проще для пользователя (не нужно выбирать раздел)
- ✅ Естественный разговор
- ✅ Меньше кода
- ✅ AI понимает контекст автоматически

**Опционально: Quick Actions**
```
┌────────────────────────────┐
│   AI Language Assistant    │
├────────────────────────────┤
│ 💬 [Start a conversation]  │
│ 📖 [Grammar question]      │
│ 🏛️ [Cultural advice]       │
│ 💡 [Quick tips]            │
└────────────────────────────┘
```

**Задачи:**
- [ ] Убрать 5 отдельных ассистентов
- [ ] Создать универсальный Chat экран
- [ ] Обновить system prompt (AI должен понимать любой запрос)
- [ ] Добавить Quick Actions (опционально)
- [ ] Обновить MainHub (1 карточка вместо 5)

**Оценка:** 2-3 часа

---

#### **Вариант 2: Модальное окно AI Chat** (overlay) ⭐⭐⭐

**Концепция:**
- AI чат доступен **из любого экрана**
- Кнопка "🤖 Ask AI" в правом верхнем углу (как WhatsApp)
- Открывается → modal с чатом
- Закрывается → возвращаемся на экран

**Как работает:**
```
Пользователь на экране Phrasebook
→ Видит фразу "Sag boluň"
→ Нажимает [🤖] в углу
→ Модальное окно AI чата
→ Спрашивает: "Когда используется эта фраза?"
→ AI отвечает
→ Закрывает модалку → продолжает изучать
```

**Преимущества:**
- ✅ Удобнее UX (AI доступен везде)
- ✅ Контекстуальная помощь
- ✅ Не нужна отдельная карточка в MainHub
- ✅ Современный подход (копирует ChatGPT mobile)

**Задачи:**
- [ ] Создать Modal компонент для AI чата
- [ ] Добавить floating button "🤖 Ask AI" на каждый экран
- [ ] Сделать modal responsive
- [ ] Обновить MainHub (убрать AI карточку)

**Оценка:** 3-4 часа

---

#### **Вариант 3: Комбо (Универсальный + Модальное окно)** ⭐⭐

**Концепция:**
- MainHub → карточка "🤖 AI Assistant" (открывает полноэкранный чат)
- На других экранах → floating button "🤖" (открывает modal)

**Преимущества:**
- ✅ Гибкость (можно открыть откуда угодно)
- ✅ MainHub остается со всеми модулями
- ✅ Лучший UX

**Минусы:**
- ⚠️ Больше работы

**Оценка:** 4-5 часов

---

### **ВОПРОСЫ ДЛЯ ОБСУЖДЕНИЯ:**

1. **Какой вариант предпочитаете?**
   - Вариант 1: Один универсальный AI чат (отдельный экран)
   - Вариант 2: Modal AI чат (доступен везде)
   - Вариант 3: Комбо (оба варианта)

2. **Нужны ли Quick Actions** (быстрые кнопки в начале чата)?
   - Да, помогает пользователям начать диалог
   - Нет, излишне

3. **Выбор модели:**
   - Оставить только Gemini (текущий)
   - Добавить выбор моделей (Gemini / Claude / Hugging Face) в Settings
   - Добавить fallback (если Gemini не работает → Claude)

4. **Контекстуальность:**
   - AI должен знать на каком экране пользователь?
   - Или универсальный AI без контекста экрана?

---

### **РЕКОМЕНДАЦИЯ:**

**Начать с Вариант 1** (Универсальный AI чат):
1. Проще реализация (2-3 часа)
2. Убирает дублирование кода
3. Лучше UX для пользователя
4. Можно позже добавить Вариант 2 (modal)

**Потом добавить:**
- Quick Actions (опционально)
- Выбор модели в Settings
- Fallback на другие модели

---

### **СТАТУС:** ⏳ Обсуждение (ждем решения по UI варианту и деталям)

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

### **PHASE 11: Responsive Design** (✅ 100% COMPLETED - November 24, 2025)

**✅ Выполнено:**
- ✅ Исправлены все 42 критические ошибки responsive дизайна
- ✅ HomeScreen.tsx - HEADER_HEIGHT + все размеры
- ✅ CategoryScreen.tsx - header container + иконки
- ✅ MainHubScreen.tsx - все иконки
- ✅ ChatScreen.tsx - все menu иконки
- ✅ TextTranslatorScreen.tsx - back icon

**Результат:** Приложение корректно адаптируется под все размеры экранов (iPhone SE → iPad Pro)

---

## 📊 ESTIMATED TIMELINE

| Phase | Tasks | Time | Status |
|-------|-------|------|--------|
| **Phase 7: Dictionary** | Peace Corps PDF + Database + Integration | 4-6 hours | ⏳ 0% |
| **Phase 8: AI Assistants** | UI improvements (choose variant) | 2-5 hours | ⏳ 20% |
| **Phase 10: Production** | Configuration + Icons + Builds + Store | 15-20 hours | ⏳ 0% |
| **Phase 11: Responsive** | Fixed all responsive bugs | DONE | ✅ 100% |
| **TOTAL REMAINING** | Phases 7, 8, 10 | **~21-31 hours** | ⏳ |

**Optimistic:** 5-6 days (full-time work)
**Realistic:** 2-3 weeks (part-time work)

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
2. 🟡 PHASE 8: AI UI improvements (2-5 hours) - **NEEDS DECISION**
3. 🔴 PHASE 10: Production Build (15-20 hours)
4. ✅ ~~PHASE 11: Responsive~~ - **COMPLETE!**

---

**Goal:** Launch v1.0 by December 2025
