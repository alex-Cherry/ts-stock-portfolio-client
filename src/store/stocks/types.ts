import { ExtendedStock } from '../../types';

export enum StocksActionTypes {
  STOCK_SAVE = 'STOCK_SAVE',
  STOCK_FETCH = 'STOCK_FETCH'
}

export interface StocksState {
  stocks: ExtendedStock[]
}

export interface StockSaveAction {
  type: StocksActionTypes.STOCK_SAVE,
  payload: {
    stock: ExtendedStock
  }
}

export interface StocksFetchAction {
  type: StocksActionTypes.STOCK_FETCH
  payload: {
    stocks: ExtendedStock[]
  }
}

export type StocksAction = StockSaveAction
  | StocksFetchAction;
