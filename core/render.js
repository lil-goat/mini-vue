function createElement(tag) {
  return document.createElement(tag)
}

function patchProps(el , key , preValue , newValue) {
  if(!newValue) {
    el.removeAttribute(key)
  } else{
    el.setAttribute(key , newValue)
  }
}

function removeChildNode(parent , child){
  return parent.removeChild(child)
}

function insert(parent , el){
  parent.append(el)
}

function createTextNode(text){
  return document.createTextNode(text)
}

/**
 * 
 * @param {虚拟节点} vnode 
 * @param {容器} container 
 */
export function mountElement(vnode , container) {
  // tag , props , children
  const { tag , props , children } = vnode

  // 创建
  const element = (vnode.el = createElement(tag))

  // props
  for(const key in props) {
    const val = props[key]
    patchProps(element , key , null , val)
  }

  // children
  // string || Array
  if(typeof children === 'string'){
    const textNode = createTextNode(children)
    insert(element , textNode)
  } else if (Array.isArray(children)){
    children.forEach(v => {
      mountElement(v , element)
    })
  }

  // insert
  insert(container , element)
}

/**
 * 
 * @param {oldVnode} n1 
 * @param {newVnode} n2 
 */
export function diff(n1 , n2) {
  // el真实的节点
  const el = n1.el
  // tag
  if(n1.tag !== n2.tag) {
    el.replaceWith(document.createElement(n2.tag))
  } else {
    // props
    // 1.
    // new {a , b}
    // old {a}
    // old -> add b
    // 2.new {a}
    // old {a , b}
    // old -> remove a
    const newProps = n2.props
    const oldProps = n1.props
    if(newProps) {
      for(const key in newProps) {
        const val = newProps[key]
        if(oldProps[key] !== newProps[key]){
          patchProps(el , key , oldProps[key] , newProps[key])
        }
      }
    }

    if(oldProps) {
      for(const key in oldProps) {
        if(!newProps[key]){
          patchProps(el , key , oldProps[key] , null)
        }
      }
    }
  }

  // children
  // new -> string Array
  // old -> string Array
  // 1. new String  old String
  // 2. new String  old Array
  // 3. new Array  old String
  // 4. new Array  old Array
  const newChildren = n2.children
  const oldChildren = n1.children
  if(typeof newChildren === 'string') {
    if(newChildren !== oldChildren || Array.isArray(oldChildren))
      el.innerHTML = newChildren
  } else if (Array.isArray(newChildren)){
    if(typeof oldChildren === 'string') {
      el.innerHTML = ''
      newChildren.forEach(v => {
        mountElement(v , el)
      })
    } else if(Array.isArray(oldChildren)) {
      const length = Math.min(oldChildren.length , newChildren.length)
      // 逐一比对 
      for(let i = 0 ; i < length ; i ++) {
        diff(oldChildren[i] , newChildren[i])
      }
      // new.length > old.length add 
      if(newChildren.length > oldChildren.length) {
        for(let i = length ; i < newChildren.length ; i ++) {
          mountElement(newChildren[i] , el)
        }
      } else if(newChildren.length < oldChildren.length) {
      // new.length < old.length remove 
        for(let i = length ; i < oldChildren.length ; i ++) {
          removeChildNode(el , oldChildren[i].el)
        }
      }
    }
  }
}