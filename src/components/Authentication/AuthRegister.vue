<template>
  <section class="backdrop-blur-md bg-white/10 border border-white/20 shadow-lg rounded-2xl p-6 sm:p-8 flex flex-col items-center max-w-6xl w-full mx-auto space-y-4">

    <!-- Compatibility Warning -->
    <p v-if="!isDeviceCompatible" class="text-xs text-red-400 text-center">
      ⚠️ Your device or browser may not be fully supported. For best results, use the latest Chrome, Firefox, or Edge.
    </p>

    <!-- Global Alert -->
    <transition name="slide-fade">
      <div v-if="globalAlert.show"
           :class="['p-3 rounded-lg flex items-center gap-2 w-full text-sm',
             globalAlert.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700']">
        <span>{{ globalAlert.message }}</span>
      </div>
    </transition>

    <!-- Header -->
    <header class="text-center space-y-1">
      <img src="/eco-mist-logo.png" alt="Eco-Mist Logo" class="w-12 h-12 mx-auto" />
      <h1 class="text-xl font-bold text-white">Register</h1>
      <p class="text-sm text-white/80">Create an account to get started</p>
    </header>

    <!-- Profile Image Upload -->
    <div class="flex flex-col items-center gap-2">
      <div class="relative w-24 h-24 rounded-full border-2 border-green-300 overflow-hidden bg-gray-100 shadow-inner">
        <img
  v-if="profileImagePreview"
  :src="profileImagePreview"
  alt="Profile Preview"
  class="object-cover w-full h-full"
/>
<img
  v-else
  src="/default-avatar.png"
  alt="Default Avatar"
  class="object-cover w-full h-full"
/>

      </div>
      <input id="profile-upload" type="file" accept="image/*" @change="handleProfileImageChange" class="hidden" />
      <label for="profile-upload" role="button" tabindex="0" class="text-xs text-green-300 cursor-pointer hover:underline">
  Upload Image
</label>

      <button v-if="profileImagePreview" @click="clearProfileImage" class="text-xs text-red-400 hover:underline">Remove</button>
      <p v-if="profileImageError" class="text-xs text-red-400">{{ profileImageError }}</p>
    </div>
    <div v-if="uploadingImage" class="flex items-center gap-2 text-green-300 text-xs">
  <svg class="animate-spin h-4 w-4" viewBox="0 0 24 24">
    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
  </svg>
  Uploading profile image...
</div>


    <!-- Form Inputs -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
      <div>
  <input
    v-model="registerForm.username"
    type="text"
    placeholder="Username"
    :class="[
      'w-full rounded-lg px-4 py-3 transition-all focus:outline-none focus:ring-1',
      registerErrors.username
        ? 'border-red-500 bg-red-100/40'
        : registerForm.username && registerForm.username.length >= 3
        ? 'border-green-500 bg-green-100/40'
        : 'bg-white/20 border-white/30 text-white placeholder-white/50'
    ]"
    :disabled="loading"
    required
  />
  <p v-if="registerErrors.username" class="text-red-400 text-xs mt-1">{{ registerErrors.username }}</p>
  <p v-else-if="registerForm.username && registerForm.username.length >= 3" class="text-green-400 text-xs mt-1">
    ✓ Username looks good!
  </p>
</div>


      <div>
  <input
    v-model="registerForm.completeName"
    type="text"
    placeholder="Full Name"
    :class="[
      'w-full rounded-lg px-4 py-3 transition-all focus:outline-none focus:ring-1',
      registerForm.completeName && registerForm.completeName.length >= 3
        ? 'border-green-500 bg-green-100/40'
        : 'bg-white/20 border-white/30 text-white placeholder-white/50'
    ]"
    :disabled="loading"
    required
  />
  <p v-if="registerForm.completeName && registerForm.completeName.length >= 3" class="text-green-400 text-xs mt-1">
    ✓ Looks good!
  </p>
</div>

  <div>
  <input
    v-model="registerForm.birthday"
    type="date"
    :class="[
      'w-full rounded-lg px-4 py-3 text-white transition-all focus:outline-none focus:ring-1',
      registerForm.birthday
        ? 'border-green-500 bg-green-100/40'
        : 'bg-white/20 border-white/30 placeholder-white/50'
    ]"
    :disabled="loading"
    required
  />
</div>

      <div>
  <input
    v-model="registerForm.cellphone"
    type="tel"
    placeholder="Cellphone"
    :class="[
      'w-full rounded-lg px-4 py-3 transition-all focus:outline-none focus:ring-1',
      registerForm.cellphone && registerForm.cellphone.length >= 10
        ? 'border-green-500 bg-green-100/40'
        : 'bg-white/20 border-white/30 text-white placeholder-white/50'
    ]"
    :disabled="loading"
    required
  />
  <p v-if="registerForm.cellphone && registerForm.cellphone.length >= 10" class="text-green-400 text-xs mt-1">
    ✓ Valid phone number
  </p>
</div>


     <div>
  <select
    v-model="registerForm.gender"
    :class="[
      'w-full rounded-lg px-4 py-3 transition-all focus:outline-none focus:ring-1 appearance-none',
      registerForm.gender
        ? 'border-green-500 bg-green-100/40 text-black'
        : 'bg-white/20 border-white/30 text-white placeholder-white/50'
    ]"
    :disabled="loading"
    required
  >
    <option value="" disabled>Select Gender</option>
    <option value="male">Male</option>
    <option value="female">Female</option>
    <option value="other">Other</option>
  </select>
</div>


      <div class="sm:col-span-2">
  <input
    v-model="registerForm.address"
    type="text"
    placeholder="Address"
    :class="[
      'w-full rounded-lg px-4 py-3 transition-all focus:outline-none focus:ring-1',
      registerForm.address && registerForm.address.length >= 5
        ? 'border-green-500 bg-green-100/40'
        : 'bg-white/20 border-white/30 text-white placeholder-white/50'
    ]"
    :disabled="loading"
    required
  />
  <p v-if="registerForm.address && registerForm.address.length >= 5" class="text-green-400 text-xs mt-1">
    ✓ Address looks good!
  </p>
</div>

    </div>

    <!-- Email -->
    <div class="w-full">
      <input
  v-model="registerForm.email"
  type="email"
  placeholder="Email"
  :class="[
    'w-full rounded-lg px-4 py-3 transition-all focus:outline-none focus:ring-1',
    registerErrors.email
      ? 'border-red-500 bg-red-100/40'
      : registerForm.email.includes('@')
      ? 'border-green-500 bg-green-100/40'
      : 'bg-white/20 border-white/30 text-white placeholder-white/50'
  ]"
/>
      <p v-if="registerForm.email.includes('@')" class="text-green-400 text-xs mt-1">✓ Email looks good!</p>
    </div>

    <!-- Password and Confirm Password -->
<div class="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
  <!-- Password Field -->
  <div class="relative">
    <input
      :type="showPassword ? 'text' : 'password'"
      v-model="registerForm.password"
      @input="validatePassword"
      placeholder="Password"
      :class="[
        'w-full rounded-lg px-4 py-3 transition-all focus:outline-none focus:ring-1',
        registerErrors.password
          ? 'border-red-500 bg-red-100/40'
          : passwordStrength.score >= 3
          ? 'border-green-500 bg-green-100/40'
          : 'bg-white/20 border-white/30 text-white placeholder-white/50'
      ]"
      :disabled="loading"
      required
      title="Must be at least 8 characters with 1 uppercase and 1 number"
    />

    <!-- Toggle Visibility -->
    <button
      type="button"
      class="absolute right-3 inset-y-0 my-auto text-gray-200 hover:text-green-300"
      @click="togglePassword"
      :disabled="loading"
      aria-label="Toggle password visibility"
    >
    </button>

    <!-- Feedback Message -->
    <p v-if="registerErrors.password" class="text-red-400 text-xs mt-1">
      {{ registerErrors.password }}
    </p>
    <p v-else class="text-xs mt-1" :class="{
      'text-red-400': passwordStrength.score < 2,
      'text-yellow-400': passwordStrength.score === 2,
      'text-green-400': passwordStrength.score >= 3
    }">
      Password Strength: {{ passwordStrength.feedback }}
    </p>

    <!-- Strength Bar -->
    <div class="w-full h-1 mt-1 rounded-full bg-gray-300">
      <div
        :class="{
          'bg-red-400': passwordStrength.score < 2,
          'bg-yellow-400': passwordStrength.score === 2,
          'bg-green-400': passwordStrength.score >= 3
        }"
        :style="{ width: passwordStrength.score * 33 + '%' }"
        class="h-full rounded-full transition-all"
      ></div>
    </div>
  </div>

  <!-- Confirm Password -->
  <div>
    <input
      :type="showPassword ? 'text' : 'password'"
      v-model="registerForm.confirmPassword"
      @input="validateConfirmPassword"
      placeholder="Confirm Password"
      :class="[
        'w-full rounded-lg px-4 py-3 transition-all focus:outline-none focus:ring-1',
        registerErrors.confirmPassword
          ? 'border-red-500 bg-red-100/40'
          : registerForm.confirmPassword &&
            registerForm.confirmPassword === registerForm.password
          ? 'border-green-500 bg-green-100/40'
          : 'bg-white/20 border-white/30 text-white placeholder-white/50'
      ]"
      :disabled="loading"
      required
    />

    <!-- Feedback -->
    <p v-if="registerErrors.confirmPassword" class="text-red-400 text-xs mt-1">
      {{ registerErrors.confirmPassword }}
    </p>
    <p v-else-if="registerForm.confirmPassword && registerForm.confirmPassword === registerForm.password"
       class="text-green-400 text-xs mt-1">
      ✓ Passwords match!
    </p>
  </div>
</div>

    <!-- Terms -->
<div class="flex flex-col w-full text-xs text-gray-100">
  <div class="flex items-center gap-2">
    <input
      type="checkbox"
      v-model="registerForm.agreeToTerms"
      id="terms"
      class="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
      :disabled="loading"
    />
    <label for="terms">
      I agree to the
      <button type="button" @click="$emit('showTerms')" class="text-green-300 hover:text-green-400 hover:underline">
        Terms of Service
      </button>
      and
      <button type="button" @click="$emit('showPrivacy')" class="text-green-300 hover:text-green-400 hover:underline">
        Privacy Policy
      </button>
    </label>
  </div>
  <p v-if="registerErrors.agreeToTerms" class="text-red-400 mt-1">
    {{ registerErrors.agreeToTerms }}
  </p>
</div>


    <!-- Register Button -->
    <button @click="handleRegister"
            class="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 active:scale-[0.98] transition disabled:opacity-50"
            :disabled="loading || !registerForm.agreeToTerms">
      <span v-if="!loading">Create Account</span>
      <span v-else class="flex items-center justify-center gap-2">
        <svg class="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" /><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" /></svg>
        Creating...
      </span>
    </button>

    <!-- Email Verification Notice -->
    <p v-if="showVerificationPrompt" class="text-xs text-green-200 text-center">
      Please check your email to verify your account.
    </p>

    <!-- Google Sign-Up -->
    <transition name="slide-fade">
      <button type="button"
              @click="handleGoogleSignUp"
              class="w-full mt-2 bg-white text-gray-700 font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-3"
              :disabled="loading">
        <img src="/google-icon.png" alt="Google" class="w-5 h-5" />
        <span v-if="!loading">Sign Up with Google</span>
        <span v-else class="flex items-center justify-center">
          <svg class="animate-spin h-4 w-4 text-gray-700" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" /><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
          Signing up...
        </span>
      </button>
    </transition>

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
import { reactive, ref, computed, onMounted} from "vue";
import { useRouter } from "vue-router";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../firebase"; // Adjust path as needed
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useToast } from "vue-toastification";
import { logAuthEvent } from "../../utils/logAuthEvent";
const toast = useToast();


const emit = defineEmits(['toggleView', 'showTerms', 'showPrivacy']);

const router = useRouter();
///add
const resetForm = () => {
  registerForm.username = "";
  registerForm.completeName = "";
  registerForm.birthday = "";
  registerForm.cellphone = "";
  registerForm.gender = "";
  registerForm.address = "";
  registerForm.email = "";
  registerForm.password = "";
  registerForm.confirmPassword = "";
  registerForm.agreeToTerms = false;
  profileImagePreview.value = null;
  profileImageError.value = "";
  Object.keys(registerErrors).forEach(key => registerErrors[key] = "");
};

///
const registerForm = reactive({
  username: "",
  completeName: "",
  birthday: "",
  cellphone: "",
  gender: "",
  address: "",
  email: "",
  password: "",
  confirmPassword: "",
  agreeToTerms: false,
});

const registerErrors = reactive({});
const profileImagePreview = ref(null);
const profileImageError = ref("");
const showPassword = ref(false);
const loading = ref(false);
const globalAlert = reactive({ show: false, message: "", type: "success" });
const showVerificationPrompt = ref(false);
const uploadingImage = ref(false);

const isDeviceCompatible = ref(true);

const validatePassword = () => {
  const pw = registerForm.password;
  if (!pw || pw.length < 8 || !/[A-Z]/.test(pw) || !/\d/.test(pw)) {
    registerErrors.password = "Password must be 8+ characters, include a number and uppercase letter.";
  } else {
    registerErrors.password = "";
  }
};

const validateConfirmPassword = () => {
  registerErrors.confirmPassword =
    registerForm.confirmPassword !== registerForm.password
      ? "Passwords do not match."
      : "";
};

const validateUsername = () => {
  registerErrors.username =
    !registerForm.username || registerForm.username.length < 3
      ? "Username must be at least 3 characters."
      : "";
};

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
    profileImageError.value = "Image must be under 5MB";
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

const handleRegister = async () => {
  validateUsername();
  validatePassword();
  validateConfirmPassword();

  if (
    registerErrors.username ||
    registerErrors.password ||
    registerErrors.confirmPassword ||
    !registerForm.agreeToTerms
  ) {
    globalAlert.message = "Some fields are invalid. Please check your inputs.";
    globalAlert.type = "error";
    globalAlert.show = true;
    return;
  }

  loading.value = true;
  globalAlert.show = false;

  try {
    // Step 1: Create Firebase user
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      registerForm.email,
      registerForm.password
    );
    const user = userCredential.user;
    await sendEmailVerification(user);

    // Step 2: Save additional data to Firestore
    const userRef = doc(db, "users", user.uid);
    await setDoc(userRef, {
      username: registerForm.username,
      email: registerForm.email,
      profileImageUrl: profileImagePreview.value || "",
      completeName: registerForm.completeName,
      birthday: registerForm.birthday,
      cellphone: registerForm.cellphone,
      gender: registerForm.gender,
      address: registerForm.address,
      role: "user",
      status: "active",
      createdAt: new Date().toISOString(),
      emailVerified: false,
      authProvider: "email",
      loginCount: 1,
    });

    globalAlert.message = "Account created successfully! Please verify your email.";
    globalAlert.type = "success";
    globalAlert.show = true;
    showVerificationPrompt.value = true;

    await logAuthEvent({
  type: "register",
  status: "success",
  email: registerForm.email,
  uid: user.uid,
  method: "email",
});


    resetForm(); 

    setTimeout(() => {
      globalAlert.message = "Account created successfully! Please verify your email.";
      toast.success("📩 A verification link has been sent to your Gmail. Please verify before logging in.");
      globalAlert.type = "success";
      globalAlert.show = true;
showVerificationPrompt.value = true;

  emit('toggleView'); // ✅ This tells the parent to show the Login page
}, 1000);
  } catch (error) {
    await logAuthEvent({
  type: "register",
  status: "failed",
  email: registerForm.email,
  reason: error.code || error.message,
});

    globalAlert.message = error.message || "Registration failed.";
    globalAlert.type = "error";
    globalAlert.show = true;
  } finally {
    loading.value = false;
  }
};

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

const handleGoogleSignUp = async () => {
  loading.value = true;
  globalAlert.show = false;

  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    const userRef = doc(db, "users", user.uid);
    await setDoc(userRef, {
      username: user.displayName || "GoogleUser",
      email: user.email,
      profileImageUrl: user.photoURL || "",
      completeName: user.displayName || "",
      birthday: "",
      cellphone: "",
      gender: "",
      address: "",
      role: "user",
      status: "active",
      createdAt: new Date().toISOString(),
      emailVerified: user.emailVerified,
      authProvider: "google",
      loginCount: 1,
    });

    globalAlert.message = "Signed up with Google successfully!";
    globalAlert.type = "success";
    globalAlert.show = true;

    await logAuthEvent({
  type: "register",
  status: "success",
  email: user.email,
  uid: user.uid,
  method: "google",
});


    router.push("/user/dashboard");
  } catch (err) {
    await logAuthEvent({
  type: "register",
  status: "failed",
  email: "", // user might not exist yet
  reason: err.code || err.message,
  method: "google",
});

    globalAlert.message = err.message || "Google Sign-In failed.";
    globalAlert.type = "error";
    globalAlert.show = true;
  } finally {
    loading.value = false;
  }
};

const passwordStrength = computed(() => {
  const pw = registerForm.password || "";
  let score = 0;
  if (/[A-Z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (pw.length >= 8) score++;

  const feedback = ["Very Weak", "Weak", "Moderate", "Strong"][score] || "";
  return { score, feedback };
});

const checkDeviceCompatibility = () => {
  const ua = navigator.userAgent.toLowerCase();
  isDeviceCompatible.value = /chrome|firefox|edg/.test(ua) && !/mobile/.test(ua);
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

