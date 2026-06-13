import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, useColorScheme, Platform, Alert } from 'react-native';
import { Colors, Shadows } from '../styles/theme';
import Card from './Card';
import InputField from './InputField';
import Button from './Button';
import SegmentControl from './SegmentControl';
import { Ionicons } from '@expo/vector-icons';
import { ExpenseItem } from '../utils/storage';
import { formatCurrency, formatDate, getDayOfWeek } from '../utils/formatting';

interface ExpenseTrackerProps {
  expenses: ExpenseItem[];
  onAddExpense: (amount: number, description: string, category: 'Grocery' | 'Meal Cost' | 'Other') => void;
  onClearExpenses: () => void;
  targetDailyBudget: number;
}

export const ExpenseTracker: React.FC<ExpenseTrackerProps> = ({
  expenses,
  onAddExpense,
  onClearExpenses,
  targetDailyBudget,
}) => {
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const colors = Colors[scheme];

  // Form State
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');
  const [categoryIdx, setCategoryIdx] = useState(0); // 0 = Grocery, 1 = Meal Cost, 2 = Other
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Summary Metrics
  const totalSpent = expenses.reduce((sum, item) => sum + item.amount, 0);
  
  // Weekly Budget comparison
  const weeklyBudgetLimit = targetDailyBudget * 7;
  const remainingBudget = Math.max(weeklyBudgetLimit - totalSpent, 0);
  const weeklyRatio = weeklyBudgetLimit > 0 ? totalSpent / weeklyBudgetLimit : 0;
  const weeklyPercent = Math.min(weeklyRatio * 100, 100);

  const handleAdd = () => {
    const newErrors: Record<string, string> = {};
    const parsedAmount = parseFloat(amount);

    if (!desc.trim()) {
      newErrors.desc = 'Description is required';
    }
    if (!amount.trim()) {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(parsedAmount) || parsedAmount <= 0) {
      newErrors.amount = 'Please enter a valid positive number';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    const categories: ('Grocery' | 'Meal Cost' | 'Other')[] = ['Grocery', 'Meal Cost', 'Other'];
    onAddExpense(parsedAmount, desc.trim(), categories[categoryIdx]);
    
    // Reset form
    setDesc('');
    setAmount('');
    
    if (Platform.OS === 'web') {
      alert(`Logged $${parsedAmount.toFixed(2)} for ${desc.trim()}!`);
    } else {
      Alert.alert('Logged!', `Successfully logged $${parsedAmount.toFixed(2)}!`);
    }
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'Grocery': return colors.primary;
      case 'Meal Cost': return colors.success;
      case 'Other': return colors.textSecondary;
      default: return colors.text;
    }
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Grocery': return 'cart-outline';
      case 'Meal Cost': return 'restaurant-outline';
      case 'Other': return 'receipt-outline';
      default: return 'card-outline';
    }
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Expense Ledger</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Track actual spending and compare to daily target
        </Text>
      </View>

      {/* 1. Cumulative Weekly Target comparison card */}
      <Card variant="default" style={styles.summaryCard}>
        <Text style={[styles.summaryTitle, { color: colors.textSecondary }]}>Cumulative Weekly Spending</Text>
        <Text style={[styles.summaryBigSpent, { color: colors.text }]}>
          {formatCurrency(totalSpent)}
          <Text style={[styles.summaryTargetLimit, { color: colors.textSecondary }]}>
            {' '}/ {formatCurrency(weeklyBudgetLimit)} limit
          </Text>
        </Text>

        {/* Target Gauge progress */}
        <View style={styles.barWrapper}>
          <View style={[styles.barTrack, { backgroundColor: colors.border }]}>
            <View 
              style={[
                styles.barFill, 
                { 
                  width: `${weeklyPercent}%`, 
                  backgroundColor: weeklyRatio > 1.0 ? colors.danger : weeklyRatio > 0.8 ? colors.warning : colors.success 
                }
              ]} 
            />
          </View>
        </View>

        <View style={styles.barLegends}>
          <Text style={[styles.legendText, { color: colors.textSecondary }]}>
            {weeklyRatio > 1.0 ? 'Over limit!' : `${formatCurrency(remainingBudget)} remaining this week`}
          </Text>
          <Text style={[styles.legendText, { color: colors.textSecondary, fontWeight: '700' }]}>
            {Math.round(weeklyRatio * 100)}% Used
          </Text>
        </View>
      </Card>

      {/* 2. Log Expense Form Card */}
      <Card variant="default" style={styles.card}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>Log Purchase 💳</Text>
        
        <InputField
          label="Item Description"
          placeholder="e.g. Weekly organic groceries, Diner breakfast"
          value={desc}
          onChangeText={setDesc}
          error={errors.desc}
        />

        <InputField
          label="Amount Paid"
          placeholder="e.g. 45.50"
          prefix="$"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
          error={errors.amount}
        />

        <SegmentControl
          label="Category"
          values={['Grocery 🛒', 'Meal Cost 🍲', 'Other 🧾']}
          selectedIndex={categoryIdx}
          onChange={setCategoryIdx}
        />

        <Button
          title="Add Expense"
          variant="primary"
          onPress={handleAdd}
          style={styles.addBtn}
        />
      </Card>

      {/* 3. Transaction History Ledger */}
      <View style={styles.historyHeader}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Purchase History ({expenses.length})
        </Text>
        {expenses.length > 0 && (
          <Pressable onPress={onClearExpenses}>
            <Text style={[styles.clearBtnText, { color: colors.danger }]}>Clear All</Text>
          </Pressable>
        )}
      </View>

      {expenses.length === 0 ? (
        <Card variant="outline" style={styles.emptyCard}>
          <Ionicons name="receipt-outline" size={36} color={colors.textSecondary} />
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            No expenses logged yet. Save a meal plan or add custom items to see them here!
          </Text>
        </Card>
      ) : (
        <View style={styles.ledgerList}>
          {/* Render in reverse chronological order */}
          {[...expenses].reverse().map((item) => (
            <Card key={item.id} variant="default" style={styles.ledgerItemCard}>
              <View style={styles.ledgerRow}>
                <View style={[styles.ledgerIconCircle, { backgroundColor: colors.backgroundElement }]}>
                  <Ionicons 
                    name={getCategoryIcon(item.category) as any} 
                    size={18} 
                    color={getCategoryColor(item.category)} 
                  />
                </View>
                
                <View style={styles.ledgerTextCol}>
                  <Text style={[styles.ledgerItemTitle, { color: colors.text }]} numberOfLines={1}>
                    {item.description}
                  </Text>
                  <Text style={[styles.ledgerItemSub, { color: colors.textSecondary }]}>
                    {getDayOfWeek(item.date)} • {formatDate(item.date)}
                  </Text>
                </View>

                <View style={styles.ledgerPriceCol}>
                  <Text style={[styles.ledgerItemAmount, { color: colors.text }]}>
                    {formatCurrency(item.amount)}
                  </Text>
                  <Text style={[styles.ledgerItemCategory, { color: getCategoryColor(item.category) }]}>
                    {item.category}
                  </Text>
                </View>
              </View>
            </Card>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
    maxWidth: 600,
    alignSelf: 'center',
    width: '100%',
  },
  header: {
    marginTop: 8,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  summaryCard: {
    padding: 16,
    marginBottom: 20,
  },
  summaryTitle: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  summaryBigSpent: {
    fontSize: 28,
    fontWeight: '800',
    marginTop: 6,
    marginBottom: 12,
  },
  summaryTargetLimit: {
    fontSize: 14,
    fontWeight: '400',
  },
  barWrapper: {
    marginBottom: 8,
  },
  barTrack: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
  },
  barLegends: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  legendText: {
    fontSize: 11,
    fontWeight: '500',
  },
  card: {
    padding: 16,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 16,
  },
  addBtn: {
    marginTop: 8,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  clearBtnText: {
    fontSize: 13,
    fontWeight: '600',
  },
  emptyCard: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    borderRadius: 16,
  },
  emptyText: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    marginTop: 12,
    fontWeight: '500',
  },
  ledgerList: {
    gap: 8,
  },
  ledgerItemCard: {
    padding: 12,
    marginBottom: 0,
    borderRadius: 12,
  },
  ledgerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  ledgerIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  ledgerTextCol: {
    flex: 1,
    paddingRight: 10,
  },
  ledgerItemTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  ledgerItemSub: {
    fontSize: 11,
    marginTop: 2,
  },
  ledgerPriceCol: {
    alignItems: 'flex-end',
  },
  ledgerItemAmount: {
    fontSize: 15,
    fontWeight: '700',
  },
  ledgerItemCategory: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
});
export default ExpenseTracker;
