import { reactive , effect , h} from "./core/index.js"

export default {
  render(context) {
    // const element = document.createElement('div')
    // const text = document.createTextNode('nihao')
    // const text1 = document.createTextNode(context.obj.count)
    // element.append(text)
    // element.append(text1)
    return h(context.obj.tag , context.obj.props , context.obj.Children)
  },

  setup() {
    const obj = reactive({
      count: 1,
      tag: "div",
      props: {
        a:10,
        b:20
      },
      Children: [{
        tag:"div",
        props: {},
        children: '333'
      },
      {
        tag:"div",
        props: {},
        children: '444'
      }]
    })

    window.obj = obj
    return {
      obj
    }
  }
}