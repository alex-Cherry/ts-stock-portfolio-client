export class EconomicSector {
  
  public id: string;
  public name: string;

  constructor() {
    this.id = '';
    this.name = '';
  }
  
  init(
    id?: string,
    name?: string
  ) {
    this.id = id || '';
    this.name = name || '';
  }
}
