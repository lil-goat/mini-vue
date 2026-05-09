import { isObject } from "../shared/inedx"
import { createComponentInstance } from "./component"
import { setupComponent } from "./component"
import { ShapeFlags } from "./ShapeFlags"
import { Fragment, Text } from "./vnode"

export function render(vnode , container , parentComponent) {
  // patch 
  // 
  patch(vnode , container , parentComponent)
}

function patch(vnode , container , parentComponent) {
  const {type , shapeFlag} = vnode

  // Fragment -> 只渲染children
  switch (type) {
    case Fragment:
      processFragment(vnode , container , parentComponent)
      break;
  
    case Text:
      processText(vnode , container)
      break
    
    default:
      if(shapeFlag & ShapeFlags.ELEMENT) {
        // 处理组件
        processElement(vnode , container , parentComponent)
      } else if(shapeFlag & ShapeFlags.STATE_COMPONENT) {
        processComponent(vnode , container , parentComponent)
      }
      break;
  }

}

function processFragment(vnode , container , parentComponent) {
  mountChildren(vnode , container , parentComponent)
}

function processText(vnode , container) {
  const {children} = vnode
  const textNode = (vnode.el = document.createTextNode(children))
  container.append(textNode)
}

function processElement(vnode , container , parentComponent) {
  mountElement(vnode , container , parentComponent)
} 

function mountElement(vnode , container , parentComponent) {
  const el = (vnode.el = document.createElement(vnode.type))

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
    const isOn = (key: string) => /^on[A-Z]/.test(key)
    if (isOn(key)) {
      el.addEventListener(key.slice(2).toLowerCase() , val)
    }
    else el.setAttribute(key , val)
  }

  container.append(el)
}

function mountChildren(vnode , container , parentComponent) {
  vnode.children.forEach(v => patch(v , container , parentComponent));
}

function processComponent(vnode , container , parentComponent) {
  mountComponent(vnode , container , parentComponent)
}

function mountComponent(vnode , container , parentComponent) {
  const instance = createComponentInstance(vnode , parentComponent)

  setupComponent(instance)
  setupRenderEffect(instance , vnode , container)
}

function setupRenderEffect(instance , vnode , container) {
  const {proxy} = instance
  const subTree = instance.render.call(proxy)

  // vnode -> patch
  // vnode -> element -> mountElement

  patch(subTree , container , instance)

  // element -> mount
  vnode.el = subTree.el
}
