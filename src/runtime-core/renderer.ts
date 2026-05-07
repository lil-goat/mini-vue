import { isObject } from "../shared/inedx"
import { createComponentInstance } from "./component"
import { setupComponent } from "./component"
import { ShapeFlags } from "./ShapeFlags"

export function render(vnode , container) {
  // patch 
  // 
  patch(vnode , container)
}

function patch(vnode , container) {
  const {shapeFlag} = vnode

  if(shapeFlag & ShapeFlags.ELEMENT) {
    // 处理组件
    processElement(vnode , container)
  } else if(shapeFlag & ShapeFlags.STATE_COMPONENT) {
    processComponent(vnode , container)
  }
}

function processElement(vnode , container) {
  mountElement(vnode , container)
} 

function mountElement(vnode , container) {
  const el = (vnode.el = document.createElement(vnode.type))

  // string array
  const {children , props , shapeFlag} = vnode
  
  if(shapeFlag & ShapeFlags.TEXT_CHILDREN) {
    // string
    el.textContent = children
  } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
    // vnode
    children.forEach(v => patch(v , el))
  }

  // props
  for(const key in props) {
    const val = props[key]
    el.setAttribute(key , val)
  }

  container.append(el)
}

function processComponent(vnode , container) {
  mountComponent(vnode , container)
}

function mountComponent(vnode , container) {
  const instance = createComponentInstance(vnode)

  setupComponent(instance)
  setupRenderEffect(instance , vnode , container)
}

function setupRenderEffect(instance , vnode , container) {
  const {proxy} = instance
  const subTree = instance.render.call(proxy)

  // vnode -> patch
  // vnode -> element -> mountElement

  patch(subTree , container)

  // element -> mount
  vnode.el = subTree.el
}
