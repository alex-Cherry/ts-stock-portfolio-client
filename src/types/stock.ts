import { IEconomicSector } from './economicSector';

export interface IStock {
  id: string,
  ticker: string,
  shortName: string,
  price: number,
  sector: IEconomicSector,
  bluetip: boolean
}

export interface IExtendedStock extends IStock {
  isFavorite: boolean
}
