<template>
  <RouterLink
    class="btn btn-wide flex items-left gap-x-6 justify-start"
    active-class="btn-active active"
  >
    <!-- Show the content passed into this component -->
    <slot />
  </RouterLink>
</template>

<script setup>
import { inject, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'

const sidebarVisible = ref('-translate-x-0')
const toggleSidebar = () => {
  sidebarVisible.value =
    sidebarVisible.value === 'translate-x-0' ? '-translate-x-full' : 'translate-x-0'
}

const $bus = inject('$bus')

onMounted(() => {
  $bus.$on('toggleSideBar', toggleSidebar)
})
</script>

<style scoped>
/* btn's that aren't btn-primary */
.btn:not(.active) {
  @apply btn-ghost;
}
</style>
