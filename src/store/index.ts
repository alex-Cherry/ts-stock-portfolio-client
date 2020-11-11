import { combineReducers } from 'redux';

// import companiesReducer from './companies/reducer';
import authReducer from './auth/reducer';
import stocksReducer from './stocks/reducer';

const rootReducer = combineReducers({
  // companies: companiesReducer,
  auth: authReducer,
  stocks: stocksReducer
});

export default rootReducer;
export type AppState = ReturnType<typeof rootReducer>;
