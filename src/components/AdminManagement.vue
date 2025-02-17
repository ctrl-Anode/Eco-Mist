<template>
  <div class="admin-container">
    <h2>Admin Management</h2>
    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

    <div v-if="users.length">
      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Last Active</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td>{{ user.username || "Unknown" }}</td>
            <td>{{ user.email }}</td>
            <td>
              <select v-model="user.role" @change="updateUserRole(user)">
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </td>
            <td>
              <span :class="{ deactivated: user.status === 'deactivated' }">
                {{ user.status === 'deactivated' ? 'Deactivated' : 'Active' }}
              </span>
            </td>
            <td>{{ user.lastActive || "Never Logged In" }}</td>
            <td>
              <button v-if="user.status === 'active'" @click="confirmDeactivation(user)" class="deactivate-btn">
                Deactivate
              </button>
              <button v-if="user.status === 'deactivated'" @click="confirmReactivation(user)" class="reactivate-btn">
                Reactivate
              </button>
              <button @click="confirmDeletion(user.id)" class="delete-btn">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <p v-else>No users found.</p>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { auth, db } from "@/firebase";
import { getDoc, doc, collection, updateDoc, deleteDoc, onSnapshot } from "firebase/firestore";

export default {
  setup() {
    const users = ref([]);
    const errorMessage = ref("");

    const fetchUsers = async () => {
      try {
        const currentUser = auth.currentUser;
        if (!currentUser) {
          throw new Error("Not authenticated");
        }

        // Check if the current user is an admin
        const adminRef = doc(db, "users", currentUser.uid);
        const adminSnap = await getDoc(adminRef);

        if (!adminSnap.exists() || adminSnap.data().role !== "admin") {
          throw new Error("Access denied. Admins only.");
        }

        // Fetch ALL users, not just admins
        const usersCollection = collection(db, "users");
        onSnapshot(usersCollection, (snapshot) => {
          users.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        });
      } catch (error) {
        errorMessage.value = error.message;
      }
    };

    const updateUserRole = async (user) => {
      if (user.status === "deactivated") {
        alert("Cannot change role of a deactivated user. Reactivate first.");
        return;
      }

      try {
        await updateDoc(doc(db, "users", user.id), { role: user.role });
        alert(`User role updated to ${user.role}`);
      } catch (error) {
        alert("Error updating role: " + error.message);
      }
    };

    const deactivateUser = async (user) => {
      try {
        await updateDoc(doc(db, "users", user.id), { status: "deactivated" });
        alert("User has been deactivated.");
      } catch (error) {
        alert("Error deactivating user: " + error.message);
      }
    };

    const reactivateUser = async (user) => {
      try {
        await updateDoc(doc(db, "users", user.id), { status: "active" });
        alert("User has been reactivated.");
      } catch (error) {
        alert("Error reactivating user: " + error.message);
      }
    };

    const deleteUser = async (userId) => {
      try {
        await deleteDoc(doc(db, "users", userId));
        alert("User deleted successfully.");
      } catch (error) {
        alert("Error deleting user: " + error.message);
      }
    };

    const confirmDeactivation = (user) => {
      if (confirm(`Are you sure you want to deactivate ${user.username}?`)) {
        deactivateUser(user);
      }
    };

    const confirmReactivation = (user) => {
      if (confirm(`Are you sure you want to reactivate ${user.username}?`)) {
        reactivateUser(user);
      }
    };

    const confirmDeletion = (userId) => {
      if (confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
        deleteUser(userId);
      }
    };

    onMounted(fetchUsers);

    return { users, errorMessage, updateUserRole, confirmDeactivation, confirmReactivation, confirmDeletion };
  },
};
</script>


<style scoped>
.admin-container {
  text-align: center;
  margin-top: 20px;
}

.error-message {
  color: red;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

th, td {
  border: 1px solid #ddd;
  padding: 10px;
  text-align: left;
}

th {
  background-color: #f4f4f4;
}

.deactivated {
  color: red;
  font-weight: bold;
}

.deactivate-btn {
  background-color: orange;
  color: white;
  padding: 5px 10px;
  border: none;
  cursor: pointer;
}

.deactivate-btn:hover {
  background-color: darkorange;
}

.reactivate-btn {
  background-color: green;
  color: white;
  padding: 5px 10px;
  border: none;
  cursor: pointer;
}

.reactivate-btn:hover {
  background-color: darkgreen;
}

.delete-btn {
  background-color: red;
  color: white;
  padding: 5px 10px;
  border: none;
  cursor: pointer;
}

.delete-btn:hover {
  background-color: darkred;
}
</style>
