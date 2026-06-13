export interface Ingredient {
  name: string;
  quantity: string;
  category: 'Produce' | 'Protein & Dairy' | 'Pantry' | 'Grains & Bakery';
  costPerServing: number;
}

export interface Meal {
  id: string;
  name: string;
  type: 'Breakfast' | 'Lunch' | 'Dinner';
  diet: 'Veg' | 'Non-Veg';
  time: number; // in minutes
  effort: 'Low' | 'Medium' | 'High';
  healthGoal: 'Low Calorie' | 'High Protein' | 'Balanced';
  ingredients: Ingredient[];
  youtubeLink?: string;
  prepInstructions: string[];
  prepAheadTask?: string; // Night planning tasks
}

export const mealDatabase: Meal[] = [
  // --- TAMIL NADU REGIONALS ---
  {
    id: 'tn_b1',
    name: 'Idli and Sambar',
    type: 'Breakfast',
    diet: 'Veg',
    time: 20,
    effort: 'Low',
    healthGoal: 'Balanced',
    youtubeLink: 'https://www.youtube.com/results?search_query=how+to+make+idli+sambar+tamil+nadu',
    ingredients: [
      { name: 'Idli Batter', quantity: '2 cups', category: 'Protein & Dairy', costPerServing: 1.50 },
      { name: 'Lentils (Toor Dal)', quantity: '0.5 cup', category: 'Pantry', costPerServing: 0.80 },
      { name: 'Mixed Vegetables', quantity: '1 cup', category: 'Produce', costPerServing: 1.20 }
    ],
    prepInstructions: ['Steam the idlis.', 'Prepare sambar with cooked lentils and vegetables.', 'Serve warm.']
  },
  {
    id: 'tn_l1',
    name: 'Sambar Rice and Potato Fry',
    type: 'Lunch',
    diet: 'Veg',
    time: 30,
    effort: 'Medium',
    healthGoal: 'Balanced',
    youtubeLink: 'https://www.youtube.com/results?search_query=sambar+rice+potato+fry+recipe',
    ingredients: [
      { name: 'Rice', quantity: '1 cup', category: 'Pantry', costPerServing: 0.50 },
      { name: 'Lentils (Toor Dal)', quantity: '0.5 cup', category: 'Pantry', costPerServing: 0.80 },
      { name: 'Potatoes', quantity: '2', category: 'Produce', costPerServing: 1.00 },
      { name: 'Sambar Powder', quantity: '2 tbsp', category: 'Pantry', costPerServing: 0.30 }
    ],
    prepInstructions: ['Cook rice and dal together.', 'Prepare sambar.', 'Sauté diced potatoes until crispy.']
  },
  {
    id: 'tn_d1',
    name: 'Chapathi and Vegetable Kurma',
    type: 'Dinner',
    diet: 'Veg',
    time: 35,
    effort: 'Medium',
    healthGoal: 'Balanced',
    youtubeLink: 'https://www.youtube.com/results?search_query=chapathi+vegetable+kurma+recipe',
    ingredients: [
      { name: 'Wheat Flour', quantity: '1 cup', category: 'Pantry', costPerServing: 0.40 },
      { name: 'Mixed Vegetables', quantity: '1.5 cups', category: 'Produce', costPerServing: 1.50 },
      { name: 'Coconut Milk', quantity: '0.5 cup', category: 'Pantry', costPerServing: 1.00 }
    ],
    prepInstructions: ['Knead dough and roll out chapathis.', 'Prepare vegetable curry with coconut milk.']
  },
  {
    id: 'tn_d2',
    name: 'Chicken Chettinad and Rice',
    type: 'Dinner',
    diet: 'Non-Veg',
    time: 45,
    effort: 'High',
    healthGoal: 'High Protein',
    youtubeLink: 'https://www.youtube.com/results?search_query=authentic+chicken+chettinad+recipe',
    ingredients: [
      { name: 'Chicken Breast', quantity: '200g', category: 'Protein & Dairy', costPerServing: 3.50 },
      { name: 'Chettinad Masala', quantity: '2 tbsp', category: 'Pantry', costPerServing: 0.50 },
      { name: 'Rice', quantity: '1 cup', category: 'Pantry', costPerServing: 0.50 }
    ],
    prepInstructions: ['Sauté chicken with Chettinad spices.', 'Serve with steamed rice.']
  },

  // --- BREAKFAST (VEG) ---
  {
    id: 'b_veg_bal',
    name: 'Apple Cinnamon Oatmeal',
    type: 'Breakfast',
    diet: 'Veg',
    time: 12,
    effort: 'Low',
    healthGoal: 'Balanced',
    ingredients: [
      { name: 'Rolled Oats', quantity: '1/2 cup', category: 'Pantry', costPerServing: 0.30 },
      { name: 'Apple', quantity: '1 medium', category: 'Produce', costPerServing: 0.70 },
      { name: 'Whole Milk', quantity: '1 cup', category: 'Protein & Dairy', costPerServing: 0.40 },
      { name: 'Cinnamon', quantity: '1/2 tsp', category: 'Pantry', costPerServing: 0.10 },
      { name: 'Maple Syrup', quantity: '1 tbsp', category: 'Pantry', costPerServing: 0.30 }
    ],
    prepInstructions: [
      'Combine oats, sliced apple, milk, and cinnamon in a small pot.',
      'Bring to a gentle boil, then simmer for 5-7 minutes, stirring occasionally, until oats are soft.',
      'Drizzle maple syrup on top and serve hot.'
    ],
    prepAheadTask: 'Chop the apple and portion out the dry oats tonight.'
  },
  {
    id: 'b_veg_prot',
    name: 'Greek Yogurt Power Bowl',
    type: 'Breakfast',
    diet: 'Veg',
    time: 5,
    effort: 'Low',
    healthGoal: 'High Protein',
    ingredients: [
      { name: 'Greek Yogurt', quantity: '1 cup', category: 'Protein & Dairy', costPerServing: 1.20 },
      { name: 'Honey', quantity: '1 tbsp', category: 'Pantry', costPerServing: 0.20 },
      { name: 'Walnuts', quantity: '2 tbsp', category: 'Pantry', costPerServing: 0.50 },
      { name: 'Chia Seeds', quantity: '1 tsp', category: 'Pantry', costPerServing: 0.20 },
      { name: 'Banana', quantity: '1 medium', category: 'Produce', costPerServing: 0.40 }
    ],
    prepInstructions: [
      'Scoop Greek yogurt into a clean breakfast bowl.',
      'Top with sliced banana, walnuts, and chia seeds.',
      'Drizzle honey over the ingredients and serve immediately.'
    ],
    prepAheadTask: 'Toast the walnuts in a pan tonight to enhance their flavor for tomorrow.'
  },
  {
    id: 'b_veg_cal',
    name: 'Light Spinach Scramble',
    type: 'Breakfast',
    diet: 'Veg',
    time: 10,
    effort: 'Low',
    healthGoal: 'Low Calorie',
    ingredients: [
      { name: 'Egg Whites', quantity: '3 large', category: 'Protein & Dairy', costPerServing: 0.90 },
      { name: 'Spinach', quantity: '1 cup', category: 'Produce', costPerServing: 0.50 },
      { name: 'Cherry Tomatoes', quantity: '1/2 cup', category: 'Produce', costPerServing: 0.40 },
      { name: 'Olive Oil', quantity: '1 tsp', category: 'Pantry', costPerServing: 0.10 },
      { name: 'Salt & Pepper', quantity: '1 pinch', category: 'Pantry', costPerServing: 0.10 }
    ],
    prepInstructions: [
      'Heat olive oil in a non-stick skillet over medium heat.',
      'Add halved cherry tomatoes and spinach, sautéing for 2 minutes until spinach is wilted.',
      'Pour in egg whites, season with salt and pepper, and scramble gently for 3-4 minutes.'
    ],
    prepAheadTask: 'Wash and dry the spinach and halve the cherry tomatoes tonight.'
  },

  // --- BREAKFAST (NON-VEG / COGNITIVE LOAD OPTIONS) ---
  {
    id: 'b_nveg_prot',
    name: 'Bacon & Cheddar Egg Muffins',
    type: 'Breakfast',
    diet: 'Non-Veg',
    time: 25,
    effort: 'Medium',
    healthGoal: 'High Protein',
    ingredients: [
      { name: 'Eggs', quantity: '2 large', category: 'Protein & Dairy', costPerServing: 0.60 },
      { name: 'Bacon', quantity: '2 strips', category: 'Protein & Dairy', costPerServing: 1.20 },
      { name: 'Spinach', quantity: '1/2 cup', category: 'Produce', costPerServing: 0.25 },
      { name: 'Cheddar Cheese', quantity: '1/4 cup', category: 'Protein & Dairy', costPerServing: 0.85 },
      { name: 'Salt & Pepper', quantity: '1 pinch', category: 'Pantry', costPerServing: 0.10 }
    ],
    prepInstructions: [
      'Preheat oven to 375°F (190°C) and grease a muffin pan.',
      'Whisk eggs in a bowl with salt and pepper.',
      'Chop bacon and spinach, and distribute evenly among muffin cups.',
      'Pour whisked eggs over, sprinkle cheese on top, and bake for 15-18 minutes until set.'
    ],
    prepAheadTask: 'Bake the egg muffins tonight, store them in the fridge, and microwave for 30s tomorrow.'
  },
  {
    id: 'b_nveg_bal',
    name: 'Turkey Breakfast Wrap',
    type: 'Breakfast',
    diet: 'Non-Veg',
    time: 15,
    effort: 'Medium',
    healthGoal: 'Balanced',
    ingredients: [
      { name: 'Turkey Bacon', quantity: '2 slices', category: 'Protein & Dairy', costPerServing: 1.00 },
      { name: 'Egg', quantity: '1 large', category: 'Protein & Dairy', costPerServing: 0.30 },
      { name: 'Whole Wheat Tortilla', quantity: '1 large', category: 'Grains & Bakery', costPerServing: 0.50 },
      { name: 'Spinach', quantity: '1/2 cup', category: 'Produce', costPerServing: 0.25 },
      { name: 'Avocado', quantity: '1/2 medium', category: 'Produce', costPerServing: 1.00 }
    ],
    prepInstructions: [
      'Cook turkey bacon in a skillet until crisp, then set aside.',
      'Scramble the egg in the same skillet.',
      'Warm the tortilla, then layer turkey bacon, scrambled egg, spinach, and sliced avocado.',
      'Roll tightly, slice in half, and enjoy.'
    ],
    prepAheadTask: 'Slice the avocado and place it in an airtight container with a squeeze of lemon.'
  },

  // --- LUNCH (VEG) ---
  {
    id: 'l_veg_bal',
    name: 'Mediterranean Chickpea Salad',
    type: 'Lunch',
    diet: 'Veg',
    time: 15,
    effort: 'Medium',
    healthGoal: 'Balanced',
    ingredients: [
      { name: 'Canned Chickpeas', quantity: '1 can', category: 'Pantry', costPerServing: 0.90 },
      { name: 'Cucumber', quantity: '1/2 medium', category: 'Produce', costPerServing: 0.40 },
      { name: 'Cherry Tomatoes', quantity: '1/2 cup', category: 'Produce', costPerServing: 0.40 },
      { name: 'Feta Cheese', quantity: '1/4 cup', category: 'Protein & Dairy', costPerServing: 0.90 },
      { name: 'Olive Oil', quantity: '1 tbsp', category: 'Pantry', costPerServing: 0.20 },
      { name: 'Lemon Juice', quantity: '1 tbsp', category: 'Produce', costPerServing: 0.20 }
    ],
    prepInstructions: [
      'Rinse and drain the canned chickpeas.',
      'Chop cucumber and halve the cherry tomatoes.',
      'In a medium bowl, combine chickpeas, cucumber, tomatoes, and crumbled feta cheese.',
      'Drizzle olive oil and lemon juice, toss well, and season with salt and pepper.'
    ],
    prepAheadTask: 'Combine chickpeas, diced cucumber, tomatoes, and feta in a bowl tonight, adding dressing tomorrow.'
  },
  {
    id: 'l_veg_prot',
    name: 'Crispy Tofu Broccoli Rice',
    type: 'Lunch',
    diet: 'Veg',
    time: 25,
    effort: 'Medium',
    healthGoal: 'High Protein',
    ingredients: [
      { name: 'Firm Tofu', quantity: '150g', category: 'Protein & Dairy', costPerServing: 1.20 },
      { name: 'Brown Rice', quantity: '1 cup cooked', category: 'Pantry', costPerServing: 0.40 },
      { name: 'Broccoli', quantity: '1 cup florets', category: 'Produce', costPerServing: 0.70 },
      { name: 'Soy Sauce', quantity: '1.5 tbsp', category: 'Pantry', costPerServing: 0.15 },
      { name: 'Sesame Oil', quantity: '1 tsp', category: 'Pantry', costPerServing: 0.15 },
      { name: 'Garlic Powder', quantity: '1/2 tsp', category: 'Pantry', costPerServing: 0.10 }
    ],
    prepInstructions: [
      'Press the tofu to remove excess moisture, then cut into cubes.',
      'Sauté tofu in a pan with sesame oil until golden-brown and crispy (7-8 mins).',
      'Add broccoli florets and soy sauce, cover, and steam for 4 minutes.',
      'Stir in garlic powder and serve over warm brown rice.'
    ],
    prepAheadTask: 'Press tofu under a heavy plate and cook the brown rice tonight.'
  },
  {
    id: 'l_veg_cal',
    name: 'Hummus & Veggie Wrap',
    type: 'Lunch',
    diet: 'Veg',
    time: 8,
    effort: 'Low',
    healthGoal: 'Low Calorie',
    ingredients: [
      { name: 'Hummus', quantity: '3 tbsp', category: 'Pantry', costPerServing: 0.60 },
      { name: 'Whole Wheat Tortilla', quantity: '1 large', category: 'Grains & Bakery', costPerServing: 0.50 },
      { name: 'Cucumber', quantity: '1/4 medium', category: 'Produce', costPerServing: 0.20 },
      { name: 'Bell Pepper', quantity: '1/2 medium', category: 'Produce', costPerServing: 0.60 },
      { name: 'Carrots', quantity: '1/4 cup shredded', category: 'Produce', costPerServing: 0.30 }
    ],
    prepInstructions: [
      'Lay the tortilla flat and spread hummus evenly across the surface.',
      'Thinly slice cucumber and bell pepper.',
      'Layer sliced cucumber, bell pepper, and shredded carrots down the center of the tortilla.',
      'Roll up tightly, tucking in the ends, and slice diagonally.'
    ],
    prepAheadTask: 'Julienne the cucumber and bell pepper tonight to keep them crisp and ready.'
  },

  // --- LUNCH (NON-VEG) ---
  {
    id: 'l_nveg_prot',
    name: 'Lemon Herb Chicken Salad',
    type: 'Lunch',
    diet: 'Non-Veg',
    time: 20,
    effort: 'Medium',
    healthGoal: 'High Protein',
    ingredients: [
      { name: 'Chicken Breast', quantity: '150g', category: 'Protein & Dairy', costPerServing: 2.20 },
      { name: 'Mixed Greens', quantity: '2 cups', category: 'Produce', costPerServing: 1.00 },
      { name: 'Cherry Tomatoes', quantity: '1/2 cup', category: 'Produce', costPerServing: 0.40 },
      { name: 'Olive Oil', quantity: '1 tbsp', category: 'Pantry', costPerServing: 0.20 },
      { name: 'Lemon Juice', quantity: '1 tbsp', category: 'Produce', costPerServing: 0.20 }
    ],
    prepInstructions: [
      'Season chicken breast with salt, pepper, and herbs. Grill in a hot skillet for 6-7 minutes per side.',
      'Let chicken rest for 3 minutes, then slice thinly.',
      'Arrange mixed greens and halved cherry tomatoes in a large bowl.',
      'Top with chicken, drizzle olive oil and lemon juice, and serve.'
    ],
    prepAheadTask: 'Grill and slice the chicken breast tonight to quickly toss the salad tomorrow.'
  },
  {
    id: 'l_nveg_bal',
    name: 'Teriyaki Salmon Bowl',
    type: 'Lunch',
    diet: 'Non-Veg',
    time: 35,
    effort: 'High',
    healthGoal: 'Balanced',
    ingredients: [
      { name: 'Salmon Fillet', quantity: '120g', category: 'Protein & Dairy', costPerServing: 4.80 },
      { name: 'White Rice', quantity: '1 cup cooked', category: 'Pantry', costPerServing: 0.30 },
      { name: 'Broccoli', quantity: '1 cup florets', category: 'Produce', costPerServing: 0.70 },
      { name: 'Teriyaki Sauce', quantity: '2 tbsp', category: 'Pantry', costPerServing: 0.40 },
      { name: 'Green Onion', quantity: '1 stalk', category: 'Produce', costPerServing: 0.15 }
    ],
    prepInstructions: [
      'Brush salmon with teriyaki sauce and bake at 400°F (200°C) for 12-15 minutes.',
      'Steam broccoli florets in the microwave or a steamer basket for 4 minutes.',
      'Assemble the bowl with a base of white rice, topped with salmon, broccoli, and chopped green onions.'
    ],
    prepAheadTask: 'Marinate the salmon in teriyaki sauce overnight in a ziploc bag.'
  },

  // --- DINNER (VEG) ---
  {
    id: 'd_veg_bal',
    name: 'Garlic Herb Spaghetti',
    type: 'Dinner',
    diet: 'Veg',
    time: 15,
    effort: 'Low',
    healthGoal: 'Balanced',
    ingredients: [
      { name: 'Spaghetti', quantity: '80g', category: 'Pantry', costPerServing: 0.40 },
      { name: 'Olive Oil', quantity: '2 tbsp', category: 'Pantry', costPerServing: 0.40 },
      { name: 'Garlic', quantity: '3 cloves', category: 'Produce', costPerServing: 0.15 },
      { name: 'Parmesan Cheese', quantity: '2 tbsp', category: 'Protein & Dairy', costPerServing: 0.60 },
      { name: 'Cherry Tomatoes', quantity: '1/2 cup', category: 'Produce', costPerServing: 0.40 },
      { name: 'Basil', quantity: '4-5 leaves', category: 'Produce', costPerServing: 0.30 }
    ],
    prepInstructions: [
      'Boil spaghetti in salted water according to package instructions, then drain.',
      'Heat olive oil in a pan, add minced garlic and halved cherry tomatoes, and sauté for 2 minutes.',
      'Toss spaghetti in the pan with olive oil, garlic, and tomatoes.',
      'Plate and garnish with grated parmesan and fresh basil.'
    ],
    prepAheadTask: 'Mince the garlic and wash/dry basil leaves tonight.'
  },
  {
    id: 'd_veg_prot',
    name: 'Sweet Potato & Black Bean Chili',
    type: 'Dinner',
    diet: 'Veg',
    time: 45,
    effort: 'High',
    healthGoal: 'High Protein',
    ingredients: [
      { name: 'Sweet Potato', quantity: '1 medium', category: 'Produce', costPerServing: 0.60 },
      { name: 'Black Beans', quantity: '1 can', category: 'Pantry', costPerServing: 0.90 },
      { name: 'Canned Tomatoes', quantity: '1 cup', category: 'Pantry', costPerServing: 0.40 },
      { name: 'Onion', quantity: '1/2 medium', category: 'Produce', costPerServing: 0.25 },
      { name: 'Chili Powder', quantity: '1 tsp', category: 'Pantry', costPerServing: 0.10 },
      { name: 'Avocado', quantity: '1/2 medium', category: 'Produce', costPerServing: 1.00 }
    ],
    prepInstructions: [
      'Peel and dice sweet potato. Chop onion.',
      'Sauté onion in a large pot, then add sweet potato, chili powder, and canned tomatoes.',
      'Pour in 1 cup of water, cover, and simmer on medium-low for 25 minutes until potato is tender.',
      'Rinse, drain, and stir in black beans, cooking for 5 more minutes. Top with sliced avocado.'
    ],
    prepAheadTask: 'Peel and cube the sweet potatoes and chop the onions tonight to save 15 minutes.'
  },
  {
    id: 'd_veg_cal',
    name: 'Cauliflower Chickpea Curry',
    type: 'Dinner',
    diet: 'Veg',
    time: 30,
    effort: 'Medium',
    healthGoal: 'Low Calorie',
    ingredients: [
      { name: 'Cauliflower', quantity: '1.5 cups florets', category: 'Produce', costPerServing: 1.20 },
      { name: 'Canned Chickpeas', quantity: '1/2 can', category: 'Pantry', costPerServing: 0.45 },
      { name: 'Light Coconut Milk', quantity: '1/2 cup', category: 'Pantry', costPerServing: 0.60 },
      { name: 'Curry Powder', quantity: '1.5 tsp', category: 'Pantry', costPerServing: 0.15 },
      { name: 'Spinach', quantity: '1 cup', category: 'Produce', costPerServing: 0.50 }
    ],
    prepInstructions: [
      'In a saucepan, stir together light coconut milk and curry powder.',
      'Add cauliflower florets and drained chickpeas. Simmer covered for 15-20 minutes.',
      'Remove lid, fold in fresh spinach, and stir until wilted (about 2 minutes). Serve warm.'
    ],
    prepAheadTask: 'Cut cauliflower into small florets and store in a container tonight.'
  },

  // --- DINNER (NON-VEG) ---
  {
    id: 'd_nveg_prot',
    name: 'Garlic Butter Steak & Asparagus',
    type: 'Dinner',
    diet: 'Non-Veg',
    time: 25,
    effort: 'Medium',
    healthGoal: 'High Protein',
    ingredients: [
      { name: 'Sirloin Steak', quantity: '180g', category: 'Protein & Dairy', costPerServing: 6.50 },
      { name: 'Asparagus', quantity: '1/2 bunch', category: 'Produce', costPerServing: 1.50 },
      { name: 'Butter', quantity: '1.5 tbsp', category: 'Protein & Dairy', costPerServing: 0.30 },
      { name: 'Garlic', quantity: '2 cloves', category: 'Produce', costPerServing: 0.10 },
      { name: 'Olive Oil', quantity: '1 tsp', category: 'Pantry', costPerServing: 0.10 }
    ],
    prepInstructions: [
      'Trim tough ends off asparagus. Pat steak dry and season generously with salt and pepper.',
      'Heat oil in a skillet on high. Sear steak for 3-4 minutes per side. Toss in butter and minced garlic, basting steak.',
      'Remove steak to rest. In the same skillet, cook asparagus in the leftover garlic butter for 4 minutes.'
    ],
    prepAheadTask: 'Trim the asparagus stalks and mince the garlic cloves tonight.'
  },
  {
    id: 'd_nveg_bal',
    name: 'Chicken Pesto Pasta',
    type: 'Dinner',
    diet: 'Non-Veg',
    time: 30,
    effort: 'High',
    healthGoal: 'Balanced',
    ingredients: [
      { name: 'Chicken Breast', quantity: '150g', category: 'Protein & Dairy', costPerServing: 2.20 },
      { name: 'Penne Pasta', quantity: '80g', category: 'Pantry', costPerServing: 0.40 },
      { name: 'Pesto Sauce', quantity: '2 tbsp', category: 'Pantry', costPerServing: 0.80 },
      { name: 'Cherry Tomatoes', quantity: '1/2 cup', category: 'Produce', costPerServing: 0.40 },
      { name: 'Parmesan Cheese', quantity: '1 tbsp', category: 'Protein & Dairy', costPerServing: 0.30 }
    ],
    prepInstructions: [
      'Cook penne pasta in boiling water, drain, and set aside.',
      'Cube chicken breast and cook in a pan until golden and cooked through (6-8 minutes).',
      'Add cherry tomatoes to the pan and cook for 2 minutes.',
      'Combine pasta, chicken, tomatoes, and pesto sauce in the pan, tossing to coat. Top with parmesan.'
    ],
    prepAheadTask: 'Cube the chicken breast and place in a covered dish in the fridge tonight.'
  },

  // --- BRAIN FRIED / MINIMAL COOKING SAFE RECIPES (<=5 INGREDIENTS) ---
  {
    id: 'b_bf_grilled_cheese',
    name: 'Comforting Grilled Cheese',
    type: 'Dinner',
    diet: 'Veg',
    time: 8,
    effort: 'Low',
    healthGoal: 'Balanced',
    ingredients: [
      { name: 'Bread', quantity: '2 slices', category: 'Grains & Bakery', costPerServing: 0.40 },
      { name: 'Cheddar Cheese', quantity: '2 slices', category: 'Protein & Dairy', costPerServing: 0.80 },
      { name: 'Butter', quantity: '1 tbsp', category: 'Protein & Dairy', costPerServing: 0.20 }
    ],
    prepInstructions: [
      'Butter one side of each bread slice.',
      'Place cheddar cheese between the non-buttered sides.',
      'Grill in a skillet on medium heat for 3-4 minutes per side until golden brown and cheese is melted.'
    ],
    prepAheadTask: 'Place bread and cheese on a plate so they are ready to grill.'
  },
  {
    id: 'b_bf_toast',
    name: 'Peanut Butter Banana Toast',
    type: 'Breakfast',
    diet: 'Veg',
    time: 4,
    effort: 'Low',
    healthGoal: 'Balanced',
    ingredients: [
      { name: 'Bread', quantity: '1 slice', category: 'Grains & Bakery', costPerServing: 0.20 },
      { name: 'Peanut Butter', quantity: '2 tbsp', category: 'Pantry', costPerServing: 0.40 },
      { name: 'Banana', quantity: '1/2 medium', category: 'Produce', costPerServing: 0.20 }
    ],
    prepInstructions: [
      'Toast the slice of bread until golden-brown.',
      'Spread peanut butter evenly over the hot toast.',
      'Top with sliced banana and serve immediately.'
    ],
    prepAheadTask: 'Keep bread and peanut butter jar next to the toaster tonight.'
  },
  {
    id: 'b_bf_quesadilla',
    name: 'Quick Pesto Quesadilla',
    type: 'Lunch',
    diet: 'Veg',
    time: 7,
    effort: 'Low',
    healthGoal: 'Balanced',
    ingredients: [
      { name: 'Flour Tortilla', quantity: '1 large', category: 'Grains & Bakery', costPerServing: 0.50 },
      { name: 'Cheddar Cheese', quantity: '1/3 cup shredded', category: 'Protein & Dairy', costPerServing: 0.90 },
      { name: 'Pesto Sauce', quantity: '1 tbsp', category: 'Pantry', costPerServing: 0.40 }
    ],
    prepInstructions: [
      'Spread pesto sauce on one half of the tortilla.',
      'Sprinkle cheese over the pesto and fold the tortilla in half.',
      'Cook in a dry pan on medium heat for 3 minutes per side until crisp and cheese melts.'
    ],
    prepAheadTask: 'Shred cheese and set aside in a small bowl tonight.'
  },
  {
    id: 'b_bf_tuna_wrap',
    name: 'Simple Tuna Salad Wrap',
    type: 'Lunch',
    diet: 'Non-Veg',
    time: 6,
    effort: 'Low',
    healthGoal: 'High Protein',
    ingredients: [
      { name: 'Canned Tuna', quantity: '1 can', category: 'Pantry', costPerServing: 1.20 },
      { name: 'Mayonnaise', quantity: '1.5 tbsp', category: 'Pantry', costPerServing: 0.20 },
      { name: 'Whole Wheat Tortilla', quantity: '1 large', category: 'Grains & Bakery', costPerServing: 0.50 },
      { name: 'Celery', quantity: '1 stalk', category: 'Produce', costPerServing: 0.20 }
    ],
    prepInstructions: [
      'Drain canned tuna and finely chop the celery.',
      'In a small bowl, mix tuna, chopped celery, and mayonnaise.',
      'Spread the tuna salad down the center of the tortilla, roll tightly, and serve.'
    ],
    prepAheadTask: 'Dice the celery and place in a container in the fridge tonight.'
  }
];
