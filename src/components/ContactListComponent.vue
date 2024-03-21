<template>
  <ul class="divide-y divide-base-300 overflow-hidden">
    <li v-for="contact in contacts" :key="contact.id" class="p-0 list-contact hover:rounded-md">
      <RouterLink
        :to="`/contacts/${contact.id}`"
        class="flex gap-3 p-3 hover:bg-base-300 rounded-md items-center"
      >
        <AvatarCircle
          :name="contact.firstName + ' ' + contact.lastName"
          size="small"
          :color="contact.group.color"
        />
        <span class="ml-3 text-base dark:text-gray-200"
          >{{ contact.firstName }} {{ contact.lastName }}
          <span v-if="contact.nickname" class="text-neutral-content text-sm"
            >({{ contact.nickname }})
          </span>
        </span>
        <BirthdayBadge v-if="contact.birthday" :date="contact.birthday" />

        <div class="flex-grow"></div>
        <span class="flex gap-3 list-actions items-center">
          <RouterLink
            :to="`/contacts/${contact.id}/edit`"
            class="text-neutral tooltip tooltip-left"
            data-tip="Edit"
          >
            <PencilIcon class="h-5 w-5" />
          </RouterLink>
          <RouterLink
            :to="`/contacts/${contact.id}/interaction`"
            class="text-neutral tooltip tooltip-left"
            data-tip="Log interaction"
          >
            <MessageSquarePlus />
          </RouterLink>
        </span>
      </RouterLink>
    </li>
  </ul>
</template>

<script setup>
import { MessageSquarePlus, PencilIcon } from 'lucide-vue-next'
import AvatarCircle from '../components/AvatarCircle.vue'
import BirthdayBadge from './BirthdayBadge.vue'

defineProps({
  contacts: {
    type: Array,
    required: true
  }
})
</script>

<style scoped>
.list-contact .list-actions svg {
  @apply md:invisible;
}
.list-contact:hover .list-actions svg {
  @apply md:visible;
}
</style>
