<template>
  <section id="features" class="px-4 sm:px-6 py-20 sm:py-24 relative z-10">
    <div class="max-w-7xl mx-auto">
      <div class="text-center mb-16">
        <h2 class="text-3xl sm:text-4xl font-bold text-white mb-4">Advanced Features</h2>
        <div class="w-24 h-1.5 bg-gradient-to-r from-green-600 to-green-400 mx-auto rounded-full"></div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <div
          v-for="(feature, index) in features"
          :key="index"
          class="bg-white/95 backdrop-blur-sm rounded-2xl border border-green-100 shadow-xl p-8 text-center transition-all hover:-translate-y-2 duration-300 group"
        >
          <div class="text-green-600 mb-6 flex justify-center items-center">
            <div
              class="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center group-hover:bg-green-200 transition-colors"
            >
              <component :is="feature.icon" class="w-8 h-8" />
            </div>
          </div>
          <h3 class="text-green-800 text-xl font-semibold mb-3">{{ feature.title }}</h3>
          <p class="text-gray-600">{{ feature.description }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { defineAsyncComponent } from "vue";

const WifiIcon = defineAsyncComponent(() => import("../icons/WifiIcon.vue"));
const SensorsIcon = defineAsyncComponent(() => import("../icons/SensorsIcon.vue"));
const AnalyticsIcon = defineAsyncComponent(() => import("../icons/AnalyticsIcon.vue"));
const AutomationIcon = defineAsyncComponent(() => import("../icons/AutomationIcon.vue"));
const AlertsIcon = defineAsyncComponent(() => import("../icons/AlertsIcon.vue"));
const ResponsiveIcon = defineAsyncComponent(() => import("../icons/ResponsiveIcon.vue"));

const features = [
  {
    title: "WLAN Connectivity",
    description: "Seamless wireless connectivity for all sensors and control systems with robust signal strength.",
    icon: WifiIcon,
  },
  {
    title: "IoT Sensors",
    description: "High-precision sensors for temperature, humidity, pH, nutrient levels, and water flow monitoring.",
    icon: SensorsIcon,
  },
  {
    title: "Real-time Analytics",
    description: "Advanced analytics dashboard with real-time data visualization and historical trends.",
    icon: AnalyticsIcon,
  },
  {
    title: "Automated Control",
    description: "Smart automation for nutrient delivery, misting cycles, and environmental conditions.",
    icon: AutomationIcon,
  },
  {
    title: "Alert System",
    description: "Instant notifications for critical events, system anomalies, and maintenance requirements.",
    icon: AlertsIcon,
  },
  {
    title: "Responsive",
    description: "Control your farm from anywhere with our intuitive responsive web application for desktop or mobile view.",
    icon: ResponsiveIcon,
  },
];
</script>
