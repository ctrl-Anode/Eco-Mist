<template>
  <div class="p-6 max-w-xl mx-auto">
    <h2 class="text-2xl font-semibold mb-4">Register or Unregister Your Device</h2>

    <form @submit.prevent="registerDevice" class="space-y-4">
      <!-- Device ID -->
      <div>
        <label class="block font-medium mb-1">Device ID (Machine ID)</label>
        <input
          v-model="localDeviceId"
          class="w-full border px-3 py-2 rounded bg-gray-100 text-gray-600"
        />
      </div>

      <!-- Device Name -->
      <div>
        <label class="block font-medium mb-1">Device Name</label>
        <input
          v-model="localDeviceName"
          class="w-full border px-3 py-2 rounded"
          required
        />
      </div>

      <!-- User Email -->
      <div>
        <label class="block font-medium mb-1">Your Email</label>
        <input
          v-model="userEmail"
          class="w-full border px-3 py-2 rounded bg-gray-100 text-gray-600 cursor-not-allowed"
          readonly
        />
      </div>

      <!-- Password -->
      <div>
        <label class="block font-medium mb-1">Your Password</label>
        <input
          v-model="userPassword"
          type="password"
          class="w-full border px-3 py-2 rounded"
          required
        />
      </div>

      <!-- Action Buttons -->
      <div class="flex space-x-2">
        <button type="submit" class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          Register Device
        </button>
        <button type="button" @click="unregisterDevice" class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
          Unregister Device
        </button>
      </div>
    </form>

    <p v-if="error" class="text-red-600 mt-4">{{ error }}</p>
    <p v-if="success" class="text-green-600 mt-4">{{ success }}</p>
  </div>
</template>

<script>
import { getDatabase, ref, get, update } from 'firebase/database';
import { getAuth, EmailAuthProvider, reauthenticateWithCredential, onAuthStateChanged } from 'firebase/auth';

export default {
  name: 'UserDeviceRegistration',
  props: {
    deviceId: String,
    deviceName: String
  },
  data() {
    return {
      localDeviceId: '',
      localDeviceName: '',
      userEmail: '',
      userPassword: '',
      error: '',
      success: ''
    };
  },
  watch: {
    deviceId: {
      immediate: true,
      handler(newId) {
        this.localDeviceId = newId || '';
      }
    },
    deviceName: {
      immediate: true,
      handler(newName) {
        this.localDeviceName = newName || '';
      }
    }
  },
  mounted() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.userEmail = user.email;
      }
    });
  },
  methods: {
    async reauthenticate() {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) throw new Error('No authenticated user.');

      const credential = EmailAuthProvider.credential(this.userEmail, this.userPassword);
      await reauthenticateWithCredential(user, credential);
      return user;
    },

    async registerDevice() {
      this.error = '';
      this.success = '';

      try {
        const user = await this.reauthenticate();

        const db = getDatabase();
        const deviceRef = ref(db, `devices/${this.localDeviceId}`);
        const snapshot = await get(deviceRef);

        if (!snapshot.exists()) {
          this.error = 'Device not found. Ensure it is online and initialized.';
          return;
        }

        const deviceData = snapshot.val();

        if (deviceData.registered) {
          this.error = deviceData.owner === user.uid
            ? 'This device is already registered to your account.'
            : 'This device is already registered to another account.';
          return;
        }

        const updates = {
          owner: user.uid,
          devicename: this.localDeviceName,
          registered: true,
          status: 'registered'
        };

        await update(deviceRef, updates);
        this.success = 'Device registered successfully!';
      } catch (err) {
        this.error = err.message || 'An error occurred.';
      }
    },

    async unregisterDevice() {
       const confirmed = confirm('⚠️ Are you sure you want to unregister this device? This action cannot be undone.');
       if (!confirmed) return;

       this.error = '';
       this.success = '';

      try {
        const user = await this.reauthenticate();

        const db = getDatabase();
        const deviceRef = ref(db, `devices/${this.localDeviceId}`);
        const snapshot = await get(deviceRef);

        if (!snapshot.exists()) {
          this.error = 'Device not found.';
          return;
        }

        const deviceData = snapshot.val();

        if (deviceData.owner !== user.uid) {
          this.error = 'You are not authorized to unregister this device.';
          return;
        }

        const updates = {
          owner: 'Unregistered',
          devicename: `Device-${this.localDeviceId}`,
          registered: false,
          status: 'waiting_for_registration'
        };

        await update(deviceRef, updates);
        this.success = 'Device unregistered successfully!';
      } catch (err) {
        this.error = err.message || 'An error occurred.';
      }
    }
  }
};
</script>

<style scoped>
input {
  outline: none;
}
</style>
