<template>
  <div class="p-6 max-w-4xl mx-auto">
    <h2 class="text-2xl font-semibold mb-4">Device Action Logs</h2>

    <div v-if="loading" class="text-gray-500">Loading logs...</div>
    <div v-else-if="Object.keys(logs).length === 0" class="text-gray-600">No logs found.</div>

    <div v-else>
      <div
        v-for="(entries, deviceId) in logs"
        :key="deviceId"
        class="border rounded p-4 mb-4 shadow"
      >
        <h3 class="font-semibold text-lg mb-2">Device ID: {{ deviceId }}</h3>
        <ul class="list-disc list-inside text-sm">
          <li v-for="(message, timestamp) in sortedLogs(entries)" :key="timestamp">
            <span class="font-mono text-gray-700">{{ formatTime(timestamp) }}:</span> {{ message }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { getDatabase, ref, onValue } from 'firebase/database';

export default {
  name: 'AdminDeviceLogs',
  data() {
    return {
      logs: {},
      loading: true
    };
  },
  methods: {
    formatTime(timestamp) {
      const date = new Date(Number(timestamp));
      return date.toLocaleString();
    },
    sortedLogs(logEntries) {
      return Object.fromEntries(
        Object.entries(logEntries).sort((a, b) => b[0] - a[0])
      );
    },
    fetchLogs() {
      const db = getDatabase();
      const logsRef = ref(db, 'logs');

      onValue(logsRef, (snapshot) => {
        this.logs = snapshot.val() || {};
        this.loading = false;
      });
    }
  },
  mounted() {
    this.fetchLogs();
  }
};
</script>

<style scoped>
ul {
  padding-left: 1rem;
  margin-top: 0.5rem;
}
</style>