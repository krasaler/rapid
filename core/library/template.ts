import * as fs from "https://deno.land/std/fs/mod.ts";
import * as path from "https://deno.land/std/path/mod.ts";
import { config } from "../common.ts"
export default class Template {
  public adaptor: any
  constructor() {
    const { engine } = config.template
    const filepath = path.resolve("./template/" + engine + ".js")
    // if (fs.existsSync(filepath) && fs.lstatSync(filepath).isFile()) {
    //   const adaptorClass = require("./template/" + engine).default
    //   this.adaptor = new adaptorClass()
    // }
  }

  public set(key: String, value: Object | String | Object[] | any) {
    this.adaptor.set(key, value)
  }

  public async render(template: string) {
    return await this.adaptor.render(template)
  }
}
