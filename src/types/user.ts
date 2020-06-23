export class User {

  id: string;
  username: string;
  isAdmin: boolean;

  constructor() {
    this.id = '';
    this.username = '';
    this.isAdmin = false;
  }

  init(id?: string, username?: string, isAdmin?: boolean) {
    this.id = id || '';
    this.username = username || '';
    this.isAdmin = isAdmin || false;
  }

}
