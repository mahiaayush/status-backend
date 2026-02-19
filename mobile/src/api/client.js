import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const TOKEN_KEY = 'auth_token';
let BASE_URL = Platform.OS === 'android' ? 'http://10.0.2.2:3000' : 'http://localhost:3000';

export const setBaseUrl = (url) => {
  BASE_URL = url;
};

export const getToken = async () => {
  return SecureStore.getItemAsync(TOKEN_KEY);
};

export const setToken = async (token) => {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
};

export const clearToken = async () => {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
};

const request = async (path, options = {}) => {
  const url = `${BASE_URL}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const err = new Error(data?.message || 'Request failed');
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
};

const authRequest = async (path, options = {}) => {
  const token = await getToken();
  if (!token) {
    const err = new Error('No auth token');
    err.status = 401;
    throw err;
  }
  return request(path, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  });
};

export const sendOtp = (phoneNumber, recaptchaToken) =>
  request('/auth/phone/send-otp', {
    method: 'POST',
    body: JSON.stringify({ phoneNumber, recaptchaToken }),
  });

export const verifyOtp = async (sessionInfo, code) => {
  const data = await request('/auth/phone/verify-otp', {
    method: 'POST',
    body: JSON.stringify({ sessionInfo, code }),
  });
  if (data.customToken) {
    await setToken(data.customToken);
  }
  return data;
};

export const testLogin = async (phoneNumber) => {
  const data = await request('/auth/phone/test-login', {
    method: 'POST',
    body: JSON.stringify({ phoneNumber }),
  });
  if (data.customToken) {
    await setToken(data.customToken);
  }
  return data;
};

export const getMe = () => authRequest('/auth/me');

export const getTodayStatus = () => request('/status/today');

export const getCategoryStatuses = (type) =>
  request(`/status/category/${encodeURIComponent(type)}`);
