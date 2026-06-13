import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, Pressable, useColorScheme, Platform } from 'react-native';
import { Colors, Shadows } from '../styles/theme';
import InputField from './InputField';
import SegmentControl from './SegmentControl';
import Dropdown from './Dropdown';
import Button from './Button';
import Card from './Card';
import { Ionicons } from '@expo/vector-icons';
import { UserInputs } from '../logic/aiEngine';

interface InputDashboardProps {
  onGenerate: (inputs: UserInputs) => void;
  savedInputs: UserInputs | null;
}

export const InputDashboard: React.FC<InputDashboardProps> = ({ onGenerate, savedInputs }) => {
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const colors = Colors[scheme];

  // Core Form State
  const [budget, setBudget] = useState('20');
  const [dietIdx, setDietIdx] = useState(0); // 0 = Veg, 1 = Non-Veg
  
  // Optional Form State (Collapsible)
  const [country, setCountry] = useState<'India' | 'USA' | 'Global'>('Global');
  const [stateRegion, setStateRegion] = useState<'Tamil Nadu' | 'Kerala' | 'Karnataka' | 'Maharashtra' | 'California' | 'Texas' | 'Any'>('Any');
  const [showOptional, setShowOptional] = useState(false);
  const [cognitiveLoad, setCognitiveLoad] = useState<'High Energy' | 'Tired' | 'Brain Fried'>('Tired');
  const [timeAvailable, setTimeAvailable] = useState<'Short' | 'Medium' | 'Long'>('Medium');
  const [healthGoal, setHealthGoal] = useState<'Low Calorie' | 'High Protein' | 'Balanced'>('Balanced');
  const [leftovers, setLeftovers] = useState('');
  const [minimalCooking, setMinimalCooking] = useState(false);
  const [wakeTime, setWakeTime] = useState('07:00');
  const [sleepTime, setSleepTime] = useState('22:00');
  const [nightPlanning, setNightPlanning] = useState(true);
  const [regretMinimizer, setRegretMinimizer] = useState(true);

  // Errors State
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Pre-populate if saved inputs exist
  useEffect(() => {
    if (savedInputs) {
      setBudget(savedInputs.budget.toString());
      setDietIdx(savedInputs.diet === 'Veg' ? 0 : 1);
      setCognitiveLoad(savedInputs.cognitiveLoad);
      setTimeAvailable(savedInputs.timeAvailable);
      setHealthGoal(savedInputs.healthGoal);
      setLeftovers(savedInputs.leftovers);
      setMinimalCooking(savedInputs.minimalCookingMode);
      setWakeTime(savedInputs.wakeTime || '07:00');
      setSleepTime(savedInputs.sleepTime || '22:00');
      setNightPlanning(savedInputs.nightPlanningMode);
      setRegretMinimizer(savedInputs.regretMinimizerMode ?? true);
      if (savedInputs.location) {
        setCountry(savedInputs.location.country);
        setStateRegion(savedInputs.location.state);
      }
    }
  }, [savedInputs]);

  // Form Validation
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    const parsedBudget = parseFloat(budget);

    if (!budget.trim()) {
      newErrors.budget = 'Daily budget is required';
    } else if (isNaN(parsedBudget) || parsedBudget <= 0) {
      newErrors.budget = 'Please enter a valid positive budget amount';
    } else if (parsedBudget < 5) {
      newErrors.budget = 'Minimum daily budget of $5 recommended';
    }

    // Time validation (simple hh:mm regex check)
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (wakeTime && !timeRegex.test(wakeTime)) {
      newErrors.wakeTime = 'Use HH:MM format (e.g. 07:30)';
    }
    if (sleepTime && !timeRegex.test(sleepTime)) {
      newErrors.sleepTime = 'Use HH:MM format (e.g. 22:30)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGenerate = () => {
    if (!validate()) return;

    onGenerate({
      budget: parseFloat(budget),
      diet: dietIdx === 0 ? 'Veg' : 'Non-Veg',
      cognitiveLoad,
      timeAvailable,
      healthGoal,
      leftovers,
      minimalCookingMode: minimalCooking,
      wakeTime,
      sleepTime,
      nightPlanningMode: nightPlanning,
      regretMinimizerMode: regretMinimizer,
      location: {
        country,
        state: stateRegion
      }
    });
  };

  const handleZeroDecision = () => {
    // Randomly select diet preference or use current, randomize other settings
    const diets: ('Veg' | 'Non-Veg')[] = ['Veg', 'Non-Veg'];
    const cognitiveLoads: ('High Energy' | 'Tired' | 'Brain Fried')[] = ['High Energy', 'Tired', 'Brain Fried'];
    const times: ('Short' | 'Medium' | 'Long')[] = ['Short', 'Medium', 'Long'];
    const goals: ('Low Calorie' | 'High Protein' | 'Balanced')[] = ['Low Calorie', 'High Protein', 'Balanced'];

    // Pick randoms
    const randomDiet = diets[Math.floor(Math.random() * diets.length)];
    const randomCognitive = cognitiveLoads[Math.floor(Math.random() * cognitiveLoads.length)];
    const randomTime = times[Math.floor(Math.random() * times.length)];
    const randomGoal = goals[Math.floor(Math.random() * goals.length)];
    const randomBudget = Math.floor(Math.random() * 25) + 15; // Random budget between $15 and $40
    
    // Automatically submit with no-decision values
    onGenerate({
      budget: randomBudget,
      diet: randomDiet,
      cognitiveLoad: randomCognitive,
      timeAvailable: randomTime,
      healthGoal: randomGoal,
      leftovers: leftovers, // Keep leftovers if they entered them
      minimalCookingMode: Math.random() > 0.5,
      wakeTime: '07:30',
      sleepTime: '22:30',
      nightPlanningMode: true,
      regretMinimizerMode: true,
      location: {
        country,
        state: stateRegion
      }
    });
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Let's plan your day</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Enter your limits, and we'll design a smart routine.
        </Text>
      </View>

      {/* Main input card */}
      <Card variant="default" style={styles.card}>
        <InputField
          label="Daily Budget Target (Required)"
          placeholder="e.g. 20"
          prefix="$"
          keyboardType="numeric"
          value={budget}
          onChangeText={setBudget}
          error={errors.budget}
        />

        <SegmentControl
          label="Food Preference"
          values={['Veg 🌱', 'Non-Veg 🍗']}
          selectedIndex={dietIdx}
          onChange={setDietIdx}
        />
      </Card>

      {/* Collapsible Notion-style Accordion for optional settings */}
      <Pressable 
        style={[styles.accordionHeader, { borderBottomColor: colors.border }]} 
        onPress={() => setShowOptional(!showOptional)}
      >
        <View style={styles.accordionTitleRow}>
          <Ionicons name={showOptional ? 'chevron-down' : 'chevron-forward'} size={18} color={colors.primary} />
          <Text style={[styles.accordionTitle, { color: colors.text }]}>Optional Preferences</Text>
        </View>
        <Text style={[styles.accordionSubtitle, { color: colors.textSecondary }]}>
          Energy, time, leftovers, and timings
        </Text>
      </Pressable>

      {showOptional && (
        <Card variant="outline" style={styles.optionalCard}>
          
          <Dropdown
            label="Country"
            selectedValue={country}
            onValueChange={(val) => setCountry(val as any)}
            options={[
              { label: 'Global (No specific focus)', value: 'Global' },
              { label: 'India 🇮🇳', value: 'India' },
              { label: 'USA 🇺🇸', value: 'USA' }
            ]}
          />

          {(country === 'India' || country === 'USA') && (
            <Dropdown
              label="State / Region"
              selectedValue={stateRegion}
              onValueChange={(val) => setStateRegion(val as any)}
              options={
                country === 'India' 
                  ? [
                      { label: 'Any', value: 'Any' },
                      { label: 'Tamil Nadu', value: 'Tamil Nadu' },
                      { label: 'Kerala', value: 'Kerala' },
                      { label: 'Karnataka', value: 'Karnataka' },
                      { label: 'Maharashtra', value: 'Maharashtra' }
                    ]
                  : [
                      { label: 'Any', value: 'Any' },
                      { label: 'California', value: 'California' },
                      { label: 'Texas', value: 'Texas' }
                    ]
              }
            />
          )}

          <Dropdown
            label="Cognitive Energy (Brain Fatigue)"
            selectedValue={cognitiveLoad}
            onValueChange={(val) => setCognitiveLoad(val as any)}
            options={[
              { label: 'High Energy 🔥 (Up for cooking)', value: 'High Energy' },
              { label: 'Tired 🥱 (Simple home meal)', value: 'Tired' },
              { label: 'Brain Fried 🧠 (No-cook / <= 5 ingredient comfort food)', value: 'Brain Fried' }
            ]}
          />

          <Dropdown
            label="Time Available for Cooking"
            selectedValue={timeAvailable}
            onValueChange={(val) => setTimeAvailable(val as any)}
            options={[
              { label: 'Short ⚡ (<15 minutes)', value: 'Short' },
              { label: 'Medium 🕒 (15-30 minutes)', value: 'Medium' },
              { label: 'Long 🍲 (Gourmet / slow cook)', value: 'Long' }
            ]}
          />

          <Dropdown
            label="Health Goal"
            selectedValue={healthGoal}
            onValueChange={(val) => setHealthGoal(val as any)}
            options={[
              { label: 'Balanced ⚖️ (Nutrition focused)', value: 'Balanced' },
              { label: 'High Protein 💪 (Muscle recovery)', value: 'High Protein' },
              { label: 'Low Calorie 🥬 (Weight management)', value: 'Low Calorie' }
            ]}
          />

          <InputField
            label="Fridge Reality Check (Leftovers to reuse)"
            placeholder="e.g. spinach, chicken, eggs (comma separated)"
            value={leftovers}
            onChangeText={setLeftovers}
          />

          <View style={styles.timingRow}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <InputField
                label="Wake-up Time"
                placeholder="07:00"
                value={wakeTime}
                onChangeText={setWakeTime}
                error={errors.wakeTime}
              />
            </View>
            <View style={{ flex: 1, marginLeft: 8 }}>
              <InputField
                label="Bed Time"
                placeholder="22:00"
                value={sleepTime}
                onChangeText={setSleepTime}
                error={errors.sleepTime}
              />
            </View>
          </View>

          <View style={[styles.toggleRow, { borderBottomColor: colors.border }]}>
            <View style={styles.toggleTextCol}>
              <Text style={[styles.toggleLabel, { color: colors.text }]}>Minimal Cooking Mode</Text>
              <Text style={[styles.toggleDesc, { color: colors.textSecondary }]}>Filter meals with 5 or fewer ingredients</Text>
            </View>
            <Switch
              value={minimalCooking}
              onValueChange={setMinimalCooking}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={Platform.OS === 'android' ? '#FFFFFF' : undefined}
            />
          </View>

          <View style={styles.toggleRow}>
            <View style={styles.toggleTextCol}>
              <Text style={[styles.toggleLabel, { color: colors.text }]}>Night Prep Mode</Text>
              <Text style={[styles.toggleDesc, { color: colors.textSecondary }]}>Plan prep tasks (marinating, soaking) for tonight</Text>
            </View>
            <Switch
              value={nightPlanning}
              onValueChange={setNightPlanning}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={Platform.OS === 'android' ? '#FFFFFF' : undefined}
            />
          </View>

          <View style={styles.toggleRow}>
            <View style={styles.toggleTextCol}>
              <Text style={[styles.toggleLabel, { color: colors.text }]}>Regret Minimizer Mode</Text>
              <Text style={[styles.toggleDesc, { color: colors.textSecondary }]}>Balances cost vs health (avoid cheap unhealthy food)</Text>
            </View>
            <Switch
              value={regretMinimizer}
              onValueChange={setRegretMinimizer}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={Platform.OS === 'android' ? '#FFFFFF' : undefined}
            />
          </View>

        </Card>
      )}

      {/* Buttons */}
      <View style={styles.btnContainer}>
        <Button
          title="Generate Plan 🍳"
          variant="primary"
          onPress={handleGenerate}
          style={styles.actionBtn}
        />
        <Button
          title="Zero Decision Mode 🎲 (Decide for me!)"
          variant="outline"
          onPress={handleZeroDecision}
          style={styles.actionBtn}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
    maxWidth: 600,
    alignSelf: 'center',
    width: '100%',
  },
  header: {
    marginTop: 8,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  card: {
    padding: 16,
    marginBottom: 20,
  },
  accordionHeader: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    marginBottom: 16,
  },
  accordionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  accordionTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  accordionSubtitle: {
    fontSize: 12,
    marginTop: 2,
    paddingLeft: 22,
  },
  optionalCard: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
  },
  timingRow: {
    flexDirection: 'row',
    width: '100%',
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  toggleTextCol: {
    flex: 1,
    paddingRight: 16,
  },
  toggleLabel: {
    fontSize: 15,
    fontWeight: '600',
  },
  toggleDesc: {
    fontSize: 12,
    marginTop: 2,
  },
  btnContainer: {
    marginTop: 8,
  },
  actionBtn: {
    marginVertical: 6,
  },
});
export default InputDashboard;
