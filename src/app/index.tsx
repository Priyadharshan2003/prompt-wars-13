import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, useColorScheme, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../logic/AppContext';
import SplashOnboarding from '../components/SplashOnboarding';
import InputDashboard from '../components/InputDashboard';
import ResultsDashboard from '../components/ResultsDashboard';
import { Colors } from '../styles/theme';
import { UserInputs } from '../logic/aiEngine';

const COOKING_QUOTES = [
  'Consulting the budget scale...',
  'Calculating Fridge Reality Check matching...',
  'Checking ingredients for Cognitive Load constraints...',
  'Calming down brain fried cells...',
  'Compiling cheaper substitutions...',
  'Structuring your grocery list aisles...'
];

export default function HomeScreen() {
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const colors = Colors[scheme];

  const {
    onboardingCompleted,
    completeOnboarding,
    userInputs,
    currentPlan,
    loading,
    generatePlan,
    resetPlan,
    addExpense
  } = useApp();

  // Custom loading overlay when compiling plan
  const [compiling, setCompiling] = useState(false);
  const [quote, setQuote] = useState(COOKING_QUOTES[0]);

  const handleGenerate = (inputs: UserInputs) => {
    setCompiling(true);
    // Cycle quotes every 400ms for visual polish
    let quoteIndex = 0;
    const interval = setInterval(() => {
      quoteIndex = (quoteIndex + 1) % COOKING_QUOTES.length;
      setQuote(COOKING_QUOTES[quoteIndex]);
    }, 450);

    setTimeout(() => {
      clearInterval(interval);
      generatePlan(inputs);
      setCompiling(false);
    }, 1800); // 1.8 seconds compile delay for satisfaction
  };

  if (loading) {
    return (
      <View style={[styles.loadingCenter, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!onboardingCompleted) {
    return <SplashOnboarding onComplete={completeOnboarding} />;
  }

  if (compiling) {
    return (
      <View style={[styles.loadingCenter, { backgroundColor: colors.background }]}>
        <View style={styles.loaderContent}>
          <ActivityIndicator size="large" color={colors.primary} style={{ marginBottom: 24 }} />
          <Text style={[styles.quoteText, { color: colors.text }]}>{quote}</Text>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
      {!currentPlan ? (
        <InputDashboard onGenerate={handleGenerate} savedInputs={userInputs} />
      ) : (
        <ResultsDashboard
          plan={currentPlan}
          inputs={userInputs!}
          onReset={resetPlan}
          onLogExpense={addExpense}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  loadingCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loaderContent: {
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: 300,
  },
  quoteText: {
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 20,
  },
});
