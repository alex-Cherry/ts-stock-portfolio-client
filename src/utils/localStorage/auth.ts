import { User } from '../../types';

/**
 * This function writes auth data to the local storage.
 * 
 * @param token - the user token
 * @param user - the current user
 */
export const setAuth = (token: string, user: User) => {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
}

/**
 * Clears auth data in the local storage
 */
export const clearAuth = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

/**
 * Returns the user token from the local storage (LS)
 *  or an empty string, if there is no data in the LS
 */
export const getAuthToken = (): string => {
  return localStorage.getItem('token') || '';
}

/**
 * Returns the current user from the local storage (LS)
 *  or null, if there is no data in the LS
 */
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
