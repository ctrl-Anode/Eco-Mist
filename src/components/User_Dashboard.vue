<template>
  <div class="dashboard-layout" :class="{'sidebar-open': sidebarOpen}">
    <!-- Sidebar -->
    <div class="sidebar-container" :class="{ 'sidebar-open': sidebarOpen }">
      <button class="sidebar-toggle" @click="toggleSidebar">
        <i :class="sidebarOpen ? 'fas fa-times' : 'fas fa-bars'"></i>
      </button>
      
      <div class="sidebar">
        <div class="sidebar-profile">
          <div class="sidebar-avatar">
            <img 
              :src="profileImage || defaultAvatar" 
              :alt="`${username}'s avatar`"
              @error="handleImageError"
            />
            <span class="status-badge" :class="role">{{ role }}</span>
          </div>
          <div class="sidebar-user-info">
            <h3>{{ username }}</h3>
            <p>{{ role }}</p>
          </div>
        </div>
        
        <nav class="sidebar-nav">
          <div v-for="(section, index) in navigationSections" :key="index" class="nav-section">
            <h4 class="section-title">{{ section.title }}</h4>
            <ul class="nav-links">
              <li v-for="route in section.routes" :key="route.path">
                <router-link 
                  :to="route.path" 
                  class="nav-link"
                  :class="{ 'active': currentRoute === route.path }"
                  v-if="shouldShowRoute(route)"
                >
                  <i :class="getIconForRoute(route)"></i>
                  <span>{{ route.name }}</span>
                </router-link>
              </li>
            </ul>
          </div>
        </nav>
        
        <div class="sidebar-footer">
          <button @click="confirmLogout" class="sidebar-logout">
            <i class="fas fa-sign-out-alt"></i>
            <span>Logout</span>
          </button>
        </div>
      </div>
      
      <div 
        class="sidebar-overlay" 
        :class="{ 'overlay-visible': sidebarOpen }" 
        @click="toggleSidebar"
      ></div>
    </div>

    <!-- Main Dashboard Content -->
    <div class="dashboard-wrapper">
      <!-- Animated Background -->
      <div class="gradient-bg">
        <div class="gradient-circle c1"></div>
        <div class="gradient-circle c2"></div>
        <div class="gradient-circle c3"></div>
      </div>

      <!-- Glass Card -->
      <div class="glass-card">
        <div class="card-content">
          <!-- Loading State -->
          <div v-if="loading" class="loading-state">
            <div class="loader"></div>
            <p>Loading dashboard...</p>
          </div>

          <template v-else>
            <!-- User Welcome Section -->
            <div class="welcome-section">
              <div class="user-avatar">
                <img 
                  :src="profileImage || defaultAvatar" 
                  :alt="`${username}'s avatar`"
                  @error="handleImageError"
                />
                <span class="role-badge" :class="role">
                  {{ role }}
                </span>
              </div>
              <h1 class="welcome-text">Welcome back, {{ username }}!</h1>
              <p class="last-login">Last login: {{ formatDate(lastLogin) }}</p>
            </div>

            <!-- Quick Stats -->
            <div class="stats-grid">
              <div class="stat-card">
                <i class="fas fa-calendar-check"></i>
                <span class="stat-value">{{ loginCount }}</span>
                <span class="stat-label">Total Logins</span>
              </div>
              <div class="stat-card">
                <i class="fas fa-clock"></i>
                <span class="stat-value">{{ daysActive }}</span>
                <span class="stat-label">Days Active</span>
              </div>
              <div class="stat-card">
                <i class="fas fa-user-check"></i>
                <span class="stat-value">{{ profileCompletion }}%</span>
                <span class="stat-label">Profile Complete</span>
              </div>
            </div>

            <!-- Admin Section -->
            <div v-if="role === 'admin'" class="admin-section">
              <h2 class="section-title">
                <i class="fas fa-shield-alt"></i>
                Admin Controls
              </h2>
              <div class="admin-actions">
                <router-link to="/admin-dashboard" class="action-button primary">
                  <i class="fas fa-tools"></i>
                  Admin Panel
                </router-link>
                <router-link to="/admin-management" class="action-button secondary">
                  <i class="fas fa-users"></i>
                  Manage Users
                </router-link>
                <router-link to="/system-logs" class="action-button secondary">
                  <i class="fas fa-list"></i>
                  System Logs
                </router-link>
              </div>
            </div>

            <!-- User Actions -->
            <div class="user-actions" :class="{ 'is-admin': role === 'admin' }">
              <router-link to="/profile-display" class="action-button secondary">
                <i class="fas fa-user"></i>
                View Profile
              </router-link>
              <router-link to="/settings" class="action-button secondary">
                <i class="fas fa-cog"></i>
                Settings
              </router-link>
              <button @click="confirmLogout" class="action-button danger">
                <i class="fas fa-sign-out-alt"></i>
                Log Out
              </button>
            </div>
          </template>
        </div>
      </div>
    </div>

    <!-- Logout Confirmation Modal -->
    <div v-if="showLogoutModal" class="modal-overlay" @click="showLogoutModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Confirm Logout</h3>
          <button class="close-btn" @click="showLogoutModal = false">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <p>Are you sure you want to log out?</p>
        </div>
        <div class="modal-footer">
          <button class="cancel-btn" @click="showLogoutModal = false">Cancel</button>
          <button class="confirm-btn" @click="logout">
            <i class="fas fa-sign-out-alt"></i>
            Logout
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc, onSnapshot, Timestamp } from "firebase/firestore";
import { db } from "../firebase";

export default {
  name: 'UserDashboard',

  setup() {
    // State
    const username = ref("User");
    const role = ref("");
    const profileImage = ref("");
    const loading = ref(true);
    const lastLogin = ref(new Date());
    const loginCount = ref(0);
    const daysActive = ref(0);
    const profileCompletion = ref(0);
    const showLogoutModal = ref(false);
    const sidebarOpen = ref(false);
    const defaultAvatar = "https://ui-avatars.com/api/?background=0D9488&color=fff";

    const router = useRouter();
    const route = useRoute();
    const auth = getAuth();
    const currentRoute = computed(() => route.path);

    // Routes configuration
    const routes = [
      { path: '/', name: 'Home', component: 'LandingPage' },
      { path: '/register', name: 'Register', component: 'UserRegister' },
      { path: '/login', name: 'Login', component: 'UserLogin' },
      { path: '/edit-profile', name: 'Edit Profile', component: 'EditUserProfile', meta: { requiresAuth: true, role: 'user' } },
      { path: '/dashboard', name: 'Dashboard', component: 'UserDashboard', meta: { requiresAuth: true } },
      { path: '/profile-display', name: 'Profile', component: 'UserProfileDisplay', meta: { requiresAuth: true, role: 'user' } },
      { path: '/admin-dashboard', name: 'Admin Dashboard', component: 'AdminDashboard', meta: { requiresAuth: true, role: 'admin' } },
      { path: '/reset-password', name: 'Reset Password', component: 'ResetPassword' },
      { path: "/admin-management", name: "Admin Management", component: 'AdminManagement', meta: { requiresAuth: true, role: "admin" } },
      { path: '/financial-management', name: 'Financial Management', component: 'FinancialManagement', meta: { requiresAuth: true, role: 'user' } },
      { path: '/messenger', name: 'Messenger', component: 'MessengerChat', meta: { requiresAuth: true } },
      { path: '/sensor_data', name: 'Sensor Data', component: 'SensorData', meta: { requiresAuth: true, role: 'user' } },
    ];

    // Group routes by section
    const navigationSections = computed(() => {
      return [
        {
          title: 'General',
          routes: routes.filter(r => 
            r.path === '/' || 
            r.path === '/dashboard' || 
            r.path === '/profile-display' ||
            r.path === '/messenger'
          )
        },
        {
          title: 'User Management',
          routes: routes.filter(r => 
            r.path === '/edit-profile' || 
            r.path === '/reset-password'
          )
        },
        {
          title: 'Data & Tools',
          routes: routes.filter(r => 
            r.path === '/financial-management' || 
            r.path === '/sensor_data'
          )
        },
        {
          title: 'Admin Controls',
          routes: routes.filter(r => 
            r.path === '/admin-dashboard' || 
            r.path === '/admin-management'
          )
        }
      ];
    });

    // Helper function to safely convert Firestore timestamp to Date
    const getDateFromTimestamp = (timestamp) => {
      if (timestamp instanceof Timestamp) {
        return timestamp.toDate();
      }
      if (timestamp && timestamp.seconds) {
        return new Timestamp(timestamp.seconds, timestamp.nanoseconds).toDate();
      }
      return new Date();
    };

    // Calculate profile completion
    const calculateProfileCompletion = (userData) => {
      const requiredFields = ['username', 'email', 'completeName', 'age', 'birthday', 'cellphone', 'gender', 'address'];
      const completedFields = requiredFields.filter(field => userData[field]);
      return Math.round((completedFields.length / requiredFields.length) * 100);
    };

    // Update user data
    const updateUserData = async (userDoc) => {
      if (!userDoc) return;
      
      const userData = userDoc.data();
      username.value = userData.username || auth.currentUser?.displayName || "User";
      role.value = userData.role;
      profileImage.value = userData.profileImageUrl;
      lastLogin.value = getDateFromTimestamp(userData.lastLogin);
      loginCount.value = userData.loginCount || 0;
      
      // Calculate days active
      const createdAt = getDateFromTimestamp(userData.createdAt);
      const diffTime = Math.abs(new Date() - createdAt);
      daysActive.value = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      // Calculate profile completion
      profileCompletion.value = calculateProfileCompletion(userData);
    };

    // Set up real-time listener for user data
    const setupUserListener = (userId) => {
      const userRef = doc(db, "users", userId);
      return onSnapshot(userRef, (doc) => {
        if (doc.exists()) {
          updateUserData(doc);
        }
      }, (error) => {
        console.error("Error listening to user data:", error);
      });
    };

    // Check if route should be shown based on user role
    const shouldShowRoute = (route) => {
      if (route.path === '/login' || route.path === '/register') {
        return false;
      }
      
      if (route.meta?.requiresAuth) {
        if (route.meta.role && route.meta.role !== role.value) {
          return false;
        }
      }
      
      return true;
    };

    // Get icon class for each route
    const getIconForRoute = (route) => {
      const iconMap = {
        '/': 'fas fa-home',
        '/dashboard': 'fas fa-tachometer-alt',
        '/profile-display': 'fas fa-user',
        '/edit-profile': 'fas fa-user-edit',
        '/reset-password': 'fas fa-key',
        '/admin-dashboard': 'fas fa-shield-alt',
        '/admin-management': 'fas fa-users-cog',
        '/financial-management': 'fas fa-chart-line',
        '/messenger': 'fas fa-comments',
        '/sensor_data': 'fas fa-microchip'
      };
      
      return iconMap[route.path] || 'fas fa-link';
    };

    // Check if this is a new login session
    const isNewSession = () => {
      const lastSessionTime = sessionStorage.getItem('lastSessionTime');
      const currentTime = Date.now();
      
      if (!lastSessionTime) {
        sessionStorage.setItem('lastSessionTime', currentTime.toString());
        return true;
      }
      
      return false;
    };

    // Toggle sidebar
    const toggleSidebar = () => {
      sidebarOpen.value = !sidebarOpen.value;
      
      if (sidebarOpen.value) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    };

    // Image error handler
    const handleImageError = (e) => {
      e.target.src = defaultAvatar;
    };

    const formatDate = (date) => {
      return new Intl.DateTimeFormat('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short'
      }).format(date);
    };

    const confirmLogout = () => {
      showLogoutModal.value = true;
    };

    const logout = async () => {
      try {
        sessionStorage.removeItem('lastSessionTime');
        await signOut(auth);
        router.push('/login');
      } catch (error) {
        console.error("Error logging out:", error);
      }
    };

    // Watch for route changes to close sidebar on mobile
    watch(currentRoute, () => {
      if (window.innerWidth < 768) {
        sidebarOpen.value = false;
        document.body.style.overflow = '';
      }
    });

    // Initialize component
    let unsubscribeUser = null;
    onMounted(() => {
      const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
        if (user) {
          try {
            if (unsubscribeUser) {
              unsubscribeUser();
            }
            
            unsubscribeUser = setupUserListener(user.uid);
            
            if (isNewSession()) {
              const userRef = doc(db, "users", user.uid);
              const userSnap = await getDoc(userRef);
              if (userSnap.exists()) {
                const userData = userSnap.data();
                await updateDoc(userRef, {
                  lastLogin: Timestamp.now(),
                  loginCount: (userData.loginCount || 0) + 1
                });
              }
            }
          } catch (error) {
            console.error("Error setting up dashboard:", error);
          }
        } else {
          router.push('/login');
        }
        loading.value = false;
      });

      // Check saved sidebar state
      const savedSidebarState = localStorage.getItem('sidebarOpen');
      sidebarOpen.value = savedSidebarState === 'true';

      // Cleanup on component unmount
      return () => {
        unsubscribeAuth();
        if (unsubscribeUser) {
          unsubscribeUser();
        }
      };
    });

    // Save sidebar state when changed
    watch(sidebarOpen, (newValue) => {
      localStorage.setItem('sidebarOpen', newValue);
    });

    return {
      // State
      username,
      role,
      profileImage,
      loading,
      lastLogin,
      loginCount,
      daysActive,
      profileCompletion,
      showLogoutModal,
      sidebarOpen,
      defaultAvatar,
      currentRoute,
      navigationSections,

      // Methods
      shouldShowRoute,
      getIconForRoute,
      toggleSidebar,
      handleImageError,
      formatDate,
      confirmLogout,
      logout
    };
  }
};
</script>

<style scoped>
/* Import required fonts and icons */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css');

/* Layout */
.dashboard-layout {
  display: flex;
  min-height: 100vh;
}

/* Include all the styles from both components */
/* Sidebar Styles */
.sidebar-container {
  height: 100%;
  position: relative;
}

.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 280px;
  background: rgba(15, 23, 42, 0.9);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  z-index: 100;
  transform: translateX(-100%);
  transition: transform 0.3s ease;
}

.sidebar-open .sidebar {
  transform: translateX(0);
}

.sidebar-toggle {
  position: absolute;
  top: 10px;
  right: -40px;
  width: 40px;
  height: 40px;
  background: rgba(15, 23, 42, 0.9);
  color: white;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 101;
  transition: all 0.3s ease;
}

.sidebar-toggle:hover {
  background: rgba(15, 23, 42, 1);
}

.sidebar-profile {
  padding: 24px;
  text-align: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.sidebar-avatar {
  position: relative;
  display: inline-block;
  margin-bottom: 12px;
}

.sidebar-avatar img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.status-badge {
  position: absolute;
  bottom: 0;
  right: 0;
  padding: 4px 6px;
  border-radius: 6px;
  font-size: 0.7rem;
  font-weight: 500;
  text-transform: uppercase;
}

.status-badge.admin {
  background-color: rgba(239, 68, 68, 0.2);
  color: #ef4444;
}

.status-badge.user {
  background-color: rgba(52, 211, 168, 0.2);
  color: #34d3a9;
}

.sidebar-user-info h3 {
  color: white;
  font-size: 1.1rem;
  margin-bottom: 4px;
}

.sidebar-user-info p {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.85rem;
}

.sidebar-nav {
  flex-grow: 1;
  overflow-y: auto;
  padding: 12px 0;
}

.nav-section {
  margin-bottom: 16px;
}

.nav-section .section-title {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.8rem;
  font-weight: 500;
  padding: 8px 24px;
  text-transform: uppercase;
}

.nav-links {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-links li {
  margin-bottom: 2px;
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 10px 24px;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: all 0.3s ease;
}

.nav-link i {
  margin-right: 12px;
  width: 20px;
  text-align: center;
  color: rgba(255, 255, 255, 0.6);
}

.nav-link span {
  font-size: 0.9rem;
}

.nav-link:hover,
.nav-link.active {
  background: rgba(255, 255, 255, 0.05);
  color: white;
}

.nav-link.active i {
  color: white;
}

.sidebar-footer {
  padding: 16px 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.sidebar-logout {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  border: none;
  border-radius: 8px;
  padding: 10px 16px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.sidebar-logout:hover {
  background: rgba(239, 68, 68, 0.2);
}

.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 99;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s ease, visibility 0.3s ease;
}

.sidebar-open .sidebar-overlay {
  opacity: 1;
  visibility: visible;
}

/* ... (Include all the styles from both components) ... */
/* For brevity, I'm not including all styles here, but you should include all styles 
   from both the sidebar and dashboard components that we had before */

/* Dashboard Styles */
.dashboard-wrapper {
  flex: 1;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  position: relative;
  overflow: hidden;
  transition: margin-left 0.3s ease, width 0.3s ease;
}

/* When sidebar is open on larger screens, adjust main content */
@media (min-width: 1024px) {
  .sidebar-open .dashboard-wrapper {
    margin-left: 280px;
    width: calc(100% - 280px);
  }
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
  max-width: 800px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.2);
  overflow: hidden;
  z-index: 1;
}

.card-content {
  padding: 40px;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  color: rgba(255, 255, 255, 0.7);
}

.loader {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  border-top-color: #4ade80;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.welcome-section {
  text-align: center;
  margin-bottom: 32px;
}

.user-avatar {
  position: relative;
  display: inline-block;
  margin-bottom: 16px;
}

.user-avatar img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 4px solid rgba(255, 255, 255, 0.1);
  object-fit: cover;
}

.role-badge {
  position: absolute;
  bottom: 0;
  right: 0;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  text-transform: capitalize;
}

.role-badge.admin {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.4);
}

.role-badge.user {
  background: rgba(74, 222, 128, 0.2);
  color: #4ade80;
  border: 1px solid rgba(74, 222, 128, 0.4);
}

.welcome-text {
  color: white;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 8px;
}

.last-login {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 32px;
}

.stat-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 20px;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.stat-card i {
  color: #4ade80;
  font-size: 24px;
}

.stat-value {
  color: white;
  font-size: 1.5rem;
  font-weight: 600;
}

.stat-label {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
}

.section-title {
  color: white;
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-title i {
  color: #4ade80;
}

.admin-section {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
}

.admin-actions,
.user-actions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
}

.action-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s;
  text-decoration: none;
  border: none;
  cursor: pointer;
}

.action-button.primary {
  background: linear-gradient(45deg, #22c55e, #16a34a);
  color: white;
}

.action-button.secondary {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
}

.action-button.danger {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
  color: #ef4444;
}

.action-button:hover {
  transform: translateY(-2px);
}

.action-button.primary:hover {
  box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
}

.action-button.secondary:hover {
  background: rgba(255, 255, 255, 0.15);
}

.action-button.danger:hover {
  background: rgba(239, 68, 68, 0.15);
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 20px;
  animation: fadeIn 0.3s ease;
}

.modal-content {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  width: 100%;
  max-width: 400px;
  animation: slideUp 0.3s ease;
}

.modal-header {
  padding: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.modal-header h3 {
  color: white;
  font-size: 1.25rem;
}

.close-btn {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  padding: 8px;
}

.modal-body {
  padding: 20px;
  color: rgba(255, 255, 255, 0.7);
}

.modal-footer {
  padding: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.cancel-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
}

.confirm-btn {
  background: #ef4444;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .card-content {
    padding: 24px;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .welcome-text {
    font-size: 1.5rem;
  }

  .admin-actions,
  .user-actions {
    grid-template-columns: 1fr;
  }
}

@media (prefers-reduced-motion: reduce) {
  .sidebar,
  .sidebar-toggle,
  .sidebar-overlay,
  .dashboard-wrapper,
  .gradient-circle,
  .modal-overlay,
  .modal-content {
    transition: none;
  }

  .action-button:hover {
    transform: none;
  }
}
</style>

