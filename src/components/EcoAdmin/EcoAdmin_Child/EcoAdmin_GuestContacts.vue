<template>
  <div class="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
    <!-- Header -->
    <div class="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4">
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-bold text-white flex items-center gap-2">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
          </svg>
          Contact Messages
        </h2>
        <div class="flex items-center gap-2 text-green-100">
          <span class="text-sm">{{ messages.length }} message{{ messages.length !== 1 ? 's' : '' }}</span>
          <button 
            @click="refreshMessages" 
            :disabled="loading"
            class="p-1 hover:bg-green-600 rounded-full transition-colors disabled:opacity-50"
            title="Refresh messages"
          >
            <svg class="w-4 h-4" :class="{ 'animate-spin': loading }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="p-6">
      <!-- Loading State -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mb-4"></div>
        <p class="text-gray-600">Loading messages...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12">
        <div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <div class="flex items-center justify-center mb-2">
            <svg class="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <p class="text-red-700 font-medium">Failed to load messages</p>
          <p class="text-red-600 text-sm mt-1">{{ error }}</p>
        </div>
        <button 
          @click="refreshMessages"
          class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Try Again
        </button>
      </div>

      <!-- Empty State -->
      <div v-else-if="messages.length === 0" class="text-center py-12">
        <div class="bg-gray-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
          </svg>
        </div>
        <p class="text-gray-600 font-medium">No messages yet</p>
        <p class="text-gray-500 text-sm mt-1">Contact messages will appear here when received</p>
      </div>

      <!-- Messages List -->
      <div v-else class="space-y-4">
        <div
          v-for="(message, index) in paginatedMessages"
          :key="message.id"
          class="group bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:border-gray-300 rounded-lg p-5 transition-all duration-200 hover:shadow-md"
          :class="{ 'animate-fade-in': index < 3 }"
        >
          <!-- Message Header -->
          <div class="flex justify-between items-center mb-2">
  <div>
    <input type="checkbox" :value="message.id" @change="() => toggleSelection(message.id)" class="mr-2" />
    <span class="font-semibold">{{ message.name }}</span>
  </div>
  <div class="flex items-center gap-2">
    <button @click="openViewModal(message)" title="View" class="text-blue-600 hover:underline text-sm">View</button>
    <button @click="confirmDelete(message)" title="Delete" class="text-red-600 hover:underline text-sm">Delete</button>
    <button @click="openReplyModal(message)" title="Reply" class="text-green-600 hover:underline text-sm">Reply</button>

  </div>
</div>


          <!-- Message Content -->
          <div class="ml-13">
            <p 
              class="text-gray-700 leading-relaxed"
              :class="{ 
                'line-clamp-3': !expandedMessages.has(message.id) && message.message.length > 150,
                'whitespace-pre-wrap': expandedMessages.has(message.id)
              }"
            >
              {{ message.message }}
            </p>
            
            <!-- Show more/less button for long messages -->
            <button 
              v-if="message.message.length > 150"
              @click="toggleMessageExpansion(message.id)"
              class="text-green-600 hover:text-green-700 text-sm font-medium mt-2 hover:underline transition-colors"
            >
              {{ expandedMessages.has(message.id) ? 'Show less' : 'Show more' }}
            </button>

            <!-- Message timestamp -->
            <p class="text-xs text-gray-500 mt-3 flex items-center gap-1">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              {{ formatTimestamp(message.timestamp) }}
            </p>
          </div>
        </div>

        <div v-if="selectedIds.size" class="flex justify-between items-center text-sm text-gray-600 mb-4">
  <span>{{ selectedIds.size }} selected</span>
  <button @click="confirmBatchDelete" class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
    Delete Selected
  </button>
</div>


        <!-- Pagination -->
        <div v-if="messages.length > messagesPerPage" class="flex items-center justify-between pt-4 border-t border-gray-200">
          <p class="text-sm text-gray-600">
            Showing {{ ((currentPage - 1) * messagesPerPage) + 1 }} to {{ Math.min(currentPage * messagesPerPage, messages.length) }} of {{ messages.length }} messages
          </p>
          <div class="flex items-center gap-2">
            <button 
              @click="currentPage--"
              :disabled="currentPage === 1"
              class="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <span class="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-md font-medium">
              {{ currentPage }}
            </span>
            <button 
              @click="currentPage++"
              :disabled="currentPage >= totalPages"
              class="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- View Modal -->
<Teleport to="body">
  <div v-if="showViewModal" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
    <div class="bg-white p-6 rounded-xl w-full max-w-md shadow-lg">
      <h3 class="text-lg font-bold mb-2">📬 Message from {{ selectedMessage?.name }}</h3>
      <p class="text-sm text-gray-600 mb-4">{{ selectedMessage?.email }}</p>
      <p class="text-gray-700 whitespace-pre-line">{{ selectedMessage?.message }}</p>
      <div class="text-right mt-6">
        <button @click="showViewModal = false" class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Close</button>
      </div>
    </div>
  </div>
</Teleport>

<!-- Delete Confirm Modal -->
<Teleport to="body">
  <div v-if="showDeleteModal" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
    <div class="bg-white p-6 rounded-xl shadow-lg w-full max-w-sm text-center">
      <h3 class="text-lg font-semibold mb-2 text-red-600">Delete this message?</h3>
      <p class="text-sm text-gray-600 mb-4">This action cannot be undone.</p>
      <div class="flex justify-center gap-4">
        <button @click="showDeleteModal = false" class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Cancel</button>
        <button @click="deleteMessage" class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Delete</button>
      </div>
    </div>
  </div>
</Teleport>

<!-- Batch Delete Modal -->
<Teleport to="body">
  <div v-if="showBatchDeleteModal" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
    <div class="bg-white p-6 rounded-xl shadow-lg w-full max-w-sm text-center">
      <h3 class="text-lg font-semibold mb-2 text-red-600">Delete {{ selectedIds.size }} messages?</h3>
      <p class="text-sm text-gray-600 mb-4">This will permanently remove the selected messages.</p>
      <div class="flex justify-center gap-4">
        <button @click="showBatchDeleteModal = false" class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Cancel</button>
        <button @click="deleteBatchMessages" class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Delete All</button>
      </div>
    </div>
  </div>
</Teleport>
<Teleport to="body">
  <div v-if="showReplyModal" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
    <div class="bg-white p-6 rounded-xl w-full max-w-md shadow-lg">
      <h3 class="text-lg font-bold mb-2">✉️ Reply to {{ selectedReplyMessage?.name }}</h3>
      <input v-model="replySubject" placeholder="Subject" class="w-full mb-3 px-3 py-2 border rounded" />
      <textarea v-model="replyBody" rows="6" placeholder="Type your message here..." class="w-full px-3 py-2 border rounded resize-none"></textarea>
      <input type="file" @change="handleFileUpload" class="mb-3" />
      <div class="text-right mt-4">
        <button @click="showReplyModal = false" class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 mr-2">Cancel</button>
        <button @click="sendReply" class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Send</button>
      </div>
    </div>
  </div>
</Teleport>

  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../../../firebase';
import { deleteDoc, doc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { addDoc, serverTimestamp } from 'firebase/firestore';
const auth = getAuth();

const messages = ref([]);
const loading = ref(true);
const error = ref(null);
const expandedMessages = ref(new Set());
const currentPage = ref(1);
const messagesPerPage = 5;

// Computed properties
const totalPages = computed(() => Math.ceil(messages.value.length / messagesPerPage));
const paginatedMessages = computed(() => {
  const start = (currentPage.value - 1) * messagesPerPage;
  const end = start + messagesPerPage;
  return messages.value.slice(start, end);
});

// Helper functions
const getInitials = (name) => {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const formatTimestamp = (timestamp) => {
  if (!timestamp) return 'Unknown date';
  const date = new Date(timestamp.seconds * 1000);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getRelativeTime = (timestamp) => {
  if (!timestamp) return 'Unknown';
  const now = new Date();
  const messageDate = new Date(timestamp.seconds * 1000);
  const diffInSeconds = Math.floor((now - messageDate) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  
  return messageDate.toLocaleDateString();
};

const toggleMessageExpansion = (messageId) => {
  if (expandedMessages.value.has(messageId)) {
    expandedMessages.value.delete(messageId);
  } else {
    expandedMessages.value.add(messageId);
  }
};

const fetchMessages = async () => {
  try {
    loading.value = true;
    error.value = null;
    
    const q = query(collection(db, 'contact_messages'), orderBy('timestamp', 'desc'));
    const querySnapshot = await getDocs(q);
    
    messages.value = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (err) {
    console.error('Error fetching contact messages:', err);
    error.value = err.message || 'Failed to load messages';
  } finally {
    loading.value = false;
  }
};

const refreshMessages = () => {
  currentPage.value = 1;
  expandedMessages.value.clear();
  fetchMessages();
};

onMounted(() => {
  fetchMessages();
});


const selectedMessage = ref(null);
const showViewModal = ref(false);

const messageToDelete = ref(null);
const showDeleteModal = ref(false);

const selectedIds = ref(new Set());
const showBatchDeleteModal = ref(false);

const openViewModal = (msg) => {
  selectedMessage.value = msg;
  showViewModal.value = true;

  logContactAction('viewed', msg.email, msg.message.slice(0, 50));
};

const confirmDelete = (msg) => {
  messageToDelete.value = msg;
  showDeleteModal.value = true;
};

const confirmBatchDelete = () => {
  if (selectedIds.value.size) {
    showBatchDeleteModal.value = true;
  }
};

const deleteMessage = async () => {
  if (!messageToDelete.value) return;
  await deleteDoc(doc(db, 'contact_messages', messageToDelete.value.id));

 // Log delete action
  await logContactAction('deleted', messageToDelete.value.email, messageToDelete.value.message.slice(0, 50));

  showDeleteModal.value = false;
  refreshMessages();
};

const deleteBatchMessages = async () => {
  const ids = Array.from(selectedIds.value);

  for (const id of ids) {
    const msg = messages.value.find(m => m.id === id);
    if (msg) {
      await deleteDoc(doc(db, 'contact_messages', id));
      await logContactAction('deleted', msg.email, msg.message.slice(0, 50));
    }
  }

  showBatchDeleteModal.value = false;
  selectedIds.value.clear();
  refreshMessages();
};


const toggleSelection = (id) => {
  selectedIds.value.has(id) ? selectedIds.value.delete(id) : selectedIds.value.add(id);
};

const showReplyModal = ref(false);
const selectedReplyMessage = ref(null);
const replySubject = ref('');
const replyBody = ref('');

const openReplyModal = (msg) => {
  selectedReplyMessage.value = msg;
  replySubject.value = `Re: Your message to Eco-Mist`;
  replyBody.value = '';
  showReplyModal.value = true;
};


const sendReply = async () => {
  const user = auth.currentUser;
  if (!user) {
    alert('You must be logged in as admin to send replies.');
    return;
  }

  const idToken = await user.getIdToken();

  const formData = new FormData();
  formData.append('to', selectedReplyMessage.value.email);
  formData.append('subject', replySubject.value);
  formData.append('body', replyBody.value);
  if (attachedFile.value) {
    formData.append('file', attachedFile.value);
  }

  const res = await fetch('http://localhost:5000/send-reply', {
    method: 'POST',
    body: formData,
    headers: {
      Authorization: `Bearer ${idToken}`
    }
  });

  const result = await res.json();
  if (res.ok) {
    await logContactReply(selectedReplyMessage.value.email, replySubject.value); // ✅ Log action
    alert('✅ Reply sent successfully!');
    showReplyModal.value = false;
  } else {
    alert('❌ Failed to send reply: ' + result.error);
  }
};


const attachedFile = ref(null);

const handleFileUpload = (event) => {
  attachedFile.value = event.target.files[0];
};

const logContactAction = async (action, targetEmail, subject = '') => {
  const admin = auth.currentUser;
  if (!admin) return;

  const logRef = collection(db, 'contact_logs');
  await addDoc(logRef, {
    action,              // e.g., 'replied', 'viewed', 'deleted'
    recipient: targetEmail,
    subject: subject || null,
    by: admin.email,
    timestamp: serverTimestamp()
  });
};

</script>

<style scoped>
.line-clamp-3 {
  line-clamp: 3;
  box-orient: vertical;
  display: box;
  overflow: hidden;
}


.animate-fade-in {
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>