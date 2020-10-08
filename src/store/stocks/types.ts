import { ExtendedStock } from '../../types';

// ACTION TYPES
export enum StocksActionTypes {
  STOCK_SAVE = 'STOCK_SAVE',
  STOCK_FETCH = 'STOCK_FETCH'
}

// STATE
export interface StocksState {
  stocks: ExtendedStock[]
}

// ACTIONS
// => Save Stock
export interface StockSaveAction {
  type: StocksActionTypes.STOCK_SAVE,
  payload: {
    stock: ExtendedStock
  }
}
// => Fetch Stocks
export interface StocksFetchAction {
  type: StocksActionTypes.STOCK_FETCH
  payload: {
    stocks: ExtendedStock[]
  }
}

// Union all possible actions
export type StocksAction = StockSaveAction
  | StocksFetchAction;
