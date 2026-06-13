import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserInputs, GeneratedPlan, generateMealPlan } from './aiEngine';
import Storage, { ExpenseItem } from '../utils/storage';
import { supabase } from '../lib/supabase';
import { Session, User } from '@supabase/supabase-js';
import { Api } from './api';
interface AppContextType {
  onboardingCompleted: boolean;
  completeOnboarding: () => void;
  userInputs: UserInputs | null;
  currentPlan: GeneratedPlan | null;
  expenses: ExpenseItem[];
  loading: boolean;
  generatePlan: (inputs: UserInputs) => void;
  resetPlan: () => void;
  addExpense: (amount: number, description: string, category: 'Grocery' | 'Meal Cost' | 'Other') => void;
  clearExpenses: () => void;
  
  // Auth
  session: Session | null;
  user: User | null;
  isGuest: boolean;
  setGuestMode: (guest: boolean) => void;
  logout: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [onboardingCompleted, setOnboardingCompleted] = useState<boolean>(false);
  const [userInputs, setUserInputs] = useState<UserInputs | null>(null);
  const [currentPlan, setCurrentPlan] = useState<GeneratedPlan | null>(null);
  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Auth state
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isGuest, setIsGuestState] = useState<boolean>(false);

  // Load initial data from storage
  useEffect(() => {
    async function loadData() {
      try {
        const onboarded = await Storage.getOnboardingCompleted();
        const savedInputs = await Storage.getSavedInputs();
        const savedExpenses = await Storage.getExpenses();
        const guestMode = await Storage.getGuestMode();

        setOnboardingCompleted(onboarded);
        setIsGuestState(guestMode);

        if (savedInputs) {
          setUserInputs(savedInputs);
          // Re-generate current plan based on saved inputs
          const plan = generateMealPlan(savedInputs);
          setCurrentPlan(plan);
        }
        setExpenses(savedExpenses);

        // Supabase Auth
        const { data } = await supabase.auth.getSession();
        setSession(data.session);
        setUser(data.session?.user || null);

      } catch (e) {
        console.error('Error loading AppContext data', e);
      } finally {
        setLoading(false);
      }
    }
    loadData();

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user || null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const completeOnboarding = async () => {
    setOnboardingCompleted(true);
    await Storage.setOnboardingCompleted(true);
  };

  const generatePlan = async (inputs: UserInputs) => {
    setUserInputs(inputs);
    const plan = generateMealPlan(inputs);
    setCurrentPlan(plan);
    await Storage.saveInputs(inputs);

    if (user && !isGuest) {
      await Api.updatePreferences(user.id, inputs);
      await Api.saveMealPlan(plan, user.id);
    }
  };

  const resetPlan = () => {
    setCurrentPlan(null);
  };

  const addExpense = async (amount: number, description: string, category: 'Grocery' | 'Meal Cost' | 'Other') => {
    const newItem: ExpenseItem = {
      id: Math.random().toString(36).substring(2, 9),
      date: new Date().toISOString(),
      description,
      amount,
      category
    };
    const updated = [...expenses, newItem];
    setExpenses(updated);
    await Storage.saveExpenses(updated);
  };

  const clearExpenses = async () => {
    setExpenses([]);
    await Storage.saveExpenses([]);
  };

  const setGuestMode = async (guest: boolean) => {
    setIsGuestState(guest);
    await Storage.setGuestMode(guest);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
    setGuestMode(false);
  };

  return (
    <AppContext.Provider
      value={{
        onboardingCompleted,
        completeOnboarding,
        userInputs,
        currentPlan,
        expenses,
        loading,
        generatePlan,
        resetPlan,
        addExpense,
        clearExpenses,
        session,
        user,
        isGuest,
        setGuestMode,
        logout
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
export default AppContext;
