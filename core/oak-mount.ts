

import * as path from "https://deno.land/std/path/mod.ts";
import { Middleware } from "https://deno.land/x/oak/middleware.ts";
import { Context } from "https://deno.land/x/oak/context.ts";
export const mount = (prefix: string, app: Middleware) => {
  if (typeof prefix !== 'string') {
    app = prefix
    prefix = '/'
  }

  // assert.equal(prefix[0], '/', 'mount path must begin with "/"')

  if (prefix === '/') return app

  const trailingSlash = prefix.slice(-1) === '/'

  return async function (ctx: any, next: () => Promise<void>) {
    const prev = ctx.request.url.pathname

    const newPath = match(prev)

    if (!newPath) return await next()

    ctx.mountPath = prefix
    ctx.request.url.pathname  = newPath

    await app(ctx, async () => {
      ctx.request.url.pathname = prev
      await next()
      ctx.request.url.pathname = newPath
    })

    ctx.request.url.pathname = prev
  }

  function match (path: string) {
    if (path.indexOf(prefix) !== 0) return false

    const newPath = path.replace(prefix, '') || '/'
    if (trailingSlash) return newPath

    if (newPath[0] !== '/') return false
    return newPath
  }
}
