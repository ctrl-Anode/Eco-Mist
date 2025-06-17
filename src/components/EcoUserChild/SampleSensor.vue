<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <main class="flex-1 overflow-y-auto p-4 md:p-6">
      <div class="max-w-6xl mx-auto">
        <!-- Page Header -->
        <div class="mb-6">
          <h1 class="text-2xl font-bold text-gray-800">Device Management</h1>
          <p class="text-gray-600">Configure and monitor your IoT devices</p>
        </div>

        <!-- ✅ Device Picker -->
        <div v-if="devices.length > 0" class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-1">Select Device</label>
          <select
            v-model="currentDeviceId"
            class="w-full max-w-xs border-gray-300 rounded-md shadow-sm text-sm"
          >
            <option v-for="device in devices" :key="device.id" :value="device.id">
              {{ device.name }}
            </option>
          </select>
        </div>

       <!-- Tabs -->
<div class="bg-white rounded-lg shadow p-4 mb-6">
  <nav class="grid grid-cols-2 sm:flex sm:flex-wrap sm:space-x-2 gap-2">
    <button
      v-for="tab in tabs"
      :key="tab.name"
      @click="currentTab = tab.name"
      :class="[ 
        'px-4 py-2 rounded font-medium text-center transition-colors duration-150',
        currentTab === tab.name
          ? 'bg-emerald-100 text-emerald-700'
          : 'text-gray-600 hover:bg-gray-100'
      ]"
    >
      {{ tab.label }}
    </button>
  </nav>
</div>



        <!-- Dynamic component render -->
         <component 
  :is="currentTabComponent"
  :deviceId="currentDeviceId"
  :deviceName="selectedDeviceName"
  @select-device="handleDeviceSelect"
/>       
      </div>
    </main>
  </div>
</template>

<script>
import { getDatabase, ref, onValue } from 'firebase/database';
import { getAuth } from 'firebase/auth';

import EcoDeviceWifi from '../EcoDevice/EcoDeviceWifi.vue';
import EcoDeviceData from '../EcoDevice/EcoDeviceData.vue';
import EcoMyDevice from '../EcoDevice/EcoMyDevice.vue';
import EcoDeviceManager from '../EcoDevice/EcoDeviceManager.vue';

export default {
  name: 'DeviceManagerTabs',
  components: {
    EcoDeviceWifi,
    EcoDeviceData,
    EcoMyDevice,
    EcoDeviceManager
  },
  data() {
  return {
    currentDeviceId: localStorage.getItem('currentDeviceId') || null,
    selectedDeviceName: '',
    currentTab: localStorage.getItem('currentTab') || 'EcoMyDevice',
    devices: [],
    tabs: [
      { name: 'EcoMyDevice', label: '📋 My Devices' },
      { name: 'EcoDeviceManager', label: '🔐 Register/Unregister' },
      { name: 'EcoDeviceWifi', label: '📶 Update WiFi' },
      { name: 'EcoDeviceData', label: '⚙️ Thresholds & Sensors' }
    ]
  };
},
  computed: {
    currentTabComponent() {
      return this.currentTab;
    }
  },
  watch: {
  currentDeviceId: {
    immediate: true,
    handler(newId) {
      localStorage.setItem('currentDeviceId', newId);
      const selectedDevice = this.devices.find(device => device.id === newId);
      this.selectedDeviceName = selectedDevice ? selectedDevice.name : '';
    }
  },
  currentTab(newTab) {
    localStorage.setItem('currentTab', newTab);
  }
},
  mounted() {
    this.fetchDevices();
  },
  methods: {
    fetchDevices() {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) return;

      const db = getDatabase();
      const devicesRef = ref(db, 'devices');

      onValue(devicesRef, (snapshot) => {
        const allDevices = snapshot.val() || {};
        const userDevices = Object.entries(allDevices)
          .filter(([id, dev]) => dev.owner === user.uid && dev.registered)
          .map(([id, dev]) => ({
            id,
            name: dev.devicename || `Device-${id}`
          }));

        this.devices = userDevices;

        // ✅ Auto-select first device if none selected
        if (!this.devices.find(d => d.id === this.currentDeviceId)) {
        this.currentDeviceId = this.devices[0]?.id || null;
        }
      });
    },
    
    handleDeviceSelect({ id, name }) {
  this.currentDeviceId = '';
  this.selectedDeviceName = '';
  this.$nextTick(() => {
    this.currentDeviceId = id;
    this.selectedDeviceName = name;
  });
}

  }
};

</script>

<style scoped>
nav button {
  transition: all 0.2s;
}
</style>
