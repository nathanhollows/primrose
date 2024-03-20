<template>
  <div class="avatar placeholder">
    <div class="rounded-full" :class="[avatarClasses, avatarColor]">
      <span :class="textClasses">{{ initials }}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      required: true
    },
    size: {
      type: String,
      default: 'small',
      validator: (value) => ['small', 'medium', 'large', 'xlarge'].includes(value)
    },
    color: {
      type: String,
      default: 'blue'
    }
  },
  computed: {
    initials() {
      return this.name
        .split(' ')
        .map((word) => word[0])
        .join('')
    },
    avatarClasses() {
      return {
        small: 'w-8 h-8',
        medium: 'w-12 h-12',
        large: 'w-16 h-16',
        xlarge: 'w-24 h-24'
      }[this.size]
    },
    textClasses() {
      return {
        small: 'text-xs',
        medium: '',
        large: 'text-xl',
        xlarge: 'text-3xl'
      }[this.size]
    },
    avatarColor() {
      return {
        primary: 'bg-primary text-primary-content',
        secondary: 'bg-secondary text-secondary-content',
        accent: 'bg-accent text-accent-content',
        success: 'bg-success text-success-content',
        danger: 'bg-danger text-danger-content',
        warning: 'bg-warning text-warning-content',
        info: 'bg-info text-info-content',
        light: 'bg-light text-light-content',
        dark: 'bg-dark text-dark-content',
        white: 'bg-white text-gray-800',

        blue: 'bg-blue-500',
        red: 'bg-red-500',
        green: 'bg-green-500',
        yellow: 'bg-yellow-500',
        indigo: 'bg-indigo-500',
        purple: 'bg-purple-500',
        pink: 'bg-pink-500',
        gray: 'bg-gray-500',
        'light-blue': 'bg-light-blue-500',
        'light-green': 'bg-light-green-500',
        'light-pink': 'bg-light-pink-500',
        'light-red': 'bg-light-red-500',
        'light-yellow': 'bg-light-yellow-500',
        'light-indigo': 'bg-light-indigo-500',
        'light-purple': 'bg-light-purple-500',
        'light-gray': 'bg-light-gray-500',
        'dark-blue': 'bg-dark-blue-500',
        'dark-green': 'bg-dark-green-500',
        'dark-pink': 'bg-dark-pink-500',
        'dark-red': 'bg-dark-red-500',
        'dark-yellow': 'bg-dark-yellow-500',
        'dark-indigo': 'bg-dark-indigo-500',
        'dark-purple': 'bg-dark-purple-500',
        'dark-gray': 'bg-dark-gray-500'
      }[this.color]
    }
  }
}
</script>
