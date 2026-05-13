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
/**
 * 
 * @param arr 数组
 * @return ans 返回数组，包含最长子序列元素下标
 */
export function getSequence(arr: number[]): number[] {
  const len = arr.length
  if (len === 0) {
    return []
  }
  const p = arr.slice()
  const result: number[] = [0]
  let i: number
  let j: number
  let u: number
  let v: number
  let c: number
  for (i = 0; i < len; i++) {
    const arrI = arr[i]!
    if (arrI !== 0) {
      j = result[result.length - 1]!
      if (arr[j]! < arrI) {
        p[i] = j
        result.push(i)
        continue
      }
      u = 0
      v = result.length - 1
      while (u < v) {
        c = (u + v) >> 1
        if (arr[result[c]!]! < arrI) {
          u = c + 1
        } else {
          v = c
        }
      }
      if (arrI < arr[result[u]!]!) {
        if (u > 0) {
          p[i] = result[u - 1]!
        }
        result[u] = i
      }
    }
  }
  u = result.length
  v = result[u - 1]!
  while (u-- > 0) {
    result[u] = v
    v = p[v]!
  }
  return result
}
export const isString = (value) => typeof value === 'string'