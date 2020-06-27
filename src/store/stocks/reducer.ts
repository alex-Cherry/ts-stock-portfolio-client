import { StocksState, StocksAction, StocksActionTypes } from './types';
import { ExtendedStock } from '../../types';

const initialState: StocksState = {
  stocks: []
}

export default function stocksReducer(state: StocksState = initialState, action: StocksAction) {
  switch (action.type) {
    case StocksActionTypes.STOCK_SAVE:

      const stocks = addStockToArray(state, action.payload.stock)
      return {
        ...state,
        stocks: [ ...stocks ]
      };

    case StocksActionTypes.STOCK_FETCH:
      return {
        ...state,
        stocks: [ ...action.payload.stocks ]
      }
    
    default:
      return {
        ...state
      };
  }
}


// UTILS
const addStockToArray = (state: StocksState, stock: ExtendedStock): ExtendedStock[] => {

  let stocks = [ ...state.stocks ];
  const idx = state.stocks.findIndex(el => el.id === stock.id);
  if (idx === -1) {
    stocks.push(stock);

  } else {
    stocks = [
      ...stocks.slice(0, idx),
      stock,
      ...stocks.slice(idx + 1)
    ];

  }

  return stocks;
}
