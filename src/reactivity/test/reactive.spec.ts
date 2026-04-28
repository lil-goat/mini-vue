import { reactive } from '../reactive.ts'

describe("happy path" , () => {
  it("happy path" , () => {
    const original = { foo: 1 }
    const observed = reactive(original)
    expect(original).not.toBe(observed)
    expect(observed.foo).toBe(1)
  })
})