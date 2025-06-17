<template>
  <transition
    name="fade"
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="transform -translate-y-4 opacity-0"
    enter-to-class="transform translate-y-0 opacity-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="transform translate-y-0 opacity-100"
    leave-to-class="transform -translate-y-4 opacity-0"
  >
    <div
      v-if="alert.show"
      :class="`mb-6 p-4 rounded-lg flex items-start gap-3 ${
        alert.type === 'error'
          ? 'bg-red-100 text-red-800'
          : 'bg-green-100 text-green-800'
      }`"
    >
      <div class="flex-shrink-0 mt-0.5">
        <svg
          v-if="alert.type === 'error'"
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="text-red-500"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="15" x2="9" y1="9" y2="15" />
          <line x1="9" x2="15" y1="9" y2="15" />
        </svg>
        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="text-green-500"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      </div>
      <div class="flex-1">
        <h4 class="font-medium">{{ alert.title }}</h4>
        <p class="text-sm">{{ alert.message }}</p>
      </div>
      <button @click="$emit('close')" class="text-gray-500 hover:text-gray-700">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </svg>
      </button>
    </div>
  </transition>
</template>

<script setup>
const props = defineProps({
  alert: {
    type: Object,
    required: true,
    default: () => ({
      show: false,
      type: 'success',
      title: '',
      message: '',
    }),
  },
});
</script>
