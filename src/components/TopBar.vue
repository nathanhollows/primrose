<template>
  <div class="bg-base-200 border-b border-base-300 fixed top-0 w-full z-40">
    <div class="w-full max-w-screen-xl m-auto navbar">
      <div class="navbar-start">
        <div class="dropdown">
          <div tabindex="0" role="button" class="btn btn-ghost btn-circle lg:hidden">
            <MenuIcon />
          </div>
          <ul
            tabindex="0"
            class="menu menu-sm gap-3 dropdown-content mt-3 z-30 p-2 shadow bg-base-200 rounded-box w-52"
          >
            <TopBarLink to="/"> <HomeIcon /> Dashboard </TopBarLink>
            <TopBarLink to="/contacts"> <UsersIcon /> Contacts </TopBarLink>
            <TopBarLink to="/groups"><ComponentIcon /> Groups </TopBarLink>
          </ul>
        </div>
        <RouterLink class="btn btn-ghost text-xl" to="/" active-class="btn-active">
          <FlowerIcon />
          Primrose
        </RouterLink>
      </div>
      <div class="navbar-center hidden md:flex">
        <ul class="menu menu-horizontal px-1 gap-2">
          <TopBarLink to="/contacts"> <UsersIcon /> Contacts </TopBarLink>
          <TopBarLink to="/journal" class="icon-swap" :class="{ 'journal-saved': journalSaved }">
            <BookOpenIcon width="20px" class="inactive" />
            <BookOpenTextIcon width="20px" class="active" />
            Journal
          </TopBarLink>
          <TopBarLink to="/reminders">
            <div class="indicator">
              <BellIcon width="20px" />
              <span v-if="hasReminders" class="badge badge-xs badge-accent indicator-item"></span>
            </div>
            Reminders
          </TopBarLink>
        </ul>
      </div>
      <div class="navbar-end md:gap-1">
        <RouterLink
          to="/groups"
          class="btn btn-ghost btn-circle tooltip tooltip-bottom flex items-center"
          active-class="btn-active"
          data-tip="Groups"
          ><ComponentIcon width="20px"
        /></RouterLink>
        <RouterLink
          to="/settings"
          class="btn btn-ghost btn-circle tooltip tooltip-bottom flex items-center"
          active-class="btn-active"
          data-tip="Settings"
        >
          <SettingsIcon width="20px" />
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import TopBarLink from './TopBarLink.vue'
import { BellIcon } from 'lucide-vue-next'
import { HomeIcon } from 'lucide-vue-next'
import { FlowerIcon } from 'lucide-vue-next'
import { BookOpenTextIcon } from 'lucide-vue-next'
import { BookOpenIcon } from 'lucide-vue-next'
import { UsersIcon } from 'lucide-vue-next'
import { MenuIcon } from 'lucide-vue-next'
import { ComponentIcon } from 'lucide-vue-next'
import { SettingsIcon } from 'lucide-vue-next'
import $bus from '../utils/Events'
import { ref, onMounted } from 'vue'
import { RepositoryFactory } from './../repositories/RepositoryFactory.js'
import Dates from './../utils/Dates'
import { RouterLink } from 'vue-router'

const journalSaved = ref(false)
const hasReminders = ref(false)

const JournalRepository = RepositoryFactory.get('journals')
const ReminderRepository = RepositoryFactory.get('reminders')

onMounted(() => {
  $bus.$on('curent-journal-saved', (data) => {
    console.log(data)
  })
  fetchJournal()
  fetchReminders()
  $bus.$on('saved-journal', (data) => {
    if (data) {
      journalSaved.value = true
    } else {
      journalSaved.value = false
    }
  })
  $bus.$on('completed-todays-reminders', () => {
    hasReminders.value = true
  })
})

async function fetchJournal() {
  const date = Dates.today()
  try {
    await JournalRepository.get(date)
    journalSaved.value = true
    console.log('journal saved')
  } catch (err) {
    console.log('journal not saved')
    if (err.response.status != 404) {
      $bus.$emit('new-toast', {
        message: err.message,
        style: 'error'
      })
    }
  }
}

async function fetchReminders() {
  try {
    const reminders = await ReminderRepository.get()
    const todayReminders = reminders.data.data.filter((reminder) => {
      return reminder.reminderDate === Dates.today()
    })
    hasReminders.value = todayReminders.length > 0
  } catch (err) {
    $bus.$emit('new-toast', {
      message: err.message,
      style: 'error'
    })
  }
}
</script>

<style scoped>
.icon-swap.journal-saved svg.active {
  display: block;
}
.icon-swap.journal-saved svg.inactive {
  display: none;
}
.icon-swap svg.active {
  display: none;
}
.icon-swap svg.inactive {
  display: block;
}
</style>
