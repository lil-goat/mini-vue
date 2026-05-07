import { h } from "../../lib/guide-mini-vue.esm.js"

export const Foo = {
  name: 'foo',
  setup(props , {emit}) {
    const emitAdd = () => {
      console.log('emit add')
      emit('add')   // -> event
      emit('add-foo')
    }

    return{
      emitAdd
    }
  },
  render() {
    const btn = h('button' , {
      onClick: this.emitAdd
    } , 'emitAdd')
    const foo = h('p' , {} , 'foo')
    return h('div' , {} , [foo , btn])
  }
}