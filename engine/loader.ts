import capitalize from "https://deno.land/x/lodash/capitalize.js";
import Template from "../library/template.ts";
import Action from "./action.ts";
import Registry from "./registry.ts";
import { triggerEvent } from "../helper/event.ts";
import { pathToUri } from "../pathToUri.ts";

export default class Loader {
  public registry: Registry;

  constructor(registry: Registry) {
    this.registry = registry;
  }

  public async controller(route: string, data: object) {
    await triggerEvent("controller/" + route, "before", { data, route });
    const action = new Action(route);
    const output = await action.execute(this.registry, data);

    await triggerEvent("controller/" + route, "after", { data, route, output });

    return output;
  }

  public async model(route: string) {
    route = route.replace(/[^a-zA-Z0-9_\/]/, "");

    if (!this.registry.has("model_" + route.replace("/", "_"))) {
      let model = await import(
        pathToUri(Deno.cwd() + "/catalog/model/" + route + ".ts")
      );

      const modelName = "Model" +
        route.split("/").map((value) => (capitalize(value))).join("");

      model = model[modelName];

      this.registry.set(
        "model_" + route.replace("/", "_"),
        new model(this.registry),
      );
    }
  }

  public async view(route: string, data: any) {
    route = route.replace(/[^a-zA-Z0-9_\/]/, "");

    const template = new Template();

    for (const key in data) {
      template.set(key, data[key]);
    }

    await triggerEvent("view/" + route, "before", { route, data });

    const output = await template.render(route);
    await triggerEvent("view/" + route, "after", { route, data, output });
    return output;
  }

  public config(route: string) {
    this.registry.get("config").load(route);
  }

  public language(route: string) {
    return this.registry.get("language").load(route);
  }
}
