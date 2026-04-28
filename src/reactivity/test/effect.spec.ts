import { reactive } from '../reactive.ts'
import { effect , stop} from '../effec.ts'
 
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

  it("scheduler" , () => {
    // 1. 通过 effec 的第二个参数给定的一个scheduler的fn
    // 2. 当effect第一次执行的时候也会执行fn
    // 3. 当响应式数据发生变化的时候，effect就不会执行fn了，而是执行schedule
    // 4. 如果执行runner会执行fn
    let dummy
    const obj = reactive({ foo : 1 })
    const scheduler = jest.fn(() => {})
    const runner = effect(() => {
      dummy = obj.foo
    } , { scheduler })
    expect(scheduler).not.toHaveBeenCalled()
    expect(dummy).toBe(1)
    // should be called after first trigger
    obj.foo = 10
    expect(scheduler).toHaveBeenCalledTimes(1)
    // should not run yet
    expect(dummy).toBe(1)
    // manually run
    runner()
    // should have run
    expect(dummy).toBe(10)
  })

  it("stop" , () => {
    let dummy
    const obj = reactive({ prop: 1 })
    const runner = effect(() => {
      dummy = obj.prop
    })
    obj.prop = 2
    expect(dummy).toBe(2)
    stop(runner)
    obj.prop ++
    expect(dummy).toBe(2)

    // stopped effect should still be manually callable
    runner()
    expect(dummy).toBe(3)
  })

  it("onStop" , () => {
    let dummy
    const obj = reactive({ prop: 1 })
    const onStop = jest.fn()
    const runner = effect(
      () => {
        dummy = obj.prop
      },
      {
        onStop
      }
    )

    stop(runner)
    expect(onStop).toHaveBeenCalledTimes(1)
  })
})