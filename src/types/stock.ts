import { EconomicSector } from './economicSector';

export class Stock {

  public id: string;
  public ticker: string;
  public shortName: string;
  public price: number;
  public sector: EconomicSector;
  public bluetip: boolean;

  constructor() {
    this.id = '';
    this.ticker = '';
    this.shortName = '';
    this.price = 0;
    this.sector = new EconomicSector();
    this.bluetip = false;
  }

  init(
    id?: string,
    ticker?: string,
    shortName?: string,
    price?: number,
    sector?: EconomicSector,
    bluetip?: boolean
  ) {
    this.id = id || '';
    this.ticker = ticker || '';
    this.shortName = shortName || '';
    this.price = price || 0;
    this.sector = sector || new EconomicSector();
    this.bluetip = bluetip || false;
  }

}

export class ExtendedStock extends Stock {
  
  public isFavorite: boolean;

  constructor() {
    super();
    this.isFavorite = false;
  }

  init(
    id?: string,
    ticker?: string,
    shortName?: string,
    price?: number,
    sector?: EconomicSector,
    bluetip?: boolean,
    isFavorite?: boolean
  ) {
    super.init(
      id,
      ticker,
      shortName,
      price,
      sector,
      bluetip
    );
    this.isFavorite = isFavorite || false;
  }

}
