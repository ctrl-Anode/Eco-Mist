<template>
  <div class="min-h-screen bg-gradient-to-br from-green-50 via-green-100 to-green-200 flex flex-col">
    <!-- Mobile Header -->
    <header class="md:hidden bg-white/80 backdrop-blur-xl border-b border-slate-200/50 px-4 py-3 flex items-center justify-between sticky top-0 z-40 shadow-sm">
      <div class="flex items-center gap-3">
        <div class="bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 p-2.5 rounded-xl shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <div>
          <div class="flex items-center gap-2">
            <h1 class="text-lg font-bold text-slate-800">Messenger</h1>
            <div class="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" aria-hidden="true"></div>
            <p class="text-xs text-slate-600 font-medium">{{ onlineUsers }} online</p>
          </div>
        </div>
      </div>
      <div class="flex items-center gap-1">
        <button 
          @click="toggleSearch"
          class="p-2.5 rounded-xl bg-slate-100/80 text-slate-600 hover:bg-slate-200/80 transition-all duration-200 hover:scale-105"
          aria-label="Toggle search"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
        <button 
          @click="toggleNotificationPanel"
          class="relative p-2.5 rounded-xl bg-slate-100/80 text-slate-600 hover:bg-slate-200/80 transition-all duration-200 hover:scale-105"
          aria-label="Toggle notifications"
          :aria-expanded="notificationPanelOpen"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span v-if="hasUnreadNotifications" class="absolute -top-1 -right-1 h-5 w-5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-lg animate-bounce" aria-label="Unread notifications">
            {{ notificationCount > 9 ? '9+' : notificationCount }}
          </span>
        </button>
        <button 
          @click="showChatInfo = !showChatInfo"
          class="p-2.5 rounded-xl bg-slate-100/80 text-slate-600 hover:bg-slate-200/80 transition-all duration-200 hover:scale-105"
          aria-label="Toggle chat info"
          :aria-expanded="showChatInfo"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
      </div>
    </header>

    <!-- Main Content Area -->
    <div class="flex flex-1 flex-col md:flex-row overflow-hidden">
      <!-- Desktop Header -->
      <main class="flex-1 overflow-y-auto bg-transparent px-3 py-4 sm:px-4 md:p-6">
        <header class="hidden md:block mb-8">
          <div class="p-6 border-b border-slate-100/50 bg-gradient-to-r from-emerald-50/50 via-teal-50/50 to-cyan-50/50 backdrop-blur-sm rounded-2xl">
            <div class="flex justify-between items-center">
              <!-- Chat Title & Icon -->
              <div class="flex items-center gap-4">
                <div class="bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 p-4 rounded-2xl shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <div>
                  <h2 class="text-2xl font-bold text-slate-800">Community Chat</h2>
                  <p class="text-base text-slate-600">Real-time conversations</p>
                </div>
              </div>

              <!-- Search + Online Status + Notifications -->
              <div class="flex items-center gap-4">
                <!-- Search Input -->
                <div class="relative w-72">
                  <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input 
                    v-model="searchQuery"
                    type="text"
                    placeholder="Search messages, users, or files..."
                    class="w-full pl-12 pr-12 py-3 bg-white/60 backdrop-blur-sm border border-white/20 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all shadow-sm text-sm focus:bg-white/80"
                    aria-label="Search messages"
                  />
                  <button 
                    v-if="searchQuery" 
                    @click="searchQuery = ''" 
                    class="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                    aria-label="Clear search"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <!-- Online Users -->
                <div class="flex items-center gap-3 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-xl shadow-sm border border-white/20">
                  <div class="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" aria-hidden="true"></div>
                  <span class="text-sm font-semibold text-slate-700">{{ onlineUsers }} Online</span>
                </div>

                <!-- Notifications -->
                <button 
                  @click="toggleNotificationPanel"
                  class="relative p-3 rounded-xl bg-white/60 backdrop-blur-sm shadow-sm border border-white/20 hover:bg-white/80 transition-all duration-300 group"
                  :class="{ 'ring-2 ring-emerald-500 bg-white/80': notificationPanelOpen }"
                  aria-label="Toggle notifications"
                  :aria-expanded="notificationPanelOpen"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-slate-600 group-hover:text-slate-800 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  <span v-if="hasUnreadNotifications" class="absolute -top-2 -right-2 h-5 w-5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-lg animate-bounce" aria-label="Unread notifications">
                    {{ notificationCount > 9 ? '9+' : notificationCount }}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </header>

        <!-- Mobile Search Bar -->
        <div v-if="showMobileSearch" class="md:hidden mb-6">
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input 
              v-model="searchQuery" 
              type="text" 
              placeholder="Search messages..." 
              class="w-full pl-12 pr-12 py-4 bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all shadow-sm text-base"
              aria-label="Search messages"
            />
            <button 
              @click="toggleSearch" 
              class="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
              aria-label="Close search"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        <!-- Chat Card -->
        <div class="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl overflow-hidden relative mb-6 flex flex-col border border-white/20 chat-container" 
             :style="{ height: isMobile ? 'calc(100vh - 200px)' : 'calc(100vh - 100px)' }">
          
          <!-- Chat Info Sidebar -->
          <div 
            v-if="showChatInfo" 
            class="chat-info-sidebar"
            :class="{ 'translate-x-0': showChatInfo, 'translate-x-full': !showChatInfo }"
            role="dialog"
            aria-labelledby="chat-info-title"
            aria-modal="true"
          >
            <div class="p-6">
              <div class="flex justify-between items-center mb-8">
                <h3 id="chat-info-title" class="font-bold text-slate-800 text-xl">Chat Information</h3>
                <button @click="showChatInfo = false" class="text-slate-500 hover:text-slate-700 p-2 rounded-xl hover:bg-slate-100/50 transition-all duration-200" aria-label="Close chat info">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div class="mb-8">
                <h4 class="text-sm font-bold text-slate-500 mb-4 uppercase tracking-wider">Active Users</h4>
                <div class="space-y-3" role="list">
                  <div v-for="(user, index) in activeUsers" :key="index" class="flex items-center gap-3 p-4 rounded-2xl hover:bg-slate-50/50 transition-all duration-200 cursor-pointer" role="listitem">
                    <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center text-sm font-bold shadow-lg" :aria-label="`${user.name} avatar`">
                      {{ getInitials(user.name) }}
                    </div>
                    <div>
                      <div class="text-base font-semibold text-slate-800">{{ user.name }}</div>
                      <div class="text-sm text-slate-500">{{ user.status }}</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="mb-8">
                <h4 class="text-sm font-bold text-slate-500 mb-4 uppercase tracking-wider">Chat Settings</h4>
                <div class="space-y-4">
                  <div class="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50/50 transition-all duration-200">
                    <span class="text-base font-semibold text-slate-700">Notifications</span>
                    <label class="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" v-model="chatSettings.notifications" class="sr-only peer" @change="toggleNotifications" aria-label="Toggle notifications">
                      <div class="toggle-switch"></div>
                    </label>
                  </div>
                  <div class="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50/50 transition-all duration-200">
                    <span class="text-base font-semibold text-slate-700">Sound Effects</span>
                    <label class="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" v-model="chatSettings.soundEffects" class="sr-only peer" aria-label="Toggle sound effects">
                      <div class="toggle-switch"></div>
                    </label>
                  </div>
                  <div class="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50/50 transition-all duration-200">
                    <span class="text-base font-semibold text-slate-700">Read Receipts</span>
                    <label class="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" v-model="chatSettings.readReceipts" class="sr-only peer" aria-label="Toggle read receipts">
                      <div class="toggle-switch"></div>
                    </label>
                  </div>
                </div>
              </div>

              <!-- Quick Actions Section -->
              <div class="mb-8">
                <h4 class="text-sm font-bold text-slate-500 mb-4 uppercase tracking-wider">Quick Actions</h4>
                <div class="grid grid-cols-2 gap-3">
                  <button @click="exportChat" class="p-4 bg-blue-50 hover:bg-blue-100 rounded-2xl transition-all duration-200 text-center" aria-label="Export chat">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-600 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span class="text-xs font-semibold text-blue-700">Export</span>
                  </button>
                  <button @click="clearChat" class="p-4 bg-red-50 hover:bg-red-100 rounded-2xl transition-all duration-200 text-center" aria-label="Clear chat">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-red-600 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    <span class="text-xs font-semibold text-red-700">Clear</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Messages Container -->
          <div 
            class="flex-1 overflow-y-auto p-4 md:p-6 bg-gradient-to-b from-slate-50/30 via-white/20 to-slate-50/30 backdrop-blur-sm messages-container" 
            ref="messagesContainer" 
            @scroll="handleScroll"
            @click="hideMessageOptions"
            role="log"
            aria-live="polite"
            aria-label="Chat messages"
          >
            <!-- Loading State -->
            <div v-if="loadingMessages" class="flex justify-center items-center py-12">
              <div class="flex items-center gap-4">
                <div class="spinner-enhanced" aria-hidden="true">
                  <div></div><div></div><div></div><div></div><div></div><div></div>
                </div>
                <span class="text-slate-500 font-semibold text-base">Loading messages...</span>
              </div>
            </div>
            
            <!-- Error State -->
            <div v-if="errorLoadingMessages" class="text-center p-8 bg-red-50/80 backdrop-blur-sm border border-red-200/50 rounded-2xl text-red-600" role="alert">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto mb-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p class="font-bold mb-4 text-lg">Error loading messages</p>
              <button @click="retryLoadMessages" class="px-6 py-3 bg-red-100 text-red-700 rounded-xl hover:bg-red-200 font-semibold transition-all duration-200 shadow-sm">
                Try Again
              </button>
            </div>
            
            <!-- Empty State -->
            <div v-if="messages.length === 0 && !loadingMessages" class="h-full flex flex-col items-center justify-center text-slate-500">
              <div class="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl flex items-center justify-center mb-6 shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <p class="text-xl font-bold mb-3">No messages yet</p>
              <p class="text-base">Start the conversation and connect with others!</p>
            </div>
            
            <!-- Messages -->
            <div v-for="(msg, index) in filteredMessages" :key="msg.id" 
                 class="mb-6 message-item" 
                 :class="{'mb-3': isGroupedMessage(msg, index)}"
                 :id="`message-${msg.id}`">
              <div class="flex" :class="{'justify-end': msg.userId === user?.uid}">
                <!-- Avatar for other users -->
                <div v-if="msg.userId !== user?.uid && !isGroupedMessage(msg, index)" 
                     class="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center text-sm md:text-base font-bold mr-3 md:mr-4 flex-shrink-0 cursor-pointer hover:scale-110 transition-all duration-200 shadow-lg"
                     @click="openUserProfile(msg.userId)"
                     :aria-label="`${msg.username} avatar`"
                     tabindex="0"
                     @keydown.enter="openUserProfile(msg.userId)"
                >
                  {{ getInitials(msg.username) }}
                </div>
                <div v-if="msg.userId === user?.uid && !isGroupedMessage(msg, index)" class="w-10 md:w-12 mr-3 md:mr-4 flex-shrink-0"></div>
                
                <div class="max-w-[85%] md:max-w-[75%] relative">
                  <!-- Username -->
                  <div v-if="!isGroupedMessage(msg, index)" class="text-sm text-slate-500 mb-2 font-semibold">
                    {{ msg.userId === user?.uid ? 'You' : msg.username }}
                  </div>
                  
                  <!-- Message Bubble -->
                  <div 
                    class="message-bubble" 
                    :class="[
                      msg.userId === user?.uid ? 'bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 text-white border-emerald-200/50 shadow-emerald-200/50' : 'bg-white/90 backdrop-blur-sm border-slate-200/50 text-slate-800 shadow-slate-200/50',
                      'rounded-3xl px-4 py-3 md:px-6 md:py-4 inline-block relative shadow-lg border transition-all duration-300 hover:shadow-xl hover:scale-[1.02]'
                    ]"
                    @contextmenu.prevent="showMessageOptions(msg, $event)"
                    @touchstart="startHold(msg)"
                    @touchend="clearHold"
                    @click.stop="msg.userId !== user?.uid && showQuickReactions(msg, $event)"
                    tabindex="0"
                    :aria-label="`Message from ${msg.username}: ${msg.text}`"
                    @keydown.enter="msg.userId !== user?.uid && showQuickReactions(msg, $event)"
                  >
                    <!-- Message Text -->
                    <span v-if="editingMessage?.id !== msg.id" class="break-words text-base md:text-lg leading-relaxed">
                      {{ msg.text }}
                    </span>
                    
                    <!-- File Preview -->
                    <div v-if="msg.fileUrl" class="mt-3 md:mt-4">
                      <!-- Image Files -->
                      <template v-if="isImageFile(msg.fileUrl)">
                        <img 
                          :src="msg.fileUrl" 
                          alt="Uploaded Image" 
                          class="max-w-full h-auto rounded-2xl border border-slate-200/50 shadow-lg cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                          @click="openLightbox(msg.fileUrl)"
                          tabindex="0"
                          @keydown.enter="openLightbox(msg.fileUrl)"
                        />
                      </template>
                      
                      <!-- PDF Files -->
                      <template v-else-if="isPdfFile(msg.fileUrl)">
                        <div class="border border-slate-200/50 rounded-2xl shadow-lg p-4 md:p-5 bg-slate-50/80 backdrop-blur-sm">
                          <div class="flex items-center justify-between mb-3">
                            <div class="flex items-center">
                              <div class="w-10 h-10 bg-red-100 rounded-2xl flex items-center justify-center mr-4">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                              </div>
                              <span class="text-base font-semibold text-slate-700">
                                {{ getFileName(msg.fileUrl) }}
                              </span>
                            </div>
                            <div class="flex gap-2">
                              <button @click="downloadFile(msg.fileUrl)" class="p-2.5 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition-all duration-200" aria-label="Download file">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                              </button>
                              <a :href="msg.fileUrl" target="_blank" rel="noopener noreferrer" class="p-2.5 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition-all duration-200" aria-label="Open file in new tab">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                              </a>
                            </div>
                          </div>
                          </div>
                        </template>
                      
                      <!-- Video Files -->
                      <template v-else-if="isVideoFile(msg.fileUrl)">
                        <video 
                          controls 
                          :src="msg.fileUrl" 
                          class="w-full h-48 md:h-64 border border-slate-200/50 rounded-2xl shadow-lg"
                          aria-label="Video attachment"
                        >
                          Your browser does not support the video tag.
                        </video>
                      </template>
                      
                      <!-- Other Files -->
                      <template v-else>
                        <div class="border border-slate-200/50 rounded-2xl shadow-lg p-3 md:p-4 bg-slate-50/80 backdrop-blur-sm flex items-center justify-between">
                          <div class="flex items-center">
                            <div class="w-10 h-10 bg-slate-200 rounded-2xl flex items-center justify-center mr-4">
                              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                            <span class="text-base font-semibold text-slate-700 truncate">
                              {{ getFileName(msg.fileUrl) }}
                            </span>
                          </div>
                          <div class="flex gap-2">
                            <button @click="downloadFile(msg.fileUrl)" class="p-2.5 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition-all duration-200" aria-label="Download file">
                              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </button>
                            <a :href="msg.fileUrl" target="_blank" rel="noopener noreferrer" class="p-2.5 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition-all duration-200" aria-label="Open file in new tab">
                              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                            </a>
                          </div>
                        </div>
                      </template>
                    </div>
                    
                    <!-- Reactions -->
                    <div v-if="msg.reactions && Object.keys(msg.reactions).length > 0" class="mt-3 md:mt-4 flex flex-wrap gap-2">
                      <div v-for="(count, emoji) in msg.reactions" :key="emoji" class="flex items-center gap-1 px-2 py-1 rounded-full bg-white/80 shadow text-sm" :aria-label="`${count} ${emoji} reactions`">
                        <span>{{ emoji }}</span>
                        <span>{{ count }}</span>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Message Options Menu -->
                  <div v-if="msgOptionsVisible && selectedMessage?.id === msg.id" 
                    class="message-options-menu"
                    role="menu"
                    aria-label="Message options"
                  >
                    <button v-if="msg.userId === user?.uid" @click="startEditingMessage(msg)" class="menu-item" role="menuitem">
                      <div class="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        <span class="font-semibold">Edit Message</span>
                      </div>
                    </button>
                    <button v-if="msg.userId === user?.uid" @click="deleteMessage(msg.id)" class="menu-item text-red-600 hover:text-red-800 hover:bg-red-50/80" role="menuitem">
                      <div class="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        <span class="font-semibold">Delete Message</span>
                      </div>
                    </button>
                    <button @click="toggleThread(msg)" class="menu-item text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50/80" role="menuitem">
                      <div class="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <span class="font-semibold">Reply in Thread</span>
                      </div>
                    </button>
                    <button @click="pinMessage(msg)" class="menu-item text-amber-600 hover:text-amber-800 hover:bg-amber-50/80" role="menuitem">
                      <div class="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                        </svg>
                        <span class="font-semibold">Pin Message</span>
                      </div>
                    </button>
                    <button @click="copyToClipboard(msg.text)" class="menu-item text-slate-600 hover:text-slate-800 hover:bg-slate-50/80" role="menuitem">
                      <div class="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        <span class="font-semibold">Copy Text</span>
                      </div>
                    </button>
                    <div class="border-t border-slate-200/50 my-2"></div>
                    <div class="p-3">
                      <div class="text-xs text-slate-500 mb-3 font-bold uppercase tracking-wider">Quick Reactions</div>
                      <div class="flex flex-wrap gap-2">
                        <button v-for="emoji in ['👍', '❤️', '😂', '😮', '😢', '👏']" :key="emoji" 
                                @click="addReaction(msg.id, emoji)" 
                                class="text-xl hover:bg-slate-100/80 rounded-xl p-2 transition-all duration-200 hover:scale-125"
                                :aria-label="`React with ${emoji}`">
                          {{ emoji }}
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Message Metadata -->
                  <div class="text-sm text-slate-400 mt-2 text-right flex items-center justify-end gap-3">
                    <span class="font-medium">{{ formatTimestamp(msg.timestamp) }}</span>
                    <span v-if="msg.edited" class="italic text-slate-400 bg-slate-100/50 px-2 py-1 rounded-lg text-xs">(edited)</span>
                    <span v-if="chatSettings.readReceipts && msg.readBy && msg.readBy[user?.uid] && msg.userId === user?.uid" class="text-emerald-500" aria-label="Message read">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                  </div>
                  
                  <!-- Threaded Replies -->
                  <div v-if="msg.showThread" class="mt-4 md:mt-6 ml-4 md:ml-8 border-l-4 border-emerald-300/50 pl-4 md:pl-6 bg-gradient-to-r from-slate-50/50 to-white/30 rounded-r-2xl p-4 md:p-6 backdrop-blur-sm">
                    <div v-for="reply in msg.replies" :key="reply.id" class="mb-4">
                      <div class="text-sm text-slate-500 font-semibold mb-2">{{ reply.username }}</div>
                      <div class="bg-white/90 backdrop-blur-sm rounded-2xl px-4 py-3 md:px-6 md:py-4 text-sm md:text-base text-slate-800 shadow-lg border border-slate-200/50">
                        {{ reply.text }}
                      </div>
                      <div class="text-xs text-slate-400 mt-2 font-medium">{{ formatTimestamp(reply.timestamp) }}</div>
                    </div>
                    <div class="mt-6 flex gap-3">
                      <input 
                        v-model="msg.newReply" 
                        type="text" 
                        placeholder="Write a reply..." 
                        class="flex-1 px-4 py-3 md:px-6 md:py-4 border border-slate-300/50 rounded-2xl text-sm md:text-base focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white/80 backdrop-blur-sm"
                        @keyup.enter="addReply(msg)"
                        aria-label="Reply to thread"
                      />
                      <button 
                        @click="addReply(msg)" 
                        class="px-6 py-3 md:px-8 md:py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl text-sm md:text-base font-semibold hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 shadow-lg"
                        aria-label="Send reply"
                      >
                        Reply
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Typing Indicators -->
            <div v-if="typingUsers.length > 0" class="mt-6">
              <div v-for="user in typingUsers" :key="user.id" class="flex items-center mb-4">
                <div class="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-gradient-to-br from-slate-400 to-slate-600 text-white flex items-center justify-center text-sm md:text-base font-bold mr-3 md:mr-4 flex-shrink-0 shadow-lg" :aria-label="`${user.name} avatar`">
                  {{ user.initials }}
                </div>
                <div class="bg-white/90 backdrop-blur-sm border border-slate-200/50 rounded-3xl px-4 py-3 md:px-6 md:py-4 inline-flex items-center shadow-lg">
                  <div class="flex gap-1 mr-3 md:mr-4" aria-hidden="true">
                    <div class="typing-dot-enhanced"></div>
                    <div class="typing-dot-enhanced"></div>
                    <div class="typing-dot-enhanced"></div>
                  </div>
                  <span class="text-sm md:text-base text-slate-500 font-semibold">{{ user.name }} is typing...</span>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Message Input -->
          <div class="message-input-container">
            <div class="flex flex-col gap-4">
              <!-- File Preview -->
              <div v-if="fileToSend" class="bg-gradient-to-r from-slate-50/80 to-white/60 border border-slate-200/50 rounded-2xl p-4 md:p-5 flex items-center justify-between backdrop-blur-sm shadow-sm">
                <div class="flex items-center">
                  <div class="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center mr-4 shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <span class="text-base font-semibold text-slate-700 truncate max-w-[200px] md:max-w-[300px]">
                    {{ getFileName(fileToSend) }}
                  </span>
                </div>
                <button @click="fileToSend = null" class="text-slate-500 hover:text-slate-700 p-2 rounded-xl hover:bg-slate-200/50 transition-all duration-200" aria-label="Remove file">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div class="flex flex-col sm:flex-row gap-3 md:gap-4">
                <div class="relative flex-1">
                  <textarea 
                    ref="messageInput"
                    v-model="newMessage"
                    @keyup.enter.exact="editingMessage ? saveEditedMessage() : sendMessage()" 
                    @input="handleTyping"
                    @focus="handleFocus"
                    placeholder="Type your message..." 
                    class="w-full pl-4 pr-16 py-3 md:pl-6 md:pr-20 md:py-4 border border-slate-300/50 rounded-2xl text-base md:text-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none bg-white/80 backdrop-blur-sm transition-all duration-200"
                    :class="{ 'min-h-[120px]': isMultiline, 'min-h-[56px]': !isMultiline }"
                    aria-label="Type your message"
                  ></textarea>
                  <div class="absolute right-3 md:right-4 bottom-3 md:bottom-4 flex gap-2">
                    <button 
                      @click="showEmojiPicker = !showEmojiPicker"
                      class="text-slate-500 hover:text-slate-700 p-2 rounded-xl hover:bg-slate-100/50 transition-all duration-200"
                      aria-label="Toggle emoji picker"
                      :aria-expanded="showEmojiPicker"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </button>
                  </div>
                  
                  <!-- Emoji Picker -->
                  <div v-if="showEmojiPicker" class="emoji-picker" role="dialog" aria-label="Emoji picker">
                    <div class="text-sm md:text-base font-bold text-slate-700 mb-3 md:mb-4">Choose an emoji</div>
                    <div class="grid grid-cols-6 md:grid-cols-8 gap-2 md:gap-3 max-h-48 md:max-h-56 overflow-y-auto">
                      <button 
                        v-for="emoji in commonEmojis" 
                        :key="emoji" 
                        @click="addEmojiToMessage(emoji)"
                        class="text-xl md:text-2xl p-2 md:p-3 hover:bg-slate-100/80 rounded-xl transition-all duration-200 hover:scale-125"
                        :aria-label="`Insert ${emoji} emoji`"
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
                  aria-label="Upload file"
                />
                <button 
                  @click="triggerFileInput"
                  class="px-4 py-3 md:px-5 md:py-4 bg-slate-100/80 text-slate-600 rounded-2xl hover:bg-slate-200/80 transition-all duration-200 shadow-sm backdrop-blur-sm hover:scale-105"
                  aria-label="Upload file"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                </button>
                <button 
                  @click="sendMessage" 
                  :disabled="!newMessage.trim() && !fileToSend"
                  class="px-6 py-3 md:px-8 md:py-4 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 text-white rounded-2xl hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg font-semibold hover:scale-105 disabled:hover:scale-100"
                  aria-label="Send message"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- Edit Message Modal -->
    <div 
      v-if="editingMessage" 
      class="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-4"
      @click.self="cancelEditing"
      role="dialog"
      aria-labelledby="edit-modal-title"
      aria-modal="true"
    >
      <div class="bg-white/95 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-6 md:p-8 w-full max-w-lg">
        <h3 id="edit-modal-title" class="text-2xl font-bold text-slate-800 mb-6">Edit Message</h3>
        <textarea
          ref="editMessageInput"
          v-model="editedMessageText"
          class="border border-slate-300/50 rounded-2xl px-4 py-3 md:px-6 md:py-4 text-base w-full min-h-[120px] md:min-h-[140px] focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none bg-white/80 backdrop-blur-sm"
          placeholder="Edit your message…"
          aria-label="Edit message text"
        ></textarea>
        <div class="flex justify-end mt-6 gap-4">
          <button 
            @click="cancelEditing()" 
            class="px-6 py-3 bg-slate-100/80 text-slate-700 rounded-2xl text-base font-semibold hover:bg-slate-200/80 transition-all duration-200 backdrop-blur-sm"
          >
            Cancel
          </button>
          <button 
            @click="saveEditedMessage()" 
            class="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl text-base font-semibold hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 shadow-lg"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>

    <!-- Quick Reactions Popup -->
    <div 
      v-if="quickReactionsVisible && selectedMessage" 
      id="quick-reactions"
      class="quick-reactions-popup"
      @click.stop
      role="dialog"
      aria-label="Quick reactions"
    >
      <div class="flex flex-col">
        <div class="text-sm md:text-base text-slate-500 mb-3 md:mb-4 font-bold">Quick Reactions</div>
        <div class="flex flex-col sm:flex-row gap-3 md:gap-4">
          <button 
            v-for="emoji in ['👍', '❤️', '😂', '😮', '😢', '👏']" 
            :key="emoji" 
            @click="addReaction(selectedMessage.id, emoji); quickReactionsVisible = false; selectedMessage = null;" 
            class="text-2xl md:text-3xl hover:bg-slate-100/80 rounded-2xl p-3 md:p-4 transition-all duration-200 hover:scale-125 shadow-sm"
            :aria-label="`React with ${emoji}`"
          >
            {{ emoji }}
          </button>
        </div>
      </div>
    </div>

    <!-- Notification Panel -->
    <div 
      v-if="notificationPanelOpen"
      class="notification-panel"
      role="dialog"
      aria-labelledby="notifications-title"
      aria-modal="true"
    >
      <div class="p-4 md:p-6 border-b border-slate-100/50">
        <div class="flex items-center justify-between">
          <h3 id="notifications-title" class="font-bold text-slate-800 text-lg md:text-xl">Notifications</h3>
          <div class="flex gap-3">
            <button 
              @click="markAllNotificationsAsRead"
              class="text-sm text-emerald-600 hover:text-emerald-700 font-semibold px-3 py-1.5 rounded-lg hover:bg-emerald-50/80 transition-all duration-200"
            >
              Mark all read
            </button>
            <button 
              @click="clearAllNotifications"
              class="text-sm text-slate-500 hover:text-slate-700 font-semibold px-3 py-1.5 rounded-lg hover:bg-slate-50/80 transition-all duration-200"
            >
              Clear all
            </button>
          </div>
        </div>
      </div>
      <div class="max-h-96 md:max-h-[28rem] overflow-y-auto">
        <div v-if="notifications.length === 0" class="p-8 md:p-12 text-center text-slate-500">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto mb-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <p class="text-lg font-semibold">No notifications yet</p>
          <p class="text-sm mt-1">You're all caught up!</p>
        </div>
        <div v-for="notification in notifications" :key="notification.id" 
             @click="handleNotificationClick(notification)"
             class="p-4 md:p-5 border-b border-slate-50/50 hover:bg-slate-50/50 cursor-pointer transition-all duration-200"
             :class="{ 'bg-emerald-50/50': !notification.read }"
             tabindex="0"
             @keydown.enter="handleNotificationClick(notification)"
        >
          <div class="flex items-start gap-3 md:gap-4">
            <div class="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center shadow-sm"
                 :class="getNotificationTypeClass(notification.type)"
            >
              <svg v-if="notification.type === 'message'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <svg v-else-if="notification.type === 'mention'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm md:text-base font-semibold text-slate-800 truncate">{{ notification.title }}</p>
              <p class="text-sm md:text-base text-slate-600 mt-1 leading-relaxed">{{ notification.message }}</p>
              <p class="text-xs md:text-sm text-slate-400 mt-2 font-medium">{{ formatTimestamp(notification.timestamp) }}</p>
            </div>
            <div v-if="!notification.read" class="w-3 h-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex-shrink-0 shadow-sm" aria-label="Unread notification"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Image Lightbox -->
    <div v-if="lightboxImage" class="fixed inset-0 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 z-50" @click="lightboxImage = null" role="dialog" aria-label="Image lightbox">
      <div class="relative max-w-6xl w-full">
        <button @click.stop="lightboxImage = null" class="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-white hover:bg-white/40 transition-all duration-200 shadow-lg" aria-label="Close lightbox">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <img :src="lightboxImage" class="max-h-[85vh] max-w-full mx-auto object-contain rounded-2xl shadow-2xl" alt="Enlarged image" />
      </div>
    </div>

    <!-- Toast Notification -->
    <div 
      v-if="toast.show" 
      class="toast-notification"
      :class="{
        'bg-emerald-50/95 text-emerald-800 border-emerald-200/50': toast.type === 'success',
        'bg-red-50/95 text-red-800 border-red-200/50': toast.type === 'error',
        'bg-blue-50/95 text-blue-800 border-blue-200/50': toast.type === 'info',
        'bg-slate-50/95 text-slate-800 border-slate-200/50': toast.type === 'loading'
      }"
      role="alert"
      aria-live="polite"
    >
      <div class="flex items-center">
        <div v-if="toast.type === 'loading'" class="spinner-enhanced mr-4" aria-hidden="true">
          <div></div><div></div><div></div><div></div><div></div><div></div>
        </div>
        <svg 
          v-else-if="toast.type === 'success'" 
          class="h-6 w-6 mr-4 flex-shrink-0" 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 20 20" 
          fill="currentColor"
          aria-hidden="true"
        >
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
        </svg>
        <svg 
          v-else-if="toast.type === 'error'" 
          class="h-6 w-6 mr-4 flex-shrink-0" 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 20 20" 
          fill="currentColor"
          aria-hidden="true"
        >
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
        </svg>
        <svg 
          v-else-if="toast.type === 'info'" 
          class="h-6 w-6 mr-4 flex-shrink-0" 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 20 20" 
          fill="currentColor"
          aria-hidden="true"
        >
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
        </svg>
        <span class="font-semibold text-sm md:text-base">{{ toast.message }}</span>
      </div>
    </div>

    <!-- Browser Notification Permission Request -->
    <div v-if="showNotificationPermissionRequest" class="notification-permission-request">
      <div class="flex items-start">
        <div class="w-14 h-14 md:w-16 md:h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mr-4 md:mr-6 flex-shrink-0 shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 md:h-8 md:w-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </div>
        <div>
          <h3 class="font-bold text-slate-800 mb-3 text-lg md:text-xl">Enable Notifications</h3>
          <p class="text-sm md:text-base text-slate-600 mb-4 md:mb-6 leading-relaxed">
            Stay updated with messages, mentions, and reactions by enabling browser notifications.
          </p>
          <div class="flex flex-col sm:flex-row gap-3 md:gap-4">
            <button @click="requestNotificationPermission" class="px-5 py-3 md:px-6 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-sm md:text-base font-semibold rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 shadow-lg">
              Enable
            </button>
            <button @click="dismissPermissionRequest" class="px-5 py-3 md:px-6 bg-slate-100/80 text-slate-700 text-sm md:text-base font-semibold rounded-xl hover:bg-slate-200/80 transition-all duration-200 backdrop-blur-sm">
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
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot, endBefore, limit, getDocs, doc, updateDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { debounce } from 'lodash';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";

// Reactive state
const showMobileSearch = ref(false);
const isMobile = ref(false);
const role = ref("user");
const username = ref("");
const notificationCount = ref(5);
const showChatInfo = ref(false);
const collapsePinned = ref(false);
const lightboxImage = ref(null);
const showEmojiPicker = ref(false);
const isMultiline = ref(false);
const profileImageUrl = ref("");
const toast = ref({ show: false, message: '', type: 'success' });

// Notification state
const notificationPanelOpen = ref(false);
const notifications = ref([]);
const hasUnreadNotifications = ref(false);
const showNotificationPermissionRequest = ref(false);
const notificationPermission = ref(null);

watch(notifications, (newNotifications) => {
  hasUnreadNotifications.value = newNotifications.some(n => !n.read);
}, { immediate: true });

// Chat state
const db = getFirestore();
const auth = getAuth();
const user = ref(null);
const messages = ref([]);
const newMessage = ref("");
const editingMessage = ref(null);
const editedMessageText = ref("");
const fileToSend = ref(null);
const typingUsers = ref([]);
const messagesContainer = ref(null);
const messageInput = ref(null);
const editMessageInput = ref(null);
const fileInput = ref(null);
const isTyping = ref(false);
const selectedMessage = ref(null);
const msgOptionsVisible = ref(false);
let holdTimeout = null;
const onlineUsers = ref();
const quickReactionsVisible = ref(false);

// Error handling states
const errorLoadingMessages = ref(false);
const loadingMessages = ref(true);
const reactionUsernames = ref({});

// Chat settings
const chatSettings = ref({
  notifications: true,
  soundEffects: true,
  readReceipts: true
});

// Sample data
const activeUsers = ref([
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

// Search functionality
const searchQuery = ref("");
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

// Pinned messages
const pinnedMessages = ref([]);

// Offline functionality
const isOnline = ref(navigator.onLine);
const queuedMessages = ref([]);

// Mobile functions
const toggleSearch = () => {
  showMobileSearch.value = !showMobileSearch.value;
  if (showMobileSearch.value) {
    nextTick(() => {
      const searchInput = document.querySelector('input[placeholder="Search messages..."]');
      if (searchInput) searchInput.focus();
    });
  }
};

// Toggle notification panel
const toggleNotificationPanel = () => {
  notificationPanelOpen.value = !notificationPanelOpen.value;
  if (notificationPanelOpen.value) {
    markNotificationsAsRead();
  }
};

// Notification functions
const markAllNotificationsAsRead = () => {
  notifications.value = notifications.value.map(n => ({ ...n, read: true }));
  updateNotificationBadge();
};

const clearAllNotifications = () => {
  notifications.value = [];
  updateNotificationBadge();
};

const updateNotificationBadge = () => {
  notificationCount.value = notifications.value.filter(n => !n.read).length;
};

const markNotificationsAsRead = () => {
  notifications.value.forEach(notification => {
    if (!notification.read) {
      notification.read = true;
    }
  });
  updateNotificationBadge();
};

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

const toggleNotifications = (event) => {
  if (event.target.checked) {
    if (window.Notification && Notification.permission !== 'granted') {
      showNotificationPermissionRequest.value = true;
    }
  }
};

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

const dismissPermissionRequest = () => {
  showNotificationPermissionRequest.value = false;
  localStorage.setItem('notificationPermissionDismissed', 'true');
};

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

const addNotification = (notification) => {
  notifications.value.unshift(notification);
  updateNotificationBadge();
  
  if (chatSettings.value.notifications && Notification.permission === 'granted') {
    showBrowserNotification(notification.title, notification.message);
  }
};

// Utility functions
const openUserProfile = (userId) => {
  showToast(`Opening profile for user ID: ${userId}`, 'info');
};

const getInitials = (name) => {
  if (!name) return "U";
  return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
};

const handleClickOutside = (event) => {
  if (showEmojiPicker.value && !event.target.closest('.emoji-picker')) {
    showEmojiPicker.value = false;
  }
  if (notificationPanelOpen.value && !event.target.closest('.notification-panel') && !event.target.closest('.notification-bell')) {
    notificationPanelOpen.value = false;
  }
};

// Message functions
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

const markMessagesAsRead = async (msgs) => {
  if (!user.value?.uid) {
    console.warn("Not authenticated — cannot mark read.");
    return;
  }
  for (const msg of msgs) {
    const uid = user.value.uid;
    const alreadyMarked = msg.readBy && msg.readBy[uid];
    const isNotSender = msg.userId !== uid;
    if (isNotSender && !alreadyMarked) {
      const docRef = doc(db, "messages", msg.id);
      const updatePayload = {
        [`readBy.${uid}`]: {
          timestamp: new Date(),
          name: username.value || user.value.displayName || "Anonymous"
        }
      };
      try {
        await updateDoc(docRef, updatePayload);
      } catch (error) {
        console.error("Error marking message as read:", error);
      }
    }
  }
};

const retryLoadMessages = () => {
  errorLoadingMessages.value = false;
  loadingMessages.value = true;
  setTimeout(() => {
    fetchMessages();
  }, 1000);
};

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
    readBy: {},
    reactions: {}
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

const isGroupedMessage = (message, index) => {
  if (index === 0) return false;
  
  const prevMessage = messages.value[index - 1];
  const timeDiff = message.timestamp.seconds - prevMessage.timestamp.seconds;
  
  return message.userId === prevMessage.userId && timeDiff < 120;
};

const handleTyping = debounce(() => {
  isTyping.value = true;
  isMultiline.value = newMessage.value.includes('\n') || newMessage.value.length > 100;
  
  setTimeout(() => {
    isTyping.value = false;
  }, 3000);
}, 300);

const handleFocus = () => {
  simulateTypingUsers();
};

const checkIfMobile = () => {
  isMobile.value = window.innerWidth < 768;
};

const handleResize = () => {
  checkIfMobile();
};

// Enhanced functions
const exportChat = () => {
  const chatData = messages.value.map(msg => ({
    username: msg.username,
    text: msg.text,
    timestamp: formatTimestamp(msg.timestamp)
  }));
  
  const dataStr = JSON.stringify(chatData, null, 2);
  const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
  
  const exportFileDefaultName = `chat-export-${new Date().toISOString().split('T')[0]}.json`;
  
  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
  
  showToast('Chat exported successfully!', 'success');
};

const clearChat = () => {
  if (confirm('Are you sure you want to clear all messages? This action cannot be undone.')) {
    messages.value = [];
    showToast('Chat cleared', 'info');
  }
};

// Message editing
const startEditingMessage = (msg) => {
  editingMessage.value = { ...msg };
  editedMessageText.value = msg.text;
  msgOptionsVisible.value = false;
  nextTick(() => {
    if (editMessageInput.value) {
      editMessageInput.value.focus();
    }
  });
};

const saveEditedMessage = async () => {
  if (!editingMessage.value) return;
  const msg = messages.value.find(m => m.id === editingMessage.value.id);
  if (!msg || msg.userId !== user.value?.uid) {
    showToast("You are not allowed to edit this message", "error");
    return;
  }
  try {
    const docRef = doc(db, "messages", editingMessage.value.id);
    await updateDoc(docRef, {
      text: editedMessageText.value,
      edited: true
    });
    
    editingMessage.value = null;
    editedMessageText.value = "";
    msgOptionsVisible.value = false;
    selectedMessage.value = null;
    showToast("Message updated successfully", "success");
  } catch (error) {
    console.error("Error updating message:", error);
    showToast("Failed to update message", "error");
  }
};

const cancelEditing = () => {
  editingMessage.value = null;
  editedMessageText.value = "";
  msgOptionsVisible.value = false;
  selectedMessage.value = null;
};

const deleteMessage = async (messageId) => {
  const msg = messages.value.find(m => m.id === messageId);
  if (!msg || msg.userId !== user.value?.uid) {
    showToast("You are not allowed to delete this message", "error");
    return;
  }
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

// File handling
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

const triggerFileInput = () => {
  if (fileInput.value) {
    fileInput.value.click();
  }
};

// Message options
const showMessageOptions = (msg, event) => {
  selectedMessage.value = msg;
  msgOptionsVisible.value = true;
  event.stopPropagation();
};

const startHold = (msg) => {
  holdTimeout = setTimeout(() => {
    selectedMessage.value = msg;
    msgOptionsVisible.value = true;
  }, 500);
};

const clearHold = () => {
  clearTimeout(holdTimeout);
};

const hideMessageOptions = (event) => {
  if (
    (msgOptionsVisible.value || quickReactionsVisible.value) &&
    !event.target.closest('.message-options-menu') && 
    !event.target.closest('.quick-reactions-popup')
  ) {
    msgOptionsVisible.value = false;
    quickReactionsVisible.value = false;
    selectedMessage.value = null;
  }
};

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

// Reactions
const addReaction = async (messageId, emoji) => {
  const msg = messages.value.find(m => m.id === messageId);
  if (!msg) return;
  try {
    const docRef = doc(db, "messages", messageId);
    if (!msg.reactions) msg.reactions = {};
    if (!msg.reactions[emoji]) {
      msg.reactions[emoji] = 1;
    } else {
      msg.reactions[emoji] += 1;
    }
    await updateDoc(docRef, { [`reactions.${emoji}`]: msg.reactions[emoji] });
    msgOptionsVisible.value = false;
    selectedMessage.value = null;
    showToast("Reaction added", "success");
  } catch (error) {
    console.error("Error adding reaction:", error);
    showToast("Failed to add reaction", "error");
  }
};

const addEmojiToMessage = (emoji) => {
  const textarea = messageInput.value;
  if (!textarea) {
    console.warn("Message input ref is missing.");
    return;
  }
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  newMessage.value = 
    newMessage.value.slice(0, start) + 
    emoji + 
    newMessage.value.slice(end);
  nextTick(() => {
    textarea.focus();
    textarea.selectionStart = textarea.selectionEnd = start + emoji.length;
  });
  showEmojiPicker.value = false;
};

// Pin message
const pinMessage = (msg) => {
  if (!pinnedMessages.value.find(pinned => pinned.id === msg.id)) {
    pinnedMessages.value.push(msg);
    showToast(`Message pinned successfully!`, 'success');
  }
  msgOptionsVisible.value = false;
  selectedMessage.value = null;
};

const unpinMessage = (messageId) => {
  pinnedMessages.value = pinnedMessages.value.filter(msg => msg.id !== messageId);
  showToast(`Message unpinned`, 'info');
};

// Typing simulation
const simulateTypingUsers = () => {
  typingUsers.value = [];
  setTimeout(() => {
    typingUsers.value = [];
  }, 3000);
};

// Thread functionality
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

// File type helpers
const isImageFile = (fileUrl) => {
  return /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(fileUrl);
};

const isPdfFile = (fileUrl) => {
  return /\.pdf$/i.test(fileUrl);
};

const isVideoFile = (fileUrl) => {
  return /\.(mp4|webm|ogg)$/i.test(fileUrl);
};

const getFileName = (fileUrl) => {
  if (!fileUrl) return "";
  let filename = "";
  try {
    const url = new URL(fileUrl);
    const path = decodeURIComponent(url.pathname);
    filename = path.split('/').pop();
  } catch {
    filename = fileUrl.split('/').pop();
  }
  return filename.replace(/^\d+_/, '');
};

const openLightbox = (imageUrl) => {
  lightboxImage.value = imageUrl;
};

// Offline functionality
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
    showToast('Failed to send some queued messages', 'error');
    
    queuedMessages.value = queued;
    localStorage.setItem("queuedMessages", JSON.stringify(queuedMessages.value));
  }
};

const handleOnlineStatus = () => {
  isOnline.value = navigator.onLine;
  if (isOnline.value) {
    sendQueuedMessages();
  }
};

// Utility functions
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

const downloadFile = (fileUrl) => {
  const link = document.createElement('a');
  link.href = fileUrl;
  link.download = getFileName(fileUrl);
  link.click();
};

// Lifecycle hooks
let unsubscribeMessages = null;

onMounted(async () => {
  checkIfMobile();
  window.addEventListener('resize', handleResize);
  document.addEventListener('click', handleClickOutside);
  window.addEventListener("online", handleOnlineStatus);
  window.addEventListener("offline", handleOnlineStatus);
  
  isOnline.value = navigator.onLine;
  
  const queued = localStorage.getItem("queuedMessages");
  if (queued) {
    queuedMessages.value = JSON.parse(queued);
  }
  
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
      },
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

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
  document.removeEventListener('click', handleClickOutside);
  window.removeEventListener("online", handleOnlineStatus);
  window.removeEventListener("offline", handleOnlineStatus);
  if (unsubscribeMessages) {
    unsubscribeMessages();
  }
});
</script>

<style scoped>
/* Enhanced Spinner Animation */
.spinner-enhanced {
  width: 32px;
  height: 32px;
  animation: spinner-rotation 1.5s infinite ease;
  transform-style: preserve-3d;
}

.spinner-enhanced > div {
  background-color: rgba(16, 185, 129, 0.3);
  height: 100%;
  position: absolute;
  width: 100%;
  border: 2px solid #10b981;
}

.spinner-enhanced div:nth-of-type(1) {
  transform: translateZ(-16px) rotateY(180deg);
}

.spinner-enhanced div:nth-of-type(2) {
  transform: rotateY(-270deg) translateX(50%);
  transform-origin: top right;
}

.spinner-enhanced div:nth-of-type(3) {
  transform: rotateY(270deg) translateX(-50%);
  transform-origin: center left;
}

.spinner-enhanced div:nth-of-type(4) {
  transform: rotateX(90deg) translateY(-50%);
  transform-origin: top center;
}

.spinner-enhanced div:nth-of-type(5) {
  transform: rotateX(-90deg) translateY(50%);
  transform-origin: bottom center;
}

.spinner-enhanced div:nth-of-type(6) {
  transform: translateZ(16px);
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

/* Enhanced typing indicator */
.typing-dot-enhanced {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: linear-gradient(45deg, #10b981, #14b8a6);
  margin: 0 2px;
  animation: typing-enhanced 1.6s infinite ease-in-out both;
  box-shadow: 0 2px 4px rgba(16, 185, 129, 0.3);
}

.typing-dot-enhanced:nth-child(1) {
  animation-delay: 0s;
}

.typing-dot-enhanced:nth-child(2) {
  animation-delay: 0.3s;
}

.typing-dot-enhanced:nth-child(3) {
  animation-delay: 0.6s;
}

@keyframes typing-enhanced {
  0%, 80%, 100% {
    transform: scale(0.7) translateY(0);
    opacity: 0.5;
  }
  40% {
    transform: scale(1.1) translateY(-8px);
    opacity: 1;
  }
}

/* Toggle switch styling */
.toggle-switch {
  width: 56px;
  height: 32px;
  background-color: #e2e8f0;
  border-radius: 16px;
  position: relative;
  transition: all 0.3s ease;
}

.toggle-switch::after {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: 28px;
  height: 28px;
  background-color: white;
  border-radius: 50%;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.peer:checked + .toggle-switch {
  background: linear-gradient(45deg, #10b981, #14b8a6);
}

.peer:checked + .toggle-switch::after {
  transform: translateX(24px);
}

.peer:focus + .toggle-switch {
  outline: 2px solid #10b981;
  outline-offset: 2px;
}

/* Chat container improvements */
.chat-container {
  position: relative;
}

.chat-info-sidebar {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 100%;
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(24px);
  border-left: 1px solid rgba(148, 163, 184, 0.5);
  z-index: 20;
  overflow-y: auto;
  transform: translateX(0);
  transition: all 0.3s ease;
}

@media (min-width: 768px) {
  .chat-info-sidebar {
    width: 20rem;
  }
}

.messages-container {
  position: relative;
}

.message-item {
  position: relative;
}

.message-bubble {
  position: relative;
}

.message-options-menu {
  position: absolute;
  top: 0;
  right: 0;
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(24px);
  border: 1px solid rgba(148, 163, 184, 0.5);
  border-radius: 1rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  z-index: 10;
  min-width: 180px;
}

@media (min-width: 768px) {
  .message-options-menu {
    min-width: 200px;
  }
}

.menu-item {
  font-size: 0.875rem;
  color: rgb(51, 65, 85);
  padding: 0.75rem;
  border-radius: 0.75rem;
  transition: all 0.2s ease;
  text-align: left;
  background: none;
  border: none;
  cursor: pointer;
  width: 100%;
}

.menu-item:hover {
  color: rgb(15, 23, 42);
  background-color: rgba(248, 250, 252, 0.8);
}

@media (min-width: 768px) {
  .menu-item {
    font-size: 1rem;
    padding: 1rem;
  }
}

.message-input-container {
  padding: 1rem;
  border-top: 1px solid rgba(241, 245, 249, 0.5);
  background-color: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(4px);
}

@media (min-width: 768px) {
  .message-input-container {
    padding: 1.5rem;
  }
}

.emoji-picker {
  position: absolute;
  bottom: 4rem;
  right: 0;
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(24px);
  border: 1px solid rgba(148, 163, 184, 0.5);
  border-radius: 1rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  padding: 1rem;
  z-index: 10;
}

@media (min-width: 768px) {
  .emoji-picker {
    bottom: 5rem;
    padding: 1.5rem;
  }
}

.quick-reactions-popup {
  position: fixed;
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(24px);
  border-radius: 1rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  padding: 1rem;
  z-index: 50;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

@media (min-width: 768px) {
  .quick-reactions-popup {
    padding: 1.5rem;
  }
}

.notification-panel {
  position: fixed;
  right: 0.5rem;
  top: 4rem;
  width: calc(100vw - 1rem);
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(24px);
  border-radius: 1rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.2);
  z-index: 50;
}

@media (min-width: 768px) {
  .notification-panel {
    right: 1rem;
    top: 6rem;
    width: 24rem;
  }
}

.toast-notification {
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  padding: 1rem 1.5rem;
  border-radius: 1rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  z-index: 50;
  display: flex;
  align-items: center;
  max-width: 24rem;
  border: 1px solid;
  backdrop-filter: blur(24px);
}

@media (min-width: 768px) {
  .toast-notification {
    bottom: 1.5rem;
    right: 1.5rem;
    padding: 1.25rem 2rem;
    max-width: 28rem;
  }
}

.notification-permission-request {
  position: fixed;
  bottom: 1rem;
  left: 1rem;
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 1rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  padding: 1.5rem;
  width: calc(100vw - 2rem);
  z-index: 50;
}

@media (min-width: 768px) {
  .notification-permission-request {
    bottom: 1.5rem;
    left: 1.5rem;
    padding: 2rem;
    width: 24rem;
  }
}
</style>
