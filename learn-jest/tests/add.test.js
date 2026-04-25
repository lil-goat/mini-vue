const add = require('../add.js')

// test/it

describe("add" , () => {
  it("1 + 2 = 3" , () => {

    // given -> 准备数据
    const a = 1
    const b = 1

    // when -> 触发测试动作
    const result = add(a , b)
    
    // jest -> 断言
    // toBe -> 匹配器
    // then -> 验证结果
    expect(result).toBe(2)
  })

  it("2 + 2 = 4" , () => {
    const a = 2
    const b = 2

    const result = add(a , b)

    expect(result).toBe(4)
  })
})

describe("compare" , () => {
  test("判断对象相等" , () => {
    const obj1 = {
      name:1
    }

    const obj2 = {
      name:1
    }

    expect(obj1).toEqual(obj2)
  })
})