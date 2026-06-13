import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';
import { AppProvider, useApp } from '../logic/AppContext';
import LoginScreen from '../components/LoginScreen';

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isGuest, loading } = useApp();
  
  if (loading) {
    return null; // Let AppContext handle splash or simple loader if needed
  }

  if (!user && !isGuest) {
    return <LoginScreen />;
  }

  return <>{children}</>;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  return (
    <AppProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <AnimatedSplashOverlay />
        <AuthGuard>
          <AppTabs />
        </AuthGuard>
      </ThemeProvider>
    </AppProvider>
  );
}

