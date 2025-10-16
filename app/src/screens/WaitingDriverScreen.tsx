import { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/Button';
import { RootStackParamList } from '@/navigation';
import { cancelRide, pollRide } from '@/services/rides';
import { useRideStore } from '@/state/useRideStore';

export const WaitingDriverScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { t } = useTranslation();
  const ride = useRideStore((state) => state.currentRide);
  const setRide = useRideStore((state) => state.setRide);
  const reset = useRideStore((state) => state.reset);
  const [polling, setPolling] = useState(false);

  useEffect(() => {
    if (!ride) return;
    setPolling(true);
    const interval = setInterval(async () => {
      const updated = await pollRide(ride.id);
      if (updated) {
        setRide(updated);
        if (['accepted', 'enroute', 'arrived'].includes(updated.status)) {
          clearInterval(interval);
          navigation.replace('TripInProgress');
        }
      }
    }, 3000);

    return () => {
      clearInterval(interval);
      setPolling(false);
    };
  }, [ride, setRide, navigation]);

  const handleCancel = async () => {
    if (!ride) return;
    await cancelRide(ride.id);
    reset();
    navigation.navigate('Main');
  };

  if (!ride) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-gray-500">{t('common.error')}</Text>
      </View>
    );
  }

  const etaMinutes = Math.max(Math.round(ride.etaSec / 60), 1);

  return (
    <View className="flex-1 items-center justify-center p-6 bg-slate-50">
      <ActivityIndicator size="large" color="#0f766e" />
      <Text className="text-xl font-semibold text-gray-800 mt-6">{t('waiting.title')}</Text>
      <Text className="text-gray-500 text-center mt-2">{t('waiting.subtitle')}</Text>
      <Text className="text-primary font-bold text-lg mt-4">
        {t('waiting.eta', { minutes: etaMinutes })}
      </Text>
      <Button className="mt-10 w-full" variant="secondary" onPress={handleCancel} loading={polling}>
        {t('waiting.cancel')}
      </Button>
    </View>
  );
};
