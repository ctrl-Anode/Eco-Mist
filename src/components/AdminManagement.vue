<template>
  <div class="admin-wrapper">
    <!-- Animated Background -->
    <div class="gradient-bg">
      <div class="gradient-circle c1"></div>
      <div class="gradient-circle c2"></div>
    </div>

    <!-- Glass Card -->
    <div class="glass-card">
      <div class="card-header">
        <div class="header-content">
          <h2>
            <i class="fas fa-users-cog"></i>
            User Management
          </h2>
          <p class="subtitle">Manage system users and their permissions</p>
        </div>
        
        <!-- Search and Filter -->
        <div class="controls">
          <div class="search-box">
            <i class="fas fa-search"></i>
            <input 
              type="text" 
              v-model="searchQuery" 
              placeholder="Search users..."
              @input="filterUsers"
            >
          </div>
          <select v-model="statusFilter" @change="filterUsers">
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="deactivated">Deactivated</option>
          </select>
          <select v-model="roleFilter" @change="filterUsers">
            <option value="all">All Roles</option>
            <option value="user">Users</option>
            <option value="admin">Admins</option>
          </select>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <div class="loader"></div>
        <p>Loading users...</p>
      </div>

      <!-- Error Message -->
      <div v-else-if="errorMessage" class="error-container">
        <i class="fas fa-exclamation-circle"></i>
        <p>{{ errorMessage }}</p>
        <button @click="fetchUsers" class="retry-btn">
          <i class="fas fa-redo"></i>
          Retry
        </button>
      </div>

      <!-- Users Table -->
      <div v-else-if="filteredUsers.length" class="table-container">
        <table>
          <thead>
            <tr>
              <th>
                <div class="th-content">
                  <span>User</span>
                  <i class="fas fa-sort" @click="sortUsers('username')"></i>
                </div>
              </th>
              <th>
                <div class="th-content">
                  <span>Email</span>
                  <i class="fas fa-sort" @click="sortUsers('email')"></i>
                </div>
              </th>
              <th>
                <div class="th-content">
                  <span>Role</span>
                  <i class="fas fa-sort" @click="sortUsers('role')"></i>
                </div>
              </th>
              <th>
                <div class="th-content">
                  <span>Status</span>
                  <i class="fas fa-sort" @click="sortUsers('status')"></i>
                </div>
              </th>
              <th>
                <div class="th-content">
                  <span>Last Active</span>
                  <i class="fas fa-sort" @click="sortUsers('lastActive')"></i>
                </div>
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in filteredUsers" :key="user.id" :class="{ 'deactivated': user.status === 'deactivated' }">
              <td>
                <div class="user-info">
                  <img :src="user.profileImage || defaultAvatar" :alt="user.username">
                  <span>{{ user.username || "Unknown" }}</span>
                </div>
              </td>
              <td>{{ user.email }}</td>
              <td>
                <div class="role-badge" :class="user.role">
                  <select 
                    v-model="user.role" 
                    @change="updateUserRole(user)"
                    :disabled="user.status === 'deactivated'"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </td>
              <td>
                <span class="status-badge" :class="user.status">
                  <i :class="getStatusIcon(user.status)"></i>
                  {{ user.status === 'deactivated' ? 'Deactivated' : 'Active' }}
                </span>
              </td>
              <td>
                <span class="last-active">
                  <i class="far fa-clock"></i>
                  {{ formatLastActive(user.lastActive) }}
                </span>
              </td>
              <td>
                <div class="action-buttons">
                  <button 
                    v-if="user.status === 'active'" 
                    @click="confirmDeactivation(user)" 
                    class="action-btn deactivate"
                    title="Deactivate User"
                  >
                    <i class="fas fa-user-slash"></i>
                  </button>
                  <button 
                    v-else 
                    @click="confirmReactivation(user)" 
                    class="action-btn reactivate"
                    title="Reactivate User"
                  >
                    <i class="fas fa-user-check"></i>
                  </button>
                  <button 
                    @click="confirmDeletion(user)" 
                    class="action-btn delete"
                    title="Delete User"
                  >
                    <i class="fas fa-trash-alt"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Pagination -->
        <div class="pagination">
          <button 
            @click="prevPage" 
            :disabled="currentPage === 1"
            class="page-btn"
          >
            <i class="fas fa-chevron-left"></i>
          </button>
          <span>Page {{ currentPage }} of {{ totalPages }}</span>
          <button 
            @click="nextPage" 
            :disabled="currentPage === totalPages"
            class="page-btn"
          >
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>

      <div v-else class="empty-state">
        <i class="fas fa-users-slash"></i>
        <p>No users found</p>
        <span>Try adjusting your search or filters</span>
      </div>
    </div>

    <!-- Confirmation Modal -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header" :class="modalType">
          <h3>
            <i :class="getModalIcon()"></i>
            {{ modalTitle }}
          </h3>
          <button class="close-btn" @click="closeModal">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <p>{{ modalMessage }}</p>
          <div v-if="modalType === 'deactivate'" class="warning-box">
            <i class="fas fa-exclamation-triangle"></i>
            <span>This will prevent the user from accessing their account</span>
          </div>
        </div>
        <div class="modal-footer">
          <button class="cancel-btn" @click="closeModal">Cancel</button>
          <button 
            :class="['confirm-btn', modalType]" 
            @click="handleModalConfirm"
          >
            {{ modalConfirmText }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { auth, db } from '../firebase';
import { 
  getDoc, 
  doc, 
  collection, 
  updateDoc, 
  deleteDoc, 
  onSnapshot 
} from 'firebase/firestore';

// State
const users = ref([]);
const loading = ref(true);
const errorMessage = ref('');
const searchQuery = ref('');
const statusFilter = ref('all');
const roleFilter = ref('all');
const currentPage = ref(1);
const itemsPerPage = 10;
const sortField = ref('username');
const sortDirection = ref('asc');
const defaultAvatar = "https://ui-avatars.com/api/?background=0D9488&color=fff";

// Modal State
const showModal = ref(false);
const modalType = ref('');
const modalUser = ref(null);
const modalTitle = computed(() => {
  switch (modalType.value) {
    case 'deactivate': return 'Deactivate User';
    case 'reactivate': return 'Reactivate User';
    case 'delete': return 'Delete User';
    default: return '';
  }
});
const modalMessage = computed(() => {
  if (!modalUser.value) return '';
  switch (modalType.value) {
    case 'deactivate':
      return `Are you sure you want to deactivate ${modalUser.value.username}?`;
    case 'reactivate':
      return `Are you sure you want to reactivate ${modalUser.value.username}?`;
    case 'delete':
      return `Are you sure you want to delete ${modalUser.value.username}? This action cannot be undone.`;
    default:
      return '';
  }
});
const modalConfirmText = computed(() => {
  switch (modalType.value) {
    case 'deactivate': return 'Deactivate';
    case 'reactivate': return 'Reactivate';
    case 'delete': return 'Delete';
    default: return 'Confirm';
  }
});

// Computed
const filteredUsers = computed(() => {
  let filtered = [...users.value];

  // Apply search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(user => 
      user.username?.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query)
    );
  }

  // Apply filters
  if (statusFilter.value !== 'all') {
    filtered = filtered.filter(user => user.status === statusFilter.value);
  }
  if (roleFilter.value !== 'all') {
    filtered = filtered.filter(user => user.role === roleFilter.value);
  }

  // Apply sorting
  filtered.sort((a, b) => {
    const aVal = a[sortField.value] || '';
    const bVal = b[sortField.value] || '';
    return sortDirection.value === 'asc' 
      ? aVal.localeCompare(bVal)
      : bVal.localeCompare(aVal);
  });

  return filtered;
});

const totalPages = computed(() => 
  Math.ceil(filteredUsers.value.length / itemsPerPage)
);

const showError = (message) => {
  errorMessage.value = message;
};

const showSuccess = (message) => {
  // Implement success message handling (e.g., toast notification)
  console.log(message); // Placeholder for actual implementation
};

/* eslint-disable-next-line */
const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredUsers.value.slice(start, end);
});

// Methods
const fetchUsers = async () => {
  loading.value = true;
  errorMessage.value = '';

  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error('Not authenticated');
    }

    const adminRef = doc(db, 'users', currentUser.uid);
    const adminSnap = await getDoc(adminRef);

    if (!adminSnap.exists() || adminSnap.data().role !== 'admin') {
      throw new Error('Access denied. Admins only.');
    }

    const usersCollection = collection(db, 'users');
    onSnapshot(usersCollection, (snapshot) => {
      users.value = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      }));
      loading.value = false;
    });
  } catch (error) {
    errorMessage.value = error.message;
    loading.value = false;
  }
};

const updateUserRole = async (user) => {
  if (user.status === 'deactivated') {
    showError('Cannot change role of a deactivated user. Reactivate first.');
    return;
  }

  try {
    await updateDoc(doc(db, 'users', user.id), { role: user.role });
    showSuccess(`User role updated to ${user.role}`);
  } catch (error) {
    showError('Error updating role: ' + error.message);
  }
};

const deactivateUser = async (user) => {
  try {
    await updateDoc(doc(db, 'users', user.id), { status: 'deactivated' });
    showSuccess('User has been deactivated');
  } catch (error) {
    showError('Error deactivating user: ' + error.message);
  }
};

const reactivateUser = async (user) => {
  try {
    await updateDoc(doc(db, 'users', user.id), { status: 'active' });
    showSuccess('User has been reactivated');
  } catch (error) {
    showError('Error reactivating user: ' + error.message);
  }
};

const deleteUser = async (user) => {
  try {
    await deleteDoc(doc(db, 'users', user.id));
    showSuccess('User deleted successfully');
  } catch (error) {
    showError('Error deleting user: ' + error.message);
  }
};

// Modal handlers
const confirmDeactivation = (user) => {
  modalType.value = 'deactivate';
  modalUser.value = user;
  showModal.value = true;
};

const confirmReactivation = (user) => {
  modalType.value = 'reactivate';
  modalUser.value = user;
  showModal.value = true;
};

const confirmDeletion = (user) => {
  modalType.value = 'delete';
  modalUser.value = user;
  showModal.value = true;
};

const handleModalConfirm = async () => {
  if (!modalUser.value) return;

  switch (modalType.value) {
    case 'deactivate':
      await deactivateUser(modalUser.value);
      break;
    case 'reactivate':
      await reactivateUser(modalUser.value);
      break;
    case 'delete':
      await deleteUser(modalUser.value);
      break;
  }

  closeModal();
};

const closeModal = () => {
  showModal.value = false;
  modalType.value = '';
  modalUser.value = null;
};

// Utility functions
const getStatusIcon = (status) => {
  return status === 'active' 
    ? 'fas fa-check-circle' 
    : 'fas fa-times-circle';
};

const getModalIcon = () => {
  switch (modalType.value) {
    case 'deactivate': return 'fas fa-user-slash';
    case 'reactivate': return 'fas fa-user-check';
    case 'delete': return 'fas fa-trash-alt';
    default: return 'fas fa-exclamation-circle';
  }
};

const formatLastActive = (timestamp) => {
  if (!timestamp) return 'Never';
  const date = new Date(timestamp);
  return new Intl.RelativeTimeFormat('en', { numeric: 'auto' })
    .format(Math.round((date - Date.now()) / (1000 * 60)), 'minute');
};

const sortUsers = (field) => {
  if (sortField.value === field) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortField.value = field;
    sortDirection.value = 'asc';
  }
};

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
};

// Lifecycle
onMounted(fetchUsers);
</script>

<style scoped>
.admin-wrapper {
  min-height: 100vh;
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
}

.c2 {
  width: 500px;
  height: 500px;
  background: radial-gradient(circle at center, #15803d, #166534);
  bottom: -150px;
  right: -150px;
  animation-delay: -5s;
}

@keyframes float {
  0%, 100% { transform: translate(0, 0); }
  25% { transform: translate(50px, -50px); }
  50% { transform: translate(0, 75px); }
  75% { transform: translate(-50px, -25px); }
}

.glass-card {
  position: relative;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.2);
  overflow: hidden;
  z-index: 1;
  padding: 24px;
}

.card-header {
  margin-bottom: 24px;
}

.header-content {
  margin-bottom: 20px;
}

h2 {
  color: white;
  font-size: 1.5rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 12px;
}

h2 i {
  color: #4ade80;
}

.subtitle {
  color: rgba(255, 255, 255, 0.7);
  margin-top: 4px;
}

.controls {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.search-box {
  flex: 1;
  position: relative;
}

.search-box i {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255, 255, 255, 0.5);
}

.search-box input {
  width: 100%;
  padding: 8px 12px 8px 36px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: white;
}

select {
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: white;
  cursor: pointer;
}

.table-container {
  overflow-x: auto;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

table {
  width: 100%;
  border-collapse: collapse;
}

th {
  background: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.7);
  font-weight: 500;
  text-align: left;
  padding: 12px;
}

.th-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

.th-content i {
  cursor: pointer;
  opacity: 0.5;
  transition: opacity 0.2s;
}

.th-content i:hover {
  opacity: 1;
}

td {
  padding: 12px;
  color: white;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

tr.deactivated td {
  opacity: 0.5;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-info img {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.role-badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.875rem;
}

.role-badge.admin {
  background: rgba(168, 85, 247, 0.1);
  color: #a855f7;
}

.role-badge.user {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.875rem;
}

.status-badge.active {
  background: rgba(74, 222, 128, 0.1);
  color: #4ade80;
}

.status-badge.deactivated {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.last-active {
  display: flex;
  align-items: center;
  gap: 6px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.875rem;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.action-btn {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn.deactivate {
  background: rgba(234, 179, 8, 0.1);
  color: #eab308;
}

.action-btn.reactivate {
  background: rgba(74, 222, 128, 0.1);
  color: #4ade80;
}

.action-btn.delete {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.action-btn:hover {
  transform: translateY(-2px);
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-top: 20px;
  color: white;
}

.page-btn {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.05);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-btn:not(:disabled):hover {
  background: rgba(255, 255, 255, 0.1);
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

.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  color: #ef4444;
  gap: 12px;
}

.error-container i {
  font-size: 48px;
}

.retry-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: white;
  cursor: pointer;
  transition: all 0.2s;
}

.retry-btn:hover {
  background: rgba(255, 255, 255, 0.15);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  color: rgba(255, 255, 255, 0.7);
  gap: 12px;
}

.empty-state i {
  font-size: 48px;
  color: rgba(255, 255, 255, 0.3);
}

.empty-state span {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.5);
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

.modal-header.deactivate h3 {
  color: #eab308;
}

.modal-header.reactivate h3 {
  color: #4ade80;
}

.modal-header.delete h3 {
  color: #ef4444;
}

.modal-header h3 {
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
  color: rgba(255, 255, 255, 0.7);
}

.warning-box {
  margin-top: 16px;
  padding: 12px;
  background: rgba(234, 179, 8, 0.1);
  border: 1px solid rgba(234, 179, 8, 0.2);
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #eab308;
}

.modal-footer {
  padding: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.cancel-btn {
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  color: white;
  cursor: pointer;
}

.confirm-btn {
  padding: 8px 16px;
  border-radius: 6px;
  border: none;
  color: white;
  cursor: pointer;
}

.confirm-btn.deactivate {
  background: #eab308;
}

.confirm-btn.reactivate {
  background: #4ade80;
}

.confirm-btn.delete {
  background: #ef4444;
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
  .controls {
    flex-direction: column;
  }

  .action-buttons {
    flex-direction: column;
  }

  .action-btn {
    width: 100%;
  }

  th:nth-child(4),
  th:nth-child(5),
  td:nth-child(4),
  td:nth-child(5) {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .gradient-circle,
  .modal-overlay,
  .modal-content {
    animation: none;
  }

  .action-btn:hover {
    transform: none;
  }
}
</style>