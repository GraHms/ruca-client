export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  defaultPaymentMethod: 'mpesa' | 'emola' | 'cash';
  language: 'pt' | 'en';
}

export interface AuthSession {
  token: string;
  user: User;
}
