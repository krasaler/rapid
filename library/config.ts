import * as fs from "https://deno.land/std/fs/mod.ts";
import isUndefined from "https://deno.land/x/lodash/isUndefined.js";
import toString from "https://deno.land/x/lodash/toString.js";
import { DIR_APPLICATION } from "../common.ts";
import { pathToUri } from "../pathToUri.ts";

export default class Config {
  public data: any;
  constructor() {
    this.data = {};
  }

  public get(key: string) {
    return !isUndefined(this.data[key]) ? this.data[key] : key;
  }

  public set(key: string, value: any) {
    this.data[key] = value;
  }


  public has(name: string) {
    return !isUndefined(this.data[name]);
  }

  public async load(filename: string) {
    const filepath = DIR_APPLICATION + "config/" + filename + ".ts";

    let data = {};

    if (fs.existsSync(filepath) && Deno.lstatSync(filepath).isFile) {
      data = (await import(pathToUri(filepath))).default
    }

    this.data = { ...this.data, ...data };

    return this.data;
  }
}
