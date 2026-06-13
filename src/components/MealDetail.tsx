import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, useColorScheme, Linking } from 'react-native';
import { Colors } from '../styles/theme';
import Card from './Card';
import { Ionicons } from '@expo/vector-icons';
import { Meal } from '../logic/mealDatabase';

interface MealDetailProps {
  meal: Meal & { fridgeMatchPercent: number; timings: string };
  type: 'Breakfast' | 'Lunch' | 'Dinner';
  onSwapIngredient?: (original: string, swap: string, costDiff: number) => void;
  nightPlanningMode: boolean;
}

export const MealDetail: React.FC<MealDetailProps> = ({
  meal,
  type,
  onSwapIngredient,
  nightPlanningMode,
}) => {
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const colors = Colors[scheme];
  const [expanded, setExpanded] = useState(false);

  const totalMealCost = meal.ingredients.reduce((sum, ing) => sum + ing.costPerServing, 0);

  const getEffortColor = (effort: string) => {
    switch (effort) {
      case 'Low': return colors.success;
      case 'Medium': return colors.primary;
      case 'High': return colors.warning;
      default: return colors.textSecondary;
    }
  };

  const getHealthGoalIcon = (goal: string) => {
    switch (goal) {
      case 'Low Calorie': return 'leaf';
      case 'High Protein': return 'barbell';
      case 'Balanced': return 'scale';
      default: return 'restaurant';
    }
  };

  return (
    <Card variant="default" style={styles.cardContainer}>
      <Pressable onPress={() => setExpanded(!expanded)} style={styles.headerPressable}>
        <View style={styles.headerRow}>
          <View style={styles.typeTimingCol}>
            <View style={styles.badgeRow}>
              <Text style={[styles.typeText, { color: colors.primary }]}>{type}</Text>
              <Text style={[styles.timingText, { color: colors.textSecondary }]}>⏱️ {meal.timings}</Text>
            </View>
            <Text style={[styles.mealName, { color: colors.text }]}>{meal.name}</Text>
          </View>
          
          <Ionicons 
            name={expanded ? 'chevron-up-circle' : 'chevron-down-circle'} 
            size={24} 
            color={colors.primary} 
          />
        </View>

        {/* Info Tags */}
        <View style={styles.tagsContainer}>
          <View style={[styles.tag, { backgroundColor: colors.backgroundElement }]}>
            <Text style={[styles.tagText, { color: getEffortColor(meal.effort) }]}>
              ● {meal.effort} Prep
            </Text>
          </View>
          <View style={[styles.tag, { backgroundColor: colors.backgroundElement }]}>
            <Text style={[styles.tagText, { color: colors.textSecondary }]}>
              {meal.time} mins
            </Text>
          </View>
          <View style={[styles.tag, { backgroundColor: colors.backgroundElement }]}>
            <Ionicons name={getHealthGoalIcon(meal.healthGoal) as any} size={11} color={colors.textSecondary} style={{ marginRight: 3 }} />
            <Text style={[styles.tagText, { color: colors.textSecondary }]}>
              {meal.healthGoal}
            </Text>
          </View>

          {/* Fridge Match percentage badge */}
          {meal.fridgeMatchPercent > 0 && (
            <View style={[styles.tag, { backgroundColor: colors.accentLight }]}>
              <Text style={[styles.tagText, { color: colors.success, fontWeight: '700' }]}>
                Fridge Match {meal.fridgeMatchPercent}%
              </Text>
            </View>
          )}

          {/* Brain Fried badge */}
          {meal.ingredients.length <= 5 && meal.effort === 'Low' && (
            <View style={[styles.tag, { backgroundColor: colors.accentWarningLight }]}>
              <Text style={[styles.tagText, { color: colors.warning, fontWeight: '700' }]}>
                🧠 Easy
              </Text>
            </View>
          )}
        </View>

        {/* Cost tag */}
        <View style={styles.costContainer}>
          <Text style={[styles.costText, { color: colors.textSecondary }]}>
            Est. Cost: <Text style={{ color: colors.text, fontWeight: '600' }}>${totalMealCost.toFixed(2)}</Text>
          </Text>
        </View>
      </Pressable>

      {expanded && (
        <View style={[styles.expandedContent, { borderTopColor: colors.border }]}>
          {/* Night Planning Prep Section */}
          {nightPlanningMode && meal.prepAheadTask && (
            <View style={[styles.nightPrepBox, { backgroundColor: colors.accentWarningLight, borderColor: colors.warning }]}>
              <View style={styles.nightPrepHeader}>
                <Ionicons name="moon-outline" size={16} color={colors.warning} style={{ marginRight: 6 }} />
                <Text style={[styles.nightPrepTitle, { color: colors.warning }]}>Prep Ahead (Do Tonight)</Text>
              </View>
              <Text style={[styles.nightPrepText, { color: colors.text }]}>{meal.prepAheadTask}</Text>
            </View>
          )}

          {/* Ingredients */}
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Ingredients ({meal.ingredients.length})</Text>
          <View style={styles.ingredientsList}>
            {meal.ingredients.map((ing, idx) => (
              <View key={idx} style={styles.ingredientRow}>
                <Text style={[styles.bullet, { color: colors.primary }]}>•</Text>
                <Text style={[styles.ingredientText, { color: colors.text }]}>
                  <Text style={styles.boldIngredient}>{ing.quantity}</Text> {ing.name}
                </Text>
                <Text style={[styles.ingredientCost, { color: colors.textSecondary }]}>
                  (${ing.costPerServing.toFixed(2)})
                </Text>
              </View>
            ))}
          </View>

          {/* Prep Instructions */}
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Cooking Steps</Text>
          <View style={styles.instructionsList}>
            {meal.prepInstructions.map((step, idx) => (
              <View key={idx} style={styles.instructionStep}>
                <View style={[styles.stepNumberContainer, { backgroundColor: colors.backgroundElement }]}>
                  <Text style={[styles.stepNumber, { color: colors.text }]}>{idx + 1}</Text>
                </View>
                <Text style={[styles.stepText, { color: colors.text }]}>{step}</Text>
              </View>
            ))}
          </View>

          {/* YouTube Recipe Button */}
          {meal.youtubeLink && (
            <Pressable 
              style={[styles.youtubeBtn, { backgroundColor: '#FF0000' }]} 
              onPress={() => Linking.openURL(meal.youtubeLink!)}
            >
              <Ionicons name="logo-youtube" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={styles.youtubeBtnText}>Watch Recipe on YouTube</Text>
            </Pressable>
          )}
        </View>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    padding: 0,
    overflow: 'hidden',
  },
  headerPressable: {
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  typeTimingCol: {
    flex: 1,
    paddingRight: 12,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 8,
  },
  typeText: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  timingText: {
    fontSize: 12,
    fontWeight: '600',
  },
  mealName: {
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 22,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
    gap: 6,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '600',
  },
  costContainer: {
    marginTop: 12,
  },
  costText: {
    fontSize: 13,
    fontWeight: '500',
  },
  expandedContent: {
    borderTopWidth: 1,
    padding: 16,
  },
  nightPrepBox: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  nightPrepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  nightPrepTitle: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  nightPrepText: {
    fontSize: 13,
    lineHeight: 18,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginTop: 12,
    marginBottom: 8,
  },
  ingredientsList: {
    marginBottom: 16,
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  bullet: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 6,
  },
  ingredientText: {
    fontSize: 14,
    flex: 1,
  },
  boldIngredient: {
    fontWeight: '600',
  },
  ingredientCost: {
    fontSize: 12,
    marginLeft: 6,
  },
  instructionsList: {
    gap: 12,
  },
  instructionStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  stepNumberContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    marginTop: 2,
  },
  stepNumber: {
    fontSize: 12,
    fontWeight: '700',
  },
  stepText: {
    fontSize: 14,
    flex: 1,
    lineHeight: 20,
  },
  youtubeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  youtubeBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
export default MealDetail;
