<template>
  <div
    class="min-h-screen relative bg-cover bg-bottom bg-no-repeat"
    style="background-image: url('/aeroponics_bg.png');"
    role="main"
    aria-label="User Authentication Page"
  >
    <!-- Overlay layers -->
    <div class="absolute inset-0 bg-black/30 z-0" aria-hidden="true"></div>

    <!-- High Contrast Mode Toggle -->
    <button
      @click="toggleHighContrast"
      class="absolute top-4 right-4 bg-gray-800 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-white"
      aria-label="Toggle High Contrast Mode"
    >
      Toggle High Contrast
    </button>

    <!-- Notification Dropdown -->
    <div class="absolute top-16 right-4 bg-white shadow-lg rounded-lg w-64" v-if="showNotifications">
      <div class="p-4 border-b">
        <h3 class="text-sm font-semibold text-gray-700">Notifications</h3>
      </div>
      <ul class="max-h-64 overflow-y-auto">
        <li
          v-for="(notification, index) in notifications"
          :key="index"
          class="p-4 border-b last:border-b-0 text-sm text-gray-600"
        >
          {{ notification }}
        </li>
      </ul>
      <button
        class="w-full text-center text-sm text-red-500 py-2 hover:bg-red-100"
        @click="clearNotifications"
      >
        Clear All
      </button>
    </div>

    <!-- Main content container -->
    <div
      class="relative z-10 flex flex-col min-h-screen"
      :class="{ 'high-contrast': isHighContrast }"
    >
      <!-- Navigation -->
      <AuthHeader @toggleMobileMenu="toggleMobileMenu" />

      <!-- Global Alert -->
      <AuthAlert :alert="globalAlert" @close="closeGlobalAlert" />

      <!-- Centered Login/Register card container with margin-top -->
      <div class="flex-grow flex justify-center items-center mt-16 px-4 py-8">
        <transition name="slide-fade" mode="out-in">
          <AuthLogin
            v-if="isLoginView"
            :loginForm="loginForm"
            :loginErrors="loginErrors"
            :loading="loading"
            :showPassword="showPassword"
            :togglePassword="togglePassword"
            :loginUser="loginUser"
            @toggleView="toggleView"
            key="login-form"
            aria-label="Login Form"
          />
          <AuthRegister
            v-else
            :registerForm="registerForm"
            :registerErrors="registerErrors"
            :loading="loading"
            :showPassword="showPassword"
            :profileImagePreview="profileImagePreview"
            :profileImageError="profileImageError"
            :togglePassword="togglePassword"
            :handleProfileImageChange="handleProfileImageChange"
            :clearProfileImage="clearProfileImage"
            :registerUser="registerUser"
            @toggleView="toggleView"
            @showTerms="showTermsModal = true"
            @showPrivacy="showPrivacyModal = true"
            key="register-form"
            aria-label="Registration Form"
          />
        </transition>
      </div>

      <!-- Terms and Privacy modals -->
      <AuthTerms
        :show="showTermsModal"
        @close="showTermsModal = false"
        @accept="acceptTerms"
        aria-label="Terms of Service Modal"
      >
        <template #default>
          <p class="text-sm text-gray-500 mb-4">Last updated: May 7, 2025</p>
          <p class="text-sm text-gray-600">
            By accessing or using Eco-Mist's services, you agree to be bound by these Terms of Service.
          </p>
        </template>
      </AuthTerms>

      <AuthPrivacy
        :show="showPrivacyModal"
        @close="showPrivacyModal = false"
        @accept="acceptPrivacy"
        aria-label="Privacy Policy Modal"
      >
        <template #default>
          <p class="text-sm text-gray-500 mb-4">Last updated: May 7, 2025</p>
          <p class="text-sm text-gray-600">
            We collect personal information to provide our services and ensure a secure experience.
          </p>
        </template>
      </AuthPrivacy>

      <!-- Footer -->
      <AuthFooter />
    </div>
  </div>
</template>

<script setup>
import AuthHeader from '../components/Authentication/AuthHeader.vue';
import AuthAlert from '../components/Authentication/AuthAlert.vue';
import AuthLogin from '../components/Authentication/AuthLogin.vue';
import AuthRegister from '../components/Authentication/AuthRegister.vue';
import AuthTerms from '../components/Authentication/AuthTerms.vue';
import AuthPrivacy from '../components/Authentication/AuthPrivacy.vue';
import AuthFooter from '../components/Authentication/AuthFooter.vue';

import { ref, reactive, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, sendEmailVerification, signOut, setPersistence, browserLocalPersistence, browserSessionPersistence, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { db, storage } from "../firebase";
import { doc, setDoc, getDoc, updateDoc, increment } from "firebase/firestore";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import zxcvbn from "zxcvbn";
import { useToast } from "vue-toastification";

const toast = useToast();
const router = useRouter();
const auth = getAuth();

const isLoginView = ref(true);
const loading = ref(false);
const showPassword = ref(false);
const showTermsModal = ref(false);
const showPrivacyModal = ref(false);
const profileImagePreview = ref(null);
const profileImageFile = ref(null);
const profileImageError = ref("");
const isHighContrast = ref(false);
const notifications = ref([]);
const showNotifications = ref(false);

const globalAlert = reactive({
  show: false,
  type: "success",
  title: "",
  message: "",
  timeout: null
});

const loginForm = reactive({
  email: "",
  password: "",
  rememberMe: false
});

const registerForm = reactive({
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
  agreeToTerms: false
});

const loginErrors = reactive({
  email: "",
  password: ""
});

const registerErrors = reactive({
  username: "",
  email: "",
  password: "",
  confirmPassword: ""
});

const toggleView = () => {
  isLoginView.value = !isLoginView.value;

  // Reset login form and errors
  loginForm.email = "";
  loginForm.password = "";
  loginForm.rememberMe = false;
  loginErrors.email = "";
  loginErrors.password = "";

  // Reset register form and errors
  registerForm.username = "";
  registerForm.email = "";
  registerForm.password = "";
  registerForm.confirmPassword = "";
  registerForm.agreeToTerms = false;
  registerErrors.username = "";
  registerErrors.email = "";
  registerErrors.password = "";
  registerErrors.confirmPassword = "";

  // Reset additional states
  profileImagePreview.value = null;
  profileImageError.value = "";
  showPassword.value = false;
};

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

const toggleHighContrast = () => {
  isHighContrast.value = !isHighContrast.value;
  document.body.classList.toggle("high-contrast", isHighContrast.value);
};

const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value;
};

const addNotification = (message) => {
  notifications.value.push(message);
  toast.success(message);
};

const clearNotifications = () => {
  notifications.value = [];
  toast.info("All notifications cleared.");
};

const showAlert = (type, title, message, duration = 5000) => {
  if (globalAlert.timeout) clearTimeout(globalAlert.timeout);
  globalAlert.type = type;
  globalAlert.title = title;
  globalAlert.message = message;
  globalAlert.show = true;
  globalAlert.timeout = setTimeout(closeGlobalAlert, duration);

  // Add to persistent notifications
  addNotification(`${title}: ${message}`);
};

const closeGlobalAlert = () => {
  globalAlert.show = false;
};

const handleProfileImageChange = (event) => {
  const file = event.target.files[0];
  profileImageError.value = "";
  if (!file) {
    profileImageFile.value = null;
    profileImagePreview.value = null;
    return;
  }
  const validTypes = ["image/jpeg", "image/png", "image/gif"];
  if (!validTypes.includes(file.type)) {
    profileImageError.value = "Invalid image file (JPEG, PNG, GIF)";
    event.target.value = null;
    return;
  }
  if (file.size > 2 * 1024 * 1024) {
    profileImageError.value = "Image size must be < 2MB";
    event.target.value = null;
    return;
  }
  profileImageFile.value = file;
  const reader = new FileReader();
  reader.onload = (e) => (profileImagePreview.value = e.target.result);
  reader.readAsDataURL(file);
};

const clearProfileImage = () => {
  profileImageFile.value = null;
  profileImagePreview.value = null;
  profileImageError.value = "";
  const fileInput = document.getElementById("profile-upload");
  if (fileInput) fileInput.value = "";
};

const passwordStrength = computed(() => {
  if (!registerForm.password) return { score: 0, feedback: "Enter a password" };
  const result = zxcvbn(registerForm.password);
  let feedback = result.feedback.suggestions.join(" ") || "Add numbers, symbols, and uppercase letters.";
  if (result.score === 2) feedback = "Fair password, could be stronger.";
  else if (result.score === 3) feedback = "Good password!";
  else if (result.score === 4) feedback = "Strong password!";
  return { score: result.score, feedback };
});

const loginUser = async () => {
  loginErrors.email = "";
  loginErrors.password = "";
  if (!loginForm.email) {
    loginErrors.email = "Email is required";
    return;
  }
  if (!loginForm.password) {
    loginErrors.password = "Password is required";
    return;
  }
  loading.value = true;
  try {
    await setPersistence(auth, loginForm.rememberMe ? browserLocalPersistence : browserSessionPersistence);
    const { user } = await signInWithEmailAndPassword(auth, loginForm.email, loginForm.password);
    if (!user.emailVerified) {
      loginErrors.email = "Please verify your email.";
      await signOut(auth);
      showAlert("error", "Email Not Verified", "Please check your inbox.");
      return;
    }
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) {
      loginErrors.email = "User data not found.";
      await signOut(auth);
      showAlert("error", "Error", "User data missing. Contact support.");
      return;
    }
    const userData = userSnap.data();
    if (userData.status === "deactivated") {
      loginErrors.email = "Your account is deactivated.";
      await signOut(auth);
      showAlert("error", "Account Deactivated", "Contact support for help.");
      return;
    }
    await updateDoc(userRef, { lastLogin: new Date().toISOString(), loginCount: increment(1) });
    localStorage.setItem("userRole", userData.role);
    showAlert("success", "Login Successful", "Redirecting...");
    setTimeout(() => {
      router.push(userData.role === "admin" ? "/admin-dashboard" : "/user/dashboard");
    }, 1000);
  } catch (error) {
    console.error(error);
    if (error.code === "auth/user-not-found") loginErrors.email = "No account found.";
    else if (error.code === "auth/wrong-password") loginErrors.password = "Incorrect password.";
    else showAlert("error", "Login Failed", error.message);
  } finally {
    loading.value = false;
  }
};

const registerUser = async () => {
  registerErrors.username = "";
  registerErrors.email = "";
  registerErrors.password = "";
  registerErrors.confirmPassword = "";
  if (!registerForm.username || registerForm.username.length < 3) {
    registerErrors.username = "Username must be at least 3 characters";
    return;
  }
  if (!registerForm.email.includes("@")) {
    registerErrors.email = "Invalid email";
    return;
  }
  if (registerForm.password.length < 8) {
    registerErrors.password = "Password must be at least 8 characters";
    return;
  }
  if (registerForm.password !== registerForm.confirmPassword) {
    registerErrors.confirmPassword = "Passwords do not match";
    return;
  }
  if (!registerForm.agreeToTerms) {
    showAlert("error", "Terms Required", "Please accept the Terms and Privacy Policy.");
    return;
  }
  loading.value = true;
  try {
    const { user } = await createUserWithEmailAndPassword(auth, registerForm.email, registerForm.password);
    let photoURL = null;
    if (profileImageFile.value) {
      const imageRef = storageRef(storage, `profile_images/${user.uid}`);
      await uploadBytes(imageRef, profileImageFile.value);
      photoURL = await getDownloadURL(imageRef);
    }
    await updateProfile(user, { displayName: registerForm.username, photoURL });
    await sendEmailVerification(user);
    await setDoc(doc(db, "users", user.uid), {
      username: registerForm.username,
      email: registerForm.email,
      photoURL,
      role: "user",
      status: "active",
      createdAt: new Date().toISOString(),
      emailVerified: false,
      authProvider: "email",
      loginCount: 0
    });
    await signOut(auth);
    toggleView(); // Redirect to login module
    showAlert("success", "Registration Successful", "Verify your email before logging in.");
  } catch (error) {
    console.error(error);
    if (error.code === "auth/email-already-in-use") registerErrors.email = "Email already registered.";
    else showAlert("error", "Registration Failed", error.message);
  } finally {
    loading.value = false;
  }
};

const handleGoogleSignIn = async () => {
  try {
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
    } else {
      await updateDoc(userRef, { lastLogin: new Date().toISOString(), loginCount: increment(1) });
    }

    localStorage.setItem("userRole", userSnap.exists() ? userSnap.data().role : "user");
    showAlert("success", "Login Successful", "Redirecting...");
    setTimeout(() => {
      router.push(userSnap.exists() && userSnap.data().role === "admin" ? "/admin-dashboard" : "/user/dashboard");
    }, 1000);
  } catch (error) {
    console.error(error);
    showAlert("error", "Google Sign-In Failed", error.message || "An error occurred during Google Sign-In.");
  }
};

const acceptTerms = () => {
  registerForm.agreeToTerms = true;
  showTermsModal.value = false;
};
const acceptPrivacy = () => {
  registerForm.agreeToTerms = true;
  showPrivacyModal.value = false;
};

onMounted(() => {
  setTimeout(() => {
    const firstInput = document.querySelector(isLoginView.value ? "#login-email" : "input[type='text']");
    if (firstInput) firstInput.focus();
  }, 500);
});

const toggleMobileMenu = () => {
  console.log("Mobile menu toggled");
};
</script>

<style>
.high-contrast {
  filter: contrast(2);
}

.high-contrast * {
  outline: 2px solid yellow !important;
}
</style>
