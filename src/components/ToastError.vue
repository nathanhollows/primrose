<template>
  <div class="toast-container z-30">
    <div v-for="(toast, index) in toasts" :key="index" class="toast">
      <div role="alert" class="alert" :class="'alert-' + toast.style">
        <AlertCircleIcon />
        <span>{{ toast.message }}</span>
        <button class="btn btn-sm btn-circle btn-ghost" @click.prevent="removeToast(index)">
          ✕
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.toast {
  position: relative;
}
.toast-container {
  position: fixed;
  bottom: 0;
  right: 0;
  display: flex;
  flex-direction: column-reverse;
  align-items: flex-end;
}
</style>

<script setup>
import { defineProps, ref, watch } from 'vue'
import { AlertCircleIcon } from 'lucide-vue-next'

const props = defineProps({
  toasts: {
    type: Array,
    default: () => []
  }
})

const toasts = ref(props.toasts)

watch(
  () => props.toasts,
  (newToasts) => {
    newToasts.forEach((toast) => {
      if (!toast.timeout) {
        toast.timeout = 5000
      }

      setTimeout(() => {
        removeToast(toasts.value.indexOf(toast))
      }, toast.timeout)
    })
  }
)

const removeToast = (index) => {
  if (index !== -1) {
    toasts.value.splice(index, 1)
  }
}
</script>
