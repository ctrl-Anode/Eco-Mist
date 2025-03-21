<template>
  <div class="edit-profile-wrapper">
    <!-- Animated Background -->
    <div class="gradient-bg">
      <div class="gradient-circle c1"></div>
      <div class="gradient-circle c2"></div>
      <div class="gradient-circle c3"></div>
    </div>

    <!-- Glass Card -->
    <div class="glass-card">
      <div class="card-content">
        <div class="header-section">
          <button @click="$router.push('/profile-display')" class="back-button">
            <i class="fas fa-arrow-left"></i>
          </button>
          <h2 class="title">Edit Profile</h2>
          <p class="subtitle">Update your personal information</p>
        </div>

        <!-- Profile Picture Section -->
        <div class="profile-picture-section">
          <div class="profile-image-container">
            <img 
              :src="previewUrl || profileImageUrl || defaultProfilePic" 
              alt="Profile Picture" 
              class="profile-img"
            />
            <div class="upload-overlay" @click="triggerFileInput">
              <i class="fas fa-camera"></i>
              <span>Change Photo</span>
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
            v-if="selectedFile"
            @click="updateProfileImage" 
            :disabled="isLoading"
            class="upload-btn"
          >
            <span v-if="!isLoading">Upload New Picture</span>
            <span v-else class="loader"></span>
          </button>
          <p v-if="uploadError" class="error-message">
            <i class="fas fa-exclamation-circle"></i>
            {{ uploadError }}
          </p>
        </div>

        <!-- User Info Form -->
        <form @submit.prevent="updateProfileInfo" class="edit-form">
          <div class="form-grid">
            <div class="input-group">
              <input 
                type="text" 
                v-model="completeName" 
                :class="{ 'is-filled': completeName }"
                required
              />
              <label>Complete Name</label>
              <span class="input-border"></span>
            </div>

            <div class="input-group">
              <input 
                type="number" 
                v-model="age" 
                :class="{ 'is-filled': age }"
                required
              />
              <label>Age</label>
              <span class="input-border"></span>
            </div>

            <div class="input-group">
              <input 
                type="date" 
                v-model="birthday" 
                :class="{ 'is-filled': birthday }"
                required
              />
              <label>Birthday</label>
              <span class="input-border"></span>
            </div>

            <div class="input-group">
              <input 
                type="tel" 
                v-model="cellphone" 
                :class="{ 'is-filled': cellphone }"
                required
              />
              <label>Cellphone Number</label>
              <span class="input-border"></span>
            </div>

            <div class="input-group">
              <select 
                v-model="gender" 
                :class="{ 'is-filled': gender }"
                required
              >
                <option value="" disabled selected></option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              <label>Gender</label>
              <span class="input-border"></span>
            </div>

            <div class="input-group full-width">
              <input 
                type="text" 
                v-model="address" 
                :class="{ 'is-filled': address }"
                required
              />
              <label>Complete Address</label>
              <span class="input-border"></span>
            </div>
          </div>

          <div class="form-actions">
            <button 
              type="submit" 
              class="submit-btn"
              :disabled="isLoading"
            >
              <span v-if="!isLoading">Save Changes</span>
              <span v-else class="loader"></span>
            </button>

            <button 
              type="button"
              class="deactivate-btn"
              @click="showDeactivateModal = true"
            >
              <i class="fas fa-user-slash"></i>
              Deactivate Account
            </button>
          </div>

          <div v-if="successMessage" class="success-message">
            <i class="fas fa-check-circle"></i>
            {{ successMessage }}
          </div>

          <div v-if="errorMessage" class="error-message">
            <i class="fas fa-exclamation-circle"></i>
            {{ errorMessage }}
          </div>
        </form>
      </div>
    </div>

    <!-- Deactivation Modal -->
    <div v-if="showDeactivateModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>
            <i class="fas fa-exclamation-triangle"></i>
            Deactivate Account
          </h3>
          <button class="close-btn" @click="closeModal">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <div class="modal-body">
          <p class="warning-text">
            This action cannot be undone. Please enter your password to confirm.
          </p>

          <div class="input-group">
            <input 
              type="password" 
              v-model="password"
              :class="{ 'is-filled': password }"
              required
            />
            <label>Password</label>
            <span class="input-border"></span>
          </div>

          <p v-if="deactivateError" class="error-message">
            <i class="fas fa-exclamation-circle"></i>
            {{ deactivateError }}
          </p>
        </div>

        <div class="modal-footer">
          <button class="cancel-btn" @click="closeModal">Cancel</button>
          <button 
            class="confirm-btn" 
            @click="confirmDeactivation"
            :disabled="isLoading"
          >
            <span v-if="!isLoading">Confirm Deactivation</span>
            <span v-else class="loader"></span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { getAuth } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { signInWithEmailAndPassword } from "firebase/auth";
import { db, storage } from "../firebase";

// Form state
const completeName = ref("");
const age = ref("");
const birthday = ref("");
const cellphone = ref("");
const gender = ref("");
const address = ref("");
const profileImageUrl = ref("");
const previewUrl = ref("");
const selectedFile = ref(null);
const fileInput = ref(null);

// UI state
const isLoading = ref(false);
const errorMessage = ref("");
const successMessage = ref("");
const uploadError = ref("");
const showDeactivateModal = ref(false);
const password = ref("");
const deactivateError = ref("");

const router = useRouter();
const auth = getAuth();
const defaultProfilePic = "https://ui-avatars.com/api/?background=0D9488&color=fff";

// Load user data
onMounted(async () => {
  const user = auth.currentUser;
  if (!user) {
    router.push("/login");
    return;
  }

  try {
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const data = userSnap.data();
      completeName.value = data.completeName || "";
      age.value = data.age || "";
      birthday.value = data.birthday || "";
      cellphone.value = data.cellphone || "";
      gender.value = data.gender || "";
      address.value = data.address || "";
      profileImageUrl.value = data.profileImageUrl || "";
    }
  } catch (error) {
    errorMessage.value = "Failed to load profile data";
  }
});

// Profile picture handling
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
  const user = auth.currentUser;
  if (!user || !selectedFile.value) return;

  isLoading.value = true;
  uploadError.value = "";

  try {
    const fileRef = storageRef(storage, `profile_pictures/${user.uid}-${Date.now()}`);
    await uploadBytes(fileRef, selectedFile.value);
    const imageUrl = await getDownloadURL(fileRef);

    const userRef = doc(db, "users", user.uid);
    await updateDoc(userRef, {
      profileImageUrl: imageUrl,
    });

    profileImageUrl.value = imageUrl;
    selectedFile.value = null;
    successMessage.value = "Profile picture updated successfully!";
  } catch (error) {
    uploadError.value = "Failed to upload profile picture";
  } finally {
    isLoading.value = false;
  }
};

// Profile info update
const updateProfileInfo = async () => {
  const user = auth.currentUser;
  if (!user) return;

  isLoading.value = true;
  errorMessage.value = "";
  successMessage.value = "";

  try {
    const userRef = doc(db, "users", user.uid);
    await updateDoc(userRef, {
      completeName: completeName.value,
      age: age.value,
      birthday: birthday.value,
      cellphone: cellphone.value,
      gender: gender.value,
      address: address.value,
    });

    successMessage.value = "Profile updated successfully!";
    setTimeout(() => {
      router.push("/profile-display");
    }, 2000);
  } catch (error) {
    errorMessage.value = "Failed to update profile";
  } finally {
    isLoading.value = false;
  }
};

// Account deactivation
const confirmDeactivation = async () => {
  if (!password.value.trim()) {
    deactivateError.value = "Please enter your password";
    return;
  }

  isLoading.value = true;
  deactivateError.value = "";

  try {
    const user = auth.currentUser;
    await signInWithEmailAndPassword(auth, user.email, password.value);

    const userRef = doc(db, "users", user.uid);
    await updateDoc(userRef, {
      status: "deactivated",
    });

    await auth.signOut();
    router.push("/login");
  } catch (error) {
    deactivateError.value = "Incorrect password";
  } finally {
    isLoading.value = false;
  }
};

const closeModal = () => {
  showDeactivateModal.value = false;
  password.value = "";
  deactivateError.value = "";
};
</script>

<style scoped>
.edit-profile-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  position: relative;
  overflow: hidden;
}

.gradient-bg {
  position: fixed;
  inset: 0;
  background: #0f172a;
  z-index: 0;
}

.gradient-circle {
  position: absolute;
  border-radius: 50%;
  filter: blur(40px);
  opacity: 0.5;
  animation: float 20s infinite ease-in-out;
}

.c1 {
  width: 600px;
  height: 600px;
  background: radial-gradient(circle at center, #22c55e, #16a34a);
  top: -200px;
  left: -200px;
  animation-delay: 0s;
}

.c2 {
  width: 500px;
  height: 500px;
  background: radial-gradient(circle at center, #15803d, #166534);
  bottom: -150px;
  right: -150px;
  animation-delay: -5s;
}

.c3 {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle at center, #4ade80, #22c55e);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation-delay: -10s;
}

@keyframes float {
  0%, 100% { transform: translate(0, 0); }
  25% { transform: translate(50px, -50px); }
  50% { transform: translate(0, 75px); }
  75% { transform: translate(-50px, -25px); }
}

.glass-card {
  position: relative;
  width: 100%;
  max-width: 800px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.2);
  overflow: hidden;
  z-index: 1;
}

.card-content {
  padding: 40px;
}

.header-section {
  position: relative;
  text-align: center;
  margin-bottom: 32px;
}

.back-button {
  position: absolute;
  left: 0;
  top: 0;
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  padding: 8px;
  transition: all 0.3s;
}

.back-button:hover {
  color: white;
  transform: translateX(-2px);
}

.title {
  color: white;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 8px;
}

.subtitle {
  color: rgba(255, 255, 255, 0.7);
}

.profile-picture-section {
  text-align: center;
  margin-bottom: 32px;
}

.profile-image-container {
  position: relative;
  display: inline-block;
  margin-bottom: 16px;
}

.profile-img {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 4px solid rgba(255, 255, 255, 0.1);
  object-fit: cover;
}

.upload-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  opacity: 0;
  transition: opacity 0.3s;
  cursor: pointer;
}

.upload-overlay:hover {
  opacity: 1;
}

.upload-overlay i {
  font-size: 24px;
  margin-bottom: 4px;
}

.upload-overlay span {
  font-size: 12px;
}

.hidden {
  display: none;
}

.upload-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.upload-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.15);
}

.edit-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

.input-group {
  position: relative;
}

.input-group.full-width {
  grid-column: 1 / -1;
}

.input-group input,
.input-group select {
  width: 100%;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.05);
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 16px;
  transition: all 0.3s;
}

.input-group select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='rgba(255, 255, 255, 0.5)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  padding-right: 40px;
}

.input-group label {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255, 255, 255, 0.6);
  pointer-events: none;
  transition: all 0.3s;
}

.input-group input:focus + label,
.input-group input.is-filled + label,
.input-group select:focus + label,
.input-group select.is-filled + label {
  top: 0;
  left: 12px;
  font-size: 12px;
  padding: 0 4px;
  background: rgba(0, 0, 0, 0.8);
  border-radius: 4px;
  color: #4ade80;
}

.input-border {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: #4ade80;
  transition: all 0.3s;
}

.input-group input:focus ~ .input-border,
.input-group select:focus ~ .input-border {
  width: 100%;
}

.form-actions {
  display: flex;
  gap: 16px;
  margin-top: 16px;
}

.submit-btn {
  flex: 1;
  background: linear-gradient(45deg, #22c55e, #16a34a);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
}

.deactivate-btn {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
  color: #ef4444;
  padding: 14px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 8px;
}

.deactivate-btn:hover {
  background: rgba(239, 68, 68, 0.2);
}

.success-message,
.error-message {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  border-radius: 8px;
}

.success-message {
  background: rgba(74, 222, 128, 0.1);
  border: 1px solid rgba(74, 222, 128, 0.2);
  color: #4ade80;
}

.error-message {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
  color: #ef4444;
}

.loader {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 0.8s linear infinite;
  margin: 0 auto;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 20px;
  animation: fadeIn 0.3s ease;
}

.modal-content {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  width: 100%;
  max-width: 400px;
  animation: slideUp 0.3s ease;
}

.modal-header {
  padding: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.modal-header h3 {
  color: #ef4444;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.25rem;
}

.close-btn {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  padding: 8px;
  transition: color 0.3s;
}

.close-btn:hover {
  color: white;
}

.modal-body {
  padding: 20px;
}

.warning-text {
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 20px;
}

.modal-footer {
  padding: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.cancel-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
}

.cancel-btn:hover {
  background: rgba(255, 255, 255, 0.15);
}

.confirm-btn {
  background: #ef4444;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
}

.confirm-btn:hover:not(:disabled) {
  background: #dc2626;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 640px) {
  .card-content {
    padding: 24px;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column;
  }

  .title {
    font-size: 1.75rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .gradient-circle,
  .modal-overlay,
  .modal-content {
    animation: none;
  }

  .submit-btn:hover,
  .deactivate-btn:hover {
    transform: none;
  }
}
</style>