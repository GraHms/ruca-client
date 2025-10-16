import { Location } from '@/types/ride';

export interface MapRegion {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

export const getMapRegionFromLocations = (points: Location[], padding = 0.05): MapRegion => {
  const lats = points.map((p) => p.lat);
  const lngs = points.map((p) => p.lng);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  const latitude = (minLat + maxLat) / 2;
  const longitude = (minLng + maxLng) / 2;
  const latitudeDelta = Math.max((maxLat - minLat) * 1.5, padding);
  const longitudeDelta = Math.max((maxLng - minLng) * 1.5, padding);
  return {
    latitude,
    longitude,
    latitudeDelta,
    longitudeDelta
  };
};
