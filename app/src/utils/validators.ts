import { z } from 'zod';

export const locationSchema = z.object({
  lat: z.number(),
  lng: z.number(),
  label: z.string(),
  placeId: z.string().optional()
});

export const quoteSchema = z.object({
  currency: z.literal('MZN'),
  total: z.number(),
  breakdown: z.object({
    base: z.number(),
    perKm: z.number(),
    perMin: z.number(),
    surge: z.number(),
    distanceKm: z.number(),
    durationMin: z.number()
  })
});

export const vehicleSchema = z.object({
  id: z.string(),
  make: z.string(),
  model: z.string(),
  plate: z.string(),
  color: z.string()
});

export const driverSchema = z.object({
  id: z.string(),
  name: z.string(),
  rating: z.number(),
  phone: z.string(),
  avatarUrl: z.string().optional(),
  vehicle: vehicleSchema
});

export const rideSchema = z.object({
  id: z.string(),
  status: z.enum(['searching', 'accepted', 'enroute', 'arrived', 'completed', 'canceled']),
  pickup: locationSchema,
  dropoff: locationSchema,
  quote: quoteSchema,
  driver: driverSchema.optional(),
  vehicle: vehicleSchema.optional(),
  etaSec: z.number(),
  createdAt: z.string(),
  updatedAt: z.string()
});

export type RideSchema = z.infer<typeof rideSchema>;
