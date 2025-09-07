# Скрипт быстрой диагностики для Дня 21
# Запустить в корне проекта ChinesePhrasebook2

echo "🔍 Быстрая диагностика проекта - День 21"
echo "========================================"

# 1. Проверка основных файлов
echo "1️⃣ Проверка ключевых файлов..."

required_files=(
    "src/data/phrases.ts"
    "src/data/categories.ts" 
    "src/navigation/AppNavigator.tsx"
    "src/contexts/LanguageContext.tsx"
    "src/contexts/OfflineDataContext.tsx"
    "app.json"
    "package.json"
)

for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ ОТСУТСТВУЕТ: $file"
    fi
done

echo ""

# 2. Проверка зависимостей
echo "2️⃣ Проверка зависимостей..."

required_deps=(
    "@react-navigation/native"
    "@react-navigation/bottom-tabs"
    "@react-navigation/stack"
    "expo-av"
    "@react-native-async-storage/async-storage"
    "@expo/vector-icons"
)

for dep in "${required_deps[@]}"; do
    if npm list "$dep" >/dev/null 2>&1; then
        echo "✅ $dep"
    else
        echo "❌ НЕ УСТАНОВЛЕНО: $dep"
    fi
done

echo ""

# 3. Проверка структуры папок
echo "3️⃣ Проверка структуры проекта..."

required_dirs=(
    "src/components"
    "src/screens"
    "src/hooks"
    "src/utils"
    "src/constants"
    "src/data"
    "src/types"
    "assets"
)

for dir in "${required_dirs[@]}"; do
    if [ -d "$dir" ]; then
        echo "✅ $dir"
    else
        echo "❌ ОТСУТСТВУЕТ: $dir"
    fi
done

echo ""

# 4. Проверка TypeScript компиляции
echo "4️⃣ Проверка TypeScript..."

if command -v npx >/dev/null 2>&1; then
    echo "Запуск TypeScript проверки..."
    npx tsc --noEmit --skipLibCheck 2>&1 | head -10
    
    if [ ${PIPESTATUS[0]} -eq 0 ]; then
        echo "✅ TypeScript компилируется без ошибок"
    else
        echo "⚠️ Есть TypeScript ошибки (показаны первые 10)"
    fi
else
    echo "⚠️ npx не найден, пропускаем проверку TypeScript"
fi

echo ""

# 5. Проверка содержимого ключевых файлов
echo "5️⃣ Проверка содержимого файлов..."

# Проверка phrases.ts
if [ -f "src/data/phrases.ts" ]; then
    phrase_count=$(grep -c "id:" src/data/phrases.ts 2>/dev/null || echo "0")
    echo "📊 Фраз в базе: $phrase_count"
    
    if [ "$phrase_count" -ge "150" ]; then
        echo "✅ Достаточно фраз для релиза"
    else
        echo "⚠️ Мало фраз (нужно 157, есть $phrase_count)"
    fi
fi

# Проверка categories.ts
if [ -f "src/data/categories.ts" ]; then
    category_count=$(grep -c "id:" src/data/categories.ts 2>/dev/null || echo "0")
    echo "📂 Категорий в базе: $category_count"
    
    if [ "$category_count" -ge "13" ]; then
        echo "✅ Достаточно категорий"
    else
        echo "⚠️ Мало категорий (нужно 13+, есть $category_count)"
    fi
fi

# Проверка app.json
if [ -f "app.json" ]; then
    if grep -q "version" app.json; then
        version=$(grep "version" app.json | cut -d'"' -f4)
        echo "📱 Версия приложения: $version"
    fi
    
    if grep -q "icon" app.json; then
        echo "✅ Иконка настроена в app.json"
    else
        echo "⚠️ Иконка не настроена в app.json"
    fi
fi

echo ""

# 6. Проверка assets
echo "6️⃣ Проверка ресурсов..."

if [ -d "assets" ]; then
    icon_files=($(find assets -name "*icon*.png" 2>/dev/null))
    if [ ${#icon_files[@]} -gt 0 ]; then
        echo "✅ Найдены файлы иконок:"
        for icon in "${icon_files[@]}"; do
            echo "   📎 $icon"
        done
    else
        echo "⚠️ Файлы иконок не найдены в assets/"
    fi
else
    echo "❌ Папка assets отсутствует"
fi

echo ""

# 7. Финальная оценка
echo "7️⃣ Итоговая оценка готовности..."

# Подсчет проблем
problems=0

# Критичные проверки
if [ ! -f "src/data/phrases.ts" ]; then problems=$((problems + 3)); fi
if [ ! -f "src/navigation/AppNavigator.tsx" ]; then problems=$((problems + 3)); fi
if [ ! -f "app.json" ]; then problems=$((problems + 2)); fi

# Средние проблемы
if [ ! -d "assets" ]; then problems=$((problems + 1)); fi

# Оценка готовности
if [ $problems -eq 0 ]; then
    echo "🎉 ОТЛИЧНО! Проект готов к релизу (0 проблем)"
    echo "📊 Готовность: 99-100%"
elif [ $problems -le 2 ]; then
    echo "✅ ХОРОШО! Минорные проблемы ($problems)"  
    echo "📊 Готовность: 90-98%"
elif [ $problems -le 5 ]; then
    echo "⚠️ НУЖНА РАБОТА! Есть проблемы ($problems)"
    echo "📊 Готовность: 70-89%"
else
    echo "❌ КРИТИЧНО! Много проблем ($problems)"
    echo "📊 Готовность: <70%"
fi

echo ""
echo "🚀 Команды для исправления найденных проблем:"
echo "npm install                    # Установить зависимости"
echo "npx expo start                 # Запустить проект"
echo "npx tsc --noEmit              # Проверить TypeScript"
echo ""
echo "📝 Следующие шаги:"
echo "1. Исправить критичные проблемы (если есть)"
echo "2. Запустить приложение и протестировать"
echo "3. Создать иконки с помощью генератора"
echo "4. Перейти к ПРИОРИТЕТУ 2 задач"