import { ShapeFlags } from "./ShapeFlags";


export function createVNode(type , props? , children?) {
  const vnode = {
    type,
    props,
    children,
    el: null,
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

function getShapeFlags(type) {
  return typeof type === 'string'
    ?  ShapeFlags.ELEMENT
    :  ShapeFlags.STATE_COMPONENT;
}