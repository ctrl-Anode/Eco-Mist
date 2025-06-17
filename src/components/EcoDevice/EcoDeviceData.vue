<template>
  <div class="p-4 max-w-7xl mx-auto">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      
      <!-- ✅ Live Sensor Data (MOBILE FIRST: order-1) -->
      <div class="order-1 bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold mb-4">🧪 Live Sensor Data</h2>
        <div v-if="loadingSensors" class="text-gray-500">Loading sensor readings...</div>
        <div v-else class="grid grid-cols-2 gap-4">
          <div
            v-for="(value, key) in sensorReadings"
            :key="key"
            class="p-4 bg-gray-50 rounded shadow-inner"
          >
            <p class="text-gray-600 flex justify-between items-center">
              {{ key.replaceAll('_', ' ') }}
              <span
                v-if="thresholds[key] !== undefined && typeof value === 'number'"
                :class="[
                  'text-xs px-2 py-0.5 rounded-full font-semibold',
                  value > thresholds[key]
                    ? 'bg-red-100 text-red-700'
                    : 'bg-green-100 text-green-700'
                ]"
              >
                {{ value > thresholds[key] ? 'High' : 'OK' }}
              </span>
            </p>
            <p class="text-lg font-bold">{{ value }}</p>
          </div>
        </div>
      </div>

      <!-- 🛠 Threshold Configuration (SECOND on mobile) -->
      <div class="order-2 md:order-2 bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold mb-4">⚙️ Threshold Configuration</h2>
        <form @submit.prevent="updateThresholds">
          <div v-if="loadingThresholds" class="text-gray-500">Loading thresholds...</div>
          <div v-else>
            <div
              v-for="(value, key,) in paginatedThresholds"
              :key="key"
              class="mb-4"
            >
              <label :for="key" class="block font-medium mb-1">{{ key.replaceAll('_', ' ') }}</label>
              <input
                :id="key"
                v-model.number="thresholds[key]"
                type="number"
                step="any"
                :class="[
                  'w-full p-2 border rounded',
                  isInvalid(thresholds[key]) ? 'border-red-500' : 'border-gray-300'
                ]"
              />
              <p v-if="isInvalid(thresholds[key])" class="text-sm text-red-500 mt-1">
                Please enter a number between 0 and 9999.
              </p>
            </div>

            <div class="flex justify-between mb-4">
              <button
                type="button"
                @click="prevPage"
                :disabled="currentPage === 1"
                class="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              >
                Prev
              </button>
              <span class="text-sm text-gray-700">Page {{ currentPage }} of {{ totalPages }}</span>
              <button
                type="button"
                @click="nextPage"
                :disabled="currentPage === totalPages"
                class="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>

            <button
              type="submit"
              class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Save Thresholds
            </button>
            <button
              @click="restoreDefaults"
              type="button"
              class="ml-2 bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
            >
              Restore Defaults
            </button>
          </div>
        </form>
      </div>

    </div>
  </div>
</template>


<script>
import { getDatabase, ref, onValue, set, update } from "firebase/database";

export default {
  props: ['deviceId'],
  data() {
    return {
    thresholds: {},
    sensorReadings: {},
    currentPage: 1,
    itemsPerPage: 5,
    thresholdsUnsub: null,
    sensorUnsub: null,
    loadingThresholds: true,
    loadingSensors: true
  };
  },
  watch: {
    deviceId: {
      immediate: true,
      handler(newId) {
        if (newId) this.loadData();
      }
    }
  },
  computed: {
    paginatedThresholds() {
  const keys = Object.keys(this.thresholds);
  const start = (this.currentPage - 1) * this.itemsPerPage;
  const end = start + this.itemsPerPage; // ✅ define end
  return keys.slice(start, end).reduce((acc, key) => {
    acc[key] = this.thresholds[key];
    return acc;
  }, {});
}
,
    totalPages() {
      return Math.ceil(Object.keys(this.thresholds).length / this.itemsPerPage);
    }
  },
  methods: {
    isInvalid(value) {
      return (
        value === null ||
        isNaN(value) ||
        typeof value !== 'number' ||
        value < 0 ||
        value > 9999
      );
    },
    updateThresholds() {
      // Validate all thresholds before saving
      for (const [key, val] of Object.entries(this.thresholds)) {
        if (this.isInvalid(val)) {
          alert(`❌ Invalid value for "${key.replaceAll('_', ' ')}". Please correct it.`);
          return;
        }
      }

      const db = getDatabase();
      update(ref(db, `/devices/${this.deviceId}/thresholds`), this.thresholds);
    },
    restoreDefaults() {
      const confirmed = confirm('Are you sure you want to restore default thresholds? This will overwrite current values.');
      if (!confirmed) return;

      const db = getDatabase();
      set(ref(db, `/devices/${this.deviceId}/thresholds/restore_defaults`), true);
    },
    loadData() {
  const db = getDatabase();

  if (this.thresholdsUnsub) this.thresholdsUnsub();
  if (this.sensorUnsub) this.sensorUnsub();

  this.loadingThresholds = true;
  this.loadingSensors = true;

  const thresholdsRef = ref(db, `/devices/${this.deviceId}/thresholds`);
  const sensorRef = ref(db, `/devices/${this.deviceId}/sensor_readings`);

  this.thresholdsUnsub = onValue(thresholdsRef, (snapshot) => {
    if (snapshot.exists()) {
      this.thresholds = snapshot.val();
    } else {
      this.thresholds = {};
    }
    this.loadingThresholds = false;
  });

  this.sensorUnsub = onValue(sensorRef, (snapshot) => {
    if (snapshot.exists()) {
      this.sensorReadings = snapshot.val();
    } else {
      this.sensorReadings = {};
    }
    this.loadingSensors = false;
  });
},

    nextPage() {
      if (this.currentPage < this.totalPages) this.currentPage++;
    },
    prevPage() {
      if (this.currentPage > 1) this.currentPage--;
    }
  },
  beforeUnmount() {
    if (this.thresholdsUnsub) this.thresholdsUnsub();
    if (this.sensorUnsub) this.sensorUnsub();
  }
};
</script>

<style scoped>
input[type="number"] {
  background-color: #f9fafb;
}
</style>
