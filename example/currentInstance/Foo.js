import { h , getCurrentInstance } from "../../lib/guide-mini-vue.esm.js"

export const Foo = {
  name: 'foo',
  setup() {
    const instance = getCurrentInstance()
    console.log('app: ', instance)
  },
  render() {
    return h('div' , {} , 'foo')
  }
}