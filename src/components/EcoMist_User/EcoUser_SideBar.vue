<template>
  <div class="relative">
    <!-- Overlay for mobile view -->
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
      @click="closeSidebar"
    ></div>

    <aside :class="[
      'bg-white shadow-lg z-20 transition-all duration-300 ease-in-out',
      sidebarOpen ? 'translate-x-0' : '-translate-x-full',
      'md:translate-x-0 fixed md:relative inset-y-0 left-0 w-64 overflow-y-auto'
    ]">
      <!-- Sidebar Header -->
      <div class="p-4 border-b flex justify-between items-center">
        <h2 class="text-lg font-semibold text-gray-800">Navigation</h2>
        <button
          @click="$emit('toggle-sidebar')"
          class="md:hidden text-gray-500 hover:text-gray-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Navigation Sections -->
      <nav class="p-4">
        <div v-for="(section, index) in navigationSections" :key="index" class="mb-6">
          <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{{ section.title }}</h3>
          <ul class="space-y-1">
            <li v-for="(route, idx) in getFilteredRoutes(section)" :key="idx">
              <router-link
                :to="route.path"
                :class="[
                  'flex items-center px-3 py-2 text-sm rounded-md',
                  currentRoute === route.path ? 'bg-emerald-100 text-emerald-700 font-medium' : 'text-gray-700 hover:bg-gray-100'
                ]"
                @click="closeSidebar"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" :class="currentRoute === route.path ? 'text-emerald-600' : 'text-gray-500'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path v-if="getIconForRoute(route) === 'layout-dashboard'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h18v4H3zM3 10h8v11H3zM13 10h8v11h-8z" />
                  <path v-else-if="getIconForRoute(route) === 'user'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  <path v-else-if="getIconForRoute(route) === 'user-cog'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v4m0 4v4m0 4v4m-4-8h8" />
                  <path v-else-if="getIconForRoute(route) === 'key'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  <path v-else-if="getIconForRoute(route) === 'shield'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 2l9 4-9 4-9-4 9-4z" />
                  <path v-else-if="getIconForRoute(route) === 'users'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2h5m4-10a4 4 0 100-8 4 4 0 000 8z" />
                  <path v-else-if="getIconForRoute(route) === 'bar-chart'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h4v11H3zM10 3h4v18h-4zM17 14h4v7h-4z" />
                  <path v-else-if="getIconForRoute(route) === 'message-circle'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 11.5a8.38 8.38 0 01-1.9 5.4 8.5 8.5 0 01-6.1 2.6 8.38 8.38 0 01-5.4-1.9L3 21l3.4-3.4a8.38 8.38 0 01-1.9-5.4 8.5 8.5 0 012.6-6.1 8.38 8.38 0 015.4-1.9 8.5 8.5 0 016.1 2.6 8.38 8.38 0 011.9 5.4z" />
                  <path v-else-if="getIconForRoute(route) === 'cpu'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 2v2m6-2v2m-6 16v2m6-2v2m-6-6h6m-6 4h6m-6-8h6m-6-4h6m-6 0H5a2 2 0 00-2 2v10a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-4m-6 0V4m6 0V4" />
                  <path v-else-if="getIconForRoute(route) === 'microscope'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 17a4 4 0 01-4-4V7a4 4 0 014-4h2a4 4 0 014 4v6a4 4 0 01-4 4h-2z" />
                  <path v-else-if="getIconForRoute(route) === 'settings'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 12h.01" />
                </svg>
                {{ route.name }}
              </router-link>
            </li>
          </ul>
        </div>

        <!-- System Status -->
        <EcoUser_SystemStatus
          :lastLogin="lastLogin"
          :role="role"
          :status="status"
        />
      </nav>
    </aside>
  </div>
</template>

<script setup>
import EcoUser_SystemStatus from './EcoUser_SystemStatus.vue';

const props = defineProps({
  sidebarOpen: Boolean,
  navigationSections: Array,
  currentRoute: String,
  role: String,
  lastLogin: Date,
  status: String
});

const emits = defineEmits(['toggle-sidebar', 'open-system-status']);

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
    '/user/dashboard': 'layout-dashboard',
    '/user/profile-display': 'user',
    '/user/edit-profile': 'user-cog',
    '/user/reset-password': 'key',
    '/admin-dashboard': 'shield',
    '/admin-management': 'users',
    '/user/financial-management': 'bar-chart',
    '/user/messenger': 'message-circle',
    '/user/sensor_data': 'cpu',
    '/user/model': 'microscope',
    '/user/settings/profile-display': 'settings'
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
