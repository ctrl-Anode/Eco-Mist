<template>
  <div class="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 relative overflow-hidden">
    <!-- Animated background elements -->
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-green-200/30 to-green-300/20 rounded-full blur-3xl animate-pulse"></div>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-green-200/30 to-green-300/20 rounded-full blur-3xl animate-pulse" style="animation-delay: 2s;"></div>
    </div>

    <!-- Main Content -->
    <div class="flex items-center justify-center min-h-screen px-4 sm:px-6 py-8 sm:py-12 relative z-10">
      <div class="w-full max-w-md">
        <!-- Back Button -->
        <button 
          @click="$router.push(`/${userRole}/settings/profile-display`)"
          :disabled="!userRole"
          class="mb-6 inline-flex items-center gap-2 text-green-700 hover:text-green-600 transition-all duration-200 hover:gap-3 group"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 transition-transform group-hover:-translate-x-1">
            <path d="m15 18-6-6 6-6"/>
          </svg>
          <span class="font-medium">Back</span>
        </button>

        <!-- Reset Password Card -->
        <div class="bg-white/80 backdrop-blur-xl rounded-3xl border border-green-100/50 shadow-2xl shadow-green-500/10 overflow-hidden relative">
          <div class="absolute inset-0 bg-gradient-to-r from-green-500/20 via-green-500/20 to-green-500/20 animate-gradient-x opacity-50"></div>
          <div class="absolute inset-[1px] bg-white/90 backdrop-blur-xl rounded-3xl"></div>
          
          <div class="relative p-8 sm:p-10">
            <!-- Header -->
            <div class="text-center mb-10">
              <div class="flex justify-center mb-6">
                <div class="relative">
                  <div class="absolute inset-0 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl blur-lg opacity-30 animate-pulse"></div>
                  <div class="relative bg-gradient-to-r from-green-500 to-green-600 p-4 rounded-2xl">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-white">
                      <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
                      <path d="m7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                  </div>
                </div>
              </div>
              <h1 class="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-green-700 to-green-600 bg-clip-text text-transparent mb-3">
                Reset Password
              </h1>
              <p class="text-gray-600 text-base leading-relaxed max-w-sm mx-auto">
                Enter your email address and we'll send you a secure link to reset your password
              </p>
            </div>
            
            <!-- Form -->
            <form @submit.prevent="showConfirmationPopup = true" class="space-y-8">
              <div class="relative group">
                <div class="relative">
                  <input 
                    type="email" 
                    v-model="email" 
                    :class="{ 
                      'pt-7 pb-3': email,
                      'py-4': !email,
                      'border-red-300 focus:border-red-500 focus:ring-red-500/20': error,
                      'border-green-300 focus:border-green-500 focus:ring-green-500/20': !error,
                      'bg-gray-50': loading
                    }"
                    required
                    :disabled="loading"
                    class="w-full bg-white/70 backdrop-blur-sm border-2 rounded-2xl px-5 text-gray-800 focus:outline-none focus:ring-4 transition-all duration-300 text-lg placeholder-transparent peer"
                    placeholder="Email Address"
                  />
                  <label 
                    :class="{ 
                      'text-sm top-3 text-green-600': email,
                      'text-lg top-1/2 -translate-y-1/2 text-gray-500': !email,
                      'text-red-500': error && email
                    }"
                    class="absolute left-5 transition-all duration-300 pointer-events-none font-medium peer-focus:text-sm peer-focus:top-3 peer-focus:text-green-600"
                  >
                    Email Address
                  </label>
                  <div class="absolute right-4 top-1/2 -translate-y-1/2">
                    <div v-if="loading" class="w-5 h-5 border-2 border-green-300 border-t-green-600 rounded-full animate-spin"></div>
                    <svg v-else-if="isValidEmail && email" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-green-500">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    <svg v-else-if="error && email" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-red-500">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="15" y1="9" x2="9" y2="15"></line>
                      <line x1="9" y1="9" x2="15" y2="15"></line>
                    </svg>
                  </div>
                </div>

                <!-- Error Message -->
                <div v-if="error" class="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl">
                  <div class="flex items-start gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-red-500 mt-0.5 flex-shrink-0">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="15" y1="9" x2="9" y2="15"></line>
                      <line x1="9" y1="9" x2="15" y2="15"></line>
                    </svg>
                    <p class="text-red-700 text-sm font-medium">{{ error }}</p>
                  </div>
                </div>
              </div>

              <button 
                type="submit" 
                :disabled="loading || !isValidEmail || resendCooldown > 0"
                class="w-full relative overflow-hidden bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold px-8 py-4 rounded-2xl transition-all duration-300 shadow-lg shadow-green-500/25 hover:shadow-xl hover:shadow-green-500/30 hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:active:scale-100 group"
              >
                <div class="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span class="relative flex items-center justify-center gap-3 text-lg">
                  <span v-if="resendCooldown > 0" class="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="animate-spin">
                      <path d="M21 12a9 9 0 11-6.219-8.56"/>
                    </svg>
                    Wait {{ resendCooldown }}s
                  </span>
                  <span v-else-if="!loading" class="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="group-hover:rotate-12 transition-transform">
                      <path d="m22 2-7 20-4-9-9-4Z"/>
                      <path d="M22 2 11 13"/>
                    </svg>
                    Send Reset Link
                  </span>
                  <span v-else class="flex items-center gap-2">
                    <div class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Sending...
                  </span>
                </span>
              </button>
            </form>

            <!-- Success Message -->
            <div v-if="success" class="mt-8 p-5 bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-2xl">
              <div class="flex items-start gap-4">
                <div class="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-white">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                </div>
                <div>
                  <h3 class="font-semibold text-green-800 mb-1">Email Sent Successfully!</h3>
                  <p class="text-green-700 text-sm leading-relaxed">{{ success }}</p>
                </div>
              </div>
            </div>

            <div class="mt-10 text-center">
              <p class="text-gray-600">
                Remember your password? 
                <router-link 
                  :to="dashboardPath"
                  class="font-semibold text-green-700 hover:text-green-600 underline underline-offset-2 hover:underline-offset-4 transition-all"
                >
                  Back to Dashboard
                </router-link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Confirmation Popup -->
  <div v-if="showConfirmationPopup" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden transform transition-all">
      <div class="p-8">
        <div class="text-center mb-6">
          <h3 class="text-xl font-bold text-gray-800 mb-2">Confirm Reset Password</h3>
          <p class="text-gray-600 leading-relaxed">
            Are you sure you want to send a password reset link to:
          </p>
          <p class="font-semibold text-green-700 mt-2 p-3 bg-green-50 rounded-xl border border-green-200">
            {{ email || "your account email" }}
          </p>
        </div>
        <div class="flex gap-3">
          <button 
            @click="showConfirmationPopup = false" 
            class="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all duration-200 hover:-translate-y-0.5"
          >
            Cancel
          </button>
          <button 
            @click="proceedWithResetPassword" 
            class="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-xl transition-all duration-200 hover:-translate-y-0.5 shadow-lg shadow-green-500/25"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { getAuth, sendPasswordResetEmail, signOut } from "firebase/auth";
import { trackEvent } from "../../utils/analytics";
import { getFirestore, doc, getDoc } from 'firebase/firestore'
const userRole = ref('');
// Refs
const email = ref("");
const suggestedEmail = ref("");
const loading = ref(false);
const error = ref("");
const success = ref("");
const showConfirmation = ref(false);
const resendCooldown = ref(0);
const showConfirmationPopup = ref(false);
let cooldownInterval;

// Email validation
const isValidEmail = computed(() => {
  return /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(email.value);
});

// Email domain suggestions
const commonDomains = ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com"];
const suggestEmail = () => {
  const emailParts = email.value.split("@");
  if (emailParts.length === 2) {
    const [localPart, domainPart] = emailParts;
    const closestDomain = commonDomains.find(domain => {
      return domain.startsWith(domainPart.slice(0, 3));
    });
    suggestedEmail.value = closestDomain ? `${localPart}@${closestDomain}` : "";
  } else {
    suggestedEmail.value = "";
  }
};

// Watch email input
watch(email, () => {
  suggestEmail();
  if (error.value) error.value = "";
});

// Reset password logic
const resetPassword = async () => {
  if (!isValidEmail.value) {
    error.value = "Please enter a valid email address";
    return;
  }

  try {
    loading.value = true;
    trackEvent("ResetPasswordInitiated", { email: email.value });

    const auth = getAuth();
    await sendPasswordResetEmail(auth, email.value);

    success.value = "Password reset link has been sent to your email. Please check your inbox and spam folder.";
    trackEvent("ResetPasswordSuccess", { email: email.value });

    // Sign out the user after sending the reset link
    await signOut(auth);
    success.value += " You have been signed out for security reasons.";

    email.value = "";
    startCooldown();
  } catch (err) {
    switch (err.code) {
      case 'auth/user-not-found':
        error.value = "No account found with this email address";
        trackEvent("ResetPasswordError", { email: email.value, error: "user-not-found" });
        break;
      case 'auth/too-many-requests':
        error.value = "Too many attempts. Please try again later";
        trackEvent("ResetPasswordError", { email: email.value, error: "too-many-requests" });
        break;
      default:
        error.value = "Failed to send reset link. Please try again";
        trackEvent("ResetPasswordError", { email: email.value, error: "unknown" });
    }
  } finally {
    loading.value = false;
  }
};

// Cooldown logic
const startCooldown = () => {
  resendCooldown.value = 30;
  cooldownInterval = setInterval(() => {
    if (resendCooldown.value > 0) {
      resendCooldown.value--;
    } else {
      clearInterval(cooldownInterval);
    }
  }, 1000);
};

// User confirms via popup
const proceedWithResetPassword = async () => {
  showConfirmationPopup.value = false;

  // Auto-detect email if not manually typed
  const auth = getAuth();
  const user = auth.currentUser;
  if (!email.value && user && user.email) {
    email.value = user.email;
  }

  await resetPassword();
};

// Show confirmation modal
const confirmResetPassword = () => {
  showConfirmationPopup.value = true;
};

// ✅ Optional UX improvement: auto-fill email on load, but don’t send
onMounted(() => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (user && user.email) {
    email.value = user.email;
  }
});
onMounted(async () => {
  const auth = getAuth()
  const db = getFirestore()
  const user = auth.currentUser

  if (user) {
    const snap = await getDoc(doc(db, 'users', user.uid))
    userRole.value = snap.exists() ? snap.data().role || 'user' : 'user'
  }
});
const dashboardPath = computed(() => {
  return userRole.value ? `/${userRole.value}/dashboard` : 'user/dashboard';
});

</script>
