import { ShapeFlags } from "./ShapeFlags";

export const Fragment = Symbol('Fragment')
export const Text = Symbol('Text')

export { createVNode as createElementVNode }

export function createVNode(type , props? , children?) {
  const vnode = {
    type,
    props,
    children,
    el: null,
    component: null,
    key: props && props.key,
    shapeFlag:getShapeFlags(type)
  }

  // children
  if(typeof children === 'string') {
    vnode.shapeFlag |= ShapeFlags.TEXT_CHILDREN
  } else if(Array.isArray(children)) {
    vnode.shapeFlag |= ShapeFlags.ARRAY_CHILDREN
  }

  // 组件 + children object
  if(vnode.shapeFlag & ShapeFlags.STATE_COMPONENT) {
    if(typeof children === 'object') {
      vnode.shapeFlag |= ShapeFlags.SLOT_CHILDREN
    }
  }

  return vnode
}

export function createTextVNode(text) {
  return createVNode(Text , {} , text)
}

function getShapeFlags(type) {
  return typeof type === 'string'
    ?  ShapeFlags.ELEMENT
    :  ShapeFlags.STATE_COMPONENT;
}