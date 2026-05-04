import { h } from "../../lib/guide-mini-vue.esm.js"

export const App = {
  // 必须写render
  // vue
  // <template> </template>
  // render
  render() {
    // ui
    return h('div' , 'hi, ' + this.msg)
  },

  setup() {
    // composition api
    
    return {
      msg: 'mini-vue'
    }
  }
}