<template>
  <div class="relative bg-gradient-to-r from-emerald-700 to-green-600 -mt-16 mb-4 rounded-lg shadow-md">
    
    <div class="relative flex flex-col md:flex-row md:items-center gap-6 p-6">
      <!-- Profile Image -->
      <div class="flex-shrink-0">
        <div class="relative">
          <div class="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-white">
            <img
              v-if="profileImageUrl"
              :src="profileImageUrl"
              :alt="`${username}'s profile picture`"
              class="w-full h-full object-cover"
              @error="handleImageError"
            />
            <div v-else class="w-full h-full bg-emerald-600 flex items-center justify-center text-white text-3xl font-bold">
              {{ getInitials(username) }}
            </div>
          </div>
          <div class="absolute -bottom-2 -right-2 px-3 py-1 bg-green-100 text-green-800 border border-green-200 rounded-full text-xs font-medium shadow-sm">
            {{ status }}
          </div>
        </div>
      </div>

      <!-- Profile Info -->
      <div class="flex-1">
        <h2 class="text-3xl font-bold text-white mb-2">{{ username || 'Not available' }}</h2>
        <div class="flex flex-wrap items-center gap-x-4 gap-y-2 text-green-100">
          <div class="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span>{{ email || 'Email not provided' }}</span>
          </div>
          <div v-if="cellphone" class="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span>{{ cellphone }}</span>
          </div>
          <div class="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span class="capitalize">{{ role }}</span>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-wrap gap-4 mt-4 md:mt-0">
        <router-link
  :to="editProfilePath"
  class="inline-flex items-center gap-2 px-4 py-2 bg-white text-emerald-700 rounded-md hover:bg-gray-100 transition-colors shadow-sm hover:shadow-md"
>
  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
  Edit Profile
</router-link>

<router-link
  :to="resetPasswordPath"
  class="inline-flex items-center gap-2 px-4 py-2 bg-white text-emerald-700 border border-emerald-200 rounded-md hover:bg-emerald-50 transition-colors shadow-sm hover:shadow"
>
  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
      d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
  </svg>
  Change Password
</router-link>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { getAuth } from 'firebase/auth'
import { getFirestore, doc, getDoc } from 'firebase/firestore'

const props = defineProps({
  username: String,
  email: String,
  cellphone: String,
  role: String,
  profileImageUrl: String,
  status: String
});

const getInitials = (name) => {
  if (!name) return 'U';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
};

const handleImageError = (e) => {
  e.target.style.display = 'none';
  e.target.parentNode.classList.add('bg-emerald-600');
  e.target.parentNode.textContent = getInitials(props.username);
};

const userRole = ref(null)
const editProfilePath = computed(() => {
  return userRole.value ? `/${userRole.value}/settings/edit-profile` : '#'
})
const resetPasswordPath = computed(() => {
  return userRole.value ? `/${userRole.value}/settings/reset-password` : '#'
})

onMounted(async () => {
  const auth = getAuth()
  const db = getFirestore()
  const user = auth.currentUser

  if (user) {
    const docSnap = await getDoc(doc(db, 'users', user.uid))
    if (docSnap.exists()) {
      userRole.value = docSnap.data().role || 'user'
    } else {
      userRole.value = 'user' // fallback
    }
  }
})
</script>
