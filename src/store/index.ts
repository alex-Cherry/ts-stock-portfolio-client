import { combineReducers } from 'redux';

// import companiesReducer from './companies/reducer';
import authReducer from './auth/reducer';
import toastsReducer from './toasts/reducer';

const rootReducer = combineReducers({
  // companies: companiesReducer,
  auth: authReducer,
  toasts: toastsReducer
});

export default rootReducer;
export type AppState = ReturnType<typeof rootReducer>;
