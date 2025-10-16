import { mockLocations } from '@/utils/mock';
import { Location } from '@/types/ride';

export const searchLocations = async (query: string): Promise<Location[]> => {
  if (!query) return mockLocations.slice(0, 5);
  const lower = query.toLowerCase();
  return mockLocations.filter((loc) => loc.label.toLowerCase().includes(lower)).slice(0, 8);
};

export const reverseGeocode = async (_coords: { lat: number; lng: number }): Promise<Location> => {
  return mockLocations[0];
};
