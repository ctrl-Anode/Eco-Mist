<template>
  <div class="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header Section -->
      <div class="bg-white rounded-2xl shadow-xl p-6 mb-8">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 mb-2">🌱 Crop Disease Detection</h1>
            <p class="text-gray-600">AI-powered Lettuce Health Analysis and Monitoring</p>
          </div>
        </div>

        <!-- Model Information -->
        <div v-if="modelInfo" class="bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl p-4 border border-emerald-200">
          <h3 class="text-lg font-semibold text-emerald-800 mb-3">Model Information</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div class="bg-white rounded-lg p-3 shadow-sm">
              <p class="text-gray-500 font-medium">Model</p>
              <p class="text-gray-900 font-semibold">{{ modelInfo.model_name }}</p>
            </div>
            <div class="bg-white rounded-lg p-3 shadow-sm">
              <p class="text-gray-500 font-medium">Version</p>
              <p class="text-gray-900 font-semibold">{{ modelInfo.version }}</p>
            </div>
            <div class="bg-white rounded-lg p-3 shadow-sm">
              <p class="text-gray-500 font-medium">Input Shape</p>
              <p class="text-gray-900 font-semibold">[{{ modelInfo.input_shape.join(', ') }}]</p>
            </div>
            <div class="bg-white rounded-lg p-3 shadow-sm">
              <p class="text-gray-500 font-medium">Classes</p>
              <p class="text-gray-900 font-semibold">{{ modelInfo.classes.length }} types</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab Navigation -->
      <div class="bg-white rounded-2xl shadow-xl mb-8">
        <div class="border-b border-gray-200">
          <nav class="flex space-x-8 px-6" aria-label="Tabs">
            <button
              v-for="tab in tabs"
              :key="tab"
              @click="activeTab = tab"
              :class="[
                'py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200',
                activeTab === tab 
                  ? 'border-emerald-500 text-emerald-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              {{ tab }}
            </button>
            <!-- Toggle Compare Mode Button -->
<button
  class="ml-auto text-sm text-indigo-600 hover:underline"
  @click="compareMode = !compareMode"
>
  {{ compareMode ? '← Back to Single Image Mode' : '🧪 Switch to Compare Mode' }}
</button>

          </nav>
        </div>

        <!-- Tab Content -->
        <div class="p-6">
          <!-- Detector Tab -->
          <div v-if="activeTab === 'Detector'" class="space-y-8">

             <!-- 🧪 Compare Mode ON -->
  <div v-if="compareMode">
    <!-- Compare Mode -->
            <div class="bg-gray-50 rounded-xl p-6">
              <h3 class="text-xl font-semibold text-gray-900 mb-4">⚖️ Compare Images</h3>
              
              <div v-if="compareMode" class="space-y-6">
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div class="space-y-3">
                    <label class="block text-sm font-medium text-gray-700">Image 1</label>
                    <div
  :class="['border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition', 
  dragOver1 ? 'border-blue-500 bg-blue-50' : 'border-blue-300']"
@dragover.prevent="dragOver1 = true"
@dragleave.prevent="dragOver1 = false"
  @drop.prevent="handleDropCompare($event, 1); dragOver1 = false"
  @click="$refs.fileDrop1.click()"
>
  <p class="text-sm text-blue-600">📂 Drag & drop or click to upload Image 1</p>
  <input 
    type="file" 
    accept="image/*" 
    @change="e => handleCompareFile(e, 1)"
    ref="fileDrop1"
    class="hidden"
  />
</div>

                    <div v-if="filePreview1" class="rounded-lg overflow-hidden shadow-md">
                      <img :src="filePreview1" class="w-full h-48 object-cover" />
                    </div>
                  </div>
                  
                  <div class="space-y-3">
                    <label class="block text-sm font-medium text-gray-700">Image 2</label>
                   <div
  :class="['border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition', 
  dragOver2 ? 'border-blue-500 bg-blue-50' : 'border-blue-300']"
  @dragover.prevent="dragOver2 = true"
@dragleave.prevent="dragOver2 = false"
  @drop.prevent="handleDropCompare($event, 2); dragOver2 = false"
  @click="$refs.fileDrop2.click()"
>
  <p class="text-sm text-blue-600">📂 Drag & drop or click to upload Image 2</p>
  <input 
    type="file" 
    accept="image/*" 
    @change="e => handleCompareFile(e, 2)"
    ref="fileDrop2"
    class="hidden"
  />
</div>

                    <div v-if="filePreview2" class="rounded-lg overflow-hidden shadow-md">
                      <img :src="filePreview2" class="w-full h-48 object-cover" />
                    </div>
                  </div>
                </div>

                <div class="flex flex-wrap gap-3">
  <button
    class="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50"
    :disabled="!file1 || !file2"
    @click="analyzeComparison"
  >
    🔍 Analyze Both Images
  </button>

  <button
    v-if="result1 && result2"
    @click="clearCompare"
    class="inline-flex items-center px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg transition-colors duration-200"
  >
    🔁 Try Another Image
  </button>

  <button
    class="inline-flex items-center px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition-colors duration-200"
    @click="clearCompare"
  >
    ♻️ Reset Compare
  </button>
</div>


              </div>
            </div>
  </div>

  <!-- 🖼️ Single Image Mode -->
  <div v-else>
    <!-- Image Upload Section -->
            <div class="bg-gray-50 rounded-xl p-6">
              <h3 class="text-xl font-semibold text-gray-900 mb-4">📸 Image Analysis</h3>
              
              <!-- File Upload -->
              <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700 mb-2">Upload Image</label>
                <div
  class="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition"
  :class="dragOverSingle ? 'border-emerald-500 bg-emerald-50' : 'border-emerald-300'"
  @dragover.prevent="dragOverSingle = true"
  @dragleave.prevent="dragOverSingle = false"
  @drop.prevent="handleDropSingle($event); dragOverSingle = false"
  @click="$refs.fileDropSingle.click()"
  role="button"
  tabindex="0"
  @keydown.enter="$refs.fileDropSingle.click()"
  @keydown.space.prevent="$refs.fileDropSingle.click()"
  aria-label="Upload image by clicking or dragging"
>
  <p class="text-sm text-emerald-600">📂 Drag & drop or click to upload an image</p>
  <input
    type="file"
    accept="image/*"
    @change="onFileChange"
    ref="fileDropSingle"
    class="hidden"
  />
</div>

              </div>

              <!-- Image Preview -->
              <div v-if="filePreview" class="mb-6">
                <img :src="filePreview" class="w-full max-h-80 object-contain rounded-xl shadow-lg border border-gray-200" />
              </div>

              <!-- Action Buttons -->
              <div class="flex flex-wrap gap-3">
                <button
                  class="inline-flex items-center px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  :disabled="!file || loading"
                  @click="analyzeImage"
                >
                  <svg v-if="loading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {{ loading ? "Analyzing..." : "🔍 Analyze Image" }}
                </button>

                <button
                  class="inline-flex items-center px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition-colors duration-200"
                  @click="clearForm"
                  :disabled="!file && !result"
                >
                  🗑️ Clear
                </button>

                <button
                  v-if="result"
                  class="inline-flex items-center px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors duration-200"
                  @click="showConfidenceCard = true"
                >
                  📊 View Details
                </button>
              </div>
            </div>

            <!-- Camera Section -->
            <!-- Collapsible Camera Section -->
<div class="bg-gray-50 rounded-xl p-6">
  <div class="flex justify-between items-center mb-4">
    <h3 class="text-xl font-semibold text-gray-900">📹 Live Camera</h3>
    <button
      @click="showCameraSection = !showCameraSection"
      class="text-sm text-indigo-600 hover:underline focus:outline-none"
    >
      {{ showCameraSection ? 'Hide' : 'Show' }}
    </button>
  </div>

  <transition name="fade">
    <div v-if="showCameraSection" class="space-y-4">
      <video ref="videoRef" autoplay playsinline class="w-full max-h-80 rounded-xl border border-gray-200 shadow-lg bg-black"></video>
      
      <div class="flex flex-wrap gap-3">
        <button
          class="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors duration-200"
          @click="toggleCamera"
        >
          {{ cameraActive ? '🛑 Stop Camera' : '🎥 Start Camera' }}
        </button>

        <button
          class="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
          @click="captureImage"
          :disabled="!cameraActive"
        >
          📷 Capture Photo
        </button>
      </div>
    </div>
  </transition>
</div>

  </div>
            

            <!-- Results Section -->
            <div v-if="result" class="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <h3 class="text-2xl font-bold text-gray-900 mb-4">📋 Analysis Results</h3>
              
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div class="space-y-4">
                  <div class="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
                    <h4 class="text-lg font-semibold text-emerald-800 mb-2">Prediction</h4>
                    <p class="text-2xl font-bold text-emerald-900">{{ result.prediction }}</p>
                    <p class="text-emerald-700">Confidence: {{ (result.confidence * 100).toFixed(2) }}%</p>
                  </div>

                  <div v-if="result.fallback_used" class="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                    <div class="flex items-center">
                      <svg class="w-5 h-5 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      <span class="text-yellow-800 font-medium">Low Confidence Result</span>
                    </div>
                    <p class="text-yellow-700 mt-1 text-sm">Unable to confidently classify. Try a clearer image or different angle.</p>
                  </div>
                </div>

                <div class="space-y-4">
                  <div class="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <h4 class="text-lg font-semibold text-blue-800 mb-3">Recommendations</h4>
                    <ul class="space-y-2">
                      <li v-for="(rec, i) in result.recommendations" :key="i" class="flex items-start">
                        <svg class="w-4 h-4 text-blue-600 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4" />
                        </svg>
                        <span class="text-blue-800 text-sm">{{ rec }}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <!-- Comparison Results -->
            <div v-if="result1 && result2" class="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <h3 class="text-2xl font-bold text-gray-900 mb-6">🔄 Comparison Results</h3>
              
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
                  <h4 class="text-lg font-bold text-blue-800 mb-3">🖼️ Image 1</h4>
                  <div class="space-y-2">
                    <p class="text-blue-900"><strong>Prediction:</strong> {{ result1.prediction }}</p>
                    <p class="text-blue-900"><strong>Confidence:</strong> {{ (result1.confidence * 100).toFixed(2) }}%</p>
                    <div class="mt-3">
                      <p class="text-sm font-medium text-blue-800 mb-2">Class Probabilities:</p>
                      <div class="space-y-1">
                        <div v-for="(v, k) in result1.class_probabilities" :key="k" class="flex justify-between text-sm">
                          <span class="text-blue-700">{{ k }}</span>
                          <span class="text-blue-900 font-medium">{{ (v * 100).toFixed(2) }}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
                  <h4 class="text-lg font-bold text-purple-800 mb-3">🖼️ Image 2</h4>
                  <div class="space-y-2">
                    <p class="text-purple-900"><strong>Prediction:</strong> {{ result2.prediction }}</p>
                    <p class="text-purple-900"><strong>Confidence:</strong> {{ (result2.confidence * 100).toFixed(2) }}%</p>
                    <div class="mt-3">
                      <p class="text-sm font-medium text-purple-800 mb-2">Class Probabilities:</p>
                      <div class="space-y-1">
                        <div v-for="(v, k) in result2.class_probabilities" :key="k" class="flex justify-between text-sm">
                          <span class="text-purple-700">{{ k }}</span>
                          <span class="text-purple-900 font-medium">{{ (v * 100).toFixed(2) }}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Progression Alert -->
              <div v-if="progressionDetected" class="bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-400 p-4 rounded-lg">
                <div class="flex items-center">
                  <svg class="h-6 w-6 text-yellow-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m0-4h.01M12 18a9 9 0 100-18 9 9 0 000 18z" />
                  </svg>
                  <div>
                    <h4 class="text-lg font-semibold text-yellow-800">⚠️ Disease Progression Detected</h4>
                    <p class="text-yellow-700">{{ result1.prediction }} → {{ result2.prediction }}. Consider immediate intervention.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Insights Tab -->
          <div v-if="activeTab === 'Insights'" class="space-y-8">
            <!-- Export Button -->
            <div class="flex justify-end">
              <button
                @click="exportInsightsToPDF"
                class="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
              >
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export to PDF
              </button>
            </div>

            <!-- Summary Cards -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div class="bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-emerald-100 text-sm font-medium">Total Analyses</p>
                    <h2 class="text-3xl font-bold">{{ insights.total }}</h2>
                  </div>
                  <div class="bg-white/20 rounded-lg p-3">
                    <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div class="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-6 text-white shadow-lg">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-blue-100 text-sm font-medium">Healthy</p>
                    <h2 class="text-3xl font-bold">{{ insights.Healthy }}</h2>
                  </div>
                  <div class="bg-white/20 rounded-lg p-3">
                    <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div class="bg-gradient-to-br from-orange-500 to-red-600 rounded-xl p-6 text-white shadow-lg">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-orange-100 text-sm font-medium">Bacterial</p>
                    <h2 class="text-3xl font-bold">{{ insights.Bacterial }}</h2>
                  </div>
                  <div class="bg-white/20 rounded-lg p-3">
                    <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div class="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl p-6 text-white shadow-lg">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-purple-100 text-sm font-medium">Fungal</p>
                    <h2 class="text-3xl font-bold">{{ insights.Fungal }}</h2>
                  </div>
                  <div class="bg-white/20 rounded-lg p-3">
                    <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <!-- Disease-Specific Insights -->
            <div class="bg-white rounded-xl p-6 shadow-lg">
              <h3 class="text-2xl font-bold text-gray-900 mb-6">🔬 Disease-Specific Insights</h3>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div v-for="(info, disease) in diseaseInsights" :key="disease" class="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200">
                  <h4 class="text-lg font-semibold text-emerald-700 mb-3">{{ disease }}</h4>
                  <div class="space-y-2 text-sm">
                    <div class="flex justify-between">
                      <span class="text-gray-600">Occurrences:</span>
                      <span class="font-semibold text-gray-900">{{ info.count }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-gray-600">Avg Confidence:</span>
                      <span class="font-semibold text-gray-900">{{ info.avgConfidence.toFixed(2) }}%</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-gray-600">Last Detected:</span>
                      <span class="font-semibold text-gray-900">{{ info.latest || 'N/A' }}</span>
                    </div>
                  </div>
                  <div class="mt-3">
                    <p class="text-sm font-medium text-gray-700 mb-2">Common Recommendations:</p>
                    <ul class="text-xs text-gray-600 space-y-1">
                      <li v-for="(rec, i) in info.recommendations.slice(0, 3)" :key="i" class="flex items-start">
                        <span class="text-emerald-500 mr-1">•</span>
                        <span>{{ rec }}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <!-- Charts Section -->
            <div class="space-y-6">
              <!-- Confidence Charts -->
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div class="bg-white rounded-xl p-6 shadow-lg">
                <h3 class="text-xl font-semibold text-gray-900 mb-4">📊 Disease Distribution</h3>
                <canvas ref="chartPie" height="250"></canvas>
              </div>
                <div class="bg-white rounded-xl p-6 shadow-lg">
                  <h3 class="text-xl font-semibold text-gray-900 mb-4">📈 Confidence Trend</h3>
                  <canvas ref="chartLine" height="250"></canvas>
                </div>

                <div class="bg-white rounded-xl p-6 shadow-lg">
                  <h3 class="text-xl font-semibold text-gray-900 mb-4">📊 Avg Confidence by Type</h3>
                  <canvas ref="chartBar" height="250"></canvas>
                </div>
                <!-- Confidence Comparison Bar -->
<!-- <div class="bg-white rounded-xl p-6 shadow-lg">
  <h3 class="text-xl font-semibold text-gray-900 mb-4">📊 Confidence Comparison</h3>
  <canvas ref="chartCompareBar" height="250"></canvas>
</div>

 Class Probability Radar Chart -->
<!-- <div class="bg-white rounded-xl p-6 shadow-lg">
  <h3 class="text-xl font-semibold text-gray-900 mb-4">🕸️ Class Probabilities (Radar)</h3>
  <canvas ref="chartCompareRadar" height="250"></canvas>
</div> -->
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Analysis History -->
      <!-- Analysis History Section -->
<div class="bg-white rounded-2xl shadow-xl p-6 mt-8">
  <div class="flex justify-between items-center mb-4">
    <h3 class="text-2xl font-bold text-gray-900">🕒 Analysis History</h3>
    <button
      @click="showHistorySection = !showHistorySection"
      class="text-sm text-indigo-600 hover:underline"
    >
      {{ showHistorySection ? 'Hide' : 'Show' }}
    </button>
  </div>

  <transition name="fade">
    <div v-if="showHistorySection">
      <!-- Filter -->
      <div class="mb-4">
        <input
          type="text"
          v-model="historyFilter"
          placeholder="🔍 Filter by prediction..."
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      <!-- Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="item in paginatedHistory"
          :key="item.id"
          class="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow duration-200"
        >
          <div class="flex justify-between items-start mb-3">
            <div class="flex-1">
              <p class="font-semibold text-gray-900">{{ item.prediction }}</p>
              <p class="text-sm text-emerald-600 font-medium">{{ (item.confidence * 100).toFixed(2) }}% confidence</p>
              <p class="text-xs text-gray-500 mt-1">
                {{
                  item.createdAt?.toDate?.().toLocaleString() || 'No timestamp'
                }}
              </p>
            </div>
          </div>

          <div class="flex gap-2">
            <button
              class="flex-1 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1 rounded-md transition-colors duration-200"
              @click="selectedItem = item"
            >
              View Details
            </button>
            <button
              class="text-sm bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded-md transition-colors duration-200"
              @click="confirmDelete(item)"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div class="flex justify-center items-center gap-2 mt-6">
        <button
          @click="goToPage(currentPage - 1)"
          :disabled="currentPage === 1"
          class="px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
        >
          ⬅ Prev
        </button>
        <span class="text-sm text-gray-600">Page {{ currentPage }} of {{ totalPages }}</span>
        <button
          @click="goToPage(currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
        >
          Next ➡
        </button>
      </div>
    </div>
  </transition>
  <!-- Export Buttons -->
      <div class="flex gap-3 justify-end mt-6">
        <button
          @click="exportHistoryToCSV"
          class="inline-flex items-center px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Export CSV
        </button>

        <button
          @click="exportInsightsToPDF"
          class="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Export PDF
        </button>
      </div>
</div>

      <!-- 🧪 Comparison History -->
<div class="bg-white rounded-2xl shadow-xl p-6 mt-8">
  <div class="flex justify-between items-center mb-4">
    <h3 class="text-2xl font-bold text-gray-900">🧪 Comparison History</h3>
    <button
      @click="showComparisonSection = !showComparisonSection"
      class="text-sm text-indigo-600 hover:underline"
    >
      {{ showComparisonSection ? 'Hide' : 'Show' }}
    </button>
  </div>

  <transition name="fade">
    <div v-if="showComparisonSection">
      <!-- Filter -->
      <div class="mb-4">
        <input
          type="text"
          v-model="comparisonFilter"
          placeholder="🔍 Filter by predictions..."
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <!-- Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="item in paginatedComparisons"
          :key="item.id"
          class="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow duration-200"
        >
          <div class="flex justify-between items-start mb-3">
            <div>
              <p class="font-semibold text-gray-900">{{ item.prediction1 }} → {{ item.prediction2 }}</p>
              <p class="text-sm text-gray-600">{{ (item.confidence1 * 100).toFixed(1) }}% → {{ (item.confidence2 * 100).toFixed(1) }}%</p>
              <p class="text-xs text-gray-500 mt-1">{{ item.createdAt?.toDate().toLocaleString() }}</p>
            </div>
            <div class="text-xs px-2 py-1 rounded-full font-semibold"
                :class="item.progressionDetected ? 'bg-yellow-100 text-yellow-800' : 'bg-emerald-100 text-emerald-800'">
              {{ item.progressionDetected ? 'Progressed' : 'No Change' }}
            </div>
          </div>

          <div class="grid grid-cols-2 gap-2 mb-3">
            <img :src="item.imageUrl1" class="rounded-md object-cover h-28 w-full" />
            <img :src="item.imageUrl2" class="rounded-md object-cover h-28 w-full" />
          </div>

          <div class="flex justify-end gap-2">
            <button
              @click="selectedComparison = item"
              class="px-3 py-1 text-sm bg-indigo-100 text-indigo-800 rounded-lg hover:bg-indigo-200"
            >
              🔍 View
            </button>
            <button
              @click="confirmDeleteComparison(item)"
              class="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
            >
              ❌ Delete
            </button>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div class="flex justify-center items-center gap-2 mt-6">
        <button
          @click="goToComparisonPage(comparisonPage - 1)"
          :disabled="comparisonPage === 1"
          class="px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
        >
          ⬅ Prev
        </button>
        <span class="text-sm text-gray-600">Page {{ comparisonPage }} of {{ totalComparisonPages }}</span>
        <button
          @click="goToComparisonPage(comparisonPage + 1)"
          :disabled="comparisonPage === totalComparisonPages"
          class="px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
        >
          Next ➡
        </button>
      </div>
    </div>
  </transition>
  <!-- Export Buttons -->
      <div class="flex gap-3 justify-end mt-6">
        <button
          @click="exportComparisonToCSV"
          class="inline-flex items-center px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Export CSV
        </button>

        <button
          @click="exportComparisonToPDF"
          class="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Export PDF
        </button>
      </div>
</div>


    </div>

    <!-- Hidden Canvas for Camera Capture -->
    <canvas ref="canvasRef" class="hidden"></canvas>

    <!-- Modals -->
    <!-- Detail Viewer Modal -->
    <div v-if="selectedItem" class="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
          <div class="flex justify-between items-center">
            <h3 class="text-xl font-bold text-gray-900">Analysis Details</h3>
            <button @click="closeDetails" class="text-gray-400 hover:text-gray-600 transition-colors duration-200">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        <div class="p-6 space-y-4">
          <img :src="selectedItem.imageUrl" class="w-full rounded-lg shadow-md" />
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-emerald-50 rounded-lg p-4">
              <p class="text-sm text-emerald-600 font-medium">Prediction</p>
              <p class="text-lg font-bold text-emerald-900">{{ selectedItem.prediction }}</p>
            </div>
            <div class="bg-blue-50 rounded-lg p-4">
              <p class="text-sm text-blue-600 font-medium">Confidence</p>
              <p class="text-lg font-bold text-blue-900">{{ (selectedItem.confidence * 100).toFixed(2) }}%</p>
            </div>
          </div>

          <div class="bg-gray-50 rounded-lg p-4">
            <p class="font-medium text-gray-900 mb-3">Recommendations:</p>
            <ul class="space-y-2">
              <li v-for="(rec, i) in selectedItem.recommendations" :key="i" class="flex items-start">
                <svg class="w-4 h-4 text-emerald-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4" />
                </svg>
                <span class="text-gray-700 text-sm">{{ rec }}</span>
              </li>
            </ul>
          </div>

          <div class="text-xs text-gray-500 text-center pt-4 border-t border-gray-200">
            Analyzed: {{ selectedItem.createdAt?.toDate().toLocaleString() }}
          </div>
        </div>
      </div>
    </div>

    <!-- Confidence Card Modal -->
    <div v-if="showConfidenceCard" class="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        <div class="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 class="text-xl font-bold text-emerald-700">Confidence Breakdown</h2>
          <button
            class="text-gray-400 hover:text-gray-600 transition-colors duration-200"
            @click="showConfidenceCard = false"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="p-6 space-y-4">
          <div class="bg-emerald-50 rounded-lg p-4">
            <p class="text-sm text-emerald-600 font-medium">Predicted</p>
            <p class="text-lg font-bold text-emerald-900">{{ result.prediction }}</p>
            <p class="text-sm text-emerald-700">{{ (result.confidence * 100).toFixed(2) }}% confidence</p>
          </div>

          <div class="space-y-3">
            <p class="font-medium text-gray-900">All Class Probabilities:</p>
            <div class="space-y-2">
              <div
                v-for="(value, label) in result.class_probabilities"
                :key="label"
                class="flex justify-between items-center p-2 bg-gray-50 rounded-lg"
              >
                <span class="text-gray-700 font-medium">{{ label }}</span>
                <div class="flex items-center gap-2">
                  <div class="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      class="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                      :style="{ width: (value * 100) + '%' }"
                    ></div>
                  </div>
                  <span class="text-gray-900 font-semibold text-sm w-12 text-right">{{ (value * 100).toFixed(1) }}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteConfirm" class="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        <div class="p-6">
          <div class="flex items-center mb-4">
            <div class="bg-red-100 rounded-full p-3 mr-4">
              <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <div>
              <h2 class="text-lg font-bold text-gray-900">Delete Analysis?</h2>
              <p class="text-sm text-gray-600">This action cannot be undone.</p>
            </div>
          </div>

          <div class="flex justify-end gap-3">
            <button 
              @click="cancelDelete" 
              class="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
            >
              Cancel
            </button>
            <button 
              @click="proceedDelete" 
              class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast Notification -->
    <div 
      v-if="toastMessage" 
      :class="['fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg text-white z-50 transition-all duration-300 cursor-pointer', toastType]" 
      @click="clearToast"
    >
      <div class="flex items-center">
        <svg v-if="toastType.includes('green')" class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <svg v-else-if="toastType.includes('red')" class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{{ toastMessage }}</span>
      </div>
    </div>
  </div>
  <Teleport to="body">
  <div v-if="selectedComparison" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
    <div class="bg-white rounded-xl p-6 w-full max-w-lg shadow-xl relative">
      <button
        @click="selectedComparison = null"
        class="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl font-bold"
      >
        &times;
      </button>

      <h2 class="text-xl font-semibold text-gray-800 mb-4">🔍 Comparison Details</h2>

      <div class="space-y-2 text-sm">
        <p><strong>Prediction 1:</strong> {{ selectedComparison.prediction1 }}</p>
        <p><strong>Confidence 1:</strong> {{ (selectedComparison.confidence1 * 100).toFixed(1) }}%</p>
        <p><strong>Prediction 2:</strong> {{ selectedComparison.prediction2 }}</p>
        <p><strong>Confidence 2:</strong> {{ (selectedComparison.confidence2 * 100).toFixed(1) }}%</p>
        <p><strong>Progression Detected:</strong> {{ selectedComparison.progressionDetected ? 'Yes' : 'No' }}</p>
        <p><strong>Date:</strong>
          {{
            selectedComparison.createdAt && typeof selectedComparison.createdAt.toDate === 'function'
              ? selectedComparison.createdAt.toDate().toLocaleString()
              : 'N/A'
          }}
        </p>
      </div>

      <div class="mt-4 grid grid-cols-2 gap-4">
        <img :src="selectedComparison.imageUrl1" class="rounded-md object-cover w-full h-40 border" />
        <img :src="selectedComparison.imageUrl2" class="rounded-md object-cover w-full h-40 border" />
      </div>
    </div>
  </div>
</Teleport>
<Teleport to="body">
  <div
    v-if="showDeleteConfirmComparison"
    class="fixed inset-0 bg-black/40 z-50 flex items-center justify-center"
  >
    <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm text-center">
      <h3 class="text-lg font-semibold text-gray-900 mb-2">Are you sure?</h3>
      <p class="text-sm text-gray-600 mb-6">
        You are about to delete this comparison permanently. This action cannot be undone.
      </p>

      <div class="flex justify-center gap-3">
        <button
          @click="showDeleteConfirmComparison = false"
          class="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800"
        >
          Cancel
        </button>
        <button
          @click="deleteComparison2"
          class="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium"
        >
          Yes, Delete
        </button>
      </div>
    </div>
  </div>
</Teleport>


</template>

<script setup>
import { onSnapshot, query, where, orderBy, deleteDoc, doc, getDocs } from 'firebase/firestore';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { onAuthStateChanged } from 'firebase/auth';
import { ref as vueRef,onMounted, watch, ref, nextTick,computed } from 'vue';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);
import {
  auth,
  db,
  storage
} from '../../firebase'; // your firebase.js
import {
  addDoc,
  collection,
  serverTimestamp
} from 'firebase/firestore';
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL
} from 'firebase/storage';

// Refs for reactivity
const file = vueRef(null);
const result = vueRef(null);
const loading = vueRef(false);

const diseaseInsights = ref({});
const showConfidenceCard = vueRef(false);


const selectedItem = vueRef(null);
const closeDetails = () => selectedItem.value = null;

const compareMode = vueRef(false);
const file1 = vueRef(null);
const file2 = vueRef(null);
const result1 = vueRef(null);
const result2 = vueRef(null);

const progressionDetected = vueRef(false);

const fileInputRef = vueRef(null); // for clearing input
const comparisonHistory = vueRef([]);
const selectedComparison = ref(null); // For modal
const comparisonToDelete = ref(null);
const showDeleteConfirmComparison = ref(false);    

const showCameraSection = ref(false);

// Triggered on file selection

const filePreview = vueRef(null);

const onFileChange = (e) => {
  file.value = e.target.files[0];
  if (file.value) {
    filePreview.value = URL.createObjectURL(file.value);
  }
};


// Main prediction + upload function
const analyzeImage = async () => {
  if (!file.value || !auth.currentUser) {
    showToast("Please log in and upload a file.", 'bg-yellow-500');
    return;
  }

  loading.value = true;

  try {
    // Step 1: Upload image to Flask API
    const formData = new FormData();
    formData.append('file', file.value);

    const token = await auth.currentUser.getIdToken();

    const response = await fetch('http://127.0.0.1:5000/predict', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    const predictionData = await response.json();
    if (predictionData.status !== 'success') {
      throw new Error('Prediction failed');
    }

    result.value = predictionData;

    // Step 2: Upload the image to Firebase Storage
    const timestamp = Date.now();
    const filename = `${timestamp}_${file.value.name}`;
    const path = `disease_uploads/${auth.currentUser.uid}/${filename}`;
    const imageStorageRef = storageRef(storage, path);

    await uploadBytes(imageStorageRef, file.value);
    const imageUrl = await getDownloadURL(imageStorageRef);

    // Step 3: Save prediction + metadata to Firestore
    await addDoc(collection(db, 'analysisHistory'), {
      userId: auth.currentUser.uid,
      imageUrl,
      prediction: predictionData.prediction,
      confidence: predictionData.confidence,
      classProbabilities: predictionData.class_probabilities,
      recommendations: predictionData.recommendations,
      createdAt: serverTimestamp()
    });

    console.log('✅ Saved prediction to Firestore');
    showToast("Image analyzed successfully!", 'bg-green-500');
  } catch (err) {
    console.error('❌ Error:', err.message || err);
    showToast(`Error: ${err.message || 'An unexpected error occurred.'}`, 'bg-red-500');
  } finally {
    loading.value = false;
  }
};

const modelInfo = vueRef(null);

const fetchModelInfo = async () => {
  try {
    const response = await fetch('http://127.0.0.1:5000/model-info');
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }
    const data = await response.json();
    modelInfo.value = data;
    console.log("✅ Model Info:", data);
  } catch (err) {
    console.error("❌ Failed to fetch model info:", err);
    showToast(`Error: ${err.message || 'Failed to fetch model info.'}`, 'bg-red-500');
  }
};
onMounted(() => {
  fetchModelInfo();
});
const videoRef = vueRef(null);
const canvasRef = vueRef(null);

// Start camera stream on mount
onMounted(() => {
  fetchModelInfo();

  onAuthStateChanged(auth, (user) => {
    if (user) {
      loadHistory();
      loadComparisonHistory();
    } else {
      console.warn("User not authenticated. Skipping history load.");
    }
  });
});

const initCamera = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoRef.value.srcObject = stream;
  } catch (err) {
    console.error("❌ Failed to access camera:", err);
    alert("Camera not supported or permission denied.");
  }
};

// Capture image from video
const captureImage = () => {
  const video = videoRef.value;
  const canvas = canvasRef.value;

  const width = video.videoWidth;
  const height = video.videoHeight;

  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0, width, height);

  // Convert canvas to blob → file
  canvas.toBlob(blob => {
    const capturedFile = new File([blob], `captured_${Date.now()}.jpg`, { type: 'image/jpeg' });
    file.value = capturedFile;
    filePreview.value = URL.createObjectURL(capturedFile);
    console.log("📷 Captured image ready for analysis.");
  }, 'image/jpeg', 0.95);
};
const stopCamera = () => {
  const stream = videoRef.value?.srcObject;
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
    videoRef.value.srcObject = null;
    console.log("📴 Camera stopped.");
  }
};
const cameraActive = vueRef(false);

const toggleCamera = () => {
  if (cameraActive.value) {
    stopCamera();
  } else {
    initCamera();
  }
  cameraActive.value = !cameraActive.value;
};

const history = vueRef([]); // analysis history

const loadHistory = () => {
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      console.warn("User not authenticated. Cannot load history.");
      return;
    }

    const q = query(
      collection(db, 'analysisHistory'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    onSnapshot(q, (snapshot) => {
      history.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      console.log("📜 History loaded:", history.value);
    });
  });
};
const deleteHistory = async (id) => {
  try {
    await deleteDoc(doc(db, 'analysisHistory', id));
    showToast("Analysis deleted successfully!", 'bg-green-500');
  } catch (err) {
    console.error("❌ Failed to delete history:", err);
    showToast(`Error: ${err.message || 'Failed to delete item.'}`, 'bg-red-500');
  }
};
/////////////////////

const tabs = ['Detector', 'Insights'];
const activeTab = ref('Detector');

const chartPie = ref(null);
const chartLine = ref(null);
const chartBar = ref(null);

const insights = ref({
  total: 0,
  Healthy: 0,
  Bacterial: 0,
  Fungal: 0
});
import { getAuth } from 'firebase/auth';

const loadInsights = async () => {
  const user = auth.currentUser;
  if (!user) return;

  const q = query(
    collection(db, 'analysisHistory'),
    where('userId', '==', user.uid),
    orderBy('createdAt', 'desc')
  );

  onSnapshot(q, async (snapshot) => {
    const data = snapshot.docs.map(doc => doc.data());

    const summary = { total: data.length, Healthy: 0, Bacterial: 0, Fungal: 0 };
    const byDate = [];
    const byLabel = {};

    data.forEach((item) => {
      const label = item.prediction;
      summary[label] = (summary[label] || 0) + 1;

      const date = item.createdAt?.toDate().toLocaleDateString?.() || 'Unknown';
      byDate.push({ x: date, y: item.confidence });

      if (!byLabel[label]) byLabel[label] = [];
      byLabel[label].push(item.confidence);
    });

    insights.value = summary;

    await nextTick(); // 👈 ensure chart canvases are in DOM
    if (!chartPie.value || !chartLine.value || !chartBar.value) {
  console.warn("❌ Skipping drawCharts — chart elements are not ready.");
  return;
}
    drawCharts(summary, byDate, byLabel);
    computeDiseaseInsights(data);

  });
};

const computeDiseaseInsights = (data) => {
  const insights = {};

  data.forEach(item => {
    const label = item.prediction;
    const conf = item.confidence;
    const date = item.createdAt?.toDate().toLocaleString?.() || 'Unknown';
    const recs = item.recommendations || [];

    if (!insights[label]) {
      insights[label] = {
        count: 0,
        totalConfidence: 0,
        latest: date,
        recommendations: []
      };
    }

    insights[label].count += 1;
    insights[label].totalConfidence += conf;

    if (!insights[label].latest || new Date(date) > new Date(insights[label].latest)) {
      insights[label].latest = date;
    }

    insights[label].recommendations.push(...recs);
  });

  for (const key in insights) {
    const i = insights[key];
    i.avgConfidence = (i.totalConfidence / i.count) * 100;
    i.recommendations = [...new Set(i.recommendations)]; // remove duplicates
  }

  diseaseInsights.value = insights;
};


const drawCharts = (summary, confidenceTrend, labelGroups) => {
  // Ensure chart elements exist before creating charts
  if (!chartPie.value || !chartLine.value || !chartBar.value) {
    console.error("❌ Chart elements are not initialized.");
    return;
  }

  // Destroy existing charts if they exist
  pieChart?.destroy();
  lineChart?.destroy();
  barChart?.destroy();

  // Create new charts
  pieChart = new Chart(chartPie.value, {
    type: 'pie',
    data: {
      labels: Object.keys(summary).filter(k => k !== 'total'),
      datasets: [{
        data: Object.keys(summary).filter(k => k !== 'total').map(k => summary[k]),
        backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
        borderWidth: 1
      }]
    },
    options: { responsive: true, animation: { duration: 500 } }
  });

  lineChart = new Chart(chartLine.value, {
    type: 'line',
    data: {
      datasets: [{
        label: 'Confidence Over Time',
        data: confidenceTrend,
        fill: false,
        borderColor: '#3b82f6'
      }]
    },
    options: { responsive: true, animation: { duration: 500 } }
  });

  barChart = new Chart(chartBar.value, {
    type: 'bar',
    data: {
      labels: Object.keys(labelGroups),
      datasets: [{
        label: 'Avg Confidence',
        data: Object.values(labelGroups).map(arr => arr.reduce((a, b) => a + b) / arr.length),
        backgroundColor: '#6366f1'
      }]
    },
    options: { responsive: true, animation: { duration: 500 } }
  });
};

watch(activeTab, (val) => {
  if (val === 'Insights') {
    if (!auth.currentUser) {
      console.warn("User not authenticated. Skipping insights load.");
      return;
    }
    loadInsights();
  }
});


let pieChart = null;
let lineChart = null;
let barChart = null;

const exportHistoryToCSV = () => {
  if (!history.value.length) return;

  const headers = [
    'Prediction',
    'Confidence',
    'Created At',
    'Image URL',
    'Recommendations',
    'Class Probabilities',
    'User ID'
  ];

  const rows = history.value.map(item => [
    item.prediction,
    (item.confidence * 100).toFixed(2) + '%',
    item.createdAt?.toDate().toLocaleString() || '',
    item.imageUrl || '',
    JSON.stringify(item.recommendations || []),
    JSON.stringify(item.classProbabilities || {}),
    item.userId || ''
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row =>
      row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
    )
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'EcoMist-Detection-Report.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const exportInsightsToPDF = async () => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  let y = 10;

  pdf.setFontSize(18);
  pdf.text("Crop Disease Insights Report", 14, y);
  y += 10;

  pdf.setFontSize(12);
  pdf.text(`Total Analyses: ${insights.value.total}`, 14, y += 10);
  pdf.text(`Healthy: ${insights.value.Healthy}`, 14, y += 7);
  pdf.text(`Bacterial: ${insights.value.Bacterial}`, 14, y += 7);
  pdf.text(`Fungal: ${insights.value.Fungal}`, 14, y += 7);

  const addCanvasToPDF = async (canvasEl, label) => {
    if (!canvasEl) return;

    const canvas = await html2canvas(canvasEl, {
      scale: 2,
      useCORS: true
    });

    const imgData = canvas.toDataURL('image/png');

    if (y > 200) {
      pdf.addPage();
      y = 10;
    }

    pdf.setFontSize(14);
    pdf.text(label, 14, y += 10);
    pdf.addImage(imgData, 'PNG', 14, y += 5, 180, 90);
    y += 95;
  };

  await nextTick(); // ensure charts are rendered

  await addCanvasToPDF(chartPie.value, 'Disease Distribution');
  await addCanvasToPDF(chartLine.value, 'Confidence Trend');
  await addCanvasToPDF(chartBar.value, 'Average Confidence by Type');

  // ✅ Add Disease-Specific Insights
  pdf.addPage();
  let dy = 10;

  pdf.setFontSize(16);
  pdf.text("Disease-Specific Insights", 14, dy);
  dy += 10;
  pdf.setFontSize(11);

  Object.entries(diseaseInsights.value).forEach(([label, info]) => {
    if (dy > 270) {
      pdf.addPage();
      dy = 10;
    }

    pdf.setFont(undefined, 'bold');
    pdf.text(`${label}`, 14, dy);
    pdf.setFont(undefined, 'normal');

    dy += 6;
    pdf.text(`Occurrences: ${info.count}`, 18, dy += 6);
    pdf.text(`Avg Confidence: ${info.avgConfidence.toFixed(2)}%`, 18, dy += 6);
    pdf.text(`Last Detected: ${info.latest}`, 18, dy += 6);

    if (info.recommendations.length) {
      pdf.text(`Recommendations:`, 18, dy += 6);
      info.recommendations.slice(0, 3).forEach((rec) => {
        dy += 6;
        if (dy > 270) {
          pdf.addPage();
          dy = 10;
        }
        pdf.text(`- ${rec}`, 22, dy);
      });
    }

    dy += 10;
  });

  pdf.save('EcoMist-Analytics-&-Insights-Report.pdf');
};



const toastMessage = vueRef(null);
const toastType = vueRef('');

const showToast = (message, type = 'bg-green-500') => {
  toastMessage.value = message;
  toastType.value = type;
  setTimeout(() => {
    toastMessage.value = null;
    toastType.value = '';
  }, 3000); // Auto-hide after 3 seconds
};

const clearToast = () => {
  toastMessage.value = null;
  toastType.value = '';
};

// Accessibility: Detect reduced motion preference
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Adjust animations/transitions based on reduced motion preference
const reducedMotionClass = prefersReducedMotion ? 'transition-none' : 'transition-all duration-300';

// Responsive design adjustments
onMounted(() => {
  const handleResize = () => {
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      console.log("📱 Mobile layout activated");
      // Add any mobile-specific logic here
    }
  };
  window.addEventListener('resize', handleResize);
  handleResize(); // Initial check
});
const showDeleteConfirm = vueRef(false);
const itemToDelete = vueRef(null);

const confirmDelete = (item) => {
  itemToDelete.value = item;
  showDeleteConfirm.value = true;
};

const cancelDelete = () => {
  showDeleteConfirm.value = false;
  itemToDelete.value = null;
};

const proceedDelete = async () => {
  if (!itemToDelete.value) return;

  try {
    await deleteHistory(itemToDelete.value.id);
    await nextTick();

    setTimeout(() => {
      loadInsights(); // delay chart loading until DOM is fully ready
    }, 100); // 100ms 

  } catch (err) {
    console.error("❌ Failed to delete or reload insights:", err);
    showToast('Failed to delete item or reload charts.', 'bg-red-500');
  } finally {
    showDeleteConfirm.value = false;
    itemToDelete.value = null;
  }
};



const clearForm = () => {
  file.value = null;
  filePreview.value = null;
  result.value = null;

  // ✅ Clear actual input DOM element
  if (fileInputRef.value) {
    fileInputRef.value.value = ''; // resets the input field
  }

  // ✅ Clear canvas snapshot
  const canvas = canvasRef.value;
  if (canvas) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  // ✅ Stop camera if active
  stopCamera();

  nextTick(() => {
  fileInputRef.value?.focus();
});


  console.log("🧼 Cleared all prediction-related fields.");
};

const filePreview1 = vueRef(null);
const filePreview2 = vueRef(null);

const handleCompareFile = (e, slot) => {
  const file = e.target.files[0];
  if (slot === 1) {
    file1.value = file;
    filePreview1.value = URL.createObjectURL(file);
  } else {
    file2.value = file;
    filePreview2.value = URL.createObjectURL(file);
  }
};

const analyzeComparison = async () => {
  if (!file1.value || !file2.value || !auth.currentUser) {
    showToast("Please upload both images to compare.", 'bg-yellow-500');
    return;
  }

  try {
    showToast("Analyzing both images...", 'bg-blue-500');
    const token = await auth.currentUser.getIdToken();

    const send = async (file) => {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('http://127.0.0.1:5000/predict', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      if (!res.ok) throw new Error("Flask API failed");
      return await res.json();
    };

    // 🔍 Predict both
    const [res1, res2] = await Promise.all([send(file1.value), send(file2.value)]);
    result1.value = res1;
    result2.value = res2;
    progressionDetected.value = isProgressing(res1.prediction, res2.prediction);

    // 📤 Upload images to Firebase Storage
    const timestamp = Date.now();
    const pathBase = `comparisons/${auth.currentUser.uid}/${timestamp}`;
    const imageRef1 = storageRef(storage, `${pathBase}_1.jpg`);
    const imageRef2 = storageRef(storage, `${pathBase}_2.jpg`);

    await uploadBytes(imageRef1, file1.value);
    await uploadBytes(imageRef2, file2.value);

    const url1 = await getDownloadURL(imageRef1);
    const url2 = await getDownloadURL(imageRef2);

    // 🧾 Save to Firestore
    await addDoc(collection(db, 'comparisons'), {
      userId: auth.currentUser.uid,
      imageUrl1: url1,
      imageUrl2: url2,
      prediction1: res1.prediction,
      prediction2: res2.prediction,
      confidence1: res1.confidence,
      confidence2: res2.confidence,
      classProbabilities1: res1.class_probabilities,
      classProbabilities2: res2.class_probabilities,
      progressionDetected: progressionDetected.value,
      createdAt: serverTimestamp()
    });

    showToast("Comparison saved to history!", 'bg-green-500');
  } catch (err) {
    console.error(err);
    showToast("Comparison failed. Try again.", 'bg-red-500');
  }
  await nextTick();
drawComparisonCharts();

};

const isProgressing = (from, to) => {
  const healthIndex = ["Healthy", "Bacterial", "Fungal"];
  const fromIndex = healthIndex.indexOf(from);
  const toIndex = healthIndex.indexOf(to);
  
  // Only consider progression if going from Healthy to a disease
  return fromIndex !== -1 && toIndex !== -1 && fromIndex < toIndex;
};

const clearCompare = () => {
  file1.value = null;
  file2.value = null;
  filePreview1.value = null;
  filePreview2.value = null;
  result1.value = null;
  result2.value = null;
  progressionDetected.value = false;
};

const loadComparisonHistory = () => {
  const user = auth.currentUser;
  if (!user) return;

  const q = query(
    collection(db, 'comparisons'),
    where('userId', '==', user.uid),
    orderBy('createdAt', 'desc')
  );

  onSnapshot(q, (snapshot) => {
    comparisonHistory.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    console.log("🧪 Comparison history loaded:", comparisonHistory.value);
    console.log("Loaded comparisonHistory:", comparisonHistory.value);

  });
  nextTick(() => {
  fileInputRef.value?.focus();
});

};

const exportComparisonToCSV = () => {
  if (!comparisonHistory.value.length) return;

  const headers = [
    'Prediction 1', 'Confidence 1', 'Prediction 2', 'Confidence 2',
    'Progression Detected', 'Created At', 'Image URL 1', 'Image URL 2'
  ];

  const rows = comparisonHistory.value.map(item => [
    item.prediction1,
    (item.confidence1 * 100).toFixed(2) + '%',
    item.prediction2,
    (item.confidence2 * 100).toFixed(2) + '%',
    item.progressionDetected ? 'Yes' : 'No',
    item.createdAt?.toDate().toLocaleString() || '',
    item.imageUrl1,
    item.imageUrl2
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row =>
      row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
    )
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'EcoMist-Comparison-History.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const exportComparisonToPDF = async () => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  let y = 10;

  pdf.setFontSize(18);
  pdf.text("EcoMist - Comparison History Report", 14, y);
  y += 10;

  pdf.setFontSize(12);
  comparisonHistory.value.forEach((item, index) => {
    if (y > 270) {
      pdf.addPage();
      y = 10;
    }

    pdf.setFont(undefined, 'bold');
    pdf.text(`Entry ${index + 1}`, 14, y);
    pdf.setFont(undefined, 'normal');

    y += 6;
    pdf.text(`Prediction 1: ${item.prediction1} (${(item.confidence1 * 100).toFixed(1)}%)`, 18, y += 6);
    pdf.text(`Prediction 2: ${item.prediction2} (${(item.confidence2 * 100).toFixed(1)}%)`, 18, y += 6);
    pdf.text(`Progression: ${item.progressionDetected ? 'Yes' : 'No'}`, 18, y += 6);
    pdf.text(`Created At: ${item.createdAt?.toDate().toLocaleString() || 'N/A'}`, 18, y += 6);
    pdf.text(`Image 1: ${item.imageUrl1}`, 18, y += 6);
    pdf.text(`Image 2: ${item.imageUrl2}`, 18, y += 6);

    y += 8;
  });

  pdf.save('EcoMist-Comparison-History.pdf');
};

const deleteComparison = async (id) => {
  try {
    await deleteDoc(doc(db, 'comparisons', id));
    showToast('Comparison deleted.', 'bg-green-500');
  } catch (err) {
    console.error('Failed to delete:', err);
    showToast('Failed to delete.', 'bg-red-500');
  }
};

const confirmDeleteComparison = (item) => {
  comparisonToDelete.value = item;
  showDeleteConfirmComparison.value = true;
};

const deleteComparison2 = async () => {
  try {
    await deleteDoc(doc(db, 'comparisons', comparisonToDelete.value.id));
    showToast('Comparison deleted.', 'bg-green-500');
  } catch (err) {
    console.error('Delete failed:', err);
    showToast('Failed to delete comparison.', 'bg-red-500');
  } finally {
    showDeleteConfirmComparison.value = false;
    comparisonToDelete.value = null;
  }
};

const fileDrop1 = vueRef(null);
const fileDrop2 = vueRef(null);

const dragOver1 = ref(false);
const dragOver2 = ref(false);

const handleDropCompare = (e, slot) => {
  const droppedFile = e.dataTransfer.files[0];
  if (!droppedFile || !droppedFile.type.startsWith('image/')) {
    showToast("Only image files are allowed", 'bg-yellow-500');
    return;
  }
  handleCompareFile({ target: { files: [droppedFile] } }, slot);
};

const dragOverSingle = ref(false);
const fileDropSingle = vueRef(null);

const handleDropSingle = (e) => {
  const droppedFile = e.dataTransfer.files[0];
  if (!droppedFile || !droppedFile.type.startsWith('image/')) {
    showToast("Only image files are allowed.", 'bg-yellow-500');
    return;
  }

  onFileChange({ target: { files: [droppedFile] } });
};

const showHistorySection = ref(true);
const historyFilter = ref('');
const currentPage = ref(1);
const itemsPerPage = 6;

// Computed for filtered + paginated history
const filteredHistory = computed(() =>
  history.value.filter(item =>
    item.prediction?.toLowerCase().includes(historyFilter.value.toLowerCase())
  )
);

const paginatedHistory = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredHistory.value.slice(start, start + itemsPerPage);
});

const totalPages = computed(() =>
  Math.ceil(filteredHistory.value.length / itemsPerPage)
);

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) currentPage.value = page;
};

const showComparisonSection = ref(true);
const comparisonFilter = ref('');
const comparisonPage = ref(1);
const comparisonsPerPage = 6;

const filteredComparisons = computed(() =>
  comparisonHistory.value.filter(item =>
    `${item.prediction1} ${item.prediction2}`.toLowerCase().includes(comparisonFilter.value.toLowerCase())
  )
);

const paginatedComparisons = computed(() => {
  const start = (comparisonPage.value - 1) * comparisonsPerPage;
  return filteredComparisons.value.slice(start, start + comparisonsPerPage);
});

const totalComparisonPages = computed(() =>
  Math.ceil(filteredComparisons.value.length / comparisonsPerPage)
);

const goToComparisonPage = (page) => {
  if (page >= 1 && page <= totalComparisonPages.value) comparisonPage.value = page;
};

watch(comparisonFilter, () => {
  comparisonPage.value = 1;
});

watch(historyFilter, () => {
  currentPage.value = 1;
});

const chartCompareBar = ref(null);
const chartCompareRadar = ref(null);
let compareBarChart = null;
let compareRadarChart = null;

const drawComparisonCharts = () => {
  if (!chartCompareBar.value || !chartCompareRadar.value) return;

  compareBarChart?.destroy();
  compareRadarChart?.destroy();

  // Bar Chart for Confidence
  compareBarChart = new Chart(chartCompareBar.value, {
    type: 'bar',
    data: {
      labels: ['Image 1', 'Image 2'],
      datasets: [{
        label: 'Confidence (%)',
        data: [(result1.value.confidence * 100).toFixed(2), (result2.value.confidence * 100).toFixed(2)],
        backgroundColor: ['#3b82f6', '#8b5cf6']
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } }
    }
  });

  // Radar Chart for Class Probabilities
  const labels = Object.keys(result1.value.class_probabilities);
  compareRadarChart = new Chart(chartCompareRadar.value, {
    type: 'radar',
    data: {
      labels,
      datasets: [
        {
          label: 'Image 1',
          data: labels.map(l => result1.value.class_probabilities[l] * 100),
          backgroundColor: 'rgba(59, 130, 246, 0.2)',
          borderColor: '#3b82f6',
          borderWidth: 2
        },
        {
          label: 'Image 2',
          data: labels.map(l => result2.value.class_probabilities[l] * 100),
          backgroundColor: 'rgba(139, 92, 246, 0.2)',
          borderColor: '#8b5cf6',
          borderWidth: 2
        }
      ]
    },
    options: {
      responsive: true,
      scales: {
        r: {
          angleLines: { display: true },
          suggestedMin: 0,
          suggestedMax: 100
        }
      }
    }
  });
};
watch([result1, result2], async ([r1, r2]) => {
  if (r1 && r2 && chartCompareBar.value && chartCompareRadar.value) {
    await nextTick();
    drawComparisonCharts();
  }
});

</script>


<style scoped>
/* Custom scrollbar for better UX */

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius:  3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Smooth transitions for all interactive elements */
* {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

/* Enhanced focus states for accessibility */
button:focus,
input:focus {
  outline: 2px solid #10b981;
  outline-offset: 2px;
}

/* Loading animation for buttons */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: .5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

</style>