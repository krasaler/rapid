import * as fs from "https://deno.land/std/fs/mod.ts";
import * as path from "https://deno.land/std/path/mod.ts";
import { config } from "../common.ts";
import { pathToUri } from "../pathToUri.ts";

export default class Cache {
  public cache: any;

  public async init() {
    const { engine, expire } = config.cache;
    const __dirname = path.dirname(import.meta.url.replace("file:///", ""));
    let filePath = __dirname + "/cache/" + engine + ".ts";
    console.log(filePath)
    console.log(pathToUri(filePath))
    try {
      if(filePath.indexOf('http')===-1) {
        filePath = pathToUri(filePath)
      }
      const driverClass = await import(filePath);
      this.cache = new driverClass.default(expire);
    } catch(e) {
      console.log(e)
    }
  }

  public get(key: string) {
    return this.cache.get(key);
  }
  public set(key: string, value: object | string | object[]) {
    this.cache.set(key, value);
  }
  public delete(key: string) {
    this.cache.delete(key);
  }
}
