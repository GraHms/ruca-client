import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

import { HomeScreen } from '@/screens/HomeScreen';
import { TripsScreen } from '@/screens/TripsScreen';
import { ProfileScreen } from '@/screens/ProfileScreen';

export type TabParamList = {
  Home: undefined;
  Trips: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

export const HomeTabs = () => {
  const { t } = useTranslation();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#0f766e',
        tabBarLabelStyle: { fontSize: 12 },
        tabBarIcon: ({ color, size }) => {
          const iconName =
            route.name === 'Home'
              ? 'home'
              : route.name === 'Trips'
              ? 'map'
              : 'person-circle';
          return <Ionicons name={iconName as any} size={size} color={color} />;
        }
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: t('home.dropoff') }} />
      <Tab.Screen name="Trips" component={TripsScreen} options={{ title: t('trips.title') }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: t('profile.title') }} />
    </Tab.Navigator>
  );
};
