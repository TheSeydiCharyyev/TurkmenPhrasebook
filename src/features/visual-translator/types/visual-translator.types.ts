// src/features/visual-translator/types/visual-translator.types.ts
// TypeScript типы для Visual Translator модуля

/**
 * OCR Engine типы
 */
export enum OCREngine {
  ML_KIT = 'ml_kit',                    // Google ML Kit (offline, бесплатно)
  OCR_SPACE = 'ocr_space',              // OCR.space API (online, бесплатно)
  GOOGLE_VISION = 'google_vision',      // Google Cloud Vision (online, премиум)
}

/**
 * Информация о OCR движке
 */
export interface OCREngineInfo {
  id: OCREngine;
  name: string;
  description: string;
  icon: string;
  isOnline: boolean;
  isPremium: boolean;
  isAvailable: boolean;                 // Доступен ли в текущем окружении
  requiresApiKey?: boolean;
}

/**
 * Результат OCR распознавания текста
 */
export interface OCRResult {
  text: string;                // Распознанный текст
  language: string;            // Обнаруженный язык (ISO код)
  confidence: number;          // Уверенность распознавания (0-1)
  boundingBox?: BoundingBox;   // Общая область текста
  blocks?: TextBlock[];        // Блоки текста
  engine: OCREngine;           // Какой движок использовался
}

/**
 * Блок текста (параграф)
 */
export interface TextBlock {
  text: string;
  boundingBox: BoundingBox;
  lines: TextLine[];
  confidence?: number;
}

/**
 * Строка текста
 */
export interface TextLine {
  text: string;
  boundingBox: BoundingBox;
  elements: TextElement[];
  confidence?: number;
}

/**
 * Элемент текста (слово или символ)
 */
export interface TextElement {
  text: string;
  boundingBox: BoundingBox;
  confidence?: number;
}

/**
 * Прямоугольная область на изображении
 */
export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * AI описание изображения
 */
export interface AIDescription {
  description: string;                           // Текстовое описание объекта
  category: ImageCategory;                       // Категория изображения
  confidence: number;                            // Уверенность (0-1)
  tags?: string[];                               // Дополнительные теги
}

/**
 * Категории изображений
 */
export type ImageCategory =
  | 'food'        // Еда
  | 'clothing'    // Одежда
  | 'document'    // Документ
  | 'sign'        // Вывеска/знак
  | 'product'     // Товар
  | 'nature'      // Природа
  | 'building'    // Здание
  | 'person'      // Человек
  | 'other';      // Другое

/**
 * Результат перевода
 */
export interface TranslationResult {
  originalText: string;                          // Исходный текст
  translatedText: string;                        // Переведенный текст
  sourceLanguage: string;                        // Исходный язык (ISO код)
  targetLanguage: string;                        // Целевой язык (ISO код)
  aiDescription?: AIDescription;                 // AI описание (если текста не было)
  timestamp: number;                             // Время создания
  imageUri?: string;                             // URI изображения
  method: 'ocr' | 'ai-description';             // Метод получения текста
}

/**
 * История переводов Visual Translator
 */
export interface VisualTranslatorHistory {
  id: string;                                    // Уникальный ID
  result: TranslationResult;                     // Результат перевода
  savedAt: number;                               // Время сохранения
  isFavorite?: boolean;                          // Избранное
}

/**
 * Настройки камеры
 */
export interface CameraSettings {
  flashMode: 'on' | 'off' | 'auto';             // Режим вспышки
  quality: number;                               // Качество изображения (0-1)
  ratio?: string;                                // Соотношение сторон
}

/**
 * Состояние обработки изображения
 */
export interface ProcessingState {
  isProcessing: boolean;
  currentStep: ProcessingStep;
  progress: number;                              // Прогресс (0-100)
  error?: string;
}

/**
 * Шаги обработки
 */
export type ProcessingStep =
  | 'idle'
  | 'capturing'
  | 'ocr'
  | 'translation'
  | 'ai-analysis'
  | 'completed'
  | 'error';

/**
 * Параметры для Translation API
 */
export interface TranslationAPIParams {
  text: string;
  fromLang: string;
  toLang: string;
  apiKey?: string;
}

/**
 * Ответ от MyMemory API
 */
export interface MyMemoryResponse {
  responseData: {
    translatedText: string;
    match: number;
  };
  responseStatus: number;
  responseDetails: string;
  matches?: Array<{
    id: string;
    segment: string;
    translation: string;
    source: string;
    target: string;
    quality: string;
    reference: string;
    'usage-count': number;
    subject: string;
    'created-by': string;
    'last-updated-by': string;
    'create-date': string;
    'last-update-date': string;
    match: number;
  }>;
}

/**
 * Ответ от LibreTranslate API
 */
export interface LibreTranslateResponse {
  translatedText: string;
  detectedLanguage?: {
    confidence: number;
    language: string;
  };
}

/**
 * Ответ от Hugging Face (BLIP - описание изображения)
 */
export interface HuggingFaceBLIPResponse {
  generated_text?: string;
  error?: string;
}

/**
 * Ответ от Hugging Face (CLIP - категоризация)
 */
export interface HuggingFaceCLIPResponse {
  label: string;
  score: number;
}

/**
 * Параметры навигации для Visual Translator экранов
 */
export type VisualTranslatorStackParamList = {
  VisualTranslatorHome: undefined;
  Camera: { targetLanguage: string };
  TranslationResult: { result: TranslationResult };
};
