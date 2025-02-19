<template>
  <div class="register-wrapper">
    <div class="register-container">
      <h2>Register</h2>
      <form @submit.prevent="registerUser">
        <input type="text" v-model="username" placeholder="Username" required />
        <input type="email" v-model="email" placeholder="Email" required />
        <input type="password" v-model="password" placeholder="Password" required />
        <input type="password" v-model="confirmPassword" placeholder="Confirm Password" required />
        
        <div class="button-group">
          <button type="submit" class="signup-btn">Register</button>
          <button @click="registerWithGoogle" type="button" class="google-btn">
            <img src="@/assets/google-icon.png" alt="Google Logo" /> Continue with Google
          </button>
        </div>

        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
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
const errorMessage = ref("");
const router = useRouter();
const auth = getAuth();

const registerUser = async () => {
  if (password.value !== confirmPassword.value) {
    errorMessage.value = "Passwords do not match.";
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value);
    const user = userCredential.user;

    await updateProfile(user, { displayName: username.value });
    await sendEmailVerification(user);

    await setDoc(doc(db, "users", user.uid), {
      username: username.value,
      email: email.value,
      role: "user",
      status: "active"
    });

    alert("Registration successful! Please check your email for verification.");
    await signOut(auth);
    router.push("/login");
  } catch (error) {
    errorMessage.value = `Registration failed: ${error.message}`;
  }
};

const registerWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      errorMessage.value = "User already registered. Please login.";
      await signOut(auth);
      router.push("/login");
      return;
    }

    await setDoc(userRef, {
      username: user.displayName,
      email: user.email,
      role: "user",
      status: "active"
    });

    alert("Registration successful!");
    router.push("/dashboard");
  } catch (error) {
    errorMessage.value = "Google Registration Failed: " + error.message;
  }
};
</script>

<style scoped>
.register-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: url('@/assets/let.png') no-repeat center center/cover;
}

.register-container {
  text-align: center;
  background: rgba(255, 255, 255, 0.95);
  padding: 60px;
  border-radius: 12px;
  box-shadow: 0px 6px 15px rgba(0, 0, 0, 0.15);
  max-width: 420px;
  width: 100%;
  font-family: 'Poppins', sans-serif;
}

h2 {
  color: #2e7d32;
  font-weight: bold;
  font-size: 50px;
  margin-bottom: 15px;
}

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

.button-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  gap: 15px; /* Adds spacing between buttons */
  margin-top: 20px;
}

button {
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

button:hover {
  background-color: #2e7d32;
  transform: scale(1.05);
}

.error-message {
  color: red;
  margin-top: 12px;
  font-size: 14px;
}

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
</style>
