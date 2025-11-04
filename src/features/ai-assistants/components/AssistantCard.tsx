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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AssistantCardProps } from '../types/ai-assistant.types';
import { scale, verticalScale, moderateScale } from '../../../utils/ResponsiveUtils';

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
    marginHorizontal: scale(16),
    marginVertical: verticalScale(8),
    borderRadius: scale(20),
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: scale(4) },
    shadowOpacity: 0.3,
    shadowRadius: scale(12),
  },
  gradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: scale(20),
    minHeight: verticalScale(110),
  },
  iconContainer: {
    width: scale(64),
    height: scale(64),
    borderRadius: scale(32),
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: scale(16),
  },
  icon: {
    fontSize: moderateScale(36),
  },
  content: {
    flex: 1,
    marginRight: scale(16),
  },
  name: {
    fontSize: moderateScale(19),
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: verticalScale(6),
    letterSpacing: 0.3,
  },
  description: {
    fontSize: moderateScale(14),
    color: 'rgba(255, 255, 255, 0.95)',
    lineHeight: moderateScale(20),
    fontWeight: '500',
  },
  arrowContainer: {
    width: scale(36),
    height: scale(36),
    borderRadius: scale(18),
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrow: {
    fontSize: moderateScale(20),
    color: '#FFFFFF',
    fontWeight: '700',
  },
});

export default AssistantCard;
