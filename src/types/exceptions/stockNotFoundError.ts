export default class StockNotFoundError extends Error {
  constructor(msg: string) {
    super(msg);
    this.name = 'StockNotFoundError';
  }
}
