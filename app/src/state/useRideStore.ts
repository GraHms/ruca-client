import { create } from 'zustand';

import { Location, Quote, Ride, RideStatus } from '@/types/ride';

interface RideState {
  pickup: Location | null;
  dropoff: Location | null;
  quote: Quote | null;
  currentRide: Ride | null;
  polyline: Array<{ lat: number; lng: number }>;
  setPickup: (location: Location | null) => void;
  setDropoff: (location: Location | null) => void;
  setQuote: (quote: Quote | null) => void;
  setPolyline: (points: Array<{ lat: number; lng: number }>) => void;
  setRide: (ride: Ride | null) => void;
  updateRideStatus: (status: RideStatus) => void;
  reset: () => void;
}

export const useRideStore = create<RideState>((set, get) => ({
  pickup: null,
  dropoff: null,
  quote: null,
  currentRide: null,
  polyline: [],
  setPickup: (location) => set({ pickup: location }),
  setDropoff: (location) => set({ dropoff: location }),
  setQuote: (quote) => set({ quote }),
  setPolyline: (points) => set({ polyline: points }),
  setRide: (ride) => set({ currentRide: ride }),
  updateRideStatus: (status) => {
    const ride = get().currentRide;
    if (!ride) return;
    set({ currentRide: { ...ride, status } });
  },
  reset: () => set({ pickup: null, dropoff: null, quote: null, currentRide: null, polyline: [] })
}));
