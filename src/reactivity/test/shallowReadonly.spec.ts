import { isReadOnly, readonly, shallowReadonly } from "../reactive";

describe("shalloReadonly" , () => {
  it("should make readonly object has non-readonly properties" , () => {
    const props = shallowReadonly({ foo: {bar: 1} })
    expect(isReadOnly(props)).toBe(true)
    expect(isReadOnly(props.foo)).toBe(false)
  })

  it("warn when call set" , () => {
    const user = shallowReadonly({
      age: 20
    })

    console.warn = jest.fn()

    user.age = 10

    expect(user.age).toBe(20)
    expect(console.warn).toHaveBeenCalledTimes(1)
  })
})