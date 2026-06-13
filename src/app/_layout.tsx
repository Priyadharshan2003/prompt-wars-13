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

function ThemeWrapper({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const { themePref } = useApp();
  
  const activeScheme = themePref === 'system' ? systemScheme : themePref;
  
  return (
    <ThemeProvider value={activeScheme === 'dark' ? DarkTheme : DefaultTheme}>
      {children}
    </ThemeProvider>
  );
}

export default function TabLayout() {
  return (
    <AppProvider>
      <ThemeWrapper>
        <AnimatedSplashOverlay />
        <AuthGuard>
          <AppTabs />
        </AuthGuard>
      </ThemeWrapper>
    </AppProvider>
  );
}

