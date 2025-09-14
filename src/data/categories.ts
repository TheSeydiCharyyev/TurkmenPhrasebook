// src/data/categories.ts - 25 категорий с modern flat иконками

import { Category } from '../types';

export const categories: Category[] = [
  {
    id: 'greetings',
    nameRu: 'Приветствие',
    nameTk: 'Salamlaşmak',
    nameZh: '问候语',
    icon: 'person-outline', // Modern flat
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
    id: 'sports',
    nameRu: 'Спорт',
    nameTk: 'Sport',
    nameZh: '体育',
    icon: 'fitness-outline',
    color: '#DC2626',
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