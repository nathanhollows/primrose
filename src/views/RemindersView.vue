<template>
  <main class="pb-4">
    <!-- Filters -->
    <div class="flex justify-between items-center mb-4">
      <div class="flex space-x-4 filter-menu">
        <label :class="{ btn: true, 'btn-primary': filters.type === '' }">
          <input type="radio" class="form-radio" name="options" value="" v-model="filters.type" />
          <BellIcon class="h-5 w-5" /> All
        </label>
        <label :class="{ btn: true, 'btn-primary': filters.type === 'birthday' }">
          <input
            type="radio"
            class="form-radio"
            name="options"
            value="birthday"
            v-model="filters.type"
          />
          <CakeIcon class="h-5 w-5" /> Birthdays
        </label>
        <label :class="{ btn: true, 'btn-primary': filters.type === 'reach-out' }">
          <input
            type="radio"
            class="form-radio"
            name="options"
            value="reach-out"
            v-model="filters.type"
          />
          <MessageCircleIcon class="h-5 w-5" /> Reach outs
        </label>
        <label :class="{ btn: true, 'btn-primary': filters.type === 'suggested' }">
          <input
            type="radio"
            class="form-radio"
            name="options"
            value="suggested"
            v-model="filters.type"
          />
          <SparklesIcon class="h-5 w-5" /> Suggested
        </label>
      </div>
      <input
        type="text"
        placeholder="Search reminders..."
        class="input input-bordered w-full max-w-xs"
        v-model="filters.searchQuery"
      />
    </div>

    <RemindersList
      :title="'Overdue'"
      :reminders="filterRemindersBetween(-100, -1)"
      :outline="'error'"
    />
    <RemindersList
      :title="'Today'"
      :reminders="filterRemindersBetween(0, 0)"
      :outline="'warning'"
    />
    <RemindersList
      :title="'Soon'"
      :reminders="filterRemindersBetween(1, 30)"
      :outline="'success'"
    />
  </main>
</template>

<script setup>
import { onMounted, reactive } from 'vue'
import { setTitle } from '../utils/Title'
import { RepositoryFactory } from '../repositories/RepositoryFactory'
import $bus from '../utils/Events'
import RemindersList from '../components/RemindersList.vue'
import { BellIcon } from 'lucide-vue-next'
import { CakeIcon } from 'lucide-vue-next'
import { MessageCircleIcon } from 'lucide-vue-next'
import { SparklesIcon } from 'lucide-vue-next'
import Dates from '../utils/Dates'

const filters = reactive({
  type: '',
  searchQuery: ''
})

const state = reactive({
  reminders: {
    data: [],
    message: '',
    links: []
  }
})

onMounted(() => {
  setTitle('Reminder')
  fetchReminders()
  $bus.$on('complete-reminder', (data) => {
    completeReminder(data.reminder)
  })
  $bus.$on('delete-reminder', (data) => {
    deleteReminder(data.reminder)
  })
})

const RemindersRepository = RepositoryFactory.get('reminders')

async function fetchReminders() {
  try {
    const { data } = await RemindersRepository.get()
    state.reminders = data
  } catch (err) {
    $bus.$emit('new-toast', {
      message: err.message,
      style: 'error'
    })
  }
}

async function completeReminder(id) {
  try {
    await RemindersRepository.patch(id, { completed: true })
    fetchReminders()
    $bus.$emit('new-toast', {
      message: 'Reminder completed',
      style: 'success'
    })
  } catch (err) {
    $bus.$emit('new-toast', {
      message: err.message,
      style: 'error'
    })
  }
}

async function deleteReminder(id) {
  try {
    await RemindersRepository.delete(id)
    fetchReminders()
    $bus.$emit('new-toast', {
      message: 'Reminder deleted',
      style: 'success'
    })
  } catch (err) {
    $bus.$emit('new-toast', {
      message: err.message,
      style: 'error'
    })
  }
}

// Accept either an int or a Date object
function filterRemindersBetween(start, end) {
  let offset = new Date().getTimezoneOffset() / 60 / 24
  if (typeof start === 'number') {
    start = new Date(new Date().setDate(new Date().getDate() + start - offset))
    start = Dates.formatDateToLocalISO(start)
  }
  if (typeof end === 'number') {
    end = new Date(new Date().setDate(new Date().getDate() + end - offset))
    end = Dates.formatDateToLocalISO(end)
  }
  return state.reminders.data.filter((reminder) => {
    return (
      reminder.reminderDate >= start &&
      reminder.reminderDate <= end &&
      (reminder.type === filters.type || !filters.type) &&
      (reminder.note.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        reminder.contact.firstName.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        reminder.contact.lastName.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        !filters.searchQuery)
    )
  })
}
</script>

<style scoped>
.filter-menu input[type='radio'] {
  display: none;
}
</style>
