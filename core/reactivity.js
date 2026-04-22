export class Dep {
  constructor(value) {
    this._val = value;
    this.effects = new Set()
  }  

  get value() {
    this.depend()
    return this._val
  }

  set value(newValue) {
    this._val = newValue
    this.notify()
  }

  // 收集依赖
  depend() {
    if(activeEffect) {
      this.effects.add(activeEffect)
    }
  }

  // 触发依赖
  notify() {
    this.effects.forEach(fn => fn())
  }
}

let activeEffect = null;

export function effect(fn) {
  activeEffect = fn;
  fn();
  activeEffect = null;
}