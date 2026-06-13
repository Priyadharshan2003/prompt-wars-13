import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserInputs } from '../logic/aiEngine';

const ONBOARDING_KEY = '@cooksmart:onboarding';
const INPUTS_KEY = '@cooksmart:inputs';
const EXPENSES_KEY = '@cooksmart:expenses';
const GUEST_KEY = '@cooksmart:guest_mode';

export interface ExpenseItem {
  id: string;
  date: string; // ISO string or date string
  description: string;
  amount: number;
  category: 'Grocery' | 'Meal Cost' | 'Other';
}

export const Storage = {
  // Onboarding Status
  async getOnboardingCompleted(): Promise<boolean> {
    try {
      const val = await AsyncStorage.getItem(ONBOARDING_KEY);
      return val === 'true';
    } catch {
      return false;
    }
  },

  async setOnboardingCompleted(completed: boolean): Promise<void> {
    try {
      await AsyncStorage.setItem(ONBOARDING_KEY, completed ? 'true' : 'false');
    } catch (e) {
      console.error('Error saving onboarding status', e);
    }
  },

  // Guest Mode
  async getGuestMode(): Promise<boolean> {
    try {
      const val = await AsyncStorage.getItem(GUEST_KEY);
      return val === 'true';
    } catch {
      return false;
    }
  },

  async setGuestMode(isGuest: boolean): Promise<void> {
    try {
      await AsyncStorage.setItem(GUEST_KEY, isGuest ? 'true' : 'false');
    } catch (e) {
      console.error('Error saving guest mode', e);
    }
  },

  // Saved Planner Inputs
  async getSavedInputs(): Promise<UserInputs | null> {
    try {
      const val = await AsyncStorage.getItem(INPUTS_KEY);
      return val ? JSON.parse(val) : null;
    } catch {
      return null;
    }
  },

  async saveInputs(inputs: UserInputs): Promise<void> {
    try {
      await AsyncStorage.setItem(INPUTS_KEY, JSON.stringify(inputs));
    } catch (e) {
      console.error('Error saving inputs', e);
    }
  },

  // Expense Ledger Items
  async getExpenses(): Promise<ExpenseItem[]> {
    try {
      const val = await AsyncStorage.getItem(EXPENSES_KEY);
      return val ? JSON.parse(val) : [];
    } catch {
      return [];
    }
  },

  async saveExpenses(expenses: ExpenseItem[]): Promise<void> {
    try {
      await AsyncStorage.setItem(EXPENSES_KEY, JSON.stringify(expenses));
    } catch (e) {
      console.error('Error saving expenses', e);
    }
  },

  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([ONBOARDING_KEY, INPUTS_KEY, EXPENSES_KEY, GUEST_KEY]);
    } catch (e) {
      console.error('Error clearing storage', e);
    }
  }
};
export default Storage;
