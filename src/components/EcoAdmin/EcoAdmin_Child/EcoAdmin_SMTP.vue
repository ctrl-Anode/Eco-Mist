<template>
  <div class="bg-white shadow-lg rounded-xl p-6 border border-gray-100">
    <h2 class="text-xl font-semibold mb-4 flex items-center gap-2 text-green-700">
      <span>📧</span> Gmail SMTP Settings
    </h2>

    <!-- Add Gmail Form -->
   <form @submit.prevent="addSender" class="space-y-4 mb-6">
  <div>
    <label class="block text-sm font-medium text-gray-700 flex justify-between items-center">
      Gmail Address
      <button @click.prevent="autofillFromAuth" class="text-green-600 hover:underline text-xs">↺ Use My Gmail</button>
    </label>
    <input
  v-model="newEmail"
  type="email"
  required
  autocomplete="off"
  class="input"
  placeholder="e.g. admin@gmail.com"
/>
  </div>

  <div>
    <label class="block text-sm font-medium text-gray-700 flex items-center gap-1">
      App Password
      <button @click="showHelpModal = true" class="text-green-600 hover:text-green-800 text-xs">
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 1010 10A10 10 0 0012 2z" />
        </svg>
      </button>
    </label>
    
<input
  v-model="newPassword"
  type="password"
  required
  autocomplete="new-password"
  class="input"
  placeholder="Paste 16-char App Password here"
/>
  </div>

  <div>
    <label class="block text-sm font-medium text-gray-700">Display Name</label>
    
<input
  v-model="newDisplayName"
  type="text"
  required
  autocomplete="off"
  class="input"
  placeholder="e.g. EcoMist Alerts"
/>

  </div>

  <div class="flex items-center gap-2">
    <input type="checkbox" v-model="setAsDefault" id="setDefault" />
    <label for="setDefault" class="text-sm text-gray-600">Set as default</label>
  </div>

  <div v-if="showToast" class="bg-yellow-50 border-l-4 border-yellow-400 p-3 text-sm text-yellow-800 rounded">
    Make sure 2-Step Verification is enabled and you've generated an App Password via your Google Account.
  </div>

 <button
  type="submit"
  :disabled="!isFormValid"
  class="px-4 py-2 rounded-lg text-white"
  :class="isFormValid ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-300 cursor-not-allowed'"
>
  ➕ Add Gmail
</button>

</form>


    <!-- Existing Senders -->
    <div v-if="senders.length" class="space-y-4">
      <h3 class="text-lg font-medium text-gray-800 mb-2">Saved Gmail Accounts</h3>
      <div v-for="(sender, index) in senders" :key="index" class="border rounded-lg p-4 flex justify-between items-center">
        <div>
          <p class="font-semibold text-gray-800">{{ sender.email }}</p>
          <p class="text-sm text-gray-500">{{ sender.displayName || 'No display name' }}</p>
          <p v-if="sender.email === defaultEmail" class="text-xs text-green-600 font-medium mt-1">🌟 Default</p>
        </div>
        <div class="flex gap-2">
          <button v-if="sender.email !== defaultEmail" @click="setDefault(sender.email)" class="text-green-600 hover:underline text-sm">Make Default</button>
          <button @click="deleteSender(index)" class="text-red-500 hover:underline text-sm">Delete</button>
        </div>
      </div>
    </div>
    <p v-else class="text-gray-500 text-sm">No senders added yet.</p>
  </div>
  <Teleport to="body">
  <div v-if="showHelpModal" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
    <div class="bg-white rounded-xl shadow-xl max-w-lg w-full p-6">
      <h3 class="text-lg font-bold mb-3">🔐 How to Get Your Gmail App Password</h3>
      <ol class="list-decimal list-inside text-sm text-gray-700 space-y-2">
        <li>Go to <a href="https://myaccount.google.com/security" target="_blank" class="text-green-600 underline">https://myaccount.google.com/security</a>.</li>
        <li>Under "Signing in to Google", enable <strong>2-Step Verification</strong>.</li>
        <li>After that, go back to the same page, search and click <strong>App passwords</strong>.</li>
        <li>Select "Mail" as the app and "Other (Custom name)" as the device, then generate.</li>
        <li>Copy the 16-character app password. Use it in this form instead of your actual Gmail password.</li>
        <li>Paste it and Use it.</li>
      </ol>
      <div class="text-right mt-6">
        <button @click="showHelpModal = false" class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Close</button>
      </div>
    </div>
  </div>
</Teleport>

</template>

<script setup>
import { ref, onMounted } from 'vue'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../../../firebase'
import { getAuth } from 'firebase/auth'
import { computed } from 'vue'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'

const auth = getAuth()
const user = auth.currentUser

const uid = user?.uid
const defaultEmail = ref('')
const senders = ref([])
const showHelpModal = ref(false)
const showToast = ref(false)

const newEmail = ref('')

const newPassword = ref('')
const newDisplayName = ref('')
const setAsDefault = ref(true)

const fetchSenders = async () => {
  const docRef = doc(db, 'mail_senders', uid)
  const snap = await getDoc(docRef)
  if (snap.exists()) {
    const data = snap.data()
    senders.value = data.accounts || []
    defaultEmail.value = data.defaultEmail || ''
  }
}

const addSender = async () => {
  if (!newEmail.value || !newPassword.value) return alert('Email and App Password required')
  const newSender = {
    email: newEmail.value,
    appPassword: newPassword.value,
    displayName: newDisplayName.value
  }

  const updatedSenders = [...senders.value, newSender]
  await setDoc(doc(db, 'mail_senders', uid), {
    accounts: updatedSenders,
    defaultEmail: setAsDefault.value ? newEmail.value : defaultEmail.value || newEmail.value
  })

await logSmtpAction('added_sender', newEmail.value)  // ✅ log the action

  // Reset form
  newEmail.value = ''
  newPassword.value = ''
  newDisplayName.value = ''
  setAsDefault.value = false

  fetchSenders()
}

const deleteSender = async (index) => {
  const toRemove = senders.value[index]
  const updatedSenders = senders.value.filter((_, i) => i !== index)

  const updatedDefault = toRemove.email === defaultEmail.value
    ? (updatedSenders[0]?.email || '')
    : defaultEmail.value

  await setDoc(doc(db, 'mail_senders', uid), {
    accounts: updatedSenders,
    defaultEmail: updatedDefault
  })
  await logSmtpAction('deleted_sender', toRemove.email)  // ✅ log the action

  fetchSenders()
}

const setDefault = async (email) => {
  await setDoc(doc(db, 'mail_senders', uid), {
    accounts: senders.value,
    defaultEmail: email
  }, { merge: true })

  await logSmtpAction('set_default', email)  // ✅ log the action
  
  defaultEmail.value = email
}

onMounted(() => {
  newEmail.value = ''
  newPassword.value = ''
  newDisplayName.value = ''
  setAsDefault.value = false
  if (uid) fetchSenders()
})

const autofillFromAuth = () => {
  if (!user) return;

  // Clear all first
  newEmail.value = '';
  newPassword.value = '';
  newDisplayName.value = '';
  setAsDefault.value = true;

  // Then autofill
  newEmail.value = user.email || '';
  newDisplayName.value = user.email?.split('@')[0] || '';

  // Show toast
  showToast.value = true;
  setTimeout(() => (showToast.value = false), 5000);
};

const isFormValid = computed(() => {
  return newEmail.value && newPassword.value && newDisplayName.value
})

// Logging function
const logSmtpAction = async (action, email) => {
  if (!uid || !user?.email) return
  const logRef = collection(db, 'smtp_logs', uid, 'logs')
  await addDoc(logRef, {
    action,           // e.g., 'added_sender', 'deleted_sender', 'set_default'
    email,            // affected Gmail address
    by: user.email,   // admin who triggered the action
    timestamp: serverTimestamp()
  })
}
</script>

<style scoped>
.input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  outline: none;
  transition: 0.2s;
}
.input:focus {
  border-color: #10b981;
  box-shadow: 0 0 0 1px #10b981;
}
</style>
