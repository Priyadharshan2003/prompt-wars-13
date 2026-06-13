import React from 'react';
import { View, Text, Pressable, StyleSheet, useColorScheme } from 'react-native';
import { Colors } from '../styles/theme';

interface SegmentControlProps {
  label?: string;
  values: string[];
  selectedIndex: number;
  onChange: (index: number) => void;
}

export const SegmentControl: React.FC<SegmentControlProps> = ({ 
  label, 
  values, 
  selectedIndex, 
  onChange 
}) => {
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const colors = Colors[scheme];

  return (
    <View style={styles.container}>
      {label && <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>}
      
      <View style={[styles.controlBg, { backgroundColor: colors.backgroundElement }]}>
        {values.map((val, idx) => {
          const isSelected = idx === selectedIndex;
          return (
            <Pressable
              key={val}
              style={[
                styles.segment,
                isSelected && { 
                  backgroundColor: colors.cardBackground,
                  shadowColor: '#000000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.1,
                  shadowRadius: 2,
                  elevation: 2,
                }
              ]}
              onPress={() => onChange(idx)}
            >
              <Text 
                style={[
                  styles.segmentText, 
                  { color: isSelected ? colors.text : colors.textSecondary },
                  isSelected && { fontWeight: '600' }
                ]}
              >
                {val}
              </Text>
            </Pressable>
          );
        })}
      </View>
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
  controlBg: {
    flexDirection: 'row',
    borderRadius: 8,
    padding: 2,
    height: 38,
  },
  segment: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
  },
  segmentText: {
    fontSize: 14,
    fontWeight: '500',
  },
});
export default SegmentControl;
