import { View, Text } from 'react-native';

import { Quote } from '@/types/ride';
import { formatMetical } from '@/utils/currency';

interface RideMiniCardProps {
  pickupLabel: string;
  dropoffLabel: string;
  quote?: Quote | null;
}

export const RideMiniCard = ({ pickupLabel, dropoffLabel, quote }: RideMiniCardProps) => {
  return (
    <View className="bg-white rounded-2xl p-4 shadow-sm space-y-2">
      <View>
        <Text className="text-xs uppercase text-gray-400">Partida</Text>
        <Text className="text-base font-semibold text-gray-700">{pickupLabel}</Text>
      </View>
      <View>
        <Text className="text-xs uppercase text-gray-400">Destino</Text>
        <Text className="text-base font-semibold text-gray-700">{dropoffLabel}</Text>
      </View>
      {quote ? (
        <View className="pt-2 border-t border-gray-100">
          <Text className="text-xs uppercase text-gray-400">Tarifa</Text>
          <Text className="text-lg font-bold text-primary">{formatMetical(quote.total)}</Text>
        </View>
      ) : null}
    </View>
  );
};
