import { effect } from "./core/index.js"

export function createApp(rootComponent) {
  return{
    mount(rootContainer) {
      const setupResult = rootComponent.setup()
      
      effect(() => {
        rootContainer.textContent = ``
        const element = rootComponent.render(setupResult)
        rootContainer.append(element)
      })
    }
  }
}