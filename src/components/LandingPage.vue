<template>
  <div class="min-h-screen relative overflow-x-hidden">
    <!-- Animated Background -->
    <div class="fixed inset-0 bg-slate-900 z-0">
      <div class="absolute w-[600px] h-[600px] rounded-full filter blur-[40px] opacity-50 bg-gradient-to-br from-green-500 to-green-600 -top-[200px] -left-[200px] animate-float"></div>
      <div class="absolute w-[500px] h-[500px] rounded-full filter blur-[40px] opacity-50 bg-gradient-to-br from-green-700 to-green-800 -bottom-[150px] -right-[150px] animate-float-delayed"></div>
      <div class="absolute w-[400px] h-[400px] rounded-full filter blur-[40px] opacity-50 bg-gradient-to-br from-green-400 to-green-500 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-float-more-delayed"></div>
    </div>

    <!-- Navigation -->
    <nav class="sticky top-0 z-50 mx-3 sm:mx-5 my-3 sm:my-5 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 shadow-lg"> <div class="flex justify-between items-center p-3 sm:p-4"> <div class="flex items-center gap-3"> <img src="/eco-mist-logo.png" alt="Eco-Mist Logo" class="w-10 h-10" /> <span class="text-white text-xl sm:text-2xl font-bold">Eco-Mist</span> </div> <div class="hidden md:flex items-center gap-6"> <a href="#features" class="text-white/80 hover:text-green-400 transition-colors font-medium">Features</a> <a href="#how-it-works" class="text-white/80 hover:text-green-400 transition-colors font-medium">How It Works</a> <a href="#benefits" class="text-white/80 hover:text-green-400 transition-colors font-medium">Benefits</a> <a href="#contact" class="text-white/80 hover:text-green-400 transition-colors font-medium">Contact</a> <router-link to="/login" class="bg-green-400/20 text-green-400 px-4 py-2 rounded-lg border border-green-400/30 hover:-translate-y-0.5 transition-transform active:scale-95 touch-manipulation">Login</router-link> </div> <button class="md:hidden w-10 h-10 flex items-center justify-center text-white bg-white/10 rounded-lg active:bg-white/20 touch-manipulation" @click="toggleMobileMenu" aria-label="Toggle menu" > <i-lucide-menu v-if="!mobileMenuOpen" class="w-5 h-5" /> <i-lucide-x v-else class="w-5 h-5" /> </button> </div> <div class="md:hidden overflow-hidden transition-all duration-300 ease-in-out" :class="mobileMenuOpen ? 'max-h-[300px] border-t border-white/10 p-4' : 'max-h-0'" > <div class="flex flex-col space-y-4"> <a href="#features" @click="closeMobileMenu" class="text-white/80 py-2 hover:text-green-400 transition-colors font-medium active:bg-white/5 rounded-lg px-3 touch-manipulation">Features</a> <a href="#how-it-works" @click="closeMobileMenu" class="text-white/80 py-2 hover:text-green-400 transition-colors font-medium active:bg-white/5 rounded-lg px-3 touch-manipulation">How It Works</a> <a href="#benefits" @click="closeMobileMenu" class="text-white/80 py-2 hover:text-green-400 transition-colors font-medium active:bg-white/5 rounded-lg px-3 touch-manipulation">Benefits</a> <a href="#contact" @click="closeMobileMenu" class="text-white/80 py-2 hover:text-green-400 transition-colors font-medium active:bg-white/5 rounded-lg px-3 touch-manipulation">Contact</a> <router-link to="/login" @click="closeMobileMenu" class="bg-green-400/20 text-green-400 px-4 py-2 rounded-lg border border-green-400/30 flex items-center justify-center active:scale-95 touch-manipulation">Login</router-link> </div> </div> </nav>

    <!-- Hero Section -->
    <section class="px-4 sm:px-6 py-8 sm:py-12 md:py-16">
      <div class="max-w-7xl mx-auto bg-white/5 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-white/10 shadow-xl overflow-hidden relative">
        <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shine"></div>
        <div class="flex flex-col md:flex-row items-center p-6 sm:p-10 md:p-12 gap-8 md:gap-12">
          <div class="w-full md:w-1/2 text-center md:text-left">
            <h1 class="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-4">IoT-Driven Aeroponics Farming</h1>
            <p class="text-green-400 text-lg sm:text-xl font-medium mb-6">
              Web-based System for Automated Management and Monitoring of Aeroponics Farming
            </p>
            <p class="text-white/80 mb-8 max-w-xl mx-auto md:mx-0">
              Revolutionize your farming with our cutting-edge IoT solution that optimizes growth, 
              reduces resource consumption, and delivers real-time insights for maximum yield.
            </p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <router-link to="/register" class="bg-gradient-to-r from-green-600 to-green-500 text-white font-semibold px-6 py-3 rounded-lg hover:-translate-y-1 transition-transform shadow-lg shadow-green-600/20 active:scale-95 touch-manipulation">Get Started</router-link>
              <a href="#demo" class="bg-white/10 text-white border border-white/20 font-semibold px-6 py-3 rounded-lg hover:bg-white/15 hover:-translate-y-1 transition-all active:scale-95 touch-manipulation">Watch Demo</a>
            </div>
          </div>
          <div class="w-full md:w-1/2 flex justify-center">
            <img src="/eco-mist-logo.png" alt="Eco-Mist System" class="w-48 h-48 sm:w-64 sm:h-64 md:w-72 md:h-72 filter drop-shadow-[0_0_20px_rgba(74,222,128,0.5)] animate-float-logo" />
          </div>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="px-4 sm:px-6 py-8 sm:py-12">
      <div class="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-lg p-6 sm:p-8 text-center transition-transform hover:-translate-y-1 duration-300">
          <div class="text-green-400 mb-4 flex justify-center">
            <i-lucide-droplets class="w-12 h-12" />
          </div>
          <div class="text-white text-3xl sm:text-4xl font-bold mb-2">95%</div>
          <div class="text-white/70">Water Savings</div>
        </div>
        <div class="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-lg p-6 sm:p-8 text-center transition-transform hover:-translate-y-1 duration-300">
          <div class="text-green-400 mb-4 flex justify-center">
            <i-lucide-zap class="w-12 h-12" />
          </div>
          <div class="text-white text-3xl sm:text-4xl font-bold mb-2">40%</div>
          <div class="text-white/70">Energy Efficient</div>
        </div>
        <div class="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-lg p-6 sm:p-8 text-center transition-transform hover:-translate-y-1 duration-300">
          <div class="text-green-400 mb-4 flex justify-center">
            <i-lucide-sprout class="w-12 h-12" />
          </div>
          <div class="text-white text-3xl sm:text-4xl font-bold mb-2">3x</div>
          <div class="text-white/70">Faster Growth</div>
        </div>
        <div class="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-lg p-6 sm:p-8 text-center transition-transform hover:-translate-y-1 duration-300">
          <div class="text-green-400 mb-4 flex justify-center">
            <i-lucide-bar-chart class="w-12 h-12" />
          </div>
          <div class="text-white text-3xl sm:text-4xl font-bold mb-2">24/7</div>
          <div class="text-white/70">Monitoring</div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="px-4 sm:px-6 py-16 sm:py-20">
      <h2 class="text-3xl sm:text-4xl font-bold text-white text-center mb-4">Advanced Features</h2>
      <div class="w-20 h-1 bg-gradient-to-r from-green-600 to-green-400 mx-auto rounded-full mb-12"></div>
      
      <div class="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        <div class="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-lg p-6 sm:p-8 text-center transition-transform hover:-translate-y-1 duration-300">
          <div class="text-green-400 mb-6 flex justify-center">
            <i-lucide-wifi class="w-12 h-12" />
          </div>
          <h3 class="text-white text-xl font-semibold mb-3">WLAN Connectivity</h3>
          <p class="text-white/70">Seamless wireless connectivity for all sensors and control systems with robust signal strength.</p>
        </div>
        <div class="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-lg p-6 sm:p-8 text-center transition-transform hover:-translate-y-1 duration-300">
          <div class="text-green-400 mb-6 flex justify-center">
            <i-lucide-cpu class="w-12 h-12" />
          </div>
          <h3 class="text-white text-xl font-semibold mb-3">IoT Sensors</h3>
          <p class="text-white/70">High-precision sensors for temperature, humidity, pH, nutrient levels, and water flow monitoring.</p>
        </div>
        <div class="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-lg p-6 sm:p-8 text-center transition-transform hover:-translate-y-1 duration-300">
          <div class="text-green-400 mb-6 flex justify-center">
            <i-lucide-gauge class="w-12 h-12" />
          </div>
          <h3 class="text-white text-xl font-semibold mb-3">Real-time Analytics</h3>
          <p class="text-white/70">Advanced analytics dashboard with real-time data visualization and historical trends.</p>
        </div>
        <div class="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-lg p-6 sm:p-8 text-center transition-transform hover:-translate-y-1 duration-300">
          <div class="text-green-400 mb-6 flex justify-center">
            <i-lucide-settings class="w-12 h-12" />
          </div>
          <h3 class="text-white text-xl font-semibold mb-3">Automated Control</h3>
          <p class="text-white/70">Smart automation for nutrient delivery, misting cycles, and environmental conditions.</p>
        </div>
        <div class="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-lg p-6 sm:p-8 text-center transition-transform hover:-translate-y-1 duration-300">
          <div class="text-green-400 mb-6 flex justify-center">
            <i-lucide-bell class="w-12 h-12" />
          </div>
          <h3 class="text-white text-xl font-semibold mb-3">Alert System</h3>
          <p class="text-white/70">Instant notifications for critical events, system anomalies, and maintenance requirements.</p>
        </div>
        <div class="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-lg p-6 sm:p-8 text-center transition-transform hover:-translate-y-1 duration-300">
          <div class="text-green-400 mb-6 flex justify-center">
            <i-lucide-smartphone class="w-12 h-12" />
          </div>
          <h3 class="text-white text-xl font-semibold mb-3">Responsive</h3>
          <p class="text-white/70">Control your farm from anywhere with our intuitive responsive web application for desktop or mobile view.</p>
        </div>
      </div>
    </section>

    <!-- How It Works Section -->
    <section id="how-it-works" class="px-4 sm:px-6 py-16 sm:py-20">
      <h2 class="text-3xl sm:text-4xl font-bold text-white text-center mb-4">How It Works</h2>
      <div class="w-20 h-1 bg-gradient-to-r from-green-600 to-green-400 mx-auto rounded-full mb-12"></div>
      
      <div class="max-w-4xl mx-auto bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-lg p-6 sm:p-10">
        <div class="space-y-8 sm:space-y-12">
          <div class="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start">
            <div class="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-green-600 to-green-500 rounded-full flex items-center justify-center text-white text-xl font-bold">1</div>
            <div>
              <h3 class="text-white text-xl font-semibold mb-2">Install Sensors</h3>
              <p class="text-white/70">Our plug-and-play sensors are easily installed in your aeroponic system.</p>
            </div>
          </div>
          <div class="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start">
            <div class="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-green-600 to-green-500 rounded-full flex items-center justify-center text-white text-xl font-bold">2</div>
            <div>
              <h3 class="text-white text-xl font-semibold mb-2">Connect to WLAN</h3>
              <p class="text-white/70">The system automatically connects to your wireless network for seamless data transmission.</p>
            </div>
          </div>
          <div class="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start">
            <div class="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-green-600 to-green-500 rounded-full flex items-center justify-center text-white text-xl font-bold">3</div>
            <div>
              <h3 class="text-white text-xl font-semibold mb-2">Monitor & Control</h3>
              <p class="text-white/70">Access your dashboard to view real-time data and control your system remotely.</p>
            </div>
          </div>
          <div class="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start">
            <div class="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-green-600 to-green-500 rounded-full flex items-center justify-center text-white text-xl font-bold">4</div>
            <div>
              <h3 class="text-white text-xl font-semibold mb-2">Optimize Growth</h3>
              <p class="text-white/70">Use AI-driven insights to optimize growing conditions and maximize yield.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Benefits Section -->
    <section id="benefits" class="px-4 sm:px-6 py-16 sm:py-20">
      <h2 class="text-3xl sm:text-4xl font-bold text-white text-center mb-4">Benefits of Eco-Mist</h2>
      <div class="w-20 h-1 bg-gradient-to-r from-green-600 to-green-400 mx-auto rounded-full mb-12"></div>
      
      <div class="max-w-6xl mx-auto space-y-8 sm:space-y-12">
        <div class="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-lg p-6 sm:p-10">
          <div class="flex flex-col lg:flex-row gap-8">
            <div class="lg:w-2/3">
              <h3 class="text-white text-2xl font-semibold mb-4">Resource Efficiency</h3>
              <p class="text-white/80 mb-6">
                Eco-Mist's precision control system reduces water usage by up to 95% compared to traditional farming methods. 
                Our smart nutrient delivery ensures plants receive exactly what they need, minimizing waste and maximizing efficiency.
              </p>
              <ul class="space-y-2">
                <li class="flex items-start gap-2 text-white/70">
                  <span class="text-green-400 mt-1 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                  </span>
                  Reduced water consumption
                </li>
                <li class="flex items-start gap-2 text-white/70">
                  <span class="text-green-400 mt-1 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                  </span>
                  Optimized nutrient usage
                </li>
                <li class="flex items-start gap-2 text-white/70">
                  <span class="text-green-400 mt-1 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                  </span>
                  Lower energy requirements
                </li>
                <li class="flex items-start gap-2 text-white/70">
                  <span class="text-green-400 mt-1 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                  </span>
                  Minimal environmental impact
                </li>
              </ul>
            </div>
            <div class="lg:w-1/3 flex items-center justify-center">
              <i-lucide-leaf class="w-32 h-32 text-green-400 filter drop-shadow-[0_0_10px_rgba(74,222,128,0.3)]" />
            </div>
          </div>
        </div>
        
        <div class="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-lg p-6 sm:p-10">
          <div class="flex flex-col lg:flex-row-reverse gap-8">
            <div class="lg:w-2/3">
              <h3 class="text-white text-2xl font-semibold mb-4">Increased Yield</h3>
              <p class="text-white/80 mb-6">
                By maintaining optimal growing conditions at all times, Eco-Mist helps plants grow up to 3 times faster 
                with higher nutrient density. Year-round production becomes possible regardless of external climate conditions.
              </p>
              <ul class="space-y-2">
                <li class="flex items-start gap-2 text-white/70">
                  <span class="text-green-400 mt-1 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                  </span>
                  Faster growth cycles
                </li>
                <li class="flex items-start gap-2 text-white/70">
                  <span class="text-green-400 mt-1 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                  </span>
                  Higher crop density
                </li>
                <li class="flex items-start gap-2 text-white/70">
                  <span class="text-green-400 mt-1 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                  </span>
                  Year-round production
                </li>
                <li class="flex items-start gap-2 text-white/70">
                  <span class="text-green-400 mt-1 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                  </span>
                  Improved crop quality
                </li>
              </ul>
            </div>
            <div class="lg:w-1/3 flex items-center justify-center">
              <i-lucide-trending-up class="w-32 h-32 text-green-400 filter drop-shadow-[0_0_10px_rgba(74,222,128,0.3)]" />
            </div>
          </div>
        </div>
        
        <div class="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-lg p-6 sm:p-10">
          <div class="flex flex-col lg:flex-row gap-8">
            <div class="lg:w-2/3">
              <h3 class="text-white text-2xl font-semibold mb-4">Data-Driven Decisions</h3>
              <p class="text-white/80 mb-6">
                Our advanced analytics platform provides actionable insights based on historical data and real-time monitoring. 
                Make informed decisions to continuously improve your farming operation and adapt to changing conditions.
              </p>
              <ul class="space-y-2">
                <li class="flex items-start gap-2 text-white/70">
                  <span class="text-green-400 mt-1 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                  </span>
                  Real-time monitoring
                </li>
                <li class="flex items-start gap-2 text-white/70">
                  <span class="text-green-400 mt-1 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                  </span>
                  Historical trend analysis
                </li>
                <li class="flex items-start gap-2 text-white/70">
                  <span class="text-green-400 mt-1 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                  </span>
                  Predictive maintenance
                </li>
                <li class="flex items-start gap-2 text-white/70">
                  <span class="text-green-400 mt-1 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                  </span>
                  Continuous optimization
                </li>
              </ul>
            </div>
            <div class="lg:w-1/3 flex items-center justify-center">
              <i-lucide-line-chart class="w-32 h-32 text-green-400 filter drop-shadow-[0_0_10px_rgba(74,222,128,0.3)]" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section id="contact" class="px-4 sm:px-6 py-16 sm:py-20">
      <div class="max-w-3xl mx-auto bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-lg p-6 sm:p-10 text-center">
        <h2 class="text-2xl sm:text-3xl font-bold text-white mb-4">Ready to Transform Your Farming?</h2>
        <p class="text-white/80 mb-8">Get in touch with our team to schedule a demonstration or learn more about how Eco-Mist can revolutionize your aeroponic farming.</p>
        
        <form @submit.prevent="submitContactForm" class="text-left">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6">
            <div class="relative">
              <input 
                type="text" 
                v-model="contactForm.name" 
                :class="{ 'pt-6': contactForm.name }"
                required
                class="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-green-400 focus:outline-none focus:ring-1 focus:ring-green-400 transition-all"
              />
              <label 
                :class="{ 'text-xs top-2': contactForm.name, 'top-1/2 -translate-y-1/2': !contactForm.name }"
                class="absolute left-4 text-white/60 transition-all pointer-events-none"
              >
                Full Name
              </label>
            </div>
            <div class="relative">
              <input 
                type="email" 
                v-model="contactForm.email" 
                :class="{ 'pt-6': contactForm.email }"
                required
                class="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-green-400 focus:outline-none focus:ring-1 focus:ring-green-400 transition-all"
              />
              <label 
                :class="{ 'text-xs top-2': contactForm.email, 'top-1/2 -translate-y-1/2': !contactForm.email }"
                class="absolute left-4 text-white/60 transition-all pointer-events-none"
              >
                Email Address
              </label>
            </div>
          </div>
          <div class="relative mb-6">
            <textarea 
              v-model="contactForm.message" 
              :class="{ 'pt-6': contactForm.message }"
              required
              rows="4"
              class="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-green-400 focus:outline-none focus:ring-1 focus:ring-green-400 transition-all resize-y"
            ></textarea>
            <label 
              :class="{ 'text-xs top-2': contactForm.message, 'top-4': !contactForm.message }"
              class="absolute left-4 text-white/60 transition-all pointer-events-none"
            >
              Your Message
            </label>
          </div>
          <button 
            type="submit" 
            class="w-full bg-gradient-to-r from-green-600 to-green-500 text-white font-semibold px-6 py-3 rounded-lg hover:-translate-y-1 transition-transform shadow-lg shadow-green-600/20 active:scale-95 touch-manipulation"
          >
            <span v-if="!submitting">Send Message</span>
            <span v-else class="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
          </button>
        </form>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-black/30 backdrop-blur-md mt-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 pt-12 pb-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <div class="flex items-center gap-3 mb-6">
              <img src="/eco-mist-logo.png" alt="Eco-Mist Logo" class="w-12 h-12" />
              <span class="text-white text-2xl font-bold">Eco-Mist</span>
            </div>
          </div>
          
          <div>
            <h4 class="text-white font-semibold text-lg mb-4">Product</h4>
            <div class="space-y-3">
              <a href="#features" class="block text-white/70 hover:text-green-400 transition-colors">Features</a>
              <a href="#how-it-works" class="block text-white/70 hover:text-green-400 transition-colors">How It Works</a>
              <a href="#benefits" class="block text-white/70 hover:text-green-400 transition-colors">Benefits</a>
              <a href="#pricing" class="block text-white/70 hover:text-green-400 transition-colors">Pricing</a>
            </div>
          </div>
          
          <div>
            <h4 class="text-white font-semibold text-lg mb-4">Company</h4>
            <div class="space-y-3">
              <a href="/about" class="block text-white/70 hover:text-green-400 transition-colors">About Us</a>
              <a href="/blog" class="block text-white/70 hover:text-green-400 transition-colors">Blog</a>
              <a href="/careers" class="block text-white/70 hover:text-green-400 transition-colors">Careers</a>
              <a href="/contact" class="block text-white/70 hover:text-green-400 transition-colors">Contact</a>
            </div>
          </div>
          
          <div>
            <h4 class="text-white font-semibold text-lg mb-4">Connect</h4>
            <div class="flex gap-3 mb-6">
              <a href="#" class="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-green-400 hover:-translate-y-1 transition-all">
                <i-lucide-facebook class="w-4 h-4" />
              </a>
              <a href="#" class="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-green-400 hover:-translate-y-1 transition-all">
                <i-lucide-twitter class="w-4 h-4" />
              </a>
              <a href="#" class="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-green-400 hover:-translate-y-1 transition-all">
                <i-lucide-instagram class="w-4 h-4" />
              </a>
              <a href="#" class="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-green-400 hover:-translate-y-1 transition-all">
                <i-lucide-linkedin class="w-4 h-4" />
              </a>
            </div>
            <p class="text-white/70 mb-2">Subscribe to our newsletter</p>
            <div class="flex">
              <input 
                type="email" 
                placeholder="Your email" 
                class="flex-1 bg-white/5 border border-white/10 rounded-l-lg px-3 py-2 text-white focus:outline-none focus:border-green-400"
              />
              <button class="bg-green-500 text-white p-2 rounded-r-lg hover:bg-green-600 transition-colors active:scale-95 touch-manipulation">
                <i-lucide-send class="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
        
        <div class="border-t border-white/10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p class="text-white/50 text-sm">&copy; {{ new Date().getFullYear() }} Eco-Mist. All rights reserved.</p>
          <div class="flex gap-6">
            <a href="/privacy" class="text-white/50 text-sm hover:text-white transition-colors">Privacy Policy</a>
            <a href="/terms" class="text-white/50 text-sm hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const mobileMenuOpen = ref(false);
const submitting = ref(false);

const contactForm = ref({
  name: '',
  email: '',
  message: ''
});

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
};

const closeMobileMenu = () => {
  mobileMenuOpen.value = false;
};

const submitContactForm = async () => {
  submitting.value = true;
  
  // Simulate form submission
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Reset form
  contactForm.value = {
    name: '',
    email: '',
    message: ''
  };
  
  submitting.value = false;
  alert('Thank you for your message! We will get back to you soon.');
};
</script>

<style>

@keyframes float {
  0%, 100% { transform: translate(0, 0); }
  25% { transform: translate(50px, -50px); }
  50% { transform: translate(0, 75px); }
  75% { transform: translate(-50px, -25px); }
}

@keyframes float-logo {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

@keyframes shine {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.animate-float {
  animation: float 20s infinite ease-in-out;
}

.animate-float-delayed {
  animation: float 20s infinite ease-in-out;
  animation-delay: -5s;
}

.animate-float-more-delayed {
  animation: float 20s infinite ease-in-out;
  animation-delay: -10s;
}

.animate-float-logo {
  animation: float-logo 6s infinite ease-in-out;
}

.animate-shine {
  animation: shine 6s infinite linear;
}

/* For better touch interactions */
.touch-manipulation {
  touch-action: manipulation;
}

@media (prefers-reduced-motion: reduce) {
  .animate-float,
  .animate-float-delayed,
  .animate-float-more-delayed,
  .animate-float-logo,
  .animate-shine {
    animation: none;
  }
  
  .active\:scale-95:active,
  .hover\:-translate-y-1:hover {
    transform: none;
  }
}
</style>