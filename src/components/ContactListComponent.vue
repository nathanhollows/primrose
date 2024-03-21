<template>
  <ul class="divide-y divide-base-300">
    <li v-for="contact in contacts" :key="contact.id" class="p-0 list-contact hover:rounded-md">
      <RouterLink
        :to="`/contacts/${contact.id}`"
        class="grid grid-cols-2 grid-flow-row p-3 hover:bg-base-300 rounded-md"
      >
        <div>
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
        </div>

        <span class="flex gap-3 list-actions">
          <BirthdayBadge v-if="contact.birthday" :date="contact.birthday" />
          <RouterLink
            :to="`/contacts/${contact.id}/edit`"
            class="text-neutral tooltip tooltip-top"
            data-tip="Edit"
          >
            <PencilIcon class="h-5 w-5" />
          </RouterLink>
          <RouterLink
            :to="`/contacts/${contact.id}/interaction`"
            class="text-neutral tooltip tooltip-top"
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
  visibility: hidden;
}
.list-contact:hover .list-actions svg {
  visibility: visible;
}
</style>
