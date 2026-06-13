export interface Substitution {
  swapIngredient: string;
  type: 'Cheaper' | 'Healthier' | 'Alternative';
  costDiff: number; // Positive means more expensive, negative means cheaper (savings)
  benefitDescription: string;
}

export const substitutionDb: Record<string, Substitution[]> = {
  'Sirloin Steak': [
    { swapIngredient: 'Ground Beef', type: 'Cheaper', costDiff: -3.50, benefitDescription: 'Budget-friendly beef option with similar iron content.' },
    { swapIngredient: 'Firm Tofu', type: 'Cheaper', costDiff: -5.30, benefitDescription: 'Lowers cholesterol and saturated fats while saving over $5.' }
  ],
  'Salmon Fillet': [
    { swapIngredient: 'Canned Tuna', type: 'Cheaper', costDiff: -3.60, benefitDescription: 'Provides protein and omega-3 fatty acids at a fraction of the price.' }
  ],
  'Chicken Breast': [
    { swapIngredient: 'Brown Lentils', type: 'Cheaper', costDiff: -1.80, benefitDescription: 'High-fiber, low-fat plant protein that is extremely cheap.' }
  ],
  'Bacon': [
    { swapIngredient: 'Turkey Bacon', type: 'Healthier', costDiff: -0.20, benefitDescription: 'Reduces calories and saturated fat intake.' },
    { swapIngredient: 'Tempeh Bacon', type: 'Healthier', costDiff: 0.40, benefitDescription: 'Cholesterol-free, high-fiber vegan alternative.' }
  ],
  'Whole Milk': [
    { swapIngredient: 'Almond Milk', type: 'Healthier', costDiff: 0.15, benefitDescription: 'Lactose-free and cuts calories by more than half.' }
  ],
  'Greek Yogurt': [
    { swapIngredient: 'Plain Yogurt', type: 'Cheaper', costDiff: -0.50, benefitDescription: 'A lighter, budget-friendly fermented dairy option.' }
  ],
  'Feta Cheese': [
    { swapIngredient: 'Firm Tofu (Marinated)', type: 'Cheaper', costDiff: -0.40, benefitDescription: 'Lowers sodium and fat while retaining salad texture.' }
  ],
  'Spaghetti': [
    { swapIngredient: 'Zucchini Noodles', type: 'Healthier', costDiff: 0.60, benefitDescription: 'Significantly cuts down carbs and calories.' }
  ],
  'Penne Pasta': [
    { swapIngredient: 'Chickpea Pasta', type: 'Healthier', costDiff: 0.80, benefitDescription: 'Doubles the protein and fiber content.' }
  ],
  'Butter': [
    { swapIngredient: 'Olive Oil', type: 'Healthier', costDiff: -0.10, benefitDescription: 'Replaces saturated fats with heart-healthy monounsaturated fats.' }
  ],
  'Cheddar Cheese': [
    { swapIngredient: 'Nutritional Yeast', type: 'Healthier', costDiff: -0.30, benefitDescription: 'Dairy-free, low-calorie cheesy flavor packed with B-vitamins.' }
  ]
};
