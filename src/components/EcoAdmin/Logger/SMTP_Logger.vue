<template>
  <div class="bg-white p-6 rounded-xl shadow border border-gray-200">
    <h2 class="text-xl font-semibold text-green-700 mb-4 flex items-center gap-2">
      <span>✉️</span> SMTP Log History
    </h2>

    <div class="mb-4 flex flex-col md:flex-row gap-4 md:items-center justify-between">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search email or action..."
        class="input w-full md:w-1/3"
      />

      <select v-model="filterAction" class="input w-full md:w-1/4">
        <option value="">All Actions</option>
        <option value="added_sender">Added Sender</option>
        <option value="deleted_sender">Deleted Sender</option>
        <option value="set_default">Set Default</option>
      </select>
    </div>

    <div class="overflow-x-auto">
      <table class="w-full text-sm text-left">
        <thead class="bg-gray-100">
          <tr>
            <th class="p-2">Action</th>
            <th class="p-2">Email</th>
            <th class="p-2">By</th>
            <th class="p-2">Timestamp</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="log in paginatedLogs" :key="log.id" class="border-t">
            <td class="p-2 font-medium text-green-700">{{ log.action }}</td>
            <td class="p-2">{{ log.email }}</td>
            <td class="p-2">{{ log.by }}</td>
            <td class="p-2">{{ formatDate(log.timestamp) }}</td>
          </tr>
          <tr v-if="filteredLogs.length === 0">
            <td colspan="4" class="text-center py-4 text-gray-500">No logs found.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="mt-4 flex justify-between items-center">
      <button
        @click="prevPage"
        :disabled="currentPage === 1"
        class="text-sm text-green-600 hover:underline disabled:opacity-50"
      >
        ⬅️ Prev
      </button>
      <p class="text-sm text-gray-600">Page {{ currentPage }} of {{ totalPages }}</p>
      <button
        @click="nextPage"
        :disabled="currentPage === totalPages"
        class="text-sm text-green-600 hover:underline disabled:opacity-50"
      >
        Next ➡️
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { db } from '../../../firebase'
import { getAuth } from 'firebase/auth'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'

const auth = getAuth()
const uid = auth.currentUser?.uid

const logs = ref([])
const searchQuery = ref('')
const filterAction = ref('')
const currentPage = ref(1)
const pageSize = 10

const fetchLogs = async () => {
  if (!uid) return
  const q = query(collection(db, 'smtp_logs', uid, 'logs'), orderBy('timestamp', 'desc'))
  const snapshot = await getDocs(q)
  logs.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}

const filteredLogs = computed(() => {
  return logs.value.filter(log => {
    const matchesQuery = log.email.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                         log.action.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesAction = !filterAction.value || log.action === filterAction.value
    return matchesQuery && matchesAction
  })
})

const totalPages = computed(() => Math.ceil(filteredLogs.value.length / pageSize))

const paginatedLogs = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredLogs.value.slice(start, start + pageSize)
})

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}

const formatDate = timestamp => {
  if (!timestamp?.toDate) return '-'
  return timestamp.toDate().toLocaleString()
}

onMounted(fetchLogs)
</script>

<style scoped>
.input {
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  outline: none;
  transition: 0.2s;
}
.input:focus {
  border-color: #10b981;
  box-shadow: 0 0 0 1px #10b981;
}
</style>
