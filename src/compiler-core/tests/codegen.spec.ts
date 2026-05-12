import { generate } from "../src/codegen"
import { baseParse } from "../src/parse"
import { transform } from "../src/transform"


describe('codegen' , () => {
  it('string' , () => {
    const ast = baseParse('hi')

    transform(ast)
    const {code} = generate(ast)

    console.log(code)
    // 快照（string）
    // 1. 抓错
    // 2. 有意
    expect(code).toMatchSnapshot()
  })
})