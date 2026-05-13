import { hasOwn } from "../shared"

const PublicPropertiesMap = {
  $el: (i) => i.vnode.el,
  $slots: (i) => i.slots,
  $props: (i) => i.props
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