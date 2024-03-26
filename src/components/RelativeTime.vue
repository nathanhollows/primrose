<template>
  <span :class="colored">{{ relativeTime }}</span>
</template>

<script setup>
import { formatDistance, isToday } from 'date-fns'

// Define date prop
const props = defineProps({
  date: {
    type: String,
    required: true,
    validator: (value) => {
      const date = new Date(value)
      return !isNaN(date.getTime())
    }
  },
  colored: {
    type: Boolean,
    default: false
  }
})

console.log(props.date)

// Attempt to calculate relative time, handling invalid dates gracefully
let relativeTime = ''
try {
  const date = new Date(props.date)
  if (isToday(date)) {
    relativeTime = 'today'
  } else {
    relativeTime = formatDistance(date, new Date(), { addSuffix: true })
  }
} catch (error) {
  relativeTime = ''
}
</script>
