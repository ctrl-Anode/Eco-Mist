<template>
  <div v-if="show" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div class="bg-white w-full max-w-md p-6 rounded-lg shadow-lg relative">
      <button
        @click="$emit('close')"
        class="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        aria-label="Close"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
      <h2 class="text-xl font-bold text-gray-800 mb-4">Reset Password</h2>
      <p class="text-sm text-gray-600 mb-6">Enter your email to receive password reset instructions.</p>
      <form @submit.prevent="resetPassword" class="space-y-4">
        <div>
          <input
            type="email"
            v-model="email"
            placeholder="Email Address"
            class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            :disabled="loading"
            required
          />
          <p v-if="error" class="text-sm text-red-500 mt-2">{{ error }}</p>
          <p v-if="success" class="text-sm text-green-500 mt-2">{{ success }}</p>
        </div>
        <button
          type="submit"
          class="w-full bg-green-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
          :disabled="loading"
        >
          <span v-if="!loading">Send Reset Link</span>
          <span v-else class="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

const props = defineProps({
  show: Boolean,
});

const email = ref("");
const error = ref("");
const success = ref("");
const loading = ref(false);

const resetPassword = async () => {
  error.value = "";
  success.value = "";
  if (!email.value) {
    error.value = "Email is required.";
    return;
  }

  loading.value = true;
  try {
    const auth = getAuth();
    await sendPasswordResetEmail(auth, email.value);
    success.value = "Password reset link sent to your email.";
    email.value = "";
  } catch (err) {
    error.value = "Failed to send reset link. Please try again.";
  } finally {
    loading.value = false;
  }
};
</script>
