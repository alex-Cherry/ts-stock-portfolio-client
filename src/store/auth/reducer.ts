import {
  AuthState,
  AuthActionTypes,
  AuthActions
} from './types';

const initialState: AuthState = {
  token: '',
  user: null
}

export default function authReducer(state: AuthState = initialState, action: AuthActions): AuthState {
  
  switch (action.type) {
    case AuthActionTypes.AUTH_LOGIN:
      
      const { user, token } = action.payload;
      return {
        ...state,
        user,
        token
      };

    case AuthActionTypes.AUTH_LOGOUT:
      return {
        ...state,
        token: '',
        user: null
      };

    default:
      return state;
  }

}
