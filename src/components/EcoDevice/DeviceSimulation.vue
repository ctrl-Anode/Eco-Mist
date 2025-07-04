<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Sensor Dashboard</h1>
        <p class="text-gray-600">Monitor and configure your device sensors in real-time</p>
      </div>

      <div class="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <!-- 🧪 Sensor Data Section -->
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
              <!-- Sensor Data Cards -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div
                  v-for="(sensor, key) in sensors"
                  :key="key"
                  class="group relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200 hover:shadow-md transition-all duration-200 hover:scale-[1.02]"
                >
                  <!-- Status Indicator -->
                  <div class="absolute top-3 right-3">
                    <div
                      :class="[
                        sensor.isBreach 
                          ? 'bg-red-100 text-red-700 border-red-200 animate-pulse' 
                          : 'bg-green-100 text-green-700 border-green-200',
                        'text-xs px-2 py-1 rounded-full font-semibold border transition-colors duration-200'
                      ]"
                    >
                      {{ sensor.isBreach ? '⚠️ ALERT!!' : '✅ OK' }}
                    </div>
                  </div>

                  <!-- Sensor Icon -->
                  <div class="mb-2">
                    <span class="text-2xl">{{ sensor.icon }}</span>
                  </div>

                  <!-- Sensor Name -->
                  <h3 class="text-sm font-medium text-gray-600 mb-1 capitalize">
                    {{ sensor.name }}
                  </h3>

                  <!-- Sensor Value -->
                  <div class="flex items-baseline gap-2">
                    <span 
                      :class="[
                        sensor.isBreach ? 'text-red-600' : 'text-gray-900',
                        'text-2xl font-bold transition-colors duration-200'
                      ]"
                    >
                      {{ sensor.value }}
                    </span>
                    <span class="text-sm text-gray-500">{{ sensor.unit }}</span>
                  </div>

                  <!-- Progress Bar for Threshold Visualization -->
                  <div class="mt-3">
                    <div class="w-full bg-gray-200 rounded-full h-2">
                      <div
                        :class="[
                          sensor.isBreach ? 'bg-red-500' : 'bg-green-500',
                          'h-2 rounded-full transition-all duration-300'
                        ]"
                        :style="{ width: Math.min((sensor.value / sensor.threshold) * 100, 100) + '%' }"
                      ></div>
                    </div>
                    <div class="flex justify-between text-xs text-gray-500 mt-1">
                      <span>0</span>
                      <span>{{ sensor.threshold }}</span>
                    </div>
                  </div>

                  <!-- Update Counter for DHT22 sensors -->
                  <!-- <div v-if="key === 'airTemp' || key === 'humidity'" class="mt-2 text-xs text-gray-400">
                    Update #{{ updateCount }}
                  </div> -->
                </div>
              </div>

              <!-- Breach Alert Summary -->
              <div v-if="breachCount > 0" class="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div class="flex items-center gap-2 text-red-800">
                  <span class="text-lg">🚨</span>
                  <span class="font-semibold">{{ breachCount }} Sensor{{ breachCount > 1 ? 's' : '' }} Breached</span>
                </div>
                <div class="mt-2 text-sm text-red-600">
                  <span v-for="(sensor, key) in sensors" :key="key">
                    <span v-if="sensor.isBreach" class="inline-block mr-3">
                      {{ sensor.name }}: {{ sensor.value }}{{ sensor.unit }}
                    </span>
                  </span>
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
                <!-- Threshold Form Fields -->
                <div class="space-y-4">
                  <div
                    v-for="(sensor, key) in sensors"
                    :key="key"
                    class="group"
                  >
                    <label :for="key" class="block text-sm font-medium text-gray-700 mb-2">
                      {{ sensor.name }} Threshold
                      <span class="text-gray-500 text-xs ml-1">(Maximum {{ sensor.unit }})</span>
                    </label>
                    
                    <div class="relative">
                      <input
                        :id="key"
                        v-model.number="sensor.threshold"
                        type="number"
                        step="any"
                        min="0"
                        max="9999"
                        :class="[
                          isInvalid(sensor.threshold) 
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                            : 'border-gray-300 focus:border-purple-500 focus:ring-purple-500',
                          'w-full px-4 py-3 bg-gray-50 border rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50'
                        ]"
                        placeholder="Enter threshold value"
                      />
                      
                      <!-- Validation Icon -->
                      <div class="absolute inset-y-0 right-0 flex items-center pr-3">
                        <span v-if="isInvalid(sensor.threshold)" class="text-red-500">❌</span>
                        <span v-else class="text-green-500">✅</span>
                      </div>
                    </div>
                    
                    <!-- Error Message -->
                    <div v-if="isInvalid(sensor.threshold)" class="mt-2 flex items-center gap-2 text-sm text-red-600">
                      <span>⚠️</span>
                      <span>Please enter a number between 0 and 9999</span>
                    </div>
                  </div>

                  <!-- Action Buttons -->
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
import { requestFcmToken, sendSecureNotification, auth } from '../../firebase';

const NOTIFICATION_COOLDOWN_MS = 1 * 60 * 1000; // 1 minute

export default {
  name: 'SensorDashboard',
  data() {
    return {
      fcmToken: null,
      updateCount: 0,
      simulationInterval: null,
      sensors: {
        airTemp: {
          name: 'Air Temperature',
          value: 22.5,
          threshold: 25.0,
          unit: '°C',
          icon: '🌡️',
          isBreach: false,
          baseMin: 18,
          baseMax: 24,
          lastNotified: null,
        },
        humidity: {
          name: 'Humidity',
          value: 45.2,
          threshold: 60.0,
          unit: '%',
          icon: '💧',
          isBreach: false,
          baseMin: 40,
          baseMax: 55,
          lastNotified: null,
        },
        waterTemp: {
          name: 'Water Temperature',
          value: 20.1,
          threshold: 30.0,
          unit: '°C',
          icon: '🌊',
          isBreach: false,
          baseMin: 18,
          baseMax: 28,
          lastNotified: null,
        },
        distance: {
          name: 'Distance',
          value: 15.7,
          threshold: 50.0,
          unit: 'cm',
          icon: '📏',
          isBreach: false,
          baseMin: 10,
          baseMax: 45,
          lastNotified: null,
        },
        ph: {
          name: 'pH Level',
          value: 7.2,
          threshold: 8.5,
          unit: 'pH',
          icon: '🧪',
          isBreach: false,
          baseMin: 6.5,
          baseMax: 8.0,
          lastNotified: null,
        },
        tds: {
          name: 'TDS',
          value: 350,
          threshold: 500,
          unit: 'ppm',
          icon: '⚗️',
          isBreach: false,
          baseMin: 200,
          baseMax: 450,
          lastNotified: null,
        }
      }
    };
  },
  computed: {
    breachCount() {
      return Object.values(this.sensors).filter(sensor => sensor.isBreach).length;
    }
  },
  methods: {
    isInvalid(value) {
      return value === null || isNaN(value) || value < 0 || value > 9999;
    },
    
    generateSensorValue(sensorKey, sensor) {
      const { baseMin, baseMax, threshold } = sensor;
      
      // Special behavior for DHT22 sensors
      if (sensorKey === 'airTemp') {
        if (this.updateCount <= 10) {
          // Stay within safe range for updates 1-10
          return parseFloat((Math.random() * (baseMax - baseMin) + baseMin).toFixed(1));
        } else {
          // Go slightly above threshold from update 11 onwards
          return parseFloat((threshold + Math.random() * 2 + 0.5).toFixed(1));
        }
      }
      
      if (sensorKey === 'humidity') {
        if (this.updateCount <= 13) {
          // Stay within safe range for updates 1-13
          return parseFloat((Math.random() * (baseMax - baseMin) + baseMin).toFixed(1));
        } else {
          // Go slightly above threshold from update 14 onwards
          return parseFloat((threshold + Math.random() * 5 + 1).toFixed(1));
        }
      }
      
      // All other sensors fluctuate within safe bounds
      const variation = (baseMax - baseMin) * 0.1; // 10% variation
      const centerValue = (baseMax + baseMin) / 2;
      const value = centerValue + (Math.random() - 0.5) * variation * 2;
      
      return parseFloat(Math.max(baseMin, Math.min(baseMax, value)).toFixed(sensorKey === 'tds' ? 0 : 1));
    },
    
    async updateSensorReadings() {
  this.updateCount++;

const idToken = await auth.currentUser.getIdToken();


  Object.keys(this.sensors).forEach(async (key) => {
    const sensor = this.sensors[key];
    const newValue = this.generateSensorValue(key, sensor);
    sensor.value = newValue;

    const now = Date.now();
    const wasBreached = sensor.isBreach;

    if (key === 'airTemp' || key === 'humidity') {
      sensor.isBreach = newValue > sensor.threshold;

      const eligibleForNotification =
        sensor.isBreach &&
        (!sensor.lastNotified || now - sensor.lastNotified > NOTIFICATION_COOLDOWN_MS);

      if (!wasBreached && eligibleForNotification && this.fcmToken) {
        try {
          // 🔔 FCM push notification
          await sendSecureNotification(
            this.fcmToken,
            `⚠️ ${sensor.name} Breach!`,
            `${sensor.name} is ${newValue}${sensor.unit}, which exceeds the threshold of ${sensor.threshold}${sensor.unit}.`
          );

          // 📧 SMTP email notification
          await fetch('http://localhost:5000/breach-email', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${idToken}`
            },
            body: JSON.stringify({
              device_id: this.selectedDeviceId || "unknown-id",
              device_name: this.selectedDeviceName || "Unnamed Device",
              sensor_name: sensor.name,
              value: newValue,
              threshold: sensor.threshold
            })
          });

          sensor.lastNotified = now;
          console.log(`🔔 Notification sent for ${sensor.name}`);
        } catch (err) {
          console.error("❌ Failed to send FCM or SMTP alert:", err);
        }
      }
    } else {
      sensor.isBreach = false;
    }
  });
},

    
    startSimulation() {
      // Initial update
      this.updateSensorReadings();
      
      // Set up interval for updates every 3 seconds
      this.simulationInterval = setInterval(() => {
        this.updateSensorReadings();
      }, 3000);
    },
    
    stopSimulation() {
      if (this.simulationInterval) {
        clearInterval(this.simulationInterval);
        this.simulationInterval = null;
      }
    },
    
    updateThresholds() {
      // Validate all thresholds
      for (const [key, sensor] of Object.entries(this.sensors)) {
        if (this.isInvalid(sensor.threshold)) {
          alert(`❌ Invalid threshold for "${sensor.name}". Please correct it.`);
          return;
        }
      }
      
      // Show success message
      alert('✅ Thresholds updated successfully!');
      
      // Re-check breaches with new thresholds
      Object.keys(this.sensors).forEach(key => {
        const sensor = this.sensors[key];
        if (key === 'airTemp' || key === 'humidity') {
          sensor.isBreach = sensor.value > sensor.threshold;
        }
      });
    },
    
    restoreDefaults() {
      if (!confirm("Are you sure you want to restore default thresholds? This action cannot be undone.")) return;
      
      // Restore default thresholds
      this.sensors.airTemp.threshold = 25.0;
      this.sensors.humidity.threshold = 60.0;
      this.sensors.waterTemp.threshold = 30.0;
      this.sensors.distance.threshold = 50.0;
      this.sensors.ph.threshold = 8.5;
      this.sensors.tds.threshold = 500;
      
      alert('🔄 Default thresholds restored!');
    }
  },
  
  mounted() {
    // Start simulation when component mounts
    this.startSimulation();

requestFcmToken().then((token) => {
  this.fcmToken = token;
});

  },
  
  beforeUnmount() {
    // Clean up interval when component unmounts
    this.stopSimulation();
  }
};
</script>

<style scoped>
input[type="number"] {
  background-color: #f9fafb;
}

/* Custom scrollbar for better aesthetics */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Smooth transitions for all interactive elements */
* {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

/* Breach animation */
@keyframes breach-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

.animate-pulse {
  animation: breach-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>