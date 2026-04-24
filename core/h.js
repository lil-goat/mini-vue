// createVnode

/**
 * 
 * @param {标签} tag 
 * @param {属性} props 
 * @param {子节点} children 
 */
export function h (tag , props , children) {
  return{
    tag,
    props,
    children
  }
}