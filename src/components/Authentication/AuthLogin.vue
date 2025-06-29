<template>
  <section
    class="backdrop-blur-md bg-white/10 border border-white/20 shadow-lg rounded-2xl p-6 sm:p-8 flex flex-col items-center max-w-md w-full mx-auto"
  >
    <!-- Header -->
    <header class="flex flex-col items-center mb-6 text-center">
      <img src="/eco-mist-logo.png" alt="Eco-Mist Logo" class="w-12 h-12 mb-2" />
      <h1 class="text-xl font-bold text-white">Login</h1>
      <p class="text-white/80 text-sm mt-2">
        Log in to access your Eco-Mist dashboard and monitor your aeroponics system.
      </p>
    </header>

    <!-- Form -->
    <form @submit.prevent="loginUser" class="w-full space-y-6" aria-label="Login Form">
      <div class="space-y-4">
        <!-- Email Field -->
        <div class="relative">
          <input
            id="login-email"
            type="email"
            v-model="loginForm.email"
            :class="[
              'w-full rounded-lg px-4 py-3 transition-all focus:outline-none focus:ring-1',
              loginErrors.email ? 'border-red-500 bg-red-100/40' :
              loginForm.email && loginForm.email.includes('@') ? 'border-green-500 bg-green-100/40' :
              'bg-white/20 border-white/30 text-white placeholder-white/50'
            ]"
            required
            placeholder="Email"
            :disabled="loading"
          />
          <div
  v-if="loginForm.email && !loginErrors.email && loginForm.email.includes('@')"
  class="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 bg-white rounded-full p-1 shadow"
>
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
       stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M22 4 12 14.01 9 11.01" />
  </svg>
</div>

          <p v-if="loginErrors.email" class="text-red-400 text-xs mt-1 flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none"
                 stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" x2="12" y1="8" y2="12" />
              <line x1="12" x2="12.01" y1="16" y2="16" />
            </svg>
            <span>{{ loginErrors.email }}</span>
          </p>
        </div>

        <!-- Password Field -->
        <div class="relative">
  <input
    :type="showPassword ? 'text' : 'password'"
    v-model="loginForm.password"
    class="w-full rounded-lg px-4 py-3 pr-12 transition-all focus:outline-none focus:ring-1 bg-white/20 border-white/30 text-white placeholder-white/50"
    required
    placeholder="Password"
    :disabled="loading"
  />
  <!-- Password Visibility Toggle Button with Lordicon -->
<button
  type="button"
  @click="togglePassword"
  class="absolute right-3 top-1/2 -translate-y-1/2"
>
  <lord-icon
    v-if="!showPassword"
    src="https://cdn.lordicon.com/dxjqoygy.json"
    trigger="hover"
    colors="primary:#ffffff"
    style="width:28px;height:28px"
  ></lord-icon>

  <lord-icon
    v-else
    src="https://cdn.lordicon.com/dnmvmpfk.json" 
    trigger="hover"
    colors="primary:#ffffff"
    style="width:28px;height:28px"
  ></lord-icon>
</button>

</div>

      </div>

      <!-- Remember Me & Forgot Password -->
      <div class="flex items-center justify-between">
        <label class="flex items-center cursor-pointer text-sm text-gray-100">
          <input
            type="checkbox"
            v-model="loginForm.rememberMe"
            class="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
            :disabled="loading"
          />
          <span class="ml-2">Remember me</span>
        </label>
        <button
          type="button"
          class="text-sm text-green-300 hover:text-green-400 hover:underline"
          @click="showResetPasswordModal = true"
        >
          Forgot password?
        </button>
      </div>

      <!-- Login Button -->
      <button
        type="submit"
        class="w-full bg-gradient-to-r from-green-600 to-green-500 text-white font-semibold px-6 py-3 rounded-lg hover:-translate-y-1 transition-transform shadow-green-500/30 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
        :disabled="loading || !loginForm.email || !loginForm.password"
      >
        <span v-if="!loading">Login</span>
        <span v-else class="flex items-center justify-center">
          <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
               viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Logging in...
        </span>
      </button>

      <!-- Resend Email Verification -->
      <button
        v-if="loginErrors.email === 'Please verify your email.'"
        type="button"
        @click="resendEmailVerification"
        class="w-full mt-4 bg-yellow-500 text-white font-semibold px-6 py-3 rounded-lg hover:bg-yellow-600 transition-all shadow-md active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
        :disabled="loading"
      >
        Resend Verification Email
      </button>

      <!-- Google Sign-In -->
      <button
        type="button"
        @click="handleGoogleSignIn"
        class="w-full bg-white text-gray-700 font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 hover:shadow-lg transition-all shadow-md active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
        :disabled="loading"
      >
        <img src="/google-icon.png" alt="Google Icon" class="w-5 h-5" />
        <span v-if="!loading">Sign in with Google</span>
        <span v-else class="flex items-center justify-center">
          <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none"
               viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Signing in...
        </span>
      </button>

      <!-- Toggle View Prompt -->
      <p class="text-xs text-white/80 mt-4 text-center">
        Don't have an account?
        <button type= "button" @click="$emit('toggleView')" class="text-green-300 hover:text-green-400 hover:underline">
          Register
        </button>
      </p>
    </form>

    <!-- Reset Password Modal -->
    <ResetPasswordModal
      :show="showResetPasswordModal"
      @close="showResetPasswordModal = false"
    />

    <!-- Notification -->
    <div
      v-if="notification.show"
      :class="[
        'fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50',
        notification.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
      ]"
    >
      {{ notification.message }}
    </div>
  </section>
</template>

<script setup>
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { signInWithEmailAndPassword, sendEmailVerification, signOut, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../firebase";
import { doc, getDoc, setDoc, updateDoc, increment } from "firebase/firestore"; // Added updateDoc and increment
import { db } from "../../firebase";
import ResetPasswordModal from "./AuthResetPassword.vue";

// Define reactive state for login errors
const loginErrors = reactive({
  email: "",
  password: "",
});

const loginForm = reactive({
  email: "",
  password: "",
  rememberMe: false,
});

const showPassword = ref(false); 
function togglePassword() {
  showPassword.value = !showPassword.value;
}


const loading = ref(false);
const notification = ref({ show: false, message: "", type: "" }); // Notification state

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
    const { user } = await signInWithEmailAndPassword(auth, loginForm.email, loginForm.password);

    if (!user.emailVerified) {
      await sendEmailVerification(user); // Automatically resend the verification email
      notification.value = {
        show: true,
        message: "Verification email resent successfully. Please check your inbox.",
        type: "success",
      };
      await signOut(auth); // Sign out the user after sending the email
      loginErrors.email = "Please verify your email.";
      return;
    }

    // Fetch user role from Firestore
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const userRole = userSnap.data().role;
      localStorage.setItem("userRole", userRole);

      // Redirect based on role
      if (userRole === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/user/dashboard");
      }
    } else {
      notification.value = {
        show: true,
        message: "User data not found. Please contact support.",
        type: "error",
      };
    }
  } catch (error) {
    console.error(error);
    if (error.code === "auth/user-not-found") {
      loginErrors.email = "No account found with this email.";
    } else if (error.code === "auth/wrong-password") {
      loginErrors.password = "Incorrect password.";
    } else {
      notification.value = {
        show: true,
        message: "Login failed. Please try again.",
        type: "error",
      };
    }
  } finally {
    loading.value = false;

    // Hide notification after 3 seconds
    setTimeout(() => {
      notification.value.show = false;
    }, 3000);
  }
};

const router = useRouter();

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
    router.push(userSnap.exists() && userSnap.data().role === "admin" ? "/admin/dashboard" : "/user/dashboard");
  } catch (error) {
    console.error(error);
    alert(error.message || "Google Sign-In failed!");
  }
};

const showResetPasswordModal = ref(false);

const resendEmailVerification = async () => {
  if (!loginForm.email) {
    loginErrors.email = "Email is required";
    return;
  }

  loading.value = true;
  try {
    const { user } = await signInWithEmailAndPassword(auth, loginForm.email, loginForm.password);
    if (user.emailVerified) {
      showAlert("info", "Already Verified", "Your email is already verified.");
      return;
    }
    await sendEmailVerification(user);
    showAlert("success", "Verification Email Sent", "Please check your inbox.");
    await signOut(auth);
  } catch (error) {
    console.error(error);
    if (error.code === "auth/user-not-found") {
      loginErrors.email = "No account found with this email.";
    } else if (error.code === "auth/wrong-password") {
      loginErrors.password = "Incorrect password.";
    } else {
      showAlert("error", "Error", "Failed to resend verification email.");
    }
  } finally {
    loading.value = false;
  }
};
</script>
