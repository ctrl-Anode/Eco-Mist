<template>
  <div class="profile-display-container">
    <h2>User Profile</h2>

    <!-- ✅ Profile Picture -->
    <img :src="profileImageUrl || defaultProfilePic" alt="Profile Picture" class="profile-img" />

    <p><strong>Username:</strong> {{ username || "Not provided" }}</p>
    <p><strong>Email:</strong> {{ email || "Not provided" }}</p>
    <p><strong>Complete Name:</strong> {{ completeName || "Not provided" }}</p>
    <p><strong>Age:</strong> {{ age || "Not provided" }}</p>
    <p><strong>Birthday:</strong> {{ birthday || "Not provided" }}</p>
    <p><strong>Cellphone Number:</strong> {{ cellphone || "Not provided" }}</p>
    <p><strong>Gender:</strong> {{ gender || "Not provided" }}</p>
    <p><strong>Address:</strong> {{ address || "Not provided" }}</p>

    <p><strong>Account Status:</strong> <span :class="status === 'active' ? 'active' : 'deactivated'">{{ status }}</span></p>

    <router-link to="/edit-profile">Edit Profile</router-link>

    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
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

    // ✅ Default Profile Picture
    const defaultProfilePic = "https://via.placeholder.com/100";

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

    return { username, email, completeName, age, birthday, cellphone, gender, address, profileImageUrl, status, defaultProfilePic, errorMessage };
  },
};
</script>

<style scoped>
.profile-display-container {
  text-align: center;
  max-width: 400px;
  margin: auto;
}

.profile-img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-bottom: 10px;
}

.active {
  color: green;
  font-weight: bold;
}

.deactivated {
  color: red;
  font-weight: bold;
}

p {
  font-size: 16px;
  margin: 8px 0;
}

a {
  display: block;
  margin-top: 15px;
  color: blue;
  text-decoration: none;
}

.error-message {
  color: red;
}
</style>
