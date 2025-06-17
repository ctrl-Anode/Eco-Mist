<template>
  <section class="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
    <div class="bg-emerald-100 border-b border-emerald-100 px-5 py-3">
      <h3 class="text-lg font-semibold text-gray-800 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
        Contact Information
      </h3>
    </div>
    <div class="p-5">
      <div class="space-y-5">
        <div class="bg-gray-50 rounded-md p-3">
          <p class="text-sm text-gray-500 mb-1">Email Address</p>
          <div class="flex items-center gap-2">
            <p class="font-medium text-gray-900">{{ email || 'Not provided' }}</p>
            <a
              v-if="email"
              :href="`mailto:${email}`"
              class="text-xs text-emerald-600 hover:text-emerald-700 transition-colors flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h2a2 2 0 002-2z" />
              </svg>
              Email
            </a>
          </div>
        </div>
        <div class="bg-gray-50 rounded-md p-3">
          <p class="text-sm text-gray-500 mb-1">Phone Number</p>
          <div class="flex items-center gap-2">
            <p class="font-medium text-gray-900">{{ cellphone || 'Not provided' }}</p>
            <a
              v-if="cellphone"
              :href="`tel:${cellphone}`"
              class="text-xs text-emerald-600 hover:text-emerald-700 transition-colors flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Call
            </a>
          </div>
        </div>
        <div class="bg-gray-50 rounded-md p-3">
          <p class="text-sm text-gray-500 mb-1">Address</p>
          <p class="font-medium text-gray-900">{{ address || 'Not provided' }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const props = defineProps({
  email: String,
  cellphone: String,
  address: String
});
</script>
