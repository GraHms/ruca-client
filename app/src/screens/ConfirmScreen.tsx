import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { RideMiniCard } from '@/components/RideMiniCard';
import { RootStackParamList } from '@/navigation';
import { requestRide } from '@/services/rides';
import { useRideStore } from '@/state/useRideStore';
import { formatMetical } from '@/utils/currency';
import { showToast } from '@/utils/toast';

export const ConfirmScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { t } = useTranslation();
  const pickup = useRideStore((state) => state.pickup);
  const dropoff = useRideStore((state) => state.dropoff);
  const quote = useRideStore((state) => state.quote);
  const setRide = useRideStore((state) => state.setRide);
  const [loading, setLoading] = useState(false);

  const handleRequestRide = async () => {
    if (!pickup || !dropoff || !quote) return;
    try {
      setLoading(true);
      const ride = await requestRide({ pickup, dropoff, quote });
      setRide(ride);
      navigation.navigate('WaitingDriver');
    } catch (error) {
      console.warn(error);
      showToast(t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  if (!pickup || !dropoff || !quote) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-gray-500">{t('search.empty')}</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-slate-50" contentContainerStyle={{ padding: 16 }}>
      <RideMiniCard pickupLabel={pickup.label} dropoffLabel={dropoff.label} quote={quote} />

      <Card className="mt-4 space-y-2">
        <Text className="text-lg font-semibold text-gray-800">{t('confirm.fare')}</Text>
        <View className="flex-row justify-between">
          <Text className="text-gray-500">Base</Text>
          <Text className="text-gray-800">{formatMetical(quote.breakdown.base)}</Text>
        </View>
        <View className="flex-row justify-between">
          <Text className="text-gray-500">Distância</Text>
          <Text className="text-gray-800">{formatMetical(quote.breakdown.perKm)}</Text>
        </View>
        <View className="flex-row justify-between">
          <Text className="text-gray-500">Tempo</Text>
          <Text className="text-gray-800">{formatMetical(quote.breakdown.perMin)}</Text>
        </View>
        {quote.breakdown.surge ? (
          <View className="flex-row justify-between">
            <Text className="text-gray-500">Surge</Text>
            <Text className="text-gray-800">{formatMetical(quote.breakdown.surge)}</Text>
          </View>
        ) : null}
        <View className="flex-row justify-between border-t border-gray-100 pt-2">
          <Text className="text-base font-semibold text-gray-800">Total</Text>
          <Text className="text-base font-bold text-primary">{formatMetical(quote.total)}</Text>
        </View>
      </Card>

      <Button className="mt-6" onPress={handleRequestRide} loading={loading}>
        {t('confirm.request')}
      </Button>
      <Button
        className="mt-3"
        variant="secondary"
        onPress={() => navigation.goBack()}
      >
        {t('common.cancel')}
      </Button>
    </ScrollView>
  );
};
