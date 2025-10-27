/**
 * Feedback Card Component
 * Displays AI feedback (tips, corrections, suggestions, praise)
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FeedbackCardProps } from '../types/ai-assistant.types';

const FeedbackCard: React.FC<FeedbackCardProps> = ({
  feedback,
  type,
  onDismiss,
}) => {
  // Get styles based on feedback type
  const getTypeConfig = () => {
    switch (type) {
      case 'tip':
        return {
          icon: '💡',
          backgroundColor: '#E3F2FD',
          borderColor: '#2196F3',
          textColor: '#1565C0',
          title: 'Tip',
        };
      case 'correction':
        return {
          icon: '✏️',
          backgroundColor: '#FFF3E0',
          borderColor: '#FF9800',
          textColor: '#E65100',
          title: 'Correction',
        };
      case 'suggestion':
        return {
          icon: '🌟',
          backgroundColor: '#F3E5F5',
          borderColor: '#9C27B0',
          textColor: '#6A1B9A',
          title: 'Suggestion',
        };
      case 'praise':
        return {
          icon: '🎉',
          backgroundColor: '#E8F5E9',
          borderColor: '#4CAF50',
          textColor: '#2E7D32',
          title: 'Great job!',
        };
      default:
        return {
          icon: '💬',
          backgroundColor: '#F5F5F5',
          borderColor: '#9E9E9E',
          textColor: '#424242',
          title: 'Feedback',
        };
    }
  };

  const config = getTypeConfig();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: config.backgroundColor,
          borderColor: config.borderColor,
        },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.icon}>{config.icon}</Text>
          <Text style={[styles.title, { color: config.textColor }]}>
            {config.title}
          </Text>
        </View>

        {/* Dismiss button */}
        {onDismiss && (
          <TouchableOpacity onPress={onDismiss} style={styles.dismissButton}>
            <Text style={styles.dismissText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Feedback content */}
      <Text style={[styles.feedback, { color: config.textColor }]}>
        {feedback}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    borderWidth: 2,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    fontSize: 20,
    marginRight: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
  },
  dismissButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dismissText: {
    fontSize: 18,
    color: '#666',
  },
  feedback: {
    fontSize: 15,
    lineHeight: 22,
  },
});

export default FeedbackCard;
