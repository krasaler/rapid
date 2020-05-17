import Registry from "./registry.ts";

export class Controller {
  protected registry: Registry;

  constructor(registry: Registry) {
    this.registry = registry;
  }

  protected get $context() {
    return this.registry.getAll();
  }
}
