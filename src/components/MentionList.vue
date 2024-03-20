<template>
  <div class="items">
    <template v-if="items.length">
      <button
        class="item"
        :class="{ 'is-selected': index === selectedIndex }"
        v-for="(item, index) in items"
        :key="index"
        @click="selectItem(index)"
      >
        {{ item.label }}
      </button>
    </template>
    <div class="item" v-else>No result</div>
  </div>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      required: true
    },

    command: {
      type: Function,
      required: true
    }
  },

  data() {
    return {
      selectedIndex: 0
    }
  },

  watch: {
    items() {
      this.selectedIndex = 0
    }
  },

  methods: {
    onKeyDown({ event }) {
      if (event.key === 'ArrowUp') {
        this.upHandler()
        return true
      }

      if (event.key === 'ArrowDown') {
        this.downHandler()
        return true
      }

      if (event.key === 'Enter') {
        this.enterHandler()
        return true
      }

      return false
    },

    upHandler() {
      this.selectedIndex = (this.selectedIndex + this.items.length - 1) % this.items.length
    },

    downHandler() {
      this.selectedIndex = (this.selectedIndex + 1) % this.items.length
    },

    enterHandler() {
      this.selectItem(this.selectedIndex)
    },

    selectItem(index) {
      const item = this.items[index]

      if (item) {
        this.command({ id: item.id, label: item.label })
      }
    }
  }
}
</script>

<style>
.items {
  @apply relative p-1 rounded-lg bg-base-100 text-base-content overflow-hidden text-sm shadow;
}

.item {
  @apply block m-0 w-full text-left rounded-md border border-transparent py-1 px-2;
}

.item.is-selected {
  @apply block m-0 w-full text-left rounded-md border border-neutral py-1 px-2;
}

.mention {
  @apply rounded-sm bg-neutral-content text-neutral;
}
</style>
