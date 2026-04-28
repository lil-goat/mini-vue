import { track , trigger } from "./effec"

const get = createGetter()
const set = createSetter()
const readonlyGet = createGetter(true)
const readonlySet = (target , key , ...rest) => console.warn(`key:${key}修改失败，因为target是readonly`,target)

function createGetter(isReadOnly = false) {
  return function (target , key) {
    const res = Reflect.get(target , key)

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