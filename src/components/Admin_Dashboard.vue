<template>
  <div class="admin-wrapper">
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
          <p>Loading admin dashboard...</p>
        </div>

        <template v-else>
          <!-- Header Section -->
          <div class="admin-header">
            <div class="header-content">
              <h1 class="title">
                <i class="fas fa-shield-alt"></i>
                Admin Dashboard
              </h1>
              <p class="subtitle">System Overview and Management</p>
            </div>
            <div class="quick-actions">
              <button @click="refreshStats" class="action-btn" :disabled="refreshing">
                <i class="fas fa-sync-alt" :class="{ 'rotating': refreshing }"></i>
                Refresh
              </button>
              <router-link to="/dashboard" class="action-btn">
                <i class="fas fa-user"></i>
                User Dashboard
              </router-link>
            </div>
          </div>

          <!-- Stats Overview -->
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-icon users">
                <i class="fas fa-users"></i>
              </div>
              <div class="stat-info">
                <span class="stat-value">{{ stats.totalUsers }}</span>
                <span class="stat-label">Total Users</span>
              </div>
              <div class="stat-change" :class="stats.userGrowth >= 0 ? 'positive' : 'negative'">
                <i :class="stats.userGrowth >= 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"></i>
                {{ Math.abs(stats.userGrowth) }}%
              </div>
            </div>

            <div class="stat-card">
              <div class="stat-icon active">
                <i class="fas fa-user-check"></i>
              </div>
              <div class="stat-info">
                <span class="stat-value">{{ stats.activeUsers }}</span>
                <span class="stat-label">Active Users</span>
              </div>
              <div class="stat-percentage">
                {{ Math.round((stats.activeUsers / stats.totalUsers) * 100) }}%
              </div>
            </div>

            <div class="stat-card">
              <div class="stat-icon new">
                <i class="fas fa-user-plus"></i>
              </div>
              <div class="stat-info">
                <span class="stat-value">{{ stats.newUsers }}</span>
                <span class="stat-label">New Users (24h)</span>
              </div>
            </div>

            <div class="stat-card">
              <div class="stat-icon system">
                <i class="fas fa-server"></i>
              </div>
              <div class="stat-info">
                <span class="stat-value">{{ stats.systemHealth }}%</span>
                <span class="stat-label">System Health</span>
              </div>
              <div class="health-indicator" :class="getHealthStatus(stats.systemHealth)"></div>
            </div>
          </div>

          <!-- Management Sections -->
          <div class="management-grid">
            <!-- User Management -->
            <div class="management-card">
              <div class="card-header">
                <h2>
                  <i class="fas fa-users-cog"></i>
                  User Management
                </h2>
                <router-link to="/admin-management" class="view-all">
                  View All
                  <i class="fas fa-arrow-right"></i>
                </router-link>
              </div>
              <div class="recent-users">
                <div v-for="user in recentUsers" :key="user.id" class="user-item">
                  <img :src="user.avatar || defaultAvatar" :alt="user.name">
                  <div class="user-info">
                    <span class="user-name">{{ user.name }}</span>
                    <span class="user-email">{{ user.email }}</span>
                  </div>
                  <span class="user-status" :class="user.status">
                    {{ user.status }}
                  </span>
                </div>
              </div>
            </div>

            <!-- System Logs -->
            <div class="management-card">
              <div class="card-header">
                <h2>
                  <i class="fas fa-list-alt"></i>
                  Recent System Logs
                </h2>
                <router-link to="/system-logs" class="view-all">
                  View All
                  <i class="fas fa-arrow-right"></i>
                </router-link>
              </div>
              <div class="log-list">
                <div v-for="log in recentLogs" :key="log.id" class="log-item">
                  <span class="log-type" :class="log.type">
                    <i :class="getLogIcon(log.type)"></i>
                  </span>
                  <div class="log-info">
                    <span class="log-message">{{ log.message }}</span>
                    <span class="log-time">{{ formatTime(log.timestamp) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="quick-actions-grid">
            <button class="quick-action-btn" @click="backupSystem">
              <i class="fas fa-database"></i>
              Backup System
            </button>
            <button class="quick-action-btn" @click="clearCache">
              <i class="fas fa-broom"></i>
              Clear Cache
            </button>
            <button class="quick-action-btn" @click="generateReport">
              <i class="fas fa-file-alt"></i>
              Generate Report
            </button>
            <button class="quick-action-btn warning" @click="showMaintenanceModal">
              <i class="fas fa-tools"></i>
              Maintenance Mode
            </button>
          </div>
        </template>
      </div>
    </div>

    <!-- Maintenance Mode Modal -->
    <div v-if="showMaintenance" class="modal-overlay" @click="showMaintenance = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>
            <i class="fas fa-tools"></i>
            Enable Maintenance Mode
          </h3>
          <button class="close-btn" @click="showMaintenance = false">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <p class="warning-text">
            This will temporarily disable user access to the system.
            Only administrators will be able to log in.
          </p>
          <div class="maintenance-form">
            <div class="input-group">
              <input 
                type="text" 
                v-model="maintenanceMessage" 
                placeholder="Maintenance message for users"
              />
              <label>Message</label>
            </div>
            <div class="input-group">
              <input 
                type="number" 
                v-model="maintenanceDuration" 
                placeholder="Duration in minutes"
              />
              <label>Duration (minutes)</label>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="cancel-btn" @click="showMaintenance = false">Cancel</button>
          <button 
            class="confirm-btn warning" 
            @click="enableMaintenance"
            :disabled="!maintenanceMessage || !maintenanceDuration"
          >
            Enable Maintenance Mode
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
/* eslint-disable-next-line */
import { getAuth } from 'firebase/auth';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

// State
const loading = ref(true);
const refreshing = ref(false);
const showMaintenance = ref(false);
const maintenanceMessage = ref('');
const maintenanceDuration = ref('');
const defaultAvatar = "https://ui-avatars.com/api/?background=0D9488&color=fff";

// Stats
const stats = ref({
  totalUsers: 0,
  activeUsers: 0,
  newUsers: 0,
  userGrowth: 0,
  systemHealth: 98,
});

// Recent Users
const recentUsers = ref([]);

// Recent Logs
const recentLogs = ref([]);

// Load initial data
onMounted(async () => {
  try {
    await loadDashboardData();
  } finally {
    loading.value = false;
  }
});

const loadDashboardData = async () => {
  try {
    // Fetch users
    const usersQuery = query(collection(db, 'users'), orderBy('createdAt', 'desc'), limit(5));
    const usersSnapshot = await getDocs(usersQuery);
    
    recentUsers.value = usersSnapshot.docs.map(doc => ({
      id: doc.id,
      name: doc.data().username || 'Unknown User',
      email: doc.data().email,
      avatar: doc.data().profileImageUrl,
      status: doc.data().status || 'active'
    }));

    // Calculate stats
    stats.value = {
      totalUsers: usersSnapshot.size,
      activeUsers: recentUsers.value.filter(u => u.status === 'active').length,
      newUsers: recentUsers.value.filter(u => {
        const created = new Date(u.createdAt);
        return (Date.now() - created) < 24 * 60 * 60 * 1000;
      }).length,
      userGrowth: 5.2, // Example value
      systemHealth: 98,
    };

    // Fetch logs
    const logsQuery = query(collection(db, 'system_logs'), orderBy('timestamp', 'desc'), limit(5));
    const logsSnapshot = await getDocs(logsQuery);
    
    recentLogs.value = logsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

  } catch (error) {
    console.error('Error loading dashboard data:', error);
  }
};

// Utility functions
const getHealthStatus = (health) => {
  if (health >= 90) return 'excellent';
  if (health >= 70) return 'good';
  if (health >= 50) return 'fair';
  return 'poor';
};

const getLogIcon = (type) => {
  const icons = {
    info: 'fas fa-info-circle',
    warning: 'fas fa-exclamation-triangle',
    error: 'fas fa-times-circle',
    success: 'fas fa-check-circle'
  };
  return icons[type] || icons.info;
};

const formatTime = (timestamp) => {
  return new Intl.RelativeTimeFormat('en', { numeric: 'auto' })
    .format(Math.round((timestamp - Date.now()) / (1000 * 60)), 'minute');
};

// Action handlers
const refreshStats = async () => {
  refreshing.value = true;
  try {
    await loadDashboardData();
  } finally {
    refreshing.value = false;
  }
};

const backupSystem = () => {
  // Implement backup functionality
};

const clearCache = () => {
  // Implement cache clearing
};

const generateReport = () => {
  // Implement report generation
};

const showMaintenanceModal = () => {
  showMaintenance.value = true;
};

const enableMaintenance = async () => {
  // Implement maintenance mode
  showMaintenance.value = false;
  maintenanceMessage.value = '';
  maintenanceDuration.value = '';
};
</script>

<style scoped>
.admin-wrapper {
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
  max-width: 1200px;
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

.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.title {
  color: white;
  font-size: 2rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 12px;
}

.title i {
  color: #4ade80;
}

.subtitle {
  color: rgba(255, 255, 255, 0.7);
  margin-top: 4px;
}

.quick-actions {
  display: flex;
  gap: 12px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: white;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.3s;
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.15);
}

.rotating {
  animation: rotate 1s linear infinite;
}

@keyframes rotate {
  to { transform: rotate(360deg); }
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 32px;
}

.stat-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.stat-icon.users {
  background: rgba(74, 222, 128, 0.1);
  color: #4ade80;
}

.stat-icon.active {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.stat-icon.new {
  background: rgba(168, 85, 247, 0.1);
  color: #a855f7;
}

.stat-icon.system {
  background: rgba(234, 179, 8, 0.1);
  color: #eab308;
}

.stat-info {
  flex: 1;
}

.stat-value {
  color: white;
  font-size: 1.5rem;
  font-weight: 600;
  display: block;
}

.stat-label {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
}

.stat-change {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.9rem;
  font-weight: 500;
}

.stat-change.positive {
  color: #4ade80;
}

.stat-change.negative {
  color: #ef4444;
}

.stat-percentage {
  color: #4ade80;
  font-weight: 500;
}

.health-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.health-indicator.excellent {
  background: #4ade80;
}

.health-indicator.good {
  background: #eab308;
}

.health-indicator.fair {
  background: #f97316;
}

.health-indicator.poor {
  background: #ef4444;
}

.management-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 32px;
}

.management-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.card-header h2 {
  color: white;
  font-size: 1.25rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
}

.card-header h2 i {
  color: #4ade80;
}

.view-all {
  color: #4ade80;
  text-decoration: none;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: all 0.3s;
}

.view-all:hover {
  opacity: 0.8;
}

.recent-users {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.user-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px;
  border-radius: 8px;
  transition: background 0.3s;
}

.user-item:hover {
  background: rgba(255, 255, 255, 0.05);
}

.user-item img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.user-info {
  flex: 1;
}

.user-name {
  color: white;
  font-weight: 500;
  display: block;
}

.user-email {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
}

.user-status {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
}

.user-status.active {
  background: rgba(74, 222, 128, 0.1);
  color: #4ade80;
}

.user-status.inactive {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.log-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.log-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px;
  border-radius: 8px;
  transition: background 0.3s;
}

.log-item:hover {
  background: rgba(255, 255, 255, 0.05);
}

.log-type {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.log-type.info {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.log-type.warning {
  background: rgba(234, 179, 8, 0.1);
  color: #eab308;
}

.log-type.error {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.log-type.success {
  background: rgba(74, 222, 128, 0.1);
  color: #4ade80;
}

.log-info {
  flex: 1;
}

.log-message {
  color: white;
  display: block;
}

.log-time {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
}

.quick-actions-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.quick-action-btn {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 20px;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  transition: all 0.3s;
  cursor: pointer;
}

.quick-action-btn i {
  font-size: 24px;
  color: #4ade80;
}

.quick-action-btn.warning i {
  color: #eab308;
}

.quick-action-btn:hover {
  background: rgba(255, 255, 255, 0.05);
  transform: translateY(-2px);
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
  max-width: 500px;
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
  color: #eab308;
  display: flex;
  align-items: center;
  gap: 8px;
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
}

.warning-text {
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 20px;
}

.maintenance-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.input-group {
  position: relative;
}

.input-group input {
  width: 100%;
  padding: 12px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: white;
}

.input-group label {
  position: absolute;
  left: 12px;
  top: -8px;
  background: rgba(0, 0, 0, 0.8);
  padding: 0 4px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
}

.modal-footer {
  padding: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: flex-end;
  gap: 12px;
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
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  color: white;
  border: none;
}

.confirm-btn.warning {
  background: #eab308;
}

.confirm-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
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

@media (max-width: 1024px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .management-grid {
    grid-template-columns: 1fr;
  }

  .quick-actions-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .card-content {
    padding: 24px;
  }

  .admin-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .quick-actions {
    width: 100%;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .quick-actions-grid {
    grid-template-columns: 1fr;
  }

  .title {
    font-size: 1.5rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .gradient-circle,
  .modal-overlay,
  .modal-content {
    animation: none;
  }

  .quick-action-btn:hover {
    transform: none;
  }
}
</style>