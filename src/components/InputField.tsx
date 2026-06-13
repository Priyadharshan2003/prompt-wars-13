import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, useColorScheme, TextInputProps } from 'react-native';
import { Colors } from '../styles/theme';

interface InputFieldProps extends TextInputProps {
  label: string;
  error?: string;
  prefix?: string;
}

export const InputField: React.FC<InputFieldProps> = ({ 
  label, 
  error, 
  prefix, 
  style, 
  onFocus, 
  onBlur, 
  ...props 
}) => {
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const colors = Colors[scheme];
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = (e: any) => {
    setIsFocused(true);
    if (onFocus) onFocus(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    if (onBlur) onBlur(e);
  };

  const getInputContainerStyle = () => {
    return [
      styles.inputContainer,
      { 
        borderColor: error ? colors.danger : isFocused ? colors.primary : colors.border,
        backgroundColor: colors.cardBackground,
      }
    ];
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
      
      <View style={getInputContainerStyle()}>
        {prefix && (
          <Text style={[styles.prefix, { color: colors.textSecondary }]}>
            {prefix}
          </Text>
        )}
        <TextInput
          style={[
            styles.input, 
            { color: colors.text }, 
            style
          ]}
          placeholderTextColor={colors.textSecondary + '77'}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />
      </View>
      
      {error && (
        <Text style={[styles.errorText, { color: colors.danger }]}>
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
  },
  inputContainer: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  prefix: {
    fontSize: 16,
    fontWeight: '500',
    marginRight: 4,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    paddingVertical: 8,
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
});
export default InputField;
