import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';

import { AuthScreen } from '@/screens/AuthScreen';
import { ConfirmScreen } from '@/screens/ConfirmScreen';
import { DriverModeScreen } from '@/screens/DriverModeScreen';
import { HomeTabs } from '@/navigation/Tabs';
import { SearchScreen } from '@/screens/SearchScreen';
import { WaitingDriverScreen } from '@/screens/WaitingDriverScreen';
import { TripInProgressScreen } from '@/screens/TripInProgressScreen';

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  Search: undefined;
  Confirm: undefined;
  WaitingDriver: undefined;
  TripInProgress: undefined;
  DriverMode: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

interface RootNavigationProps {
  isAuthenticated: boolean;
}

export const RootNavigation = ({ isAuthenticated }: RootNavigationProps) => {
  const { t } = useTranslation();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <Stack.Screen name="Auth" component={AuthScreen} />
      ) : (
        <>
          <Stack.Screen name="Main" component={HomeTabs} />
          <Stack.Screen
            name="Search"
            component={SearchScreen}
            options={{ headerShown: true, title: t('search.title') }}
          />
          <Stack.Screen
            name="Confirm"
            component={ConfirmScreen}
            options={{ headerShown: true, title: t('confirm.title') }}
          />
          <Stack.Screen name="WaitingDriver" component={WaitingDriverScreen} />
          <Stack.Screen name="TripInProgress" component={TripInProgressScreen} />
          <Stack.Screen name="DriverMode" component={DriverModeScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};
