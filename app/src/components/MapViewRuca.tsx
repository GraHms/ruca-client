import { useEffect, useMemo, useRef, useState } from 'react';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { View, Text } from 'react-native';
import Constants from 'expo-constants';

import { Location } from '@/types/ride';
import { getMapRegionFromLocations } from '@/services/maps';
import { mockDriverLocation } from '@/utils/mock';

interface MapViewRucaProps {
  pickup?: Location | null;
  dropoff?: Location | null;
  polyline?: Array<{ lat: number; lng: number }>;
}

export const MapViewRuca = ({ pickup, dropoff, polyline = [] }: MapViewRucaProps) => {
  const mapRef = useRef<MapView | null>(null);
  const [baseRegion] = useState(() => ({
    latitude: -25.9653,
    longitude: 32.5892,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1
  }));

  const drivers = useMemo(() => {
    if (!pickup) return [];
    return new Array(4).fill(0).map((_, index) => ({
      id: `driver-${index}`,
      ...mockDriverLocation(pickup)
    }));
  }, [pickup]);

  const region = useMemo(() => {
    const points = [pickup, dropoff].filter(Boolean) as Location[];
    if (!points.length) return baseRegion;
    return getMapRegionFromLocations(points);
  }, [pickup, dropoff, baseRegion]);

  useEffect(() => {
    if (!mapRef.current) return;
    if (pickup && dropoff) {
      mapRef.current.fitToCoordinates(
        [pickup, dropoff].map((loc) => ({ latitude: loc.lat, longitude: loc.lng })),
        {
          edgePadding: { top: 80, right: 80, bottom: 80, left: 80 },
          animated: true
        }
      );
    }
  }, [pickup, dropoff]);

  const googleProviderAvailable = Boolean(Constants.expoConfig?.extra?.googleMapsApiKey);

  if (!googleProviderAvailable && !pickup) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-100 rounded-3xl">
        <Text className="text-gray-500">Mapa mock disponível sem chave Google</Text>
      </View>
    );
  }

  return (
    <MapView
      ref={mapRef}
      style={{ flex: 1, borderRadius: 24 }}
      provider={googleProviderAvailable ? PROVIDER_GOOGLE : undefined}
      initialRegion={region}
      showsUserLocation
      showsMyLocationButton={false}
    >
      {pickup ? (
        <Marker coordinate={{ latitude: pickup.lat, longitude: pickup.lng }} title={pickup.label} />
      ) : null}
      {dropoff ? (
        <Marker
          coordinate={{ latitude: dropoff.lat, longitude: dropoff.lng }}
          title={dropoff.label}
          pinColor="#f59e0b"
        />
      ) : null}
      {drivers.map((driver) => (
        <Marker
          key={driver.id}
          coordinate={{ latitude: driver.lat, longitude: driver.lng }}
          title="Ruca"
          pinColor="#0f766e"
        />
      ))}
      {polyline.length > 1 ? (
        <Polyline
          coordinates={polyline.map((point) => ({ latitude: point.lat, longitude: point.lng }))}
          strokeWidth={4}
          strokeColor="#0f766e"
        />
      ) : null}
    </MapView>
  );
};
