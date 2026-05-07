import { hasOwn } from "../shared/inedx"

const PublicPropertiesMap = {
  $el: (i) => i.vnode.el
}

export const PublicInstanceproxyHandlers = {
  get({_: instance} , key) {
    // setupState
    const {setupState , props} = instance
    if(hasOwn(setupState , key)) {
      return setupState[key]
    } else if(hasOwn(props , key)) {
      return props[key]
    }

    const publicGetter = PublicPropertiesMap[key]
    if(publicGetter) {
      return publicGetter(instance)
    }
  },
}