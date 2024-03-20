<template>Hello</template>

<script setup>
import { onMounted } from 'vue'
import { setTitle } from '../utils/Title'

onMounted(() => {
  setTitle('Dashboard')
})
</script>
