import { effect , mountElement , diff } from "./index.js"

export function createApp(rootComponent) {
  return{
    mount(rootContainer) {
      const setupResult = rootComponent.setup()
      let preSubTree
      let isMounted = false
      
      effect(() => {
        if(!isMounted) {
          isMounted = true
          const subTree = rootComponent.render(setupResult)
          preSubTree = subTree
          mountElement(subTree , rootContainer)
        } else {
          const subTree = rootComponent.render(setupResult)
          console.log('oldSubTree' , preSubTree)
          console.log("newSubTree" , subTree)
          diff(preSubTree , subTree)
          preSubTree = subTree
        }

        // rootContainer.append(element)
      })
    }
  }
}