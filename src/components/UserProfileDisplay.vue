<template>
  <div class="profile-page">
    <div class="profile-display-container">
      <h2>User Profile</h2>

      <!-- ✅ Profile Picture or Initial Placeholder -->
      <div class="profile-img-container">
        <img v-if="profileImageUrl" :src="profileImageUrl" alt="Profile Picture" class="profile-img" />
        <div v-else class="profile-placeholder">{{ username.charAt(0).toUpperCase() }}</div>
      </div>

      <div class="profile-details">
        <p><strong>Username:</strong> {{ username || "Not provided" }}</p>
        <p><strong>Email:</strong> {{ email || "Not provided" }}</p>
        <p><strong>Complete Name:</strong> {{ completeName || "Not provided" }}</p>
        <p><strong>Age:</strong> {{ age || "Not provided" }}</p>
        <p><strong>Birthday:</strong> {{ birthday || "Not provided" }}</p>
        <p><strong>Cellphone Number:</strong> {{ cellphone || "Not provided" }}</p>
        <p><strong>Gender:</strong> {{ gender || "Not provided" }}</p>
        <p><strong>Address:</strong> {{ address || "Not provided" }}</p>
        <p><strong>Account Status:</strong> <span :class="status === 'active' ? 'active' : 'deactivated'">{{ status }}</span></p>
      </div>

      <router-link to="/edit-profile" class="edit-profile-button">Edit Profile</router-link>

      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

export default {
  setup() {
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

    onMounted(async () => {
      const user = auth.currentUser;
      if (!user) {
        errorMessage.value = "User is not authenticated.";
        return;
      }

      try {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const data = userSnap.data();
          username.value = data.username || "";
          email.value = data.email || "";
          completeName.value = data.completeName || "";
          age.value = data.age || "";
          birthday.value = data.birthday || "";
          cellphone.value = data.cellphone || "";
          gender.value = data.gender || "";
          address.value = data.address || "";
          profileImageUrl.value = data.profileImageUrl || "";
          status.value = data.status || "active";
        } else {
          errorMessage.value = "User profile not found.";
        }
      } catch (error) {
        errorMessage.value = "Error fetching profile data.";
      }
    });

    return { username, email, completeName, age, birthday, cellphone, gender, address, profileImageUrl, status, errorMessage };
  },
};
</script>

<style scoped>
.profile-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: url('@/assets/let.png') no-repeat center center/cover;
}

.profile-display-container {
  text-align: center;
  max-width: 600px;
  background: rgba(255, 255, 255, 0.95);
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
  font-family: 'Poppins', sans-serif;
}

h2 {
  color: #388e3c;
  font-weight: bold;
  font-size: 32px;
  margin-bottom: 20px;
}

.profile-img-container {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.profile-img {
  width: 140px;
  height: 140px;
  border-radius: 50%;
  border: 4px solid #2e7d32;
}

.profile-placeholder {
  width: 140px;
  height: 140px;
  border-radius: 50%;
  background: #2e7d32;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 50px;
  font-weight: bold;
}

.profile-details {
  text-align: left;
  background: #f1f8e9;
  padding: 20px;
  border-radius: 10px;
}

p {
  font-size: 18px;
  margin: 10px 0;
}

.active {
  color: green;
  font-weight: bold;
}

.deactivated {
  color: red;
  font-weight: bold;
}
</style>
