// src/data/categories.ts - ПОЛНАЯ ВЕРСИЯ с расширениями

import { Category, SubCategory } from '../types';

// ===== ПОДКАТЕГОРИИ =====

// Подкатегории для "В отеле" (hotel)
const hotelSubcategories: SubCategory[] = [
  {
    id: 'hotel_requests',
    parentId: 'hotel',
    nameRu: 'Просьбы',
    nameTk: 'Haýyşlar',
    nameZh: '请求',
    icon: 'help-circle-outline',
    color: '#8B5CF6',
  },
  {
    id: 'hotel_complaints',
    parentId: 'hotel',
    nameRu: 'Жалобы',
    nameTk: 'Şikaýatlar',
    nameZh: '投诉',
    icon: 'warning-outline',
    color: '#8B5CF6',
  },
  {
    id: 'hotel_useful_words',
    parentId: 'hotel',
    nameRu: 'Полезные слова',
    nameTk: 'Peýdaly sözler',
    nameZh: '有用词汇',
    icon: 'book-outline',
    color: '#8B5CF6',
  },
];

// Подкатегории для "Еда и рестораны" (food)
const foodSubcategories: SubCategory[] = [
  {
    id: 'food_ordering',
    parentId: 'food',
    nameRu: 'Заказ еды',
    nameTk: 'Nahar sargyt etmek',
    nameZh: '点餐',
    icon: 'receipt-outline',
    color: '#C2410C',
  },
  {
    id: 'food_appetizers',
    parentId: 'food',
    nameRu: 'Закуски',
    nameTk: 'Şirelendiriji iýmitler',
    nameZh: '开胃菜',
    icon: 'restaurant-outline',
    color: '#C2410C',
  },
  {
    id: 'food_soups',
    parentId: 'food',
    nameRu: 'Супы',
    nameTk: 'Çorbalar',
    nameZh: '汤类',
    icon: 'cafe-outline',
    color: '#C2410C',
  },
  {
    id: 'food_meat',
    parentId: 'food',
    nameRu: 'Мясные блюда',
    nameTk: 'Etli naharlar',
    nameZh: '肉类菜肴',
    icon: 'nutrition-outline',
    color: '#C2410C',
  },
  {
    id: 'food_fish',
    parentId: 'food',
    nameRu: 'Рыбные блюда',
    nameTk: 'Balykly naharlar',
    nameZh: '鱼类菜肴',
    icon: 'fish-outline',
    color: '#C2410C',
  },
  {
    id: 'food_vegetables',
    parentId: 'food',
    nameRu: 'Овощи и фрукты',
    nameTk: 'Gök we miweler',
    nameZh: '蔬菜水果',
    icon: 'leaf-outline',
    color: '#C2410C',
  },
  {
    id: 'food_drinks',
    parentId: 'food',
    nameRu: 'Напитки',
    nameTk: 'Içgiler',
    nameZh: '饮料',
    icon: 'wine-outline',
    color: '#C2410C',
  },
  {
    id: 'food_desserts',
    parentId: 'food',
    nameRu: 'Десерты',
    nameTk: 'Desertler',
    nameZh: '甜品',
    icon: 'ice-cream-outline',
    color: '#C2410C',
  },
];

// Подкатегории для "Покупки и торг" (shopping)
const shoppingSubcategories: SubCategory[] = [
  {
    id: 'shopping_clothing',
    parentId: 'shopping',
    nameRu: 'Одежда',
    nameTk: 'Eşikler',
    nameZh: '服装',
    icon: 'shirt-outline',
    color: '#F59E0B',
  },
  {
    id: 'shopping_bargaining',
    parentId: 'shopping',
    nameRu: 'Торг',
    nameTk: 'Söwda',
    nameZh: '讨价还价',
    icon: 'pricetag-outline',
    color: '#F59E0B',
  },
  {
    id: 'shopping_useful_words',
    parentId: 'shopping',
    nameRu: 'Полезные слова',
    nameTk: 'Peýdaly sözler',
    nameZh: '有用词汇',
    icon: 'book-outline',
    color: '#F59E0B',
  },
];

// Подкатегории для "Транспорт" (transport)
const transportSubcategories: SubCategory[] = [
  {
    id: 'transport_airport',
    parentId: 'transport',
    nameRu: 'В аэропорту, в самолете',
    nameTk: 'Howa menzilinde, uçarda',
    nameZh: '在机场，在飞机上',
    icon: 'airplane-outline',
    color: '#059669',
  },
  {
    id: 'transport_train',
    parentId: 'transport',
    nameRu: 'На вокзале, в поезде',
    nameTk: 'Wokzalda, poýezdde',
    nameZh: '在车站，在火车上',
    icon: 'train-outline',
    color: '#059669',
  },
  {
    id: 'transport_city',
    parentId: 'transport',
    nameRu: 'Городской транспорт',
    nameTk: 'Şäher transporty',
    nameZh: '城市交通',
    icon: 'bus-outline',
    color: '#059669',
  },
];

// Подкатегории для "Направления" (directions)
const directionsSubcategories: SubCategory[] = [
  {
    id: 'directions_sightseeing',
    parentId: 'directions',
    nameRu: 'Осмотр достопримечательностей',
    nameTk: 'Meşhur ýerleri seredip görmek',
    nameZh: '观光景点',
    icon: 'camera-outline',
    color: '#DC2626',
  },
  {
    id: 'directions_useful_words',
    parentId: 'directions',
    nameRu: 'Полезные слова',
    nameTk: 'Peýdaly sözler',
    nameZh: '有用词汇',
    icon: 'book-outline',
    color: '#DC2626',
  },
];

// Подкатегории для "Связь" (communication)
const communicationSubcategories: SubCategory[] = [
  {
    id: 'communication_postal',
    parentId: 'communication',
    nameRu: 'Почта, телеграф, телефон',
    nameTk: 'Poçta, telegraf, telefon',
    nameZh: '邮政，电报，电话',
    icon: 'mail-outline',
    color: '#EC4899',
  },
  {
    id: 'communication_useful_words',
    parentId: 'communication',
    nameRu: 'Полезные слова',
    nameTk: 'Peýdaly sözler',
    nameZh: '有用词汇',
    icon: 'book-outline',
    color: '#EC4899',
  },
];

// Подкатегории для "Развлечения" (entertainment)
const entertainmentSubcategories: SubCategory[] = [
  {
    id: 'entertainment_theater',
    parentId: 'entertainment',
    nameRu: 'Театр',
    nameTk: 'Teatr',
    nameZh: '剧院',
    icon: 'musical-notes-outline',
    color: '#7C3AED',
  },
  {
    id: 'entertainment_cinema',
    parentId: 'entertainment',
    nameRu: 'Кино',
    nameTk: 'Kino',
    nameZh: '电影院',
    icon: 'film-outline',
    color: '#7C3AED',
  },
  {
    id: 'entertainment_concert',
    parentId: 'entertainment',
    nameRu: 'Концерт',
    nameTk: 'Konsert',
    nameZh: '音乐会',
    icon: 'disc-outline',
    color: '#7C3AED',
  },
  {
    id: 'entertainment_museum',
    parentId: 'entertainment',
    nameRu: 'В музее',
    nameTk: 'Muzeýde',
    nameZh: '在博物馆',
    icon: 'library-outline',
    color: '#7C3AED',
  },
  {
    id: 'entertainment_useful_words',
    parentId: 'entertainment',
    nameRu: 'Полезные слова',
    nameTk: 'Peýdaly sözler',
    nameZh: '有用词汇',
    icon: 'book-outline',
    color: '#7C3AED',
  },
];

// Подкатегории для "Время и даты" (time)
const timeSubcategories: SubCategory[] = [
  {
    id: 'time_basic',
    parentId: 'time',
    nameRu: 'Время',
    nameTk: 'Wagt',
    nameZh: '时间',
    icon: 'time-outline',
    color: '#0D9488',
  },
  {
    id: 'time_days',
    parentId: 'time',
    nameRu: 'Дни недели',
    nameTk: 'Hepdäniň günleri',
    nameZh: '星期',
    icon: 'calendar-outline',
    color: '#0D9488',
  },
  {
    id: 'time_months',
    parentId: 'time',
    nameRu: 'Месяцы',
    nameTk: 'Aýlar',
    nameZh: '月份',
    icon: 'calendar-number-outline',
    color: '#0D9488',
  },
];

// Подкатегории для "Здоровье" (health)
const healthSubcategories: SubCategory[] = [
  {
    id: 'health_doctor',
    parentId: 'health',
    nameRu: 'У врача',
    nameTk: 'Lukmanyňkyda',
    nameZh: '看医生',
    icon: 'medical-outline',
    color: '#059669',
  },
  {
    id: 'health_pharmacy',
    parentId: 'health',
    nameRu: 'В аптеке',
    nameTk: 'Dermanhanada',
    nameZh: '在药店',
    icon: 'bandage-outline',
    color: '#059669',
  },
];

// Подкатегории для "Деньги и банки" (money)
const moneySubcategories: SubCategory[] = [
  {
    id: 'money_exchange',
    parentId: 'money',
    nameRu: 'Банк, обмен валюты',
    nameTk: 'Bank, walýuta çalyşmak',
    nameZh: '银行，外汇兑换',
    icon: 'card-outline',
    color: '#0891B2',
  },
  {
    id: 'money_useful_words',
    parentId: 'money',
    nameRu: 'Полезные слова',
    nameTk: 'Peýdaly sözler',
    nameZh: '有用词汇',
    icon: 'book-outline',
    color: '#0891B2',
  },
];

// Подкатегории для "Таможня" (customs)
const customsSubcategories: SubCategory[] = [
  {
    id: 'customs_passport',
    parentId: 'customs',
    nameRu: 'Паспортный контроль',
    nameTk: 'Pasport gözegçiligi',
    nameZh: '护照检查',
    icon: 'document-text-outline',
    color: '#1E40AF',
  },
  {
    id: 'customs_useful_words',
    parentId: 'customs',
    nameRu: 'Полезные слова',
    nameTk: 'Peýdaly sözler',
    nameZh: '有用词汇',
    icon: 'book-outline',
    color: '#1E40AF',
  },
];

// Подкатегории для "Спорт" (sports)
const sportsSubcategories: SubCategory[] = [
  {
    id: 'sports_activities',
    parentId: 'sports',
    nameRu: 'Спорт',
    nameTk: 'Sport',
    nameZh: '体育运动',
    icon: 'football-outline',
    color: '#DC2626',
  },
  {
    id: 'sports_useful_words',
    parentId: 'sports',
    nameRu: 'Полезные слова',
    nameTk: 'Peýdaly sözler',
    nameZh: '有用词汇',
    icon: 'book-outline',
    color: '#DC2626',
  },
];

// ===== НОВЫЕ ПОДКАТЕГОРИИ =====

// Подкатегории для "О себе" (personal_info)
const personalInfoSubcategories: SubCategory[] = [
  {
    id: 'personal_name_age',
    parentId: 'personal_info',
    nameRu: 'Имя, возраст',
    nameTk: 'At, ýaş',
    nameZh: '姓名，年龄',
    icon: 'person-outline',
    color: '#7C3AED',
  },
  {
    id: 'personal_residence',
    parentId: 'personal_info',
    nameRu: 'Местожительство',
    nameTk: 'Ýaşaýan ýeri',
    nameZh: '居住地',
    icon: 'home-outline',
    color: '#7C3AED',
  },
  {
    id: 'personal_family',
    parentId: 'personal_info',
    nameRu: 'Семья',
    nameTk: 'Maşgala',
    nameZh: '家庭',
    icon: 'people-outline',
    color: '#7C3AED',
  },
  {
    id: 'personal_work',
    parentId: 'personal_info',
    nameRu: 'Работа',
    nameTk: 'Iş',
    nameZh: '工作',
    icon: 'briefcase-outline',
    color: '#7C3AED',
  },
  {
    id: 'personal_languages',
    parentId: 'personal_info',
    nameRu: 'Иностранные языки',
    nameTk: 'Daşary ýurt dilleri',
    nameZh: '外语',
    icon: 'language-outline',
    color: '#7C3AED',
  },
];

// Подкатегории для "Экономическое сотрудничество" (business)
const businessSubcategories: SubCategory[] = [
  {
    id: 'business_conferences',
    parentId: 'business',
    nameRu: 'Конференции',
    nameTk: 'Konferensiýalar',
    nameZh: '会议',
    icon: 'people-outline',
    color: '#1F2937',
  },
  {
    id: 'business_exhibitions',
    parentId: 'business',
    nameRu: 'Техническая выставка',
    nameTk: 'Tehniki sergi',
    nameZh: '技术展览',
    icon: 'desktop-outline',
    color: '#1F2937',
  },
  {
    id: 'business_negotiations',
    parentId: 'business',
    nameRu: 'Деловые переговоры',
    nameTk: 'Işewür gepleşikler',
    nameZh: '商务谈判',
    icon: 'chatbubbles-outline',
    color: '#1F2937',
  },
];

// Подкатегории для "Система мер и весов" (measurements)
const measurementsSubcategories: SubCategory[] = [
  {
    id: 'measurements_length',
    parentId: 'measurements',
    nameRu: 'Длина',
    nameTk: 'Uzynlyk',
    nameZh: '长度',
    icon: 'resize-outline',
    color: '#374151',
  },
  {
    id: 'measurements_weight',
    parentId: 'measurements',
    nameRu: 'Вес',
    nameTk: 'Agram',
    nameZh: '重量',
    icon: 'barbell-outline',
    color: '#374151',
  },
  {
    id: 'measurements_volume',
    parentId: 'measurements',
    nameRu: 'Объем',
    nameTk: 'Göwrüm',
    nameZh: '体积',
    icon: 'cube-outline',
    color: '#374151',
  },
  {
    id: 'measurements_chinese',
    parentId: 'measurements',
    nameRu: 'Китайские меры',
    nameTk: 'Hytaý ölçegleri',
    nameZh: '中国度量单位',
    icon: 'calculator-outline',
    color: '#374151',
  },
];



export const categories: Category[] = [

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
    hasSubcategories: true,
    subcategories: hotelSubcategories,
  },
  {
    id: 'food',
    nameRu: 'Еда и рестораны',
    nameTk: 'Nahar we restoranlarda',
    nameZh: '餐饮',
    icon: 'restaurant-outline',
    color: '#C2410C',
    hasSubcategories: true,
    subcategories: foodSubcategories,
  },
  {
    id: 'shopping',
    nameRu: 'Покупки и торг',
    nameTk: 'Satyn almak we bähsleşmek',
    nameZh: '购物和讨价还价',
    icon: 'storefront-outline',
    color: '#F59E0B',
    hasSubcategories: true,
    subcategories: shoppingSubcategories,
  },
  {
    id: 'transport',
    nameRu: 'Транспорт',
    nameTk: 'Transport',
    nameZh: '交通',
    icon: 'car-outline',
    color: '#059669',
    hasSubcategories: true,
    subcategories: transportSubcategories,
  },
  {
    id: 'directions',
    nameRu: 'Направления',
    nameTk: 'Ugurlar',
    nameZh: '方向',
    icon: 'compass-outline',
    color: '#DC2626',
    hasSubcategories: true,
    subcategories: directionsSubcategories,
  },
  {
    id: 'health',
    nameRu: 'Здоровье',
    nameTk: 'Saglyk',
    nameZh: '健康',
    icon: 'fitness-outline',
    color: '#059669',
    hasSubcategories: true,
    subcategories: healthSubcategories,
  },
  {
    id: 'money',
    nameRu: 'Деньги и банки',
    nameTk: 'Pul we banklar',
    nameZh: '货币和银行',
    icon: 'wallet-outline',
    color: '#0891B2',
    hasSubcategories: true,
    subcategories: moneySubcategories,
  },
  {
    id: 'communication',
    nameRu: 'Связь',
    nameTk: 'Aragatnaşyk',
    nameZh: '通讯',
    icon: 'call-outline',
    color: '#EC4899',
    hasSubcategories: true,
    subcategories: communicationSubcategories,
  },
  {
    id: 'entertainment',
    nameRu: 'Развлечения',
    nameTk: 'Güýmenjeler',
    nameZh: '娱乐',
    icon: 'game-controller-outline',
    color: '#7C3AED',
    hasSubcategories: true,
    subcategories: entertainmentSubcategories,
  },
  {
    id: 'time',
    nameRu: 'Время и даты',
    nameTk: 'Wagt we seneler',
    nameZh: '时间和日期',
    icon: 'time-outline',
    color: '#0D9488',
    hasSubcategories: true,
    subcategories: timeSubcategories,
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

  
  {
    id: 'personal_info',
    nameRu: 'О себе',
    nameTk: 'Özüň barada',
    nameZh: '个人信息',
    icon: 'person-circle-outline',
    color: '#7C3AED',
    hasSubcategories: true,
    subcategories: personalInfoSubcategories,
  },
  {
    id: 'business',
    nameRu: 'Деловое сотрудничество',
    nameTk: 'Işjeň hyzmatdaşlyk',
    nameZh: '商务合作',
    icon: 'briefcase-outline',
    color: '#1F2937',
    hasSubcategories: true,
    subcategories: businessSubcategories,
  },
  {
    id: 'measurements',
    nameRu: 'Системы мер и весов',
    nameTk: 'Ölçegler we agyrlyk ulgamlary',
    nameZh: '度量衡制度',
    icon: 'scale-outline',
    color: '#374151',
    hasSubcategories: true,
    subcategories: measurementsSubcategories,
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
  {
    id: 'home',
    nameRu: 'Дом',
    nameTk: 'Öý',
    nameZh: '家',
    icon: 'home-outline',
    color: '#7C2D12',
  },
  

  {
    id: 'customs',
    nameRu: 'Таможня',
    nameTk: 'Gümrük',
    nameZh: '海关',
    icon: 'shield-checkmark-outline',
    color: '#1E40AF',
    hasSubcategories: true,
    subcategories: customsSubcategories,
  },
  {
    id: 'sport',
    nameRu: 'Спорт',
    nameTk: 'Sport',
    nameZh: '体育',
    icon: 'fitness-outline',
    color: '#DC2626',
    hasSubcategories: true,
    subcategories: sportsSubcategories,
  },
];

// ===== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ =====

/**
 * Получить все подкатегории
 */
export const getAllSubcategories = (): SubCategory[] => {
  const allSubcategories: SubCategory[] = [];
  
  categories.forEach(category => {
    if (category.hasSubcategories && category.subcategories) {
      allSubcategories.push(...category.subcategories);
    }
  });
  
  return allSubcategories;
};

/**
 * Получить подкатегории по ID родительской категории
 */
export const getSubcategoriesByParentId = (parentId: string): SubCategory[] => {
  const category = categories.find(cat => cat.id === parentId);
  return category?.subcategories || [];
};

/**
 * Получить подкатегорию по ID
 */
export const getSubcategoryById = (id: string): SubCategory | undefined => {
  const allSubcategories = getAllSubcategories();
  return allSubcategories.find(subcat => subcat.id === id);
};

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
 * Получить название подкатегории на нужном языке
 */
export function getSubcategoryName(subcategory: SubCategory, language: 'ru' | 'tk' | 'zh'): string {
  switch (language) {
    case 'tk': return subcategory.nameTk;
    case 'zh': return subcategory.nameZh;
    default: return subcategory.nameRu;
  }
}

/**
 * Поиск категории по ID
 */
export const getCategoryById = (id: string): Category | undefined => {
  return categories.find(category => category.id === id);
};

/**
 * Получить категории с подкатегориями
 */
export const getCategoriesWithSubcategories = (): Category[] => {
  return categories.filter(category => category.hasSubcategories);
};

/**
 * Получить статистику категорий и подкатегорий
 */
export const getCategoriesStats = () => {
  const categoriesWithSub = getCategoriesWithSubcategories();
  const totalSubcategories = getAllSubcategories().length;
  
  return {
    totalCategories: categories.length, // 22 категории
    categoriesWithSubcategories: categoriesWithSub.length, // 17 категорий с подкатегориями
    totalSubcategories: totalSubcategories, // 50+ подкатегорий
    withPhrases: 20, // Категории с фразами
    additional: 2, // Дополнительные (customs, sports)
  };
};

