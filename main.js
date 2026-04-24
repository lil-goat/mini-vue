import { effect , reactive } from './core/index.js'

const App = {
  render(context) {
    effect(() => {
      document.querySelector('#App').textContent = ''
      const element = document.createElement('div')
      const text = document.createTextNode('nihao')
      const text1 = document.createTextNode(context.obj.count)
      element.append(text)
      element.append(text1)
      document.querySelector('#App').append(element)
    })
  },

  setup() {
    const obj = reactive({
      count: 1
    })

    window.obj = obj
    return {
      obj
    }
  }
}

App.render(App.setup())