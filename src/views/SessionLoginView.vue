<template>
  <div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <FlowerIcon class="mx-auto mt-10 h-12 w-auto" />
      <h2 class="mt-5 text-center text-2xl font-bold leading-9 tracking-tight">Sign in</h2>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <form class="space-y-6" @submit.prevent="processLogin">
        <div>
          <label class="form-control w-full" for="email">
            <div class="label">
              <span class="label-text">Email</span>
            </div>
            <input
              id="email"
              type="email"
              placeholder="me@primrose.com"
              class="input input-bordered w-full"
              v-model="email"
            />
          </label>
        </div>

        <div>
          <label class="form-control w-full" for="password">
            <div class="label">
              <span class="label-text">Password</span>
              <span class="label-text-alt">
                <a href="#" class="link font-bold">Forgot password?</a>
              </span>
            </div>
            <input
              id="password"
              type="password"
              class="input input-bordered w-full"
              v-model="password"
            />
          </label>
        </div>

        <div>
          <button type="submit" class="btn btn-neutral w-full">Sign in</button>
        </div>
      </form>

      <p class="mt-10 text-center text-sm">
        Don't have an account?
        <a href="#" class="link font-semibold">Sign up</a>
      </p>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { setTitle } from '../utils/Title'
import { RepositoryFactory } from './../repositories/RepositoryFactory.js'
import { auth } from '../auth/auth'
import { useRouter } from 'vue-router'
import $bus from '../utils/Events'
import { FlowerIcon } from 'lucide-vue-next'

const sessionsRepository = RepositoryFactory.get('sessions')
const router = useRouter()
let email = ''
let password = ''

onMounted(() => {
  setTitle('Login')
})

async function processLogin() {
  const payload = {
    email,
    password
  }

  try {
    const response = await sessionsRepository.login(payload)
    auth.login(response.data.data)
    router.push({ name: 'contacts' })
  } catch (err) {
    $bus.$emit('new-toast', {
      message: err.message,
      style: 'error'
    })
  }
}
</script>
