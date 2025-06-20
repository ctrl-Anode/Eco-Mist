<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { watch } from 'vue';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import { useTawk } from './composables/useTawk';

defineOptions({ name: 'App' });

const route = useRoute();
const { loadTawk, unloadTawk, shouldLoadTawk } = useTawk();

let previousUid = null;

const checkTawkStatus = () => {
  const user = auth.currentUser;
  const path = route.path;

  if (user && shouldLoadTawk(path)) {
    if (user.uid !== previousUid) {
      previousUid = user.uid;
      unloadTawk(); // fully reset
      setTimeout(() => loadTawk(), 100); // reinject clean
    }
  } else {
    previousUid = null;
    unloadTawk();
  }
};

// 🔁 Watch route changes
watch(() => route.path, checkTawkStatus, { immediate: true });

// 👤 Watch auth state changes
onAuthStateChanged(auth, checkTawkStatus);
</script>