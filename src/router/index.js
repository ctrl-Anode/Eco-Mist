import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import AdminDashboard from '../components/Admin_Dashboard.vue';
import AdminManagement from '../components/AdminManagement.vue';
import SystemSettings from '../components/SystemSettings.vue';
import UserManagement from '../components/UserManagement.vue';
import RolesPermissions from '../components/RolesPermissions.vue';
import ContentManagement from '../components/ContentManagement.vue';
import MediaLibrary from '../components/MediaLibrary.vue';
import SystemHealth from '../components/SystemHealth.vue';
import BackupRestore from '../components/BackupRestore.vue';
import ContactMessages from '../components/ContactMessages.vue';

import { authGuard } from '../auth-guard';
import Unauthorized from '../components/EcoUnauthorized.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/admin-dashboard',
    name: 'AdminDashboard',
    component: AdminDashboard,
    meta: { requiresAuth: true, role: 'admin' },
  },
  {
    path: '/admin-management',
    name: 'AdminManagement',
    component: AdminManagement,
    meta: { requiresAuth: true, role: 'admin' },
  },
  {
    path: '/system-logs',
    name: 'SystemLogs',
    component: () => import('../components/SystemLogs.vue'),
    meta: { requiresAuth: true, role: 'admin' },
  },
  {
    path: '/system-settings',
    name: 'SystemSettings',
    component: SystemSettings,
    meta: { requiresAuth: true, role: 'admin' },
  },
  {
    path: '/user-management',
    name: 'UserManagement',
    component: UserManagement,
    meta: { requiresAuth: true, role: 'admin' },
  },
  {
    path: '/roles-permissions',
    name: 'RolesPermissions',
    component: RolesPermissions,
    meta: { requiresAuth: true, role: 'admin' },
  },
  {
    path: '/content-management',
    name: 'ContentManagement',
    component: ContentManagement,
    meta: { requiresAuth: true, role: 'admin' },
  },
  {
    path: '/media-library',
    name: 'MediaLibrary',
    component: MediaLibrary,
    meta: { requiresAuth: true, role: 'admin' },
  },
  {
    path: '/system-health',
    name: 'SystemHealth',
    component: SystemHealth,
    meta: { requiresAuth: true, role: 'admin' },
  },
  {
    path: '/backup-restore',
    name: 'BackupRestore',
    component: BackupRestore,
    meta: { requiresAuth: true, role: 'admin' },
  },
  {
    path: '/contact-messages',
    name: 'ContactMessages',
    component: ContactMessages,
    meta: { requiresAuth: true, role: 'admin' },
  },
  {
    path: '/unauthorized',
    name: 'Unauthorized',
    component: Unauthorized
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;