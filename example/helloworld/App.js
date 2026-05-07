import { h } from "../../lib/guide-mini-vue.esm.js"
import { Foo } from './Foo.js'

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
        class: ['red' , 'hard'],
        onClick() {
          console.log('click')
        },
        onMousedown() {
          console.log('onmousedown')
        }
      },
      // setupState
      // this.$el -> get root element
      // array
      [
        h('p' , {class: 'red'} , 'hi'),
        h(Foo , {
          count: 1
        })
      ]
      // string
      // 'press here'
      // 'hi , ' + this.msg
    )
  },

  setup() {
    // composition api
    
    return {
      msg: 'mini-vuehhh'
    }
  }
}