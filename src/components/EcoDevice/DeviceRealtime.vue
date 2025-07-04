<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
    <div class="max-w-7xl mx-auto">
        <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Sensor Dashboard</h1>
        <p class="text-gray-600">Monitor and configure your device sensors in real-time</p>
      </div>
      <div class="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <!-- 🤪 Sensor Data Section -->
        <div class="order-1">
          <div class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div class="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
              <div class="flex items-center justify-between">
                <h2 class="text-xl font-semibold text-white flex items-center gap-2">
                  <span class="text-2xl">🧪</span>
                  Sensor Readings
                </h2>
                <div class="flex items-center gap-2 bg-green-500 bg-opacity-20 px-3 py-1 rounded-full">
                  <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span class="text-xs text-green-100 font-medium">Live</span>
                </div>
              </div>
            </div>
            <div class="p-6">
              <div v-if="loadingSensors" class="text-gray-500">Loading sensor readings...</div>
              <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div
                  v-for="(value, key) in sensorReadings"
                  :key="key"
                  class="group relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200 hover:shadow-md transition-all duration-200 hover:scale-[1.02]"
                >
                  <!-- Status Indicator -->
                  <div class="absolute top-3 right-3">
                    <div
                      :class="[
                        value > thresholds[key] ? 'bg-red-100 text-red-700 border-red-200 animate-pulse' : 'bg-green-100 text-green-700 border-green-200',
                        'text-xs px-2 py-1 rounded-full font-semibold border transition-colors duration-200'
                      ]"
                    >
                      {{ value > thresholds[key] ? '⚠️ ALERT!!' : '⚠️ No Sensor' }}
                    </div>
                  </div>
                  <h3 class="text-sm font-medium text-gray-600 mb-1 capitalize">
                    {{ key.replaceAll('_', ' ') }}
                  </h3>
                  <div class="flex items-baseline gap-2">
                    <span
                      :class="[
                        value > thresholds[key] ? 'text-red-600' : 'text-gray-900',
                        'text-2xl font-bold transition-colors duration-200'
                      ]"
                    >
                      {{ value }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ⚙️ Threshold Configuration Section -->
        <div class="order-2">
          <div class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div class="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4">
              <h2 class="text-xl font-semibold text-white flex items-center gap-2">
                <span class="text-2xl">⚙️</span>
                Threshold Configuration
              </h2>
            </div>
            <div class="p-6">
              <form @submit.prevent="updateThresholds" class="space-y-6">
                <div class="space-y-4">
                  <div
                    v-for="(value, key) in paginatedThresholds"
                    :key="key"
                    class="group"
                  >
                    <label :for="key" class="block text-sm font-medium text-gray-700 mb-2">
                      {{ key.replaceAll('_', ' ') }} Threshold
                      <span class="text-gray-500 text-xs ml-1">(Maximum)</span>
                    </label>
                    <div class="relative">
                      <input
                        :id="key"
                        v-model.number="thresholds[key]"
                        type="number"
                        step="any"
                        :class="[
                          isInvalid(thresholds[key]) ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-purple-500 focus:ring-purple-500',
                          'w-full px-4 py-3 bg-gray-50 border rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50'
                        ]"
                        placeholder="Enter threshold value"
                      />
                      <div class="absolute inset-y-0 right-0 flex items-center pr-3">
                        <span v-if="isInvalid(thresholds[key])" class="text-red-500">❌</span>
                        <span v-else class="text-green-500">✅</span>
                      </div>
                    </div>
                    <div v-if="isInvalid(thresholds[key])" class="mt-2 flex items-center gap-2 text-sm text-red-600">
                      <span>⚠️</span>
                      <span>Please enter a number between 0 and 9999</span>
                    </div>
                  </div>
                  <div class="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
                    <button
                      type="submit"
                      class="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-700 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition-all duration-200 transform hover:scale-[1.02]"
                    >
                      💾 Save Thresholds
                    </button>
                    <button
                      @click="restoreDefaults"
                      type="button"
                      class="flex-1 sm:flex-none bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition-all duration-200"
                    >
                      🔄 Restore Defaults
                    </button>
                  </div>
                  <div class="flex justify-between mb-2">
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
                </div>
              </form>
            </div>
          </div>
        </div>
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
