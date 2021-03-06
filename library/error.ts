import isEmpty from "https://deno.land/x/lodash/isEmpty.js";

export default class Error {
  public error: object[];
  public description: { [x: string]: any };
  constructor() {
    this.error = [];
    this.description = {
      unauthorized: {
        code: 401,
        message: "Unauthorized",
      },
    };
  }

  public set(error: string, system_message = "") {
    this.error.push({
      error,
      code: !isEmpty(this.description[error])
        ? this.description[error].code
        : 404,
      message: !isEmpty(this.description[error])
        ? this.description[error].message
        : "",
      system_message,
    });
  }

  public get() {
    let result = {};
    if (!isEmpty(this.error)) {
      result = this.error[0];
    }
    return !isEmpty(result) ? result : false;
  }
}
