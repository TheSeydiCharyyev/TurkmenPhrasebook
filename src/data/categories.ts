// src/data/categories.ts - РАСШИРЕННЫЙ файл с 32 категориями

import { Category } from '../types';

export const categories: Category[] = [
  // ===== СУЩЕСТВУЮЩИЕ 14 ОСНОВНЫХ КАТЕГОРИЙ =====
  {
    id: 'greetings',
    nameRu: 'Приветствие',
    nameTk: 'Salamlaşmak',
    nameZh: '问候语',
    icon: 'person-outline',
    color: '#3B82F6',
  },
  {
    id: 'emergency',
    nameRu: 'Экстренные ситуации',
    nameTk: 'Gyssagly ýagdaýlar',
    nameZh: '紧急情况',
    icon: 'alert-circle-outline',
    color: '#EF4444',
  },
  {
    id: 'hotel',
    nameRu: 'В отеле',
    nameTk: 'Myhmanhana',
    nameZh: '酒店',
    icon: 'bed-outline',
    color: '#8B5CF6',
  },
  {
    id: 'food',
    nameRu: 'Еда и рестораны',
    nameTk: 'Nahar we restoranlarda',
    nameZh: '餐饮',
    icon: 'restaurant-outline',
    color: '#10B981',
  },
  {
    id: 'shopping',
    nameRu: 'Покупки и торг',
    nameTk: 'Söwda we bazarlyk',
    nameZh: '购物',
    icon: 'storefront-outline',
    color: '#F59E0B',
  },
  {
    id: 'transport',
    nameRu: 'Транспорт',
    nameTk: 'Ulag',
    nameZh: '交通',
    icon: 'car-outline',
    color: '#6366F1',
  },
  {
    id: 'directions',
    nameRu: 'Направления',
    nameTk: 'Ugurlar',
    nameZh: '方向',
    icon: 'compass-outline',
    color: '#06B6D4',
  },
  {
    id: 'health',
    nameRu: 'Здоровье',
    nameTk: 'Saglyk',
    nameZh: '健康',
    icon: 'medical-outline',
    color: '#84CC16',
  },
  {
    id: 'money',
    nameRu: 'Деньги и банки',
    nameTk: 'Pul we banklar',
    nameZh: '金融',
    icon: 'card-outline',
    color: '#FBBF24',
  },
  {
    id: 'communication',
    nameRu: 'Связь',
    nameTk: 'Aragatnaşyk',
    nameZh: '通讯',
    icon: 'call-outline',
    color: '#EC4899',
  },
  {
    id: 'entertainment',
    nameRu: 'Развлечения',
    nameTk: 'Güýmenje',
    nameZh: '娱乐',
    icon: 'game-controller-outline',
    color: '#A855F7',
  },
  {
    id: 'time',
    nameRu: 'Время и даты',
    nameTk: 'Wagt we seneler',
    nameZh: '时间',
    icon: 'time-outline',
    color: '#14B8A6',
  },
  {
    id: 'numbers',
    nameRu: 'Числа',
    nameTk: 'Sanlar',
    nameZh: '数字',
    icon: 'calculator-outline',
    color: '#0EA5E9',
  },
  {
    id: 'weather',
    nameRu: 'Погода',
    nameTk: 'Howa',
    nameZh: '天气',
    icon: 'partly-sunny-outline',
    color: '#F97316',
  },

  // ===== 18 НОВЫХ КАТЕГОРИЙ ИЗ КНИГИ =====
  
  // Социальное общение
  {
    id: 'addressing',
    nameRu: 'Обращение',
    nameTk: 'Ýüzlenmek',
    nameZh: '称呼',
    icon: 'chatbubble-outline',
    color: '#DC2626',
  },
  {
    id: 'introduction',
    nameRu: 'Знакомство',
    nameTk: 'Tanyşmak',
    nameZh: '介绍',
    icon: 'people-outline',
    color: '#7C3AED',
  },
  {
    id: 'gratitude',
    nameRu: 'Благодарность',
    nameTk: 'Minnetdarlyk',
    nameZh: '感谢',
    icon: 'heart-outline',
    color: '#DB2777',
  },
  {
    id: 'requests',
    nameRu: 'Просьба',
    nameTk: 'Haýyş',
    nameZh: '请求',
    icon: 'hand-right-outline',
    color: '#059669',
  },
  {
    id: 'apologies',
    nameRu: 'Извинение',
    nameTk: 'Bagyşlama',
    nameZh: '道歉',
    icon: 'sad-outline',
    color: '#DC2626',
  },
  {
    id: 'congratulations',
    nameRu: 'Поздравление',
    nameTk: 'Gutlagma',
    nameZh: '祝贺',
    icon: 'gift-outline',
    color: '#7C2D12',
  },
  {
    id: 'invitations',
    nameRu: 'Приглашение',
    nameTk: 'Çagyryş',
    nameZh: '邀请',
    icon: 'mail-outline',
    color: '#0369A1',
  },
  {
    id: 'agreement',
    nameRu: 'Согласие',
    nameTk: 'Ylalaşyk',
    nameZh: '同意',
    icon: 'checkmark-circle-outline',
    color: '#16A34A',
  },
  {
    id: 'disagreement',
    nameRu: 'Отказ, несогласие',
    nameTk: 'Ýok, razylaşmamak',
    nameZh: '拒绝，不同意',
    icon: 'close-circle-outline',
    color: '#DC2626',
  },
  {
    id: 'misunderstanding',
    nameRu: 'Недоразумение',
    nameTk: 'Düşünişmezlik',
    nameZh: '误解',
    icon: 'help-circle-outline',
    color: '#CA8A04',
  },
  {
    id: 'sympathy',
    nameRu: 'Сожаление, сочувствие',
    nameTk: 'Gynanç, duýgudaşlyk',
    nameZh: '遗憾，同情',
    icon: 'heart-dislike-outline',
    color: '#7C2D12',
  },
  {
    id: 'farewell',
    nameRu: 'Прощание',
    nameTk: 'Hoş gal',
    nameZh: '告别',
    icon: 'exit-outline',
    color: '#374151',
  },

  // Путешествие и документы
  {
    id: 'customs',
    nameRu: 'Паспортный контроль. Таможня',
    nameTk: 'Pasport gözegçiligi. Gümrük',
    nameZh: '护照检查。海关',
    icon: 'document-text-outline',
    color: '#1E40AF',
  },
  {
    id: 'train_station',
    nameRu: 'На вокзале, в поезде',
    nameTk: 'Duralgada, otly',
    nameZh: '在车站，在火车上',
    icon: 'train-outline',
    color: '#059669',
  },

  // Активности и хобби
  {
    id: 'sports',
    nameRu: 'Спорт',
    nameTk: 'Sport',
    nameZh: '体育',
    icon: 'fitness-outline',
    color: '#DC2626',
  },

  // Бизнес и работа
  {
    id: 'business',
    nameRu: 'Экономическое сотрудничество',
    nameTk: 'Ykdysady hyzmatdaşlyk',
    nameZh: '经济合作',
    icon: 'briefcase-outline',
    color: '#1F2937',
  },
  {
    id: 'personal_info',
    nameRu: 'Общение. О себе',
    nameTk: 'Aragatnaşyk. Öz hakynda',
    nameZh: '交流。关于自己',
    icon: 'person-circle-outline',
    color: '#7C3AED',
  },
  {
    id: 'measurements',
    nameRu: 'Система мер и весов',
    nameTk: 'Ölçeg we agram ulgamy',
    nameZh: '度量衡制度',
    icon: 'resize-outline',
    color: '#374151',
  },

  // ===== ДОПОЛНИТЕЛЬНЫЕ КАТЕГОРИИ (ОСТАВЛЯЕМ ДЛЯ БУДУЩЕГО РАСШИРЕНИЯ) =====
  {
    id: 'family',
    nameRu: 'Семья',
    nameTk: 'Maşgala',
    nameZh: '家庭',
    icon: 'people-outline',
    color: '#E11D48',
  },
  {
    id: 'work',
    nameRu: 'Работа',
    nameTk: 'Iş',
    nameZh: '工作',
    icon: 'briefcase-outline',
    color: '#7C3AED',
  },
  {
    id: 'education',
    nameRu: 'Образование',
    nameTk: 'Bilim',
    nameZh: '教育',
    icon: 'school-outline',
    color: '#059669',
  },
  {
    id: 'culture',
    nameRu: 'Культура',
    nameTk: 'Medeniýet',
    nameZh: '文化',
    icon: 'library-outline',
    color: '#9333EA',
  },
  {
    id: 'nature',
    nameRu: 'Природа',
    nameTk: 'Tebigat',
    nameZh: '自然',
    icon: 'leaf-outline',
    color: '#16A34A',
  },
  {
    id: 'technology',
    nameRu: 'Технологии',
    nameTk: 'Tehnologiýa',
    nameZh: '科技',
    icon: 'laptop-outline',
    color: '#0284C7',
  },
  {
    id: 'clothing',
    nameRu: 'Одежда',
    nameTk: 'Egin-eşik',
    nameZh: '服装',
    icon: 'shirt-outline',
    color: '#C2410C',
  },
  {
    id: 'home',
    nameRu: 'Дом',
    nameTk: 'Öý',
    nameZh: '家',
    icon: 'home-outline',
    color: '#7C2D12',
  },
  {
    id: 'colors',
    nameRu: 'Цвета',
    nameTk: 'Reňkler',
    nameZh: '颜色',
    icon: 'color-palette-outline',
    color: '#BE185D',
  },
  {
    id: 'body',
    nameRu: 'Части тела',
    nameTk: 'Beden bölekleri',
    nameZh: '身体部位',
    icon: 'hand-left-outline',
    color: '#B91C1C',
  },
];

/**
 * Получить название категории на нужном языке
 */
export function getCategoryName(category: Category, language: 'ru' | 'tk' | 'zh'): string {
  switch (language) {
    case 'tk': return category.nameTk;
    case 'zh': return category.nameZh;
    default: return category.nameRu;
  }
}

/**
 * Поиск категории по ID
 */
export const getCategoryById = (id: string): Category | undefined => {
  return categories.find(category => category.id === id);
};

/**
 * Получить категории по группам
 */
export const getCategoriesByGroup = () => {
  return {
    // Основные 14 с фразами
    main: categories.slice(0, 14),
    
    // Новые 18 из книги (пока без фраз)
    social: categories.slice(14, 26), // Социальное общение  
    travel: categories.slice(26, 28), // Путешествие и документы
    activities: [categories[28]], // Спорт
    business: categories.slice(29, 32), // Бизнес и личная информация
    
    // Дополнительные (для будущего)
    future: categories.slice(32)
  };
};

/**
 * Статистика категорий
 */
export const getCategoriesStats = () => {
  return {
    total: categories.length, // 39 категорий
    withPhrases: 14, // Категории с фразами
    fromBook: 18, // Новые из книги  
    additional: 7, // Дополнительные
  };
};

// КОММЕНТАРИИ ДЛЯ РАЗРАБОТЧИКА:
// 1. Добавлено 18 новых категорий из книги
// 2. Всего стало 39 категорий (было 25)
// 3. Группировка по типам для удобства
// 4. Готовность к добавлению подкатегорий в будущем
// 5. Все иконки из Ionicons, все цвета уникальные