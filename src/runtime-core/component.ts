import {PublicInstanceproxyHandlers} from './componentPublicInstance.ts'
import { initProps } from "./componentProps.ts";
import { shallowReadonly } from '../reactivity/reactive.ts';

export function createComponentInstance (vnode) {
  const component = {
    vnode,
    type: vnode.type,
    setupState: {}
  }
  return component
}

export function setupComponent(instance) {
  // TODO
  initProps(instance , instance.vnode.props)
  // initSlots()
  
  setupStatefulComponent(instance)
}

function setupStatefulComponent(instance) {
  const component = instance.type

  instance.proxy = new Proxy(
    {_: instance} , PublicInstanceproxyHandlers
  )

  const {setup} = component

  if(setup) {
    // function or object
    const setupResult = setup(shallowReadonly(instance.props))

    handleSetupResult(instance , setupResult)
  }
}

function handleSetupResult(instance , setupResult) {
  // function or object
  // TODO function

  if(typeof setupResult === 'object') {
    instance.setupState = setupResult
  }

  finishComponentSetup(instance)
}

function finishComponentSetup(instance) {
  const component = instance.type

  instance.render = component.render
}