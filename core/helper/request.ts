import { initRegistry, } from "./common.ts";
import Registry from "../engine/registry.ts";
import isUndefined from "https://deno.land/x/lodash/isUndefined.js";
import replace from "https://deno.land/x/lodash/replace.js";
import map from "https://deno.land/x/lodash/map.js";
import capitalize from "https://deno.land/x/lodash/capitalize.js";
import {walkSync} from "https://deno.land/std/fs/mod.ts";
import * as path from "https://deno.land/std/path/mod.ts";


let registry: Registry = initRegistry()
const results: any[] = []
let controllerPath: string = ''

 
  export const GET = (path: string, type = 'json') => {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
      results.push({
        path,
        type: 'GET',
        contentType: type,
        auth: false,
        action: controllerPath + '/' + propertyKey,
      })
    }
  }
  
  export const POST = (path: string, type = 'json') => {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
      results.push({
        path,
        type: 'POST',
        contentType: type,
        auth: false,
        action: controllerPath + '/' + propertyKey,
      })
    }
  }
  export const DELETE = (path: string, type = 'json') => {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
      results.push({
        path,
        type: 'DELETE',
        contentType: type,
        auth: false,
        action: controllerPath + '/' + propertyKey,
      })
    }
  }
  
  export const PUT = (path: string, type = 'json') => {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
      results.push({
        path,
        type: 'PUT',
        contentType: type,
        auth: false,
        action: controllerPath + '/' + propertyKey,
      })
    }
  }
  
  export const required = (list: string[]) => {
    return (target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => {
      const originalMethod = descriptor.value
      descriptor.value = function(...args: any[]) {
        for (const key in list) {
          if (isUndefined(registry.get('request').post[list[key]])) {
            registry.get('error').set('missing_' + list[key])
          }
        }
        if (!registry.get('error').get()) {
          return originalMethod.apply(this, args)
        }
      }
    }
  }

  export const validate = (action: string) => {
    return (target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => {
      const originalMethod = descriptor.value
      descriptor.value = async function(...args: any[]) {
        const error = await registry.get('load').controller(action)
        if (!error) {
          return originalMethod.apply(this, args)
        } else {
          registry.get('error').set(error)
        }
      }
    }
  }

  
  export const routes = async (registryOption: Registry) => {
    registry = registryOption
    const controllers = walkSync(Deno.cwd()+'/controller', {
      match: [path.globToRegExp(path.join(Deno.cwd(), "**", "*.ts"),{
        flags: "g",
        extended: true,
        globstar: true
      })]
    })

    for (const value of controllers) {
      controllerPath = replace(value.path, path.join(Deno.cwd(), './controller/'), '')
      controllerPath = replace(controllerPath, '.ts', '')
      controllerPath = controllerPath.replace(/\\/g, '/')
      let filePath = Deno.cwd() + '/controller/'+controllerPath+'.ts'

      var pathName = path.resolve(filePath).replace(/\\/g, '/');
    
      if (pathName[0] !== '/') {
          pathName = '/' + pathName;
      }
    
      filePath = encodeURI('file://' + pathName);

      let controller: any = await import(filePath)

      const controllerName = 'Controller' + map(controllerPath.split(/\//g), (value: string) => (capitalize(value))).join('')

      controller = controller[controllerName]

      registry.set(controllerName, new controller(registry))
    }

    return results
  }
  