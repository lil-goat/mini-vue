import { effect , mountElement } from "./index.js"

export function createApp(rootComponent) {
  return{
    mount(rootContainer) {
      const setupResult = rootComponent.setup()
      
      effect(() => {
        rootContainer.textContent = ``
        const subTree = rootComponent.render(setupResult)
        console.log(subTree)
        mountElement(subTree , rootContainer)
        // rootContainer.append(element)
      })
    }
  }
}