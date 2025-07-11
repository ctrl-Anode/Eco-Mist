<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-green-50 p-6">
    <div class="max-w-6xl mx-auto">
      <h1 class="text-2xl font-bold text-green-700 mb-6 flex items-center gap-2">
        📝 Admin Logs Dashboard
      </h1>

      <!-- Tabs -->
      <div class="flex gap-3 border-b border-gray-200 mb-4">
        <button
          v-for="tab in tabs"
          :key="tab.name"
          @click="activeTab = tab.name"
          :class="[
            'px-4 py-2 rounded-t-lg font-medium',
            activeTab === tab.name
              ? 'bg-white border border-b-0 border-green-300 text-green-700'
              : 'text-gray-600 hover:text-green-600'
          ]"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- Dynamic Content -->
      <div class="bg-white border border-gray-200 rounded-b-xl shadow p-4">
        <component :is="currentTabComponent" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// 👇 Import your logger components
import SMTP_Logger from '../Logger/SMTP_Logger.vue'
import Contact_Logger from '../Logger/Contact_Logger.vue'
import Auth_Logger from '../Logger/Auth_Logger.vue'
// 🔖 Define tab options
const tabs = [
  { name: 'smtp', label: 'SMTP Logs', component: SMTP_Logger },
  { name: 'contact', label: 'Contact Reply Logs', component: Contact_Logger },
  { name: 'auth', label: 'Authentication Logs', component: Auth_Logger }
]

const activeTab = ref('smtp')

// Dynamically load the correct logger component
const currentTabComponent = computed(() => {
  return tabs.find(tab => tab.name === activeTab.value)?.component || null
})
</script>

<style scoped>
button:focus {
  outline: none;
}
</style>
