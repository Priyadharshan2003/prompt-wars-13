import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Colors } from '../styles/theme';
import { useColorScheme } from 'react-native';
import Button from './Button';
import { useApp } from '../logic/AppContext';
import { supabase } from '../lib/supabase';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

if (Platform.OS !== 'web') {
  GoogleSignin.configure({
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || 'mock-client-id',
  });
}

export default function LoginScreen() {
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const colors = Colors[scheme];
  const { setGuestMode } = useApp();

  const handleGoogleSignIn = async () => {
    try {
      if (Platform.OS === 'web') {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: window.location.origin,
          },
        });
        if (error) console.error('Error signing in with Google', error);
      } else {
        await GoogleSignin.hasPlayServices();
        const userInfo = await GoogleSignin.signIn();
        if (userInfo.data?.idToken) {
          const { error } = await supabase.auth.signInWithIdToken({
            provider: 'google',
            token: userInfo.data.idToken,
          });
          if (error) console.error('Error signing in with Google', error);
        } else {
          throw new Error('no ID token present!');
        }
      }
    } catch (error: any) {
      console.error(error);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Welcome to CookSmart AI+</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Sign in to sync your meal plans and preferences across all your devices.
        </Text>
      </View>

      <View style={styles.actions}>
        <Button 
          title="Sign in with Google" 
          onPress={handleGoogleSignIn} 
          variant="primary" 
        />
        <Button 
          title="Continue as Guest" 
          onPress={() => setGuestMode(true)} 
          variant="outline" 
          style={{ marginTop: 12 }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 48,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
  },
  actions: {
    width: '100%',
  }
});
