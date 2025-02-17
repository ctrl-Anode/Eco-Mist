<template>
  <div class="dashboard-container">
    <h2>Welcome, {{ username }}!</h2>
    <p>Your role: <strong>{{ role }}</strong></p>

    <div v-if="role === 'admin'">
      <h3>Admin Controls</h3>
      <router-link to="/admin-dashboard" class="button">Go to Admin Panel</router-link>
    </div>

    <div v-else>
      <router-link to="/profile-display" class="button">View Profile</router-link>
    </div>

    <button @click="logout" class="logout-button">Log Out</button>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { getAuth, signOut } from "firebase/auth";
import { useRouter } from "vue-router";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

export default {
  setup() {
    const username = ref("User");
    const role = ref("");
    const auth = getAuth();
    const router = useRouter();

    onMounted(async () => {
      if (auth.currentUser) {
        username.value = auth.currentUser.displayName || "User";

        // Fetch user role
        const userRef = doc(db, "users", auth.currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          role.value = userSnap.data().role;
        }
      }
    });

    const logout = async () => {
      await signOut(auth);
      router.push('/login');
    };

    return { username, role, logout };
  },
};
</script>

<style scoped>
.dashboard-container {
  text-align: center;
  padding: 20px;
  max-width: 400px;
  margin: auto;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.dark .dashboard-container {
  background-color: #1e1e1e;
  color: white;
}

h2 {
  font-size: 24px;
}

/* ✅ Mobile Adjustments */
@media (max-width: 768px) {
  .dashboard-container {
    width: 90%;
    padding: 15px;
  }
}

.button {
  display: inline-block;
  padding: 10px 15px;
  margin: 10px 0;
  text-decoration: none;
  color: white;
  background-color: #007bff;
  border-radius: 5px;
  transition: background 0.3s ease-in-out;
}

.button:hover {
  background-color: #0056b3;
}

.logout-button {
  padding: 10px 15px;
  margin-top: 15px;
  background-color: #d9534f;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s;
}

.logout-button:hover {
  background-color: #c9302c;
}
</style>
