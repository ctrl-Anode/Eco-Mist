<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <!-- Top Navbar -->
    <EcoAdmin_Header
      :username="username"
      :profileImageUrl="profileImageUrl"
      :notificationCount="notificationCount"
      :userMenuOpen="userMenuOpen"
      @toggle-sidebar="toggleSidebar"
      @toggle-user-menu="toggleUserMenu"
      @open-feedback="showFeedbackModal = true"
      @confirm-logout="showLogoutModal = true"
      class="fixed top-0 left-0 right-0 z-50"
    />

    <!-- Sidebar & Main Content Layout -->
    <div class="flex flex-1 pt-16 overflow-hidden">
      <!-- Sidebar -->
      <div
        :class="[
          'flex flex-col fixed top-16 bottom-0 z-40 bg-white transition-transform duration-300',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
          'w-64 md:translate-x-0'
        ]"
      >
        <EcoAdmin_Sidebar
          :sidebarOpen="sidebarOpen"
          :navigationSections="navigationSections"
          :currentRoute="currentRoute"
          :role="role"
          :lastLogin="lastLogin"
          :status="status"
          @toggle-sidebar="toggleSidebar"
        />
      </div>

      <!-- Dynamic Main Content -->
      <div class="flex-1 ml-0 md:ml-64 overflow-y-auto">
        <router-view /> <!-- 👈 This dynamically loads nested pages -->
      </div>
    </div>

    <!-- Modals & Toasts -->
    <!-- <EcoUser_Feedback 
  v-if="showFeedbackModal" 
  :username="username" 
  @close="showFeedbackModal = false"
  @submitted="handleFeedbackSubmitted"
/> -->

    <EcoAdmin_LogOut
      :visible="showLogoutModal"
      @cancel="showLogoutModal = false"
      @logout="logout"
    />
    <EcoAdmin_Toast :toast="toast" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, provide } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getAuth, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

import EcoAdmin_Header from '../components/EcoAdmin/EcoAdmin_Header.vue';
import EcoAdmin_Sidebar from '../components/EcoAdmin/EcoAdmin_Sidebar.vue';
// import EcoUser_Feedback from '../components/EcoAdmin/EcoUser_Feedback.vue';
import EcoAdmin_LogOut from '../components/EcoAdmin/EcoAdmin_LogOut.vue';
import EcoAdmin_Toast from '../components/EcoAdmin/EcoAdmin_Toast.vue';

// User profile data
const username = ref('');
const email = ref('');
const completeName = ref('');
const age = ref('');
const birthday = ref('');
const cellphone = ref('');
const gender = ref('');
const address = ref('');
const profileImageUrl = ref('');
const role = ref('user');
const status = ref('active');
const lastLogin = ref(new Date());

// Provide these states for nested pages (like profile-display) to inject
provide('username', username);
provide('email', email);
provide('completeName', completeName);
provide('age', age);
provide('birthday', birthday);
provide('cellphone', cellphone);
provide('gender', gender);
provide('address', address);
provide('profileImageUrl', profileImageUrl);
provide('role', role);
provide('status', status);

const sidebarOpen = ref(true);
const userMenuOpen = ref(false);
const notificationCount = ref(2);
const showFeedbackModal = ref(false);
const showLogoutModal = ref(false);
const toast = ref({ show: false, message: '', type: 'success' });

const route = useRoute();
const router = useRouter();
const currentRoute = computed(() => route.path);

const navigationSections = computed(() => [
  {
    title: 'GENERAL',
    routes: [
      { path: '/admin/dashboard', name: 'Dashboard', meta: { requiresAuth: true } },
      { path: '/admin/messenger', name: 'Messenger', meta: { requiresAuth: true } },
      { path: '/admin/user-management', name: 'User Management', meta: { requiresAuth: true, role: 'admin' } }
      //{ path: '/admin/messenger', name: 'Messenger', meta: { requiresAuth: true } }
    ]
  },
  {
    title: 'ADMIN MANAGEMENT',
    routes: [
      { path: '/admin/settings/profile-display', name: 'Settings', meta: { requiresAuth: true } },
    ]
  },
  {
    title: 'ADMIN DATA & TOOLS',
    routes: [
      { path: '/admin/system-logs', name: 'System Logs', meta: { requiresAuth: true } },
      { path: '/admin/device-management', name: 'Device Management', meta: { requiresAuth: true } },
      { path: '/admin/device-logs', name: 'Device Logs', meta: { requiresAuth: true } },
      { path: '/admin/guest-contacts', name: 'Guest Contacts', meta: { requiresAuth: true } }
    ]
  }
]);

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value;
};

const toggleUserMenu = () => {
  userMenuOpen.value = !userMenuOpen.value;
};

const showToast = (message, type = 'success') => {
  toast.value = { show: true, message, type };
  setTimeout(() => {
    toast.value = { ...toast.value, show: false };
  }, 3000);
};

const handleFeedbackSubmitted = ({ success, message }) => {
  if (success) {
    showToast('Thank you for your feedback!', 'success');
  } else {
    showToast(message || 'Feedback failed', 'error');
  }
};

const fetchUserProfile = async () => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) throw new Error('Please log in to view your profile');

    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      const data = userSnap.data();
      username.value = data.username || user.displayName || 'User';
      email.value = data.email || user.email || '';
      completeName.value = data.completeName || '';
      age.value = data.age || '';
      birthday.value = data.birthday || '';
      cellphone.value = data.cellphone || '';
      gender.value = data.gender || '';
      address.value = data.address || '';
      profileImageUrl.value = data.profileImageUrl || user.photoURL || '';
      role.value = data.role || 'user';
      status.value = data.status || 'active';
      lastLogin.value = user.metadata.lastSignInTime ? new Date(user.metadata.lastSignInTime) : new Date();
    } else {
      throw new Error('User profile not found. Please complete your profile.');
    }
  } catch (err) {
    console.error(err);
    showToast(err.message || 'Failed to load profile information.', 'error');
  }
};

const logout = async () => {
  try {
    await signOut(getAuth());
    router.push('/auth');
  } catch (err) {
    console.error('Error logging out:', err);
    showToast('Failed to log out. Please try again.', 'error');
  }
};

onMounted(() => {
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      fetchUserProfile(); // ✅ Only fetch if logged in
    } else {
      router.push('/auth'); // 🚪 Redirect if logged out
    }
  });
});

</script>
