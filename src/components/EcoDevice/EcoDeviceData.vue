<template>
  <div>
    <div v-if="loading" class="text-gray-500">Loading sensor mode...</div>
    <SensorSimulated v-else-if="isSimulated" :device-id="deviceId" />
    <SensorRealtime v-else :device-id="deviceId" />
  </div>
</template>

<script>
import { getDatabase, ref, onValue } from 'firebase/database';
import SensorSimulated from '../EcoDevice/DeviceSimulation.vue';
import SensorRealtime from '../EcoDevice/DeviceRealtime.vue';

export default {
  props: ['deviceId'],
  components: {
    SensorSimulated,
    SensorRealtime,
  },
  data() {
    return {
      isSimulated: false,
      loading: true,
      unsub: null,
    };
  },
  watch: {
    deviceId: {
      immediate: true,
      handler(newId) {
        if (newId) this.listenToSimFlag(newId);
      },
    },
  },
  methods: {
    listenToSimFlag(id) {
      if (this.unsub) this.unsub(); // Clean up old listener

      const db = getDatabase();
      const simRef = ref(db, `devices/${id}/state/simulated_readings_enabled`);

      this.unsub = onValue(simRef, (snapshot) => {
        this.isSimulated = snapshot.val() === true;
        this.loading = false;
      });
    },
  },
  beforeUnmount() {
    if (this.unsub) this.unsub();
  },
};
</script>
