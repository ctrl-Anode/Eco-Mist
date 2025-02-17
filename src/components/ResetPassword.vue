<template>
    <div class="reset-password-container">
      <h2>Reset Password</h2>
      <input type="email" v-model="email" placeholder="Enter your email" required />
      <button @click="resetPassword">Send Reset Email</button>
      <p v-if="message">{{ message }}</p>
    </div>
  </template>
  
  <script>
  import { ref } from "vue";
  import { getAuth, sendPasswordResetEmail } from "firebase/auth";
  
  export default {
    setup() {
      const email = ref("");
      const message = ref("");
  
      const resetPassword = async () => {
        const auth = getAuth();
        try {
          await sendPasswordResetEmail(auth, email.value);
          message.value = "Password reset link sent!";
        } catch (error) {
          message.value = "Error resetting password.";
        }
      };
  
      return { email, resetPassword, message };
    },
  };
  </script>
  
  <style scoped>
  .reset-password-container {
    text-align: center;
    max-width: 400px;
    margin: auto;
  }
  
  button {
    margin-top: 10px;
  }
  </style>
  