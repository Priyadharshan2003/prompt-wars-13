import { StyleSheet, Platform } from 'react-native';

export const Colors = {
  light: {
    primary: '#007AFF', // Apple Blue
    success: '#34C759', // Apple Green
    warning: '#FF9500', // Apple Orange
    danger: '#FF3B30',  // Apple Red
    text: '#1C1C1E',    // Dark grey (better than pure black for readability)
    textSecondary: '#6E6E73',
    background: '#F8F9FA', // Notion light background
    cardBackground: '#FFFFFF',
    border: '#E5E7EB',
    backgroundElement: '#F2F2F7',
    backgroundSelected: '#E5E5EA',
    accentLight: '#E8F5E9', // Soft green background
    accentDangerLight: '#FFEBEE', // Soft red background
    accentWarningLight: '#FFF3E0', // Soft orange background
    accentBlueLight: '#E3F2FD' // Soft blue background
  },
  dark: {
    primary: '#0A84FF',
    success: '#30D158',
    warning: '#FF9F0A',
    danger: '#FF453A',
    text: '#F5F5F7',
    textSecondary: '#8E8E93',
    background: '#191919', // Notion dark background
    cardBackground: '#222222',
    border: '#2C2C2E',
    backgroundElement: '#2C2C2E',
    backgroundSelected: '#3A3A3C',
    accentLight: '#1B2E1F',
    accentDangerLight: '#2D1B1B',
    accentWarningLight: '#2D231B',
    accentBlueLight: '#1B242D'
  }
};

export const Shadows = Platform.select({
  ios: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  android: {
    elevation: 3,
  },
  web: {
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.02)',
  },
  default: {}
});

export const GlobalStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    ...Shadows,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  justifyBetween: {
    justifyContent: 'space-between',
  },
  flexOne: {
    flex: 1,
  },
  divider: {
    height: 1,
    marginVertical: 12,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  }
});
