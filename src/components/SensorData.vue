<template>
    <div class="sensor-wrapper">
      <!-- Animated Background -->
      <div class="gradient-bg">
        <div class="gradient-circle c1"></div>
        <div class="gradient-circle c2"></div>
        <div class="gradient-circle c3"></div>
      </div>
  
      <header class="glass-card header">
        <div class="header-content">
          <h1>Eco-Mist Monitoring System</h1>
          <div class="live-indicator">
            <div class="pulse"></div>
            <span>Live Monitoring</span>
          </div>
        </div>
      </header>
  
      <main>
        <div class="sensor-grid">
          <!-- Air Temperature -->
          <div class="glass-card sensor-card">
            <div class="sensor-content">
              <div class="sensor-icon">
                <i-lucide-thermometer />
              </div>
              <div class="sensor-info">
                <h3>Air Temperature</h3>
                <div class="sensor-value">
                  <span class="value">{{ sensorData.air_temperature }}</span>
                  <span class="unit">°C</span>
                </div>
              </div>
            </div>
            <div class="sensor-status">
              <div class="status-indicator" 
                :class="getStatusClass(sensorData.air_temperature, 20, 30)">
              </div>
              <span>{{ getStatusText(sensorData.air_temperature, 20, 30) }}</span>
            </div>
          </div>
  
          <!-- Water Temperature -->
          <div class="glass-card sensor-card">
            <div class="sensor-content">
              <div class="sensor-icon">
                <i-lucide-droplets />
              </div>
              <div class="sensor-info">
                <h3>Water Temperature</h3>
                <div class="sensor-value">
                  <span class="value">{{ sensorData.water_temperature }}</span>
                  <span class="unit">°C</span>
                </div>
              </div>
            </div>
            <div class="sensor-status">
              <div class="status-indicator" 
                :class="getStatusClass(sensorData.water_temperature, 22, 28)">
              </div>
              <span>{{ getStatusText(sensorData.water_temperature, 22, 28) }}</span>
            </div>
          </div>
  
          <!-- Humidity -->
          <div class="glass-card sensor-card">
            <div class="sensor-content">
              <div class="sensor-icon">
                <i-lucide-cloud-rain />
              </div>
              <div class="sensor-info">
                <h3>Humidity</h3>
                <div class="sensor-value">
                  <span class="value">{{ sensorData.humidity }}</span>
                  <span class="unit">%</span>
                </div>
              </div>
            </div>
            <div class="sensor-status">
              <div class="status-indicator" 
                :class="getStatusClass(sensorData.humidity, 40, 60)">
              </div>
              <span>{{ getStatusText(sensorData.humidity, 40, 60) }}</span>
            </div>
          </div>
  
          <!-- Water Level -->
          <div class="glass-card sensor-card">
            <div class="sensor-content">
              <div class="sensor-icon">
                <i-lucide-wave />
              </div>
              <div class="sensor-info">
                <h3>Water Level</h3>
                <div class="sensor-value">
                  <span class="value">{{ sensorData.water_level }}</span>
                  <span class="unit">cm</span>
                </div>
              </div>
            </div>
            <div class="sensor-status">
              <div class="status-indicator" 
                :class="getStatusClass(sensorData.water_level, 10, 20)">
              </div>
              <span>{{ getStatusText(sensorData.water_level, 10, 20) }}</span>
            </div>
          </div>
  
          <!-- pH Level -->
          <div class="glass-card sensor-card">
            <div class="sensor-content">
              <div class="sensor-icon">
                <i-lucide-flask />
              </div>
              <div class="sensor-info">
                <h3>pH Level</h3>
                <div class="sensor-value">
                  <span class="value">{{ sensorData.ph }}</span>
                </div>
              </div>
            </div>
            <div class="sensor-status">
              <div class="status-indicator" 
                :class="getStatusClass(sensorData.ph, 6.5, 7.5)">
              </div>
              <span>{{ getStatusText(sensorData.ph, 6.5, 7.5) }}</span>
            </div>
          </div>
  
          <!-- TDS -->
          <div class="glass-card sensor-card">
            <div class="sensor-content">
              <div class="sensor-icon">
                <i-lucide-gauge />
              </div>
              <div class="sensor-info">
                <h3>TDS Level</h3>
                <div class="sensor-value">
                  <span class="value">{{ sensorData.tds }}</span>
                  <span class="unit">ppm</span>
                </div>
              </div>
            </div>
            <div class="sensor-status">
              <div class="status-indicator" 
                :class="getStatusClass(sensorData.tds, 100, 500)">
              </div>
              <span>{{ getStatusText(sensorData.tds, 100, 500) }}</span>
            </div>
          </div>
        </div>
  
        <div class="glass-card debug-panel">
          <h2>System Status</h2>
          <pre>{{ JSON.stringify(sensorData, null, 2) }}</pre>
        </div>
      </main>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, onUnmounted } from 'vue';
  import { rdb } from '../firebase.js';
  import { ref as dbRef, onValue, query, limitToLast } from 'firebase/database';
  
  const sensorData = ref({
    air_temperature: 0,
    water_temperature: 0,
    humidity: 0,
    water_level: 0,
    ph: 0,
    tds: 0
  });
  
  const getStatusClass = (value, min, max) => {
    if (!value) return 'status-no-data';
    if (value >= min && value <= max) return 'status-optimal';
    if (value >= min - (min * 0.2) && value <= max + (max * 0.2)) return 'status-warning';
    return 'status-critical';
  };
  
  const getStatusText = (value, min, max) => {
    if (!value) return 'No Data';
    if (value >= min && value <= max) return 'Optimal';
    if (value >= min - (min * 0.2) && value <= max + (max * 0.2)) return 'Warning';
    return 'Critical';
  };
  
  onMounted(() => {
    const sensorRef = query(dbRef(rdb, 'sensor_data'), limitToLast(1));
    
    const unsubscribe = onValue(sensorRef, (snapshot) => {
      if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
          sensorData.value = childSnapshot.val();
        });
        console.log('Received data:', sensorData.value);
      } else {
        console.log('No data available');
      }
    }, (error) => {
      console.error('Error fetching data:', error);
    });
  
    onUnmounted(() => {
      unsubscribe();
    });
  });
  </script>
  
  <style scoped>
  /* Main container and background */
  .sensor-wrapper {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    padding: 20px;
    position: relative;
    overflow: hidden;
  }
  
  .gradient-bg {
    position: fixed;
    inset: 0;
    background: #0f172a;
    z-index: 0;
  }
  
  .gradient-circle {
    position: absolute;
    border-radius: 50%;
    filter: blur(40px);
    opacity: 0.5;
    animation: float 20s infinite ease-in-out;
  }
  
  .c1 {
    width: 600px;
    height: 600px;
    background: radial-gradient(circle at center, #22c55e, #16a34a);
    top: -200px;
    left: -200px;
    animation-delay: 0s;
  }
  
  .c2 {
    width: 500px;
    height: 500px;
    background: radial-gradient(circle at center, #15803d, #166534);
    bottom: -150px;
    right: -150px;
    animation-delay: -5s;
  }
  
  .c3 {
    width: 400px;
    height: 400px;
    background: radial-gradient(circle at center, #4ade80, #22c55e);
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    animation-delay: -10s;
  }
  
  @keyframes float {
    0%, 100% {
      transform: translate(0, 0);
    }
    25% {
      transform: translate(50px, -50px);
    }
    50% {
      transform: translate(0, 75px);
    }
    75% {
      transform: translate(-50px, -25px);
    }
  }
  
  /* Glass card styling */
  .glass-card {
    position: relative;
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-radius: 24px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.2);
    overflow: hidden;
    z-index: 1;
  }
  
  .glass-card::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      45deg,
      transparent,
      rgba(255, 255, 255, 0.1),
      transparent
    );
    animation: shine 6s infinite linear;
  }
  
  @keyframes shine {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(100%);
    }
  }
  
  /* Header styling */
  .header {
    margin-bottom: 24px;
  }
  
  .header-content {
    padding: 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .header h1 {
    color: white;
    font-size: 2rem;
    font-weight: 700;
    margin: 0;
  }
  
  .live-indicator {
    display: flex;
    align-items: center;
    gap: 8px;
    color: white;
  }
  
  .pulse {
    width: 10px;
    height: 10px;
    background-color: #4ade80;
    border-radius: 50%;
    animation: pulse 2s infinite;
  }
  
  @keyframes pulse {
    0% {
      transform: scale(1);
      opacity: 1;
    }
    50% {
      transform: scale(1.5);
      opacity: 0.5;
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }
  
  /* Sensor grid layout */
  .sensor-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 24px;
    margin-bottom: 24px;
  }
  
  .sensor-card {
    transition: transform 0.3s ease;
  }
  
  .sensor-card:hover {
    transform: translateY(-5px);
  }
  
  .sensor-content {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    padding: 24px;
    padding-bottom: 16px;
  }
  
  .sensor-icon {
    padding: 12px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    color: #4ade80;
  }
  
  .sensor-info {
    flex: 1;
  }
  
  .sensor-info h3 {
    color: white;
    font-size: 1.1rem;
    margin-bottom: 8px;
    font-weight: 600;
  }
  
  .sensor-value {
    display: flex;
    align-items: baseline;
    gap: 4px;
  }
  
  .value {
    color: white;
    font-size: 1.75rem;
    font-weight: 700;
  }
  
  .unit {
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.875rem;
  }
  
  .sensor-status {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 16px 24px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  /* Status indicators */
  .status-indicator {
    width: 10px;
    height: 10px;
    border-radius: 50%;
  }
  
  .status-optimal {
    background-color: #4ade80;
  }
  
  .status-warning {
    background-color: #fbbf24;
  }
  
  .status-critical {
    background-color: #ef4444;
  }
  
  .status-no-data {
    background-color: rgba(255, 255, 255, 0.3);
  }
  
  .sensor-status span {
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.875rem;
  }
  
  /* Debug panel */
  .debug-panel {
    padding: 24px;
  }
  
  .debug-panel h2 {
    color: white;
    font-size: 1.25rem;
    margin-bottom: 16px;
    font-weight: 600;
  }
  
  .debug-panel pre {
    color: rgba(255, 255, 255, 0.7);
    font-family: monospace;
    font-size: 0.875rem;
    overflow-x: auto;
    padding: 12px;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 8px;
  }
  
  /* Responsive design */
  @media (max-width: 768px) {
    .sensor-wrapper {
      padding: 16px;
    }
  
    .header-content {
      flex-direction: column;
      gap: 16px;
      text-align: center;
      padding: 20px;
    }
  
    .sensor-grid {
      grid-template-columns: 1fr;
      gap: 16px;
    }
  }
  
  /* Custom scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  
  ::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 4px;
  }
  
  ::-webkit-scrollbar-thumb {
    background: rgba(74, 222, 128, 0.3);
    border-radius: 4px;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background: rgba(74, 222, 128, 0.5);
  }
  
  @media (prefers-reduced-motion: reduce) {
    .gradient-circle {
      animation: none;
    }
  
    .glass-card::before {
      animation: none;
    }
  
    .pulse {
      animation: none;
    }
  }
  </style>