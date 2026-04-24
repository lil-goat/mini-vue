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

const targetMaps = new WeakMap()

export function reactive(raw) {
  return new Proxy(raw , {
    get(target , key) {
      console.log(target , key)
      let dep = getDep(target , key)
      dep.depend()
      return Reflect.get(target , key)
    },

    set(target , key , newValue) {
      let dep = getDep(target , key)
      let result = Reflect.set(target , key , newValue)
      dep.notify()
      return result
    }    
  }) 
}

function getDep(target , key) {
  let targetMap = targetMaps.get(target)
  if(!targetMap) {
    targetMap = new Map()
    targetMaps.set(target , targetMap)
  }

  let dep = targetMap.get(key)
  if(!dep) {
    dep = new Dep()
    targetMap.set(key , dep)
  }
  return dep
}