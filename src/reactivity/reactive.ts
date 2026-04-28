import { mutableHandlers , readOnlyHandlers } from "./baseHandlers"

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

function createActiveObject(raw , baseHandlers) {
  return new Proxy(raw ,  baseHandlers)
}

export function isReactive(value) {
  return !!value[ReactiveFlags.IS_REACTIVE]
}

export function isReadOnly(value) {
  return !!value[ReactiveFlags.IS_READONLY]
}