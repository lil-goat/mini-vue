import { mount } from "@vue/test-utils";

import Foo from "@/components/Foo.vue";

describe("Foo.vue" , () => {
  it("count" , async () => {
    const wrapper = mount(Foo)

    // vue渲染是异步更新
    // async,await处理异步更新
    await wrapper.get("#btn").trigger("click")

    console.log(wrapper.text())
    expect(wrapper.text()).toContain("2")
  })

  it("input" , (done) => {
    const wrapper = mount(Foo)
    
    wrapper
      .get("#input")
      .setValue('lilgoat')
      .then(() => {
        expect(wrapper.text()).toContain('lilgoat')
        done()
      })
  })
})
