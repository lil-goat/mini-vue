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
    patchProp: hostPatchProps,
    insert: hostInsert,
    remove: hostRemove,
    setElementText: hostSetElementText
  } = options

  function render(vnode , container , parentComponent) {
    // patch 
    // 
    patch(null , vnode , container , parentComponent , null)
  }

  // n1 -> old vnode
  // n2 -> new vnode
  function patch(n1 , n2 , container , parentComponent , anchor) {
    const {type , shapeFlag} = n2

    // Fragment -> 只渲染children
    switch (type) {
      case Fragment:
        processFragment(n2 , container , parentComponent , anchor)
        break;
    
      case Text:
        processText(n1 , n2 , container)
        break
      
      default:
        if(shapeFlag & ShapeFlags.ELEMENT) {
          // 处理组件
          processElement(n1 , n2 , container , parentComponent , anchor)
        } else if(shapeFlag & ShapeFlags.STATE_COMPONENT) {
          processComponent(n1 , n2 , container , parentComponent , anchor)
        }
        break;
    }

  }

  function processFragment(n2 , container , parentComponent , anchor) {
    mountChildren(n2.children , container , parentComponent , anchor)
  }

  function processText(n1 , n2 , container) {
    const {children} = n2
    const textNode = (n2.el = document.createTextNode(children))
    container.append(textNode)
  }

  function processElement(n1 , n2 , container , parentComponent , anchor) {
    if(!n1) {
    mountElement(n2 , container , parentComponent , anchor)
    } else {
      patchElement(n1 , n2 , parentComponent , anchor)
    }
  } 

  function patchElement(n1 , n2 , parentComponent , anchor) {
    const oldProps = n1.props || EMPTY_OBJECT
    const newProps = n2.props || EMPTY_OBJECT

    const el = (n2.el = n1.el)
    patchProps(el , oldProps , newProps)
    patchChildren(n1 , n2 , el , parentComponent , anchor)
  }

  function patchChildren(n1 , n2 , container , parentComponent , anchor) {
    const prevShapeFlag = n1.shapeFlag
    const shapeFlag = n2.shapeFlag
    const c1 = n1.children
    const c2 = n2.children

    if(shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      if(prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        // 把老的 children 清空
        unmountChildren(n1.children)
      }
      
      if(c1 !== c2){
        // 设置text
        hostSetElementText(container , c2)
      }
    }else{
      // new -> array
      if(prevShapeFlag & ShapeFlags.TEXT_CHILDREN){
        hostSetElementText(container , '')
        mountChildren(c2 , container , parentComponent , anchor)
      }else {
        // array diff array
        patchKeyedChildren(c1 , c2 , container , parentComponent , anchor)
      }
    }
  }

  function patchKeyedChildren(c1 , c2 , container , parentComponent , anchor) {
    let i = 0
    const l2 = c2.length
    let e1 = c1.length - 1
    let e2 = l2 - 1

    function isSomeVNode(n1 , n2) {
      // type
      // key
      return n1.type === n2.type && n1.key === n2.key
    }

    // left
    for(; i <= e1 && i <= e2 ; i ++) {
      const n1 = c1[i]
      const n2 = c2[i]

      if(isSomeVNode(n1 , n2)){
        patch(n1 , n2 , container , parentComponent , anchor)
      }else{
        break
      }
    }

    // right
    for(; i <= e1 && i <= e2 ; e1 -- , e2 --) {
      const n1 = c1[e1]
      const n2 = c2[e2]

      if(isSomeVNode(n1 , n2)){
        patch(n1 , n2 , container , parentComponent , anchor)
      }else{
        break
      }
    }

    // 新的比老的多，创建
    if(i > e1) {
      if(i <= e2) {
        const nextPos = e2 + 1
        const anchor = nextPos < l2 ? c2[nextPos].el : null
        for(; i <= e2 ; i ++){
          patch(null , c2[i] , container , parentComponent , anchor)
        }
      }
    }
    // 老的比新的多，删除 
    else if(i > e2) {       
      for(; i <= e1 ; i ++) {
        hostRemove(c1[i].el)
      }
    }
    // 中间对比
    else {
      let s1 = i
      let s2 = i

      const keyToNewIndexMap = new Map()
      const toBePatched = e2 - s2 + 1
      let patched = 0

      for(let i = s2 ; i <= e2 ; i ++) {
        const nextChild = c2[i]
        keyToNewIndexMap.set(nextChild.key , i)
      }

      for(let i = s1 ; i <= e1 ; i ++) {
        const preChild = c1[i]

        if(patched >= toBePatched) {
          console.log('hao xiang jerk off')
          hostRemove(preChild.el)
          continue
        }

        let newIndex
        if(preChild.key !== null){
          newIndex = keyToNewIndexMap.get(preChild.key)
        } else {
          for(let j = s2 ; j <= e2 ; j ++) {
            if(isSomeVNode(preChild , c2[j])){
              newIndex = j
              break
            }
          }
        }

        if(newIndex === undefined) {
          hostRemove(preChild.el)
        } else {
          patch(preChild , c2[newIndex] , container , parentComponent , null)
          patched ++
        }

      }
    }
  }

  function unmountChildren(children) {
    children.forEach(i => {
      const el = i.el
      // remove
      hostRemove(el)
    });
  }
  
  const EMPTY_OBJECT = {}
  
  function patchProps(el , oldProps , newProps){
    if(oldProps !== newProps){
      for (const key in newProps) {
        const prevProp = oldProps[key]
        const nextProp = newProps[key]

        if(prevProp !== nextProp) {
          hostPatchProps(el , key , prevProp , nextProp)
        }
      }

      if(oldProps !== EMPTY_OBJECT) {
        for (const key in oldProps) {
          if(!(key in newProps)) {
            hostPatchProps(el , key , oldProps[key] , null)
          }
        }  
      }    
    }
  }

  function mountElement(vnode , container , parentComponent , anchor) {
    const el = (vnode.el = hostCreateElement(vnode.type))

    // string array
    const {children , props , shapeFlag} = vnode
    
    if(shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      // string
      el.textContent = children
    } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      // vnode
      mountChildren(vnode.children , el , parentComponent , anchor)
    }

    // props
    for(const key in props) {
      const val = props[key]
      hostPatchProps(el , key , null , val)
    }

    hostInsert(el , container , anchor)
  }

  function mountChildren(children , container , parentComponent , anchor) {
    children.forEach(v => patch(null , v , container , parentComponent , anchor));
  }

  function processComponent(n1 , n2 , container , parentComponent , anchor) {
    mountComponent(n2 , container , parentComponent , anchor)
  }

  function mountComponent(vnode , container , parentComponent , anchor) {
    const instance = createComponentInstance(vnode , parentComponent)

    setupComponent(instance)
    setupRenderEffect(instance , vnode , container , anchor)
  }

  function setupRenderEffect(instance , vnode , container , anchor) {
    effect(() => {
      if(!instance.isMounted) {
        const {proxy} = instance
        const subTree = (instance.subTree = instance.render.call(proxy))

        // vnode -> patch
        // vnode -> element -> mountElement

        patch(null , subTree , container , instance , anchor)

        // element -> mount
        vnode.el = subTree.el 
        instance.isMounted = true      
      } else {
        const {proxy} = instance
        const subTree = instance.render.call(proxy)
        const prevSubTree = instance.subTree
        instance.subTree = subTree

        patch(prevSubTree , subTree , container , instance , anchor)
      }
    })
  }

  return{
    createApp: createAppAPI(render)
  }
}
