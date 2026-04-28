import { readonly } from "../reactive"

describe("readonly" , () => {
  it("happy path" , () => {
    // not set
    const original = { foo: 1 , bar: {baz: 2} }
    const wrapped = readonly(original)
    expect(wrapped).not.toBe(original)
    expect(wrapped.foo).toBe(1)
  })

  it("warn when call set" , () => {
    const user = {
      age: 20
    }

    console.warn = jest.fn()

    user.age = 10

    expect(user.age).toBe(10)
  })
})