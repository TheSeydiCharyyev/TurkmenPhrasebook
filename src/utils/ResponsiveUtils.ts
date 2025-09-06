import { Dimensions } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export const DeviceInfo = {
  screenWidth,
  screenHeight,
  isSmallScreen: screenWidth < 375,
  isMediumScreen: screenWidth >= 375 && screenWidth < 414,
  isLargeScreen: screenWidth >= 414,
  isTablet: screenWidth >= 768,
};

export const ResponsiveUtils = {
  getValue: (small: number, medium: number, large: number) => {
    if (DeviceInfo.isSmallScreen) return small;
    if (DeviceInfo.isMediumScreen) return medium;
    return large;
  },

  fontSize: {
    chineseText: DeviceInfo.isSmallScreen ? 18 : 20,
    pinyinText: DeviceInfo.isSmallScreen ? 12 : 14,
  },

  dimensions: {
    categoryCardHeight: DeviceInfo.isSmallScreen ? 100 : 120,
    phraseCardHeight: DeviceInfo.isSmallScreen ? 120 : 140,
    iconMedium: DeviceInfo.isSmallScreen ? 20 : 24,
  },
};