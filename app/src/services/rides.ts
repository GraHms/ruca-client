import { quoteSchema, rideSchema } from '@/utils/validators';
import { createMockRide, mockQuote, progressRide } from '@/utils/mock';
import { Location, Quote, Ride } from '@/types/ride';

const rideCache = new Map<string, Ride>();

const haversineDistance = (a: Location, b: Location) => {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const sinDLat = Math.sin(dLat / 2);
  const sinDLon = Math.sin(dLon / 2);
  const aCalc = sinDLat * sinDLat + sinDLon * sinDLon * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(aCalc), Math.sqrt(1 - aCalc));
  return R * c;
};

export const getQuote = async (pickup: Location, dropoff: Location): Promise<Quote> => {
  const distanceKm = Math.max(1, haversineDistance(pickup, dropoff));
  const durationMin = distanceKm * 3;
  const quote = mockQuote(distanceKm, durationMin);
  return quoteSchema.parse(quote);
};

export const requestRide = async (params: {
  pickup: Location;
  dropoff: Location;
  quote: Quote;
}): Promise<Ride> => {
  const ride = createMockRide(params);
  rideCache.set(ride.id, ride);
  return rideSchema.parse(ride);
};

export const cancelRide = async (rideId: string) => {
  const ride = rideCache.get(rideId);
  if (!ride) return null;
  const canceled: Ride = { ...ride, status: 'canceled', updatedAt: new Date().toISOString() };
  rideCache.set(rideId, canceled);
  return rideSchema.parse(canceled);
};

export const pollRide = async (rideId: string): Promise<Ride | null> => {
  const ride = rideCache.get(rideId);
  if (!ride) return null;
  if (['completed', 'canceled'].includes(ride.status)) {
    return ride;
  }
  const shouldAdvance = Math.random() > 0.4;
  const nextRide = shouldAdvance ? progressRide(ride) : { ...ride, updatedAt: new Date().toISOString() };
  rideCache.set(rideId, nextRide);
  return rideSchema.parse(nextRide);
};

export const resetRides = () => rideCache.clear();
