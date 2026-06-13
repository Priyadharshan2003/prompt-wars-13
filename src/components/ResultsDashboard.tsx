import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, useColorScheme, Alert, Platform } from 'react-native';
import { Colors, Shadows } from '../styles/theme';
import Card from './Card';
import Button from './Button';
import BudgetGauge from './BudgetGauge';
import MealDetail from './MealDetail';
import { Ionicons } from '@expo/vector-icons';
import { GeneratedPlan, UserInputs } from '../logic/aiEngine';

interface ResultsDashboardProps {
  plan: GeneratedPlan;
  inputs: UserInputs;
  onReset: () => void;
  onLogExpense: (amount: number, description: string, category: 'Grocery' | 'Meal Cost' | 'Other') => void;
}

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({
  plan,
  inputs,
  onReset,
  onLogExpense,
}) => {
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const colors = Colors[scheme];

  // Checklist state for Grocery List
  // We initialize the checked state with the already owned items marked as true
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [logged, setLogged] = useState(false);

  useEffect(() => {
    const initialChecked: Record<string, boolean> = {};
    plan.groceryList.forEach((item, idx) => {
      // Unique key based on ingredient name + meal name
      const key = `${item.name}-${item.mealName}`;
      initialChecked[key] = item.alreadyOwned;
    });
    setCheckedItems(initialChecked);
    setLogged(false);
  }, [plan]);

  const toggleCheck = (name: string, mealName: string) => {
    const key = `${name}-${mealName}`;
    setCheckedItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Group grocery list by category
  const categories: Record<string, typeof plan.groceryList> = {
    'Produce': [],
    'Protein & Dairy': [],
    'Pantry': [],
    'Grains & Bakery': []
  };

  plan.groceryList.forEach(item => {
    if (categories[item.category]) {
      categories[item.category].push(item);
    } else {
      // Fallback
      categories['Pantry'].push(item);
    }
  });

  // Compile night prep tasks
  const nightTasks = [
    { meal: 'Breakfast', task: plan.breakfast.prepAheadTask },
    { meal: 'Lunch', task: plan.lunch.prepAheadTask },
    { meal: 'Dinner', task: plan.dinner.prepAheadTask }
  ].filter(t => t.task);

  const [completedNightTasks, setCompletedNightTasks] = useState<Record<string, boolean>>({});
  const toggleNightTask = (meal: string) => {
    setCompletedNightTasks(prev => ({
      ...prev,
      [meal]: !prev[meal]
    }));
  };

  const handleLogToLedger = () => {
    onLogExpense(
      plan.adjustedTotalCost,
      `Plan Grocery Shopping: ${plan.breakfast.name}, ${plan.lunch.name}, ${plan.dinner.name}`,
      'Grocery'
    );
    setLogged(true);
    if (Platform.OS === 'web') {
      alert(`Successfully logged $${plan.adjustedTotalCost.toFixed(2)} to your Expense Ledger!`);
    } else {
      Alert.alert('Logged!', `Successfully logged $${plan.adjustedTotalCost.toFixed(2)} to your Expense Ledger!`);
    }
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Your CookSmart Plan</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Daily outline customized to your life & budget
        </Text>
      </View>

      {/* 1. Budget Stress Status Card */}
      <Card variant={plan.budgetStressLevel === 'Stressed' ? 'danger' : 'default'} style={styles.card}>
        <BudgetGauge
          totalCost={plan.adjustedTotalCost}
          budget={inputs.budget}
          level={plan.budgetStressLevel}
          text={plan.budgetStressText}
          color={plan.budgetStressColor}
        />
        
        {/* Suggestion list */}
        {plan.optimizationSuggestions.length > 0 && (
          <View style={styles.suggestionsContainer}>
            <Text style={[styles.suggestionsTitle, { color: colors.text }]}>Optimization Tips:</Text>
            {plan.optimizationSuggestions.map((sug, idx) => (
              <View key={idx} style={styles.sugRow}>
                <Ionicons name="bulb-outline" size={14} color={plan.budgetStressColor} style={{ marginRight: 6, marginTop: 2 }} />
                <Text style={[styles.sugText, { color: colors.textSecondary }]}>{sug}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Ledger Logging Action */}
        {!logged ? (
          <Button
            title={`Log $${plan.adjustedTotalCost.toFixed(2)} to Expense Ledger 💳`}
            variant="outline"
            onPress={handleLogToLedger}
            style={styles.logBtn}
          />
        ) : (
          <View style={[styles.loggedBadge, { backgroundColor: colors.accentLight }]}>
            <Ionicons name="checkmark-circle" size={16} color={colors.success} style={{ marginRight: 6 }} />
            <Text style={[styles.loggedText, { color: colors.success }]}>Cost Logged to Ledger</Text>
          </View>
        )}
      </Card>

      {/* 2. Meal Cards */}
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Today's Recipes</Text>
      <MealDetail
        meal={plan.breakfast}
        type="Breakfast"
        nightPlanningMode={inputs.nightPlanningMode}
      />
      <MealDetail
        meal={plan.lunch}
        type="Lunch"
        nightPlanningMode={inputs.nightPlanningMode}
      />
      <MealDetail
        meal={plan.dinner}
        type="Dinner"
        nightPlanningMode={inputs.nightPlanningMode}
      />

      {/* 3. Night Prep Tasks Card */}
      {inputs.nightPlanningMode && nightTasks.length > 0 && (
        <Card variant="warning" style={styles.card}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>
            🌙 Tomorrow's Night Prep (Do Tonight)
          </Text>
          <Text style={[styles.cardSubtitle, { color: colors.textSecondary }]}>
            Spend 5-10 minutes preparing tonight to save cooking stress tomorrow.
          </Text>
          
          <View style={styles.nightPrepList}>
            {nightTasks.map((t) => {
              const isChecked = !!completedNightTasks[t.meal];
              return (
                <Pressable
                  key={t.meal}
                  style={styles.checkRow}
                  onPress={() => toggleNightTask(t.meal)}
                >
                  <Ionicons 
                    name={isChecked ? 'checkbox' : 'square-outline'} 
                    size={20} 
                    color={isChecked ? colors.success : colors.textSecondary} 
                    style={{ marginRight: 10 }}
                  />
                  <Text style={[
                    styles.checkLabel, 
                    { color: colors.text },
                    isChecked && { textDecorationLine: 'line-through', color: colors.textSecondary }
                  ]}>
                    <Text style={{ fontWeight: '700' }}>{t.meal}:</Text> {t.task}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </Card>
      )}

      {/* 4. Smart Grocery List Card */}
      <Card variant="default" style={styles.card}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>Smart Grocery List 🛒</Text>
        <Text style={[styles.cardSubtitle, { color: colors.textSecondary }]}>
          Categorized by supermarket aisle. Leftover items are automatically checked.
        </Text>

        {Object.entries(categories).map(([category, items]) => {
          if (items.length === 0) return null;
          return (
            <View key={category} style={styles.categoryBlock}>
              <Text style={[styles.categoryHeader, { color: colors.primary }]}>{category}</Text>
              
              {items.map((item, idx) => {
                const key = `${item.name}-${item.mealName}`;
                const isChecked = !!checkedItems[key];
                return (
                  <Pressable
                    key={idx}
                    style={styles.checkRow}
                    onPress={() => toggleCheck(item.name, item.mealName)}
                  >
                    <Ionicons 
                      name={isChecked ? 'checkbox' : 'square-outline'} 
                      size={20} 
                      color={isChecked ? colors.success : colors.textSecondary} 
                      style={{ marginRight: 10 }}
                    />
                    <View style={styles.groceryTextCol}>
                      <Text style={[
                        styles.checkLabel, 
                        { color: colors.text },
                        isChecked && { textDecorationLine: 'line-through', color: colors.textSecondary }
                      ]}>
                        <Text style={{ fontWeight: '600' }}>{item.quantity}</Text> {item.name}
                      </Text>
                      <Text style={[styles.grocerySubLabel, { color: colors.textSecondary }]}>
                        for {item.mealName} {item.alreadyOwned && '• (In Fridge 🥬)'}
                      </Text>
                    </View>
                    <Text style={[
                      styles.itemCost, 
                      { color: colors.text },
                      isChecked && { color: colors.textSecondary }
                    ]}>
                      ${item.costPerServing.toFixed(2)}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          );
        })}
      </Card>

      {/* 5. Ingredient Substitutions Matrix Card */}
      {plan.smartSubstitutions.length > 0 && (
        <Card variant="outline" style={styles.card}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Smart Substitutions Matrix ⚖️</Text>
          <Text style={[styles.cardSubtitle, { color: colors.textSecondary }]}>
            Substitute items to cut costs or boost nutrition.
          </Text>

          <View style={styles.subList}>
            {plan.smartSubstitutions.map((sub, idx) => {
              const isCheaper = sub.type === 'Cheaper';
              return (
                <View key={idx} style={[styles.subCard, { borderColor: colors.border, backgroundColor: colors.backgroundElement }]}>
                  <View style={styles.subCardHeader}>
                    <Text style={[styles.subTextMain, { color: colors.text }]}>
                      Swap <Text style={{ fontWeight: '700' }}>{sub.originalIngredient}</Text>
                    </Text>
                    <View style={[
                      styles.subBadge, 
                      { backgroundColor: isCheaper ? colors.accentLight : colors.accentBlueLight }
                    ]}>
                      <Text style={[styles.subBadgeText, { color: isCheaper ? colors.success : colors.primary }]}>
                        {sub.type}
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.swapDirectionRow}>
                    <Ionicons name="arrow-forward-circle-outline" size={16} color={colors.textSecondary} />
                    <Text style={[styles.swapTarget, { color: colors.text }]}>
                      Use <Text style={{ fontWeight: '700', color: isCheaper ? colors.success : colors.primary }}>{sub.swapIngredient}</Text>
                    </Text>
                  </View>

                  <Text style={[styles.subBenefit, { color: colors.textSecondary }]}>
                    {sub.benefitDescription}
                  </Text>

                  <View style={styles.subCostFooter}>
                    <Text style={[styles.subCostText, { color: colors.textSecondary }]}>
                      Cost Delta:{' '}
                      <Text style={{ fontWeight: '700', color: isCheaper ? colors.success : colors.primary }}>
                        {sub.costDiff < 0 ? `-$${Math.abs(sub.costDiff).toFixed(2)} (Save)` : `+$${sub.costDiff.toFixed(2)}`}
                      </Text>
                    </Text>
                    <Text style={[styles.subMealLabel, { color: colors.textSecondary }]}>
                      in {sub.mealName}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        </Card>
      )}

      {/* Reset/Regenerate CTA */}
      <View style={styles.footerContainer}>
        <Button
          title="Plan Another Day 🍳"
          variant="primary"
          onPress={onReset}
          style={styles.resetBtn}
        />
      </View>
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginTop: 16,
    marginBottom: 12,
    letterSpacing: -0.3,
  },
  card: {
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 16,
  },
  suggestionsContainer: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#0000000a',
    paddingTop: 12,
  },
  suggestionsTitle: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 6,
  },
  sugRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 3,
  },
  sugText: {
    fontSize: 12,
    lineHeight: 16,
    flex: 1,
  },
  logBtn: {
    marginTop: 14,
    height: 40,
  },
  loggedBadge: {
    marginTop: 14,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  loggedText: {
    fontSize: 13,
    fontWeight: '700',
  },
  nightPrepList: {
    marginTop: 8,
    gap: 12,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 8,
  },
  checkLabel: {
    fontSize: 14,
    lineHeight: 18,
    flex: 1,
  },
  groceryTextCol: {
    flex: 1,
    paddingRight: 10,
  },
  grocerySubLabel: {
    fontSize: 11,
    marginTop: 2,
  },
  itemCost: {
    fontSize: 14,
    fontWeight: '600',
  },
  categoryBlock: {
    marginBottom: 16,
  },
  categoryHeader: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#00000006',
    paddingBottom: 4,
  },
  subList: {
    gap: 12,
  },
  subCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
  },
  subCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  subTextMain: {
    fontSize: 14,
  },
  subBadge: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
  },
  subBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  swapDirectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  swapTarget: {
    fontSize: 14,
  },
  subBenefit: {
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 8,
  },
  subCostFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subCostText: {
    fontSize: 12,
  },
  subMealLabel: {
    fontSize: 11,
    fontStyle: 'italic',
  },
  footerContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  resetBtn: {
    width: '100%',
  },
});
export default ResultsDashboard;
