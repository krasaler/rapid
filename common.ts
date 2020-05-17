import * as path from "https://deno.land/std/path/mod.ts";
import { existsSync } from "https://deno.land/std/fs/mod.ts";
import { Controller as MainController } from "./engine/controller.ts";
import { Model as MainModel } from "./engine/model.ts";
import { load } from "https://deno.land/x/denv/mod.ts";

let rapinConfig: any = {};

const __dirname = path.dirname(
  new URL(
    import.meta.url,
  ).pathname,
);

export let NODE_ENV: string = Deno.args.includes("start")
  ? "production"
  : "development";
await load();

import rapinConfigDefault from "./rapin.config.ts";

export const loadConfig = (cfg: any) => {
  rapinConfig = cfg;
};

const { storage } = rapinConfig;
export let isDev = NODE_ENV === "development";
export let config: any = { ...rapinConfigDefault, ...rapinConfig };

export let DIR_APPLICATION: string = path.resolve(__dirname, "");
export let DIR_IMAGE: string = path.resolve("", "./static/images/");
export let DIR_STORAGE: string = storage || Deno.cwd() + "/storage/";
export let DIR_STATIC: string = path.resolve("", "./static/");
export let DIR_STYLESHEET: string = path.resolve("", "./src/view/stylesheet/");

if (!existsSync(DIR_STORAGE)) {
  Deno.mkdirSync(DIR_STORAGE);
}

if (!existsSync(DIR_STATIC)) {
  Deno.mkdirSync(DIR_STATIC);
}

if (!existsSync(DIR_IMAGE)) {
  Deno.mkdirSync(DIR_IMAGE);
}

export let HTTP_SERVER: string = Deno.env.get("HTTP_SERVER") ||
  "http://localhost/";
export let PORT: string = Deno.env.get("PORT") || "3000";
export let HOST: string = Deno.env.get("HOST") || "localhost";
export let Controller = MainController;
export let Model = MainModel;
export let BASE_URL: string = Deno.env.get("BASE_URL") || "";
export let STATIC_BASE_URL: string = Deno.env.get("BASE_URL") || "";
