# ✅ PHASE 6: БРЕНДИНГ - Статус

## 📋 Обзор

**Цель:** Обновить название, bundle ID, иконку и брендинг с "Chinese Phrasebook" на "Turkmen Phrasebook"

**Приоритет:** 🟢 Опциональный (но рекомендуемый перед релизом)

**Срок:** День 5-6

---

## ✅ Что Сделано

### 1. ✅ Обновление app.json (ЗАВЕРШЕНО)

**Изменения:**
- ✅ name: "Chinese Phrasebook" → **"Turkmen Phrasebook"**
- ✅ slug: "chinese-phrasebook-tkm" → **"turkmen-phrasebook"**
- ✅ description: Обновлено на английский для 30 языков
- ✅ iOS bundleIdentifier: "chinesephrasebook" → **"turkmenphrasebook"**
- ✅ Android package: "chinesephrasebook" → **"turkmenphrasebook"**
- ✅ CFBundleDisplayName: **"Turkmen Phrasebook"**
- ✅ splash.backgroundColor: "#DC2626" → **"#10B981"** (зеленый)
- ✅ adaptiveIcon backgroundColor: "#DC2626" → **"#10B981"**
- ✅ keywords: Обновлены (добавлены: turkmen, multilingual, 30 languages)
- ✅ githubUrl: ChinesePhrasebook2 → **TurkmenPhrasebook**

**Файл:** `app.json` полностью обновлен

---

### 2. ✅ Документация и Инструкции (ЗАВЕРШЕНО)

Созданы подробные руководства:

#### 📄 ICON_DESIGN_BRIEF.md
**Содержит:**
- Технические требования (1024×1024 px)
- 3 варианта концепции дизайна
- Пошаговые инструкции для:
  - AI генерации (DALL-E, Midjourney)
  - Canva (5 минут)
  - Figma
  - Adobe Illustrator
  - Найм дизайнера (Fiverr, 99designs)
- Safe zones для iOS/Android
- Quality checklist
- Цветовая палитра (#10B981, #FFFFFF)

#### 📄 SPLASH_DESIGN_BRIEF.md
**Содержит:**
- Размеры: 1284 × 2778 px
- Layout структура
- 3 дизайн опции (минимал, паттерн, градиент)
- Canva инструкции (10 минут)
- Figma template
- Expo auto-generator опция
- Typography рекомендации
- Safe zone guide

#### 📄 GITHUB_RENAME_GUIDE.md
**Содержит:**
- Пошаговое переименование репозитория
- Обновление local git remote
- Команды для проверки
- Troubleshooting
- Поиск hardcoded references
- Чеклист после переименования

---

## 🔄 Действия для Пользователя

### Следующие Шаги (Ручные):

#### 1. 🎨 Создать Иконку

**Рекомендуемый путь (5-10 минут):**

1. Открыть **Canva.com**
2. Создать 1024 × 1024 px дизайн
3. Фон: #10B981
4. Добавить белый силуэт голубя (Elements → Search "dove")
5. Скачать PNG
6. Сохранить как:
   ```
   assets/icon.png
   assets/adaptive-icon.png
   ```

**Или использовать AI:**
- ChatGPT (DALL-E 3): Промпт из `ICON_DESIGN_BRIEF.md`
- Midjourney: `/imagine` команда готова
- Adobe Firefly

**Подробности:** См. `ICON_DESIGN_BRIEF.md`

---

#### 2. 🌟 Создать Splash Screen

**Быстрый вариант (5 минут):**

1. Canva: 1284 × 2778 px
2. Фон: #10B981
3. Загрузить созданную иконку (300×300)
4. Добавить текст "Turkmen Phrasebook"
5. Скачать → `assets/splash.png`

**Или использовать Expo auto-generator:**
```bash
npx @expo/configure-splash-screen
```

**Подробности:** См. `SPLASH_DESIGN_BRIEF.md`

---

#### 3. 🔄 Переименовать GitHub Репозиторий

**Шаги:**

1. **На GitHub.com:**
   - Settings → Danger Zone → Rename
   - Новое имя: `TurkmenPhrasebook`

2. **Локально:**
   ```bash
   git remote set-url origin https://github.com/seydicharyyev/TurkmenPhrasebook.git
   git remote -v  # Проверить
   ```

3. **Опционально - Переименовать папку:**
   ```bash
   cd C:\Users\seydi
   ren ChinesePhrasebook2 TurkmenPhrasebook
   ```

**Подробности:** См. `GITHUB_RENAME_GUIDE.md`

---

## 📊 Прогресс Phase 6

```
✅ app.json обновлен           [100%] DONE
✅ Документация создана        [100%] DONE
🔲 Иконка создана              [  0%] TODO
🔲 Splash screen создан        [  0%] TODO
🔲 GitHub переименован          [  0%] TODO
🔲 Git remote обновлен         [  0%] TODO

Общий прогресс Phase 6:  33% (2/6 задач)
```

---

## ✅ Финальный Чеклист Phase 6

Перед переходом к Phase 7 (тестирование):

- [x] `app.json` обновлён (название, bundle ID, цвета)
- [x] Инструкции по иконке созданы
- [x] Инструкции по splash созданы
- [x] Инструкции по GitHub созданы
- [ ] Иконка создана и размещена в `assets/icon.png`
- [ ] Adaptive icon создан в `assets/adaptive-icon.png`
- [ ] Splash screen создан в `assets/splash.png`
- [ ] GitHub репозиторий переименован
- [ ] Git remote обновлён
- [ ] Проверено: `npx expo start --clear` показывает новую иконку

---

## 🎯 После Завершения Phase 6

### Тестирование Брендинга:

```bash
# Очистить кэш
npx expo start --clear

# Проверить в Expo Go
# - Новое название приложения
# - Новая иконка
# - Новый splash screen (зеленый фон)

# Собрать preview build
eas build --platform android --profile preview

# Установить APK на устройство
# Проверить:
# - Иконка в лаунчере
# - Название приложения
# - Splash screen при запуске
```

### Коммит Изменений:

```bash
git add .
git commit -m "feat: rebrand to Turkmen Phrasebook (Phase 6)

- Updated app.json with new name and bundle IDs
- Changed theme colors from red to green (#10B981)
- Updated branding for 30 language support
- Added icon, splash, and GitHub rename guides
- Bundle ID: turkmenphrasebook (was chinesephrasebook)

Phase 6: Branding complete"

git push origin main
```

---

## 📅 Следующая Фаза

### PHASE 7: ТЕСТИРОВАНИЕ (День 6-7)

**Задачи:**
1. Функциональное тестирование
2. Тестирование на устройствах
3. Performance testing
4. Проверка всех 3 языков (zh, ru, en)
5. Аудио тестирование (MP3 + TTS)
6. Навигация и UX

**Критерии готовности к Phase 7:**
- Phase 6 полностью завершена
- Иконка и splash созданы
- Брендинг обновлен
- GitHub переименован
- Все компилируется без ошибок

---

## 🎨 Цветовая Схема (Справка)

```
Основной зеленый:    #10B981  (Turkmen flag, splash, icon bg)
Белый:               #FFFFFF  (Text, dove, icons)
Темный текст:        #111827  (App content)
Золотой акцент:      #F59E0B  (Optional decorations)
Фон серый:           #F9FAFB  (Cards, containers)
```

---

## 📞 Помощь

**Вопросы по иконке:**
- См. `ICON_DESIGN_BRIEF.md` секция "Quick Start"
- Используйте Canva для быстрого результата

**Вопросы по splash:**
- См. `SPLASH_DESIGN_BRIEF.md` секция "Quick Start"
- Expo может auto-generate из иконки

**Вопросы по GitHub:**
- См. `GITHUB_RENAME_GUIDE.md` секция "Troubleshooting"

**Контакт:** seydicharyev@icloud.com

---

## 🚀 Быстрый Старт для Пользователя

**Если нужно завершить Phase 6 за 30 минут:**

1. **Иконка (10 мин):**
   - Canva → 1024×1024 → #10B981 фон → белый голубь → Download
   - Сохранить как `assets/icon.png` и `assets/adaptive-icon.png`

2. **Splash (10 мин):**
   - Canva → 1284×2778 → #10B981 фон → иконка + текст → Download
   - Сохранить как `assets/splash.png`

3. **GitHub (5 мин):**
   - GitHub Settings → Rename → `TurkmenPhrasebook`
   - Локально: `git remote set-url origin https://...`

4. **Тест (5 мин):**
   ```bash
   npx expo start --clear
   ```

**ГОТОВО! Phase 6 завершена 🎉**

---

**Создано:** 2025-10-25
**Статус:** ✅ Инструкции готовы, ожидается выполнение пользователем
