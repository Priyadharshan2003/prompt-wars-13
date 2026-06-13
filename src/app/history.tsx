import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useColorScheme } from 'react-native';
import { Colors } from '../styles/theme';
import { useApp } from '../logic/AppContext';
import { Api } from '../logic/api';
import Card from '../components/Card';
import Button from '../components/Button';
import { formatCurrency } from '../utils/formatting';

export default function HistoryScreen() {
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const colors = Colors[scheme];
  const { user, isGuest } = useApp();
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && !isGuest) {
      loadHistory();
    }
  }, [user, isGuest]);

  const loadHistory = async () => {
    setLoading(true);
    if (user) {
      const data = await Api.getHistory(user.id);
      setHistory(data);
    }
    setLoading(false);
  };

  if (isGuest) {
    return (
      <View style={[styles.container, styles.center, { backgroundColor: colors.background }]}>
        <Text style={[styles.title, { color: colors.text }]}>History</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Sign in to save and view your past meal plans.
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Meal Plan History</Text>
      
      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <Card style={styles.card}>
              <Text style={[styles.dateText, { color: colors.text }]}>
                {new Date(item.created_at).toLocaleDateString()}
              </Text>
              <Text style={[styles.costText, { color: colors.primary }]}>
                {formatCurrency(item.total_cost)}
              </Text>
              <View style={styles.mealRow}>
                <Text style={{ color: colors.textSecondary }}>B: {item.breakfast.title}</Text>
                <Text style={{ color: colors.textSecondary }}>L: {item.lunch.title}</Text>
                <Text style={{ color: colors.textSecondary }}>D: {item.dinner.title}</Text>
              </View>
            </Card>
          )}
          ListEmptyComponent={
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No saved plans yet.</Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 12,
  },
  list: {
    paddingVertical: 16,
  },
  card: {
    marginBottom: 16,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  costText: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  mealRow: {
    gap: 4,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
  }
});
