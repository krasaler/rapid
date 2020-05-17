import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts";

export default class Crypto {
  public data: object;
  constructor() {
    this.data = {};
  }

  public getHashPassword(password: string, salt = this.token(9)) {
    return this.sha512(password, salt);
  }

  public sha512(password:string, salt: string) {
    const hash = bcrypt.hashpw(password, salt);
    return {
      salt,
      hash
    };
  }

  public token(length: number) {
    return bcrypt.gensalt(length)
  }
}
