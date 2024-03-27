<template>
  <div v-if="isLoaded">
    <div class="flex flex-col md:flex-row gap-5 align-middle justify-between items-center mb-9">
      <div class="flex align-middle items-center gap-3">
        <AvatarCircle
          :name="state.contact.data.firstName + ' ' + state.contact.data.lastName"
          size="large"
          class="pr-2"
          :color="state.contact.data.group.color"
        />
        <div class="flex flex-col gap-1">
          <h1 class="text-2xl font-semibold">
            {{ state.contact.data.firstName + ' ' + state.contact.data.lastName }}
            <span v-if="state.contact.data.nickname" class="text-neutral-content text-sm">
              ({{ state.contact.data.nickname }})
            </span>
          </h1>
          <BirthdayBadge v-if="state.contact.data.birthday" :date="state.contact.data.birthday" />
        </div>
      </div>
      <div class="flex items-center gap-5">
        <a
          href="#"
          class="text-neutral-content tooltip tooltip-top"
          :class="state.contact.data.starred ? 'text-yellow-500' : ''"
          data-tip="Starred"
          @click.prevent="starUser"
        >
          <StarIcon class="h-5 w-5" :class="state.contact.data.starred ? 'fill-current' : ''" />
        </a>

        <RouterLink
          :to="`/contacts/${$route.params.id}/interaction`"
          class="text-neutral-content tooltip tooltip-top"
          data-tip="Make a note"
        >
          <MessageSquarePlusIcon class="h-5 w-5" />
        </RouterLink>

        <div class="dropdown md:dropdown-end dropdown-bottom">
          <div
            tabindex="0"
            role="button"
            class="m-1 tooltip tooltip-top text-neutral-content"
            data-tip="Group"
          >
            <ComponentIcon tabindex="0" class="h-5 w-5" />
          </div>
          <ul
            tabindex="0"
            class="dropdown-content z-[1] menu p-2 shadow-md bg-base-300 rounded-box w-52"
          >
            <li v-for="(group, index) in state.groups.data" :key="index">
              <a
                :class="group.id === state.contact.data.group.id ? 'active' : ''"
                @click.prevent="changeGroup(group.id)"
              >
                <span class="badge" :class="computeBg(group.color)"></span>
                {{ group.name }}
              </a>
            </li>
          </ul>
        </div>

        <div class="dropdown dropdown-bottom dropdown-end">
          <div
            tabindex="0"
            role="button"
            class="m-1 tooltip tooltip-top text-neutral-content"
            data-tip="Reminder Frequency"
          >
            <TimerResetIcon tabindex="0" class="h-5 w-5" />
          </div>

          <ul
            tabindex="0"
            class="dropdown-content z-[1] menu p-2 shadow-md bg-base-300 rounded-box w-52"
          >
            <li v-for="(frequency, index) in frequencies" :key="index">
              <a
                :class="state.contact.data.frequency === frequency ? 'active' : ''"
                @click.prevent="updateContactFrequency(frequency)"
                >{{ frequency }}</a
              >
            </li>
            <div class="divider my-0 bg-transparent"></div>
            <li>
              <a
                :class="state.contact.data.frequency === 'Disabled' ? 'active' : ''"
                @click.prevent="updateContactFrequency('Disabled')"
                >Disable</a
              >
            </li>
          </ul>
        </div>

        <RouterLink
          :to="`/contacts/${$route.params.id}/edit`"
          class="text-neutral-content tooltip tooltip-top"
          data-tip="Edit"
        >
          <PencilIcon class="h-5 w-5" />
        </RouterLink>

        <a
          href="#"
          @click.prevent="confirmDelete"
          class="text-neutral-content tooltip tooltip-top"
          data-tip="Delete"
        >
          <TrashIcon class="h-5 w-5" />
        </a>
      </div>
    </div>

    <div class="flex md:flex-row flex-col justify-between my-5 gap-5">
      <div
        class="card card-body cursor-pointer bg-primary glass shadow-md"
        @click="goToAddInteractionView"
      >
        <div class="text-primary-content text-3xl m-auto">Log interaction</div>
      </div>
      <div class="card card-body align-middle items-center bg-accent glass shadow-md">
        <div class="text-primary-content text-3xl m-auto">In touch</div>
      </div>
    </div>

    <div class="flex flex-col md:flex-row gap-3">
      <div class="w-full">
        <div class="mb-3 flex justify-between align-bottom pr-14">
          <span class="text-xl font-semibold">Timeline</span>
          Last contact {{ formatDate(state.contact.data.lastInteractionDate) }}
        </div>
        <InteractionsList :interactions="state.contact.data.interactions || []" />
      </div>

      <div class="w-full">
        <p class="mb-3 text-xl font-semibold">Gifts</p>
        <GiftList :gifts="state.contact.data.gifts || []" :contact-id="state.contact.data.id" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AvatarCircle from '../components/AvatarCircle.vue'
import { RepositoryFactory } from './../repositories/RepositoryFactory.js'
import InteractionsList from '../components/InteractionsList.vue'
import { StarIcon } from 'lucide-vue-next'
import { PencilIcon } from 'lucide-vue-next'
import { MessageSquarePlusIcon } from 'lucide-vue-next'
import { TrashIcon } from 'lucide-vue-next'
import { ComponentIcon } from 'lucide-vue-next'
import { TimerResetIcon } from 'lucide-vue-next'
import { setTitle } from '../utils/Title'
import $bus from '../utils/Events'
import BirthdayBadge from '../components/BirthdayBadge.vue'
import GiftList from '../components/GiftList.vue'

// Repository and router setup
const ContactRepository = RepositoryFactory.get('contacts')
const GroupRepository = RepositoryFactory.get('groups')
const $route = useRoute()
const $router = useRouter()

// Reactive variables
const state = reactive({
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
})
const isLoaded = ref(false)
const frequencies = ['Daily', 'Weekly', 'Fortnightly', 'Monthly', 'Quarterly', 'Yearly']

// Lifecycle hook
onMounted(() => {
  fetchContact(), fetchGroups()
  $bus.$on('delete-contact-confirmed', handleConfirmedDelete)
})

// Function to confirm contact deletion
function confirmDelete() {
  $bus.$emit('confirm-delete-modal', {
    title: 'Delete contact ' + state.contact.data.firstName + ' ' + state.contact.data.lastName,
    message: 'Are you sure you want to delete this contact?',
    confirmText: 'Delete',
    cancelText: 'Cancel',
    emitOnConfirm: 'delete-contact-confirmed'
  })
}

// Function to handle confirmed contact deletion
async function handleConfirmedDelete() {
  try {
    await ContactRepository.delete($route.params.id)
    $router.push({ path: '/contacts' })
  } catch (err) {
    $bus.$emit('new-toast', {
      message: err.message,
      style: 'error'
    })
  }
}

// Function to fetch contact details
async function fetchContact() {
  try {
    const res = await ContactRepository.get($route.params.id)
    state.contact = res.data
    isLoaded.value = true
    setTitle(state.contact.data.firstName + ' ' + state.contact.data.lastName)
  } catch (err) {
    $bus.$emit('new-toast', {
      message: 'An error occurred while fetching the contact',
      style: 'error'
    })
  }
}

// Function to fetch groups
async function fetchGroups() {
  try {
    const res = await GroupRepository.get()
    state.groups = res.data
  } catch (err) {
    $bus.$emit('new-toast', {
      message: err.message,
      style: 'error'
    })
  }
}

function computeBg(color) {
  const colors = ['primary', 'secondary', 'accent', 'success', 'warning', 'info', 'white']
  if (colors.includes(color)) {
    return `bg-${color}`
  }
  return color
}

// Function to star a contact
async function starUser() {
  try {
    await ContactRepository.patch($route.params.id, { starred: !state.contact.data.starred })
    state.contact.data.starred = !state.contact.data.starred
  } catch (err) {
    $bus.$emit('new-toast', {
      message: err.message,
      style: 'error'
    })
  }
}

// Function to change the group of a contact
async function changeGroup(groupId) {
  try {
    await ContactRepository.patch($route.params.id, { groupId })
    state.contact.data.group = state.groups.data.find((group) => group.id === groupId)
  } catch (err) {
    $bus.$emit('new-toast', {
      message: err.message,
      style: 'error'
    })
  }
}

// Function to navigate to the add interaction view
function goToAddInteractionView() {
  $router.push({
    name: 'add-interaction',
    params: { id: $route.params.id, contact: state.contact }
  })
}

const formatDate = (dateString) => {
  // Format: 31 DEC 2020
  const date = new Date(dateString)
  const options = { day: '2-digit', month: 'short', year: 'numeric' }
  const formattedDate = date.toLocaleDateString('en-GB', options)
  return formattedDate
}

async function updateContactFrequency(frequency) {
  try {
    await ContactRepository.patch($route.params.id, { frequency })
    state.contact.data.frequency = frequency
  } catch (err) {
    $bus.$emit('new-toast', {
      message: err.message,
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
