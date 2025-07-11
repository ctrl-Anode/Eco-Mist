<template>
  <section class="p-6 max-w-7xl mx-auto">
    <h1 class="text-2xl font-bold text-[#283618] mb-6">Authentication Logs</h1>

    <!-- Filters -->
    <div class="flex flex-wrap gap-4 mb-4 items-center">
      <input
        v-model="search"
        type="text"
        placeholder="Search by email..."
        class="px-4 py-2 rounded border w-full sm:w-64 shadow-sm"
      />

      <select v-model="filterType" class="px-4 py-2 rounded border w-full sm:w-40 shadow-sm">
        <option value="">All Types</option>
        <option value="login">Login</option>
        <option value="register">Register</option>
      </select>

      <select v-model="filterStatus" class="px-4 py-2 rounded border w-full sm:w-40 shadow-sm">
        <option value="">All Statuses</option>
        <option value="success">Success</option>
        <option value="failed">Failed</option>
      </select>
    </div>

    <!-- Table -->
    <div v-if="loading" class="text-center py-10 text-gray-500">Loading logs...</div>
    <div v-else-if="filteredLogs.length === 0" class="text-center py-10 text-gray-400">No logs found.</div>

    <div v-else class="overflow-auto rounded-lg border border-gray-200 shadow-md">
      <table class="min-w-full bg-white text-sm">
        <thead class="bg-green-100 text-green-800 font-semibold">
          <tr>
            <th class="py-2 px-4">Type</th>
            <th class="py-2 px-4">Status</th>
            <th class="py-2 px-4">Email</th>
            <th class="py-2 px-4">UID</th>
            <th class="py-2 px-4">Reason</th>
            <th class="py-2 px-4">Time</th>
            <th class="py-2 px-4">User Agent</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="log in paginatedLogs"
            :key="log.id"
            class="border-t hover:bg-gray-50"
          >
            <td class="px-4 py-2 capitalize">{{ log.type }}</td>
            <td :class="[
              'px-4 py-2 font-semibold',
              log.status === 'success' ? 'text-green-600' : 'text-red-600'
            ]">{{ log.status }}</td>
            <td class="px-4 py-2">{{ log.email }}</td>
            <td class="px-4 py-2">{{ log.uid || '-' }}</td>
            <td class="px-4 py-2">{{ log.reason || '-' }}</td>
            <td class="px-4 py-2">{{ formatTimestamp(log.timestamp) }}</td>
            <td class="px-4 py-2 truncate max-w-xs">{{ log.userAgent }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="mt-4 flex justify-center gap-2">
      <button
        v-for="page in totalPages"
        :key="page"
        @click="currentPage = page"
        :class="[
          'px-3 py-1 rounded border text-sm',
          page === currentPage ? 'bg-green-600 text-white' : 'bg-white text-gray-700 border-gray-300'
        ]"
      >
        {{ page }}
      </button>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../../../firebase';

const logs = ref([]);
const loading = ref(true);

// Filters
const search = ref('');
const filterType = ref('');
const filterStatus = ref('');

// Pagination
const currentPage = ref(1);
const itemsPerPage = 10;

const fetchLogs = async () => {
  try {
    const q = query(collection(db, 'auth_logs'), orderBy('timestamp', 'desc'));
    const snapshot = await getDocs(q);
    logs.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching logs:', error);
  } finally {
    loading.value = false;
  }
};

const formatTimestamp = (timestamp) => {
  if (!timestamp) return '-';
  const date = timestamp.toDate();
  return date.toLocaleString();
};

const filteredLogs = computed(() => {
  return logs.value.filter(log => {
    const matchesEmail = log.email.toLowerCase().includes(search.value.toLowerCase());
    const matchesType = !filterType.value || log.type === filterType.value;
    const matchesStatus = !filterStatus.value || log.status === filterStatus.value;
    return matchesEmail && matchesType && matchesStatus;
  });
});

const totalPages = computed(() => {
  return Math.ceil(filteredLogs.value.length / itemsPerPage);
});

const paginatedLogs = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredLogs.value.slice(start, start + itemsPerPage);
});

onMounted(fetchLogs);
</script>
