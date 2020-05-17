import * as fs from "https://deno.land/std/fs/mod.ts";
import { moment } from "https://deno.land/x/moment/moment.ts";
import { DIR_STORAGE, config } from "../common.ts";

if (!fs.existsSync(DIR_STORAGE + "/logs")) {
  Deno.mkdirSync(DIR_STORAGE + "/logs");
}
export default class Log {
  public filename: string;
  constructor() {
    const { filename } = config.log;
    this.filename = DIR_STORAGE + "/logs/" + filename;
  }

  public write(message: string) {
    var enc = new TextEncoder();

    Deno.writeFileSync(
      this.filename,
      enc.encode(
        moment().format("Y-MM-DD HH:mm:ss") + " - " + message + "\r\n",
      ),
      { append: true },
    );
  }
}
