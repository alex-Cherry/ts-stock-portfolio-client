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
  let strUser = localStorage.getItem('user');
  if (!strUser) {
    return null;
  }
  try {
    const rawUser = JSON.parse(strUser);
    const user = new User(
      rawUser.id,
      rawUser.username,
      Boolean(rawUser.isAdmin)
    );
    return user ;
  } catch {
    return null;
  }
}
