<template>
  <div class="md:w-3/5 mx-auto md:mt-10">
    <h1 class="text-2xl font-semibold text-center mb-5 md:my-10">Journal</h1>

    <form @keydown.ctrl.enter.prevent="saveJournal" @submit.prevent="saveJournal">
      <div class="flex md:flex-row justify-between overflow-x-scroll flex-row-reverse w-100 py-3">
        <!-- A list of buttons with the previous weeks dates -->
        <button
          v-for="i in 7"
          :key="6 - i"
          class="btn btn-circle bt-ghost mr-3"
          :class="journal.date === todayMinus(7 - i) ? 'btn-primary' : ''"
          @click.prevent="journal.date = todayMinus(7 - i)"
        >
          <small>
            {{ dateSmall(todayMinus(7 - i)) }}
          </small>
        </button>
        <input
          type="date"
          v-model="journal.date"
          class="input input-bordered min-w-fit md:mr-0 mr-3"
        />
      </div>

      <JournalEditor
        :journal="JSON.stringify(journal.raw)"
        @update:modelValue="journal.raw = $event"
      />

      <div v-if="state.data.processed" class="">
        <CheckIcon class="w-4 h-4 inline-block mr-2" />Processed
      </div>
      <div v-if="state.data.processed === false" class="">
        <span class="loading loading-dots loading-sm"></span>
        Processing
      </div>

      <button
        class="btn btn-primary w-4/5 mx-auto block mt-5"
        type="submit"
        :disabled="!journal.updated"
      >
        Save
      </button>
    </form>
  </div>
</template>

<script setup>
import { watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { reactive, onMounted } from 'vue'
import { RepositoryFactory } from './../repositories/RepositoryFactory.js'
import { setTitle } from '../utils/Title'
import JournalEditor from '../components/JournalEditor.vue'
import $bus from '../utils/Events'
import { CheckIcon } from 'lucide-vue-next'
import Dates from '../utils/Dates'

const route = useRoute()
const router = useRouter()

const JournalRepository = RepositoryFactory.get('journals')

const state = reactive({
  messages: [],
  data: [],
  links: []
})

const journal = reactive({
  id: null,
  // date = local date in ISO format
  date: route.params.date || today(),
  raw: '',
  updated: false
})

onMounted(() => {
  setTitle('Journal')
})

function today() {
  return Dates.today()
}

function todayMinus(days) {
  const day = new Date(new Date().setDate(new Date().getDate() - days))
  return Dates.formatDateToLocalISO(day)
}

// Date in "Fri ##th" format
function dateSmall(date) {
  const day = new Date(date).toLocaleDateString('en-NZ', { weekday: 'short' })
  const dayNum = new Date(date).toLocaleDateString('en-NZ', { day: 'numeric' })
  return `${day} ${dayNum}`
}

watch(
  () => journal.date,
  async (newDate) => {
    // Update the URL with the new date
    await router.push({ name: 'journalDated', params: { date: newDate } })
    // Fetch the journal entry for the new date
    await fetchByDate(newDate)
  },
  { immediate: true }
)

watch(
  () => journal.raw,
  () => {
    if (JSON.stringify(state.data.raw) != JSON.stringify(journal.raw)) {
      journal.updated = true
    }
  }
)

async function saveJournal() {
  if (JSON.stringify(state.data.raw) === JSON.stringify(journal.raw)) {
    $bus.$emit('new-toast', {
      message: 'No changes made',
      style: 'info'
    })
    return
  }
  try {
    let payload = {
      date: journal.date,
      raw: journal.raw
    }
    if (state.data.date === undefined) {
      await JournalRepository.add(payload)
    } else {
      await JournalRepository.update(state.data.date, payload)
    }
    $bus.$emit('new-toast', {
      message: 'Saved successfully',
      style: 'success'
    })
  } catch (err) {
    $bus.$emit('new-toast', {
      message: err.message,
      style: 'error'
    })
  }
}

async function fetchByDate(date) {
  try {
    const response = await JournalRepository.get(date)
    journal.raw = response.data.data.raw

    state.messages = response.data.messages
    state.data = response.data.data
    state.links = response.data.links
  } catch (err) {
    if (err.response.status === 404) {
      journal.raw = ''
      state.data = []
      state.messages = []
      state.links = []
      return null
    }
    $bus.$emit('new-toast', {
      message: err.message,
      style: 'error'
    })
  }
}
</script>
