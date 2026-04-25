// app
// input
// output

// compoment
// input :
// 1. props
// 2. 用户交互
// 3. slots
// output :
// 1. vue event
// 2. rendered output
// 3. function calls

import { shallowMount } from '@vue/test-utils';
import HelloWorld from '@/components/HelloWorld.vue';

describe('HelloWorld.vue', () => {
  it('renders props.msg when passed', () => {
    const msg = 'new message';
    const wrapper = shallowMount(HelloWorld, {
      props: { msg },
    });
    console.log(wrapper.text())
    expect(wrapper.text()).toMatch(msg);
  });
});
