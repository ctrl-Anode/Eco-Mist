<template>
  <div
    v-if="toast.show"
    class="fixed bottom-4 right-4 px-4 py-3 rounded-lg shadow-lg z-50 flex items-center"
    :class="{
      'bg-green-100 text-green-800 border-l-4 border-green-500': toast.type === 'success',
      'bg-red-100 text-red-800 border-l-4 border-red-500': toast.type === 'error'
    }"
  >
    <svg
      v-if="toast.type === 'success'"
      class="h-5 w-5 mr-2"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
    </svg>
    <svg
      v-if="toast.type === 'error'"
      class="h-5 w-5 mr-2"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
    </svg>
    <span>{{ toast.message }}</span>
  </div>
</template>

<script setup>
const props = defineProps({
  toast: Object // { show: Boolean, message: String, type: 'success' | 'error' }
});
</script>
