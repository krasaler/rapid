import {isDev} from './common.ts'
// import "https://deno.land/x/eaisercolors/mod.ts"
import {red, green, yellow} from 'https://deno.land/std/fmt/mod.ts'
export class Logger {
  private name: string
  private time: number
  constructor (name: string) {
    this.name = name
    this.time = this.getTime()
  }
  private getTime() {
    const d = new Date()
    return d.getTime()
  }

  public end(){
    if(isDev) {
      const diff = this.getTime() - this.time

      console.log(red("[Rapid TS]   ") + green(this.name) + yellow(` +${diff}ms`))
    }
  }
}