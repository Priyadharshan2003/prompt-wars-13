import { mealDatabase, Meal, Ingredient } from './mealDatabase';
import { substitutionDb, Substitution } from './substitutionDb';
import { regionEngine, LocationData } from './regionEngine';

export interface UserInputs {
  budget: number;
  diet: 'Veg' | 'Non-Veg';
  cognitiveLoad: 'High Energy' | 'Tired' | 'Brain Fried';
  timeAvailable: 'Short' | 'Medium' | 'Long';
  healthGoal: 'Low Calorie' | 'High Protein' | 'Balanced';
  leftovers: string;
  minimalCookingMode: boolean;
  wakeTime?: string;
  sleepTime?: string;
  nightPlanningMode: boolean;
  location?: LocationData;
}

export interface GroceryItem extends Ingredient {
  mealName: string;
  alreadyOwned: boolean;
}

export interface GeneratedPlan {
  breakfast: Meal & { fridgeMatchPercent: number; timings: string };
  lunch: Meal & { fridgeMatchPercent: number; timings: string };
  dinner: Meal & { fridgeMatchPercent: number; timings: string };
  groceryList: GroceryItem[];
  smartSubstitutions: {
    originalIngredient: string;
    swapIngredient: string;
    type: 'Cheaper' | 'Healthier' | 'Alternative';
    costDiff: number;
    benefitDescription: string;
    mealName: string;
  }[];
  rawTotalCost: number;
  adjustedTotalCost: number;
  budgetStressLevel: 'Relaxed' | 'Balanced' | 'Stretched' | 'Stressed';
  budgetStressText: string;
  budgetStressColor: string;
  optimizationSuggestions: string[];
}

export function generateMealPlan(inputs: UserInputs): GeneratedPlan {
  const {
    budget,
    diet,
    cognitiveLoad,
    timeAvailable,
    healthGoal,
    leftovers,
    minimalCookingMode,
    wakeTime = '07:00',
    sleepTime = '22:00',
    nightPlanningMode,
    location
  } = inputs;

  // 1. Parse leftovers
  const leftoverItems = leftovers
    .toLowerCase()
    .split(',')
    .map(item => item.trim())
    .filter(item => item.length > 0);

  // Helper to check if ingredient matches leftovers
  const matchesLeftovers = (ingredientName: string): boolean => {
    return leftoverItems.some(leftover => 
      ingredientName.toLowerCase().includes(leftover) || 
      leftover.includes(ingredientName.toLowerCase())
    );
  };

  // 2. Filter Recipes
  let filtered = mealDatabase.filter(meal => {
    // Diet Constraint (Hard Filter)
    if (diet === 'Veg' && meal.diet === 'Non-Veg') {
      return false;
    }

    // Cognitive Load "Brain Fried" (Hard Filter)
    if (cognitiveLoad === 'Brain Fried') {
      if (meal.effort === 'High' || meal.time > 15 || meal.ingredients.length > 5) {
        return false;
      }
    }

    // Minimal Cooking Mode (Hard Filter)
    if (minimalCookingMode && meal.ingredients.length > 5) {
      return false;
    }

    return true;
  });

  // Fallback if filters are too strict and empty the list
  if (filtered.length === 0) {
    filtered = mealDatabase.filter(meal => diet === 'Veg' ? meal.diet === 'Veg' : true);
  }

  // 3. Score Recipes
  const scoredMeals = filtered.map(meal => {
    let score = 0;

    // Time Match
    if (timeAvailable === 'Short') {
      if (meal.time <= 15) score += 15;
      else if (meal.time > 25) score -= 15;
    } else if (timeAvailable === 'Medium') {
      if (meal.time > 10 && meal.time <= 30) score += 15;
    } else if (timeAvailable === 'Long') {
      if (meal.time > 30) score += 15;
    }

    // Effort Match
    if (cognitiveLoad === 'High Energy') {
      if (meal.effort === 'High' || meal.effort === 'Medium') score += 10;
    } else if (cognitiveLoad === 'Tired') {
      if (meal.effort === 'Low' || meal.effort === 'Medium') score += 10;
      if (meal.effort === 'High') score -= 15;
    } else if (cognitiveLoad === 'Brain Fried') {
      if (meal.effort === 'Low') score += 25;
    }

    // Health Goal Match
    if (meal.healthGoal === healthGoal) {
      score += 20;
    }

    // Leftovers Matching (Fridge Reality Check)
    let matchedCount = 0;
    meal.ingredients.forEach(ing => {
      if (matchesLeftovers(ing.name)) {
        matchedCount++;
      }
    });

    const fridgeMatchPercent = meal.ingredients.length > 0 
      ? Math.round((matchedCount / meal.ingredients.length) * 100) 
      : 0;

    // Boost score significantly for matching ingredients
    score += fridgeMatchPercent * 0.5;

    // Region Matching Boost
    if (location) {
      score += regionEngine.calculateRegionMatchScore(meal.name, location);
    }

    return {
      meal,
      score,
      fridgeMatchPercent
    };
  });

  // 4. Select meals by Category (Breakfast, Lunch, Dinner)
  const getTopMeal = (type: 'Breakfast' | 'Lunch' | 'Dinner'): { meal: Meal; fridgeMatchPercent: number } => {
    const choices = scoredMeals.filter(m => m.meal.type === type);
    
    if (choices.length === 0) {
      // Emergency Fallback
      const fallbackList = mealDatabase.filter(m => m.type === type && (diet === 'Veg' ? m.diet === 'Veg' : true));
      return { 
        meal: fallbackList[0] || mealDatabase.filter(m => m.type === type)[0], 
        fridgeMatchPercent: 0 
      };
    }

    // Sort by score (descending) and then cost (ascending)
    choices.sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      const costA = a.meal.ingredients.reduce((sum, i) => sum + i.costPerServing, 0);
      const costB = b.meal.ingredients.reduce((sum, i) => sum + i.costPerServing, 0);
      return costA - costB;
    });

    return {
      meal: choices[0].meal,
      fridgeMatchPercent: choices[0].fridgeMatchPercent
    };
  };

  const breakfastSelection = getTopMeal('Breakfast');
  const lunchSelection = getTopMeal('Lunch');
  const dinnerSelection = getTopMeal('Dinner');

  // Calculate routine meal timings based on wake and sleep times
  // E.g. breakfast 1.5h after wake, lunch 6h after wake, dinner 3.5h before sleep
  const parseTimeToMinutes = (tStr: string): number => {
    const [h, m] = tStr.split(':').map(Number);
    return h * 60 + m;
  };

  const formatMinutesToTime = (mins: number): string => {
    const hours = Math.floor(mins / 60) % 24;
    const minutes = mins % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  const wakeMins = parseTimeToMinutes(wakeTime);
  const sleepMins = parseTimeToMinutes(sleepTime);

  const bTimeMins = wakeMins + 90; // Wake + 1.5h
  const lTimeMins = wakeMins + 360; // Wake + 6h
  const dTimeMins = sleepMins - 210; // Sleep - 3.5h

  const breakfastTimings = formatMinutesToTime(bTimeMins);
  const lunchTimings = formatMinutesToTime(lTimeMins);
  const dinnerTimings = formatMinutesToTime(dTimeMins);

  const finalBreakfast = { ...breakfastSelection.meal, fridgeMatchPercent: breakfastSelection.fridgeMatchPercent, timings: breakfastTimings };
  const finalLunch = { ...lunchSelection.meal, fridgeMatchPercent: lunchSelection.fridgeMatchPercent, timings: lunchTimings };
  const finalDinner = { ...dinnerSelection.meal, fridgeMatchPercent: dinnerSelection.fridgeMatchPercent, timings: dinnerTimings };

  // 5. Compile Grocery List
  const rawList: GroceryItem[] = [];
  const addIngredients = (meal: Meal) => {
    meal.ingredients.forEach(ing => {
      const alreadyOwned = matchesLeftovers(ing.name);
      rawList.push({
        ...ing,
        mealName: meal.name,
        alreadyOwned
      });
    });
  };

  addIngredients(finalBreakfast);
  addIngredients(finalLunch);
  addIngredients(finalDinner);

  // Group identical ingredients if needed, but keeping them associated with meals makes checklist fun.
  // We'll keep them as individual items for meal association, but tag them.
  // Grouping by aisle (category) is required.

  // 6. Calculate total costs
  const rawTotalCost = rawList.reduce((sum, item) => sum + item.costPerServing, 0);
  const adjustedTotalCost = rawList.reduce((sum, item) => sum + (item.alreadyOwned ? 0 : item.costPerServing), 0);

  // 7. Budget Stress Level (Nuanced output)
  let budgetStressLevel: 'Relaxed' | 'Balanced' | 'Stretched' | 'Stressed' = 'Relaxed';
  let budgetStressText = '';
  let budgetStressColor = '#34C759'; // green

  const stressRatio = adjustedTotalCost / budget;
  if (stressRatio <= 0.60) {
    budgetStressLevel = 'Relaxed';
    budgetStressText = 'Your budget is under zero stress. You have comfortable room to splurge or save!';
    budgetStressColor = '#34C759'; // Apple Green
  } else if (stressRatio <= 0.90) {
    budgetStressLevel = 'Balanced';
    budgetStressText = 'Stable and optimal spending. Well balanced with your daily budget.';
    budgetStressColor = '#007AFF'; // Apple Blue / Neutral Blue
  } else if (stressRatio <= 1.00) {
    budgetStressLevel = 'Stretched';
    budgetStressText = 'Budget is getting tight. You are close to your spending limit.';
    budgetStressColor = '#FF9500'; // Orange
  } else {
    budgetStressLevel = 'Stressed';
    budgetStressText = 'Over budget! Tap suggestions to swap ingredients or switch to minimal cooking mode.';
    budgetStressColor = '#FF3B30'; // Apple Red
  }

  // 8. Find Smart Substitutions
  const smartSubstitutions: GeneratedPlan['smartSubstitutions'] = [];
  const selectedMeals = [finalBreakfast, finalLunch, finalDinner];

  selectedMeals.forEach(meal => {
    meal.ingredients.forEach(ing => {
      const subs = substitutionDb[ing.name];
      if (subs) {
        subs.forEach(sub => {
          // If the swap is cheaper (costDiff < 0) and we need savings, or if it is healthier
          const isCheaperMatch = sub.type === 'Cheaper' && budgetStressLevel !== 'Relaxed';
          const isHealthierMatch = sub.type === 'Healthier' && healthGoal !== 'Balanced';
          
          if (isCheaperMatch || isHealthierMatch) {
            smartSubstitutions.push({
              originalIngredient: ing.name,
              swapIngredient: sub.swapIngredient,
              type: sub.type,
              costDiff: sub.costDiff,
              benefitDescription: sub.benefitDescription,
              mealName: meal.name
            });
          }
        });
      }
    });
  });

  // 9. Generate specific optimization suggestions
  const optimizationSuggestions: string[] = [];
  if (budgetStressLevel === 'Stressed' || budgetStressLevel === 'Stretched') {
    const cheapSubsCount = smartSubstitutions.filter(s => s.type === 'Cheaper').length;
    if (cheapSubsCount > 0) {
      const maxSavings = smartSubstitutions
        .filter(s => s.type === 'Cheaper')
        .reduce((sum, s) => sum + Math.abs(s.costDiff), 0);
      optimizationSuggestions.push(`Apply cheap swaps below to save up to $${maxSavings.toFixed(2)}.`);
    }
    if (!minimalCookingMode) {
      optimizationSuggestions.push('Enable "Minimal Cooking Mode" to filter recipes with fewer ingredients.');
    }
    if (leftoverItems.length === 0) {
      optimizationSuggestions.push('Add ingredients currently in your fridge to activate "Fridge Reality Check" savings.');
    }
  } else {
    optimizationSuggestions.push('Great job! Your meal plan is cost-effective.');
    const healthySubs = smartSubstitutions.filter(s => s.type === 'Healthier');
    if (healthySubs.length > 0) {
      optimizationSuggestions.push('Upgrade to healthier ingredients listed below to boost nutritional value.');
    }
  }

  return {
    breakfast: finalBreakfast,
    lunch: finalLunch,
    dinner: finalDinner,
    groceryList: rawList,
    smartSubstitutions,
    rawTotalCost: parseFloat(rawTotalCost.toFixed(2)),
    adjustedTotalCost: parseFloat(adjustedTotalCost.toFixed(2)),
    budgetStressLevel,
    budgetStressText,
    budgetStressColor,
    optimizationSuggestions
  };
}
