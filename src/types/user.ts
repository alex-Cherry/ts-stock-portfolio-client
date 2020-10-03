export class User {

  id: string;
  username: string;
  isAdmin: boolean;

  constructor()
  constructor(id: string, username: string, isAdmin: boolean)
  constructor(id?: string, username?: string, isAdmin?: boolean) {
    this.id = id || '';
    this.username = username || '';
    this.isAdmin = isAdmin || false;
  }

}
