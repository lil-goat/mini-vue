import { hasChanged, isObject } from "../shared/inedx"
import { trackEffects, triggerEffects } from "./effec"
import { reactive } from "./reactive"

export const enum RefFlags {
  IS_REF = "__v_isRef",
}

class refImpl {
  private _value
  public Dep
  private _rawValue
  public __v_isRef = true
  constructor(value) {
    this._rawValue = value
    this._value = isObject(value) ? reactive(value) : value
    this.Dep = new Set()
  }

  get value() {
    trackEffects(this.Dep)
    return this._value
  }

  set value(newValue) {
    if(!hasChanged(this._rawValue , newValue)) return 
    this._rawValue = newValue
    this._value = isObject(newValue) ? reactive(newValue) : newValue
    triggerEffects(this.Dep)
  }
}

export function ref(value) {
  return new refImpl(value)
}

export function isRef(ref) {
  return !!ref[RefFlags.IS_REF]
}

export function unRef(ref) {
  return isRef(ref) ? ref.value : ref
}