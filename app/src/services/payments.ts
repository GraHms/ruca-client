import { PaymentMethod } from '@/types/ride';

export interface PaymentResult {
  success: boolean;
  reference: string;
  message?: string;
}

const simulatePayment = async (method: PaymentMethod, amount: number): Promise<PaymentResult> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const success = Math.random() > 0.1;
      resolve({
        success,
        reference: `${method}-${Date.now()}`,
        message: success ? undefined : 'Payment declined'
      });
    }, 1200);
  });
};

export const mpesaPay = async (rideId: string, msisdn: string, amountMzn: number) => {
  return simulatePayment('mpesa', amountMzn);
};

export const emolaPay = async (rideId: string, msisdn: string, amountMzn: number) => {
  return simulatePayment('emola', amountMzn);
};

export const cardPay = async (rideId: string, cardToken: string, amountMzn: number) => {
  return simulatePayment('card', amountMzn);
};
