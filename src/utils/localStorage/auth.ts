import { User } from '../../types';

export const setAuth = (token: string, user: User) => {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
}

export const clearAuth = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

export const getAuthToken = (): string => {
  return localStorage.getItem('token') || '';
}

export const getAuthUser = (): User | null => {
  let rawUser = localStorage.getItem('user');
  if (!rawUser) {
    return null;
  }
  try {
    return JSON.parse(rawUser) as User;
  } catch {
    return null;
  }
}
