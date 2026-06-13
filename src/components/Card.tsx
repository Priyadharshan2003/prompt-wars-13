import React from 'react';
import { View, StyleSheet, useColorScheme, ViewProps } from 'react-native';
import { Colors, Shadows } from '../styles/theme';

interface CardProps extends ViewProps {
  children: React.ReactNode;
  variant?: 'default' | 'outline' | 'accent' | 'danger' | 'warning' | 'success';
}

export const Card: React.FC<CardProps> = ({ children, variant = 'default', style, ...props }) => {
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const colors = Colors[scheme];

  const getVariantStyles = () => {
    switch (variant) {
      case 'outline':
        return {
          backgroundColor: colors.cardBackground,
          borderColor: colors.border,
          borderWidth: 1,
        };
      case 'accent':
        return {
          backgroundColor: colors.accentBlueLight,
          borderColor: colors.primary,
          borderWidth: 1.5,
        };
      case 'danger':
        return {
          backgroundColor: colors.accentDangerLight,
          borderColor: colors.danger,
          borderWidth: 1.5,
        };
      case 'warning':
        return {
          backgroundColor: colors.accentWarningLight,
          borderColor: colors.warning,
          borderWidth: 1.5,
        };
      case 'success':
        return {
          backgroundColor: colors.accentLight,
          borderColor: colors.success,
          borderWidth: 1.5,
        };
      case 'default':
      default:
        return {
          backgroundColor: colors.cardBackground,
          borderColor: colors.border,
          borderWidth: 1,
          ...Shadows,
        };
    }
  };

  return (
    <View style={[styles.card, getVariantStyles(), style]} {...props}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
});
export default Card;
