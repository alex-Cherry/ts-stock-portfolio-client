// This exception is used when a stock isn't found by an id
// 
export default class StockNotFoundError extends Error {
  constructor(msg: string) {
    super(msg);
    this.name = 'StockNotFoundError';
  }
}
