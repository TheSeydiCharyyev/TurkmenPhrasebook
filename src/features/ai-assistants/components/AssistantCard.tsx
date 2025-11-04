/**
 * Assistant Card Component
 * Displays an AI assistant card on the home screen
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AssistantCardProps } from '../types/ai-assistant.types';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 32; // 16px padding on each side

const AssistantCard: React.FC<AssistantCardProps> = ({ config, onPress }) => {
  // Generate gradient colors (darker shade of main color)
  const getGradientColors = (color: string): [string, string] => {
    // Simple gradient: from color to slightly darker shade
    return [color, adjustColor(color, -20)];
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={getGradientColors(config.color)}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        {/* Icon */}
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>{config.icon}</Text>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.name}>{config.name}</Text>
          <Text style={styles.description}>{config.description}</Text>
        </View>

        {/* Arrow */}
        <View style={styles.arrowContainer}>
          <Text style={styles.arrow}>→</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

// Helper function to adjust color brightness
function adjustColor(color: string, amount: number): string {
  // Simple color adjustment (works for hex colors)
  const clamp = (num: number) => Math.min(255, Math.max(0, num));

  // Convert hex to RGB
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // Adjust and convert back to hex
  const newR = clamp(r + amount);
  const newG = clamp(g + amount);
  const newB = clamp(b + amount);

  return `#${newR.toString(16).padStart(2, '0')}${newG
    .toString(16)
    .padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  gradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    minHeight: 110,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  icon: {
    fontSize: 36,
  },
  content: {
    flex: 1,
    marginRight: 16,
  },
  name: {
    fontSize: 19,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  description: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.95)',
    lineHeight: 20,
    fontWeight: '500',
  },
  arrowContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrow: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: '700',
  },
});

export default AssistantCard;
