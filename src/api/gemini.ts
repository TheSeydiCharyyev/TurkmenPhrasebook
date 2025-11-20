import { GoogleGenerativeAI } from "@google/generative-ai";
import { GEMINI_API_KEY } from "@env";

// Проверяем, что API ключ доступен
if (!GEMINI_API_KEY) {
  throw new Error("Gemini API ключ не найден. Убедитесь, что он добавлен в .env файл.");
}

// Инициализируем клиент с API ключом
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

/**
 * Отправляет промпт в модель Gemini и возвращает ответ.
 * @param prompt - Текстовый запрос для модели.
 * @returns - Текстовый ответ от модели.
 */
export async function askAI(prompt: string): Promise<string> {
  try {
    // Указываем модель, которую хотим использовать
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return text;
  } catch (error) {
    console.error("Ошибка при обращении к Gemini API:", error);
    // Возвращаем пользователю сообщение об ошибке
    return "Извините, не удалось получить ответ от ИИ. Пожалуйста, попробуйте еще раз позже.";
  }
}

// ПРИМЕР ИСПОЛЬЗОВАНИЯ В ВАШЕМ КОМПОНЕНТЕ:
/*
import React, { useState } from 'react';
import { View, TextInput, Button, Text, ActivityIndicator } from 'react-native';
import { askAI } from './api/gemini'; // Убедитесь, что путь правильный

export const AskAIScreen = () => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAskPress = async () => {
    if (!question.trim()) return;

    setIsLoading(true);
    setAnswer('');
    try {
      const aiResponse = await askAI(question);
      setAnswer(aiResponse);
    } catch (e) {
      setAnswer('Произошла ошибка. Попробуйте снова.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        placeholder="Спросите что-нибудь у ИИ..."
        value={question}
        onChangeText={setQuestion}
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
      />
      <Button title="Отправить" onPress={handleAskPress} disabled={isLoading} />
      {isLoading && <ActivityIndicator style={{ marginTop: 20 }} />}
      {answer && <Text style={{ marginTop: 20 }}>{answer}</Text>}
    </View>
  );
};
*/