// src/hooks/useOfflineDataManager.ts - День 17: Улучшенный менеджер офлайн данных
import { useState, useEffect, useCallback, useRef } from 'react';
import { AppState, Alert, AppStateStatus } from 'react-native';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import { SafeStorage } from '../utils/SafeStorage';
import { useErrorHandler } from './useErrorHandler';
import { useAnimations } from './useAnimations';
import { phrases } from '../data/phrases';
import { categories } from '../data/categories';

// Ключи хранения
const CACHE_KEYS = {
  OFFLINE_DATA: 'chinese_phrasebook_offline_data_v3',
  SYNC_QUEUE: 'chinese_phrasebook_sync_queue_v3',
  LAST_SYNC: 'chinese_phrasebook_last_sync_v3',
  NETWORK_HISTORY: 'chinese_phrasebook_network_history',
  USER_PREFERENCES: 'chinese_phrasebook_offline_preferences',
} as const;

const CACHE_VERSION = '3.0.0';
const SYNC_RETRY_DELAYS = [1000, 5000, 15000, 60000]; // Экспоненциальная задержка
const MAX_NETWORK_HISTORY = 50;

interface NetworkState {
  isConnected: boolean;
  type: string | null;
  timestamp: number;
  quality: 'excellent' | 'good' | 'fair' | 'poor' | 'unknown';
}

interface OfflinePreferences {
  autoSync: boolean;
  syncOnlyOnWifi: boolean;
  maxCacheSize: number; // MB
  keepHistoryDays: number;
  enableBackgroundSync: boolean;
}

interface SyncQueueItem {
  id: string;
  type: 'favorite' | 'history' | 'settings' | 'user_data';
  action: 'create' | 'update' | 'delete' | 'bulk_update';
  data: any;
  timestamp: number;
  retryCount: number;
  priority: 'high' | 'medium' | 'low';
  requiresNetwork: boolean;
  estimatedSize: number; // bytes
}

interface CacheStats {
  totalSize: number;
  itemCount: number;
  lastUpdated: number;
  hitRate: number; // 0-1
  missCount: number;
  hitCount: number;
}

interface OfflineDataManagerState {
  isOnline: boolean;
  networkQuality: NetworkState['quality'];
  isSyncing: boolean;
  syncProgress: number; // 0-1
  cacheStats: CacheStats;
  queueSize: number;
  lastSync: number | null;
  dataFreshness: 'fresh' | 'stale' | 'expired' | 'unknown';
  preferences: OfflinePreferences;
  networkHistory: NetworkState[];
}

const defaultPreferences: OfflinePreferences = {
  autoSync: true,
  syncOnlyOnWifi: false,
  maxCacheSize: 50, // 50MB
  keepHistoryDays: 30,
  enableBackgroundSync: true,
};

export function useOfflineDataManager() {
  const [state, setState] = useState<OfflineDataManagerState>({
    isOnline: true,
    networkQuality: 'unknown',
    isSyncing: false,
    syncProgress: 0,
    cacheStats: {
      totalSize: 0,
      itemCount: 0,
      lastUpdated: 0,
      hitRate: 0,
      missCount: 0,
      hitCount: 0,
    },
    queueSize: 0,
    lastSync: null,
    dataFreshness: 'unknown',
    preferences: defaultPreferences,
    networkHistory: [],
  });

  const [syncQueue, setSyncQueue] = useState<SyncQueueItem[]>([]);
  const syncIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isInitializedRef = useRef(false);
  const networkUnsubscribeRef = useRef<(() => void) | null>(null);

  const { handleError, showErrorAlert } = useErrorHandler();
  const { hapticFeedback } = useAnimations();

  // Инициализация при первом запуске
  useEffect(() => {
    if (!isInitializedRef.current) {
      initializeOfflineManager();
      isInitializedRef.current = true;
    }

    return () => {
      cleanup();
    };
  }, []);

  // Мониторинг состояния приложения для background sync
  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active' && state.preferences.enableBackgroundSync) {
        // Приложение вернулось в активное состояние
        checkNetworkAndSync();
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription?.remove();
  }, [state.preferences.enableBackgroundSync]);

  const cleanup = () => {
    if (syncIntervalRef.current) {
      clearInterval(syncIntervalRef.current);
    }
    if (networkUnsubscribeRef.current) {
      networkUnsubscribeRef.current();
    }
  };

  const initializeOfflineManager = async () => {
    try {
      // Загружаем настройки пользователя
      const prefsResult = await SafeStorage.getItem<OfflinePreferences>(
        CACHE_KEYS.USER_PREFERENCES,
        defaultPreferences
      );

      if (prefsResult.success && prefsResult.data) {
        setState(prev => ({ 
          ...prev, 
          preferences: { ...defaultPreferences, ...prefsResult.data }
        }));
      }

      // Загружаем историю сети
      const networkHistoryResult = await SafeStorage.getItem<NetworkState[]>(
        CACHE_KEYS.NETWORK_HISTORY,
        []
      );

      if (networkHistoryResult.success && networkHistoryResult.data) {
        setState(prev => ({ 
          ...prev, 
          networkHistory: networkHistoryResult.data.slice(-MAX_NETWORK_HISTORY)
        }));
      }

      // Загружаем очередь синхронизации
      const queueResult = await SafeStorage.getItem<SyncQueueItem[]>(
        CACHE_KEYS.SYNC_QUEUE,
        []
      );

      if (queueResult.success && queueResult.data) {
        setSyncQueue(queueResult.data);
        setState(prev => ({ ...prev, queueSize: queueResult.data.length }));
      }

      // Загружаем время последней синхронизации
      const lastSyncResult = await SafeStorage.getItem<number>(
        CACHE_KEYS.LAST_SYNC,
        0
      );

      if (lastSyncResult.success && lastSyncResult.data) {
        setState(prev => ({ 
          ...prev, 
          lastSync: lastSyncResult.data,
          dataFreshness: getDataFreshness(lastSyncResult.data)
        }));
      }

      // Обновляем статистику кэша
      await updateCacheStats();

      // Начинаем мониторинг сети
      startNetworkMonitoring();

      // Запускаем автосинхронизацию
      if (prefsResult.data?.autoSync !== false) {
        startAutoSync();
      }

    } catch (error) {
      handleError(error, 'offline manager initialization');
    }
  };

  const startNetworkMonitoring = () => {
    networkUnsubscribeRef.current = NetInfo.addEventListener((state: NetInfoState) => {
      const isConnected = state.isConnected ?? false;
      const networkType = state.type || null;
      const quality = assessNetworkQuality(state);

      const networkState: NetworkState = {
        isConnected,
        type: networkType,
        timestamp: Date.now(),
        quality,
      };

      setState(prev => ({
        ...prev,
        isOnline: isConnected,
        networkQuality: quality,
        networkHistory: [...prev.networkHistory, networkState].slice(-MAX_NETWORK_HISTORY),
      }));

      // Сохраняем историю сети
      SafeStorage.setItem(CACHE_KEYS.NETWORK_HISTORY, 
        [...state.networkHistory, networkState].slice(-MAX_NETWORK_HISTORY)
      );

      // Автосинхронизация при восстановлении соединения
      if (isConnected && state.preferences.autoSync) {
        const shouldSyncOnWifi = state.preferences.syncOnlyOnWifi;
        const isWifi = networkType === 'wifi';
        
        if (!shouldSyncOnWifi || isWifi) {
          setTimeout(() => processSyncQueue(), 1000);
        }
      }
    });
  };

  const assessNetworkQuality = (netState: NetInfoState): NetworkState['quality'] => {
    if (!netState.isConnected) return 'poor';
    
    // Для WiFi
    if (netState.type === 'wifi') {
      const details = netState.details as any;
      if (details?.strength !== undefined) {
        if (details.strength > 80) return 'excellent';
        if (details.strength > 60) return 'good';
        if (details.strength > 40) return 'fair';
        return 'poor';
      }
      return 'good'; // WiFi обычно хорошее
    }

    // Для мобильной сети
    if (netState.type === 'cellular') {
      const details = netState.details as any;
      if (details?.cellularGeneration === '5g') return 'excellent';
      if (details?.cellularGeneration === '4g') return 'good';
      if (details?.cellularGeneration === '3g') return 'fair';
      return 'poor';
    }

    return 'unknown';
  };

  const getDataFreshness = (lastSyncTime: number): OfflineDataManagerState['dataFreshness'] => {
    if (!lastSyncTime) return 'unknown';
    
    const now = Date.now();
    const hoursSinceSync = (now - lastSyncTime) / (1000 * 60 * 60);
    
    if (hoursSinceSync < 1) return 'fresh';
    if (hoursSinceSync < 24) return 'stale';
    return 'expired';
  };

  const updateCacheStats = async () => {
    try {
      const cacheResult = await SafeStorage.getItem(CACHE_KEYS.OFFLINE_DATA);
      const storageInfo = await SafeStorage.getStorageInfo();
      
      const totalSize = storageInfo.estimatedSize;
      const itemCount = storageInfo.keysCount;
      
      // Простая статистика hit rate (можно улучшить в будущем)
      const existingStats = state.cacheStats;
      const hitRate = existingStats.hitCount / (existingStats.hitCount + existingStats.missCount) || 0;

      setState(prev => ({
        ...prev,
        cacheStats: {
          totalSize,
          itemCount,
          lastUpdated: Date.now(),
          hitRate,
          missCount: existingStats.missCount,
          hitCount: existingStats.hitCount,
        }
      }));
    } catch (error) {
      handleError(error, 'cache stats update');
    }
  };

  const addToSyncQueue = useCallback(async (
    type: SyncQueueItem['type'],
    action: SyncQueueItem['action'],
    data: any,
    priority: SyncQueueItem['priority'] = 'medium',
    requiresNetwork: boolean = true
  ) => {
    try {
      const item: SyncQueueItem = {
        id: `sync_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type,
        action,
        data,
        timestamp: Date.now(),
        retryCount: 0,
        priority,
        requiresNetwork,
        estimatedSize: JSON.stringify(data).length,
      };

      const newQueue = [...syncQueue, item].sort((a, b) => {
        // Сортируем по приоритету
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      });

      setSyncQueue(newQueue);
      await SafeStorage.setItem(CACHE_KEYS.SYNC_QUEUE, newQueue);
      
      setState(prev => ({ ...prev, queueSize: newQueue.length }));

      // Попытка немедленной синхронизации для высокоприоритетных элементов
      if (priority === 'high' && state.isOnline) {
        processSyncQueue();
      }

    } catch (error) {
      handleError(error, 'adding to sync queue');
    }
  }, [syncQueue, state.isOnline]);

  const processSyncQueue = useCallback(async () => {
    if (state.isSyncing || syncQueue.length === 0) return;

    // Проверяем сетевые требования
    if (state.preferences.syncOnlyOnWifi && state.networkQuality !== 'excellent' && state.networkQuality !== 'good') {
      return;
    }

    try {
      setState(prev => ({ ...prev, isSyncing: true, syncProgress: 0 }));

      const processedItems: string[] = [];
      const failedItems: SyncQueueItem[] = [];

      for (let i = 0; i < syncQueue.length; i++) {
        const item = syncQueue[i];
        
        setState(prev => ({ 
          ...prev, 
          syncProgress: (i + 1) / syncQueue.length 
        }));

        try {
          // Проверяем требования к сети
          if (item.requiresNetwork && !state.isOnline) {
            failedItems.push(item);
            continue;
          }

          // Симулируем синхронизацию (в реальном приложении - API вызовы)
          await simulateSyncOperation(item);
          
          processedItems.push(item.id);
          
          // Обновляем статистику кэша
          setState(prev => ({
            ...prev,
            cacheStats: {
              ...prev.cacheStats,
              hitCount: prev.cacheStats.hitCount + 1,
            }
          }));

        } catch (error) {
          console.warn(`Sync failed for item ${item.id}:`, error);
          
          if (item.retryCount < SYNC_RETRY_DELAYS.length - 1) {
            failedItems.push({
              ...item,
              retryCount: item.retryCount + 1,
            });
          } else {
            handleError(error, `sync item ${item.type} after ${item.retryCount} retries`);
            
            // Обновляем статистику промахов
            setState(prev => ({
              ...prev,
              cacheStats: {
                ...prev.cacheStats,
                missCount: prev.cacheStats.missCount + 1,
              }
            }));
          }
        }

        // Небольшая задержка между операциями
        await new Promise(resolve => setTimeout(resolve, 50));
      }

      // Обновляем очередь
      setSyncQueue(failedItems);
      await SafeStorage.setItem(CACHE_KEYS.SYNC_QUEUE, failedItems);

      // Обновляем время последней синхронизации
      const now = Date.now();
      await SafeStorage.setItem(CACHE_KEYS.LAST_SYNC, now);
      
      setState(prev => ({
        ...prev,
        lastSync: now,
        dataFreshness: 'fresh',
        queueSize: failedItems.length,
        isSyncing: false,
        syncProgress: 1,
      }));

      // Haptic feedback при успешной синхронизации
      if (processedItems.length > 0) {
        hapticFeedback('success');
      }

      // Планируем retry для неудачных элементов
      if (failedItems.length > 0) {
        const maxRetryCount = Math.max(...failedItems.map(item => item.retryCount));
        const delay = SYNC_RETRY_DELAYS[maxRetryCount] || SYNC_RETRY_DELAYS[SYNC_RETRY_DELAYS.length - 1];
        
        setTimeout(() => {
          if (state.isOnline) processSyncQueue();
        }, delay);
      }

    } catch (error) {
      handleError(error, 'sync queue processing');
      setState(prev => ({ ...prev, isSyncing: false, syncProgress: 0 }));
    }
  }, [state.isSyncing, syncQueue, state.isOnline, state.preferences, state.networkQuality, hapticFeedback, handleError]);

  const simulateSyncOperation = async (item: SyncQueueItem): Promise<void> => {
    // В реальном приложении здесь были бы API вызовы
    const delay = Math.random() * 200 + 100; // 100-300ms
    await new Promise(resolve => setTimeout(resolve, delay));
    
    // Симулируем случайные сбои (5% вероятность)
    if (Math.random() < 0.05) {
      throw new Error('Simulated network error');
    }
  };

  const checkNetworkAndSync = useCallback(async () => {
    const netState = await NetInfo.fetch();
    
    if (netState.isConnected && syncQueue.length > 0) {
      const shouldSyncOnWifi = state.preferences.syncOnlyOnWifi;
      const isWifi = netState.type === 'wifi';
      
      if (!shouldSyncOnWifi || isWifi) {
        processSyncQueue();
      }
    }
  }, [syncQueue.length, state.preferences.syncOnlyOnWifi, processSyncQueue]);

  const startAutoSync = () => {
    if (syncIntervalRef.current) {
      clearInterval(syncIntervalRef.current);
    }

    // Автосинхронизация каждые 5 минут
    syncIntervalRef.current = setInterval(() => {
      if (state.preferences.autoSync && state.isOnline) {
        processSyncQueue();
      }
    }, 5 * 60 * 1000);
  };

  const updatePreferences = useCallback(async (newPreferences: Partial<OfflinePreferences>) => {
    const updatedPreferences = { ...state.preferences, ...newPreferences };
    
    setState(prev => ({ ...prev, preferences: updatedPreferences }));
    await SafeStorage.setItem(CACHE_KEYS.USER_PREFERENCES, updatedPreferences);
    
    // Перезапускаем автосинхронизацию с новыми настройками
    if (updatedPreferences.autoSync !== state.preferences.autoSync) {
      if (updatedPreferences.autoSync) {
        startAutoSync();
      } else if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current);
      }
    }
  }, [state.preferences]);

  const forcSync = useCallback(async (): Promise<boolean> => {
    if (!state.isOnline) {
      showErrorAlert(
        'Нет подключения', 
        'Синхронизация требует подключения к интернету'
      );
      return false;
    }

    try {
      await processSyncQueue();
      return true;
    } catch (error) {
      handleError(error, 'forced sync');
      return false;
    }
  }, [state.isOnline, processSyncQueue, showErrorAlert, handleError]);

  const clearCache = useCallback(async (): Promise<boolean> => {
    try {
      await Promise.all([
        SafeStorage.removeItem(CACHE_KEYS.OFFLINE_DATA),
        SafeStorage.removeItem(CACHE_KEYS.SYNC_QUEUE),
        SafeStorage.removeItem(CACHE_KEYS.LAST_SYNC),
      ]);

      setSyncQueue([]);
      setState(prev => ({
        ...prev,
        queueSize: 0,
        lastSync: null,
        dataFreshness: 'unknown',
        cacheStats: {
          totalSize: 0,
          itemCount: 0,
          lastUpdated: Date.now(),
          hitRate: 0,
          missCount: 0,
          hitCount: 0,
        }
      }));

      hapticFeedback('success');
      return true;
    } catch (error) {
      handleError(error, 'cache clearing');
      return false;
    }
  }, [handleError, hapticFeedback]);

  const getDetailedStats = useCallback(() => {
    const avgNetworkQuality = state.networkHistory.length > 0
      ? state.networkHistory.reduce((acc, curr) => {
          const qualityScore = { excellent: 4, good: 3, fair: 2, poor: 1, unknown: 0 };
          return acc + qualityScore[curr.quality];
        }, 0) / state.networkHistory.length
      : 0;

    return {
      ...state,
      avgNetworkQuality,
      totalSyncAttempts: state.cacheStats.hitCount + state.cacheStats.missCount,
      dataAgeHours: state.lastSync ? (Date.now() - state.lastSync) / (1000 * 60 * 60) : null,
      queuePriorityBreakdown: syncQueue.reduce((acc, item) => {
        acc[item.priority] = (acc[item.priority] || 0) + 1;
        return acc;
      }, {} as Record<SyncQueueItem['priority'], number>),
    };
  }, [state, syncQueue]);

  return {
    // Состояние
    ...state,
    syncQueue,
    
    // Основные функции
    addToSyncQueue,
    processSyncQueue,
    forcSync,
    
    // Управление кэшем
    clearCache,
    updateCacheStats,
    
    // Настройки
    updatePreferences,
    
    // Мониторинг и статистика
    getDetailedStats,
    checkNetworkAndSync,
    
    // Утилиты
    isDataFresh: state.dataFreshness === 'fresh',
    isDataStale: state.dataFreshness === 'stale',
    isDataExpired: state.dataFreshness === 'expired',
    canUseOffline: state.cacheStats.itemCount > 0,
  };
}