import { AnyAction } from 'redux';
import { ThunkAction } from 'redux-thunk';
// Utils
import { setAuth, clearAuth } from '../../utils/localStorage/auth';
import { useFetch } from '../../utils/useFetch';
// Types
import { AuthActionTypes, AuthLoginAction } from './types';
import { User } from '../../types';


/**
 * LOGIN
 * 
 * The function does authorization of an user.
 * And saves the data about the user and its token in the local storage.
 * Authorization is by email and password
 * 
 * @param email 
 * @param password 
 */
export const login = (
  email: string, password: string
): ThunkAction<Promise<void>, void, unknown, AuthLoginAction> => async (dispatch): Promise<void> => {
    
    // Form data necessary for authorization
    const authData = {
      email,
      password
    };

    try {
      // Do authorization
      const fetchResult = await useFetch('/api/auth/login', 'POST', authData);
      // Get result of the response
      const { data, status } = fetchResult;
      
      // If http-status doesn't have code 200,
      //  throw an error
      if (status !== 200) {
        throw new Error(data.message);
      }
      // Get the user and the token from the response
      const { user, token } = data;
      // Create the user
      const loggedUser = new User(
        user.id,
        user.username,
        user.isAdmin
      );
      // Set redux-state
      dispatch(authSuccess(loggedUser, token));
      // Save the user and the token in the local storage
      setAuth(token, loggedUser);

    } catch (err) {
      const msg = err.message || 'При авторизации возникла ошибка';
      throw new Error(msg);
    }
}


/**
 * REGISTER
 * 
 * The function does registration of an user.
 * 
 * @param email 
 * @param password 
 * @param username 
 */
export const register = (
  email: string, password: string, username: string
): ThunkAction<Promise<void>, void, unknown, AnyAction> => async (dispatch): Promise<void> => {
    try {
      // Form data necessary for registration
      const registerData = { email, password, username };
      // Do registration
      const fetchResult = await useFetch('/api/auth/register', 'POST', registerData);
      // Get result from the response
      const { data, status } = fetchResult;
      // If http-status doesn't have code 2**,
      //  throw an error
      if (Math.floor(status / 100) !== 2) {
        throw new Error(data.message);
      }
    } catch (err) {
      const msg = err.message || 'При регистации возникла ошибка';
      throw new Error(msg);
    }
}


////////////////////////////////////////////////////////////////////////////////
// 
// ACTION CREATORS
// 
////////////////////////////////////////////////////////////////////////////////

// AUTH SUCCESS
export const authSuccess = (
  user: User, token: string
): AuthLoginAction => {
  return {
    type: AuthActionTypes.AUTH_LOGIN,
    payload: { user, token }
  }
}
// LOGOUT
export const authLogout = () => {
  // Clear auth data in the local storage
  clearAuth();
  // action creator
  return logout();
}
// 
const logout = () => {
  return {
    type: AuthActionTypes.AUTH_LOGOUT
  }
}
