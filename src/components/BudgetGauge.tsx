import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { Colors } from '../styles/theme';

interface BudgetGaugeProps {
  totalCost: number;
  budget: number;
  level: 'Relaxed' | 'Balanced' | 'Stretched' | 'Stressed';
  text: string;
  color: string;
}

export const BudgetGauge: React.FC<BudgetGaugeProps> = ({
  totalCost,
  budget,
  level,
  text,
  color,
}) => {
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const colors = Colors[scheme];

  const ratio = budget > 0 ? totalCost / budget : 0;
  // Cap progress percentage at 100% for the main bar width, but show overflow indicators
  const fillWidth = Math.min(ratio * 100, 100);

  const getLevelBadge = () => {
    return (
      <View style={[styles.badge, { backgroundColor: color }]}>
        <Text style={styles.badgeText}>{level.toUpperCase()}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Estimated Cost</Text>
          <Text style={[styles.costText, { color: colors.text }]}>
            ${totalCost.toFixed(2)}
            <Text style={[styles.budgetLimit, { color: colors.textSecondary }]}> / ${budget.toFixed(0)}</Text>
          </Text>
        </View>
        {getLevelBadge()}
      </View>

      {/* Progress Bar Comfort zones */}
      <View style={styles.gaugeWrapper}>
        <View style={[styles.gaugeTrack, { backgroundColor: colors.border }]}>
          {/* Relaxed Zone (0-60%) */}
          <View style={[styles.zone, { width: '60%', backgroundColor: colors.success + '22' }]} />
          {/* Balanced Zone (60-90%) */}
          <View style={[styles.zone, { width: '30%', backgroundColor: colors.primary + '22' }]} />
          {/* Stretched Zone (90-100%) */}
          <View style={[styles.zone, { width: '10%', backgroundColor: colors.warning + '22' }]} />
          
          {/* Actual Fill Bar */}
          <View 
            style={[
              styles.gaugeFill, 
              { 
                width: `${fillWidth}%`, 
                backgroundColor: color,
                shadowColor: color,
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.3,
                shadowRadius: 3,
              }
            ]} 
          />
        </View>
        
        {/* Pointer mark if over budget */}
        {ratio > 1 && (
          <Text style={[styles.overflowWarning, { color: colors.danger }]}>
            +${(totalCost - budget).toFixed(2)} Over Budget
          </Text>
        )}
      </View>

      {/* Zone legends */}
      <View style={styles.legendsRow}>
        <Text style={[styles.legendText, { color: colors.textSecondary }]}>0%</Text>
        <Text style={[styles.legendText, { color: colors.textSecondary }]}>Relaxed</Text>
        <Text style={[styles.legendText, { color: colors.textSecondary }]}>Balanced</Text>
        <Text style={[styles.legendText, { color: colors.textSecondary }]}>100%</Text>
      </View>

      <Text style={[styles.description, { color: colors.textSecondary }]}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  costText: {
    fontSize: 26,
    fontWeight: '700',
    marginTop: 2,
  },
  budgetLimit: {
    fontSize: 16,
    fontWeight: '400',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  gaugeWrapper: {
    marginBottom: 8,
    position: 'relative',
  },
  gaugeTrack: {
    height: 10,
    borderRadius: 5,
    width: '100%',
    flexDirection: 'row',
    overflow: 'hidden',
    position: 'relative',
  },
  zone: {
    height: '100%',
  },
  gaugeFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    height: '100%',
    borderRadius: 5,
  },
  overflowWarning: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
    textAlign: 'right',
  },
  legendsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  legendText: {
    fontSize: 10,
    fontWeight: '500',
  },
  description: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
  },
});
export default BudgetGauge;
