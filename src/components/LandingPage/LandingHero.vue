<template>
  <section class="mt-12 sm:mt-16 md:mt-20 px-4 sm:px-6 py-12 sm:py-16 md:py-20 relative z-10">
    <div class="max-w-7xl mx-auto bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl border border-green-100 shadow-xl overflow-hidden relative">
      <div class="absolute inset-0 bg-gradient-to-r from-transparent via-green-50/30 to-transparent animate-shine"></div>
      <div class="flex flex-col md:flex-row items-center justify-between p-6 sm:p-10 md:p-12 gap-8 md:gap-12">
        <!-- Right Content (Logo) - moved to top on mobile -->
        <div class="w-full md:w-1/2 flex justify-center order-first md:order-last">
          <div class="relative">
            <div class="absolute inset-0 bg-gradient-to-br from-green-400/20 to-green-600/20 rounded-full blur-3xl"></div>
            <div class="bg-white p-6 rounded-2xl shadow-2xl relative">
              <img src="/eco-mist-logo.png" alt="Eco-Mist System" class="w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 filter drop-shadow-[0_0_30px_rgba(22,163,74,0.5)] animate-float-logo" loading="lazy" />
            </div>
          </div>
        </div>

        <!-- Left Content -->
        <div class="w-full md:w-1/2 text-center md:text-left order-last md:order-first">
          <h1 class="text-4xl sm:text-5xl md:text-6xl font-bold text-green-800 leading-tight mb-4">
            <span class="bg-clip-text text-transparent bg-gradient-to-r from-green-800 to-green-600">IoT-Driven</span> Aeroponics Farming
          </h1>
          <p class="text-green-600 text-lg sm:text-xl font-medium mb-6">
            Web-based System for Automated Management and Monitoring of Aeroponics Farming
          </p>
          <p class="text-gray-700 mb-8 max-w-xl mx-auto md:mx-0 text-lg">
            Revolutionize your farming with our cutting-edge IoT solution that optimizes growth,
            reduces resource consumption, and delivers real-time insights for maximum yield.
          </p>
          <div class="flex flex-col sm:flex-row gap-6 justify-center md:justify-start">
            <router-link
              to="/auth"
              class="bg-gradient-to-r from-green-700 to-green-600 text-white font-semibold px-8 py-4 rounded-xl hover:-translate-y-1 transition-transform shadow-lg shadow-green-600/20 active:scale-95 touch-manipulation text-lg"
            >
              Get Started
            </router-link>
            <a
              href="#how-it-works"
              @click.prevent="scrollToSection('how-it-works')"
              class="px-8 py-4 rounded-xl border-2 border-green-600 text-green-700 hover:bg-green-50 transition-all font-semibold flex items-center justify-center gap-2 text-lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                   stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5">
                <circle cx="12" cy="12" r="10" />
                <polygon points="10 8 16 12 10 16 10 8" />
              </svg>
              Watch Demo
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>


<script setup>
const scrollToSection = (id) => {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth" });
  }
};
</script>

<style scoped>
@keyframes shine {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.animate-shine {
  animation: shine 6s infinite linear;
}

@keyframes float-logo {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

.animate-float-logo {
  animation: float-logo 6s infinite ease-in-out;
}
</style>
