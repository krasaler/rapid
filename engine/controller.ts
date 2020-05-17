import Registry from "./registry.ts";
import {Context} from '../typing/index.ts'

export class Controller {
  protected registry: Registry;

  constructor(registry: Registry) {
    this.registry = registry;
  }

  protected get $context(): Context {
    return this.registry.getAll();
  }
}
