import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../logic/AppContext';
import ExpenseTracker from '../components/ExpenseTracker';
import { Colors } from '../styles/theme';
import { useColorScheme } from 'react-native';

export default function ExploreScreen() {
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const colors = Colors[scheme];

  const {
    expenses,
    addExpense,
    clearExpenses,
    userInputs
  } = useApp();

  const targetDailyBudget = userInputs ? userInputs.budget : 20;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
      <ExpenseTracker
        expenses={expenses}
        onAddExpense={addExpense}
        onClearExpenses={clearExpenses}
        targetDailyBudget={targetDailyBudget}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
});
