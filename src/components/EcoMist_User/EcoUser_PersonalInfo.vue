<template>
  <section class="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
    <div class="bg-emerald-100 border-b border-emerald-100 px-5 py-3">
      <h3 class="text-lg font-semibold text-gray-800 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        Personal Information
      </h3>
    </div>
    <div class="p-5">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div class="bg-gray-50 rounded-md p-3">
          <p class="text-sm text-gray-500 mb-1">Full Name</p>
          <p class="font-medium text-gray-900">{{ completeName || 'Not provided' }}</p>
        </div>
        <div class="bg-gray-50 rounded-md p-3">
          <p class="text-sm text-gray-500 mb-1">Age</p>
          <p class="font-medium text-gray-900">{{ age || 'Not provided' }}</p>
        </div>
        <div class="bg-gray-50 rounded-md p-3">
          <p class="text-sm text-gray-500 mb-1">Birthday</p>
          <p class="font-medium text-gray-900">{{ birthday || 'Not provided' }}</p>
        </div>
        <div class="bg-gray-50 rounded-md p-3">
          <p class="text-sm text-gray-500 mb-1">Gender</p>
          <p class="font-medium text-gray-900 capitalize">{{ gender || 'Not provided' }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const props = defineProps({
  completeName: String,
  age: [String, Number], // Allow both String and Number
  birthday: String,
  gender: String
});
</script>
