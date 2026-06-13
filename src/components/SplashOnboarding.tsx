import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, useColorScheme, Dimensions, Platform } from 'react-native';
import { Colors, Shadows } from '../styles/theme';
import Button from './Button';
import { Ionicons } from '@expo/vector-icons';

interface SplashOnboardingProps {
  onComplete: () => void;
}

export const SplashOnboarding: React.FC<SplashOnboardingProps> = ({ onComplete }) => {
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const colors = Colors[scheme];
  const [step, setStep] = useState(0); // 0 = Splash, 1 = Onboarding Page 1, 2 = Onboarding Page 2, 3 = Page 3

  const onboardingSteps = [
    {
      icon: 'restaurant-outline',
      title: 'Smart Meal Planning',
      desc: 'Get personalized Breakfast, Lunch, and Dinner recommendations tailored to your dietary choices and fitness goals.'
    },
    {
      icon: 'wallet-outline',
      title: 'Nuanced Budget Tracking',
      desc: 'Input your target daily budget and see a detailed Stress Indicator. Cut down costs with smart ingredient swaps.'
    },
    {
      icon: 'brain-outline',
      title: 'Cognitive Load Reduction',
      desc: 'Feeling exhausted? Enable "Brain Fried" mode to automatically filter for ultra-simple, no-cook comfort meals.'
    }
  ];

  if (step === 0) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.splashContent}>
          <View style={[styles.logoContainer, { backgroundColor: colors.cardBackground, ...Shadows }]}>
            <Image 
              source={require('../../assets/images/icon.png')} 
              style={{ width: 80, height: 80, borderRadius: 16 }} 
              resizeMode="contain" 
            />
          </View>
          <Text style={[styles.appName, { color: colors.text }]}>CookSmart AI+</Text>
          <Text style={[styles.tagline, { color: colors.textSecondary }]}>
            Smart Daily Cooking & Life Planner
          </Text>
        </View>
        <View style={styles.footer}>
          <Button 
            title="Continue" 
            variant="primary" 
            onPress={() => setStep(1)} 
            style={styles.ctaButton}
          />
        </View>
      </View>
    );
  }

  const currentOnboarding = onboardingSteps[step - 1];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.onboardingHeader}>
        <Text style={[styles.stepCount, { color: colors.textSecondary }]}>
          Step {step} of 3
        </Text>
      </View>

      <View style={styles.onboardingContent}>
        <View style={[styles.iconCircle, { backgroundColor: colors.backgroundElement }]}>
          <Ionicons name={currentOnboarding.icon as any} size={64} color={colors.primary} />
        </View>
        
        <Text style={[styles.onboardingTitle, { color: colors.text }]}>
          {currentOnboarding.title}
        </Text>
        
        <Text style={[styles.onboardingDesc, { color: colors.textSecondary }]}>
          {currentOnboarding.desc}
        </Text>

        {/* Bullet Indicator dots */}
        <View style={styles.dotsRow}>
          {[1, 2, 3].map(i => (
            <View 
              key={i} 
              style={[
                styles.dot, 
                { 
                  backgroundColor: i === step ? colors.primary : colors.border,
                  width: i === step ? 16 : 8
                }
              ]} 
            />
          ))}
        </View>
      </View>

      <View style={styles.footer}>
        <Button 
          title={step === 3 ? "Let's Cook!" : "Next"} 
          variant="primary" 
          onPress={() => {
            if (step === 3) {
              onComplete();
            } else {
              setStep(step + 1);
            }
          }} 
          style={styles.ctaButton}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 24,
  },
  splashContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1.5,
    borderColor: '#0000000a',
  },
  logoEmoji: {
    fontSize: 48,
  },
  appName: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 15,
    fontWeight: '500',
    textAlign: 'center',
  },
  onboardingHeader: {
    alignItems: 'center',
    marginTop: Platform.OS === 'ios' ? 24 : 10,
  },
  stepCount: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  onboardingContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  iconCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  onboardingTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  onboardingDesc: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  footer: {
    marginBottom: Platform.OS === 'ios' ? 20 : 10,
    width: '100%',
    alignItems: 'center',
  },
  ctaButton: {
    width: '100%',
    maxWidth: 400,
  },
});
export default SplashOnboarding;
