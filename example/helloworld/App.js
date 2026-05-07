import { h } from "../../lib/guide-mini-vue.esm.js"

window.self = null
export const App = {
  // 必须写render
  // vue
  // <template> </template>
  // render
  render() {
    window.self = this
    // ui
    return h(
      'div' ,
      {
        id: "root",
        class: ['red' , 'hard']
      },
      // setupState
      // this.$el -> get root element
      // array
      // [h('p' , {class: 'red'} , 'hi') , h('p' , {class: 'blue'} , 'mini-vue')]
      // string
      // 'hi , mini-vue'
      'hi , ' + this.msg
    )
  },

  setup() {
    // composition api
    
    return {
      msg: 'mini-vuehhh'
    }
  }
}