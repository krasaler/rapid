import { Context } from "https://deno.land/x/oak/context.ts"
export default class Response {
  public output: string|object
  public status: number
  private ctx: Context
  constructor(ctx: Context) {
    this.output = ''
    this.status = 200
    this.ctx = ctx
  }

  public getOutput() {
    return this.output
  }

  public setOutput(output: any) {
    this.output = output
  }

  public getStatus() {
    return this.status
  }

  public setStatus(status: number) {
    this.status = status
  }

  public redirect(url: string) {
    // this.ctx.redirect(url)
  }
}
