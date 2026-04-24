// import { ref , effect } from "./node_modules/@vue/reactivity/dist/reactivity.esm-browser.js";

// const a = ref(5);
// let b = 0

// effect(() => {
//   // 收集依赖
//   b = a.value + 10;
//   console.log(b);
// })

// a.value = 10; // 触发依赖更新

import { Dep , effect ,reactive } from './core/index.js'

const a = reactive({
  age: 10
})

let b = 0

effect(() => {
  b = a.age + 1
  console.log(b)
})

a.age = 20