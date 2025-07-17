import { createRouter, createWebHistory } from 'vue-router';
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth"; // Added onAuthStateChanged for better auth state handling
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

import LandingPage from './views/LandingPage.vue';
import UserAuth from './views/EcoAuth.vue';
import EcoUserParent from './views/EcoUserParent.vue';
import EcoAdminParent from './views/EcoAdminParent.vue';

import EcoTry from "./components/EcoTry.vue"


///User
import EcoProfilePage from './components/EcoUserChild/EcoProfilePage.vue';
import SampleDashboard from './components/EcoUserChild/SampleDashboard.vue';
import SampleEditProfile from './components/EcoUserChild/SampleEditProfile.vue';
import SampleMessenger from './components/EcoUserChild/SampleMessenger.vue';
import SampleResetPassword from './components/EcoUserChild/SampleResetPassword.vue';
import EcoSettingsParent from './components/EcoUserChild/EcoSettingsParent.vue';
import SampleDetector from './components/EcoUserChild/SampleDetector.vue';
import SampleFinancial from './components/EcoUserChild/SampleFinancial.vue';
import SampleSensor from './components/EcoUserChild/SampleSensor.vue';

///Admin
import EcoAdmin_Dashboard from './components/EcoAdmin/EcoAdmin_Child/EcoAdmin_Dashboard.vue';
import EcoAdmin_UserManagement from './components/EcoAdmin/EcoAdmin_Child/EcoAdmin_UserManagement.vue';
import EcoAdmin_GuestContacts from './components/EcoAdmin/EcoAdmin_Child/EcoAdmin_GuestContacts.vue';
import EcoAdmin_DeviceLogs from './components/EcoAdmin/EcoAdmin_Child/EcoAdmin_DeviceLogs.vue';
import EcoAdmin_DeviceManagement from './components/EcoAdmin/EcoAdmin_Child/EcoAdmin_DeviceManagement.vue';
import EcoAdmin_SystemLogs from './components/EcoAdmin/EcoAdmin_Child/EcoAdmin_SystemLogs.vue';
import EcoAdmin_SMTP from './components/EcoAdmin/EcoAdmin_Child/EcoAdmin_SMTP.vue';
import EcoAdmin_Logger from './components/EcoAdmin/EcoAdmin_Child/EcoAdmin_Logger.vue';

import EcoUnAuth from './components/EcoUnauthorized.vue';
import EcoAdmin_CropAnalytics from './components/EcoAdmin/EcoAdmin_Child/EcoAdmin_CropAnalytics.vue';

const routes = [
  { path: '/', name: 'LandingPage', component: LandingPage },
  { path: '/auth', name: 'UserAuth', component: UserAuth },
  { path: '/try', name: 'EcoTry', component: EcoTry },
  { path: '/unauthorized', name: 'EcoUnAuth', component: EcoUnAuth },

  {  // 🔹Tryyyyy EcoUserLayout for User Profile Display
  path: '/user',
    component: EcoUserParent,
    meta: { requiresAuth: true, role: 'user' },
    children: [
      { path: 'profile-display', component: EcoProfilePage, meta: { requiresAuth: true, role: 'user' }},
      { path: 'dashboard', component: SampleDashboard, meta: { requiresAuth: true, role: 'user' } },
      { path: 'messenger', component: SampleMessenger, meta: { requiresAuth: true, role: 'user' }},
      { path: 'model', component: SampleDetector, meta: { requiresAuth: true, role: 'user' } },
      { path: 'financial-management', component: SampleFinancial, meta: { requiresAuth: true, role: 'user' } },
      { path: 'sensor_data', component: SampleSensor, meta: { requiresAuth: true, role: 'user' } },
      { path: 'settings', component: EcoSettingsParent, meta: { requiresAuth: true, role: 'user' },
        children: [
         { path: 'profile-display', component: EcoProfilePage, meta: { requiresAuth: true, role: 'user' } },
         { path: 'edit-profile', component: SampleEditProfile, meta: { requiresAuth: true, role: 'user' } },
         { path: 'reset-password', component: SampleResetPassword, meta: { requiresAuth: true, role: 'user' } },
      ]
       },
    ]
  },
  {
  path: '/admin',
    component: EcoAdminParent,
    meta: { requiresAuth: true, role: 'admin' },
     children: [

      { path: 'user-management', component: EcoAdmin_UserManagement, meta: { requiresAuth: true, role: 'admin'} },
      { path: 'dashboard', component: EcoAdmin_Dashboard, meta: { requiresAuth: true, role: 'admin'} },
      { path: 'profile-display', component: EcoProfilePage, meta: { requiresAuth: true, role: 'admin'} },
      { path: 'messenger', component: SampleMessenger, meta: { requiresAuth: true, role: 'admin'} },
      { path: 'settings', component: EcoSettingsParent, meta: { requiresAuth: true, role: 'admin' },
        children: [
         { path: 'profile-display', component: EcoProfilePage, meta: { requiresAuth: true, role: 'admin' } },
         { path: 'edit-profile', component: SampleEditProfile, meta: { requiresAuth: true, role: 'admin' } },
         { path: 'reset-password', component: SampleResetPassword, meta: { requiresAuth: true, role: 'admin' } },
      ]
       },
       { path: 'guest-contacts', component: EcoAdmin_GuestContacts, meta: { requiresAuth: true, role: 'admin'} },
       { path: 'device-logs', component: EcoAdmin_DeviceLogs, meta: { requiresAuth: true, role: 'admin'} },
       { path: 'device-management', component: EcoAdmin_DeviceManagement, meta: { requiresAuth: true, role: 'admin'} },
       { path: 'system-logs', component: EcoAdmin_SystemLogs, meta: { requiresAuth: true, role: 'admin'} },
       { path: 'smtp-settings', component: EcoAdmin_SMTP, meta: { requiresAuth: true, role: 'admin' } },
       { path: 'logger', component: EcoAdmin_Logger, meta: { requiresAuth: true, role: 'admin' } },
       { path: 'crop-analysis-analytics-management', component: EcoAdmin_CropAnalytics, meta: { requiresAuth: true, role: 'admin' } },
     ]
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth',
      };
    } else {
      return { top: 0 };
    }
  }
});

// 🔹 Navigation Guard to Protect Routes
router.beforeEach(async (to, from, next) => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!user) {
      console.warn("Unauthorized access attempt. Redirecting to auth.");
      next("/auth");
      return;
    }

    try {
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userRole = userSnap.data().role;

        if (to.meta.role && to.meta.role !== userRole) {
          console.warn(`Access denied for role: ${userRole}. Redirecting....`);
          next("/unauthorized");
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
