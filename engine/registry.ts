export default class Registry {
  private data: { [x: string]: any };
  constructor() {
    this.data = {};
  }

  public get(name: string) {
    return this.data[name];
  }

  public getAll(): any {
    return this.data;
  }

  public set(name: string, value: any) {
    this.data[name] = value;
  }

  public has(name: string) {
    return typeof this.data[name] !== "undefined";
  }
}
