import * as path from "https://deno.land/std/path/mod.ts";

export const pathToUri = (filePath: string) => {
  var pathName = path.resolve(filePath).replace(/\\/g, "/");

  if (pathName[0] !== "/") {
    pathName = "/" + pathName;
  }

  return encodeURI("file://" + pathName);
};
