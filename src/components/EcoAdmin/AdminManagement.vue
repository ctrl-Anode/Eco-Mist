<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <!-- Top Navigation Bar -->
    <header class="bg-gradient-to-r from-emerald-700 to-green-600 shadow-lg z-10">
      <div class="container mx-auto px-4 py-3">
        <div class="flex items-center justify-between">
          <!-- Logo and Mobile Menu Button -->
          <div class="flex items-center">
            <button @click="toggleSidebar" class="mr-3 md:hidden text-white">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div class="flex items-center">
              <img src="/eco-mist-logo.png" alt="Eco-Mist Logo" class="h-7 w-7 mr-3 rounded-lg shadow-md bg-white p-1.5" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2240%22 height=%2240%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%2216a34a%22 stroke-width=%222%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22><path d=%22M2 12a10 10 0 1 1 20 0 10 10 0 0 1-20 0Z%22/><path d=%22M2 12h20%22/><path d=%22M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z%22/></svg>';">
              <div>
                <h1 class="text-xl font-bold text-white">Eco-Mist</h1>
                <p class="text-green-100 text-xs hidden sm:block">Admin Dashboard</p>
              </div>
            </div>
          </div>

          <!-- User Profile -->
          <div class="flex items-center space-x-3">
            <!-- Notification Bell -->
            <div class="relative">
              <button class="text-white p-1 rounded-full hover:bg-white hover:bg-opacity-10 focus:outline-none">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span v-if="notificationCount > 0" class="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {{ notificationCount }}
                </span>
              </button>
            </div>

            <!-- Help Button -->
            <button class="text-white p-1 rounded-full hover:bg-white hover:bg-opacity-10 focus:outline-none">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>

            <!-- User Profile Dropdown -->
            <div class="relative" ref="userMenuRef">
              <button @click="toggleUserMenu" class="flex items-center space-x-2 focus:outline-none">
                <div class="bg-white text-emerald-700 h-8 w-8 rounded-full flex items-center justify-center font-bold text-sm shadow">
                  {{ getInitials(username) }}
                </div>
                <span class="text-white hidden md:block">{{ username }}</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white hidden md:block" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="m6 9 6 6 6-6"></path>
                </svg>
              </button>

              <!-- User Menu Dropdown -->
              <div v-if="userMenuOpen" class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20">
                <router-link to="/profile-display" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</router-link>
                <router-link to="/settings" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</router-link>
                <a @click="confirmLogout" href="#" class="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100">Logout</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content Area with Sidebar -->
    <div class="flex flex-1 overflow-hidden">
      <!-- Sidebar Navigation -->
      <aside :class="[
        'bg-white shadow-lg z-20 transition-all duration-300 ease-in-out',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        'md:translate-x-0 fixed md:relative inset-y-0 left-0 w-64 overflow-y-auto'
      ]">
        <!-- Sidebar Header -->
        <div class="p-4 border-b">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold text-gray-800">Navigation</h2>
            <button @click="toggleSidebar" class="md:hidden text-gray-500 hover:text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Navigation Sections -->
        <nav class="p-4">
          <div v-for="(section, sectionIndex) in navigationSections" :key="sectionIndex" class="mb-6">
            <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{{ section.title }}</h3>
            <ul class="space-y-1">
              <li v-for="route in getFilteredRoutes(section)" :key="route.path">
                <router-link 
                  :to="route.path" 
                  :class="[
                    'flex items-center px-3 py-2 text-sm rounded-md',
                    currentRoute === route.path 
                      ? 'bg-emerald-100 text-emerald-700 font-medium' 
                      : 'text-gray-700 hover:bg-gray-100'
                  ]"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" :class="currentRoute === route.path ? 'text-emerald-600' : 'text-gray-500'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path v-if="getIconForRoute(route) === 'layout-dashboard'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                    <path v-else-if="getIconForRoute(route) === 'users'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    <path v-else-if="getIconForRoute(route) === 'file-text'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    <path v-else-if="getIconForRoute(route) === 'settings'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path v-else-if="getIconForRoute(route) === 'user'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    <path v-else-if="getIconForRoute(route) === 'shield'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    <path v-else-if="getIconForRoute(route) === 'database'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                    <path v-else-if="getIconForRoute(route) === 'message-square'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    <path v-else-if="getIconForRoute(route) === 'activity'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M22 12h-4l-3 9L9 3l-3 9H2" />
                    <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  {{ route.name }}
                </router-link>
              </li>
            </ul>
          </div>
        </nav>

        <!-- System Info -->
        <div class="p-4 border-t">
          <div class="bg-gray-50 rounded-lg p-3">
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs font-medium text-gray-500">System Status</span>
              <span class="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">
                Online
              </span>
            </div>
            <div class="text-xs text-gray-500 flex flex-col space-y-1">
              <div class="flex justify-between">
                <span>Last Login:</span>
                <span class="font-medium text-gray-700">{{ formatDate(lastLogin) }}</span>
              </div>
              <div class="flex justify-between">
                <span>Account Type:</span>
                <span class="font-medium text-gray-700">{{ role }}</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-6">
        <!-- Page Header -->
        <div class="mb-6">
          <h1 class="text-2xl font-bold text-gray-800">User Management</h1>
          <p class="text-gray-600">Manage system users and their permissions</p>
        </div>

        <!-- User Management Content -->
        <div class="bg-white rounded-lg shadow-lg p-6">
          <div class="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
            <!-- Search and Filter -->
            <div class="flex flex-col md:flex-row gap-3 w-full">
              <div class="relative flex-grow">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input 
                  type="text" 
                  v-model="searchQuery" 
                  placeholder="Search users..."
                  class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent w-full"
                >
              </div>
              <select 
                v-model="statusFilter" 
                class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="deactivated">Deactivated</option>
              </select>
              <select 
                v-model="roleFilter" 
                class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="all">All Roles</option>
                <option value="user">Users</option>
                <option value="admin">Admins</option>
              </select>
            </div>
          </div>

          <!-- Loading State -->
          <div v-if="loading" class="flex items-center justify-center min-h-[300px]">
            <div class="spinner">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
            <p class="ml-4 text-gray-600">Loading users...</p>
          </div>

          <!-- Error Message -->
          <div v-else-if="errorMessage" class="flex flex-col items-center justify-center py-12 text-red-600">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="text-lg font-medium mb-4">{{ errorMessage }}</p>
            <button @click="fetchUsers" class="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Retry
            </button>
          </div>

          <!-- Users Table -->
          <div v-else-if="filteredUsers.length" class="overflow-hidden border border-gray-200 rounded-lg">
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead>
                  <tr class="bg-gray-50">
                    <th class="px-4 py-3 text-left">
                      <div class="flex items-center gap-2 cursor-pointer" @click="sortUsers('username')">
                        <span class="text-gray-700 font-medium">User</span>
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                        </svg>
                      </div>
                    </th>
                    <th class="px-4 py-3 text-left">
                      <div class="flex items-center gap-2 cursor-pointer" @click="sortUsers('email')">
                        <span class="text-gray-700 font-medium">Email</span>
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                        </svg>
                      </div>
                    </th>
                    <th class="px-4 py-3 text-left">
                      <div class="flex items-center gap-2 cursor-pointer" @click="sortUsers('role')">
                        <span class="text-gray-700 font-medium">Role</span>
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                        </svg>
                      </div>
                    </th>
                    <th class="px-4 py-3 text-left">
                      <div class="flex items-center gap-2 cursor-pointer" @click="sortUsers('status')">
                        <span class="text-gray-700 font-medium">Status</span>
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                        </svg>
                      </div>
                    </th>
                    <th class="px-4 py-3 text-left">
                      <div class="flex items-center gap-2 cursor-pointer" @click="sortUsers('lastActive')">
                        <span class="text-gray-700 font-medium">Last Active</span>
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                        </svg>
                      </div>
                    </th>
                    <th class="px-4 py-3 text-left">
                      <span class="text-gray-700 font-medium">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="user in paginatedUsers" :key="user.id" :class="{ 'opacity-60': user.status === 'deactivated' }" class="border-t border-gray-200 hover:bg-gray-50 transition-colors">
                    <td class="px-4 py-3">
                      <div class="flex items-center gap-3">
                        <img :src="user.profileImage || defaultAvatar" :alt="user.username" class="w-8 h-8 rounded-full object-cover">
                        <span class="text-gray-800 font-medium">{{ user.username || "Unknown" }}</span>
                      </div>
                    </td>
                    <td class="px-4 py-3 text-gray-600">{{ user.email }}</td>
                    <td class="px-4 py-3">
                      <select 
                        v-model="user.role" 
                        @change="updateUserRole(user)"
                        :disabled="user.status === 'deactivated'"
                        class="px-2 py-1 rounded-full text-xs font-medium"
                        :class="user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td class="px-4 py-3">
                      <span class="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium" 
                        :class="user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                        <svg v-if="user.status === 'active'" xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        {{ user.status === 'deactivated' ? 'Deactivated' : 'Active' }}
                      </span>
                    </td>
                    <td class="px-4 py-3">
                      <span class="inline-flex items-center gap-1 text-gray-500 text-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {{ formatLastActive(user.lastActive) }}
                      </span>
                    </td>
                    <td class="px-4 py-3">
                      <div class="flex items-center gap-2">
                        <button 
                          v-if="user.status === 'active'" 
                          @click="confirmDeactivation(user)" 
                          class="p-1.5 rounded-lg bg-yellow-50 text-yellow-600 hover:bg-yellow-100 transition-colors"
                          title="Deactivate User"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                          </svg>
                        </button>
                        <button 
                          v-else 
                          @click="confirmReactivation(user)" 
                          class="p-1.5 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
                          title="Reactivate User"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </button>
                        <button 
                          @click="confirmDeletion(user)" 
                          class="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                          title="Delete User"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Pagination -->
            <div class="flex items-center justify-between px-4 py-3 bg-gray-50 border-t border-gray-200">
              <div class="text-sm text-gray-600">
                Showing {{ paginationStart + 1 }}-{{ Math.min(paginationStart + itemsPerPage, filteredUsers.length) }} of {{ filteredUsers.length }}
              </div>
              <div class="flex items-center gap-2">
                <button 
                  @click="prevPage" 
                  :disabled="currentPage === 1"
                  class="p-1.5 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button 
                  @click="nextPage" 
                  :disabled="currentPage === totalPages"
                  class="p-1.5 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else class="flex flex-col items-center justify-center py-12 text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <p class="text-lg font-medium mb-1">No users found</p>
            <p class="text-sm">Try adjusting your search or filters</p>
          </div>
        </div>
      </main>
    </div>

    <!-- Confirmation Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full" @click.stop>
        <div class="p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-xl font-bold flex items-center gap-2" :class="getModalHeaderClass()">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" :class="getModalIconClass()" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path v-if="modalType === 'deactivate'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                <path v-else-if="modalType === 'reactivate'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              {{ modalTitle }}
            </h3>
            <button @click="closeModal" class="text-gray-500 hover:text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div class="mb-6">
            <p class="text-gray-600 mb-4">{{ modalMessage }}</p>
            <div v-if="modalType === 'deactivate'" class="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700 text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>This will prevent the user from accessing their account</span>
            </div>
          </div>
          <div class="flex justify-end gap-3">
            <button @click="closeModal" class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button 
              @click="handleModalConfirm" 
              class="px-4 py-2 rounded-lg text-white transition-colors"
              :class="getModalButtonClass()"
            >
              {{ modalConfirmText }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast Notification -->
    <div v-if="toast.show" 
         class="fixed bottom-4 right-4 px-4 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2"
         :class="toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'">
      <svg v-if="toast.type === 'success'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
      </svg>
      <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      {{ toast.message }}
    </div>

    <!-- Logout Confirmation Modal -->
    <div v-if="showLogoutModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full" @click.stop>
        <div class="p-6">
          <h3 class="text-xl font-bold text-green-700 mb-4">Confirm Logout</h3>
          <p class="text-gray-600 mb-6">Are you sure you want to log out?</p>
          <div class="flex justify-end gap-4">
            <button 
              @click="showLogoutModal = false"
              class="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button 
              @click="logout"
              class="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch, onBeforeUnmount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getAuth, signOut } from "firebase/auth";
import { 
  getDoc, 
  doc, 
  collection, 
  updateDoc, 
  deleteDoc, 
  onSnapshot,
  query,
  orderBy,
  limit
} from 'firebase/firestore';
import { db } from '../../firebase';

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

// Dashboard state
const username = ref("Admin");
const role = ref("administrator");
const lastLogin = ref(new Date());
const sidebarOpen = ref(true);
const userMenuOpen = ref(false);
const notificationCount = ref(5);
const isMobile = ref(false);
const userMenuRef = ref(null);
const showLogoutModal = ref(false);
const toast = ref({ show: false, message: '', type: '' });

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

// Router
const router = useRouter();
const route = useRoute();
const currentRoute = computed(() => route.path);

// Navigation sections
const navigationSections = computed(() => {
  return [
    {
      title: 'ADMIN PANEL',
      routes: routes.filter(r => 
        r.path === '/admin-dashboard' || 
        r.path === '/admin-management' ||
        r.path === '/system-logs' ||
        r.path === '/system-settings'
      )
    },
    {
      title: 'USER MANAGEMENT',
      routes: routes.filter(r => 
        r.path === '/user-management' || 
        r.path === '/roles-permissions'
      )
    },
    {
      title: 'CONTENT',
      routes: routes.filter(r => 
        r.path === '/content-management' || 
        r.path === '/media-library'
      )
    },
    {
      title: 'SYSTEM',
      routes: routes.filter(r => 
        r.path === '/system-health' || 
        r.path === '/backup-restore'
      )
    },
    {
      title: 'MESSAGES',
      routes: routes.filter((r) => r.path === '/messenger'),
    },
  ];
});

// Routes configuration
const routes = [
  { path: '/', name: 'Home', component: 'LandingPage' },
  { path: '/admin-dashboard', name: 'Dashboard', component: 'AdminDashboard', meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/admin-management', name: 'User Management', component: 'AdminManagement', meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/system-logs', name: 'System Logs', component: 'SystemLogs', meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/system-settings', name: 'System Settings', component: 'SystemSettings', meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/user-management', name: 'Users', component: 'UserManagement', meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/roles-permissions', name: 'Roles & Permissions', component: 'RolesPermissions', meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/content-management', name: 'Content', component: 'ContentManagement', meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/media-library', name: 'Media Library', component: 'MediaLibrary', meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/system-health', name: 'System Health', component: 'SystemHealth', meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/backup-restore', name: 'Backup & Restore', component: 'BackupRestore', meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/messenger', name: 'Contact Messages', component: 'ContactMessages', meta: { requiresAuth: true, requiresAdmin: true } },
];

// Computed
const filteredUsers = computed(() => {
  let filtered = [...users.value];

  // Apply search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(user => 
      user.username?.toLowerCase().includes(query) ||
      user.email?.toLowerCase().includes(query)
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
      ? String(aVal).localeCompare(String(bVal))
      : String(bVal).localeCompare(String(aVal));
  });

  return filtered;
});

const totalPages = computed(() => 
  Math.ceil(filteredUsers.value.length / itemsPerPage)
);

const paginationStart = computed(() => {
  return (currentPage.value - 1) * itemsPerPage;
});

const paginatedUsers = computed(() => {
  const start = paginationStart.value;
  const end = start + itemsPerPage;
  return filteredUsers.value.slice(start, end);
});

// Methods
const fetchUsers = async () => {
  loading.value = true;
  errorMessage.value = '';

  try {
    const auth = getAuth();
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
    const usersQuery = query(usersCollection, orderBy('createdAt', 'desc'));
    
    onSnapshot(usersQuery, (snapshot) => {
      users.value = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data(),
        status: doc.data().status || 'active' // Default to active if not specified
      }));
      loading.value = false;
    }, (error) => {
      console.error("Error fetching users:", error);
      errorMessage.value = `Error fetching users: ${error.message}`;
      loading.value = false;
    });
  } catch (error) {
    console.error("Error in fetchUsers:", error);
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
const getModalHeaderClass = () => {
  switch (modalType.value) {
    case 'deactivate': return 'text-yellow-600';
    case 'reactivate': return 'text-green-600';
    case 'delete': return 'text-red-600';
    default: return 'text-gray-800';
  }
};

const getModalIconClass = () => {
  switch (modalType.value) {
    case 'deactivate': return 'text-yellow-600';
    case 'reactivate': return 'text-green-600';
    case 'delete': return 'text-red-600';
    default: return 'text-gray-800';
  }
};

const getModalButtonClass = () => {
  switch (modalType.value) {
    case 'deactivate': return 'bg-yellow-600 hover:bg-yellow-700';
    case 'reactivate': return 'bg-green-600 hover:bg-green-700';
    case 'delete': return 'bg-red-600 hover:bg-red-700';
    default: return 'bg-blue-600 hover:bg-blue-700';
  }
};

const formatLastActive = (timestamp) => {
  if (!timestamp) return 'Never';
  
  let date;
  if (timestamp instanceof Date) {
    date = timestamp;
  } else if (timestamp.toDate && typeof timestamp.toDate === 'function') {
    date = timestamp.toDate();
  } else {
    date = new Date(timestamp);
  }
  
  // Calculate time difference in minutes
  const diffMinutes = Math.round((Date.now() - date) / (1000 * 60));
  
  if (diffMinutes < 1) return 'Just now';
  if (diffMinutes === 1) return '1 minute ago';
  if (diffMinutes < 60) return `${diffMinutes} minutes ago`;
  
  // Convert to hours
  const hours = Math.floor(diffMinutes / 60);
  if (hours === 1) return '1 hour ago';
  if (hours < 24) return `${hours} hours ago`;
  
  // Convert to days
  const days = Math.floor(hours / 24);
  if (days === 1) return 'Yesterday';
  if (days < 30) return `${days} days ago`;
  
  // Format as date for older timestamps
  return date.toLocaleDateString();
};

const formatDate = (timestamp) => {
  if (!timestamp) return 'Unknown';
  
  const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
  
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(date);
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

// Dashboard methods
const getInitials = (name) => {
  if (!name) return "A";
  return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
};

const toggleUserMenu = () => {
  userMenuOpen.value = !userMenuOpen.value;
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

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value;
  localStorage.setItem('sidebarOpen', sidebarOpen.value.toString());
  
  if (isMobile.value && sidebarOpen.value) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
};

const getFilteredRoutes = (section) => {
  return section.routes.filter(route => shouldShowRoute(route));
};

const shouldShowRoute = (route) => {
  if (route.meta?.requiresAuth) {
    if (route.meta.requiresAdmin && role.value !== 'administrator') {
      return false;
    }
  }
  
  return true;
};

const getIconForRoute = (route) => {
  const iconMap = {
    '/admin-dashboard': 'layout-dashboard',
    '/admin-management': 'users',
    '/system-logs': 'file-text',
    '/system-settings': 'settings',
    '/user-management': 'user',
    '/roles-permissions': 'shield',
    '/content-management': 'file',
    '/media-library': 'image',
    '/system-health': 'activity',
    '/backup-restore': 'database',
    '/messenger': 'message-square'
  };
  
  return iconMap[route.path] || 'circle';
};

const confirmLogout = () => {
  showLogoutModal.value = true;
};

const logout = async () => {
  try {
    const auth = getAuth();
    await signOut(auth);
    router.push('/auth');
  } catch (error) {
    console.error("Error logging out:", error);
    showError("Error logging out: " + error.message);
  }
};

// Toast notifications
const showSuccess = (message) => {
  toast.value = { show: true, message, type: 'success' };
  setTimeout(() => {
    toast.value.show = false;
  }, 3000);
};

const showError = (message) => {
  toast.value = { show: true, message, type: 'error' };
  setTimeout(() => {
    toast.value.show = false;
  }, 3000);
};

// Handle window resize
const handleResize = () => {
  checkIfMobile();
};

// Lifecycle
onMounted(() => {
  fetchUsers();
  
  // Check if mobile on initial load
  checkIfMobile();
  
  // Add resize event listener
  window.addEventListener('resize', handleResize);
  
  // Add click outside listener for user menu
  document.addEventListener('click', handleClickOutside);
});

// Watch for route changes to close sidebar on mobile
watch(currentRoute, () => {
  if (isMobile.value) {
    sidebarOpen.value = false;
    document.body.style.overflow = '';
  }
  // Close user menu when route changes
  userMenuOpen.value = false;
});

// Watch for filter changes to reset pagination
watch([searchQuery, statusFilter, roleFilter], () => {
  currentPage.value = 1;
});

// Cleanup on component unmount
onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
/* Dashboard Layout */
.min-h-screen {
  min-height: 100vh;
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

/* Responsive Adjustments */
@media (max-width: 768px) {
  .main-content {
    margin-left: 0;
  }
  
  .sidebar {
    width: 280px;
  }
}
</style>