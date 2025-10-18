export type RideStatus =
  | 'searching'
  | 'accepted'
  | 'enroute'
  | 'arrived'
  | 'completed'
  | 'canceled';

export interface Location {
  lat: number;
  lng: number;
  label: string;
  placeId?: string;
}

export interface QuoteBreakdown {
  base: number;
  perKm: number;
  perMin: number;
  surge: number;
  distanceKm: number;
  durationMin: number;
}

export interface Quote {
  currency: 'MZN';
  total: number;
  breakdown: QuoteBreakdown;
}

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  plate: string;
  color: string;
}

export interface Driver {
  id: string;
  name: string;
  rating: number;
  phone: string;
  avatarUrl?: string;
  vehicle: Vehicle;
}

export interface Ride {
  id: string;
  status: RideStatus;
  pickup: Location;
  dropoff: Location;
  quote: Quote;
  driver?: Driver;
  vehicle?: Vehicle;
  etaSec: number;
  createdAt: string;
  updatedAt: string;
}

export type PaymentMethod = 'mpesa' | 'emola' | 'cash' | 'card';
