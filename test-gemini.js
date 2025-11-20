/**
 * Тестовый скрипт для проверки Gemini API
 * Запуск: node test-gemini.js
 */

const { GoogleGenerativeAI } = require("@google/generative-ai");

// Замените на ваш API ключ
const API_KEY = "***REDACTED***";

console.log("🔍 Проверка Gemini API...");
console.log("API Key:", API_KEY ? API_KEY.substring(0, 20) + "..." : "НЕ НАЙДЕН");
console.log("");

async function testGeminiAPI() {
  try {
    const genAI = new GoogleGenerativeAI(API_KEY);

    console.log("📋 Попытка получить список доступных моделей...");

    // Попробуем разные варианты моделей (новые версии 2025)
    const modelsToTry = [
      "gemini-2.5-flash",
      "gemini-2.0-flash",
      "gemini-1.5-flash",
      "gemini-1.5-pro",
      "gemini-pro",
    ];

    for (const modelName of modelsToTry) {
      try {
        console.log(`\n🧪 Тестируем модель: ${modelName}`);
        const model = genAI.getGenerativeModel({ model: modelName });

        const result = await model.generateContent("Hello, say hi!");
        const response = await result.response;
        const text = response.text();

        console.log(`✅ УСПЕХ! Модель ${modelName} работает!`);
        console.log(`Ответ: ${text.substring(0, 100)}...`);
        console.log("\n🎉 Используйте эту модель в приложении!");
        return modelName;
      } catch (error) {
        console.log(`❌ ${modelName}: ${error.message.substring(0, 100)}...`);
      }
    }

    console.log("\n❌ Ни одна модель не работает!");
    console.log("\n💡 Возможные решения:");
    console.log("1. Создайте новый API ключ на: https://aistudio.google.com/app/apikey");
    console.log("2. Убедитесь, что Gemini API доступен в вашем регионе");
    console.log("3. Проверьте, что это ключ от Google AI Studio, а не Google Cloud");

  } catch (error) {
    console.error("❌ Критическая ошибка:", error.message);
  }
}

testGeminiAPI();
