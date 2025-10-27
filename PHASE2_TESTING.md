# 📸 PHASE 2: VISUAL TRANSLATOR - TESTING GUIDE

**Дата завершения:** 27 октября 2024
**Статус:** ✅ Готов к тестированию

---

## 📋 ЧТО БЫЛО РЕАЛИЗОВАНО

### **1. Services (Backend)**
- ✅ **OCRService.ts** - Распознавание текста с Google ML Kit
- ✅ **TranslationService.ts** - Перевод с MyMemory API + LibreTranslate fallback
- ✅ **AIService.ts** - AI описание объектов с Hugging Face (BLIP + CLIP)

### **2. Screens (Frontend)**
- ✅ **VisualTranslatorHomeScreen.tsx** - Главный экран с камерой и галереей
- ✅ **TranslationResultScreen.tsx** - Экран результатов с TTS и действиями

### **3. Dependencies**
- ✅ `expo-camera` (17.0.8)
- ✅ `expo-image-picker` (17.0.8)
- ✅ `expo-file-system` (19.0.17)
- ✅ `@react-native-ml-kit/text-recognition` (2.0.0)
- ✅ `expo-speech` (14.0.7)

### **4. Navigation**
- ✅ MainHub → VisualTranslator интеграция
- ✅ VisualTranslator → TranslationResult навигация
- ✅ Back navigation работает корректно

---

## 🚀 КАК ЗАПУСТИТЬ

### **1. Запустить Expo Dev Server**
```bash
cd C:\Users\seydi\TurkmenPhrasebook
npx expo start
```

### **2. Запустить на устройстве**
- **Android:** Сканировать QR код в Expo Go
- **iOS:** Сканировать QR код в Expo Go
- **Web:** Нажать `w` (но Visual Translator требует нативные модули)

**ВАЖНО:** Visual Translator требует физическое устройство или эмулятор с камерой!

---

## ✅ ЧТО ТЕСТИРОВАТЬ

### **Test Case 1: Permissions**
1. Открыть MainHub
2. Нажать на "Visual Translator"
3. Проверить запрос разрешений на камеру и галерею
4. Предоставить разрешения
5. ✅ Кнопки "Take Photo" и "Choose from Gallery" активны

### **Test Case 2: OCR - Распознавание текста**
1. Нажать "Take Photo"
2. Сделать фото текста на английском языке
3. Подождать обработки (OCR + Translation)
4. Проверить результат:
   - ✅ Текст распознан правильно
   - ✅ Язык определен корректно
   - ✅ Перевод отображается

### **Test Case 3: OCR - Разные языки**
Протестировать с текстом на:
- ✅ Английском (English)
- ✅ Китайском (中文)
- ✅ Русском (Русский)
- ✅ Арабском (العربية)

### **Test Case 4: AI Description - Объект без текста**
1. Нажать "Take Photo"
2. Сфотографировать объект БЕЗ текста (еда, предмет, здание)
3. Подождать обработки (AI + Translation)
4. Проверить результат:
   - ✅ AI описание на английском
   - ✅ Перевод описания на выбранный язык
   - ✅ Категория объекта определена (food, product, etc.)

### **Test Case 5: Gallery - Выбор из галереи**
1. Нажать "Choose from Gallery"
2. Выбрать изображение с текстом
3. Проверить обработку и результат

### **Test Case 6: Result Screen - Действия**
1. После получения результата проверить:
   - ✅ Кнопка "Play" озвучивает перевод (TTS)
   - ✅ Кнопка "Copy" копирует текст в буфер
   - ✅ Кнопка "Share" открывает меню шаринга
   - ✅ Кнопка "Translate Another" возвращает на главный экран

### **Test Case 7: Error Handling**
1. Выключить интернет
2. Попробовать сделать перевод
3. Проверить:
   - ✅ Появляется сообщение об ошибке
   - ✅ Приложение не крашится

### **Test Case 8: API Fallback**
1. При проблемах с MyMemory API
2. Проверить что автоматически используется LibreTranslate

---

## 🐛 ИЗВЕСТНЫЕ ОГРАНИЧЕНИЯ

1. **OCR MODE** - В OCRService установлен `USE_MOCK = false`
   - Если ML Kit не работает, установите `USE_MOCK = true` в `OCRService.ts:9`

2. **AI API Limits**
   - Hugging Face API может быть медленным на бесплатном tier
   - Модели могут быть "загружаются" (503 статус) - подождите 30 сек и повторите

3. **MyMemory API Limits**
   - 10,000 слов/день на бесплатном плане
   - При превышении лимита автоматически используется LibreTranslate

4. **Offline Mode**
   - Visual Translator требует интернет соединение
   - OCR может работать offline, но перевод - нет

---

## 📊 МЕТРИКИ ПРОИЗВОДИТЕЛЬНОСТИ

| Операция | Ожидаемое время |
|----------|----------------|
| OCR (ML Kit) | 1-3 секунды |
| Translation (MyMemory) | 1-2 секунды |
| AI Description (Hugging Face) | 5-10 секунд (при первом запросе) |
| TTS (Expo Speech) | Мгновенно |

---

## 🔧 TROUBLESHOOTING

### Проблема: "ML Kit not implemented yet"
**Решение:**
1. Проверить что пакет установлен: `npm ls @react-native-ml-kit/text-recognition`
2. Перезапустить Metro Bundler: `npx expo start -c`
3. Если не помогает, установить `USE_MOCK = true` в OCRService

### Проблема: "Failed to translate"
**Решение:**
1. Проверить интернет соединение
2. Проверить доступность API: https://api.mymemory.translated.net/get?q=hello&langpair=en|ru

### Проблема: "AI model is loading"
**Решение:**
1. Подождать 30-60 секунд
2. Повторить запрос

### Проблема: Permissions не запрашиваются
**Решение:**
1. Переустановить приложение
2. Вручную предоставить разрешения в настройках устройства

---

## 📱 РЕКОМЕНДУЕМЫЕ ТЕСТОВЫЕ ИЗОБРАЖЕНИЯ

1. **Текст на английском:**
   - Вывески магазинов
   - Меню ресторанов
   - Дорожные знаки

2. **Текст на китайском:**
   - Упаковки товаров
   - Китайские вывески

3. **Объекты без текста:**
   - Тарелка с едой (food)
   - Футболка (clothing)
   - Здание (building)

---

## 🎯 КРИТЕРИИ УСПЕХА

Phase 2 считается успешным если:
- ✅ OCR распознает текст на 4+ языках
- ✅ Translation работает с fallback
- ✅ AI описывает объекты без текста
- ✅ TTS озвучивает переводы
- ✅ Нет критических багов
- ✅ Приложение не крашится

---

## 📞 СЛЕДУЮЩИЕ ШАГИ

После успешного тестирования Phase 2:
1. Исправить найденные баги (если есть)
2. Начать **Phase 3: Text Translator**
3. Или продолжить с **Phase 4: AI Assistants**

---

**Удачи в тестировании! 🚀**
