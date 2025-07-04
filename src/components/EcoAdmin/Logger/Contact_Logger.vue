<template>
  <div class="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
    <h2 class="text-xl font-semibold mb-4 text-green-700 flex items-center gap-2">
      <span>📋</span> Contact Reply Logs
    </h2>

    <!-- Search & Filter -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <input
        v-model="search"
        type="text"
        placeholder="Search recipient or subject..."
        class="input"
      />
      <select v-model="selectedAction" class="input w-full sm:w-52">
        <option value="">All Actions</option>
        <option value="replied">Replied</option>
      </select>
    </div>

    <!-- Table -->
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead>
          <tr class="bg-gray-50">
            <th class="px-4 py-2 text-left text-sm font-medium text-gray-500">Recipient</th>
            <th class="px-4 py-2 text-left text-sm font-medium text-gray-500">Subject</th>
            <th class="px-4 py-2 text-left text-sm font-medium text-gray-500">Action</th>
            <th class="px-4 py-2 text-left text-sm font-medium text-gray-500">By</th>
            <th class="px-4 py-2 text-left text-sm font-medium text-gray-500">Timestamp</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-100">
          <tr v-for="log in paginatedLogs" :key="log.id" class="hover:bg-gray-50">
            <td class="px-4 py-2 text-sm text-gray-700">{{ log.recipient }}</td>
            <td class="px-4 py-2 text-sm text-gray-700">{{ log.subject }}</td>
            <td class="px-4 py-2 text-sm text-green-600 capitalize">{{ log.action }}</td>
            <td class="px-4 py-2 text-sm text-gray-600">{{ log.by }}</td>
            <td class="px-4 py-2 text-sm text-gray-500">{{ formatTimestamp(log.timestamp) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="flex items-center justify-between mt-4 text-sm text-gray-600">
      <p>
        Showing {{ (currentPage - 1) * perPage + 1 }} -
        {{ Math.min(currentPage * perPage, filteredLogs.length) }} of
        {{ filteredLogs.length }} logs
      </p>
      <div class="flex gap-2">
        <button @click="currentPage--" :disabled="currentPage === 1" class="btn">Previous</button>
        <span class="px-3 py-1 bg-green-100 text-green-700 rounded font-medium">{{ currentPage }}</span>
        <button @click="currentPage++" :disabled="currentPage === totalPages" class="btn">Next</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { collection, getDocs, orderBy, query } from 'firebase/firestore'
import { db } from '../../../firebase'

const logs = ref([])
const search = ref('')
const selectedAction = ref('')
const currentPage = ref(1)
const perPage = 10

const fetchLogs = async () => {
  const q = query(collection(db, 'contact_logs'), orderBy('timestamp', 'desc'))
  const snap = await getDocs(q)
  logs.value = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}

onMounted(() => {
  fetchLogs()
})

const filteredLogs = computed(() => {
  return logs.value.filter(log => {
    const matchesSearch =
      log.recipient?.toLowerCase().includes(search.value.toLowerCase()) ||
      log.subject?.toLowerCase().includes(search.value.toLowerCase())
    const matchesAction = selectedAction.value ? log.action === selectedAction.value : true
    return matchesSearch && matchesAction
  })
})

const totalPages = computed(() => Math.ceil(filteredLogs.value.length / perPage))

const paginatedLogs = computed(() => {
  const start = (currentPage.value - 1) * perPage
  const end = start + perPage
  return filteredLogs.value.slice(start, end)
})

const formatTimestamp = (timestamp) => {
  if (!timestamp) return 'N/A'
  const date = new Date(timestamp.seconds * 1000)
  return date.toLocaleString()
}
</script>

<style scoped>

</style>
