# Responsive Design V1 - Best Practices 2024-2025

## Цель
Обеспечить корректную работу приложения на всех размерах телефонов iOS и Android.

## Целевые устройства

### iOS
| Устройство | Размер экрана | Safe Area Top | Safe Area Bottom |
|------------|---------------|---------------|------------------|
| iPhone SE (2nd/3rd) | 375×667 | 20px (status bar) | 0px |
| iPhone 14/15 | 390×844 | 59px (Dynamic Island) | 34px |
| iPhone 14/15 Plus | 428×926 | 59px | 34px |
| iPhone 14/15 Pro | 393×852 | 59px (Dynamic Island) | 34px |
| iPhone 14/15 Pro Max | 430×932 | 59px | 34px |

### Android
| Категория | Размер экрана | Плотность | Navigation |
|-----------|---------------|-----------|------------|
| Small | 360×640 | hdpi | 3-button (48px) |
| Medium | 384×854 | xhdpi | Gesture (24px) |
| Large | 412×915 | xxhdpi | Gesture (24px) |
| XLarge | 448×998 | xxxhdpi | Gesture (24px) |

---

## Задачи реализации

### Task 1: Обновить ResponsiveUtils.ts - Reactive Dimensions

**Файл:** `src/utils/ResponsiveUtils.ts`

**Проблема:** Текущая реализация использует `Dimensions.get('window')` один раз при загрузке модуля. Размеры не обновляются при изменениях.

**Решение:** Создать React Hook `useResponsive()` с `useWindowDimensions`.

```typescript
// Новые экспорты для добавления:

import { useWindowDimensions, PixelRatio, Platform } from 'react-native';

/**
 * Hook для реактивных размеров экрана
 * Автоматически обновляется при изменении размеров окна
 */
export const useResponsive = () => {
  const { width, height } = useWindowDimensions();

  const BASE_WIDTH = 375;
  const BASE_HEIGHT = 812;

  const widthRatio = width / BASE_WIDTH;
  const heightRatio = height / BASE_HEIGHT;

  const scale = (size: number) => Math.round(PixelRatio.roundToNearestPixel(size * widthRatio));
  const verticalScale = (size: number) => Math.round(PixelRatio.roundToNearestPixel(size * heightRatio));
  const moderateScale = (size: number, factor = 0.5) => Math.round(PixelRatio.roundToNearestPixel(size + (scale(size) - size) * factor));

  // Улучшенные breakpoints для телефонов
  const deviceType = {
    isSmallPhone: width < 375,      // iPhone SE, бюджетные Android
    isMediumPhone: width >= 375 && width < 414,  // iPhone 14/15, средние Android
    isLargePhone: width >= 414,     // iPhone Pro Max, большие Android
  };

  return {
    width,
    height,
    scale,
    verticalScale,
    moderateScale,
    ...deviceType,
    isIOS: Platform.OS === 'ios',
    isAndroid: Platform.OS === 'android',
  };
};
```

---

### Task 2: Создать хук useSafeArea для Safe Areas

**Файл:** `src/hooks/useSafeArea.ts` (новый файл)

**Цель:** Централизованная работа с Safe Area Insets.

```typescript
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Platform, StatusBar } from 'react-native';

/**
 * Hook для работы с Safe Areas
 * Учитывает Dynamic Island, notch, navigation bars
 */
export const useSafeArea = () => {
  const insets = useSafeAreaInsets();

  // Android StatusBar height fallback
  const statusBarHeight = Platform.OS === 'android'
    ? StatusBar.currentHeight || 24
    : insets.top;

  return {
    // Оригинальные insets
    top: insets.top,
    bottom: insets.bottom,
    left: insets.left,
    right: insets.right,

    // Удобные значения
    statusBarHeight,

    // Минимальные отступы (для контента)
    paddingTop: Math.max(insets.top, 20),
    paddingBottom: Math.max(insets.bottom, 16),

    // Для кнопок внизу экрана (над navigation bar)
    bottomButtonPadding: insets.bottom > 0 ? insets.bottom : 16,

    // Есть ли notch/Dynamic Island
    hasNotch: insets.top > 24,

    // Есть ли gesture navigation (Android)
    hasGestureNavigation: Platform.OS === 'android' && insets.bottom > 0,
  };
};
```

---

### Task 3: Создать компонент SafeContainer

**Файл:** `src/components/SafeContainer.tsx` (новый файл)

**Цель:** Переиспользуемый контейнер с правильными Safe Areas.

```typescript
import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface SafeContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
  backgroundColor?: string;
}

/**
 * Контейнер с автоматической обработкой Safe Areas
 */
export const SafeContainer: React.FC<SafeContainerProps> = ({
  children,
  style,
  edges = ['top', 'bottom'],
  backgroundColor = '#FFFFFF',
}) => {
  const insets = useSafeAreaInsets();

  const containerStyle: ViewStyle = {
    flex: 1,
    backgroundColor,
    paddingTop: edges.includes('top') ? insets.top : 0,
    paddingBottom: edges.includes('bottom') ? insets.bottom : 0,
    paddingLeft: edges.includes('left') ? insets.left : 0,
    paddingRight: edges.includes('right') ? insets.right : 0,
  };

  return (
    <View style={[containerStyle, style]}>
      {children}
    </View>
  );
};
```

---

### Task 4: Добавить поддержку Dynamic Type (Accessibility)

**Файл:** `src/utils/ResponsiveUtils.ts` (обновление)

**Цель:** Уважать системные настройки размера шрифта.

```typescript
import { PixelRatio } from 'react-native';

/**
 * Получить системный коэффициент масштабирования шрифта
 * iOS: Dynamic Type
 * Android: Font Scale в настройках
 */
export const getFontScale = (): number => {
  return PixelRatio.getFontScale();
};

/**
 * Масштабирование шрифта с учётом accessibility
 * @param size - базовый размер шрифта
 * @param maxScale - максимальное увеличение (default: 1.3 = 130%)
 * @param minScale - минимальное уменьшение (default: 0.85 = 85%)
 */
export const accessibleFontSize = (
  size: number,
  maxScale: number = 1.3,
  minScale: number = 0.85
): number => {
  const fontScale = PixelRatio.getFontScale();
  const clampedScale = Math.min(Math.max(fontScale, minScale), maxScale);
  return Math.round(size * clampedScale);
};

/**
 * Проверка: использует ли пользователь увеличенный шрифт
 */
export const isLargeTextEnabled = (): boolean => {
  return PixelRatio.getFontScale() > 1.0;
};
```

---

### Task 5: Platform-specific стили

**Файл:** `src/utils/PlatformStyles.ts` (новый файл)

**Цель:** Утилиты для iOS/Android различий.

```typescript
import { Platform, StyleSheet } from 'react-native';

/**
 * Создать стили с учётом платформы
 */
export const createPlatformStyles = <T extends StyleSheet.NamedStyles<T>>(
  iosStyles: T,
  androidStyles: Partial<T>
): T => {
  if (Platform.OS === 'android') {
    return StyleSheet.create({
      ...iosStyles,
      ...androidStyles,
    } as T) as T;
  }
  return StyleSheet.create(iosStyles);
};

/**
 * Тени для разных платформ
 */
export const platformShadow = (elevation: number = 4) => {
  if (Platform.OS === 'ios') {
    return {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: elevation / 2 },
      shadowOpacity: 0.1 + (elevation * 0.02),
      shadowRadius: elevation,
    };
  }
  return {
    elevation,
  };
};

/**
 * Ripple effect для Android, opacity для iOS
 */
export const platformPressEffect = () => {
  if (Platform.OS === 'android') {
    return {
      android_ripple: { color: 'rgba(0, 0, 0, 0.1)' },
    };
  }
  return {
    activeOpacity: 0.7,
  };
};

/**
 * Font family по платформе
 */
export const platformFontFamily = (weight: 'regular' | 'medium' | 'bold' = 'regular') => {
  const fonts = {
    ios: {
      regular: 'System',
      medium: 'System',
      bold: 'System',
    },
    android: {
      regular: 'Roboto',
      medium: 'Roboto-Medium',
      bold: 'Roboto-Bold',
    },
  };

  return Platform.select({
    ios: { fontFamily: fonts.ios[weight] },
    android: { fontFamily: fonts.android[weight] },
  });
};
```

---

### Task 6: Обновить существующие экраны

**Приоритетные экраны для обновления:**

1. **MainHubScreen.tsx** - главный экран
2. **LanguageSelectionScreen.tsx** - выбор языка
3. **SettingsScreen.tsx** - настройки
4. **HomeScreen.tsx** - разговорник
5. **CategoryScreen.tsx** - категории фраз

**Паттерн обновления:**

```typescript
// ДО (статичные значения):
import { scale, verticalScale } from '../utils/ResponsiveUtils';

// ПОСЛЕ (реактивные значения):
import { useResponsive } from '../utils/ResponsiveUtils';
import { useSafeArea } from '../hooks/useSafeArea';

function MyScreen() {
  const { scale, verticalScale, isSmallPhone } = useResponsive();
  const { paddingTop, bottomButtonPadding } = useSafeArea();

  // Использовать в стилях
}
```

---

### Task 7: Тестирование

**Чеклист устройств для тестирования:**

#### iOS Simulator:
- [ ] iPhone SE (3rd gen) - 375×667, без notch
- [ ] iPhone 14 - 390×844, Dynamic Island
- [ ] iPhone 14 Pro Max - 430×932, Dynamic Island

#### Android Emulator:
- [ ] Pixel 4a - 393×851, маленький
- [ ] Pixel 7 - 412×915, средний
- [ ] Pixel 7 Pro - 412×892, большой

#### Проверить:
- [ ] Safe Area сверху (status bar, notch, Dynamic Island)
- [ ] Safe Area снизу (home indicator, navigation bar)
- [ ] Шрифты читаемы на маленьких экранах
- [ ] Кнопки достаточного размера для нажатия (min 44×44)
- [ ] Контент не обрезается на краях
- [ ] Accessibility: увеличенный шрифт в настройках системы

---

## Порядок выполнения

| Шаг | Задача | Файлы | Время |
|-----|--------|-------|-------|
| 1 | Обновить ResponsiveUtils.ts | `src/utils/ResponsiveUtils.ts` | 15 мин |
| 2 | Создать useSafeArea hook | `src/hooks/useSafeArea.ts` | 10 мин |
| 3 | Создать SafeContainer | `src/components/SafeContainer.tsx` | 10 мин |
| 4 | Добавить Dynamic Type | `src/utils/ResponsiveUtils.ts` | 10 мин |
| 5 | Создать PlatformStyles | `src/utils/PlatformStyles.ts` | 15 мин |
| 6 | Обновить MainHubScreen | `src/screens/MainHubScreen.tsx` | 20 мин |
| 7 | Обновить LanguageSelectionScreen | `src/screens/LanguageSelectionScreen.tsx` | 15 мин |
| 8 | Обновить SettingsScreen | `src/screens/SettingsScreen.tsx` | 15 мин |
| 9 | Обновить остальные экраны | Все screens | 30 мин |
| 10 | Тестирование | - | 30 мин |

**Общее время: ~2-3 часа**

---

## V2 (будущее)

- [ ] Tablet layouts (iPad, Android tablets)
- [ ] Landscape orientation
- [ ] Foldable devices (Samsung Fold, Pixel Fold)
- [ ] Split-screen mode
- [ ] Keyboard avoidance improvements
