import { isObject } from "../shared"
import { mutableHandlers , readOnlyHandlers , shallowReadonlyHandlers} from "./baseHandlers"

export const enum ReactiveFlags {
  IS_REACTIVE = "__v_isReactive",
  IS_READONLY = "__v_isReadOnly"
}

export function reactive(raw) {
  return createActiveObject(raw , mutableHandlers)
}

export function readonly (raw) {
  return createActiveObject(raw ,  readOnlyHandlers)
}

export function shallowReactive(raw) {

}

export function shallowReadonly(raw) {
  return createActiveObject(raw ,  shallowReadonlyHandlers)
}

function createActiveObject(raw , baseHandlers) {
  if(!isObject(raw)) {
    console.warn(`target ${raw} 必须是一个对象`)
    return
  }
  return new Proxy(raw ,  baseHandlers)
}

export function isReactive(value) {
  return !!value[ReactiveFlags.IS_REACTIVE]
}

export function isReadOnly(value) {
  return !!value[ReactiveFlags.IS_READONLY]
}

export function isProxy(value) {
  return isReactive(value) || isReadOnly(value)
}