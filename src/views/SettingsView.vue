<template>
  <div class="md:w-3/5 mx-auto md:mt-10">
    <div class="divider">Settings</div>
    <div class="form-control">
      <label class="label cursor-pointer">
        <span class="label-text">Suggest reminders based on Journal entries </span>
        <input type="checkbox" checked="checked" class="toggle toggle-primary" />
      </label>
    </div>
    <div class="divider">Theme</div>
    <div class="grid md:grid-cols-3 gap-3">
      <button
        v-for="theme in themes"
        :key="theme"
        class="outline-base-content text-start outline-offset-4"
        :data-set-theme="theme"
        :data-act-class="theme"
      >
        <span
          :data-theme="theme"
          class="bg-base-100 rounded-btn text-base-content block w-full cursor-pointer font-sans"
          ><span class="grid grid-cols-5 grid-rows-3"
            ><span class="col-span-5 row-span-3 row-start-1 flex items-center gap-2 px-4 py-3"
              ><svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
                class="invisible h-3 w-3 shrink-0"
              >
                <path
                  d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"
                ></path>
              </svg>
              <span class="flex-grow text-sm">{{ theme }}</span>
              <span class="flex h-full shrink-0 flex-wrap gap-1"
                ><span class="bg-primary rounded-badge w-2"></span>
                <span class="bg-secondary rounded-badge w-2"></span>
                <span class="bg-accent rounded-badge w-2"></span>
                <span class="bg-neutral rounded-badge w-2"></span></span></span></span
        ></span>
      </button>
    </div>
    <div class="divider divider-accent">Password</div>
    <form>
      <div class="form-control">
        <label class="label">
          <span class="label-text">Current Password</span>
        </label>
        <input type="password" placeholder="Current Password" class="input input-bordered" />
      </div>
      <div class="form-control">
        <label class="label">
          <span class="label-text">New Password</span>
        </label>
        <input type="password" placeholder="New Password" class="input input-bordered" />
      </div>
      <div class="form-control">
        <label class="label">
          <span class="label-text">Confirm Password</span>
        </label>
        <input type="password" placeholder="Confirm Password" class="input input-bordered" />
      </div>
      <div class="form-control mt-6">
        <button class="btn btn-primary">Change Password</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { themeChange } from 'theme-change'
import { setTitle } from '../utils/Title'

const themes = [
  'light',
  'cupcake',
  'bumblebee',
  'emerald',
  'retro',
  'pastel',
  'fantasy',
  'cmyk',
  'autumn',
  'lemonade',
  'winter',
  'nord',
  'dark',
  'synthwave',
  'halloween',
  'forest',
  'luxury',
  'dracula',
  'business',
  'night',
  'coffee',
  'dim',
  'sunset'
]

onMounted(() => {
  setTitle('Settings')
  themeChange(false)
})
</script>
