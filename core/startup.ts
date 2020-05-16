import {loadConfig} from './common.ts'
import Router from './engine/router.ts'
import {initPlugins} from './helper/plugin.ts'


export const start = async (cfg: any) => {
  loadConfig(cfg)
  await initPlugins()
  const router = new Router()
  router.start()
}
