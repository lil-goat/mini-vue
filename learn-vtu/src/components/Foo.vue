<template>
  <div>
    {{ count }}
    {{ inputValue }}
    <button @click="count ++" id="btn"></button>
    <input type="text" v-model="inputValue" id="input">
  </div>
</template>

<script>
export default {
  data() {
    return {
      count: 1,
      inputValue: "nihao"
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
