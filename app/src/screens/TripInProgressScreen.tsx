import { useEffect, useState } from 'react';
import { Modal, ScrollView, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/Button';
import { MapViewRuca } from '@/components/MapViewRuca';
import { RootStackParamList } from '@/navigation';
import { mpesaPay, emolaPay } from '@/services/payments';
import { pollRide } from '@/services/rides';
import { useRideStore } from '@/state/useRideStore';
import { formatMetical } from '@/utils/currency';
import { showToast } from '@/utils/toast';

export const TripInProgressScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { t } = useTranslation();
  const ride = useRideStore((state) => state.currentRide);
  const setRide = useRideStore((state) => state.setRide);
  const polyline = useRideStore((state) => state.polyline);
  const reset = useRideStore((state) => state.reset);
  const [showPayment, setShowPayment] = useState(false);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!ride) return;
    const interval = setInterval(async () => {
      const updated = await pollRide(ride.id);
      if (updated) {
        setRide(updated);
        if (updated.status === 'completed') {
          clearInterval(interval);
          setShowPayment(true);
        }
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [ride, setRide]);

  if (!ride || !ride.pickup || !ride.dropoff) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-gray-500">{t('common.error')}</Text>
      </View>
    );
  }

  const handleComplete = () => {
    setRide({ ...ride, status: 'completed' });
    setShowPayment(true);
  };

  const handlePayment = async (method: 'mpesa' | 'emola' | 'cash') => {
    if (!ride.quote) return;
    try {
      setProcessing(true);
      if (method === 'mpesa') {
        const result = await mpesaPay(ride.id, ride.driver?.phone ?? '', ride.quote.total);
        if (!result.success) throw new Error(result.message);
      } else if (method === 'emola') {
        const result = await emolaPay(ride.id, ride.driver?.phone ?? '', ride.quote.total);
        if (!result.success) throw new Error(result.message);
      }
      showToast(t('payments.success'));
      setShowPayment(false);
      reset();
      navigation.navigate('Main');
    } catch (error) {
      console.warn(error);
      showToast(t('payments.failed'));
    } finally {
      setProcessing(false);
    }
  };

  return (
    <View className="flex-1 bg-slate-50">
      <View className="h-1/2 p-4">
        <MapViewRuca pickup={ride.pickup} dropoff={ride.dropoff} polyline={polyline} />
      </View>
      <ScrollView className="flex-1" contentContainerStyle={{ padding: 16 }}>
        <View className="bg-white rounded-2xl p-4 shadow-sm">
          <Text className="text-sm text-gray-400">{t('trip.driver')}</Text>
          <Text className="text-xl font-semibold text-gray-800">{ride.driver?.name ?? 'Ruca'}</Text>
          <Text className="text-sm text-gray-500">{ride.vehicle?.model} · {ride.vehicle?.plate}</Text>
          <View className="flex-row mt-4 space-x-3">
            <Button className="flex-1" variant="secondary" onPress={() => showToast('Ligação em breve')}>
              {t('trip.call')}
            </Button>
            <Button className="flex-1" variant="secondary" onPress={() => showToast('Chat em breve')}>
              {t('trip.message')}
            </Button>
          </View>
          <Button className="mt-6" onPress={handleComplete}>
            {t('trip.complete')}
          </Button>
        </View>
      </ScrollView>

      <Modal visible={showPayment} transparent animationType="slide">
        <View className="flex-1 justify-end bg-black/30">
          <View className="bg-white rounded-t-3xl p-6 space-y-4">
            <Text className="text-xl font-semibold text-gray-800 text-center">
              {t('payments.title')}
            </Text>
            <Text className="text-center text-gray-500">
              {t('confirm.fare')}: {formatMetical(ride.quote.total)}
            </Text>
            <Button onPress={() => handlePayment('mpesa')} loading={processing}>
              {t('payments.mpesa')}
            </Button>
            <Button onPress={() => handlePayment('emola')} loading={processing}>
              {t('payments.emola')}
            </Button>
            <Button onPress={() => handlePayment('cash')} variant="secondary" loading={processing}>
              {t('common.cash')}
            </Button>
            <Button variant="ghost" onPress={() => setShowPayment(false)}>
              {t('common.cancel')}
            </Button>
          </View>
        </View>
      </Modal>
    </View>
  );
};
