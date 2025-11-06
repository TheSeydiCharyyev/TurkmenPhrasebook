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

const styles = StyleSheet.create({
  webContainer: {
    flex: 1,
    backgroundColor: '#2c3e50',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
  },
  mobileFrame: {
    width: 414,
    height: 896,
    maxHeight: '100vh',
    backgroundColor: '#fff',
    overflow: 'hidden',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.3,
    shadowRadius: 40,
    // @ts-ignore
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
  },
});
