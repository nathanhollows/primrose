<template>
  <div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <img
        class="mx-auto h-10 w-auto"
        src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
        alt="Your Company"
      />
      <h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight">Sign in</h2>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <form class="space-y-6" action="#" method="POST">
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
            />
          </label>
        </div>

        <div>
          <label class="form-control w-full" for="password">
            <div class="label">
              <span class="label-text">Password</span>
              <span class="label-text-alt">
                <a href="#" class="font-semibold text-accent">Forgot password?</a>
              </span>
            </div>
            <input id="password" type="password" class="input input-bordered w-full" />
          </label>
        </div>

        <div>
          <button type="submit" class="btn btn-primary w-full">Sign in</button>
        </div>
      </form>

      <p class="mt-10 text-center text-sm">
        Don't have an account?
        <a href="#" class="font-semibold text-accent">Sign up</a>
      </p>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { setTitle } from '../utils/Title'

onMounted(() => {
  setTitle('Login')
})
</script>
