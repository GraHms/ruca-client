import axios from 'axios';
import Constants from 'expo-constants';

const apiBaseUrl = Constants.expoConfig?.extra?.apiBaseUrl ?? 'https://mock.ruca.mz';

let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  authToken = token;
};

export const api = axios.create({
  baseURL: apiBaseUrl,
  timeout: 8000
});

api.interceptors.request.use((config) => {
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});

export default api;
