import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, useColorScheme, FlatList } from 'react-native';
import { Colors } from '../styles/theme';
import { Ionicons } from '@expo/vector-icons';

interface DropdownOption {
  label: string;
  value: string;
}

interface DropdownProps {
  label: string;
  options: DropdownOption[];
  selectedValue: string;
  onValueChange: (value: string) => void;
}

export const Dropdown: React.FC<DropdownProps> = ({ 
  label, 
  options, 
  selectedValue, 
  onValueChange 
}) => {
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const colors = Colors[scheme];
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find(opt => opt.value === selectedValue) || options[0];

  const handleSelect = (val: string) => {
    onValueChange(val);
    setIsOpen(false);
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
      
      <Pressable 
        style={[
          styles.selector, 
          { 
            borderColor: isOpen ? colors.primary : colors.border,
            backgroundColor: colors.cardBackground,
          }
        ]}
        onPress={() => setIsOpen(!isOpen)}
      >
        <Text style={[styles.selectedText, { color: colors.text }]}>
          {selectedOption ? selectedOption.label : 'Select an option'}
        </Text>
        <Ionicons 
          name={isOpen ? 'chevron-up' : 'chevron-down'} 
          size={18} 
          color={colors.textSecondary} 
        />
      </Pressable>

      {isOpen && (
        <View style={[styles.optionsContainer, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
          {options.map((option, index) => {
            const isItemSel = option.value === selectedValue;
            return (
              <Pressable
                key={option.value}
                style={[
                  styles.optionItem,
                  { borderBottomWidth: index === options.length - 1 ? 0 : 1, borderBottomColor: colors.border },
                  isItemSel && { backgroundColor: colors.backgroundElement }
                ]}
                onPress={() => handleSelect(option.value)}
              >
                <Text style={[
                  styles.optionText, 
                  { color: colors.text },
                  isItemSel && { fontWeight: '600', color: colors.primary }
                ]}>
                  {option.label}
                </Text>
                {isItemSel && (
                  <Ionicons name="checkmark" size={16} color={colors.primary} />
                )}
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: '100%',
    zIndex: 100, // Make sure options cover lower content
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
  },
  selector: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  selectedText: {
    fontSize: 16,
    fontWeight: '500',
  },
  optionsContainer: {
    marginTop: 4,
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  optionText: {
    fontSize: 15,
  },
});
export default Dropdown;
