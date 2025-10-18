import { useEffect } from 'react';
import { ScrollView, Switch, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/Button';
import { useDriverStore } from '@/state/useDriverStore';
import { formatMetical } from '@/utils/currency';

export const DriverModeScreen = () => {
  const { t } = useTranslation();
  const available = useDriverStore((state) => state.available);
  const toggleAvailability = useDriverStore((state) => state.toggleAvailability);
  const pollRequests = useDriverStore((state) => state.pollRequests);
  const requests = useDriverStore((state) => state.activeRequests);
  const acceptRequest = useDriverStore((state) => state.acceptRequest);
  const declineRequest = useDriverStore((state) => state.declineRequest);
  const earningsToday = useDriverStore((state) => state.earningsToday);

  useEffect(() => {
    const interval = setInterval(() => {
      pollRequests();
    }, 5000);
    return () => clearInterval(interval);
  }, [pollRequests]);

  return (
    <ScrollView className="flex-1 bg-slate-50" contentContainerStyle={{ padding: 16 }}>
      <View className="bg-white rounded-2xl p-4 mb-4 flex-row items-center justify-between">
        <View>
          <Text className="text-xl font-semibold text-gray-800">{t('driver.title')}</Text>
          <Text className="text-sm text-gray-500">{t('driver.earnings')}: {formatMetical(earningsToday)}</Text>
        </View>
        <View className="items-end">
          <Text className="text-sm text-gray-500 mb-1">{t('driver.available')}</Text>
          <Switch value={available} onValueChange={toggleAvailability} trackColor={{ true: '#0f766e' }} />
        </View>
      </View>

      {requests.length === 0 ? (
        <View className="bg-white rounded-2xl p-6 items-center">
          <Text className="text-gray-500">{t('driver.noRequests')}</Text>
        </View>
      ) : (
        requests.map((request) => (
          <View key={request.id} className="bg-white rounded-2xl p-4 mb-3">
            <Text className="text-sm text-gray-400">{request.requestedAt}</Text>
            <Text className="text-lg font-semibold text-gray-800">
              {request.pickup.label} → {request.dropoff.label}
            </Text>
            <Text className="text-primary font-bold mt-2">{formatMetical(request.quote.total)}</Text>
            <View className="flex-row mt-3 space-x-3">
              <Button className="flex-1" onPress={() => acceptRequest(request.id)}>
                {t('driver.accept')}
              </Button>
              <Button className="flex-1" variant="secondary" onPress={() => declineRequest(request.id)}>
                {t('driver.decline')}
              </Button>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
};
