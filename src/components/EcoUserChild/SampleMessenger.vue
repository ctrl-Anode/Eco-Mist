<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
    <!-- Main Content Area -->
    <div class="flex flex-1 overflow-hidden">
      <!-- Main Content -->
      <main class="flex-1 overflow-y-auto bg-transparent p-4 md:p-6">
        <!-- Page Header -->
        <div class="mb-6">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-3xl font-bold text-slate-800 mb-1">Messenger</h1>
              <p class="text-slate-600">Chat with other Eco-Mist users</p>
            </div>
            <!-- Notification Bell -->
            <div class="relative">
              <button 
                @click="toggleNotificationPanel"
                class="relative p-3 rounded-full bg-white shadow-sm border border-slate-200 hover:bg-slate-50 transition-all duration-200 notification-bell"
                :class="{ 'ring-2 ring-emerald-500': notificationPanelOpen }"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span v-if="hasUnreadNotifications" class="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                  {{ notificationCount > 9 ? '9+' : notificationCount }}
                </span>
              </button>
              
              <!-- Notification Panel -->
              <div 
                v-if="notificationPanelOpen"
                class="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 z-50 notification-panel"
              >
                <div class="p-4 border-b border-slate-100">
                  <div class="flex items-center justify-between">
                    <h3 class="font-semibold text-slate-800">Notifications</h3>
                    <div class="flex gap-2">
                      <button 
                        @click="markAllNotificationsAsRead"
                        class="text-xs text-emerald-600 hover:text-emerald-700 font-medium"
                      >
                        Mark all read
                      </button>
                      <button 
                        @click="clearAllNotifications"
                        class="text-xs text-slate-500 hover:text-slate-700 font-medium"
                      >
                        Clear all
                      </button>
                    </div>
                  </div>
                </div>
                <div class="max-h-96 overflow-y-auto">
                  <div v-if="notifications.length === 0" class="p-6 text-center text-slate-500">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto mb-3 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    <p>No notifications yet</p>
                  </div>
                  <div v-for="notification in notifications" :key="notification.id" 
                       @click="handleNotificationClick(notification)"
                       class="p-4 border-b border-slate-50 hover:bg-slate-50 cursor-pointer transition-colors"
                       :class="{ 'bg-emerald-50': !notification.read }"
                  >
                    <div class="flex items-start gap-3">
                      <div class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
                           :class="getNotificationTypeClass(notification.type)"
                      >
                        <svg v-if="notification.type === 'message'" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <svg v-else-if="notification.type === 'mention'" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </div>
                      <div class="flex-1 min-w-0">
                        <p class="text-sm font-medium text-slate-800 truncate">{{ notification.title }}</p>
                        <p class="text-sm text-slate-600 mt-1">{{ notification.message }}</p>
                        <p class="text-xs text-slate-400 mt-1">{{ formatTimestamp(notification.timestamp) }}</p>
                      </div>
                      <div v-if="!notification.read" class="w-2 h-2 bg-emerald-500 rounded-full flex-shrink-0"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Connection Status Banner -->
        <div v-if="!isOnline" class="mb-6 bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-xl p-4 flex items-center justify-between shadow-sm">
          <div class="flex items-center">
            <div class="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-12.728 12.728m0-12.728l12.728 12.728" />
              </svg>
            </div>
            <div>
              <span class="text-red-800 font-semibold">You are currently offline</span>
              <p class="text-red-700 text-sm">Messages will be sent when you reconnect</p>
            </div>
          </div>
          <div class="bg-red-200 px-3 py-1 rounded-full">
            <span class="text-xs text-red-800 font-medium">{{ queuedMessages.length }} queued</span>
          </div>
        </div>

        <!-- Pinned Messages -->
        <div v-if="pinnedMessages.length > 0" class="mb-6 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-xl p-4 shadow-sm">
          <div class="flex justify-between items-center mb-3">
            <h3 class="text-amber-800 font-semibold flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              Pinned Messages
            </h3>
            <button 
              @click="collapsePinned = !collapsePinned" 
              class="text-amber-700 hover:text-amber-800 p-1 rounded-lg hover:bg-amber-100 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 transition-transform" :class="{ 'rotate-180': collapsePinned }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
          <div v-if="!collapsePinned" class="space-y-3">
            <div v-for="msg in pinnedMessages" :key="msg.id" class="bg-white rounded-lg p-3 border border-amber-100">
              <div class="flex justify-between items-start">
                <div class="flex-1">
                  <p class="text-sm text-slate-800">{{ msg.text }}</p>
                  <p class="text-xs text-slate-500 mt-1">{{ formatTimestamp(msg.timestamp) }}</p>
                </div>
                <button 
                  @click="unpinMessage(msg.id)" 
                  class="text-xs text-red-500 hover:text-red-700 ml-3 px-2 py-1 rounded-md hover:bg-red-50 transition-colors"
                >
                  Unpin
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Search Bar -->
        <div class="mb-6">
          <div class="relative max-w-md">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input 
              v-model="searchQuery" 
              type="text" 
              placeholder="Search messages..." 
              class="w-full pl-10 pr-10 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all shadow-sm"
            />
            <button 
              v-if="searchQuery" 
              @click="searchQuery = ''" 
              class="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        <!-- Chat Card -->
        <div class="bg-white rounded-2xl shadow-lg overflow-hidden relative mb-6 flex flex-col h-[calc(100vh-320px)] border border-slate-200">
          <!-- Chat Header -->
          <div class="p-6 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-emerald-50 to-teal-50">
            <div class="flex items-center gap-4">
              <div class="bg-gradient-to-br from-emerald-500 to-teal-600 p-3 rounded-xl shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div>
                <h2 class="text-xl font-bold text-slate-800">Eco-Mist Chat</h2>
                <p class="text-sm text-slate-600">Community Discussion</p>
              </div>
            </div>
            <div class="flex items-center gap-4">
              <div class="flex items-center gap-2 px-3 py-2 bg-white rounded-full shadow-sm border border-slate-200">
                <div class="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span class="text-sm font-medium text-slate-700">{{ onlineUsers }} Online</span>
              </div>
              <button 
                @click="showChatInfo = !showChatInfo" 
                class="p-2 rounded-xl hover:bg-white/50 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            </div>
          </div>
          
          <!-- Chat Info Sidebar -->
          <div 
            v-if="showChatInfo" 
            class="absolute right-0 top-0 bottom-0 w-80 bg-white border-l border-slate-200 z-20 overflow-y-auto transform transition-transform duration-300"
            :class="{ 'translate-x-0': showChatInfo, 'translate-x-full': !showChatInfo }"
          >
            <div class="p-6">
              <div class="flex justify-between items-center mb-6">
                <h3 class="font-bold text-slate-800">Chat Information</h3>
                <button @click="showChatInfo = false" class="text-slate-500 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div class="mb-8">
                <h4 class="text-sm font-semibold text-slate-500 mb-4 uppercase tracking-wide">Active Users</h4>
                <div class="space-y-3">
                  <div v-for="(user, index) in activeUsers" :key="index" class="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                    <div class="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center text-sm font-bold">
                      {{ getInitials(user.name) }}
                    </div>
                    <div>
                      <div class="text-sm font-medium text-slate-800">{{ user.name }}</div>
                      <div class="text-xs text-slate-500">{{ user.status }}</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="mb-8">
                <h4 class="text-sm font-semibold text-slate-500 mb-4 uppercase tracking-wide">Shared Files</h4>
                <div class="space-y-2">
                  <div v-for="(file, index) in sharedFiles" :key="index" class="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                    <div class="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <a href="#" class="text-sm text-emerald-600 hover:text-emerald-700 font-medium truncate">{{ file.name }}</a>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 class="text-sm font-semibold text-slate-500 mb-4 uppercase tracking-wide">Chat Settings</h4>
                <div class="space-y-4">
                  <div class="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors">
                    <span class="text-sm font-medium text-slate-700">Notifications</span>
                    <label class="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" v-model="chatSettings.notifications" class="sr-only peer" @change="toggleNotifications">
                      <div class="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                    </label>
                  </div>
                  <div class="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors">
                    <span class="text-sm font-medium text-slate-700">Sound Effects</span>
                    <label class="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" v-model="chatSettings.soundEffects" class="sr-only peer">
                      <div class="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                    </label>
                  </div>
                  <div class="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors">
                    <span class="text-sm font-medium text-slate-700">Read Receipts</span>
                    <label class="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" v-model="chatSettings.readReceipts" class="sr-only peer">
                      <div class="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Messages Container -->
          <div 
            class="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-slate-50/50 to-white" 
            ref="messagesContainer" 
            @scroll="handleScroll"
            @click="hideMessageOptions"
          >
            <div v-if="loadingMessages" class="flex justify-center items-center py-8">
              <div class="flex items-center gap-3">
                <div class="spinner-sm">
                  <div></div><div></div><div></div><div></div><div></div><div></div>
                </div>
                <span class="text-slate-500 font-medium">Loading messages...</span>
              </div>
            </div>
            
            <div v-if="errorLoadingMessages" class="text-center p-6 bg-red-50 border border-red-200 rounded-xl text-red-600">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p class="font-medium mb-3">Error loading messages</p>
              <button @click="retryLoadMessages" class="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 font-medium transition-colors">
                Try Again
              </button>
            </div>
            
            <div v-if="messages.length === 0 && !loadingMessages" class="h-full flex flex-col items-center justify-center text-slate-500">
              <div class="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <p class="text-lg font-medium mb-2">No messages yet</p>
              <p class="text-sm">Start the conversation!</p>
            </div>
            
            <div v-for="(msg, index) in filteredMessages" :key="msg.id" 
                 class="mb-6" 
                 :class="{'mb-2': isGroupedMessage(msg, index)}"
                 :id="`message-${msg.id}`">
              <div class="flex" :class="{'justify-end': msg.userId === user.uid}">
                <div v-if="msg.userId !== user.uid && !isGroupedMessage(msg, index)" 
                     class="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0 cursor-pointer hover:scale-105 transition-transform"
                     @click="openUserProfile(msg.userId)"
                >
                  {{ getInitials(msg.username) }}
                </div>
                <div v-if="msg.userId === user.uid && !isGroupedMessage(msg, index)" class="w-10 mr-3 flex-shrink-0"></div>
                
                <div class="max-w-[75%] relative">
                  <div v-if="!isGroupedMessage(msg, index)" class="text-xs text-slate-500 mb-2 font-medium">
                    {{ msg.userId === user.uid ? 'You' : msg.username }}
                  </div>
                  <div 
                    class="rounded-2xl px-4 py-3 inline-block relative shadow-sm border transition-all duration-200 hover:shadow-md" 
                    :class="msg.userId === user.uid ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-emerald-200' : 'bg-white border-slate-200 text-slate-800'"
                    @contextmenu.prevent="showMessageOptions(msg, $event)"
                    @touchstart="startHold(msg)"
                    @touchend="clearHold"
                    @click.stop="msg.userId !== user.uid && showQuickReactions(msg, $event)"
                  >
                    <span v-if="editingMessage?.id !== msg.id" class="break-words">
                      {{ msg.text }}
                    </span>
                    
                    <!-- Enhanced File Preview -->
                    <div v-if="msg.fileUrl" class="mt-3">
                      <template v-if="isImageFile(msg.fileUrl)">
                        <img 
                          :src="msg.fileUrl" 
                          alt="Uploaded Image" 
                          class="max-w-full h-auto rounded-xl border border-slate-200 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                          @click="openLightbox(msg.fileUrl)"
                        />
                      </template>
                      <template v-else-if="isPdfFile(msg.fileUrl)">
                        <div class="border border-slate-200 rounded-xl shadow-sm p-4 bg-slate-50">
                          <div class="flex items-center justify-between mb-3">
                            <div class="flex items-center">
                              <div class="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                              </div>
                              <span class="text-sm font-medium text-slate-700">PDF Document</span>
                            </div>
                            <div class="flex gap-2">
                              <button @click="downloadFile(msg.fileUrl)" class="p-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                              </button>
                              <a :href="msg.fileUrl" target="_blank" rel="noopener noreferrer" class="p-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                              </a>
                            </div>
                          </div>
                          <embed 
                            :src="msg.fileUrl" 
                            type="application/pdf" 
                            class="w-full h-64 border border-slate-200 rounded-lg"
                          />
                        </div>
                      </template>
                      <template v-else-if="isVideoFile(msg.fileUrl)">
                        <video 
                          controls 
                          :src="msg.fileUrl" 
                          class="w-full h-64 border border-slate-200 rounded-xl shadow-sm"
                        >
                          Your browser does not support the video tag.
                        </video>
                      </template>
                      <template v-else>
                        <div class="border border-slate-200 rounded-xl shadow-sm p-3 bg-slate-50 flex items-center justify-between">
                          <div class="flex items-center">
                            <div class="w-8 h-8 bg-slate-200 rounded-lg flex items-center justify-center mr-3">
                              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                            <span class="text-sm font-medium text-slate-700">{{ getFileName(msg.fileUrl) }}</span>
                          </div>
                          <div class="flex gap-2">
                            <button @click="downloadFile(msg.fileUrl)" class="p-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors">
                              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </button>
                            <a :href="msg.fileUrl" target="_blank" rel="noopener noreferrer" class="p-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors">
                              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                            </a>
                          </div>
                        </div>
                      </template>
                    </div>
                    
                    <!-- Reactions -->
                    <div v-if="msg.reactions && Object.keys(msg.reactions).length > 0" class="mt-3 flex flex-wrap gap-2">
                      <div v-for="(count, emoji) in msg.reactions" :key="emoji" 
                           class="flex items-center gap-1 text-sm rounded-full px-3 py-1 border transition-colors cursor-pointer hover:scale-105"
                           :class="msg.userId === user.uid ? 'bg-white/20 border-white/30 text-white' : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'">
                        <span>{{ emoji }}</span>
                        <span class="font-medium">{{ count }}</span>
                      </div>
                    </div>
                    
                    <!-- Edit Message Modal -->
                    <div 
                      class="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4"
                      v-if="editingMessage?.id === msg.id" 
                      @click.stop
                    >
                      <div class="bg-white border border-slate-200 rounded-2xl shadow-2xl p-6 w-full max-w-md">
                        <h3 class="text-lg font-bold text-slate-800 mb-4">Edit Message</h3>
                        <textarea 
                          v-model="newMessage" 
                          class="border border-slate-300 rounded-xl px-4 py-3 text-sm w-full min-h-[120px] focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
                          placeholder="Edit your message..."
                        ></textarea>
                        <div class="flex justify-end mt-6 gap-3">
                          <button 
                            @click="cancelEditing()" 
                            class="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-200 transition-colors"
                          >
                            Cancel
                          </button>
                          <button 
                            @click="saveEditedMessage()" 
                            class="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl text-sm font-medium hover:from-emerald-600 hover:to-teal-700 transition-all shadow-sm"
                          >
                            Save Changes
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Message Options Menu -->
                  <div v-if="msgOptionsVisible && selectedMessage?.id === msg.id" 
                    class="absolute top-0 right-0 bg-white border border-slate-200 rounded-xl shadow-xl p-2 flex flex-col gap-1 z-10 min-w-[160px]"
                  >
                    <button v-if="msg.userId === user.uid" @click="startEditingMessage(msg)" class="text-sm text-slate-700 hover:text-slate-900 p-3 hover:bg-slate-50 rounded-lg transition-colors text-left">
                      <div class="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit Message
                      </div>
                    </button>
                    <button v-if="msg.userId === user.uid" @click="deleteMessage(msg.id)" class="text-sm text-red-600 hover:text-red-800 p-3 hover:bg-red-50 rounded-lg transition-colors text-left">
                      <div class="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete Message
                      </div>
                    </button>
                    <button @click="toggleThread(msg)" class="text-sm text-emerald-600 hover:text-emerald-800 p-3 hover:bg-emerald-50 rounded-lg transition-colors text-left">
                      <div class="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        Reply in Thread
                      </div>
                    </button>
                    <button @click="pinMessage(msg)" class="text-sm text-amber-600 hover:text-amber-800 p-3 hover:bg-amber-50 rounded-lg transition-colors text-left">
                      <div class="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                        </svg>
                        Pin Message
                      </div>
                    </button>
                    <button @click="copyToClipboard(msg.text)" class="text-sm text-slate-600 hover:text-slate-800 p-3 hover:bg-slate-50 rounded-lg transition-colors text-left">
                      <div class="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Copy Text
                      </div>
                    </button>
                    <div class="border-t border-slate-200 my-2"></div>
                    <div class="p-2">
                      <div class="text-xs text-slate-500 mb-3 font-medium uppercase tracking-wide">Quick Reactions</div>
                      <div class="flex flex-wrap gap-2">
                        <button v-for="emoji in ['👍', '❤️', '😂', '😮', '😢', '👏']" :key="emoji" 
                                @click="addReaction(msg.id, emoji)" 
                                class="text-lg hover:bg-slate-100 rounded-lg p-2 transition-all hover:scale-110">
                          {{ emoji }}
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div class="text-xs text-slate-400 mt-2 text-right flex items-center justify-end gap-2">
                    <span>{{ formatTimestamp(msg.timestamp) }}</span>
                    <span v-if="msg.edited" class="italic text-slate-400">(edited)</span>
                    <span v-if="chatSettings.readReceipts && msg.read && msg.userId === user.uid" class="text-emerald-500">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                  </div>
                  
                  <!-- Threaded Replies -->
                  <div v-if="msg.showThread" class="mt-4 ml-6 border-l-2 border-emerald-200 pl-4 bg-slate-50/50 rounded-r-xl p-4">
                    <div v-for="reply in msg.replies" :key="reply.id" class="mb-3">
                      <div class="text-xs text-slate-500 font-medium mb-1">{{ reply.username }}</div>
                      <div class="bg-white rounded-xl px-4 py-3 text-sm text-slate-800 shadow-sm border border-slate-200">
                        {{ reply.text }}
                      </div>
                      <div class="text-xs text-slate-400 mt-1">{{ formatTimestamp(reply.timestamp) }}</div>
                    </div>
                    <div class="mt-4 flex gap-3">
                      <input 
                        v-model="msg.newReply" 
                        type="text" 
                        placeholder="Write a reply..." 
                        class="flex-1 px-4 py-3 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                        @keyup.enter="addReply(msg)"
                      />
                      <button 
                        @click="addReply(msg)" 
                        class="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl text-sm font-medium hover:from-emerald-600 hover:to-teal-700 transition-all shadow-sm"
                      >
                        Reply
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Typing Indicators -->
            <div v-if="typingUsers.length > 0" class="mt-4">
              <div v-for="user in typingUsers" :key="user.id" class="flex items-center mb-3">
                <div class="w-10 h-10 rounded-full bg-gradient-to-br from-slate-400 to-slate-600 text-white flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0">
                  {{ user.initials }}
                </div>
                <div class="bg-white border border-slate-200 rounded-2xl px-4 py-3 inline-flex items-center shadow-sm">
                  <div class="flex gap-1 mr-3">
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                  </div>
                  <span class="text-sm text-slate-500 font-medium">{{ user.name }} is typing...</span>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Quick Reactions Popup -->
          <div 
            v-if="quickReactionsVisible && selectedMessage" 
            id="quick-reactions"
            class="fixed bg-white rounded-xl shadow-xl p-4 z-50 border border-slate-200"
            @click.stop
          >
            <div class="flex flex-col">
              <div class="text-sm text-slate-500 mb-3 font-medium">Quick Reactions</div>
              <div class="flex gap-3">
                <button 
                  v-for="emoji in ['👍', '❤️', '😂', '😮', '😢', '👏']" 
                  :key="emoji" 
                  @click="addReaction(selectedMessage.id, emoji); quickReactionsVisible = false; selectedMessage = null;" 
                  class="text-2xl hover:bg-slate-100 rounded-xl p-3 transition-all hover:scale-110"
                >
                  {{ emoji }}
                </button>
              </div>
            </div>
          </div>
          
          <!-- Message Input -->
          <div class="p-6 border-t border-slate-100 bg-white">
            <div class="flex flex-col gap-4">
              <!-- File Preview -->
              <div v-if="fileToSend" class="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between">
                <div class="flex items-center">
                  <div class="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <span class="text-sm font-medium text-slate-700 truncate max-w-[200px]">{{ getFileName(fileToSend) }}</span>
                </div>
                <button @click="fileToSend = null" class="text-slate-500 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-200 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div class="flex gap-3">
                <div class="relative flex-1">
                  <textarea 
                    v-model="newMessage" 
                    @keyup.enter.exact="editingMessage ? saveEditedMessage() : sendMessage()" 
                    @input="handleTyping"
                    @focus="handleFocus"
                    placeholder="Type a message..." 
                    class="w-full px-4 py-3 pr-12 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all resize-none bg-white shadow-sm"
                    :class="{'h-12': !isMultiline, 'h-24': isMultiline}"
                    rows="1"
                  ></textarea>
                  <div class="absolute right-3 bottom-3 flex gap-1">
                    <button 
                      @click="showEmojiPicker = !showEmojiPicker"
                      class="text-slate-500 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </button>
                  </div>
                  
                  <!-- Emoji Picker -->
                  <div v-if="showEmojiPicker" class="absolute bottom-14 right-0 bg-white border border-slate-200 rounded-xl shadow-xl p-4 z-10 emoji-picker">
                    <div class="text-sm font-medium text-slate-700 mb-3">Choose an emoji</div>
                    <div class="grid grid-cols-8 gap-2 max-h-48 overflow-y-auto">
                      <button 
                        v-for="emoji in commonEmojis" 
                        :key="emoji" 
                        @click="addEmojiToMessage(emoji)"
                        class="text-xl p-2 hover:bg-slate-100 rounded-lg transition-colors"
                      >
                        {{ emoji }}
                      </button>
                    </div>
                  </div>
                </div>
                
                <input 
                  type="file" 
                  ref="fileInput" 
                  @change="handleFileUpload" 
                  class="hidden"
                />
                <button 
                  @click="triggerFileInput"
                  class="px-4 py-3 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-colors shadow-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                </button>
                <button 
                  @click="sendMessage" 
                  :disabled="!newMessage.trim() && !fileToSend"
                  class="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm font-medium"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- Image Lightbox -->
    <div v-if="lightboxImage" class="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50" @click="lightboxImage = null">
      <div class="relative max-w-4xl w-full">
        <button @click.stop="lightboxImage = null" class="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full p-3 text-white hover:bg-white/40 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <img :src="lightboxImage" class="max-h-[80vh] max-w-full mx-auto object-contain rounded-xl" alt="Enlarged image" />
      </div>
    </div>

    <!-- Toast Notification -->
    <div 
      v-if="toast.show" 
      class="fixed bottom-6 right-6 px-6 py-4 rounded-xl shadow-xl z-50 flex items-center max-w-sm border backdrop-blur-sm"
      :class="{
        'bg-emerald-50/90 text-emerald-800 border-emerald-200': toast.type === 'success',
        'bg-red-50/90 text-red-800 border-red-200': toast.type === 'error',
        'bg-blue-50/90 text-blue-800 border-blue-200': toast.type === 'info',
        'bg-slate-50/90 text-slate-800 border-slate-200': toast.type === 'loading'
      }"
    >
      <div class="flex items-center">
        <div v-if="toast.type === 'loading'" class="spinner-sm mr-3">
          <div></div><div></div><div></div><div></div><div></div><div></div>
        </div>
        <svg 
          v-else-if="toast.type === 'success'" 
          class="h-5 w-5 mr-3 flex-shrink-0" 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 20 20" 
          fill="currentColor"
        >
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
        </svg>
        <svg 
          v-else-if="toast.type === 'error'" 
          class="h-5 w-5 mr-3 flex-shrink-0" 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 20 20" 
          fill="currentColor"
        >
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
        </svg>
        <svg 
          v-else-if="toast.type === 'info'" 
          class="h-5 w-5 mr-3 flex-shrink-0" 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 20 20" 
          fill="currentColor"
        >
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
        </svg>
        <span class="font-medium">{{ toast.message }}</span>
      </div>
    </div>

    <!-- Browser Notification Permission Request -->
    <div v-if="showNotificationPermissionRequest" class="fixed bottom-6 left-6 bg-white border border-slate-200 rounded-xl shadow-xl p-6 w-80 z-50">
      <div class="flex items-start">
        <div class="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </div>
        <div>
          <h3 class="font-semibold text-slate-800 mb-2">Enable Notifications</h3>
          <p class="text-sm text-slate-600 mb-4">
            Stay updated with messages, mentions, and reactions by enabling browser notifications.
          </p>
          <div class="flex gap-3">
            <button @click="requestNotificationPermission" class="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-sm font-medium rounded-lg hover:from-emerald-600 hover:to-teal-700 transition-all">
              Enable
            </button>
            <button @click="dismissPermissionRequest" class="px-4 py-2 bg-slate-100 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-200 transition-colors">
              Not Now
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, nextTick, onBeforeUnmount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot, endBefore, limit, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { debounce } from 'lodash';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";

// Dashboard state
const role = ref("user");
const username = ref("");
const notificationCount = ref(3);
const showLogoutModal = ref(false);
const sidebarOpen = ref(true);
const userMenuOpen = ref(false);
const isMobile = ref(false);
const userMenuRef = ref(null);
const isDarkMode = ref(false);
const showChatInfo = ref(false);
const collapsePinned = ref(false);
const lightboxImage = ref(null);
const showEmojiPicker = ref(false);
const isMultiline = ref(false);
const profileImageUrl = ref("");
const status = ref("active");
const lastLogin = ref(new Date());
const loggingOut = ref(false);
const toast = ref({ show: false, message: '', type: 'success' });

// Notification state
const notificationPanelOpen = ref(false);
const notifications = ref([]);
const hasUnreadNotifications = computed(() => notifications.value.some(n => !n.read));
const showNotificationPermissionRequest = ref(false);
const notificationPermission = ref(null);

// Chat state
const db = getFirestore();
const auth = getAuth();
const user = ref(null);
const messages = ref([]);
const newMessage = ref("");
const editingMessage = ref(null);
const fileToSend = ref(null);
const typingUsers = ref([]);
const messagesContainer = ref(null);
const isTyping = ref(false);
const selectedMessage = ref(null);
const msgOptionsVisible = ref(false);
let holdTimeout = null;
const onlineUsers = ref(5);
const quickReactionsVisible = ref(false);

// Error handling states
const errorLoadingMessages = ref(false);
const loadingMessages = ref(true);

// Chat settings
const chatSettings = ref({
  notifications: true,
  soundEffects: true,
  readReceipts: true
});

// Sample data for demo
const activeUsers = ref([
  { name: "John Doe", status: "Online" },
  { name: "Jane Smith", status: "Away" },
  { name: "Bob Johnson", status: "Online" },
  { name: "Alice Brown", status: "Busy" }
]);

const sharedFiles = ref([
  { name: "project-proposal.pdf" },
  { name: "meeting-notes.docx" },
  { name: "screenshot.png" }
]);

// Common emojis
const commonEmojis = [
  "😊", "😂", "❤️", "👍", "🙏", "😍", "🔥", "👏",
  "🎉", "🤔", "😢", "😎", "🥳", "😁", "👌", "🤣",
  "😉", "🙄", "😘", "😇", "🤝", "🤗", "😋", "😮"
];

const router = useRouter();
const route = useRoute();
const currentRoute = computed(() => route.path);

// Toggle notification panel
const toggleNotificationPanel = () => {
  notificationPanelOpen.value = !notificationPanelOpen.value;
  if (notificationPanelOpen.value) {
    markNotificationsAsRead();
  }
};

// Mark all notifications as read
const markAllNotificationsAsRead = () => {
  notifications.value = notifications.value.map(n => ({ ...n, read: true }));
  updateNotificationBadge();
};

// Clear all notifications
const clearAllNotifications = () => {
  notifications.value = [];
  updateNotificationBadge();
};

// Update notification badge count
const updateNotificationBadge = () => {
  notificationCount.value = notifications.value.filter(n => !n.read).length;
};

// Mark notifications as read
const markNotificationsAsRead = () => {
  notifications.value.forEach(notification => {
    if (!notification.read) {
      notification.read = true;
    }
  });
  updateNotificationBadge();
};

// Handle notification click
const handleNotificationClick = (notification) => {
  notification.read = true;
  updateNotificationBadge();
  
  if (notification.type === 'message' && notification.messageId) {
    const messageElement = document.getElementById(`message-${notification.messageId}`);
    if (messageElement) {
      messageElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      messageElement.classList.add('highlight-message');
      setTimeout(() => {
        messageElement.classList.remove('highlight-message');
      }, 2000);
    }
  }
  
  notificationPanelOpen.value = false;
};

// Get notification type class
const getNotificationTypeClass = (type) => {
  switch (type) {
    case 'message':
      return 'bg-emerald-100 text-emerald-600';
    case 'mention':
      return 'bg-blue-100 text-blue-600';
    case 'reaction':
      return 'bg-yellow-100 text-yellow-600';
    default:
      return 'bg-slate-100 text-slate-600';
  }
};

// Toggle notifications setting
const toggleNotifications = (event) => {
  if (event.target.checked) {
    if (window.Notification && Notification.permission !== 'granted') {
      showNotificationPermissionRequest.value = true;
    }
  }
};

// Request notification permission
const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    showToast('Browser does not support desktop notifications', 'error');
    return;
  }
  
  try {
    const permission = await Notification.requestPermission();
    notificationPermission.value = permission;
    
    if (permission === 'granted') {
      showToast('Notifications enabled!', 'success');
    } else {
      showToast('Notification permission denied', 'info');
    }
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    showToast('Failed to request notification permission', 'error');
  }
  
  showNotificationPermissionRequest.value = false;
};

// Dismiss notification permission request
const dismissPermissionRequest = () => {
  showNotificationPermissionRequest.value = false;
  localStorage.setItem('notificationPermissionDismissed', 'true');
};

// Show browser notification
const showBrowserNotification = (title, body, icon = null) => {
  if (window.Notification && Notification.permission === 'granted' && chatSettings.value.notifications) {
    const notification = new Notification(title, {
      body,
      icon: icon || '/eco-mist-logo.png'
    });
    
    notification.onclick = function() {
      window.focus();
      this.close();
    };
  }
};

// Add a new notification
const addNotification = (notification) => {
  notifications.value.unshift(notification);
  updateNotificationBadge();
  
  if (chatSettings.value.notifications && Notification.permission === 'granted') {
    showBrowserNotification(notification.title, notification.message);
  }
};

// Open user profile
const openUserProfile = (userId) => {
  showToast(`Opening profile for user ID: ${userId}`, 'info');
};

// Get initials for avatar
const getInitials = (name) => {
  if (!name) return "U";
  return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
};

// Handle click outside
const handleClickOutside = (event) => {
  if (showEmojiPicker.value && !event.target.closest('.emoji-picker')) {
    showEmojiPicker.value = false;
  }
  if (notificationPanelOpen.value && !event.target.closest('.notification-panel') && !event.target.closest('.notification-bell')) {
    notificationPanelOpen.value = false;
  }
};

// Fetch messages in real-time
const fetchMessages = () => {
  loadingMessages.value = true;
  const q = query(collection(db, "messages"), orderBy("timestamp", "desc"), limit(50));
  return onSnapshot(q, (snapshot) => {
    const newMessages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).reverse();
    
    if (messages.value.length > 0) {
      const lastKnownMsgTime = messages.value[messages.value.length - 1].timestamp?.seconds || 0;
      
      newMessages.forEach(msg => {
        const msgTimestamp = msg.timestamp?.seconds || 0;
        if (
          msgTimestamp > lastKnownMsgTime && 
          msg.userId !== user.value?.uid && 
          !messages.value.some(m => m.id === msg.id)
        ) {
          addNotification({
            id: Date.now(),
            type: 'message',
            title: `New message from ${msg.username}`,
            message: msg.text.length > 30 ? msg.text.substring(0, 30) + '...' : msg.text,
            timestamp: new Date(),
            read: false,
            messageId: msg.id
          });
          
          if (chatSettings.value.soundEffects) {
            playMessageSound('receive');
          }
        }
      });
    }
    
    messages.value = newMessages;
    
    if (chatSettings.value.readReceipts) {
      markMessagesAsRead(newMessages);
    }
    
    loadingMessages.value = false;
    nextTick(() => scrollToBottom());
  }, (error) => {
    console.error("Error fetching messages:", error);
    errorLoadingMessages.value = true;
    loadingMessages.value = false;
  });
};

// Mark messages as read
const markMessagesAsRead = async (msgs) => {
  if (!user.value) return;
  
  for (const msg of msgs) {
    if (msg.userId !== user.value.uid && !msg.read) {
      try {
        const docRef = doc(db, "messages", msg.id);
        await updateDoc(docRef, { read: true });
      } catch (error) {
        console.error("Error marking message as read:", error);
      }
    }
  }
};

// Retry loading messages
const retryLoadMessages = () => {
  errorLoadingMessages.value = false;
  loadingMessages.value = true;
  setTimeout(() => {
    fetchMessages();
  }, 1000);
};

// Lazy loading for messages
const handleScroll = debounce(() => {
  if (!messagesContainer.value) return;
  const { scrollTop, scrollHeight, clientHeight } = messagesContainer.value;
  if (scrollTop === 0 && !loadingMessages.value) {
    loadMoreMessages();
  }
}, 200);

const loadMoreMessages = async () => {
  if (messages.value.length === 0) return;
  
  loadingMessages.value = true;
  try {
    const oldestMessage = messages.value[0];
    const q = query(
      collection(db, "messages"),
      orderBy("timestamp"),
      endBefore(oldestMessage.timestamp),
      limit(20)
    );
    const snapshot = await getDocs(q);
    const olderMessages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    messages.value = [...olderMessages, ...messages.value];
  } catch (error) {
    console.error("Error loading more messages:", error);
    errorLoadingMessages.value = true;
  } finally {
    loadingMessages.value = false;
  }
};

// Send message with optional file
const sendMessage = async () => {
  if (!newMessage.value.trim() && !fileToSend.value) return;
  
  if (!user.value) {
    showToast("You must be logged in to send messages", "error");
    return;
  }
  
  const message = {
    text: newMessage.value,
    fileUrl: fileToSend.value || null,
    userId: user.value.uid,
    username: username.value || user.value.displayName || "Anonymous",
    timestamp: new Date(),
    edited: false,
    read: false
  };
  
  if (isOnline.value) {
    try {
      const docRef = await addDoc(collection(db, "messages"), message);
      message.id = docRef.id;
      
      if (chatSettings.value.soundEffects) {
        playMessageSound('send');
      }
      
      const mentionRegex = /@(\w+)/g;
      const mentions = newMessage.value.match(mentionRegex);
      
      if (mentions && mentions.length > 0) {
        mentions.forEach(mention => {
          const username = mention.substring(1);
          console.log(`User ${username} mentioned in a message`);
        });
      }
    } catch (error) {
      console.error("Error sending message:", error);
      showToast("Failed to send message. Please try again.", "error");
    }
  } else {
    queueMessage(message);
    showToast("You are offline. Your message has been queued and will be sent when you reconnect.", "info");
  }
  
  newMessage.value = "";
  fileToSend.value = null;
  isMultiline.value = false;
  showEmojiPicker.value = false;
};

// Play message sound
const playMessageSound = (type) => {
  if (!chatSettings.value.soundEffects) return;
  
  const audio = new Audio();
  if (type === 'send') {
    audio.src = '/sounds/message-sent.mp3';
  } else if (type === 'receive') {
    audio.src = '/sounds/message-received.mp3';
  }
  audio.play().catch(e => console.log('Error playing sound:', e));
};

// Scroll to bottom of messages
const scrollToBottom = () => {
  setTimeout(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTo({ 
        top: messagesContainer.value.scrollHeight, 
        behavior: 'smooth' 
      });
    }
  }, 100);
};

// Format timestamp
const formatTimestamp = (timestamp) => {
  if (!timestamp) return "";
  
  const date = timestamp.seconds ? new Date(timestamp.seconds * 1000) : new Date(timestamp);
  const now = new Date();
  const diff = Math.floor((now - date) / 1000);
  
  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return date.toLocaleDateString();
};

// Check if message should be grouped with previous message
const isGroupedMessage = (message, index) => {
  if (index === 0) return false;
  
  const prevMessage = messages.value[index - 1];
  const timeDiff = message.timestamp.seconds - prevMessage.timestamp.seconds;
  
  return message.userId === prevMessage.userId && timeDiff < 120;
};

// Handle typing indicator
const handleTyping = debounce(() => {
  isTyping.value = true;
  isMultiline.value = newMessage.value.includes('\n') || newMessage.value.length > 100;
  
  setTimeout(() => {
    isTyping.value = false;
  }, 3000);
}, 300);

// Typing indicator simulation
const handleFocus = () => {
  simulateTypingUsers();
};

// Check if device is mobile
const checkIfMobile = () => {
  isMobile.value = window.innerWidth < 768;
};

// Handle window resize
const handleResize = () => {
  checkIfMobile();
};

// Initialize component
let unsubscribeMessages = null;
onMounted(async () => {
  checkIfMobile();
  window.addEventListener('resize', handleResize);
  document.addEventListener('click', handleClickOutside);
  
  if (window.Notification) {
    notificationPermission.value = Notification.permission;
    
    if (
      Notification.permission !== 'granted' && 
      Notification.permission !== 'denied' &&
      !localStorage.getItem('notificationPermissionDismissed')
    ) {
      setTimeout(() => {
        showNotificationPermissionRequest.value = true;
      }, 3000);
    }
  }
  
  setTimeout(() => {
    notifications.value = [
      {
        id: 1,
        type: 'message',
        title: 'New message from John Doe',
        message: 'Hey, do you have a minute to chat?',
        timestamp: new Date(Date.now() - 1000 * 60 * 5),
        read: false
      },
      {
        id: 2,
        type: 'mention',
        title: 'You were mentioned',
        message: 'Jane Smith mentioned you in a message.',
        timestamp: new Date(Date.now() - 1000 * 60 * 15),
        read: false
      },
      {
        id: 3,
        type: 'reaction',
        title: 'New reaction',
        message: 'Robert Johnson reacted with 👍 to your message.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60),
        read: true
      }
    ];
    updateNotificationBadge();
  }, 1000);
  
  onAuthStateChanged(auth, (currentUser) => {
    if (currentUser) {
      user.value = currentUser;
      username.value = currentUser.displayName || "User";
      profileImageUrl.value = currentUser.photoURL || "";
    } else {
      router.push('/auth');
    }
  });
  
  unsubscribeMessages = fetchMessages();
});

// Cleanup on component unmount
onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
  document.removeEventListener('click', handleClickOutside);
  if (unsubscribeMessages) {
    unsubscribeMessages();
  }
});

// Start editing a message
const startEditingMessage = (msg) => {
  editingMessage.value = { ...msg };
  newMessage.value = msg.text;
  msgOptionsVisible.value = false;
};

// Save edited message and hide options
const saveEditedMessage = async () => {
  if (!editingMessage.value) return;
  try {
    const docRef = doc(db, "messages", editingMessage.value.id);
    await updateDoc(docRef, { 
      text: newMessage.value,
      edited: true
    });
    const index = messages.value.findIndex((msg) => msg.id === editingMessage.value.id);
    if (index !== -1) {
      messages.value[index].text = newMessage.value;
      messages.value[index].edited = true;
    }
    editingMessage.value = null;
    newMessage.value = "";
    msgOptionsVisible.value = false;
    selectedMessage.value = null;
    showToast("Message updated successfully", "success");
  } catch (error) {
    console.error("Error editing message:", error);
    showToast("Failed to update message", "error");
  }
};

// Cancel editing and hide options
const cancelEditing = () => {
  editingMessage.value = null;
  newMessage.value = "";
  msgOptionsVisible.value = false;
  selectedMessage.value = null;
};

// Delete a message
const deleteMessage = async (messageId) => {
  try {
    const docRef = doc(db, "messages", messageId);
    await deleteDoc(docRef);
    msgOptionsVisible.value = false;
    selectedMessage.value = null;
    showToast("Message deleted", "success");
  } catch (error) {
    console.error("Error deleting message:", error);
    showToast("Failed to delete message", "error");
  }
};

// Handle file upload
const handleFileUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  
  const loadingToast = showToast('Uploading file...', 'loading');
  
  try {
    const storage = getStorage();
    const storageReference = storageRef(storage, `uploads/${Date.now()}_${file.name}`);
    await uploadBytes(storageReference, file);
    const fileUrl = await getDownloadURL(storageReference);
    fileToSend.value = fileUrl;
    
    hideToast(loadingToast);
    showToast('File uploaded successfully!', 'success');
  } catch (error) {
    console.error("Error uploading file:", error);
    hideToast(loadingToast);
    showToast('Failed to upload file. Please try again.', 'error');
  }
};

// Simple toast notification system
const showToast = (message, type = 'info') => {
  if (type === 'loading') {
    const id = Date.now();
    toast.value = { show: true, message, type };
    return id;
  } else {
    toast.value = { show: true, message, type };
    setTimeout(() => {
      toast.value.show = false;
    }, 3000);
    return null;
  }
};

const hideToast = (id) => {
  if (id) {
    toast.value.show = false;
  }
};

// Trigger file input
const triggerFileInput = () => {
  if (fileInput.value) {
    fileInput.value.click();
  } else {
    console.error("File input reference is not defined.");
  }
};

// Show message options on right-click or hold
const showMessageOptions = (msg, event) => {
  selectedMessage.value = msg;
  msgOptionsVisible.value = true;
  event.stopPropagation();
};

// Start hold for touch devices
const startHold = (msg) => {
  holdTimeout = setTimeout(() => {
    selectedMessage.value = msg;
    msgOptionsVisible.value = true;
  }, 500);
};

// Clear hold timeout
const clearHold = () => {
  clearTimeout(holdTimeout);
};

// Hide message options and reset editing state
const hideMessageOptions = (event) => {
  if (
    (msgOptionsVisible.value || quickReactionsVisible.value) &&
    !event.target.closest('.absolute') && 
    !event.target.closest('.relative') &&
    !event.target.closest('#quick-reactions')
  ) {
    msgOptionsVisible.value = false;
    quickReactionsVisible.value = false;
    selectedMessage.value = null;
  }
};

// Show quick reactions for other users' messages
const showQuickReactions = (msg, event) => {
  if (msg.userId === user.value?.uid) return;
  selectedMessage.value = msg;
  msgOptionsVisible.value = false;
  quickReactionsVisible.value = true;
  nextTick(() => {
    const reactionsEl = document.getElementById('quick-reactions');
    if (reactionsEl) {
      const rect = event.target.getBoundingClientRect();
      reactionsEl.style.top = `${rect.bottom + 10}px`;
      reactionsEl.style.left = `${rect.left}px`;
    }
  });
  event.stopPropagation();
};

// Define the file input reference
const fileInput = ref(null);

// Add reaction to a message
const addReaction = async (messageId, emoji) => {
  try {
    const docRef = doc(db, "messages", messageId);
    const message = messages.value.find((msg) => msg.id === messageId);
    if (!message) return;

    const reactions = message.reactions || {};
    reactions[emoji] = (reactions[emoji] || 0) + 1;

    await updateDoc(docRef, { reactions });
    
    message.reactions = reactions;
    
    if (message.userId !== user.value?.uid) {
      addNotification({
        id: Date.now(),
        type: 'reaction',
        title: 'New reaction',
        message: `${username.value} reacted with ${emoji} to your message.`,
        timestamp: new Date(),
        read: false,
        messageId: messageId
      });
    }
    
    msgOptionsVisible.value = false;
    selectedMessage.value = null;
  } catch (error) {
    console.error("Error adding reaction:", error);
    showToast("Failed to add reaction", "error");
  }
};

// Add emoji to message input
const addEmojiToMessage = (emoji) => {
  newMessage.value += emoji;
  showEmojiPicker.value = false;
};

// Search query state
const searchQuery = ref("");

// Computed property to filter messages based on the search query
const filteredMessages = computed(() => {
  if (!searchQuery.value.trim()) {
    return messages.value;
  }
  const query = searchQuery.value.toLowerCase();
  return messages.value.filter(msg => 
    msg.text?.toLowerCase().includes(query) || 
    msg.username?.toLowerCase().includes(query)
  );
});

// Pinned messages state
const pinnedMessages = ref([]);

// Pin a message
const pinMessage = (msg) => {
  if (!pinnedMessages.value.find(pinned => pinned.id === msg.id)) {
    pinnedMessages.value.push(msg);
    showToast(`Message pinned successfully!`, 'success');
  }
  msgOptionsVisible.value = false;
  selectedMessage.value = null;
};

// Unpin a message
const unpinMessage = (messageId) => {
  pinnedMessages.value = pinnedMessages.value.filter(msg => msg.id !== messageId);
  showToast(`Message unpinned`, 'info');
};

// Simulate typing indicators for multiple users
const simulateTypingUsers = () => {
  typingUsers.value = [
    { id: 1, name: "Jane Smith", initials: "JS" }
  ];
  setTimeout(() => {
    typingUsers.value = [];
  }, 3000);
};

// Toggle thread visibility for a message
const toggleThread = (msg) => {
  msg.showThread = !msg.showThread;
  if (!msg.replies) {
    msg.replies = [];
  }
  if (!msg.newReply) {
    msg.newReply = "";
  }
  msgOptionsVisible.value = false;
  selectedMessage.value = null;
};

// Add a reply to a message thread
const addReply = async (msg) => {
  if (!msg.newReply.trim()) return;
  try {
    const docRef = doc(db, "messages", msg.id);
    const reply = {
      id: Date.now().toString(),
      text: msg.newReply,
      username: username.value || "Anonymous",
      timestamp: new Date(),
    };
    const updatedReplies = [...(msg.replies || []), reply];
    await updateDoc(docRef, { replies: updatedReplies });
    msg.replies = updatedReplies;
    msg.newReply = "";
    
    if (msg.userId !== user.value?.uid) {
      addNotification({
        id: Date.now(),
        type: 'message',
        title: 'New reply',
        message: `${username.value} replied to your message: "${reply.text.substring(0, 30)}${reply.text.length > 30 ? '...' : ''}"`,
        timestamp: new Date(),
        read: false,
        messageId: msg.id
      });
    }
    
    showToast("Reply added", "success");
  } catch (error) {
    console.error("Error adding reply:", error);
    showToast("Failed to add reply", "error");
  }
};

// Helper function to check if a file is an image
const isImageFile = (fileUrl) => {
  return /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(fileUrl);
};

// Helper function to check if a file is a PDF
const isPdfFile = (fileUrl) => {
  return /\.pdf$/i.test(fileUrl);
};

// Helper function to check if a file is a video
const isVideoFile = (fileUrl) => {
  return /\.(mp4|webm|ogg)$/i.test(fileUrl);
};

// Get file name from URL
const getFileName = (fileUrl) => {
  if (!fileUrl) return "";
  const parts = fileUrl.split('/');
  let fileName = parts[parts.length - 1];
  fileName = fileName.split('?')[0];
  return decodeURIComponent(fileName);
};

// Open image in lightbox
const openLightbox = (imageUrl) => {
  lightboxImage.value = imageUrl;
};

// Offline Mode
const isOnline = ref(navigator.onLine);
const queuedMessages = ref([]);

const queueMessage = (message) => {
  queuedMessages.value.push(message);
  localStorage.setItem("queuedMessages", JSON.stringify(queuedMessages.value));
};

const sendQueuedMessages = async () => {
  if (queuedMessages.value.length === 0) return;
  
  const loadingToast = showToast(`Sending ${queuedMessages.value.length} queued message(s)...`, 'loading');
  
  const queued = [...queuedMessages.value];
  queuedMessages.value = [];
  localStorage.removeItem("queuedMessages");

  try {
    for (const message of queued) {
      await addDoc(collection(db, "messages"), message);
    }
    hideToast(loadingToast);
    showToast('All queued messages sent successfully!', 'success');
  } catch (error) {
    console.error("Error sending queued messages:", error);
    hideToast(loadingToast);
    showToast('Failed to send some queued messages', 'error');
    
    queuedMessages.value = queued;
    localStorage.setItem("queuedMessages", JSON.stringify(queuedMessages.value));
  }
};

// Handle online/offline events
const handleOnlineStatus = () => {
  isOnline.value = navigator.onLine;
  if (isOnline.value) {
    sendQueuedMessages();
  }
};

// Initialize offline mode
onMounted(() => {
  window.addEventListener("online", handleOnlineStatus);
  window.addEventListener("offline", handleOnlineStatus);
  
  isOnline.value = navigator.onLine;
  
  const queued = localStorage.getItem("queuedMessages");
  if (queued) {
    queuedMessages.value = JSON.parse(queued);
  }
});

// Copy text to clipboard
const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text).then(() => {
    showToast("Text copied to clipboard!", "success");
    msgOptionsVisible.value = false;
    selectedMessage.value = null;
  }).catch((err) => {
    console.error("Failed to copy text: ", err);
    showToast("Failed to copy text", "error");
  });
};

// Download file
const downloadFile = (fileUrl) => {
  const link = document.createElement('a');
  link.href = fileUrl;
  link.download = getFileName(fileUrl);
  link.click();
};
</script>

<style scoped>
/* Spinner Animation */
.spinner {
  width: 44px;
  height: 44px;
  animation: spinner-rotation 2s infinite ease;
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

.spinner-sm {
  width: 24px;
  height: 24px;
}

@keyframes spinner-rotation {
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

/* Typing indicator */
.typing-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #10b981;
  margin: 0 2px;
  animation: typing 1.4s infinite ease-in-out both;
}

.typing-dot:nth-child(1) {
  animation-delay: 0s;
}

.typing-dot:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-dot:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {
  0%, 80%, 100% {
    transform: scale(0.6);
    opacity: 0.4;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

/* Highlight a message */
.highlight-message {
  animation: highlight-pulse 2s ease-in-out;
}

@keyframes highlight-pulse {
  0%, 100% {
    background-color: transparent;
  }
  50% {
    background-color: rgba(16, 185, 129, 0.2);
  }
}

/* Smooth transitions */
.transition-all {
  transition: all 0.3s ease;
}

/* Focus styles for accessibility */
button:focus-visible,
input:focus-visible,
textarea:focus-visible {
  outline: 2px solid #10b981;
  outline-offset: 2px;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .w-80 {
    width: calc(100vw - 2rem);
    max-width: 20rem;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .spinner, .spinner-sm {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
  }
  
  .transition-all {
    transition-duration: 0.001ms !important;
  }
  
  .typing-dot {
    animation: none !important;
  }
  
  .highlight-message {
    animation: none !important;
    background-color: rgba(16, 185, 129, 0.1);
  }
}
</style>