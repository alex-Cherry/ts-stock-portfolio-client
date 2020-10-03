export class EconomicSector {
  
  public id: string;
  public name: string;

  constructor()
  constructor(id: string, name: string)
  constructor(id?: string, name?: string) {
    this.id = id || '';
    this.name = name || '';
  }
}
