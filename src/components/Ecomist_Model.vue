```vue type="vue" project="Lettuce Disease Detector" file="LettuceDiseaseDetector.vue"
[v0-no-op-code-block-prefix]<template>
  <div class="detector-wrapper">
    <!-- Animated Background -->
    <div class="gradient-bg">
      <div class="gradient-circle c1"></div>
      <div class="gradient-circle c2"></div>
      <div class="gradient-circle c3"></div>
    </div>

    <!-- Glass Card with Two-Column Layout -->
    <div class="glass-card">
      <div class="card-content">
        <!-- Header with Logo (Full Width) -->
        <div class="header">
          <div class="logo">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon">
              <path d="M2 6c1.5 0 2 .5 3 .5s1.5-.5 3-.5 2 .5 3 .5 1.5-.5 3-.5 2 .5 3 .5 1.5-.5 3-.5"></path>
              <path d="M2 12c1.5 0 2 .5 3 .5s1.5-.5 3-.5 2 .5 3 .5 1.5-.5 3-.5 2 .5 3 .5 1.5-.5 3-.5"></path>
              <path d="M2 18c1.5 0 2 .5 3 .5s1.5-.5 3-.5 2 .5 3 .5 1.5-.5 3-.5 2 .5 3 .5 1.5-.5 3-.5"></path>
            </svg>
          </div>
          <h2 class="title">Lettuce Disease Detector</h2>
          <p class="subtitle">Upload an image to analyze plant health</p>
        </div>

        <!-- Two-Column Layout -->
        <div class="two-column-layout">
          <!-- Left Column: Image and Upload Controls -->
          <div class="left-column">
            <!-- File Info -->
            <div v-if="file" class="file-info">
              <span class="file-name">{{ file.name }}</span>
              <button @click="clearFile" class="clear-btn" type="button">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <!-- Image Preview or Upload Area -->
            <div class="image-container">
              <div v-if="imagePreview" class="image-preview">
                <img :src="imagePreview" alt="Preview" />
              </div>
              <div v-else class="upload-area">
                <label for="file-upload" class="upload-btn">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="upload-icon">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                  </svg>
                  Choose Image
                </label>
                <input id="file-upload" type="file" @change="onFileChange" accept="image/*" />
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="action-buttons">
              <button 
                v-if="!result && file"
                @click="predictImage" 
                class="analyze-btn"
                :disabled="loading"
              >
                <span v-if="!loading">Analyze Image</span>
                <span v-else class="loader"></span>
              </button>
              <button 
                v-if="result"
                @click="clearFile" 
                class="reset-btn"
              >
                Analyze Another Image
              </button>
            </div>
          </div>

          <!-- Right Column: Results and Recommendations -->
          <div class="right-column">
            <!-- Loading State -->
            <div v-if="loading" class="loading-state">
              <div class="loader"></div>
              <p>Analyzing image...</p>
            </div>

            <!-- Error Message -->
            <div v-if="error" class="error-message">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="error-icon">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <p>{{ error }}</p>
            </div>

            <!-- Results Section -->
            <div v-if="result" class="results-section">
              <!-- Prediction with Confidence -->
              <div class="result-card">
                <div class="result-header" :class="resultClass">
                  <div class="result-icon">
                    <svg v-if="result.prediction === 'Healthy'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    <svg v-else-if="result.prediction === 'Bacterial'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
                      <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                      <line x1="12" y1="19" x2="12" y2="22"></line>
                    </svg>
                    <svg v-else-if="result.prediction === 'Fungal'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M2.27 21.7s9.87-3.5 12.73-6.36a4.5 4.5 0 0 0-6.36-6.37C5.77 11.84 2.27 21.7 2.27 21.7zM15.42 15.42l6.37-6.37"></path>
                      <path d="M19.73 11.06 19.5 11l-.23.06a2.5 2.5 0 0 0-1.7 1.7 2.5 2.5 0 0 0 1.7 1.7l.23.06.23-.06a2.5 2.5 0 0 0 1.7-1.7 2.5 2.5 0 0 0-1.7-1.7z"></path>
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="16" x2="12" y2="12"></line>
                      <line x1="12" y1="8" x2="12.01" y2="8"></line>
                    </svg>
                  </div>
                  <div class="result-text">
                    <h3>{{ result.prediction }}</h3>
                    <p class="confidence">Confidence: {{ (result.confidence * 100).toFixed(2) }}%</p>
                  </div>
                </div>

                <div class="probabilities">
                  <h4>Analysis Results</h4>
                  <div class="probability-bars">
                    <div v-for="(prob, label) in result.class_probabilities" :key="label" class="prob-item">
                      <div class="prob-label">{{ label }}</div>
                      <div class="prob-bar-container">
                        <div class="prob-bar" :style="{ width: `${prob * 100}%` }"></div>
                        <span class="prob-value">{{ (prob * 100).toFixed(1) }}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Recommendations Section -->
              <div class="recommendations-card">
                <h4>Recommendations</h4>
                <ul>
                  <li v-for="(rec, index) in result.recommendations" :key="index">
                    {{ rec }}
                  </li>
                </ul>
              </div>
            </div>

            <!-- Placeholder for Empty State -->
            <div v-if="!result && !loading && !error" class="empty-state">
              <p>Upload and analyze an image to see results here</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      file: null,
      imagePreview: null,
      result: null,
      loading: false,
      error: null
    };
  },
  computed: {
    resultClass() {
      if (!this.result) return '';
      
      switch(this.result.prediction) {
        case 'Healthy': return 'healthy';
        case 'Bacterial': return 'bacterial';
        case 'Fungal': return 'fungal';
        default: return 'unknown';
      }
    }
  },
  methods: {
    // Handle file input change
    onFileChange(event) {
      this.file = event.target.files[0];
      this.result = null;
      this.error = null;
      
      // Create image preview
      if (this.file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.imagePreview = e.target.result;
        };
        reader.readAsDataURL(this.file);
      } else {
        this.imagePreview = null;
      }
    },

    // Clear selected file and reset
    clearFile() {
      this.file = null;
      this.imagePreview = null;
      this.result = null;
      this.error = null;
    },

    // Send the image to the Flask API
    async predictImage() {
      if (!this.file) {
        this.error = "Please select an image first";
        return;
      }

      this.loading = true;
      this.error = null;
      
      const formData = new FormData();
      formData.append('file', this.file);

      try {
        const response = await axios.post('http://127.0.0.1:5000/predict', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        if (response.data.status === 'success') {
          this.result = response.data;
        } else {
          this.error = response.data.error || "An unknown error occurred";
        }
      } catch (error) {
        console.error("Error during prediction", error);
        this.error = error.response?.data?.error || "Failed to connect to the server";
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
.detector-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
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

.glass-card {
  position: relative;
  width: 100%;
  max-width: 1100px;
  background: rgba(15, 23, 42, 0.8);
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
    rgba(255, 255, 255, 0.05),
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

.card-content {
  padding: 40px;
}

/* Header Styles */
.header {
  text-align: center;
  margin-bottom: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.logo {
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(34, 197, 94, 0.2);
  border-radius: 50%;
  padding: 12px;
  margin-bottom: 16px;
}

.logo .icon {
  width: 100%;
  height: 100%;
  color: #22c55e;
}

.title {
  color: white;
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 8px;
}

.subtitle {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.95rem;
}

/* Two-Column Layout */
.two-column-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 50px;
}

/* Left Column Styles */
.left-column {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.file-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
}

.file-name {
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 80%;
}

.clear-btn {
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.clear-btn svg {
  width: 16px;
  height: 16px;
}

.clear-btn:hover {
  color: #ef4444;
}

.image-container {
  flex-grow: 1;
  min-height: 350px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-preview {
  width: 100%;
  height: 100%;
}

.image-preview img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
}

.upload-area {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

input[type="file"] {
  display: none;
}

.upload-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 24px;
  background: rgba(34, 197, 94, 0.1);
  border: 1px dashed #22c55e;
  border-radius: 8px;
  color: #22c55e;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.upload-btn:hover {
  background: rgba(34, 197, 94, 0.2);
}

.upload-icon {
  width: 18px;
  height: 18px;
}

.action-buttons {
  display: flex;
  gap: 10px;
}

.analyze-btn, .reset-btn {
  flex: 1;
  padding: 12px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.analyze-btn {
  background: #22c55e;
  color: white;
  border: none;
}

.analyze-btn:hover:not(:disabled) {
  background: #16a34a;
}

.analyze-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.reset-btn {
  background: transparent;
  border: 1px solid #22c55e;
  color: #22c55e;
}

.reset-btn:hover {
  background: rgba(34, 197, 94, 0.1);
}

/* Right Column Styles */
.right-column {
  display: flex;
  flex-direction: column;
  gap: 25px;
  min-height: 450px;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  height: 100%;
  padding: 30px;
}

.loading-state p {
  color: rgba(255, 255, 255, 0.7);
}

.loader {
  width: 30px;
  height: 30px;
  border: 3px solid rgba(34, 197, 94, 0.3);
  border-radius: 50%;
  border-top-color: #22c55e;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.error-message {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px;
  background: rgba(239, 68, 68, 0.1);
  border-left: 3px solid #ef4444;
  border-radius: 8px;
  color: #ef4444;
}

.error-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.results-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
  animation: fadeIn 0.5s ease-out;
}

.result-card, .recommendations-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  overflow: hidden;
  padding-bottom: 10px;
}

.result-header {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.result-header.healthy {
  background: rgba(34, 197, 94, 0.1);
  border-left: 4px solid #22c55e;
}

.result-header.bacterial {
  background: rgba(239, 68, 68, 0.1);
  border-left: 4px solid #ef4444;
}

.result-header.fungal {
  background: rgba(234, 179, 8, 0.1);
  border-left: 4px solid #eab308;
}

.result-header.unknown {
  background: rgba(59, 130, 246, 0.1);
  border-left: 4px solid #3b82f6;
}

.result-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  padding: 8px;
  flex-shrink: 0;
}

.result-header.healthy .result-icon {
  background: rgba(34, 197, 94, 0.2);
  color: #22c55e;
}

.result-header.bacterial .result-icon {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
}

.result-header.fungal .result-icon {
  background: rgba(234, 179, 8, 0.2);
  color: #eab308;
}

.result-header.unknown .result-icon {
  background: rgba(59, 130, 246, 0.2);
  color: #3b82f6;
}

.result-icon svg {
  width: 100%;
  height: 100%;
}

.result-text {
  flex-grow: 1;
}

.result-text h3 {
  margin: 0 0 4px 0;
  font-size: 18px;
  font-weight: 600;
  color: white;
}

.confidence {
  margin: 0;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
}

.probabilities {
  padding: 20px;
}

.probabilities h4, .recommendations-card h4 {
  margin-top: 0;
  margin-bottom: 16px;
  color: white;
  font-size: 16px;
  font-weight: 500;
}

.probability-bars {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.prob-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.prob-label {
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
}

.prob-bar-container {
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
  position: relative;
}

.prob-bar {
  height: 100%;
  background: #22c55e;
  border-radius: 4px;
  transition: width 0.5s ease-out;
}

.result-header.bacterial ~ .probabilities .prob-bar {
  background: #ef4444;
}

.result-header.fungal ~ .probabilities .prob-bar {
  background: #eab308;
}

.result-header.unknown ~ .probabilities .prob-bar {
  background: #3b82f6;
}

.prob-value {
  position: absolute;
  right: 0;
  top: -18px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
}

.recommendations-card {
  padding: 20px;
}

.recommendations-card ul {
  margin: 0;
  padding-left: 20px;
}

.recommendations-card li {
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 15px;
  line-height: 1.6;
  font-size: 14px;
}

.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: rgba(255, 255, 255, 0.5);
  font-style: italic;
  text-align: center;
  padding: 30px;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive Adjustments */
@media (max-width: 992px) {
  .two-column-layout {
    grid-template-columns: 1fr;
  }
  
  .glass-card {
    max-width: 700px;
  }
  
  .image-container {
    min-height: 300px;
  }
}

@media (max-width: 576px) {
  .card-content {
    padding: 25px;
  }
  
  .image-container {
    min-height: 250px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .gradient-circle {
    animation: none;
  }

  .glass-card::before {
    animation: none;
  }
}
</style>