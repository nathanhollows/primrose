<template>
  <li>
    <RouterLink class="font-bold p-3" active-class="btn-active active" :to="to">
      <slot />
    </RouterLink>
  </li>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import { defineProps } from 'vue'

defineProps({
  to: {
    type: String,
    required: true
  }
})
</script>

<style scoped>
/* btn's that aren't btn-primary */
.btn:not(.active) {
  @apply btn-ghost;
}
</style>
