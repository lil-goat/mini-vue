import { h } from "../../lib/guide-mini-vue.esm.js"

export const App = {
  // 必须写render
  // vue
  // <template> </template>
  // render
  render() {
    // ui
    return h(
      'div' ,
      {
        id: "root",
        class: ['red' , 'hard']
      },
      [h('p' , {class: 'red'} , 'hi') , h('p' , {class: 'blue'} , 'mini-vue')]
    )
  },

  setup() {
    // composition api
    
    return {
      msg: 'mini-vue'
    }
  }
}