<template>
  <aside
    id="side-bar"
    class="flex flex-col z-20 w-80 min-h-screen max-h-screen bg-base-100 border-r border-base-300 p-5 absolute md:relative inset-y-0 transition duration-200 ease-in-out"
    :class="sidebarVisible"
  >
    <div class="flex items-center space-x-2 p-2">
      <Flower size="1.5em" />
      <span class="text-2xl">Primrose</span>
    </div>
    <nav class="pt-6 mb-auto">
      <SideBarLink to="/search"> <SearchIcon /> Search </SideBarLink>
      <SideBarLink to="/"> <HomeIcon /> Dashboard </SideBarLink>
      <SideBarLink to="/contacts"> <UsersIcon /> Contacts </SideBarLink>
      <SideBarLink to="/reminders"> <BellIcon /> Reminders </SideBarLink>
      <SideBarLink to="/groups"> <ComponentIcon /> Groups </SideBarLink>
    </nav>
    <!-- Add contact and settings button at the bottom of the sidebar. The add contact button is styled similarly to the button above. The settings button is an icon only which floats to the right -->
    <div class="flex flex-row items-center justify-center mt-auto border-t border-base-300 pt-3">
      <RouterLink
        to="/contacts/new"
        class="flex items-center gap-x-2 px-4 py-2 text-base font-normal rounded-lg cursor-pointer hover:bg-base-200"
      >
        <UserPlusIcon />
        Add Contact
      </RouterLink>
      <RouterLink
        to="/settings"
        class="flex items-center gap-x-2 px-4 py-2 text-base font-normal rounded-lg cursor-pointer hover:bg-base-200"
      >
        <SettingsIcon />
      </RouterLink>
    </div>
  </aside>
</template>

<script setup>
import { BellIcon } from 'lucide-vue-next'
import { ComponentIcon } from 'lucide-vue-next'
import {
  SearchIcon,
  UsersIcon,
  HomeIcon,
  Flower,
  SettingsIcon,
  UserPlusIcon
} from 'lucide-vue-next'
import { inject, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import SideBarLink from './SideBarLink.vue'

const sidebarVisible = ref('-translate-x-0')
const toggleSidebar = () => {
  sidebarVisible.value =
    sidebarVisible.value === 'translate-x-0' ? '-translate-x-full' : 'translate-x-0'
}

const $bus = inject('$bus')

onMounted(() => {
  $bus.$on('toggleSideBar', toggleSidebar)
})
</script>

<style scoped>
.router-link-active li {
  @apply flex items-center gap-x-6 p-3 text-base font-normal rounded-lg cursor-pointer dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700
                        mt-2 bg-gray-200 dark:bg-gray-700;
}
</style>
