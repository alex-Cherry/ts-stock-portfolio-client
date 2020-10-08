import {
  AuthState,
  AuthActionTypes,
  AuthActions
} from './types';

// INITIAL STATE
const initialState: AuthState = {
  token: '',
  user: null
}

// REDUCER
export default function authReducer(state: AuthState = initialState, action: AuthActions): AuthState {
  
  switch (action.type) {

    // - LOGIN
    case AuthActionTypes.AUTH_LOGIN:
      
      const { user, token } = action.payload;
      return {
        ...state,
        user,
        token
      };

    // - LOGOUT
    case AuthActionTypes.AUTH_LOGOUT:
      return {
        ...state,
        token: '',
        user: null
      };

    // - DEFAULT
    default:
      return state;
  }

}
