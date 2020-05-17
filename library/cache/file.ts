import last from "https://deno.land/x/lodash/last.js";
import replace from "https://deno.land/x/lodash/replace.js";
import toNumber from "https://deno.land/x/lodash/toNumber.js";
import toString from "https://deno.land/x/lodash/toString.js";
import * as fs from "https://deno.land/std/fs/mod.ts";
import { moment } from "https://deno.land/x/moment/moment.ts";
import { DIR_STORAGE } from "../../common.ts";
import * as path from "https://deno.land/std/path/mod.ts";

export default class File {
  public expire: number;
  constructor(expire: number = 3600) {
    this.expire = expire;
    try {
      if (!fs.existsSync(DIR_STORAGE + "/cache")) {
        Deno.mkdirSync(DIR_STORAGE + "/cache");
      }

      const files = fs.walkSync(DIR_STORAGE + "cache/");

      for (const value of files) {
        if (value.isFile) {
          const time = last(value.name.split("."));
          if (toNumber(time) < moment().unix()) {
            Deno.removeSync(value.path);
          }
        }
      }
    } catch (e) {
      console.log(e);
    }
  }

  public get(key: string) {
    const files = fs.walkSync(DIR_STORAGE + "cache/", {
      match: [
        path.globToRegExp(
          DIR_STORAGE + "cache/cache." + replace(key, "/[^A-Z0-9\._-]/î", "") +
            ".*",
          {
            flags: "g",
            extended: true,
            globstar: true,
          },
        ),
      ],
    });

    for (const value of files) {
      if (value.isFile) {
        const content = fs.readFileStrSync(value.path);

        return JSON.parse(toString(content));
      }
    }
  }

  public set(key: string, value: any) {
    this.delete(key);

    const file = DIR_STORAGE + "/cache/cache." +
      replace(key, "/[^A-Z0-9\._-]/î", "") + "." +
      (moment().unix() + this.expire);

    var enc = new TextEncoder();
    Deno.writeFileSync(file, enc.encode(JSON.stringify(value)));
  }

  public delete(key: string) {
    const files = fs.walkSync(DIR_STORAGE + "cache/", {
      match: [
        path.globToRegExp(
          DIR_STORAGE + "cache/cache." + replace(key, "/[^A-Z0-9\._-]/î", "") +
            ".*",
          {
            flags: "g",
            extended: true,
            globstar: true,
          },
        ),
      ],
    });

    for (const value of files) {
      if (value.isFile) {
        Deno.removeSync(value.path);
      }
    }
  }
}
