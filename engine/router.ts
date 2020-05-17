import {
  Application,
  Router as OakRouter,
  Context,
  RouterContext,
  send,
} from "https://deno.land/x/oak/mod.ts";

import { initHelpers } from "../helper/common.ts";
import { routes } from "../helper/request.ts";
import {
  DIR_STATIC,
  HOST,
  PORT,
  BASE_URL,
  STATIC_BASE_URL,
  DIR_STYLESHEET,
  config as rapinConfig,
} from "../common.ts";
import Cache from "../library/cache.ts";
import Config from '../library/config.ts'
// import Crypto from '../library/crypto.ts'
import Error from "../library/error.ts";
// import Image from '../library/image.ts'
import Language from '../library/language.ts'
import Log from "../library/log.ts";
import Request from "../library/request.ts";
import Response from "../library/response.ts";
// import Pagination from '../library/pagination.ts'
// import Mail from '../library/mail.ts'
// import Style from '../library/style.ts'
import Action from "./action.ts";
import Loader from "./loader.ts";
import Registry from "./registry.ts";
import { triggerEvent } from "../helper/event.ts";
// import File from '../library/file.ts'
// import * as session from 'koa-session'
// import axios from 'axios'
import { pluginEvent } from "../helper/plugin.ts";
import { Logger } from "../logger.ts";
import { mount } from "../oak-mount.ts";

export default class Router {
  private app: Application;
  private registry: Registry;

  constructor() {
    this.app = new Application();
    this.registry = new Registry();
    // this.app.proxy = true
    // this.app.keys = [process.env.SECRET_KEY]

    // this.app.use(session(this.app))
    this.app.use(
      mount(STATIC_BASE_URL + "/static", async (context: Context) => {
        await send(context, context.request.url.pathname, {
          root: DIR_STATIC,
        });
      }),
    );

    this.app.use(
      mount(STATIC_BASE_URL + "/stylesheet", async (context: Context) => {
        await send(context, context.request.url.pathname, {
          root: DIR_STYLESHEET,
        });
      }),
    );
  }

  public async start() {
    await pluginEvent("beforeInitRegistry", {
      app: this.app,
      config: rapinConfig,
    });
    let logger = new Logger("Initial registry");
    await this.initRegistry();
    logger.end();
    await pluginEvent("afterInitRegistry", {
      app: this.app,
      registry: this.registry,
      config: rapinConfig,
    });
    const router: OakRouter = new OakRouter({
      prefix: BASE_URL,
    });
    await pluginEvent("onBeforeInitRouter", {
      app: this.app,
      registry: this.registry,
      router,
      config: rapinConfig,
    });
    this.app.use((ctx, next) => this.preRequest(ctx, next));
    logger = new Logger("Load routes");
    const restRoutes = await routes(this.registry);
    logger.end();

    for (const route of restRoutes) {
      logger = new Logger(`Mapped {${route.path} ${route.type}} route`);
      if (route.type === "GET") {
        router.get(
          route.path,
          (ctx, next) => this.postRequest(ctx, next, route),
        );
      }
      if (route.type === "POST") {
        router.post(
          route.path,
          (ctx, next) => this.postRequest(ctx, next, route),
        );
      }
      if (route.type === "PUT") {
        router.put(
          route.path,
          (ctx, next) => this.postRequest(ctx, next, route),
        );
      }
      if (route.type === "DELETE") {
        router.delete(
          route.path,
          (ctx, next) => this.postRequest(ctx, next, route),
        );
      }
      logger.end();
    }

    logger = new Logger("Rapid TS application successfully started ");
    await pluginEvent("onAfterInitRouter", {
      app: this.app,
      registry: this.registry,
      router,
      config: rapinConfig,
    });
    this.app.use(router.routes());
    this.app.use(router.allowedMethods());

    logger.end();
    await this.app.listen(`${HOST}:${PORT}`);
  }

  private async initRegistry() {
    initHelpers(this.registry);
    this.registry.set('language', new Language())
    // this.registry.set('file', new File())
    // this.registry.set('crypto', new Crypto())
    this.registry.set('config', new Config())
    // this.registry.set('image', new Image())
    // this.registry.set('pagination', new Pagination())
    // this.registry.set('axios', axios)
    // this.registry.set('mail', new Mail())
    // this.registry.set('style', new Style())

    this.registry.set("log", new Log());
    this.registry.set("load", new Loader(this.registry));
  }

  private parseQuery(str: string) {
    if (typeof str != "string" || str.length == 0) return {};
    var s = str.replace("?", "").split("&");
    var s_length = s.length;
    var bit, query: { [x: string]: any } = {}, first, second;
    for (var i = 0; i < s_length; i++) {
      bit = s[i].split("=");
      first = decodeURIComponent(bit[0]);
      if (first.length == 0) continue;
      second = decodeURIComponent(bit[1]);
      if (typeof query[first] == "undefined") query[first] = second;
      else if (query[first] instanceof Array) query[first].push(second);
      else query[first] = [query[first], second];
    }
    return query;
  }

  private async preRequest(ctx: Context, next: () => Promise<void>) {
    try {
      this.registry.set("error", new Error());

      const result = await ctx.request.body();
      this.registry.set(
        "request",
        new Request({
          ...ctx.request,
          postData: result.value,
          query: this.parseQuery(ctx.request.url.search),
          cookie: ctx.cookies,
          //     session: ctx.session
        }),
      );
      const cache = new Cache();
      await cache.init();
      this.registry.set("cache", cache);

      this.registry.set(
        "request",
        new Request({
          ...ctx.request,
          postData: result.value,
          query: this.parseQuery(ctx.request.url.search),
          cookie: ctx.cookies,
          //     session: ctx.session
        }),
      );

      this.registry.set("response", new Response(ctx));

      await pluginEvent("onBeforeRequest", {
        app: this.app,
        registry: this.registry,
        ctx,
        config: rapinConfig,
      });
    } catch (e) {
      this.handleError(e);
    }
    await next();
  }

  private async postRequest(
    ctx: RouterContext,
    next: () => Promise<void>,
    route: any,
  ) {
    this.registry.set("response", new Response(ctx));
    const result = await ctx.request.body();
    this.registry.set(
      "request",
      new Request({
        ...ctx.request,
        postData: result.value,
        query: this.parseQuery(ctx.request.url.search),
        cookie: ctx.cookies,
        params: ctx.params,
        //     session: ctx.session
      }),
    );

    await pluginEvent("onRequest", {
      app: this.app,
      registry: this.registry,
      ctx,
      route,
      config: rapinConfig,
    });

    try {
      triggerEvent("controller/" + route.action, "before", { data: {} });
      const action = new Action(route.action);

      const output = await action.execute(this.registry);

      triggerEvent("controller/" + route.action, "after", {
        data: {},
        output,
      });
    } catch (e) {
      await this.handleError(e);
    }
    const error = this.registry.get("error").get();

    if (error) {
      ctx.response.status = 400;
      ctx.response.body = error;
    } else if (ctx.response.status !== 302) {
      ctx.response.status = this.registry.get("response").getStatus();
      ctx.response.body = this.registry.get("response").getOutput();
    }
  }

  private async handleError(err: any) {
    await pluginEvent("onError", {
      app: this.app,
      err,
      registry: this.registry,
      config: rapinConfig,
    });

    this.registry.get("log").write(err.stack);
    if (typeof this.registry.get("response") !== "undefined") {
      this.registry.get("response").setStatus(500);
      this.registry
        .get("response")
        .setOutput({ status: 500, message: err.message, stack: err.stack });
    } else {
      // tslint:disable-next-line:no-console
      console.log(err.message);
    }
  }
}
