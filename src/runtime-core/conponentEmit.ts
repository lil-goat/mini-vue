import { camelize, toHandlerKey } from "../shared/inedx"

export function emit(instance , event , ...args) {
  console.log('trigger emit',event)

  // instance.props -> event
  const {props} = instance

  // TPP
  // 先去写一个特定的行为 -> 重构成通用行为
  // add -> Add
  // add-foo -> AddFoo
  const key = toHandlerKey(camelize(event))
  const handler = props[key]
  handler && handler(...args)    // if(handler) handler()

}