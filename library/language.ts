import * as fs from "https://deno.land/std/fs/mod.ts";
import isUndefined from "https://deno.land/x/lodash/isUndefined.js";
import toString from "https://deno.land/x/lodash/toString.js";
import { DIR_APPLICATION, DIR_STORAGE } from "../common.ts";

export default class Language {
  public directory: string;
  public data: any;
  constructor(directory = "en-gb") {
    this.directory = directory;
    this.data = {};
  }

  public get(key: string) {
    return !isUndefined(this.data[key]) ? this.data[key] : key;
  }

  public set(key: string, value: any) {
    this.data[key] = value;
  }

  public all() {
    return this.data;
  }

  public async load(filename: string) {
    const filepath = DIR_APPLICATION + "catalog/language/" + this.directory + "/" + filename +
      ".json";

    let data = {};

    if (fs.existsSync(filepath) && Deno.lstatSync(filepath).isFile) {
      const content = fs.readFileStrSync(filepath);

      data = JSON.parse(toString(content));
    }

    this.data = { ...this.data, ...data };

    return this.data;
  }
}
