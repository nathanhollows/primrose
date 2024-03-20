<template>
  <div class="md:fixed flex flex-col gap-3">
    <ul class="menu bg-base-200 w-full rounded-box">
      <li>
        <h2 class="menu-title text-base-content">
          Filters
          <span
            class="badge badge-accent -mr-3 float-right cursor-pointer"
            v-if="activeFilters"
            @click="clearFilters"
          >
            Clear
          </span>
        </h2>
      </li>
      <div class="">
        <input
          type="text"
          id="search"
          class="input input-ghost"
          placeholder="Search..."
          ref="searchRef"
          v-model="filters.searchQuery"
          autofocus
        />
      </div>
      <li>
        <h2 class="menu-title">Starred</h2>
        <ul>
          <li>
            <span
              @click="toggleStarred"
              :class="filters.starred ? 'active' : ''"
              class="cursor-pointer"
            >
              <StarIcon class="w-4" />
              Starred
            </span>
          </li>
        </ul>
        <h2 class="menu-title">Groups</h2>
        <ul>
          <li>
            <span
              class="hidden badge-accent badge-neutral badge-primary badge-secondary badge-info badge-success badge-warning badge-error badge-white"
            >
            </span>
            <a
              v-for="group in state.groups.data"
              :key="group.id"
              @click="toggleGroup(group.id)"
              :class="filters.group === group.id ? 'active' : ''"
              class="cursor-pointer"
            >
              <span class="badge badge-xs" :class="'badge-' + group.color"> </span>
              {{ group.name }}
              <span class="badge badge-light">
                {{ group.count }}
              </span>
            </a>
          </li>
        </ul>
        <h2 class="menu-title">Status</h2>
        <ul>
          <li>
            <span>
              <SignalIcon class="w-4" />
              In Touch</span
            >
          </li>
          <li>
            <span>
              <SignalMediumIcon class="w-4" />
              Losing Touch</span
            >
          </li>
          <li>
            <span>
              <SignalZeroIcon class="w-4" />
              Lost Touch</span
            >
          </li>
          <li>
            <span>
              <EyeOffIcon class="w-4" />
              Hidden
            </span>
          </li>
        </ul>
      </li>
    </ul>
    <button
      class="btn-warning btn-info btn-error btn-success btn-primary btn-neutral btn-white btn-secondary hidden"
    ></button>
    <RouterLink to="/contacts/new" class="btn btn-primary btn-wide">
      <UserPlusIcon class="h-5 w-5" />
      <span class="ml-2">Add a contact</span>
    </RouterLink>
  </div>
</template>

<script setup>
defineEmits({
  clearFilters: null
})
</script>
