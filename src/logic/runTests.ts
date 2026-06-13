import { generateMealPlan, UserInputs } from './aiEngine';

declare const process: any;


function runTests() {
  console.log('🧪 Starting CookSmart AI+ Test Suite...\n');
  let passed = true;

  const assert = (condition: boolean, message: string) => {
    if (condition) {
      console.log(`✅ PASS: ${message}`);
    } else {
      console.error(`❌ FAIL: ${message}`);
      passed = false;
    }
  };

  // Test Case 1: Dietary Hard Filter (Veg Plan)
  try {
    const inputs: UserInputs = {
      budget: 30,
      diet: 'Veg',
      cognitiveLoad: 'Tired',
      timeAvailable: 'Medium',
      healthGoal: 'Balanced',
      leftovers: '',
      minimalCookingMode: false,
      nightPlanningMode: true
    };
    const plan = generateMealPlan(inputs);
    assert(
      plan.breakfast.diet === 'Veg' && plan.lunch.diet === 'Veg' && plan.dinner.diet === 'Veg',
      'Veg diet filter strictly excludes Non-Veg meals'
    );
  } catch (e: any) {
    assert(false, `Test Case 1 threw error: ${e.message}`);
  }

  // Test Case 2: Cognitive Load Filter (Brain Fried Mode)
  try {
    const inputs: UserInputs = {
      budget: 30,
      diet: 'Non-Veg',
      cognitiveLoad: 'Brain Fried',
      timeAvailable: 'Short',
      healthGoal: 'Balanced',
      leftovers: '',
      minimalCookingMode: false,
      nightPlanningMode: true
    };
    const plan = generateMealPlan(inputs);
    
    const bSafe = plan.breakfast.effort === 'Low' && plan.breakfast.time <= 15 && plan.breakfast.ingredients.length <= 5;
    const lSafe = plan.lunch.effort === 'Low' && plan.lunch.time <= 15 && plan.lunch.ingredients.length <= 5;
    const dSafe = plan.dinner.effort === 'Low' && plan.dinner.time <= 15 && plan.dinner.ingredients.length <= 5;

    assert(
      bSafe && lSafe && dSafe,
      'Brain Fried mode limits meals to Low Effort, <=15 minutes, and <=5 ingredients'
    );
  } catch (e: any) {
    assert(false, `Test Case 2 threw error: ${e.message}`);
  }

  // Test Case 3: Fridge Reality Check (Leftovers matching)
  try {
    const inputs: UserInputs = {
      budget: 30,
      diet: 'Veg',
      cognitiveLoad: 'High Energy',
      timeAvailable: 'Long',
      healthGoal: 'High Protein',
      leftovers: 'banana, chia seeds',
      minimalCookingMode: false,
      nightPlanningMode: true
    };
    const plan = generateMealPlan(inputs);
    // Greek Yogurt Power Bowl contains banana and chia seeds
    assert(
      plan.breakfast.id === 'b_veg_prot',
      'Leftovers matching prioritizes Greek Yogurt bowl when banana and chia seeds are in the fridge'
    );
    // Check that banana and chia seeds in the grocery list are marked as alreadyOwned = true
    const bananaItem = plan.groceryList.find(i => i.name === 'Banana');
    const chiaItem = plan.groceryList.find(i => i.name === 'Chia Seeds');
    assert(
      bananaItem?.alreadyOwned === true && chiaItem?.alreadyOwned === true,
      'Leftover items in fridge are correctly flagged as alreadyOwned'
    );
  } catch (e: any) {
    assert(false, `Test Case 3 threw error: ${e.message}`);
  }

  // Test Case 4: Budget Stress Levels
  try {
    // Very high budget -> Relaxed
    const inputsRelaxed: UserInputs = {
      budget: 100,
      diet: 'Veg',
      cognitiveLoad: 'Tired',
      timeAvailable: 'Medium',
      healthGoal: 'Balanced',
      leftovers: '',
      minimalCookingMode: false,
      nightPlanningMode: true
    };
    const planRelaxed = generateMealPlan(inputsRelaxed);
    assert(
      planRelaxed.budgetStressLevel === 'Relaxed',
      'Large budget ratio yields "Relaxed" stress level'
    );

    // Tight budget -> Stressed
    const inputsStressed: UserInputs = {
      budget: 5,
      diet: 'Non-Veg',
      cognitiveLoad: 'Tired',
      timeAvailable: 'Medium',
      healthGoal: 'Balanced',
      leftovers: '',
      minimalCookingMode: false,
      nightPlanningMode: true
    };
    const planStressed = generateMealPlan(inputsStressed);
    assert(
      planStressed.budgetStressLevel === 'Stressed',
      'Budget smaller than total meal cost yields "Stressed" stress level'
    );
  } catch (e: any) {
    assert(false, `Test Case 4 threw error: ${e.message}`);
  }

  // Test Case 5: Smart Substitutions Suggestion
  try {
    // Stressed budget with beef steak dinner should trigger cheaper substitutions
    const inputs: UserInputs = {
      budget: 6,
      diet: 'Non-Veg',
      cognitiveLoad: 'Tired',
      timeAvailable: 'Long',
      healthGoal: 'High Protein',
      leftovers: '',
      minimalCookingMode: false,
      nightPlanningMode: true
    };
    const plan = generateMealPlan(inputs);
    // Sirloin Steak has Cheaper swaps like Firm Tofu or Ground Beef
    const hasBeefSwap = plan.smartSubstitutions.some(s => s.originalIngredient === 'Sirloin Steak');
    assert(
      hasBeefSwap,
      'Stressed budget recommends cheaper substitutions for high cost ingredients'
    );
  } catch (e: any) {
    assert(false, `Test Case 5 threw error: ${e.message}`);
  }

  console.log('\n----------------------------------------');
  if (passed) {
    console.log('🎉 ALL TESTS PASSED SUCCESSFULLY!');
    process.exit(0);
  } else {
    console.error('🚨 TEST SUITE FAILED!');
    process.exit(1);
  }
}

runTests();
