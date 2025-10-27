# 🔧 Настройка Hugging Face API для AI Assistants

## 🎯 Для кого эта инструкция?
Эта настройка нужна **вам как разработчику** приложения. Конечные пользователи приложения ничего настраивать не будут - AI помощники будут работать автоматически.

---

## 📝 Шаг 1: Получить бесплатный API ключ

1. Перейдите на https://huggingface.co/
2. Нажмите **Sign Up** (если нет аккаунта) или **Log In**
3. После входа, перейдите в **Settings** (справа вверху, иконка профиля)
4. Выберите **Access Tokens** в меню слева
5. Нажмите **New token**
6. Выберите:
   - **Name:** `TurkmenPhrasebook` (или любое название)
   - **Role:** `Read` (этого достаточно)
7. Нажмите **Generate token**
8. **Скопируйте ключ** (выглядит как `hf_xxxxxxxxxxxxxxxxxxxxx`)

⚠️ **Важно:** Ключ показывается только один раз! Сохраните его.

---

## 🔐 Шаг 2: Настроить в проекте

### **Вариант 1: Для разработки (Быстрый)**

1. Откройте файл:
   ```
   src/features/ai-assistants/services/AIAssistantService.ts
   ```

2. Найдите строку 26 (там где `YOUR_HUGGINGFACE_API_KEY_HERE`)

3. Замените на ваш реальный ключ:
   ```typescript
   const HUGGINGFACE_API_KEY = 'hf_xxxxxxxxxxxxxxxxxxxxx'; // Ваш ключ
   ```

### **Вариант 2: Через .env файл (Безопасный)**

1. Откройте файл `.env` в корне проекта

2. Замените `YOUR_HUGGINGFACE_API_KEY` на ваш настоящий ключ:
   ```
   HUGGINGFACE_API_KEY=hf_xxxxxxxxxxxxxxxxxxxxx
   ```

3. Убедитесь, что `.env` добавлен в `.gitignore` (уже сделано ✅)

4. Для работы с .env в React Native/Expo нужно установить:
   ```bash
   npm install react-native-dotenv
   ```

5. Добавить в `babel.config.js`:
   ```javascript
   module.exports = function(api) {
     api.cache(true);
     return {
       presets: ['babel-preset-expo'],
       plugins: [
         ['module:react-native-dotenv', {
           moduleName: '@env',
           path: '.env',
         }]
       ]
     };
   };
   ```

6. Обновить импорт в `AIAssistantService.ts`:
   ```typescript
   import { HUGGINGFACE_API_KEY } from '@env';
   ```

---

## ✅ Шаг 3: Проверить работу

1. Запустите приложение:
   ```bash
   npm start
   ```

2. Перейдите в **Main Hub → AI Assistants**

3. Выберите любого помощника (например, General Assistant)

4. Отправьте тестовое сообщение: "Hello"

5. Если всё работает - увидите ответ от AI ✨

---

## 📊 Лимиты бесплатного API

- **Бесплатно:** 30,000 символов в месяц
- **Rate limit:** ~10 запросов в минуту
- Этого достаточно для разработки и тестирования

Если нужно больше:
- **Pro аккаунт:** $9/месяц - без лимитов
- https://huggingface.co/pricing

---

## ❓ FAQ

**Q: Что если я не хочу использовать Hugging Face?**
A: Можете использовать другие AI API:
- OpenAI GPT (платный, но качественнее)
- Google Gemini API (бесплатный лимит)
- Anthropic Claude API
- Просто обновите `AIAssistantService.ts`

**Q: Безопасно ли хранить ключ в коде?**
A: Для разработки - да. Для production - используйте вариант 2 (.env) и никогда не коммитьте `.env` в git.

**Q: Что если пользователи превысят лимит?**
A: Fallback responses автоматически включатся (уже реализовано в коде).

**Q: Можно ли вообще без API?**
A: Да, но AI помощники не будут работать. Можете оставить заглушку (locked) как Dictionary модуль.

---

## 🚀 После настройки

После настройки API ключа:
1. ✅ AI Assistants полностью функциональны
2. ✅ История диалогов сохраняется локально
3. ✅ Fallback responses при ошибках
4. ✅ Готово к production build

**Следующие шаги:**
- Тестирование на реальном устройстве
- Настройка Dictionary Placeholder
- Production Build

---

**Вопросы?** Создайте issue в репозитории проекта.
