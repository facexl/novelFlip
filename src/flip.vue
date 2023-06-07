<template>
  <div>
    <flipbook
      class="flipbook"
      :pages="['array', 'of', 'image', 'URLs']"
    />
  </div>
</template>

<script lang='ts' setup>
import Flipbook from 'flipbook-vue'
</script>

<style lang='less' scoped>

</style>