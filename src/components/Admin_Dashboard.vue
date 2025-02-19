<template>
  <div class="dashboard-wrapper">
    <!-- ✅ Sidebar -->
    <aside class="sidebar">
      <div class="profile-section">
        <div class="profile-img-container">
          <img v-if="profileImageUrl" :src="profileImageUrl" alt="Admin Profile" class="profile-img" />
          <div v-else class="profile-placeholder">A</div>
        </div>
        <h3 class="username">Admin</h3>
        <p class="role-text">Administrator</p>
      </div>

      <nav class="nav-links">
        <router-link to="/admin-management" class="nav-button">
          <i class="fas fa-users-cog"></i> Manage Users
        </router-link>
        <router-link to="/dashboard" class="nav-button">
          <i class="fas fa-tachometer-alt"></i> User Dashboard
        </router-link>
        <button @click="logout" class="logout-button">
          <i class="fas fa-sign-out-alt"></i> Log Out
        </button>
      </nav>
    </aside>

    <!-- ✅ Main Content -->
    <main class="dashboard-content">
      <h1>Admin Dashboard</h1>
      <p class="subtitle">Manage platform activities</p>

      <div class="dashboard-cards">
        <div class="card">
          <h3>Total Users</h3>
          <p>{{ totalUsers }} Users</p>
        </div>
        <div class="card">
          <h3>Pending Approvals</h3>
          <p>{{ pendingApprovals }} Requests</p>
        </div>
        <div class="card">
          <h3>System Alerts</h3>
          <p>{{ systemAlerts }} Alerts</p>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { getAuth, signOut } from "firebase/auth";
import { useRouter } from "vue-router";
import { db, collection, getDocs } from "firebase/firestore";

export default {
  setup() {
    const totalUsers = ref(0);
    const pendingApprovals = ref(5);
    const systemAlerts = ref(2);
    const profileImageUrl = ref(null);
    const auth = getAuth();
    const router = useRouter();

    onMounted(async () => {
      try {
        const userSnapshot = await getDocs(collection(db, "users"));
        totalUsers.value = userSnapshot.size;
      } catch (error) {
        console.error("Error fetching users: ", error);
      }
    });

    const logout = async () => {
      await signOut(auth);
      router.push('/login');
    };

    return { totalUsers, pendingApprovals, systemAlerts, profileImageUrl, logout };
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

.profile-section {
  text-align: center;
  margin-bottom: 20px;
}

.profile-img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 3px solid #d32f2f;
}

.profile-placeholder {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: #d32f2f;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  font-weight: bold;
}

.nav-links {
  width: 100%;
}

.nav-button {
  display: flex;
  align-items: center;
  padding: 12px;
  background: #c62828;
  color: white;
  border-radius: 8px;
  font-size: 16px;
  margin: 10px 0;
  transition: 0.3s ease;
  text-decoration: none;
  justify-content: center;
}

.nav-button:hover {
  background: #b71c1c;
}

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