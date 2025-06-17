<template>
  <transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="transform scale-95 opacity-0"
    enter-to-class="transform scale-100 opacity-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="transform scale-100 opacity-100"
    leave-to-class="transform scale-95 opacity-0"
  >
    <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="$emit('close')"></div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">Terms of Service</h3>
                <div class="mt-4 max-h-96 overflow-y-auto pr-2 text-sm text-gray-600">
                  <slot />
                  <p>
                    📜 Terms of Use
Effective Date
May 2025
Project
Eco-Mist: IoT-Driven Web-based System for Automated Management and Monitoring of Aeroponics Farming
Institution
Mindoro State University – Calapan Campus
1. Acceptance of Terms
By accessing and using the Eco-Mist system, users agree to comply with all terms and conditions set forth herein. This system is developed for educational and agricultural use, particularly for use by the Agricultural Training Institute (ATI) and registered users such as farmers and researchers.
2. System Description
Eco-Mist is an IoT-powered system designed to automate and monitor aeroponics farming. It includes:
- Real-time monitoring of environmental parameters (temperature, pH, humidity, water level, etc.)
- Automated misting and crop image processing
- SMS and email notifications for system alerts
- Financial tracking (income and expenses)
- Solar-power support for continuous operation
- Remote access via WLAN
3. User Roles
- Admin: Manages devices, monitors system performance, adjusts settings, and receives full system data and notifications.
- Standard User (Farmer): Monitors crop data, uploads crop images for disease detection, and interacts with system tools.
4. User Obligations
Users must:
- Ensure their hardware (sensors, power sources, etc.) is installed and maintained properly
- Not misuse or tamper with data, system components, or device configurations
- Provide accurate image uploads and input data for analysis

                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
              @click="$emit('accept')"
            >
              Accept
            </button>
            <button
              type="button"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              @click="$emit('close')"
            >
              Close
            </button>
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
</script>
