import React from 'react';
import { Pressable, StyleSheet, Text, useColorScheme, ActivityIndicator, PressableProps } from 'react-native';
import { Colors } from '../styles/theme';

interface ButtonProps extends PressableProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'text' | 'danger';
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  title, 
  variant = 'primary', 
  loading = false, 
  style, 
  disabled, 
  ...props 
}) => {
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const colors = Colors[scheme];

  const getStyles = (pressed: boolean) => {
    const base: any[] = [styles.button];
    
    // Variant styles
    if (variant === 'primary') {
      base.push({
        backgroundColor: disabled ? colors.backgroundSelected : colors.primary,
        borderColor: 'transparent',
      });
    } else if (variant === 'secondary') {
      base.push({
        backgroundColor: colors.backgroundElement,
        borderColor: 'transparent',
      });
    } else if (variant === 'danger') {
      base.push({
        backgroundColor: disabled ? colors.backgroundSelected : colors.danger,
        borderColor: 'transparent',
      });
    } else if (variant === 'outline') {
      base.push({
        backgroundColor: 'transparent',
        borderColor: colors.border,
        borderWidth: 1.5,
      });
    } else if (variant === 'text') {
      base.push({
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        paddingVertical: 8,
        paddingHorizontal: 12,
      });
    }

    // Pressed feedback
    if (pressed && !disabled) {
      base.push({ opacity: 0.8 });
    }

    return base;
  };

  const getTextStyle = () => {
    if (variant === 'primary') {
      return { color: '#FFFFFF' };
    }
    if (variant === 'danger') {
      return { color: '#FFFFFF' };
    }
    if (variant === 'outline' || variant === 'text') {
      return { color: colors.primary };
    }
    return { color: colors.text };
  };

  return (
    <Pressable 
      disabled={disabled || loading} 
      style={(state) => [getStyles(state.pressed), typeof style === 'function' ? style(state) : style]} 
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? '#FFFFFF' : colors.primary} />
      ) : (
        <Text style={[styles.text, getTextStyle(), disabled && { color: colors.textSecondary }]}>
          {title}
        </Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginVertical: 4,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
});
export default Button;
