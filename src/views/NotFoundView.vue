<template>
  <div class="error">
    <h1>404</h1>
    <h1>This page does not exist</h1>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { setTitle } from '../utils/Title'

onMounted(() => {
  setTitle('404')
})
</script>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
