<template>
  <div class="relative">
    <!-- Mobile Overlay -->
    <div v-if="sidebarOpen" class="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden" @click="closeSidebar"></div>

    <!-- Sidebar -->
    <aside :class="[
      'bg-white shadow-lg z-20 transition-all duration-300 ease-in-out',
      sidebarOpen ? 'translate-x-0' : '-translate-x-full',
      'md:translate-x-0 fixed md:relative inset-y-0 left-0 w-64 overflow-y-auto'
    ]">
      <!-- Header -->
      <div class="p-4 border-b flex justify-between items-center">
        <h2 class="text-lg font-semibold text-gray-800">Administrator</h2>
        <button @click="$emit('toggle-sidebar')" class="md:hidden text-gray-500 hover:text-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Navigation -->
      <nav class="p-4">
        <div v-for="(section, index) in navigationSections" :key="index" class="mb-6">
          <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{{ section.title }}</h3>
          <ul class="space-y-1">
            <li v-for="(route, idx) in getFilteredRoutes(section)" :key="idx">
              <router-link
                :to="route.path"
                :class="[
                  'flex items-center px-3 py-2 text-sm rounded-md',
                  currentRoute === route.path
                    ? 'bg-emerald-100 text-emerald-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                ]"
                @click="closeSidebar"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" :class="currentRoute === route.path ? 'text-emerald-600' : 'text-gray-500'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path v-if="getIconForRoute(route) === 'layout-dashboard'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h18v4H3zM3 10h8v11H3zM13 10h8v11h-8z" />
                  <path v-else-if="getIconForRoute(route) === 'message-circle'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 11.5a8.5 8.5 0 01-8.5 8.5A8.38 8.38 0 017 18l-4 3 3-4a8.38 8.38 0 01-1.5-5.5 8.5 8.5 0 018.5-8.5 8.5 8.5 0 018.5 8.5z" />
                  <path v-else-if="getIconForRoute(route) === 'users'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2h5m4-10a4 4 0 100-8 4 4 0 000 8z" />
                  <path v-else-if="getIconForRoute(route) === 'settings'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  <path v-else-if="getIconForRoute(route) === 'logs'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7h18M3 12h18M3 17h18" />
                  <path v-else-if="getIconForRoute(route) === 'tools'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.7 6.3a1 1 0 011.4 0l1.6 1.6a1 1 0 010 1.4L6.3 21.7a1 1 0 01-1.4 0L3.3 20a1 1 0 010-1.4l12-12z" />
                  <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 12h.01" />
                </svg>
                {{ route.name }}
              </router-link>
            </li>
          </ul>
        </div>

        <!-- System Status -->
        <EcoAdmin_SystemStatus :lastLogin="lastLogin" :role="role" :status="status" />
      </nav>
    </aside>
  </div>
</template>

<script setup>
import EcoAdmin_SystemStatus from './EcoAdmin_SystemStatus.vue';

const props = defineProps({
  sidebarOpen: Boolean,
  navigationSections: Array,
  currentRoute: String,
  role: String,
  lastLogin: Date,
  status: String
});

const emits = defineEmits(['toggle-sidebar']);

const getFilteredRoutes = (section) => {
  return section.routes.filter(route => {
    if (route.meta?.requiresAuth && route.meta.role && route.meta.role !== props.role.toLowerCase()) {
      return false;
    }
    return true;
  });
};

const getIconForRoute = (route) => {
  const iconMap = {
    '/admin/dashboard': 'layout-dashboard',
    '/admin/messenger': 'message-circle',
    '/admin/user-management': 'users',
    '/admin/settings/profile-display': 'settings',
    '/admin/system-logs': 'logs',
    '/admin/device-management': 'tools',
    '/admin/device-logs': 'logs',
    '/admin/guest-contacts': 'message-circle'
  };
  return iconMap[route.path] || 'link';
};

const closeSidebar = () => {
  emits('toggle-sidebar');
};
</script>

<style scoped>
@media (max-width: 768px) {
  aside {
    width: 100%;
    max-width: 256px;
  }
}
</style>
