<template>
  <div>
    <h1>Groups</h1>
    <table class="table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Default Frequency</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(group, index) in state.groups.data" :key="group.id">
          <td>
            <div class="dropdown dropdown-right">
              <div tabindex="0" role="button" class="btn btn-ghost btn-xs">
                <span class="badge" :class="computeBg(group.color)"></span>
              </div>
              <div tabindex="0" class="join dropdown-content shadow z-10 bg-base-300">
                <button
                  class="btn btn-ghost join-item"
                  v-for="(color, index) in colors"
                  :key="group.id + index"
                  :group="group.id"
                  :color="color"
                  @click.prevent="updateGroupColor(group, color)"
                >
                  <span class="badge" :class="computeBg(color)"></span>
                </button>
              </div>
            </div>
            <span>
              {{ group.name }}
            </span>
            <span class="ml-3 badge badge-secondary -mb-1" v-if="group.default">Default</span>
            <button
              v-if="!group.default"
              class="make-default btn btn-xs btn-secondary ml-3 invisible"
              @click.prevent="makeDefault(group, index)"
            >
              Make Default
            </button>
          </td>
          <td>
            <div class="dropdown dropdown-bottom dropdown-end">
              <div
                tabindex="0"
                role="button"
                class="flex gap-2 btn btn-sm m-1 tooltip text-neutral-content"
                data-tip="Reminder Frequency"
              >
                <TimerResetIcon class="h-5 w-5" />
                {{ group.frequency }}
              </div>
              <ul
                tabindex="0"
                class="dropdown-content z-[1] menu p-2 shadow-md bg-base-300 rounded-box w-52"
              >
                <li v-for="(frequency, index) in frequencies" :key="index">
                  <a
                    :class="group.frequency === frequency ? 'active' : ''"
                    @click.prevent="updateGroupFrequency(group, frequency)"
                    >{{ frequency }}</a
                  >
                </li>
                <div class="divider my-0 bg-transparent"></div>
                <li>
                  <a
                    :class="group.frequency === 'Disable' ? 'active' : ''"
                    @click.prevent="updateGroupFrequency(group, 'Disable')"
                    >Disable</a
                  >
                </li>
              </ul>
            </div>
          </td>
          <td class="flex gap-1">
            <div class="join">
              <button
                class="btn btn-sm btn-base join-item tooltip"
                data-tip="Move up"
                @click.prevent="updateGroupPosition('up', index)"
              >
                <ChevronUpIcon class="h-5 w-5" />
              </button>
              <button
                class="btn btn-sm btn-base join-item tooltip"
                data-tip="Move down"
                @click.prevent="updateGroupPosition('down', index)"
              >
                <ChevronDownIcon class="h-5 w-5" />
              </button>
            </div>
            <div class="join">
              <button class="btn btn-sm btn-accent join-item tooltip" data-tip="Edit">
                <PencilIcon class="h-5 w-5" />
              </button>
              <button class="btn btn-sm btn-accent join-item tooltip" data-tip="Delete">
                <Trash2Icon class="h-5 w-5" />
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { TimerResetIcon } from 'lucide-vue-next'
import { RepositoryFactory } from './../repositories/RepositoryFactory.js'
import { ChevronUpIcon } from 'lucide-vue-next'
import { ChevronDownIcon } from 'lucide-vue-next'
import { PencilIcon } from 'lucide-vue-next'
import { Trash2Icon } from 'lucide-vue-next'
import { setTitle } from '../utils/Title'

const GroupRepository = RepositoryFactory.get('groups')

const error = ref(null)
const state = reactive({
  groups: {
    data: [],
    message: '',
    links: []
  }
})
const frequencies = ['Daily', 'Weekly', 'Fortnightly', 'Monthly', 'Quarterly', 'Yearly']

onMounted(() => {
  setTitle('Groups')
  fetchGroups()
})

async function fetchGroups() {
  try {
    const res = await GroupRepository.get()
    state.groups = res.data
  } catch (err) {
    error.value = err
  }
}

const colors = ['primary', 'secondary', 'accent', 'success', 'warning', 'info', 'white']

function computeBg(color) {
  if (colors.includes(color)) {
    return `bg-${color}`
  }
  return color
}

async function updateGroupColor(group, color) {
  try {
    const res = await GroupRepository.patch(group.id, JSON.stringify({ color }))
    // Update the group in the state
    const index = state.groups.data.findIndex((g) => g.id === group.id)
    state.groups.data[index] = res.data
    state.groups.message = res.message
  } catch (err) {
    error.value = err
  }
}

async function updateGroupFrequency(group, frequency) {
  try {
    const res = await GroupRepository.patch(group.id, JSON.stringify({ frequency }))
    // Update the group in the state
    const index = state.groups.data.findIndex((g) => g.id === group.id)
    state.groups.data[index] = res.data.data
    state.groups.message = res.data.message
  } catch (err) {
    error.value = err
  }
}

async function updateGroupPosition(direction, index) {
  if (direction === 'up' && index === 0) {
    return
  }
  if (direction === 'down' && index === state.groups.data.length - 1) {
    return
  }
  let newIndex = direction === 'up' ? index - 1 : index + 1
  try {
    const res = await GroupRepository.patch(
      state.groups.data[index].id,
      JSON.stringify({ order: newIndex + 1 })
    )
    // Update the group in the state
    let tempGroup = state.groups.data[index]
    tempGroup.order = newIndex
    state.groups.data[index] = state.groups.data[newIndex]
    state.groups.data[newIndex] = tempGroup

    state.groups.message = res.data.message
  } catch (err) {
    error.value = err
  }
}

async function makeDefault(group, index) {
  try {
    const res = await GroupRepository.patch(group.id, JSON.stringify({ default: true }))
    for (group of state.groups.data) {
      group.default = false
    }
    // Update the group in the state
    state.groups.data[index] = res.data.data
    state.groups.message = res.data.message
  } catch (err) {
    error.value = err
  }
}
</script>

<style scoped>
tr:hover .make-default {
  @apply visible;
}
</style>
