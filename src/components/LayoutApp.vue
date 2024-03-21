<template>
  <TopBar />
  <main class="max-w-screen-xl m-auto mt-20 md:mt-24 p-3">
    <RouterView />
  </main>
  <ConfirmDeleteModal />
  <ToastAlerts />
</template>

<script setup>
import ConfirmDeleteModal from './ConfirmDeleteModal.vue'
import ToastAlerts from './ToastAlerts.vue'
import TopBar from './TopBar.vue'
</script>
