import Registry from "../engine/registry.ts";

let registry: Registry;

export const initHelpers = (registryOption: Registry) => {
    registry = registryOption
}

export const initRegistry = (): Registry => {
   return registry
}
 