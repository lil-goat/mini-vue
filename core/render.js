function createElement(tag) {
  return document.createElement(tag)
}

function patchProps(el , key , preValue , newValue) {
  el.setAttribute(key , newValue)
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
  const element = createElement(tag)

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