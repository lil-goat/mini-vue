export function createComponentInstance (vnode) {
  const component = {
    vnode,
    type: vnode.type
  }
  return component
}

export function setupComponent(instance) {
  // TODO
  // initProps()
  // initSlots()
  
  setupStatefulComponent(instance)
}

function setupStatefulComponent(instance) {
  const component = instance.type

  const {setup} = component

  if(setup) {
    // function or object
    const setupResult = setup()

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