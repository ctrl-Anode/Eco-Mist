<template>
  <div class="bg-white rounded-lg p-4 shadow-md">
    <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      System Status
    </h3>

    <div class="space-y-3 text-sm text-gray-700">
      <div class="flex justify-between">
        <span>Last Login:</span>
        <span class="font-medium">{{ formatDate(lastLogin) }}</span>
      </div>
      <div class="flex justify-between">
        <span>Account Type:</span>
        <span class="font-medium capitalize">{{ role }}</span>
      </div>
      <div class="flex justify-between">
        <span>Status:</span>
        <span :class="status === 'active' ? 'text-green-600' : 'text-red-600'">{{ status }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  lastLogin: Date,
  role: String,
  status: String
});

const formatDate = (date) => {
  if (!date) return 'N/A';
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(date).toLocaleDateString('en-US', options);
};
</script>
