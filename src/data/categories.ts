// src/data/categories.ts
import { Category } from '../types';

// ПРИМЕЧАНИЕ: Изображения из Unsplash для демонстрации
// В продакшене заменить на локальные файлы

export const categories: Category[] = [
  {
    id: 'greetings',
    nameRu: 'Приветствие и знакомство',
    nameTk: 'Salamlaşmak we tanyşmak',
    nameZh: '问候和介绍',
    icon: '👋',
    color: '#FF6B6B',
    imageUrl: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=400&h=300&fit=crop'
  },
  {
    id: 'emergency',
    nameRu: 'Экстренные ситуации',
    nameTk: 'Gyssagly ýagdaýlar',
    nameZh: '紧急情况',
    icon: '🚨',
    color: '#FF4757',
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop'
  },
  {
    id: 'hotel',
    nameRu: 'Отель и размещение',
    nameTk: 'Myhmanhana we ýaşaýyş',
    nameZh: '酒店和住宿',
    icon: '🏨',
    color: '#5352ED',
    imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop'
  },
  {
    id: 'food',
    nameRu: 'Еда и рестораны',
    nameTk: 'Nahar we restoran',
    nameZh: '食物和餐厅',
    icon: '🍜',
    color: '#FF9F43',
    imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop'
  },
  {
    id: 'shopping',
    nameRu: 'Покупки и торговля',
    nameTk: 'Satyn almak we söwda',
    nameZh: '购物和贸易',
    icon: '🛒',
    color: '#10AC84',
    imageUrl: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=400&h=300&fit=crop'
  },
  {
    id: 'transport',
    nameRu: 'Транспорт',
    nameTk: 'Transport',
    nameZh: '交通',
    icon: '🚗',
    color: '#3742FA',
    imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&h=300&fit=crop'
  },
  {
    id: 'directions',
    nameRu: 'Направления и ориентация',
    nameTk: 'Ugurlar we gidişlik',
    nameZh: '方向和导航',
    icon: '🗺️',
    color: '#2ED573',
    imageUrl: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=300&fit=crop'
  },
  {
    id: 'money',
    nameRu: 'Деньги и оплата',
    nameTk: 'Pul we töleg',
    nameZh: '金钱和付款',
    icon: '💰',
    color: '#FFA502',
    imageUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop'
  },
  {
    id: 'health',
    nameRu: 'Здоровье и медицина',
    nameTk: 'Saglyq we lukmançylyk',
    nameZh: '健康和医疗',
    icon: '🏥',
    color: '#FF3838',
    imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop'
  },
  {
    id: 'communication',
    nameRu: 'Связь и интернет',
    nameTk: 'Aragatnaşyk we internet',
    nameZh: '通讯和网络',
    icon: '📱',
    color: '#747D8C',
    imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop'
  },
  {
    id: 'entertainment',
    nameRu: 'Развлечения и культура',
    nameTk: 'Dynç alyş we medeniýet',
    nameZh: '娱乐和文化',
    icon: '🎭',
    color: '#A55EEA',
    imageUrl: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=400&h=300&fit=crop'
  },
  {
    id: 'time',
    nameRu: 'Время и числа',
    nameTk: 'Wagt we sanlar',
    nameZh: '时间和数字',
    icon: '⏰',
    color: '#26C0CE',
    imageUrl: 'https://images.unsplash.com/photo-1495364141860-b0d03eccd065?w=400&h=300&fit=crop'
  },
  {
    id: 'family',
    nameRu: 'Семья и друзья',
    nameTk: 'Maşgala we dostlar',
    nameZh: '家庭和朋友',
    icon: '👨‍👩‍👧‍👦',
    color: '#FC427B',
    imageUrl: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=400&h=300&fit=crop'
  },
  {
    id: 'work',
    nameRu: 'Работа и учеба',
    nameTk: 'Iş we okuw',
    nameZh: '工作和学习',
    icon: '💼',
    color: '#6C5CE7',
    imageUrl: 'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=400&h=300&fit=crop'
  }
];