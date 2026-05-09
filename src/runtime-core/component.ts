import {PublicInstanceproxyHandlers} from './componentPublicInstance.ts'
import { initProps } from "./componentProps.ts";
import { shallowReadonly } from '../reactivity/reactive.ts';
import { emit  } from './conponentEmit.ts';
import { initSlots } from './componentSlots.ts';
import { provide } from './apiInject.ts';
import { proxyRef } from '../reactivity/ref.ts';

export function createComponentInstance (vnode , parent) {
  const component = {
    vnode,
    type: vnode.type,
    setupState: {},
    props: {},
    slots: {},
    provides: parent ? parent.provides : {},
    parent,
    isMounted: false,
    emit: () => {},
  }

  component.emit = emit.bind(null , component) as any

  return component
}

export function setupComponent(instance) {
  initSlots(instance , instance.vnode.children)
  initProps(instance , instance.vnode.props)
  
  setupStatefulComponent(instance)
}

function setupStatefulComponent(instance) {
  const component = instance.type

  instance.proxy = new Proxy(
    {_: instance} , PublicInstanceproxyHandlers
  )

  const {setup} = component

  if(setup) {
    setCurrentInstance(instance)
    
    // function or object
    const setupResult = setup(shallowReadonly(instance.props) , {
      emit: instance.emit
    })

    setCurrentInstance(null)

    handleSetupResult(instance , setupResult)
  }
}

function handleSetupResult(instance , setupResult) {
  // function or object
  if(typeof setupResult === 'object') {
    instance.setupState = proxyRef(setupResult)
  }

  finishComponentSetup(instance)
}

function finishComponentSetup(instance) {
  const component = instance.type

  instance.render = component.render
}

let currentInstance = null

export function getCurrentInstance() {
  return currentInstance
}

function setCurrentInstance(instance) {
  currentInstance = instance
}