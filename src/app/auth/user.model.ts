export class User {
  constructor(
    public email: string,
    public id: string,
    private _token: string,
    private _tokenExpirationDate: Date
  ) {}

  get Token(): string {
    if (this._tokenExpirationDate < new Date() || this._tokenExpirationDate)
      return this._token;
    else return '';
  }
}
