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
        <div class="relative w-full max-w-2xl mx-auto">
          <div class="relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
            <!-- Header -->
            <div class="relative px-8 pt-8 pb-6 bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-100/50">
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="text-2xl font-bold text-gray-900 mb-2" id="modal-title">
                    Privacy Policy & Conditions of Use
                  </h3>
                  <p class="text-sm text-gray-600">
                    Please review our privacy policy and conditions of use.
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
                  <!-- Privacy Policy Section -->
                  <div class="space-y-4">
                    <div class="flex items-center space-x-3 mb-4">
                      <div class="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                        <svg class="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                        </svg>
                      </div>
                      <h4 class="text-lg font-semibold text-gray-900">Privacy Policy</h4>
                    </div>

                    <div class="space-y-4">
                      <div class="bg-gray-50/50 rounded-xl p-4 border border-gray-100">
                        <h5 class="font-medium text-gray-900 mb-2">1. Data Collection</h5>
                        <p class="text-sm text-gray-600 mb-2">The Eco-Mist system collects the following data:</p>
                        <ul class="text-sm text-gray-600 space-y-1 ml-4">
                          <li>• Sensor data: pH levels, humidity, temperature, water level, nutrient status</li>
                          <li>• Image uploads: Used for crop health analysis and machine learning detection</li>
                          <li>• User data: Names, roles, and interaction records</li>
                          <li>• Financial data: Income and expense tracking</li>
                          <li>• Device logs: Real-time status and thresholds</li>
                        </ul>
                      </div>

                      <div class="bg-blue-50/50 rounded-xl p-4 border border-blue-100">
                        <h5 class="font-medium text-gray-900 mb-2">2. Use of Data</h5>
                        <p class="text-sm text-gray-600 mb-2">Collected data is used for:</p>
                        <ul class="text-sm text-gray-600 space-y-1 ml-4">
                          <li>• Monitoring plant and system health</li>
                          <li>• Automated notifications via SMS/email</li>
                          <li>• Data analytics and recommendations via image processing</li>
                          <li>• Generating user-specific dashboards and reports</li>
                        </ul>
                      </div>

                      <div class="bg-emerald-50/50 rounded-xl p-4 border border-emerald-100">
                        <h5 class="font-medium text-gray-900 mb-2">3. Data Security</h5>
                        <p class="text-sm text-gray-600 mb-2">Security measures include:</p>
                        <ul class="text-sm text-gray-600 space-y-1 ml-4">
                          <li>• Authentication and access control for Admin/User roles</li>
                          <li>• Data encryption during transfer and storage</li>
                          <li>• Role-based access to protect sensitive functions</li>
                          <li>• Routine system backups for disaster recovery</li>
                        </ul>
                      </div>

                      <div class="bg-purple-50/50 rounded-xl p-4 border border-purple-100">
                        <h5 class="font-medium text-gray-900 mb-2">4. Data Sharing</h5>
                        <ul class="text-sm text-gray-600 space-y-1 ml-4">
                          <li>• No collected data is shared with third parties</li>
                          <li>• All system data remains confidential within the ATI and authorized users</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <!-- Terms of Use Section -->
                  <div class="space-y-4 border-t border-gray-200 pt-6">
                    <div class="flex items-center space-x-3 mb-4">
                      <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                      </div>
                      <h4 class="text-lg font-semibold text-gray-900">Conditions of Use</h4>
                    </div>

                    <div class="space-y-4">
                      <div class="bg-orange-50/50 rounded-xl p-4 border border-orange-100">
                        <h5 class="font-medium text-gray-900 mb-2">1. Eligibility</h5>
                        <p class="text-sm text-gray-600">
                          The system is intended only for ATI personnel, farmers, urban agricultural users, and researchers involved in aeroponics management. Unauthorized access is strictly prohibited.
                        </p>
                      </div>

                      <div class="bg-teal-50/50 rounded-xl p-4 border border-teal-100">
                        <h5 class="font-medium text-gray-900 mb-2">2. System Requirements</h5>
                        <p class="text-sm text-gray-600 mb-2">Users must ensure:</p>
                        <ul class="text-sm text-gray-600 space-y-1 ml-4">
                          <li>• Stable WLAN connection for real-time access</li>
                          <li>• Proper calibration and maintenance of hardware sensors</li>
                          <li>• Solar power battery setup for power stability in remote areas</li>
                        </ul>
                      </div>

                      <div class="bg-red-50/50 rounded-xl p-4 border border-red-100">
                        <h5 class="font-medium text-gray-900 mb-2">3. Limitations</h5>
                        <p class="text-sm text-gray-600 mb-2">The Eco-Mist system:</p>
                        <ul class="text-sm text-gray-600 space-y-1 ml-4">
                          <li>• May experience interruptions if internet or sensor connectivity is unstable</li>
                          <li>• Requires periodic maintenance and recalibration of sensors</li>
                          <li>• May be limited in areas with poor solar energy availability</li>
                        </ul>
                      </div>

                      <div class="bg-indigo-50/50 rounded-xl p-4 border border-indigo-100">
                        <h5 class="font-medium text-gray-900 mb-2">4. Feedback and Improvements</h5>
                        <p class="text-sm text-gray-600">
                          User feedback through in-system forms or direct messages is encouraged for continuous improvement of the Eco-Mist platform. Developers will monitor performance and optimize based on end-user evaluations, using ISO 25010 and UTUAT standards.
                        </p>
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
                class="px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-200 shadow-sm hover:shadow-md"
                @click="$emit('close')"
              >
                Close
              </button>
              <!-- <button
                type="button"
                class="px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl hover:from-emerald-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                @click="$emit('accept')"
              >
                Accept & Continue
              </button> -->
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