<template>
  <div class="chat chat-start" v-for="interaction in interactions" :key="interaction.id">
    <RouterLink :to="`/journal/${interaction.journal.date}`">
      <div class="chat-header">
        <time class="text-xs opacity-50">
          {{ formatDate(interaction.createdAt) }} · {{ formatTime(interaction.createdAt) }}
        </time>
      </div>

      <div class="chat-bubble">
        {{ interaction.notes }}
      </div>
    </RouterLink>

    <TrashIcon
      class="w-4 cursor-pointer text-error tooltip tooltip-top"
      data-tip="Delete"
      @click.prevent="confirmDeleteInteraction(interaction)"
    />
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import $bus from '../utils/Events'
import { TrashIcon } from 'lucide-vue-next'
import { RepositoryFactory } from '../repositories/RepositoryFactory'

onMounted(() => {
  $bus.$on('delete-interaction-confirmed', () => {
    deleteInteraction(interactionInPurgatory.value)
  })
})

const interactionRepository = RepositoryFactory.get('interactions')

const props = defineProps({
  interactions: {
    type: Array,
    required: true
  }
})

const interactions = props.interactions
const interactionInPurgatory = ref(null)

const formatDate = (dateString) => {
  // Format: 31 DEC 2020
  const date = new Date(dateString)
  const options = { day: '2-digit', month: 'short', year: 'numeric' }
  const formattedDate = date.toLocaleDateString('en-GB', options)
  return formattedDate
}

const formatTime = (dateString) => {
  // Format: 12:00 PM
  const date = new Date(dateString)
  const options = { hour: '2-digit', minute: '2-digit', hour12: true }
  const formattedTime = date.toLocaleTimeString('en-US', options)
  return formattedTime
}

function confirmDeleteInteraction(interaction) {
  interactionInPurgatory.value = interaction
  $bus.$emit('confirm-delete-modal', {
    title: 'Delete Interaction',
    message: 'Are you sure you want to delete this note?',
    confirmText: 'Delete',
    cancelText: 'Cancel',
    emitOnConfirm: 'delete-interaction-confirmed'
  })
}

async function deleteInteraction(interaction) {
  try {
    await interactionRepository.delete(interaction.id)
    const index = interactions.indexOf(interaction)
    interactions.splice(index, 1)
  } catch (err) {
    $bus.$emit('new-toast', {
      message: err.message,
      type: 'error'
    })
  }
}
</script>
