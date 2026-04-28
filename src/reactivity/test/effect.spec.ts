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
})