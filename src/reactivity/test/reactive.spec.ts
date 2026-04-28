import { effect } from '../effec.ts'
import { reactive , isReactive, isProxy} from '../reactive.ts'

describe("happy path" , () => {
  it("happy path" , () => {
    const original = { foo: 1 }
    const observed = reactive(original)
    expect(original).not.toBe(observed)
    expect(observed.foo).toBe(1)
    expect(isReactive((observed))).toBe(true)
    expect(isReactive((original))).toBe(false)
  })

  it("nested reactive" , () => {
    const original = {
      nested: {
        foo: 1
      },
      arr: [{bar: 2}]
    }
    const observed = reactive(original)
    let foo = 1
    expect(isReactive(observed)).toBe(true)
    expect(isProxy(observed)).toBe(true)
    expect(isReactive(observed.nested)).toBe(true)
    expect(isProxy(observed.nested)).toBe(true)
    expect(isReactive(observed.arr)).toBe(true)
    expect(isProxy(observed.arr)).toBe(true)
    effect(() => {
      foo = original.nested.foo + 1
    })
    original.nested.foo ++
    expect(foo).toBe(2)
  })
})