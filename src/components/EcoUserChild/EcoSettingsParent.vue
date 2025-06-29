<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
    <div class="max-w-7xl mx-auto w-full flex flex-col flex-1 p-4 lg:p-6">
      <!-- Main Content Container -->
      <div class="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex-1 flex flex-col">
        
        <!-- Tab Navigation -->
        <nav class="border-b border-slate-200 bg-slate-50/50" role="tablist" aria-label="Settings navigation">
          <div class="flex flex-wrap sm:flex-nowrap justify-start sm:justify-normal overflow-x-auto scrollbar-hide gap-2 px-2 py-2">
            <button
              v-for="tab in tabs"
              :key="tab.name"
              :disabled="!userRole"
              :class="[ 
                'flex items-center gap-2 px-3 py-2 text-[clamp(0.75rem,2.5vw,1rem)] font-medium rounded-md whitespace-nowrap',
                'hover:bg-white/80 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-inset focus:z-10',
                'border-b-2 transition-colors flex-shrink-0',
                route.name === tab.name
                  ? 'text-emerald-600 bg-white border-emerald-500 shadow-sm'
                  : 'text-slate-600 hover:text-slate-800 border-transparent hover:border-slate-200'
              ]"
              @click="router.push(tab.path)"
              :aria-selected="route.name === tab.name"
              :aria-controls="`panel-${tab.name}`"
              role="tab"
              :tabindex="route.name === tab.name ? 0 : -1"
            >
              <div
                :class="[ 
                  'w-2 h-2 rounded-full transition-all duration-200',
                  route.name === tab.name ? 'bg-emerald-500 scale-110' : 'bg-slate-300'
                ]"
              ></div>
              <span class="truncate">{{ tab.label }}</span>
            </button>
          </div>
        </nav>

        <!-- Tab Header -->
        <div class="px-4 sm:px-6 py-4 border-b border-slate-100 bg-slate-50/30">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-lg sm:text-xl font-semibold text-slate-800">{{ currentTab?.label }}</h2>
              <p class="text-sm text-slate-600 mt-1">{{ currentTab?.description }}</p>
            </div>
            <div class="w-10 sm:w-12 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"></div>
          </div>
        </div>

        <!-- Dynamic Tab Content -->
        <div class="relative flex-1 flex flex-col overflow-hidden">
          <router-view v-slot="{ Component }">
            <Transition name="fade-tab" mode="out-in" appear>
              <div class="w-full h-full flex flex-col">
                <component :is="Component" />
              </div>
            </Transition>
          </router-view>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
import { useRoute, useRouter} from 'vue-router';
import { computed, ref, onMounted } from 'vue'
import { getAuth } from 'firebase/auth'
import { getFirestore, doc, getDoc } from 'firebase/firestore'

const route = useRoute();
const router = useRouter();
const userRole = ref('') // will be 'admin' or 'user'

const tabs = computed(() => {
  const basePath = `/${userRole.value}/settings`

  return [
    {
      name: 'EcoProfilePage',
      label: 'Profile Overview',
      path: `${basePath}/profile-display`
    },
    {
      name: 'SampleEditProfile',
      label: 'Edit Profile',
      path: `${basePath}/edit-profile`
    },
    {
      name: 'SampleResetPassword',
      label: 'Reset Password',
      path: `${basePath}/reset-password`
    }
  ]
})


const currentTab = computed(() => {
  return tabs.value.find(tab => tab.name === route.name)
})


onMounted(async () => {
  const auth = getAuth()
  const db = getFirestore()
  const user = auth.currentUser

  if (user) {
    const docSnap = await getDoc(doc(db, 'users', user.uid))
    userRole.value = docSnap.exists() ? docSnap.data().role || 'user' : 'user'
  }
})
</script>

<style scoped>
/* Hide scrollbar for tab navigation */
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

/* Improve button interaction */
button {
  -webkit-tap-highlight-color: transparent;
  user-select: none;
  touch-action: manipulation;
}

/* Accessible focus state */
button:focus-visible {
  outline: 2px solid #10b981;
  outline-offset: 2px;
}

/* Smooth transitions for all interactive UI elements */
* {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Responsive touch targets for tabs */
@media (max-width: 640px) {
  button[role="tab"] {
    min-height: 48px; /* WCAG recommended */
    padding-left: 1rem;
    padding-right: 1rem;
  }
}

/* Add spacing and ensure tabs resize dynamically */
@media (max-width: 640px) {
  .space-x-2 > :not([hidden]) ~ :not([hidden]) {
    margin-left: 0.5rem; /* 8px spacing */
  }
  button[role="tab"] {
    flex: 1; /* Allow tabs to resize dynamically */
    min-width: 0; /* Prevent fixed width */
  }
}

/* Ensure text size adjusts dynamically for better visibility */
@media (max-width: 640px) {
  button[role="tab"] .truncate {
    font-size: clamp(0.875rem, 2.5vw, 1rem); /* Dynamically adjust font size */
  }
}

/* Spinner animation */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
.animate-spin {
  animation: spin 1s linear infinite;
}

/* Dynamic component flex layout */
:deep(.child-component) {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
}

/* Scrollbar styling for content */
.overflow-auto {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 transparent;
}
.overflow-auto::-webkit-scrollbar {
  width: 6px;
}
.overflow-auto::-webkit-scrollbar-track {
  background: transparent;
}
.overflow-auto::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
  border-radius: 3px;
}
.overflow-auto::-webkit-scrollbar-thumb:hover {
  background-color: #94a3b8;
}

/* Component transition animation */
.fade-tab-enter-active,
.fade-tab-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-tab-enter-from,
.fade-tab-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>
