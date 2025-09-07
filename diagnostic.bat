@echo off
echo 🔍 Быстрая диагностика проекта - День 21
echo ========================================

echo.
echo 1️⃣ Проверка ключевых файлов...

if exist "src\data\phrases.ts" (
    echo ✅ src\data\phrases.ts
) else (
    echo ❌ ОТСУТСТВУЕТ: src\data\phrases.ts
)

if exist "src\data\categories.ts" (
    echo ✅ src\data\categories.ts
) else (
    echo ❌ ОТСУТСТВУЕТ: src\data\categories.ts
)

if exist "src\navigation\AppNavigator.tsx" (
    echo ✅ src\navigation\AppNavigator.tsx
) else (
    echo ❌ ОТСУТСТВУЕТ: src\navigation\AppNavigator.tsx
)

if exist "src\contexts\LanguageContext.tsx" (
    echo ✅ src\contexts\LanguageContext.tsx
) else (
    echo ❌ ОТСУТСТВУЕТ: src\contexts\LanguageContext.tsx
)

if exist "app.json" (
    echo ✅ app.json
) else (
    echo ❌ ОТСУТСТВУЕТ: app.json
)

if exist "package.json" (
    echo ✅ package.json
) else (
    echo ❌ ОТСУТСТВУЕТ: package.json
)

echo.
echo 2️⃣ Проверка зависимостей...

echo Проверяем основные пакеты...
call npm list @react-navigation/native >nul 2>&1
if %errorlevel% == 0 (
    echo ✅ @react-navigation/native
) else (
    echo ❌ НЕ УСТАНОВЛЕНО: @react-navigation/native
)

call npm list expo-av >nul 2>&1
if %errorlevel% == 0 (
    echo ✅ expo-av
) else (
    echo ❌ НЕ УСТАНОВЛЕНО: expo-av
)

call npm list @expo/vector-icons >nul 2>&1
if %errorlevel% == 0 (
    echo ✅ @expo/vector-icons
) else (
    echo ❌ НЕ УСТАНОВЛЕНО: @expo/vector-icons
)

echo.
echo 3️⃣ Проверка структуры проекта...

if exist "src\components" (
    echo ✅ src\components
) else (
    echo ❌ ОТСУТСТВУЕТ: src\components
)

if exist "src\screens" (
    echo ✅ src\screens
) else (
    echo ❌ ОТСУТСТВУЕТ: src\screens
)

if exist "src\hooks" (
    echo ✅ src\hooks
) else (
    echo ❌ ОТСУТСТВУЕТ: src\hooks
)

if exist "assets" (
    echo ✅ assets
) else (
    echo ❌ ОТСУТСТВУЕТ: assets
)

echo.
echo 4️⃣ Проверка содержимого...

if exist "src\data\phrases.ts" (
    for /f %%i in ('findstr /c:"id:" src\data\phrases.ts 2^>nul ^| find /c /v ""') do set phrase_count=%%i
    echo 📊 Фраз в базе: !phrase_count!
) else (
    echo ⚠️ Файл phrases.ts не найден
)

if exist "src\data\categories.ts" (
    for /f %%i in ('findstr /c:"id:" src\data\categories.ts 2^>nul ^| find /c /v ""') do set category_count=%%i
    echo 📂 Категорий в базе: !category_count!
) else (
    echo ⚠️ Файл categories.ts не найден
)

echo.
echo 5️⃣ TypeScript проверка...
echo Запуск TypeScript проверки...
call npx tsc --noEmit --skipLibCheck
if %errorlevel% == 0 (
    echo ✅ TypeScript компилируется без ошибок
) else (
    echo ⚠️ Есть TypeScript ошибки
)

echo.
echo 🎯 ИТОГОВАЯ ОЦЕНКА:
echo.
echo ✅ Если большинство пунктов зеленые - готов к релизу!
echo ⚠️ Если есть желтые - минорные проблемы
echo ❌ Если есть красные - нужно исправить

echo.
echo 🚀 Команды для исправления:
echo npm install                     # Установить зависимости
echo npx expo start                  # Запустить проект
echo.

pause