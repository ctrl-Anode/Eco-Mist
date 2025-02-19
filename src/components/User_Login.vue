<template>
  <div class="login-wrapper">
    <div class="login-container">
      <h2>Login</h2>
      <form @submit.prevent="loginUser">
        <input type="email" v-model="email" placeholder="Email" required />
        <input type="password" v-model="password" placeholder="Password" required />
        
        <div class="button-group">
          <button type="submit" class="login-btn">Login</button>
          <button @click="loginWithGoogle" type="button" class="google-btn">
            <img src="@/assets/google-icon.png" alt="Google Logo" /> Sign in with Google
          </button>
        </div>

        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      </form>

      <button v-if="showResendVerification" @click="resendVerification" class="resend-btn">
        Resend Verification Email
      </button>

      <router-link to="/reset-password" class="forgot-password">Forgot Password?</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";
import { useRouter } from "vue-router";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

const email = ref("");
const password = ref("");
const errorMessage = ref("");
const showResendVerification = ref(false);
const router = useRouter();
const auth = getAuth();

const loginUser = async () => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value);
    const user = userCredential.user;

    if (!user.emailVerified) {
      errorMessage.value = "Please verify your email before logging in.";
      showResendVerification.value = true;
      await signOut(auth);
      return;
    }

    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const userData = userSnap.data();
      if (userData.status === "deactivated") {
        errorMessage.value = "Your account has been deactivated. Contact support.";
        await signOut(auth);
        return;
      }

      if (userData.role === "admin") {
        router.push("/admin-dashboard");
      } else {
        router.push("/dashboard");
      }
    } else {
      errorMessage.value = "User data not found.";
    }
  } catch (error) {
    errorMessage.value = "Invalid email or password.";
  }
};

const loginWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      errorMessage.value = "User not registered. Please register first.";
      await signOut(auth);
      return;
    }

    const userData = userSnap.data();
    if (userData.status === "deactivated") {
      errorMessage.value = "Your account has been deactivated. Contact support.";
      await signOut(auth);
      return;
    }

    if (userData.role === "admin") {
      router.push("/admin-dashboard");
    } else {
      router.push("/dashboard");
    }
  } catch (error) {
    errorMessage.value = "Google Sign-In Failed: " + error.message;
  }
};

const resendVerification = async () => {
  try {
    const user = auth.currentUser;
    if (user) {
      await sendEmailVerification(user);
      errorMessage.value = "Verification email sent!";
    }
  } catch (error) {
    errorMessage.value = "Error sending verification email.";
  }
};
</script>

<style scoped>
/* ✅ Background and Wrapper */
.login-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: url('@/assets/let.png') no-repeat center center/cover;
}

/* ✅ Login Container (Similar to Register) */
.login-container {
  text-align: center;
  background: rgba(255, 255, 255, 0.95);
  padding: 60px;
  border-radius: 12px;
  box-shadow: 0px 6px 15px rgba(0, 0, 0, 0.15);
  max-width: 420px;
  width: 100%;
  font-family: 'Poppins', sans-serif;
}

/* ✅ Title */
h2 {
  color: #2e7d32;
  font-weight: bold;
  font-size: 40px;
  margin-bottom: 15px;
}

/* ✅ Inputs */
input {
  width: 100%;
  padding: 12px;
  margin: 10px 0;
  border: 1px solid #81c784;
  border-radius: 6px;
  outline: none;
  background: #f1f8e9;
  font-size: 14px;
}

/* ✅ Button Group */
.button-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  gap: 15px;
  margin-top: 20px;
}

/* ✅ Login Button */
.login-btn {
  width: 80%;
  padding: 14px;
  background-color: #388e3c;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  transition: background 0.3s, transform 0.2s;
}

.login-btn:hover {
  background-color: #2e7d32;
  transform: scale(1.05);
}

/* ✅ Google Button */

.google-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 14px;
  background-color: #f4f4f4; /* Light background for better contrast */
  color: #555; /* Darker text color for readability */
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  width: 80%;
  transition: background 0.3s, transform 0.2s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Subtle shadow for depth */
}

.google-btn:hover {
  background-color: #e0e0e0; /* Slightly darker on hover */
  transform: scale(1.05);
}

.google-btn img {
  width: 22px;
  margin-right: 12px;

}

/* ✅ Resend Verification Button */
.resend-btn {
  background: none;
  color: #2e7d32;
  border: none;
  cursor: pointer;
  margin-top: 10px;
}

.resend-btn:hover {
  text-decoration: underline;
}

/* ✅ Forgot Password Link */
.forgot-password {
  display: block;
  margin-top: 10px;
  color: #2e7d32;
  text-decoration: none;
  font-size: 14px;
}

.forgot-password:hover {
  text-decoration: underline;
}

/* ✅ Error Message */
.error-message {
  color: red;
  margin-top: 12px;
  font-size: 14px;
}
</style>
