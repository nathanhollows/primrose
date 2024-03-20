<template>
  <div class="prose">
    <h1>Add a contact</h1>
  </div>
  <div class="container mx-auto p-4">
    <form
      @submit.prevent="addContact"
      class="bg-base-200 dark:bg-gray-800 rounded px-8 pt-6 pb-8 mb-4"
    >
      <div class="mb-4">
        <label for="firstName" class="form-control">
          <span class="label"> First name </span>
          <input
            type="text"
            id="firstName"
            v-model="contact.firstName"
            required
            class="input input-bordered"
          />
        </label>
      </div>

      <div class="mb-4">
        <label for="lastName" class="form-control">
          <span class="label"> Last name </span>
          <input
            type="text"
            id="lastName"
            v-model="contact.lastName"
            required
            class="input input-bordered"
          />
        </label>
      </div>

      <div class="mb-6">
        <label for="group" class="">
          <span class="label"> Group </span>

          <div class="form-control" v-for="group in groups.data" :key="group.id">
            <label :for="'group-' + group.id" class="label cursor-pointer mb-3 justify-start">
              <input
                type="radio"
                :id="'group-' + group.id"
                class="custom-radio"
                :class="['bg-' + group.color, ':checked:bg-' + group.color]"
                v-model="contact.groupId"
                :value="group.id"
              />
              <span class="label-text ml-3">
                {{ group.name }} {{ group.default ? '(default)' : '' }}
              </span>
            </label>
          </div>
        </label>
      </div>

      <div class="flex items-center justify-between">
        <button type="submit" class="btn btn-primary btn-wide">Add Contact</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { RepositoryFactory } from '../repositories/RepositoryFactory'
import { setTitle } from '../utils/Title'
import $bus from '../utils/Events'

const ContactRepository = RepositoryFactory.get('contacts')
const GroupRepository = RepositoryFactory.get('groups')

const contact = ref({
  firstName: '',
  lastName: '',
  groupId: ''
})

const groups = ref([])

onMounted(() => {
  setTitle('Add contact')
  fetchGroups()
})

const addContact = async () => {
  try {
    const res = await ContactRepository.add(contact.value)
    contact.value = {
      firstName: '',
      lastName: ''
    }
    const defaultGroup = groups.value.data.find((group) => group.default)
    contact.value.groupId = defaultGroup.id
    $bus.$emit('new-toast', {
      message: 'Contact added successfully',
      button: 'View contact',
      buttonLink: `/contacts/${res.data.data.id}`,
      style: 'success'
    })
  } catch (err) {
    $bus.$emit('new-toast', {
      message: err.message,
      style: 'error'
    })
  }
}

const fetchGroups = async () => {
  try {
    const res = await GroupRepository.get()
    groups.value = res.data
    if (groups.value.data.length > 0) {
      // Automatically select the first group or the one marked as default
      const defaultGroup = groups.value.data.find((group) => group.default)
      contact.value.groupId = defaultGroup.id
    }
  } catch (err) {
    $bus.$emit('new-toast', {
      message: err.message,
      style: 'error'
    })
  }
}
</script>

<style scoped>
.custom-radio {
  flex-shrink: 0;
  --chkbg: var(--bc);
  height: 1.5rem /* 24px */;
  width: 1.5rem /* 24px */;
  cursor: pointer;
  appearance: none;
  border-radius: 9999px;
  border-width: 1px;
  border-color: var(--fallback-bc, oklch(var(--bc) / var(--tw-border-opacity)));
  --tw-border-opacity: 0.2;
}
.custom-radio:focus {
  box-shadow: none;
}
.custom-radio:focus-visible {
  outline-style: solid;
  outline-width: 2px;
  outline-offset: 2px;
  outline-color: var(--fallback-bc, oklch(var(--bc) / 1));
}
.custom-radio:checked,
.custom-radio[aria-checked='true'] {
  --tw-bg-opacity: 1;
  background-image: none;
  animation: radiomark var(--animation-input, 0.2s) ease-out;
  box-shadow:
    0 0 0 4px var(--fallback-b1, oklch(var(--b1) / 1)) inset,
    0 0 0 4px var(--fallback-b1, oklch(var(--b1) / 1)) inset;
}
.custom-radio:checked,
.custom-radio[aria-checked='true'] {
  --tw-bg-opacity: 1;
  background-image: none;
  animation: radiomark var(--animation-input, 0.2s) ease-out;
  box-shadow:
    0 0 0 4px var(--fallback-b1, oklch(var(--b1) / 1)) inset,
    0 0 0 4px var(--fallback-b1, oklch(var(--b1) / 1)) inset;
}
.custom-radio:disabled {
  cursor: not-allowed;
  opacity: 0.2;
}
</style>
