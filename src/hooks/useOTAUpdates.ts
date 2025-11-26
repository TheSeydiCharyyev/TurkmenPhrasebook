// src/hooks/useOTAUpdates.ts
// Hook для проверки и применения OTA обновлений (Phase 5)
import { useState, useEffect, useCallback } from 'react';
import { TranslationVersioningService } from '../services/TranslationVersioning';

// Динамический импорт expo-updates (optional dependency)
let Updates: any = null;
try {
  Updates = require('expo-updates');
} catch (e) {
  console.warn('[OTA] expo-updates not installed, OTA updates will be disabled');
}

interface OTAUpdateStatus {
  isChecking: boolean;
  isUpdateAvailable: boolean;
  isDownloading: boolean;
  downloadProgress: number;
  error: string | null;
  lastCheckedAt: number | null;
  currentVersion: string;
  availableVersion: string | null;
}

/**
 * Hook для управления OTA обновлениями
 */
export const useOTAUpdates = () => {
  const [status, setStatus] = useState<OTAUpdateStatus>({
    isChecking: false,
    isUpdateAvailable: false,
    isDownloading: false,
    downloadProgress: 0,
    error: null,
    lastCheckedAt: null,
    currentVersion: TranslationVersioningService.getAppTranslationsVersion(),
    availableVersion: null,
  });

  /**
   * Проверить наличие обновлений
   */
  const checkForUpdate = useCallback(async () => {
    // Проверяем наличие expo-updates
    if (!Updates) {
      return false;
    }

    // Проверяем только в production билдах
    if (__DEV__) {
      return false;
    }

    try {
      setStatus(prev => ({ ...prev, isChecking: true, error: null }));

      const update = await Updates.checkForUpdateAsync();

      setStatus(prev => ({
        ...prev,
        isChecking: false,
        isUpdateAvailable: update.isAvailable,
        lastCheckedAt: Date.now(),
        availableVersion: update.isAvailable ? 'new' : null,
      }));

      // Update status set in state

      return update.isAvailable;
    } catch (error) {
      console.error('[OTA] Error checking for updates:', error);
      setStatus(prev => ({
        ...prev,
        isChecking: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }));
      return false;
    }
  }, []);

  /**
   * Загрузить и применить обновление
   */
  const downloadAndApplyUpdate = useCallback(async () => {
    if (!Updates) {
      return false;
    }

    if (__DEV__) {
      return false;
    }

    try {
      setStatus(prev => ({ ...prev, isDownloading: true, error: null }));

      // Загружаем обновление
      const result = await Updates.fetchUpdateAsync();

      if (result.isNew) {
        // Перезагружаем приложение с новым обновлением
        await Updates.reloadAsync();
        return true;
      } else {
        setStatus(prev => ({ ...prev, isDownloading: false }));
        return false;
      }
    } catch (error) {
      console.error('[OTA] Error downloading update:', error);
      setStatus(prev => ({
        ...prev,
        isDownloading: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }));
      return false;
    }
  }, []);

  /**
   * Автоматическая проверка при запуске
   */
  useEffect(() => {
    if (!__DEV__ && Updates) {
      checkForUpdate();
    }
  }, [checkForUpdate]);

  return {
    status,
    checkForUpdate,
    downloadAndApplyUpdate,
    canUpdate: !__DEV__ && Updates !== null,
  };
};
