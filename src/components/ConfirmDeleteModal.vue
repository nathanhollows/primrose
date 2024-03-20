<template>
  <dialog id="confirm-delete-modal" class="modal">
    <div class="modal-box ring-2 ring-error shadow-2xl">
      <h3 class="font-bold text-lg">{{ modalData.title }}</h3>
      <p class="py-4">{{ modalData.message }}</p>
      <div class="modal-action">
        <a href="#" class="btn btn-error" @click.prevent="confirm">{{ modalData.confirmText }}</a>
        <form method="dialog" class="flex gap-x-3">
          <button class="btn btn-neutral">{{ modalData.cancelText }}</button>
        </form>
      </div>
    </div>
    <form method="dialog" class="modal-backdrop bg-base-100 opacity-50">
      <button>Cancel</button>
    </form>
  </dialog>
</template>

<script setup>
import { onMounted, reactive } from 'vue'
import $bus from '../utils/Events'

const defaultModalData = {
  title: 'Confirm delete',
  message: 'Are you sure you want to delete this item?',
  confirmText: 'Confirm',
  cancelText: 'Cancel',
  emitOnConfirm: 'confirmed-delete-modal'
}
const modalData = reactive({
  title: 'Confirm delete',
  message: 'Are you sure you want to delete this item?',
  confirmText: 'Confirm',
  cancelText: 'Cancel',
  emitOnConfirm: 'confirmed-delete-modal'
})

function resetModal() {
  const modal = document.getElementById('confirm-delete-modal')
  modal.close()
  modalData.title = defaultModalData.title
  modalData.message = defaultModalData.message
  modalData.confirmText = defaultModalData.confirmText
  modalData.cancelText = defaultModalData.cancelText
  modalData.emitOnConfirm = defaultModalData.emitOnConfirm
}

function confirm() {
  $bus.$emit(modalData.emitOnConfirm)
  resetModal()
}

onMounted(() => {
  const modal = document.getElementById('confirm-delete-modal')
  modal.addEventListener('close', () => {
    resetModal()
  })

  $bus.$on('confirm-delete-modal', (data) => {
    const modal = document.getElementById('confirm-delete-modal')
    modalData.title = data.title || defaultModalData.title
    modalData.message = data.message || defaultModalData.message
    modalData.confirmText = data.confirmText || defaultModalData.confirmText
    modalData.cancelText = data.cancelText || defaultModalData.cancelText
    modalData.emitOnConfirm = data.emitOnConfirm || defaultModalData.emitOnConfirm
    modal.showModal()
  })
})
</script>
