import { useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';

import { Card } from '@/components/Card';
import { MapViewRuca } from '@/components/MapViewRuca';
import { RootStackParamList } from '@/navigation';
import { getQuote } from '@/services/rides';
import { useRideStore } from '@/state/useRideStore';
import { generateMockPolyline, mockLocations } from '@/utils/mock';
import { showToast } from '@/utils/toast';

const favoriteMapping: Record<string, string> = {
  Casa: 'Polana',
  Trabalho: 'Maputo CBD'
};

export const HomeScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { t } = useTranslation();
  const pickup = useRideStore((state) => state.pickup);
  const dropoff = useRideStore((state) => state.dropoff);
  const setPickup = useRideStore((state) => state.setPickup);
  const setDropoff = useRideStore((state) => state.setDropoff);
  const setQuote = useRideStore((state) => state.setQuote);
  const setPolyline = useRideStore((state) => state.setPolyline);
  const [permissionStatus, setPermissionStatus] = useState<Location.PermissionStatus | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setPermissionStatus(status);
      if (status === Location.PermissionStatus.GRANTED) {
        const current = await Location.getCurrentPositionAsync({});
        setPickup({
          lat: current.coords.latitude,
          lng: current.coords.longitude,
          label: t('home.pickup')
        });
      }
    })().catch(() => {
      showToast('Localização não disponível');
    });
  }, [setPickup, t]);

  const handleOpenSearch = () => {
    navigation.navigate('Search');
  };

  const favoritePress = async (key: 'Casa' | 'Trabalho') => {
    const label = favoriteMapping[key];
    const location = mockLocations.find((loc) => loc.label === label);
    if (location) {
      setDropoff(location);
      if (pickup) {
        try {
          const quote = await getQuote(pickup, location);
          setQuote(quote);
          setPolyline(generateMockPolyline(pickup, location));
          navigation.navigate('Confirm');
        } catch (error) {
          console.warn(error);
          showToast(t('common.error'));
        }
      } else {
        navigation.navigate('Search');
      }
    }
  };

  return (
    <View className="flex-1 bg-slate-50">
      <View className="h-1/2 p-4">
        <MapViewRuca pickup={pickup ?? undefined} dropoff={dropoff ?? undefined} />
      </View>
      <ScrollView className="flex-1" contentContainerStyle={{ padding: 16 }}>
        <Card className="mb-4">
          <Text className="text-sm text-gray-400 mb-1">{t('home.pickup')}</Text>
          <TouchableOpacity onPress={handleOpenSearch} className="mb-3">
            <Text className="text-lg font-semibold text-gray-800">
              {pickup?.label ?? (permissionStatus === 'granted' ? t('home.pickup') : 'Maputo CBD')}
            </Text>
          </TouchableOpacity>
          <Text className="text-sm text-gray-400 mb-1">{t('home.dropoff')}</Text>
          <TouchableOpacity onPress={handleOpenSearch}>
            <Text className="text-lg font-semibold text-primary">
              {dropoff?.label ?? t('home.dropoff')}
            </Text>
          </TouchableOpacity>
        </Card>

        <Card>
          <Text className="text-base font-semibold text-gray-800 mb-3">{t('home.favorites')}</Text>
          <View className="flex-row space-x-3">
            <TouchableOpacity
              className="bg-primary/10 px-4 py-3 rounded-xl"
              onPress={() => favoritePress('Casa')}
            >
              <Text className="text-primary font-semibold">{t('home.home')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="bg-primary/10 px-4 py-3 rounded-xl"
              onPress={() => favoritePress('Trabalho')}
            >
              <Text className="text-primary font-semibold">{t('home.work')}</Text>
            </TouchableOpacity>
          </View>
        </Card>

        <TouchableOpacity
          className="bg-primary mt-6 rounded-full py-4 items-center"
          onPress={handleOpenSearch}
        >
          <Text className="text-white font-semibold text-lg">{t('home.request')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};
