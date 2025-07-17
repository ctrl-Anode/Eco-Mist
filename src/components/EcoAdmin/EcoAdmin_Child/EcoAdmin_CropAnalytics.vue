<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
    <!-- Header Section -->
    <div class="bg-white shadow-lg border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 class="text-4xl font-bold text-gray-900 mb-2">📊 Admin Analytics Dashboard</h1>
            <p class="text-gray-600">Comprehensive analysis and insights for EcoMist Crop Analysis</p>
          </div>
          <div class="mt-4 sm:mt-0 flex items-center space-x-3">
            <div class="flex items-center space-x-2 text-sm text-gray-500">
              <div class="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span>Live Data</span>
            </div>
            <button 
              @click="refreshData" 
              :disabled="loading"
              class="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50"
            >
              <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <svg v-else class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              {{ loading ? 'Refreshing...' : 'Refresh' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Advanced Filters Section -->
      <div class="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-200">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-semibold text-gray-900">🔍 Advanced Filters</h2>
          <button 
            @click="clearFilters" 
            class="text-sm text-gray-500 hover:text-gray-700 underline"
          >
            Clear All Filters
          </button>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">📅 Start Date</label>
            <input 
              type="date" 
              v-model="startDate" 
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">📅 End Date</label>
            <input 
              type="date" 
              v-model="endDate" 
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">🧠 Model Filter</label>
            <select 
              v-model="modelFilter" 
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="">All Models</option>
              <option value="v2">Model V2</option>
              <option value="v3">Model V3</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">🎯 Prediction Filter</label>
            <select 
              v-model="predictionFilter" 
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="">All Predictions</option>
              <option value="Healthy">Healthy</option>
              <option value="Bacterial">Bacterial</option>
              <option value="Fungal">Fungal</option>
              <option value="Mosaic Virus">Mosaic Virus</option>
              <option value="Nutrient Deficiency">Nutrient Deficiency</option>
              <option value="Not Lettuce">Not Lettuce</option>
              <option value="Cannot Classify">Cannot Classify</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">📊 Confidence Range</label>
            <div class="flex items-center space-x-2">
              <input 
                type="range" 
                v-model="minConfidence" 
                min="0" 
                max="100" 
                class="flex-1"
              />
              <span class="text-sm text-gray-600 w-12">{{ minConfidence }}%</span>
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">📈 Sort By</label>
            <select 
              v-model="sortBy" 
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="createdAt">Date Created</option>
              <option value="confidence">Confidence</option>
              <option value="prediction">Prediction</option>
              <option value="userEmail">User Email</option>
            </select>
          </div>
        </div>

        <!-- Quick Stats -->
        <div class="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
          <div class="flex items-center justify-between text-sm">
            <span class="text-blue-800 font-medium">
              Showing {{ filteredData.length }} of {{ analysisData.length }} total records
            </span>
            <span class="text-blue-600">
              Average Confidence: {{ averageConfidence.toFixed(1) }}%
            </span>
          </div>
        </div>
      </div>

      <!-- Enhanced Summary Cards -->
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-8">
        <div 
          v-for="(count, label) in summaryCounts" 
          :key="label" 
          class="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
        >
          <div class="p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-500 mb-1">{{ label }}</p>
                <h2 class="text-2xl font-bold text-gray-900">{{ count.toLocaleString() }}</h2>
                <div v-if="label !== 'Total'" class="mt-2">
                  <div class="flex items-center text-xs text-gray-500">
                    <span>{{ ((count / summaryCounts.Total) * 100).toFixed(1) }}% of total</span>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                    <div 
                      class="bg-gradient-to-r from-blue-500 to-indigo-600 h-1.5 rounded-full transition-all duration-500"
                      :style="{ width: ((count / summaryCounts.Total) * 100) + '%' }"
                    ></div>
                  </div>
                </div>
              </div>
              <div class="text-3xl">
                {{ getEmojiForLabel(label) }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Enhanced Charts Section -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <!-- Prediction Distribution Chart -->
        <div class="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-semibold text-gray-900">📈 Prediction Distribution</h2>
            <div class="flex space-x-2">
              <button 
                @click="chartType = 'pie'" 
                :class="chartType === 'pie' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'"
                class="px-3 py-1 rounded-md text-sm font-medium transition-colors"
              >
                Pie
              </button>
              <button 
                @click="chartType = 'doughnut'" 
                :class="chartType === 'doughnut' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'"
                class="px-3 py-1 rounded-md text-sm font-medium transition-colors"
              >
                Doughnut
              </button>
            </div>
          </div>
          <div class="relative h-80">
            <canvas ref="chartPie" class="max-w-full max-h-full"></canvas>
          </div>
        </div>

        <!-- Model Usage Chart -->
        <div class="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-semibold text-gray-900">🧠 Model Usage Analytics</h2>
            <div class="text-sm text-gray-500">
              Total Scans: {{ Object.values(modelUsage).reduce((a, b) => a + b, 0) }}
            </div>
          </div>
          <div class="relative h-80">
            <canvas ref="chartBar" class="max-w-full max-h-full"></canvas>
          </div>
        </div>

        <!-- Confidence Distribution Chart -->
        <div class="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
          <h2 class="text-xl font-semibold text-gray-900 mb-6">📊 Confidence Score Distribution</h2>
          <div class="relative h-80">
            <canvas ref="chartConfidence" class="max-w-full max-h-full"></canvas>
          </div>
        </div>

        <!-- Time Series Chart -->
        <div class="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
          <h2 class="text-xl font-semibold text-gray-900 mb-6">📅 Analysis Trends Over Time</h2>
          <div class="relative h-80">
            <canvas ref="chartTimeSeries" class="max-w-full max-h-full"></canvas>
          </div>
        </div>
      </div>

      <!-- Detailed Analytics Table -->
      <div class="bg-white rounded-2xl shadow-xl border border-gray-200 mb-8">
        <div class="px-6 py-4 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-semibold text-gray-900">📋 Detailed Analysis Records</h2>
            <div class="flex items-center space-x-4">
              <div class="flex items-center space-x-2">
                <label class="text-sm text-gray-600">Show:</label>
                <select 
                  v-model="recordsPerPage" 
                  class="px-2 py-1 border border-gray-300 rounded text-sm"
                >
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prediction</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Confidence</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Model</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr 
                v-for="item in paginatedData" 
                :key="item.id"
                class="hover:bg-gray-50 transition-colors"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <span class="text-lg mr-2">{{ getEmojiForLabel(item.prediction) }}</span>
                    <span class="text-sm font-medium text-gray-900">{{ item.prediction }}</span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="w-16 bg-gray-200 rounded-full h-2 mr-3">
                      <div 
                        class="h-2 rounded-full transition-all duration-300"
                        :class="getConfidenceColor(item.confidence)"
                        :style="{ width: (item.confidence * 100) + '%' }"
                      ></div>
                    </div>
                    <span class="text-sm font-medium text-gray-900">
                      {{ (item.confidence * 100).toFixed(1) }}%
                    </span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {{ (item.modelUsed || 'v2').toUpperCase() }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(item.createdAt) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button 
                    @click="viewDetails(item)"
                    class="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    View
                  </button>
                  <button 
                    @click="deleteRecord(item.id)"
                    class="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="px-6 py-4 border-t border-gray-200">
          <div class="flex items-center justify-between">
            <div class="text-sm text-gray-700">
              Showing {{ ((currentPage - 1) * recordsPerPage) + 1 }} to {{ Math.min(currentPage * recordsPerPage, filteredData.length) }} of {{ filteredData.length }} results
            </div>
            <div class="flex items-center space-x-2">
              <button 
                @click="currentPage = Math.max(1, currentPage - 1)"
                :disabled="currentPage === 1"
                class="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span class="px-3 py-1 text-sm text-gray-700">
                Page {{ currentPage }} of {{ totalPages }}
              </span>
              <button 
                @click="currentPage = Math.min(totalPages, currentPage + 1)"
                :disabled="currentPage === totalPages"
                class="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Enhanced Export Section -->
      <div class="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
        <h2 class="text-xl font-semibold text-gray-900 mb-6">📤 Export & Reports</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button 
            @click="exportToCSV" 
            :disabled="loading"
            class="flex items-center justify-center px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            Export CSV
          </button>
          
          <button 
            @click="exportToPDF" 
            :disabled="loading"
            class="flex items-center justify-center px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            Export PDF
          </button>
          
          <button 
            @click="exportToJSON" 
            :disabled="loading"
            class="flex items-center justify-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
            </svg>
            Export JSON
          </button>
          
          <button 
            @click="generateReport" 
            :disabled="loading"
            class="flex items-center justify-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            Full Report
          </button>
        </div>
      </div>
    </div>

    <!-- Loading Overlay -->
    <div v-if="loading" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 flex items-center space-x-4">
        <svg class="animate-spin h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span class="text-lg font-medium text-gray-900">Processing...</span>
      </div>
    </div>

    <!-- Toast Notifications -->
    <div 
      v-if="toast.show" 
      :class="['fixed top-4 right-4 px-6 py-4 rounded-lg shadow-lg text-white z-50 transition-all duration-300', toast.type]"
    >
      <div class="flex items-center">
        <svg v-if="toast.type.includes('green')" class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <svg v-else-if="toast.type.includes('red')" class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <span>{{ toast.message }}</span>
      </div>
    </div>
  </div>
  <!-- View Details Modal -->
<div v-if="showViewModal" class="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/30">
  <div class="bg-white rounded-xl p-6 w-full max-w-xl shadow-xl">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-semibold text-gray-800">📝 Analysis Details</h2>
      <button @click="closeViewModal" class="text-gray-500 hover:text-red-500 text-xl font-bold">&times;</button>
    </div>
    <div v-if="selectedItem" class="space-y-3 text-sm text-gray-700">
      <p><strong>Prediction:</strong> {{ selectedItem.prediction }}</p>
      <p><strong>Confidence:</strong> {{ (selectedItem.confidence * 100).toFixed(2) }}%</p>
      <p><strong>Model Used:</strong> {{ selectedItem.modelUsed || 'v2' }}</p>
      <p><strong>User:</strong> {{ selectedItem.userEmail || 'N/A' }}</p>
      <p><strong>Date:</strong> {{ formatDate(selectedItem.createdAt) }}</p>
      <div>
        <strong>Class Probabilities:</strong>
        <pre class="bg-gray-100 p-2 rounded text-xs">{{ JSON.stringify(selectedItem.classProbabilities || {}, null, 2) }}</pre>
      </div>
    </div>
  </div>
</div>

<!-- Delete Confirmation Modal -->
<div v-if="showDeleteModal" class="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/30">
  <div class="bg-white rounded-xl p-6 w-full max-w-sm shadow-xl">
    <h2 class="text-lg font-semibold text-red-600 mb-4">⚠️ Confirm Deletion</h2>
    <p class="text-gray-700 mb-4">Are you sure you want to delete this record?</p>
    <div class="flex justify-end space-x-2">
      <button @click="closeDeleteModal" class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 text-sm">Cancel</button>
      <button @click="confirmDelete" class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm">Yes, Delete</button>
    </div>
  </div>
</div>
</template>

<script setup>
import { ref, onMounted, nextTick, computed, watch } from 'vue';
import { collection, getDocs, query, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../../firebase';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

// Chart refs
const chartPie = ref(null);
const chartBar = ref(null);
const chartConfidence = ref(null);
const chartTimeSeries = ref(null);

// Chart instances
let pieChart, barChart, confidenceChart, timeSeriesChart;

// Reactive data
const loading = ref(false);
const analysisData = ref([]);
const summaryCounts = ref({});
const modelUsage = ref({});

// Filters
const startDate = ref('');
const endDate = ref('');
const modelFilter = ref('');
const predictionFilter = ref('');
const minConfidence = ref(0);
const sortBy = ref('createdAt');

// UI state
const chartType = ref('pie');
const recordsPerPage = ref(25);
const currentPage = ref(1);

// Toast notification
const toast = ref({
  show: false,
  message: '',
  type: 'bg-green-500'
});

// Computed properties
const filteredData = computed(() => {
  return analysisData.value.filter(item => {
    const date = item.createdAt?.toDate?.();
    const inRange = (!startDate.value || new Date(startDate.value) <= date) &&
                   (!endDate.value || date <= new Date(endDate.value + 'T23:59:59'));
    const modelMatch = !modelFilter.value || (item.modelUsed || 'v2') === modelFilter.value;
    const predictionMatch = !predictionFilter.value || item.prediction === predictionFilter.value;
    const confidenceMatch = (item.confidence * 100) >= minConfidence.value;
    
    return inRange && modelMatch && predictionMatch && confidenceMatch;
  }).sort((a, b) => {
    if (sortBy.value === 'createdAt') {
      return new Date(b.createdAt?.toDate?.() || 0) - new Date(a.createdAt?.toDate?.() || 0);
    } else if (sortBy.value === 'confidence') {
      return b.confidence - a.confidence;
    } else {
      return (a[sortBy.value] || '').localeCompare(b[sortBy.value] || '');
    }
  });
});

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * recordsPerPage.value;
  return filteredData.value.slice(start, start + recordsPerPage.value);
});

const totalPages = computed(() => {
  return Math.ceil(filteredData.value.length / recordsPerPage.value);
});

const averageConfidence = computed(() => {
  if (filteredData.value.length === 0) return 0;
  const sum = filteredData.value.reduce((acc, item) => acc + (item.confidence * 100), 0);
  return sum / filteredData.value.length;
});

// Methods
const showToast = (message, type = 'bg-green-500') => {
  toast.value = { show: true, message, type };
  setTimeout(() => {
    toast.value.show = false;
  }, 3000);
};

const loadAllAnalysis = async () => {
  loading.value = true;
  try {
    const q = query(collection(db, 'analysisHistory'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    analysisData.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    computeSummary();
    showToast('Data loaded successfully!', 'bg-green-500');
  } catch (error) {
    console.error('Error loading data:', error);
    showToast('Failed to load data', 'bg-red-500');
  } finally {
    loading.value = false;
  }
};

const refreshData = () => {
  loadAllAnalysis();
};

const computeSummary = async () => {
  const summary = {
    'Total': 0,
    'Healthy': 0,
    'Bacterial': 0,
    'Fungal': 0,
    'Mosaic Virus': 0,
    'Nutrient Deficiency': 0,
    'Not Lettuce': 0,
    'Cannot Classify': 0
  };
  
  const models = {};
  
  filteredData.value.forEach(item => {
    const pred = item.prediction || 'Unknown';
    summary[pred] = (summary[pred] || 0) + 1;
    summary['Total']++;
    
    const model = item.modelUsed || 'v2';
    models[model] = (models[model] || 0) + 1;
  });
  
  summaryCounts.value = summary;
  modelUsage.value = models;
  
  await nextTick();
  drawCharts();
};

const drawCharts = () => {
  drawPredictionChart();
  drawModelChart();
  drawConfidenceChart();
  drawTimeSeriesChart();
};

const drawPredictionChart = () => {
  if (!chartPie.value) return;
  
  const classLabels = Object.keys(summaryCounts.value).filter(k => k !== 'Total' && summaryCounts.value[k] > 0);
  const classData = classLabels.map(k => summaryCounts.value[k]);
  
  pieChart?.destroy();
  pieChart = new Chart(chartPie.value, {
    type: chartType.value,
    data: {
      labels: classLabels,
      datasets: [{
        data: classData,
        backgroundColor: [
          '#10b981', '#f97316', '#6366f1', '#eab308', 
          '#ef4444', '#9ca3af', '#a855f7', '#06b6d4'
        ],
        borderWidth: 2,
        borderColor: '#ffffff'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            padding: 20,
            usePointStyle: true
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const percentage = ((context.parsed / summaryCounts.value.Total) * 100).toFixed(1);
              return `${context.label}: ${context.parsed} (${percentage}%)`;
            }
          }
        }
      }
    }
  });
};

const drawModelChart = () => {
  if (!chartBar.value) return;
  
  const modelLabels = Object.keys(modelUsage.value);
  const modelData = Object.values(modelUsage.value);
  
  barChart?.destroy();
  barChart = new Chart(chartBar.value, {
    type: 'bar',
    data: {
      labels: modelLabels.map(label => `Model ${label.toUpperCase()}`),
      datasets: [{
        label: 'Scans per Model',
        data: modelData,
        backgroundColor: '#3b82f6',
        borderColor: '#1d4ed8',
        borderWidth: 1,
        borderRadius: 8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1
          }
        }
      }
    }
  });
};

const drawConfidenceChart = () => {
  if (!chartConfidence.value) return;
  
  const confidenceRanges = {
    '0-20%': 0,
    '21-40%': 0,
    '41-60%': 0,
    '61-80%': 0,
    '81-100%': 0
  };
  
  filteredData.value.forEach(item => {
    const confidence = item.confidence * 100;
    if (confidence <= 20) confidenceRanges['0-20%']++;
    else if (confidence <= 40) confidenceRanges['21-40%']++;
    else if (confidence <= 60) confidenceRanges['41-60%']++;
    else if (confidence <= 80) confidenceRanges['61-80%']++;
    else confidenceRanges['81-100%']++;
  });
  
  confidenceChart?.destroy();
  confidenceChart = new Chart(chartConfidence.value, {
    type: 'bar',
    data: {
      labels: Object.keys(confidenceRanges),
      datasets: [{
        label: 'Number of Predictions',
        data: Object.values(confidenceRanges),
        backgroundColor: [
          '#ef4444', '#f97316', '#eab308', '#22c55e', '#10b981'
        ],
        borderWidth: 1,
        borderRadius: 8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1
          }
        }
      }
    }
  });
};

const drawTimeSeriesChart = () => {
  if (!chartTimeSeries.value) return;
  
  const dailyData = {};
  
  filteredData.value.forEach(item => {
    const date = item.createdAt?.toDate?.()?.toDateString();
    if (date) {
      dailyData[date] = (dailyData[date] || 0) + 1;
    }
  });
  
  const sortedDates = Object.keys(dailyData).sort((a, b) => new Date(a) - new Date(b));
  const counts = sortedDates.map(date => dailyData[date]);
  
  timeSeriesChart?.destroy();
  timeSeriesChart = new Chart(chartTimeSeries.value, {
    type: 'line',
    data: {
      labels: sortedDates.map(date => new Date(date).toLocaleDateString()),
      datasets: [{
        label: 'Daily Analyses',
        data: counts,
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1
          }
        }
      }
    }
  });
};

const getEmojiForLabel = (label) => {
  const emojiMap = {
    'Total': '📊',
    'Healthy': '✅',
    'Bacterial': '🦠',
    'Fungal': '🍄',
    'Mosaic Virus': '🧬',
    'Nutrient Deficiency': '⚠️',
    'Not Lettuce': '🚫',
    'Cannot Classify': '❓'
  };
  return emojiMap[label] || '📌';
};

const getConfidenceColor = (confidence) => {
  const score = confidence * 100;
  if (score >= 80) return 'bg-green-500';
  if (score >= 60) return 'bg-yellow-500';
  if (score >= 40) return 'bg-orange-500';
  return 'bg-red-500';
};

const formatDate = (timestamp) => {
  if (!timestamp?.toDate) return 'N/A';
  return timestamp.toDate().toLocaleString();
};

const clearFilters = () => {
  startDate.value = '';
  endDate.value = '';
  modelFilter.value = '';
  predictionFilter.value = '';
  minConfidence.value = 0;
  sortBy.value = 'createdAt';
  currentPage.value = 1;
};

// const deleteRecord = async (id) => {
//   if (!confirm('Are you sure you want to delete this record?')) return;
  
//   try {
//     await deleteDoc(doc(db, 'analysisHistory', id));
//     await loadAllAnalysis();
//     showToast('Record deleted successfully!', 'bg-green-500');
//   } catch (error) {
//     console.error('Error deleting record:', error);
//     showToast('Failed to delete record', 'bg-red-500');
//   }
// };

const exportToCSV = () => {
  const headers = [
    'Prediction', 'Confidence', 'Model Used', 
    'Timestamp', 'Class Probabilities'
  ];
  
  const rows = filteredData.value.map(item => [
    item.prediction,
    (item.confidence * 100).toFixed(2) + '%',
    item.modelUsed || 'v2',
    item.createdAt?.toDate().toLocaleString() || '',
    JSON.stringify(item.classProbabilities || {})
  ]);
  
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `EcoMist_Analytics_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  showToast('CSV exported successfully!', 'bg-green-500');
};

const exportToPDF = async () => {
  loading.value = true;
  
  try {
    const pdf = new jsPDF('p', 'mm', 'a4');
    let y = 20;
    
    // Header
    pdf.setFontSize(20);
    pdf.text('EcoMist Admin Analytics Report', 14, y);
    y += 15;
    
    pdf.setFontSize(12);
    pdf.text(`Generated on: ${new Date().toLocaleString()}`, 14, y);
    y += 10;
    pdf.text(`Total Records: ${filteredData.value.length}`, 14, y);
    y += 15;
    
    // Summary
    pdf.setFontSize(16);
    pdf.text('Summary Statistics', 14, y);
    y += 10;
    
    pdf.setFontSize(12);
    Object.entries(summaryCounts.value).forEach(([k, v]) => {
      pdf.text(`${k}: ${v}`, 14, y += 7);
    });
    
    y += 15;
    
    // Add charts
    const addChartToPDF = async (canvasEl, title) => {
      if (!canvasEl) return;
      
      const canvas = await html2canvas(canvasEl, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      
      if (y > 200) {
        pdf.addPage();
        y = 20;
      }
      
      pdf.setFontSize(14);
      pdf.text(title, 14, y);
      y += 10;
      pdf.addImage(imgData, 'PNG', 14, y, 180, 90);
      y += 100;
    };
    
    await nextTick();
    await addChartToPDF(chartPie.value, 'Prediction Distribution');
    await addChartToPDF(chartBar.value, 'Model Usage');
    await addChartToPDF(chartConfidence.value, 'Confidence Distribution');
    await addChartToPDF(chartTimeSeries.value, 'Analysis Trends');
    
    pdf.save(`EcoMist_Analytics_Report_${new Date().toISOString().split('T')[0]}.pdf`);
    showToast('PDF exported successfully!', 'bg-green-500');
  } catch (error) {
    console.error('Error exporting PDF:', error);
    showToast('Failed to export PDF', 'bg-red-500');
  } finally {
    loading.value = false;
  }
};

const exportToJSON = () => {
  const exportData = {
    metadata: {
      exportDate: new Date().toISOString(),
      totalRecords: filteredData.value.length,
      filters: {
        startDate: startDate.value,
        endDate: endDate.value,
        modelFilter: modelFilter.value,
        predictionFilter: predictionFilter.value,
        minConfidence: minConfidence.value
      }
    },
    summary: summaryCounts.value,
    modelUsage: modelUsage.value,
    data: filteredData.value
  };
  
  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `EcoMist_Analytics_${new Date().toISOString().split('T')[0]}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  showToast('JSON exported successfully!', 'bg-green-500');
};

const generateReport = async () => {
  loading.value = true;
  
  try {
    // Generate comprehensive report with all formats
    await Promise.all([
      exportToCSV(),
      exportToPDF(),
      exportToJSON()
    ]);
    
    showToast('Full report generated successfully!', 'bg-green-500');
  } catch (error) {
    console.error('Error generating report:', error);
    showToast('Failed to generate full report', 'bg-red-500');
  } finally {
    loading.value = false;
  }
};

// Watchers
watch([startDate, endDate, modelFilter, predictionFilter, minConfidence, sortBy], () => {
  currentPage.value = 1;
  computeSummary();
});

watch(chartType, () => {
  drawPredictionChart();
});

watch(recordsPerPage, () => {
  currentPage.value = 1;
});

// Lifecycle
onMounted(() => {
  loadAllAnalysis();
});
const showViewModal = ref(false);
const showDeleteModal = ref(false);
const selectedItem = ref(null);
const itemToDeleteId = ref(null);

const viewDetails = (item) => {
  selectedItem.value = item;
  showViewModal.value = true;
};

const closeViewModal = () => {
  selectedItem.value = null;
  showViewModal.value = false;
};

const deleteRecord = (id) => {
  itemToDeleteId.value = id;
  showDeleteModal.value = true;
};

const closeDeleteModal = () => {
  itemToDeleteId.value = null;
  showDeleteModal.value = false;
};

const confirmDelete = async () => {
  if (!itemToDeleteId.value) return;

  try {
    await deleteDoc(doc(db, 'analysisHistory', itemToDeleteId.value));
    await loadAllAnalysis();
    showToast('Record deleted successfully!', 'bg-green-500');
  } catch (error) {
    console.error('Error deleting record:', error);
    showToast('Failed to delete record', 'bg-red-500');
  } finally {
    itemToDeleteId.value = null;
    showDeleteModal.value = false;
  }
};

</script>

<style scoped>
canvas {
  max-width: 100%;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Smooth transitions */
* {
  transition-property: color, background-color, border-color, opacity, transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

/* Focus styles for accessibility */
button:focus,
input:focus,
select:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* Loading animation */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>