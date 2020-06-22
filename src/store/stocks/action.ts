import { ThunkAction } from 'redux-thunk';
import { Action } from 'redux';
import { IStock, IExtendedStock } from '../../types';
// import utils
import { useFetch } from '../../utils/useFetch';

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
  stock: IStock
): ThunkAction<Promise<void>, void, unknown, Action<any>> => async (dispatch) => {
  try {
    const data = {
      stock: { ...stock, sectorId: stock.sector.id}
    }
    // execute request
    const fetchResult = await useFetch('/api/stocks/savestock', 'POST', data);
    const { status } = fetchResult;
    // if http-status doesn't have code 2**,
    //    throw an error
    if (status !== 200 && status !== 201) {
      throw new Error('При сохранении данных возникла ошибка');
    }
  } catch (err) {
    throw new Error(err.message);
  }
}


// FETCH STOCKS
export const fetchStocks = (
  bluetip: boolean = false
): ThunkAction<Promise<IExtendedStock[] | undefined>, void, unknown, Action<any>> => async (dispatch) => {
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
    const stocks = data.stocks.map((item: any) => ({
        ...item,
        isFavorite: false
      })
    ) as IExtendedStock[];
    // return data
    return stocks
  } catch (err) {
      throw new Error(err.message);
  }
}


// GET STOCK BY ID
export const getStockById = (
  id: string
): ThunkAction<Promise<IStock | undefined>, void, unknown, Action<any>> => async dispatch => {
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
    const stock = data.stock as IStock;
    // return results
    return stock;
  } catch (err) {
    throw new Error(err.message);
  }
}
