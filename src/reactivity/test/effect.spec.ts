import { reactive } from '../reactive.ts'
import { effect } from '../effec.ts'
 
describe("effect" , () => {
  it("happy path" , () => {
    const user = reactive({
      age: 10
    })

    let nextAge
    effect(() => {
      nextAge = user.age + 1
    })

    expect(nextAge).toBe(11)

    // update
    user.age = 20
    expect(nextAge).toBe(21)
  })

  it("should return runner when call effct" , () => {
    // effct(fn) -> function (runner) -> fn -> return 
    let foo = 10

    const runner = effect(() => {
      foo ++
      return 'foo'
    })
    
    expect(foo).toBe(11)
    
    const result = runner()
    expect(foo).toBe(12)
    expect(result).toBe('foo')
  })
})