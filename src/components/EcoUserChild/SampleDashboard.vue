<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    
    <!-- Main Content Area with Sidebar -->
    <div class="flex flex-1 overflow-hidden">
      <!-- Main Content -->
      <main class="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-6">
        <!-- Page Header -->
        <div class="mb-6">
          <h1 class="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
          <p class="text-gray-600">Welcome back, {{ username }}! Here's your system overview.</p>
        </div>

        <!-- Overview Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div 
            v-for="(feature, index) in features" 
            :key="index" 
            class="bg-white rounded-lg shadow-sm p-4 border-l-4"
            :class="feature.color"
          >
            <div class="flex justify-between items-start">
              <div>
                <p class="text-sm font-medium text-gray-500">{{ feature.name }}</p>
                <h3 class="text-xl font-bold text-gray-800 mt-1">{{ feature.value }}</h3>
                <p class="text-gray-600 text-xs mt-1">{{ feature.description }}</p>
              </div>
              <div class="p-2 rounded-lg" :class="feature.bgColor">
                <svg :class="feature.iconClass" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="feature.iconPath" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Main Content Tabs -->
        <div class="bg-white rounded-lg shadow-sm mb-6">
          <div class="border-b">
            <nav class="flex -mb-px">
              <button 
                v-for="tab in dashboardTabs" 
                :key="tab.id"
                @click="currentDashboardTab = tab.id" 
                :class="[
                  'py-4 px-6 font-medium text-sm border-b-2 focus:outline-none',
                  currentDashboardTab === tab.id 
                    ? 'border-emerald-500 text-emerald-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                ]"
              >
                {{ tab.name }}
              </button>
            </nav>
          </div>

          <!-- Tab Content -->
          <div class="p-6">
            <!-- Quick Access Tab -->
            <div v-if="currentDashboardTab === 'quick-access'">
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div 
                  v-for="(functionality, index) in functionalities" 
                  :key="index" 
                  class="bg-gray-100 rounded-lg p-4 flex items-center space-x-4 hover:bg-gray-200 cursor-pointer transition-colors relative"
                  @click="navigateTo(functionality.route)"
                >
                  <div class="p-3 rounded-lg" :class="functionality.bgColor">
                    <svg :class="functionality.iconClass" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="functionality.iconPath" />
                    </svg>
                  </div>
                  <div>
                    <h3 class="text-lg font-medium text-gray-800">{{ functionality.name }}</h3>
                    <p class="text-sm text-gray-600">{{ functionality.description }}</p>
                  </div>
                  
                  <!-- Loading Spinner (shown when loading) -->
                  <div v-if="functionality.loading" class="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 rounded-lg">
                    <div class="spinner">
                      <div></div>
                      <div></div>
                      <div></div>
                      <div></div>
                      <div></div>
                      <div></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Recent Activity Tab -->
            <div v-if="currentDashboardTab === 'recent-activity'">
              <div class="space-y-4">
                <div v-if="recentActivities.length === 0" class="text-center py-8 text-gray-500">
                  No recent activities to display
                </div>
                <div 
                  v-for="(activity, index) in recentActivities" 
                  :key="index" 
                  class="bg-gray-50 rounded-lg p-4 flex items-start space-x-4"
                >
                  <div :class="[
                    'p-2 rounded-full',
                    activity.type === 'login' ? 'bg-blue-100 text-blue-600' :
                    activity.type === 'data' ? 'bg-green-100 text-green-600' :
                    activity.type === 'system' ? 'bg-purple-100 text-purple-600' :
                    'bg-gray-100 text-gray-600'
                  ]">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path 
                        stroke-linecap="round" 
                        stroke-linejoin="round" 
                        stroke-width="2" 
                        :d="activity.type === 'login' ? 'M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1' :
                            activity.type === 'data' ? 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' :
                            activity.type === 'system' ? 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' :
                            'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'"
                      />
                    </svg>
                  </div>
                  <div class="flex-1">
                    <div class="flex justify-between">
                      <p class="font-medium text-gray-800">{{ activity.title }}</p>
                      <span class="text-xs text-gray-500">{{ formatDate(activity.timestamp) }}</span>
                    </div>
                    <p class="text-sm text-gray-600 mt-1">{{ activity.description }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- System Status Tab -->
            <div v-if="currentDashboardTab === 'system-status'">
              <div class="space-y-6">
                <!-- System Health -->
                <div>
                  <h3 class="text-lg font-medium text-gray-800 mb-4">System Health</h3>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div v-for="(metric, index) in systemMetrics" :key="index" class="bg-gray-50 rounded-lg p-4">
                      <div class="flex justify-between items-center mb-2">
                        <span class="text-sm font-medium text-gray-700">{{ metric.name }}</span>
                        <span :class="[
                          'text-xs px-2 py-0.5 rounded-full',
                          metric.status === 'good' ? 'bg-green-100 text-green-800' :
                          metric.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        ]">
                          {{ metric.statusText }}
                        </span>
                      </div>
                      <div class="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          class="h-2.5 rounded-full" 
                          :class="[
                            metric.status === 'good' ? 'bg-green-600' :
                            metric.status === 'warning' ? 'bg-yellow-500' : 'bg-red-600'
                          ]"
                          :style="{ width: `${metric.value}%` }"
                        ></div>
                      </div>
                      <p class="text-xs text-gray-500 mt-2">{{ metric.description }}</p>
                    </div>
                  </div>
                </div>

                <!-- Upcoming Maintenance -->
                <div>
                  <h3 class="text-lg font-medium text-gray-800 mb-4">Upcoming Maintenance</h3>
                  <div class="bg-gray-50 rounded-lg p-4">
                    <div v-if="maintenanceEvents.length === 0" class="text-center py-4 text-gray-500">
                      No scheduled maintenance events
                    </div>
                    <div v-else class="space-y-4">
                      <div v-for="(event, index) in maintenanceEvents" :key="index" class="flex items-start space-x-4">
                        <div class="bg-blue-100 text-blue-600 p-2 rounded-full">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div class="flex-1">
                          <div class="flex justify-between">
                            <p class="font-medium text-gray-800">{{ event.title }}</p>
                            <span class="text-xs text-gray-500">{{ formatDate(event.date) }}</span>
                          </div>
                          <p class="text-sm text-gray-600 mt-1">{{ event.description }}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Links -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-xl font-bold text-gray-800 mb-4">Quick Links</h2>
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <a 
              v-for="(link, index) in quickLinks" 
              :key="index" 
              href="#"
              @click.prevent="handleQuickLink(link)"
              class="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors relative"
            >
              <div :class="[link.iconBg, 'p-3 rounded-full mb-2']">
                <svg :class="link.iconColor" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="link.iconPath" />
                </svg>
              </div>
              <span class="text-sm font-medium text-gray-700 text-center">{{ link.name }}</span>
              
              <!-- Loading Spinner (shown when loading) -->
              <div v-if="link.loading" class="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 rounded-lg">
                <div class="spinner">
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
              </div>
            </a>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, inject } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { getFirestore, addDoc } from "firebase/firestore"; 
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';

// Router
const router = useRouter();
const route = useRoute();
const currentRoute = computed(() => route.path);

// State variables
const username = ref("");
const role = ref("");
const lastLogin = ref(new Date());
const sidebarOpen = ref(true);
const userMenuOpen = ref(false);
const notificationCount = ref(2);
const isMobile = ref(false);
const userMenuRef = ref(null);
const showLogoutModal = ref(false);
const showFeedbackModal = ref(false);
const feedbackType = ref('suggestion');
const feedbackMessage = ref('');
const currentDashboardTab = ref('quick-access');
const toast = ref({ show: false, message: '', type: 'success' });
const submittingFeedback = ref(false);
const loggingOut = ref(false);
const notifications = ref([]);
const loadingNotifications = ref(true);

// Dashboard tabs
const dashboardTabs = [
  { id: 'quick-access', name: 'Quick Access' },
  { id: 'recent-activity', name: 'Recent Activity' },
  { id: 'system-status', name: 'System Status' }
];

// Feature cards
const features = [
  { 
    name: "Sensor Readings", 
    value: "24", 
    description: "Active sensors monitoring your system", 
    color: "border-blue-500", 
    bgColor: "bg-blue-100", 
    iconClass: "text-blue-600", 
    iconPath: "M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" 
  },
  { 
    name: "System Health", 
    value: "98%", 
    description: "Overall system performance", 
    color: "border-green-500", 
    bgColor: "bg-green-100", 
    iconClass: "text-green-600", 
    iconPath: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" 
  },
  { 
    name: "Crop Analysis", 
    value: "3", 
    description: "Pending crop analyses", 
    color: "border-purple-500", 
    bgColor: "bg-purple-100", 
    iconClass: "text-purple-600", 
    iconPath: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
  },
  { 
    name: "Alerts", 
    value: "0", 
    description: "No active alerts in your system", 
    color: "border-yellow-500", 
    bgColor: "bg-yellow-100", 
    iconClass: "text-yellow-600", 
    iconPath: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
  }
];

// System functionalities with loading state
const functionalities = ref([
  { 
    name: "Financial Management", 
    description: "Manage your finances effectively", 
    route: "/financial-management", 
    bgColor: "bg-green-100", 
    iconClass: "text-green-600", 
    iconPath: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z",
    loading: false
  },
  { 
    name: "Sensor Data", 
    description: "View and analyze sensor data", 
    route: "/sensor_data", 
    bgColor: "bg-blue-100", 
    iconClass: "text-blue-600", 
    iconPath: "M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z",
    loading: false
  },
  { 
    name: "Crop Disease Detector", 
    description: "Detect crop diseases using AI", 
    route: "/model", 
    bgColor: "bg-purple-100", 
    iconClass: "text-purple-600", 
    iconPath: "M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z",
    loading: false
  },
  { 
    name: "User Profile", 
    description: "View and edit your profile", 
    route: "/profile-display", 
    bgColor: "bg-indigo-100", 
    iconClass: "text-indigo-600", 
    iconPath: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
    loading: false
  },
  { 
    name: "Messenger", 
    description: "Chat with support and team", 
    route: "/messenger", 
    bgColor: "bg-pink-100", 
    iconClass: "text-pink-600", 
    iconPath: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z",
    loading: false
  },
  { 
    name: "Settings", 
    description: "Configure system settings", 
    route: "/settings", 
    bgColor: "bg-gray-100", 
    iconClass: "text-gray-600", 
    iconPath: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z",
    loading: false
  }
]);

// Recent activities
const recentActivities = ref([
  {
    type: 'login',
    title: 'System Login',
    description: 'You logged in to the system',
    timestamp: new Date(Date.now() - 1000 * 60 * 30) // 30 minutes ago
  },
  {
    type: 'data',
    title: 'Sensor Data Updated',
    description: 'Sensor data was successfully updated',
    timestamp: new Date(Date.now() - 1000 * 60 * 120) // 2 hours ago
  },
  {
    type: 'system',
    title: 'System Update',
    description: 'System was updated to version 2.4.1',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24) // 1 day ago
  }
]);

// System metrics
const systemMetrics = ref([
  {
    name: 'CPU Usage',
    value: 32,
    status: 'good',
    statusText: 'Normal',
    description: 'Current CPU usage is within normal range'
  },
  {
    name: 'Memory Usage',
    value: 68,
    status: 'warning',
    statusText: 'Moderate',
    description: 'Memory usage is higher than usual'
  },
  {
    name: 'Disk Space',
    value: 45,
    status: 'good',
    statusText: 'Normal',
    description: 'Plenty of disk space available'
  },
  {
    name: 'Network',
    value: 92,
    status: 'good',
    statusText: 'Excellent',
    description: 'Network connectivity is excellent'
  }
]);

// Maintenance events
const maintenanceEvents = ref([
  {
    title: 'System Update',
    description: 'Scheduled system update for performance improvements',
    date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3) // 3 days from now
  },
  {
    title: 'Database Maintenance',
    description: 'Routine database optimization and cleanup',
    date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7) // 7 days from now
  }
]);

// Quick links with loading state
const quickLinks = ref([
  {
    name: 'Documentation',
    url: '#',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    iconPath: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
    loading: false
  },
  {
    name: 'Support',
    url: '#',
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
    iconPath: 'M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z',
    loading: false
  },
  {
    name: 'Reports',
    url: '#',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
    iconPath: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    loading: false
  },
  {
    name: 'Analytics',
    url: '#',
    iconBg: 'bg-yellow-100',
    iconColor: 'text-yellow-600',
    iconPath: 'M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z',
    loading: false
  },
  {
    name: 'Settings',
    url: '#',
    iconBg: 'bg-gray-100',
    iconColor: 'text-gray-600',
    iconPath: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z',
    loading: false
  },
  {
    name: 'Help',
    url: '#',
    iconBg: 'bg-pink-100',
    iconColor: 'text-pink-600',
    iconPath: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z',
    loading: false
  }
]);


// Firestore setup
const db = getFirestore();

// Methods
const getInitials = (name) => {
  if (!name) return "U";
  return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
};
const handleClickOutside = (event) => {
  if (userMenuRef.value && !userMenuRef.value.contains(event.target)) {
    userMenuOpen.value = false;
  }
};

const checkIfMobile = () => {
  isMobile.value = window.innerWidth < 768;
  if (isMobile.value) {
    sidebarOpen.value = false;
  } else {
    // Get saved sidebar state or default to open on desktop
    const savedState = localStorage.getItem('sidebarOpen');
    sidebarOpen.value = savedState !== null ? savedState === 'true' : true;
  }
};

const navigateTo = (route) => {
  // Find the functionality and set its loading state
  const functionality = functionalities.value.find(f => f.route === route);
  if (functionality) {
    functionality.loading = true;
    
    // Simulate a delay to show the spinner
    setTimeout(() => {
      router.push(route);
      functionality.loading = false;
    }, 1000);
  } else {
    router.push(route);
  }
};

const handleQuickLink = (link) => {
  // Set the loading state for this link
  link.loading = true;
  
  // Simulate a delay to show the spinner
  setTimeout(() => {
    // Here you would typically navigate to the link or perform an action
    console.log(`Clicked on ${link.name}`);
    showToast(`${link.name} link clicked`, 'success');
    link.loading = false;
  }, 1500);
};

const showToast = (message, type = 'success') => {
  toast.value = { show: true, message, type };
  setTimeout(() => {
    toast.value.show = false;
  }, 3000);
};

const closeFeedbackModal = () => {
  showFeedbackModal.value = false;
  feedbackMessage.value = '';
  feedbackType.value = 'suggestion';
};


// Fetch notifications for the user
const fetchNotifications = () => {
  loadingNotifications.value = true;
  const userId = "currentUserId"; // Replace with actual user ID logic
  const notificationsQuery = query(
    collection(db, 'feedback_notifications'),
    where('userId', '==', userId),
    orderBy('timestamp', 'desc')
  );

  onSnapshot(notificationsQuery, (snapshot) => {
    notifications.value = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    loadingNotifications.value = false;
  }, (error) => {
    console.error("Error fetching notifications:", error);
    loadingNotifications.value = false;
  });
};

// Format date utility
const formatDate = (timestamp) => {
  if (!timestamp) return 'Unknown';
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(date);
};

// Initialize component
onMounted(() => {
  // Check if mobile on initial load
  checkIfMobile();
  
  // Add resize event listener
  window.addEventListener('resize', handleResize);
  
  // Add click outside listener for user menu
  document.addEventListener('click', handleClickOutside);
  
  // Fetch the logged-in user's name
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      username.value = user.displayName || "User";
      // Set last login time
      lastLogin.value = new Date();
    } else {
      username.value = "Guest";
    }
  });

  fetchNotifications();
});

// Handle window resize
const handleResize = () => {
  checkIfMobile();
};

// Watch for route changes to close sidebar on mobile
watch(currentRoute, () => {
  if (isMobile.value) {
    sidebarOpen.value = false;
    document.body.style.overflow = '';
  }
  // Close user menu when route changes
  userMenuOpen.value = false;
});
</script>

<style scoped>
/* Custom styles for the user dashboard */
.bg-pattern {
  background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.2'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
}

/* Focus styles for accessibility */
button:focus-visible,
a:focus-visible {
  outline: 2px solid #10b981;
  outline-offset: 2px;
}

/* 3D Cube Spinner */
.spinner {
  width: 44px;
  height: 44px;
  animation: spinner-y0fdc1 2s infinite ease;
  transform-style: preserve-3d;
}

.spinner > div {
  background-color: rgba(16, 185, 129, 0.2);
  height: 100%;
  position: absolute;
  width: 100%;
  border: 2px solid #10b981;
}

.spinner div:nth-of-type(1) {
  transform: translateZ(-22px) rotateY(180deg);
}

.spinner div:nth-of-type(2) {
  transform: rotateY(-270deg) translateX(50%);
  transform-origin: top right;
}

.spinner div:nth-of-type(3) {
  transform: rotateY(270deg) translateX(-50%);
  transform-origin: center left;
}

.spinner div:nth-of-type(4) {
  transform: rotateX(90deg) translateY(-50%);
  transform-origin: top center;
}

.spinner div:nth-of-type(5) {
  transform: rotateX(-90deg) translateY(50%);
  transform-origin: bottom center;
}

.spinner div:nth-of-type(6) {
  transform: translateZ(22px);
}

/* Smaller spinner for buttons */
.spinner-sm {
  width: 24px;
  height: 24px;
}

@keyframes spinner-y0fdc1 {
  0% {
    transform: rotate(45deg) rotateX(-25deg) rotateY(25deg);
  }

  50% {
    transform: rotate(45deg) rotateX(-385deg) rotateY(25deg);
  }

  100% {
    transform: rotate(45deg) rotateX(-385deg) rotateY(385deg);
  }
}
</style>