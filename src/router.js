import { createRouter, createWebHistory } from 'vue-router';
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth"; // Added onAuthStateChanged for better auth state handling
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

import LandingPage from './views/LandingPage.vue';
import UserAuth from './views/EcoAuth.vue';
import EcoUserParent from './views/EcoUserParent.vue';

import AdminDashboard from './components/EcoAdmin/Admin_Dashboard.vue';
import AdminManagement from "./components/EcoAdmin/AdminManagement.vue";

import EcoTry from "./components/EcoTry.vue"

import DeviceLogs from './components/EcoAdmin/DeviceLogs.vue';
import SystemLogs from './components/EcoAdmin/SystemLogs.vue';

//tryyyyyyyyyy
import EcoProfilePage from './components/EcoUserChild/EcoProfilePage.vue';
import SampleDashboard from './components/EcoUserChild/SampleDashboard.vue';
import SampleEditProfile from './components/EcoUserChild/SampleEditProfile.vue';
import SampleMessenger from './components/EcoUserChild/SampleMessenger.vue';
import SampleResetPassword from './components/EcoUserChild/SampleResetPassword.vue';
import EcoSettingsParent from './components/EcoUserChild/EcoSettingsParent.vue';
import SampleDetector from './components/EcoUserChild/SampleDetector.vue';
import SampleFinancial from './components/EcoUserChild/SampleFinancial.vue';
import SampleSensor from './components/EcoUserChild/SampleSensor.vue';

const routes = [
  { path: '/', name: 'LandingPage', component: LandingPage },
  
  { path: '/admin-dashboard', name: 'AdminDashboard', component: AdminDashboard, meta: { requiresAuth: true, role: 'admin' } },
  { path: "/admin-management", name: "AdminManagement", component: AdminManagement, meta: { requiresAuth: true, role: "admin" } },
  { path: '/auth', name: 'UserAuth', component: UserAuth },
  { path: '/try', name: 'EcoTry', component: EcoTry },

  { path: '/device-logs', component: DeviceLogs , meta: { requiresAuth: true} },
  { path: '/system-logs', component: SystemLogs , meta: { requiresAuth: true} },

  {  // 🔹Tryyyyy EcoUserLayout for User Profile Display
  path: '/user',
    component: EcoUserParent,
    meta: { requiresAuth: true },
    children: [
      { path: 'profile-display', component: EcoProfilePage, meta: { requiresAuth: true, role: 'user' } },
      { path: 'dashboard', component: SampleDashboard, meta: { requiresAuth: true, role: 'user' } },
      { path: 'messenger', component: SampleMessenger, meta: { requiresAuth: true} },
      { path: 'model', component: SampleDetector, meta: { requiresAuth: true, role: 'user' } },
      { path: 'financial-management', component: SampleFinancial, meta: { requiresAuth: true, role: 'user' } },
      { path: 'sensor_data', component: SampleSensor, meta: { requiresAuth: true, role: 'user' } },
      { path: 'settings', component: EcoSettingsParent, meta: { requiresAuth: true },
        children: [
         { path: 'profile-display', component: EcoProfilePage, meta: { requiresAuth: true } },
         { path: 'edit-profile', component: SampleEditProfile, meta: { requiresAuth: true } },
         { path: 'reset-password', component: SampleResetPassword, meta: { requiresAuth: true } },
      ]
       },
      
      // other routes
    ]
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 🔹 Navigation Guard to Protect Routes
router.beforeEach(async (to, from, next) => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!user) {
      console.warn("Unauthorized access attempt. Redirecting to /auth.");
      next("/auth");
      return;
    }

    try {
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userRole = userSnap.data().role;

        if (to.meta.role && to.meta.role !== userRole) {
          console.warn(`Access denied for role: ${userRole}. Redirecting to /dashboard.`);
          next("/dashboard");
          return;
        }

        next();
      } else {
        console.error("User document does not exist. Redirecting to /auth.");
        next("/auth");
      }
    } catch (error) {
      console.error("Error checking user role:", error.message);
      next("/auth");
    }
  } else {
    next();
  }
});

// 🔹 Logout Function (Uses signOut)
export const logoutUser = async () => {
  const auth = getAuth();
  try {
    await signOut(auth);
    alert("You have been logged out.");
    router.push("/auth");
  } catch (error) {
    console.error("Logout failed:", error.message);
  }
};

// 🔹 Firebase Auth State Listener (Optional Enhancement)
onAuthStateChanged(getAuth(), (user) => {
  if (user) {
    console.log("User is signed in:", user.email);
  } else {
    console.log("No user is signed in.");
  }
});

export default router;
