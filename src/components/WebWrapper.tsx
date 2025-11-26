// src/components/WebWrapper.tsx
import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';

interface WebWrapperProps {
  children: React.ReactNode;
}

export default function WebWrapper({ children }: WebWrapperProps) {
  if (Platform.OS !== 'web') {
    return <>{children}</>;
  }

  return (
    <View style={styles.webContainer}>
      <View style={styles.mobileFrame}>
        {children}
      </View>
    </View>
  );
}

// ✅ FIXED: Use type assertion for web-specific CSS properties
const styles = StyleSheet.create({
  webContainer: {
    flex: 1,
    backgroundColor: '#2c3e50',
    alignItems: 'center',
    justifyContent: 'center',
    ...(Platform.OS === 'web' && { minHeight: '100vh' as any }),
  },
  mobileFrame: {
    width: 414,
    height: 896,
    backgroundColor: '#fff',
    overflow: 'hidden',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.3,
    shadowRadius: 40,
    ...(Platform.OS === 'web' && {
      maxHeight: '100vh' as any,
      boxShadow: '0 20px 60px rgba(0,0,0,0.3)' as any,
    }),
  },
});
