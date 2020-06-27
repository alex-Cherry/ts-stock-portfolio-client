import { ThunkAction } from 'redux-thunk';
import { Action } from 'redux';
import { ExtendedStock, EconomicSector } from '../../types';
// import utils
import { useFetch } from '../../utils/useFetch';
// 
import { StocksActionTypes } from './types';
import { AppState } from '..';

interface IKeyName {
  id: string,
  name: string
}


// FETCH SECTORS
export const fetchSectors = (
): ThunkAction<Promise<IKeyName[] | undefined>, void, unknown, Action<any>> => async (dispatch) => {
  try {
    // execute request
    const fetchResult = await useFetch('/api/stocks/sectors');
    const { data, status } = fetchResult;
    // if http-status doesn't have code 200,
    //    throw an error
    if (status !== 200) {
      const msg = 'При чтении данных возникла ошибка';
      throw new Error(msg);
    }
    // get data
    const sectors = data.sectors as IKeyName[];
    // return results
    return sectors;
  } catch (err) {
    throw new Error(err.message);
  }
}


// SAVE STOCK
export const saveStock = (
  stock: ExtendedStock
): ThunkAction<Promise<void>, void, unknown, Action<any>> => async (dispatch) => {
  try {
    const data = {
      stock: { ...stock, sectorId: stock.sector.id}
    }
    // execute request
    const fetchResult = await useFetch('/api/stocks/savestock', 'POST', data);
    const { status, data: id } = fetchResult;
    // if http-status doesn't have code 2**,
    //    throw an error
    if (status !== 200 && status !== 201) {
      throw new Error('При сохранении данных возникла ошибка');
    }
    // dispatch
    stock.id = id;
    dispatch(actionCreatorStockSave(stock));

  } catch (err) {
    throw new Error(err.message);
  }
}


// FETCH STOCKS
export const fetchStocks = (
  bluetip: boolean = false
): ThunkAction<Promise<void>, void, unknown, Action<any>> => async (dispatch) => {
  try {
    // execute request
    let fetchResult;
    if (bluetip) {
      fetchResult = await useFetch('/api/stocks/stocks?bluetip=true', 'GET', null, {}, true);
    } else {
      fetchResult = await useFetch('/api/stocks/stocks', 'GET', null, {}, true);
    }
    const { data, status } = fetchResult;
    // if http-status doesn't have code 200,
    //    throw an error
    if (status !== 200) {
      const msg = 'При чтении данных возникла ошибка';
      throw new Error(msg);
    }
    // transform data
    const stocks = data.stocks.map((item: any) => {
        
        const sector = new EconomicSector();
        sector.init(
          item.sector.id,
          item.sector.name
        );

        const stock = new ExtendedStock();
        stock.init(
          item.id,
          item.ticker,
          item.shortName,
          item.price,
          sector,
          item.bluetip,
          false
        );

        return stock;
      }
    ) as ExtendedStock[];
    
    // dispatch
    dispatch(actionCreatorStocksFetch(stocks));

  } catch (err) {
      throw new Error(err.message);
  }
}


// GET STOCK BY ID
export const getStockById = (
  id: string
): ThunkAction<Promise<ExtendedStock | undefined>, AppState, unknown, Action<any>> => async (dispatch, getState) => {
  
  const { stocks: { stocks } } = getState();
  const stockInStore = stocks.find(el => el.id === id);
  if (stockInStore) {
    return stockInStore;
  }
  
  try {
    const fetchResult = await useFetch(`/api/stocks/stocks/${id}`);
    const { data, status } = fetchResult;
    // if http-status doesn't have code 200,
    //    throw an error
    if (status !== 200) {
      const msg = 'При чтении данных возникла ошибка';
      throw new Error(msg);
    }
    // get data
    const rawStock = data.stock;

    // create sector
    const sector = new EconomicSector();
    sector.init(
      rawStock.sector.id,
      rawStock.sector.name
    );

    // create stock
    const stock = new ExtendedStock();
    stock.init(
      rawStock.id,
      rawStock.ticker,
      rawStock.shortName,
      rawStock.price,
      sector,
      rawStock.bluetip,
      false // favorite
    );

    // return results
    return stock;

  } catch (err) {
    throw new Error(err.message);
  }
}

// SET STOCK TO FAVORITE
export const setStockFavorite = (
  stock: ExtendedStock
): ThunkAction<Promise<void>, void, unknown, Action<any>> => async dispatch => {
  try {
    // here must be a call to REST

    // do in a case of successful REST-call
    const newStock = stock.copy();
    newStock.isFavorite = !newStock.isFavorite;

    dispatch(actionCreatorStockSave(newStock));

  } catch (err) {
    throw new Error(err.message);
  }
}


////////////////////////////////////////////////////////////////////////////////
// 
// ACTION CREATORS
// 
////////////////////////////////////////////////////////////////////////////////

// FETCH STOCKS
const actionCreatorStocksFetch = (stocks: ExtendedStock[]) => {
  return {
    type: StocksActionTypes.STOCK_FETCH,
    payload: { stocks }
  }
}

// SAVE STOCK
const actionCreatorStockSave = (stock: ExtendedStock) => {
  return {
    type: StocksActionTypes.STOCK_SAVE,
    payload: { stock }
  }
}
