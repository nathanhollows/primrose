<template>
  <h1 class="text-xl">Search</h1>
  <input
    type="text"
    id="search"
    class="input input-primary input-bordered"
    placeholder="Search"
    v-model="searchQuery"
    autofocus
  />
  <ul>
    <li v-for="result in state.results" :key="result.id">
      <RouterLink :to="`/contacts/${result.id}`">
        {{ result.firstName }} {{ result.lastName }}
      </RouterLink>
    </li>
  </ul>
</template>

<script setup>
import { onMounted, reactive } from 'vue'
import { setTitle } from '../utils/Title'

const state = reactive({
  searchQuery: '',
  results: []
})

onMounted(() => {
  setTitle('Dashboard')
})
</script>
