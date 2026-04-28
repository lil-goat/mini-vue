import { readonly , isReadOnly, isProxy } from "../reactive"

describe("readonly" , () => {
  it("happy path" , () => {
    // not set
    const original = { foo: 1 , bar: {baz: 2} }
    const wrapped = readonly(original)
    expect(isReadOnly(wrapped)).toBe(true)
    expect(isReadOnly(original)).toBe(false)
    expect(isReadOnly(wrapped.bar)).toBe(true)
    expect(isReadOnly(original.bar)).toBe(false)
    expect(isProxy(wrapped)).toBe(true)
    expect(wrapped).not.toBe(original)
    expect(wrapped.foo).toBe(1)
  })

  it("warn when call set" , () => {
    const user = readonly({
      age: 20
    })

    console.warn = jest.fn()

    user.age = 10

    expect(user.age).toBe(20)
    expect(console.warn).toHaveBeenCalledTimes(1)
  })
})