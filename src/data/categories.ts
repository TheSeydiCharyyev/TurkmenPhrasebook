// src/data/categories.ts - ИСПРАВЛЕНО с правильными переводами

import { Category } from '../types';

export const categories: Category[] = [
  {
    id: 'greetings',
    nameRu: 'Приветствие',
    nameTk: 'Salamlaşmak', // ✅ ИСПРАВЛЕНО
    nameZh: '问候语',
    icon: '👋',
    color: '#FF6B6B', // Warm red
  },
  {
    id: 'emergency',
    nameRu: 'Экстренные ситуации',
    nameTk: 'Gyssagly ýagdaýlar', // ✅ ИСПРАВЛЕНО
    nameZh: '紧急情况',
    icon: '🚨',
    color: '#FF4757', // Alert red
  },
  {
    id: 'hotel',
    nameRu: 'В отеле',
    nameTk: 'Myhmanhana', // ✅ ИСПРАВЛЕНО
    nameZh: '酒店',
    icon: '🏨',
    color: '#3742FA', // Hotel blue
  },
  {
    id: 'food',
    nameRu: 'Еда и рестораны',
    nameTk: 'Nahar we restoranlarda', // ✅ ИСПРАВЛЕНО
    nameZh: '餐饮',
    icon: '🍜',
    color: '#2ED573', // Food green
  },
  {
    id: 'shopping',
    nameRu: 'Покупки и торг',
    nameTk: 'Söwda we bazarlyk', // ✅ ИСПРАВЛЕНО
    nameZh: '购物',
    icon: '🛒',
    color: '#FFA502', // Shopping orange
  },
  {
    id: 'transport',
    nameRu: 'Транспорт',
    nameTk: 'Ulag', // ✅ ИСПРАВЛЕНО
    nameZh: '交通',
    icon: '🚌',
    color: '#5352ED', // Transport purple
  },
  {
    id: 'directions',
    nameRu: 'Направления',
    nameTk: 'Ugurlar', // ✅ ИСПРАВЛЕНО
    nameZh: '方向',
    icon: '🗺️',
    color: '#FF3838', // Direction red
  },
  {
    id: 'health',
    nameRu: 'Здоровье',
    nameTk: 'Saglyga',
    nameZh: '健康',
    icon: '💊',
    color: '#FF6348', // Health red
  },
  {
    id: 'money',
    nameRu: 'Деньги и банки',
    nameTk: 'Pul we banklar',
    nameZh: '金融',
    icon: '💰',
    color: '#F1C40F', // Money gold
  },
  {
    id: 'communication',
    nameRu: 'Связь',
    nameTk: 'Aragatnaşyk',
    nameZh: '通讯',
    icon: '📱',
    color: '#00D2D3', // Communication cyan
  },
  {
    id: 'entertainment',
    nameRu: 'Развлечения',
    nameTk: 'Güýmenje',
    nameZh: '娱乐',
    icon: '🎭',
    color: '#E056FD', // Entertainment magenta
  },
  {
    id: 'time',
    nameRu: 'Время и даты',
    nameTk: 'Wagt we seneler',
    nameZh: '时间',
    icon: '⏰',
    color: '#686DE0', // Time purple
  },
  {
    id: 'numbers',
    nameRu: 'Числа',
    nameTk: 'Sanlar',
    nameZh: '数字',
    icon: '🔢',
    color: '#30336B', // Numbers dark blue
  },
  {
    id: 'weather',
    nameRu: 'Погода',
    nameTk: 'Howa',
    nameZh: '天气',
    icon: '🌤️',
    color: '#74C0FC', // Weather sky blue
  },
];

/**
 * ✅ ИСПРАВЛЕНО: Функция получения названия категории с правильным порядком языков
 * 
 * @param category - Категория
 * @param mode - Режим языка ('tk' | 'zh')
 * @returns Объект с названиями в правильном порядке приоритета
 */
export const getCategoryName = (category: Category, mode: 'tk' | 'zh') => {
  if (mode === 'tk') {
    // Туркменский интерфейс: туркмен изучает китайский
    return {
      primary: category.nameTk,    // ТУРКМЕНСКИЙ - родной язык (крупно)
      learning: category.nameZh,   // КИТАЙСКИЙ - изучаемый язык (средне)
      helper: category.nameRu      // РУССКИЙ - помощь (мелко)
    };
  } else {
    // Китайский интерфейс: китаец изучает туркменский
    return {
      primary: category.nameZh,    // КИТАЙСКИЙ - родной язык (крупно)
      learning: category.nameTk,   // ТУРКМЕНСКИЙ - изучаемый язык (средне)
      helper: category.nameRu      // РУССКИЙ - помощь (мелко)
    };
  }
};

/**
 * ✅ ДОБАВЛЕНО: Поиск категории по ID с безопасной обработкой
 */
export const getCategoryById = (id: string): Category | undefined => {
  return categories.find(category => category.id === id);
};

/**
 * ✅ ДОБАВЛЕНО: Получение всех категорий отсортированных по частоте использования
 */
export const getCategoriesSorted = (usageData?: Record<string, number>): Category[] => {
  if (!usageData) return categories;
  
  return [...categories].sort((a, b) => {
    const usageA = usageData[a.id] || 0;
    const usageB = usageData[b.id] || 0;
    return usageB - usageA; // Сортировка по убыванию частоты использования
  });
};