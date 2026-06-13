import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useColorScheme } from 'react-native';
import { Colors } from '../styles/theme';
import { useApp } from '../logic/AppContext';
import Button from '../components/Button';
import Storage from '../utils/storage';

export default function SettingsScreen() {
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const colors = Colors[scheme];
  const { user, isGuest, logout, resetPlan, clearExpenses } = useApp();

  const handleClearData = async () => {
    resetPlan();
    clearExpenses();
    await Storage.clearAll();
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Settings</Text>
      
      <View style={[styles.section, { borderBottomColor: colors.border }]}>
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Account</Text>
        {isGuest ? (
          <View>
            <Text style={[styles.infoText, { color: colors.text }]}>You are using Guest Mode.</Text>
            <Text style={[styles.infoText, { color: colors.textSecondary, marginBottom: 16 }]}>
              Your data is stored locally on this device.
            </Text>
            <Button title="Sign in or Create Account" onPress={logout} variant="primary" />
          </View>
        ) : (
          <View>
            <Text style={[styles.infoText, { color: colors.text }]}>Signed in as:</Text>
            <Text style={[styles.emailText, { color: colors.primary }]}>{user?.email}</Text>
            <Button title="Sign out" onPress={logout} variant="outline" style={{ marginTop: 16 }} />
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Data & Privacy</Text>
        <Text style={[styles.infoText, { color: colors.text, marginBottom: 16 }]}>
          Clear your locally cached data and preferences.
        </Text>
        <Button title="Clear Local Data" onPress={handleClearData} variant="danger" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 24,
  },
  section: {
    marginBottom: 32,
    paddingBottom: 24,
    borderBottomWidth: 1,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 16,
  },
  infoText: {
    fontSize: 16,
    lineHeight: 24,
  },
  emailText: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 4,
  }
});
