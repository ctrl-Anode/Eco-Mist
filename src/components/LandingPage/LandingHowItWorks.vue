<template>
  <section id="how-it-works" class="px-4 sm:px-6 py-20 sm:py-24 relative z-10">
    <div class="max-w-7xl mx-auto">
      <div class="text-center mb-16">
        <h2 class="text-3xl sm:text-4xl font-bold text-white mb-4">How It Works</h2>
        <div class="w-24 h-1.5 bg-gradient-to-r from-green-600 to-green-400 mx-auto rounded-full"></div>
      </div>

      <div class="max-w-4xl mx-auto bg-white/95 backdrop-blur-sm rounded-2xl border border-green-100 shadow-xl p-8 sm:p-10">
        <div class="space-y-12">
          <div
            v-for="(step, index) in steps"
            :key="index"
            class="flex flex-col sm:flex-row gap-6 items-center sm:items-start text-center sm:text-left"
          >
            <div
              class="flex-shrink-0 w-16 h-16 bg-gradient-to-r from-green-600 to-green-500 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-green-600/20"
            >
              {{ index + 1 }}
            </div>
            <div class="sm:pt-2">
              <h3 class="text-green-800 text-xl font-semibold mb-3">{{ step.title }}</h3>
              <p class="text-gray-600 text-lg">{{ step.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const steps = [
  {
    title: "Install Sensors",
    description: "Our plug-and-play sensors are easily installed in your aeroponic system.",
  },
  {
    title: "Connect to WLAN",
    description: "The system automatically connects to your wireless network for seamless data transmission.",
  },
  {
    title: "Monitor & Control",
    description: "Access your dashboard to view real-time data and control your system remotely.",
  },
  {
    title: "Optimize Growth",
    description: "Use AI-driven insights to optimize growing conditions and maximize yield.",
  },
];
</script>
