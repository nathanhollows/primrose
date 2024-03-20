<template>
  <ToastError :toasts="toasts" />
  <div v-if="isLoaded">
    <div class="flex align-middle justify-between items-center md:mb-5">
      <div class="md:flex-1">
        <RouterLink
          :to="`/contacts/${$route.params.id}`"
          class="flex align-middle items-center text-neutral-content tooltip tooltip-bottom"
          data-tip="Back"
        >
          <ChevronLeftIcon class="h-5 w-5 mr-5" /> Editing {{ contact.firstName }}
          {{ contact.lastName }}
        </RouterLink>
      </div>
      <h1 class="text-2xl font-semibold text-center my-10 md:flex-1 invisible md:visible">
        <AvatarCircle
          :name="contact.firstName + ' ' + contact.lastName"
          size="large"
          class="pr-2"
          :color="state.contact.data.group.color"
        />
        {{ contact.firstName + ' ' + contact.lastName }}
        <span v-if="contact.nickname" class="text-neutral-content text-sm">
          ({{ contact.nickname }})
        </span>
      </h1>
      <div class="md:flex-1 align-middle text-end">
        <button
          class="tooltip tooltip-bottom btn btn-ghost btn-circle"
          data-tip="Save"
          @click.prevent="updateContact"
        >
          <CheckIcon class="h-5 w-5 m-auto p-0" />
        </button>
      </div>
    </div>

    <div class="divider mt-10">Basics</div>

    <form @submit.prevent="updateContact">
      <div class="grid md:grid-cols-3 gap-5">
        <div class="form-control">
          <label class="label">
            <span class="label-text">First name</span>
          </label>
          <input
            type="text"
            name="firstName"
            v-model="contact.firstName"
            placeholder="First name"
            class="input input-bordered"
          />
        </div>

        <div class="form-control">
          <label class="label">
            <span class="label-text">Nickname</span>
            <span class="label-text">Also known as</span>
          </label>
          <input
            type="text"
            name="firstName"
            v-model="contact.nickname"
            placeholder="Other name"
            class="input input-bordered"
          />
        </div>

        <div class="form-control">
          <label class="label">
            <span class="label-text">Last name</span>
          </label>
          <input
            type="text"
            name="lastName"
            v-model="contact.lastName"
            placeholder="Last name"
            class="input input-bordered"
          />
        </div>
      </div>

      <div class="grid md:grid-cols-3 gap-5">
        <div class="form-control">
          <label class="label">
            <span class="label-text">Day</span>
          </label>
          <input
            type="number"
            name="birthdayDay"
            v-model="contact.birthdayDay"
            placeholder="Day"
            class="input input-bordered"
            max="31"
            min="1"
          />
        </div>

        <div class="form-control">
          <label class="label">
            <span class="label-text">Month</span>
          </label>
          <select
            name="birthdayMonth"
            v-model="contact.birthdayMonth"
            class="select select-bordered"
            value=""
          >
            <option value="" disabled selected hidden>Month</option>
            <option v-for="month in listMonths()" :key="month.value" :value="month.value">
              {{ month.label }}
            </option>
          </select>
        </div>

        <div class="form-control">
          <label class="label">
            <span class="label-text">Year</span>
            <span
              v-if="
                contact.birthdayYear !== 1000 &&
                contact.birthdayYear !== null &&
                contact.birthdayYear !== ''
              "
              class="label-text-alt"
              >Age {{ contact.age }}</span
            >
          </label>
          <input
            type="number"
            name="birthdayYear"
            v-model="contact.birthdayYear"
            placeholder="Year"
            class="input input-bordered"
            min="1900"
            max="2100"
          />
        </div>
      </div>

      <div class="divider mt-10">Bio</div>

      <div class="form-control">
        <label class="label">
          <span class="label-text">Bio</span>
        </label>
        <textarea
          name="howWeMet"
          v-model="contact.bio"
          placeholder="How we met"
          class="textarea h-24 textarea-bordered"
        >
        </textarea>
      </div>

      <div class="divider mt-10">Notes</div>

      <div class="form-control">
        <label class="label">
          <span class="label-text">How we met</span>
        </label>
        <textarea
          name="howWeMet"
          v-model="contact.howWeMet"
          placeholder="How we met"
          class="textarea h-24 textarea-bordered"
        >
        </textarea>
      </div>

      <button type="submit" class="btn btn-primary mt-10">Save</button>
    </form>
  </div>
</template>

<script setup>
// Import statements
import { watch, ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import AvatarCircle from '../components/AvatarCircle.vue'
import { RepositoryFactory } from './../repositories/RepositoryFactory.js'
import ToastError from '../components/ToastError.vue'
import { ChevronLeftIcon } from 'lucide-vue-next'
import { CheckIcon } from 'lucide-vue-next'
import { setTitle } from '../utils/Title'

// Repository and router setup
const ContactRepository = RepositoryFactory.get('contacts')
const GroupRepository = RepositoryFactory.get('groups')
const $route = useRoute()

// Reactive variables
const toasts = ref([])
const state = {
  contact: {
    data: null,
    message: '',
    links: []
  },
  groups: {
    data: [],
    message: '',
    links: []
  }
}
const contact = ref(null)
const isLoaded = ref(false)

// Lifecycle hook
onMounted(() => {
  fetchContact(), fetchGroups()
})

// Function to fetch contact details
async function fetchContact() {
  try {
    const res = await ContactRepository.get($route.params.id)
    state.contact = res.data
    contact.value = state.contact.data
    createBirthdayParts()
    isLoaded.value = true
    setTitle('Editing ' + state.contact.data.firstName + ' ' + state.contact.data.lastName)
  } catch (err) {
    toasts.value.push({
      message: 'An error occurred while fetching the contact',
      style: 'error'
    })
  }
}

function createBirthdayParts() {
  if (contact.value.birthday) {
    const birthdayParts = contact.value.birthday.split('-')
    contact.value.birthdayDay = birthdayParts[2]
    contact.value.birthdayMonth = birthdayParts[1]
    if (birthdayParts[0] === '1000') {
      contact.value.birthdayYear = null
    } else {
      contact.value.birthdayYear = birthdayParts[0]
    }
  }
}

const contactBirthday = computed(() => {
  if (!isLoaded.value) {
    return null
  }
  if (contact.value.birthdayDay && contact.value.birthdayMonth && contact.value.birthdayYear) {
    return `${contact.value.birthdayYear}-${contact.value.birthdayMonth
      .toString()
      .padStart(2, '0')}-${contact.value.birthdayDay.toString().padStart(2, '0')}`
  } else if (contact.value.birthdayDay && contact.value.birthdayMonth) {
    return `1000-${contact.value.birthdayMonth
      .toString()
      .padStart(2, '0')}-${contact.value.birthdayDay.toString().padStart(2, '0')}`
  }
  return null
})

watch(contactBirthday, (newVal) => {
  contact.value.birthday = newVal
  contact.value.age = calculateAge()
})

function calculateAge() {
  if (!contactBirthday.value) {
    return null
  }
  const birthdayParts = contactBirthday.value.split('-')
  const birthday = new Date(birthdayParts[0], birthdayParts[1] - 1, birthdayParts[2])
  const ageDifMs = Date.now() - birthday.getTime()
  const ageDate = new Date(ageDifMs)
  return Math.abs(ageDate.getUTCFullYear() - 1970)
}

function listMonths() {
  return [
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' }
  ]
}

// Function to fetch groups
async function fetchGroups() {
  try {
    const res = await GroupRepository.get()
    state.groups = res.data
  } catch (err) {
    toasts.value.push({
      message: 'An error occurred while fetching the groups',
      style: 'error'
    })
  }
}

// Patch contact
async function updateContact() {
  try {
    let payload = {
      firstName: contact.value.firstName,
      lastName: contact.value.lastName,
      birthday: contactBirthday.value,
      howWeMet: contact.value.howWeMet,
      nickname: contact.value.nickname
    }
    await ContactRepository.put(contact.value.id, payload)
    toasts.value.push({
      message: 'Contact updated successfully',
      style: 'success'
    })
  } catch (err) {
    toasts.value.push({
      message: 'An error occurred while updating the contact',
      style: 'error'
    })
  }
}
</script>

<style scoped>
.tab {
  @apply rounded-md !important;
}
</style>
