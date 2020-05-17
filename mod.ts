import Router from "./engine/router.ts";
import { initPlugins } from "./helper/plugin.ts";
export * from "./common.ts";
export * from "./helper/request.ts";
export * from "./helper/plugin.ts";
export * from "./helper/event.ts";
export const start = async () => {
  await initPlugins();
  const router = new Router();
  router.start();
};
