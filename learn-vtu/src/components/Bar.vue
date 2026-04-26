<template>
  <div>
    {{ users }}
    <button id="btn" @click="getusrs">get</button>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  methods: {
    async getusrs () {
      const { data } = await axios.get("/users")
      this.users = data
    }
  }
}
</script>

<style lang="scss" scoped>

</style>