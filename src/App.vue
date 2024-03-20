<script setup>
import { onMounted } from 'vue'
import { RouterView, useRouter } from 'vue-router'
import LayoutApp from './components/LayoutApp.vue'
import LayoutSession from './components/LayoutSession.vue'
import { themeChange } from 'theme-change'
import $bus from './utils/Events'

const router = useRouter()

onMounted(() => {
  themeChange(false)
  $bus.$on('session-expired', () => {
    router.push('/login')
    console.log('Session expired')
  })
})
</script>

<template>
  <LayoutSession v-if="$route.meta.layout === 'session'">
    <RouterView />
  </LayoutSession>
  <LayoutApp v-else>
    <RouterView />
  </LayoutApp>
</template>
