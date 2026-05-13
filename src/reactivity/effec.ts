import { extned } from "../shared"

export class ReactiveEffect {
  private _fn
  deps = []
  active = true
  onStop?: () => void
  constructor (fn , public scheduler?) {
    this._fn = fn
  }

  run() {
    activeEffect = this
    const result = this._fn()
    activeEffect = null
    return result
  }

  stop() {
    if(this.active) {
      cleanUpEffect(this)
    }
    if(this.onStop) {
      this.onStop()
    }
    this.active = false
  }
}

function cleanUpEffect(effect) {
  effect.deps.forEach((dep: any) => {
    dep.delete(effect)
  });
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
  trackEffects(Dep)
  return Dep
}

export function trackEffects(Dep) {
  if(activeEffect && activeEffect.active) {
    Dep.add(activeEffect)
    activeEffect.deps.push(Dep)
  }
}

let activeEffect

export function effect(fn , options: any = {}) {
  // fn
  const _effect = new ReactiveEffect(fn , options.scheduler)
  _effect.run()
  // extned options
  extned(_effect , options)
  
  const runner: any = _effect.run.bind(_effect)
  runner.effect = _effect
  return runner
}

export function trigger(target , key) {
  const Dep = findDep(target , key)
  triggerEffects(Dep)
}

export function triggerEffects (Dep) {
  Dep.forEach(effect => {
    if(effect.scheduler) {
      effect.scheduler()
    } else effect.run()
  });  
}

export function stop(runner) {
  runner.effect.stop()
}