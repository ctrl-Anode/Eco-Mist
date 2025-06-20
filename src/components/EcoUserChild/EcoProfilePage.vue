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
import { inject, ref, computed, onMounted, onUnmounted, watch } from 'vue';
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
const birthday = ref(inject('birthday')); // Wrap birthday with ref to make it reactive
const gender = inject('gender');
const address = inject('address');

// Dynamically calculate age based on birthday
const age = computed(() => {
  if (!birthday.value) return 'Not provided';
  const birthDate = new Date(birthday.value);
  const today = new Date();
  let calculatedAge = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    calculatedAge--;
  }
  return isNaN(calculatedAge) ? 'Not provided' : String(calculatedAge); // Ensure age is a String
});

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
