import { supabase } from '../lib/supabase';
import { GeneratedPlan, UserInputs } from './aiEngine';

export const Api = {
  async saveMealPlan(plan: GeneratedPlan, userId: string) {
    try {
      const { data, error } = await supabase
        .from('meal_plans')
        .insert({
          user_id: userId,
          breakfast: plan.breakfast,
          lunch: plan.lunch,
          dinner: plan.dinner,
          total_cost: plan.rawTotalCost,
          budget_stress: plan.budgetStressLevel,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (e) {
      console.error('Error saving meal plan to Supabase:', e);
      return null;
    }
  },

  async getHistory(userId: string) {
    try {
      const { data, error } = await supabase
        .from('meal_plans')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (e) {
      console.error('Error fetching history:', e);
      return [];
    }
  },

  async updatePreferences(userId: string, inputs: UserInputs) {
    try {
      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: userId,
          dietary_goals: inputs.healthGoal,
          energy_level: inputs.cognitiveLoad,
          budget_preference: inputs.budget.toString(),
          country: inputs.location?.country,
          state: inputs.location?.state
        }, { onConflict: 'user_id' });

      if (error) throw error;
    } catch (e) {
      console.error('Error updating preferences:', e);
    }
  },

  async saveInvoice(userId: string, mealPlanId: string | null, scannedTotal: number, savedAmount: number, imageUrl?: string) {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .insert({
          user_id: userId,
          meal_plan_id: mealPlanId,
          scanned_total: scannedTotal,
          saved_amount: savedAmount,
          image_url: imageUrl
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (e) {
      console.error('Error saving invoice:', e);
      return null;
    }
  }
};
