<template>
  <div class="reset-wrapper">
    <!-- Animated Background -->
    <div class="gradient-bg">
      <div class="gradient-circle c1"></div>
      <div class="gradient-circle c2"></div>
      <div class="gradient-circle c3"></div>
    </div>

    <!-- Glass Card -->
    <div class="glass-card">
      <div class="card-content">
        <div class="header-section">
          <button @click="$router.push('/login')" class="back-button">
            <i class="fas fa-arrow-left"></i>
          </button>
          <img src="/eco-mist-logo.png" alt="Eco-Mist Logo" class="logo" />
          <h2 class="title">Reset Password</h2>
          <p class="subtitle">Enter your email to receive reset instructions</p>
        </div>

        <form @submit.prevent="resetPassword" class="form">
          <div class="input-group" :class="{ 'has-error': error }">
            <input 
              type="email" 
              v-model="email" 
              :class="{ 'is-filled': email }"
              required
              :disabled="loading"
            />
            <label>Email Address</label>
            <span class="input-border"></span>
            <span v-if="error" class="error-message">{{ error }}</span>
          </div>

          <button 
            type="submit" 
            class="submit-btn"
            :disabled="loading || !isValidEmail"
          >
            <span v-if="!loading">Send Reset Link</span>
            <span v-else class="loader"></span>
          </button>
        </form>

        <div v-if="success" class="success-message">
          <i class="fas fa-check-circle"></i>
          <p>{{ success }}</p>
        </div>

        <div class="footer-section">
          <p>Remember your password?</p>
          <router-link to="/login" class="login-link">Back to Login</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
//import { useRouter } from "vue-router";

const email = ref("");
const loading = ref(false);
const error = ref("");
const success = ref("");
//const router = useRouter(); // eslint-disable-next-line

const isValidEmail = computed(() => {
  return /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(email.value);
});

const resetPassword = async () => {
  if (!isValidEmail.value) {
    error.value = "Please enter a valid email address";
    return;
  }

  loading.value = true;
  error.value = "";
  success.value = "";

  try {
    const auth = getAuth();
    await sendPasswordResetEmail(auth, email.value);
    success.value = "Password reset link has been sent to your email";
    email.value = ""; // Clear the input
  } catch (err) {
    switch (err.code) {
      case 'auth/user-not-found':
        error.value = "No account found with this email address";
        break;
      case 'auth/too-many-requests':
        error.value = "Too many attempts. Please try again later";
        break;
      default:
        error.value = "Failed to send reset link. Please try again";
    }
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.reset-wrapper {
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
  0%, 100% { transform: translate(0, 0); }
  25% { transform: translate(50px, -50px); }
  50% { transform: translate(0, 75px); }
  75% { transform: translate(-50px, -25px); }
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
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.card-content {
  padding: 40px;
  position: relative;
}

.header-section {
  text-align: center;
  margin-bottom: 32px;
  position: relative;
}

.back-button {
  position: absolute;
  left: 0;
  top: 0;
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  padding: 8px;
  transition: all 0.3s;
}

.back-button:hover {
  color: white;
  transform: translateX(-2px);
}

.logo {
  width: 60px;
  height: 60px;
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
  font-size: 0.9rem;
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
  to { transform: rotate(360deg); }
}

.success-message {
  margin-top: 24px;
  padding: 12px;
  background: rgba(74, 222, 128, 0.1);
  border: 1px solid rgba(74, 222, 128, 0.2);
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 12px;
  color: #4ade80;
}

.success-message i {
  font-size: 20px;
}

.footer-section {
  margin-top: 24px;
  text-align: center;
  color: rgba(255, 255, 255, 0.7);
}

.login-link {
  color: #4ade80;
  text-decoration: none;
  font-weight: 500;
  margin-left: 4px;
  transition: all 0.3s;
}

.login-link:hover {
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