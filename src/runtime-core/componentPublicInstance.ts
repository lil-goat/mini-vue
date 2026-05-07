const PublicPropertiesMap = {
  $el: (i) => i.vnode.el
}

export const PublicInstanceproxyHandlers = {
  get({_: instance} , key) {
    // setupState
    const {setupState} = instance
    if(key in setupState) {
      return setupState[key]
    }

    const publicGetter = PublicPropertiesMap[key]
    if(publicGetter) {
      return publicGetter(instance)
    }
  },
}