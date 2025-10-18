import { create } from 'zustand';

import { buildDriverRequest } from '@/utils/mock';
import { Quote } from '@/types/ride';

interface DriverRequest {
  id: string;
  pickup: { label: string };
  dropoff: { label: string };
  quote: Quote;
  requestedAt: string;
}

interface DriverState {
  available: boolean;
  earningsToday: number;
  activeRequests: DriverRequest[];
  toggleAvailability: () => void;
  pollRequests: () => void;
  acceptRequest: (id: string) => void;
  declineRequest: (id: string) => void;
  clear: () => void;
}

export const useDriverStore = create<DriverState>((set, get) => ({
  available: false,
  earningsToday: 1250,
  activeRequests: [],
  toggleAvailability: () => set((state) => ({ available: !state.available })),
  pollRequests: () => {
    const { available } = get();
    if (!available) return;
    if (Math.random() > 0.6) {
      const request = buildDriverRequest();
      set((state) => ({ activeRequests: [...state.activeRequests, request] }));
    }
  },
  acceptRequest: (id) => {
    set((state) => ({
      activeRequests: state.activeRequests.filter((req) => req.id !== id),
      earningsToday: state.earningsToday + 250
    }));
  },
  declineRequest: (id) => {
    set((state) => ({ activeRequests: state.activeRequests.filter((req) => req.id !== id) }));
  },
  clear: () => set({ activeRequests: [], available: false })
}));
