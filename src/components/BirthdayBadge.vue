<template>
  <div class="badge" :class="style">
    <GiftIcon width="1em" class="mr-2" />
    {{ birthdayDay }} {{ birthdayMonthAsWord }}
    <span v-if="age">&nbsp;(age {{ age }})</span>
  </div>
</template>

<script setup>
import { GiftIcon } from 'lucide-vue-next'

// Define date prop for birthday badge
const props = defineProps({
  date: {
    type: String,
    required: true,
    validator: (value) => {
      const date = new Date(value)
      return !isNaN(date.getTime())
    }
  }
})

// Get birthday from props
const birthday = new Date(props.date)

let style = 'badge-base'
// If birthday is this month, set style to primary
if (birthday.getMonth() === new Date().getMonth()) {
  style = 'badge-accent'
} else if (birthday.getMonth() === (new Date().getMonth() + 1) % 12) {
  // If birthday is next month, set style to secondary
  style = 'badge-secondary'
}

// Get month and day from birthday
const birthdayDay = birthday.getDate()
const birthdayMonthAsWord = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(birthday)
const birthdayYear = birthday.getFullYear()
let age = null
if (birthdayYear > 1900) {
  const today = new Date()
  const todayYear = today.getFullYear()
  age = todayYear - birthdayYear
  if (today.getMonth() < birthday.getMonth()) {
    age--
  } else if (today.getMonth() === birthday.getMonth()) {
    if (today.getDate() < birthday.getDate()) {
      age--
    }
  }
}
</script>
