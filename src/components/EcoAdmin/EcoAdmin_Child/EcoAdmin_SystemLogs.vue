<template>
  <div class="admin-dashboard">
    <h2 class="text-xl font-bold mb-4">Device Management</h2>

    <section v-if="loading" class="text-gray-500">Loading devices...</section>

    <section v-else>
      <div
        v-for="(device, id) in devices"
        :key="id"
        class="border p-4 rounded mb-4 bg-white shadow"
      >
        <div class="flex justify-between items-start gap-6">
          <!-- 📟 Device Info -->
          <div>
            <h3 class="font-semibold text-lg">{{ device.devicename || `Device-${id}` }}</h3>
            <p><strong>ID:</strong> {{ id }}</p>
            <p><strong>Status:</strong> {{ device.status }}</p>
            <p><strong>IP:</strong> {{ device.state?.ip_address || 'N/A' }}</p>
            <p><strong>SSID:</strong> {{ device.state?.connected_ssid || 'N/A' }}</p>
            <p><strong>Registered:</strong> {{ device.registered ? '✅' : '❌' }}</p>
            <p><strong>Owner:</strong> {{ device.owner }}</p>
            <p><strong>Last Online:</strong> {{ device.last_online || 'N/A' }}</p>
            <p>
              <strong>Simulated:</strong>
              <span
                :class="device.state?.simulated_readings_enabled ? 'text-green-600' : 'text-gray-500'"
              >
                {{ device.state?.simulated_readings_enabled ? '🧪 Enabled' : 'Disabled' }}
              </span>
            </p>
          </div>

          <!-- 🔧 Admin Actions -->
          <div class="flex flex-col gap-2">
            <button
              @click="triggerReconnect(id)"
              class="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
            >
              🔄 Trigger Reconnect
            </button>

            <button
              @click="clearCredentials(id)"
              class="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
            >
              🧹 Clear Credentials
            </button>

            <button
              @click="deleteDevice(id)"
              class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              🗑️ Delete Device
            </button>

            <button
              @click="toggleSimulation(id, device.state?.simulated_readings_enabled)"
              :class="[
                device.state?.simulated_readings_enabled ? 'bg-green-600' : 'bg-gray-500',
                'text-white px-3 py-1 rounded hover:opacity-90'
              ]"
            >
              {{ device.state?.simulated_readings_enabled
                ? '🧪 Disable'
                : '🧪 Enable' }}
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { getDatabase, ref, onValue, set, remove } from "firebase/database";

export default {
  name: "AdminDeviceManager",
  data() {
    return {
      devices: {},
      loading: true,
    };
  },
  mounted() {
    const db = getDatabase();
    const devicesRef = ref(db, "devices");

    onValue(devicesRef, (snapshot) => {
      this.devices = snapshot.val() || {};
      this.loading = false;
    });
  },
  methods: {
    async triggerReconnect(id) {
      const db = getDatabase();
      await set(ref(db, `devices/${id}/state/reconnect`), true);
      alert(`🔄 Reconnect signal sent to device ${id}`);
    },

    async clearCredentials(id) {
      const db = getDatabase();
      await set(ref(db, `devices/${id}/credentials/email`), "");
      await set(ref(db, `devices/${id}/credentials/password`), "");
      alert(`🧹 Credentials cleared for ${id}`);
    },

    async deleteDevice(id) {
      const db = getDatabase();
      if (confirm(`Are you sure you want to delete device ${id}?`)) {
        await remove(ref(db, `devices/${id}`));
        alert(`🗑️ Device ${id} deleted.`);
      }
    },

    async toggleSimulation(id, currentState) {
      const db = getDatabase();
      const newState = !currentState;
      await set(ref(db, `devices/${id}/state/simulated_readings_enabled`), newState);
      alert(`🧪 Simulated readings ${newState ? 'enabled' : 'disabled'} for ${id}`);
    },
  },
};
</script>

<style scoped>
.admin-dashboard {
  max-width: 900px;
  margin: auto;
  padding: 1rem;
}
</style>
