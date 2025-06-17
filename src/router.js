import { createRouter, createWebHistory } from 'vue-router';
import { getAuth, signOut } from "firebase/auth"; // ✅ Import signOut here
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

import LandingPage from './views/LandingPage.vue';
import UserAuth from './views/EcoAuth.vue';
import EcoUserParent from './views/EcoUserParent.vue';

//import EditUserProfile from './assets/LegacyCode/EditUserProfile.vue';
//import UserDashboard from './assets/LegacyCode/User_Dashboard.vue';
//import UserProfileDisplay from './assets/LegacyCode/UserProfileDisplay.vue';
import AdminDashboard from './components/EcoAdmin/Admin_Dashboard.vue';
//import ResetPassword from './assets/LegacyCode/ResetPassword.vue';
import AdminManagement from "./components/EcoAdmin/AdminManagement.vue";
//import FinancialManagement from './components/EcoUser/Financial/FinancialManagement.vue';

//import MessengerChat from './assets/LegacyCode/MessengerChat.vue';

//import SensorData from './components/EcoUser/Sensor/SensorData.vue';

//import MyModel from './components/EcoUser/Detection/Ecomist_Model.vue';



//import EcoSettings from "./assets/LegacyCode/EcoSettings.vue"
//import ThresholdControl from "./components/EcoUser/Sensor/ThresholdControl.vue"

import EcoTry from "./components/EcoTry.vue"

//import DeviceRegistration from './components/EcoUser/Sensor/DeviceRegistration.vue';
//import ThresholdConfig from './components/EcoUser/Sensor/ThresholdConfig.vue';
//import WiFiConfig from './components/EcoUser/Sensor/WiFiConfig.vue';

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
  //{ path: '/register', name: 'UserRegister', component: UserRegister },
  //{ path: '/login', name: 'UserLogin', component: UserLogin },
  //{ path: '/edit-profile', name: 'EditUserProfile', component: EditUserProfile, meta: { requiresAuth: true, role: 'user' } },
  //{ path: '/dashboard', name: 'UserDashboard', component: UserDashboard, meta: { requiresAuth: true} },
  //{ path: '/profile-display', name: 'UserProfileDisplay', component: UserProfileDisplay, meta: { requiresAuth: true, role: 'user' } },
  { path: '/admin-dashboard', name: 'AdminDashboard', component: AdminDashboard, meta: { requiresAuth: true, role: 'admin' } },
  //{ path: '/reset-password', name: 'ResetPassword', component: ResetPassword },
  { path: "/admin-management", name: "AdminManagement", component: AdminManagement, meta: { requiresAuth: true, role: "admin" } },
  //{ path: '/financial-management', component: FinancialManagement, meta: { requiresAuth: true, role: 'user' } },
  //{path: '/messenger',name: 'Messenger',component: MessengerChat,meta: { requiresAuth: true }},
  //{ path: '/sensor_data', component: SensorData, meta: { requiresAuth: true, role: 'user' } },
  //{ path: '/model',name: 'MyModel', component: MyModel, meta: { requiresAuth: true, role: 'user'} },
  { path: '/auth', name: 'UserAuth', component: UserAuth },
  //{ path: "/settings", name: "EcoSettings", component: EcoSettings, meta: { requiresAuth: true } },
  //{ path: "/threshold_controller", name: "ThresholdControl", component: ThresholdControl, meta: { requiresAuth: true } },
  { path: '/try', name: 'EcoTry', component: EcoTry },
  //{ path: '/device', component: DeviceRegistration , meta: { requiresAuth: true, role: 'user' } },
  //{ path: '/threshold', component: ThresholdConfig , meta: { requiresAuth: true, role: 'user' } },
  //{ path: '/wifi', component: WiFiConfig , meta: { requiresAuth: true, role: 'user' } },

  { path: '/device-logs', component: DeviceLogs , meta: { requiresAuth: true} },
  { path: '/system-logs', component: SystemLogs , meta: { requiresAuth: true} },

  {  // 🔹Tryyyyy EcoUserLayout for User Profile Display
  path: '/user',
    component: EcoUserParent,
    //meta: { requiresAuth: true, role: 'user' },
    children: [
      { path: 'profile-display', component: EcoProfilePage },
      { path: 'dashboard', component: SampleDashboard },
      { path: 'messenger', component: SampleMessenger },
      { path: 'model', component: SampleDetector },
      { path: 'financial-management', component: SampleFinancial },
      { path: 'sensor_data', component: SampleSensor },
      { path: 'settings', component: EcoSettingsParent,
        children: [
         { path: 'profile-display', component: EcoProfilePage },
         { path: 'edit-profile', component: SampleEditProfile },
         { path: 'reset-password', component: SampleResetPassword },
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
      next("/auth");
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
        next("/auth");
      }
    } catch (error) {
      console.error("Error checking user role:", error);
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
    console.error("Logout failed:", error);
  }
};

export default router;
