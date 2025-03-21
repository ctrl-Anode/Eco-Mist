<template>
  <div class="register-wrapper">
    <!-- Animated Background -->
    <div class="gradient-bg">
      <div class="gradient-circle c1"></div>
      <div class="gradient-circle c2"></div>
      <div class="gradient-circle c3"></div>
    </div>

    <!-- Glass Card -->
    <div class="glass-card">
      <div class="card-content">
        <h2 class="title">Create Account</h2>
        <p class="subtitle">Join our aeroponics community</p>

        <form @submit.prevent="registerUser" class="form">
          <div class="input-group" :class="{ 'has-error': errors.username }">
            <input 
              type="text" 
              v-model="username" 
              :class="{ 'is-filled': username }"
              required
            />
            <label>Username</label>
            <span class="error-message">{{ errors.username }}</span>
            <span class="input-border"></span>
          </div>

          <div class="input-group" :class="{ 'has-error': errors.email }">
            <input 
              type="email" 
              v-model="email" 
              :class="{ 'is-filled': email }"
              required
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
            />
            <label>Password</label>
            <button 
              type="button"
              class="password-toggle"
              @click="showPassword = !showPassword"
            >
              <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
            </button>
            <span class="error-message">{{ errors.password }}</span>
            <span class="input-border"></span>
          </div>

          <div class="input-group" :class="{ 'has-error': errors.confirmPassword }">
            <input 
              :type="showPassword ? 'text' : 'password'"
              v-model="confirmPassword" 
              :class="{ 'is-filled': confirmPassword }"
              required
            />
            <label>Confirm Password</label>
            <span class="error-message">{{ errors.confirmPassword }}</span>
            <span class="input-border"></span>
          </div>

          <button 
            type="submit" 
            class="submit-btn"
            :disabled="loading"
          >
            <span v-if="!loading">Create Account</span>
            <span v-else class="loader"></span>
          </button>
        </form>

        <div class="divider">
          <span>or continue with</span>
        </div>

        <button 
          @click="registerWithGoogle" 
          class="google-btn"
          :disabled="loading"
        >
          <img src="/google-icon.png" alt="Google" />
          <span>Google</span>
        </button>

        <p class="login-link">
          Already have an account? 
          <router-link to="/login">Sign In</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
  GoogleAuthProvider,
  signInWithPopup,
  signOut
} from "firebase/auth";
import { db } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useRouter } from "vue-router";

const username = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const loading = ref(false);
const showPassword = ref(false);
const router = useRouter();
const auth = getAuth();

const errors = reactive({
  username: "",
  email: "",
  password: "",
  confirmPassword: ""
});

const validateForm = () => {
  let isValid = true;
  errors.username = "";
  errors.email = "";
  errors.password = "";
  errors.confirmPassword = "";

  if (!username.value || username.value.length < 3) {
    errors.username = "Username must be at least 3 characters";
    isValid = false;
  }

  if (!email.value || !/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(email.value)) {
    errors.email = "Please enter a valid email";
    isValid = false;
  }

  if (!password.value || password.value.length < 6) {
    errors.password = "Password must be at least 6 characters";
    isValid = false;
  }

  if (password.value !== confirmPassword.value) {
    errors.confirmPassword = "Passwords do not match";
    isValid = false;
  }

  return isValid;
};

const registerUser = async () => {
  if (!validateForm()) return;
  
  loading.value = true;
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value);
    const user = userCredential.user;

    await updateProfile(user, { displayName: username.value });
    await sendEmailVerification(user);

    await setDoc(doc(db, "users", user.uid), {
      username: username.value,
      email: email.value,
      role: "user",
      status: "active",
      createdAt: new Date().toISOString()
    });

    await signOut(auth);
    router.push({
      path: "/login",
      query: { verified: "pending" }
    });
  } catch (error) {
    handleError(error);
  } finally {
    loading.value = false;
  }
};

const registerWithGoogle = async () => {
  loading.value = true;
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      await signOut(auth);
      router.push("/login");
      return;
    }

    await setDoc(userRef, {
      username: user.displayName,
      email: user.email,
      role: "user",
      status: "active",
      createdAt: new Date().toISOString()
    });

    router.push("/dashboard");
  } catch (error) {
    handleError(error);
  } finally {
    loading.value = false;
  }
};

const handleError = (error) => {
  switch (error.code) {
    case 'auth/email-already-in-use':
      errors.email = "Email is already registered";
      break;
    case 'auth/invalid-email':
      errors.email = "Invalid email format";
      break;
    case 'auth/weak-password':
      errors.password = "Password is too weak";
      break;
    default:
      errors.email = error.message;
  }
};
</script>

<style scoped>
.register-wrapper {
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

.title {
  color: white;
  font-size: 2rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 8px;
}

.subtitle {
  color: rgba(255, 255, 255, 0.7);
  text-align: center;
  margin-bottom: 32px;
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

.password-toggle {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
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
  position: relative;
  overflow: hidden;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
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

.login-link {
  text-align: center;
  margin-top: 24px;
  color: rgba(255, 255, 255, 0.7);
}

.login-link a {
  color: #4ade80;
  text-decoration: none;
  font-weight: 500;
  margin-left: 4px;
}

.login-link a:hover {
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