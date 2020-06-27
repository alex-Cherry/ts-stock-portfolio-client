import { combineReducers } from 'redux';

// import companiesReducer from './companies/reducer';
import authReducer from './auth/reducer';
import toastsReducer from './toasts/reducer';
import stocksReducer from './stocks/reducer';

const rootReducer = combineReducers({
  // companies: companiesReducer,
  auth: authReducer,
  toasts: toastsReducer,
  stocks: stocksReducer
});

export default rootReducer;
export type AppState = ReturnType<typeof rootReducer>;
