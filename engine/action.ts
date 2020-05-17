import * as fs from "https://deno.land/std/fs/mod.ts";
import capitalize from "https://deno.land/x/lodash/capitalize.js";
import isEmpty from "https://deno.land/x/lodash/isEmpty.js";
import Registry from "./registry.ts";

export default class Action {
  public route: string = "";
  public method: string = "index";

  constructor(route: string) {
    const parts = route.replace(/[^a-zA-Z0-9_\/]/, "").split("/");

    while (parts) {
      const filename = "controller/" + parts.join("/") + ".ts";
      if (isEmpty(parts)) {
        break;
      }
      if (fs.existsSync(filename) && Deno.lstatSync(filename).isFile) {
        this.route = parts.join("/");
        break;
      } else {
        this.method = parts.pop() || "index";
      }
    }
  }

  public async execute(registry: Registry, args: object = {}) {
    const controllerName = "Controller" +
      this.route.split("/").map((value: string) => (capitalize(value))).join(
        "",
      );

    let controller = registry.get(controllerName);

    if (!registry.has(controllerName)) {
      controller = await import(Deno.cwd() + "controller/" + this.route);

      controller = controller[controllerName];

      controller = new controller(registry);
    }

    return await controller[this.method](args);
  }
}
