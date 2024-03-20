<template>
  <div class="toast-container fixed bottom-0 right-0 flex z-40">
    <transition-group tag="div" name="list">
      <div v-for="toast in toasts" :key="toast.id" class="toast pt-2 z-40">
        <div role="alert" class="alert" :class="'alert-' + toast.style">
          <CheckCircleIcon v-if="toast.style === 'success'" />
          <AlertTriangleIcon v-if="toast.style === 'warning'" />
          <XOctagonIcon v-if="toast.style === 'error'" />
          <InfoIcon v-if="toast.style === 'info'" />
          {{ toast.message }}
          <button class="btn btn-sm btn-circle btn-ghost" @click.prevent="removeToast(toast.id)">
            <div
              class="radial-progress"
              :style="`--value: ${toast.timer}; --size: 1.5em`"
              role="progressbar"
            >
              <span class="text-sm"> ✕ </span>
            </div>
          </button>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import $bus from '../utils/Events'
import { CheckCircleIcon } from 'lucide-vue-next'
import { AlertTriangleIcon } from 'lucide-vue-next'
import { XOctagonIcon } from 'lucide-vue-next'
import { InfoIcon } from 'lucide-vue-next'

// return ['success', 'error', 'warning', 'info'].includes(value)
const toasts = reactive([])

onMounted(() => {
  $bus.$on('new-toast', (data) => {
    const toast = {
      id: Date.now(),
      message: data.message || 'Testing',
      style: data.style || '',
      timeout: data.timeout || 10000,
      timer: ref(100)
    }
    // Validate style
    if (!['success', 'error', 'warning', 'info'].includes(toast.style)) {
      toast.style = ''
    }
    toasts.push(toast)

    const decrementValue = 100 / (toast.timeout / 100)
    const intervalId = setInterval(() => {
      toast.timer.value -= decrementValue
      if (toast.timer.value <= 0) {
        clearInterval(intervalId)
        const index = toasts.indexOf(toast)
        if (index !== -1) {
          toasts.splice(index, 1)
        }
      }
    }, 100)
  })
})

function removeToast(id) {
  const index = toasts.findIndex((toast) => toast.id === id)
  if (index !== -1) {
    toasts.splice(index, 1)
  }
}
</script>

<style scoped>
.list-move {
  transition: transform 0.5s;
}
.toast {
  position: relative;
}
.toast-container {
  flex-direction: column-reverse;
  align-items: flex-end;
}
</style>
