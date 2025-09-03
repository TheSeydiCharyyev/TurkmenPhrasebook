// src/hooks/useOffline.ts - Расширенная версия для дня 17
import { useState, useEffect, useCallback, useRef } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { Alert } from 'react-native';
import { phrases } from '../data/phrases';
import { categories } from '../data/categories';
import { SafeStorage } from '../utils/SafeStorage';
import { useErrorHandler } from './useErrorHandler';
import { useAnimations } from './useAnimations';

const OFFLINE_DATA_KEY = 'chinese_phrasebook_offline_data_v2';
const SYNC_QUEUE_KEY = 'chinese_phrasebook_sync_queue';
const LAST_SYNC_KEY = 'chinese_phrasebook_last_sync';
const CACHE_VERSION = '2.0';
const SYNC_INTERVAL = 5 * 60 * 1000; // 5 минут

interface OfflineData {
  phrases: typeof phrases;
  categories: typeof categories;
  version: string;
  cachedAt: number;
  lastUpdated: number;
  checksum: string;
}

interface SyncQueueItem {
  id: string;
  type: 'favorite' | 'history' | 'settings';
  action: 'create' | 'update' | 'delete';
  data: any;
  timestamp: number;
  retryCount: number;
}

interface OfflineStatus {
  isOnline: boolean;
  isDataCached: boolean;
  cacheStatus: 'initializing' | 'cached' | 'syncing' | 'error' | 'outdated';
  lastSync: number | null;
  syncProgress: number; // 0-1
  syncQueueSize: number;
  cacheSize: number; // в байтах
  networkType: string | null;
}

export function useOffline() {
  const [status, setStatus] = useState<OfflineStatus>({
    isOnline: true,
    isDataCached: false,
    cacheStatus: 'initializing',
    lastSync: null,
    syncProgress: 0,
    syncQueueSize: 0,
    cacheSize: 0,
    networkType: null,
  });

  const [syncQueue, setSyncQueue] = useState<SyncQueueItem[]>([]);
  const syncTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isInitializedRef = useRef(false);
  
  const { handleError, showErrorAlert } = useErrorHandler();
  const { hapticFeedback } = useAnimations();

  // Инициализация при первом запуске
  useEffect(() => {
    if (!isInitializedRef.current) {
      initializeOfflineSystem();
      isInitializedRef.current = true;
    }

    return () => {
      if (syncTimerRef.current) {
        clearInterval(syncTimerRef.current);
      }
    };
  }, []);

  // Мониторинг состояния сети
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      const wasOnline = status.isOnline;
      const isOnline = state.isConnected ?? false;
      
      setStatus(prev => ({
        ...prev,
        isOnline,
        networkType: state.type || null,
      }));

      // Автоматическая синхронизация при восстановлении соединения
      if (!wasOnline && isOnline && syncQueue.length > 0) {
        handleConnectionRestored();
      }
    });

    return unsubscribe;
  }, [status.isOnline, syncQueue.length]);

  // Инициализация offline системы
  const initializeOfflineSystem = async () => {
    try {
      setStatus(prev => ({ ...prev, cacheStatus: 'initializing' }));

      // Загружаем кэш и очередь синхронизации параллельно
      const [cacheResult, queueResult, lastSyncResult] = await Promise.all([
        SafeStorage.getItem<OfflineData>(OFFLINE_DATA_KEY),
        SafeStorage.getItem<SyncQueueItem[]>(SYNC_QUEUE_KEY, []),
        SafeStorage.getItem<number>(LAST_SYNC_KEY, 0),
      ]);

      if (queueResult.success && queueResult.data) {
        setSyncQueue(queueResult.data);
      }

      if (cacheResult.success && cacheResult.data) {
        const cachedData = cacheResult.data;
        const isValid = validateCacheData(cachedData);
        const isUpToDate = cachedData.version === CACHE_VERSION;
        
        if (isValid && isUpToDate) {
          setStatus(prev => ({
            ...prev,
            isDataCached: true,
            cacheStatus: 'cached',
            lastSync: lastSyncResult.data || null,
            syncQueueSize: queueResult.data?.length || 0,
            cacheSize: JSON.stringify(cachedData).length,
          }));
          
          // Запускаем периодическую синхронизацию
          startSyncTimer();
          return;
        }
      }

      // Создаем новый кэш
      await createInitialCache();
      
    } catch (error) {
      handleError(error, 'offline system initialization');
      setStatus(prev => ({ ...prev, cacheStatus: 'error' }));
    }
  };

  // Создание начального кэша
  const createInitialCache = async () => {
    try {
      setStatus(prev => ({ ...prev, cacheStatus: 'syncing', syncProgress: 0.1 }));

      const checksum = generateChecksum(phrases, categories);
      const offlineData: OfflineData = {
        phrases,
        categories,
        version: CACHE_VERSION,
        cachedAt: Date.now(),
        lastUpdated: Date.now(),
        checksum,
      };

      setStatus(prev => ({ ...prev, syncProgress: 0.5 }));

      const result = await SafeStorage.setItem(OFFLINE_DATA_KEY, offlineData);
      
      if (result.success) {
        setStatus(prev => ({
          ...prev,
          isDataCached: true,
          cacheStatus: 'cached',
          syncProgress: 1,
          cacheSize: JSON.stringify(offlineData).length,
        }));

        // Сохраняем время последней синхронизации
        await SafeStorage.setItem(LAST_SYNC_KEY, Date.now());
        
        startSyncTimer();
      } else {
        throw new Error(result.error);
      }
      
    } catch (error) {
      handleError(error, 'cache creation');
      setStatus(prev => ({ ...prev, cacheStatus: 'error', syncProgress: 0 }));
    }
  };

  // Валидация кэшированных данных
  const validateCacheData = (data: OfflineData): boolean => {
    return !!(
      data &&
      data.phrases &&
      data.categories &&
      data.version &&
      data.cachedAt &&
      Array.isArray(data.phrases) &&
      Array.isArray(data.categories) &&
      data.phrases.length > 0 &&
      data.categories.length > 0
    );
  };

  // Генерация контрольной суммы для данных
  const generateChecksum = (phrasesData: any[], categoriesData: any[]): string => {
    const combined = JSON.stringify({ phrasesData, categoriesData });
    let hash = 0;
    for (let i = 0; i < combined.length; i++) {
      const char = combined.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Конвертируем в 32-битное целое
    }
    return hash.toString(36);
  };

  // Добавление операции в очередь синхронизации
  const addToSyncQueue = useCallback(async (item: Omit<SyncQueueItem, 'id' | 'timestamp' | 'retryCount'>) => {
    try {
      const queueItem: SyncQueueItem = {
        ...item,
        id: `sync_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: Date.now(),
        retryCount: 0,
      };

      const newQueue = [...syncQueue, queueItem];
      setSyncQueue(newQueue);
      
      await SafeStorage.setItem(SYNC_QUEUE_KEY, newQueue);
      
      setStatus(prev => ({ ...prev, syncQueueSize: newQueue.length }));

      // Попытка немедленной синхронизации если онлайн
      if (status.isOnline) {
        await processSyncQueue();
      }
      
    } catch (error) {
      handleError(error, 'adding to sync queue');
    }
  }, [syncQueue, status.isOnline]);

  // Обработка очереди синхронизации
  const processSyncQueue = useCallback(async () => {
    if (!status.isOnline || syncQueue.length === 0) return;

    try {
      setStatus(prev => ({ ...prev, cacheStatus: 'syncing', syncProgress: 0 }));

      const processedItems: string[] = [];
      const failedItems: SyncQueueItem[] = [];

      for (let i = 0; i < syncQueue.length; i++) {
        const item = syncQueue[i];
        
        setStatus(prev => ({ 
          ...prev, 
          syncProgress: (i + 1) / syncQueue.length 
        }));

        try {
          // Симулируем синхронизацию (в реальном приложении здесь был бы API вызов)
          await new Promise(resolve => setTimeout(resolve, 100));
          
          processedItems.push(item.id);
          
        } catch (error) {
          console.warn(`Sync failed for item ${item.id}:`, error);
          
          if (item.retryCount < 3) {
            failedItems.push({
              ...item,
              retryCount: item.retryCount + 1,
            });
          } else {
            handleError(error, `sync item ${item.type}`);
          }
        }
      }

      // Обновляем очередь, убирая обработанные элементы
      const remainingQueue = failedItems;
      setSyncQueue(remainingQueue);
      await SafeStorage.setItem(SYNC_QUEUE_KEY, remainingQueue);

      // Обновляем время последней синхронизации
      const now = Date.now();
      await SafeStorage.setItem(LAST_SYNC_KEY, now);
      
      setStatus(prev => ({
        ...prev,
        cacheStatus: 'cached',
        syncProgress: 1,
        lastSync: now,
        syncQueueSize: remainingQueue.length,
      }));

      // Уведомляем о завершении синхронизации
      if (processedItems.length > 0) {
        hapticFeedback('success');
      }

    } catch (error) {
      handleError(error, 'sync queue processing');
      setStatus(prev => ({ ...prev, cacheStatus: 'error', syncProgress: 0 }));
    }
  }, [status.isOnline, syncQueue, hapticFeedback, handleError]);

  // Обработка восстановления соединения
  const handleConnectionRestored = useCallback(async () => {
    hapticFeedback('success');
    
    // Небольшая задержка для стабилизации соединения
    setTimeout(() => {
      processSyncQueue();
    }, 1000);
  }, [processSyncQueue, hapticFeedback]);

  // Запуск таймера синхронизации
  const startSyncTimer = useCallback(() => {
    if (syncTimerRef.current) {
      clearInterval(syncTimerRef.current);
    }

    syncTimerRef.current = setInterval(() => {
      if (status.isOnline && syncQueue.length > 0) {
        processSyncQueue();
      }
    }, SYNC_INTERVAL);
  }, [status.isOnline, syncQueue.length, processSyncQueue]);

  // Принудительное обновление кэша
  const refreshCache = useCallback(async (force: boolean = false) => {
    try {
      if (!status.isOnline && !force) {
        showErrorAlert(
          'Нет соединения',
          'Для обновления кэша требуется подключение к интернету'
        );
        return false;
      }

      setStatus(prev => ({ ...prev, cacheStatus: 'syncing', syncProgress: 0 }));
      
      await createInitialCache();
      return true;
      
    } catch (error) {
      handleError(error, 'cache refresh');
      setStatus(prev => ({ ...prev, cacheStatus: 'error' }));
      return false;
    }
  }, [status.isOnline, showErrorAlert, createInitialCache, handleError]);

  // Получение кэшированных данных с fallback
  const getCachedData = useCallback(async (): Promise<{
    phrases: typeof phrases;
    categories: typeof categories;
    fromCache: boolean;
  }> => {
    try {
      const result = await SafeStorage.getItem<OfflineData>(OFFLINE_DATA_KEY);
      
      if (result.success && result.data && validateCacheData(result.data)) {
        return {
          phrases: result.data.phrases,
          categories: result.data.categories,
          fromCache: true,
        };
      }
    } catch (error) {
      handleError(error, 'getting cached data');
    }

    // Fallback к встроенным данным
    return {
      phrases,
      categories,
      fromCache: false,
    };
  }, [handleError]);

  // Очистка кэша и очереди
  const clearCache = useCallback(async () => {
    try {
      await Promise.all([
        SafeStorage.removeItem(OFFLINE_DATA_KEY),
        SafeStorage.removeItem(SYNC_QUEUE_KEY),
        SafeStorage.removeItem(LAST_SYNC_KEY),
      ]);

      setSyncQueue([]);
      setStatus(prev => ({
        ...prev,
        isDataCached: false,
        cacheStatus: 'initializing',
        lastSync: null,
        syncQueueSize: 0,
        cacheSize: 0,
      }));

      await createInitialCache();
      
    } catch (error) {
      handleError(error, 'cache clearing');
    }
  }, [handleError, createInitialCache]);

  // Получение информации о кэше
  const getCacheInfo = useCallback(async () => {
    try {
      const result = await SafeStorage.getItem<OfflineData>(OFFLINE_DATA_KEY);
      
      if (result.success && result.data) {
        return {
          version: result.data.version,
          cachedAt: new Date(result.data.cachedAt),
          lastUpdated: new Date(result.data.lastUpdated),
          phrasesCount: result.data.phrases.length,
          categoriesCount: result.data.categories.length,
          checksum: result.data.checksum,
          sizeBytes: JSON.stringify(result.data).length,
        };
      }
    } catch (error) {
      handleError(error, 'getting cache info');
    }
    
    return null;
  }, [handleError]);

  // Принудительная синхронизация
  const forcSync = useCallback(async () => {
    if (!status.isOnline) {
      showErrorAlert(
        'Нет соединения',
        'Синхронизация требует подключения к интернету'
      );
      return false;
    }

    try {
      await processSyncQueue();
      hapticFeedback('success');
      return true;
    } catch (error) {
      handleError(error, 'forced sync');
      return false;
    }
  }, [status.isOnline, processSyncQueue, showErrorAlert, hapticFeedback, handleError]);

  // Проверка необходимости обновления кэша
  const checkCacheHealth = useCallback(async () => {
    try {
      const cacheInfo = await getCacheInfo();
      if (!cacheInfo) return false;

      const daysSinceCache = (Date.now() - cacheInfo.cachedAt.getTime()) / (1000 * 60 * 60 * 24);
      const isOutdated = daysSinceCache > 7; // Кэш старше недели

      if (isOutdated) {
        setStatus(prev => ({ ...prev, cacheStatus: 'outdated' }));
        return false;
      }

      return true;
    } catch (error) {
      handleError(error, 'cache health check');
      return false;
    }
  }, [getCacheInfo, handleError]);

  // Получение статистики offline использования
  const getOfflineStats = useCallback(async () => {
    const cacheInfo = await getCacheInfo();
    const storageInfo = await SafeStorage.getStorageInfo();
    
    return {
      cacheInfo,
      storageInfo,
      syncQueueSize: syncQueue.length,
      isHealthy: await checkCacheHealth(),
      networkStatus: {
        isOnline: status.isOnline,
        type: status.networkType,
        lastSync: status.lastSync ? new Date(status.lastSync) : null,
      },
    };
  }, [getCacheInfo, syncQueue.length, checkCacheHealth, status]);

  // Экспорт данных для бэкапа
  const exportUserData = useCallback(async () => {
    try {
      const [favoritesResult, historyResult, settingsResult] = await Promise.all([
        SafeStorage.getItem('chinese_phrasebook_favorites', []),
        SafeStorage.getItem('chinese_phrasebook_history_v2', []),
        SafeStorage.getItem('chinese_phrasebook_app_language', {}),
      ]);

      return {
        favorites: favoritesResult.data,
        history: historyResult.data,
        settings: settingsResult.data,
        exportedAt: Date.now(),
        version: CACHE_VERSION,
      };
    } catch (error) {
      handleError(error, 'data export');
      return null;
    }
  }, [handleError]);

  // Импорт данных из бэкапа
  const importUserData = useCallback(async (backupData: any) => {
    try {
      if (!backupData || !backupData.version) {
        throw new Error('Invalid backup data');
      }

      setStatus(prev => ({ ...prev, cacheStatus: 'syncing', syncProgress: 0 }));

      const operations = [];
      if (backupData.favorites) {
        operations.push(['chinese_phrasebook_favorites', backupData.favorites]);
      }
      if (backupData.history) {
        operations.push(['chinese_phrasebook_history_v2', backupData.history]);
      }
      if (backupData.settings) {
        operations.push(['chinese_phrasebook_app_language', backupData.settings]);
      }

      setStatus(prev => ({ ...prev, syncProgress: 0.5 }));

      const result = await SafeStorage.multiSet(operations);
      
      if (result.success) {
        setStatus(prev => ({ ...prev, syncProgress: 1, cacheStatus: 'cached' }));
        hapticFeedback('success');
        return true;
      } else {
        throw new Error(result.error);
      }
      
    } catch (error) {
      handleError(error, 'data import');
      setStatus(prev => ({ ...prev, cacheStatus: 'error', syncProgress: 0 }));
      return false;
    }
  }, [handleError, hapticFeedback]);

  return {
    // Основное состояние
    ...status,
    syncQueue,

    // Основные функции
    getCachedData,
    addToSyncQueue,
    refreshCache,
    clearCache,
    forcSync,

    // Информация и диагностика
    getCacheInfo,
    getOfflineStats,
    checkCacheHealth,

    // Бэкап и восстановление
    exportUserData,
    importUserData,

    // Утилиты
    isOnline: status.isOnline,
    isDataCached: status.isDataCached,
    cacheStatus: status.cacheStatus,
  };
}