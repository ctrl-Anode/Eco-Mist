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
                <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">Privacy Policy</h3>
                <div class="mt-4 max-h-96 overflow-y-auto pr-2 text-sm text-gray-600">
                  <slot />
                  <p>🔐 Privacy Policy
1. Data Collection
The Eco-Mist system collects the following data:
- Sensor data: pH levels, humidity, temperature, water level, nutrient status, etc.
- Image uploads: Used for crop health analysis and machine learning detection
- User data: Names, roles, and interaction records
- Financial data: Income and expense tracking
- Device logs: Real-time status and thresholds
2. Use of Data
Collected data is used for:
- Monitoring plant and system health
- Automated notifications via SMS/email
- Data analytics and recommendations via image processing
- Generating user-specific dashboards and reports
3. Data Security
Security measures include:
- Authentication and access control for Admin/User roles
- Data encryption during transfer and storage
- Role-based access to protect sensitive functions
- Routine system backups for disaster recovery
4. Data Sharing
- No collected data is shared with third parties
- All system data remains confidential within the ATI and authorized users
✅ Conditions of Use
1. Eligibility
The system is intended only for ATI personnel, farmers, urban agricultural users, and researchers involved in aeroponics management. Unauthorized access is strictly prohibited.
2. System Requirements
Users must ensure:
- Stable WLAN connection for real-time access
- Proper calibration and maintenance of hardware sensors
- Solar power battery setup for power stability in remote areas
3. Limitations
The Eco-Mist system:
- May experience interruptions if internet or sensor connectivity is unstable
- Requires periodic maintenance and recalibration of sensors (as listed in the scope and methodology)
- May be limited in areas with poor solar energy availability or degraded component performance
4. Feedback and Improvements
User feedback through in-system forms or direct messages is encouraged for continuous improvement of the Eco-Mist platform. Developers will monitor performance and optimize based on end-user evaluations, using ISO 25010 and UTUAT standards.

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
