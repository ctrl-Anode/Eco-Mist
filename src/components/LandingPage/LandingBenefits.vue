<template>
  <section id="benefits" class="px-4 sm:px-6 py-20 sm:py-24 relative z-10">
    <div class="max-w-7xl mx-auto">
      <div class="text-center mb-16">
        <h2 class="text-3xl sm:text-4xl font-bold text-white mb-4">Benefits of Eco-Mist</h2>
        <div class="w-24 h-1.5 bg-gradient-to-r from-green-600 to-green-400 mx-auto rounded-full"></div>
      </div>

      <div class="space-y-12">
        <!-- Benefit 1 -->
        <div class="bg-white/95 backdrop-blur-sm rounded-2xl border border-green-100 shadow-xl p-8 sm:p-10 hover:shadow-2xl transition-shadow">
          <div class="flex flex-col lg:flex-row gap-8 items-center">
            <!-- Icon on top (mobile) or right (desktop) -->
            <div class="lg:order-2 lg:w-1/3 flex justify-center">
              <div class="bg-green-50 p-6 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-32 h-32 text-green-600 filter drop-shadow-[0_0_10px_rgba(22,163,74,0.3)]">
                  <path d="M2 22c1.25-1.25 2.5-2.5 3.5-4.5 1.5 1 2.5 1 4.5.5 2-2 3-4 3-6 0-1-.5-2.5-2-3 0 0 2 0 4 2 0-3.5-2-6.5-2-8 0-.5 0-1 .5-1 .5 0 1 .5 1.5 2 2-3 2.5-4 3-6 .5 2 1.5 3 2.5 5 1-1.5 1.5-3 1.5-4.5.5 1.5 1 3 1 4.5 1-1 2-2 3-2.5 0 1-1 2-1 3 1 .5 2 1 2.5 2-1 1-2 1.5-3 2 1 2 1 4.5 0 6.5-1.5 1-3 1.5-4.5 2 1 1.5 2 3 3 4.5-1.5-.5-3-1-4.5-1.5-1 1-2 2-3 2.5 0-1 .5-2.5 1-3.5-1.5-.5-3-1-4.5-1.5-1 1.5-2 3-3.5 4.5z"/>
                </svg>
              </div>
            </div>

            <!-- Content -->
            <div class="lg:w-2/3 text-center lg:text-left">
              <h3 class="text-green-800 text-2xl font-semibold mb-4">Resource Efficiency</h3>
              <p class="text-gray-700 mb-6 text-lg">
                Eco-Mist's precision control system reduces water usage by up to 95% compared to traditional farming methods.
                Our smart nutrient delivery ensures plants receive exactly what they need, minimizing waste and maximizing efficiency.
              </p>

              <!-- Bullet list -->
              <ul class="space-y-3">
                <li class="flex items-center gap-3 text-gray-600 text-lg">
                  <span class="flex items-center justify-center text-green-600 bg-green-100 rounded-full p-1 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  </span>
                  <span>Reduced water consumption</span>
                </li>
                <li class="flex items-center gap-3 text-gray-600 text-lg">
                  <span class="flex items-center justify-center text-green-600 bg-green-100 rounded-full p-1 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  </span>
                  <span>Optimized nutrient usage</span>
                </li>
                <li class="flex items-center gap-3 text-gray-600 text-lg">
                  <span class="flex items-center justify-center text-green-600 bg-green-100 rounded-full p-1 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  </span>
                  <span>Lower energy requirements</span>
                </li>
                <li class="flex items-center gap-3 text-gray-600 text-lg">
                  <span class="flex items-center justify-center text-green-600 bg-green-100 rounded-full p-1 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  </span>
                  <span>Minimal environmental impact</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Additional benefits can be similarly structured below -->
      </div>
    </div>
  </section>
</template>

<script setup>
// No script needed for static content
</script>
