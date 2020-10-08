import { ThunkAction } from 'redux-thunk';
import { Action } from 'redux';
import { ExtendedStock, EconomicSector } from '../../types';
// import utils
import { useFetch } from '../../utils/useFetch';
// 
import { StocksActionTypes, StocksAction } from './types';
import { AppState } from '../';

interface IKeyName {
  id: string,
  name: string
}


/**
 * FETCH SECTORS
 * 
 * The function gets economic sectors from a server
 *  and returns them
 */
export const fetchSectors = (
): ThunkAction<Promise<IKeyName[] | undefined>, void, unknown, Action<any>> => async (dispatch) => {
  try {
    // Execute the request
    const fetchResult = await useFetch('/api/stocks/sectors');
    // Get the data from the response
    const { data, status } = fetchResult;
    // If http-status doesn't have the code 200,
    //  throw an error
    if (status !== 200) {
      const msg = 'При чтении данных возникла ошибка';
      throw new Error(msg);
    }
    // Get sectors
    const sectors = data.sectors as IKeyName[];
    // Return the result
    return sectors;
  } catch (err) {
    throw new Error(err.message);
  }
}


/**
 * SAVE STOCK
 * 
 * The function saves a stock on a server.
 * The stock can be new or existing. Id it has an empty id, it's new
 * 
 * @param stock - the stock to save
 */
export const saveStock = (
  stock: ExtendedStock
): ThunkAction<Promise<void>, void, unknown, Action<any>> => async (dispatch) => {
  try {
    // Form data to save.
    const data = {
      stock: { ...stock }
    }
    // Execute the request
    const fetchResult = await useFetch('/api/stocks/savestock', 'POST', data);
    // Get the data from the response:
    //  - id - id of the new or the edited stock
    const { status, data: id } = fetchResult;
    // If http-status doesn't have the code 2**,
    //  throw an error
    if (status !== 200 && status !== 201) {
      throw new Error('При сохранении данных возникла ошибка');
    }
    //
    stock.id = id;
    // Save the stock in the redux-state
    dispatch(actionCreatorStockSave(stock));

  } catch (err) {
    throw new Error(err.message);
  }
}


/**
 * FETCH STOCKS
 * 
 * The function gets stocks from a server
 *  and returns them
 * 
 * @param bluetip - the flag indicates that need fetch stocks from the "bluetip" category
 */
export const fetchStocks = (
  bluetip: boolean = false
): ThunkAction<Promise<void>, void, unknown, Action<any>> => async (dispatch) => {
  try {
    // Execute the necessary request
    let fetchResult;
    if (bluetip) {
      fetchResult = await useFetch('/api/stocks/stocks?bluetip=true', 'GET', null, {}, true);
    } else {
      fetchResult = await useFetch('/api/stocks/stocks', 'GET', null, {}, true);
    }
    // Get the data from the response
    const { data, status } = fetchResult;
    // If http-status doesn't have the code 200,
    //  throw an error
    if (status !== 200) {
      const msg = 'При чтении данных возникла ошибка';
      throw new Error(msg);
    }
    // Transform data into "our" types
    const stocks: ExtendedStock[] = data.stocks.map((item: any) => {
        // The econ. sector
        const sector = new EconomicSector(
          item.sector.id,
          item.sector.name
        );
        // The stock
        const stock = new ExtendedStock(
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
    );
    
    // Save stocks in the redux-state
    dispatch(actionCreatorStocksFetch(stocks));

  } catch (err) {
      throw new Error(err.message);
  }
}


/**
 * GET STOCK BY ID
 * 
 * The function gets a stock from a server by the specified id
 * 
 * @param id - id of the stock to get
 */
export const getStockById = (
  id: string
): ThunkAction<Promise<ExtendedStock | undefined>, AppState, unknown, Action<any>> => async (dispatch, getState) => {
  
  // At the beginning try to find the stock in the redux-state.
  const { stocks: { stocks } } = getState();
  const stockInStore = stocks.find(el => el.id === id);
  if (stockInStore) {
    return stockInStore;
  }
  
  try {
    // Execute the request
    const fetchResult = await useFetch(`/api/stocks/stocks/${id}`);
    // Get the data from the response:
    const { data, status } = fetchResult;
    // If we didn't find the stock with the specified id,
    //  return undefined
    if (status === 404) {
      return undefined;
      
    // If http-status doesn't have the code 200,
    //  throw an error
    } else if (status !== 200) {
      const msg = 'При чтении данных возникла ошибка';
      throw new Error(msg);
    }
    // Get the data
    const rawStock = data.stock;

    // Create the economic sector
    const sector = new EconomicSector(
      rawStock.sector.id,
      rawStock.sector.name
    );
    // Create the stock
    const stock = new ExtendedStock(
      rawStock.id,
      rawStock.ticker,
      rawStock.shortName,
      rawStock.price,
      sector,
      rawStock.bluetip,
      false // favorite
    );

    // Return the stock
    return stock;

  } catch (err) {
    throw new Error(err.message);
  }
}


/**
 * SET STOCK TO FAVORITE - not realize
 * 
 * The function changes the attribute "isFavorite" of a stock
 * 
 * @param stock - the stock, which the property "isFavorite" is being changed for
 */
export const setStockFavorite = (
  stock: ExtendedStock
): ThunkAction<Promise<void>, void, unknown, Action<any>> => async dispatch => {
  try {
    // here must be a call to REST

    // do in a case of a successful REST-call
    const newStock = stock.copy();
    newStock.isFavorite = !newStock.isFavorite;
    // Save the stock in the redux-state
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
const actionCreatorStocksFetch = (stocks: ExtendedStock[]): StocksAction => {
  return {
    type: StocksActionTypes.STOCK_FETCH,
    payload: { stocks }
  }
}
// SAVE STOCK
const actionCreatorStockSave = (stock: ExtendedStock): StocksAction => {
  return {
    type: StocksActionTypes.STOCK_SAVE,
    payload: { stock }
  }
}
