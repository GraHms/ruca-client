import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';

import { AuthSession, User } from '@/types/user';
import { setAuthToken } from '@/services/api';

const SECURE_KEY = 'ruca-session';

interface AuthState {
  session: AuthSession | null;
  loading: boolean;
  initialize: () => Promise<void>;
  login: (identifier: string, code: string) => Promise<void>;
  logout: () => Promise<void>;
  updateLanguage: (language: User['language']) => void;
}

const defaultUser: User = {
  id: 'user-1',
  name: 'Cliente Ruca',
  phone: '+258840000000',
  defaultPaymentMethod: 'mpesa',
  language: 'pt'
};

export const useAuthStore = create<AuthState>((set, get) => ({
  session: null,
  loading: false,
  initialize: async () => {
    set({ loading: true });
    try {
      const raw = await SecureStore.getItemAsync(SECURE_KEY);
      if (raw) {
        const session = JSON.parse(raw) as AuthSession;
        set({ session });
        setAuthToken(session.token);
      }
    } catch (error) {
      console.warn('Failed to load session', error);
    } finally {
      set({ loading: false });
    }
  },
  login: async (identifier: string, code: string) => {
    set({ loading: true });
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      const session: AuthSession = {
        token: `mock-${Date.now()}`,
        user: {
          ...defaultUser,
          phone: identifier || defaultUser.phone,
          language: get().session?.user.language ?? defaultUser.language
        }
      };
      set({ session });
      setAuthToken(session.token);
      await SecureStore.setItemAsync(SECURE_KEY, JSON.stringify(session));
    } finally {
      set({ loading: false });
    }
  },
  logout: async () => {
    set({ session: null });
    setAuthToken(null);
    await SecureStore.deleteItemAsync(SECURE_KEY);
  },
  updateLanguage: (language) => {
    const session = get().session;
    if (!session) return;
    const updated: AuthSession = {
      ...session,
      user: {
        ...session.user,
        language
      }
    };
    set({ session: updated });
    SecureStore.setItemAsync(SECURE_KEY, JSON.stringify(updated)).catch(() => undefined);
  }
}));
