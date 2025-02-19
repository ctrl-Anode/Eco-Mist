<template>
  <div class="dashboard-wrapper">
    <!-- ✅ Sidebar -->
    <aside class="sidebar">
      <div class="profile-section">
        <div class="profile-img-container">
          <img v-if="profileImageUrl" :src="profileImageUrl" alt="Profile Picture" class="profile-img" />
          <div v-else class="profile-placeholder">{{ username.charAt(0).toUpperCase() }}</div>
        </div>
        <h3 class="username">{{ username }}</h3>
        <p class="role-text">{{ role }}</p>
      </div>

      <nav class="nav-links">
        <router-link to="/profile-display" class="nav-button"><i class="fas fa-user"></i> Profile</router-link>
        <router-link to="/settings" class="nav-button"><i class="fas fa-cog"></i> Settings</router-link>
        <button @click="logout" class="logout-button"><i class="fas fa-sign-out-alt"></i> Log Out</button>
      </nav>
    </aside>

    <!-- ✅ Main Content -->
    <main class="dashboard-content">
      <h2>Welcome, {{ username }}!</h2>
      <p class="subtitle">Your dashboard overview</p>

      <!-- ✅ Dashboard Cards -->
      <div class="dashboard-cards">
        <div class="card">
          <h3>Recent Login</h3>
          <p>{{ lastLogin }}</p>
        </div>
        <div class="card">
          <h3>Account Status</h3>
          <p class="status">{{ accountStatus }}</p>
        </div>
        <div class="card">
          <h3>Unread Messages</h3>
          <p>{{ messages }} messages</p>
        </div>
      </div>
    </main>
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
    const profileImageUrl = ref(null);
    const accountStatus = ref("Active");
    const lastLogin = ref("Unknown");
    const messages = ref(3);
    const role = ref("User");
    const auth = getAuth();
    const router = useRouter();

    onMounted(async () => {
      if (auth.currentUser) {
        username.value = auth.currentUser.displayName || "User";

        // Fetch user data
        const userRef = doc(db, "users", auth.currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          profileImageUrl.value = userData.profileImageUrl || null;
          accountStatus.value = userData.status || "Active";
          lastLogin.value = userData.lastLogin || "Unknown";
          role.value = userData.role || "User";
        }
      }
    });

    const logout = async () => {
      await signOut(auth);
      router.push('/login');
    };

    return { username, profileImageUrl, accountStatus, lastLogin, messages, role, logout };
  },
};
</script>

<style scoped>
/* ✅ Dashboard Layout */
.dashboard-wrapper {
  display: flex;
  height: 100vh;
  background: url('@/assets/let.png') no-repeat center center/cover;
  backdrop-filter: blur(10px);
}

/* ✅ Sidebar */
.sidebar {
  width: 280px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  padding: 30px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 2px 4px 10px rgba(0, 0, 0, 0.1);
}

/* ✅ Profile Section */
.profile-section {
  text-align: center;
  margin-bottom: 20px;
}

/* ✅ Profile Image */
.profile-img-container {
  margin-bottom: 10px;
}

.profile-img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 3px solid #2e7d32;
}

.profile-placeholder {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: #2e7d32;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  font-weight: bold;
}

/* ✅ Sidebar Links */
.nav-links {
  width: 100%;
}

.nav-button {
  display: flex;
  align-items: center;
  padding: 12px;
  background: #388e3c;
  color: white;
  border-radius: 8px;
  font-size: 16px;
  margin: 10px 0;
  transition: 0.3s ease;
  text-decoration: none;
  justify-content: center;
}

.nav-button:hover {
  background: #2e7d32;
}

/* ✅ Logout Button */
.logout-button {
  background: #d9534f;
  color: white;
  padding: 12px;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  width: 100%;
  transition: 0.3s ease;
}

.logout-button:hover {
  background: #c9302c;
}

/* ✅ Main Content */
.dashboard-content {
  flex-grow: 1;
  padding: 40px;
  text-align: center;
}

/* ✅ Dashboard Cards */
.dashboard-cards {
  display: flex;
  gap: 20px;
  justify-content: center;
  margin-bottom: 30px;
}

.card {
  background: rgba(255, 255, 255, 0.95);
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  width: 30%;
  text-align: center;
  transition: transform 0.3s ease-in-out;
}

.card:hover {
  transform: scale(1.05);
}
</style>