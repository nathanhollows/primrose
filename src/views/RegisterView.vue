<template>
  <div class="relative min-h-screen flex">
    <SideBar />
    <div class="z-10 w-full">
      <TopBar />
      <main class="p-6">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { setTitle } from '../utils/Title'

onMounted(() => {
  setTitle('Register')
})
</script>
