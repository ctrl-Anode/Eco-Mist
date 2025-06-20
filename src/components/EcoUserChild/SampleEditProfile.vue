<template>
      <!-- Main Content -->
      <main class="relative bg-gradient-to-r from-emerald-700 to-green-600 -mt-5 mb-4 rounded-lg shadow-md">

        <!-- Edit Profile Content -->
        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
          <!-- Profile Header/Banner -->
          <div class="h-40 bg-gradient-to-r from-emerald-700 to-green-600 relative">
            <div class="absolute inset-0 bg-pattern opacity-10"></div>
            <div class="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white to-transparent"></div>
          </div>

          <!-- Profile Edit Form -->
          <div class="px-6 pt-0 pb-6 relative">
            <div class="flex flex-col md:flex-row md:items-end gap-6 -mt-20 mb-8">
              <!-- Profile Image -->
              <div class="flex flex-col items-center">
                <div class="relative">
                  <div class="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-white">
                    <img 
                      :src="previewUrl || profileImageUrl || defaultProfilePic" 
                      alt="Profile Picture" 
                      class="w-full h-full object-cover"
                      @error="handleImageError"
                    />
                    <div 
                      class="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer rounded-full" 
                      @click="triggerFileInput"
                      role="button" 
                      aria-label="Change Profile Picture"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>
                      </svg>
                      <span class="text-white text-xs mt-1">Change Photo</span>
                    </div>
                  </div>
                </div>
                <input 
                  type="file" 
                  ref="fileInput"
                  @change="handleFileUpload" 
                  accept="image/*"
                  class="hidden"
                />
                <button 
                  v-if="previewUrl" 
                  @click="resetPreview" 
                  class="mt-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Reset Preview
                </button>
                <button 
                  v-if="selectedFile"
                  @click="updateProfileImage" 
                  :disabled="isLoading"
                  class="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors flex items-center gap-2"
                >
                  <span v-if="!isLoading">Upload New Picture</span>
                  <div v-else class="spinner spinner-sm"></div>
                </button>
                <p v-if="uploadError" class="mt-2 text-red-500 text-sm flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {{ uploadError }}
                </p>
              </div>
              
              <!-- Profile Picture Instructions -->
              <div class="flex-1 md:pb-4">
                <h2 class="text-xl font-bold text-gray-800 mb-2">Update Your Profile Picture</h2>
                <p class="text-gray-600 mb-4">Upload a clear photo of yourself. This helps others recognize you.</p>
                <ul class="text-gray-600 text-sm">
                  <li class="flex items-center gap-2 mb-1">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Use a clear, front-facing photo
                  </li>
                  <li class="flex items-center gap-2 mb-1">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Maximum file size: 5MB
                  </li>
                  <li class="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Supported formats: JPG, PNG, GIF
                  </li>
                </ul>
              </div>
            </div>

            <!-- Success/Error Messages -->
            <div v-if="successMessage" class="mb-6 bg-green-100 border-l-4 border-green-500 text-green-800 px-4 py-3 rounded-lg flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {{ successMessage }}
            </div>
            <div v-if="errorMessage" class="mb-6 bg-red-100 border-l-4 border-red-500 text-red-800 px-4 py-3 rounded-lg flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {{ errorMessage }}
            </div>

            <!-- Form -->
            <div class="border-t border-gray-200 pt-6">
              <h2 class="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Personal Information
              </h2>
              <form @submit.prevent="updateProfileInfo">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div class="form-group">
                    <label for="completeName" class="block text-sm font-medium text-gray-700 mb-1">Complete Name</label>
                    <input 
                      type="text" 
                      id="completeName"
                      v-model="completeName" 
                      class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                      required
                    />
                  </div>
                  <div class="form-group">
                    <label for="birthday" class="block text-sm font-medium text-gray-700 mb-1">Birthday</label>
                    <input 
                      type="date" 
                      id="birthday"
                      v-model="birthday" 
                      class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                      required
                    />
                  </div>
                  <div class="form-group">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Age</label>
                    <p class="text-gray-800">{{ age ?? 'N/A' }}</p>
                  </div>
                  <div class="form-group">
                    <label for="cellphone" class="block text-sm font-medium text-gray-700 mb-1">Cellphone Number</label>
                    <input 
                      type="tel" 
                      id="cellphone"
                      v-model="cellphone" 
                      class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                      required
                    />
                  </div>
                  <div class="form-group">
                    <label for="gender" class="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                    <select 
                      id="gender"
                      v-model="gender" 
                      class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                      required
                    >
                      <option value="" disabled>Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div class="form-group md:col-span-2">
                    <label for="address" class="block text-sm font-medium text-gray-700 mb-1">Complete Address</label>
                    <input 
                      type="text" 
                      id="address"
                      v-model="address" 
                      class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                      required
                    />
                  </div>
                </div>
                <div class="flex flex-col sm:flex-row gap-4 justify-between">
                  <button 
                    type="submit" 
                    class="px-6 py-3 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
                    :disabled="isLoading"
                  >
                    <svg v-if="!isLoading" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                      <polyline points="17 21 17 13 7 13 7 21"/>
                      <polyline points="7 3 7 8 15 8"/>
                    </svg>
                    <div v-else class="spinner spinner-sm"></div>
                    <span>Save Changes</span>
                  </button>
                  <button 
                    type="button"
                    class="px-6 py-3 bg-red-100 text-red-600 border border-red-200 rounded-md hover:bg-red-200 transition-colors flex items-center justify-center gap-2"
                    @click="showDeactivateModal = true"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                      <circle cx="8.5" cy="7" r="4"/>
                      <line x1="18" y1="8" x2="23" y2="13"/>
                      <line x1="23" y1="8" x2="18" y2="13"/>
                    </svg>
                    <span>Deactivate Account</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>

    <!-- Deactivation Modal -->
    <div v-if="showDeactivateModal" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 backdrop-blur-sm bg-black bg-opacity-50" @click="closeModal"></div>
      <div class="bg-white rounded-lg p-6 max-w-sm mx-auto w-full relative z-10 shadow-xl">
        <div class="flex items-center gap-3 text-red-600 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 class="text-lg font-bold">Deactivate Account</h3>
        </div>
        <p class="text-gray-600 mb-6">This action cannot be undone. Choose a method to confirm account deactivation.</p>
        <div v-if="!showCodeInput">
          <button 
            @click="sendVerificationCode"
            class="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center gap-2 mb-4 w-full justify-center"
            :disabled="isLoading"
          >
            <div v-if="isLoading" class="spinner spinner-sm"></div>
            <span>Send Verification Code</span>
          </button>
          <p v-if="emailSentMessage" class="text-green-600 text-sm">{{ emailSentMessage }}</p>
        </div>
        <div v-else>
          <label for="verificationCode" class="block text-sm font-medium text-gray-700 mb-1">Verification Code</label>
          <input 
            type="text" 
            id="verificationCode"
            v-model="verificationCode" 
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors mb-4"
            required
          />
          <button 
            @click="confirmDeactivationWithCode"
            class="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors flex items-center gap-2 w-full justify-center"
            :disabled="isLoading"
          >
            <div v-if="isLoading" class="spinner spinner-sm"></div>
            <span>Confirm Deactivation</span>
          </button>
        </div>
        <div class="mt-6">
          <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Or use your password</label>
          <input 
            type="password" 
            id="password"
            v-model="password" 
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors mb-4"
            required
          />
          <button 
            @click="confirmDeactivation"
            class="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors flex items-center gap-2 w-full justify-center"
            :disabled="isLoading"
          >
            <div v-if="isLoading" class="spinner spinner-sm"></div>
            <span>Confirm Deactivation</span>
          </button>
        </div>
        <p v-if="deactivateError" class="mt-2 text-red-500 text-sm flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {{ deactivateError }}
        </p>
        <button 
          @click="closeModal" 
          class="mt-4 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors w-full"
        >
          Cancel
        </button>
      </div>
    </div>

    <!-- Toast Notification -->
    <div 
      v-if="toast.show" 
      class="fixed bottom-4 right-4 px-4 py-3 rounded-lg shadow-lg z-50 flex items-center"
      :class="{
        'bg-green-100 text-green-800 border-l-4 border-green-500': toast.type === 'success',
        'bg-red-100 text-red-800 border-l-4 border-red-500': toast.type === 'error'
      }"
    >
      <svg 
        v-if="toast.type === 'success'" 
        class="h-5 w-5 mr-2" 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 20 20" 
        fill="currentColor"
      >
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
      </svg>
      <svg 
        v-if="toast.type === 'error'" 
        class="h-5 w-5 mr-2" 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 20 20" 
        fill="currentColor"
      >
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
      </svg>
      <span>{{ toast.message }}</span>
    </div>
</template>
<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getAuth, signOut, onAuthStateChanged, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, getDoc, updateDoc, Timestamp } from "firebase/firestore";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../firebase";

// Router
const router = useRouter();
const route = useRoute();
const auth = getAuth();
const currentRoute = computed(() => route.path);

// State variables
const username = ref("");
const completeName = ref("");
const birthday = ref("");
const cellphone = ref("");
const gender = ref("");
const address = ref("");
const profileImageUrl = ref("");
const role = ref("user");
const lastLogin = ref(new Date());
const sidebarOpen = ref(true);
const userMenuOpen = ref(false);
const isMobile = ref(false);
const userMenuRef = ref(null);
const showLogoutModal = ref(false);
const isLoading = ref(false);
const errorMessage = ref("");
const successMessage = ref("");
const uploadError = ref("");
const showDeactivateModal = ref(false);
const password = ref("");
const deactivateError = ref("");
const showCodeInput = ref(false);
const verificationCode = ref("");
const emailSentMessage = ref("");
const previewUrl = ref("");
const selectedFile = ref(null);
const fileInput = ref(null);
const toast = ref({ show: false, message: '', type: 'success' });

// Default profile picture
const defaultProfilePic = "https://ui-avatars.com/api/?background=10B981&color=fff";


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
    const savedState = localStorage.getItem('sidebarOpen');
    sidebarOpen.value = savedState !== null ? savedState === 'true' : true;
  }
};

const shouldShowRoute = (route) => {
  if (route.meta?.requiresAuth) {
    if (route.meta.role && route.meta.role !== role.value) {
      return false;
    }
  }
  return true;
};

const handleImageError = (e) => {
  e.target.style.display = 'none';
  e.target.parentNode.classList.add('bg-emerald-600');
  const initials = document.createElement('div');
  initials.className = 'flex items-center justify-center h-full w-full text-white text-3xl font-bold';
  initials.textContent = getInitials(username.value);
  e.target.parentNode.appendChild(initials);
};

const showToast = (message, type = 'success') => {
  toast.value = { show: true, message, type };
  setTimeout(() => {
    toast.value.show = false;
  }, 3000);
};

const triggerFileInput = () => {
  fileInput.value.click();
};

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  if (!file.type.startsWith('image/')) {
    uploadError.value = "Please select an image file";
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    uploadError.value = "Image size should be less than 5MB";
    return;
  }

  selectedFile.value = file;
  previewUrl.value = URL.createObjectURL(file);
  uploadError.value = "";
};

const updateProfileImage = async () => {
  if (!auth.currentUser || !selectedFile.value) {
    uploadError.value = "You must be logged in and select a file";
    return;
  }

  isLoading.value = true;
  uploadError.value = "";

  try {
    const fileName = `profile_pictures/${auth.currentUser.uid}-${Date.now()}`;
    const fileRef = storageRef(storage, fileName);
    await uploadBytes(fileRef, selectedFile.value);
    const downloadURL = await getDownloadURL(fileRef);
    await updateProfile(auth.currentUser, { photoURL: downloadURL });
    const userRef = doc(db, "users", auth.currentUser.uid);
    await updateDoc(userRef, {
      profileImageUrl: downloadURL,
      updatedAt: Timestamp.now(),
    });
    profileImageUrl.value = downloadURL;
    selectedFile.value = null;
    successMessage.value = "Profile picture updated successfully!";
    showToast("Profile picture updated successfully!", "success");
    setTimeout(() => {
      successMessage.value = "";
    }, 3000);
  } catch (error) {
    uploadError.value = error.message || "Failed to upload profile picture";
    showToast("Failed to upload profile picture", "error");
  } finally {
    isLoading.value = false;
  }
};

const resetPreview = () => {
  previewUrl.value = "";
  selectedFile.value = null;
};

const validateField = (field, value) => {
  const trimmedValue = String(value ?? "").trim();
  if (!trimmedValue) {
    return `${field} is required.`;
  }
  return "";
};

const updateProfileInfo = async () => {
  const user = auth.currentUser;
  if (!user) return;

  const errors = {
    completeName: validateField("Complete Name", completeName.value),
    birthday: validateField("Birthday", birthday.value),
    cellphone: validateField("Cellphone Number", cellphone.value),
    gender: validateField("Gender", gender.value),
    address: validateField("Address", address.value),
  };

  if (Object.values(errors).some((error) => error)) {
    errorMessage.value = "Please fix the errors in the form.";
    showToast("Please fix the errors in the form.", "error");
    return;
  }

  isLoading.value = true;
  errorMessage.value = "";
  successMessage.value = "";

  try {
    const userRef = doc(db, "users", user.uid);
    await updateDoc(userRef, {
      completeName: completeName.value,
      birthday: birthday.value,
      cellphone: cellphone.value,
      gender: gender.value,
      address: address.value,
      updatedAt: Timestamp.now()
    });
    successMessage.value = "Profile updated successfully!";
    showToast("Profile updated successfully!", "success");
    setTimeout(() => {
      router.push("/user/settings/profile-display");
    }, 2000);
  } catch (error) {
    errorMessage.value = "Failed to update profile";
    showToast("Failed to update profile", "error");
  } finally {
    isLoading.value = false;
  }
};

const confirmDeactivation = async () => {
  const user = auth.currentUser;
  if (!user) {
    deactivateError.value = "No user is currently logged in.";
    showToast("No user is currently logged in.", "error");
    return;
  }

  isLoading.value = true;
  deactivateError.value = "";

  try {
    const providerId = user.providerData[0]?.providerId;
    if (providerId === "google.com") {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        status: "deactivated",
        deactivatedAt: Timestamp.now(),
      });
      await auth.signOut();
      router.push("/auth");
      showToast("Account deactivated successfully!", "success");
      return;
    }

    if (!password.value.trim()) {
      deactivateError.value = "Please enter your password.";
      showToast("Please enter your password.", "error");
      return;
    }

    await signInWithEmailAndPassword(auth, user.email, password.value);
    const userRef = doc(db, "users", user.uid);
    await updateDoc(userRef, {
      status: "deactivated",
      deactivatedAt: Timestamp.now(),
    });
    await auth.signOut();
    router.push("/auth");
    showToast("Account deactivated successfully!", "success");
  } catch (error) {
    deactivateError.value = providerId === "google.com"
      ? "Failed to deactivate account. Please try again."
      : "Incorrect password.";
    showToast(deactivateError.value, "error");
  } finally {
    isLoading.value = false;
  }
};

const sendVerificationCode = async () => {
  isLoading.value = true;
  deactivateError.value = '';
  emailSentMessage.value = '';

  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: auth.currentUser.email,
        subject: 'Your Verification Code',
        message: 'Your verification code is: 123456',
      }),
    });

    const result = await response.json();
    if (result.success) {
      emailSentMessage.value = `A verification code has been sent to ${auth.currentUser.email}. Please check your inbox.`;
      showCodeInput.value = true;
      showToast("Verification code sent successfully!", "success");
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    deactivateError.value = 'Failed to send verification code. Please try again.';
    showToast("Failed to send verification code.", "error");
  } finally {
    isLoading.value = false;
  }
};

const confirmDeactivationWithCode = async () => {
  if (!verificationCode.value.trim()) {
    deactivateError.value = "Please enter the verification code.";
    showToast("Please enter the verification code.", "error");
    return;
  }

  isLoading.value = true;
  deactivateError.value = "";

  try {
    if (verificationCode.value !== "123456") {
      throw new Error("Invalid verification code.");
    }

    const user = auth.currentUser;
    const userRef = doc(db, "users", user.uid);
    await updateDoc(userRef, {
      status: "deactivated",
      deactivatedAt: Timestamp.now(),
    });
    await auth.signOut();
    router.push("/auth");
    showToast("Account deactivated successfully!", "success");
  } catch (error) {
    deactivateError.value = error.message || "Failed to deactivate account.";
    showToast(deactivateError.value, "error");
  } finally {
    isLoading.value = false;
  }
};

const closeModal = () => {
  showDeactivateModal.value = false;
  password.value = "";
  deactivateError.value = "";
  showCodeInput.value = false;
  verificationCode.value = "";
  emailSentMessage.value = "";
};

// Dynamically calculate age based on birthday
const age = computed(() => {
  if (!birthday.value) return 'N/A';
  const birthDate = new Date(birthday.value);
  const today = new Date();
  let calculatedAge = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    calculatedAge--;
  }
  return isNaN(calculatedAge) ? 'N/A' : String(calculatedAge); // Ensure age is a String
});

// Watch for route changes
watch(currentRoute, () => {
  if (isMobile.value) {
    sidebarOpen.value = false;
    document.body.style.overflow = '';
  }
  userMenuOpen.value = false;
});

// Handle window resize
const handleResize = () => {
  checkIfMobile();
};

// Initialize component
onMounted(async () => {
  checkIfMobile();
  window.addEventListener('resize', handleResize);
  document.addEventListener('click', handleClickOutside);

  const user = auth.currentUser;
  if (!user) {
    router.push("/auth");
    return;
  }

  try {
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      const data = userSnap.data();
      username.value = data.username || "";
      completeName.value = data.completeName || "";
      birthday.value = data.birthday || "";
      cellphone.value = data.cellphone || "";
      gender.value = data.gender || "";
      address.value = data.address || "";
      profileImageUrl.value = data.profileImageUrl || "";
      role.value = data.role || "user";
      lastLogin.value = user.metadata.lastSignInTime ? new Date(user.metadata.lastSignInTime) : new Date();
    }
  } catch (error) {
    errorMessage.value = "Failed to load profile data";
    showToast("Failed to load profile data", "error");
  }
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
  document.removeEventListener('click', handleClickOutside);
});
</script>
<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

/* Base styles */
body {
  font-family: 'Inter', sans-serif;
}

/* Background Pattern */
.bg-pattern {
  background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.2'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
}

/* 3D Cube Spinner */
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

/* Smaller spinner for buttons */
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

/* Focus styles for accessibility */
button:focus-visible,
a:focus-visible,
input:focus-visible,
select:focus-visible {
  outline: 2px solid #10b981;
  outline-offset: 2px;
}

/* Responsive Styles */
@media (prefers-reduced-motion: reduce) {
  .spinner, .spinner-sm {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
  }
  .transition-all, .transition-colors {
    transition-duration: 0.001ms !important;
  }
}
</style>