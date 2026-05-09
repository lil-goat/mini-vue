import { effect } from "../reactivity/effec"
import { isObject } from "../shared/inedx"
import { createComponentInstance } from "./component"
import { setupComponent } from "./component"
import { createAppAPI } from "./createApp"
import { ShapeFlags } from "./ShapeFlags"
import { Fragment, Text } from "./vnode"

export function createRenderer(options) {
  const {
    createElement: hostCreateElement, 
    patchProps: hostPatchProps,
    insert: hostInsert
  } = options

  function render(vnode , container , parentComponent) {
    // patch 
    // 
    patch(null , vnode , container , parentComponent)
  }

  // n1 -> old vnode
  // n2 -> new vnode
  function patch(n1 , n2 , container , parentComponent) {
    const {type , shapeFlag} = n2

    // Fragment -> 只渲染children
    switch (type) {
      case Fragment:
        processFragment(n1 , n2 , container , parentComponent)
        break;
    
      case Text:
        processText(n1 , n2 , container)
        break
      
      default:
        if(shapeFlag & ShapeFlags.ELEMENT) {
          // 处理组件
          processElement(n1 , n2 , container , parentComponent)
        } else if(shapeFlag & ShapeFlags.STATE_COMPONENT) {
          processComponent(n1 , n2 , container , parentComponent)
        }
        break;
    }

  }

  function processFragment(n1 , n2 , container , parentComponent) {
    mountChildren(n2 , container , parentComponent)
  }

  function processText(n1 , n2 , container) {
    const {children} = n2
    const textNode = (n2.el = document.createTextNode(children))
    container.append(textNode)
  }

  function processElement(n1 , n2 , container , parentComponent) {
    if(!n1) {
    mountElement(n2 , container , parentComponent)
    } else {
      patchElement(n1 , n2 , container)
    }
  } 

  function patchElement(n1 , n2 , container) {
    console.log('patch element')
    console.log('n1' , n1)
    console.log('n2' , n2)

    // props
    // children
  }

  function mountElement(vnode , container , parentComponent) {
    const el = (vnode.el = hostCreateElement(vnode.type))

    // string array
    const {children , props , shapeFlag} = vnode
    
    if(shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      // string
      el.textContent = children
    } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      // vnode
      mountChildren(vnode , el , parentComponent)
    }

    // props
    for(const key in props) {
      const val = props[key]
      hostPatchProps(el , key , val)
    }

    hostInsert(el , container)
  }

  function mountChildren(vnode , container , parentComponent) {
    vnode.children.forEach(v => patch(null , v , container , parentComponent));
  }

  function processComponent(n1 , n2 , container , parentComponent) {
    mountComponent(n2 , container , parentComponent)
  }

  function mountComponent(vnode , container , parentComponent) {
    const instance = createComponentInstance(vnode , parentComponent)

    setupComponent(instance)
    setupRenderEffect(instance , vnode , container)
  }

  function setupRenderEffect(instance , vnode , container) {
    effect(() => {
      if(!instance.isMounted) {
        const {proxy} = instance
        const subTree = (instance.subTree = instance.render.call(proxy))

        // vnode -> patch
        // vnode -> element -> mountElement

        patch(null , subTree , container , instance)

        // element -> mount
        vnode.el = subTree.el 
        instance.isMounted = true      
      } else {
        const {proxy} = instance
        const subTree = instance.render.call(proxy)
        const prevSubTree = instance.subTree
        instance.subTree = subTree

        patch(prevSubTree , subTree , container , instance)
      }
    })
  }

  return{
    createApp: createAppAPI(render)
  }
}
