<template>
  <section
    class="backdrop-blur-md bg-white/10 border border-white/20 shadow-lg rounded-2xl p-6 sm:p-8 flex flex-col items-center max-w-xl w-full mx-auto"
  >
    <!-- Device Compatibility Warning -->
    <p v-if="!isDeviceCompatible" class="text-xs text-red-400 mb-4">
      Your device or browser may not be fully supported. For the best experience, use the latest version of Chrome, Firefox, or Edge.
    </p>

    <!-- Global Alert -->
    <transition name="fade">
      <div
        v-if="globalAlert.show"
        :class="[ 
          'p-3 rounded-lg flex items-center gap-2 mb-4 w-full transition-transform transform',
          globalAlert.type === 'error' ? 'bg-red-100 text-red-700 scale-105' : 'bg-green-100 text-green-700 scale-105'
        ]"
        role="alert"
        aria-live="assertive"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-5 h-5 flex-shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            v-if="globalAlert.type === 'error'"
            d="M12 9v2m0 4h.01M12 17a9 9 0 110-18 9 9 0 010 18z"
          />
          <path v-else d="M5 13l4 4L19 7" />
        </svg>
        <span>{{ globalAlert.message }}</span>
      </div>
    </transition>

    <!-- Header -->
    <transition name="slide-fade">
      <header class="flex flex-col items-center mb-6 text-center">
        <img src="/eco-mist-logo.png" alt="Eco-Mist Logo" class="w-12 h-12 mb-2" />
        <h1 class="text-xl font-bold text-white">Register</h1>
        <p class="text-white/80 text-sm mt-2">
          Create an account to access our IoT-driven platform and maximize your crop yield.
        </p>
      </header>
    </transition>

    <!-- Profile Image and Username -->
    <transition-group name="fade" tag="div" class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4 w-full">
      <div class="flex flex-col items-center sm:col-span-1" :key="'profile-image'">
        <div
          class="relative w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-green-200"
        >
          <img
            v-if="profileImagePreview"
            :src="profileImagePreview"
            alt="Profile Preview"
            class="w-full h-full object-cover"
          />
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="text-gray-400"
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </div>
        <label
          v-if="!uploadingImage"
          for="profile-upload"
          class="block text-xs font-medium text-gray-100 mt-2 cursor-pointer"
        >
          Upload Picture
        </label>
        <span
          v-else
          class="block text-xs font-medium text-gray-100 mt-2"
        >
          Uploading...
        </span>
        <input
          id="profile-upload"
          type="file"
          accept="image/*"
          @change="handleProfileImageChange"
          class="hidden"
          :disabled="loading || uploadingImage"
        />
        <button
          v-if="profileImagePreview"
          type="button"
          @click="clearProfileImage"
          class="mt-1 text-xs text-gray-400 hover:text-red-500"
          :disabled="loading || uploadingImage"
        >
          Remove
        </button>
        <p v-if="profileImageError" class="text-red-400 text-xs mt-1">{{ profileImageError }}</p>
      </div>

      <!-- Username Field -->
      <div class="sm:col-span-2 flex flex-col justify-center" :key="'username-field'">
        <input
          type="text"
          v-model="registerForm.username"
          :class="[ 
            'w-full rounded-lg px-4 py-3 transition-all focus:outline-none focus:ring-1',
            registerErrors.username ? 'border-red-500 bg-red-100/40' : registerForm.username && registerForm.username.length >= 3 ? 'border-green-500 bg-green-100/40' : 'bg-white/20 border-white/30 text-white placeholder-white/50'
          ]"
          required
          placeholder="Username"
          :disabled="loading"
          title="Enter a unique username with at least 3 characters"
        />
        <p v-if="registerErrors.username" class="text-red-400 text-xs mt-1">{{ registerErrors.username }}</p>
        <p v-else-if="registerForm.username && registerForm.username.length >= 3" class="text-green-400 text-xs mt-1">
          Username looks good!
        </p>
      </div>
    </transition-group>

    <!-- Email -->
    <transition name="fade">
      <div class="w-full mb-4">
        <input
          type="email"
          v-model="registerForm.email"
          :class="[
            'w-full rounded-lg px-4 py-3 transition-all focus:outline-none focus:ring-1',
            registerErrors.email ? 'border-red-500 bg-red-100/40' : registerForm.email && registerForm.email.includes('@') ? 'border-green-500 bg-green-100/40' : 'bg-white/20 border-white/30 text-white placeholder-white/50'
          ]"
          required
          placeholder="Email"
          :disabled="loading"
          title="Enter a valid email address"
        />
        <p v-if="registerErrors.email" class="text-red-400 text-xs mt-1">{{ registerErrors.email }}</p>
        <p v-else-if="registerForm.email && registerForm.email.includes('@')" class="text-green-400 text-xs mt-1">
          Email looks good!
        </p>
      </div>
    </transition>

    <!-- Passwords -->
    <transition-group name="fade" tag="div" class="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mb-4">
      <!-- Password -->
      <div class="relative" key="password-input">
        <input
          :type="showPassword ? 'text' : 'password'"
          v-model="registerForm.password"
          @input="validatePassword"
          :class="[ 
            'w-full rounded-lg px-4 py-3 transition-all focus:outline-none focus:ring-1',
            registerErrors.password ? 'border-red-500 bg-red-100/40' : passwordStrength.score >= 3 ? 'border-green-500 bg-green-100/40' : 'bg-white/20 border-white/30 text-white placeholder-white/50'
          ]"
          required
          placeholder="Password"
          :disabled="loading"
          title="Enter a strong password with at least 8 characters, one uppercase letter, and one number"
        />
        <button
          type="button"
          class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-200 hover:text-green-300"
          @click="togglePassword"
          :disabled="loading"
          aria-label="Toggle password visibility"
        >
          <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none"
               stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
            <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
            <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
            <line x1="2" x2="22" y1="2" y2="22" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none"
               stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </button>
        <p v-if="registerErrors.password" class="text-red-400 text-xs mt-1">{{ registerErrors.password }}</p>
        <p v-else class="text-xs mt-1" :class="{
          'text-red-400': passwordStrength.score < 2,
          'text-yellow-400': passwordStrength.score === 2,
          'text-green-400': passwordStrength.score >= 3
        }">
          Password Strength: {{ passwordStrength.feedback }}
        </p>
        <div class="w-full h-1 mt-1 rounded-full bg-gray-300">
          <div
            :class="{
              'bg-red-400': passwordStrength.score < 2,
              'bg-yellow-400': passwordStrength.score === 2,
              'bg-green-400': passwordStrength.score >= 3
            }"
            :style="{ width: passwordStrength.score * 25 + '%' }"
            class="h-full rounded-full transition-all"
          ></div>
        </div>
      </div>

      <!-- Confirm Password -->
      <div key="confirm-password-input">
        <input
          :type="showPassword ? 'text' : 'password'"
          v-model="registerForm.confirmPassword"
          @input="validateConfirmPassword"
          :class="[ 
            'w-full rounded-lg px-4 py-3 transition-all focus:outline-none focus:ring-1',
            registerErrors.confirmPassword ? 'border-red-500 bg-red-100/40' : registerForm.confirmPassword && registerForm.confirmPassword === registerForm.password ? 'border-green-500 bg-green-100/40' : 'bg-white/20 border-white/30 text-white placeholder-white/50'
          ]"
          required
          placeholder="Confirm Password"
          :disabled="loading"
          title="Re-enter your password to confirm"
        />
        <p v-if="registerErrors.confirmPassword" class="text-red-400 text-xs mt-1">{{ registerErrors.confirmPassword }}</p>
        <p v-else-if="registerForm.confirmPassword && registerForm.confirmPassword === registerForm.password" class="text-green-400 text-xs mt-1">
          Passwords match!
        </p>
      </div>
    </transition-group>

    <!-- Terms Agreement -->
    <transition name="fade">
      <div class="flex items-center mb-4 w-full">
        <input
          type="checkbox"
          v-model="registerForm.agreeToTerms"
          id="terms"
          class="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
          :disabled="loading"
          title="You must agree to the terms and privacy policy to proceed"
        />
        <label for="terms" class="ml-2 text-xs text-gray-100">
          I agree to the
          <button type="button" @click="$emit('showTerms')" class="text-green-300 hover:text-green-400 hover:underline">
            Terms of Service
          </button>
          and
          <button type="button" @click="$emit('showPrivacy')" class="text-green-300 hover:text-green-400 hover:underline">
            Privacy Policy
          </button>
        </label>
        <p v-if="registerErrors.agreeToTerms" class="text-red-400 text-xs mt-1">{{ registerErrors.agreeToTerms }}</p>
      </div>
    </transition>

    <!-- Submit Button -->
    <transition name="slide-fade">
      <button
        type="button"
        @click="handleRegister"
        class="w-full bg-gradient-to-r from-green-600 to-green-500 text-white font-semibold px-6 py-3 rounded-lg hover:-translate-y-1 transition-transform shadow-green-500/30 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
        :disabled="loading || !registerForm.agreeToTerms"
        title="Click to create your account"
      >
        <span v-if="!loading">Create Account</span>
        <span v-else class="flex items-center justify-center">
          <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
               viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
            </path>
          </svg>
          Creating account...
        </span>
      </button>
    </transition>

    <!-- Mail Verification Prompt -->
    <p v-if="showVerificationPrompt" class="text-xs text-white/80 mt-2">
      Please check your email to verify your account.
    </p>

    <!-- Google Sign-Up -->
    <transition name="fade">
      <button
        type="button"
        @click="handleGoogleSignUp"
        class="w-full mt-4 bg-white text-gray-700 font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 hover:shadow-lg transition-all shadow-md active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
        :disabled="loading"
        title="Sign up with Google"
      >
        <img src="/google-icon.png" alt="Google Icon" class="w-5 h-5" />
        <span v-if="!loading">Sign Up with Google</span>
        <span v-else class="flex items-center justify-center">
          <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none"
               viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
            </path>
          </svg>
          Signing up...
        </span>
      </button>
    </transition>

    <!-- Toggle View Prompt -->
    <transition name="fade">
      <p class="text-xs text-white/80 mt-4">
        Already have an account?
        <button @click="$emit('toggleView')" class="text-green-300 hover:text-green-400 hover:underline">
          Login
        </button>
      </p>
    </transition>
  </section>
</template>

<script setup>
import { reactive, ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth, db, signInWithGoogle } from "../../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

const props = defineProps({
  registerForm: Object,
  registerErrors: Object,
  loading: Boolean,
  showPassword: Boolean,
  profileImagePreview: String,
  profileImageError: String,
  handleProfileImageChange: Function,
  clearProfileImage: Function,
  togglePassword: Function,
  registerUser: Function,
});

const globalAlert = reactive({
  show: false,
  message: '',
  type: 'success',
});

const uploadingImage = ref(false);
const showVerificationPrompt = ref(false);
const isDeviceCompatible = ref(true);
const router = useRouter();

const passwordStrength = computed(() => {
  const password = props.registerForm.password || "";
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const isLongEnough = password.length >= 8;
  if (password.length === 0) return { score: 0, feedback: "" };
  let score = 0;
  if (hasUppercase) score++;
  if (hasNumber) score++;
  if (isLongEnough) score++;
  let feedback = "";
  switch (score) {
    case 0:
    case 1:
      feedback = "Very Weak";
      break;
    case 2:
      feedback = "Weak";
      break;
    case 3:
      feedback = "Moderate";
      break;
    case 4:
      feedback = "Strong";
      break;
  }
  return { score, feedback };
});

const passwordStrengthWidth = computed(() => {
  switch (passwordStrength.value) {
    case "Strong": return "100%";
    case "Moderate": return "66%";
    case "Weak": return "33%";
    default: return "0%";
  }
});

const handleRegister = async () => {
  validateUsername();
  if (props.registerErrors.username) return;

  try {
    globalAlert.show = false;
    await props.registerUser();
    globalAlert.message = "Account created successfully!";
    globalAlert.type = "success";
    globalAlert.show = true;
    showVerificationPrompt.value = true;
  } catch (error) {
    globalAlert.message = error.message || "An error occurred during registration.";
    globalAlert.type = "error";
    globalAlert.show = true;
    showVerificationPrompt.value = false;
  }
};

const handleGoogleSignUp = async () => {
  try {
    globalAlert.show = false;
    const provider = new GoogleAuthProvider();
    const { user } = await signInWithPopup(auth, provider);
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      await setDoc(userRef, {
        username: user.displayName || "Google User",
        email: user.email,
        photoURL: user.photoURL,
        role: "user",
        status: "active",
        createdAt: new Date().toISOString(),
        emailVerified: user.emailVerified,
        authProvider: "google",
        loginCount: 1,
      });
    }

    globalAlert.message = "Signed up successfully with Google!";
    globalAlert.type = "success";
    globalAlert.show = true;
    showVerificationPrompt.value = true;
    router.push("/user/dashboard");
  } catch (error) {
    console.error(error);
    globalAlert.message = error.message || "An error occurred during Google Sign-Up.";
    globalAlert.type = "error";
    globalAlert.show = true;
    showVerificationPrompt.value = false;
  }
};

const checkDeviceCompatibility = () => {
  const ua = navigator.userAgent.toLowerCase();
  const isSupported = /chrome|firefox|edg/.test(ua);
  const isMobile = /android|iphone|ipad|mobile/.test(ua);
  isDeviceCompatible.value = isSupported && !isMobile;
};

const validatePassword = () => {
  if (!registerForm.password) {
    registerErrors.password = "Password is required.";
    return;
  }
  if (registerForm.password.length < 8) {
    registerErrors.password = "Password must be at least 8 characters.";
    return;
  }
  registerErrors.password = "";
};

const validateConfirmPassword = () => {
  if (registerForm.confirmPassword !== registerForm.password) {
    registerErrors.confirmPassword = "Passwords do not match.";
  } else {
    registerErrors.confirmPassword = "";
  }
};

const validateUsername = () => {
  if (!props.registerForm.username || props.registerForm.username.length < 3) {
    props.registerErrors.username = "Username must be at least 3 characters.";
  } else {
    props.registerErrors.username = "";
  }
};

const profileImagePreview = ref(null);

const handleProfileImageChange = (event) => {
  const file = event.target.files[0];
  profileImageError.value = "";
  if (!file) {
    profileImagePreview.value = null;
    return;
  }
  const validTypes = ["image/jpeg", "image/png", "image/gif"];
  if (!validTypes.includes(file.type)) {
    profileImageError.value = "Invalid image file (JPEG, PNG, GIF)";
    return;
  }
  if (file.size > 5 * 1024 * 1024) {
    profileImageError.value = "Image file size must be less than 5MB";
    return;
  }
  const reader = new FileReader();
  reader.onload = (e) => {
    profileImagePreview.value = e.target.result;
  };
  reader.readAsDataURL(file);
};

const clearProfileImage = () => {
  profileImagePreview.value = null;
  profileImageError.value = "";
};

onMounted(() => {
  checkDeviceCompatibility();
});
</script>

<style>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
.slide-fade-enter-active, .slide-fade-leave-active {
  transition: all 0.5s ease;
}
.slide-fade-enter-from {
  transform: translateY(-10px);
  opacity: 0;
}
.slide-fade-leave-to {
  transform: translateY(10px);
  opacity: 0;
}
</style>

