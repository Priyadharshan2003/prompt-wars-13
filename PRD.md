# PRD: CookSmart AI+ — Smart Daily Cooking & Life Planner

## 1. Product Overview
CookSmart AI+ is a cross-platform, mobile-first micro-app designed to help busy professionals plan meals, save time, track cooking expenses, and reduce decision fatigue. It provides rule-based intelligent meal suggestions aligned with user budget constraints, food preferences, time limits, energy levels, health goals, and leftover ingredients in their fridge.

The app is built using **React Native with Expo**, supporting deployment to mobile devices (via Expo Go) and the web (via Expo Web).

---

## 2. Target Audience & Core Benefits
* **Busy Professionals:** Quick planning, time-based meal suggestions, low-effort/minimal cleanup cooking options.
* **Budget-Conscious Individuals:** Active cost tracking, ingredient substitution for cheaper options, budget status indicators, and cost optimization tips.
* **Healthy Eaters:** Personalized meal matching with health goals (low calorie, high protein, balanced) and healthy substitution options.
* **Waste-Conscious Cook:** Leftover-based meal matching to reuse ingredients already present in the pantry/fridge.

---

## 3. Core Requirements & Features

### ✅ A. Meal Planning
* Generates a daily meal plan comprising **Breakfast, Lunch, and Dinner**.
* Dynamically adapts meals based on user inputs: Preference (Veg / Non-Veg), Cooking Time Available, Energy Level, and Health Goals.

### ✅ B. Smart Grocery List
* Generates an itemized list of ingredients required for the generated meal plan.
* Grouped into smart, readable categories (Produce, Proteins & Dairy, Pantry, Grains & Bakery).
* Checklist functionality allowing users to check off items they already have.

### ✅ C. Ingredient Substitutions
* Recommends smart substitutions for key ingredients.
* Categorized by utility:
  * **Cheaper Swaps:** For budget optimization.
  * **Healthier Swaps:** For low-calorie or high-nutrient diets.
  * **Common Substitutes:** In case of allergies or missing items.

---

## 4. Advanced & Novel Features

1. **🧠 Cognitive Load Mode (Mental Fatigue Based Planning):**
   * *Value:* Busy professionals often experience intense decision fatigue and low energy after work. Selecting generic recipes is frustrating when their "brain is fried."
   * *Implementation:* Users can select their cognitive fatigue state:
     * *High Energy:* Standard recipes, multi-step cooking is fine.
     * *Tired:* Prefers simple preparation, medium/low effort, <30 mins.
     * *Brain Fried:* Triggers a strict filter for no-cook/one-pot comfort meals with <= 5 ingredients and extremely brief instructions.
2. **🎲 Zero Decision Mode (One-Click Auto-Plan):**
   * *Value:* Eliminates the friction of filling out forms when a user is exhausted.
   * *Implementation:* A prominent "Zero Decision Mode" action that bypasses the input form, uses historical preferences or default settings, immediately runs the planner, and outputs a complete, optimized meal plan.
3. **🔍 Fridge Reality Check (Use Existing Ingredients):**
   * *Value:* Reduces food waste and lowers grocery bills by scanning what is already in the fridge before recommending new purchases.
   * *Implementation:* Users input ingredients they currently have (e.g. "eggs, bread, spinach"). The AI planner prioritizes recipes matching these ingredients, displays a "Fridge Match %" on meal cards, and automatically subtracts these matching items from the shopping list, updating the total estimated grocery cost.
4. **📊 Budget Stress Indicator (Comfort Levels):**
   * *Value:* Moving beyond binary "within/exceeds" indicators to show how comfortable the budget is, mirroring realistic spending comfort zones.
   * *Implementation:* Evaluates total estimated cost against the user's daily budget on a 4-level scale:
     * 🟢 **Relaxed (Cost <= 60%):** Under no stress, room to splurge.
     * 🟡 **Balanced (60% < Cost <= 90%):** Stable balance, safe and optimal.
     * 🟠 **Stretched (90% < Cost <= 100%):** Getting tight, close to the edge.
     * 🔴 **Stressed (Cost > 100%):** Over budget. Recommends cost swaps or minimal mode.
5. **Time-Based Meal Planning:** Suggests express meals (<15 mins) when time is tight, standard meals (15-40 mins), and gourmet meals (>40 mins) when time permits.
6. **Expense Tracker Ledger:** Allows logging cooking costs and grocery expenses. Persists data via local storage and displays visual spending charts.
7. **Health Goals Integration:**
   * *Low Calorie:* Focuses on vegetables, lean proteins, light vinaigrettes.
   * *High Protein:* Emphasizes chicken breast, eggs, tofu, fish, and Greek yogurt.
   * *Balanced:* Nutritious combination of healthy fats, complex carbs, and clean proteins.
8. **Daily Routine Alignment:** Suggests optimal eating window and meal timings based on wake-up and sleep hours.
9. **Minimal Cooking Mode:** Filters for recipes with 5 ingredients or fewer to reduce shopping and cooking complexity.
10. **Night Planning Mode:** Includes a toggle to switch the planner to "Tomorrow's Prep," highlighting make-ahead tasks (e.g., marinating, soaking beans, overnight oats) that can be done tonight to save time tomorrow.
11. **Budget Optimization Engine:** Suggests concrete actions (e.g., bulk purchase options, substituting organic fresh items with frozen) to bring the cost down.

---

## 5. User Flows & Screens

1. **Splash Screen:** Sleek logo, clean branding, minimal entry animation.
2. **Onboarding Screen:** Concise 3-step value proposition card with "Get Started" CTA.
3. **Input Dashboard:**
   * *Required:* Budget ($ text field), Diet (Veg/Non-Veg segment control).
   * *Optional collapsible sections:* Cognitive Load Level, Available Time, Health Goals, Fridge Reality Check (leftovers text), Wake/Sleep Timings.
   * *Actions:* "Generate Plan" (Primary CTA) and "Zero Decision Mode 🎲" (Secondary CTA).
4. **Loading State:** Minimalist skeleton screens or custom smooth spinners with cooking quotes.
5. **Results Dashboard:**
   * **Financial Analytics Card:** Budget Stress Indicator gauge (Relaxed, Balanced, Stretched, Stressed), cost-saving suggestions.
   * **Meal Plan Cards:** Breakfast, Lunch, Dinner with Fridge Match %, prep alerts, timing recommendations, effort tags, and swap options.
   * **Smart Grocery List Checklist:** Interactive checkboxes grouped by category (items already in fridge are pre-checked/omitted from cost).
   * **Substitution Matrix:** Side-by-side swap panel showing original, swap ingredient, benefit (Cheaper/Healthier), and cost delta.
   * **Tomorrow's Night Prep Card:** Actionable make-ahead steps.
   * **Expense Ledger Panel:** Interactive form to log current spending and view recent transactions.

---

## 6. Architecture & Tech Stack

### Tech Stack
* **Framework:** React Native with Expo SDK 56.
* **Languages:** TypeScript (Strict Mode).
* **Styling:** StyleSheet with custom Theme configuration (Apple / Notion design principles).
* **State Management:** React Context API for application state (User Inputs, Current Plan, Expense Ledger).
* **Storage:** AsyncStorage for local persistence of settings, onboarding status, and expense logs.
* **Platforms:** iOS, Android (via Expo Go/Expo builds), Web (Expo Web/React Native Web).

### File Structure
```
/
├── App.tsx                    # Application root & provider setup
├── app.json                   # Expo configuration
├── package.json               # Dependencies
├── src/
│   ├── components/            # Reusable UI Components
│   │   ├── Card.tsx           # Rounded corner card container
│   │   ├── Button.tsx         # Modern custom CTA button
│   │   ├── InputField.tsx     # Validated text input
│   │   ├── Dropdown.tsx      # Stylized select dropdown
│   │   ├── SegmentControl.tsx # Custom option toggles
│   │   ├── BudgetGauge.tsx    # Semi-circular budget indicator
│   │   ├── MealDetail.tsx     # Meal rendering card
│   │   └── TabView.tsx        # Toggle between planner and ledger
│   ├── logic/                 # Core domain engines
│   │   ├── aiEngine.ts        # Rule-based recipe compiler
│   │   ├── mealDatabase.ts    # Raw meal definitions and cost values
│   │   └── substitutionDb.ts  # Swap matrices (Cheaper / Healthier)
│   ├── utils/                 # Storage, validations, date formatting
│   │   ├── storage.ts         # AsyncStorage wrapper
│   │   └── formatting.ts      # Currency and time formatting
│   └── styles/                # Global Design Tokens
│       ├── colors.ts          # Apple-like neutral & accent colors
│       └── typography.ts      # System UI typography
```

---

## 7. Rule-Based AI Engine Logic
The "AI" in CookSmart AI+ is a fast, deterministic rule engine that queries `mealDatabase.ts` and scores recipes based on:
1. **Dietary Constraint (Hard Filter):** Excludes non-veg meals if Diet = "Veg".
2. **Cognitive Load Filter (Hard Filter):** If Cognitive Load = "Brain Fried", excludes recipes that are High Effort or take > 15 minutes, and overrides to Minimal Cooking Mode (<= 5 ingredients).
3. **Minimal Cooking Filter (Hard Filter):** If Minimal Cooking Mode is active, only items with <= 5 ingredients are kept.
4. **Fridge Reality Check Matching (Weight 0.4):** Scans the fridge ingredients list. Each match increases the recipe's priority. Recomputing matched items dynamically checks them off the grocery list and adjusts the grocery total.
5. **Time & Effort Score (Weight 0.3):** Prioritizes recipes matching user's cook time and energy levels.
6. **Health Goal Match (Weight 0.3):** Ranks protein-heavy or low-calorie meals higher depending on selected goal.
7. **Budget Optimizing Sorter:** Compiles the combination of Breakfast, Lunch, and Dinner. If the sum exceeds the budget, it scans for lower-cost alternative meals or applies ingredient substitutions to lower the estimated cost of the selected meals.

---

## 8. UX/UI & Design System (Notion meets Apple)
* **Theme:** Clean Light/Dark Neutral UI.
* **Palette:**
  * Backgrounds: White `#FFFFFF` / Soft Grey `#F8F9FA` / Notion Slate `#191919`.
  * Borders: Slate Grey `#E5E7EB` / `#2D2D2D`.
  * Accents: Apple Green `#34C759` (Success/Within Budget), Apple Red `#FF3B30` (Warning/Exceeds Budget), Deep Blue `#007AFF` (Primary CTA).
  * Typography: Inter / System Font Stack. Medium/Bold weights for headings, regular for descriptions.
* **Visual Polish:**
  * Box Shadows: Very soft, diffuse shadows (`shadowOpacity: 0.05`, `shadowRadius: 10`).
  * Borders: Rounded corners (`borderRadius: 12` or `16`).
  * Spacing: Multiples of 8px grid (8, 16, 24, 32).
