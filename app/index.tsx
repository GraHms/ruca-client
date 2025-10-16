import 'react-native-gesture-handler';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { useTranslation } from 'react-i18next';

import './src/i18n';
import { RootNavigation } from '@/navigation';
import { useAuthStore } from '@/state/useAuthStore';

const queryClient = new QueryClient();

const AppContent = () => {
  const initialize = useAuthStore((state) => state.initialize);
  const loading = useAuthStore((state) => state.loading);
  const session = useAuthStore((state) => state.session);
  const { i18n } = useTranslation();

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (session?.user.language) {
      i18n.changeLanguage(session.user.language).catch(() => undefined);
    }
  }, [session?.user.language, i18n]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#0f766e" />
      </View>
    );
  }

  return <RootNavigation isAuthenticated={Boolean(session)} />;
};

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <NavigationContainer>
            <StatusBar style="dark" />
            <AppContent />
          </NavigationContainer>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;
