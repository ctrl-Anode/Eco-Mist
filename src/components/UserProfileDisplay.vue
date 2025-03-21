<template>
  <div class="profile-wrapper">
    <!-- Animated Background -->
    <div class="gradient-bg">
      <div class="gradient-circle c1"></div>
      <div class="gradient-circle c2"></div>
      <div class="gradient-circle c3"></div>
    </div>

    <!-- Glass Card -->
    <div class="glass-card">
      <div class="card-content">
        <!-- Loading State -->
        <div v-if="loading" class="loading-state">
          <div class="loader"></div>
          <p>Loading profile...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="errorMessage" class="error-container">
          <i class="fas fa-exclamation-circle"></i>
          <p>{{ errorMessage }}</p>
          <button @click="fetchUserProfile" class="retry-btn">
            Retry
          </button>
        </div>

        <!-- Profile Content -->
        <div v-else class="profile-content">
          <div class="profile-header">
            <div class="profile-image-container">
              <img 
                :src="profileImageUrl || defaultProfilePic" 
                :alt="`${username}'s profile picture`" 
                class="profile-img"
                @error="handleImageError"
              />
              <div class="status-badge" :class="status">
                {{ status }}
              </div>
            </div>
            <h2 class="username">{{ username || "Not provided" }}</h2>
            <p class="email">{{ email || "Not provided" }}</p>
          </div>

          <div class="profile-sections">
            <!-- Personal Information -->
            <div class="section">
              <h3 class="section-title">
                <i class="fas fa-user"></i>
                Personal Information
              </h3>
              <div class="info-grid">
                <div class="info-item">
                  <label>Complete Name</label>
                  <p>{{ completeName || "Not provided" }}</p>
                </div>
                <div class="info-item">
                  <label>Age</label>
                  <p>{{ age || "Not provided" }}</p>
                </div>
                <div class="info-item">
                  <label>Birthday</label>
                  <p>{{ birthday || "Not provided" }}</p>
                </div>
                <div class="info-item">
                  <label>Gender</label>
                  <p>{{ gender || "Not provided" }}</p>
                </div>
              </div>
            </div>

            <!-- Contact Information -->
            <div class="section">
              <h3 class="section-title">
                <i class="fas fa-address-card"></i>
                Contact Information
              </h3>
              <div class="info-grid">
                <div class="info-item">
                  <label>Cellphone</label>
                  <p>{{ cellphone || "Not provided" }}</p>
                </div>
                <div class="info-item">
                  <label>Address</label>
                  <p>{{ address || "Not provided" }}</p>
                </div>
              </div>
            </div>
          </div>

          <router-link to="/edit-profile" class="edit-button">
            <i class="fas fa-edit"></i>
            Edit Profile
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

// State
const username = ref("");
const email = ref("");
const completeName = ref("");
const age = ref("");
const birthday = ref("");
const cellphone = ref("");
const gender = ref("");
const address = ref("");
const profileImageUrl = ref("");
const status = ref("");
const errorMessage = ref("");
const loading = ref(true);

// Default profile picture with modern design
const defaultProfilePic = "https://ui-avatars.com/api/?background=0D9488&color=fff";

const handleImageError = (e) => {
  e.target.src = defaultProfilePic;
};

const fetchUserProfile = async () => {
  loading.value = true;
  errorMessage.value = "";

  try {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) {
      errorMessage.value = "Please sign in to view your profile";
      return;
    }

    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const data = userSnap.data();
      username.value = data.username;
      email.value = data.email;
      completeName.value = data.completeName;
      age.value = data.age;
      birthday.value = data.birthday;
      cellphone.value = data.cellphone;
      gender.value = data.gender;
      address.value = data.address;
      profileImageUrl.value = data.profileImageUrl;
      status.value = data.status || "active";
    } else {
      errorMessage.value = "Profile not found. Please complete your profile setup.";
    }
  } catch (error) {
    console.error("Error fetching profile:", error);
    errorMessage.value = "Unable to load profile. Please try again.";
  } finally {
    loading.value = false;
  }
};

onMounted(fetchUserProfile);
</script>

<style scoped>
.profile-wrapper {
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
  max-width: 600px;
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

/* Loading State */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  color: rgba(255, 255, 255, 0.7);
}

.loader {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  border-top-color: #4ade80;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Error Container */
.error-container {
  text-align: center;
  color: #ef4444;
  padding: 24px;
}

.retry-btn {
  margin-top: 16px;
  padding: 8px 16px;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 8px;
  color: #ef4444;
  cursor: pointer;
  transition: all 0.3s;
}

.retry-btn:hover {
  background: rgba(239, 68, 68, 0.2);
}

/* Profile Content */
.profile-content {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.profile-header {
  text-align: center;
}

.profile-image-container {
  position: relative;
  display: inline-block;
}

.profile-img {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 4px solid rgba(255, 255, 255, 0.1);
  object-fit: cover;
  transition: transform 0.3s;
}

.profile-img:hover {
  transform: scale(1.05);
}

.status-badge {
  position: absolute;
  bottom: 0;
  right: 0;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  text-transform: capitalize;
}

.status-badge.active {
  background: rgba(74, 222, 128, 0.2);
  color: #4ade80;
  border: 1px solid rgba(74, 222, 128, 0.4);
}

.status-badge.deactivated {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.4);
}

.username {
  color: white;
  font-size: 1.5rem;
  font-weight: 600;
  margin: 16px 0 4px;
}

.email {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
}

/* Profile Sections */
.profile-sections {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.section {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 16px;
  padding: 24px;
}

.section-title {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.1rem;
  font-weight: 500;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-title i {
  color: #4ade80;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-item label {
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.9rem;
}

.info-item p {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1rem;
}

/* Edit Button */
.edit-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: linear-gradient(45deg, #22c55e, #16a34a);
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s;
  align-self: center;
}

.edit-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
}

@media (max-width: 640px) {
  .card-content {
    padding: 24px;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .profile-img {
    width: 100px;
    height: 100px;
  }

  .section {
    padding: 16px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .gradient-circle {
    animation: none;
  }

  .profile-img:hover {
    transform: none;
  }

  .edit-button:hover {
    transform: none;
  }
}
</style>