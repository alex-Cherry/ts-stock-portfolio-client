import { AnyAction } from 'redux';
import { ThunkAction } from 'redux-thunk';
// import utils
import { setAuth, clearAuth } from '../../utils/localStorage/auth';
import { useFetch } from '../../utils/useFetch';
// import types
import { AuthActionTypes, AuthLoginAction } from './types';
import { User } from '../../types';

// LOGIN
export const login = (
  email: string, password: string
): ThunkAction<Promise<void>, void, unknown, AuthLoginAction> => async (dispatch): Promise<void> => {
    
    // form data necessary for authorization
    const authData = {
      email,
      password
    };

    try {
      // do authorization
      const fetchResult = await useFetch('/api/auth/login', 'POST', authData);
      const { data, status } = fetchResult;
      
      // if http-status doesn't have code 200,
      //    throw an error
      if (status !== 200) {
        throw new Error(data.message);
      }
      // get data from response
      const { user, token } = data;
      // create an user
      const loggedUser = new User();
      loggedUser.init(
        user.id,
        user.username,
        user.isAdmin
      );
      // set redux-state
      dispatch(authSuccess(loggedUser, token));
      // save data in local storage
      setAuth(token, loggedUser);

    } catch (err) {
      const msg = err.message || 'При авторизации возникла ошибка';
      throw new Error(msg);
    }
}


// REGISTER
export const register = (
  email: string, password: string, username: string
): ThunkAction<Promise<void>, void, unknown, AnyAction> => async (dispatch): Promise<void> => {
    try {
      const registerData = { email, password, username };
      const fetchResult = await useFetch('/api/auth/register', 'POST', registerData);
      const { data, status } = fetchResult;
      // if http-status doesn't have code 2**,
      //    throw an error
      if (Math.floor(status / 100) !== 2) {
        throw new Error(data.message);
      }
    } catch (err) {
      const msg = err.message || 'При регистации возникла ошибка';
      throw new Error(msg);
    }
}


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
  // clear data in local storage
  clearAuth();
  // action creator
  return logout();
}

const logout = () => {
  return {
    type: AuthActionTypes.AUTH_LOGOUT
  }
}
