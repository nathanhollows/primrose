<template>
  <button
    @click.prevent="toggleDark()"
    class="px-4 py-2 text-lime-600 dark:text-lime-300 black rounded"
  >
    <i>
      <Sun v-if="!isDark" />
      <Moon v-else />
    </i>
  </button>
</template>

<script setup>
import { useDark, useToggle } from '@vueuse/core'
import { Moon, Sun } from 'lucide-vue-next'

const isDark = useDark()
const toggleDark = useToggle(isDark)
</script>
