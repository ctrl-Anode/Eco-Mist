<template>
  <div v-if="visible" class="fixed inset-0 z-50 flex items-center justify-center">
    <!-- Enhanced blurred backdrop with glassmorphism -->
    <div 
      class="absolute inset-0 backdrop-blur-md bg-gradient-to-br from-black/30 via-black/20 to-black/40" 
      @click="cancel"
    ></div>

    <!-- Glassmorphism modal content -->
    <div class="bg-white/10 backdrop-blur-xl rounded-2xl p-8 max-w-sm mx-4 w-full relative z-10 shadow-2xl border border-white/20 glassmorphism-card">
      <div class="absolute inset-0 bg-gradient-to-br from-white/20 via-white/10 to-transparent rounded-2xl"></div>
      
      <div class="relative z-10">
        <h3 class="text-xl font-semibold text-white mb-4 drop-shadow-sm">Confirm Logout</h3>
        <p class="text-white/80 mb-8 leading-relaxed">Are you sure you want to log out of your account?</p>
        
        <div class="flex justify-end gap-4">
          <button
            @click="cancel"
            class="px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 transition-all duration-300 border border-white/30 font-medium shadow-lg hover:shadow-xl hover:scale-105"
          >
            Cancel
          </button>
          <button
            @click="logout"
            class="px-6 py-3 bg-red-500/80 backdrop-blur-sm text-white rounded-xl hover:bg-red-600/90 transition-all duration-300 flex items-center justify-center font-medium shadow-lg hover:shadow-xl hover:scale-105 border border-red-400/30"
            :disabled="loggingOut"
          >
            <span v-if="!loggingOut">Logout</span>
            <div v-else class="flex items-center">
              <div class="spinner spinner-sm mr-3">
                <div></div><div></div><div></div><div></div><div></div><div></div>
              </div>
              <span>Logging out...</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  visible: Boolean
});
const emits = defineEmits(['cancel', 'logout']);

const loggingOut = ref(false);

const logout = () => {
  loggingOut.value = true;
  // Simulate logout delay
  setTimeout(() => {
    emits('logout');
    loggingOut.value = false;
  }, 1000);
};

const cancel = () => {
  emits('cancel');
};
</script>

<style scoped>
.glassmorphism-card {
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
  box-shadow: 
    0 25px 45px rgba(0, 0, 0, 0.1),
    0 0 0 1px rgba(255, 255, 255, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.glassmorphism-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
}

/* Enhanced spinner with glassmorphism */
.spinner {
  width: 20px;
  height: 20px;
  animation: spinner-rotation 2s infinite ease;
  transform-style: preserve-3d;
  position: relative;
}

.spinner > div {
  background-color: rgba(255, 255, 255, 0.1);
  height: 100%;
  position: absolute;
  width: 100%;
  border: 2px solid rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(4px);
  border-radius: 2px;
}

.spinner div:nth-of-type(1) { 
  transform: translateZ(-10px) rotateY(180deg); 
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
  transform: translateZ(10px); 
}

@keyframes spinner-rotation {
  0% { transform: rotate(45deg) rotateX(-25deg) rotateY(25deg); }
  50% { transform: rotate(45deg) rotateX(-385deg) rotateY(25deg); }
  100% { transform: rotate(45deg) rotateX(-385deg) rotateY(385deg); }
}

/* Smooth entrance animation */
.glassmorphism-card {
  animation: modalEnter 0.3s ease-out;
}

@keyframes modalEnter {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.glassmorphism-card h3 {
  color: #000000; /* Black color for emphasis */
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.6);
}

.glassmorphism-card p {
  color: #000000;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
}

button {
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  color: #000000; /* Black color for Cancel button text */
}
</style>