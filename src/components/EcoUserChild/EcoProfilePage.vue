<template>
  <EcoUser_MainContent>
    <div class="mb-10 px-4 md:px-8"></div>

    <EcoUser_ProfileHeader
      :username="username"
      :email="email"
      :cellphone="cellphone"
      :role="role"
      :profileImageUrl="profileImageUrl"
      :status="status"
    />

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 px-0 md:px-0">
      <EcoUser_PersonalInfo
        :completeName="completeName"
        :age="age"
        :birthday="birthday"
        :gender="gender"
      />
      <EcoUser_ContactInfo
        :email="email"
        :cellphone="cellphone"
        :address="address"
      />
    </div>
  </EcoUser_MainContent>
</template>

<script setup>
import { inject, onMounted, onUnmounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import EcoUser_MainContent from '../EcoMist_User/EcoUser_MainContent.vue';
import EcoUser_ProfileHeader from '../EcoMist_User/EcoUser_ProfileHeader.vue';
import EcoUser_PersonalInfo from '../EcoMist_User/EcoUser_PersonalInfo.vue';
import EcoUser_ContactInfo from '../EcoMist_User/EcoUser_ContactInfo.vue';

// Dynamically injected profile data
const username = inject('username');
const email = inject('email');
const cellphone = inject('cellphone');
const role = inject('role');
const profileImageUrl = inject('profileImageUrl');
const status = inject('status');
const completeName = inject('completeName');
const age = inject('age');
const birthday = inject('birthday');
const gender = inject('gender');
const address = inject('address');

let refreshInterval;
const router = useRouter();
const route = useRoute();

onMounted(() => {
  // Automatic refresh every 5 minutes
  refreshInterval = setInterval(() => {
    location.reload();
  }, 300000);
});

// Watch for route changes and reload if navigated to this page
watch(
  () => route.fullPath,
  (newPath) => {
    if (newPath === '/user/edit-profile') {  // Adjust this path if yours is different!
      location.reload();
    }
  }
);

onUnmounted(() => {
  clearInterval(refreshInterval);
});
</script>
