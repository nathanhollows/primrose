<template>
  <section class="mb-8">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-lg font-bold">{{ title }}</h2>
      <button v-if="reminders.length != 0" class="btn btn-ghost" @click.prevent="selectAll">
        <CheckCheckIcon class="h-5 w-5" />
      </button>
    </div>
    <div v-if="reminders.length === 0" class="bg-base-200 p-4 rounded-lg text-center">
      Nothing to show
    </div>
    <div v-else class="join join-vertical w-full">
      <div
        v-for="reminder in reminders"
        :key="reminder.id"
        class="flex flex-row justify-between items-center space-x-3 bg-base-200 hover:bg-base-300 rounded-lg p-4 border border-base-300 join-item"
      >
        <div class="flex flex-row items-center space-x-3 grow">
          <CakeIcon v-if="reminder.type === 'birthday'" class="text-info h-5 w-5 mr-2" />
          <SparklesIcon
            v-else-if="reminder.type === 'suggested'"
            class="text-accent h-5 w-5 mr-2"
          />
          <MessageCircleIcon
            v-else-if="reminder.type === 'reach-out'"
            class="text-content h-5 w-5 mr-2"
          />
          <BellRingIcon v-else class="text-primary-content h-5 w-5 mr-2" />
          <RouterLink :to="`/contacts/${reminder.contactId}`" class="link basis-40">
            {{ reminder.contact.firstName }} {{ reminder.contact.lastName }}
          </RouterLink>
          <span v-if="reminder.type === 'birthday' && hasAged(reminder.contact.birthday)"
            >{{ reminder.contact.firstName }} has turned {{ age(reminder.contact.birthday) }}.</span
          >
          <span v-else-if="reminder.type === 'birthday'"
            >{{ reminder.contact.firstName }} is turning {{ age(reminder.contact.birthday) }}.</span
          >
          <span v-else-if="reminder.type != 'reach-out'">{{ reminder.note }} </span>
          <span v-else-if="reminder.contact.lastInteractionDate">
            Last contact was
            <RelativeTime
              :date="reminder.contact.lastInteractionDate"
              v-if="reminder.type === 'reach-out' && reminder.contact.lastInteractionDate"
            />.
          </span>
          <span v-else class="italic">No recorded interactions. </span>
        </div>
        <button
          v-if="reminder.type === 'suggested'"
          class="btn btn-sm btn-ghost btn-circle"
          @click="deleteReminder(reminder.id)"
        >
          <Trash2Icon class="h-5 w-5" />
        </button>
        <button
          v-if="reminder.type === 'suggested' || reminder.type === 'birthday'"
          class="btn btn-sm btn-ghost btn-circle"
          @click="completeReminder(reminder.id)"
        >
          <CheckIcon class="h-5 w-5" />
        </button>
        <button class="btn btn-sm btn-ghost basis-17">
          {{ formatDate(reminder.reminderDate) }}
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { defineProps } from 'vue'
import { CakeIcon } from 'lucide-vue-next'
import { MessageCircleIcon } from 'lucide-vue-next'
import { BellRingIcon } from 'lucide-vue-next'
import { CheckCheckIcon } from 'lucide-vue-next'
import { SparklesIcon } from 'lucide-vue-next'
import { CheckIcon } from 'lucide-vue-next'
import { Trash2Icon } from 'lucide-vue-next'
import $bus from '../utils/Events'
import RelativeTime from './RelativeTime.vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  reminders: {
    type: Array,
    required: true
  },
  outline: {
    type: String,
    required: false
  }
})

function completeReminder(reminder) {
  $bus.$emit('complete-reminder', {
    reminder: reminder
  })
}

function deleteReminder(reminder) {
  $bus.$emit('delete-reminder', {
    reminder: reminder
  })
}

function formatDate(date) {
  if (props.title === 'Today') return 'Today'
  if (props.title === 'Tomorrow') return 'Tomorrow'
  return new Date(date).toLocaleDateString('en-NZ', {
    month: 'short',
    day: 'numeric'
  })
}

function selectAll() {
  // For each reminder, set the checked property to true
  for (let reminder of props.reminders) {
    reminder.checked = true
  }
}

// Return whether the birthday has passed this year
function hasAged(birthday) {
  const today = new Date()
  const birthDate = new Date(birthday)
  const currentYear = today.getFullYear()
  const birthMonth = birthDate.getMonth()
  const birthDay = birthDate.getDate()
  const birthdayThisYear = new Date(currentYear, birthMonth, birthDay)
  return today > birthdayThisYear
}

// Calculate the age of a person at the end of the current year
function age(birthday) {
  const today = new Date()
  const birthDate = new Date(birthday)
  const currentYear = today.getFullYear()
  const birthYear = birthDate.getFullYear()
  const age = currentYear - birthYear
  return age
}
</script>
