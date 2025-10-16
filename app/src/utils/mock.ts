import { formatISO } from 'date-fns';

import { Driver, Location, Quote, Ride } from '@/types/ride';

export const mockLocations: Location[] = [
  { label: 'Maputo CBD', lat: -25.9683, lng: 32.5731, placeId: 'maputo-cbd' },
  { label: 'Baixa', lat: -25.9688, lng: 32.5686, placeId: 'baixa' },
  { label: 'Costa do Sol', lat: -25.9399, lng: 32.6446, placeId: 'costa-do-sol' },
  { label: 'Zimpeto', lat: -25.8559, lng: 32.6084, placeId: 'zimpeto' },
  { label: 'Alto Maé', lat: -25.9632, lng: 32.5807, placeId: 'alto-mae' },
  { label: 'Polana', lat: -25.9643, lng: 32.6053, placeId: 'polana' }
];

export const mockDrivers: Driver[] = [
  {
    id: 'driver-1',
    name: 'João Matavele',
    rating: 4.9,
    phone: '+258841234567',
    vehicle: {
      id: 'vehicle-1',
      make: 'Toyota',
      model: 'Corolla',
      plate: 'ABC 123 MP',
      color: 'Branco'
    }
  },
  {
    id: 'driver-2',
    name: 'Ana Nhampule',
    rating: 4.8,
    phone: '+258842468024',
    vehicle: {
      id: 'vehicle-2',
      make: 'Hyundai',
      model: 'i10',
      plate: 'DEF 456 MP',
      color: 'Azul'
    }
  },
  {
    id: 'driver-3',
    name: 'Tomás Mutisse',
    rating: 4.7,
    phone: '+258843334455',
    vehicle: {
      id: 'vehicle-3',
      make: 'Nissan',
      model: 'Almera',
      plate: 'GHI 789 MP',
      color: 'Cinza'
    }
  }
];

export const mockQuote = (distanceKm: number, durationMin: number): Quote => {
  const base = 60;
  const perKm = 35 * distanceKm;
  const perMin = 5 * durationMin;
  const surge = distanceKm > 10 ? 40 : 0;
  const total = Math.round(base + perKm + perMin + surge);
  return {
    currency: 'MZN',
    total,
    breakdown: {
      base,
      perKm: Math.round(perKm),
      perMin: Math.round(perMin),
      surge,
      distanceKm,
      durationMin
    }
  };
};

export const createMockRide = (params: {
  pickup: Location;
  dropoff: Location;
  quote: Quote;
}): Ride => {
  const now = new Date();
  return {
    id: `ride-${Math.random().toString(36).slice(2, 8)}`,
    status: 'searching',
    pickup: params.pickup,
    dropoff: params.dropoff,
    quote: params.quote,
    etaSec: 300,
    createdAt: formatISO(now),
    updatedAt: formatISO(now)
  };
};

export const progressRide = (ride: Ride): Ride => {
  const statuses: Ride['status'][] = ['searching', 'accepted', 'enroute', 'arrived', 'completed'];
  const currentIndex = statuses.indexOf(ride.status);
  const nextStatus = statuses[Math.min(currentIndex + 1, statuses.length - 1)];
  const assignedDriver = ride.driver ?? mockDrivers[Math.floor(Math.random() * mockDrivers.length)];
  const nextEta = Math.max(ride.etaSec - 60, 0);
  return {
    ...ride,
    status: nextStatus,
    driver: assignedDriver,
    vehicle: assignedDriver.vehicle,
    etaSec: nextEta,
    updatedAt: formatISO(new Date())
  };
};

export const generateMockPolyline = (pickup: Location, dropoff: Location): Array<{ lat: number; lng: number }> => {
  return [
    pickup,
    {
      lat: (pickup.lat + dropoff.lat) / 2 + (Math.random() - 0.5) * 0.01,
      lng: (pickup.lng + dropoff.lng) / 2 + (Math.random() - 0.5) * 0.01,
      label: 'mid'
    },
    dropoff
  ].map(({ lat, lng }) => ({ lat, lng }));
};

export const mockDriverLocation = (base: Location) => {
  const offset = () => (Math.random() - 0.5) * 0.01;
  return {
    lat: base.lat + offset(),
    lng: base.lng + offset()
  };
};

export const buildDriverRequest = () => {
  const now = new Date();
  const pickup = mockLocations[Math.floor(Math.random() * mockLocations.length)];
  const dropoff = mockLocations[Math.floor(Math.random() * mockLocations.length)];
  const quote = mockQuote(6 + Math.random() * 8, 18 + Math.random() * 15);
  return {
    id: `request-${Math.random().toString(36).slice(2, 8)}`,
    pickup,
    dropoff,
    quote,
    requestedAt: formatISO(now)
  };
};
