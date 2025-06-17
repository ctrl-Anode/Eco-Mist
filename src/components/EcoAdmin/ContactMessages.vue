<template>
  <div class="bg-white rounded-lg shadow-lg p-6">
    <h2 class="text-xl font-bold text-green-700 mb-4">Contact Messages</h2>
    <div v-if="loading" class="text-center text-gray-600">Loading messages...</div>
    <div v-else-if="messages.length === 0" class="text-center text-gray-600">No messages found.</div>
    <div v-else class="space-y-4">
      <div
        v-for="message in messages"
        :key="message.id"
        class="p-4 border border-gray-200 rounded-lg"
      >
        <p class="text-gray-800 font-medium">{{ message.name }}</p>
        <p class="text-gray-600 text-sm">{{ message.email }}</p>
        <p class="text-gray-700 mt-2">{{ message.message }}</p>
        <p class="text-gray-500 text-xs mt-2">{{ formatTimestamp(message.timestamp) }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../../firebase';

const messages = ref([]);
const loading = ref(true);

const formatTimestamp = (timestamp) => {
  return new Date(timestamp.seconds * 1000).toLocaleString();
};

onMounted(async () => {
  try {
    const q = query(collection(db, 'contact_messages'), orderBy('timestamp', 'desc'));
    const querySnapshot = await getDocs(q);
    messages.value = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error fetching contact messages:', error);
  } finally {
    loading.value = false;
  }
});
</script>
