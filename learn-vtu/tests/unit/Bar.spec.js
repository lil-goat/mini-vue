import Bar from "@/components/Bar.vue";
import { mount } from "@vue/test-utils";

jest.mock("axios" , () => {
  return {
    get() {
      return new Promise((resolve , reject) => {
        resolve({data: "heihei"})
      })
    }
  }
})

describe("Bar.vue" , () => {
  it("get users" , () => {
    const wrapper = mount(Bar)

    wrapper.get("#btn").trigger("click")

    setTimeout(() => {
      expect(wrapper.text()).toContain("heihei")
    } , 0)
  })
})