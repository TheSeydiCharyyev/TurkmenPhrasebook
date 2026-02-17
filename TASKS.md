# TASKS - Ykjam Terjime

**Last Updated:** January 1, 2026
**Status:** Phase 1 - Google Play

---

## PHASE 1: Google Play Store

### Step 1: Подготовка к сборке

#### 1.1 Проверить eas.json
```bash
# Проверить что файл eas.json настроен правильно
# Должен содержать профили: development, preview, production
```

#### 1.2 Проверить app.json
- [ ] `expo.android.package` = "com.turkmen.phrasebook"
- [ ] `expo.version` = "1.0.0"
- [ ] `expo.android.versionCode` = 1

#### 1.3 Войти в EAS
```bash
npx eas login
# Ввести логин и пароль от expo.dev
```

---

### Step 2: Сборка Android (AAB файл)

#### 2.1 Preview Build (для тестирования)
```bash
npx eas build --platform android --profile preview
```
- [ ] Запустить команду
- [ ] Дождаться завершения (10-20 минут)
- [ ] Скачать APK файл
- [ ] Установить на телефон и протестировать

#### 2.2 Production Build (для Google Play)
```bash
npx eas build --platform android --profile production
```
- [ ] Запустить команду
- [ ] Дождаться завершения
- [ ] Скачать AAB файл (Android App Bundle)
- [ ] Сохранить AAB файл для загрузки в Google Play

---

### Step 3: Google Play Console

#### 3.1 Вход в консоль
1. Перейти на https://play.google.com/console
2. Войти в аккаунт разработчика

#### 3.2 Создание приложения
1. Нажать **"Create app"** (Создать приложение)
2. Заполнить форму:
   - **App name:** Ykjam Terjime
   - **Default language:** English (US)
   - **App or game:** App
   - **Free or paid:** Free
3. Принять условия использования
4. Нажать **"Create app"**

- [ ] Приложение создано в консоли

---

### Step 4: Настройка приложения в Google Play Console

#### 4.1 Dashboard → Set up your app
Нужно заполнить все пункты (появятся галочки):

**Privacy policy:**
- [ ] Вставить ссылку на политику конфиденциальности
- URL: __________ (нужно создать страницу)

**App access:**
- [ ] Выбрать "All functionality is available without special access"

**Ads:**
- [ ] Выбрать "No, my app does not contain ads" (или Yes если есть)

**Content rating:**
- [ ] Заполнить анкету IARC
- [ ] Ответить на вопросы о контенте
- [ ] Получить рейтинг (обычно 3+ или Everyone)

**Target audience:**
- [ ] Указать возраст аудитории (например, 13+)
- [ ] Подтвердить что приложение НЕ для детей до 13

**News app:**
- [ ] Выбрать "No, my app is not a news app"

**COVID-19 contact tracing:**
- [ ] Выбрать "My app is not a COVID-19 contact tracing app"

**Data safety:**
- [ ] Заполнить форму о сборе данных
- [ ] Указать какие данные собираются
- [ ] Указать как данные используются

**Government apps:**
- [ ] Выбрать "No"

---

### Step 5: Store Listing (Страница приложения)

#### 5.1 Main store listing
Перейти: **Grow → Store presence → Main store listing**

**App name (30 символов макс):**
```
Ykjam Terjime
```
- [ ] Ввести название

**Short description (80 символов макс):**
```
Learn Turkmen phrases with audio. Translate text and images. AI assistants.
```
- [ ] Ввести краткое описание

**Full description (4000 символов макс):**
```
Ykjam Terjime - your complete guide to learning Turkmen language!

FEATURES:

📚 PHRASEBOOK
• 300+ essential phrases in 17 categories
• Native speaker audio pronunciation
• Phonetic transcription for easy learning
• Categories: Greetings, Food, Transport, Shopping, Emergency & more

📷 VISUAL TRANSLATOR
• Point your camera at any text
• Instant translation to Turkmen
• Works with signs, menus, documents

✍️ TEXT TRANSLATOR
• Translate between 30+ languages and Turkmen
• Simple and fast interface
• Copy and share translations

🤖 AI ASSISTANTS
• Chat with AI in Turkmen
• Get help with grammar and vocabulary
• Practice conversations

🌍 SUPPORTED LANGUAGES
English, Russian, Turkish, Chinese, Arabic, Spanish, French, German, Japanese, Korean, and 20+ more languages!

Perfect for:
• Tourists visiting Turkmenistan
• Language learners
• Business travelers
• Anyone interested in Turkmen culture

Download now and start learning Turkmen today!
```
- [ ] Ввести полное описание

---

#### 5.2 Graphics (Графика)

**App icon:**
- [ ] Загрузить иконку 512x512 PNG

**Feature graphic (баннер):**
- [ ] Загрузить изображение 1024x500 PNG
- Это главная картинка в магазине

**Screenshots (скриншоты):**
Минимум 2, рекомендуется 8 скриншотов

**Phone screenshots (обязательно):**
- [ ] Скриншот 1: Главный экран (Hub)
- [ ] Скриншот 2: Разговорник (категории)
- [ ] Скриншот 3: Фраза с аудио
- [ ] Скриншот 4: Визуальный переводчик
- [ ] Скриншот 5: Текстовый переводчик
- [ ] Скриншот 6: AI ассистенты

Размер: 16:9 или 9:16, минимум 320px, максимум 3840px

**Tablet screenshots (опционально):**
- [ ] 7-inch screenshots
- [ ] 10-inch screenshots

---

#### 5.3 Categorization

**App category:**
- [ ] Primary: Education
- [ ] Secondary: Books & Reference

**Tags:**
- [ ] Добавить теги: language learning, translator, phrasebook

---

#### 5.4 Contact details

- [ ] Email: __________ (email для поддержки)
- [ ] Phone: __________ (опционально)
- [ ] Website: __________ (опционально)

---

### Step 6: Release (Публикация)

#### 6.1 Создание релиза
Перейти: **Release → Production**

1. Нажать **"Create new release"**
2. Загрузить AAB файл (из Step 2.2)
3. **Release name:** 1.0.0
4. **Release notes:**
```
Initial release of Ykjam Terjime!

Features:
- 300+ phrases with audio
- Visual translator (camera)
- Text translator (30+ languages)
- AI assistants
```
5. Нажать **"Review release"**
6. Нажать **"Start rollout to Production"**

- [ ] AAB файл загружен
- [ ] Релиз создан
- [ ] Отправлен на проверку

---

### Step 7: Проверка Google (Review)

**Время проверки:** 1-7 дней (обычно 1-3 дня)

**Возможные причины отклонения:**
- Нарушение политик Google Play
- Проблемы с политикой конфиденциальности
- Неправильный контент-рейтинг
- Технические проблемы (краши)

- [ ] Проверка пройдена
- [ ] Приложение опубликовано в Google Play!

---

## PHASE 2: Apple App Store

### Step 1: Подготовка

#### 1.1 Требования
- [ ] Компьютер Mac (обязательно для iOS)
- [ ] Apple Developer аккаунт ($99/год)
- [ ] Xcode установлен
- [ ] iOS устройство для тестирования

#### 1.2 Проверить app.json
- [ ] `expo.ios.bundleIdentifier` = "com.turkmen.phrasebook"
- [ ] `expo.version` = "1.0.0"
- [ ] `expo.ios.buildNumber` = "1"

---

### Step 2: Сертификаты и Provisioning Profiles

#### 2.1 Автоматическая настройка через EAS
```bash
npx eas credentials
```
- [ ] Выбрать iOS
- [ ] Выбрать Production
- [ ] EAS автоматически создаст сертификаты

#### 2.2 Или ручная настройка в Apple Developer Portal
1. Перейти: https://developer.apple.com
2. Certificates, IDs & Profiles
3. Создать:
   - [ ] Distribution Certificate
   - [ ] App ID (com.turkmen.phrasebook)
   - [ ] Provisioning Profile (App Store)

---

### Step 3: Сборка iOS (IPA файл)

#### 3.1 Preview Build (для TestFlight)
```bash
npx eas build --platform ios --profile preview
```
- [ ] Запустить команду
- [ ] Дождаться завершения (15-30 минут)
- [ ] Скачать IPA файл

#### 3.2 Production Build (для App Store)
```bash
npx eas build --platform ios --profile production
```
- [ ] Запустить команду
- [ ] Дождаться завершения
- [ ] Скачать IPA файл

---

### Step 4: App Store Connect

#### 4.1 Вход
1. Перейти на https://appstoreconnect.apple.com
2. Войти с Apple ID разработчика

#### 4.2 Создание приложения
1. Нажать **"+"** → **"New App"**
2. Заполнить:
   - **Platforms:** iOS
   - **Name:** Ykjam Terjime
   - **Primary language:** English
   - **Bundle ID:** com.turkmen.phrasebook
   - **SKU:** turkmen-phrasebook-001
   - **User Access:** Full Access
3. Нажать **"Create"**

- [ ] Приложение создано в App Store Connect

---

### Step 5: App Information

#### 5.1 General → App Information

**Localizable Information:**
- [ ] Name: Ykjam Terjime
- [ ] Subtitle: Learn Turkmen with Audio (30 символов макс)

**General Information:**
- [ ] Category: Education
- [ ] Secondary Category: Reference
- [ ] Content Rights: Does not contain third-party content

**Age Rating:**
- [ ] Заполнить анкету
- [ ] Получить рейтинг (обычно 4+)

---

### Step 6: Pricing and Availability

- [ ] Price: Free
- [ ] Availability: All countries (или выбрать конкретные)
- [ ] Pre-Orders: No

---

### Step 7: App Privacy

#### 7.1 Privacy Policy
- [ ] Вставить URL политики конфиденциальности

#### 7.2 Data Collection
Нужно указать какие данные собираются:
- [ ] Contact Info (если есть)
- [ ] Usage Data (если есть аналитика)
- [ ] Diagnostics (если есть crash reporting)

---

### Step 8: Version Information (Главная страница версии)

#### 8.1 Screenshots
**iPhone 6.7" (обязательно):**
Размер: 1290 x 2796 px
- [ ] Скриншот 1: Главный экран
- [ ] Скриншот 2: Разговорник
- [ ] Скриншот 3: Фраза с аудио
- [ ] Скриншот 4: Визуальный переводчик
- [ ] Скриншот 5: Текстовый переводчик
- [ ] Скриншот 6: AI ассистенты

**iPhone 6.5" (обязательно):**
Размер: 1242 x 2688 px
- [ ] Те же скриншоты

**iPhone 5.5" (обязательно):**
Размер: 1242 x 2208 px
- [ ] Те же скриншоты

**iPad Pro 12.9" (если поддерживается):**
- [ ] Скриншоты для iPad

#### 8.2 Promotional Text (170 символов)
```
Learn Turkmen language with native audio! Visual translator, text translator, and AI assistants included.
```
- [ ] Ввести промо текст

#### 8.3 Description
```
(То же описание что и для Google Play)
```
- [ ] Ввести описание

#### 8.4 Keywords (100 символов)
```
turkmen,language,phrasebook,translator,learn,travel,audio,phrases,dictionary,turkmenistan
```
- [ ] Ввести ключевые слова

#### 8.5 Support URL
- [ ] Вставить ссылку на сайт поддержки или email

#### 8.6 Marketing URL (опционально)
- [ ] Вставить ссылку на сайт приложения

---

### Step 9: Build Upload

#### 9.1 Загрузка через EAS Submit
```bash
npx eas submit --platform ios
```
- [ ] Запустить команду
- [ ] Дождаться загрузки

#### 9.2 Или через Transporter (Mac)
1. Скачать Transporter из Mac App Store
2. Открыть Transporter
3. Перетащить IPA файл
4. Нажать "Deliver"

- [ ] Build загружен в App Store Connect

---

### Step 10: Выбор Build и Submit

1. В App Store Connect → Ваше приложение
2. Перейти в версию 1.0
3. В секции "Build" нажать "+"
4. Выбрать загруженный build
5. Заполнить **"What's New":**
```
Initial release of Ykjam Terjime!
```
6. **App Review Information:**
   - [ ] Contact info для ревьюеров
   - [ ] Demo account (если нужен логин)
   - [ ] Notes (заметки для ревьюеров)

7. Нажать **"Add for Review"**
8. Нажать **"Submit to App Review"**

- [ ] Приложение отправлено на проверку

---

### Step 11: App Review

**Время проверки:** 1-7 дней (обычно 24-48 часов)

**Частые причины отклонения:**
- Баги и краши
- Неполные функции
- Нарушение Human Interface Guidelines
- Проблемы с описанием
- Запрос ненужных разрешений

**Если отклонили:**
1. Прочитать причину в Resolution Center
2. Исправить проблему
3. Загрузить новый build
4. Отправить снова

- [ ] Проверка пройдена
- [ ] Приложение опубликовано в App Store!

---

## Progress

| Phase | Description | Status |
|-------|-------------|--------|
| Phase 1 | Google Play Store | ⏳ In Progress |
| Phase 2 | Apple App Store | ⬜ Pending |

---

## Полезные ссылки

- Google Play Console: https://play.google.com/console
- App Store Connect: https://appstoreconnect.apple.com
- Apple Developer: https://developer.apple.com
- EAS Build: https://docs.expo.dev/build/introduction/
- EAS Submit: https://docs.expo.dev/submit/introduction/

---

**Current Task:** Phase 1, Step 2.2 - Пересобрать AAB после багфиксов

## Completed Steps:
- [x] Step 1.1 - Проверить eas.json ✓
- [x] Step 1.2 - Проверить app.json ✓ (package: com.shapak.translator)
- [x] Step 2.1 - Создать keystore ✓
- [x] Step 2.2 - Собрать AAB (первая версия) ✓
- [x] Багфикс: Исправлено название "Ykjam Terjime"
- [x] Багфикс: Копирайт "© 2026 Ykjam Terjime"
- [x] Багфикс: Заголовок "Ses terjimeçi" на одной строке

## Next Steps:
- [ ] Пересобрать AAB в Android Studio
- [ ] Сделать скриншоты приложения
- [ ] Создать приложение в Google Play Console
- [ ] Заполнить Store Listing
- [ ] Загрузить AAB и создать релиз

---

## Известные проблемы

### Android 15 Edge-to-Edge (уведомление от Google Play, 2026-02-13)

**Суть:** Приложение использует устаревшие API для status bar и navigation bar, которые не поддерживаются в Android 15.

**Затронутые API:**
- `Window.getStatusBarColor` / `Window.setStatusBarColor`
- `Window.setNavigationBarColor` / `Window.getNavigationBarColor`
- `LAYOUT_IN_DISPLAY_CUTOUT_MODE_SHORT_EDGES`
- `LAYOUT_IN_DISPLAY_CUTOUT_MODE_DEFAULT`

**Источник проблемы — библиотеки (не наш код):**
| Библиотека | Текущая версия | Что вызывает |
|-----------|---------------|-------------|
| react-native | 0.81.5 | `StatusBarModule.setColor`, `WindowUtilKt` |
| react-native-screens | ~4.16.0 | `setColor`, `setNavigationBarColor` |
| expo-image-picker | ~17.0.8 | `applyWindowTheming` |
| expo-status-bar | ~3.0.8 | Управление status bar |

**Что делать:**
- [ ] Следить за обновлениями Expo SDK 55+ с поддержкой Android 15 edge-to-edge
- [ ] Когда выйдет — обновить Expo SDK и зависимости
- [ ] После обновления — пересобрать и проверить что предупреждение пропало

**Срочность:** Низкая. Это предупреждение, не блокировка. Фикс придёт от Expo/React Native.
