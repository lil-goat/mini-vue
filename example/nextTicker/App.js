import { h, ref, reactive, getCurrentInstance, nextTick } from "../../lib/guide-mini-vue.esm.js"

export default {
  name: "App",
  setup() {
    const count = ref(0)
    const instance = getCurrentInstance()
    const onClick = () => {
      for(let i = 1 ; i <= 100 ; i ++){
        console.log('update')
        count.value ++
      }

      debugger
      console.log(instance)
      nextTick(() => {
        console.log(instance)
      })
    }

    return {
      count,
      onClick
    }
  },

  render() {
    return h("div", { tId: 1 }, [
      h("p", {}, "主页"), 
      h('button' , {
        onClick:this.onClick
      },
      'count:' + this.count)]
    );
  },
};
