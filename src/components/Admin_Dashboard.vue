<template>
  <div class="admin-dashboard">
    <h1>Admin Dashboard</h1>
    <router-link to="/admin-management">Manage Users</router-link>
    <router-link to="/dashboard">Go to User Dashboard</router-link>
  </div>
</template>

<script>
export default {
  name: "AdminDashboard",
};
</script>

<style scoped>
.admin-dashboard {
  text-align: center;
}

/* ✅ Dark Mode Support */
.dark .admin-dashboard {
  background-color: #222;
  color: white;
}
</style>
