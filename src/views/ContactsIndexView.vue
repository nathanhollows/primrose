<template>
  <div class="md:flex md:flex-row gap-9">
    <div class="md:w-1/5 md:h-full">
      <div class="md:fixed flex flex-col gap-3">
        <ul class="menu bg-base-200 w-full rounded-box">
          <li>
            <h2 class="menu-title text-base-content">
              Filters
              <span
                class="badge badge-accent -mr-3 float-right cursor-pointer"
                v-if="activeFilters"
                @click="clearFilters"
              >
                Clear
              </span>
            </h2>
          </li>
          <div class="">
            <input
              type="text"
              id="search"
              class="input input-ghost w-full"
              placeholder="Search..."
              ref="searchRef"
              v-model="filters.searchQuery"
              autofocus
            />
          </div>
          <li>
            <h2 class="menu-title">Starred</h2>
            <ul>
              <li>
                <span
                  @click="toggleStarred"
                  :class="filters.starred ? 'active' : ''"
                  class="cursor-pointer"
                >
                  <StarIcon class="w-4" />
                  Starred
                </span>
              </li>
            </ul>
            <h2 class="menu-title">Groups</h2>
            <ul>
              <li>
                <span
                  class="hidden badge-accent badge-neutral badge-primary badge-secondary badge-info badge-success badge-warning badge-error badge-white"
                >
                </span>
                <a
                  v-for="group in state.groups.data"
                  :key="group.id"
                  @click="toggleGroup(group.id)"
                  :class="filters.group === group.id ? 'active' : ''"
                  class="cursor-pointer"
                >
                  <span class="badge badge-xs" :class="'badge-' + group.color"> </span>
                  {{ group.name }}
                  <span class="badge badge-light">
                    {{ group.count }}
                  </span>
                </a>
              </li>
            </ul>
            <h2 class="menu-title">Status</h2>
            <ul>
              <li>
                <span>
                  <SignalIcon class="w-4" />
                  In Touch</span
                >
              </li>
              <li>
                <span>
                  <SignalMediumIcon class="w-4" />
                  Losing Touch</span
                >
              </li>
              <li>
                <span>
                  <SignalZeroIcon class="w-4" />
                  Lost Touch</span
                >
              </li>
              <li>
                <span>
                  <EyeOffIcon class="w-4" />
                  Hidden
                </span>
              </li>
            </ul>
          </li>
        </ul>
        <button
          class="btn-warning btn-info btn-error btn-success btn-primary btn-neutral btn-white btn-secondary hidden"
        ></button>
        <RouterLink to="/contacts/new" class="btn btn-primary btn-wide my-3 md:mx-auto">
          <UserPlusIcon class="h-5 w-5" />
          <span class="m-2">Add a contact</span>
        </RouterLink>
      </div>
    </div>
    <div class="md:w-4/5">
      <ContactListComponent :contacts="filteredContacts" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from 'vue'
import { RepositoryFactory } from './../repositories/RepositoryFactory.js'
import { setTitle } from '../utils/Title'
import $bus from '../utils/Events'
import { UserPlusIcon } from 'lucide-vue-next'
import { StarIcon } from 'lucide-vue-next'
import { SignalIcon } from 'lucide-vue-next'
import { SignalMediumIcon } from 'lucide-vue-next'
import { EyeOffIcon } from 'lucide-vue-next'
import { SignalZeroIcon } from 'lucide-vue-next'
import ContactListComponent from '../components/ContactListComponent.vue'

const searchRef = ref(null)

onMounted(() => {
  setTitle('Contacts')
  fetchContacts()
  fetchGroups()
  searchRef.value.focus()
})

const ContactsRepository = RepositoryFactory.get('contacts')
const GroupsRepository = RepositoryFactory.get('groups')

const state = reactive({
  groups: {
    data: [],
    message: '',
    links: []
  },
  contacts: {
    data: [],
    message: '',
    links: []
  }
})

const filters = reactive({
  starred: false,
  group: null,
  searchQuery: null
})

const activeFilters = computed(() => {
  // Boolean to check if any filters are active
  return Object.values(filters).some((filter) => filter)
})

// Toggle starred filter
function toggleStarred() {
  filters.starred = !filters.starred
}

// Toggle group filter
function toggleGroup(groupId) {
  if (filters.group === groupId) {
    filters.group = null
    return
  }
  filters.group = groupId
}

// Clear all filters
function clearFilters() {
  filters.starred = false
  filters.group = null
  filters.searchQuery = null
}

// Computed property to filter contacts based on the search query
const filteredContacts = computed(() => {
  let contacts = state.contacts.data
  // Filter by starred
  if (filters.starred) {
    contacts = contacts.filter((contact) => contact.starred)
  }
  // Filter by group
  if (filters.group) {
    contacts = contacts.filter((contact) => contact.group.id === filters.group)
  }
  // Filter by search query
  if (filters.searchQuery) {
    contacts = contacts.filter((contact) => {
      return (
        contact.firstName.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        contact.nickname.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        contact.lastName.toLowerCase().includes(filters.searchQuery.toLowerCase())
      )
    })
  }
  // Update group counts
  state.groups.data.forEach((group) => {
    group.count = state.contacts.data.filter((contact) => contact.group.id === group.id).length
  })
  return contacts
})

// Fetch contacts and groups from the API
async function fetchContacts() {
  try {
    const res = await ContactsRepository.getAll()
    state.contacts = res.data
  } catch (err) {
    $bus.$emit('new-toast', {
      message: err.message,
      style: 'error'
    })
  }
}

async function fetchGroups() {
  try {
    const res = await GroupsRepository.get()
    state.groups = res.data
  } catch (err) {
    $bus.$emit('new-toast', {
      message: err.message,
      style: 'error'
    })
  }
}
</script>
