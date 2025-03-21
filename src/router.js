import { createRouter, createWebHistory } from 'vue-router';
import { getAuth, signOut } from "firebase/auth"; // ✅ Import signOut here
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";
import UserRegister from './components/User_Register.vue';
import UserLogin from './components/User_Login.vue';
import EditUserProfile from './components/EditUserProfile.vue';
import UserDashboard from './components/User_Dashboard.vue';
import UserProfileDisplay from './components/UserProfileDisplay.vue';
import AdminDashboard from './components/Admin_Dashboard.vue';
import ResetPassword from './components/ResetPassword.vue';
import AdminManagement from "./components/AdminManagement.vue";
import FinancialManagement from './components/FinancialManagement.vue';

import MessengerChat from './components/messenger/MessengerChat.vue';

import SensorData from './components/SensorData.vue';
import LandingPage from './components/LandingPage.vue';
import MyModel from './components/Ecomist_Model.vue';

const routes = [
  { path: '/', name: 'LandingPage', component: LandingPage },
  { path: '/register', name: 'UserRegister', component: UserRegister },
  { path: '/login', name: 'UserLogin', component: UserLogin },
  { path: '/edit-profile', name: 'EditUserProfile', component: EditUserProfile, meta: { requiresAuth: true, role: 'user' } },
  { path: '/dashboard', name: 'UserDashboard', component: UserDashboard, meta: { requiresAuth: true } },
  { path: '/profile-display', name: 'UserProfileDisplay', component: UserProfileDisplay, meta: { requiresAuth: true, role: 'user' } },
  { path: '/admin-dashboard', name: 'AdminDashboard', component: AdminDashboard, meta: { requiresAuth: true, role: 'admin' } },
  { path: '/reset-password', name: 'ResetPassword', component: ResetPassword },
  { path: "/admin-management", name: "AdminManagement", component: AdminManagement, meta: { requiresAuth: true, role: "admin" } },
  { path: '/financial-management', component: FinancialManagement, meta: { requiresAuth: true, role: 'user' } },
  {
    path: '/messenger',name: 'Messenger',component: MessengerChat,meta: { requiresAuth: true }
  },
  { path: '/sensor_data', component: SensorData, meta: { requiresAuth: true, role: 'user' } },
  { path: '/model', component: MyModel },
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
      next("/login");
      return;
    }

    try {
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userRole = userSnap.data().role;

        if (to.meta.role && to.meta.role !== userRole) {
          alert("Access denied.");
          next("/dashboard");
          return;
        }

        next();
      } else {
        next("/login");
      }
    } catch (error) {
      console.error("Error checking user role:", error);
      next("/login");
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
    router.push("/login");
  } catch (error) {
    console.error("Logout failed:", error);
  }
};

export default router;
