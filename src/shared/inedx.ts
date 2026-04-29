export const extned = Object.assign
export const isObject = (val) => {
  return val !== null && typeof val === 'object'
}
export const hasChanged = (val , newVal) => !Object.is(val , newVal)