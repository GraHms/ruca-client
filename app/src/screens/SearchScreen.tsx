import { useEffect, useState } from 'react';
import { FlatList, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { RootStackParamList } from '@/navigation';
import { useRideStore } from '@/state/useRideStore';
import { getQuote } from '@/services/rides';
import { searchLocations } from '@/services/geocoding';
import { generateMockPolyline } from '@/utils/mock';
import { showToast } from '@/utils/toast';

export const SearchScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { t } = useTranslation();
  const pickup = useRideStore((state) => state.pickup);
  const dropoff = useRideStore((state) => state.dropoff);
  const setPickup = useRideStore((state) => state.setPickup);
  const setDropoff = useRideStore((state) => state.setDropoff);
  const setQuote = useRideStore((state) => state.setQuote);
  const setPolyline = useRideStore((state) => state.setPolyline);

  const [activeField, setActiveField] = useState<'pickup' | 'dropoff'>(pickup ? 'dropoff' : 'pickup');
  const [query, setQuery] = useState('');

  const { data: results = [] } = useQuery({
    queryKey: ['search-locations', query],
    queryFn: () => searchLocations(query),
    staleTime: 1000 * 60
  });

  useEffect(() => {
    if (activeField === 'pickup' && pickup) {
      setQuery('');
    }
    if (activeField === 'dropoff' && dropoff) {
      setQuery('');
    }
  }, [activeField, pickup, dropoff]);

  const handleSelect = async (location: (typeof results)[number]) => {
    if (activeField === 'pickup') {
      setPickup(location);
      setActiveField('dropoff');
      return;
    }
    setDropoff(location);
    if (pickup) {
      try {
        const quote = await getQuote(pickup, location);
        setQuote(quote);
        const route = generateMockPolyline(pickup, location);
        setPolyline(route);
        navigation.navigate('Confirm');
      } catch (error) {
        console.warn(error);
        showToast(t('common.error'));
      }
    }
  };

  return (
    <View className="flex-1 bg-white p-4 space-y-4">
      <View>
        <Text className="text-sm text-gray-500 mb-1">{t('search.pickup')}</Text>
        <TouchableOpacity
          className={`border rounded-xl px-4 py-3 mb-3 ${
            activeField === 'pickup' ? 'border-primary' : 'border-gray-200'
          }`}
          onPress={() => setActiveField('pickup')}
        >
          <Text className="text-base text-gray-800">{pickup?.label ?? t('search.pickup')}</Text>
        </TouchableOpacity>
        <Text className="text-sm text-gray-500 mb-1">{t('search.dropoff')}</Text>
        <TouchableOpacity
          className={`border rounded-xl px-4 py-3 ${
            activeField === 'dropoff' ? 'border-primary' : 'border-gray-200'
          }`}
          onPress={() => setActiveField('dropoff')}
        >
          <Text className="text-base text-gray-800">{dropoff?.label ?? t('search.dropoff')}</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        placeholder={t('search.title')}
        value={query}
        onChangeText={setQuery}
        className="border border-gray-200 rounded-xl px-4 py-3"
      />

      <FlatList
        data={results}
        keyExtractor={(item) => item.placeId ?? item.label}
        renderItem={({ item }) => (
          <TouchableOpacity
            className="py-3 border-b border-gray-100"
            onPress={() => handleSelect(item)}
          >
            <Text className="text-base text-gray-800">{item.label}</Text>
            <Text className="text-xs text-gray-400">{item.placeId}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={() => (
          <Text className="text-center text-gray-400 mt-8">{t('search.empty')}</Text>
        )}
      />
    </View>
  );
};
