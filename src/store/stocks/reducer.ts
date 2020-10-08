import { StocksState, StocksAction, StocksActionTypes } from './types';
import { ExtendedStock } from '../../types';

// INITIAL STATE
const initialState: StocksState = {
  stocks: []
}

// REDUCER
export default function stocksReducer(state: StocksState = initialState, action: StocksAction) {
  switch (action.type) {
    // - SAVE
    case StocksActionTypes.STOCK_SAVE:

      const stocks = addStockToArray(state, action.payload.stock)
      return {
        ...state,
        stocks: [ ...stocks ]
      };

    // - FETCH
    case StocksActionTypes.STOCK_FETCH:
      return {
        ...state,
        stocks: [ ...action.payload.stocks ]
      }
    
    // - DEFAULT
    default:
      return {
        ...state
      };
  }
}


// UTILS
/**
 * addStockToArray
 * 
 * A few stocks are stored as an array in the redux state for a quick access.
 * When we add a new stock or edit an existing one,
 *  we can't change an array in the redux-state directly.
 * So this function is used for such operations.
 * If we add a new stock, the function add it to the end of the array,
 *  if we edit a stock, we replace it in the array
 * 
 * @param state 
 * @param stock 
 */
const addStockToArray = (state: StocksState, stock: ExtendedStock): ExtendedStock[] => {

  // Copy the array form the state
  let stocks = [ ...state.stocks ];
  // Define the index of the stock
  const idx = state.stocks.findIndex(el => el.id === stock.id);
  // If we didn't find it, push it to the array
  if (idx === -1) {
    stocks.push(stock);
  
  // Otherwise, we replace it in the array
  } else {
    stocks = [
      ...stocks.slice(0, idx),
      stock,
      ...stocks.slice(idx + 1)
    ];

  }

  return stocks;
}
