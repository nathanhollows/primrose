<template>
  <input
    type="text"
    class="input input-bordered"
    placeholder="Add a gift"
    v-model="gift.name"
    @keydown.enter.prevent="addGift(gift)"
  />
  <div class="" v-for="gift in gifts" :key="gift.id">
    <div class="">
      {{ gift.title }}
    </div>
  </div>

  <ul>
    <li v-for="gift in gifts" :key="gift.id" class="gift-item flex gap-3">
      {{ gift.name }}
      <a
        href="#"
        class="cursor-pointer text-error hidden tooltip tooltip-top"
        data-tip="Delete"
        @click.prevent="confirmDeleteGift(gift.id)"
      >
        <TrashIcon class="w-4" />
      </a>
    </li>
  </ul>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { RepositoryFactory } from '../repositories/RepositoryFactory'
import $bus from '../utils/Events'
import { TrashIcon } from 'lucide-vue-next'

onMounted(() => {
  $bus.$on('delete-gift-confirmed', () => {
    deleteGift(giftInPurgatory.value)
  })
})

const giftRepository = RepositoryFactory.get('gifts')

const gift = ref({
  name: ''
})

const props = defineProps({
  contactId: {
    type: String,
    required: true
  },
  gifts: {
    type: Array,
    required: true,
    default: () => []
  }
})
const gifts = Array.isArray(props.gifts) ? props.gifts : []
const giftInPurgatory = ref(null)

async function addGift(gift) {
  try {
    const res = await giftRepository.create(props.contactId, gift)
    gift.name = ''
    gifts.push(res.data.data)
  } catch (err) {
    $bus.$emit('new-toast', {
      message: err.message,
      style: 'error'
    })
  }
}

async function deleteGift(id) {
  try {
    await giftRepository.delete(id)
    giftInPurgatory.value = null
    gifts.splice(
      gifts.findIndex((gift) => gift.id === id),
      1
    )
  } catch (err) {
    $bus.$emit('new-toast', {
      message: err.message,
      style: 'error'
    })
  }
}

function confirmDeleteGift(id) {
  giftInPurgatory.value = id
  $bus.$emit('confirm-delete-modal', {
    title: 'Delete Gift',
    message: 'Are you sure you want to delete this gift?',
    confirmText: 'Delete',
    cancelText: 'Cancel',
    emitOnConfirm: 'delete-gift-confirmed'
  })
}
</script>

<style scoped>
.gift-item:hover a {
  display: inline-block;
}
</style>
