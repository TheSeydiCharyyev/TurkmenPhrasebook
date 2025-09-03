// src/components/LoadingStates.tsx - новый файл

import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { Colors } from '../constants/Colors';

interface LoadingSpinnerProps {
  size?: 'small' | 'large';
  color?: string;
  message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'large', 
  color = Colors.primary,
  message 
}) => (
  <View style={styles.spinnerContainer}>
    <ActivityIndicator size={size} color={color} />
    {message && <Text style={styles.loadingMessage}>{message}</Text>}
  </View>
);

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  marginBottom?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({ 
  width = '100%', 
  height = 20, 
  borderRadius = 4,
  marginBottom = 8 
}) => (
  <View 
    style={[
      styles.skeleton, 
      { 
        width: width as any, // Type assertion для совместимости с DimensionValue
        height, 
        borderRadius, 
        marginBottom 
      }
    ]} 
  />
);

// Скелетон для карточки фразы
export const PhraseCardSkeleton: React.FC = () => (
  <View style={styles.phraseCardSkeleton}>
    <View style={styles.skeletonContent}>
      <Skeleton width="60%" height={24} marginBottom={8} />
      <Skeleton width="40%" height={16} marginBottom={8} />
      <Skeleton width="80%" height={18} marginBottom={6} />
      <Skeleton width="50%" height={14} marginBottom={0} />
    </View>
    <View style={styles.skeletonActions}>
      <Skeleton width={28} height={28} borderRadius={14} marginBottom={8} />
      <Skeleton width={28} height={28} borderRadius={14} marginBottom={8} />
      <Skeleton width={24} height={24} borderRadius={12} marginBottom={0} />
    </View>
  </View>
);

// Скелетон для списка категорий
export const CategoryGridSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => (
  <View style={styles.categoryGridSkeleton}>
    {Array.from({ length: count }).map((_, index) => (
      <View key={index} style={styles.categoryItemSkeleton}>
        <Skeleton width={48} height={48} borderRadius={24} marginBottom={8} />
        <Skeleton width="80%" height={14} marginBottom={4} />
        <Skeleton width="60%" height={12} marginBottom={0} />
      </View>
    ))}
  </View>
);

// Компонент загрузки с прогрессом
interface LoadingWithProgressProps {
  progress?: number; // 0-1
  message?: string;
  subMessage?: string;
}

export const LoadingWithProgress: React.FC<LoadingWithProgressProps> = ({
  progress,
  message = 'Загрузка...',
  subMessage
}) => (
  <View style={styles.progressContainer}>
    <ActivityIndicator size="large" color={Colors.primary} />
    <Text style={styles.progressMessage}>{message}</Text>
    {subMessage && <Text style={styles.progressSubMessage}>{subMessage}</Text>}
    
    {progress !== undefined && (
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBarBackground}>
          <View 
            style={[
              styles.progressBarFill, 
              { width: `${Math.max(0, Math.min(100, progress * 100))}%` }
            ]} 
          />
        </View>
        <Text style={styles.progressPercent}>{Math.round(progress * 100)}%</Text>
      </View>
    )}
  </View>
);

// Индикатор для кнопок
interface ButtonLoadingProps {
  loading?: boolean;
  children: React.ReactNode;
}

export const ButtonLoading: React.FC<ButtonLoadingProps> = ({ loading, children }) => (
  <View style={styles.buttonLoadingContainer}>
    {loading && <ActivityIndicator size="small" color={Colors.textWhite} style={styles.buttonSpinner} />}
    <View style={[styles.buttonContent, loading && styles.buttonContentLoading]}>
      {children}
    </View>
  </View>
);

// Пустое состояние с возможностью retry
interface EmptyStateProps {
  icon?: string;
  title: string;
  message: string;
  actionText?: string;
  onAction?: () => void;
  loading?: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = 'document-outline',
  title,
  message,
  actionText,
  onAction,
  loading
}) => (
  <View style={styles.emptyStateContainer}>
    <Text style={styles.emptyStateIcon}>{icon}</Text>
    <Text style={styles.emptyStateTitle}>{title}</Text>
    <Text style={styles.emptyStateMessage}>{message}</Text>
    
    {actionText && onAction && (
      <View style={styles.emptyStateAction}>
        {loading ? (
          <ActivityIndicator size="small" color={Colors.primary} />
        ) : (
          <Text style={styles.emptyStateActionText} onPress={onAction}>
            {actionText}
          </Text>
        )}
      </View>
    )}
  </View>
);

const styles = StyleSheet.create({
  spinnerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingMessage: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.textLight,
    textAlign: 'center',
  },
  
  skeleton: {
    backgroundColor: Colors.backgroundLight,
    opacity: 0.7,
  },
  
  phraseCardSkeleton: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    height: 140,
  },
  skeletonContent: {
    flex: 1,
  },
  skeletonActions: {
    alignItems: 'center',
    marginLeft: 12,
  },
  
  categoryGridSkeleton: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 20,
  },
  categoryItemSkeleton: {
    width: '30%',
    alignItems: 'center',
    marginBottom: 20,
  },
  
  progressContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  progressMessage: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginTop: 20,
    marginBottom: 8,
    textAlign: 'center',
  },
  progressSubMessage: {
    fontSize: 14,
    color: Colors.textLight,
    textAlign: 'center',
    marginBottom: 30,
  },
  progressBarContainer: {
    width: '100%',
    alignItems: 'center',
  },
  progressBarBackground: {
    width: '100%',
    height: 6,
    backgroundColor: Colors.backgroundLight,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 3,
  },
  progressPercent: {
    fontSize: 12,
    color: Colors.textLight,
    fontWeight: '500',
  },
  
  buttonLoadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonSpinner: {
    marginRight: 8,
  },
  buttonContent: {
    opacity: 1,
  },
  buttonContentLoading: {
    opacity: 0.7,
  },
  
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyStateIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyStateMessage: {
    fontSize: 16,
    color: Colors.textLight,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  emptyStateAction: {
    minHeight: 20,
    justifyContent: 'center',
  },
  emptyStateActionText: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});

// src/hooks/useAsyncOperation.ts - новый файл

import { useState, useCallback } from 'react';
import { useErrorHandler } from '../hooks/useErrorHandler';

interface AsyncOperationState {
  loading: boolean;
  error: string | null;
  data: any;
}

export function useAsyncOperation<T = any>() {
  const [state, setState] = useState<AsyncOperationState>({
    loading: false,
    error: null,
    data: null,
  });
  
  const { handleError } = useErrorHandler();

  const execute = useCallback(async (
    operation: () => Promise<T>,
    options?: {
      onSuccess?: (data: T) => void;
      onError?: (error: Error) => void;
      loadingMessage?: string;
    }
  ) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const result = await operation();
      
      setState({
        loading: false,
        error: null,
        data: result,
      });

      if (options?.onSuccess) {
        options.onSuccess(result);
      }

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      setState({
        loading: false,
        error: errorMessage,
        data: null,
      });

      handleError(error, 'async operation');
      
      if (options?.onError) {
        options.onError(error as Error);
      }

      throw error;
    }
  }, [handleError]);

  const reset = useCallback(() => {
    setState({
      loading: false,
      error: null,
      data: null,
    });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}