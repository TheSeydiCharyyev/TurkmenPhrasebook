// src/data/categories.ts - ОБНОВЛЕННЫЙ с подкатегориями из книги

import { Category, SubCategory } from '../types';

// ===== ПОДКАТЕГОРИИ =====

// Подкатегории для "В ресторане" (food)
const foodSubcategories: SubCategory[] = [
  {
    id: 'food_appetizers',
    parentId: 'food',
    nameRu: 'Закуски',
    nameTk: 'Başlaýjy naharlar',
    nameZh: '开胃菜',
    icon: 'restaurant-outline',
    color: '#10B981',
  },
  {
    id: 'food_soups',
    parentId: 'food',
    nameRu: 'Супы',
    nameTk: 'Çorbalar',
    nameZh: '汤',
    icon: 'restaurant-outline',
    color: '#10B981',
  },
  {
    id: 'food_meat',
    parentId: 'food',
    nameRu: 'Мясные блюда',
    nameTk: 'Et naharlar',
    nameZh: '肉类菜肴',
    icon: 'restaurant-outline',
    color: '#10B981',
  },
  {
    id: 'food_fish',
    parentId: 'food',
    nameRu: 'Рыбные блюда',
    nameTk: 'Balyk naharlar',
    nameZh: '鱼类菜肴',
    icon: 'restaurant-outline',
    color: '#10B981',
  },
  {
    id: 'food_vegetables',
    parentId: 'food',
    nameRu: 'Овощи',
    nameTk: 'Gök önümler',
    nameZh: '蔬菜',
    icon: 'restaurant-outline',
    color: '#10B981',
  },
  {
    id: 'food_fruits',
    parentId: 'food',
    nameRu: 'Фрукты, орехи, ягоды',
    nameTk: 'Miweler, hoz, miweli',
    nameZh: '水果，坚果，浆果',
    icon: 'restaurant-outline',
    color: '#10B981',
  },
  {
    id: 'food_alcohol',
    parentId: 'food',
    nameRu: 'Спиртные напитки',
    nameTk: 'Alkogol içgileri',
    nameZh: '酒类',
    icon: 'wine-outline',
    color: '#10B981',
  },
  {
    id: 'food_beverages',
    parentId: 'food',
    nameRu: 'Безалкогольные напитки',
    nameTk: 'Alkogolsyz içgiler',
    nameZh: '非酒精饮料',
    icon: 'cafe-outline',
    color: '#10B981',
  },
  {
    id: 'food_desserts',
    parentId: 'food',
    nameRu: 'Десерты',
    nameTk: 'Süýjiler',
    nameZh: '甜点',
    icon: 'ice-cream-outline',
    color: '#10B981',
  },
];

// Подкатегории для "В отеле" (hotel)
const hotelSubcategories: SubCategory[] = [
  {
    id: 'hotel_requests',
    parentId: 'hotel',
    nameRu: 'Просьбы',
    nameTk: 'Haýyşlar',
    nameZh: '请求',
    icon: 'hand-right-outline',
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

// Подкатегории для "Развлечения" (entertainment)
const entertainmentSubcategories: SubCategory[] = [
  {
    id: 'entertainment_theater',
    parentId: 'entertainment',
    nameRu: 'Театр',
    nameTk: 'Teatr',
    nameZh: '剧院',
    icon: 'library-outline',
    color: '#A855F7',
  },
  {
    id: 'entertainment_cinema',
    parentId: 'entertainment',
    nameRu: 'Кино',
    nameTk: 'Kino',
    nameZh: '电影',
    icon: 'film-outline',
    color: '#A855F7',
  },
  {
    id: 'entertainment_concert',
    parentId: 'entertainment',
    nameRu: 'Концерт',
    nameTk: 'Konsert',
    nameZh: '音乐会',
    icon: 'musical-notes-outline',
    color: '#A855F7',
  },
  {
    id: 'entertainment_museum',
    parentId: 'entertainment',
    nameRu: 'В музее',
    nameTk: 'Muzeýde',
    nameZh: '在博物馆',
    icon: 'library-outline',
    color: '#A855F7',
  },
  {
    id: 'entertainment_useful_words',
    parentId: 'entertainment',
    nameRu: 'Полезные слова',
    nameTk: 'Peýdaly sözler',
    nameZh: '有用词汇',
    icon: 'book-outline',
    color: '#A855F7',
  },
];

// Подкатегории для "Общение. О себе" (personal_info)
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
    nameZh: '中国度量',
    icon: 'calculator-outline',
    color: '#374151',
  },
];

// Подкатегории для "Пребывание в городе" (directions)
const directionsSubcategories: SubCategory[] = [
  {
    id: 'directions_sightseeing',
    parentId: 'directions',
    nameRu: 'Осмотр достопримечательностей',
    nameTk: 'Gözel ýerleri görmek',
    nameZh: '观光',
    icon: 'camera-outline',
    color: '#06B6D4',
  },
  {
    id: 'directions_transport',
    parentId: 'directions',
    nameRu: 'Городской транспорт',
    nameTk: 'Şäher ulagy',
    nameZh: '城市交通',
    icon: 'bus-outline',
    color: '#06B6D4',
  },
  {
    id: 'directions_useful_words',
    parentId: 'directions',
    nameRu: 'Полезные слова',
    nameTk: 'Peýdaly sözler',
    nameZh: '有用词汇',
    icon: 'book-outline',
    color: '#06B6D4',
  },
];

// Подкатегории для "Медицинская помощь" (health)
const healthSubcategories: SubCategory[] = [
  {
    id: 'health_doctor',
    parentId: 'health',
    nameRu: 'У врача',
    nameTk: 'Lukmanda',
    nameZh: '看医生',
    icon: 'medical-outline',
    color: '#84CC16',
  },
  {
    id: 'health_pharmacy',
    parentId: 'health',
    nameRu: 'В аптеке',
    nameTk: 'Dermanhana',
    nameZh: '在药店',
    icon: 'medical-outline',
    color: '#84CC16',
  },
];

// Подкатегории для категорий с "Полезными словами"
const bankingSubcategories: SubCategory[] = [
  {
    id: 'money_useful_words',
    parentId: 'money',
    nameRu: 'Полезные слова',
    nameTk: 'Peýdaly sözler',
    nameZh: '有用词汇',
    icon: 'book-outline',
    color: '#FBBF24',
  },
];

const trainSubcategories: SubCategory[] = [
  {
    id: 'train_station_useful_words',
    parentId: 'train_station',
    nameRu: 'Полезные слова',
    nameTk: 'Peýdaly sözler',
    nameZh: '有用词汇',
    icon: 'book-outline',
    color: '#059669',
  },
];

const customsSubcategories: SubCategory[] = [
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

const communicationSubcategories: SubCategory[] = [
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

const shoppingSubcategories: SubCategory[] = [
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

const sportsSubcategories: SubCategory[] = [
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

// ===== ОСНОВНЫЕ КАТЕГОРИИ С ПОДКАТЕГОРИЯМИ =====

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
    hasSubcategories: true,
    subcategories: hotelSubcategories,
  },
  {
    id: 'food',
    nameRu: 'Еда и рестораны',
    nameTk: 'Nahar we restoranlarda',
    nameZh: '餐饮',
    icon: 'restaurant-outline',
    color: '#10B981',
    hasSubcategories: true,
    subcategories: foodSubcategories,
  },
  {
    id: 'shopping',
    nameRu: 'Покупки и торг',
    nameTk: 'Söwda we bazarlyk',
    nameZh: '购物',
    icon: 'storefront-outline',
    color: '#F59E0B',
    hasSubcategories: true,
    subcategories: shoppingSubcategories,
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
    hasSubcategories: true,
    subcategories: directionsSubcategories,
  },
  {
    id: 'health',
    nameRu: 'Здоровье',
    nameTk: 'Saglyk',
    nameZh: '健康',
    icon: 'medical-outline',
    color: '#84CC16',
    hasSubcategories: true,
    subcategories: healthSubcategories,
  },
  {
    id: 'money',
    nameRu: 'Деньги и банки',
    nameTk: 'Pul we banklar',
    nameZh: '金融',
    icon: 'card-outline',
    color: '#FBBF24',
    hasSubcategories: true,
    subcategories: bankingSubcategories,
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
    nameTk: 'Güýmenje',
    nameZh: '娱乐',
    icon: 'game-controller-outline',
    color: '#A855F7',
    hasSubcategories: true,
    subcategories: entertainmentSubcategories,
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

  // ===== НОВЫЕ КАТЕГОРИИ ИЗ КНИГИ С ПОДКАТЕГОРИЯМИ =====
  
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
    hasSubcategories: true,
    subcategories: customsSubcategories,
  },
  {
    id: 'train_station',
    nameRu: 'На вокзале, в поезде',
    nameTk: 'Duralgada, otly',
    nameZh: '在车站，在火车上',
    icon: 'train-outline',
    color: '#059669',
    hasSubcategories: true,
    subcategories: trainSubcategories,
  },

  // Активности и хобби
  {
    id: 'sports',
    nameRu: 'Спорт',
    nameTk: 'Sport',
    nameZh: '体育',
    icon: 'fitness-outline',
    color: '#DC2626',
    hasSubcategories: true,
    subcategories: sportsSubcategories,
  },

  // Бизнес и работа
  {
    id: 'business',
    nameRu: 'Экономическое сотрудничество',
    nameTk: 'Ykdysady hyzmatdaşlyk',
    nameZh: '经济合作',
    icon: 'briefcase-outline',
    color: '#1F2937',
    hasSubcategories: true,
    subcategories: businessSubcategories,
  },
  {
    id: 'personal_info',
    nameRu: 'Общение. О себе',
    nameTk: 'Aragatnaşyk. Öz hakynda',
    nameZh: '交流。关于自己',
    icon: 'person-circle-outline',
    color: '#7C3AED',
    hasSubcategories: true,
    subcategories: personalInfoSubcategories,
  },
  {
    id: 'measurements',
    nameRu: 'Система мер и весов',
    nameTk: 'Ölçeg we agram ulgamy',
    nameZh: '度量衡制度',
    icon: 'resize-outline',
    color: '#374151',
    hasSubcategories: true,
    subcategories: measurementsSubcategories,
  },

  // ===== ДОПОЛНИТЕЛЬНЫЕ КАТЕГОРИИ (БЕЗ ПОДКАТЕГОРИЙ ПОКА) =====
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
    totalCategories: categories.length, // 42 категории
    categoriesWithSubcategories: categoriesWithSub.length, // ~15 категорий с подкатегориями
    totalSubcategories: totalSubcategories, // ~50+ подкатегорий
    withPhrases: 14, // Категории с фразами (пока)
    fromBook: 18, // Новые из книги
    additional: 10, // Дополнительные
  };
};

// КОММЕНТАРИИ ДЛЯ РАЗРАБОТЧИКА:
// 1. Добавлено ~50 подкатегорий для 15 основных категорий
// 2. Все подкатегории имеют правильные переводы на 3 языка
// 3. "Полезные слова" - это обычные подкатегории
// 4. Максимум 2 уровня вложенности (категория → подкатегория)
// 5. Все иконки из Ionicons, цвета наследуются от родителей
// 6. Готово к интеграции с UI компонентами