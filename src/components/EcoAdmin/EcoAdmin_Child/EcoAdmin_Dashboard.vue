<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
      
      <!-- Main Content -->
      <main class="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-6">
        <!-- Auth Error Alert -->
        <div v-if="authError" class="fixed top-4 right-4 z-50 max-w-md">
          <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative shadow-lg" role="alert">
            <strong class="font-bold">Authentication Error!</strong>
            <span class="block sm:inline"> {{ authError }}</span>
            <button @click="authError = null" class="absolute top-0 bottom-0 right-0 px-4 py-3">
              <svg class="fill-current h-6 w-6 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Page Header -->
        <div class="mb-6">
          <h1 class="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
          <p class="text-gray-600">Welcome back, {{ username }}! Here's your system overview.</p>
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
          <p class="ml-4 text-gray-600">Loading admin dashboard...</p>
        </div>

        <template v-else>
          <!-- Stats Overview -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div class="bg-white rounded-lg shadow-md p-6">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-4">
                  <div class="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-green-600">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                  </div>
                  <div>
                    <div class="text-gray-500 text-sm">Total Users</div>
                    <div class="text-gray-800 text-2xl font-bold">{{ stats.totalUsers }}</div>
                  </div>
                </div>
                <div class="text-sm" :class="stats.userGrowth >= 0 ? 'text-green-600' : 'text-red-600'">
                  <span class="flex items-center">
                    <svg v-if="stats.userGrowth >= 0" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-1">
                      <path d="m18 15-6-6-6 6"/>
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-1">
                      <path d="m6 9 6 6 6-6"/>
                    </svg>
                    {{ Math.abs(stats.userGrowth) }}%
                  </span>
                </div>
              </div>
            </div>
            
            <div class="bg-white rounded-lg shadow-md p-6">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-4">
                  <div class="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-blue-600">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="m22 11-2 2-2-2"></path>
                      <path d="M20 13V6"></path>
                    </svg>
                  </div>
                  <div>
                    <div class="text-gray-500 text-sm">Active Users</div>
                    <div class="text-gray-800 text-2xl font-bold">{{ stats.activeUsers }}</div>
                  </div>
                </div>
                <div class="text-sm text-green-600">
                  {{ Math.round((stats.activeUsers / stats.totalUsers) * 100) }}%
                </div>
              </div>
            </div>
            
            <div class="bg-white rounded-lg shadow-md p-6">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-4">
                  <div class="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-purple-600">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <line x1="19" x2="19" y1="8" y2="14"></line>
                      <line x1="22" x2="16" y1="11" y2="11"></line>
                    </svg>
                  </div>
                  <div>
                    <div class="text-gray-500 text-sm">New Users (24h)</div>
                    <div class="text-gray-800 text-2xl font-bold">{{ stats.newUsers }}</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="bg-white rounded-lg shadow-md p-6">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-4">
                  <div class="w-12 h-12 rounded-lg bg-yellow-100 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-yellow-600">
                      <rect width="20" height="14" x="2" y="5" rx="2"></rect>
                      <line x1="2" x2="22" y1="10" y2="10"></line>
                    </svg>
                  </div>
                  <div>
                    <div class="text-gray-500 text-sm">System Health</div>
                    <div class="text-gray-800 text-2xl font-bold">{{ stats.systemHealth }}%</div>
                  </div>
                </div>
                <div class="w-3 h-3 rounded-full" :class="getHealthStatusClass(stats.systemHealth)"></div>
              </div>
            </div>
          </div>

          <!-- Management Sections -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <!-- User Management -->
            <div class="bg-white rounded-lg shadow-lg p-6">
              <div class="flex items-center justify-between mb-4">
                <h2 class="text-xl font-bold text-green-700 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-green-600">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M22 12h-4"></path>
                    <path d="M18 8v8"></path>
                    <path d="M15 12h-3"></path>
                  </svg>
                  User Management
                </h2>
                <router-link to="/admin-management" class="text-green-600 hover:text-green-700 flex items-center gap-1 text-sm">
                  View All
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M5 12h14"></path>
                    <path d="m12 5 7 7-7 7"></path>
                  </svg>
                </router-link>
              </div>
              
              <div class="space-y-4">
                <div v-for="user in recentUsers" :key="user.id" class="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <img :src="user.avatar || defaultAvatar" :alt="user.name" class="w-10 h-10 rounded-full object-cover">
                  <div class="flex-1 min-w-0">
                    <div class="text-gray-800 font-medium truncate">{{ user.name }}</div>
                    <div class="text-gray-500 text-sm truncate">{{ user.email }}</div>
                  </div>
                  <span class="px-2 py-1 text-xs rounded-full" :class="getUserStatusClass(user.status)">
                    {{ user.status }}
                  </span>
                </div>
              </div>
            </div>

            <!-- System Logs -->
            <div class="bg-white rounded-lg shadow-lg p-6">
              <div class="flex items-center justify-between mb-4">
                <h2 class="text-xl font-bold text-green-700 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-green-600">
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <path d="M16 13H8"></path>
                    <path d="M16 17H8"></path>
                    <path d="M10 9H8"></path>
                  </svg>
                  Recent System Logs
                </h2>
                <router-link to="/system-logs" class="text-green-600 hover:text-green-700 flex items-center gap-1 text-sm">
                  View All
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M5 12h14"></path>
                    <path d="m12 5 7 7-7 7"></path>
                  </svg>
                </router-link>
              </div>
              
              <div class="space-y-4">
                <div v-for="log in recentLogs" :key="log.id" class="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div class="w-8 h-8 rounded-lg flex items-center justify-center" :class="getLogTypeClass(log.type)">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" :class="getLogIconClass(log.type)">
                      <path d="M12 8v4"></path>
                      <path d="M12 16h.01"></path>
                      <circle cx="12" cy="12" r="10"></circle>
                    </svg>
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="text-gray-800 truncate">{{ log.message }}</div>
                    <div class="text-gray-500 text-sm">{{ formatTime(log.timestamp) }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- System Analytics -->
          <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-xl font-bold text-green-700 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-green-600">
                  <path d="M3 3v18h18"></path>
                  <path d="m19 9-5 5-4-4-3 3"></path>
                </svg>
                System Analytics
              </h2>
              <button @click="refreshStats" class="refresh-button">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" :class="{ 'animate-spin': refreshing }">
                  <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                  <path d="M3 3v5h5"></path>
                  <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"></path>
                  <path d="M16 16h5v5"></path>
                </svg>
                Refresh
              </button>
            </div>
            
            <div class="relative h-80 w-full" :class="{ 'opacity-50': chartLoading }">
              <canvas ref="systemAnalyticsCanvas"></canvas>
              <div v-if="chartLoading" class="absolute inset-0 flex items-center justify-center">
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

          <!-- Feedback Section -->
          <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-xl font-bold text-green-700 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-green-600">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                User Feedback
              </h2>
              <div class="flex items-center gap-2">
                <div class="relative">
                  <select 
                    v-model="feedbackFilter" 
                    class="pl-3 pr-8 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="all">All Types</option>
                    <option value="suggestion">Suggestions</option>
                    <option value="bug">Bug Reports</option>
                    <option value="question">Questions</option>
                    <option value="other">Other</option>
                  </select>
                  <div class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-400">
                      <path d="m6 9 6 6 6-6"/>
                    </svg>
                  </div>
                </div>
                <button @click="refreshFeedback" class="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" :class="{ 'animate-spin': refreshingFeedback }">
                    <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                    <path d="M3 3v5h5"></path>
                    <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"></path>
                    <path d="M16 16h5v5"></path>
                  </svg>
                  Refresh
                </button>
              </div>
            </div>
            <div v-if="loadingFeedback" class="flex items-center justify-center min-h-[200px]">
              <div class="spinner">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </div>
            </div>
            <div v-else-if="filteredFeedback.length === 0" class="text-gray-500 text-center py-8">
              No feedback available.
            </div>
            <div v-else class="space-y-4">
              <div v-for="feedback in paginatedFeedback" :key="feedback.id" class="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div class="flex justify-between items-center mb-2">
                  <div class="flex items-center gap-2">
                    <h3 class="text-gray-800 font-medium">
                      {{ feedback.username }}
                    </h3>
                    <span class="px-2 py-0.5 text-xs rounded-full" :class="getFeedbackTypeClass(feedback.type)">
                      {{ getFeedbackTypeLabel(feedback.type) }}
                    </span>
                  </div>
                  <span class="text-sm text-gray-500">{{ formatDate(feedback.timestamp) }}</span>
                </div>
                <p class="text-gray-600 mb-2 line-clamp-2">{{ feedback.message }}</p>
                <div class="flex justify-end mt-2 gap-2">
                  <button 
                    @click="openFeedbackPopup(feedback)" 
                    class="px-3 py-1 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    View
                  </button>
                  <button 
                    @click="confirmDeleteFeedback(feedback.id)" 
                    class="px-3 py-1 text-sm text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
              
              <!-- Pagination -->
              <div class="flex justify-between items-center mt-4">
                <div class="text-sm text-gray-500">
                  Showing {{ paginationStart + 1 }}-{{ Math.min(paginationStart + feedbackPerPage, filteredFeedback.length) }} of {{ filteredFeedback.length }}
                </div>
                <div class="flex gap-2">
                  <button 
                    @click="prevPage" 
                    :disabled="currentFeedbackPage === 1"
                    class="px-3 py-1 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button 
                    @click="nextPage" 
                    :disabled="currentFeedbackPage >= totalFeedbackPages"
                    class="px-3 py-1 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Contact Messages Section -->
          <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-xl font-bold text-green-700 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                Contact Messages
              </h2>
              <input  
                v-model="searchEmail" 
                type="email" 
                placeholder="Search by email"
                class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div v-if="loadingMessages" class="flex items-center justify-center min-h-[200px]">
              <div class="spinner">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </div>
            </div>
            <div v-else-if="contactMessages.length === 0" class="text-gray-500 text-center py-8">
              No contact messages found.
            </div>
            <div v-else class="space-y-4">
              <div 
                v-for="message in paginatedMessages" 
                :key="message.id" 
                class="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div class="flex justify-between items-center mb-2">
                  <h3 class="text-gray-800 font-medium">{{ message.name }}</h3>
                  <span class="text-sm text-gray-500">{{ formatDate(message.timestamp.toDate ? message.timestamp.toDate() : message.timestamp) }}</span>
                </div>
                <p class="text-gray-600 mb-2 line-clamp-2">{{ message.message }}</p>
                <p class="text-sm text-gray-500">Email: {{ message.email }}</p>
                <div class="flex justify-end mt-2 gap-2">
                  <button 
                    @click="openMessagePopup(message)" 
                    class="px-3 py-1 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    View
                  </button>
                  <button 
                    @click="confirmDeleteMessage(message.id)" 
                    class="px-3 py-1 text-sm text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
              
              <!-- Pagination -->
              <div class="flex justify-between items-center mt-4">
                <div class="text-sm text-gray-500">
                  Showing {{ messagePaginationStart + 1 }}-{{ Math.min(messagePaginationStart + messagesPerPage, contactMessages.length) }} of {{ contactMessages.length }}
                </div>
                <div class="flex gap-2">
                  <button 
                    @click="prevMessagePage" 
                    :disabled="currentMessagePage === 1"
                    class="px-3 py-1 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button 
                    @click="nextMessagePage" 
                    :disabled="currentMessagePage >= totalMessagePages"
                    class="px-3 py-1 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <button @click="backupSystem" class="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow">
              <div class="text-green-600 mb-4 flex justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-12 h-12">
                  <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
                  <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
                  <path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3"></path>
                </svg>
              </div>
              <div class="text-gray-800 font-medium">Backup System</div>
            </button>
            <button @click="clearCache" class="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow">
              <div class="text-green-600 mb-4 flex justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-12 h-12">
                  <path d="M3 3v18h18"></path>
                  <path d="M18.4 3H6.6a.6.6 0 0 0-.6.6v16.8a.6.6 0 0 0 .6.6h11.8a.6.6 0 0 0 .6-.6V3.6a.6.6 0 0 0-.6-.6Z"></path>
                  <path d="M9 9h6"></path>
                  <path d="M9 13h6"></path>
                  <path d="M9 17h6"></path>
                </svg>
              </div>
              <div class="text-gray-800 font-medium">Clear Cache</div>
            </button>
            
            <button @click="generateReport" class="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow">
              <div class="text-green-600 mb-4 flex justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-12 h-12">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <path d="M14 2v6h6"></path>
                  <path d="M16 13H8"></path>
                  <path d="M16 17H8"></path>
                  <path d="M10 9H8"></path>
                </svg>
              </div>
              <div class="text-gray-800 font-medium">Generate Report</div>
            </button>
            <button @click="showMaintenanceModal" class="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow">
              <div class="text-yellow-600 mb-4 flex justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-12 h-12">
                  <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
                </svg>
              </div>
              <div class="text-gray-800 font-medium">Maintenance Mode</div>
            </button>
          </div>
        </template>
      </main>

    <!-- Feedback Detail Popup -->
    <div v-if="showFeedbackPopup" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg border border-gray-100 shadow-xl max-w-md w-full" @click.stop>
        <div class="p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-xl font-bold text-green-700">Feedback Details</h3>
            <button @click="closeFeedbackPopup" class="text-gray-500 hover:text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 6 6 18"></path>
                <path d="M6 6 18 18"></path>
              </svg>
            </button>
          </div>
          <div class="space-y-4">
            <div>
              <span class="text-sm font-medium text-gray-500">User</span>
              <p class="text-gray-800">{{ selectedFeedback.username }}</p>
            </div>
            <div>
              <span class="text-sm font-medium text-gray-500">Message</span>
              <p class="text-gray-800 whitespace-pre-line">{{ selectedFeedback.message }}</p>
            </div>
            <div>
              <textarea v-model="selectedFeedback.reply" placeholder="Write a reply..." class="w-full p-2 border rounded"></textarea>
              <button @click="sendReply(selectedFeedback)" class="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                Send Reply
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Message Detail Popup -->
    <div v-if="showMessagePopup" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg border border-gray-100 shadow-xl max-w-md w-full" @click.stop>
        <div class="p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-xl font-bold text-green-700">Contact Message</h3>
            <button @click="closeMessagePopup" class="text-gray-500 hover:text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 6 6 18"></path>
                <path d="M6 6 18 18"></path>
              </svg>
            </button>
          </div>
          <div class="space-y-4">
            <div>
              <span class="text-sm font-medium text-gray-500">Name</span>
              <p class="text-gray-800">{{ selectedMessage.name }}</p>
            </div>
            <div>
              <span class="text-sm font-medium text-gray-500">Email</span>
              <p class="text-gray-800">{{ selectedMessage.email }}</p>
            </div>
            <div>
              <span class="text-sm font-medium text-gray-500">Date</span>
              <p class="text-gray-800">{{ formatDate(selectedMessage.timestamp.toDate ? selectedMessage.timestamp.toDate() : selectedMessage.timestamp) }}</p>
            </div>
            <div>
              <span class="text-sm font-medium text-gray-500">Message</span>
              <p class="text-gray-800 whitespace-pre-line">{{ selectedMessage.message }}</p>
            </div>
          </div>
          <div class="flex justify-end gap-2 mt-6">
            <button 
              @click="closeMessagePopup" 
              class="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
            <button 
              @click="confirmDeleteMessage(selectedMessage.id)" 
              class="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteConfirmation" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg border border-gray-100 shadow-xl max-w-md w-full" @click.stop>
        <div class="p-6">
          <h3 class="text-xl font-bold text-red-600 mb-4">Confirm Deletion</h3>
          <p class="text-gray-600 mb-6">Are you sure you want to delete this {{ deleteItemType }}? This action cannot be undone.</p>
          <div class="flex justify-end gap-4">
            <button 
              @click="cancelDelete"
              class="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button 
              @click="confirmDelete"
              class="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Maintenance Mode Modal -->
    <div v-if="showMaintenance" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg border border-gray-100 shadow-xl max-w-md w-full" @click.stop>
        <div class="p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-xl font-bold text-yellow-600 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
              </svg>
              Enable Maintenance Mode
            </h3>
            <button @click="showMaintenance = false" class="text-gray-500 hover:text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 6 6 18"></path>
                <path d="M6 6 18 18"></path>
              </svg>
            </button>
          </div>
          <p class="text-gray-600 mb-6">
            This will temporarily disable user access to the system. Only administrators will be able to log in.
          </p>
          <div class="space-y-4 mb-6">
            <div class="relative">
              <label class="block text-gray-700 text-sm font-medium mb-2">
                Maintenance Message
              </label>
              <input  
                v-model="maintenanceMessage" 
                type="text" 
                placeholder="Message to display to users"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div class="relative">
              <label class="block text-gray-700 text-sm font-medium mb-2">
                Duration (minutes)
              </label>
              <input  
                v-model="maintenanceDuration" 
                type="number" 
                placeholder="Duration in minutes"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
          <div class="flex justify-end gap-4">
            <button 
              @click="showMaintenance = false"
              class="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button 
              @click="enableMaintenance"
              :disabled="!maintenanceMessage || !maintenanceDuration"
              class="px-4 py-2 rounded-lg bg-yellow-600 text-white hover:bg-yellow-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Enable Maintenance Mode
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast Notification -->
    <div v-if="toast.show" 
         class="fixed bottom-4 right-4 px-4 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2"
         :class="toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'">
      <svg v-if="toast.type === 'success'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
      <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" x2="12" y1="8" y2="12"></line>
        <line x1="12" x2="12.01" y1="16" y2="16"></line>
      </svg>
      {{ toast.message }}
    </div>

    <!-- Logout Confirmation Modal -->
    <div v-if="showLogoutModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg border border-gray-100 shadow-xl max-w-md w-full" @click.stop>
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
import { ref, computed, onMounted, nextTick, watch, onBeforeUnmount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { 
  collection, 
  query, 
  orderBy, 
  limit, 
  getDocs, 
  addDoc, 
  Timestamp,
  deleteDoc,
  doc,
  where,
  onSnapshot,
  updateDoc
} from "firebase/firestore";
import { db } from "../../../firebase";
import Chart from 'chart.js/auto';
import { getCurrentUser, checkIsAdmin } from '../../../utils/firebase-auth';

// Auth state
const auth = getAuth();
const currentUser = ref(null);
const isAdmin = ref(false);
const authError = ref(null);
const loading = ref(true);
const refreshing = ref(false);
const chartLoading = ref(false);
const showMaintenance = ref(false);
const maintenanceMessage = ref('');
const maintenanceDuration = ref('');
const defaultAvatar = "https://ui-avatars.com/api/?background=0D9488&color=fff";
const systemAnalyticsCanvas = ref(null);
const toast = ref({ show: false, message: '', type: '' });
const username = ref("Admin");
const role = ref("administrator");
const lastLogin = ref(new Date());
const sidebarOpen = ref(true);
const userMenuOpen = ref(false);
const notificationCount = ref(5);
const isMobile = ref(false);
const userMenuRef = ref(null);
const showLogoutModal = ref(false);

// Stats
const stats = ref({
  totalUsers: 0,
  activeUsers: 0,
  newUsers: 0,
  userGrowth: 5.2,
  systemHealth: 98,
});

// Recent Users
const recentUsers = ref([]);

// Recent Logs
const recentLogs = ref([]);

let chartInstance = null;

// Router
const router = useRouter();
const route = useRoute();
const currentRoute = computed(() => route.path);

// Initialize auth state
const initAuth = async () => {
  try {
    currentUser.value = await getCurrentUser();
    
    if (!currentUser.value) {
      authError.value = "You must be logged in to access this page.";
      router.push('/auth'); // Redirect to login
      return false;
    }
    
    isAdmin.value = await checkIsAdmin();
    
    if (!isAdmin.value) {
      authError.value = "You don't have admin privileges to access this dashboard.";
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Auth initialization error:", error);
    authError.value = "Authentication error: " + error.message;
    return false;
  }
};

// Modified loadDashboardData with proper error handling
const loadDashboardData = async () => {
  if (!await checkIsAdmin()) {
    showError("You don't have admin privileges to access this data.");
    return;
  }

  try {
    // Fetch users
    const usersQuery = query(collection(db, 'users'), orderBy('createdAt', 'desc'), limit(5));
    const usersSnapshot = await getDocs(usersQuery);
    
    recentUsers.value = usersSnapshot.docs.map(doc => ({
      id: doc.id,
      name: doc.data().username || 'Unknown User',
      email: doc.data().email || 'user@example.com',
      avatar: doc.data().profileImageUrl,
      status: doc.data().status || 'active'
    }));

    // If no users found, add some sample data
    if (recentUsers.value.length === 0) {
      recentUsers.value = [];
    }

    // Calculate stats
    stats.value = {
      totalUsers: recentUsers.value.length,
      activeUsers: recentUsers.value.filter(u => u.status === 'active').length,
      newUsers: Math.floor(Math.random() * 5) + 1, // Sample data
      userGrowth: 5.2, // Sample data
      systemHealth: 98, // Sample data
    };

    // Fetch logs
    const logsQuery = query(collection(db, 'system_logs'), orderBy('timestamp', 'desc'), limit(5));
    const logsSnapshot = await getDocs(logsQuery);
    
    recentLogs.value = logsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // If no logs found, add some sample data
    if (recentLogs.value.length === 0) {
      recentLogs.value = [
        ];
    }

  } catch (error) {
    console.error('Error loading dashboard data:', error);
    if (error.code === 'permission-denied') {
      showError('You do not have permission to access this data.');
    } else {
      showError('Error loading dashboard data. Please try again.');
    }
  }
};

// Chart Methods
const updateSystemAnalyticsChart = async () => {
  chartLoading.value = true;
  await nextTick();

  if (!systemAnalyticsCanvas.value) {
    chartLoading.value = false;
    return;
  }

  const ctx = systemAnalyticsCanvas.value.getContext('2d');

  // Sample data for system analytics
  const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const cpuUsage = [45, 59, 80, 81, 56, 55];
  const memoryUsage = [65, 59, 80, 81, 56, 55];
  const diskUsage = [28, 48, 40, 19, 86, 27];
  const networkUsage = [90, 39, 70, 91, 36, 65];

  if (chartInstance) {
    chartInstance.destroy();
  }

  chartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'CPU Usage (%)',
          data: cpuUsage,
          borderColor: 'rgb(16, 185, 129)',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          tension: 0.4
        },
        {
          label: 'Memory Usage (%)',
          data: memoryUsage,
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.4
        },
        {
          label: 'Disk Usage (%)',
          data: diskUsage,
          borderColor: 'rgb(168, 85, 247)',
          backgroundColor: 'rgba(168, 85, 247, 0.1)',
          tension: 0.4
        },
        {
          label: 'Network Usage (%)',
          data: networkUsage,
          borderColor: 'rgb(249, 115, 22)',
          backgroundColor: 'rgba(249, 115, 22, 0.1)',
          tension: 0.4
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        intersect: false,
        mode: 'index'
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          ticks: {
            callback: value => `${value}%`
          }
        }
      }
    }
  });

  chartLoading.value = false;
};

// Utility functions
const getHealthStatusClass = (health) => {
  if (health >= 90) return 'bg-green-500';
  if (health >= 70) return 'bg-yellow-500';
  if (health >= 50) return 'bg-orange-500';
  return 'bg-red-500';
};

const getUserStatusClass = (status) => {
  if (status === 'active') return 'bg-green-100 text-green-800';
  return 'bg-red-100 text-red-800';
};

const getLogTypeClass = (type) => {
  const classes = {
    info: 'bg-blue-100',
    warning: 'bg-yellow-100',
    error: 'bg-red-100',
    success: 'bg-green-100'
  };
  return classes[type] || classes.info;
};

const getLogIconClass = (type) => {
  const classes = {
    info: 'text-blue-600',
    warning: 'text-yellow-600',
    error: 'text-red-600',
    success: 'text-green-600'
  };
  return classes[type] || classes.info;
};

const formatTime = (timestamp) => {
  const now = Date.now();
  const diff = now - timestamp;

  // Convert to minutes
  const minutes = Math.floor(diff / (1000 * 60));

  if (minutes < 1) return 'Just now';
  if (minutes === 1) return '1 minute ago';
  if (minutes < 60) return `${minutes} minutes ago`;

  // Convert to hours
  const hours = Math.floor(minutes / 60);
  if (hours === 1) return '1 hour ago';
  if (hours < 24) return `${hours} hours ago`;
  
  // Convert to days
  const days = Math.floor(hours / 24);
  if (days === 1) return '1 day ago';
  return `${days} days ago`;
};

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

// Action handlers
const refreshStats = async () => {
  refreshing.value = true;
  try {
    await loadDashboardData();
    await updateSystemAnalyticsChart();
    showSuccess('Dashboard data refreshed successfully');
  } catch (error) {
    showError('Failed to refresh dashboard data');
  } finally {
    refreshing.value = false;
  }
};

const backupSystem = () => {
  // Implement backup functionality
  showSuccess('System backup initiated');

  // Log the action
  logSystemAction('info', 'System backup initiated by admin');
};

const clearCache = () => {
  // Implement cache clearing
  showSuccess('System cache cleared successfully');

  // Log the action
  logSystemAction('info', 'System cache cleared by admin');
};

const generateReport = () => {
  // Implement report generation
  showSuccess('System report generated successfully');

  // Log the action
  logSystemAction('info', 'System report generated by admin');
};

const showMaintenanceModal = () => {
  showMaintenance.value = true;
};

const enableMaintenance = async () => {
  // Implement maintenance mode
  showSuccess(`Maintenance mode enabled for ${maintenanceDuration.value} minutes`);

  // Log the action
  logSystemAction('warning', `Maintenance mode enabled for ${maintenanceDuration.value} minutes: ${maintenanceMessage.value}`);

  showMaintenance.value = false;
  maintenanceMessage.value = '';
  maintenanceDuration.value = '';
};

const logSystemAction = async (type, message) => {
  try {
    await addDoc(collection(db, 'system_logs'), {
      type,
      message,
      timestamp: Date.now(),
      user: username.value,
      userRole: role.value
    });
      
    // Refresh logs
    loadDashboardData();
  } catch (error) {
    console.error('Error logging system action:', error);
  }
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

const logout = async () => {
  try {
    await signOut(auth);
    router.push('/auth');
  } catch (error) {
    console.error("Error logging out:", error);
    showError("Error logging out: " + error.message);
  }
};

// State for feedback
const feedbackList = ref([]);
const loadingFeedback = ref(false);
const refreshingFeedback = ref(false);
const showFeedbackPopup = ref(false);
const selectedFeedback = ref({});
const feedbackFilter = ref('all');
const currentFeedbackPage = ref(1);
const feedbackPerPage = 5;

// Computed properties for feedback pagination
const filteredFeedback = computed(() => {
  if (feedbackFilter.value === 'all') {
    return feedbackList.value;
  }
  return feedbackList.value.filter(feedback => feedback.type === feedbackFilter.value);
});

const totalFeedbackPages = computed(() => {
  return Math.ceil(filteredFeedback.value.length / feedbackPerPage);
});

const paginationStart = computed(() => {
  return (currentFeedbackPage.value - 1) * feedbackPerPage;
});

const paginatedFeedback = computed(() => {
  return filteredFeedback.value.slice(paginationStart.value, paginationStart.value + feedbackPerPage);
});

// Feedback pagination methods
const nextPage = () => {
  if (currentFeedbackPage.value < totalFeedbackPages.value) {
    currentFeedbackPage.value++;
  }
};

const prevPage = () => {
  if (currentFeedbackPage.value > 1) {
    currentFeedbackPage.value--;
  }
};

// Load feedback from Firestore with admin check
const loadFeedback = async () => {
  if (!await checkIsAdmin()) {
    showError("You don't have admin privileges to access feedback data.");
    return;
  }

  loadingFeedback.value = true;
  try {
    const feedbackQuery = query(collection(db, 'feedback'), orderBy('timestamp', 'desc'), limit(20));
    const feedbackSnapshot = await getDocs(feedbackQuery);
    
    if (feedbackSnapshot.empty) {
      // Sample data if no feedback exists
      feedbackList.value = [
        {
          id: '1',
          username: 'John Doe',
          type: 'suggestion',
          message: 'I think it would be great to add a dark mode to the application.',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24) // 1 day ago
        },
        {
          id: '2',
          username: 'Jane Smith',
          type: 'bug',
          message: 'I found a bug in the checkout process. When I try to pay with PayPal, it gives me an error.',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48) // 2 days ago
        },
        {
          id: '3',
          username: 'Robert Johnson',
          type: 'question',
          message: 'How do I reset my password? I can\'t find the option anywhere.',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72) // 3 days ago
        }
      ];
    } else {
      feedbackList.value = feedbackSnapshot.docs.map(doc => ({
        id: doc.id,
        username: doc.data().username || doc.data().user || 'Unknown User',
        type: doc.data().type || 'suggestion',
        message: doc.data().message || doc.data().feedback || 'No message provided',
        timestamp: doc.data().timestamp?.toDate() || new Date()
      }));
    }
  } catch (error) {
    console.error('Error loading feedback:', error);
    showError('Failed to load feedback. Please try again.');
  } finally {
    loadingFeedback.value = false;
  }
};

// Refresh feedback
const refreshFeedback = async () => {
  refreshingFeedback.value = true;
  await loadFeedback();
  refreshingFeedback.value = false;
  showSuccess('Feedback refreshed successfully');
};

// Format timestamp
const formatDate = (timestamp) => {
  if (!timestamp) return 'Unknown date';
  
  const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
  
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(date);
};

// Get feedback type class
const getFeedbackTypeClass = (type) => {
  const classes = {
    suggestion: 'bg-blue-100 text-blue-800',
    bug: 'bg-red-100 text-red-800',
    question: 'bg-yellow-100 text-yellow-800',
    other: 'bg-purple-100 text-purple-800'
  };
  return classes[type] || classes.other;
};

// Get feedback type label
const getFeedbackTypeLabel = (type) => {
  const labels = {
    suggestion: 'Suggestion',
    bug: 'Bug Report',
    question: 'Question',
    other: 'Other'
  };
  return labels[type] || 'Other';
};

// Open feedback popup
const openFeedbackPopup = (feedback) => {
  selectedFeedback.value = feedback;
  showFeedbackPopup.value = true;
};

// Close feedback popup
const closeFeedbackPopup = () => {
  selectedFeedback.value = {};
  showFeedbackPopup.value = false;
};

// State for contact messages
const contactMessages = ref([]);
const loadingMessages = ref(false);
const searchEmail = ref('');
const showMessagePopup = ref(false);
const selectedMessage = ref({});
const currentMessagePage = ref(1);
const messagesPerPage = 5;

// Computed properties for message pagination
const messagePaginationStart = computed(() => {
  return (currentMessagePage.value - 1) * messagesPerPage;
});

const totalMessagePages = computed(() => {
  return Math.ceil(contactMessages.value.length / messagesPerPage);
});

const paginatedMessages = computed(() => {
  return contactMessages.value.slice(messagePaginationStart.value, messagePaginationStart.value + messagesPerPage);
});

// Message pagination methods
const nextMessagePage = () => {
  if (currentMessagePage.value < totalMessagePages.value) {
    currentMessagePage.value++;
  }
};

const prevMessagePage = () => {
  if (currentMessagePage.value > 1) {
    currentMessagePage.value--;
  }
};

// Load contact messages from Firestore with admin check
const loadContactMessages = async () => {
  if (!await checkIsAdmin()) {
    showError("You don't have admin privileges to access contact messages.");
    return;
  }

  loadingMessages.value = true;
  try {
    let messagesQuery;
    
    if (searchEmail.value) {
      messagesQuery = query(
        collection(db, 'contact_messages'),
        where('email', '>=', searchEmail.value),
        where('email', '<=', searchEmail.value + '\uf8ff'),
        orderBy('email'),
        orderBy('timestamp', 'desc'),
        limit(20)
      );
    } else {
      messagesQuery = query(
        collection(db, 'contact_messages'),
        orderBy('timestamp', 'desc'),
        limit(20)
      );
    }
    
    const messagesSnapshot = await getDocs(messagesQuery);
    
    if (messagesSnapshot.empty) {
      // Sample data if no messages exist
      contactMessages.value = [
        ];
    } else {
      contactMessages.value = messagesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    }
  } catch (error) {
    console.error('Error loading contact messages:', error);
    showError('Failed to load contact messages. Please try again.');
  } finally {
    loadingMessages.value = false;
  }
};

// Open message popup
const openMessagePopup = (message) => {
  selectedMessage.value = message;
  showMessagePopup.value = true;
};

// Close message popup
const closeMessagePopup = () => {
  selectedMessage.value = {};
  showMessagePopup.value = false;
};

// Delete confirmation state
const showDeleteConfirmation = ref(false);
const deleteItemId = ref(null);
const deleteItemType = ref('');

// Confirm delete feedback
const confirmDeleteFeedback = (id) => {
  deleteItemId.value = id;
  deleteItemType.value = 'feedback';
  showDeleteConfirmation.value = true;
};

// Confirm delete message
const confirmDeleteMessage = (id) => {
  deleteItemId.value = id;
  deleteItemType.value = 'message';
  showDeleteConfirmation.value = true;
};

// Cancel delete
const cancelDelete = () => {
  deleteItemId.value = null;
  deleteItemType.value = '';
  showDeleteConfirmation.value = false;
};

// Confirm delete
const confirmDelete = async () => {
  if (!deleteItemId.value) {
    cancelDelete();
    return;
  }

  try {
    if (deleteItemType.value === 'feedback') {
      await deleteDoc(doc(db, 'feedback', deleteItemId.value));
      feedbackList.value = feedbackList.value.filter(item => item.id !== deleteItemId.value);
      showSuccess('Feedback deleted successfully');
      
      // Close feedback popup if it's open
      if (showFeedbackPopup.value && selectedFeedback.value.id === deleteItemId.value) {
        closeFeedbackPopup();
      }
    } else if (deleteItemType.value === 'message') {
      await deleteDoc(doc(db, 'contact_messages', deleteItemId.value));
      contactMessages.value = contactMessages.value.filter(item => item.id !== deleteItemId.value);
      showSuccess('Message deleted successfully');
      
      // Close message popup if it's open
      if (showMessagePopup.value && selectedMessage.value.id === deleteItemId.value) {
        closeMessagePopup();
      }
    }
  } catch (error) {
    console.error(`Error deleting ${deleteItemType.value}:`, error);
    showError(`Failed to delete ${deleteItemType.value}. Please try again.`);
  } finally {
    cancelDelete();
  }
};

// Watch for search email changes
watch(searchEmail, async (newEmail) => {
  if (newEmail.trim().length > 0) {
    loadContactMessages();
  } else {
    loadContactMessages();
  }
});

// Watch for feedback filter changes
watch(feedbackFilter, () => {
  currentFeedbackPage.value = 1;
});

// Handle window resize
const handleResize = () => {
  checkIfMobile();
};

// Modified onMounted to check auth first
onMounted(async () => {
  const hasAuth = await initAuth();

  if (hasAuth) {
    try {
      await loadDashboardData();
      await nextTick();
      updateSystemAnalyticsChart();
      
      // Load feedback and contact messages
      await loadFeedback();
      await loadContactMessages();
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      showError('Error loading dashboard data. Please check your permissions.');
    } finally {
      loading.value = false;
    }
    
    // Check if mobile on initial load
    checkIfMobile();
    
    // Add resize event listener
    window.addEventListener('resize', handleResize);
    
    // Add click outside listener for user menu
    document.addEventListener('click', handleClickOutside);
  }
});

// Ensure cleanup is registered properly
onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
  document.removeEventListener('click', handleClickOutside);
  if (chartInstance) {
    chartInstance.destroy();
  }
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

// Fetch unread feedback
const unreadFeedback = ref([]);
const unreadFeedbackCount = ref(0);
const showFeedbackNotifications = ref(false);

const fetchUnreadFeedback = () => {
  const feedbackQuery = query(collection(db, 'feedback'), orderBy('timestamp', 'desc'));
  onSnapshot(feedbackQuery, (snapshot) => {
    unreadFeedback.value = snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(feedback => !feedback.reply);
    unreadFeedbackCount.value = unreadFeedback.value.length;
  });
};

// Toggle feedback notifications dropdown
const toggleFeedbackNotifications = () => {
  showFeedbackNotifications.value = !showFeedbackNotifications.value;
};

// View feedback in popup
const viewFeedback = (feedback) => {
  selectedFeedback.value = feedback;
  showFeedbackPopup.value = true;
  showFeedbackNotifications.value = false;
};

// Send reply to feedback
const sendReply = async (feedback) => {
  try {
    const feedbackRef = doc(db, 'feedback', feedback.id);
    const replyData = {
      reply: feedback.reply,
      repliedAt: new Date(),
    };
    await updateDoc(feedbackRef, replyData);
    alert('Reply sent successfully!');
    closeFeedbackPopup();
  } catch (error) {
    if (error.code === 'permission-denied') {
      alert('You do not have permission to send a reply.');
    } else {
      console.error("Error sending reply:", error);
      alert('Failed to send reply. Please try again.');
    }
  }
};

// Fetch unread feedback on mount
onMounted(() => {
  fetchUnreadFeedback();
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

/* Refresh Button */
.refresh-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  background-color: white;
  color: #4b5563;
  transition: all 0.2s ease;
}

.refresh-button:hover {
  background-color: #f3f4f6;
  color: #16a34a;
}

/* Animation */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Line clamp for truncating text */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
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