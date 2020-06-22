import { User } from '../../types';

export enum AuthActionTypes {
  AUTH_LOGIN = 'AUTH_LOGIN',
  AUTH_LOGOUT = 'AUTH_LOGOUT'
}

export interface AuthState {
  token: string,
  user: User | null
}

export interface AuthLoginAction {
  type: AuthActionTypes.AUTH_LOGIN,
  payload: AuthState
}

export interface AuthLogoutAction {
  type: AuthActionTypes.AUTH_LOGOUT
}

export type AuthActions = AuthLoginAction | AuthLogoutAction;
