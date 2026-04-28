import { track , trigger } from "./effec"
import { reactive, ReactiveFlags, readonly } from "./reactive"
import { extned, isObject } from "../shared/inedx"

const get = createGetter()
const set = createSetter()
const readonlyGet = createGetter(true)
const readonlySet = (target , key , ...rest) => {
  console.warn(`key:${key}修改失败，因为target是readonly`,target)
  return true
}

const shallowReadonyGet = createGetter(true , true)

function createGetter(isReadOnly = false , shallow = false) {
  return function (target , key) {
    if(key === ReactiveFlags.IS_REACTIVE) return !isReadOnly
    else if(key === ReactiveFlags.IS_READONLY) return isReadOnly
    
    const res = Reflect.get(target , key)
    
    if(!shallow && isObject(res)) return isReadOnly ? readonly(res) : reactive(res)

    if(!isReadOnly) {   
      track(target , key)   
    }

    return res
  }
}

function createSetter() {
  return function (target , key , value) {
    const res = Reflect.set(target , key , value)

    trigger(target , key)
    return res
  }
}

export const mutableHandlers = {
  get,
  set
}

export const readOnlyHandlers = {
  get: readonlyGet,
  set: readonlySet
}

export const shallowReadonlyHandlers = extned({} , readOnlyHandlers , {
  get: shallowReadonyGet
})