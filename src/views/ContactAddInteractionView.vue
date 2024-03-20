<template>
  <div class="w-3/5 mx-auto mt-10">
    <h1 class="text-2xl font-semibold text-center my-10">
      Add interaction to {{ contact.firstName }} {{ contact.lastName }}
    </h1>

    <form @keydown.ctrl.enter.prevent="addInteraction" @submit.prevent="addInteraction">
      <input type="date" v-model="interaction.date" class="input input-bordered" />

      <label class="form-control">
        <div class="label">
          <span class="label-text">Notes</span>
        </div>
        <textarea
          v-model="interaction.notes"
          class="textarea textarea-bordered h-48"
          :placeholder="'Log an interaction with ' + contact.firstName"
          autofocus
        ></textarea>
      </label>

      <button class="btn btn-primary w-4/5 mx-auto block mt-5" type="submit">
        Add interaction
      </button>
    </form>
  </div>

  <ToastError :error="error" />
</template>

<script setup>
import ToastError from './../components/ToastError.vue'
import { reactive, ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { RepositoryFactory } from './../repositories/RepositoryFactory.js'
import { setTitle } from '../utils/Title'

const InteractionRepository = RepositoryFactory.get('interactions')
const ContactRepository = RepositoryFactory.get('contacts')
const $route = useRoute()
const $router = useRouter()
const error = ref(null)
const interaction = reactive({
  // date = local date in ISO format
  date: new Date().toISOString().substring(0, 10),
  notes: ''
})
const state = reactive({
  contact: {
    first_name: '',
    last_name: ''
  },
  message: '',
  links: []
})

const contact = computed(() => state.contact)

onMounted(() => {
  setTitle('Add interaction')
  fetchContact()
})

async function addInteraction() {
  try {
    await InteractionRepository.add($route.params.id, interaction)
    $router.push('/contacts/' + $route.params.id)
  } catch (err) {
    error.value = err
  }
}

async function fetchContact() {
  try {
    const res = await ContactRepository.get($route.params.id)
    state.links = res.data.links
    state.contact = res.data.data
    state.message = res.data.message
  } catch (err) {
    error.value = err
  }
}
</script>
