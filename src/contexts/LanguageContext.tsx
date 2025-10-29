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