// src/contexts/LanguageContext.tsx - ИСПРАВЛЕНО с правильными заголовками

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const APP_LANGUAGE_KEY = 'chinese_phrasebook_app_language';
const LANGUAGE_VERSION = '1.0';

export type AppLanguageMode = 'tk' | 'zh' | 'ru' | 'en' | 'tr' | 'de' | 'fr' | 'es' | 'it' | 'pt' | 'nl' | 'pl' | 'uk' | 'ja' | 'ko' | 'th' | 'vi' | 'id' | 'ms' | 'hi' | 'ur' | 'fa' | 'ps' | 'uz' | 'kk' | 'az' | 'ky' | 'tg' | 'hy' | 'ka' | 'ar';

export interface AppLanguageConfig {
  mode: AppLanguageMode;
  primaryLanguage: 'tk' | 'zh';
  learningLanguage: 'zh' | 'tk';
  helperLanguage: 'ru';
  version: string;
}

export interface InterfaceTexts {
  // Общие
  home: string;
  search: string;
  favorites: string;
  settings: string;
  additionalFeatures: string;
  statistics: string;

  // Главный экран
  appTitle: string;
  appSubtitle: string; // ✅ ДОБАВЛЕНО: подзаголовок с языками
  selectCategory: string;
  recentlyStudied: string;
  study: string;

  // Main Hub Modules
  phrasebookTitle: string;
  phrasebookSubtitle: string;
  visualTranslatorTitle: string;
  visualTranslatorSubtitle: string;
  textTranslatorTitle: string;
  textTranslatorSubtitle: string;
  dictionaryTitle: string;
  dictionarySubtitle: string;
  aiAssistantsTitle: string;
  aiAssistantsSubtitle: string;
  myFavoritesTitle: string;
  myFavoritesSubtitle: string;
  
  // Детальный экран
  pronunciation: string;
  addToFavorites: string;
  inFavorites: string;
  share: string;
  
  // Настройки
  settingsTitle: string;
  languageInterface: string;
  switchLanguage: string;
  audio: string;
  soundEffects: string;
  data: string;
  clearHistory: string;
  offlineMode: string;
  about: string;
  feedback: string;
  
  // Поиск
  searchPlaceholder: string;
  noResults: string;
  searchHistory: string;
  
  // Общие действия
  cancel: string;
  save: string;
  delete: string;
  confirm: string;
  loading: string;
  error: string;
  success: string;

  // Visual Translator - Home Screen
  vtTranslateWithAI: string;
  vtCameraSubtitle: string;
  vtTakePhoto: string;
  vtChooseGallery: string;
  vtProcessing: string;
  vtProcessingSubtext: string;
  vtOcrEngine: string;
  vtFeatures: string;
  vtFeatureOcrTitle: string;
  vtFeatureOcrDesc: string;
  vtFeatureAiTitle: string;
  vtFeatureAiDesc: string;
  vtFeatureSmartTitle: string;
  vtFeatureSmartDesc: string;
  vtFeatureSaveTitle: string;
  vtFeatureSaveDesc: string;
  vtPermissionsText: string;
  vtGrantPermissions: string;
  vtRequestingPermissions: string;
  vtAutoFallback: string;

  // Visual Translator - Result Screen
  vtResult: string;
  vtRecognizedText: string;
  vtLanguageLabel: string;
  vtAiAnalysis: string;
  vtTranslation: string;
  vtTargetLabel: string;
  vtPlay: string;
  vtStop: string;
  vtCopy: string;
  vtTranslateAnother: string;
  vtCopied: string;
  vtCopiedMessage: string;

  // Text Translator
  ttHeaderTitle: string;
  ttHeroTitle: string;
  ttHeroSubtitle: string;
  ttSelectLanguage: string;
  ttPlaceholder: string;
  ttClear: string;
  ttTranslate: string;
  ttTranslating: string;
  ttPlay: string;
  ttStop: string;
  ttCopy: string;
  ttEmptyOutput: string;
  ttSourceLanguage: string;
  ttTargetLanguage: string;
  ttErrorTitle: string;
  ttErrorEmptyText: string;
  ttErrorTranslationFailed: string;
  ttErrorNoInternet: string;
  ttErrorTextTooLong: string;
  ttCopiedTitle: string;
  ttCopiedMessage: string;
  ttInfoTitle: string;
  ttInfoCannotSwap: string;
}

// ✅ ИСПРАВЛЕНО: Правильные заголовки согласно требованиям
const INTERFACE_TEXTS: Record<AppLanguageMode, InterfaceTexts> = {
  tk: {
    // Туркменский режим: туркмен изучает китайский
    home: 'Baş sahypa',
    search: 'Gözleg',
    favorites: 'Halanýanlar',
    settings: 'Sazlamalar',
    additionalFeatures: 'Goşmaça mümkinçilikler',
    statistics: 'Statistika',
    
    // ✅ ИСПРАВЛЕНО: Правильный заголовок для туркменского интерфейса
    appTitle: 'TÜRKMEN SÖHBETDEŞLIK PROGRAMMASY',
    appSubtitle: 'Dil öwrenmek üçin ähli gurallary',
    selectCategory: 'Kategoriýa saýlaň',
    recentlyStudied: 'Soňky öwrenilen',
    study: 'Okuw',

    // Main Hub Modules
    phrasebookTitle: 'Gepleşik kitaby',
    phrasebookSubtitle: '22 kategoriýada 305 söz düzümi',
    visualTranslatorTitle: 'Wizual terjimeçi',
    visualTranslatorSubtitle: 'Kamera bilen teksti skanirleme',
    textTranslatorTitle: 'Tekst terjimeçi',
    textTranslatorSubtitle: 'Teksti ýazmak we terjime etmek',
    dictionaryTitle: 'Sözlük',
    dictionarySubtitle: 'v2.0-de çykar',
    aiAssistantsTitle: 'AI kömekçiler',
    aiAssistantsSubtitle: 'Akylly maslahatlar we goldaw',
    myFavoritesTitle: 'Halanýanlarym',
    myFavoritesSubtitle: 'Saklan maglumatlar',
    
    pronunciation: 'Aýdylyş',
    addToFavorites: 'Halanýanlara goş',
    inFavorites: 'Halanýanlarda',
    share: 'Paýlaş',
    
    settingsTitle: '⚙️ Sazlamalar',
    languageInterface: 'Interfeýs dili',
    switchLanguage: 'Dil çalyş',
    audio: 'Audio',
    soundEffects: 'Ses effektleri',
    data: 'Maglumatlar',
    clearHistory: 'Taryhy arassala',
    offlineMode: 'Oflaýn režim',
    about: 'Programma hakda',
    feedback: 'Pikir alyşmak',
    
    searchPlaceholder: 'Islendik dilde sözlem giriziň...',
    noResults: 'Hiç zat tapylmady',
    searchHistory: 'Gözleg taryhy',
    
    cancel: 'Ýatyr',
    save: 'Ýatda sakla',
    delete: 'Arassala',
    confirm: 'Tassykla',
    loading: 'Ýüklenýär...',
    error: 'Ýalňyş',
    success: 'Üstünlik',

    // Visual Translator - Home Screen
    vtTranslateWithAI: 'AI bilen terjime et',
    vtCameraSubtitle: 'Kamerany islendik tekste gönükdiriň we dessine terjimesini alyň',
    vtTakePhoto: 'Surat çek',
    vtChooseGallery: 'Galereýadan saýla',
    vtProcessing: 'Surat işlenýär...',
    vtProcessingSubtext: 'Tekst tanalyp we terjime edilýär',
    vtOcrEngine: 'OCR hereketlendirijisi',
    vtFeatures: 'Mümkinçilikler',
    vtFeatureOcrTitle: 'OCR Tekst tanama',
    vtFeatureOcrDesc: '30+ dilde teksti ýokary takyklyk bilen tanaýar',
    vtFeatureAiTitle: 'AI Obýekt düşündirişi',
    vtFeatureAiDesc: 'Tekst tapylmadyk halatynda obýektleri düşündirýär',
    vtFeatureSmartTitle: 'Akylly terjime',
    vtFeatureSmartDesc: 'AI tarapyndan goldanýan kontekste esasly terjime',
    vtFeatureSaveTitle: 'Sakla we paýlaş',
    vtFeatureSaveDesc: 'Terjimeleri halanýanlara saklaň we beýlekiler bilen paýlaşyň',
    vtPermissionsText: 'Bu aýratynlygy ulanmak üçin kamera we surat galereýasy rugsatlary gerek',
    vtGrantPermissions: 'Rugsat ber',
    vtRequestingPermissions: 'Rugsat soralyýar...',
    vtAutoFallback: 'Saýlanan hereketlendiriji şowsuz bolan halatynda awto-yza gaýtma işjeňleşdirildi',

    // Visual Translator - Result Screen
    vtResult: 'Netije',
    vtRecognizedText: 'Tanalyan tekst',
    vtLanguageLabel: 'Dil: ',
    vtAiAnalysis: 'AI derňewi',
    vtTranslation: 'Terjime',
    vtTargetLabel: 'Niýetlenen: ',
    vtPlay: 'Diňle',
    vtStop: 'Dur',
    vtCopy: 'Göçür',
    vtTranslateAnother: 'Başga terjime et',
    vtCopied: 'Göçürildi',
    vtCopiedMessage: 'Terjime alyş-çalyş paneline göçürildi',

    // Text Translator
    ttHeaderTitle: 'Tekst terjimeçi',
    ttHeroTitle: 'Dessine terjime',
    ttHeroSubtitle: 'Islendik teksti ýazyň we 100+ diliň arasynda terjime ediň',
    ttSelectLanguage: 'Saýla',
    ttPlaceholder: 'Terjime etmek üçin tekst giriziň...',
    ttClear: 'Arassala',
    ttTranslate: 'Terjime et',
    ttTranslating: 'Terjime edilýär...',
    ttPlay: 'Diňle',
    ttStop: 'Dur',
    ttCopy: 'Göçür',
    ttEmptyOutput: 'Terjime şu ýerde görkeziler',
    ttSourceLanguage: 'Çeşme dili',
    ttTargetLanguage: 'Niýetlenen dili',
    ttErrorTitle: 'Ýalňyş',
    ttErrorEmptyText: 'Terjime etmek üçin tekst giriziň',
    ttErrorTranslationFailed: 'Terjime şowsuz boldy. Gaýtadan synanyşyň.',
    ttErrorNoInternet: 'Internet baglanyşygy ýok. Baglanyşygyňyzy barlap gaýtadan synanyşyň.',
    ttErrorTextTooLong: 'Tekst gaty uzyn. Iň köp 5000 simwol.',
    ttCopiedTitle: '✅ Göçürildi',
    ttCopiedMessage: 'Terjime alyş-çalyş paneline göçürildi',
    ttInfoTitle: 'Maglumat',
    ttInfoCannotSwap: 'Awto Anykla saýlanda çalyş mümkin däl',
  },
  
  zh: {
    // Китайский режим: китаец изучает туркменский
    home: '主页',
    search: '搜索',
    favorites: '收藏',
    settings: '设置',
    additionalFeatures: '其他功能',
    statistics: '统计',
    
    // ✅ ИСПРАВЛЕНО: Правильный заголовок для китайского интерфейса
    appTitle: '土库曼语学习应用',
    appSubtitle: '语言学习的所有工具',
    selectCategory: '选择类别',
    recentlyStudied: '最近学习',
    study: '学习',

    // Main Hub Modules
    phrasebookTitle: '常用语手册',
    phrasebookSubtitle: '22个类别中的305个短语',
    visualTranslatorTitle: '图像翻译',
    visualTranslatorSubtitle: '用相机扫描文本',
    textTranslatorTitle: '文本翻译',
    textTranslatorSubtitle: '输入并翻译文本',
    dictionaryTitle: '词典',
    dictionarySubtitle: 'v2.0推出',
    aiAssistantsTitle: 'AI助手',
    aiAssistantsSubtitle: '智能提示和支持',
    myFavoritesTitle: '我的收藏',
    myFavoritesSubtitle: '保存的内容',
    
    pronunciation: '发音',
    addToFavorites: '添加到收藏',
    inFavorites: '在收藏中',
    share: '分享',
    
    settingsTitle: '⚙️ 设置',
    languageInterface: '界面语言',
    switchLanguage: '切换语言',
    audio: '音频',
    soundEffects: '音效',
    data: '数据',
    clearHistory: '清除历史',
    offlineMode: '离线模式',
    about: '关于应用',
    feedback: '反馈',
    
    searchPlaceholder: '输入任何语言的短语搜索...',
    noResults: '未找到结果',
    searchHistory: '搜索历史',

    cancel: '取消',
    save: '保存',
    delete: '删除',
    confirm: '确认',
    loading: '加载中...',
    error: '错误',
    success: '成功',

    // Visual Translator - Home Screen
    vtTranslateWithAI: 'AI智能翻译',
    vtCameraSubtitle: '将相机对准任何文本即可获得即时翻译',
    vtTakePhoto: '拍照',
    vtChooseGallery: '从图库选择',
    vtProcessing: '处理图像中...',
    vtProcessingSubtext: '识别文本并翻译',
    vtOcrEngine: 'OCR引擎',
    vtFeatures: '功能',
    vtFeatureOcrTitle: 'OCR文字识别',
    vtFeatureOcrDesc: '高精度识别30+种语言的文本',
    vtFeatureAiTitle: 'AI物体描述',
    vtFeatureAiDesc: '未找到文本时描述物体',
    vtFeatureSmartTitle: '智能翻译',
    vtFeatureSmartDesc: 'AI驱动的上下文感知翻译',
    vtFeatureSaveTitle: '保存和分享',
    vtFeatureSaveDesc: '将翻译保存到收藏并与他人分享',
    vtPermissionsText: '使用此功能需要相机和照片库权限',
    vtGrantPermissions: '授予权限',
    vtRequestingPermissions: '请求权限中...',
    vtAutoFallback: '如果所选引擎失败，自动回退已启用',

    // Visual Translator - Result Screen
    vtResult: '结果',
    vtRecognizedText: '识别的文本',
    vtLanguageLabel: '语言: ',
    vtAiAnalysis: 'AI分析',
    vtTranslation: '翻译',
    vtTargetLabel: '目标: ',
    vtPlay: '播放',
    vtStop: '停止',
    vtCopy: '复制',
    vtTranslateAnother: '翻译另一个',
    vtCopied: '已复制',
    vtCopiedMessage: '翻译已复制到剪贴板',

    // Text Translator
    ttHeaderTitle: '文本翻译',
    ttHeroTitle: '即时翻译',
    ttHeroSubtitle: '输入任何文本，在100多种语言之间进行翻译',
    ttSelectLanguage: '选择',
    ttPlaceholder: '输入要翻译的文本...',
    ttClear: '清除',
    ttTranslate: '翻译',
    ttTranslating: '翻译中...',
    ttPlay: '播放',
    ttStop: '停止',
    ttCopy: '复制',
    ttEmptyOutput: '翻译将显示在这里',
    ttSourceLanguage: '源语言',
    ttTargetLanguage: '目标语言',
    ttErrorTitle: '错误',
    ttErrorEmptyText: '请输入要翻译的文本',
    ttErrorTranslationFailed: '翻译失败。请重试。',
    ttErrorNoInternet: '无网络连接。请检查连接后重试。',
    ttErrorTextTooLong: '文本太长。最多5000个字符。',
    ttCopiedTitle: '✅ 已复制',
    ttCopiedMessage: '翻译已复制到剪贴板',
    ttInfoTitle: '信息',
    ttInfoCannotSwap: '选择自动检测时无法交换',
  },

  ru: {
    // Русский режим: русский изучает туркменский
    home: 'Главная',
    search: 'Поиск',
    favorites: 'Избранное',
    settings: 'Настройки',
    additionalFeatures: 'Дополнительно',
    statistics: 'Статистика',

    appTitle: 'ТУРКМЕНСКОЕ ЯЗЫКОВОЕ ПРИЛОЖЕНИЕ',
    appSubtitle: 'Все инструменты для изучения языка',
    selectCategory: 'Выберите категорию',
    recentlyStudied: 'Недавно изученное',
    study: 'Изучать',

    // Main Hub Modules
    phrasebookTitle: 'Разговорник',
    phrasebookSubtitle: '305 фраз в 22 категориях',
    visualTranslatorTitle: 'Визуальный переводчик',
    visualTranslatorSubtitle: 'Сканирование текста камерой',
    textTranslatorTitle: 'Текстовый переводчик',
    textTranslatorSubtitle: 'Ввод и перевод текста',
    dictionaryTitle: 'Словарь',
    dictionarySubtitle: 'Выйдет в v2.0',
    aiAssistantsTitle: 'AI помощники',
    aiAssistantsSubtitle: 'Умные подсказки и поддержка',
    myFavoritesTitle: 'Моё избранное',
    myFavoritesSubtitle: 'Сохранённое',

    pronunciation: 'Произношение',
    addToFavorites: 'Добавить в избранное',
    inFavorites: 'В избранном',
    share: 'Поделиться',

    settingsTitle: '⚙️ Настройки',
    languageInterface: 'Язык интерфейса',
    switchLanguage: 'Сменить язык',
    audio: 'Аудио',
    soundEffects: 'Звуковые эффекты',
    data: 'Данные',
    clearHistory: 'Очистить историю',
    offlineMode: 'Офлайн режим',
    about: 'О приложении',
    feedback: 'Обратная связь',

    searchPlaceholder: 'Введите фразу на любом языке...',
    noResults: 'Ничего не найдено',
    searchHistory: 'История поиска',

    cancel: 'Отмена',
    save: 'Сохранить',
    delete: 'Удалить',
    confirm: 'Подтвердить',
    loading: 'Загрузка...',
    error: 'Ошибка',
    success: 'Успешно',

    // Visual Translator - Home Screen
    vtTranslateWithAI: 'Перевод с AI',
    vtCameraSubtitle: 'Наведите камеру на любой текст и получите мгновенный перевод',
    vtTakePhoto: 'Сделать фото',
    vtChooseGallery: 'Выбрать из галереи',
    vtProcessing: 'Обработка изображения...',
    vtProcessingSubtext: 'Распознавание текста и перевод',
    vtOcrEngine: 'Движок OCR',
    vtFeatures: 'Возможности',
    vtFeatureOcrTitle: 'OCR Распознавание текста',
    vtFeatureOcrDesc: 'Распознаёт текст на 30+ языках с высокой точностью',
    vtFeatureAiTitle: 'AI Описание объектов',
    vtFeatureAiDesc: 'Описывает объекты когда текст не найден',
    vtFeatureSmartTitle: 'Умный перевод',
    vtFeatureSmartDesc: 'Контекстный перевод на основе AI',
    vtFeatureSaveTitle: 'Сохранение и отправка',
    vtFeatureSaveDesc: 'Сохраняйте переводы в избранное и делитесь с другими',
    vtPermissionsText: 'Для использования этой функции требуются разрешения камеры и фотогалереи',
    vtGrantPermissions: 'Предоставить разрешения',
    vtRequestingPermissions: 'Запрос разрешений...',
    vtAutoFallback: 'Автоматический откат включён в случае сбоя выбранного движка',

    // Visual Translator - Result Screen
    vtResult: 'Результат',
    vtRecognizedText: 'Распознанный текст',
    vtLanguageLabel: 'Язык: ',
    vtAiAnalysis: 'AI анализ',
    vtTranslation: 'Перевод',
    vtTargetLabel: 'Целевой: ',
    vtPlay: 'Воспроизвести',
    vtStop: 'Стоп',
    vtCopy: 'Копировать',
    vtTranslateAnother: 'Перевести ещё',
    vtCopied: 'Скопировано',
    vtCopiedMessage: 'Перевод скопирован в буфер обмена',

    // Text Translator
    ttHeaderTitle: 'Текстовый переводчик',
    ttHeroTitle: 'Мгновенный перевод',
    ttHeroSubtitle: 'Введите любой текст и переведите между 100+ языками',
    ttSelectLanguage: 'Выбрать',
    ttPlaceholder: 'Введите текст для перевода...',
    ttClear: 'Очистить',
    ttTranslate: 'Перевести',
    ttTranslating: 'Перевод...',
    ttPlay: 'Воспроизвести',
    ttStop: 'Стоп',
    ttCopy: 'Копировать',
    ttEmptyOutput: 'Перевод появится здесь',
    ttSourceLanguage: 'Исходный язык',
    ttTargetLanguage: 'Целевой язык',
    ttErrorTitle: 'Ошибка',
    ttErrorEmptyText: 'Пожалуйста, введите текст для перевода',
    ttErrorTranslationFailed: 'Перевод не удался. Попробуйте снова.',
    ttErrorNoInternet: 'Нет интернет-соединения. Проверьте подключение и попробуйте снова.',
    ttErrorTextTooLong: 'Текст слишком длинный. Максимум 5000 символов.',
    ttCopiedTitle: '✅ Скопировано',
    ttCopiedMessage: 'Перевод скопирован в буфер обмена',
    ttInfoTitle: 'Информация',
    ttInfoCannotSwap: 'Невозможно поменять местами когда выбрано Авто Определение',
  },

  en: {
    // English mode: English speaker learning Turkmen
    home: 'Home',
    search: 'Search',
    favorites: 'Favorites',
    settings: 'Settings',
    additionalFeatures: 'More Features',
    statistics: 'Statistics',

    appTitle: 'TURKMEN LANGUAGE APP',
    appSubtitle: 'All tools for language learning',
    selectCategory: 'Select a category',
    recentlyStudied: 'Recently studied',
    study: 'Study',

    // Main Hub Modules
    phrasebookTitle: 'Phrasebook',
    phrasebookSubtitle: '305 phrases in 22 categories',
    visualTranslatorTitle: 'Visual Translator',
    visualTranslatorSubtitle: 'Scan text with camera',
    textTranslatorTitle: 'Text Translator',
    textTranslatorSubtitle: 'Type and translate text',
    dictionaryTitle: 'Dictionary',
    dictionarySubtitle: 'Coming in v2.0',
    aiAssistantsTitle: 'AI Assistants',
    aiAssistantsSubtitle: 'Smart tips and support',
    myFavoritesTitle: 'My Favorites',
    myFavoritesSubtitle: 'Saved items',

    pronunciation: 'Pronunciation',
    addToFavorites: 'Add to favorites',
    inFavorites: 'In favorites',
    share: 'Share',

    settingsTitle: '⚙️ Settings',
    languageInterface: 'Interface language',
    switchLanguage: 'Switch language',
    audio: 'Audio',
    soundEffects: 'Sound effects',
    data: 'Data',
    clearHistory: 'Clear history',
    offlineMode: 'Offline mode',
    about: 'About app',
    feedback: 'Feedback',

    searchPlaceholder: 'Enter phrase in any language...',
    noResults: 'No results found',
    searchHistory: 'Search history',

    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    confirm: 'Confirm',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',

    // Visual Translator - Home Screen
    vtTranslateWithAI: 'Translate with AI',
    vtCameraSubtitle: 'Point your camera at any text and get instant translation',
    vtTakePhoto: 'Take Photo',
    vtChooseGallery: 'Choose from Gallery',
    vtProcessing: 'Processing image...',
    vtProcessingSubtext: 'Recognizing text and translating',
    vtOcrEngine: 'OCR Engine',
    vtFeatures: 'Features',
    vtFeatureOcrTitle: 'OCR Text Recognition',
    vtFeatureOcrDesc: 'Recognizes text in 30+ languages with high accuracy',
    vtFeatureAiTitle: 'AI Object Description',
    vtFeatureAiDesc: 'Describes objects when no text is found',
    vtFeatureSmartTitle: 'Smart Translation',
    vtFeatureSmartDesc: 'Context-aware translation powered by AI',
    vtFeatureSaveTitle: 'Save & Share',
    vtFeatureSaveDesc: 'Save translations to favorites and share with others',
    vtPermissionsText: 'Camera and photo library permissions are required to use this feature',
    vtGrantPermissions: 'Grant Permissions',
    vtRequestingPermissions: 'Requesting permissions...',
    vtAutoFallback: 'Auto-fallback enabled if selected engine fails',

    // Visual Translator - Result Screen
    vtResult: 'Result',
    vtRecognizedText: 'Recognized Text',
    vtLanguageLabel: 'Language: ',
    vtAiAnalysis: 'AI Analysis',
    vtTranslation: 'Translation',
    vtTargetLabel: 'Target: ',
    vtPlay: 'Play',
    vtStop: 'Stop',
    vtCopy: 'Copy',
    vtTranslateAnother: 'Translate Another',
    vtCopied: 'Copied',
    vtCopiedMessage: 'Translation copied to clipboard',

    // Text Translator
    ttHeaderTitle: 'Text Translator',
    ttHeroTitle: 'Instant Translation',
    ttHeroSubtitle: 'Type any text and translate between 100+ languages',
    ttSelectLanguage: 'Select',
    ttPlaceholder: 'Enter text to translate...',
    ttClear: 'Clear',
    ttTranslate: 'Translate',
    ttTranslating: 'Translating...',
    ttPlay: 'Play',
    ttStop: 'Stop',
    ttCopy: 'Copy',
    ttEmptyOutput: 'Translation will appear here',
    ttSourceLanguage: 'Source Language',
    ttTargetLanguage: 'Target Language',
    ttErrorTitle: 'Error',
    ttErrorEmptyText: 'Please enter text to translate',
    ttErrorTranslationFailed: 'Translation failed. Please try again.',
    ttErrorNoInternet: 'No internet connection. Please check your connection and try again.',
    ttErrorTextTooLong: 'Text is too long. Maximum 5000 characters.',
    ttCopiedTitle: '✅ Copied',
    ttCopiedMessage: 'Translation copied to clipboard',
    ttInfoTitle: 'Info',
    ttInfoCannotSwap: 'Cannot swap when Auto Detect is selected',
  },

  tr: {
    // Turkish mode: Turkish speaker learning Turkmen
    home: 'Ana Sayfa',
    search: 'Ara',
    favorites: 'Favoriler',
    settings: 'Ayarlar',
    additionalFeatures: 'Daha Fazla Özellik',
    statistics: 'İstatistikler',

    appTitle: 'TÜRKMEN DİLİ UYGULAMASI',
    appSubtitle: 'Dil öğrenimi için tüm araçlar',
    selectCategory: 'Kategori seçin',
    recentlyStudied: 'Son çalışılanlar',
    study: 'Çalış',

    // Main Hub Modules
    phrasebookTitle: 'Konuşma Kılavuzu',
    phrasebookSubtitle: '22 kategoride 305 ifade',
    visualTranslatorTitle: 'Görsel Çevirmen',
    visualTranslatorSubtitle: 'Kamera ile metin tarama',
    textTranslatorTitle: 'Metin Çevirmen',
    textTranslatorSubtitle: 'Metin yazıp çevir',
    dictionaryTitle: 'Sözlük',
    dictionarySubtitle: 'v2.0\'da gelecek',
    aiAssistantsTitle: 'AI Asistanlar',
    aiAssistantsSubtitle: 'Akıllı ipuçları ve destek',
    myFavoritesTitle: 'Favorilerim',
    myFavoritesSubtitle: 'Kaydedilen öğeler',

    pronunciation: 'Telaffuz',
    addToFavorites: 'Favorilere ekle',
    inFavorites: 'Favorilerde',
    share: 'Paylaş',

    settingsTitle: '⚙️ Ayarlar',
    languageInterface: 'Arayüz dili',
    switchLanguage: 'Dili değiştir',
    audio: 'Ses',
    soundEffects: 'Ses efektleri',
    data: 'Veri',
    clearHistory: 'Geçmişi temizle',
    offlineMode: 'Çevrimdışı mod',
    about: 'Uygulama hakkında',
    feedback: 'Geri bildirim',

    searchPlaceholder: 'Herhangi bir dilde ifade girin...',
    noResults: 'Sonuç bulunamadı',
    searchHistory: 'Arama geçmişi',

    cancel: 'İptal',
    save: 'Kaydet',
    delete: 'Sil',
    confirm: 'Onayla',
    loading: 'Yükleniyor...',
    error: 'Hata',
    success: 'Başarılı',

    // Visual Translator - Home Screen
    vtTranslateWithAI: 'AI ile Çevir',
    vtCameraSubtitle: 'Kameranızı herhangi bir metne doğrultun ve anında çeviri alın',
    vtTakePhoto: 'Fotoğraf Çek',
    vtChooseGallery: 'Galeriden Seç',
    vtProcessing: 'Görüntü işleniyor...',
    vtProcessingSubtext: 'Metin tanınıyor ve çevriliyor',
    vtOcrEngine: 'OCR Motoru',
    vtFeatures: 'Özellikler',
    vtFeatureOcrTitle: 'OCR Metin Tanıma',
    vtFeatureOcrDesc: '30+ dilde yüksek doğrulukla metin tanır',
    vtFeatureAiTitle: 'AI Nesne Açıklaması',
    vtFeatureAiDesc: 'Metin bulunamadığında nesneleri açıklar',
    vtFeatureSmartTitle: 'Akıllı Çeviri',
    vtFeatureSmartDesc: 'AI destekli bağlama duyarlı çeviri',
    vtFeatureSaveTitle: 'Kaydet ve Paylaş',
    vtFeatureSaveDesc: 'Çevirileri favorilere kaydedin ve başkalarıyla paylaşın',
    vtPermissionsText: 'Bu özelliği kullanmak için kamera ve fotoğraf galerisi izinleri gereklidir',
    vtGrantPermissions: 'İzin Ver',
    vtRequestingPermissions: 'İzinler isteniyor...',
    vtAutoFallback: 'Seçilen motor başarısız olursa otomatik geri dönüş etkin',

    // Visual Translator - Result Screen
    vtResult: 'Sonuç',
    vtRecognizedText: 'Tanınan Metin',
    vtLanguageLabel: 'Dil: ',
    vtAiAnalysis: 'AI Analizi',
    vtTranslation: 'Çeviri',
    vtTargetLabel: 'Hedef: ',
    vtPlay: 'Oynat',
    vtStop: 'Dur',
    vtCopy: 'Kopyala',
    vtTranslateAnother: 'Başka Çevir',
    vtCopied: 'Kopyalandı',
    vtCopiedMessage: 'Çeviri panoya kopyalandı',
  },

  de: {
    // German mode: German speaker learning Turkmen
    home: 'Startseite',
    search: 'Suchen',
    favorites: 'Favoriten',
    settings: 'Einstellungen',
    additionalFeatures: 'Weitere Funktionen',
    statistics: 'Statistiken',

    appTitle: 'TURKMENISCHE SPRACH-APP',
    appSubtitle: 'Alle Werkzeuge zum Sprachenlernen',
    selectCategory: 'Kategorie wählen',
    recentlyStudied: 'Kürzlich gelernt',
    study: 'Lernen',

    // Main Hub Modules
    phrasebookTitle: 'Sprachführer',
    phrasebookSubtitle: '305 Phrasen in 22 Kategorien',
    visualTranslatorTitle: 'Visueller Übersetzer',
    visualTranslatorSubtitle: 'Text mit Kamera scannen',
    textTranslatorTitle: 'Textübersetzer',
    textTranslatorSubtitle: 'Text eingeben und übersetzen',
    dictionaryTitle: 'Wörterbuch',
    dictionarySubtitle: 'Kommt in v2.0',
    aiAssistantsTitle: 'KI-Assistenten',
    aiAssistantsSubtitle: 'Intelligente Tipps und Unterstützung',
    myFavoritesTitle: 'Meine Favoriten',
    myFavoritesSubtitle: 'Gespeicherte Elemente',

    pronunciation: 'Aussprache',
    addToFavorites: 'Zu Favoriten hinzufügen',
    inFavorites: 'In Favoriten',
    share: 'Teilen',

    settingsTitle: '⚙️ Einstellungen',
    languageInterface: 'Oberflächensprache',
    switchLanguage: 'Sprache wechseln',
    audio: 'Audio',
    soundEffects: 'Soundeffekte',
    data: 'Daten',
    clearHistory: 'Verlauf löschen',
    offlineMode: 'Offline-Modus',
    about: 'Über die App',
    feedback: 'Feedback',

    searchPlaceholder: 'Phrase in beliebiger Sprache eingeben...',
    noResults: 'Keine Ergebnisse gefunden',
    searchHistory: 'Suchverlauf',

    cancel: 'Abbrechen',
    save: 'Speichern',
    delete: 'Löschen',
    confirm: 'Bestätigen',
    loading: 'Laden...',
    error: 'Fehler',
    success: 'Erfolg',

    // Visual Translator - Home Screen
    vtTranslateWithAI: 'Mit KI übersetzen',
    vtCameraSubtitle: 'Richten Sie Ihre Kamera auf beliebigen Text für sofortige Übersetzung',
    vtTakePhoto: 'Foto aufnehmen',
    vtChooseGallery: 'Aus Galerie wählen',
    vtProcessing: 'Bild wird verarbeitet...',
    vtProcessingSubtext: 'Text wird erkannt und übersetzt',
    vtOcrEngine: 'OCR-Engine',
    vtFeatures: 'Funktionen',
    vtFeatureOcrTitle: 'OCR-Texterkennung',
    vtFeatureOcrDesc: 'Erkennt Text in 30+ Sprachen mit hoher Genauigkeit',
    vtFeatureAiTitle: 'KI-Objektbeschreibung',
    vtFeatureAiDesc: 'Beschreibt Objekte, wenn kein Text gefunden wird',
    vtFeatureSmartTitle: 'Intelligente Übersetzung',
    vtFeatureSmartDesc: 'KI-gestützte kontextbezogene Übersetzung',
    vtFeatureSaveTitle: 'Speichern & Teilen',
    vtFeatureSaveDesc: 'Übersetzungen in Favoriten speichern und mit anderen teilen',
    vtPermissionsText: 'Kamera- und Fotogalerie-Berechtigungen sind erforderlich',
    vtGrantPermissions: 'Berechtigungen erteilen',
    vtRequestingPermissions: 'Berechtigungen werden angefordert...',
    vtAutoFallback: 'Automatisches Fallback aktiviert, falls ausgewählte Engine fehlschlägt',

    // Visual Translator - Result Screen
    vtResult: 'Ergebnis',
    vtRecognizedText: 'Erkannter Text',
    vtLanguageLabel: 'Sprache: ',
    vtAiAnalysis: 'KI-Analyse',
    vtTranslation: 'Übersetzung',
    vtTargetLabel: 'Ziel: ',
    vtPlay: 'Abspielen',
    vtStop: 'Stopp',
    vtCopy: 'Kopieren',
    vtTranslateAnother: 'Weitere übersetzen',
    vtCopied: 'Kopiert',
    vtCopiedMessage: 'Übersetzung in Zwischenablage kopiert',
  },

  fr: {
    // French mode: French speaker learning Turkmen
    home: 'Accueil',
    search: 'Rechercher',
    favorites: 'Favoris',
    settings: 'Paramètres',
    additionalFeatures: 'Plus de fonctionnalités',
    statistics: 'Statistiques',

    appTitle: 'APPLICATION DE LANGUE TURKMÈNE',
    appSubtitle: 'Tous les outils pour apprendre la langue',
    selectCategory: 'Sélectionner une catégorie',
    recentlyStudied: 'Récemment étudié',
    study: 'Étudier',

    // Main Hub Modules
    phrasebookTitle: 'Guide de conversation',
    phrasebookSubtitle: '305 phrases dans 22 catégories',
    visualTranslatorTitle: 'Traducteur visuel',
    visualTranslatorSubtitle: 'Scanner le texte avec la caméra',
    textTranslatorTitle: 'Traducteur de texte',
    textTranslatorSubtitle: 'Taper et traduire le texte',
    dictionaryTitle: 'Dictionnaire',
    dictionarySubtitle: 'Arrive dans v2.0',
    aiAssistantsTitle: 'Assistants IA',
    aiAssistantsSubtitle: 'Conseils intelligents et support',
    myFavoritesTitle: 'Mes favoris',
    myFavoritesSubtitle: 'Éléments sauvegardés',

    pronunciation: 'Prononciation',
    addToFavorites: 'Ajouter aux favoris',
    inFavorites: 'Dans les favoris',
    share: 'Partager',

    settingsTitle: '⚙️ Paramètres',
    languageInterface: 'Langue de l\'interface',
    switchLanguage: 'Changer de langue',
    audio: 'Audio',
    soundEffects: 'Effets sonores',
    data: 'Données',
    clearHistory: 'Effacer l\'historique',
    offlineMode: 'Mode hors ligne',
    about: 'À propos de l\'application',
    feedback: 'Commentaires',

    searchPlaceholder: 'Entrer une phrase dans n\'importe quelle langue...',
    noResults: 'Aucun résultat trouvé',
    searchHistory: 'Historique de recherche',

    cancel: 'Annuler',
    save: 'Enregistrer',
    delete: 'Supprimer',
    confirm: 'Confirmer',
    loading: 'Chargement...',
    error: 'Erreur',
    success: 'Succès',

    // Visual Translator - Home Screen
    vtTranslateWithAI: 'Traduire avec IA',
    vtCameraSubtitle: 'Pointez votre appareil photo sur n\'importe quel texte pour une traduction instantanée',
    vtTakePhoto: 'Prendre une photo',
    vtChooseGallery: 'Choisir dans la galerie',
    vtProcessing: 'Traitement de l\'image...',
    vtProcessingSubtext: 'Reconnaissance et traduction du texte',
    vtOcrEngine: 'Moteur OCR',
    vtFeatures: 'Fonctionnalités',
    vtFeatureOcrTitle: 'Reconnaissance de texte OCR',
    vtFeatureOcrDesc: 'Reconnaît le texte en 30+ langues avec haute précision',
    vtFeatureAiTitle: 'Description d\'objet par IA',
    vtFeatureAiDesc: 'Décrit les objets lorsqu\'aucun texte n\'est trouvé',
    vtFeatureSmartTitle: 'Traduction intelligente',
    vtFeatureSmartDesc: 'Traduction contextuelle alimentée par l\'IA',
    vtFeatureSaveTitle: 'Enregistrer et partager',
    vtFeatureSaveDesc: 'Enregistrez les traductions dans les favoris et partagez-les',
    vtPermissionsText: 'Les autorisations de caméra et de galerie photo sont requises',
    vtGrantPermissions: 'Accorder les autorisations',
    vtRequestingPermissions: 'Demande d\'autorisations...',
    vtAutoFallback: 'Repli automatique activé si le moteur sélectionné échoue',

    // Visual Translator - Result Screen
    vtResult: 'Résultat',
    vtRecognizedText: 'Texte reconnu',
    vtLanguageLabel: 'Langue: ',
    vtAiAnalysis: 'Analyse IA',
    vtTranslation: 'Traduction',
    vtTargetLabel: 'Cible: ',
    vtPlay: 'Lire',
    vtStop: 'Arrêter',
    vtCopy: 'Copier',
    vtTranslateAnother: 'Traduire un autre',
    vtCopied: 'Copié',
    vtCopiedMessage: 'Traduction copiée dans le presse-papiers',
  },

  es: {
    // Spanish mode: Spanish speaker learning Turkmen
    home: 'Inicio',
    search: 'Buscar',
    favorites: 'Favoritos',
    settings: 'Configuración',
    additionalFeatures: 'Más funciones',
    statistics: 'Estadísticas',

    appTitle: 'APLICACIÓN DE LENGUA TURCOMANA',
    appSubtitle: 'Todas las herramientas para aprender idiomas',
    selectCategory: 'Seleccionar categoría',
    recentlyStudied: 'Estudiado recientemente',
    study: 'Estudiar',

    // Main Hub Modules
    phrasebookTitle: 'Guía de conversación',
    phrasebookSubtitle: '305 frases en 22 categorías',
    visualTranslatorTitle: 'Traductor visual',
    visualTranslatorSubtitle: 'Escanear texto con cámara',
    textTranslatorTitle: 'Traductor de texto',
    textTranslatorSubtitle: 'Escribir y traducir texto',
    dictionaryTitle: 'Diccionario',
    dictionarySubtitle: 'Próximamente en v2.0',
    aiAssistantsTitle: 'Asistentes IA',
    aiAssistantsSubtitle: 'Consejos inteligentes y soporte',
    myFavoritesTitle: 'Mis favoritos',
    myFavoritesSubtitle: 'Elementos guardados',

    pronunciation: 'Pronunciación',
    addToFavorites: 'Añadir a favoritos',
    inFavorites: 'En favoritos',
    share: 'Compartir',

    settingsTitle: '⚙️ Configuración',
    languageInterface: 'Idioma de la interfaz',
    switchLanguage: 'Cambiar idioma',
    audio: 'Audio',
    soundEffects: 'Efectos de sonido',
    data: 'Datos',
    clearHistory: 'Borrar historial',
    offlineMode: 'Modo sin conexión',
    about: 'Acerca de la aplicación',
    feedback: 'Comentarios',

    searchPlaceholder: 'Introducir frase en cualquier idioma...',
    noResults: 'No se encontraron resultados',
    searchHistory: 'Historial de búsqueda',

    cancel: 'Cancelar',
    save: 'Guardar',
    delete: 'Eliminar',
    confirm: 'Confirmar',
    loading: 'Cargando...',
    error: 'Error',
    success: 'Éxito',

    vtTranslateWithAI: 'Traducir con IA',
    vtCameraSubtitle: 'Apunta tu cámara a cualquier texto para obtener traducción instantánea',
    vtTakePhoto: 'Tomar foto',
    vtChooseGallery: 'Elegir de la galería',
    vtProcessing: 'Procesando imagen...',
    vtProcessingSubtext: 'Reconociendo y traduciendo texto',
    vtOcrEngine: 'Motor OCR',
    vtFeatures: 'Características',
    vtFeatureOcrTitle: 'Reconocimiento de texto OCR',
    vtFeatureOcrDesc: 'Reconoce texto en 30+ idiomas con alta precisión',
    vtFeatureAiTitle: 'Descripción de objetos con IA',
    vtFeatureAiDesc: 'Describe objetos cuando no se encuentra texto',
    vtFeatureSmartTitle: 'Traducción inteligente',
    vtFeatureSmartDesc: 'Traducción contextual impulsada por IA',
    vtFeatureSaveTitle: 'Guardar y compartir',
    vtFeatureSaveDesc: 'Guarda traducciones en favoritos y compártelas',
    vtPermissionsText: 'Se requieren permisos de cámara y galería de fotos',
    vtGrantPermissions: 'Conceder permisos',
    vtRequestingPermissions: 'Solicitando permisos...',
    vtAutoFallback: 'Reserva automática activada si falla el motor seleccionado',
    vtResult: 'Resultado',
    vtRecognizedText: 'Texto reconocido',
    vtLanguageLabel: 'Idioma: ',
    vtAiAnalysis: 'Análisis IA',
    vtTranslation: 'Traducción',
    vtTargetLabel: 'Objetivo: ',
    vtPlay: 'Reproducir',
    vtStop: 'Detener',
    vtCopy: 'Copiar',
    vtTranslateAnother: 'Traducir otro',
    vtCopied: 'Copiado',
    vtCopiedMessage: 'Traducción copiada al portapapeles',
  },

  it: {
    // Italian mode: Italian speaker learning Turkmen
    home: 'Home',
    search: 'Cerca',
    favorites: 'Preferiti',
    settings: 'Impostazioni',
    additionalFeatures: 'Altre funzionalità',
    statistics: 'Statistiche',

    appTitle: 'APP LINGUA TURKMENA',
    appSubtitle: 'Tutti gli strumenti per imparare la lingua',
    selectCategory: 'Seleziona una categoria',
    recentlyStudied: 'Studiato di recente',
    study: 'Studiare',

    // Main Hub Modules
    phrasebookTitle: 'Frasario',
    phrasebookSubtitle: '305 frasi in 22 categorie',
    visualTranslatorTitle: 'Traduttore visivo',
    visualTranslatorSubtitle: 'Scansiona testo con la fotocamera',
    textTranslatorTitle: 'Traduttore di testo',
    textTranslatorSubtitle: 'Scrivi e traduci testo',
    dictionaryTitle: 'Dizionario',
    dictionarySubtitle: 'In arrivo nella v2.0',
    aiAssistantsTitle: 'Assistenti IA',
    aiAssistantsSubtitle: 'Suggerimenti intelligenti e supporto',
    myFavoritesTitle: 'I miei preferiti',
    myFavoritesSubtitle: 'Elementi salvati',

    pronunciation: 'Pronuncia',
    addToFavorites: 'Aggiungi ai preferiti',
    inFavorites: 'Nei preferiti',
    share: 'Condividi',

    settingsTitle: '⚙️ Impostazioni',
    languageInterface: 'Lingua dell\'interfaccia',
    switchLanguage: 'Cambia lingua',
    audio: 'Audio',
    soundEffects: 'Effetti sonori',
    data: 'Dati',
    clearHistory: 'Cancella cronologia',
    offlineMode: 'Modalità offline',
    about: 'Informazioni sull\'app',
    feedback: 'Feedback',

    searchPlaceholder: 'Inserisci frase in qualsiasi lingua...',
    noResults: 'Nessun risultato trovato',
    searchHistory: 'Cronologia ricerche',

    cancel: 'Annulla',
    save: 'Salva',
    delete: 'Elimina',
    confirm: 'Conferma',
    loading: 'Caricamento...',
    error: 'Errore',
    success: 'Successo',

    vtTranslateWithAI: 'Traduci con AI',
    vtCameraSubtitle: 'Punta la fotocamera su qualsiasi testo per una traduzione istantanea',
    vtTakePhoto: 'Scatta foto',
    vtChooseGallery: 'Scegli dalla galleria',
    vtProcessing: 'Elaborazione immagine...',
    vtProcessingSubtext: 'Riconoscimento e traduzione del testo',
    vtOcrEngine: 'Motore OCR',
    vtFeatures: 'Funzionalità',
    vtFeatureOcrTitle: 'Riconoscimento testo OCR',
    vtFeatureOcrDesc: 'Riconosce testo in 30+ lingue con alta precisione',
    vtFeatureAiTitle: 'Descrizione oggetti AI',
    vtFeatureAiDesc: 'Descrive oggetti quando il testo non viene trovato',
    vtFeatureSmartTitle: 'Traduzione intelligente',
    vtFeatureSmartDesc: 'Traduzione contestuale alimentata da AI',
    vtFeatureSaveTitle: 'Salva e condividi',
    vtFeatureSaveDesc: 'Salva le traduzioni nei preferiti e condividile',
    vtPermissionsText: 'Sono richieste autorizzazioni per fotocamera e galleria',
    vtGrantPermissions: 'Concedi autorizzazioni',
    vtRequestingPermissions: 'Richiesta autorizzazioni...',
    vtAutoFallback: 'Fallback automatico attivato se il motore selezionato fallisce',
    vtResult: 'Risultato',
    vtRecognizedText: 'Testo riconosciuto',
    vtLanguageLabel: 'Lingua: ',
    vtAiAnalysis: 'Analisi AI',
    vtTranslation: 'Traduzione',
    vtTargetLabel: 'Obiettivo: ',
    vtPlay: 'Riproduci',
    vtStop: 'Ferma',
    vtCopy: 'Copia',
    vtTranslateAnother: 'Traduci un altro',
    vtCopied: 'Copiato',
    vtCopiedMessage: 'Traduzione copiata negli appunti',
  },

  pt: {
    // Portuguese mode: Portuguese speaker learning Turkmen
    home: 'Início',
    search: 'Pesquisar',
    favorites: 'Favoritos',
    settings: 'Configurações',
    additionalFeatures: 'Mais recursos',
    statistics: 'Estatísticas',

    appTitle: 'APLICATIVO DE LÍNGUA TURCOMANA',
    appSubtitle: 'Todas as ferramentas para aprender idiomas',
    selectCategory: 'Selecionar categoria',
    recentlyStudied: 'Estudado recentemente',
    study: 'Estudar',

    // Main Hub Modules
    phrasebookTitle: 'Guia de conversação',
    phrasebookSubtitle: '305 frases em 22 categorias',
    visualTranslatorTitle: 'Tradutor visual',
    visualTranslatorSubtitle: 'Digitalizar texto com câmera',
    textTranslatorTitle: 'Tradutor de texto',
    textTranslatorSubtitle: 'Digitar e traduzir texto',
    dictionaryTitle: 'Dicionário',
    dictionarySubtitle: 'Em breve na v2.0',
    aiAssistantsTitle: 'Assistentes IA',
    aiAssistantsSubtitle: 'Dicas inteligentes e suporte',
    myFavoritesTitle: 'Meus favoritos',
    myFavoritesSubtitle: 'Itens salvos',

    pronunciation: 'Pronúncia',
    addToFavorites: 'Adicionar aos favoritos',
    inFavorites: 'Nos favoritos',
    share: 'Compartilhar',

    settingsTitle: '⚙️ Configurações',
    languageInterface: 'Idioma da interface',
    switchLanguage: 'Mudar idioma',
    audio: 'Áudio',
    soundEffects: 'Efeitos sonoros',
    data: 'Dados',
    clearHistory: 'Limpar histórico',
    offlineMode: 'Modo offline',
    about: 'Sobre o aplicativo',
    feedback: 'Feedback',

    searchPlaceholder: 'Digite frase em qualquer idioma...',
    noResults: 'Nenhum resultado encontrado',
    searchHistory: 'Histórico de pesquisa',

    cancel: 'Cancelar',
    save: 'Salvar',
    delete: 'Excluir',
    confirm: 'Confirmar',
    loading: 'Carregando...',
    error: 'Erro',
    success: 'Sucesso',

    vtTranslateWithAI: 'Traduzir com IA',
    vtCameraSubtitle: 'Aponte sua câmera para qualquer texto e obtenha tradução instantânea',
    vtTakePhoto: 'Tirar foto',
    vtChooseGallery: 'Escolher da galeria',
    vtProcessing: 'Processando imagem...',
    vtProcessingSubtext: 'Reconhecendo e traduzindo texto',
    vtOcrEngine: 'Motor OCR',
    vtFeatures: 'Recursos',
    vtFeatureOcrTitle: 'Reconhecimento de texto OCR',
    vtFeatureOcrDesc: 'Reconhece texto em 30+ idiomas com alta precisão',
    vtFeatureAiTitle: 'Descrição de objetos por IA',
    vtFeatureAiDesc: 'Descreve objetos quando nenhum texto é encontrado',
    vtFeatureSmartTitle: 'Tradução inteligente',
    vtFeatureSmartDesc: 'Tradução contextual alimentada por IA',
    vtFeatureSaveTitle: 'Salvar e compartilhar',
    vtFeatureSaveDesc: 'Salve traduções nos favoritos e compartilhe',
    vtPermissionsText: 'São necessárias permissões de câmera e galeria de fotos',
    vtGrantPermissions: 'Conceder permissões',
    vtRequestingPermissions: 'Solicitando permissões...',
    vtAutoFallback: 'Fallback automático ativado se o motor selecionado falhar',
    vtResult: 'Resultado',
    vtRecognizedText: 'Texto reconhecido',
    vtLanguageLabel: 'Idioma: ',
    vtAiAnalysis: 'Análise IA',
    vtTranslation: 'Tradução',
    vtTargetLabel: 'Alvo: ',
    vtPlay: 'Reproduzir',
    vtStop: 'Parar',
    vtCopy: 'Copiar',
    vtTranslateAnother: 'Traduzir outro',
    vtCopied: 'Copiado',
    vtCopiedMessage: 'Tradução copiada para a área de transferência',
  },

  nl: {
    // Dutch mode: Dutch speaker learning Turkmen
    home: 'Home',
    search: 'Zoeken',
    favorites: 'Favorieten',
    settings: 'Instellingen',
    additionalFeatures: 'Meer functies',
    statistics: 'Statistieken',

    appTitle: 'TURKMEENSE TAAL APP',
    appSubtitle: 'Alle tools voor het leren van talen',
    selectCategory: 'Selecteer een categorie',
    recentlyStudied: 'Recent bestudeerd',
    study: 'Studeren',

    // Main Hub Modules
    phrasebookTitle: 'Taalgids',
    phrasebookSubtitle: '305 zinnen in 22 categorieën',
    visualTranslatorTitle: 'Visuele vertaler',
    visualTranslatorSubtitle: 'Scan tekst met camera',
    textTranslatorTitle: 'Tekstvertaler',
    textTranslatorSubtitle: 'Typ en vertaal tekst',
    dictionaryTitle: 'Woordenboek',
    dictionarySubtitle: 'Komt in v2.0',
    aiAssistantsTitle: 'AI-assistenten',
    aiAssistantsSubtitle: 'Slimme tips en ondersteuning',
    myFavoritesTitle: 'Mijn favorieten',
    myFavoritesSubtitle: 'Opgeslagen items',

    pronunciation: 'Uitspraak',
    addToFavorites: 'Toevoegen aan favorieten',
    inFavorites: 'In favorieten',
    share: 'Delen',

    settingsTitle: '⚙️ Instellingen',
    languageInterface: 'Interface taal',
    switchLanguage: 'Wissel van taal',
    audio: 'Audio',
    soundEffects: 'Geluidseffecten',
    data: 'Gegevens',
    clearHistory: 'Geschiedenis wissen',
    offlineMode: 'Offline modus',
    about: 'Over de app',
    feedback: 'Feedback',

    searchPlaceholder: 'Voer zin in elke taal in...',
    noResults: 'Geen resultaten gevonden',
    searchHistory: 'Zoekgeschiedenis',

    cancel: 'Annuleren',
    save: 'Opslaan',
    delete: 'Verwijderen',
    confirm: 'Bevestigen',
    loading: 'Laden...',
    error: 'Fout',
    success: 'Succes',

    vtTranslateWithAI: 'Vertaal met AI',
    vtCameraSubtitle: 'Richt je camera op tekst voor directe vertaling',
    vtTakePhoto: 'Foto maken',
    vtChooseGallery: 'Kies uit galerij',
    vtProcessing: 'Afbeelding verwerken...',
    vtProcessingSubtext: 'Tekst herkennen en vertalen',
    vtOcrEngine: 'OCR-engine',
    vtFeatures: 'Functies',
    vtFeatureOcrTitle: 'OCR-tekstherkenning',
    vtFeatureOcrDesc: 'Herkent tekst in 30+ talen met hoge nauwkeurigheid',
    vtFeatureAiTitle: 'AI-objectbeschrijving',
    vtFeatureAiDesc: 'Beschrijft objecten wanneer geen tekst wordt gevonden',
    vtFeatureSmartTitle: 'Slimme vertaling',
    vtFeatureSmartDesc: 'Contextbewuste vertaling aangedreven door AI',
    vtFeatureSaveTitle: 'Opslaan & delen',
    vtFeatureSaveDesc: 'Vertalingen opslaan in favorieten en delen',
    vtPermissionsText: 'Camera- en fotogalerijrechten zijn vereist',
    vtGrantPermissions: 'Rechten verlenen',
    vtRequestingPermissions: 'Rechten aanvragen...',
    vtAutoFallback: 'Automatische terugval ingeschakeld als geselecteerde engine faalt',
    vtResult: 'Resultaat',
    vtRecognizedText: 'Herkende tekst',
    vtLanguageLabel: 'Taal: ',
    vtAiAnalysis: 'AI-analyse',
    vtTranslation: 'Vertaling',
    vtTargetLabel: 'Doel: ',
    vtPlay: 'Afspelen',
    vtStop: 'Stop',
    vtCopy: 'Kopiëren',
    vtTranslateAnother: 'Nog een vertalen',
    vtCopied: 'Gekopieerd',
    vtCopiedMessage: 'Vertaling naar klembord gekopieerd',
  },

  pl: {
    // Polish mode: Polish speaker learning Turkmen
    home: 'Strona główna',
    search: 'Szukaj',
    favorites: 'Ulubione',
    settings: 'Ustawienia',
    additionalFeatures: 'Więcej funkcji',
    statistics: 'Statystyki',

    appTitle: 'APLIKACJA DO NAUKI JĘZYKA TURKMEŃSKIEGO',
    appSubtitle: 'Wszystkie narzędzia do nauki języka',
    selectCategory: 'Wybierz kategorię',
    recentlyStudied: 'Ostatnio studiowane',
    study: 'Studiować',

    // Main Hub Modules
    phrasebookTitle: 'Rozmówki',
    phrasebookSubtitle: '305 zwrotów w 22 kategoriach',
    visualTranslatorTitle: 'Tłumacz wizualny',
    visualTranslatorSubtitle: 'Skanuj tekst aparatem',
    textTranslatorTitle: 'Tłumacz tekstu',
    textTranslatorSubtitle: 'Wpisz i przetłumacz tekst',
    dictionaryTitle: 'Słownik',
    dictionarySubtitle: 'Wkrótce w v2.0',
    aiAssistantsTitle: 'Asystenci AI',
    aiAssistantsSubtitle: 'Inteligentne wskazówki i wsparcie',
    myFavoritesTitle: 'Moje ulubione',
    myFavoritesSubtitle: 'Zapisane elementy',

    pronunciation: 'Wymowa',
    addToFavorites: 'Dodaj do ulubionych',
    inFavorites: 'W ulubionych',
    share: 'Udostępnij',

    settingsTitle: '⚙️ Ustawienia',
    languageInterface: 'Język interfejsu',
    switchLanguage: 'Zmień język',
    audio: 'Audio',
    soundEffects: 'Efekty dźwiękowe',
    data: 'Dane',
    clearHistory: 'Wyczyść historię',
    offlineMode: 'Tryb offline',
    about: 'O aplikacji',
    feedback: 'Opinie',

    searchPlaceholder: 'Wprowadź frazę w dowolnym języku...',
    noResults: 'Nie znaleziono wyników',
    searchHistory: 'Historia wyszukiwania',

    cancel: 'Anuluj',
    save: 'Zapisz',
    delete: 'Usuń',
    confirm: 'Potwierdź',
    loading: 'Ładowanie...',
    error: 'Błąd',
    success: 'Sukces',

    vtTranslateWithAI: 'Tłumacz z AI',
    vtCameraSubtitle: 'Skieruj kamerę na tekst, aby uzyskać natychmiastowe tłumaczenie',
    vtTakePhoto: 'Zrób zdjęcie',
    vtChooseGallery: 'Wybierz z galerii',
    vtProcessing: 'Przetwarzanie obrazu...',
    vtProcessingSubtext: 'Rozpoznawanie i tłumaczenie tekstu',
    vtOcrEngine: 'Silnik OCR',
    vtFeatures: 'Funkcje',
    vtFeatureOcrTitle: 'Rozpoznawanie tekstu OCR',
    vtFeatureOcrDesc: 'Rozpoznaje tekst w 30+ językach z wysoką dokładnością',
    vtFeatureAiTitle: 'Opis obiektów AI',
    vtFeatureAiDesc: 'Opisuje obiekty, gdy nie znaleziono tekstu',
    vtFeatureSmartTitle: 'Inteligentne tłumaczenie',
    vtFeatureSmartDesc: 'Tłumaczenie kontekstowe wspomagane przez AI',
    vtFeatureSaveTitle: 'Zapisz i udostępnij',
    vtFeatureSaveDesc: 'Zapisuj tłumaczenia w ulubionych i udostępniaj',
    vtPermissionsText: 'Wymagane są uprawnienia do kamery i galerii zdjęć',
    vtGrantPermissions: 'Udziel uprawnień',
    vtRequestingPermissions: 'Żądanie uprawnień...',
    vtAutoFallback: 'Automatyczne przełączanie włączone w przypadku awarii wybranego silnika',
    vtResult: 'Wynik',
    vtRecognizedText: 'Rozpoznany tekst',
    vtLanguageLabel: 'Język: ',
    vtAiAnalysis: 'Analiza AI',
    vtTranslation: 'Tłumaczenie',
    vtTargetLabel: 'Cel: ',
    vtPlay: 'Odtwórz',
    vtStop: 'Zatrzymaj',
    vtCopy: 'Kopiuj',
    vtTranslateAnother: 'Przetłumacz kolejne',
    vtCopied: 'Skopiowano',
    vtCopiedMessage: 'Tłumaczenie skopiowane do schowka',
  },

  uk: {
    // Ukrainian mode: Ukrainian speaker learning Turkmen
    home: 'Головна',
    search: 'Пошук',
    favorites: 'Вибране',
    settings: 'Налаштування',
    additionalFeatures: 'Додаткові функції',
    statistics: 'Статистика',

    appTitle: 'ТУРКМЕНСЬКИЙ МОВНИЙ ДОДАТОК',
    appSubtitle: 'Всі інструменти для вивчення мови',
    selectCategory: 'Виберіть категорію',
    recentlyStudied: 'Нещодавно вивчене',
    study: 'Вивчати',

    // Main Hub Modules
    phrasebookTitle: 'Розмовник',
    phrasebookSubtitle: '305 фраз у 22 категоріях',
    visualTranslatorTitle: 'Візуальний перекладач',
    visualTranslatorSubtitle: 'Сканування тексту камерою',
    textTranslatorTitle: 'Текстовий перекладач',
    textTranslatorSubtitle: 'Введення і переклад тексту',
    dictionaryTitle: 'Словник',
    dictionarySubtitle: 'Вийде у v2.0',
    aiAssistantsTitle: 'AI помічники',
    aiAssistantsSubtitle: 'Розумні підказки та підтримка',
    myFavoritesTitle: 'Моє вибране',
    myFavoritesSubtitle: 'Збережені елементи',

    pronunciation: 'Вимова',
    addToFavorites: 'Додати до вибраного',
    inFavorites: 'У вибраному',
    share: 'Поділитися',

    settingsTitle: '⚙️ Налаштування',
    languageInterface: 'Мова інтерфейсу',
    switchLanguage: 'Змінити мову',
    audio: 'Аудіо',
    soundEffects: 'Звукові ефекти',
    data: 'Дані',
    clearHistory: 'Очистити історію',
    offlineMode: 'Офлайн режим',
    about: 'Про додаток',
    feedback: 'Зворотний зв\'язок',

    searchPlaceholder: 'Введіть фразу будь-якою мовою...',
    noResults: 'Нічого не знайдено',
    searchHistory: 'Історія пошуку',

    cancel: 'Скасувати',
    save: 'Зберегти',
    delete: 'Видалити',
    confirm: 'Підтвердити',
    loading: 'Завантаження...',
    error: 'Помилка',
    success: 'Успішно',

    // Visual Translator - Home Screen
    vtTranslateWithAI: 'Перекласти з AI',
    vtCameraSubtitle: 'Наведіть камеру на будь-який текст для миттєвого перекладу',
    vtTakePhoto: 'Зробити фото',
    vtChooseGallery: 'Вибрати з галереї',
    vtProcessing: 'Обробка зображення...',
    vtProcessingSubtext: 'Розпізнавання тексту та переклад',
    vtOcrEngine: 'OCR движок',
    vtFeatures: 'Функції',
    vtFeatureOcrTitle: 'Розпізнавання тексту OCR',
    vtFeatureOcrDesc: 'Розпізнає текст більш ніж 30 мовами з високою точністю',
    vtFeatureAiTitle: 'AI опис об\'єктів',
    vtFeatureAiDesc: 'Описує об\'єкти, коли текст не знайдено',
    vtFeatureSmartTitle: 'Розумний переклад',
    vtFeatureSmartDesc: 'Контекстний переклад з підтримкою AI',
    vtFeatureSaveTitle: 'Зберегти та поділитися',
    vtFeatureSaveDesc: 'Зберігайте переклади в обране та діліться ними',
    vtPermissionsText: 'Потрібні дозволи на камеру та галерею',
    vtGrantPermissions: 'Надати дозволи',
    vtRequestingPermissions: 'Запит дозволів...',
    vtAutoFallback: 'Автоматичне перемикання увімкнено при збої обраного движка',

    // Visual Translator - Result Screen
    vtResult: 'Результат',
    vtRecognizedText: 'Розпізнаний текст',
    vtLanguageLabel: 'Мова: ',
    vtAiAnalysis: 'AI аналіз',
    vtTranslation: 'Переклад',
    vtTargetLabel: 'Ціль: ',
    vtPlay: 'Відтворити',
    vtStop: 'Зупинити',
    vtCopy: 'Копіювати',
    vtTranslateAnother: 'Перекласти ще',
    vtCopied: 'Скопійовано',
    vtCopiedMessage: 'Переклад скопійовано в буфер обміну',

    // Text Translator (placeholder for now)
    ttHeaderTitle: 'Текстовий перекладач',
    ttHeroTitle: 'Миттєвий переклад',
    ttHeroSubtitle: 'Перекладіть текст на будь-яку мову',
    ttSelectLanguage: 'Вибрати мову',
    ttPlaceholder: 'Введіть текст для перекладу...',
    ttClear: 'Очистити',
    ttTranslate: 'Перекласти',
    ttTranslating: 'Переклад...',
    ttPlay: 'Відтворити',
    ttStop: 'Зупинити',
    ttCopy: 'Копіювати',
    ttEmptyOutput: 'Переклад з\'явиться тут',
    ttSourceLanguage: 'Мова оригіналу',
    ttTargetLanguage: 'Мова перекладу',
    ttErrorTitle: 'Помилка',
    ttErrorEmptyText: 'Будь ласка, введіть текст для перекладу',
    ttErrorTranslationFailed: 'Не вдалося перекласти. Спробуйте ще раз.',
    ttErrorNoInternet: 'Немає підключення до Інтернету',
    ttErrorTextTooLong: 'Текст занадто довгий. Максимум 1000 символів.',
    ttCopiedTitle: 'Скопійовано',
    ttCopiedMessage: 'Переклад скопійовано в буфер обміну',
    ttInfoTitle: 'Інформація',
    ttInfoCannotSwap: 'Не можна поміняти мови місцями',
  },

  ja: {
    // Japanese mode: Japanese speaker learning Turkmen
    home: 'ホーム',
    search: '検索',
    favorites: 'お気に入り',
    settings: '設定',
    additionalFeatures: '追加機能',
    statistics: '統計',

    appTitle: 'トルクメン語学習アプリ',
    appSubtitle: '言語学習のための全てのツール',
    selectCategory: 'カテゴリーを選択',
    recentlyStudied: '最近学習した項目',
    study: '学習する',

    phrasebookTitle: 'フレーズブック',
    phrasebookSubtitle: '22カテゴリーに305フレーズ',
    visualTranslatorTitle: 'ビジュアル翻訳',
    visualTranslatorSubtitle: 'カメラでテキストをスキャン',
    textTranslatorTitle: 'テキスト翻訳',
    textTranslatorSubtitle: 'テキストを入力して翻訳',
    dictionaryTitle: '辞書',
    dictionarySubtitle: 'v2.0で公開予定',
    aiAssistantsTitle: 'AIアシスタント',
    aiAssistantsSubtitle: 'スマートなヒントとサポート',
    myFavoritesTitle: 'マイお気に入り',
    myFavoritesSubtitle: '保存したアイテム',

    pronunciation: '発音',
    addToFavorites: 'お気に入りに追加',
    inFavorites: 'お気に入り済み',
    share: '共有',

    settingsTitle: '⚙️ 設定',
    languageInterface: 'インターフェース言語',
    switchLanguage: '言語を変更',
    audio: 'オーディオ',
    soundEffects: '効果音',
    data: 'データ',
    clearHistory: '履歴をクリア',
    offlineMode: 'オフラインモード',
    about: 'アプリについて',
    feedback: 'フィードバック',

    searchPlaceholder: 'どの言語でもフレーズを入力...',
    noResults: '結果が見つかりません',
    searchHistory: '検索履歴',

    cancel: 'キャンセル',
    save: '保存',
    delete: '削除',
    confirm: '確認',
    loading: '読み込み中...',
    error: 'エラー',
    success: '成功',

    // Visual Translator - Home Screen
    vtTranslateWithAI: 'AIで翻訳',
    vtCameraSubtitle: 'カメラをテキストに向けて即座に翻訳',
    vtTakePhoto: '写真を撮る',
    vtChooseGallery: 'ギャラリーから選択',
    vtProcessing: '画像を処理中...',
    vtProcessingSubtext: 'テキストを認識して翻訳中',
    vtOcrEngine: 'OCRエンジン',
    vtFeatures: '機能',
    vtFeatureOcrTitle: 'OCRテキスト認識',
    vtFeatureOcrDesc: '30以上の言語で高精度にテキストを認識',
    vtFeatureAiTitle: 'AIオブジェクト説明',
    vtFeatureAiDesc: 'テキストが見つからない場合、オブジェクトを説明',
    vtFeatureSmartTitle: 'スマート翻訳',
    vtFeatureSmartDesc: 'AI支援による文脈翻訳',
    vtFeatureSaveTitle: '保存と共有',
    vtFeatureSaveDesc: '翻訳をお気に入りに保存して共有',
    vtPermissionsText: 'カメラと写真ライブラリの権限が必要です',
    vtGrantPermissions: '権限を付与',
    vtRequestingPermissions: '権限を要求中...',
    vtAutoFallback: '選択したエンジンが失敗した場合、自動切り替えが有効',

    // Visual Translator - Result Screen
    vtResult: '結果',
    vtRecognizedText: '認識されたテキスト',
    vtLanguageLabel: '言語: ',
    vtAiAnalysis: 'AI分析',
    vtTranslation: '翻訳',
    vtTargetLabel: 'ターゲット: ',
    vtPlay: '再生',
    vtStop: '停止',
    vtCopy: 'コピー',
    vtTranslateAnother: '別の翻訳',
    vtCopied: 'コピーしました',
    vtCopiedMessage: '翻訳をクリップボードにコピーしました',

    // Text Translator
    ttHeaderTitle: 'テキスト翻訳',
    ttHeroTitle: '即座に翻訳',
    ttHeroSubtitle: 'テキストを任意の言語に翻訳',
    ttSelectLanguage: '言語を選択',
    ttPlaceholder: '翻訳するテキストを入力...',
    ttClear: 'クリア',
    ttTranslate: '翻訳',
    ttTranslating: '翻訳中...',
    ttPlay: '再生',
    ttStop: '停止',
    ttCopy: 'コピー',
    ttEmptyOutput: '翻訳がここに表示されます',
    ttSourceLanguage: '元の言語',
    ttTargetLanguage: 'ターゲット言語',
    ttErrorTitle: 'エラー',
    ttErrorEmptyText: '翻訳するテキストを入力してください',
    ttErrorTranslationFailed: '翻訳に失敗しました。もう一度お試しください。',
    ttErrorNoInternet: 'インターネット接続がありません',
    ttErrorTextTooLong: 'テキストが長すぎます。最大1000文字です。',
    ttCopiedTitle: 'コピーしました',
    ttCopiedMessage: '翻訳をクリップボードにコピーしました',
    ttInfoTitle: '情報',
    ttInfoCannotSwap: '言語を入れ替えることができません',
  },

  ko: {
    // Korean mode: Korean speaker learning Turkmen
    home: '홈',
    search: '검색',
    favorites: '즐겨찾기',
    settings: '설정',
    additionalFeatures: '추가 기능',
    statistics: '통계',

    appTitle: '투르크멘어 학습 앱',
    appSubtitle: '언어 학습을 위한 모든 도구',
    selectCategory: '카테고리 선택',
    recentlyStudied: '최근 학습 항목',
    study: '학습하기',

    phrasebookTitle: '회화집',
    phrasebookSubtitle: '22개 카테고리에 305개 문구',
    visualTranslatorTitle: '비주얼 번역',
    visualTranslatorSubtitle: '카메라로 텍스트 스캔',
    textTranslatorTitle: '텍스트 번역',
    textTranslatorSubtitle: '텍스트 입력 및 번역',
    dictionaryTitle: '사전',
    dictionarySubtitle: 'v2.0에서 출시 예정',
    aiAssistantsTitle: 'AI 어시스턴트',
    aiAssistantsSubtitle: '스마트한 힌트 및 지원',
    myFavoritesTitle: '내 즐겨찾기',
    myFavoritesSubtitle: '저장된 항목',

    pronunciation: '발음',
    addToFavorites: '즐겨찾기에 추가',
    inFavorites: '즐겨찾기에 있음',
    share: '공유',

    settingsTitle: '⚙️ 설정',
    languageInterface: '인터페이스 언어',
    switchLanguage: '언어 변경',
    audio: '오디오',
    soundEffects: '음향 효과',
    data: '데이터',
    clearHistory: '기록 지우기',
    offlineMode: '오프라인 모드',
    about: '앱 정보',
    feedback: '피드백',

    searchPlaceholder: '모든 언어로 문구 입력...',
    noResults: '결과 없음',
    searchHistory: '검색 기록',

    cancel: '취소',
    save: '저장',
    delete: '삭제',
    confirm: '확인',
    loading: '로딩 중...',
    error: '오류',
    success: '성공',

    // Visual Translator - Home Screen
    vtTranslateWithAI: 'AI로 번역',
    vtCameraSubtitle: '카메라를 텍스트에 향하면 즉시 번역',
    vtTakePhoto: '사진 촬영',
    vtChooseGallery: '갤러리에서 선택',
    vtProcessing: '이미지 처리 중...',
    vtProcessingSubtext: '텍스트 인식 및 번역 중',
    vtOcrEngine: 'OCR 엔진',
    vtFeatures: '기능',
    vtFeatureOcrTitle: 'OCR 텍스트 인식',
    vtFeatureOcrDesc: '30개 이상의 언어로 높은 정확도로 텍스트 인식',
    vtFeatureAiTitle: 'AI 객체 설명',
    vtFeatureAiDesc: '텍스트가 없을 때 객체 설명',
    vtFeatureSmartTitle: '스마트 번역',
    vtFeatureSmartDesc: 'AI 지원 문맥 번역',
    vtFeatureSaveTitle: '저장 및 공유',
    vtFeatureSaveDesc: '번역을 즐겨찾기에 저장하고 공유',
    vtPermissionsText: '카메라 및 사진 라이브러리 권한이 필요합니다',
    vtGrantPermissions: '권한 부여',
    vtRequestingPermissions: '권한 요청 중...',
    vtAutoFallback: '선택한 엔진이 실패하면 자동 전환 활성화',

    // Visual Translator - Result Screen
    vtResult: '결과',
    vtRecognizedText: '인식된 텍스트',
    vtLanguageLabel: '언어: ',
    vtAiAnalysis: 'AI 분석',
    vtTranslation: '번역',
    vtTargetLabel: '대상: ',
    vtPlay: '재생',
    vtStop: '중지',
    vtCopy: '복사',
    vtTranslateAnother: '다른 번역',
    vtCopied: '복사됨',
    vtCopiedMessage: '번역이 클립보드에 복사되었습니다',

    // Text Translator
    ttHeaderTitle: '텍스트 번역',
    ttHeroTitle: '즉시 번역',
    ttHeroSubtitle: '텍스트를 모든 언어로 번역',
    ttSelectLanguage: '언어 선택',
    ttPlaceholder: '번역할 텍스트 입력...',
    ttClear: '지우기',
    ttTranslate: '번역',
    ttTranslating: '번역 중...',
    ttPlay: '재생',
    ttStop: '중지',
    ttCopy: '복사',
    ttEmptyOutput: '번역이 여기에 표시됩니다',
    ttSourceLanguage: '원본 언어',
    ttTargetLanguage: '대상 언어',
    ttErrorTitle: '오류',
    ttErrorEmptyText: '번역할 텍스트를 입력하세요',
    ttErrorTranslationFailed: '번역 실패. 다시 시도하세요.',
    ttErrorNoInternet: '인터넷 연결 없음',
    ttErrorTextTooLong: '텍스트가 너무 깁니다. 최대 1000자입니다.',
    ttCopiedTitle: '복사됨',
    ttCopiedMessage: '번역이 클립보드에 복사되었습니다',
    ttInfoTitle: '정보',
    ttInfoCannotSwap: '언어를 바꿀 수 없습니다',
  },

  th: {
    // Thai mode: Thai speaker learning Turkmen
    home: 'หน้าหลัก',
    search: 'ค้นหา',
    favorites: 'รายการโปรด',
    settings: 'การตั้งค่า',
    additionalFeatures: 'ฟีเจอร์เพิ่มเติม',
    statistics: 'สถิติ',

    appTitle: 'แอปเรียนภาษาเติร์กเมน',
    appSubtitle: 'เครื่องมือทั้งหมดสำหรับการเรียนภาษา',
    selectCategory: 'เลือกหมวดหมู่',
    recentlyStudied: 'เรียนล่าสุด',
    study: 'เรียน',

    phrasebookTitle: 'หนังสือวลี',
    phrasebookSubtitle: '305 วลีใน 22 หมวดหมู่',
    visualTranslatorTitle: 'แปลภาพ',
    visualTranslatorSubtitle: 'สแกนข้อความด้วยกล้อง',
    textTranslatorTitle: 'แปลข้อความ',
    textTranslatorSubtitle: 'พิมพ์และแปลข้อความ',
    dictionaryTitle: 'พจนานุกรม',
    dictionarySubtitle: 'จะมาใน v2.0',
    aiAssistantsTitle: 'ผู้ช่วย AI',
    aiAssistantsSubtitle: 'คำแนะนำและการสนับสนุนอัจฉริยะ',
    myFavoritesTitle: 'รายการโปรดของฉัน',
    myFavoritesSubtitle: 'รายการที่บันทึก',

    pronunciation: 'การออกเสียง',
    addToFavorites: 'เพิ่มในรายการโปรด',
    inFavorites: 'อยู่ในรายการโปรด',
    share: 'แชร์',

    settingsTitle: '⚙️ การตั้งค่า',
    languageInterface: 'ภาษาอินเทอร์เฟซ',
    switchLanguage: 'เปลี่ยนภาษา',
    audio: 'เสียง',
    soundEffects: 'เอฟเฟกต์เสียง',
    data: 'ข้อมูล',
    clearHistory: 'ล้างประวัติ',
    offlineMode: 'โหมดออฟไลน์',
    about: 'เกี่ยวกับแอป',
    feedback: 'ความคิดเห็น',

    searchPlaceholder: 'พิมพ์วลีในภาษาใดก็ได้...',
    noResults: 'ไม่พบผลลัพธ์',
    searchHistory: 'ประวัติการค้นหา',

    cancel: 'ยกเลิก',
    save: 'บันทึก',
    delete: 'ลบ',
    confirm: 'ยืนยัน',
    loading: 'กำลังโหลด...',
    error: 'ข้อผิดพลาด',
    success: 'สำเร็จ',

    // Visual Translator - Home Screen
    vtTranslateWithAI: 'แปลด้วย AI',
    vtCameraSubtitle: 'ชี้กล้องไปที่ข้อความเพื่อแปลทันที',
    vtTakePhoto: 'ถ่ายรูป',
    vtChooseGallery: 'เลือกจากแกลเลอรี',
    vtProcessing: 'กำลังประมวลผลภาพ...',
    vtProcessingSubtext: 'กำลังรู้จำและแปลข้อความ',
    vtOcrEngine: 'เครื่องมือ OCR',
    vtFeatures: 'คุณสมบัติ',
    vtFeatureOcrTitle: 'การรู้จำข้อความ OCR',
    vtFeatureOcrDesc: 'รู้จำข้อความใน 30+ ภาษาด้วยความแม่นยำสูง',
    vtFeatureAiTitle: 'คำอธิบายวัตถุ AI',
    vtFeatureAiDesc: 'อธิบายวัตถุเมื่อไม่พบข้อความ',
    vtFeatureSmartTitle: 'การแปลอัจฉริยะ',
    vtFeatureSmartDesc: 'การแปลตามบริบทด้วย AI',
    vtFeatureSaveTitle: 'บันทึกและแชร์',
    vtFeatureSaveDesc: 'บันทึกการแปลในรายการโปรดและแชร์',
    vtPermissionsText: 'ต้องการสิทธิ์กล้องและไลบรารีรูปภาพ',
    vtGrantPermissions: 'อนุญาตสิทธิ์',
    vtRequestingPermissions: 'กำลังขอสิทธิ์...',
    vtAutoFallback: 'การเปลี่ยนอัตโนมัติเปิดใช้งานเมื่อเครื่องมือที่เลือกล้มเหลว',

    // Visual Translator - Result Screen
    vtResult: 'ผลลัพธ์',
    vtRecognizedText: 'ข้อความที่รู้จำได้',
    vtLanguageLabel: 'ภาษา: ',
    vtAiAnalysis: 'การวิเคราะห์ AI',
    vtTranslation: 'การแปล',
    vtTargetLabel: 'เป้าหมาย: ',
    vtPlay: 'เล่น',
    vtStop: 'หยุด',
    vtCopy: 'คัดลอก',
    vtTranslateAnother: 'แปลอีกครั้ง',
    vtCopied: 'คัดลอกแล้ว',
    vtCopiedMessage: 'คัดลอกการแปลไปยังคลิปบอร์ดแล้ว',

    // Text Translator
    ttHeaderTitle: 'แปลข้อความ',
    ttHeroTitle: 'แปลทันที',
    ttHeroSubtitle: 'แปลข้อความเป็นภาษาใดก็ได้',
    ttSelectLanguage: 'เลือกภาษา',
    ttPlaceholder: 'พิมพ์ข้อความที่จะแปล...',
    ttClear: 'ล้าง',
    ttTranslate: 'แปล',
    ttTranslating: 'กำลังแปล...',
    ttPlay: 'เล่น',
    ttStop: 'หยุด',
    ttCopy: 'คัดลอก',
    ttEmptyOutput: 'การแปลจะแสดงที่นี่',
    ttSourceLanguage: 'ภาษาต้นทาง',
    ttTargetLanguage: 'ภาษาเป้าหมาย',
    ttErrorTitle: 'ข้อผิดพลาด',
    ttErrorEmptyText: 'โปรดพิมพ์ข้อความที่จะแปล',
    ttErrorTranslationFailed: 'การแปลล้มเหลว ลองอีกครั้ง',
    ttErrorNoInternet: 'ไม่มีการเชื่อมต่ออินเทอร์เน็ต',
    ttErrorTextTooLong: 'ข้อความยาวเกินไป สูงสุด 1000 ตัวอักษร',
    ttCopiedTitle: 'คัดลอกแล้ว',
    ttCopiedMessage: 'คัดลอกการแปลไปยังคลิปบอร์ดแล้ว',
    ttInfoTitle: 'ข้อมูล',
    ttInfoCannotSwap: 'ไม่สามารถสลับภาษาได้',
  },

  vi: {
    // Vietnamese mode: Vietnamese speaker learning Turkmen
    home: 'Trang chủ',
    search: 'Tìm kiếm',
    favorites: 'Yêu thích',
    settings: 'Cài đặt',
    additionalFeatures: 'Tính năng bổ sung',
    statistics: 'Thống kê',

    appTitle: 'Ứng dụng học tiếng Turkmen',
    appSubtitle: 'Tất cả công cụ để học ngôn ngữ',
    selectCategory: 'Chọn danh mục',
    recentlyStudied: 'Học gần đây',
    study: 'Học',

    phrasebookTitle: 'Sách cụm từ',
    phrasebookSubtitle: '305 cụm từ trong 22 danh mục',
    visualTranslatorTitle: 'Dịch hình ảnh',
    visualTranslatorSubtitle: 'Quét văn bản bằng camera',
    textTranslatorTitle: 'Dịch văn bản',
    textTranslatorSubtitle: 'Nhập và dịch văn bản',
    dictionaryTitle: 'Từ điển',
    dictionarySubtitle: 'Sắp ra mắt trong v2.0',
    aiAssistantsTitle: 'Trợ lý AI',
    aiAssistantsSubtitle: 'Gợi ý thông minh và hỗ trợ',
    myFavoritesTitle: 'Yêu thích của tôi',
    myFavoritesSubtitle: 'Mục đã lưu',

    pronunciation: 'Phát âm',
    addToFavorites: 'Thêm vào yêu thích',
    inFavorites: 'Đã yêu thích',
    share: 'Chia sẻ',

    settingsTitle: '⚙️ Cài đặt',
    languageInterface: 'Ngôn ngữ giao diện',
    switchLanguage: 'Đổi ngôn ngữ',
    audio: 'Âm thanh',
    soundEffects: 'Hiệu ứng âm thanh',
    data: 'Dữ liệu',
    clearHistory: 'Xóa lịch sử',
    offlineMode: 'Chế độ ngoại tuyến',
    about: 'Về ứng dụng',
    feedback: 'Phản hồi',

    searchPlaceholder: 'Nhập cụm từ bằng bất kỳ ngôn ngữ nào...',
    noResults: 'Không tìm thấy kết quả',
    searchHistory: 'Lịch sử tìm kiếm',

    cancel: 'Hủy',
    save: 'Lưu',
    delete: 'Xóa',
    confirm: 'Xác nhận',
    loading: 'Đang tải...',
    error: 'Lỗi',
    success: 'Thành công',

    // Visual Translator - Home Screen
    vtTranslateWithAI: 'Dịch với AI',
    vtCameraSubtitle: 'Hướng camera vào văn bản để dịch ngay lập tức',
    vtTakePhoto: 'Chụp ảnh',
    vtChooseGallery: 'Chọn từ thư viện',
    vtProcessing: 'Đang xử lý hình ảnh...',
    vtProcessingSubtext: 'Nhận dạng và dịch văn bản',
    vtOcrEngine: 'Công cụ OCR',
    vtFeatures: 'Tính năng',
    vtFeatureOcrTitle: 'Nhận dạng văn bản OCR',
    vtFeatureOcrDesc: 'Nhận dạng văn bản trong hơn 30 ngôn ngữ với độ chính xác cao',
    vtFeatureAiTitle: 'Mô tả đối tượng AI',
    vtFeatureAiDesc: 'Mô tả đối tượng khi không tìm thấy văn bản',
    vtFeatureSmartTitle: 'Dịch thông minh',
    vtFeatureSmartDesc: 'Dịch ngữ cảnh với sự hỗ trợ của AI',
    vtFeatureSaveTitle: 'Lưu và chia sẻ',
    vtFeatureSaveDesc: 'Lưu bản dịch vào yêu thích và chia sẻ',
    vtPermissionsText: 'Cần quyền truy cập camera và thư viện ảnh',
    vtGrantPermissions: 'Cấp quyền',
    vtRequestingPermissions: 'Đang yêu cầu quyền...',
    vtAutoFallback: 'Tự động chuyển đổi được bật khi công cụ đã chọn thất bại',

    // Visual Translator - Result Screen
    vtResult: 'Kết quả',
    vtRecognizedText: 'Văn bản đã nhận dạng',
    vtLanguageLabel: 'Ngôn ngữ: ',
    vtAiAnalysis: 'Phân tích AI',
    vtTranslation: 'Bản dịch',
    vtTargetLabel: 'Đích: ',
    vtPlay: 'Phát',
    vtStop: 'Dừng',
    vtCopy: 'Sao chép',
    vtTranslateAnother: 'Dịch tiếp',
    vtCopied: 'Đã sao chép',
    vtCopiedMessage: 'Đã sao chép bản dịch vào clipboard',

    // Text Translator
    ttHeaderTitle: 'Dịch văn bản',
    ttHeroTitle: 'Dịch ngay lập tức',
    ttHeroSubtitle: 'Dịch văn bản sang bất kỳ ngôn ngữ nào',
    ttSelectLanguage: 'Chọn ngôn ngữ',
    ttPlaceholder: 'Nhập văn bản để dịch...',
    ttClear: 'Xóa',
    ttTranslate: 'Dịch',
    ttTranslating: 'Đang dịch...',
    ttPlay: 'Phát',
    ttStop: 'Dừng',
    ttCopy: 'Sao chép',
    ttEmptyOutput: 'Bản dịch sẽ xuất hiện ở đây',
    ttSourceLanguage: 'Ngôn ngữ nguồn',
    ttTargetLanguage: 'Ngôn ngữ đích',
    ttErrorTitle: 'Lỗi',
    ttErrorEmptyText: 'Vui lòng nhập văn bản để dịch',
    ttErrorTranslationFailed: 'Dịch thất bại. Thử lại.',
    ttErrorNoInternet: 'Không có kết nối Internet',
    ttErrorTextTooLong: 'Văn bản quá dài. Tối đa 1000 ký tự.',
    ttCopiedTitle: 'Đã sao chép',
    ttCopiedMessage: 'Đã sao chép bản dịch vào clipboard',
    ttInfoTitle: 'Thông tin',
    ttInfoCannotSwap: 'Không thể hoán đổi ngôn ngữ',
  },

  id: {
    // Indonesian mode: Indonesian speaker learning Turkmen
    home: 'Beranda',
    search: 'Cari',
    favorites: 'Favorit',
    settings: 'Pengaturan',
    additionalFeatures: 'Fitur tambahan',
    statistics: 'Statistik',

    appTitle: 'Aplikasi Belajar Bahasa Turkmen',
    appSubtitle: 'Semua alat untuk belajar bahasa',
    selectCategory: 'Pilih kategori',
    recentlyStudied: 'Baru dipelajari',
    study: 'Belajar',

    phrasebookTitle: 'Buku Frasa',
    phrasebookSubtitle: '305 frasa dalam 22 kategori',
    visualTranslatorTitle: 'Penerjemah Visual',
    visualTranslatorSubtitle: 'Pindai teks dengan kamera',
    textTranslatorTitle: 'Penerjemah Teks',
    textTranslatorSubtitle: 'Ketik dan terjemahkan teks',
    dictionaryTitle: 'Kamus',
    dictionarySubtitle: 'Segera hadir di v2.0',
    aiAssistantsTitle: 'Asisten AI',
    aiAssistantsSubtitle: 'Petunjuk cerdas dan dukungan',
    myFavoritesTitle: 'Favorit Saya',
    myFavoritesSubtitle: 'Item tersimpan',

    pronunciation: 'Pengucapan',
    addToFavorites: 'Tambah ke favorit',
    inFavorites: 'Sudah di favorit',
    share: 'Bagikan',

    settingsTitle: '⚙️ Pengaturan',
    languageInterface: 'Bahasa antarmuka',
    switchLanguage: 'Ganti bahasa',
    audio: 'Audio',
    soundEffects: 'Efek suara',
    data: 'Data',
    clearHistory: 'Hapus riwayat',
    offlineMode: 'Mode offline',
    about: 'Tentang aplikasi',
    feedback: 'Umpan balik',

    searchPlaceholder: 'Ketik frasa dalam bahasa apa pun...',
    noResults: 'Tidak ada hasil',
    searchHistory: 'Riwayat pencarian',

    cancel: 'Batal',
    save: 'Simpan',
    delete: 'Hapus',
    confirm: 'Konfirmasi',
    loading: 'Memuat...',
    error: 'Kesalahan',
    success: 'Berhasil',

    // Visual Translator - Home Screen
    vtTranslateWithAI: 'Terjemahkan dengan AI',
    vtCameraSubtitle: 'Arahkan kamera ke teks untuk terjemahan instan',
    vtTakePhoto: 'Ambil Foto',
    vtChooseGallery: 'Pilih dari Galeri',
    vtProcessing: 'Memproses gambar...',
    vtProcessingSubtext: 'Mengenali dan menerjemahkan teks',
    vtOcrEngine: 'Mesin OCR',
    vtFeatures: 'Fitur',
    vtFeatureOcrTitle: 'Pengenalan Teks OCR',
    vtFeatureOcrDesc: 'Mengenali teks dalam 30+ bahasa dengan akurasi tinggi',
    vtFeatureAiTitle: 'Deskripsi Objek AI',
    vtFeatureAiDesc: 'Mendeskripsikan objek saat teks tidak ditemukan',
    vtFeatureSmartTitle: 'Terjemahan Cerdas',
    vtFeatureSmartDesc: 'Terjemahan kontekstual dengan bantuan AI',
    vtFeatureSaveTitle: 'Simpan dan Bagikan',
    vtFeatureSaveDesc: 'Simpan terjemahan ke favorit dan bagikan',
    vtPermissionsText: 'Izin kamera dan perpustakaan foto diperlukan',
    vtGrantPermissions: 'Berikan Izin',
    vtRequestingPermissions: 'Meminta izin...',
    vtAutoFallback: 'Peralihan otomatis diaktifkan saat mesin yang dipilih gagal',

    // Visual Translator - Result Screen
    vtResult: 'Hasil',
    vtRecognizedText: 'Teks yang Dikenali',
    vtLanguageLabel: 'Bahasa: ',
    vtAiAnalysis: 'Analisis AI',
    vtTranslation: 'Terjemahan',
    vtTargetLabel: 'Target: ',
    vtPlay: 'Putar',
    vtStop: 'Berhenti',
    vtCopy: 'Salin',
    vtTranslateAnother: 'Terjemahkan Lagi',
    vtCopied: 'Disalin',
    vtCopiedMessage: 'Terjemahan disalin ke clipboard',

    // Text Translator
    ttHeaderTitle: 'Penerjemah Teks',
    ttHeroTitle: 'Terjemahan Instan',
    ttHeroSubtitle: 'Terjemahkan teks ke bahasa apa pun',
    ttSelectLanguage: 'Pilih Bahasa',
    ttPlaceholder: 'Ketik teks untuk diterjemahkan...',
    ttClear: 'Hapus',
    ttTranslate: 'Terjemahkan',
    ttTranslating: 'Menerjemahkan...',
    ttPlay: 'Putar',
    ttStop: 'Berhenti',
    ttCopy: 'Salin',
    ttEmptyOutput: 'Terjemahan akan muncul di sini',
    ttSourceLanguage: 'Bahasa Sumber',
    ttTargetLanguage: 'Bahasa Target',
    ttErrorTitle: 'Kesalahan',
    ttErrorEmptyText: 'Silakan masukkan teks untuk diterjemahkan',
    ttErrorTranslationFailed: 'Terjemahan gagal. Coba lagi.',
    ttErrorNoInternet: 'Tidak ada koneksi Internet',
    ttErrorTextTooLong: 'Teks terlalu panjang. Maksimal 1000 karakter.',
    ttCopiedTitle: 'Disalin',
    ttCopiedMessage: 'Terjemahan disalin ke clipboard',
    ttInfoTitle: 'Informasi',
    ttInfoCannotSwap: 'Tidak dapat menukar bahasa',
  },

  ms: {
    // Malay mode: Malay speaker learning Turkmen
    home: 'Laman Utama',
    search: 'Cari',
    favorites: 'Kegemaran',
    settings: 'Tetapan',
    additionalFeatures: 'Ciri tambahan',
    statistics: 'Statistik',

    appTitle: 'Aplikasi Pembelajaran Bahasa Turkmen',
    appSubtitle: 'Semua alat untuk belajar bahasa',
    selectCategory: 'Pilih kategori',
    recentlyStudied: 'Baru dipelajari',
    study: 'Belajar',

    phrasebookTitle: 'Buku Frasa',
    phrasebookSubtitle: '305 frasa dalam 22 kategori',
    visualTranslatorTitle: 'Penterjemah Visual',
    visualTranslatorSubtitle: 'Imbas teks dengan kamera',
    textTranslatorTitle: 'Penterjemah Teks',
    textTranslatorSubtitle: 'Taip dan terjemahkan teks',
    dictionaryTitle: 'Kamus',
    dictionarySubtitle: 'Akan datang dalam v2.0',
    aiAssistantsTitle: 'Pembantu AI',
    aiAssistantsSubtitle: 'Petua pintar dan sokongan',
    myFavoritesTitle: 'Kegemaran Saya',
    myFavoritesSubtitle: 'Item yang disimpan',

    pronunciation: 'Sebutan',
    addToFavorites: 'Tambah ke kegemaran',
    inFavorites: 'Dalam kegemaran',
    share: 'Kongsi',

    settingsTitle: '⚙️ Tetapan',
    languageInterface: 'Bahasa antara muka',
    switchLanguage: 'Tukar bahasa',
    audio: 'Audio',
    soundEffects: 'Kesan bunyi',
    data: 'Data',
    clearHistory: 'Kosongkan sejarah',
    offlineMode: 'Mod luar talian',
    about: 'Tentang aplikasi',
    feedback: 'Maklum balas',

    searchPlaceholder: 'Taip frasa dalam mana-mana bahasa...',
    noResults: 'Tiada keputusan',
    searchHistory: 'Sejarah carian',

    cancel: 'Batal',
    save: 'Simpan',
    delete: 'Padam',
    confirm: 'Sahkan',
    loading: 'Memuatkan...',
    error: 'Ralat',
    success: 'Berjaya',

    // Visual Translator - Home Screen
    vtTranslateWithAI: 'Terjemah dengan AI',
    vtCameraSubtitle: 'Tujukan kamera ke teks untuk terjemahan segera',
    vtTakePhoto: 'Ambil Gambar',
    vtChooseGallery: 'Pilih dari Galeri',
    vtProcessing: 'Memproses imej...',
    vtProcessingSubtext: 'Mengenali dan menterjemah teks',
    vtOcrEngine: 'Enjin OCR',
    vtFeatures: 'Ciri-ciri',
    vtFeatureOcrTitle: 'Pengecaman Teks OCR',
    vtFeatureOcrDesc: 'Mengenali teks dalam 30+ bahasa dengan ketepatan tinggi',
    vtFeatureAiTitle: 'Huraian Objek AI',
    vtFeatureAiDesc: 'Menghuraikan objek apabila teks tidak dijumpai',
    vtFeatureSmartTitle: 'Terjemahan Pintar',
    vtFeatureSmartDesc: 'Terjemahan kontekstual dengan bantuan AI',
    vtFeatureSaveTitle: 'Simpan dan Kongsi',
    vtFeatureSaveDesc: 'Simpan terjemahan ke kegemaran dan kongsi',
    vtPermissionsText: 'Kebenaran kamera dan perpustakaan foto diperlukan',
    vtGrantPermissions: 'Berikan Kebenaran',
    vtRequestingPermissions: 'Meminta kebenaran...',
    vtAutoFallback: 'Penukaran automatik diaktifkan apabila enjin yang dipilih gagal',

    // Visual Translator - Result Screen
    vtResult: 'Hasil',
    vtRecognizedText: 'Teks yang Dikenali',
    vtLanguageLabel: 'Bahasa: ',
    vtAiAnalysis: 'Analisis AI',
    vtTranslation: 'Terjemahan',
    vtTargetLabel: 'Sasaran: ',
    vtPlay: 'Main',
    vtStop: 'Berhenti',
    vtCopy: 'Salin',
    vtTranslateAnother: 'Terjemah Lagi',
    vtCopied: 'Disalin',
    vtCopiedMessage: 'Terjemahan disalin ke papan klip',

    // Text Translator
    ttHeaderTitle: 'Penterjemah Teks',
    ttHeroTitle: 'Terjemahan Segera',
    ttHeroSubtitle: 'Terjemahkan teks ke mana-mana bahasa',
    ttSelectLanguage: 'Pilih Bahasa',
    ttPlaceholder: 'Taip teks untuk diterjemah...',
    ttClear: 'Kosongkan',
    ttTranslate: 'Terjemah',
    ttTranslating: 'Menterjemah...',
    ttPlay: 'Main',
    ttStop: 'Berhenti',
    ttCopy: 'Salin',
    ttEmptyOutput: 'Terjemahan akan muncul di sini',
    ttSourceLanguage: 'Bahasa Sumber',
    ttTargetLanguage: 'Bahasa Sasaran',
    ttErrorTitle: 'Ralat',
    ttErrorEmptyText: 'Sila masukkan teks untuk diterjemah',
    ttErrorTranslationFailed: 'Terjemahan gagal. Cuba lagi.',
    ttErrorNoInternet: 'Tiada sambungan Internet',
    ttErrorTextTooLong: 'Teks terlalu panjang. Maksimum 1000 aksara.',
    ttCopiedTitle: 'Disalin',
    ttCopiedMessage: 'Terjemahan disalin ke papan klip',
    ttInfoTitle: 'Maklumat',
    ttInfoCannotSwap: 'Tidak boleh tukar bahasa',
  },

  hi: {
    // Hindi mode: Hindi speaker learning Turkmen
    home: 'होम',
    search: 'खोजें',
    favorites: 'पसंदीदा',
    settings: 'सेटिंग्स',
    additionalFeatures: 'अतिरिक्त सुविधाएं',
    statistics: 'आंकड़े',

    appTitle: 'तुर्कमेन भाषा सीखने का ऐप',
    appSubtitle: 'भाषा सीखने के लिए सभी उपकरण',
    selectCategory: 'श्रेणी चुनें',
    recentlyStudied: 'हाल ही में अध्ययन किया',
    study: 'अध्ययन करें',

    phrasebookTitle: 'वाक्यांश पुस्तक',
    phrasebookSubtitle: '22 श्रेणियों में 305 वाक्यांश',
    visualTranslatorTitle: 'दृश्य अनुवादक',
    visualTranslatorSubtitle: 'कैमरे से टेक्स्ट स्कैन करें',
    textTranslatorTitle: 'टेक्स्ट अनुवादक',
    textTranslatorSubtitle: 'टेक्स्ट टाइप और अनुवाद करें',
    dictionaryTitle: 'शब्दकोश',
    dictionarySubtitle: 'v2.0 में आ रहा है',
    aiAssistantsTitle: 'AI सहायक',
    aiAssistantsSubtitle: 'स्मार्ट सुझाव और समर्थन',
    myFavoritesTitle: 'मेरी पसंदीदा',
    myFavoritesSubtitle: 'सहेजी गई वस्तुएं',

    pronunciation: 'उच्चारण',
    addToFavorites: 'पसंदीदा में जोड़ें',
    inFavorites: 'पसंदीदा में',
    share: 'शेयर करें',

    settingsTitle: '⚙️ सेटिंग्स',
    languageInterface: 'इंटरफ़ेस भाषा',
    switchLanguage: 'भाषा बदलें',
    audio: 'ऑडियो',
    soundEffects: 'ध्वनि प्रभाव',
    data: 'डेटा',
    clearHistory: 'इतिहास साफ़ करें',
    offlineMode: 'ऑफ़लाइन मोड',
    about: 'ऐप के बारे में',
    feedback: 'प्रतिक्रिया',

    searchPlaceholder: 'किसी भी भाषा में वाक्यांश टाइप करें...',
    noResults: 'कोई परिणाम नहीं',
    searchHistory: 'खोज इतिहास',

    cancel: 'रद्द करें',
    save: 'सहेजें',
    delete: 'हटाएं',
    confirm: 'पुष्टि करें',
    loading: 'लोड हो रहा है...',
    error: 'त्रुटि',
    success: 'सफलता',

    // Visual Translator - Home Screen
    vtTranslateWithAI: 'AI से अनुवाद करें',
    vtCameraSubtitle: 'तत्काल अनुवाद के लिए कैमरा को टेक्स्ट पर रखें',
    vtTakePhoto: 'फोटो लें',
    vtChooseGallery: 'गैलरी से चुनें',
    vtProcessing: 'छवि संसाधित हो रही है...',
    vtProcessingSubtext: 'टेक्स्ट पहचान और अनुवाद',
    vtOcrEngine: 'OCR इंजन',
    vtFeatures: 'विशेषताएं',
    vtFeatureOcrTitle: 'OCR टेक्स्ट पहचान',
    vtFeatureOcrDesc: '30+ भाषाओं में उच्च सटीकता के साथ टेक्स्ट पहचानें',
    vtFeatureAiTitle: 'AI ऑब्जेक्ट विवरण',
    vtFeatureAiDesc: 'जब टेक्स्ट नहीं मिलता तो ऑब्जेक्ट का वर्णन करें',
    vtFeatureSmartTitle: 'स्मार्ट अनुवाद',
    vtFeatureSmartDesc: 'AI सहायता के साथ संदर्भ अनुवाद',
    vtFeatureSaveTitle: 'सहेजें और साझा करें',
    vtFeatureSaveDesc: 'अनुवाद को पसंदीदा में सहेजें और साझा करें',
    vtPermissionsText: 'कैमरा और फोटो लाइब्रेरी अनुमतियां आवश्यक हैं',
    vtGrantPermissions: 'अनुमतियां दें',
    vtRequestingPermissions: 'अनुमतियां मांगी जा रही हैं...',
    vtAutoFallback: 'जब चुना गया इंजन विफल हो तो स्वचालित स्विचिंग सक्षम है',

    // Visual Translator - Result Screen
    vtResult: 'परिणाम',
    vtRecognizedText: 'पहचाना गया टेक्स्ट',
    vtLanguageLabel: 'भाषा: ',
    vtAiAnalysis: 'AI विश्लेषण',
    vtTranslation: 'अनुवाद',
    vtTargetLabel: 'लक्ष्य: ',
    vtPlay: 'प्ले करें',
    vtStop: 'रोकें',
    vtCopy: 'कॉपी करें',
    vtTranslateAnother: 'फिर अनुवाद करें',
    vtCopied: 'कॉपी किया गया',
    vtCopiedMessage: 'अनुवाद क्लिपबोर्ड में कॉपी किया गया',

    // Text Translator
    ttHeaderTitle: 'टेक्स्ट अनुवादक',
    ttHeroTitle: 'तत्काल अनुवाद',
    ttHeroSubtitle: 'किसी भी भाषा में टेक्स्ट का अनुवाद करें',
    ttSelectLanguage: 'भाषा चुनें',
    ttPlaceholder: 'अनुवाद के लिए टेक्स्ट टाइप करें...',
    ttClear: 'साफ़ करें',
    ttTranslate: 'अनुवाद करें',
    ttTranslating: 'अनुवाद हो रहा है...',
    ttPlay: 'प्ले करें',
    ttStop: 'रोकें',
    ttCopy: 'कॉपी करें',
    ttEmptyOutput: 'अनुवाद यहां दिखाई देगा',
    ttSourceLanguage: 'स्रोत भाषा',
    ttTargetLanguage: 'लक्ष्य भाषा',
    ttErrorTitle: 'त्रुटि',
    ttErrorEmptyText: 'कृपया अनुवाद के लिए टेक्स्ट दर्ज करें',
    ttErrorTranslationFailed: 'अनुवाद विफल। पुनः प्रयास करें।',
    ttErrorNoInternet: 'कोई इंटरनेट कनेक्शन नहीं',
    ttErrorTextTooLong: 'टेक्स्ट बहुत लंबा है। अधिकतम 1000 वर्ण।',
    ttCopiedTitle: 'कॉपी किया गया',
    ttCopiedMessage: 'अनुवाद क्लिपबोर्ड में कॉपी किया गया',
    ttInfoTitle: 'जानकारी',
    ttInfoCannotSwap: 'भाषाएं स्वैप नहीं कर सकते',
  },

  ur: {
    // Urdu mode: Urdu speaker learning Turkmen (RTL)
    home: 'ہوم',
    search: 'تلاش کریں',
    favorites: 'پسندیدہ',
    settings: 'ترتیبات',
    additionalFeatures: 'اضافی خصوصیات',
    statistics: 'اعدادوشمار',

    appTitle: 'ترکمان زبان سیکھنے کی ایپ',
    appSubtitle: 'زبان سیکھنے کے لیے تمام ٹولز',
    selectCategory: 'زمرہ منتخب کریں',
    recentlyStudied: 'حال ہی میں مطالعہ کیا',
    study: 'مطالعہ کریں',

    phrasebookTitle: 'جملوں کی کتاب',
    phrasebookSubtitle: '22 زمروں میں 305 جملے',
    visualTranslatorTitle: 'بصری مترجم',
    visualTranslatorSubtitle: 'کیمرے سے متن سکین کریں',
    textTranslatorTitle: 'متن کا مترجم',
    textTranslatorSubtitle: 'متن ٹائپ اور ترجمہ کریں',
    dictionaryTitle: 'لغت',
    dictionarySubtitle: 'v2.0 میں آرہا ہے',
    aiAssistantsTitle: 'AI معاون',
    aiAssistantsSubtitle: 'سمارٹ تجاویز اور تعاون',
    myFavoritesTitle: 'میری پسندیدہ',
    myFavoritesSubtitle: 'محفوظ کردہ اشیاء',

    pronunciation: 'تلفظ',
    addToFavorites: 'پسندیدہ میں شامل کریں',
    inFavorites: 'پسندیدہ میں',
    share: 'شیئر کریں',

    settingsTitle: '⚙️ ترتیبات',
    languageInterface: 'انٹرفیس کی زبان',
    switchLanguage: 'زبان تبدیل کریں',
    audio: 'آڈیو',
    soundEffects: 'آواز کے اثرات',
    data: 'ڈیٹا',
    clearHistory: 'سرگزشت صاف کریں',
    offlineMode: 'آف لائن موڈ',
    about: 'ایپ کے بارے میں',
    feedback: 'رائے',

    searchPlaceholder: 'کسی بھی زبان میں جملہ ٹائپ کریں...',
    noResults: 'کوئی نتیجہ نہیں',
    searchHistory: 'تلاش کی سرگزشت',

    cancel: 'منسوخ کریں',
    save: 'محفوظ کریں',
    delete: 'حذف کریں',
    confirm: 'تصدیق کریں',
    loading: 'لوڈ ہو رہا ہے...',
    error: 'خرابی',
    success: 'کامیابی',

    // Visual Translator - Home Screen
    vtTranslateWithAI: 'AI سے ترجمہ کریں',
    vtCameraSubtitle: 'فوری ترجمے کے لیے کیمرا کو متن پر رکھیں',
    vtTakePhoto: 'تصویر لیں',
    vtChooseGallery: 'گیلری سے منتخب کریں',
    vtProcessing: 'تصویر پروسیس ہو رہی ہے...',
    vtProcessingSubtext: 'متن کی شناخت اور ترجمہ',
    vtOcrEngine: 'OCR انجن',
    vtFeatures: 'خصوصیات',
    vtFeatureOcrTitle: 'OCR متن کی شناخت',
    vtFeatureOcrDesc: '30+ زبانوں میں اعلیٰ درستگی کے ساتھ متن کی شناخت',
    vtFeatureAiTitle: 'AI آبجیکٹ کی تفصیل',
    vtFeatureAiDesc: 'جب متن نہ ملے تو آبجیکٹ کی تفصیل',
    vtFeatureSmartTitle: 'سمارٹ ترجمہ',
    vtFeatureSmartDesc: 'AI مدد کے ساتھ سیاق و سباق کا ترجمہ',
    vtFeatureSaveTitle: 'محفوظ اور شیئر کریں',
    vtFeatureSaveDesc: 'ترجمے کو پسندیدہ میں محفوظ کریں اور شیئر کریں',
    vtPermissionsText: 'کیمرا اور فوٹو لائبریری کی اجازت درکار ہے',
    vtGrantPermissions: 'اجازت دیں',
    vtRequestingPermissions: 'اجازت مانگی جا رہی ہے...',
    vtAutoFallback: 'جب منتخب انجن ناکام ہو تو خودکار سوئچنگ فعال ہے',

    // Visual Translator - Result Screen
    vtResult: 'نتیجہ',
    vtRecognizedText: 'شناخت شدہ متن',
    vtLanguageLabel: 'زبان: ',
    vtAiAnalysis: 'AI تجزیہ',
    vtTranslation: 'ترجمہ',
    vtTargetLabel: 'ہدف: ',
    vtPlay: 'چلائیں',
    vtStop: 'روکیں',
    vtCopy: 'کاپی کریں',
    vtTranslateAnother: 'دوبارہ ترجمہ کریں',
    vtCopied: 'کاپی ہو گیا',
    vtCopiedMessage: 'ترجمہ کلپ بورڈ میں کاپی ہو گیا',

    // Text Translator
    ttHeaderTitle: 'متن کا مترجم',
    ttHeroTitle: 'فوری ترجمہ',
    ttHeroSubtitle: 'کسی بھی زبان میں متن کا ترجمہ کریں',
    ttSelectLanguage: 'زبان منتخب کریں',
    ttPlaceholder: 'ترجمے کے لیے متن ٹائپ کریں...',
    ttClear: 'صاف کریں',
    ttTranslate: 'ترجمہ کریں',
    ttTranslating: 'ترجمہ ہو رہا ہے...',
    ttPlay: 'چلائیں',
    ttStop: 'روکیں',
    ttCopy: 'کاپی کریں',
    ttEmptyOutput: 'ترجمہ یہاں ظاہر ہوگا',
    ttSourceLanguage: 'ماخذ زبان',
    ttTargetLanguage: 'ہدف زبان',
    ttErrorTitle: 'خرابی',
    ttErrorEmptyText: 'براہ کرم ترجمے کے لیے متن درج کریں',
    ttErrorTranslationFailed: 'ترجمہ ناکام۔ دوبارہ کوشش کریں۔',
    ttErrorNoInternet: 'انٹرنیٹ کنیکشن نہیں',
    ttErrorTextTooLong: 'متن بہت لمبا ہے۔ زیادہ سے زیادہ 1000 حروف۔',
    ttCopiedTitle: 'کاپی ہو گیا',
    ttCopiedMessage: 'ترجمہ کلپ بورڈ میں کاپی ہو گیا',
    ttInfoTitle: 'معلومات',
    ttInfoCannotSwap: 'زبانیں تبدیل نہیں ہو سکتیں',
  },

  fa: {
    // Persian mode: Persian speaker learning Turkmen (RTL)
    home: 'خانه',
    search: 'جستجو',
    favorites: 'علاقه‌مندی‌ها',
    settings: 'تنظیمات',
    additionalFeatures: 'ویژگی‌های اضافی',
    statistics: 'آمار',

    appTitle: 'برنامه یادگیری زبان ترکمنی',
    appSubtitle: 'تمام ابزارها برای یادگیری زبان',
    selectCategory: 'انتخاب دسته‌بندی',
    recentlyStudied: 'اخیراً مطالعه شده',
    study: 'مطالعه',

    phrasebookTitle: 'کتاب عبارات',
    phrasebookSubtitle: '305 عبارت در 22 دسته',
    visualTranslatorTitle: 'مترجم بصری',
    visualTranslatorSubtitle: 'اسکن متن با دوربین',
    textTranslatorTitle: 'مترجم متن',
    textTranslatorSubtitle: 'تایپ و ترجمه متن',
    dictionaryTitle: 'فرهنگ لغت',
    dictionarySubtitle: 'به زودی در v2.0',
    aiAssistantsTitle: 'دستیاران هوش مصنوعی',
    aiAssistantsSubtitle: 'راهنمایی‌های هوشمند و پشتیبانی',
    myFavoritesTitle: 'علاقه‌مندی‌های من',
    myFavoritesSubtitle: 'موارد ذخیره شده',

    pronunciation: 'تلفظ',
    addToFavorites: 'افزودن به علاقه‌مندی‌ها',
    inFavorites: 'در علاقه‌مندی‌ها',
    share: 'اشتراک‌گذاری',

    settingsTitle: '⚙️ تنظیمات',
    languageInterface: 'زبان رابط کاربری',
    switchLanguage: 'تغییر زبان',
    audio: 'صدا',
    soundEffects: 'جلوه‌های صوتی',
    data: 'داده‌ها',
    clearHistory: 'پاک کردن تاریخچه',
    offlineMode: 'حالت آفلاین',
    about: 'درباره برنامه',
    feedback: 'بازخورد',

    searchPlaceholder: 'عبارت را به هر زبانی تایپ کنید...',
    noResults: 'نتیجه‌ای یافت نشد',
    searchHistory: 'تاریخچه جستجو',

    cancel: 'لغو',
    save: 'ذخیره',
    delete: 'حذف',
    confirm: 'تأیید',
    loading: 'در حال بارگذاری...',
    error: 'خطا',
    success: 'موفقیت',

    // Visual Translator - Home Screen
    vtTranslateWithAI: 'ترجمه با هوش مصنوعی',
    vtCameraSubtitle: 'دوربین را روی متن بگیرید برای ترجمه فوری',
    vtTakePhoto: 'عکس بگیرید',
    vtChooseGallery: 'انتخاب از گالری',
    vtProcessing: 'در حال پردازش تصویر...',
    vtProcessingSubtext: 'شناسایی و ترجمه متن',
    vtOcrEngine: 'موتور OCR',
    vtFeatures: 'ویژگی‌ها',
    vtFeatureOcrTitle: 'شناسایی متن OCR',
    vtFeatureOcrDesc: 'شناسایی متن در بیش از 30 زبان با دقت بالا',
    vtFeatureAiTitle: 'توصیف اشیا با هوش مصنوعی',
    vtFeatureAiDesc: 'توصیف اشیا وقتی متن پیدا نشود',
    vtFeatureSmartTitle: 'ترجمه هوشمند',
    vtFeatureSmartDesc: 'ترجمه زمینه‌ای با کمک هوش مصنوعی',
    vtFeatureSaveTitle: 'ذخیره و اشتراک‌گذاری',
    vtFeatureSaveDesc: 'ذخیره ترجمه‌ها در علاقه‌مندی‌ها و اشتراک‌گذاری',
    vtPermissionsText: 'مجوز دوربین و کتابخانه عکس مورد نیاز است',
    vtGrantPermissions: 'اعطای مجوز',
    vtRequestingPermissions: 'درخواست مجوزها...',
    vtAutoFallback: 'جابجایی خودکار فعال است وقتی موتور انتخابی ناموفق باشد',

    // Visual Translator - Result Screen
    vtResult: 'نتیجه',
    vtRecognizedText: 'متن شناسایی شده',
    vtLanguageLabel: 'زبان: ',
    vtAiAnalysis: 'تحلیل هوش مصنوعی',
    vtTranslation: 'ترجمه',
    vtTargetLabel: 'هدف: ',
    vtPlay: 'پخش',
    vtStop: 'توقف',
    vtCopy: 'کپی',
    vtTranslateAnother: 'ترجمه دیگری',
    vtCopied: 'کپی شد',
    vtCopiedMessage: 'ترجمه در کلیپ‌بورد کپی شد',

    // Text Translator
    ttHeaderTitle: 'مترجم متن',
    ttHeroTitle: 'ترجمه فوری',
    ttHeroSubtitle: 'ترجمه متن به هر زبانی',
    ttSelectLanguage: 'انتخاب زبان',
    ttPlaceholder: 'متن را برای ترجمه تایپ کنید...',
    ttClear: 'پاک کردن',
    ttTranslate: 'ترجمه',
    ttTranslating: 'در حال ترجمه...',
    ttPlay: 'پخش',
    ttStop: 'توقف',
    ttCopy: 'کپی',
    ttEmptyOutput: 'ترجمه اینجا ظاهر می‌شود',
    ttSourceLanguage: 'زبان مبدأ',
    ttTargetLanguage: 'زبان مقصد',
    ttErrorTitle: 'خطا',
    ttErrorEmptyText: 'لطفاً متنی برای ترجمه وارد کنید',
    ttErrorTranslationFailed: 'ترجمه ناموفق. دوباره تلاش کنید.',
    ttErrorNoInternet: 'اتصال به اینترنت وجود ندارد',
    ttErrorTextTooLong: 'متن خیلی طولانی است. حداکثر 1000 کاراکتر.',
    ttCopiedTitle: 'کپی شد',
    ttCopiedMessage: 'ترجمه در کلیپ‌بورد کپی شد',
    ttInfoTitle: 'اطلاعات',
    ttInfoCannotSwap: 'نمی‌توان زبان‌ها را جابجا کرد',
  },

  ps: {
    // Pashto mode: Pashto speaker learning Turkmen (RTL)
    home: 'کور',
    search: 'لټون',
    favorites: 'خوښې',
    settings: 'تنظیمات',
    additionalFeatures: 'اضافي ځانګړتیاوې',
    statistics: 'شمېرنه',

    appTitle: 'د ترکمني ژبې زده کړې اپلیکیشن',
    appSubtitle: 'د ژبې زده کړې لپاره ټولې وسیلې',
    selectCategory: 'کټګورۍ وټاکئ',
    recentlyStudied: 'وروستۍ مطالعه شوي',
    study: 'مطالعه',

    phrasebookTitle: 'د جملو کتاب',
    phrasebookSubtitle: 'په 22 کټګوریو کې 305 جملې',
    visualTranslatorTitle: 'لیدلی ژباړن',
    visualTranslatorSubtitle: 'د کیمرې سره متن سکین کړئ',
    textTranslatorTitle: 'د متن ژباړن',
    textTranslatorSubtitle: 'متن ټایپ او ژباړه کړئ',
    dictionaryTitle: 'قاموس',
    dictionarySubtitle: 'په v2.0 کې راځي',
    aiAssistantsTitle: 'AI مرستندویان',
    aiAssistantsSubtitle: 'هوښیار لارښوونې او ملاتړ',
    myFavoritesTitle: 'زما خوښې',
    myFavoritesSubtitle: 'خوندي شوي توکي',

    pronunciation: 'تلفظ',
    addToFavorites: 'خوښو ته اضافه کړئ',
    inFavorites: 'په خوښو کې',
    share: 'شریکول',

    settingsTitle: '⚙️ تنظیمات',
    languageInterface: 'د انٹرفیس ژبه',
    switchLanguage: 'ژبه بدله کړئ',
    audio: 'آډیو',
    soundEffects: 'د غږ اغیزې',
    data: 'ډاټا',
    clearHistory: 'تاریخچه پاکه کړئ',
    offlineMode: 'آفلاین حالت',
    about: 'د اپلیکیشن په اړه',
    feedback: 'غبرګون',

    searchPlaceholder: 'په هره ژبه کې جمله ټایپ کړئ...',
    noResults: 'نتیجه ونه موندل شوه',
    searchHistory: 'د لټون تاریخچه',

    cancel: 'لغوه کړئ',
    save: 'خوندي کړئ',
    delete: 'ړنګول',
    confirm: 'تایید کړئ',
    loading: 'بارېږي...',
    error: 'تېروتنه',
    success: 'بریالیتوب',

    // Visual Translator - Home Screen
    vtTranslateWithAI: 'د AI سره ژباړه کړئ',
    vtCameraSubtitle: 'د فوري ژباړې لپاره کیمره متن ته ونیسئ',
    vtTakePhoto: 'عکس واخلئ',
    vtChooseGallery: 'د ګالري څخه انتخاب کړئ',
    vtProcessing: 'انځور پروسس کیږي...',
    vtProcessingSubtext: 'د متن پیژندنه او ژباړه',
    vtOcrEngine: 'OCR انجن',
    vtFeatures: 'ځانګړتیاوې',
    vtFeatureOcrTitle: 'OCR د متن پیژندنه',
    vtFeatureOcrDesc: 'په 30+ ژبو کې د لوړ دقت سره متن وپیژنئ',
    vtFeatureAiTitle: 'AI د شیانو تشریح',
    vtFeatureAiDesc: 'کله چې متن ونه موندل شي شیان تشریح کړئ',
    vtFeatureSmartTitle: 'هوښیاره ژباړه',
    vtFeatureSmartDesc: 'د AI مرستې سره د شرایطو ژباړه',
    vtFeatureSaveTitle: 'خوندي او شریکول',
    vtFeatureSaveDesc: 'ژباړې په خوښو کې خوندي کړئ او شریک کړئ',
    vtPermissionsText: 'د کیمرې او د عکس کتابتون اجازې ته اړتیا ده',
    vtGrantPermissions: 'اجازې ورکړئ',
    vtRequestingPermissions: 'اجازې غوښتل کیږي...',
    vtAutoFallback: 'کله چې غوره شوی انجن ناکام شي خودکار بدلون فعال دی',

    // Visual Translator - Result Screen
    vtResult: 'پایله',
    vtRecognizedText: 'پیژندل شوی متن',
    vtLanguageLabel: 'ژبه: ',
    vtAiAnalysis: 'AI تحلیل',
    vtTranslation: 'ژباړه',
    vtTargetLabel: 'هدف: ',
    vtPlay: 'غږول',
    vtStop: 'ودرول',
    vtCopy: 'کاپي',
    vtTranslateAnother: 'بله ژباړه',
    vtCopied: 'کاپي شوه',
    vtCopiedMessage: 'ژباړه کلیپ بورډ ته کاپي شوه',

    // Text Translator
    ttHeaderTitle: 'د متن ژباړن',
    ttHeroTitle: 'فوري ژباړه',
    ttHeroSubtitle: 'متن په هره ژبه کې وژباړئ',
    ttSelectLanguage: 'ژبه وټاکئ',
    ttPlaceholder: 'د ژباړې لپاره متن ټایپ کړئ...',
    ttClear: 'پاکول',
    ttTranslate: 'ژباړه',
    ttTranslating: 'ژباړل کیږي...',
    ttPlay: 'غږول',
    ttStop: 'ودرول',
    ttCopy: 'کاپي',
    ttEmptyOutput: 'ژباړه دلته ښکاري',
    ttSourceLanguage: 'سرچینې ژبه',
    ttTargetLanguage: 'د هدف ژبه',
    ttErrorTitle: 'تېروتنه',
    ttErrorEmptyText: 'مهرباني وکړئ د ژباړې لپاره متن دننه کړئ',
    ttErrorTranslationFailed: 'ژباړه ناکامه شوه. بیا هڅه وکړئ.',
    ttErrorNoInternet: 'د انټرنیټ اتصال شتون نلري',
    ttErrorTextTooLong: 'متن ډیر اوږد دی. تر 1000 کرکټرونو پورې.',
    ttCopiedTitle: 'کاپي شوه',
    ttCopiedMessage: 'ژباړه کلیپ بورډ ته کاپي شوه',
    ttInfoTitle: 'معلومات',
    ttInfoCannotSwap: 'ژبې تبدیل نشي کیدای',
  },

  uz: {
    // Uzbek mode: Uzbek speaker learning Turkmen
    home: 'Bosh sahifa',
    search: 'Qidirish',
    favorites: 'Sevimlilar',
    settings: 'Sozlamalar',
    additionalFeatures: 'Qo\'shimcha xususiyatlar',
    statistics: 'Statistika',

    appTitle: 'Turkman tilini o\'rganish ilovasi',
    appSubtitle: 'Til o\'rganish uchun barcha vositalar',
    selectCategory: 'Kategoriyani tanlang',
    recentlyStudied: 'Yaqinda o\'rganilgan',
    study: 'O\'rganish',

    phrasebookTitle: 'Iboralar kitobi',
    phrasebookSubtitle: '22 kategoriyada 305 ibora',
    visualTranslatorTitle: 'Vizual tarjimon',
    visualTranslatorSubtitle: 'Kamera bilan matnni skanerlash',
    textTranslatorTitle: 'Matn tarjimoni',
    textTranslatorSubtitle: 'Matn kiritish va tarjima qilish',
    dictionaryTitle: 'Lug\'at',
    dictionarySubtitle: 'v2.0 da chiqadi',
    aiAssistantsTitle: 'AI yordamchilar',
    aiAssistantsSubtitle: 'Aqlli maslahatlar va qo\'llab-quvvatlash',
    myFavoritesTitle: 'Mening sevimlilarim',
    myFavoritesSubtitle: 'Saqlangan elementlar',

    pronunciation: 'Talaffuz',
    addToFavorites: 'Sevimlilarga qo\'shish',
    inFavorites: 'Sevimlilarda',
    share: 'Ulashish',

    settingsTitle: '⚙️ Sozlamalar',
    languageInterface: 'Interfeys tili',
    switchLanguage: 'Tilni o\'zgartirish',
    audio: 'Audio',
    soundEffects: 'Ovoz effektlari',
    data: 'Ma\'lumotlar',
    clearHistory: 'Tarixni tozalash',
    offlineMode: 'Oflayn rejim',
    about: 'Ilova haqida',
    feedback: 'Fikr-mulohaza',

    searchPlaceholder: 'Iborani istalgan tilda kiriting...',
    noResults: 'Natija topilmadi',
    searchHistory: 'Qidiruv tarixi',

    cancel: 'Bekor qilish',
    save: 'Saqlash',
    delete: 'O\'chirish',
    confirm: 'Tasdiqlash',
    loading: 'Yuklanmoqda...',
    error: 'Xato',
    success: 'Muvaffaqiyat',

    // Visual Translator - Home Screen
    vtTranslateWithAI: 'AI bilan tarjima qiling',
    vtCameraSubtitle: 'Tezkor tarjima uchun kamerani matnga qarating',
    vtTakePhoto: 'Rasm oling',
    vtChooseGallery: 'Galereyadan tanlang',
    vtProcessing: 'Rasm qayta ishlanmoqda...',
    vtProcessingSubtext: 'Matn tanib olinmoqda va tarjima qilinmoqda',
    vtOcrEngine: 'OCR mexanizmi',
    vtFeatures: 'Xususiyatlar',
    vtFeatureOcrTitle: 'OCR matn tanish',
    vtFeatureOcrDesc: '30+ tilda yuqori aniqlik bilan matnni tanish',
    vtFeatureAiTitle: 'AI ob\'ektlarni tasvirlash',
    vtFeatureAiDesc: 'Matn topilmaganda ob\'ektlarni tasvirlash',
    vtFeatureSmartTitle: 'Aqlli tarjima',
    vtFeatureSmartDesc: 'AI yordami bilan kontekstli tarjima',
    vtFeatureSaveTitle: 'Saqlash va ulashish',
    vtFeatureSaveDesc: 'Tarjimalarni sevimlilarga saqlash va ulashish',
    vtPermissionsText: 'Kamera va foto kutubxona ruxsatlari kerak',
    vtGrantPermissions: 'Ruxsat berish',
    vtRequestingPermissions: 'Ruxsat so\'ralmoqda...',
    vtAutoFallback: 'Tanlangan mexanizm ishlamay qolganda avtomatik almashtirish faol',

    // Visual Translator - Result Screen
    vtResult: 'Natija',
    vtRecognizedText: 'Tanilgan matn',
    vtLanguageLabel: 'Til: ',
    vtAiAnalysis: 'AI tahlili',
    vtTranslation: 'Tarjima',
    vtTargetLabel: 'Maqsad: ',
    vtPlay: 'Ijro etish',
    vtStop: 'To\'xtatish',
    vtCopy: 'Nusxalash',
    vtTranslateAnother: 'Boshqa tarjima',
    vtCopied: 'Nusxalandi',
    vtCopiedMessage: 'Tarjima klipbordga nusxalandi',

    // Text Translator
    ttHeaderTitle: 'Matn tarjimoni',
    ttHeroTitle: 'Tezkor tarjima',
    ttHeroSubtitle: 'Matnni istalgan tilga tarjima qiling',
    ttSelectLanguage: 'Tilni tanlang',
    ttPlaceholder: 'Tarjima uchun matn kiriting...',
    ttClear: 'Tozalash',
    ttTranslate: 'Tarjima qilish',
    ttTranslating: 'Tarjima qilinmoqda...',
    ttPlay: 'Ijro etish',
    ttStop: 'To\'xtatish',
    ttCopy: 'Nusxalash',
    ttEmptyOutput: 'Tarjima bu yerda paydo bo\'ladi',
    ttSourceLanguage: 'Manba til',
    ttTargetLanguage: 'Maqsadli til',
    ttErrorTitle: 'Xato',
    ttErrorEmptyText: 'Iltimos, tarjima uchun matn kiriting',
    ttErrorTranslationFailed: 'Tarjima amalga oshmadi. Qayta urinib ko\'ring.',
    ttErrorNoInternet: 'Internet aloqasi yo\'q',
    ttErrorTextTooLong: 'Matn juda uzun. Maksimal 1000 belgi.',
    ttCopiedTitle: 'Nusxalandi',
    ttCopiedMessage: 'Tarjima klipbordga nusxalandi',
    ttInfoTitle: 'Ma\'lumot',
    ttInfoCannotSwap: 'Tillarni almashtirib bo\'lmaydi',
  },

  kk: {
    // Kazakh mode: Kazakh speaker learning Turkmen
    home: 'Басты бет',
    search: 'Іздеу',
    favorites: 'Таңдаулылар',
    settings: 'Параметрлер',
    additionalFeatures: 'Қосымша мүмкіндіктер',
    statistics: 'Статистика',

    appTitle: 'Түрікмен тілін үйрену қолданбасы',
    appSubtitle: 'Тіл үйрену үшін барлық құралдар',
    selectCategory: 'Санатты таңдаңыз',
    recentlyStudied: 'Жақында үйренілген',
    study: 'Оқу',

    phrasebookTitle: 'Сөйлем кітабы',
    phrasebookSubtitle: '22 санатта 305 сөйлем',
    visualTranslatorTitle: 'Визуалды аудармашы',
    visualTranslatorSubtitle: 'Камерамен мәтінді сканерлеу',
    textTranslatorTitle: 'Мәтін аудармашысы',
    textTranslatorSubtitle: 'Мәтін енгізу және аудару',
    dictionaryTitle: 'Сөздік',
    dictionarySubtitle: 'v2.0-де шығады',
    aiAssistantsTitle: 'AI көмекшілері',
    aiAssistantsSubtitle: 'Ақылды кеңестер және қолдау',
    myFavoritesTitle: 'Менің таңдаулыларым',
    myFavoritesSubtitle: 'Сақталған элементтер',

    pronunciation: 'Айтылуы',
    addToFavorites: 'Таңдаулыларға қосу',
    inFavorites: 'Таңдаулыларда',
    share: 'Бөлісу',

    settingsTitle: '⚙️ Параметрлер',
    languageInterface: 'Интерфейс тілі',
    switchLanguage: 'Тілді өзгерту',
    audio: 'Аудио',
    soundEffects: 'Дыбыс эффектілері',
    data: 'Деректер',
    clearHistory: 'Тарихты тазалау',
    offlineMode: 'Офлайн режимі',
    about: 'Қолданба туралы',
    feedback: 'Кері байланыс',

    searchPlaceholder: 'Кез келген тілде сөйлем енгізіңіз...',
    noResults: 'Нәтиже табылмады',
    searchHistory: 'Іздеу тарихы',

    cancel: 'Болдырмау',
    save: 'Сақтау',
    delete: 'Жою',
    confirm: 'Растау',
    loading: 'Жүктелуде...',
    error: 'Қате',
    success: 'Сәттілік',

    // Visual Translator - Home Screen
    vtTranslateWithAI: 'AI арқылы аудару',
    vtCameraSubtitle: 'Жедел аудару үшін камераны мәтінге бағыттаңыз',
    vtTakePhoto: 'Сурет түсіру',
    vtChooseGallery: 'Галереядан таңдау',
    vtProcessing: 'Сурет өңделуде...',
    vtProcessingSubtext: 'Мәтінді тану және аудару',
    vtOcrEngine: 'OCR қозғалтқышы',
    vtFeatures: 'Мүмкіндіктер',
    vtFeatureOcrTitle: 'OCR мәтінді тану',
    vtFeatureOcrDesc: '30+ тілде жоғары дәлдікпен мәтінді тану',
    vtFeatureAiTitle: 'AI нысандарды сипаттау',
    vtFeatureAiDesc: 'Мәтін табылмаған кезде нысандарды сипаттау',
    vtFeatureSmartTitle: 'Ақылды аудару',
    vtFeatureSmartDesc: 'AI көмегімен контекстік аудару',
    vtFeatureSaveTitle: 'Сақтау және бөлісу',
    vtFeatureSaveDesc: 'Аудармаларды таңдаулыларға сақтау және бөлісу',
    vtPermissionsText: 'Камера және фото кітапхана рұқсаттары қажет',
    vtGrantPermissions: 'Рұқсат беру',
    vtRequestingPermissions: 'Рұқсаттар сұралуда...',
    vtAutoFallback: 'Таңдалған қозғалтқыш сәтсіз болғанда автоматты ауыстыру қосулы',

    // Visual Translator - Result Screen
    vtResult: 'Нәтиже',
    vtRecognizedText: 'Танылған мәтін',
    vtLanguageLabel: 'Тіл: ',
    vtAiAnalysis: 'AI талдауы',
    vtTranslation: 'Аудару',
    vtTargetLabel: 'Мақсат: ',
    vtPlay: 'Ойнату',
    vtStop: 'Тоқтату',
    vtCopy: 'Көшіру',
    vtTranslateAnother: 'Тағы бір аудару',
    vtCopied: 'Көшірілді',
    vtCopiedMessage: 'Аудару алмасу буферіне көшірілді',

    // Text Translator
    ttHeaderTitle: 'Мәтін аудармашысы',
    ttHeroTitle: 'Жедел аудару',
    ttHeroSubtitle: 'Мәтінді кез келген тілге аударыңыз',
    ttSelectLanguage: 'Тілді таңдау',
    ttPlaceholder: 'Аударуға мәтін енгізіңіз...',
    ttClear: 'Тазалау',
    ttTranslate: 'Аудару',
    ttTranslating: 'Аударылуда...',
    ttPlay: 'Ойнату',
    ttStop: 'Тоқтату',
    ttCopy: 'Көшіру',
    ttEmptyOutput: 'Аудару осында пайда болады',
    ttSourceLanguage: 'Бастапқы тіл',
    ttTargetLanguage: 'Мақсатты тіл',
    ttErrorTitle: 'Қате',
    ttErrorEmptyText: 'Аударуға мәтін енгізіңіз',
    ttErrorTranslationFailed: 'Аудару сәтсіз. Қайталап көріңіз.',
    ttErrorNoInternet: 'Интернет қосылымы жоқ',
    ttErrorTextTooLong: 'Мәтін тым ұзын. Максимум 1000 таңба.',
    ttCopiedTitle: 'Көшірілді',
    ttCopiedMessage: 'Аудару алмасу буферіне көшірілді',
    ttInfoTitle: 'Ақпарат',
    ttInfoCannotSwap: 'Тілдерді ауыстыру мүмкін емес',
  },

  az: {
    // Azerbaijani mode: Azerbaijani speaker learning Turkmen
    home: 'Ana səhifə',
    search: 'Axtar',
    favorites: 'Sevimlilər',
    settings: 'Parametrlər',
    additionalFeatures: 'Əlavə xüsusiyyətlər',
    statistics: 'Statistika',

    appTitle: 'Türkmən dilini öyrənmə tətbiqi',
    appSubtitle: 'Dil öyrənmək üçün bütün alətlər',
    selectCategory: 'Kateqoriya seçin',
    recentlyStudied: 'Son öyrənilənlər',
    study: 'Öyrən',

    phrasebookTitle: 'İfadələr kitabı',
    phrasebookSubtitle: '22 kateqoriyada 305 ifadə',
    visualTranslatorTitle: 'Vizual tərcüməçi',
    visualTranslatorSubtitle: 'Kamera ilə mətn skan et',
    textTranslatorTitle: 'Mətn tərcüməçisi',
    textTranslatorSubtitle: 'Mətn yaz və tərcümə et',
    dictionaryTitle: 'Lüğət',
    dictionarySubtitle: 'v2.0-da gələcək',
    aiAssistantsTitle: 'Sİ köməkçiləri',
    aiAssistantsSubtitle: 'Ağıllı məsləhətlər və dəstək',
    myFavoritesTitle: 'Mənim sevimlilərim',
    myFavoritesSubtitle: 'Saxlanmış elementlər',

    pronunciation: 'Tələffüz',
    addToFavorites: 'Sevimlilərə əlavə et',
    inFavorites: 'Sevimlilərdə',
    share: 'Paylaş',

    settingsTitle: '⚙️ Parametrlər',
    languageInterface: 'İnterfeys dili',
    switchLanguage: 'Dili dəyiş',
    audio: 'Audio',
    soundEffects: 'Səs effektləri',
    data: 'Məlumat',
    clearHistory: 'Tarixçəni təmizlə',
    offlineMode: 'Oflayn rejim',
    about: 'Tətbiq haqqında',
    feedback: 'Rəy',

    searchPlaceholder: 'İstənilən dildə ifadə yazın...',
    noResults: 'Nəticə tapılmadı',
    searchHistory: 'Axtarış tarixçəsi',

    cancel: 'Ləğv et',
    save: 'Saxla',
    delete: 'Sil',
    confirm: 'Təsdiq et',
    loading: 'Yüklənir...',
    error: 'Xəta',
    success: 'Uğurlu',

    // Visual Translator - Home Screen
    vtTranslateWithAI: 'Sİ ilə tərcümə et',
    vtCameraSubtitle: 'Ani tərcümə üçün kameranı mətinə yönəlt',
    vtTakePhoto: 'Şəkil çək',
    vtChooseGallery: 'Qalereyadan seç',
    vtProcessing: 'Şəkil işlənir...',
    vtProcessingSubtext: 'Mətn tanınır və tərcümə edilir',
    vtOcrEngine: 'OCR mühərriki',
    vtFeatures: 'Xüsusiyyətlər',
    vtFeatureOcrTitle: 'OCR mətn tanıma',
    vtFeatureOcrDesc: '30+ dildə yüksək dəqiqliklə mətni tanıyır',
    vtFeatureAiTitle: 'Sİ obyekt təsviri',
    vtFeatureAiDesc: 'Mətn tapılmadıqda obyektləri təsvir edir',
    vtFeatureSmartTitle: 'Ağıllı tərcümə',
    vtFeatureSmartDesc: 'Sİ dəstəyi ilə kontekstual tərcümə',
    vtFeatureSaveTitle: 'Saxla və paylaş',
    vtFeatureSaveDesc: 'Tərcümələri sevimlilərə saxla və paylaş',
    vtPermissionsText: 'Kamera və foto kitabxana icazələri tələb olunur',
    vtGrantPermissions: 'İcazə ver',
    vtRequestingPermissions: 'İcazələr tələb edilir...',
    vtAutoFallback: 'Seçilmiş mühərrik uğursuz olduqda avtomatik keçid aktivdir',

    // Visual Translator - Result Screen
    vtResult: 'Nəticə',
    vtRecognizedText: 'Tanınmış mətn',
    vtLanguageLabel: 'Dil: ',
    vtAiAnalysis: 'Sİ təhlili',
    vtTranslation: 'Tərcümə',
    vtTargetLabel: 'Hədəf: ',
    vtPlay: 'Oxut',
    vtStop: 'Dayandır',
    vtCopy: 'Kopyala',
    vtTranslateAnother: 'Başqa tərcümə',
    vtCopied: 'Kopyalandı',
    vtCopiedMessage: 'Tərcümə buferə kopyalandı',

    // Text Translator
    ttHeaderTitle: 'Mətn tərcüməçisi',
    ttHeroTitle: 'Ani tərcümə',
    ttHeroSubtitle: 'Mətni istənilən dilə tərcümə et',
    ttSelectLanguage: 'Dil seç',
    ttPlaceholder: 'Tərcümə üçün mətn yazın...',
    ttClear: 'Təmizlə',
    ttTranslate: 'Tərcümə et',
    ttTranslating: 'Tərcümə edilir...',
    ttPlay: 'Oxut',
    ttStop: 'Dayandır',
    ttCopy: 'Kopyala',
    ttEmptyOutput: 'Tərcümə burada görünəcək',
    ttSourceLanguage: 'Mənbə dil',
    ttTargetLanguage: 'Hədəf dil',
    ttErrorTitle: 'Xəta',
    ttErrorEmptyText: 'Tərcümə üçün mətn daxil edin',
    ttErrorTranslationFailed: 'Tərcümə uğursuz oldu. Yenidən cəhd edin.',
    ttErrorNoInternet: 'İnternet bağlantısı yoxdur',
    ttErrorTextTooLong: 'Mətn çox uzundur. Maksimum 1000 simvol.',
    ttCopiedTitle: 'Kopyalandı',
    ttCopiedMessage: 'Tərcümə buferə kopyalandı',
    ttInfoTitle: 'Məlumat',
    ttInfoCannotSwap: 'Dilləri dəyişmək mümkün deyil',
  },

  ky: {
    // Kyrgyz mode: Kyrgyz speaker learning Turkmen
    home: 'Башкы бет',
    search: 'Издөө',
    favorites: 'Тандалмалар',
    settings: 'Жөндөөлөр',
    additionalFeatures: 'Кошумча мүмкүнчүлүктөр',
    statistics: 'Статистика',

    appTitle: 'Түркмөн тилин үйрөнүү колдонмосу',
    appSubtitle: 'Тил үйрөнүү үчүн бардык куралдар',
    selectCategory: 'Категорияны тандоо',
    recentlyStudied: 'Жакында үйрөнгөндөр',
    study: 'Окуу',

    phrasebookTitle: 'Сөздөр китеби',
    phrasebookSubtitle: '22 категорияда 305 сөз',
    visualTranslatorTitle: 'Визуалдык котормочу',
    visualTranslatorSubtitle: 'Камера менен текст сканерлөө',
    textTranslatorTitle: 'Текст котормочусу',
    textTranslatorSubtitle: 'Текст жазуу жана которуу',
    dictionaryTitle: 'Сөздүк',
    dictionarySubtitle: 'v2.0-до чыгат',
    aiAssistantsTitle: 'AI жардамчылары',
    aiAssistantsSubtitle: 'Акылдуу кеңештер жана колдоо',
    myFavoritesTitle: 'Менин тандалмаларым',
    myFavoritesSubtitle: 'Сакталган нерселер',

    pronunciation: 'Айтылышы',
    addToFavorites: 'Тандалмаларга кошуу',
    inFavorites: 'Тандалмаларда',
    share: 'Бөлүшүү',

    settingsTitle: '⚙️ Жөндөөлөр',
    languageInterface: 'Интерфейс тили',
    switchLanguage: 'Тилди өзгөртүү',
    audio: 'Аудио',
    soundEffects: 'Үн эффектери',
    data: 'Маалыматтар',
    clearHistory: 'Тарыхты тазалоо',
    offlineMode: 'Офлайн режими',
    about: 'Колдонмо жөнүндө',
    feedback: 'Пикир',

    searchPlaceholder: 'Каалаган тилде сөз киргизиңиз...',
    noResults: 'Жыйынтык табылган жок',
    searchHistory: 'Издөө тарыхы',

    cancel: 'Жокко чыгаруу',
    save: 'Сактоо',
    delete: 'Өчүрүү',
    confirm: 'Ырастоо',
    loading: 'Жүктөлүүдө...',
    error: 'Ката',
    success: 'Ийгилик',

    // Visual Translator - Home Screen
    vtTranslateWithAI: 'AI менен которуу',
    vtCameraSubtitle: 'Тез которуу үчүн камераны текстке багыттаңыз',
    vtTakePhoto: 'Сүрөт тартуу',
    vtChooseGallery: 'Галереядан тандоо',
    vtProcessing: 'Сүрөт иштетилүүдө...',
    vtProcessingSubtext: 'Текстти таануу жана которуу',
    vtOcrEngine: 'OCR кыймылдаткычы',
    vtFeatures: 'Мүмкүнчүлүктөр',
    vtFeatureOcrTitle: 'OCR текстти таануу',
    vtFeatureOcrDesc: '30+ тилде жогорку тактык менен текстти таануу',
    vtFeatureAiTitle: 'AI нерселерди сыпаттоо',
    vtFeatureAiDesc: 'Текст табылбаса нерселерди сыпаттайт',
    vtFeatureSmartTitle: 'Акылдуу котормо',
    vtFeatureSmartDesc: 'AI жардамы менен контексттик котормо',
    vtFeatureSaveTitle: 'Сактоо жана бөлүшүү',
    vtFeatureSaveDesc: 'Котормолорду тандалмаларга сактоо жана бөлүшүү',
    vtPermissionsText: 'Камера жана фото китепкана уруксаттары керек',
    vtGrantPermissions: 'Уруксат берүү',
    vtRequestingPermissions: 'Уруксаттар суралууда...',
    vtAutoFallback: 'Тандалган кыймылдаткыч иштебесе автоматтык которуу иштейт',

    // Visual Translator - Result Screen
    vtResult: 'Жыйынтык',
    vtRecognizedText: 'Таанылган текст',
    vtLanguageLabel: 'Тил: ',
    vtAiAnalysis: 'AI анализи',
    vtTranslation: 'Котормо',
    vtTargetLabel: 'Максат: ',
    vtPlay: 'Ойнотуу',
    vtStop: 'Токтотуу',
    vtCopy: 'Көчүрүү',
    vtTranslateAnother: 'Дагы которуу',
    vtCopied: 'Көчүрүлдү',
    vtCopiedMessage: 'Котормо буферге көчүрүлдү',

    // Text Translator
    ttHeaderTitle: 'Текст котормочусу',
    ttHeroTitle: 'Тез котормо',
    ttHeroSubtitle: 'Текстти каалаган тилге которуңуз',
    ttSelectLanguage: 'Тилди тандоо',
    ttPlaceholder: 'Которуу үчүн текст киргизиңиз...',
    ttClear: 'Тазалоо',
    ttTranslate: 'Которуу',
    ttTranslating: 'Которулууда...',
    ttPlay: 'Ойнотуу',
    ttStop: 'Токтотуу',
    ttCopy: 'Көчүрүү',
    ttEmptyOutput: 'Котормо бул жерде пайда болот',
    ttSourceLanguage: 'Башталгыч тил',
    ttTargetLanguage: 'Максат тил',
    ttErrorTitle: 'Ката',
    ttErrorEmptyText: 'Которуу үчүн текст киргизиңиз',
    ttErrorTranslationFailed: 'Котормо ийгиликсиз болду. Кайра аракет кылыңыз.',
    ttErrorNoInternet: 'Интернет байланышы жок',
    ttErrorTextTooLong: 'Текст өтө узун. Максималдуу 1000 белги.',
    ttCopiedTitle: 'Көчүрүлдү',
    ttCopiedMessage: 'Котормо буферге көчүрүлдү',
    ttInfoTitle: 'Маалымат',
    ttInfoCannotSwap: 'Тилдерди алмаштыруу мүмкүн эмес',
  },

  tg: {
    // Tajik mode: Tajik speaker learning Turkmen
    home: 'Саҳифаи асосӣ',
    search: 'Ҷустуҷӯ',
    favorites: 'Дӯст доштаҳо',
    settings: 'Танзимот',
    additionalFeatures: 'Хусусиятҳои иловагӣ',
    statistics: 'Омор',

    appTitle: 'Барномаи омӯзиши забони туркманӣ',
    appSubtitle: 'Ҳамаи воситаҳо барои омӯхтани забон',
    selectCategory: 'Категорияро интихоб кунед',
    recentlyStudied: 'Ба наздикӣ омӯхташуда',
    study: 'Омӯхтан',

    phrasebookTitle: 'Китоби иборот',
    phrasebookSubtitle: '305 ибора дар 22 категория',
    visualTranslatorTitle: 'Тарҷумони визуалӣ',
    visualTranslatorSubtitle: 'Сканкунии матн бо дурбин',
    textTranslatorTitle: 'Тарҷумони матн',
    textTranslatorSubtitle: 'Навиштан ва тарҷума кардани матн',
    dictionaryTitle: 'Луғат',
    dictionarySubtitle: 'Дар v2.0 мебарояд',
    aiAssistantsTitle: 'Ёрирасонҳои AI',
    aiAssistantsSubtitle: 'Маслиҳатҳои зеҳнӣ ва дастгирӣ',
    myFavoritesTitle: 'Дӯст доштаҳои ман',
    myFavoritesSubtitle: 'Ашёҳои нигоҳдошташуда',

    pronunciation: 'Талаффуз',
    addToFavorites: 'Ба дӯст доштаҳо илова кардан',
    inFavorites: 'Дар дӯст доштаҳо',
    share: 'Мубодила кардан',

    settingsTitle: '⚙️ Танзимот',
    languageInterface: 'Забони интерфейс',
    switchLanguage: 'Иваз кардани забон',
    audio: 'Аудио',
    soundEffects: 'Эффектҳои садо',
    data: 'Додаҳо',
    clearHistory: 'Тоза кардани таърих',
    offlineMode: 'Реҷаи офлайн',
    about: 'Дар бораи барнома',
    feedback: 'Фикру мулоҳиза',

    searchPlaceholder: 'Дар ҳар забоне иборатро нависед...',
    noResults: 'Натиҷа ёфт нашуд',
    searchHistory: 'Таърихи ҷустуҷӯ',

    cancel: 'Бекор кардан',
    save: 'Нигоҳ доштан',
    delete: 'Нест кардан',
    confirm: 'Тасдиқ кардан',
    loading: 'Бор шуда истодааст...',
    error: 'Хато',
    success: 'Муваффақият',

    // Visual Translator - Home Screen
    vtTranslateWithAI: 'Тарҷума бо AI',
    vtCameraSubtitle: 'Дурбинро ба матн нишон диҳед барои тарҷумаи фаврӣ',
    vtTakePhoto: 'Акс гирифтан',
    vtChooseGallery: 'Аз галерея интихоб кунед',
    vtProcessing: 'Коркарди акс...',
    vtProcessingSubtext: 'Шинохтан ва тарҷума кардани матн',
    vtOcrEngine: 'Муҳаррики OCR',
    vtFeatures: 'Хусусиятҳо',
    vtFeatureOcrTitle: 'Шинохтани матни OCR',
    vtFeatureOcrDesc: 'Шинохтани матн бо дақиқияти баланд дар 30+ забон',
    vtFeatureAiTitle: 'Тавсифи ашёҳои AI',
    vtFeatureAiDesc: 'Агар матн ёфт нашавад, ашёҳоро тавсиф мекунад',
    vtFeatureSmartTitle: 'Тарҷумаи зеҳнӣ',
    vtFeatureSmartDesc: 'Тарҷумаи контекстӣ бо ёрии AI',
    vtFeatureSaveTitle: 'Нигоҳдорӣ ва мубодила',
    vtFeatureSaveDesc: 'Нигоҳ доштан ва мубодила кардани тарҷумаҳо ба дӯст доштаҳо',
    vtPermissionsText: 'Иҷозатҳои дурбин ва галереяи аксҳо лозиманд',
    vtGrantPermissions: 'Иҷозат додан',
    vtRequestingPermissions: 'Дархости иҷозатҳо...',
    vtAutoFallback: 'Агар муҳаррики интихобшуда кор накунад, тарҷумаи автоматӣ кор мекунад',

    // Visual Translator - Result Screen
    vtResult: 'Натиҷа',
    vtRecognizedText: 'Матни шинохташуда',
    vtLanguageLabel: 'Забон: ',
    vtAiAnalysis: 'Таҳлили AI',
    vtTranslation: 'Тарҷума',
    vtTargetLabel: 'Ҳадаф: ',
    vtPlay: 'Пахш кардан',
    vtStop: 'Қатъ кардан',
    vtCopy: 'Нусха бардоштан',
    vtTranslateAnother: 'Тарҷумаи дигар',
    vtCopied: 'Нусха бардошта шуд',
    vtCopiedMessage: 'Тарҷума ба буфер нусха бардошта шуд',

    // Text Translator
    ttHeaderTitle: 'Тарҷумони матн',
    ttHeroTitle: 'Тарҷумаи фаврӣ',
    ttHeroSubtitle: 'Матнро ба ҳар забоне тарҷума кунед',
    ttSelectLanguage: 'Интихоби забон',
    ttPlaceholder: 'Матнро барои тарҷума ворид кунед...',
    ttClear: 'Тоза кардан',
    ttTranslate: 'Тарҷума кардан',
    ttTranslating: 'Тарҷума шуда истодааст...',
    ttPlay: 'Пахш кардан',
    ttStop: 'Қатъ кардан',
    ttCopy: 'Нусха бардоштан',
    ttEmptyOutput: 'Тарҷума дар ин ҷо пайдо мешавад',
    ttSourceLanguage: 'Забони манбаъ',
    ttTargetLanguage: 'Забони ҳадаф',
    ttErrorTitle: 'Хато',
    ttErrorEmptyText: 'Матнро барои тарҷума ворид кунед',
    ttErrorTranslationFailed: 'Тарҷума ноком шуд. Дубора кӯшиш кунед.',
    ttErrorNoInternet: 'Пайвасти интернет нест',
    ttErrorTextTooLong: 'Матн хеле дароз аст. Максимум 1000 аломат.',
    ttCopiedTitle: 'Нусха бардошта шуд',
    ttCopiedMessage: 'Тарҷума ба буфер нусха бардошта шуд',
    ttInfoTitle: 'Маълумот',
    ttInfoCannotSwap: 'Иваз кардани забонҳо имконнопазир аст',
  },

  hy: {
    // Armenian mode: Armenian speaker learning Turkmen
    home: 'Գլխավոր',
    search: 'Որոնել',
    favorites: 'Ընտրանի',
    settings: 'Կարգավորումներ',
    additionalFeatures: 'Լրացուցիչ գործառույթներ',
    statistics: 'Վիճակագրություն',

    appTitle: 'Թուրքմեներեն սովորելու ծրագիր',
    appSubtitle: 'Բոլոր գործիքները լեզու սովորելու համար',
    selectCategory: 'Ընտրել կատեգորիա',
    recentlyStudied: 'Վերջերս ուսումնասիրված',
    study: 'Ուսումնասիրել',

    phrasebookTitle: 'Արտահայտությունների գիրք',
    phrasebookSubtitle: '305 արտահայտություն 22 կատեգորիայում',
    visualTranslatorTitle: 'Տեսողական թարգմանիչ',
    visualTranslatorSubtitle: 'Տեքստը սկանավորել տեսախցիկով',
    textTranslatorTitle: 'Տեքստի թարգմանիչ',
    textTranslatorSubtitle: 'Մուտքագրել և թարգմանել տեքստը',
    dictionaryTitle: 'Բառարան',
    dictionarySubtitle: 'Կլինի v2.0-ում',
    aiAssistantsTitle: 'AI օգնականներ',
    aiAssistantsSubtitle: 'Խելացի խորհուրդներ և աջակցություն',
    myFavoritesTitle: 'Իմ ընտրանին',
    myFavoritesSubtitle: 'Պահպանված տարրեր',

    pronunciation: 'Արտասանություն',
    addToFavorites: 'Ավելացնել ընտրանու',
    inFavorites: 'Ընտրանում է',
    share: 'Կիսվել',

    settingsTitle: '⚙️ Կարգավորումներ',
    languageInterface: 'Ինտերֆեյսի լեզու',
    switchLanguage: 'Փոխել լեզուն',
    audio: 'Աուդիո',
    soundEffects: 'Ձայնային էֆեկտներ',
    data: 'Տվյալներ',
    clearHistory: 'Մաքրել պատմությունը',
    offlineMode: 'Օֆլայն ռեժիմ',
    about: 'Ծրագրի մասին',
    feedback: 'Կարծիք',

    searchPlaceholder: 'Մուտքագրել արտահայտություն ցանկացած լեզվով...',
    noResults: 'Արդյունքներ չեն գտնվել',
    searchHistory: 'Որոնման պատմություն',

    cancel: 'Չեղարկել',
    save: 'Պահպանել',
    delete: 'Ջնջել',
    confirm: 'Հաստատել',
    loading: 'Բեռնվում է...',
    error: 'Սխալ',
    success: 'Հաջողություն',

    // Visual Translator - Home Screen
    vtTranslateWithAI: 'Թարգմանել AI-ով',
    vtCameraSubtitle: 'Ուղղել տեսախցիկը տեքստին՝ ակնթարթային թարգմանության համար',
    vtTakePhoto: 'Լուսանկարել',
    vtChooseGallery: 'Ընտրել պատկերասրահից',
    vtProcessing: 'Պատկերի մշակում...',
    vtProcessingSubtext: 'Տեքստի ճանաչում և թարգմանություն',
    vtOcrEngine: 'OCR շարժիչ',
    vtFeatures: 'Հնարավորություններ',
    vtFeatureOcrTitle: 'OCR տեքստի ճանաչում',
    vtFeatureOcrDesc: 'Տեքստի ճանաչում բարձր ճշգրտությամբ 30+ լեզուներով',
    vtFeatureAiTitle: 'AI առարկաների նկարագրություն',
    vtFeatureAiDesc: 'Նկարագրում է առարկաները, եթե տեքստ չի գտնվել',
    vtFeatureSmartTitle: 'Խելացի թարգմանություն',
    vtFeatureSmartDesc: 'Համատեքստային թարգմանություն AI օգնությամբ',
    vtFeatureSaveTitle: 'Պահպանում և կիսում',
    vtFeatureSaveDesc: 'Պահպանել և կիսել թարգմանություններ ընտրանու մեջ',
    vtPermissionsText: 'Տեսախցիկի և լուսանկարների թույլտվություններ անհրաժեշտ են',
    vtGrantPermissions: 'Տալ թույլտվություն',
    vtRequestingPermissions: 'Թույլտվությունների հարցում...',
    vtAutoFallback: 'Եթե ընտրված շարժիչը չաշխատի, ավտոմատ թարգմանությունը կաշխատի',

    // Visual Translator - Result Screen
    vtResult: 'Արդյունք',
    vtRecognizedText: 'Ճանաչված տեքստ',
    vtLanguageLabel: 'Լեզու՝ ',
    vtAiAnalysis: 'AI վերլուծություն',
    vtTranslation: 'Թարգմանություն',
    vtTargetLabel: 'Նպատակ՝ ',
    vtPlay: 'Նվագարկել',
    vtStop: 'Կանգնեցնել',
    vtCopy: 'Պատճենել',
    vtTranslateAnother: 'Թարգմանել մեկ այլը',
    vtCopied: 'Պատճենված է',
    vtCopiedMessage: 'Թարգմանությունը պատճենված է բուֆեր',

    // Text Translator
    ttHeaderTitle: 'Տեքստի թարգմանիչ',
    ttHeroTitle: 'Ակնթարթային թարգմանություն',
    ttHeroSubtitle: 'Թարգմանեք տեքստը ցանկացած լեզու',
    ttSelectLanguage: 'Ընտրել լեզու',
    ttPlaceholder: 'Մուտքագրեք տեքստ թարգմանության համար...',
    ttClear: 'Մաքրել',
    ttTranslate: 'Թարգմանել',
    ttTranslating: 'Թարգմանվում է...',
    ttPlay: 'Նվագարկել',
    ttStop: 'Կանգնեցնել',
    ttCopy: 'Պատճենել',
    ttEmptyOutput: 'Թարգմանությունը կհայտնվի այստեղ',
    ttSourceLanguage: 'Սկզբնաղբյուր լեզու',
    ttTargetLanguage: 'Նպատակային լեզու',
    ttErrorTitle: 'Սխալ',
    ttErrorEmptyText: 'Մուտքագրեք տեքստ թարգմանության համար',
    ttErrorTranslationFailed: 'Թարգմանությունը ձախողվեց: Փորձեք կրկին:',
    ttErrorNoInternet: 'Ինտերնետ կապ չկա',
    ttErrorTextTooLong: 'Տեքստը շատ երկար է: Առավելագույնը 1000 նիշ:',
    ttCopiedTitle: 'Պատճենված է',
    ttCopiedMessage: 'Թարգմանությունը պատճենված է բուֆեր',
    ttInfoTitle: 'Տեղեկատվություն',
    ttInfoCannotSwap: 'Հնարավոր չէ փոխել լեզուները',
  },

  ka: {
    // Georgian mode: Georgian speaker learning Turkmen
    home: 'მთავარი',
    search: 'ძიება',
    favorites: 'რჩეულები',
    settings: 'პარამეტრები',
    additionalFeatures: 'დამატებითი ფუნქციები',
    statistics: 'სტატისტიკა',

    appTitle: 'თურქმენული ენის სწავლის აპლიკაცია',
    appSubtitle: 'ყველა ხელსაწყო ენის შესასწავლად',
    selectCategory: 'აირჩიეთ კატეგორია',
    recentlyStudied: 'ახლახან შესწავლილი',
    study: 'სწავლა',

    phrasebookTitle: 'ფრაზების წიგნი',
    phrasebookSubtitle: '305 ფრაზა 22 კატეგორიაში',
    visualTranslatorTitle: 'ვიზუალური თარჯიმანი',
    visualTranslatorSubtitle: 'ტექსტის სკანირება კამერით',
    textTranslatorTitle: 'ტექსტის თარჯიმანი',
    textTranslatorSubtitle: 'ტექსტის აკრეფა და თარჯმა',
    dictionaryTitle: 'ლექსიკონი',
    dictionarySubtitle: 'გამოვა v2.0-ში',
    aiAssistantsTitle: 'AI ასისტენტები',
    aiAssistantsSubtitle: 'ჭკვიანი რჩევები და მხარდაჭერა',
    myFavoritesTitle: 'ჩემი რჩეულები',
    myFavoritesSubtitle: 'შენახული ელემენტები',

    pronunciation: 'გამოთქმა',
    addToFavorites: 'რჩეულებში დამატება',
    inFavorites: 'რჩეულებშია',
    share: 'გაზიარება',

    settingsTitle: '⚙️ პარამეტრები',
    languageInterface: 'ინტერფეისის ენა',
    switchLanguage: 'ენის შეცვლა',
    audio: 'აუდიო',
    soundEffects: 'ხმოვანი ეფექტები',
    data: 'მონაცემები',
    clearHistory: 'ისტორიის წაშლა',
    offlineMode: 'ოფლაინ რეჟიმი',
    about: 'აპლიკაციის შესახებ',
    feedback: 'უკუკავშირი',

    searchPlaceholder: 'აკრიფეთ ფრაზა ნებისმიერ ენაზე...',
    noResults: 'შედეგები არ მოიძებნა',
    searchHistory: 'ძიების ისტორია',

    cancel: 'გაუქმება',
    save: 'შენახვა',
    delete: 'წაშლა',
    confirm: 'დადასტურება',
    loading: 'იტვირთება...',
    error: 'შეცდომა',
    success: 'წარმატება',

    // Visual Translator - Home Screen
    vtTranslateWithAI: 'თარგმნა AI-ით',
    vtCameraSubtitle: 'მიმართეთ კამერა ტექსტისკენ მყისიერი თარგმნისთვის',
    vtTakePhoto: 'ფოტოს გადაღება',
    vtChooseGallery: 'აირჩიეთ გალერეიდან',
    vtProcessing: 'სურათის დამუშავება...',
    vtProcessingSubtext: 'ტექსტის ამოცნობა და თარგმნა',
    vtOcrEngine: 'OCR ძრავა',
    vtFeatures: 'ფუნქციები',
    vtFeatureOcrTitle: 'OCR ტექსტის ამოცნობა',
    vtFeatureOcrDesc: 'ტექსტის ამოცნობა მაღალი სიზუსტით 30+ ენაზე',
    vtFeatureAiTitle: 'AI ობიექტების აღწერა',
    vtFeatureAiDesc: 'ობიექტების აღწერა, თუ ტექსტი არ მოიძებნა',
    vtFeatureSmartTitle: 'ჭკვიანი თარგმანი',
    vtFeatureSmartDesc: 'კონტექსტური თარგმნა AI დახმარებით',
    vtFeatureSaveTitle: 'შენახვა და გაზიარება',
    vtFeatureSaveDesc: 'თარგმნის შენახვა და გაზიარება რჩეულებში',
    vtPermissionsText: 'კამერისა და ფოტოების ნებართვები საჭიროა',
    vtGrantPermissions: 'ნებართვის მიცემა',
    vtRequestingPermissions: 'ნებართვების მოთხოვნა...',
    vtAutoFallback: 'თუ არჩეული ძრავა არ იმუშავებს, ავტომატური თარგმანი იმუშავებს',

    // Visual Translator - Result Screen
    vtResult: 'შედეგი',
    vtRecognizedText: 'ამოცნობილი ტექსტი',
    vtLanguageLabel: 'ენა: ',
    vtAiAnalysis: 'AI ანალიზი',
    vtTranslation: 'თარგმანი',
    vtTargetLabel: 'მიზანი: ',
    vtPlay: 'დაკვრა',
    vtStop: 'გაჩერება',
    vtCopy: 'კოპირება',
    vtTranslateAnother: 'სხვის თარგმნა',
    vtCopied: 'დაკოპირდა',
    vtCopiedMessage: 'თარგმანი დაკოპირდა ბუფერში',

    // Text Translator
    ttHeaderTitle: 'ტექსტის თარჯიმანი',
    ttHeroTitle: 'მყისიერი თარგმანი',
    ttHeroSubtitle: 'თარგმნეთ ტექსტი ნებისმიერ ენაზე',
    ttSelectLanguage: 'ენის არჩევა',
    ttPlaceholder: 'შეიყვანეთ ტექსტი თარგმნისთვის...',
    ttClear: 'გასუფთავება',
    ttTranslate: 'თარგმნა',
    ttTranslating: 'მიმდინარეობს თარგმნა...',
    ttPlay: 'დაკვრა',
    ttStop: 'გაჩერება',
    ttCopy: 'კოპირება',
    ttEmptyOutput: 'თარგმანი გამოჩნდება აქ',
    ttSourceLanguage: 'საწყისი ენა',
    ttTargetLanguage: 'სამიზნე ენა',
    ttErrorTitle: 'შეცდომა',
    ttErrorEmptyText: 'შეიყვანეთ ტექსტი თარგმნისთვის',
    ttErrorTranslationFailed: 'თარგმნა ვერ მოხერხდა. სცადეთ ხელახლა.',
    ttErrorNoInternet: 'ინტერნეტ კავშირი არ არის',
    ttErrorTextTooLong: 'ტექსტი ძალიან გრძელია. მაქსიმუმ 1000 სიმბოლო.',
    ttCopiedTitle: 'დაკოპირდა',
    ttCopiedMessage: 'თარგმანი დაკოპირდა ბუფერში',
    ttInfoTitle: 'ინფორმაცია',
    ttInfoCannotSwap: 'ენების გაცვლა შეუძლებელია',
  },

  ar: {
    // Arabic mode: Arabic speaker learning Turkmen (RTL)
    home: 'الرئيسية',
    search: 'بحث',
    favorites: 'المفضلة',
    settings: 'الإعدادات',
    additionalFeatures: 'ميزات إضافية',
    statistics: 'الإحصائيات',

    appTitle: 'تطبيق تعلم اللغة التركمانية',
    appSubtitle: 'جميع الأدوات لتعلم اللغة',
    selectCategory: 'اختر الفئة',
    recentlyStudied: 'المدروس مؤخراً',
    study: 'دراسة',

    phrasebookTitle: 'كتاب العبارات',
    phrasebookSubtitle: '305 عبارة في 22 فئة',
    visualTranslatorTitle: 'المترجم المرئي',
    visualTranslatorSubtitle: 'مسح النص بالكاميرا',
    textTranslatorTitle: 'مترجم النصوص',
    textTranslatorSubtitle: 'كتابة وترجمة النص',
    dictionaryTitle: 'القاموس',
    dictionarySubtitle: 'قريباً في v2.0',
    aiAssistantsTitle: 'مساعدو الذكاء الاصطناعي',
    aiAssistantsSubtitle: 'نصائح ذكية ودعم',
    myFavoritesTitle: 'مفضلتي',
    myFavoritesSubtitle: 'العناصر المحفوظة',

    pronunciation: 'النطق',
    addToFavorites: 'إضافة إلى المفضلة',
    inFavorites: 'في المفضلة',
    share: 'مشاركة',

    settingsTitle: '⚙️ الإعدادات',
    languageInterface: 'لغة الواجهة',
    switchLanguage: 'تغيير اللغة',
    audio: 'الصوت',
    soundEffects: 'المؤثرات الصوتية',
    data: 'البيانات',
    clearHistory: 'مسح السجل',
    offlineMode: 'وضع عدم الاتصال',
    about: 'حول التطبيق',
    feedback: 'التعليقات',

    searchPlaceholder: 'اكتب عبارة بأي لغة...',
    noResults: 'لا توجد نتائج',
    searchHistory: 'سجل البحث',

    cancel: 'إلغاء',
    save: 'حفظ',
    delete: 'حذف',
    confirm: 'تأكيد',
    loading: 'جار التحميل...',
    error: 'خطأ',
    success: 'نجاح',

    // Visual Translator - Home Screen
    vtTranslateWithAI: 'الترجمة بالذكاء الاصطناعي',
    vtCameraSubtitle: 'وجه الكاميرا إلى النص للترجمة الفورية',
    vtTakePhoto: 'التقاط صورة',
    vtChooseGallery: 'اختيار من المعرض',
    vtProcessing: 'معالجة الصورة...',
    vtProcessingSubtext: 'التعرف على النص والترجمة',
    vtOcrEngine: 'محرك OCR',
    vtFeatures: 'الميزات',
    vtFeatureOcrTitle: 'التعرف على النص OCR',
    vtFeatureOcrDesc: 'التعرف على النص بدقة عالية في أكثر من 30 لغة',
    vtFeatureAiTitle: 'وصف الأشياء بالذكاء الاصطناعي',
    vtFeatureAiDesc: 'وصف الأشياء إذا لم يتم العثور على نص',
    vtFeatureSmartTitle: 'الترجمة الذكية',
    vtFeatureSmartDesc: 'الترجمة السياقية بمساعدة الذكاء الاصطناعي',
    vtFeatureSaveTitle: 'الحفظ والمشاركة',
    vtFeatureSaveDesc: 'حفظ ومشاركة الترجمات في المفضلة',
    vtPermissionsText: 'مطلوب أذونات الكاميرا والصور',
    vtGrantPermissions: 'منح الإذن',
    vtRequestingPermissions: 'طلب الأذونات...',
    vtAutoFallback: 'إذا لم يعمل المحرك المحدد، ستعمل الترجمة التلقائية',

    // Visual Translator - Result Screen
    vtResult: 'النتيجة',
    vtRecognizedText: 'النص المُتعرف عليه',
    vtLanguageLabel: 'اللغة: ',
    vtAiAnalysis: 'تحليل الذكاء الاصطناعي',
    vtTranslation: 'الترجمة',
    vtTargetLabel: 'الهدف: ',
    vtPlay: 'تشغيل',
    vtStop: 'إيقاف',
    vtCopy: 'نسخ',
    vtTranslateAnother: 'ترجمة أخرى',
    vtCopied: 'تم النسخ',
    vtCopiedMessage: 'تم نسخ الترجمة إلى الحافظة',

    // Text Translator
    ttHeaderTitle: 'مترجم النصوص',
    ttHeroTitle: 'الترجمة الفورية',
    ttHeroSubtitle: 'ترجمة النص إلى أي لغة',
    ttSelectLanguage: 'اختيار اللغة',
    ttPlaceholder: 'أدخل النص للترجمة...',
    ttClear: 'مسح',
    ttTranslate: 'ترجمة',
    ttTranslating: 'جاري الترجمة...',
    ttPlay: 'تشغيل',
    ttStop: 'إيقاف',
    ttCopy: 'نسخ',
    ttEmptyOutput: 'ستظهر الترجمة هنا',
    ttSourceLanguage: 'لغة المصدر',
    ttTargetLanguage: 'اللغة المستهدفة',
    ttErrorTitle: 'خطأ',
    ttErrorEmptyText: 'أدخل النص للترجمة',
    ttErrorTranslationFailed: 'فشلت الترجمة. حاول مرة أخرى.',
    ttErrorNoInternet: 'لا يوجد اتصال بالإنترنت',
    ttErrorTextTooLong: 'النص طويل جداً. الحد الأقصى 1000 حرف.',
    ttCopiedTitle: 'تم النسخ',
    ttCopiedMessage: 'تم نسخ الترجمة إلى الحافظة',
    ttInfoTitle: 'معلومات',
    ttInfoCannotSwap: 'لا يمكن تبديل اللغات',
  },
};

const validateConfig = (config: any): config is AppLanguageConfig => {
  return (
    config &&
    typeof config === 'object' &&
    ['tk', 'zh', 'ru', 'en', 'tr', 'de', 'fr', 'es', 'it', 'pt', 'nl', 'pl', 'uk'].includes(config.mode) &&
    ['tk', 'zh'].includes(config.primaryLanguage) &&
    ['tk', 'zh'].includes(config.learningLanguage) &&
    config.helperLanguage === 'ru' &&
    typeof config.version === 'string'
  );
};

const createConfig = (mode: AppLanguageMode): AppLanguageConfig => {
  // Для интерфейсных языков (ru, en, tr, de, fr, es, it, pt, nl, pl, uk) - используем tk-zh пару по умолчанию
  let primaryLanguage: 'tk' | 'zh' = 'tk';
  let learningLanguage: 'tk' | 'zh' = 'zh';

  if (mode === 'tk') {
    primaryLanguage = 'tk';
    learningLanguage = 'zh';
  } else if (mode === 'zh') {
    primaryLanguage = 'zh';
    learningLanguage = 'tk';
  }
  // Для всех остальных языков используем значения по умолчанию (tk-zh)

  return {
    mode,
    primaryLanguage,
    learningLanguage,
    helperLanguage: 'ru',
    version: LANGUAGE_VERSION,
  };
};

interface LanguageContextValue {
  config: AppLanguageConfig;
  isLoading: boolean;
  setLanguageMode: (mode: AppLanguageMode, shouldSave?: boolean) => Promise<void>;
  switchMode: () => Promise<boolean>;
  resetLanguageSettings: () => Promise<void>;
  getTexts: () => InterfaceTexts;
  getLanguageName: (lang: 'tk' | 'zh' | 'ru') => string;
  getPhraseTexts: (phrase: { translation: { text: string; transcription?: string }; turkmen: string }) => {
    primary: string;
    learning: string;
    helper: string;
  };
  isFirstLaunch: boolean;
  error: string | null;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [config, setConfig] = useState<AppLanguageConfig>(createConfig('tk'));
  const [isFirstLaunch, setIsFirstLaunch] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Загрузка сохраненной конфигурации при запуске
  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const saved = await AsyncStorage.getItem(APP_LANGUAGE_KEY);
      if (saved) {
        const parsedConfig = JSON.parse(saved);
        if (validateConfig(parsedConfig)) {
          setConfig(parsedConfig);
          setIsFirstLaunch(false);
        }
      }
    } catch (error) {
      console.warn('Ошибка загрузки языковой конфигурации:', error);
      setError('Не удалось загрузить настройки языка');
    } finally {
      setIsLoading(false);
    }
  };

  const saveConfig = async (config: AppLanguageConfig): Promise<boolean> => {
    try {
      await AsyncStorage.setItem(APP_LANGUAGE_KEY, JSON.stringify(config));
      return true;
    } catch (error) {
      console.warn('Ошибка сохранения языковой конфигурации:', error);
      setError('Не удалось сохранить настройки языка');
      return false;
    }
  };

  const setLanguageMode = async (mode: AppLanguageMode, shouldSave: boolean = true) => {
    try {
      if (!['tk', 'zh', 'ru', 'en', 'tr', 'de', 'fr', 'es', 'it', 'pt', 'nl', 'pl', 'uk', 'ja', 'ko', 'th', 'vi', 'id', 'ms', 'hi', 'ur', 'fa', 'ps', 'uz', 'kk', 'az', 'ky', 'tg', 'hy', 'ka', 'ar'].includes(mode)) {
        throw new Error(`Invalid language mode: ${mode}`);
      }

      const newConfig = createConfig(mode);
      
      if (shouldSave) {
        const saved = await saveConfig(newConfig);
        if (saved) {
          setIsFirstLaunch(false);
          setError(null);
        }
      }

      setConfig(newConfig);
    } catch (error) {
      console.warn('Ошибка установки языкового режима:', error);
      setError('Не удалось изменить язык');
    }
  };

  const switchMode = async (): Promise<boolean> => {
    try {
      const newMode: AppLanguageMode = config.mode === 'tk' ? 'zh' : 'tk';
      await setLanguageMode(newMode, true);
      return true;
    } catch (error) {
      console.warn('Ошибка переключения режима:', error);
      return false;
    }
  };

  const resetLanguageSettings = async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(APP_LANGUAGE_KEY);
      setConfig(createConfig('tk'));
      setIsFirstLaunch(true);
      setError(null);
    } catch (error) {
      console.warn('Ошибка сброса настроек языка:', error);
      setError('Не удалось сбросить настройки языка');
    }
  };

  const getTexts = (): InterfaceTexts => {
    try {
      return INTERFACE_TEXTS[config.mode] || INTERFACE_TEXTS.tk;
    } catch (error) {
      console.warn('Ошибка получения текстов интерфейса:', error);
      return INTERFACE_TEXTS.tk;
    }
  };

  const getLanguageName = (lang: 'tk' | 'zh' | 'ru'): string => {
    const names = {
      tk: config.primaryLanguage === 'tk' ? 'Türkmençe' : '土库曼语',
      zh: config.primaryLanguage === 'tk' ? 'Hytaýça' : '中文',
      ru: config.primaryLanguage === 'tk' ? 'Rusça' : '俄语'
    };
    return names[lang] || lang;
  };

  const getPhraseTexts = (phrase: { translation: { text: string; transcription?: string }; turkmen: string }) => {
    try {
      if (config.mode === 'tk') {
        // Туркмен изучает выбранный язык (китайский/русский/английский)
        return {
          primary: phrase.translation.text,  // Выбранный язык - основной для изучения
          learning: phrase.turkmen,          // Туркменский - родной язык
          helper: phrase.translation.transcription || ''  // Транскрипция если есть
        };
      } else {
        // Носитель другого языка изучает туркменский
        return {
          primary: phrase.turkmen,           // Туркменский - основной для изучения
          learning: phrase.translation.text, // Выбранный язык - родной язык
          helper: phrase.translation.transcription || ''  // Транскрипция если есть
        };
      }
    } catch (error) {
      console.warn('Ошибка получения текстов фразы:', error);
      return {
        primary: phrase.translation.text,
        learning: phrase.turkmen,
        helper: ''
      };
    }
  };

  const contextValue: LanguageContextValue = {
    config,
    isLoading,
    setLanguageMode,
    switchMode,
    resetLanguageSettings,
    getTexts,
    getLanguageName,
    getPhraseTexts,
    isFirstLaunch,
    error,
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useAppLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useAppLanguage must be used within a LanguageProvider');
  }
  return context;
}