<template>
  <ul class="timeline timeline-vertical">
    <li v-for="(interaction, index) in interactions" :key="interaction.id">
      <hr v-if="index != 0" />
      <div class="timeline-start">
        {{ formatDate(interaction.createdAt) }}
      </div>
      <div class="timeline-middle">
        <CheckCircle2Icon class="w-5 h-5" />
      </div>
      <div class="timeline-end timeline-box">{{ interaction.notes }}</div>
      <hr />
    </li>
  </ul>
</template>

<script setup>
import { CheckCircle2Icon } from 'lucide-vue-next'
import { defineProps } from 'vue'

const props = defineProps({
  interactions: {
    type: Array,
    required: true
  }
})

const interactions = props.interactions

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString()
}
</script>
