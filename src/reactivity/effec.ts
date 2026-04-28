class ReactiveEffect {
  private _fn
  constructor (fn) {
    this._fn = fn
  }

  run() {
    activeEffect = this
    const result = this._fn()
    activeEffect = null
    return result
  }
}

const targetMap = new WeakMap()

function findDep(target , key) {
  let depMap = targetMap.get(target) 
  if(!depMap) {
    depMap = new Map()
    targetMap.set(target , depMap)
  }

  let Dep = depMap.get(key)
  if(!Dep) {
    Dep = new Set()
    depMap.set(key , Dep)
  }

  return Dep
}

export function track(target , key) {
  const Dep = findDep(target , key)
  Dep.add(activeEffect)
  return Dep
}

let activeEffect

export function effect(fn) {
  // fn
  const _effect = new ReactiveEffect(fn)
  _effect.run()
  return _effect.run.bind(_effect)
}

export function trigger(target , key) {
  const Dep = findDep(target , key)
  Dep.forEach(effect => {
    effect.run()
  });
}