import { ScrollView, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { formatMetical } from '@/utils/currency';

const mockTrips = [
  { id: 't1', pickup: 'Maputo CBD', dropoff: 'Polana', total: 250, date: '2024-03-10' },
  { id: 't2', pickup: 'Baixa', dropoff: 'Costa do Sol', total: 540, date: '2024-03-08' }
];

export const TripsScreen = () => {
  const { t } = useTranslation();
  return (
    <ScrollView className="flex-1 bg-slate-50" contentContainerStyle={{ padding: 16 }}>
      <Text className="text-2xl font-bold text-gray-800 mb-4">{t('trips.title')}</Text>
      {mockTrips.map((trip) => (
        <View key={trip.id} className="bg-white rounded-2xl p-4 mb-3 shadow-sm">
          <Text className="text-sm text-gray-400">{trip.date}</Text>
          <Text className="text-base font-semibold text-gray-800">
            {trip.pickup} → {trip.dropoff}
          </Text>
          <Text className="text-primary font-bold mt-1">{formatMetical(trip.total)}</Text>
        </View>
      ))}
      {mockTrips.length === 0 ? (
        <Text className="text-gray-500 text-center mt-12">{t('trips.empty')}</Text>
      ) : null}
    </ScrollView>
  );
};
