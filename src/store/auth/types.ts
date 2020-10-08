import { User } from '../../types';

// ACTION TYPES
export enum AuthActionTypes {
  AUTH_LOGIN = 'AUTH_LOGIN',
  AUTH_LOGOUT = 'AUTH_LOGOUT'
}

// STATE
export interface AuthState {
  token: string,
  user: User | null
}

// ACTIONS
// => Login
export interface AuthLoginAction {
  type: AuthActionTypes.AUTH_LOGIN,
  payload: AuthState
}
// => Logout
export interface AuthLogoutAction {
  type: AuthActionTypes.AUTH_LOGOUT
}

export type AuthActions = AuthLoginAction | AuthLogoutAction;
