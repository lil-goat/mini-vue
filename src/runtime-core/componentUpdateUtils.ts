export function shouldUpdateComponent(preVnode , nextVnode) {
  const {props: preProps} = preVnode
  const {props: nextProps} = nextVnode

  for (const key in nextProps) {
    if (preProps[key] !== nextProps[key]) {
      return true
    }
  }
  return false
}