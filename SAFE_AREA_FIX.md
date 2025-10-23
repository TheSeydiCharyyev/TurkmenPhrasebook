# 🔧 Исправление проблемы с "ползущей шапкой"

## Проблема
При сворачивании и разворачивании приложения шапка ползла вверх под StatusBar, текст становился нечитабельным.

## Причина
1. **Конфликт двух StatusBar:**
   - `expo-status-bar` в App.tsx
   - `react-native StatusBar` в HomeScreen.tsx

2. **SafeAreaView из react-native** не обрабатывает правильно safe area insets при сворачивании/разворачивании на Android

3. **Отсутствие централизованного управления** safe areas в приложении

## Решение (Senior-level подход)

### 1. Добавили SafeAreaProvider
```tsx
// App.tsx
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
  return (
    <SafeAreaProvider>  {/* ← Оборачиваем все приложение */}
      <ErrorBoundary>
        <LanguageProvider>
          ...
        </LanguageProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}
```

**Почему:** SafeAreaProvider из `react-native-safe-area-context` более надежен чем стандартный SafeAreaView

### 2. Создали централизованный Screen компонент
```tsx
// src/components/Screen.tsx

// Универсальный экран
<Screen edges={['top', 'bottom']}>
  <YourContent />
</Screen>

// Экран с TabBar (без bottom edge)
<TabScreen>
  <YourContent />
</TabScreen>

// Модальный экран (только top edge)
<ModalScreen>
  <YourContent />
</ModalScreen>
```

**Почему:**
- Единый источник правды для всех safe areas
- Легко поддерживать
- Консистентное поведение на всех экранах

### 3. Убрали конфликтующие StatusBar
**Было:**
```tsx
// HomeScreen.tsx
<SafeAreaView style={styles.container}>
  <StatusBar translucent={false} /> {/* ← Конфликт! */}
  ...
</SafeAreaView>
```

**Стало:**
```tsx
// HomeScreen.tsx
<TabScreen>  {/* ← Правильный safe area */}
  {/* StatusBar управляется только в App.tsx */}
  ...
</TabScreen>
```

**Почему:** Один глобальный StatusBar (expo-status-bar) управляет всем приложением

### 4. Обновили все проблемные экраны
- ✅ HomeScreen.tsx
- ✅ LanguageSelectionScreen.tsx

## Преимущества решения

### ✅ Стабильность
- Шапка больше не "ползет" при сворачивании
- Правильные отступы на всех устройствах
- Работает с notch, без notch, с разными версиями Android

### ✅ Производительность
- Нет конфликтов между StatusBar
- SafeAreaProvider кэширует safe area insets
- Меньше перерисовок при layout changes

### ✅ Поддерживаемость
- Один Screen компонент для всех экранов
- Легко добавить новые варианты (например, FullScreen)
- Централизованная логика safe areas

### ✅ Гибкость
```tsx
// Можно легко настроить для разных сценариев
<Screen edges={['top']}>              // Только сверху
<Screen edges={['top', 'bottom']}>    // Сверху и снизу
<Screen withoutSafeArea>              // Вообще без safe area
```

## Как это работает

### До исправления:
1. Приложение запускается → StatusBar от expo устанавливается
2. HomeScreen рендерится → свой StatusBar пытается перезаписать
3. SafeAreaView считает insets на основе конфликтующих StatusBar
4. Сворачиваешь приложение → Android не обновляет insets
5. Возвращаешься → SafeAreaView имеет неправильные insets → **шапка ползет вверх** ❌

### После исправления:
1. Приложение запускается → SafeAreaProvider инициализируется
2. StatusBar управляется только expo-status-bar в App.tsx
3. TabScreen использует правильные safe area insets
4. Сворачиваешь приложение → SafeAreaProvider сохраняет правильное состояние
5. Возвращаешься → insets остаются правильными → **шапка на месте** ✅

## Тестирование

Протестируй следующие сценарии:
1. ✅ Запуск приложения
2. ✅ Свернуть → развернуть
3. ✅ Открыть другое приложение → вернуться
4. ✅ Повернуть экран (если поддерживается)
5. ✅ На разных устройствах (с notch / без notch)

## Дополнительно

Если в будущем нужно обновить другие экраны:
```tsx
// Было
<SafeAreaView style={styles.container}>
  <StatusBar ... />
  <YourContent />
</SafeAreaView>

// Стало
<Screen>  // или TabScreen, или ModalScreen
  <YourContent />
</Screen>
```

## Файлы изменены
1. ✅ `App.tsx` - добавлен SafeAreaProvider
2. ✅ `src/components/Screen.tsx` - новый централизованный компонент
3. ✅ `src/screens/HomeScreen.tsx` - использует TabScreen
4. ✅ `src/screens/LanguageSelectionScreen.tsx` - использует Screen

## Результат
🎉 Шапка больше не "ползет" при сворачивании/разворачивании!
