import { useCallback, useState } from 'react';
import { Alert } from 'react-native';

interface ErrorState {
  hasError: boolean;
  error: string | null;
  isRetrying: boolean;
}

export function useErrorHandler() {
  const [errorState, setErrorState] = useState<ErrorState>({
    hasError: false,
    error: null,
    isRetrying: false,
  });

  const handleError = useCallback((error: any, context?: string) => {
    console.error(`Error in ${context || 'unknown context'}:`, error);
    
    const errorMessage = error?.message || 'Произошла неизвестная ошибка';
    
    setErrorState({
      hasError: true,
      error: errorMessage,
      isRetrying: false,
    });
  }, []);

  const clearError = useCallback(() => {
    setErrorState({
      hasError: false,
      error: null,
      isRetrying: false,
    });
  }, []);

  const retryOperation = useCallback(async (operation: () => Promise<void>) => {
    setErrorState(prev => ({ ...prev, isRetrying: true }));
    
    try {
      await operation();
      clearError();
    } catch (error) {
      handleError(error, 'retry operation');
    } finally {
      setErrorState(prev => ({ ...prev, isRetrying: false }));
    }
  }, [handleError, clearError]);

  const showErrorAlert = useCallback((title: string, message?: string) => {
    Alert.alert(
      title,
      message || errorState.error || 'Произошла ошибка',
      [{ text: 'OK', onPress: clearError }]
    );
  }, [errorState.error, clearError]);

  return {
    errorState,
    handleError,
    clearError,
    retryOperation,
    showErrorAlert,
  };
}