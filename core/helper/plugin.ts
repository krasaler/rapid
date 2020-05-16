import {config} from '../common.ts'
import { Logger } from '../logger.ts'

const listings:any[] = []

export const initPlugins = async () => {
  for (const value of config.plugins) {
    let logger = new Logger(`Init plugin - ${value}`)
    const plugin = await import(value)
    listings.push(new plugin.default())
    logger.end()
  }
}

export const pluginEvent = async (action: string, args: any): Promise<any> => {
  for (const value of listings) {
    let logger = new Logger(`Event plugin(${action}) - ${value.name}`)
    if (typeof value[action] !== 'undefined') {
      const output = await value[action](args)
      if (output && output !== '') {
        return output
      }
    }
    logger.end()
  }
  return false
}
