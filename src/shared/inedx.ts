export const extned = Object.assign
export const isObject = (val) => {
  return val !== null && typeof val === 'object'
}
export const hasChanged = (val , newVal) => !Object.is(val , newVal)
export const hasOwn = (val , key) => Object.prototype.hasOwnProperty.call(val , key)
export const capitalize = (str:String) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
export const toHandlerKey = (str:string) => {
  return 'on' + capitalize(str)
}
export const camelize = (str:String) => {
  return str.replace(/-(\w)/g, (_,c:String) => {
    return c ? c.toUpperCase() : ''
  })
}