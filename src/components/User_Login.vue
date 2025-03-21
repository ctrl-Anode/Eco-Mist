<template>
  <div class="login-wrapper">
    <!-- Animated Background -->
    <div class="gradient-bg">
      <div class="gradient-circle c1"></div>
      <div class="gradient-circle c2"></div>
      <div class="gradient-circle c3"></div>
    </div>

    <!-- Glass Card -->
    <div class="glass-card">
      <div class="card-content">
        <div class="logo-section">
          <img src="/eco-mist-logo.png" alt="Eco-Mist Logo" class="logo" />
          <h2 class="title">Welcome Back</h2>
          <p class="subtitle">Login to your Eco-Mist Dashboard</p>
        </div>

        <form @submit.prevent="loginUser" class="form">
          <div class="input-group" :class="{ 'has-error': errors.email }">
            <input 
              type="email" 
              v-model="email" 
              :class="{ 'is-filled': email }"
              required
              :disabled="loading"
            />
            <label>Email</label>
            <span class="error-message">{{ errors.email }}</span>
            <span class="input-border"></span>
          </div>

          <div class="input-group" :class="{ 'has-error': errors.password }">
            <input 
              :type="showPassword ? 'text' : 'password'"
              v-model="password" 
              :class="{ 'is-filled': password }"
              required
              :disabled="loading"
            />
            <label>Password</label>
            <button 
              type="button"
              class="password-toggle"
              @click="togglePassword"
            >
            </button>
            <span class="error-message">{{ errors.password }}</span>
            <span class="input-border"></span>
          </div>

          <div class="options-row">
            <label class="remember-me">
              <input type="checkbox" v-model="rememberMe" />
              <span class="checkbox-label">Remember me</span>
            </label>
            <router-link to="/reset-password" class="forgot-link">
              Forgot Password?
            </router-link>
          </div>

          <button 
            type="submit" 
            class="submit-btn"
            :disabled="loading"
          >
            <span v-if="!loading">Login</span>
            <span v-else class="loader"></span>
          </button>

          <button 
            v-if="showResendVerification" 
            @click="resendVerification" 
            type="button"
            class="resend-btn"
            :disabled="verificationLoading"
          >
            <span v-if="!verificationLoading">Resend Verification Email</span>
            <span v-else class="loader"></span>
          </button>
        </form>

        <div class="divider">
          <span>or continue with</span>
        </div>

        <button 
          @click="loginWithGoogle" 
          class="google-btn"
          :disabled="loading"
        >
          <img src="/google-icon.png" alt="Google" />
          <span>Google</span>
        </button>

        <p class="register-link">
          Don't have an account? 
          <router-link to="/register">Create Account</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  GoogleAuthProvider,
  signInWithPopup,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence
} from "firebase/auth";
import { useRouter } from "vue-router";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

// Form state
const email = ref("");
const password = ref("");
const loading = ref(false);
const verificationLoading = ref(false);
const showPassword = ref(false);
const rememberMe = ref(false);
const showResendVerification = ref(false);

const errors = reactive({
  email: "",
  password: ""
});

// Router and Auth
const router = useRouter();
const auth = getAuth();

// Toggle password visibility
const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

// Login function
const loginUser = async () => {
  // Reset errors
  errors.email = "";
  errors.password = "";
  loading.value = true;
  
  try {
    await setPersistence(auth, 
      rememberMe.value ? browserLocalPersistence : browserSessionPersistence
    );

    const userCredential = await signInWithEmailAndPassword(
      auth, 
      email.value, 
      password.value
    );
    const user = userCredential.user;

    if (!user.emailVerified) {
      errors.email = "Please verify your email before logging in.";
      showResendVerification.value = true;
      await signOut(auth);
      return;
    }

    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const userData = userSnap.data();
      
      if (userData.status === "deactivated") {
        errors.email = "Your account has been deactivated. Please contact support.";
        await signOut(auth);
        return;
      }

      localStorage.setItem('userRole', userData.role);
      router.push(userData.role === "admin" ? "/admin-dashboard" : "/dashboard");
    } else {
      errors.email = "User data not found. Please contact support.";
    }
  } catch (error) {
    handleLoginError(error);
  } finally {
    loading.value = false;
  }
};

const handleLoginError = (error) => {
  switch (error.code) {
    case 'auth/user-not-found':
      errors.email = "No account found with this email.";
      break;
    case 'auth/wrong-password':
      errors.password = "Incorrect password.";
      break;
    case 'auth/too-many-requests':
      errors.email = "Too many failed attempts. Please try again later.";
      break;
    default:
      errors.email = "Login failed. Please try again.";
  }
};

const loginWithGoogle = async () => {
  loading.value = true;
  errors.email = "";
  
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      errors.email = "Account not registered. Please sign up first.";
      await signOut(auth);
      return;
    }

    const userData = userSnap.data();
    if (userData.status === "deactivated") {
      errors.email = "Account deactivated. Please contact support.";
      await signOut(auth);
      return;
    }

    localStorage.setItem('userRole', userData.role);
    router.push(userData.role === "admin" ? "/admin-dashboard" : "/dashboard");
  } catch (error) {
    errors.email = "Google Sign-In failed. Please try again.";
    console.error("Google Sign-In Error:", error);
  } finally {
    loading.value = false;
  }
};

const resendVerification = async () => {
  verificationLoading.value = true;
  try {
    const user = auth.currentUser;
    if (user) {
      await sendEmailVerification(user);
      errors.email = "Verification email sent! Please check your inbox.";
    }
  } catch (error) {
    errors.email = "Failed to send verification email. Please try again.";
  } finally {
    verificationLoading.value = false;
  }
};
</script>

<style scoped>
/* Use the same styles as the registration component for consistency */
.login-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  position: relative;
  overflow: hidden;
}

.gradient-bg {
  position: fixed;
  inset: 0;
  background: #0f172a;
  z-index: 0;
}

.gradient-circle {
  position: absolute;
  border-radius: 50%;
  filter: blur(40px);
  opacity: 0.5;
  animation: float 20s infinite ease-in-out;
}

.c1 {
  width: 600px;
  height: 600px;
  background: radial-gradient(circle at center, #22c55e, #16a34a);
  top: -200px;
  left: -200px;
  animation-delay: 0s;
}

.c2 {
  width: 500px;
  height: 500px;
  background: radial-gradient(circle at center, #15803d, #166534);
  bottom: -150px;
  right: -150px;
  animation-delay: -5s;
}

.c3 {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle at center, #4ade80, #22c55e);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation-delay: -10s;
}

@keyframes float {
  0%, 100% {
    transform: translate(0, 0);
  }
  25% {
    transform: translate(50px, -50px);
  }
  50% {
    transform: translate(0, 75px);
  }
  75% {
    transform: translate(-50px, -25px);
  }
}

.glass-card {
  position: relative;
  width: 100%;
  max-width: 450px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.2);
  overflow: hidden;
  z-index: 1;
}

.glass-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    45deg,
    transparent,
    rgba(255, 255, 255, 0.1),
    transparent
  );
  animation: shine 6s infinite linear;
}

@keyframes shine {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.card-content {
  padding: 40px;
}

.logo-section {
  text-align: center;
  margin-bottom: 32px;
}

.logo {
  width: 80px;
  height: 80px;
  margin-bottom: 16px;
  filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.3));
}

.title {
  color: white;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 8px;
}

.subtitle {
  color: rgba(255, 255, 255, 0.7);
}

.form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.input-group {
  position: relative;
}

.input-group input {
  width: 100%;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.05);
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 16px;
  transition: all 0.3s;
}

.input-group label {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255, 255, 255, 0.6);
  pointer-events: none;
  transition: all 0.3s;
}

.input-group input:focus + label,
.input-group input.is-filled + label {
  top: 0;
  left: 12px;
  font-size: 12px;
  padding: 0 4px;
  background: rgba(0, 0, 0, 0.8);
  border-radius: 4px;
  color: #4ade80;
}

.input-border {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: #4ade80;
  transition: all 0.3s;
}

.input-group input:focus ~ .input-border {
  width: 100%;
}

.input-group.has-error input {
  border-color: #ef4444;
}

.error-message {
  position: absolute;
  left: 0;
  bottom: -20px;
  color: #ef4444;
  font-size: 12px;
}

.options-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.remember-me {
  display: flex;
  align-items: center;
  gap: 8px;
  color: rgba(255, 255, 255, 0.7);
}

.checkbox-label {
  font-size: 14px;
}

.forgot-link {
  color: #4ade80;
  font-size: 14px;
  text-decoration: none;
  transition: all 0.3s;
}

.forgot-link:hover {
  color: #22c55e;
}

.submit-btn {
  background: linear-gradient(45deg, #22c55e, #16a34a);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.resend-btn {
  background: transparent;
  border: 1px solid #4ade80;
  color: #4ade80;
  border-radius: 8px;
  padding: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.resend-btn:hover:not(:disabled) {
  background: rgba(74, 222, 128, 0.1);
}

.loader {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 0.8s linear infinite;
  margin: 0 auto;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.divider {
  display: flex;
  align-items: center;
  margin: 24px 0;
  color: rgba(255, 255, 255, 0.5);
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
}

.divider span {
  padding: 0 16px;
  font-size: 14px;
}

.google-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 12px;
  color: white;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.google-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.15);
}

.google-btn img {
  width: 20px;
  height: 20px;
}

.register-link {
  text-align: center;
  margin-top: 24px;
  color: rgba(255, 255, 255, 0.7);
}

.register-link a {
  color: #4ade80;
  text-decoration: none;
  font-weight: 500;
  margin-left: 4px;
}

.register-link a:hover {
  text-decoration: underline;
}

@media (max-width: 480px) {
  .card-content {
    padding: 24px;
  }

  .title {
    font-size: 1.75rem;
  }

  .gradient-circle {
    filter: blur(60px);
  }

  .options-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .gradient-circle {
    animation: none;
  }

  .glass-card::before {
    animation: none;
  }
}
</style>