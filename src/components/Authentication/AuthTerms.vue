<template>
  <transition
    enter-active-class="transition duration-500 ease-out"
    enter-from-class="transform scale-95 opacity-0"
    enter-to-class="transform scale-100 opacity-100"
    leave-active-class="transition duration-300 ease-in"
    leave-from-class="transform scale-100 opacity-100"
    leave-to-class="transform scale-95 opacity-0"
  >
    <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-center justify-center min-h-screen p-4">
        <!-- Backdrop with blur -->
        <div 
          class="fixed inset-0 bg-black/30 backdrop-blur-md transition-all duration-300" 
          aria-hidden="true" 
          @click="$emit('close')"
        ></div>
        
        <!-- Modal Container -->
        <div class="relative w-full max-w-3xl mx-auto">
          <div class="relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
            <!-- Header -->
            <div class="relative px-8 pt-8 pb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100/50">
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="text-2xl font-bold text-gray-900 mb-2" id="modal-title">
                    Terms of Service
                  </h3>
                  <p class="text-sm text-gray-600">
                    Eco-Mist IoT System - Effective May 2025
                  </p>
                </div>
                <button
                  @click="$emit('close')"
                  class="p-2 rounded-full hover:bg-white/50 transition-colors duration-200 group"
                  aria-label="Close modal"
                >
                  <svg class="w-6 h-6 text-gray-500 group-hover:text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
            </div>

            <!-- Content -->
            <div class="px-8 py-6">
              <div class="max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                <div class="space-y-6 text-gray-700 leading-relaxed">
                  
                  <!-- Project Info Banner -->
                  <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                    <div class="flex items-start space-x-4">
                      <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 9.172V5L8 4z"></path>
                        </svg>
                      </div>
                      <div>
                        <h4 class="text-lg font-semibold text-gray-900 mb-2">Eco-Mist System</h4>
                        <p class="text-sm text-gray-600 mb-1">IoT-Driven Web-based System for Automated Management and Monitoring of Aeroponics Farming</p>
                        <p class="text-xs text-blue-600 font-medium">Mindoro State University – Calapan Campus</p>
                      </div>
                    </div>
                  </div>

                  <!-- Terms Sections -->
                  <div class="space-y-5">
                    
                    <!-- Acceptance of Terms -->
                    <div class="bg-emerald-50/50 rounded-xl p-5 border border-emerald-100">
                      <div class="flex items-center space-x-3 mb-3">
                        <div class="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                          <span class="text-emerald-600 font-bold text-sm">1</span>
                        </div>
                        <h5 class="font-semibold text-gray-900">Acceptance of Terms</h5>
                      </div>
                      <p class="text-sm text-gray-600 leading-relaxed">
                        By accessing and using the Eco-Mist system, users agree to comply with all terms and conditions set forth herein. This system is developed for educational and agricultural use, particularly for use by the Agricultural Training Institute (ATI) and registered users such as farmers and researchers.
                      </p>
                    </div>

                    <!-- System Description -->
                    <div class="bg-blue-50/50 rounded-xl p-5 border border-blue-100">
                      <div class="flex items-center space-x-3 mb-3">
                        <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span class="text-blue-600 font-bold text-sm">2</span>
                        </div>
                        <h5 class="font-semibold text-gray-900">System Description</h5>
                      </div>
                      <p class="text-sm text-gray-600 mb-3">
                        Eco-Mist is an IoT-powered system designed to automate and monitor aeroponics farming. It includes:
                      </p>
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div class="flex items-start space-x-2">
                          <div class="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                          <span class="text-sm text-gray-600">Real-time monitoring of environmental parameters</span>
                        </div>
                        <div class="flex items-start space-x-2">
                          <div class="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                          <span class="text-sm text-gray-600">Automated misting and crop image processing</span>
                        </div>
                        <div class="flex items-start space-x-2">
                          <div class="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                          <span class="text-sm text-gray-600">SMS and email notifications for system alerts</span>
                        </div>
                        <div class="flex items-start space-x-2">
                          <div class="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                          <span class="text-sm text-gray-600">Financial tracking (income and expenses)</span>
                        </div>
                        <div class="flex items-start space-x-2">
                          <div class="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                          <span class="text-sm text-gray-600">Solar-power support for continuous operation</span>
                        </div>
                        <div class="flex items-start space-x-2">
                          <div class="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                          <span class="text-sm text-gray-600">Remote access via WLAN</span>
                        </div>
                      </div>
                    </div>

                    <!-- User Roles -->
                    <div class="bg-purple-50/50 rounded-xl p-5 border border-purple-100">
                      <div class="flex items-center space-x-3 mb-3">
                        <div class="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                          <span class="text-purple-600 font-bold text-sm">3</span>
                        </div>
                        <h5 class="font-semibold text-gray-900">User Roles</h5>
                      </div>
                      <div class="space-y-3">
                        <div class="bg-white/60 rounded-lg p-3 border border-purple-100/50">
                          <div class="flex items-center space-x-2 mb-2">
                            <div class="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                              <svg class="w-3 h-3 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                              </svg>
                            </div>
                            <span class="font-medium text-gray-900 text-sm">Admin</span>
                          </div>
                          <p class="text-xs text-gray-600">
                            Manages devices, monitors system performance, adjusts settings, and receives full system data and notifications.
                          </p>
                        </div>
                        <div class="bg-white/60 rounded-lg p-3 border border-purple-100/50">
                          <div class="flex items-center space-x-2 mb-2">
                            <div class="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                              <svg class="w-3 h-3 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                              </svg>
                            </div>
                            <span class="font-medium text-gray-900 text-sm">Standard User (Farmer)</span>
                          </div>
                          <p class="text-xs text-gray-600">
                            Monitors crop data, uploads crop images for disease detection, and interacts with system tools.
                          </p>
                        </div>
                      </div>
                    </div>

                    <!-- User Obligations -->
                    <div class="bg-orange-50/50 rounded-xl p-5 border border-orange-100">
                      <div class="flex items-center space-x-3 mb-3">
                        <div class="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                          <span class="text-orange-600 font-bold text-sm">4</span>
                        </div>
                        <h5 class="font-semibold text-gray-900">User Obligations</h5>
                      </div>
                      <p class="text-sm text-gray-600 mb-3">Users must:</p>
                      <div class="space-y-2">
                        <div class="flex items-start space-x-3">
                          <div class="w-5 h-5 bg-orange-100 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                            <svg class="w-3 h-3 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                          </div>
                          <span class="text-sm text-gray-600">Ensure their hardware (sensors, power sources, etc.) is installed and maintained properly</span>
                        </div>
                        <div class="flex items-start space-x-3">
                          <div class="w-5 h-5 bg-orange-100 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                            <svg class="w-3 h-3 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                          </div>
                          <span class="text-sm text-gray-600">Not misuse or tamper with data, system components, or device configurations</span>
                        </div>
                        <div class="flex items-start space-x-3">
                          <div class="w-5 h-5 bg-orange-100 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                            <svg class="w-3 h-3 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                          </div>
                          <span class="text-sm text-gray-600">Provide accurate image uploads and input data for analysis</span>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>

            <!-- Footer -->
            <div class="px-8 py-6 bg-gray-50/50 border-t border-gray-100 flex flex-col sm:flex-row gap-3 sm:justify-end">
              <button
                type="button"
                class="px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-sm hover:shadow-md"
                @click="$emit('close')"
              >
                Close
              </button>
              <button
                type="button"
                class="px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                @click="$emit('accept')"
              >
                Accept Terms
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
const props = defineProps({
  show: Boolean
});

defineEmits(['close', 'accept']);
</script>

<style scoped>
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: rgb(209 213 219) transparent;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgb(209 213 219);
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgb(156 163 175);
}
</style>