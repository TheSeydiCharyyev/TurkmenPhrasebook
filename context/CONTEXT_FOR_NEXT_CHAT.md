# 🔄 Процесс синхронизации фраз с озвучкой

## 📋 Контекст проекта

**Проект:** Chinese Phrasebook  
**Задача:** Синхронизация фраз в `phrases.ts` с озвученными MP3 файлами

### Проблема:
- В `phrases.ts` было больше фраз чем озвучено
- ID фраз были не по порядку (phrase_016, phrase_421, phrase_157 и т.д.)
- Туркменские переводы в некоторых фразах отличались от озвучки

### Решение:
Обновление категорий постепенно на основе Word файлов с озвученными фразами

---

## 🎯 Рабочий процесс

### Шаг 1: Получение данных
Пользователь присылает:
1. **Текущие фразы** из `phrases.ts` для категории
2. **Word файл** с озвученными фразами

### Шаг 2: Формат Word файла
```
**1.** 你好 | Привет | Salam
**2.** 谢谢 | Спасибо | Sag bol
**3.** 再见 | До свидания | Hoş gal
...
```

**Формат:** `Номер. Китайский | Русский | Туркменский`

### Шаг 3: Обработка
1. Сравниваю фразы **по китайскому тексту**
2. Беру **пиньинь** из старого phrases.ts
3. Беру **русский и туркменский** из Word файла (озвучка)
4. Удаляю фразы которых нет в озвучке
5. Обновляю туркменские переводы согласно озвучке
6. **Пересчитываю ID последовательно** начиная с правильного номера

### Шаг 4: ID фраз по категориям

**ВАЖНО:** ID должны идти последовательно, счётчик НЕ сбрасывается!

```
Category 1 (Greetings): phrase_001 - phrase_027 (27 фраз)
Category 2 (Emergency): phrase_028 - phrase_038 (11 фраз)
Category 3 (Hotel): phrase_039 - phrase_050 (12 фраз)
Category 4 (Food): phrase_051 - phrase_093 (43 фразы)
...
```

### Шаг 5: Формат аудио путей
```typescript
audioFileTurkmen: "1. Greetings/turkmen/1.1.mp3"
audioFileTurkmen: "2. Emergency/turkmen/2.5.mp3"
audioFileTurkmen: "3. Hotel/turkmen/3.12.mp3"
```

**Паттерн:** `{CategoryNum}. {CategoryName}/turkmen/{CategoryNum}.{FileNum}.mp3`

### Шаг 6: Результат
Возвращаю готовый TypeScript код без объяснений - пользователь просит сразу артефакт

---

## ✅ Выполненные категории

### 1. Greetings ✅
- **Было:** 36 фраз (ID: phrase_001, phrase_002, ..., phrase_421, phrase_447...)
- **Стало:** 27 фраз (ID: phrase_001 - phrase_027)
- **Файлы:** 1.1.mp3 - 1.27.mp3
- **Статус:** Готово

### 2. Emergency ✅
- **Было:** 13 фраз (ID: phrase_016, phrase_154, phrase_349...)
- **Стало:** 11 фраз (ID: phrase_028 - phrase_038)
- **Файлы:** 2.1.mp3 - 2.11.mp3
- **Статус:** Готово

### 3. Hotel ✅
- **Было:** 14 фраз (ID: phrase_026, phrase_351...)
- **Стало:** 12 фраз (ID: phrase_039 - phrase_050)
- **Файлы:** 3.1.mp3 - 3.12.mp3
- **Статус:** Готово

---

## ⏳ Оставшиеся категории

### Нужно обновить (есть расхождения):

4. **Food**: 47 фраз → 43 файла (ID начнётся с phrase_051)
5. **Time**: 31 фраз → 29 файлов
6. **Business**: 12 фраз → 11 файлов
7. **Body**: 7 фраз → 8 файлов (нужно добавить 1 фразу)

### Уже совпадают (не трогать):

- Shopping: 16 фраз = 16 файлов ✅
- Transport: 14 фраз = 14 файлов ✅
- Directions: 10 фраз = 10 файлов ✅
- Health: 12 фраз = 12 файлов ✅
- Communication: 4 фразы = 4 файла ✅
- Entertainment: 10 фраз = 10 файлов ✅
- Numbers: 20 фраз = 20 файлов ✅
- Weather: 8 фраз = 8 файлов ✅
- Personal_info: 18 фраз = 18 файлов ✅
- Measurements: 8 фраз = 8 файлов ✅
- Colors: 10 фраз = 10 файлов ✅
- Home: 6 фраз = 6 файлов ✅

---

## 📊 Статистика аудио файлов

```
1. Greetings: 27 файлов
2. Emergency: 11 файлов
3. Hotel: 12 файлов
4. Food: 43 файла
5. Shopping: 16 файлов
6. Transport: 14 файлов
7. Directions: 10 файлов
8. Health: 12 файлов
9. Money: 9 файлов
10. Communication: 4 файла
11. Entertainment: 10 файлов
12. Time: 29 файлов
13. Numbers: 20 файлов
14. Weather: 8 файлов
15. Personal_info: 18 файлов
16. Business: 11 файлов
17. Measurements: 8 файлов
18. Colors: 10 файлов
19. Body: 8 файлов
20. Home: 6 файлов

ИТОГО: 286 файлов (Customs и Sport не используются)
```

---

## 🔧 Технические детали

### Структура фразы:
```typescript
{
  id: "phrase_001",
  categoryId: "greetings",
  chinese: "你好",
  pinyin: "nǐ hǎo",
  russian: "Привет",
  turkmen: "Salam",
  audioFileTurkmen: "1. Greetings/turkmen/1.1.mp3",
}
```

### Маппинг categoryId:
```
greetings → 1. Greetings
emergency → 2. Emergency
hotel → 3. Hotel
food → 4. Food
shopping → 5. Shopping
transport → 6. Transport
directions → 7. Directions
health → 8. Health
money → 9. Money
communication → 10. Communication
entertainment → 11. Entertainment
time → 12. Time
numbers → 13. Numbers
weather → 14. Weather
personal_info → 15. Personal_info
business → 16. Business
measurements → 17. Measurements
colors → 18. Colors
body → 19. Body
home → 20. Home
```

---

## 📝 Следующий шаг

**Ожидаем категорию #4: Food**

- Текущий последний ID: phrase_050
- Следующий ID начнётся: phrase_051
- Ожидаемых фраз: 43
- Файлов: 4.1.mp3 - 4.43.mp3

---

## 💡 Важные правила

1. **НЕ объяснять** - сразу возвращать готовый код
2. **ID последовательно** - продолжать нумерацию
3. **Пиньинь** - брать из старого phrases.ts
4. **Переводы** - брать из Word файла (это озвучка)
5. **Китайский текст** - ключ для сопоставления
6. **Удалять** фразы которых нет в Word файле

---

## 🎯 Формат ответа

Просто артефакт с кодом:
```typescript
// Category X: Name - N phrases (ОБНОВЛЕНО)
{
  id: "phrase_XXX",
  categoryId: "...",
  chinese: "...",
  pinyin: "...",
  russian: "...",
  turkmen: "...",
  audioFileTurkmen: "...",
},
...
```

Никаких объяснений, анализа, статистики - только код!